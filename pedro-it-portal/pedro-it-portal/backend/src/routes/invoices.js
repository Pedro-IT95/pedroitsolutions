import { Router } from 'express';
import prisma from '../config/database.js';
import stripe from '../config/stripe.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// GET /api/invoices - List invoices
router.get('/', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const where = {
      ...(req.user.role !== 'ADMIN' && { userId: req.user.id }),
      ...(status && { status })
    };

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, company: true }
          },
          items: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      }),
      prisma.invoice.count({ where })
    ]);

    res.json({
      invoices,
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

// GET /api/invoices/:id - Get invoice details
router.get('/:id', async (req, res, next) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: { id: true, name: true, email: true, company: true, phone: true }
        },
        items: true
      }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (req.user.role !== 'ADMIN' && invoice.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ invoice });
  } catch (error) {
    next(error);
  }
});

// POST /api/invoices - Create invoice (admin only)
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { userId, description, dueDate, items } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ error: 'User ID and items are required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate total
    const amount = items.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice), 0
    );

    // Generate invoice number
    const count = await prisma.invoice.count();
    const invoiceNumber = `PIT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        amount,
        description: description || 'Servicios de IT',
        dueDate: new Date(dueDate || Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
        userId,
        items: {
          create: items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice
          }))
        }
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        items: true
      }
    });

    res.status(201).json({ invoice });
  } catch (error) {
    next(error);
  }
});

// POST /api/invoices/:id/pay - Create payment session
router.post('/:id/pay', async (req, res, next) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        items: true
      }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (invoice.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (invoice.status === 'PAID') {
      return res.status(400).json({ error: 'Invoice already paid' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: invoice.user.stripeId,
      payment_method_types: ['card'],
      line_items: invoice.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.description
          },
          unit_amount: Math.round(item.unitPrice * 100) // Stripe uses cents
        },
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/portal/invoices/${invoice.id}?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/portal/invoices/${invoice.id}?canceled=true`,
      metadata: {
        invoiceId: invoice.id
      }
    });

    // Save Stripe session ID
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { stripeId: session.id }
    });

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
});

// PUT /api/invoices/:id - Update invoice (admin only)
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;

    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(status === 'PAID' && { paidAt: new Date() })
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        items: true
      }
    });

    res.json({ invoice });
  } catch (error) {
    next(error);
  }
});

// GET /api/invoices/stats - Invoice statistics
router.get('/admin/stats', requireAdmin, async (req, res, next) => {
  try {
    const [total, pending, paid, overdue] = await Promise.all([
      prisma.invoice.aggregate({ _sum: { amount: true } }),
      prisma.invoice.aggregate({ 
        where: { status: 'PENDING' },
        _sum: { amount: true },
        _count: true
      }),
      prisma.invoice.aggregate({ 
        where: { status: 'PAID' },
        _sum: { amount: true },
        _count: true
      }),
      prisma.invoice.aggregate({ 
        where: { status: 'OVERDUE' },
        _sum: { amount: true },
        _count: true
      })
    ]);

    res.json({
      stats: {
        totalRevenue: total._sum.amount || 0,
        pending: { count: pending._count, amount: pending._sum.amount || 0 },
        paid: { count: paid._count, amount: paid._sum.amount || 0 },
        overdue: { count: overdue._count, amount: overdue._sum.amount || 0 }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
