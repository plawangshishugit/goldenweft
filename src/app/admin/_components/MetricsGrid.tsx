import { Text } from "@/components/ui/Text";

export function MetricsGrid({
  sessions,
  clicks,
  wishlists,
  inquiries,
}: {
  sessions: number;
  clicks: number;
  wishlists: number;
  inquiries: number;
}) {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
      <Metric title="Advisor Sessions" value={sessions} />
      <Metric title="Advisor Clicks" value={clicks} />
      <Metric title="Wishlists" value={wishlists} />
      <Metric title="Inquiries" value={inquiries} />
    </div>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <div className="border border-black/10 rounded-soft p-6">
      <Text className="text-sm opacity-70">{title}</Text>
      <Text as="h2" className="mt-2">{value}</Text>
    </div>
  );
}
