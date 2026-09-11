# Plated — AI-Powered Workout Planner

A full-stack web application that uses Claude AI to generate personalized training programs based on user inputs. Features subscription management with Stripe and user data persistence with Upstash Redis.

## Features

✨ **AI-Powered Plans** — Claude analyzes your goals, experience, equipment, and schedule to create personalized workout programs

💪 **Workout Tracking** — Log sets, reps, and weights; track personal bests and progress over time

💳 **Pro Subscriptions** — Monthly (€9.99) or annual (€69.99) plans with Stripe payment processing

📊 **Analytics Dashboard** — View workout history, streaks, volume lifted, and achievements

🔐 **Secure Auth** — User accounts with email/password authentication backed by Redis

🎯 **Tier-Based Features** — Basic (free) and Pro tiers with different feature sets

## Tech Stack

- **Frontend** — Vanilla HTML/CSS/JavaScript (single-page app)
- **Backend** — Next.js API routes (serverless)
- **AI** — Anthropic Claude API
- **Database** — Upstash Redis
- **Payments** — Stripe
- **Deployment** — Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- Accounts for: Anthropic, Upstash, Stripe, Vercel

### Local Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/Massi8/plated-workout-ai.git
   cd plated-workout-ai
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your API keys:
   - `ANTHROPIC_API_KEY` from https://console.anthropic.com
   - `UPSTASH_REDIS_REST_URL` and token from https://console.upstash.com
   - `STRIPE_*` keys from https://dashboard.stripe.com

3. **Run locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

### Deploy to Vercel

1. Push to GitHub
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Connect to Vercel
   - Go to [vercel.com](https://vercel.com)
   - Import the repository
   - Add environment variables from `.env.example`
   - Deploy

3. Set up Stripe webhook
   - In Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-domain.com/api/stripe-webhook`
   - Subscribe to: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`, `invoice.payment_succeeded`
   - Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## API Endpoints

### `POST /api/generate-plan`
Generate an AI workout plan
- **Body**: `{ answers: {...}, tier: 'basic' | 'pro' }`
- **Returns**: `{ plan: {...} }`

### `GET/POST /api/user`
Fetch or save user data
- **GET**: `?email=user@example.com` → `{ user: {...} }`
- **POST**: `{ user: {...} }` → `{ success: true }`

### `POST /api/create-checkout-session`
Create Stripe checkout session
- **Body**: `{ email: '...', period: 'monthly' | 'annual' }`
- **Returns**: `{ url: 'https://checkout.stripe.com/...' }`

### `POST /api/create-portal-session`
Create Stripe billing portal
- **Body**: `{ stripeCustomerId: '...' }`
- **Returns**: `{ url: 'https://billing.stripe.com/...' }`

### `POST /api/stripe-webhook`
Stripe webhook handler (automatic)
- Processes subscription events and updates user tier

## Project Structure

```
.
├── api/
│   ├── generate-plan.js         # Claude AI plan generation
│   ├── user.js                  # User CRUD operations
│   ├── create-checkout-session.js # Stripe checkout
│   ├── create-portal-session.js  # Stripe billing portal
│   └── stripe-webhook.js         # Webhook handler
├── public/
│   └── index.html               # Single-page app frontend
├── .env.example                 # Environment variables template
├── package.json
├── vercel.json                  # Vercel deployment config
└── README.md
```

## Key Features Explained

### AI Plan Generation

When users submit their questionnaire, Claude analyzes:
- Training goal (build muscle, lose fat, get stronger, etc.)
- Experience level
- Available training days and session duration
- Equipment access
- Preferred training split
- Exercise dislikes and physical limitations
- Age range

Claude returns a structured JSON plan with exercises, sets, reps, rest times, and progression notes.

**Pro Enhancement**: Claude also includes exercise substitutions and deload guidance for Pro users.

### User Authentication

No password hashing in this demo (use bcrypt in production). User records stored in Redis with email as key:
```
user:{email} → { email, name, password, tier, plan, ... }
```

### Subscription Management

Stripe webhooks automatically update user tier when:
- Subscription created → `tier: 'pro'`
- Subscription deleted → `tier: 'basic'`
- Payment failed → `paymentIssue: true`
- Payment succeeded → `paymentIssue: false`

## Environment Variables

```bash
# Anthropic
ANTHROPIC_API_KEY=sk_...

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://....upstash.io
UPSTASH_REDIS_REST_TOKEN=...

# Stripe
STRIPE_PUBLIC_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_ANNUAL=price_...

# Vercel
VERCEL_URL=https://your-domain.com
```

## Production Checklist

- [ ] Use bcrypt for password hashing
- [ ] Add rate limiting to API routes
- [ ] Enable HTTPS only
- [ ] Add CSRF protection
- [ ] Implement proper error logging (Sentry, etc.)
- [ ] Add unit and integration tests
- [ ] Set up monitoring and alerts
- [ ] Implement database backups (Upstash)
- [ ] Add email verification for signups
- [ ] Add password reset flow
- [ ] Review Stripe compliance (PCI DSS)
- [ ] Add terms of service and privacy policy

## License

MIT

## Support

For issues or questions, open a GitHub issue or contact the team.
