import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import PageHero from "@/components/hero/PageHero";

export default async function CollectionsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      {/* ── Page hero (set via admin/hero) ── */}
      <PageHero page="/collections" minHeight="60vh" />

      {/* ── Editorial page header ── */}
      <div style={{ background: "var(--paper)", padding: "6rem 0 5rem", borderBottom: "1px solid var(--color-border)" }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.6rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--gold)",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ width: "32px", height: "1px", background: "var(--gold)", display: "inline-block" }} />
            All Weaves
          </p>
          <h1
            className="font-serif"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              fontWeight: 300,
              lineHeight: 0.97,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
            }}
          >
            Silk Collections
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9375rem",
              color: "var(--ink-mid)",
              maxWidth: "36rem",
              lineHeight: 1.75,
              marginTop: "1.5rem",
            }}
          >
            Handwoven silks curated across fabrics, occasions, and styles.
            Each piece carries the legacy of Bhagalpur&apos;s handloom artisans.
          </p>
        </div>
      </div>

      {/* ── Gold thread separator ── */}
      <div style={{ height: "1px", background: "var(--gold)", opacity: 0.4 }} />

      {/* ── Grid ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16" style={{ paddingTop: "4rem", paddingBottom: "8rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "3rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "var(--ink-muted)",
              letterSpacing: "0.05em",
            }}
          >
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              product={{
                id: product.slug,
                name: product.name,
                fabric: product.fabric as "Tussar" | "Ghicha" | "Mulberry",
                weight: product.weight as "Light" | "Medium" | "Heavy",
                style: product.style as "Traditional" | "Contemporary" | "Elegant",
                tier: product.tier as "Everyday" | "Occasion" | "Heirloom",
                tones: product.tones ?? [],
                occasions: product.occasions ?? [],
                isNew: product.isNew,
                price: product.price,
                images: product.images,
              }}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: "8rem", paddingBottom: "8rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--ink-muted)" }}>
              No collections available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}