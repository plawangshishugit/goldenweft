import { Text } from "@/components/ui/Text";

export function PreferencesTable({
  stats,
}: {
  stats: Record<string, Record<string, number>>;
}) {
  return (
    <div className="mt-20">
      <Text as="h2">Advisor Preference Breakdown</Text>

      <div className="mt-10 space-y-12">
        {Object.entries(stats).map(([pref, choices]) => {
          const total = Object.values(choices).reduce((a, b) => a + b, 0);
          const sorted = Object.entries(choices).sort(
            (a, b) => b[1] - a[1]
          );

          return (
            <div key={pref}>
              <Text className="capitalize text-lg font-medium">{pref}</Text>

              <table className="mt-4 w-full text-sm border border-black/10 rounded-soft">
                <thead className="bg-black/5">
                  <tr>
                    <th className="p-3 text-left">Choice</th>
                    <th className="p-3 text-right">Count</th>
                    <th className="p-3 text-right">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(([label, count]) => (
                    <tr key={label} className="border-t">
                      <td className="p-3">{label}</td>
                      <td className="p-3 text-right">{count}</td>
                      <td className="p-3 text-right">
                        {Math.round((count / total) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
