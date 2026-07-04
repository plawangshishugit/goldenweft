import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import OrderStatusSelect from "./OrderStatusSelect";
import RefundButton from "./RefundButton";
import { ORDER_STATUS_META, normalizeStatus } from "@/lib/orderStatus";

/* ---------- Status Badge ---------- */
function StatusBadge({ status }: { status: string }) {
  const meta = ORDER_STATUS_META[normalizeStatus(status)];
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: meta.bgColor, color: meta.textColor }}
      title={meta.description}
    >
      {meta.label}
    </span>
  );
}

function AddressBlock({ address }: { address: any }) {
  if (!address) {
    return <Text className="text-sm opacity-60 italic">No address on file — this order predates address collection. Contact the customer directly.</Text>;
  }
  return (
    <Text className="text-sm opacity-80 leading-relaxed">
      {address.fullName} · {address.phone}
      <br />
      {address.line1}
      {address.line2 ? `, ${address.line2}` : ""}
      {address.landmark ? ` (near ${address.landmark})` : ""}
      <br />
      {address.city}, {address.state} {address.postalCode}, {address.country}
    </Text>
  );
}

/* ---------- Page (SERVER) ---------- */
export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <Section>
      <Text as="h1">Customer Orders</Text>

      {orders.length === 0 ? (
        <Text className="mt-6 text-sm opacity-70">
          No orders yet.
        </Text>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((order) => {
            const canRefund = !!order.razorpayPaymentId && normalizeStatus(order.status) !== "REFUNDED";
            return (
              <div
                key={order.id}
                className="border border-black/10 rounded-soft p-6"
              >
                {/* Header */}
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div>
                    <Text className="font-medium">
                      {order.reference}
                    </Text>

                    <Text className="text-sm opacity-70">
                      {order.name} · {order.contact}
                    </Text>

                    <Text className="text-sm font-medium mt-1">
                      ₹{order.total.toLocaleString("en-IN")}
                    </Text>

                    {/* Status */}
                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                      <StatusBadge status={order.status} />

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.paymentMethod === "COD"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {order.paymentMethod === "COD" ? "Cash on Delivery" : "Paid Online"}
                      </span>

                      <OrderStatusSelect
                        orderId={order.id}
                        initialStatus={order.status}
                      />

                      {canRefund && <RefundButton orderId={order.id} />}
                    </div>
                  </div>

                  <Text className="text-xs opacity-60 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleString()}
                  </Text>
                </div>

                {/* Address */}
                <div className="mt-4">
                  <Text className="text-sm font-medium">Deliver to</Text>
                  <div className="mt-1">
                    <AddressBlock address={order.shippingAddress} />
                  </div>
                </div>

                {/* Tracking */}
                {(order.trackingNumber || order.status === "SHIPPED" || order.status === "DELIVERED") && (
                  <div className="mt-4">
                    <Text className="text-sm font-medium">Tracking</Text>
                    <Text className="text-sm opacity-80">
                      {order.trackingNumber
                        ? `${order.trackingNumber}${order.courierName ? ` via ${order.courierName}` : ""}`
                        : "Not yet added"}
                    </Text>
                  </div>
                )}

                {/* Items */}
                <div className="mt-4">
                  <Text className="text-sm font-medium">Items</Text>
                  <ul className="mt-2 list-disc list-inside text-sm opacity-80">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.name} × {item.quantity} — ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="mt-4">
                    <Text className="text-sm font-medium">Notes</Text>
                    <Text className="mt-1 text-sm opacity-80">
                      {order.notes}
                    </Text>
                  </div>
                )}

                {/* Cancel reason */}
                {order.cancelReason && (
                  <div className="mt-4">
                    <Text className="text-sm font-medium">Cancellation / Refund note</Text>
                    <Text className="mt-1 text-sm opacity-80">
                      {order.cancelReason}
                    </Text>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
