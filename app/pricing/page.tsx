"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Crown, Zap } from "lucide-react";

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  const plans = [
    {
      name: "Free",
      price: 0,
      features: [
        "Unlimited standard quality",
        "All basic tools",
        "Watch ad for HD downloads",
        "Standard processing speed",
      ],
      cta: "Current Plan",
      popular: false,
    },
    {
      name: "Premium",
      price: billing === "monthly" ? 4.99 : 39.99,
      period: billing === "monthly" ? "/month" : "/year",
      savings: billing === "yearly" ? "Save $20" : null,
      features: [
        "Unlimited HD quality",
        "All premium tools",
        "No ads",
        "Priority processing",
        "Cloud storage",
        "Priority support",
      ],
      cta: "Get Premium",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-xl z-40">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
              <span className="text-white text-sm font-bold">Z</span>
            </div>
            <span className="font-semibold text-black">Zenvixy</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-black">
            ← Back
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-black mb-3">Simple, Transparent Pricing</h1>
          <p className="text-gray-500">Start free. Upgrade anytime.</p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 mt-6 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                billing === "monthly" ? "bg-white text-black shadow-sm" : "text-gray-500"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                billing === "yearly" ? "bg-white text-black shadow-sm" : "text-gray-500"
              }`}
            >
              Yearly <span className="text-green-600">-33%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 ${
                plan.popular
                  ? "bg-black text-white ring-2 ring-black"
                  : "bg-gray-50 text-black"
              }`}
            >
              {plan.popular && (
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full text-xs font-medium mb-4">
                  <Crown className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <h2 className="text-lg font-semibold mb-2">{plan.name}</h2>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                {plan.period && <span className="text-gray-500">{plan.period}</span>}
                {plan.savings && (
                  <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-lg">
                    {plan.savings}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className={`w-4 h-4 ${plan.popular ? "text-white/70" : "text-green-600"}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.popular ? "/checkout" : "/"}
                className={`block w-full py-3 text-center rounded-xl font-medium transition-colors ${
                  plan.popular
                    ? "bg-white text-black hover:bg-gray-100"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Ad Placement */}
        <div className="mt-16 text-center">
          <div className="inline-block p-6 bg-gray-50 rounded-2xl max-w-md mx-auto">
            <p className="text-xs text-gray-400 mb-2">Sponsored</p>
            <p className="text-sm text-gray-600">
              Your ad could be here. Reach thousands of users daily.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-black mb-6 text-center">Frequently Asked</h2>
          <div className="space-y-4">
            {[
              { q: "Can I cancel anytime?", a: "Yes, cancel anytime. No questions asked." },
              { q: "What payment methods do you accept?", a: "UPI, cards, wallets (India) and all major cards (International)." },
              { q: "Is there a free trial?", a: "Yes! Free users get unlimited standard quality. Watch an ad for HD." },
            ].map((faq) => (
              <div key={faq.q} className="p-4 bg-gray-50 rounded-xl">
                <p className="font-medium text-black mb-1">{faq.q}</p>
                <p className="text-sm text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
