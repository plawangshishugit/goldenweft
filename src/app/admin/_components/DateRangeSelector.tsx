import Link from "next/link";

export function DateRangeSelector({
  current,
}: {
  current: string;
}) {
  return (
    <div className="mt-6 flex gap-3 text-sm">
      <Range value="7" label="Last 7 days" current={current} />
      <Range value="30" label="Last 30 days" current={current} />
      <Range value="all" label="All time" current={current} />
    </div>
  );
}

function Range({
  value,
  label,
  current,
}: {
  value: string;
  label: string;
  current: string;
}) {
  return (
    <Link
      href={`/admin?range=${value}`}
      className={`px-4 py-2 border rounded-soft transition ${
        current === value
          ? "border-black bg-black text-white"
          : "border-black/20 hover:border-black"
      }`}
    >
      {label}
    </Link>
  );
}
