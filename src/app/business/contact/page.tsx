"use client";

import { useState } from "react";

const inputClass = "w-full bg-[var(--color-ivory)] border border-[var(--color-border)] px-4 py-3.5 text-[0.9rem] text-[var(--color-charcoal)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors duration-300";

export default function BusinessContactPage() {
  const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const email = process.env.NEXT_PUBLIC_BUSINESS_EMAIL!;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/business-inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Failed");
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try WhatsApp instead.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-ivory)] flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <div className="w-12 h-12 bg-[var(--color-gold)] rounded-full flex items-center justify-center mx-auto mb-8">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h1 className="font-serif text-[2.5rem] text-[var(--color-charcoal)] mb-4">Inquiry Received</h1>
          <p className="text-[var(--ink-mid)] text-[0.9rem] leading-relaxed">We'll be in touch within 24 hours. For immediate assistance, reach us on WhatsApp.</p>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-luxury mt-6 inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white text-[0.775rem] hover:bg-[#20b858]">
            WhatsApp Us
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      <div
        className="py-28 px-6 md:px-12 lg:px-16 border-b border-[var(--color-border)]"
        style={{ background: `radial-gradient(ellipse 70% 60% at 80% 40%, rgba(184,145,47,0.08) 0%, transparent 60%), var(--color-ivory)` }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
            <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-gold)]">Trade Inquiry</span>
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-tight text-[var(--color-charcoal)]">Business Contact</h1>
          <p className="mt-5 text-[var(--ink-mid)] max-w-lg text-[0.975rem] leading-relaxed">Submit a trade or bulk order inquiry. We respond within 24 hours.</p>
        </div>
      </div>
      <div style={{ height: "1px", background: "var(--gold)", opacity: 0.4 }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
            <input name="name" required placeholder="Your name" value={form.name} onChange={handleChange} className={inputClass} />
            <input name="company" placeholder="Company or brand name" value={form.company} onChange={handleChange} className={inputClass} />
            <input name="email" required type="email" placeholder="Business email" value={form.email} onChange={handleChange} className={inputClass} />
            <textarea name="message" required placeholder="Tell us about your requirements" value={form.message} onChange={handleChange} className={`${inputClass} h-32 resize-none`} />
            {error && <p className="text-red-500 text-[0.8rem]">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4">
              {loading ? "Sending…" : "Submit Inquiry"}
            </button>
          </form>

          <div>
            <h3 className="font-serif text-[1.2rem] text-[var(--color-charcoal)] mb-6">Direct Contact</h3>
            <div className="space-y-4">
              {[
                { label: "Email", value: email, href: `mailto:${email}` },
                { label: "WhatsApp", value: "Chat directly", href: `https://wa.me/${whatsapp}` },
              ].map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 border border-[var(--color-border)] hover:border-[var(--color-gold-muted)] transition-all duration-300 group">
                  <div className="text-[0.6rem] tracking-[0.18em] uppercase text-[var(--color-gold)] w-16 flex-shrink-0">{item.label}</div>
                  <span className="text-[0.9rem] text-[var(--color-charcoal)] group-hover:opacity-60 transition-colors duration-300">{item.value}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}