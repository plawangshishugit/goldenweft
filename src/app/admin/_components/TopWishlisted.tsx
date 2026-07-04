import { Text } from "@/components/ui/Text";

export function TopWishlisted({
  items,
}: {
  items: { productId: string; _count: { productId: number } }[];
}) {
  return (
    <div className="mt-16">
      <Text as="h2">Top Wishlisted Products</Text>

      {items.length === 0 ? (
        <Text className="mt-4 text-sm opacity-70">
          No wishlist activity yet.
        </Text>
      ) : (
        <ul className="mt-6 space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.productId}>
              {item.productId} — {item._count.productId} wishlists
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
