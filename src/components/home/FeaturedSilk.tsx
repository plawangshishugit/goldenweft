import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { getFeaturedProducts } from "@/lib/queries/products";

export default async function FeaturedSilks() {
  const products = await getFeaturedProducts(6);
  if (products.length === 0) return null;

  return (
    <section
      style={{ padding: "var(--space-section) 0", borderTop: "1px solid var(--color-border)" }}
    >
      {/* ── Header — centered, editorial ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mx-auto mb-16 reveal" style={{ maxWidth: "40rem" }}>
          <p className="eyebrow mb-5">Editor&apos;s Selection</p>
          <h2
            className="font-serif"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              fontWeight: 300,
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
              marginBottom: "1.25rem",
            }}
          >
            Featured Silks
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              color: "var(--ink-muted)",
              lineHeight: 1.7,
            }}
          >
            Timeless Bhagalpuri weaves chosen for craftsmanship, elegance, and enduring value.
          </p>
        </div>
      </div>

      {/* ── Product grid — full bleed, hairline gutters ── */}
      <div
        className="grid grid-cols-2 lg:grid-cols-3 gap-px"
        style={{
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          background: "var(--color-border)",
        }}
      >
        {products.map((product, i) => (
          <div
            key={product.slug}
            className={`reveal reveal-delay-${Math.min(i + 1, 4)} px-3 pb-3`}
            style={{ background: "var(--paper)" }}
          >
            <ProductCard
              product={{
                id: product.slug,
                name: product.name,
                fabric: product.fabric as "Tussar" | "Ghicha" | "Mulberry",
                weight: product.weight as "Light" | "Medium" | "Heavy",
                style: product.style as "Traditional" | "Contemporary" | "Elegant",
                tier: product.tier as "Everyday" | "Occasion" | "Heirloom",
                tones: product.tones,
                occasions: product.occasions,
                isNew: product.isNew,
                price: product.price,
                images: product.images,
              }}
            />
          </div>
        ))}
      </div>

      {/* ── View all ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <div style={{ marginTop: "4rem" }} className="reveal text-center">
          <Link
            href="/collections"
            className="inline-flex items-center gap-3 group transition-opacity hover:opacity-50 duration-300"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--ink)",
            }}
          >
            View all silks
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
