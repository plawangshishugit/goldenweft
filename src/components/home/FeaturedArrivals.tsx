import { getNewArrivals } from "@/lib/queries/products";
import ArrivalsClient from "./ArrivalsClient";

export default async function NewArrivals() {
  const products = await getNewArrivals(8);
  if (products.length === 0) return null;

  return (
    <section
      style={{ padding: "var(--space-section) 0", borderTop: "1px solid var(--color-border)" }}
    >
      <ArrivalsClient
        products={products.map((p) => ({
          slug: p.slug,
          id: p.slug,
          name: p.name,
          description: p.description ?? undefined,
          fabric: p.fabric as "Tussar" | "Ghicha" | "Mulberry",
          weight: p.weight as "Light" | "Medium" | "Heavy",
          style: p.style as "Traditional" | "Contemporary" | "Elegant",
          tier: p.tier as "Everyday" | "Occasion" | "Heirloom",
          tones: p.tones,
          occasions: p.occasions,
          isNew: p.isNew,
          price: p.price,
          images: p.images,
        }))}
      />
    </section>
  );
}
