import { redirect } from "next/navigation";
import { getOptionalUserSession } from "@/app/account/_components/UserAuth";
import { prisma } from "@/lib/prisma";
import CheckoutForm from "./CheckoutForm";

/**
 * Checkout now requires a signed-in account. This is the actual
 * enforcement point for page navigation — anyone without a valid session
 * is sent to /login with a return path straight back here, and their
 * cart (stored in localStorage) is untouched in the meantime.
 *
 * This alone is a UX convenience, not the real security boundary — the
 * order-creation API routes (/api/orders, /api/payments/create) enforce
 * the same requirement independently, since someone could otherwise call
 * them directly without ever loading this page.
 */
export default async function CheckoutPage() {
  const session = await getOptionalUserSession();
  if (!session) {
    redirect("/login?redirect=/checkout");
  }

  // Pull the latest profile info (not just what's in the JWT) so the
  // form can be pre-filled with a saved phone number too, if there is one.
  const profile = await prisma.user.findUnique({
    where: { email: session.email },
    select: { name: true, email: true, phone: true },
  });

  return (
    <CheckoutForm
      userName={profile?.name ?? session.name}
      userEmail={profile?.email ?? session.email}
      userPhone={profile?.phone ?? undefined}
    />
  );
}
