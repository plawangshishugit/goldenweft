import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { confirmOnlineOrderPayment, markOnlinePaymentFailed } from "@/lib/orders";
import { normalizeStatus } from "@/lib/orderStatus";
import { sendCustomerRefundedEmail } from "@/lib/mail";

/**
 * Razorpay webhook — the SOURCE OF TRUTH for payment state. Unlike
 * /api/payments/verify (which only runs if the customer's browser is
 * still open and JS executes successfully), Razorpay calls this
 * server-to-server for every event regardless of what the browser does,
 * which is exactly what makes it reliable. Configure this URL
 * (https://yourdomain.com/api/payments/webhook) in the Razorpay
 * dashboard under Settings -> Webhooks, subscribed to at least:
 * payment.captured, payment.failed, refund.processed.
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload.payment.entity;
        // payment.order_id is set by Razorpay on every payment tied to an
        // order and is always present — unlike a custom `notes` field,
        // there's nothing for our own create-order step to forget to set.
        await confirmOnlineOrderPayment({
          razorpayOrderId: payment.order_id,
          razorpayPaymentId: payment.id,
        });
        break;
      }

      case "payment.failed": {
        const payment = event.payload.payment.entity;
        await markOnlinePaymentFailed(payment.order_id, payment.error_description || "Payment failed");
        break;
      }

      case "refund.processed": {
        const refund = event.payload.refund.entity;
        const order = await prisma.order.findFirst({ where: { razorpayPaymentId: refund.payment_id } });
        if (order && normalizeStatus(order.status) !== "REFUNDED") {
          const updated = await prisma.order.update({
            where: { id: order.id },
            data: { status: "REFUNDED", refundedAt: new Date() },
          });
          await sendCustomerRefundedEmail({ ...updated, shippingAddress: order.shippingAddress as any });
        }
        break;
      }

      default:
        // Other event types aren't relevant to order state — safely ignored.
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    // Returning 500 tells Razorpay to retry the webhook later, which is
    // the correct behaviour for a transient failure on our end.
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
