# Zenvixy - Project Notes

## Project Overview
Zenvixy is a premium utility web application with 20+ tools across PDF, Image, AI&Text, and Utilities categories.

## Key Features
- **Privacy-First**: All file processing happens in-browser using Web APIs
- **Freemium Model**: Free tier (unlimited standard quality) + Premium ($4.99/mo for high quality)
- **High Quality Unlock**: Watch an ad to unlock high quality for individual downloads
- **No Watermarks**: Watermarks removed from all outputs

## Subscription Details
- **Price**: $4.99/month
- **Benefits**: Unlimited high quality, no ads, cloud save, priority support
- **Free Tier**: Unlimited standard quality processing, ad-supported high quality unlock

## Running Subscription Notifications

Use the Node.js script instead of agents:

```bash
# Development/Dry run
node scripts/subscription-notifications.js --dry-run

# Production (actually sends emails)
node scripts/subscription-notifications.js

# Cron setup (run daily at 9 AM)
0 9 * * * cd /path/to/zenvixy && node scripts/subscription-notifications.js
```

## File Structure
```
zenvixy/
├── app/                    # Next.js app router pages
├── components/             # React components
├── lib/                    # Utilities and helpers
├── scripts/                # Standalone scripts
│   └── subscription-notifications.js
└── public/                 # Static assets
```

## Environment Variables
```env
ZO_API_KEY=your-zo-api-key
ZO_HANDLE=your-zo-handle
NOTIFICATION_API_KEY=dev-key
```
