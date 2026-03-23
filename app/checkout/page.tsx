"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, CreditCard, Smartphone, ArrowLeft } from "lucide-react";

type BillingPeriod = "monthly" | "yearly";
type PaymentMethod = "card" | "upi" | "wallet";

export default function Checkout() {
  const [billing, setBilling] = useState<BillingPeriod>("yearly");
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<"details" | "payment" | "complete">("details");

  const price = billing === "monthly" ? 4.99 : 39.99;
  const priceInr = Math.round(price * 83);

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessing(false);
    setSuccess(true);
    setStep("complete");
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">Payment Successful!</h1>
          <p className="text-gray-500 mb-8">Welcome to Zenvixy Premium. Enjoy unlimited HD quality.</p>
          <Link href="/" className="inline-block px-6 py-3 bg-black text-white rounded-xl font-medium">
            Start Using Premium
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-xl z-40">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/pricing" className="text-gray-400 hover:text-black">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-semibold text-black">Checkout</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-black mb-8">Complete Your Purchase</h1>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-medium text-black">Zenvixy Premium</p>
              <p className="text-sm text-gray-500">{billing === "yearly" ? "Annual plan" : "Monthly plan"}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-black">${price}</p>
              <p className="text-xs text-gray-500">${priceInr} for Indian users</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setBilling("monthly")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                billing === "monthly" ? "bg-black text-white" : "bg-white text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                billing === "yearly" ? "bg-black text-white" : "bg-white text-gray-700"
              }`}
            >
              Yearly -33%
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <p className="font-medium text-black mb-3">Payment Method</p>
          
          <div className="space-y-3">
            {/* India Payment Options */}
            <div className="text-xs text-gray-500 mb-2">Indian Payments (₹{priceInr})</div>
            
            <button
              onClick={() => setPayment("upi")}
              className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-colors ${
                payment === "upi" ? "border-black bg-gray-50" : "border-gray-200"
              }`}
            >
              <Smartphone className="w-6 h-6 text-gray-600" />
              <div className="text-left">
                <p className="font-medium text-black">UPI / Google Pay / PhonePe</p>
                <p className="text-xs text-gray-500">Instant payment via UPI apps</p>
              </div>
              {payment === "upi" && <Check className="w-5 h-5 text-black ml-auto" />}
            </button>

            <button
              onClick={() => setPayment("wallet")}
              className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-colors ${
                payment === "wallet" ? "border-black bg-gray-50" : "border-gray-200"
              }`}
            >
              <Smartphone className="w-6 h-6 text-gray-600" />
              <div className="text-left">
                <p className="font-medium text-black">Paytm / Amazon Pay / Other Wallets</p>
                <p className="text-xs text-gray-500">Pay using your wallet balance</p>
              </div>
              {payment === "wallet" && <Check className="w-5 h-5 text-black ml-auto" />}
            </button>

            {/* International */}
            <div className="text-xs text-gray-500 mb-2 pt-2">International ($USD)</div>
            
            <button
              onClick={() => setPayment("card")}
              className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-colors ${
                payment === "card" ? "border-black bg-gray-50" : "border-gray-200"
              }`}
            >
              <CreditCard className="w-6 h-6 text-gray-600" />
              <div className="text-left">
                <p className="font-medium text-black">Credit / Debit Card</p>
                <p className="text-xs text-gray-500">Visa, Mastercard, American Express</p>
              </div>
              {payment === "card" && <Check className="w-5 h-5 text-black ml-auto" />}
            </button>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full py-4 bg-black text-white rounded-xl font-medium disabled:opacity-50 hover:bg-gray-800 transition-colors"
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            `Pay $${price} (₹${priceInr})`
          )}
        </button>

        {/* Security Note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Secured with 256-bit encryption. Your payment info is never stored.
        </p>

        {/* Ad Placeholder */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-xs text-gray-400">Sponsored</p>
          <p className="text-sm text-gray-500">Your ad could be here</p>
        </div>
      </main>
    </div>
  );
}
