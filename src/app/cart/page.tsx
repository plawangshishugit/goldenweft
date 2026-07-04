"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCart, removeFromCart, clearCart, CartItem, updateCartQuantity } from "@/lib/cart";

type AvailabilityInfo = { stock: number; available: boolean; price: number };

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [availability, setAvailability] = useState<Record<string, AvailabilityInfo>>({});
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = still checking
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const update = () => setCart(getCart());
    update();
    window.addEventListener("gw-cart-update", update);
    return () => window.removeEventListener("gw-cart-update", update);
  }, []);

  // Checkout requires an account — checked here purely so the button
  // below can say so upfront, rather than the customer filling in the
  // whole checkout page and only then being redirected to sign in. The
  // checkout page and its API routes enforce this regardless.
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();
        setIsLoggedIn(!!data.user);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
    window.addEventListener("gw-user-update", checkAuth);
    return () => window.removeEventListener("gw-user-update", checkAuth);
  }, []);

  // Live stock/price check — informational only. The real guarantee
  // against overselling is the atomic check at checkout; this just lets
  // the customer see "only 2 left" before they get there, instead of
  // being surprised on the checkout page.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (cart.length === 0) {
      setAvailability({});
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/cart/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })) }),
        });
        if (!res.ok) return;
        const data = await res.json();
        const map: Record<string, AvailabilityInfo> = {};
        for (const item of data.items ?? []) {
          map[item.productId] = { stock: item.stock, available: item.available, price: item.price };
        }
        setAvailability(map);
      } catch {
        // Purely informational — a failed check just means no warnings
        // are shown yet. Checkout re-validates for real regardless.
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [cart]);

  function updateQuantity(productId: string, delta: number) {
    const item = cart.find((i) => i.productId === productId);
    if (!item) return;
    updateCartQuantity(productId, item.quantity + delta);
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const hasUnavailable = cart.some((item) => availability[item.productId]?.available === false);

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "28rem", padding: "0 1.5rem" }}>
          <div style={{ width: "48px", height: "48px", margin: "0 auto 2rem", opacity: 0.15 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <h1 className="font-serif" style={{ fontSize: "2.5rem", fontWeight: 300, color: "#0a0a0a", marginBottom: "1rem" }}>Your Cart</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--ink-muted)", marginBottom: "2.5rem", lineHeight: 1.7 }}>
            Your cart is empty. Discover our handwoven silks.
          </p>
          <Link href="/collections" style={{ display: "inline-block", padding: "0.9rem 2.5rem", border: "1px solid #0a0a0a", fontFamily: "var(--font-body)", fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#0a0a0a" }}>
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Breadcrumb */}
      <div style={{ borderBottom: "1px solid #e8e8e8" }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16"
          style={{ paddingTop: "1rem", paddingBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {[{ href: "/", label: "Home" }, { href: null, label: "Cart" }].map((crumb, i) => (
            <span key={crumb.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {i > 0 && <span style={{ color: "#ccc", fontSize: "0.7rem" }}>/</span>}
              {crumb.href
                ? <Link href={crumb.href} style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#888" }}>{crumb.label}</Link>
                : <span style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0a0a0a" }}>{crumb.label}</span>
              }
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16" style={{ paddingTop: "4rem", paddingBottom: "8rem" }}>
        {/* Heading */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
          <div style={{ width: "28px", height: "1px", background: "var(--gold)" }} />
          <h1 className="font-serif" style={{ fontSize: "2.5rem", fontWeight: 300, color: "#0a0a0a" }}>Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
          {/* Cart items — no gap wrapper, just hairline borders */}
          <div className="lg:col-span-2">
            {cart.map((item, idx) => {
              const info = availability[item.productId];
              const atMax = typeof info?.stock === "number" && item.quantity >= info.stock;
              return (
              <div
                key={item.productId}
                style={{
                  background: "#fff",
                  padding: "1.5rem 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  borderTop: idx === 0 ? "1px solid #e8e8e8" : undefined,
                  borderBottom: "1px solid #e8e8e8",
                }}
              >
                {/* Thumbnail — clickable */}
                <Link
                  href={`/product/${item.productId}`}
                  style={{ flexShrink: 0, display: "block", transition: "opacity 250ms" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                >
                  {item.image ? (
                    <div style={{ width: "72px", height: "96px", position: "relative", overflow: "hidden", background: "#EBEBEB" }}>
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="72px"/>
                    </div>
                  ) : (
                    <div style={{ width: "72px", height: "96px", background: "#EBEBEB" }} />
                  )}
                </Link>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Name — clickable */}
                  <Link
                    href={`/product/${item.productId}`}
                    style={{ display: "block", marginBottom: "0.25rem", transition: "opacity 250ms" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.5")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                  >
                    <h3 className="font-serif" style={{ fontSize: "1rem", fontWeight: 400, color: "#0a0a0a" }}>
                      {item.name}
                    </h3>
                  </Link>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#888", marginBottom: "0.4rem" }}>
                    ₹{item.price.toLocaleString("en-IN")} per piece
                  </p>

                  {/* Live availability warning */}
                  {info && !info.available && (
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "#dc2626", marginBottom: "0.75rem" }}>
                      {info.stock <= 0 ? "No longer available" : `Only ${info.stock} left — reduce quantity to continue`}
                    </p>
                  )}
                  {info && info.available && info.stock <= 5 && (
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "var(--gold)", marginBottom: "0.75rem" }}>
                      Only {info.stock} left
                    </p>
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {[{ symbol: "−", delta: -1 }, { symbol: "+", delta: +1 }].map(({ symbol, delta }) => {
                      const disabled = delta > 0 && atMax;
                      return (
                        <button
                          key={symbol}
                          onClick={() => !disabled && updateQuantity(item.productId, delta)}
                          disabled={disabled}
                          style={{
                            width: "28px", height: "28px", border: "1px solid #e8e8e8", display: "flex",
                            alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)",
                            fontSize: "0.875rem", color: disabled ? "#ccc" : "#0a0a0a", background: "#fff",
                            cursor: disabled ? "default" : "pointer", transition: "border-color 200ms",
                          }}
                          onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.borderColor = "var(--gold)"; }}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e8e8e8")}
                        >{symbol}</button>
                      );
                    })}
                    <span className="font-serif" style={{ fontSize: "1rem", width: "1.5rem", textAlign: "center", color: "#0a0a0a" }}>{item.quantity}</span>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      style={{ marginLeft: "0.75rem", fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", background: "none", border: "none", cursor: "pointer", transition: "color 200ms" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#0a0a0a")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
                    >Remove</button>
                  </div>
                </div>

                <div className="font-serif" style={{ fontSize: "1.05rem", fontWeight: 400, color: "#0a0a0a", flexShrink: 0 }}>
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </div>
              </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div style={{ border: "1px solid #e8e8e8", padding: "2.25rem", position: "sticky", top: "6rem" }}>
              <h2 className="font-serif" style={{ fontSize: "1.1rem", fontWeight: 400, color: "#0a0a0a", marginBottom: "1.75rem" }}>
                Order Summary
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #e8e8e8" }}>
                {cart.map((item) => (
                  <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                    <Link
                      href={`/product/${item.productId}`}
                      style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", transition: "color 200ms" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#0a0a0a")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#888")}
                    >
                      {item.name} × {item.quantity}
                    </Link>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "#0a0a0a", flexShrink: 0 }}>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.25rem" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#888" }}>Total</span>
                <span className="font-serif" style={{ fontSize: "1.5rem", fontWeight: 300, color: "#0a0a0a" }}>
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              {hasUnavailable && (
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "#dc2626", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                  One or more items need attention above before you can complete checkout.
                </p>
              )}

              {/* Checkout button — Prada style: border only, no fill.
                  Guests go straight to sign-in with a return path back
                  here, rather than being surprised by a redirect after
                  filling in the whole checkout form. */}
              <Link
                href={isLoggedIn === false ? "/login?redirect=/checkout" : "/checkout"}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "1rem",
                  border: "1px solid #0a0a0a",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#0a0a0a",
                  background: "#fff",
                  transition: "background 250ms, color 250ms",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#0a0a0a"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#fff"; (e.currentTarget as HTMLElement).style.color = "#0a0a0a"; }}
              >
                {isLoggedIn === false ? "Sign In to Checkout" : "Proceed to Checkout"}
              </Link>

              {isLoggedIn === false && (
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "#888", marginTop: "0.75rem", textAlign: "center", lineHeight: 1.6 }}>
                  An account is required to place an order — it's quick, and your cart will be right here.
                </p>
              )}

              <button
                onClick={() => clearCart()}
                style={{ marginTop: "1rem", width: "100%", padding: "0.75rem 0", fontFamily: "var(--font-body)", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", background: "none", border: "none", cursor: "pointer", transition: "color 200ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0a0a0a")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
