import { requireUserAuth } from "./_components/UserAuth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ORDER_STATUS_META, normalizeStatus, isCustomerCancellable } from "@/lib/orderStatus";
import CancelOrderButton from "./_components/CancelOrderButton";

export default async function AccountPage() {
  const user = await requireUserAuth();

  // Orders placed while logged in are linked by userId; orders placed as a
  // guest (before creating an account, or checking out with a phone number
  // instead of an email) are matched by contact — checking both means
  // nothing gets "lost" from a customer's order history.
  const orders = await prisma.order.findMany({
    where: { OR: [{ contact: user.email }, { userId: user.userId }] },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Fetch full user profile
  const profile = await prisma.user.findUnique({
    where: { email: user.email },
    select: { name: true, email: true, phone: true, createdAt: true },
  });

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "3rem 2rem 5rem" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "3rem", borderBottom: "1px solid #e8e8e8", paddingBottom: "2rem" }}>
        <div>
          <p style={{ fontFamily: "var(--font-body, var(--font-sans))", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#999", marginBottom: "0.4rem" }}>
            My Account
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 400, color: "#0a0a0a", letterSpacing: "0.04em" }}>
            Welcome, {profile?.name}
          </h1>
        </div>

        <a
          href="/api/user/logout"
          style={{
            fontFamily: "var(--font-body, var(--font-sans))",
            fontSize: "0.65rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#999",
            textDecoration: "none",
            border: "1px solid #e8e8e8",
            padding: "0.5rem 1rem",
            transition: "all 200ms",
          }}
        >
          Sign Out
        </a>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "start" }}>

        {/* ── Left: Profile Card ── */}
        <div>
          <p style={{ fontFamily: "var(--font-body, var(--font-sans))", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#999", marginBottom: "1rem" }}>
            Profile
          </p>

          <div style={{ border: "1px solid #e8e8e8", padding: "1.5rem" }}>
            {/* Avatar initial */}
            <div style={{
              width: "52px", height: "52px", borderRadius: "50%",
              background: "#0a0a0a", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 500,
              marginBottom: "1.25rem",
            }}>
              {profile?.name?.charAt(0).toUpperCase()}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div>
                <p style={{ fontFamily: "var(--font-body, var(--font-sans))", fontSize: "0.55rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#bbb", marginBottom: "0.2rem" }}>Name</p>
                <p style={{ fontFamily: "var(--font-body, var(--font-sans))", fontSize: "0.82rem", color: "#0a0a0a" }}>{profile?.name}</p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-body, var(--font-sans))", fontSize: "0.55rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#bbb", marginBottom: "0.2rem" }}>Email</p>
                <p style={{ fontFamily: "var(--font-body, var(--font-sans))", fontSize: "0.82rem", color: "#0a0a0a", wordBreak: "break-all" }}>{profile?.email}</p>
              </div>
              {profile?.phone && (
                <div>
                  <p style={{ fontFamily: "var(--font-body, var(--font-sans))", fontSize: "0.55rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#bbb", marginBottom: "0.2rem" }}>Phone</p>
                  <p style={{ fontFamily: "var(--font-body, var(--font-sans))", fontSize: "0.82rem", color: "#0a0a0a" }}>{profile?.phone}</p>
                </div>
              )}
              <div>
                <p style={{ fontFamily: "var(--font-body, var(--font-sans))", fontSize: "0.55rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#bbb", marginBottom: "0.2rem" }}>Member Since</p>
                <p style={{ fontFamily: "var(--font-body, var(--font-sans))", fontSize: "0.82rem", color: "#0a0a0a" }}>
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long" }) : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { href: "/wishlist", label: "My Wishlist" },
              { href: "/collections", label: "Browse Collections" },
              { href: "/find-your-silk", label: "Silk Advisor" },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{
                fontFamily: "var(--font-body, var(--font-sans))",
                fontSize: "0.72rem",
                letterSpacing: "0.06em",
                color: "#0a0a0a",
                textDecoration: "none",
                padding: "0.6rem 0",
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                {link.label}
                <span style={{ color: "#bbb", fontSize: "0.65rem" }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Right: Order History ── */}
        <div>
          <p style={{ fontFamily: "var(--font-body, var(--font-sans))", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#999", marginBottom: "1rem" }}>
            Order History
          </p>

          {orders.length === 0 ? (
            <div style={{ border: "1px solid #e8e8e8", padding: "3rem", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", color: "#0a0a0a", marginBottom: "0.75rem" }}>
                No orders yet
              </p>
              <p style={{ fontFamily: "var(--font-body, var(--font-sans))", fontSize: "0.75rem", color: "#999", marginBottom: "1.5rem" }}>
                Discover our collection of handwoven Bhagalpuri silks.
              </p>
              <Link href="/collections" style={{
                fontFamily: "var(--font-body, var(--font-sans))",
                fontSize: "0.65rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#fff",
                background: "#0a0a0a",
                padding: "0.75rem 1.5rem",
                textDecoration: "none",
              }}>
                Shop Now
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {orders.map((order) => (
                <div key={order.id} style={{ border: "1px solid #e8e8e8", padding: "1.25rem 1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-body, var(--font-sans))", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.06em", color: "#0a0a0a" }}>
                        {order.reference}
                      </p>
                      <p style={{ fontFamily: "var(--font-body, var(--font-sans))", fontSize: "0.65rem", color: "#999", marginTop: "0.2rem" }}>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {(() => {
                        const meta = ORDER_STATUS_META[normalizeStatus(order.status)];
                        return (
                          <span style={{
                            fontFamily: "var(--font-body, var(--font-sans))",
                            fontSize: "0.55rem",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: meta.textColor,
                            background: meta.bgColor,
                            padding: "0.25rem 0.6rem",
                          }}>
                            {meta.label}
                          </span>
                        );
                      })()}
                      <span style={{ fontFamily: "var(--font-body, var(--font-sans))", fontSize: "0.82rem", fontWeight: 500, color: "#0a0a0a" }}>
                        ₹{order.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <p style={{ fontFamily: "var(--font-body, var(--font-sans))", fontSize: "0.7rem", color: "#666", marginBottom: "0.75rem" }}>
                      Tracking: <span style={{ color: "#0a0a0a" }}>{order.trackingNumber}</span>{order.courierName ? ` via ${order.courierName}` : ""}
                    </p>
                  )}

                  <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "0.75rem" }}>
                    {order.items.map((item, i) => (
                      <div key={item.id} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontFamily: "var(--font-body, var(--font-sans))",
                        fontSize: "0.72rem",
                        color: "#666",
                        padding: "0.2rem 0",
                        borderBottom: i < order.items.length - 1 ? "1px solid #f8f8f8" : "none",
                      }}>
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>

                  {isCustomerCancellable(order.status) && (
                    <div style={{ borderTop: "1px solid #f0f0f0", marginTop: "0.75rem", paddingTop: "0.75rem", display: "flex", justifyContent: "flex-end" }}>
                      <CancelOrderButton orderId={order.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
