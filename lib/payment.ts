// Payment Gateway Integration
// Razorpay for India, Stripe for International

export type PaymentGateway = 'razorpay' | 'stripe';
export type PaymentMethod = 
  | 'upi' | 'card' | 'netbanking' | 'wallet'  // Razorpay
  | 'card' | 'apple_pay' | 'google_pay';        // Stripe

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  priceId?: string;       // Stripe price ID
  razorpayPlanId?: string; // Razorpay plan ID
  interval: 'month' | 'year';
  features: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 4.99,
    razorpayPlanId: process.env.NEXT_PUBLIC_RAZORPAY_PLAN_MONTHLY,
    interval: 'month',
    features: [
      'Unlimited high quality downloads',
      'All premium tools',
      'No sponsored content',
      'Cloud storage',
      'Priority support',
    ],
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 39.99,
    razorpayPlanId: process.env.NEXT_PUBLIC_RAZORPAY_PLAN_YEARLY,
    interval: 'year',
    features: [
      'Save 33% vs monthly',
      'Unlimited high quality downloads',
      'All premium tools',
      'No sponsored content',
      'Cloud storage',
      'Priority support',
    ],
  },
];

// Detect user's country from IP (client-side)
export async function detectUserCountry(): Promise<string> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code || 'US';
  } catch {
    return 'US';
  }
}

// Get appropriate payment gateway for country
export function getPaymentGateway(countryCode: string): PaymentGateway {
  const indianCountryCodes = ['IN'];
  return indianCountryCodes.includes(countryCode) ? 'razorpay' : 'stripe';
}

// Indian payment methods for Razorpay
export const RAZORPAY_METHODS = {
  upi: {
    id: 'upi',
    name: 'UPI',
    icon: '💳',
    description: 'Google Pay, PhonePe, Paytm',
  },
  card: {
    id: 'card',
    name: 'Debit/Credit Card',
    icon: '💳',
    description: 'Visa, Mastercard, RuPay',
  },
  netbanking: {
    id: 'netbanking',
    name: 'Net Banking',
    icon: '🏦',
    description: 'All major Indian banks',
  },
  wallet: {
    id: 'wallet',
    name: 'Wallet',
    icon: '👛',
    description: 'Paytm, Mobikwik, Ola Money',
  },
};

// International payment methods for Stripe
export const STRIPE_METHODS = {
  card: {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: '💳',
    description: 'Visa, Mastercard, Amex',
  },
  apple_pay: {
    id: 'apple_pay',
    name: 'Apple Pay',
    icon: '🍎',
    description: 'Fast & secure',
  },
  google_pay: {
    id: 'google_pay',
    name: 'Google Pay',
    icon: '🟢',
    description: 'Fast & secure',
  },
};

// Format price based on currency
export function formatPrice(amount: number, currency: string = 'USD'): string {
  if (currency === 'INR') {
    // Convert USD to INR (approximate rate)
    const inrAmount = Math.round(amount * 83);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(inrAmount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
