import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/app/admin/_components/AdminAuth";
import {
  ADMIN_SELECTABLE_STATUSES,
  canTransition,
  normalizeStatus,
  requiresTrackingInfo,
  type OrderStatusValue,
} from "@/lib/orderStatus";
import { restoreStockForItems, refundAndUpdateOrder } from "@/lib/orders";
import { sendCustomerShippedEmail, sendCustomerDeliveredEmail, sendCustomerCancelledEmail, sendCustomerRefundedEmail } from "@/lib/mail";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminAuth();

  try {
    const { id } = await params;
    const body = await req.json();
    const requestedStatus = body?.status as string | undefined;
    const trackingNumber = body?.trackingNumber ? String(body.trackingNumber).trim() : undefined;
    const courierName = body?.courierName ? String(body.courierName).trim() : undefined;
    const cancelReason = body?.cancelReason ? String(body.cancelReason).trim() : undefined;

    if (!requestedStatus || !ADMIN_SELECTABLE_STATUSES.includes(requestedStatus as OrderStatusValue)) {
      return NextResponse.json(
        { error: `Status must be one of: ${ADMIN_SELECTABLE_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }
    const nextStatus = requestedStatus as OrderStatusValue;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!canTransition(order.status, nextStatus)) {
      return NextResponse.json(
        { error: `Order is currently "${normalizeStatus(order.status)}" and cannot move directly to "${nextStatus}".` },
        { status: 409 }
      );
    }

    if (requiresTrackingInfo(nextStatus) && !trackingNumber) {
      return NextResponse.json({ error: "A tracking number is required to mark an order as shipped." }, { status: 400 });
    }

    // Cancelling an order that was already paid online means returning the
    // money, not just flipping a label — resolve it to REFUNDED instead so
    // the status always reflects whether money has actually moved.
    const isPaidOnline = order.paymentMethod === "ONLINE" && !!order.razorpayPaymentId;
    const willRefund = nextStatus === "CANCELLED" && isPaidOnline;
    const finalStatus: OrderStatusValue = willRefund ? "REFUNDED" : nextStatus;

    if (nextStatus === "CANCELLED" && !order.stockReleased) {
      const items = await prisma.orderItem.findMany({ where: { orderId: order.id } });
      await restoreStockForItems(items.map((i) => ({ productId: i.productId, quantity: i.quantity })));
    }

    const now = new Date();
    const data = {
      status: finalStatus,
      trackingNumber: nextStatus === "SHIPPED" ? trackingNumber : order.trackingNumber,
      courierName: nextStatus === "SHIPPED" ? (courierName ?? order.courierName) : order.courierName,
      cancelReason: nextStatus === "CANCELLED" ? (cancelReason ?? "Cancelled by admin") : order.cancelReason,
      shippedAt: nextStatus === "SHIPPED" ? now : order.shippedAt,
      deliveredAt: nextStatus === "DELIVERED" ? now : order.deliveredAt,
      cancelledAt: nextStatus === "CANCELLED" ? now : order.cancelledAt,
      refundedAt: willRefund ? now : order.refundedAt,
      stockReleased: nextStatus === "CANCELLED" ? true : order.stockReleased,
    };

    const updated = willRefund
      ? await refundAndUpdateOrder(
          { id: order.id, reference: order.reference, razorpayPaymentId: order.razorpayPaymentId!, total: order.total, name: order.name, contact: order.contact },
          data
        )
      : await prisma.order.update({ where: { id }, data });

    const mailableOrder = { ...updated, shippingAddress: order.shippingAddress as any };
    if (nextStatus === "SHIPPED") await sendCustomerShippedEmail(mailableOrder);
    if (nextStatus === "DELIVERED") await sendCustomerDeliveredEmail(mailableOrder);
    if (nextStatus === "CANCELLED") {
      if (willRefund) await sendCustomerRefundedEmail(mailableOrder);
      else await sendCustomerCancelledEmail(mailableOrder);
    }

    return NextResponse.json({ ok: true, status: updated.status });
  } catch (err) {
    console.error("Order status update error:", err);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
