# Zenvixy Security Documentation

## Overview

This document outlines the security measures implemented in Zenvixy and provides guidance for maintaining security in production.

## 🔒 Security Headers

All responses include security headers:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; ...
```

## 🚦 Rate Limiting

### API Routes
- **Checkout Session**: 10 requests/minute/IP
- **Subscription Check**: 30 requests/minute/IP
- **Notification Process**: 5 requests/minute/IP

### Implementation
```typescript
// Simple in-memory rate limiting
// For production, use Redis for distributed rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT = 100;
const RATE_WINDOW = 60 * 1000;
```

## 🛡️ Input Validation

### Email Validation
- Server-side validation using strict regex
- Length limit: 254 characters
- Sanitization: lowercase, trim, escape special chars

### File Names
- Path traversal prevention
- Special character removal
- Safe filename generation for downloads

### API Inputs
- All inputs parsed and validated
- Invalid inputs return 400 Bad Request
- Detailed errors only in development

## 💳 Payment Security (Stripe)

### Webhook Signature Verification
```typescript
// Every webhook is verified using Stripe's signature
const event = stripe.webhooks.constructEvent(
  rawBody,
  signature,
  webhookSecret
);
```

### Idempotency
- Processed events tracked for 24 hours
- Duplicate webhooks return 200 (not error)
- Prevents double-charging

### Secret Management
- Stripe keys stored in environment variables
- Price IDs validated server-side (never from client)
- No sensitive data in client-side code

## 🔑 Authentication & Authorization

### Internal API Key
- Required for cron job endpoints
- Uses timing-safe comparison
- Stored as environment variable

### Stripe Checkout
- Customer email validated
- No promo codes (security measure)
- Billing address collection required

## 📁 File Processing Security

### Client-Side Processing
- All file operations happen in browser
- No files uploaded to server
- Blob URLs revoked after use

### Memory Safety
- Files read via FileReader API
- Processing via Canvas API
- No persistent storage of user files

## 🛠️ Production Checklist

### Environment Variables (Required)
```env
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_ANNUAL=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App
APP_URL=https://zenvixy.com
INTERNAL_API_KEY=your-secure-random-key

# Email
SENDGRID_API_KEY=SG...
FROM_EMAIL=subscriptions@zenvixy.com
```

### Environment Variables (Development Only)
```env
# Never set these in production
STRIPE_SECRET_KEY=sk_test_... (use sk_live_ in production)
```

### Supabase Security
1. Enable Row Level Security (RLS) on all tables
2. Use service role key only server-side
3. Create policies for subscription table:
   ```sql
   -- Users can only read their own subscription
   CREATE POLICY "Users read own subscription"
   ON subscriptions
   FOR SELECT
   USING (auth.email() = email);
   ```

### Stripe Dashboard Settings
1. Enable 3D Secure for additional fraud protection
2. Set up Stripe Radar rules
3. Configure webhook retry policy

### Server Security
1. Use HTTPS only (HSTS header)
2. Keep Node.js and dependencies updated
3. Enable firewall on server
4. Use managed database (Supabase handles security)

## 🚨 Security Incident Response

If you suspect a security incident:

1. **Immediate**: Rotate all API keys
2. **Check**: Review Stripe dashboard for unauthorized charges
3. **Check**: Review Supabase logs for unauthorized access
4. **Notify**: Contact affected users
5. **Document**: Record incident details

## 📞 Reporting Security Issues

Found a security vulnerability? Contact security@zenvixy.com

## 🔄 Security Updates

This document should be reviewed and updated:
- After any infrastructure changes
- Monthly during security audits
- After any security incidents

---

**Last Updated**: March 2024
