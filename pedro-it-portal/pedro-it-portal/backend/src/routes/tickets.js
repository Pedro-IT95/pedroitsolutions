import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// All ticket routes require authentication
router.use(authenticate);

// Validation schemas
const createTicketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional()
});

const updateTicketSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'WAITING_CLIENT', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional()
});

const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty')
});

// GET /api/tickets - List tickets
router.get('/', async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    
    const where = {
      ...(req.user.role !== 'ADMIN' && { userId: req.user.id }),
      ...(status && { status }),
      ...(priority && { priority })
    };

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, company: true }
          },
          _count: { select: { messages: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      }),
      prisma.ticket.count({ where })
    ]);

    res.json({
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/tickets - Create ticket
router.post('/', async (req, res, next) => {
  try {
    const data = createTicketSchema.parse(req.body);

    const ticket = await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority || 'MEDIUM',
        userId: req.user.id
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json({ ticket });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors 
      });
    }
    next(error);
  }
});

// GET /api/tickets/:id - Get ticket details
router.get('/:id', async (req, res, next) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: { id: true, name: true, email: true, company: true }
        },
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check access
    if (req.user.role !== 'ADMIN' && ticket.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ ticket });
  } catch (error) {
    next(error);
  }
});

// PUT /api/tickets/:id - Update ticket
router.put('/:id', async (req, res, next) => {
  try {
    const data = updateTicketSchema.parse(req.body);

    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Only admin can update status, client can only update their own ticket's priority
    if (req.user.role !== 'ADMIN' && ticket.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Clients can't change status (only admin)
    if (req.user.role !== 'ADMIN' && data.status) {
      delete data.status;
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: req.params.id },
      data: {
        ...data,
        ...(data.status === 'CLOSED' && { closedAt: new Date() })
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json({ ticket: updatedTicket });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors 
      });
    }
    next(error);
  }
});

// POST /api/tickets/:id/messages - Add message to ticket
router.post('/:id/messages', async (req, res, next) => {
  try {
    const data = messageSchema.parse(req.body);

    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (req.user.role !== 'ADMIN' && ticket.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const message = await prisma.ticketMessage.create({
      data: {
        content: data.content,
        isStaff: req.user.role === 'ADMIN',
        ticketId: req.params.id
      }
    });

    // Update ticket status if client responds to waiting ticket
    if (req.user.role !== 'ADMIN' && ticket.status === 'WAITING_CLIENT') {
      await prisma.ticket.update({
        where: { id: req.params.id },
        data: { status: 'IN_PROGRESS' }
      });
    }

    res.status(201).json({ message });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors 
      });
    }
    next(error);
  }
});

// GET /api/tickets/stats - Get ticket statistics (admin only)
router.get('/admin/stats', requireAdmin, async (req, res, next) => {
  try {
    const [total, open, inProgress, resolved] = await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: 'OPEN' } }),
      prisma.ticket.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.ticket.count({ where: { status: 'RESOLVED' } })
    ]);

    res.json({
      stats: { total, open, inProgress, resolved }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
