import { prisma } from "@/lib/prisma";

export type HomepageTile = {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  order: number;
};

/**
 * Reads homepage editorial tiles (Seasonal Highlights / Shop by Style) directly
 * from the SiteSetting key-value table. Used by server components on the public
 * site so they always reflect the latest admin edits with no extra network hop.
 */
export async function getHomepageTiles(
  group: "seasonal" | "style"
): Promise<HomepageTile[]> {
  const prefix = `homepage_tile_${group}_`;
  const rows = await prisma.siteSetting.findMany({
    where: { key: { startsWith: prefix } },
    orderBy: { updatedAt: "asc" },
  });

  return rows
    .map((r) => {
      const parsed = JSON.parse(r.value);
      return {
        id: r.id,
        key: r.key,
        title: parsed.title ?? "",
        subtitle: parsed.subtitle ?? "",
        href: parsed.href ?? "#",
        image: parsed.image ?? "",
        order: parsed.order ?? 0,
      };
    })
    // Tiles without a photo yet (e.g. freshly seeded placeholders) are
    // hidden from the public site rather than rendered broken — they'll
    // appear automatically once an admin uploads/pastes an image at
    // /admin/homepage.
    .filter((t) => t.image.trim().length > 0)
    .sort((a, b) => a.order - b.order);
}
