import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOptionalUserSession } from "@/app/account/_components/UserAuth";
import {
  OrderValidationError,
  InsufficientStockError,
  resolveCartItems,
  validateShippingAddress,
  createUniqueOrderReference,
  decrementStockForItems,
  restoreStockForItems,
} from "@/lib/orders";
import { sendAdminNewOrderEmail, sendCustomerOrderConfirmedEmail } from "@/lib/mail";

/**
 * Cash-on-delivery orders only. Online orders are created (and priced,
 * and stocked) by /api/payments/create — this route deliberately rejects
 * paymentMethod: "ONLINE" rather than silently accepting it, so the two
 * flows can never be confused for one another.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idempotencyKey, name, contact, notes, cart, shippingAddress, paymentMethod } = body as {
      idempotencyKey?: string;
      name?: string;
      contact?: string;
      notes?: string;
      cart?: unknown;
      shippingAddress?: unknown;
      paymentMethod?: string;
    };

    if (paymentMethod && paymentMethod !== "COD") {
      return NextResponse.json(
        { error: "Online orders must be created via /api/payments/create, not this endpoint." },
        { status: 400 }
      );
    }

    const cleanName = String(name ?? "").trim();
    const cleanContact = String(contact ?? "").trim();

    if (cleanName.length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (cleanContact.length < 5) {
      return NextResponse.json({ error: "Please enter a valid email or phone number." }, { status: 400 });
    }

    // Checkout requires a signed-in account — checked first, before any
    // cart/stock/reference work, so an unauthenticated request fails fast.
    const session = await getOptionalUserSession();
    if (!session) {
      return NextResponse.json({ error: "Please sign in to place an order.", requiresAuth: true }, { status: 401 });
    }

    // Replaying the same submit (double-click, network retry) returns the
    // order already created instead of placing a second one.
    if (idempotencyKey) {
      const existing = await prisma.order.findFirst({ where: { idempotencyKey } });
      if (existing) {
        return NextResponse.json({ ok: true, orderId: existing.id, reference: existing.reference, total: existing.total });
      }
    }

    const address = validateShippingAddress(shippingAddress);
    const { items, total } = await resolveCartItems(cart);
    const reference = await createUniqueOrderReference();

    // COD has no payment gate to wait for, so stock is committed now.
    await decrementStockForItems(items.map((i) => ({ productId: i.productId, quantity: i.quantity })));

    let order;
    try {
      order = await prisma.order.create({
        data: {
          reference,
          name: cleanName,
          contact: cleanContact,
          notes: notes ? String(notes).trim() : null,
          total,
          status: "CONFIRMED",
          paymentMethod: "COD",
          shippingAddress: address,
          userId: session.userId,
          idempotencyKey: idempotencyKey ? String(idempotencyKey) : null,
          confirmedAt: new Date(),
          items: { create: items },
        },
      });
    } catch (createErr) {
      // Stock was already committed above — don't leave it silently short
      // with no order to show for it.
      await restoreStockForItems(items.map((i) => ({ productId: i.productId, quantity: i.quantity })));
      throw createErr;
    }

    const mailItems = items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity }));
    const mailableOrder = { ...order, shippingAddress: address };
    await sendCustomerOrderConfirmedEmail(mailableOrder, mailItems);
    await sendAdminNewOrderEmail(mailableOrder, mailItems);

    return NextResponse.json({ ok: true, orderId: order.id, reference, total });
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      return NextResponse.json(
        {
          error: err.message,
          unavailable: [{ productId: err.productId, name: err.productName, requested: err.requested, available: err.available }],
        },
        { status: 409 }
      );
    }
    if (err instanceof OrderValidationError) {
      return NextResponse.json({ error: err.message, unavailable: err.unavailable }, { status: err.status });
    }
    console.error("❌ /api/orders error:", err);
    return NextResponse.json({ error: "Failed to place order. Please try again." }, { status: 500 });
  }
}
