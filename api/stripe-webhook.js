import { Redis } from '@upstash/redis';
import Stripe from 'stripe';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: {
      raw: { type: 'application/json' },
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

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

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const email = subscription.metadata?.email || subscription.customer_email;
        if (email) {
          const user = await redis.get(`user:${email.toLowerCase()}`);
          if (user) {
            user.tier = 'pro';
            user.stripeCustomerId = subscription.customer;
            user.billingPeriod = subscription.items.data[0].price.type === 'recurring' 
              ? subscription.items.data[0].price.recurring.interval === 'year' ? 'annual' : 'monthly'
              : 'monthly';
            user.subscriptionId = subscription.id;
            await redis.set(`user:${email.toLowerCase()}`, user);
          }
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const email = subscription.metadata?.email || subscription.customer_email;
        if (email) {
          const user = await redis.get(`user:${email.toLowerCase()}`);
          if (user) {
            user.tier = 'basic';
            user.subscriptionId = null;
            await redis.set(`user:${email.toLowerCase()}`, user);
          }
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const email = invoice.customer_email;
        if (email) {
          const user = await redis.get(`user:${email.toLowerCase()}`);
          if (user) {
            user.paymentIssue = true;
            await redis.set(`user:${email.toLowerCase()}`, user);
          }
        }
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const email = invoice.customer_email;
        if (email) {
          const user = await redis.get(`user:${email.toLowerCase()}`);
          if (user) {
            user.paymentIssue = false;
            await redis.set(`user:${email.toLowerCase()}`, user);
          }
        }
        break;
      }
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }

  res.status(200).json({ received: true });
}
