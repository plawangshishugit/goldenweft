"use client";

import { useState } from "react";

export default function RefundButton({
  orderId,
}: {
  orderId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleRefund() {
    const ok = confirm("Refund this order in full via Razorpay? This cannot be undone.");
    if (!ok) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/refund`, { method: "POST" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.error || "Refund failed. Please check the Razorpay dashboard before retrying.");
        return;
      }

      if (data.note) alert(data.note);
      window.location.reload();
    } catch {
      alert("Refund failed — please check your connection and the Razorpay dashboard before retrying.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleRefund}
      disabled={loading}
      className="text-xs px-3 py-1 border border-red-400 text-red-600 rounded-soft hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? "Refunding..." : "Refund"}
    </button>
  );
}
