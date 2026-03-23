import { NextRequest, NextResponse } from "next/server";

// This is a mock implementation - in production, use actual Razorpay SDK
// import Razorpay from "razorpay";

// Amount in paisa (INR)
const PRICES: Record<string, number> = {
  monthly: 49900,  // ₹499
  yearly: 399900,  // ₹3999
};

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json();

    if (!planId || !PRICES[planId]) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    // Check if Razorpay is configured
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      // Return mock order for development
      return NextResponse.json({
        orderId: `mock_order_${Date.now()}`,
        amount: PRICES[planId],
        currency: "INR",
        mock: true,
      });
    }

    // Production: Use actual Razorpay
    // const razorpay = new Razorpay({
    //   key_id: keyId,
    //   key_secret: keySecret,
    // });
    //
    // const order = await razorpay.orders.create({
    //   amount: PRICES[planId],
    //   currency: "INR",
    //   receipt: `rcpt_${Date.now()}`,
    // });

    // For now, return mock order
    return NextResponse.json({
      orderId: `order_${Date.now()}`,
      amount: PRICES[planId],
      currency: "INR",
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
