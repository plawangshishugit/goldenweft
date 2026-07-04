"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ADMIN_SELECTABLE_STATUSES,
  ORDER_STATUS_META,
  canTransition,
  normalizeStatus,
  requiresTrackingInfo,
  type OrderStatusValue,
} from "@/lib/orderStatus";

export default function OrderStatusSelect({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(normalizeStatus(initialStatus));
  const [loading, setLoading] = useState(false);

  const nextOptions = ADMIN_SELECTABLE_STATUSES.filter((candidate) => canTransition(status, candidate));

  async function updateStatus(newStatus: OrderStatusValue) {
    let trackingNumber: string | undefined;
    let courierName: string | undefined;

    if (requiresTrackingInfo(newStatus)) {
      const entered = window.prompt("Tracking number (required to mark as shipped):");
      if (!entered || !entered.trim()) return; // cancelled — leave status untouched
      trackingNumber = entered.trim();
      courierName = window.prompt("Courier name (optional):") || undefined;
    }

    if (newStatus === "CANCELLED") {
      const ok = window.confirm(
        "Cancel this order? If it was paid online, this will automatically refund the customer in full."
      );
      if (!ok) return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, trackingNumber, courierName }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update order status.");
        return;
      }
      // The server may resolve a CANCELLED request to REFUNDED for a
      // paid order — always trust what it actually did, not what was asked.
      setStatus(normalizeStatus(data.status));
      router.refresh();
    } catch {
      alert("Failed to update order status. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  if (nextOptions.length === 0) {
    // Terminal / system-controlled state — nothing an admin can pick next.
    return (
      <span className="text-xs opacity-60 px-2 py-1">
        {ORDER_STATUS_META[status].label}
      </span>
    );
  }

  return (
    <select
      value={status}
      disabled={loading}
      onChange={(e) => updateStatus(e.target.value as OrderStatusValue)}
      className="border px-2 py-1 rounded text-sm disabled:opacity-50"
    >
      <option value={status} disabled>
        {ORDER_STATUS_META[status].label}
      </option>
      {nextOptions.map((opt) => (
        <option key={opt} value={opt}>
          Mark as {ORDER_STATUS_META[opt].label}
        </option>
      ))}
    </select>
  );
}
