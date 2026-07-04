"use client";

import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "@/lib/wishlist";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/products";

export default function WishlistPage() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => { setItems(getWishlist()); }, []);

  const remove = (id: string) => {
    removeFromWishlist(id);
    setItems(getWishlist());
  };

  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <div style={{ background: "#fff", padding: "5rem 1.5rem 3rem", borderBottom: "1px solid #e8e8e8" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4 mb-5">
            <div style={{ height: "1px", width: "32px", background: "var(--gold)" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)" }}>
              Your Curation
            </span>
          </div>
          <h1 className="font-serif" style={{ fontSize: "clamp(2.5rem,5vw,4rem)", lineHeight: 1.05, color: "#0a0a0a", fontWeight: 300 }}>
            Your Wishlist
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-16">
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "8rem 0" }}>
            <p className="font-serif" style={{ fontSize: "1.3rem", fontStyle: "italic", color: "var(--ink-muted)", marginBottom: "1.5rem" }}>
              You haven't saved any silks yet.
            </p>
            <Link href="/collections" className="btn-ghost">Explore Collections</Link>
          </div>
        ) : (
          <>
            <div style={{ maxWidth: "42rem", display: "flex", flexDirection: "column", gap: "1px", background: "#e8e8e8", marginBottom: "3rem" }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{ background: "#fff", padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}
                >
                  {/* Thumbnail — clickable */}
                  <Link
                    href={`/product/${item.id}`}
                    style={{ flexShrink: 0, display: "block", transition: "opacity 250ms" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                  >
                    {item.images?.[0] ? (
                      <div style={{ width: "64px", height: "80px", position: "relative", overflow: "hidden", background: "#EBEBEB" }}>
                        <Image src={item.images[0]} alt={item.name} fill className="object-cover" sizes="64px" />
                      </div>
                    ) : (
                      <div style={{ width: "64px", height: "80px", background: "#EBEBEB" }} />
                    )}
                  </Link>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Name — clickable */}
                    <Link
                      href={`/product/${item.id}`}
                      style={{ display: "block", marginBottom: "0.25rem", transition: "opacity 250ms" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.5")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                    >
                      <h3 className="font-serif" style={{ fontSize: "1rem", fontWeight: 400, color: "#0a0a0a" }}>
                        {item.name}
                      </h3>
                    </Link>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#888" }}>
                      {item.fabric} · {item.weight} drape
                    </p>
                    {typeof item.price === "number" && (
                      <p className="font-serif" style={{ fontSize: "0.875rem", color: "var(--gold)", marginTop: "0.25rem" }}>
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", alignItems: "flex-end", flexShrink: 0 }}>
                    <Link
                      href={`/product/${item.id}`}
                      style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#0a0a0a", transition: "opacity 200ms" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.4")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                    >
                      View
                    </Link>
                    <button
                      onClick={() => remove(item.id)}
                      style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#bbb", background: "none", border: "none", cursor: "pointer", transition: "color 200ms" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#e53e3e")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#bbb")}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ paddingTop: "2rem", borderTop: "1px solid #e8e8e8" }}>
              <Link
                href="/inquiry"
                className="inline-flex items-center gap-3 group"
                style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#0a0a0a", transition: "opacity 200ms" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.5")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              >
                Discuss these with an advisor
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}