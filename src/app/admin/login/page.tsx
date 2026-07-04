"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text(); // read as text first — never throws

      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        // Server returned HTML (crashed before sending JSON)
        setError(`Server error (${res.status}). Check terminal for details.`);
        console.error("Server returned non-JSON:", text.slice(0, 300));
        return;
      }

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      window.location.replace("/admin");
    } catch (err) {
      setError("Cannot reach server. Is npm run dev running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm border border-black/10 rounded-soft p-6">
        <h1 className="text-xl font-medium">Admin Login</h1>

        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            placeholder="admin@goldenweft.com"
            className="w-full border border-black/20 p-3 rounded-soft"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            required
            placeholder="••••••••"
            className="w-full border border-black/20 p-3 rounded-soft"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-soft disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
