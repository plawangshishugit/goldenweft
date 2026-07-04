"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Auto-login after register
      const loginRes = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (loginRes.ok) {
        window.dispatchEvent(new Event("gw-user-update"));
        router.push(redirect);
        router.refresh();
      } else {
        // Registered but auto-login failed — send to login
        router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      }
    } catch {
      setError("Cannot reach server.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #d4d4d4",
    padding: "0.75rem 1rem",
    fontFamily: "var(--font-body, var(--font-sans))",
    fontSize: "0.8rem",
    color: "#0a0a0a",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 200ms",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-body, var(--font-sans))",
    fontSize: "0.6rem",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#999",
    marginBottom: "0.5rem",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fafaf8",
      padding: "2rem",
    }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>

        {/* Brand mark */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.5rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#0a0a0a",
            }}>
              GoldenWeft
            </span>
          </Link>
          <p style={{
            fontFamily: "var(--font-body, var(--font-sans))",
            fontSize: "0.65rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#999",
            marginTop: "0.4rem",
          }}>
            Create Account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff",
          border: "1px solid #e8e8e8",
          padding: "2.5rem",
        }}>

          {error && (
            <div style={{
              marginBottom: "1.25rem",
              padding: "0.75rem 1rem",
              background: "#fff5f5",
              border: "1px solid #fecaca",
              fontFamily: "var(--font-body, var(--font-sans))",
              fontSize: "0.75rem",
              color: "#dc2626",
              letterSpacing: "0.02em",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "#0a0a0a"; }}
                onBlur={(e) => { e.target.style.borderColor = "#d4d4d4"; }}
              />
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "#0a0a0a"; }}
                onBlur={(e) => { e.target.style.borderColor = "#d4d4d4"; }}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "#0a0a0a"; }}
                onBlur={(e) => { e.target.style.borderColor = "#d4d4d4"; }}
              />
            </div>

            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "#0a0a0a"; }}
                onBlur={(e) => { e.target.style.borderColor = "#d4d4d4"; }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "0.5rem",
                width: "100%",
                background: "#0a0a0a",
                color: "#fff",
                border: "none",
                padding: "0.9rem",
                fontFamily: "var(--font-body, var(--font-sans))",
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "opacity 200ms",
              }}
            >
              {loading ? "Creating Account…" : "Create Account"}
            </button>
          </form>

          <p style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontFamily: "var(--font-body, var(--font-sans))",
            fontSize: "0.7rem",
            color: "#999",
          }}>
            Already have an account?{" "}
            <Link
              href={`/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
              style={{ color: "#0a0a0a", textDecoration: "underline" }}
            >
              Sign in
            </Link>
          </p>
        </div>

        <p style={{
          textAlign: "center",
          marginTop: "1.5rem",
          fontFamily: "var(--font-body, var(--font-sans))",
          fontSize: "0.65rem",
          letterSpacing: "0.08em",
          color: "#bbb",
        }}>
          <Link href="/" style={{ color: "#999", textDecoration: "none" }}>
            ← Continue browsing
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
