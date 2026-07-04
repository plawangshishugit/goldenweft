"use client";

import BusinessInquiryTable from "./BusinessInquiryTable";

export default function BusinessInquiryClient({
  inquiries,
}: {
  inquiries: any[];
}) {
  async function markResolved(id: string) {
    const res = await fetch(
      `/api/admin/business-inquiries/${id}/resolve`,
      { method: "POST" }
    );

    if (res.ok) {
      location.reload(); // simple & safe
    } else {
      alert("Failed to mark resolved");
    }
  }

  return (
    <BusinessInquiryTable
      inquiries={inquiries}
      onResolve={markResolved}
    />
  );
}
