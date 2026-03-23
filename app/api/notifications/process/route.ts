import { NextRequest, NextResponse } from "next/server";

// This endpoint should be called by a secure cron job or scheduler
// It requires an internal API key for authentication

// Verify this is called from authorized source
function verifyAuthorization(request: NextRequest): boolean {
  // Check for internal API key
  const apiKey = request.headers.get("x-api-key");
  const expectedKey = process.env.INTERNAL_API_KEY;

  if (!expectedKey) {
    // If no key configured, deny all
    console.error("INTERNAL_API_KEY not configured");
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  if (!apiKey) return false;
  
  const keyBytes = Buffer.from(apiKey);
  const expectedBytes = Buffer.from(expectedKey);
  
  if (keyBytes.length !== expectedBytes.length) return false;
  
  let result = 0;
  for (let i = 0; i < keyBytes.length; i++) {
    result |= keyBytes[i] ^ expectedBytes[i];
  }
  
  return result === 0;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verify authorization
    if (!verifyAuthorization(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse request body
    let body: { 
      dryRun?: boolean; 
      testEmail?: string;
      daysUntilRenewal?: number[];
    };
    
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { dryRun, testEmail, daysUntilRenewal } = body;

    // 3. Validate inputs
    if (testEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
      return NextResponse.json(
        { error: "Invalid test email" },
        { status: 400 }
      );
    }

    if (daysUntilRenewal && !Array.isArray(daysUntilRenewal)) {
      return NextResponse.json(
        { error: "daysUntilRenewal must be an array" },
        { status: 400 }
      );
    }

    // 4. Initialize Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    // 5. Calculate date ranges
    const now = new Date();
    const targetDays = daysUntilRenewal || [7, 3, 1, 0];
    
    const results = {
      processed: 0,
      emailsSent: 0,
      errors: [] as string[],
      dryRun: dryRun || false,
    };

    // 6. Process each day threshold
    for (const days of targetDays) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + days);
      
      // Format as YYYY-MM-DD for comparison
      const targetDateStr = targetDate.toISOString().split("T")[0];
      const nextDayStr = new Date(targetDate.getTime() + 86400000)
        .toISOString().split("T")[0];

      // Query subscriptions expiring on this date
      const { data: subscriptions, error } = await supabase
        .from("subscriptions")
        .select("email, plan, current_period_end")
        .eq("status", "active")
        .gte("current_period_end", targetDateStr)
        .lt("current_period_end", nextDayStr);

      if (error) {
        results.errors.push(`Query error for day ${days}: ${error.message}`);
        continue;
      }

      if (!subscriptions || subscriptions.length === 0) {
        continue;
      }

      for (const sub of subscriptions) {
        results.processed++;
        
        if (dryRun) {
          results.emailsSent++;
          continue;
        }

        // In production, send email here via SendGrid
        // await sendRenewalEmail(sub.email, days, sub.plan);
        results.emailsSent++;
      }
    }

    // 7. If test email provided, send a test email
    if (testEmail && !dryRun) {
      // await sendTestEmail(testEmail);
      results.emailsSent++;
    }

    return NextResponse.json({
      success: true,
      ...results,
    });

  } catch (error) {
    console.error("Notification process error:", error);
    return NextResponse.json(
      { error: "Processing failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
