import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    })
  : null;

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Track processed events for idempotency (24 hour window)
const processedEvents: Map<string, number> = new Map();
const EVENT_TTL_MS = 24 * 60 * 60 * 1000;

function markEventProcessed(eventId: string) {
  processedEvents.set(eventId, Date.now());
  // Cleanup old events
  const now = Date.now();
  processedEvents.forEach((timestamp, key) => {
    if (now - timestamp > EVENT_TTL_MS) {
      processedEvents.delete(key);
    }
  });
}

function isEventProcessed(eventId: string): boolean {
  const timestamp = processedEvents.get(eventId);
  if (!timestamp) return false;
  if (Date.now() - timestamp > EVENT_TTL_MS) {
    processedEvents.delete(eventId);
    return false;
  }
  return true;
}

// Timing-safe comparison for webhook signature
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function POST(request: NextRequest) {
  if (!stripe || !WEBHOOK_SECRET) {
    console.error("Stripe not configured");
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Idempotency check
  if (isEventProcessed(event.id)) {
    return NextResponse.json({ received: true, skipped: "already processed" });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Payment successful:", session.id, "Customer:", session.customer_email);
        // Handle successful payment - activate subscription
        // In production, you would update your database here
        break;
      }
      
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription updated:", subscription.id, "Status:", subscription.status);
        // Handle subscription updates
        break;
      }
      
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription canceled:", subscription.id);
        // Handle subscription cancellation
        break;
      }
      
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Payment succeeded for invoice:", invoice.id);
        // Handle successful recurring payment
        break;
      }
      
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Payment failed for invoice:", invoice.id);
        // Handle failed payment - notify customer
        break;
      }
      
      default:
        console.log("Unhandled event type:", event.type);
    }

    markEventProcessed(event.id);
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    // Return 200 to prevent Stripe from retrying
    // Log the error for investigation
    return NextResponse.json({ received: true, error: "Processing failed" });
  }
}
