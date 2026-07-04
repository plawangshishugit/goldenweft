import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { razorpay, rupeesToPaise } from "@/lib/razorpay";
import { getOptionalUserSession } from "@/app/account/_components/UserAuth";
import {
  OrderValidationError,
  resolveCartItems,
  validateShippingAddress,
  createUniqueOrderReference,
} from "@/lib/orders";

/**
 * Starts an ONLINE checkout. This is the "checkout-init" step of the
 * Razorpay-recommended flow: we create the Order in our own database
 * FIRST — priced from the database, never from the client — and only
 * then create the matching Razorpay order. This is what makes the rest
 * of the flow reliable: by the time the customer ever sees the payment
 * sheet, a real order already exists and is simply waiting to be marked
 * paid by /api/payments/verify (fast path) or the webhook (source of
 * truth). If the browser crashes right after payment, the order was
 * never depending on that browser being alive to exist in the first
 * place.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idempotencyKey, name, contact, notes, cart, shippingAddress } = body as {
      idempotencyKey?: string;
      name?: string;
      contact?: string;
      notes?: string;
      cart?: unknown;
      shippingAddress?: unknown;
    };

    const cleanName = String(name ?? "").trim();
    const cleanContact = String(contact ?? "").trim();

    if (cleanName.length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (cleanContact.length < 5) {
      return NextResponse.json({ error: "Please enter a valid email or phone number." }, { status: 400 });
    }

    // Checkout requires a signed-in account — checked first, before any
    // idempotency lookup, cart resolution, or Razorpay order creation, so
    // an unauthenticated request fails fast without side effects.
    const session = await getOptionalUserSession();
    if (!session) {
      return NextResponse.json({ error: "Please sign in to place an order.", requiresAuth: true }, { status: 401 });
    }

    // Replaying the same checkout attempt (double-click, network retry)
    // must never create a second Razorpay order + DB order pair.
    if (idempotencyKey) {
      const existing = await prisma.order.findFirst({ where: { idempotencyKey } });
      if (existing?.razorpayOrderId) {
        if (existing.status === "PENDING_PAYMENT" || existing.status === "PAYMENT_FAILED") {
          // Still awaiting payment — safe to hand back the same Razorpay
          // order so the client can (re)open the same payment sheet.
          return NextResponse.json({
            ok: true,
            key: process.env.RAZORPAY_KEY_ID,
            razorpayOrderId: existing.razorpayOrderId,
            amount: rupeesToPaise(existing.total),
            reference: existing.reference,
            dbOrderId: existing.id,
            total: existing.total,
          });
        }
        // Already confirmed (e.g. the webhook beat this retry to it) —
        // never reopen a payment sheet for an order that's already paid.
        return NextResponse.json({
          ok: true,
          alreadyConfirmed: true,
          reference: existing.reference,
          total: existing.total,
        });
      }
    }

    const address = validateShippingAddress(shippingAddress);
    const { items, total } = await resolveCartItems(cart);

    const amountPaise = rupeesToPaise(total);
    if (amountPaise < 100) {
      return NextResponse.json({ error: "Order amount is too small to process." }, { status: 400 });
    }

    const reference = await createUniqueOrderReference();

    // Create the Razorpay order first — using OUR computed total, never
    // anything supplied by the client.
    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: reference,
      notes: { reference },
    });

    let order;
    try {
      order = await prisma.order.create({
        data: {
          reference,
          name: cleanName,
          contact: cleanContact,
          notes: notes ? String(notes).trim() : null,
          total,
          status: "PENDING_PAYMENT",
          paymentMethod: "ONLINE",
          shippingAddress: address,
          userId: session.userId,
          razorpayOrderId: razorpayOrder.id,
          idempotencyKey: idempotencyKey ? String(idempotencyKey) : null,
          items: { create: items },
        },
      });
    } catch (dbErr) {
      // The Razorpay order now exists with nothing referencing it locally.
      // No payment can complete against it without the client receiving
      // razorpayOrder.id below, so it's inert — but log it so it's not a
      // silent mystery if someone reconciles the Razorpay dashboard later.
      console.error(
        `⚠️ DB order creation failed after Razorpay order ${razorpayOrder.id} was created (reference ${reference}):`,
        dbErr
      );
      throw dbErr;
    }

    return NextResponse.json({
      ok: true,
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      reference,
      dbOrderId: order.id,
      total,
    });
  } catch (err) {
    if (err instanceof OrderValidationError) {
      return NextResponse.json({ error: err.message, unavailable: err.unavailable }, { status: err.status });
    }
    console.error("Razorpay create-order error:", err);
    return NextResponse.json({ error: "Failed to start payment. Please try again." }, { status: 500 });
  }
}
