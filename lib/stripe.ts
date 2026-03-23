// Stripe Integration for International Users
// Supports Cards, Apple Pay, Google Pay

import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    stripePromise = key ? loadStripe(key) : Promise.resolve(null);
  }
  return stripePromise;
}

export interface StripeCheckoutOptions {
  priceId: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createStripeCheckout(options: StripeCheckoutOptions): Promise<string> {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }
  
  const { sessionId } = await response.json();
  return sessionId;
}

// Apple Pay availability check
export function isApplePayAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as unknown as { ApplePaySession?: unknown }).ApplePaySession;
}

// Google Pay availability check  
export function isGooglePayAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(
    (window as any).google?.payments?.api &&
    (window as any).google.payments.api.PaymentsClient
  );
}

// Load Google Pay API
export async function loadGooglePayApi(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if ((window as any).google?.payments?.api) return true;
  
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://pay.google.com/gp/p/js/pay.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
