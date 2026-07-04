"use client";

import { useState } from "react";
import { Product } from "@/lib/products";
import { addToWishlist } from "@/lib/wishlist";

export default function AddToWishlistButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);

  async function handleAdd() {
    addToWishlist(product);
    setAdded(true);
    try {
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "wishlist", productId: product.id, advisorSessionId: localStorage.getItem("advisorSessionId") }),
      });
    } catch {}
  }

  return (
    <button
      onClick={handleAdd}
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.5rem",
        fontFamily: "var(--font-body)", fontSize: "0.72rem",
        letterSpacing: "0.16em", textTransform: "uppercase",
        padding: "0.9rem 1.25rem",
        border: `1px solid ${added ? "var(--gold)" : "#e8e8e8"}`,
        background: added ? "rgba(155,123,54,0.04)" : "transparent",
        color: added ? "var(--gold)" : "#888",
        cursor: added ? "default" : "pointer",
        transition: "border-color 420ms, color 420ms, background 420ms",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => { if (!added) { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}}
      onMouseLeave={(e) => { if (!added) { (e.currentTarget as HTMLElement).style.borderColor = "#e8e8e8"; (e.currentTarget as HTMLElement).style.color = "#888"; }}}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill={added ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
      {added ? "Saved" : "Save to Wishlist"}
    </button>
  );
}