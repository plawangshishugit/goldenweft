import { NextResponse } from "next/server";
import { checkCartAvailability } from "@/lib/orders";

/**
 * Read-only, side-effect-free cart availability check — current price,
 * current stock, and whether each line is still purchasable at its
 * requested quantity. Used by the cart page to show live warnings before
 * the customer ever reaches checkout. This never commits or reserves
 * anything; the atomic check at actual order-confirmation time
 * (src/lib/orders.ts#decrementStockForItems) remains the real guarantee
 * against overselling.
 */
export async function POST(req: Request) {
  try {
    const { cart } = await req.json();
    const result = await checkCartAvailability(cart);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Cart validation error:", err);
    return NextResponse.json({ error: "Could not check cart availability." }, { status: 500 });
  }
}
