"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    const ok = window.confirm(
      "Cancel this order? If it was paid online, the amount will be refunded to your original payment method."
    );
    if (!ok) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "This order could not be cancelled.");
        return;
      }
      router.refresh();
    } catch {
      alert("This order could not be cancelled — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      style={{
        fontFamily: "var(--font-body, var(--font-sans))",
        fontSize: "0.6rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#dc2626",
        background: "transparent",
        border: "1px solid #fecaca",
        padding: "0.4rem 0.8rem",
        cursor: loading ? "default" : "pointer",
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? "Cancelling…" : "Cancel Order"}
    </button>
  );
}
