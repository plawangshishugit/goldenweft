import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";

export default async function AdminAdvisorAnalytics() {
  const sessions = await prisma.advisorSession.findMany();

  const totalSessions = sessions.length;

  const countBy = (key: string) => {
    const map: Record<string, number> = {};
    sessions.forEach((s) => {
      const answers = s.answers as Record<string, string> | null;
      const value = (answers as Record<string, string> | null)?.[key];
      if (!value) return;
      map[value] = (map[value] || 0) + 1;
    });
    return map;
  };

  const occasionStats = countBy("occasion");
  const styleStats = countBy("style");
  const toneStats = countBy("tone");

  return (
    <Section>
      <Text as="h1">Advisor Analytics</Text>

      <Text className="mt-6 text-lg">
        Total Advisor Sessions: <strong>{totalSessions}</strong>
      </Text>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatBlock title="Occasions" data={occasionStats} />
        <StatBlock title="Styles" data={styleStats} />
        <StatBlock title="Tones" data={toneStats} />
      </div>
    </Section>
  );
}

function StatBlock({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) {
  const sorted = Object.entries(data).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="border rounded-soft p-4">
      <Text as="h3">{title}</Text>

      {sorted.length === 0 ? (
        <Text className="mt-2 text-sm opacity-60">
          No data yet
        </Text>
      ) : (
        <ul className="mt-3 text-sm space-y-1">
          {sorted.map(([key, count]) => (
            <li key={key}>
              {key} — <strong>{count}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
