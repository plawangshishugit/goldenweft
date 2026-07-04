import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/app/admin/_components/AdminAuth";
import { normalizeStatus } from "@/lib/orderStatus";
import { refundAndUpdateOrder, restoreStockForItems } from "@/lib/orders";
import { sendCustomerRefundedEmail } from "@/lib/mail";

/**
 * Manual refund action — for orders that have already shipped or been
 * delivered (a return), or any other case outside the automatic
 * cancel-and-refund handled by the status route. Requires an actual
 * captured Razorpay payment; COD orders were never charged through
 * Razorpay, so there's nothing here to call — mark those CANCELLED
 * instead via the status dropdown.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminAuth();

  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (normalizeStatus(order.status) === "REFUNDED") {
      return NextResponse.json({ error: "This order has already been refunded." }, { status: 409 });
    }

    if (!order.razorpayPaymentId) {
      return NextResponse.json(
        {
          error:
            order.paymentMethod === "COD"
              ? "This was a Cash on Delivery order — there is no online payment to refund. Use Cancel instead if no cash was collected."
              : "No captured payment was found on this order to refund.",
        },
        { status: 400 }
      );
    }

    // Restore stock BEFORE touching money — it's always safe to retry if
    // this step fails, whereas a refund call is not (calling it twice
    // would refund the customer twice), so the harder-to-reverse
    // operation happens last, via the guarded helper below.
    const wasShipped = ["SHIPPED", "DELIVERED"].includes(normalizeStatus(order.status));
    if (!wasShipped && !order.stockReleased) {
      const items = await prisma.orderItem.findMany({ where: { orderId: order.id } });
      await restoreStockForItems(items.map((i) => ({ productId: i.productId, quantity: i.quantity })));
    }

    // The historical bug here was refunding against order.reference (our
    // own human-readable order number) instead of the actual Razorpay
    // payment id — Razorpay would reject every one of those calls.
    const updated = await refundAndUpdateOrder(
      { id: order.id, reference: order.reference, razorpayPaymentId: order.razorpayPaymentId, total: order.total, name: order.name, contact: order.contact },
      { status: "REFUNDED", refundedAt: new Date(), stockReleased: wasShipped ? order.stockReleased : true }
    );

    await sendCustomerRefundedEmail({ ...updated, shippingAddress: order.shippingAddress as any });

    return NextResponse.json({
      ok: true,
      status: updated.status,
      note: wasShipped
        ? "Payment refunded. This order had already shipped, so stock was not automatically restored — add it back manually once the return is received, if applicable."
        : "Payment refunded and stock released back.",
    });
  } catch (err) {
    console.error("Refund error:", err);
    return NextResponse.json({ error: "Refund failed. Please check the Razorpay dashboard before retrying." }, { status: 500 });
  }
}
