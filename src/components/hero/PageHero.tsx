import { prisma } from "@/lib/prisma";
import HeroSlider from "./HeroSlider";

type Props = {
  page: string;          // e.g. "/", "/collections", "/seasons"
  minHeight?: string;    // default "92vh" for home, "60vh" for inner pages
  fallback?: React.ReactNode;
};

async function getSlides(page: string) {
  try {
    const prefix = `hero_slide_${encodeURIComponent(page)}_`;
    const records = await prisma.siteSetting.findMany({
      where: { key: { startsWith: prefix } },
      orderBy: { updatedAt: "asc" },
    });
    return records
      .map(r => { try { return { id: r.id, ...JSON.parse(r.value) }; } catch { return null; } })
      .filter((s): s is NonNullable<typeof s> => s !== null && s.active !== false);
  } catch {
    return [];
  }
}

export default async function PageHero({ page, minHeight = "92vh", fallback }: Props) {
  const slides = await getSlides(page);
  if (!slides.length) return <>{fallback ?? null}</>;
  return <HeroSlider slides={slides} minHeight={minHeight} />;
}