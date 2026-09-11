# Deployment Guide — Plated Workout AI

Complete step-by-step instructions to deploy Plated to production with a custom domain.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Domain Setup](#domain-setup)
3. [Vercel Deployment](#vercel-deployment)
4. [Third-Party Services](#third-party-services)
5. [Post-Deployment](#post-deployment)
6. [Monitoring](#monitoring)

---

## Prerequisites

You'll need accounts for:

- **GitHub** — for code hosting
- **Vercel** — for deployment (free tier sufficient)
- **Anthropic** — for Claude API
- **Upstash** — for Redis database (free tier: 10,000 commands/day)
- **Stripe** — for payments (test and live mode)
- **Domain Registrar** — Namecheap, GoDaddy, etc. (optional but recommended)

### Estimated Setup Time

- **Domain + DNS**: 15 minutes
- **Vercel**: 10 minutes
- **Anthropic API**: 5 minutes
- **Upstash Redis**: 10 minutes
- **Stripe**: 20 minutes
- **Total**: ~60 minutes

---

## Domain Setup

### Step 1: Register a Domain (Optional)

If you don't have a domain, buy one:

**Recommended registrars:**
- [Namecheap](https://www.namecheap.com/) — cheap, reliable
- [Google Domains](https://domains.google/)
- [Vercel Domains](https://vercel.com/domains) — integrates directly with Vercel

**Example:** `plated.app` or `plated-ai.com`

### Step 2: Connect Domain to Vercel

Once you have a domain, connect it to Vercel:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **plated-workout-ai** project
3. Click **Settings** → **Domains**
4. Enter your domain name (e.g., `plated.app`)
5. Click **Add**

**Vercel will show you nameservers to add to your registrar:**

```
ns1.vercel-dns.com
ns2.vercel-dns.com
ns3.vercel-dns.com
ns4.vercel-dns.com
```

### Step 3: Update Registrar Nameservers

**If using Vercel Domains:** (automatic, skip this)

**If using your own registrar** (Namecheap, GoDaddy, etc.):

1. Log into your registrar's dashboard
2. Find **DNS** or **Nameservers** settings
3. Replace default nameservers with Vercel's four nameservers above
4. Save changes
5. Wait 24-48 hours for DNS propagation

**Verify propagation:**
```bash
nslookup plated.app
# Should resolve to your Vercel IP
```

### Step 4: Set Up Environment Variable for Domain

Once domain is confirmed, add to Vercel:

```
VERCEL_URL=https://plated.app
```

---

## Vercel Deployment

### Step 1: Push Code to GitHub

```bash
cd plated-workout-ai
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import the **plated-workout-ai** repository
4. Vercel will auto-detect Next.js settings
5. Click **Deploy**

### Step 3: Add Environment Variables

In Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add each variable from `.env.example`:

```
ANTHROPIC_API_KEY = sk_...
UPSTASH_REDIS_REST_URL = https://....upstash.io
UPSTASH_REDIS_REST_TOKEN = ...
STRIPE_PUBLIC_KEY = pk_...
STRIPE_SECRET_KEY = sk_...
STRIPE_WEBHOOK_SECRET = whsec_...
STRIPE_PRICE_MONTHLY = price_...
STRIPE_PRICE_ANNUAL = price_...
VERCEL_URL = https://plated.app
```

3. Click **Save and Deploy**

### Step 4: Monitor First Deployment

1. Go to **Deployments** tab
2. Watch the build log
3. Once green checkmark appears, your app is live
4. Visit `https://plated.app` in your browser

---

## Third-Party Services

### Anthropic Claude API

#### 1. Create Account

- Go to [console.anthropic.com](https://console.anthropic.com)
- Sign up with your email
- Verify email

#### 2. Generate API Key

1. Click **API Keys** in sidebar
2. Click **Create Key**
3. Copy the key (starts with `sk_...`)
4. Add to Vercel as `ANTHROPIC_API_KEY`

#### 3. Set Up Billing

- Click **Billing** in sidebar
- Add payment method
- Set spending limit (e.g., $100/month for safety)
- Monitor usage in **Usage** tab

**Pricing:** ~$0.003 per 1K input tokens, ~$0.015 per 1K output tokens

---

### Upstash Redis

#### 1. Create Account

- Go to [console.upstash.com](https://console.upstash.com)
- Sign up with GitHub or email

#### 2. Create Redis Database

1. Click **Create Database**
2. Choose region (pick closest to your users)
3. Select **Free** tier
4. Click **Create**

#### 3. Get Connection Details

1. Click your database name
2. Copy **REST API URL** and **REST API Token**
3. Add to Vercel:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

**Free Tier Limits:**
- 10,000 commands/day
- 256 MB storage
- Sufficient for MVP (supports ~100 users/day)

---

### Stripe Setup

#### 1. Create Account

- Go to [stripe.com](https://stripe.com)
- Sign up with business info
- Complete verification (ID + address)

#### 2. Test Mode Keys

For testing before going live:

1. Go to **Developers** → **API Keys**
2. Toggle **Test mode** (default)
3. Copy **Publishable key** → `STRIPE_PUBLIC_KEY`
4. Copy **Secret key** → `STRIPE_SECRET_KEY`

**Test card numbers:**
```
4242 4242 4242 4242 (successful charge)
4000 0000 0000 0002 (declined)
4000 0025 0000 3155 (requires auth)
```

#### 3. Create Products & Prices

In **Products** section:

**Create Product: "Pro Monthly"**
- Price: €9.99
- Billing period: Monthly
- Copy **Price ID** → `STRIPE_PRICE_MONTHLY`

**Create Product: "Pro Annual"**
- Price: €69.99
- Billing period: Annual
- Copy **Price ID** → `STRIPE_PRICE_ANNUAL`

#### 4. Set Up Webhook

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://plated.app/api/stripe-webhook`
4. Events: Select **all subscription events** + **all invoice events**
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
5. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`
6. Click **Add endpoint**

#### 5. Switch to Live Mode

When ready for real payments:

1. Complete Stripe onboarding
2. Go to **Developers** → **API Keys**
3. Toggle **Live mode** (requires additional verification)
4. Copy live keys to `.env` (separate from test)
5. Redeploy to Vercel

---

## Post-Deployment

### Step 1: Test the Full Flow

**Non-logged-in user:**
- [ ] Can see landing page at `https://plated.app`
- [ ] Can create account
- [ ] Can log in
- [ ] Can answer questionnaire

**Logged-in user:**
- [ ] Claude generates workout plan (~5-10 sec)
- [ ] Plan displays correctly with exercises, sets, reps
- [ ] Can access dashboard
- [ ] Can log workout data

**Pro upgrade:**
- [ ] "Go Pro" button redirects to Stripe checkout
- [ ] Can enter test card `4242 4242 4242 4242`
- [ ] After successful charge, redirected back to app
- [ ] User `tier` changes from `basic` to `pro`
- [ ] Pro features (analytics, nutrition) become visible

### Step 2: Monitor Errors

1. Go to Vercel **Deployments** → **Functions**
2. Set up error alerts (Vercel + email)
3. Monitor first week of traffic
4. Check API logs for errors

### Step 3: Test Payment Webhook

Verify Stripe webhook is firing:

1. Create a test subscription in Vercel logs
2. Check that user record updates to `tier: 'pro'`
3. Verify cancellation downgrades to `tier: 'basic'`

---

## Monitoring

### Vercel Analytics

1. **Deployments** tab — see build status and logs
2. **Functions** tab — monitor API route performance
3. **Logs** — realtime API logs
4. **Analytics** — traffic, performance metrics

### Set Up Alerts

**Vercel:**
- Deploy failures → email alert
- Function errors → Slack webhook
- High latency (>1s) → notification

**Stripe:**
- Failed payments → email
- Suspicious activity → dashboard
- Revenue dashboard → daily summary

### Health Checks

Add this to your monitoring:

```bash
#!/bin/bash
# Check API health daily
curl -X POST https://plated.app/api/generate-plan \
  -H "Content-Type: application/json" \
  -d '{"answers": {...}, "tier": "basic"}'
```

### Database Monitoring (Redis)

1. Go to Upstash console
2. Click your database
3. Check **Commands** and **Network** tabs
4. Set up alerts for:
   - Storage > 200 MB
   - Commands > 8,000/day (approaching 10k limit)

---

## Troubleshooting

### "404 Not Found" on domain

1. Check domain is connected in Vercel settings
2. Verify nameservers at registrar (can take 24-48h)
3. Run `nslookup plated.app` to check DNS propagation
4. Hard refresh browser (Cmd+Shift+R)

### API routes return 500

1. Check Vercel function logs
2. Verify all environment variables are set
3. Test with `curl -X GET https://plated.app/api/user?email=test@example.com`
4. Check Upstash Redis connection

### Stripe webhook not firing

1. Verify webhook URL in Stripe dashboard
2. Check webhook signing secret matches `STRIPE_WEBHOOK_SECRET`
3. Tail Vercel logs: `vercel logs api/stripe-webhook`
4. Test webhook delivery in Stripe dashboard

### Claude API errors

1. Verify `ANTHROPIC_API_KEY` is correct
2. Check Anthropic account has remaining credits
3. Test API with curl:
   ```bash
   curl https://api.anthropic.com/v1/messages \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "content-type: application/json" \
     -d '{"model": "claude-3-5-sonnet-20241022", "max_tokens": 100, "messages": [{"role": "user", "content": "Hi"}]}'
   ```

---

## Security Checklist

- [ ] All API keys stored as Vercel secrets (not in code)
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] CORS headers properly configured
- [ ] Rate limiting added to API routes
- [ ] Input validation on all endpoints
- [ ] Stripe webhook signature verified
- [ ] Password hashing implemented (not plaintext)
- [ ] Database backups enabled (Upstash)
- [ ] Error logs don't expose sensitive data
- [ ] Terms of service + privacy policy added

---

## Scaling

### Free Tier Limits

- **Vercel:** 100 GB bandwidth/month, unlimited functions
- **Upstash:** 10,000 Redis commands/day
- **Anthropic:** Pay-as-you-go (~$0.003-0.015 per request)
- **Stripe:** All features available

### When to Upgrade

**Upstash:**
- Upgrade when approaching 10k commands/day
- Standard plan: $20-100/month

**Vercel Pro:**
- $20/month for priority support + analytics
- Not needed for MVP

**Anthropic:**
- No tier upgrade needed; just pay for usage
- Monitor spending, adjust per-request logic if needed

---

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Set up custom domain
3. ✅ Connect Anthropic, Upstash, Stripe
4. ✅ Test payment flow end-to-end
5. ⬜ Add email verification (optional)
6. ⬜ Set up analytics (Mixpanel, Amplitude)
7. ⬜ Launch marketing site
8. ⬜ Gather user feedback

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Anthropic Docs:** https://docs.anthropic.com
- **Upstash Docs:** https://upstash.com/docs
- **Stripe Docs:** https://stripe.com/docs

**Quick links:**
- Vercel support: support@vercel.com
- Anthropic support: support@anthropic.com
- Stripe support: https://support.stripe.com
