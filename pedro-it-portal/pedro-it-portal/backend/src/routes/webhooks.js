import { Router } from 'express';
import prisma from '../config/database.js';
import stripe from '../config/stripe.js';

const router = Router();

// POST /api/webhooks/stripe - Handle Stripe webhooks
router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      
      if (session.metadata?.invoiceId) {
        await prisma.invoice.update({
          where: { id: session.metadata.invoiceId },
          data: {
            status: 'PAID',
            paidAt: new Date(),
            stripeId: session.payment_intent
          }
        });
        console.log(`Invoice ${session.metadata.invoiceId} marked as paid`);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.log(`Payment failed: ${paymentIntent.id}`);
      // Could send notification to admin here
      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      console.log(`Subscription ${event.type}: ${subscription.id}`);
      // Handle subscription changes if you add recurring billing
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      console.log(`Subscription cancelled: ${subscription.id}`);
      // Handle subscription cancellation
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

export default router;
