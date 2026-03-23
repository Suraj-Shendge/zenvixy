// Razorpay Integration for Indian Users
// Supports UPI, Cards, Net Banking, Wallets

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
    backdrop_color?: string;
  };
  handler?: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (response: any) => void) => void;
}

export type UPIApp = 'gpay' | 'phonepe' | 'paytm' | 'bhim';

export const UPI_APPS = {
  gpay: {
    id: 'gpay',
    name: 'Google Pay',
    color: '#4285F4',
    icon: 'G',
  },
  phonepe: {
    id: 'phonepe',
    name: 'PhonePe',
    color: '#5F259F',
    icon: 'P',
  },
  paytm: {
    id: 'paytm',
    name: 'Paytm',
    color: '#00B9F1',
    icon: 'P',
  },
  bhim: {
    id: 'bhim',
    name: 'BHIM UPI',
    color: '#7B2D8E',
    icon: 'U',
  },
};

export function isRazorpayAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.Razorpay;
}

export async function loadRazorpayScript(): Promise<boolean> {
  if (isRazorpayAvailable()) return true;

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function createRazorpayOrder(amount: number): Promise<{ orderId: string; amount: number }> {
  const response = await fetch('/api/razorpay/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency: 'INR' }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create order');
  }
  
  return response.json();
}

export function openRazorpayCheckout(options: RazorpayOptions): void {
  if (!isRazorpayAvailable()) {
    throw new Error('Razorpay not loaded');
  }
  
  const razorpay = new window.Razorpay({
    ...options,
    theme: {
      color: '#7C3AED',
      backdrop_color: 'rgba(0,0,0,0.8)',
    },
  });
  
  razorpay.open();
  
  razorpay.on('payment.failed', (response: any) => {
    console.error('Payment failed:', response.error);
    // Handle failure
  });
}

// Verify payment signature (should be done server-side)
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  return fetch('/api/razorpay/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, paymentId, signature }),
  }).then(res => res.json());
}
