import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserAuth } from "@/app/account/_components/UserAuth";
import { isCustomerCancellable, normalizeStatus } from "@/lib/orderStatus";
import { restoreStockForItems, refundAndUpdateOrder } from "@/lib/orders";
import { sendCustomerCancelledEmail, sendCustomerRefundedEmail, sendAdminAlertEmail } from "@/lib/mail";

/**
 * Customer-initiated cancellation, available only for their own orders,
 * and only before an order has shipped (see isCustomerCancellable). Once
 * a package is physically moving, cancelling a status flag doesn't undo
 * that — that's a returns conversation, not a self-serve button.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // requireUserAuth() redirects rather than throwing a 401 JSON response —
  // that's fine for page navigations, but this is an API route hit via
  // fetch(), so a logged-out call will surface as a redirect response,
  // which the client treats as "not ok" and shows a clear message for.
  const session = await requireUserAuth();

  try {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const belongsToUser = order.userId === session.userId || order.contact === session.email;
    if (!belongsToUser) {
      return NextResponse.json({ error: "This order doesn't belong to your account." }, { status: 403 });
    }

    if (!isCustomerCancellable(order.status)) {
      return NextResponse.json(
        { error: `This order can no longer be cancelled — it's currently ${normalizeStatus(order.status).toLowerCase().replace("_", " ")}.` },
        { status: 409 }
      );
    }

    const items = await prisma.orderItem.findMany({ where: { orderId: order.id } });
    if (!order.stockReleased) {
      await restoreStockForItems(items.map((i) => ({ productId: i.productId, quantity: i.quantity })));
    }

    const isPaidOnline = order.paymentMethod === "ONLINE" && !!order.razorpayPaymentId;
    let updated;

    if (isPaidOnline) {
      updated = await refundAndUpdateOrder(
        { id: order.id, reference: order.reference, razorpayPaymentId: order.razorpayPaymentId!, total: order.total, name: order.name, contact: order.contact },
        { status: "REFUNDED", cancelReason: "Cancelled by customer", cancelledAt: new Date(), refundedAt: new Date(), stockReleased: true }
      );
    } else {
      updated = await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED", cancelReason: "Cancelled by customer", cancelledAt: new Date(), stockReleased: true },
      });
    }

    const mailableOrder = { ...updated, shippingAddress: order.shippingAddress as any };
    if (isPaidOnline) {
      await sendCustomerRefundedEmail(mailableOrder);
    } else {
      await sendCustomerCancelledEmail(mailableOrder);
    }
    await sendAdminAlertEmail(
      `Order ${order.reference} cancelled by customer`,
      `${order.name} (${order.contact}) cancelled order ${order.reference} themselves.${isPaidOnline ? " It was paid online and has been refunded automatically." : ""}`
    );

    return NextResponse.json({ ok: true, status: updated.status });
  } catch (err) {
    console.error("Customer order cancellation error:", err);
    return NextResponse.json(
      { error: "We couldn't cancel this order automatically. Please contact us directly and we'll sort it out." },
      { status: 500 }
    );
  }
}
