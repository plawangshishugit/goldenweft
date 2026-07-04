"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { getCartCount } from "@/lib/cart";
import { getWishlist } from "@/lib/wishlist";

type UserInfo = { name: string; email: string } | null;

export default function Header() {
  const [cartCount, setCartCount]         = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [visible, setVisible]             = useState(true);
  const [atTop, setAtTop]                 = useState(true);
  const [user, setUser]                   = useState<UserInfo>(null);
  const [userMenuOpen, setUserMenuOpen]   = useState(false);
  const lastY = useRef(0);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  /* ── Fetch user session ── */
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user/me");
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
    window.addEventListener("gw-user-update", fetchUser);
    return () => window.removeEventListener("gw-user-update", fetchUser);
  }, []);

  /* ── Sync cart count ── */
  useEffect(() => {
    const update = () => setCartCount(getCartCount());
    update();
    window.addEventListener("gw-cart-update", update);
    return () => window.removeEventListener("gw-cart-update", update);
  }, []);

  /* ── Sync wishlist count ── */
  useEffect(() => {
    const update = () => setWishlistCount(getWishlist().length);
    update();
    window.addEventListener("gw-wishlist-update", update);
    return () => window.removeEventListener("gw-wishlist-update", update);
  }, [pathname]);

  /* ── Close menus on nav ── */
  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [pathname]);

  /* ── Close user menu on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Scroll hide/show ── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 8);
      if (y < 60) { setVisible(true); lastY.current = y; return; }
      if (y > lastY.current + 6)  setVisible(false);
      else if (y < lastY.current - 4) setVisible(true);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/collections",    label: "Collections" },
    { href: "/seasons",        label: "Seasons" },
    { href: "/styles",         label: "Styles" },
    { href: "/legacy",         label: "Legacy" },
    { href: "/exports",        label: "Exports" },
    { href: "/find-your-silk", label: "Silk Advisor" },
    { href: "/wishlist",       label: "Wishlist" },
  ];

  const hoverIn  = (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.opacity = "0.4"; };
  const hoverOut = (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.opacity = "1"; };

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const waHref = `https://wa.me/${phone}?text=Hello%20GoldenWeft%2C%20I%20would%20like%20to%20know%20more%20about%20your%20silks.`;

  /* ── Shared icon badge ── */
  const Badge = ({ count }: { count: number }) =>
    count > 0 ? (
      <span style={{
        position: "absolute", top: "-7px", right: "-9px",
        width: "14px", height: "14px", borderRadius: "50%",
        background: "var(--gold)", color: "#fff",
        fontSize: "0.5rem", fontWeight: 500,
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none",
      }}>{count}</span>
    ) : null;

  /* ── User initial avatar ── */
  const UserAvatar = () => {
    const initial = user?.name?.charAt(0).toUpperCase() ?? "";
    return (
      <span style={{
        width: "22px", height: "22px", borderRadius: "50%",
        background: "#0a0a0a", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-serif)", fontSize: "0.65rem", fontWeight: 600,
        flexShrink: 0,
      }}>
        {initial}
      </span>
    );
  };

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "#fff",
        borderBottom: atTop ? "1px solid transparent" : "1px solid #e8e8e8",
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 320ms cubic-bezier(0.16,1,0.3,1), border-color 300ms",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          height: "56px",
          padding: "0 2rem",
          maxWidth: "1400px",
          margin: "0 auto",
        }}>

          {/* ── Left: Menu + Search ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <button
              onClick={() => setMenuOpen(true)}
              onMouseEnter={hoverIn} onMouseLeave={hoverOut}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-body)", fontSize: "0.72rem", letterSpacing: "0.04em", color: "#0a0a0a", padding: 0, transition: "opacity 200ms" }}
            >
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                <line x1="0" y1="1" x2="16" y2="1" stroke="currentColor" strokeWidth="1"/>
                <line x1="0" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="1"/>
                <line x1="0" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1"/>
              </svg>
              Menu
            </button>

            <Link href="/collections" onMouseEnter={hoverIn} onMouseLeave={hoverOut}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-body)", fontSize: "0.72rem", letterSpacing: "0.04em", color: "#0a0a0a", transition: "opacity 200ms" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              Search
            </Link>
          </div>

          {/* ── Centre: Logo ── */}
          <Link href="/" onMouseEnter={hoverIn} onMouseLeave={hoverOut}
            style={{ display: "flex", justifyContent: "center", transition: "opacity 200ms" }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#0a0a0a" }}>
              GoldenWeft
            </span>
          </Link>

          {/* ── Right: User · WhatsApp · Wishlist · Cart ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", justifyContent: "flex-end" }}>

            {/* ── User: Guest → Sign In | Logged In → Account menu ── */}
            {user ? (
              /* Logged-in dropdown trigger */
              <div ref={userMenuRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "0.4rem",
                    fontFamily: "var(--font-body)", fontSize: "0.72rem",
                    letterSpacing: "0.04em", color: "#0a0a0a", padding: 0,
                    transition: "opacity 200ms",
                  }}
                  onMouseEnter={hoverIn} onMouseLeave={hoverOut}
                >
                  <UserAvatar />
                  <span style={{ maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 12px)", right: 0,
                    background: "#fff", border: "1px solid #e8e8e8",
                    minWidth: "160px", zIndex: 200,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                    animation: "fadeDown 180ms ease",
                  }}>
                    <Link href="/account"
                      style={{ display: "block", padding: "0.75rem 1rem", fontFamily: "var(--font-body)", fontSize: "0.72rem", letterSpacing: "0.04em", color: "#0a0a0a", textDecoration: "none", borderBottom: "1px solid #f0f0f0" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#f8f8f8"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      My Account
                    </Link>
                    <Link href="/wishlist"
                      style={{ display: "block", padding: "0.75rem 1rem", fontFamily: "var(--font-body)", fontSize: "0.72rem", letterSpacing: "0.04em", color: "#0a0a0a", textDecoration: "none", borderBottom: "1px solid #f0f0f0" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#f8f8f8"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      Wishlist
                    </Link>
                    <a href="/api/user/logout"
                      style={{ display: "block", padding: "0.75rem 1rem", fontFamily: "var(--font-body)", fontSize: "0.72rem", letterSpacing: "0.04em", color: "#999", textDecoration: "none" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#f8f8f8"; e.currentTarget.style.color = "#0a0a0a"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#999"; }}
                    >
                      Sign Out
                    </a>
                  </div>
                )}
              </div>
            ) : (
              /* Guest: Sign In link */
              <Link href="/login" onMouseEnter={hoverIn} onMouseLeave={hoverOut}
                style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontFamily: "var(--font-body)", fontSize: "0.72rem", letterSpacing: "0.04em", color: "#0a0a0a", textDecoration: "none", transition: "opacity 200ms" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Sign In
              </Link>
            )}

            {/* WhatsApp */}
            <a href={waHref} target="_blank" rel="noopener noreferrer"
              onMouseEnter={hoverIn} onMouseLeave={hoverOut}
              aria-label="Chat on WhatsApp"
              style={{ display: "flex", alignItems: "center", color: "var(--gold)", transition: "opacity 200ms" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

            {/* Wishlist */}
            <Link href="/wishlist" onMouseEnter={hoverIn} onMouseLeave={hoverOut}
              aria-label="Wishlist"
              style={{ position: "relative", color: "#0a0a0a", display: "flex", alignItems: "center", transition: "opacity 200ms" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
              <Badge count={wishlistCount} />
            </Link>

            {/* Cart */}
            <Link href="/cart" onMouseEnter={hoverIn} onMouseLeave={hoverOut}
              aria-label="Cart"
              style={{ position: "relative", color: "#0a0a0a", display: "flex", alignItems: "center", transition: "opacity 200ms" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <Badge count={cartCount} />
            </Link>

          </div>
        </div>
      </header>

      {/* Spacer */}
      <div style={{ height: "56px" }} />

      {/* ── Slide-in menu panel ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 100,
        display: "flex",
        visibility: menuOpen ? "visible" : "hidden",
        transition: `visibility 0s ${menuOpen ? "0s" : "400ms"}`,
      }}>
        <div style={{
          width: "360px", height: "100%", background: "#fff",
          display: "flex", flexDirection: "column",
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 380ms cubic-bezier(0.16,1,0.3,1)",
          overflowY: "auto",
        }}>
          {/* Panel header */}
          <div style={{ display: "flex", alignItems: "center", height: "56px", padding: "0 2rem", borderBottom: "1px solid #e8e8e8", flexShrink: 0 }}>
            <button onClick={() => setMenuOpen(false)} onMouseEnter={hoverIn} onMouseLeave={hoverOut}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-body)", fontSize: "0.72rem", letterSpacing: "0.04em", color: "#0a0a0a", padding: 0, transition: "opacity 200ms" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1"/>
                <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1"/>
              </svg>
              Close
            </button>
          </div>

          {/* Nav links */}
          <nav style={{ padding: "2rem 0", flex: 1 }}>
            {navLinks.map((link) => {
              const active = pathname === link.href;
              const isWishlist = link.href === "/wishlist";
              return (
                <Link key={link.href} href={link.href}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 2rem", fontFamily: "var(--font-body)", fontSize: "0.9rem", letterSpacing: "0.01em", color: active ? "#0a0a0a" : "#999", fontWeight: active ? 500 : 400, transition: "color 180ms" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#0a0a0a"; }}
                  onMouseLeave={(e) => { if (!active)(e.currentTarget as HTMLElement).style.color = "#999"; }}
                >
                  {link.label}
                  {isWishlist && wishlistCount > 0 && (
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.12em", color: "var(--gold)", background: "rgba(155,123,54,0.08)", padding: "0.2rem 0.5rem" }}>
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* User-specific menu links */}
            <div style={{ borderTop: "1px solid #f0f0f0", marginTop: "0.5rem", paddingTop: "0.5rem" }}>
              {user ? (
                <>
                  <Link href="/account"
                    style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.85rem 2rem", fontFamily: "var(--font-body)", fontSize: "0.9rem", color: pathname === "/account" ? "#0a0a0a" : "#999", textDecoration: "none", transition: "color 180ms" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#0a0a0a"; }}
                    onMouseLeave={(e) => { if (pathname !== "/account")(e.currentTarget as HTMLElement).style.color = "#999"; }}
                  >
                    My Account
                  </Link>
                  <a href="/api/user/logout"
                    style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.85rem 2rem", fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#999", textDecoration: "none", transition: "color 180ms" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#0a0a0a"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#999"; }}
                  >
                    Sign Out
                  </a>
                </>
              ) : (
                <Link href="/login"
                  style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.85rem 2rem", fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#999", textDecoration: "none", transition: "color 180ms" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#0a0a0a"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#999"; }}
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </nav>

          {/* Bottom */}
          <div style={{ padding: "2rem", borderTop: "1px solid #e8e8e8", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)" }}>
              Bhagalpuri Silks · Est. Generationally
            </span>
            <a href={waHref} target="_blank" rel="noopener noreferrer"
              onMouseEnter={hoverIn} onMouseLeave={hoverOut}
              style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "#999", transition: "opacity 200ms", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--gold)" }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Advisory
            </a>
          </div>
        </div>

        {/* Backdrop */}
        <div onClick={() => setMenuOpen(false)}
          style={{ flex: 1, background: "rgba(0,0,0,0.3)", opacity: menuOpen ? 1 : 0, transition: "opacity 380ms", cursor: "pointer" }} />
      </div>

      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
