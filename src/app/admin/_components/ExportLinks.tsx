import { Text } from "@/components/ui/Text";

export function ExportLinks() {
  return (
    <div className="mt-10">
      <Text as="h2">Export Reports</Text>

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <a href="/api/admin/export?type=advisor_sessions" className="px-4 py-2 border rounded-soft hover:border-black">
          Export Advisor Sessions
        </a>
        <a href="/api/admin/export?type=wishlists" className="px-4 py-2 border rounded-soft hover:border-black">
          Export Wishlists
        </a>
        <a href="/api/admin/export?type=inquiries" className="px-4 py-2 border rounded-soft hover:border-black">
          Export Inquiries
        </a>
      </div>
    </div>
  );
}
