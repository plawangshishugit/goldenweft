"use client";

import { useState } from "react";

// Footer email capture. There's no dedicated newsletter/subscriber table in
// the schema, so this intentionally rides on the existing /api/inquiry
// pipeline (same one the wishlist "Enquire" flow uses) — it already creates
// a ConversionEvent and emails the business inbox, which is exactly what a
// signup should do without inventing new backend infrastructure.
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail || status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter Subscriber",
          contact: email,
          message: "Signed up via footer newsletter form.",
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--gold)", paddingBottom: "0.6rem" }}>
        Thank you — we&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #0a0a0a",
          paddingBottom: "0.5rem",
          alignItems: "center",
          gap: "0.5rem",
          opacity: status === "loading" ? 0.6 : 1,
          transition: "opacity 200ms",
        }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          placeholder="Your e-mail address"
          aria-label="Email address"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "none",
            fontFamily: "var(--font-body)",
            fontSize: "0.8rem",
            color: "#0a0a0a",
          }}
        />
        <button
          type="submit"
          disabled={!isValidEmail || status === "loading"}
          aria-label="Subscribe"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            display: "flex",
            cursor: isValidEmail ? "pointer" : "default",
            opacity: isValidEmail ? 1 : 0.35,
            transition: "opacity 200ms",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {status === "error" && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "#b3493f", marginTop: "0.5rem" }}>
          Something went wrong — please try again.
        </p>
      )}
    </form>
  );
}
