import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { STYLES, StyleKey } from "@/lib/styles";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";

export default async function StyleDetailPage({ params }: { params: Promise<{ style: string }> }) {
  const { style } = await params;
  const styleKey = style as StyleKey;
  const styleConfig = STYLES[styleKey];
  if (!styleConfig) return notFound();

  const products = await prisma.product.findMany({
    where: { isActive: true, style: styleConfig.dbValue },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <div style={{ background: "#fff", padding: "6rem 1.5rem 4rem", borderBottom: "1px solid #e8e8e8" }}>
        <div className="max-w-[1400px] mx-auto">
          <Link href="/styles" style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-mid)", marginBottom: "1.5rem", display: "inline-block", fontFamily: "var(--font-body)" }}>← All Styles</Link>
          <div className="flex items-center gap-4 mb-5">
            <div style={{ height: "1px", width: "32px", background: "var(--gold)" }} />
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", fontFamily: "var(--font-body)" }}>Style Edit</span>
          </div>
          <h1 className="font-serif" style={{ fontSize: "clamp(2.5rem,6vw,5rem)", lineHeight: 1.05, color: "#0a0a0a", fontWeight: 300 }}>{styleConfig.label}</h1>
          {styleConfig.description && (
            <p style={{ marginTop: "1.25rem", color: "var(--ink-mid)", maxWidth: "36rem", fontSize: "0.975rem", lineHeight: 1.75, fontFamily: "var(--font-body)" }}>{styleConfig.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-16">
        {products.length === 0 ? (
          <p style={{ color: "var(--ink-mid)", padding: "5rem 0", textAlign: "center", fontFamily: "var(--font-body)" }}>No products available in this style yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.slug} product={{ id: product.slug, name: product.name, fabric: product.fabric as any, weight: product.weight as any, style: product.style as any, tier: product.tier as any, tones: product.tones, occasions: product.occasions, isNew: product.isNew, price: product.price, images: product.images }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}