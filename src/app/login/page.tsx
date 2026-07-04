"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Dispatch event so Header updates immediately
      window.dispatchEvent(new Event("gw-user-update"));
      router.push(redirect);
      router.refresh();
    } catch {
      setError("Cannot reach server.");
    } finally {
      setLoading(false);
    }
  }

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
            Member Sign In
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
              <label style={{
                display: "block",
                fontFamily: "var(--font-body, var(--font-sans))",
                fontSize: "0.6rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#999",
                marginBottom: "0.5rem",
              }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
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
                }}
                onFocus={(e) => { e.target.style.borderColor = "#0a0a0a"; }}
                onBlur={(e) => { e.target.style.borderColor = "#d4d4d4"; }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                fontFamily: "var(--font-body, var(--font-sans))",
                fontSize: "0.6rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#999",
                marginBottom: "0.5rem",
              }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
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
                }}
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
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            margin: "1.5rem 0",
          }}>
            <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
            <span style={{
              fontFamily: "var(--font-body, var(--font-sans))",
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              color: "#bbb",
              textTransform: "uppercase",
            }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
          </div>

          <Link href={`/register${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
            style={{
              display: "block",
              textAlign: "center",
              width: "100%",
              border: "1px solid #0a0a0a",
              padding: "0.9rem",
              fontFamily: "var(--font-body, var(--font-sans))",
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#0a0a0a",
              textDecoration: "none",
              boxSizing: "border-box",
              transition: "background 200ms, color 200ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#0a0a0a"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0a0a0a"; }}
          >
            Create Account
          </Link>
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
