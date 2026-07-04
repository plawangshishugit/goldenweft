import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";

export default async function NewArrivalsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isNew: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      <div className="bg-[var(--color-ivory)] py-28 px-6 md:px-12 lg:px-16 border-b border-[var(--color-border)]">
        <div className="max-w-[1400px] mx-auto">
          <Link href="/collections" className="text-[0.65rem] tracking-[0.18em] uppercase text-[var(--ink-muted)] hover:opacity-60 transition-colors duration-300 mb-6 inline-block">← All Collections</Link>
          <div className="flex items-center gap-4 mb-5">
            <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
            <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-gold)]">Fresh from the Loom</span>
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-tight text-[var(--color-charcoal)]">New Arrivals</h1>
          <p className="mt-5 text-[var(--ink-mid)] max-w-lg text-[0.975rem] leading-relaxed">Discover our latest silk additions — freshly woven, available in limited quantities.</p>
        </div>
      </div>
      <div style={{ height: "1px", background: "var(--gold)", opacity: 0.4 }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-16">
        {products.length === 0 ? (
          <p className="text-[var(--ink-mid)] py-20 text-center">No new arrivals at the moment. Check back soon.</p>
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
