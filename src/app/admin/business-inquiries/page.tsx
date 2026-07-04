import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import BusinessInquiryClient from "./BusinessInquiryClient";

/**
 * Admin – Business Inquiries (Server Component)
 * - Fetches data securely on server
 * - Passes to client component for actions (resolve, reply)
 * - Protected by middleware (admin only)
 */
export default async function AdminBusinessInquiriesPage() {
  const inquiries = await prisma.businessInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <Section>
      {/* Header */}
      <div className="flex justify-between items-center">
        <Text as="h1">Business Inquiries</Text>

        {/* Optional back link */}
        <a
          href="/admin"
          className="text-sm underline opacity-70 hover:opacity-100"
        >
          ← Back to Dashboard
        </a>
      </div>

      {/* Client-side interactive table */}
      <div className="mt-10">
        <BusinessInquiryClient inquiries={inquiries} />
      </div>
    </Section>
  );
}
