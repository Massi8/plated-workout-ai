# Production Checklist

Complete checklist before going live with real users and payments.

## Phase 1: Core Functionality (Week 1)

### Frontend
- [ ] All pages render without errors
- [ ] No console errors in browser
- [ ] Mobile responsive (test on iPhone, Android)
- [ ] Accessibility: keyboard navigation works
- [ ] Copy/content reviewed for typos
- [ ] Images optimized for web
- [ ] Meta tags updated (title, description, OG image)

### Backend
- [ ] All API routes tested with Postman
- [ ] Error handling returns proper status codes
- [ ] Rate limiting implemented on public routes
- [ ] Input validation on all endpoints
- [ ] CORS headers correct (no overly permissive settings)
- [ ] Request logging enabled

### Database (Upstash Redis)
- [ ] Connection tested from production
- [ ] Backup automation enabled
- [ ] Data retention policies set
- [ ] Monitoring alerts configured

### AI Integration (Anthropic Claude)
- [ ] Claude model tested with various inputs
- [ ] Prompt injection handling added
- [ ] Token usage monitored
- [ ] Fallback response prepared for API failures
- [ ] Rate limiting per user implemented

---

## Phase 2: Authentication & Security (Week 1)

### Password Security
- [ ] **NOT plaintext** — implement bcrypt hashing
- [ ] Password validation: min 8 chars, complexity rules
- [ ] Password reset flow implemented
- [ ] Session timeout (30 min) implemented
- [ ] "Remember me" uses secure tokens

### API Security
- [ ] All endpoints behind authentication check
- [ ] JWT or session tokens implement expiry
- [ ] CSRF tokens on state-changing requests
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (input sanitization, CSP headers)
- [ ] Rate limiting on login (5 attempts → 15 min lockout)

### Infrastructure
- [ ] HTTPS enforced everywhere
- [ ] Security headers set (Strict-Transport-Security, etc.)
- [ ] Environment variables never logged
- [ ] Secrets stored in Vercel (not `.env` file)
- [ ] API keys rotated every 90 days

---

## Phase 3: Payments & Billing (Week 2)

### Stripe Configuration
- [ ] Live API keys generated (not test keys)
- [ ] Webhook endpoint validated and secure
- [ ] Webhook signature verification implemented
- [ ] PCI DSS compliance verified (Stripe hosted)
- [ ] Test subscription created and verified
- [ ] Failed payment handling implemented
- [ ] Refund policy documented

### Subscription Management
- [ ] User tier updates correctly from webhook
- [ ] Pro features gate-checked on every request
- [ ] Subscription cancellation works
- [ ] Billing portal accessible
- [ ] Invoice emails sent correctly
- [ ] Grace period for failed payments (if applicable)

### Testing
- [ ] Test subscription with card `4242 4242 4242 4242`
- [ ] Test declined payment with card `4000 0000 0000 0002`
- [ ] Verify user tier changes after successful charge
- [ ] Verify user tier reverts after cancellation
- [ ] Check webhook re-delivery works

---

## Phase 4: Data & Privacy (Week 2)

### GDPR Compliance
- [ ] Privacy policy drafted and published
- [ ] Data retention policy (how long data kept)
- [ ] User can export their data ("right to portability")
- [ ] User can delete their account ("right to erasure")
- [ ] Cookie consent banner (if needed)
- [ ] Terms of service drafted

### Data Security
- [ ] No personal data logged to console
- [ ] Sensitive data (passwords, API keys) never stored plaintext
- [ ] Database backups encrypted
- [ ] Backup retention: 30 days minimum
- [ ] Access logs kept for audit
- [ ] Regular penetration testing planned

### Email Communications
- [ ] Welcome email implemented
- [ ] Password reset email implemented
- [ ] Subscription confirmation email implemented
- [ ] Unsubscribe link on all emails
- [ ] Email templates tested in multiple clients

---

## Phase 5: Monitoring & Observability (Week 2)

### Error Tracking
- [ ] Sentry (or equivalent) configured
- [ ] Error alerts sent to email/Slack
- [ ] Critical errors get immediate notification
- [ ] Error logs don't expose user data
- [ ] Stack traces reviewed for security info disclosure

### Performance Monitoring
- [ ] Vercel Analytics enabled
- [ ] API response times tracked
- [ ] Database query performance monitored
- [ ] Alerts for high latency (>1s)
- [ ] Upstash Redis commands monitored

### Usage Tracking
- [ ] User sign-ups tracked
- [ ] Feature usage tracked (plan generations, etc.)
- [ ] Payment success/failure rate tracked
- [ ] Daily/weekly dashboards created
- [ ] Anomaly detection alerts set

### Logging
- [ ] Request logs kept (auth, API calls)
- [ ] Event logs (signup, payment, errors)
- [ ] Log retention: 90 days minimum
- [ ] Logs searchable and indexed
- [ ] No sensitive data in logs

---

## Phase 6: Documentation (Week 2)

### Code Documentation
- [ ] README.md complete with setup instructions
- [ ] API endpoints documented (OpenAPI/Swagger)
- [ ] Environment variables documented
- [ ] Key decisions documented in code comments
- [ ] Deployment guide written (DEPLOYMENT.md)

### User Documentation
- [ ] FAQ page created
- [ ] Contact/support email active
- [ ] Onboarding email sequence drafted
- [ ] Help center articles written
- [ ] Video tutorials (optional)

---

## Phase 7: Testing (Week 3)

### Functional Testing
- [ ] Sign up → Generate plan → Pro upgrade → Complete
- [ ] Payment flow: add card, charge, verify subscription
- [ ] Cancellation flow: delete account, confirm data erasure
- [ ] Plan regeneration works
- [ ] Workout logging and dashboard work
- [ ] Pro features visible after upgrade

### Edge Cases
- [ ] User signs up with duplicate email
- [ ] User tries to log in with wrong password
- [ ] Webhook arrives before redirect from Stripe
- [ ] Redis connection drops mid-request
- [ ] Claude API rate limit hit
- [ ] Payment fails mid-session

### Browser/Device Testing
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Load Testing
- [ ] Simulate 100 concurrent users
- [ ] Verify no timeouts or 500 errors
- [ ] Check Redis connection pool
- [ ] Monitor memory usage

---

## Phase 8: Deployment & Launch (Week 3)

### Pre-Launch
- [ ] Domain connected and HTTPS working
- [ ] All environment variables set in Vercel
- [ ] Database backups configured and tested
- [ ] Monitoring and alerts active
- [ ] Support email monitored
- [ ] Status page prepared (optional)

### Launch Day
- [ ] Create backup of all data
- [ ] Test full flow one final time
- [ ] Monitor error logs for first hour
- [ ] Be available for user support
- [ ] Share launch announcement (Twitter, email list, etc.)

### Post-Launch (First Week)
- [ ] Monitor error rate daily
- [ ] Check payment processing for issues
- [ ] Respond to user feedback promptly
- [ ] Fix any critical bugs immediately
- [ ] Gather user feedback via survey/interviews

---

## Phase 9: Performance Optimization

### API Optimization
- [ ] Cache Claude responses (30 min TTL)
- [ ] Compress API responses (gzip)
- [ ] Implement pagination for lists
- [ ] Add database indexes on frequent queries
- [ ] Consider CDN for static assets (Vercel default)

### Frontend Optimization
- [ ] Lazy load images
- [ ] Minify CSS/JS (Vercel does this)
- [ ] Remove unused dependencies
- [ ] Audit for accessibility issues (axe DevTools)
- [ ] Measure Core Web Vitals

---

## Phase 10: Ongoing Maintenance

### Weekly
- [ ] Check error logs and Sentry
- [ ] Review payment success rate
- [ ] Monitor Upstash Redis usage
- [ ] Check Anthropic API usage

### Monthly
- [ ] Review user feedback
- [ ] Update dependencies (security patches)
- [ ] Rotate API keys
- [ ] Analyze usage trends
- [ ] Plan next features

### Quarterly
- [ ] Full security audit
- [ ] Performance benchmark
- [ ] User survey/interviews
- [ ] Renewal of certifications (if needed)
- [ ] Update documentation

---

## Sign-Off Checklist

Before declaring "ready to launch":

- [ ] All tests passing
- [ ] No critical bugs open
- [ ] Security audit completed
- [ ] Performance acceptable (<1s page load)
- [ ] Error rate < 0.1%
- [ ] Support processes in place
- [ ] Monitoring and alerting active
- [ ] Documentation complete
- [ ] Team trained and ready

---

## Quick Reference: Critical Items

**MUST HAVE before launch:**
1. ✅ HTTPS enforced
2. ✅ Passwords hashed (bcrypt)
3. ✅ Stripe webhook validated
4. ✅ Rate limiting on auth endpoints
5. ✅ Error logging (Sentry or similar)
6. ✅ Privacy policy + Terms
7. ✅ Support email active
8. ✅ Monitoring alerts configured

**NICE TO HAVE before launch:**
- Security headers
- API documentation
- Help center
- Status page
- Advanced analytics

---

## Useful Tools

- **Security:** OWASP Top 10, Snyk, npm audit
- **Performance:** Lighthouse, WebPageTest
- **Monitoring:** Sentry, DataDog, New Relic
- **Testing:** Postman, Jest, Cypress
- **Code Quality:** ESLint, Prettier
- **Accessibility:** axe DevTools, WAVE

---

**Last Updated:** 2024
**Version:** 1.0
