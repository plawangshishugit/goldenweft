import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { razorpay, rupeesToPaise } from "@/lib/razorpay";
import { normalizeStatus } from "@/lib/orderStatus";
import {
  sendAdminAlertEmail,
  sendAdminNewOrderEmail,
  sendCustomerOrderConfirmedEmail,
  sendCustomerRefundedEmail,
  type MailableItem,
} from "@/lib/mail";

/** A saree is a considered purchase — this caps obvious cart-manipulation
 *  or fat-finger quantities while staying generous for genuine bulk/gift
 *  orders. Raise it (or make it per-product) if that's ever too strict. */
const MAX_QTY_PER_ITEM = 10;

/* ============================================================
   Errors
============================================================ */

export class OrderValidationError extends Error {
  status: number;
  unavailable?: { productId: string; name: string; requested: number; available: number }[];

  constructor(
    message: string,
    opts?: {
      status?: number;
      unavailable?: { productId: string; name: string; requested: number; available: number }[];
    }
  ) {
    super(message);
    this.name = "OrderValidationError";
    this.status = opts?.status ?? 400;
    this.unavailable = opts?.unavailable;
  }
}

export class InsufficientStockError extends Error {
  productId: string;
  productName: string;
  available: number;
  requested: number;

  constructor(productId: string, productName: string, available: number, requested: number) {
    super(`Only ${available} of "${productName}" left in stock (requested ${requested}).`);
    this.name = "InsufficientStockError";
    this.productId = productId;
    this.productName = productName;
    this.available = available;
    this.requested = requested;
  }
}

/* ============================================================
   Cart -> authoritative, server-priced order items
   Never trust price/name from the client — only productId + quantity.
============================================================ */

export type ResolvedOrderItem = { productId: string; name: string; price: number; quantity: number };

export async function resolveCartItems(cart: unknown): Promise<{ items: ResolvedOrderItem[]; total: number }> {
  if (!Array.isArray(cart) || cart.length === 0) {
    throw new OrderValidationError("Your cart is empty.");
  }

  // Merge any duplicate productIds and sanitize quantities before touching the DB.
  const merged = new Map<string, number>();
  for (const raw of cart as Array<Record<string, unknown>>) {
    const productId = typeof raw?.productId === "string" ? raw.productId.trim() : "";
    const quantity = Math.floor(Number(raw?.quantity));

    if (!productId || !Number.isFinite(quantity) || quantity <= 0) {
      throw new OrderValidationError("Your cart contains an invalid item. Please refresh and try again.");
    }
    if (quantity > MAX_QTY_PER_ITEM) {
      throw new OrderValidationError(
        `You can order up to ${MAX_QTY_PER_ITEM} of the same piece per order. For larger quantities, please contact us directly.`
      );
    }
    merged.set(productId, (merged.get(productId) ?? 0) + quantity);
  }

  const productIds = [...merged.keys()];
  const products = await prisma.product.findMany({
    where: { slug: { in: productIds }, isActive: true },
  });

  const foundIds = new Set(products.map((p) => p.slug));
  const missing = productIds.filter((id) => !foundIds.has(id));
  if (missing.length > 0) {
    throw new OrderValidationError("Some items in your cart are no longer available.", {
      status: 409,
      unavailable: missing.map((id) => ({ productId: id, name: id, requested: merged.get(id)!, available: 0 })),
    });
  }

  const outOfStock = products
    .map((product) => ({ product, requested: merged.get(product.slug)! }))
    .filter(({ product, requested }) => (product.stock ?? 0) < requested);

  if (outOfStock.length > 0) {
    throw new OrderValidationError("Some items don't have enough stock available right now.", {
      status: 409,
      unavailable: outOfStock.map(({ product, requested }) => ({
        productId: product.slug,
        name: product.name,
        requested,
        available: product.stock ?? 0,
      })),
    });
  }

  let total = 0;
  const items: ResolvedOrderItem[] = products.map((product) => {
    const quantity = merged.get(product.slug)!;
    total += product.price * quantity;
    return { productId: product.slug, name: product.name, price: product.price, quantity };
  });

  return { items, total };
}

export type CartAvailabilityItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  available: boolean; // still purchasable at this quantity right now
  lineTotal: number;
};

/**
 * A "soft", non-throwing sibling to resolveCartItems(), meant for
 * informational pre-checkout display (the cart page) rather than
 * committing an order. Where resolveCartItems() rejects the whole
 * request on the first problem it finds, this reports the live status
 * of every line — including ones that are no longer available — so the
 * cart page can show "only 2 left" / "no longer available" per item
 * instead of a single opaque error. The atomic stock check inside
 * decrementStockForItems() remains the actual source of truth at
 * checkout; this is purely advisory.
 */
export async function checkCartAvailability(
  cart: unknown
): Promise<{ items: CartAvailabilityItem[]; total: number; allAvailable: boolean }> {
  if (!Array.isArray(cart) || cart.length === 0) {
    return { items: [], total: 0, allAvailable: true };
  }

  const merged = new Map<string, number>();
  for (const raw of cart as Array<Record<string, unknown>>) {
    const productId = typeof raw?.productId === "string" ? raw.productId.trim() : "";
    const quantity = Math.floor(Number(raw?.quantity));
    if (!productId || !Number.isFinite(quantity) || quantity <= 0) continue; // informational only — skip malformed lines rather than failing the whole check
    merged.set(productId, (merged.get(productId) ?? 0) + quantity);
  }

  const productIds = [...merged.keys()];
  if (productIds.length === 0) return { items: [], total: 0, allAvailable: true };

  // Deliberately no isActive filter — a deactivated product should be
  // reported as unavailable, not silently dropped from the list.
  const products = await prisma.product.findMany({ where: { slug: { in: productIds } } });
  const bySlug = new Map<string, { name: string; price: number; stock: number; isActive: boolean }>(
    products.map((p: any) => [p.slug, { name: p.name, price: p.price, stock: p.stock ?? 0, isActive: p.isActive }])
  );

  let total = 0;
  let allAvailable = true;
  const items: CartAvailabilityItem[] = [];

  for (const [productId, quantity] of merged) {
    const product = bySlug.get(productId);

    if (!product || !product.isActive) {
      allAvailable = false;
      items.push({ productId, name: product?.name ?? productId, price: 0, quantity, stock: 0, available: false, lineTotal: 0 });
      continue;
    }

    const stock = product.stock ?? 0;
    const available = stock >= quantity;
    if (!available) allAvailable = false;

    const lineTotal = product.price * quantity;
    total += lineTotal;
    items.push({ productId, name: product.name, price: product.price, quantity, stock, available, lineTotal });
  }

  return { items, total, allAvailable };
}

/* ============================================================
   Shipping address validation
============================================================ */

export type ShippingAddressInput = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export function validateShippingAddress(input: unknown): ShippingAddressInput {
  const raw = (input ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const fullName = str(raw.fullName);
  const phone = str(raw.phone);
  const line1 = str(raw.line1);
  const line2 = str(raw.line2) || undefined;
  const landmark = str(raw.landmark) || undefined;
  const city = str(raw.city);
  const state = str(raw.state);
  const postalCode = str(raw.postalCode);
  const country = str(raw.country) || "India";

  if (fullName.length < 2) throw new OrderValidationError("Please enter the recipient's full name.");
  if (phone.replace(/\D/g, "").length < 10) throw new OrderValidationError("Please enter a valid 10-digit phone number for delivery.");
  if (!line1) throw new OrderValidationError("Please enter the delivery address.");
  if (!city) throw new OrderValidationError("Please enter the delivery city.");
  if (!state) throw new OrderValidationError("Please enter the delivery state.");
  if (!postalCode) throw new OrderValidationError("Please enter the delivery PIN / postal code.");
  if (country.toLowerCase() === "india" && !/^\d{6}$/.test(postalCode)) {
    throw new OrderValidationError("Please enter a valid 6-digit PIN code.");
  }

  return { fullName, phone, line1, line2, landmark, city, state, postalCode, country };
}

/* ============================================================
   Order reference (human-facing order number)
============================================================ */

// Excludes 0/O/1/I so a reference read aloud over a phone call or WhatsApp
// voice note can't be confused between similar-looking/sounding characters.
const REF_CHARSET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function generateOrderReference(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const bytes = crypto.randomBytes(6);
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += REF_CHARSET[bytes[i] % REF_CHARSET.length];
  return `GW-${datePart}-${suffix}`;
}

export async function createUniqueOrderReference(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const reference = generateOrderReference();
    const existing = await prisma.order.findUnique({ where: { reference }, select: { id: true } });
    if (!existing) return reference;
  }
  throw new Error("Could not generate a unique order reference — please try again.");
}

/* ============================================================
   Stock — atomic decrement (with rollback) and restore
============================================================ */

export async function decrementStockForItems(items: { productId: string; quantity: number }[]): Promise<void> {
  await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const result = await tx.product.updateMany({
        where: { slug: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });

      if (result.count === 0) {
        const product = await tx.product.findUnique({ where: { slug: item.productId } });
        throw new InsufficientStockError(
          item.productId,
          product?.name ?? item.productId,
          product?.stock ?? 0,
          item.quantity
        );
      }
    }
  });
}

export async function restoreStockForItems(items: { productId: string; quantity: number }[]): Promise<void> {
  if (items.length === 0) return;
  await prisma.$transaction(
    items.map((item) =>
      prisma.product.updateMany({
        where: { slug: item.productId },
        data: { stock: { increment: item.quantity } },
      })
    )
  );
}

/* ============================================================
   Razorpay refund (uses the actual payment id — see refund route
   history for why this matters)
============================================================ */

export async function refundViaRazorpay(razorpayPaymentId: string, amountRupees: number): Promise<void> {
  await razorpay.payments.refund(razorpayPaymentId, { amount: rupeesToPaise(amountRupees) });
}

/**
 * Refunds via Razorpay, then saves that outcome to the order. A refund
 * call can't be safely retried once it has actually succeeded (calling
 * it twice would refund the customer twice) — so if the DB write after a
 * successful refund fails, this does NOT let the caller retry the whole
 * operation. It alerts a human to fix the record instead, since the
 * money has already correctly moved and only the database is out of sync.
 */
export async function refundAndUpdateOrder(
  order: { id: string; reference: string; razorpayPaymentId: string; total: number; name: string; contact: string },
  data: Record<string, unknown>
) {
  await refundViaRazorpay(order.razorpayPaymentId, order.total);
  try {
    return await prisma.order.update({ where: { id: order.id }, data });
  } catch (updateErr) {
    const reason = updateErr instanceof Error ? updateErr.message : String(updateErr);
    await sendAdminAlertEmail(
      `URGENT: refund succeeded but order ${order.reference} could not be updated`,
      `A Razorpay refund of ₹${order.total.toLocaleString("en-IN")} for order ${order.reference} (${order.name}, ${order.contact}) succeeded, but saving that to the database failed: ${reason}\n\nDo NOT trigger another refund — the money has already been returned. Please manually set this order's status to REFUNDED.`
    );
    throw updateErr;
  }
}

/* ============================================================
   The single source of truth for "an online payment came in".
   Called from BOTH the client-facing /verify route (fast UX path)
   and the server-to-server /webhook route (source of truth). Both
   may fire for the same payment — this is fully idempotent.
============================================================ */

type ConfirmOutcome = "confirmed" | "already_confirmed" | "refunded_out_of_stock" | "refunded_unexpected";

export async function confirmOnlineOrderPayment(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
}): Promise<{ outcome: ConfirmOutcome; order: NonNullable<Awaited<ReturnType<typeof prisma.order.findFirst>>> }> {
  const order = await prisma.order.findFirst({ where: { razorpayOrderId: params.razorpayOrderId } });

  if (!order) {
    throw new OrderValidationError(`No order found for Razorpay order ${params.razorpayOrderId}.`, { status: 404 });
  }

  const normalized = normalizeStatus(order.status);

  // Both callers (verify + webhook) can race — whichever arrives second
  // just confirms there's nothing left to do.
  if (["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].includes(normalized)) {
    return { outcome: "already_confirmed", order };
  }

  const items = await prisma.orderItem.findMany({ where: { orderId: order.id } });
  const mailItems: MailableItem[] = items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity }));

  // Money arrived for an order we'd already given up on (cancelled/refunded).
  // Should be rare, but if it happens, return the money and flag it — never
  // silently keep a payment for a cancelled order.
  if (normalized === "CANCELLED" || normalized === "REFUNDED") {
    const updated = await refundAndUpdateOrder(
      { id: order.id, reference: order.reference, razorpayPaymentId: params.razorpayPaymentId, total: order.total, name: order.name, contact: order.contact },
      { razorpayPaymentId: params.razorpayPaymentId, status: "REFUNDED", refundedAt: new Date() }
    );
    await sendCustomerRefundedEmail({ ...updated, shippingAddress: order.shippingAddress as any });
    await sendAdminAlertEmail(
      `Unexpected payment captured for ${order.reference}`,
      `Payment ${params.razorpayPaymentId} was captured for order ${order.reference}, which was already ${order.status}. It has been automatically refunded — please review.`
    );
    return { outcome: "refunded_unexpected", order: updated };
  }

  // Normal path: PENDING_PAYMENT, or PAYMENT_FAILED whose retry just succeeded.
  try {
    await decrementStockForItems(items.map((i) => ({ productId: i.productId, quantity: i.quantity })));
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      // Payment succeeded but stock ran out in the meantime (e.g. a
      // one-of-a-kind handwoven piece sold through another channel).
      // Refund in full rather than confirm something we can't fulfil.
      // Nothing was actually decremented (the transaction rolled back
      // in full), so stockReleased=true is correct here, not a release.
      const updated = await refundAndUpdateOrder(
        { id: order.id, reference: order.reference, razorpayPaymentId: params.razorpayPaymentId, total: order.total, name: order.name, contact: order.contact },
        {
          status: "REFUNDED",
          razorpayPaymentId: params.razorpayPaymentId,
          cancelReason: `Auto-refunded: ${err.message}`,
          cancelledAt: new Date(),
          refundedAt: new Date(),
          stockReleased: true,
        }
      );
      await sendCustomerRefundedEmail({ ...updated, shippingAddress: order.shippingAddress as any });
      await sendAdminAlertEmail(
        `Order ${order.reference} auto-refunded — out of stock`,
        `${err.message}\n\nThe order total (₹${order.total.toLocaleString("en-IN")}) was refunded automatically. Please follow up with ${order.name} (${order.contact}).`
      );
      return { outcome: "refunded_out_of_stock", order: updated };
    }
    throw err;
  }

  let updated;
  try {
    updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: "CONFIRMED", razorpayPaymentId: params.razorpayPaymentId, confirmedAt: new Date() },
    });
  } catch (updateErr) {
    // Stock was already committed by the decrement above. Don't leave
    // inventory silently short with no confirmed order to show for it —
    // release it back and let the caller retry (verify/webhook racing
    // each other means this will be retried automatically).
    await restoreStockForItems(items.map((i) => ({ productId: i.productId, quantity: i.quantity })));
    throw updateErr;
  }

  const mailableOrder = { ...updated, shippingAddress: order.shippingAddress as any };
  await sendCustomerOrderConfirmedEmail(mailableOrder, mailItems);
  await sendAdminNewOrderEmail(mailableOrder, mailItems);

  return { outcome: "confirmed", order: updated };
}

/** Called when Razorpay reports a failed payment attempt. Never downgrades
 *  an order that a later retry has already confirmed. */
export async function markOnlinePaymentFailed(razorpayOrderId: string, reason?: string): Promise<void> {
  const order = await prisma.order.findFirst({ where: { razorpayOrderId } });
  if (!order) return;
  if (normalizeStatus(order.status) !== "PENDING_PAYMENT") return;

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "PAYMENT_FAILED", cancelReason: reason ?? "Online payment failed" },
  });
}
