# Zenvixy

> All Your Tools. One Clean Space.

A premium utility web application with 20+ tools across PDF, Image, AI, and Utilities categories. Built with Next.js 14, Tailwind CSS, and deployed on Vercel.

## Features

- **20+ Professional Tools** - PDF compression/merge/split, image resize/compress/background removal, AI caption & bio generation, and utility calculators
- **Privacy-First** - All file processing happens in your browser. Files never leave your device.
- **No Watermarks** - Clean, professional outputs without watermarks
- **Freemium Model** - Free tier with standard quality + Premium ($4.99/mo) for high quality
- **Ad-Supported HD** - Watch an ad to unlock HD quality on free tier
- **Dual Payment Gateways** - Razorpay for India, Stripe for international users

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React
- **Payments:** Stripe (International) + Razorpay (India)
- **Deployment:** Vercel (free tier compatible)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Stripe (International Payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_YEARLY=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Razorpay (Indian Payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_PLAN_MONTHLY=plan_...
NEXT_PUBLIC_RAZORPAY_PLAN_YEARLY=plan_...

# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Email (Optional - for notifications)
SENDGRID_API_KEY=SG...

# Security
NOTIFICATION_API_KEY=your-secure-key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Go to Developers > API keys and copy your keys
3. Create products in Stripe Dashboard:
   - Products > Add Product
   - Set name, price (e.g., $4.99/month)
   - Copy the Price ID (starts with `price_`)
4. Set up webhooks for payment confirmation

## Razorpay Setup (India)

1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Go to Dashboard > Settings > API Keys
3. Generate and copy your Key ID and Key Secret
4. Create plans in Dashboard:
   - Settings > Plans > Create Plan
   - Set amount (e.g., ₹499/month)
   - Copy the Plan ID (starts with `plan_`)

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings > API
3. Copy the URL and keys
4. Run this SQL to create the subscriptions table:

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  gateway TEXT NOT NULL CHECK (gateway IN ('stripe', 'razorpay')),
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_email ON subscriptions(email);
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel free tier is sufficient for this application.

## Project Structure

```
zenvixy/
├── app/
│   ├── api/
│   │   ├── razorpay/          # Razorpay API routes
│   │   ├── stripe-webhook/    # Stripe webhook handler
│   │   ├── subscription/      # Subscription management
│   │   └── notifications/     # Email notifications
│   ├── tools/                 # Individual tool pages
│   ├── checkout/              # Payment checkout
│   ├── pricing/               # Pricing page
│   └── dashboard/             # User dashboard
├── components/                 # React components
├── lib/
│   ├── payment.ts            # Payment gateway utilities
│   ├── razorpay.ts           # Razorpay integration
│   ├── stripe.ts             # Stripe integration
│   └── pdf-utils.ts          # PDF processing utilities
├── scripts/
│   └── subscription-notifications.js  # Subscription reminder script
└── public/                   # Static assets
```

## Payment Flow

### India (Razorpay)
1. User selects plan and UPI/Card/NetBanking
2. Frontend creates order via `/api/razorpay/create-order`
3. User completes payment on Razorpay
4. Webhook verifies and activates subscription

### International (Stripe)
1. User selects plan and Card/Apple Pay/Google Pay
2. Frontend redirects to Stripe Checkout
3. User completes payment on Stripe
4. Webhook verifies and activates subscription

## Subscription Reminders

Set up a cron job to send subscription renewal reminders:

```bash
# Run daily at 9 AM
0 9 * * * cd /path/to/zenvixy && node scripts/subscription-notifications.js
```

## Security

- All API routes validate requests
- Stripe webhook signatures verified
- Razorpay payment signatures verified
- Environment variables for all secrets
- CORS configured for production only

## License

MIT License - feel free to use for personal or commercial projects.
