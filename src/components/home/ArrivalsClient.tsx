"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/products";

type ArrivalProduct = Product & { slug: string };

const TABS = ["All", "Mulberry", "Tussar", "Ghicha"] as const;

export default function ArrivalsClient({ products }: { products: ArrivalProduct[] }) {
  const [active, setActive] = useState<typeof TABS[number]>("All");

  const visible = active === "All" ? products : products.filter((p) => p.fabric === active);

  return (
    <>
      {/* ── Centered intro — paragraph + tabs, Prada-style ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mx-auto reveal" style={{ maxWidth: "40rem" }}>
          <p className="eyebrow mb-5">From the Loom — Just Arrived</p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "var(--ink)",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
            }}
          >
            Freshly woven pieces from our latest handloom batches, arriving in limited
            quantities across our finest fabrics.
          </p>

          {/* Tabs — bold + underline when active, plain otherwise */}
          <div className="flex items-center justify-center gap-8">
            {TABS.filter((t) => t === "All" || products.some((p) => p.fabric === t)).map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  color: "var(--ink)",
                  fontWeight: active === tab ? 600 : 400,
                  paddingBottom: "0.4rem",
                  borderBottom: active === tab ? "1px solid var(--ink)" : "1px solid transparent",
                  background: "none",
                  cursor: "pointer",
                  transition: "opacity 200ms",
                }}
                className={active === tab ? "" : "hover:opacity-60"}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Edge-to-edge image grid — full bleed, hairline gutters, like Prada ── */}
      <div
        className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px"
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
        {visible.map((product, i) => (
          <div
            key={product.slug}
            className={`reveal reveal-delay-${Math.min(i + 1, 4)} px-3 pb-3`}
            style={{ background: "var(--paper)" }}
          >
            <ProductCard
              product={{
                id: product.slug,
                name: product.name,
                fabric: product.fabric,
                weight: product.weight,
                style: product.style,
                tier: product.tier,
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
            href="/collections/new-arrivals"
            className="inline-flex items-center gap-3 group transition-opacity hover:opacity-50 duration-300"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--ink)",
            }}
          >
            View all new arrivals
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
    </>
  );
}
