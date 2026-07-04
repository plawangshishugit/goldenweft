/**
 * Single source of truth for order-status behaviour across the app:
 * labels/colors for the UI, which transitions an admin is allowed to make,
 * and how to treat the handful of legacy status strings that may still
 * exist on orders placed before this schema version.
 *
 * NOTE: this file intentionally re-declares the status union instead of
 * importing `OrderStatus` from "@prisma/client". The two are kept in sync
 * by hand (see prisma/schema.prisma) — this keeps status-handling logic
 * type-checkable even in environments where `prisma generate` hasn't been
 * run yet, and it's assignment-compatible with the generated Prisma enum
 * either way, since Prisma models Mongo enums as plain string-literal
 * unions rather than nominal TS enums.
 */

export const CURRENT_ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "PAYMENT_FAILED",
  "REFUNDED",
] as const;

// Old values that may still exist on documents written before this release.
const LEGACY_ORDER_STATUSES = ["PENDING", "PAID", "COMPLETED"] as const;

export type OrderStatusValue = (typeof CURRENT_ORDER_STATUSES)[number];
type LegacyOrderStatus = (typeof LEGACY_ORDER_STATUSES)[number];
export type AnyOrderStatus = OrderStatusValue | LegacyOrderStatus;

/**
 * Maps a possibly-legacy status string to its modern equivalent for
 * display and decision-making. Never throws — unrecognised strings fall
 * back to CONFIRMED (the safest generic "order exists and was placed"
 * state) rather than crashing a page.
 */
export function normalizeStatus(status: string): OrderStatusValue {
  switch (status) {
    case "PENDING":
    case "PAID":
      return "CONFIRMED";
    case "COMPLETED":
      return "DELIVERED";
    default:
      return (CURRENT_ORDER_STATUSES as readonly string[]).includes(status)
        ? (status as OrderStatusValue)
        : "CONFIRMED";
  }
}

export const ORDER_STATUS_META: Record<
  OrderStatusValue,
  { label: string; description: string; textColor: string; bgColor: string }
> = {
  PENDING_PAYMENT: {
    label: "Awaiting Payment",
    description: "Payment has been initiated but not yet confirmed.",
    textColor: "#b45309",
    bgColor: "#fef3c7",
  },
  CONFIRMED: {
    label: "Confirmed",
    description: "Payment received (or COD accepted). Ready to prepare.",
    textColor: "#2563eb",
    bgColor: "#dbeafe",
  },
  PROCESSING: {
    label: "Processing",
    description: "Being packed for shipment.",
    textColor: "#7c3aed",
    bgColor: "#ede9fe",
  },
  SHIPPED: {
    label: "Shipped",
    description: "Dispatched and on its way.",
    textColor: "#0891b2",
    bgColor: "#cffafe",
  },
  DELIVERED: {
    label: "Delivered",
    description: "Delivered to the customer.",
    textColor: "#16a34a",
    bgColor: "#dcfce7",
  },
  CANCELLED: {
    label: "Cancelled",
    description: "Order was cancelled before shipping.",
    textColor: "#dc2626",
    bgColor: "#fee2e2",
  },
  PAYMENT_FAILED: {
    label: "Payment Failed",
    description: "The online payment attempt did not succeed.",
    textColor: "#9f1239",
    bgColor: "#ffe4e6",
  },
  REFUNDED: {
    label: "Refunded",
    description: "Amount has been returned to the customer.",
    textColor: "#6b7280",
    bgColor: "#f3f4f6",
  },
};

/** Statuses an admin may pick directly from the fulfilment dropdown.
 *  PENDING_PAYMENT, PAYMENT_FAILED and CONFIRMED are system-set (reached
 *  automatically via payment events or COD placement); REFUNDED is only
 *  ever set by the dedicated refund action, never by a plain status edit,
 *  so that the database can never say "refunded" without money having
 *  actually moved. */
export const ADMIN_SELECTABLE_STATUSES: OrderStatusValue[] = [
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

/** Legal next-states for the admin status-select and its API route. */
export const ALLOWED_STATUS_TRANSITIONS: Record<OrderStatusValue, OrderStatusValue[]> = {
  PENDING_PAYMENT: [],
  PAYMENT_FAILED: [],
  CONFIRMED: ["PROCESSING", "SHIPPED", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
  REFUNDED: [],
};

export function canTransition(from: string, to: OrderStatusValue): boolean {
  const normalizedFrom = normalizeStatus(from);
  return ALLOWED_STATUS_TRANSITIONS[normalizedFrom]?.includes(to) ?? false;
}

/** A customer may self-serve cancel only before the order has shipped. */
export function isCustomerCancellable(status: string): boolean {
  const s = normalizeStatus(status);
  return s === "CONFIRMED" || s === "PROCESSING";
}

export function requiresTrackingInfo(status: OrderStatusValue): boolean {
  return status === "SHIPPED";
}
