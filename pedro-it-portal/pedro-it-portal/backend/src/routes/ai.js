import { Router } from 'express';
import prisma from '../config/database.js';
import anthropic, { getSystemPrompt } from '../config/ai.js';
import { authenticate } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limit for AI chat (10 messages per minute per user)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: { error: 'Too many messages. Please wait a moment.' }
});

router.use(authenticate);

// POST /api/ai/chat - Send message to AI
router.post('/chat', aiLimiter, async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message too long (max 2000 characters)' });
    }

    // Get client context
    const client = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        services: {
          where: { status: 'ACTIVE' },
          include: { service: true }
        },
        tickets: {
          where: { status: { in: ['OPEN', 'IN_PROGRESS'] } }
        },
        invoices: {
          where: { status: 'PENDING' }
        }
      }
    });

    const clientContext = {
      ...client,
      openTickets: client.tickets.length,
      pendingInvoices: client.invoices.length
    };

    // Get recent chat history for context
    const recentMessages = await prisma.chatMessage.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Build conversation history (reversed to chronological order)
    const conversationHistory = recentMessages.reverse().map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Add current message
    conversationHistory.push({
      role: 'user',
      content: message
    });

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: getSystemPrompt(clientContext),
      messages: conversationHistory
    });

    const assistantMessage = response.content[0].text;

    // Save messages to database
    await prisma.chatMessage.createMany({
      data: [
        { userId: req.user.id, role: 'user', content: message },
        { userId: req.user.id, role: 'assistant', content: assistantMessage }
      ]
    });

    res.json({
      message: assistantMessage,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens
      }
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    
    if (error.status === 429) {
      return res.status(429).json({ error: 'AI service rate limited. Please try again in a moment.' });
    }
    
    next(error);
  }
});

// GET /api/ai/history - Get chat history
router.get('/history', async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const [messages, total] = await Promise.all([
      prisma.chatMessage.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      }),
      prisma.chatMessage.count({
        where: { userId: req.user.id }
      })
    ]);

    res.json({
      messages: messages.reverse(), // Return in chronological order
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

// DELETE /api/ai/history - Clear chat history
router.delete('/history', async (req, res, next) => {
  try {
    await prisma.chatMessage.deleteMany({
      where: { userId: req.user.id }
    });

    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    next(error);
  }
});

export default router;
