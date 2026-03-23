#!/usr/bin/env node

/**
 * Zenvixy Subscription Notification Script
 * 
 * SECURITY NOTES:
 * - Requires INTERNAL_API_KEY environment variable
 * - Uses timing-safe comparison for API key verification
 * - Rate limiting built into the API route
 * - No sensitive data logged
 * - All credentials from environment variables
 * 
 * Usage:
 *   node subscription-notifications.js              # Production
 *   node subscription-notifications.js --dry-run   # Test without emails
 *   node subscription-notifications.js --test=email  # Send test email
 * 
 * Setup cron:
 *   0 9 * * * cd /path/to/zenvixy && node scripts/subscription-notifications.js >> /var/log/zenvixy-notifications.log 2>&1
 */

const https = require("https");
const { createClient } = require("@supabase/supabase-js");

// ============================================
// CONFIGURATION (from environment)
// ============================================

const CONFIG = {
  // Supabase
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  
  // SendGrid
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.FROM_EMAIL || "subscriptions@zenvixy.com",
  
  // App
  appUrl: process.env.APP_URL || "https://zenvixy.com",
  internalApiKey: process.env.INTERNAL_API_KEY,
};

// ============================================
// ARGUMENT PARSING
// ============================================

const args = process.argv.slice(2);
const options = {
  dryRun: args.includes("--dry-run") || args.includes("-d"),
  test: args.find(arg => arg.startsWith("--test="))?.split("=")[1] || null,
};

if (options.dryRun) {
  console.log("🔵 DRY RUN MODE - No emails will be sent");
}

if (options.test) {
  console.log(`🧪 TEST MODE - Will send test email to: ${options.test}`);
}

// ============================================
// VALIDATION
// ============================================

function validateConfig() {
  const errors = [];
  
  if (!CONFIG.internalApiKey) {
    errors.push("INTERNAL_API_KEY is required");
  }
  
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseKey) {
    errors.push("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }
  
  if (!CONFIG.sendgridApiKey) {
    errors.push("SENDGRID_API_KEY is required for email sending");
  }
  
  if (errors.length > 0) {
    console.error("❌ Configuration errors:");
    errors.forEach(e => console.error(`   - ${e}`));
    process.exit(1);
  }
}

// ============================================
// HTTP REQUEST HELPER (no external deps)
// ============================================

function httpRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    
    req.on("error", reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// ============================================
// SEND EMAIL VIA SENDGRID
// ============================================

async function sendEmail(to, subject, htmlContent) {
  if (options.dryRun) {
    console.log(`   [DRY RUN] Would send email to: ${to}`);
    console.log(`   Subject: ${subject}`);
    return true;
  }

  const data = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: CONFIG.fromEmail, name: "Zenvixy" },
    subject,
    content: [{ type: "text/html", value: htmlContent }],
  };

  const response = await httpRequest(
    {
      hostname: "api.sendgrid.com",
      path: "/v3/mail/send",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CONFIG.sendgridApiKey}`,
        "Content-Type": "application/json",
      },
    },
    data
  );

  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`SendGrid error: ${response.status}`);
  }

  return true;
}

// ============================================
// EMAIL TEMPLATES
// ============================================

function getEmailTemplates() {
  const appName = "Zenvixy";
  const appUrl = CONFIG.appUrl;
  const logoIcon = "✨";

  return {
    renewalReminder: (days, email, plan) => ({
      subject: days === 7 
        ? `Your ${appName} subscription renews in 1 week` 
        : days === 3 
          ? `Reminder: ${appName} renewal in 3 days`
          : `Important: ${appName} renews tomorrow`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #09090b; color: #ffffff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-size: 32px; margin-bottom: 16px;">${logoIcon}</div>
            <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 8px;">Subscription Renewal</h1>
            <p style="color: #a1a1aa; margin: 0;">Powered by ${appName}</p>
          </div>
          
          <div style="background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
            <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6;">
              Hi there,
            </p>
            <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6;">
              ${days === 0 
                ? "Your <strong>Zenvixy Premium</strong> subscription renews <strong>tomorrow</strong>." 
                : `Your <strong>Zenvixy Premium</strong> subscription will renew in <strong>${days} day${days > 1 ? 's' : ''}</strong>.`}
            </p>
            
            <div style="background: #27272a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #a1a1aa; padding: 4px 0;">Plan</td>
                  <td style="text-align: right; font-weight: 500;">${plan === 'annual' ? 'Annual' : 'Monthly'}</td>
                </tr>
                <tr>
                  <td style="color: #a1a1aa; padding: 4px 0;">Amount</td>
                  <td style="text-align: right; font-weight: 500;">${plan === 'annual' ? '$39.99/year' : '$4.99/month'}</td>
                </tr>
              </table>
            </div>
            
            <p style="margin: 0 0 24px; font-size: 14px; color: #a1a1aa;">
              No action is needed. Your subscription will automatically renew on the billing date.
            </p>
            
            <a href="${appUrl}/settings" style="display: inline-block; width: 100%; padding: 14px 24px; background: linear-gradient(to right, #7c3aed, #a21caf); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 500; text-align: center; box-sizing: border-box;">
              Manage Subscription
            </a>
          </div>
          
          <p style="text-align: center; color: #71717a; font-size: 13px; margin: 0;">
            Questions? Contact us at <a href="mailto:support@zenvixy.com" style="color: #a78bfa;">support@zenvixy.com</a>
          </p>
        </div>
      `,
    }),

    paymentFailed: (email, plan) => ({
      subject: "Payment failed - Action required for your Zenvixy subscription",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #09090b; color: #ffffff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-size: 32px; margin-bottom: 16px;">⚠️</div>
            <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 8px;">Payment Failed</h1>
            <p style="color: #a1a1aa; margin: 0;">Action required for ${appName}</p>
          </div>
          
          <div style="background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
            <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6;">
              We were unable to process your payment for the <strong>Zenvixy Premium</strong> subscription.
            </p>
            
            <p style="margin: 0 0 24px; font-size: 14px; color: #a1a1aa;">
              Please update your payment method to avoid service interruption.
            </p>
            
            <a href="${appUrl}/settings" style="display: inline-block; width: 100%; padding: 14px 24px; background: linear-gradient(to right, #dc2626, #b91c1c); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 500; text-align: center; box-sizing: border-box;">
              Update Payment Method
            </a>
          </div>
          
          <p style="text-align: center; color: #71717a; font-size: 13px; margin: 0;">
            Questions? Contact us at <a href="mailto:support@zenvixy.com" style="color: #a78bfa;">support@zenvixy.com</a>
          </p>
        </div>
      `,
    }),
  };
}

// ============================================
// MAIN PROCESSING FUNCTION
// ============================================

async function processNotifications() {
  console.log("🚀 Starting subscription notification process");
  console.log(`   Timestamp: ${new Date().toISOString()}`);
  
  // Build request body
  const requestBody = {
    dryRun: options.dryRun,
  };
  
  if (options.test) {
    requestBody.testEmail = options.test;
  }

  // Call internal API
  console.log("\n📡 Calling notification API...");
  
  const internalHost = new URL(CONFIG.appUrl).hostname;
  
  const response = await httpRequest(
    {
      hostname: internalHost,
      port: 443,
      path: "/api/notifications/process",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": CONFIG.internalApiKey,
        "User-Agent": "Zenvixy-NotificationScript/1.0",
      },
    },
    requestBody
  );

  if (response.status !== 200) {
    console.error(`❌ API returned status: ${response.status}`);
    console.error(response.data);
    process.exit(1);
  }

  const result = response.data;
  
  console.log("\n📊 Results:");
  console.log(`   Processed: ${result.processed}`);
  console.log(`   Emails sent: ${result.emailsSent}`);
  console.log(`   Dry run: ${result.dryRun}`);
  
  if (result.errors && result.errors.length > 0) {
    console.log("\n⚠️ Errors:");
    result.errors.forEach(e => console.log(`   - ${e}`));
  }

  console.log("\n✅ Notification process completed");
}

// ============================================
// SCRIPT ENTRY POINT
// ============================================

async function main() {
  console.log("=".repeat(50));
  console.log("Zenvixy Subscription Notifications");
  console.log("=".repeat(50));
  
  // Validate configuration
  validateConfig();
  
  // Run processing
  try {
    await processNotifications();
  } catch (error) {
    console.error("\n❌ Fatal error:", error.message);
    process.exit(1);
  }
}

main();
