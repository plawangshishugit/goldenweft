import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { confirmOnlineOrderPayment, OrderValidationError } from "@/lib/orders";

/**
 * Client-side "fast path" confirmation, called immediately after Razorpay's
 * checkout.js handler fires. This exists purely for a snappy UX (showing
 * the thank-you page right away) — it is NOT the source of truth for
 * whether an order is paid. That's the webhook (see
 * /api/payments/webhook), which Razorpay calls server-to-server regardless
 * of whether this browser tab is still open. Both routes funnel into the
 * same idempotent confirmOnlineOrderPayment(), so whichever arrives first
 * does the work and the second one is a safe no-op.
 */
export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 401 });
    }

    const { outcome, order } = await confirmOnlineOrderPayment({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    if (outcome === "refunded_out_of_stock" || outcome === "refunded_unexpected") {
      return NextResponse.json(
        {
          ok: false,
          refunded: true,
          error:
            "One or more items in your order sold out just as your payment was completing. It has been refunded in full automatically — the refund should reflect in your original payment method within 5–7 business days.",
        },
        { status: 409 }
      );
    }

    const items = await prisma.orderItem.findMany({ where: { orderId: order.id } });

    return NextResponse.json({
      ok: true,
      order: {
        reference: order.reference,
        total: order.total,
        paymentMethod: order.paymentMethod,
        items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity, productId: i.productId })),
      },
    });
  } catch (err) {
    if (err instanceof OrderValidationError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Payment verification error:", err);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
