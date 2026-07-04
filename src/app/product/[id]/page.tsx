import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductGallery from "@/components/product/ProductGallery";
import AddToWishlistButton from "@/components/product/AddToWishlistButton";
import AddToCartActions from "@/components/cart/AddToCartActions";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { slug: id } });
  if (!product) return notFound();

  const productForComponents = {
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
    stock: product.stock,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      {/* ── Breadcrumb ── */}
      <div style={{ borderBottom: "1px solid var(--color-border)", background: "var(--paper)" }}>
        <div
          className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16"
          style={{ paddingTop: "1rem", paddingBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}
        >
          {[
            { href: "/", label: "Home" },
            { href: "/collections", label: "Collections" },
            { href: null, label: product.name },
          ].map((crumb, i, arr) => (
            <span key={crumb.label} className="flex items-center gap-0.5" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {i > 0 && (
                <span style={{ color: "var(--color-border-mid)", fontFamily: "var(--font-body)", fontSize: "0.7rem" }}>/</span>
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="transition-opacity hover:opacity-50 duration-300"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--ink-muted)",
                  }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--ink)",
                  }}
                >
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main product layout ── */}
      <div
        className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16"
        style={{ paddingTop: "5rem", paddingBottom: "8rem" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* ── Left: Gallery ── */}
          <ProductGallery
            images={product.images}
            productName={product.name}
            fabric={product.fabric}
            tier={product.tier}
            isNew={product.isNew}
          />

          {/* ── Right: Details ── */}
          <div className="flex flex-col justify-center">
            {/* Eyebrow */}
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
              <span style={{ width: "28px", height: "1px", background: "var(--gold)", display: "inline-block" }} />
              {product.fabric} · {product.weight} drape
            </p>

            {/* Name */}
            <h1
              className="font-serif"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                fontWeight: 300,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "var(--ink)",
                marginBottom: "1.25rem",
              }}
            >
              {product.name}
            </h1>

            {/* Price */}
            {typeof product.price === "number" && (
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.5rem",
                  fontWeight: 300,
                  color: "var(--ink)",
                  marginBottom: "1.75rem",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.75rem",
                }}
              >
                ₹{product.price.toLocaleString("en-IN")}
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--ink-muted)", letterSpacing: "0.06em" }}>
                  incl. of all taxes
                </span>
              </div>
            )}

            {/* Stock indicator */}
            <div style={{ marginBottom: "1.75rem" }}>
              {product.stock <= 0 ? (
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#dc2626",
                  }}
                >
                  Currently out of stock
                </span>
              ) : product.stock <= 5 ? (
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                  }}
                >
                  Only {product.stock} left — this piece is handwoven in limited numbers
                </span>
              ) : null}
            </div>

            {/* Description */}
            {product.description && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: "var(--ink-mid)",
                  lineHeight: 1.85,
                  marginBottom: "2rem",
                }}
              >
                {product.description}
              </p>
            )}

            {/* Hairline separator */}
            <div style={{ height: "1px", background: "var(--color-border)", marginBottom: "2rem" }} />

            {/* Attribute grid */}
            <div className="grid grid-cols-2 gap-y-5 gap-x-6" style={{ marginBottom: "2.5rem" }}>
              {[
                { label: "Fabric",     value: product.fabric },
                { label: "Weight",     value: `${product.weight} drape` },
                { label: "Style",      value: product.style },
                { label: "Investment", value: product.tier },
              ].map((attr) => (
                <div key={attr.label}>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--ink-muted)",
                      marginBottom: "0.375rem",
                    }}
                  >
                    {attr.label}
                  </p>
                  <p
                    className="font-serif"
                    style={{ fontSize: "0.975rem", fontWeight: 400, color: "var(--ink)" }}
                  >
                    {attr.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Add to cart */}
            <AddToCartActions product={productForComponents} />

            {/* Wishlist */}
            <div style={{ marginTop: "1rem" }}>
              <AddToWishlistButton product={productForComponents} />
            </div>

            {/* Why this silk */}
            <div
              style={{
                marginTop: "2.5rem",
                padding: "1.75rem",
                border: "1px solid var(--color-border)",
                background: "var(--paper-soft)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.25rem" }}>
                <div style={{ width: "24px", height: "1px", background: "var(--gold)" }} />
                <h3
                  className="font-serif"
                  style={{ fontSize: "1rem", fontWeight: 400, color: "var(--ink)" }}
                >
                  Why this silk works
                </h3>
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {[
                  `Suitable for ${product.occasions.join(", ")}`,
                  `Complements ${product.tones.join(" & ")} undertones`,
                  `Style: ${product.style}`,
                  `Investment level: ${product.tier}`,
                ].map((point) => (
                  <li
                    key={point}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.82rem",
                      color: "var(--ink-mid)",
                      lineHeight: 1.65,
                    }}
                  >
                    <span style={{ color: "var(--gold)", marginTop: "0.35rem", flexShrink: 0, fontSize: "0.5rem" }}>◆</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Craft note */}
            <div
              style={{
                marginTop: "1.5rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--color-border)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  color: "var(--ink-muted)",
                  lineHeight: 1.85,
                }}
              >
                This silk is handwoven in Bhagalpur using traditional looms.
                Natural texture variations are not flaws — they are the signature of the artisan who wove it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
