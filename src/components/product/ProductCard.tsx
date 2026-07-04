import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/products";

type CardProduct = Product & { images?: string[] };

export default function ProductCard({ product }: { product: CardProduct }) {
  const image = product.images?.[0];

  return (
    <Link href={`/product/${product.id}`} className="group block">
      {/* ── Image frame — no border, no card, image IS the card ── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", background: "#EBEBEB" }}>
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover img-zoom"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          /* Elegant placeholder — woven grid motif */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div
              className="w-16 h-16 opacity-[0.12]"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent, transparent 3px, var(--ink) 3px, var(--ink) 4px),
                  repeating-linear-gradient(90deg, transparent, transparent 3px, var(--ink) 3px, var(--ink) 4px)
                `,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--ink-muted)",
              }}
            >
              {product.fabric}
            </span>
          </div>
        )}

        {/* ── Hover overlay — dark scrim + "View" text ── */}
        <div
          className="absolute inset-0 flex items-end justify-center pb-6 transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(13,11,9,0.55) 0%, transparent 60%)" }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--paper)",
              transform: "translateY(4px)",
              transition: "transform 400ms var(--ease-emerge)",
            }}
          >
            View Silk
          </span>
        </div>

        {/* ── "New" badge ── */}
        {product.isNew && (
          <div
            className="absolute top-3 left-3"
            style={{
              background: "var(--gold)",
              color: "var(--paper)",
              fontFamily: "var(--font-body)",
              fontSize: "0.52rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "0.3rem 0.6rem",
            }}
          >
            New
          </div>
        )}

        {/* ── Tier label — clean, no colour ── */}
        {product.tier && !product.isNew && (
          <div
            className="absolute top-3 left-3"
            style={{
              background: "var(--paper)",
              color: "var(--ink)",
              fontFamily: "var(--font-body)",
              fontSize: "0.52rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "0.3rem 0.6rem",
            }}
          >
            {product.tier}
          </div>
        )}
      </div>

      {/* ── Product info — minimal, editorial ── */}
      <div style={{ paddingTop: "1.125rem" }}>
        <div className="flex items-start justify-between gap-3">
          <h3
            className="transition-opacity duration-300 group-hover:opacity-50"
            style={{ fontSize: "0.85rem", fontWeight: 400, lineHeight: 1.4, color: "#0a0a0a", fontFamily: "var(--font-body)" }}
          >
            {product.name}
          </h3>
          {typeof product.price === "number" && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--ink)",
                flexShrink: 0,
                marginTop: "0.125rem",
              }}
            >
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            color: "var(--ink-muted)",
            marginTop: "0.35rem",
            letterSpacing: "0.02em",
          }}
        >
          {product.fabric}
          {product.weight ? ` · ${product.weight} drape` : ""}
        </p>
      </div>
    </Link>
  );
}