import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Verify Razorpay payment signature
export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentId, signature } = await request.json();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const payload = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const isValid = signature === expectedSignature;

    if (isValid) {
      // Payment is valid - update user's subscription in database
      // This would typically involve:
      // 1. Finding the order by orderId
      // 2. Marking the subscription as active
      // 3. Setting the expiry date
      // 4. Sending confirmation email

      return NextResponse.json({ success: true, verified: true });
    } else {
      return NextResponse.json(
        { error: "Invalid signature", verified: false },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Razorpay verification failed:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
