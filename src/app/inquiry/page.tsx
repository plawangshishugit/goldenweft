"use client";

import { useState } from "react";
import { getWishlist } from "@/lib/wishlist";
import { buildWhatsAppMessage } from "@/lib/whatsapp";
import Link from "next/link";

const inputClass = "w-full bg-[var(--color-ivory)] border border-[var(--color-border)] px-4 py-3.5 text-[0.9rem] text-[var(--color-charcoal)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors duration-300";

export default function InquiryPage() {
  const [lastPayload, setLastPayload] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = { name: formData.get("name"), contact: formData.get("contact"), message: formData.get("message"), wishlist: getWishlist() };
    setLastPayload(payload);
    await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setLoading(false);
    setSubmitted(true);
  }

  const wishlist = getWishlist();

  if (!submitted && wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-ivory)] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <h1 className="font-serif text-[2.5rem] text-[var(--color-charcoal)] mb-4">Your Wishlist is Empty</h1>
          <p className="text-[var(--ink-mid)] mb-8">Save a silk to your wishlist before starting an inquiry.</p>
          <Link href="/collections" className="btn-ghost">
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    const message = buildWhatsAppMessage({ name: lastPayload.name, contact: lastPayload.contact, message: lastPayload.message, wishlist: getWishlist() });
    return (
      <div className="min-h-screen bg-[var(--color-ivory)] flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <div className="w-12 h-12 bg-[var(--color-gold)] rounded-full flex items-center justify-center mx-auto mb-8">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
            <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-gold)]">Inquiry Received</span>
            <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
          </div>
          <h1 className="font-serif text-[2.5rem] text-[var(--color-charcoal)] mb-5">Thank you</h1>
          <p className="text-[var(--ink-mid)] text-[0.9rem] leading-relaxed mb-8">Your inquiry has been noted. For immediate assistance, connect with us directly on WhatsApp.</p>
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${message}`} target="_blank" rel="noopener noreferrer"
            className="btn-luxury inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white text-[0.775rem] hover:bg-[#20b858]">
            Continue on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      <div className="bg-[var(--color-ivory)] py-28 px-6 md:px-12 lg:px-16 border-b border-[var(--color-border)]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
            <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-gold)]">Personal Consultation</span>
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-tight text-[var(--color-charcoal)]">Speak with a Silk Advisor</h1>
          <p className="mt-5 text-[var(--ink-mid)] max-w-lg text-[0.975rem] leading-relaxed">Share your requirements and we'll help with availability, customisation, and next steps.</p>
        </div>
      </div>
      <div style={{ height: "1px", background: "var(--gold)", opacity: 0.4 }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-16">
        <div className="max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <input name="name" required placeholder="Your name" className={inputClass} />
            <input name="contact" required placeholder="Email or phone number" className={inputClass} />
            <textarea name="message" placeholder="Tell us about your occasion or preferences" className={`${inputClass} h-32 resize-none`} />
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4">
              {loading ? "Sending…" : "Send Inquiry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}