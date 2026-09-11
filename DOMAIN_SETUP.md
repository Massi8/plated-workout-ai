# Domain Setup Guide

Quick reference for connecting a custom domain to your Plated deployment.

## Option 1: Using Vercel Domains (Easiest)

### 1. Purchase domain through Vercel

```
Dashboard → Settings → Domains → Add → Buy New Domain
```

- Select domain (e.g., `plated.app`)
- Add to cart
- Proceed with Vercel payment
- Domain auto-configures (no DNS changes needed)

**Cost:** Usually $10-15/year

---

## Option 2: Using External Registrar (Namecheap, GoDaddy, etc.)

### Step 1: Get Vercel Nameservers

1. Go to Vercel Dashboard
2. Select **plated-workout-ai** project
3. Click **Settings** → **Domains**
4. Click **Add Domain**
5. Vercel will display 4 nameservers:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
ns3.vercel-dns.com
ns4.vercel-dns.com
```

### Step 2: Update Registrar

#### Namecheap

1. Log in to Namecheap.com
2. Go to **Domain List**
3. Click **Manage** next to your domain
4. Click **Nameservers** tab
5. Select **Custom DNS**
6. Enter Vercel's 4 nameservers
7. Click **Save Changes**

#### GoDaddy

1. Log in to GoDaddy.com
2. Go to **My Products**
3. Click your domain
4. Click **DNS**
5. Find **Nameservers** section
6. Click **Change Nameservers**
7. Enter Vercel's 4 nameservers
8. Click **Save**

#### Google Domains

1. Log in to Google Domains
2. Click your domain
3. Click **DNS** in left sidebar
4. Scroll to **Nameservers**
5. Select **Use custom nameservers**
6. Enter Vercel's 4 nameservers
7. Click **Save**

### Step 3: Wait for Propagation

DNS changes take 24-48 hours to propagate globally.

**Check status:**
```bash
nslookup plated.app
# Should show Vercel's IP

dig plated.app ns
# Should show Vercel nameservers
```

---

## Option 3: Using Route 53 (AWS)

### 1. Create Hosted Zone

```bash
AWS Route53 → Hosted Zones → Create → plated.app
```

Copy the 4 nameservers provided by Route53.

### 2. Update Registrar

Add Route53 nameservers to your registrar (same process as above).

### 3. Add DNS Records

In Route53, create:

```
Name: plated.app
Type: A
Value: plated.vercel.app (Vercel alias)
Alias: Yes
```

Or add Vercel nameservers directly in Route53 if using CNAME.

---

## Step 4: Connect to Vercel

1. Vercel Dashboard → **Settings** → **Domains**
2. Enter your domain: `plated.app`
3. Click **Add**
4. Vercel will verify DNS
5. Once verified, domain is live

---

## Verify Domain is Working

```bash
# Check DNS resolution
nslookup plated.app

# Should show Vercel IP address

# Check in browser
https://plated.app
```

---

## Common Issues & Fixes

### "Domain not found"

**Cause:** DNS not propagated or nameservers wrong

**Fix:**
1. Verify nameservers at registrar are exactly as Vercel shows
2. Wait 24-48 hours
3. Try different DNS checker: https://mxtoolbox.com/nslookup

### "502 Bad Gateway"

**Cause:** Domain connected but Vercel deployment failing

**Fix:**
1. Check Vercel deployment status (green checkmark)
2. Redeploy if failed
3. Wait for build to complete
4. Try again

### "Redirect loop"

**Cause:** HTTPS redirect misconfigured

**Fix:**
1. Vercel Dashboard → **Settings** → **Git**
2. Find **Redirect** → change `http://` to `https://`
3. Redeploy

---

## SSL/HTTPS Certificate

Vercel automatically provisions free SSL certificates via Let's Encrypt.

- ✅ Automatic renewal
- ✅ No action needed
- ✅ Supports wildcard subdomains

**Check certificate:**
```bash
curl -I https://plated.app
# Should show 200 OK with HTTPS
```

---

## Add Subdomains (Optional)

For API subdomain: `api.plated.app`

1. Vercel Dashboard → **Settings** → **Domains**
2. Add domain: `api.plated.app`
3. Route to same deployment

---

## Configure Production Environment

Once domain is live, update Vercel:

```
VERCEL_URL = https://plated.app
```

This value is used in:
- Email links
- Redirect URLs
- Stripe checkout success/cancel URLs

---

## Email (Optional)

To add email at your domain (e.g., hello@plated.app):

### Using Vercel + Sendgrid

1. Set up Sendgrid account
2. Add MX records (from Sendgrid dashboard) to your DNS
3. Verify domain in Sendgrid
4. Send from hello@plated.app

### MX Records Example

```
Host: plated.app
Type: MX
Priority: 10
Value: mx.sendgrid.net
```

---

## Final Checklist

- [ ] Domain registered and accessible
- [ ] Nameservers pointing to Vercel (or AWS Route53)
- [ ] DNS propagated globally (24-48 hours)
- [ ] HTTPS working (padlock icon)
- [ ] Vercel shows green checkmark on deployment
- [ ] `VERCEL_URL` environment variable set
- [ ] Test all features working at `https://plated.app`
- [ ] SSL certificate auto-renewed (Vercel handles this)

---

## Reference

| Registrar | Nameserver Link | Time to Update |
|-----------|-----------------|----------------|
| Namecheap | Domain → Manage → Nameservers | 24 hours |
| GoDaddy | My Products → DNS | 24 hours |
| Google Domains | Domain → DNS | 15 min-1 hour |
| Route 53 (AWS) | Hosted Zones → NS records | 5-30 min |
| Vercel Domains | Auto-configured | Immediate |

---

## Need Help?

- Vercel Domain Guide: https://vercel.com/docs/concepts/projects/domains
- Namecheap Nameserver Guide: https://www.namecheap.com/support/knowledgebase/
- GoDaddy DNS Guide: https://www.godaddy.com/help
- DNS Propagation Checker: https://whatsmydns.net/
