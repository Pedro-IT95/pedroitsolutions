import { Router } from 'express';
import prisma from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/services - List all services (public)
router.get('/', async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    res.json({ services });
  } catch (error) {
    next(error);
  }
});

// GET /api/services/my - Get client's active services
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const clientServices = await prisma.clientService.findMany({
      where: { 
        userId: req.user.id,
        status: 'ACTIVE'
      },
      include: {
        service: true
      },
      orderBy: { startDate: 'desc' }
    });

    res.json({ services: clientServices });
  } catch (error) {
    next(error);
  }
});

// GET /api/services/:id - Get service details
router.get('/:id', async (req, res, next) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ service });
  } catch (error) {
    next(error);
  }
});

// POST /api/services - Create service (admin only)
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { name, description, priceType, price, features } = req.body;

    if (!name || !description || !priceType || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        priceType,
        price,
        features: features || []
      }
    });

    res.status(201).json({ service });
  } catch (error) {
    next(error);
  }
});

// PUT /api/services/:id - Update service (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { name, description, priceType, price, features, isActive } = req.body;

    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(priceType && { priceType }),
        ...(price !== undefined && { price }),
        ...(features && { features }),
        ...(isActive !== undefined && { isActive })
      }
    });

    res.json({ service });
  } catch (error) {
    next(error);
  }
});

// POST /api/services/:id/assign - Assign service to client (admin only)
router.post('/:id/assign', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { userId, notes } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const service = await prisma.service.findUnique({
      where: { id: req.params.id }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already assigned
    const existing = await prisma.clientService.findUnique({
      where: {
        userId_serviceId: {
          userId,
          serviceId: req.params.id
        }
      }
    });

    if (existing && existing.status === 'ACTIVE') {
      return res.status(400).json({ error: 'Service already assigned to this client' });
    }

    const clientService = await prisma.clientService.upsert({
      where: {
        userId_serviceId: {
          userId,
          serviceId: req.params.id
        }
      },
      create: {
        userId,
        serviceId: req.params.id,
        notes
      },
      update: {
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: null,
        notes
      },
      include: {
        service: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json({ clientService });
  } catch (error) {
    next(error);
  }
});

// PUT /api/services/client/:id - Update client service status (admin only)
router.put('/client/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const clientService = await prisma.clientService.update({
      where: { id: req.params.id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(status === 'CANCELLED' && { endDate: new Date() })
      },
      include: {
        service: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json({ clientService });
  } catch (error) {
    next(error);
  }
});

// GET /api/services/admin/clients - Get all client services (admin only)
router.get('/admin/clients', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.query;

    const clientServices = await prisma.clientService.findMany({
      where: {
        ...(status && { status })
      },
      include: {
        service: true,
        user: {
          select: { id: true, name: true, email: true, company: true }
        }
      },
      orderBy: { startDate: 'desc' }
    });

    res.json({ clientServices });
  } catch (error) {
    next(error);
  }
});

export default router;
