import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { requireAdminAuth } from "./_components/AdminAuth";
import { DateRangeSelector } from "./_components/DateRangeSelector";
import { MetricsGrid } from "./_components/MetricsGrid";
import { PreferencesTable } from "./_components/PreferencesTable";
import { TopWishlisted } from "./_components/TopWishlisted";
import { ExportLinks } from "./_components/ExportLinks";

/* ---------- Types ---------- */
type PreferenceStats = Record<string, Record<string, number>>;

type TopWishlistedItem = {
  productId: string;
  _count: { productId: number };
};

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  await requireAdminAuth();

  const { range = "7" } = await searchParams;

  const fromDate = new Date(
    range === "all"
      ? 0
      : Date.now() - (range === "30" ? 30 : 7) * 86400000
  );

  const [
    sessions,
    wishlists,
    inquiries,
    clicks,
    recentSessions,
    rawTopWishlisted,
  ] = await Promise.all([
    prisma.advisorSession.count({
      where: { createdAt: { gte: fromDate } },
    }),

    prisma.conversionEvent.count({
      where: { type: "wishlist", createdAt: { gte: fromDate } },
    }),

    prisma.conversionEvent.count({
      where: { type: "inquiry", createdAt: { gte: fromDate } },
    }),

    prisma.conversionEvent.count({
      where: { type: "advisor_click", createdAt: { gte: fromDate } },
    }),

    prisma.advisorSession.findMany({
      where: { createdAt: { gte: fromDate } },
    }),

    prisma.conversionEvent.groupBy({
      by: ["productId"],
      where: { type: "wishlist", createdAt: { gte: fromDate } },
      _count: { productId: true },
    }),
  ]);

  /* ---------- FIX #1: Filter null productIds ---------- */
  const topWishlisted: TopWishlistedItem[] = rawTopWishlisted.filter(
    (item): item is TopWishlistedItem => item.productId !== null
  );

  /* ---------- FIX #2: Typed preferences aggregation ---------- */
  const preferenceStats: PreferenceStats = recentSessions.reduce(
    (acc, session) => {
      const answers = session.answers as Record<string, string> | null;
      if (!answers) return acc;

      for (const key of Object.keys(answers)) {
        acc[key] ??= {};
        acc[key][answers[key]] = (acc[key][answers[key]] || 0) + 1;
      }
      return acc;
    },
    {} as PreferenceStats
  );

  return (
    <Section>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Text as="h1">GoldenWeft Admin Dashboard</Text>
        </div>

        <nav className="flex gap-4 text-sm">
          <a
            href="/admin/products" className="underline opacity-70 hover:opacity-100">Products</a>
          <a href="/admin/hero"
            className="underline opacity-70 hover:opacity-100">Hero Slides</a>
          <a href="/admin/homepage"
            className="underline opacity-70 hover:opacity-100">Homepage Sections</a>
          <a href="/admin/orders"
            className="underline opacity-70 hover:opacity-100"
          >
            Orders
          </a>

          <a
            href="/api/admin/logout"
            className="underline opacity-70 hover:opacity-100"
          >
            Logout
          </a>
        </nav>
      </div>

      <DateRangeSelector current={range} />

      <MetricsGrid
        sessions={sessions}
        clicks={clicks}
        wishlists={wishlists}
        inquiries={inquiries}
      />

      <PreferencesTable stats={preferenceStats} />

      <TopWishlisted items={topWishlisted} />

      <ExportLinks />
    </Section>
  );
}