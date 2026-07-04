"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart, getCart, unlockCart } from "@/lib/cart";
import { Product } from "@/lib/products";

export default function AddToCartActions({ product }: { product: Product }) {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const outOfStock = typeof product.stock === "number" && product.stock <= 0;

  useEffect(() => { unlockCart(); }, []);
  useEffect(() => {
    const cart = getCart();
    setAdded(cart.some((item) => item.productId === product.id));
  }, [product.id]);

  function handleAddToCart() {
    if (added || outOfStock) return;
    addToCart({ productId: product.id, name: product.name, price: product.price ?? 0, image: product.images?.[0] });
    setAdded(true); setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  function handleBuyNow() {
    if (outOfStock) return;
    if (!getCart().some((i) => i.productId === product.id))
      addToCart({ productId: product.id, name: product.name, price: product.price ?? 0, image: product.images?.[0] });
    setTimeout(() => router.push("/cart"), 0);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        {/* Add to Cart — ghost */}
        <button
          onClick={handleAddToCart}
          disabled={added || outOfStock}
          className={added || outOfStock ? "" : "btn-ghost"}
          style={added || outOfStock ? {
            flex: 1, padding: "0.9rem", fontFamily: "var(--font-body)",
            fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase",
            border: "1px solid #e8e8e8", background: "#f4f4f4", color: "#aaa",
            cursor: "default",
          } : { flex: 1 }}
        >
          {justAdded ? (
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Added
            </span>
          ) : outOfStock ? "Out of Stock" : added ? "Already in Cart" : "Add to Cart"}
        </button>

        {/* Buy Now — primary */}
        <button
          onClick={handleBuyNow}
          disabled={outOfStock}
          className="btn-primary"
          style={{ flex: 1, opacity: outOfStock ? 0.5 : 1, cursor: outOfStock ? "default" : "pointer" }}
        >
          {outOfStock ? "Out of Stock" : "Buy Now"}
        </button>
      </div>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "var(--ink-muted)", textAlign: "center", letterSpacing: "0.04em" }}>
        Review your order before confirming payment.
      </p>
    </div>
  );
}