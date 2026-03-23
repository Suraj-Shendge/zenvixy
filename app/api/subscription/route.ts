import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    })
  : null;

// Rate limiting
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 30;

function isRateLimited(clientId: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(clientId);
  
  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(clientId, { count: 1, timestamp: now });
    return false;
  }
  
  if (record.count >= MAX_REQUESTS) {
    return true;
  }
  
  record.count++;
  return false;
}

// Timing-safe string comparison
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return email.length <= 254 && emailRegex.test(email);
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || 
             request.headers.get("x-real-ip") || 
             "unknown";
  const clientId = `${ip}-subscription`;
  
  if (isRateLimited(clientId)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Invalid email" },
      { status: 400 }
    );
  }

  // Fail secure - default to not premium on any error
  try {
    if (!stripe) {
      return NextResponse.json({ isPremium: false });
    }

    // Search for customer by email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ isPremium: false });
    }

    const customerId = customers.data[0].id;

    // Check for active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const isPremium = subscriptions.data.length > 0;

    // Check expiration if subscribed
    if (isPremium && subscriptions.data[0]) {
      const currentPeriodEnd = subscriptions.data[0].current_period_end;
      const now = Math.floor(Date.now() / 1000);
      
      // Fail secure: if subscription expired, not premium
      if (currentPeriodEnd < now) {
        return NextResponse.json({ isPremium: false });
      }
    }

    return NextResponse.json({ isPremium });
  } catch (error) {
    console.error("Subscription check error:", error);
    // Fail secure - deny premium on any error
    return NextResponse.json({ isPremium: false });
  }
}
