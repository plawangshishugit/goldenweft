"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Product } from "@/lib/products";
import AddToWishlistButton from "@/components/product/AddToWishlistButton";
import { addToCart } from "@/lib/cart";
import { useRouter } from "next/navigation";

export default function AdvisorProductCard({
  product,
  reasons,
  confidence,
  highlight = false,
}: {
  product: Product;
  reasons: string[];
  confidence: number;
  highlight?: boolean;
}) {
  const router = useRouter();
  const advisorSessionIdRef = useRef<string | null>(null);
  useEffect(() => { advisorSessionIdRef.current = localStorage.getItem("advisorSessionId"); }, []);

  function track(type: "advisor_click" | "inquiry") {
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true, body: JSON.stringify({ type, productId: product.id, advisorSessionId: advisorSessionIdRef.current }) }).catch(() => {});
  }

  const image = product.images?.[0];

  return (
    <div className={`border p-8 transition-all duration-400 card-lift relative overflow-hidden ${highlight ? "border-[var(--color-gold)] bg-white shadow-[0_4px_30px_rgba(184,145,47,0.08)]" : "border-[var(--color-border)] bg-white"}`}>
      {highlight && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--color-gold)]" />
      )}

      <div className="flex gap-6">
        {/* Thumbnail */}
        <Link
          href={`/product/${product.id}`}
          onClick={() => track("advisor_click")}
          className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 relative overflow-hidden border border-[var(--color-border)] bg-[var(--color-ivory-deep)]"
        >
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="112px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[0.55rem] tracking-[0.18em] uppercase text-[var(--ink-muted)]">
                {product.fabric}
              </span>
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-serif text-[1.3rem] leading-snug text-[var(--color-charcoal)]">{product.name}</h3>
            <div className="flex-shrink-0 flex flex-col items-end gap-1">
              <span className={`text-[0.6rem] tracking-[0.18em] uppercase px-2.5 py-1 ${highlight ? "btn-primary-gold" : "border border-[var(--color-border)] text-[var(--ink-mid)]"}`}>
                {confidence}% match
              </span>
              {highlight && <span className="text-[0.55rem] tracking-[0.15em] uppercase text-[var(--color-gold)]">Top Pick</span>}
            </div>
          </div>

          {/* Meta */}
          <p className="text-[0.8rem] text-[var(--ink-muted)] mb-1">
            {product.fabric} · {product.weight} drape · {product.style}
            {typeof product.price === "number" && (
              <span className="ml-2 font-serif text-[var(--color-charcoal)]">· ₹{product.price.toLocaleString("en-IN")}</span>
            )}
          </p>
        </div>
      </div>

      {/* Reasons */}
      {reasons.length > 0 && (
        <div className="mt-5 mb-6 space-y-2">
          {reasons.map((r, i) => (
            <div key={i} className="flex items-start gap-2.5 text-[0.82rem] text-[var(--ink-mid)]">
              <span className="text-[var(--color-gold)] mt-1 flex-shrink-0 text-[0.6rem]">◆</span>
              {r}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-5 mt-5 border-t border-[var(--color-border)]">
        {/* View Details — gold accent, primary action */}
        <Link
          href={`/product/${product.id}`}
          onClick={() => track("advisor_click")}
          style={{
            padding: "0.6rem 1.25rem",
            border: "1px solid var(--gold)",
            fontFamily: "var(--font-body)",
            fontSize: "0.7rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--gold)",
            background: "#fff",
            transition: "background 220ms, color 220ms",
            display: "inline-block",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--gold)"; el.style.color = "#fff"; }}
          onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "#fff"; el.style.color = "var(--gold)"; }}
        >
          View Details
        </Link>

        {/* Talk to Advisor — ghost */}
        <button
          onClick={() => { track("inquiry"); window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello GoldenWeft,\n\nI am interested in:\n${product.name}\n\nPlease guide me.`)}`, "_blank"); }}
          style={{
            padding: "0.6rem 1.25rem",
            border: "1px solid #e8e8e8",
            fontFamily: "var(--font-body)",
            fontSize: "0.7rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#0a0a0a",
            background: "#fff",
            cursor: "pointer",
            transition: "border-color 220ms",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e8e8e8"; }}
        >
          Talk to Advisor
        </button>

        <AddToWishlistButton product={product} />

        {/* Add to Cart — ghost, disabled when out of stock */}
        {(() => {
          const outOfStock = typeof product.stock === "number" && product.stock <= 0;
          return (
            <button
              onClick={() => {
                if (outOfStock) return;
                addToCart({ productId: product.id, name: product.name, price: product.price ?? 0, image: product.images?.[0] });
                router.push("/cart");
              }}
              disabled={outOfStock}
              style={{
                padding: "0.6rem 1.25rem",
                border: outOfStock ? "1px solid #e8e8e8" : "1px solid #0a0a0a",
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: outOfStock ? "#aaa" : "#0a0a0a",
                background: "#fff",
                cursor: outOfStock ? "default" : "pointer",
                transition: "background 220ms, color 220ms",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { if (outOfStock) return; const el = e.currentTarget as HTMLElement; el.style.background = "#0a0a0a"; el.style.color = "#fff"; }}
              onMouseLeave={(e) => { if (outOfStock) return; const el = e.currentTarget as HTMLElement; el.style.background = "#fff"; el.style.color = "#0a0a0a"; }}
            >
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          );
        })()}
      </div>
    </div>
  );
}