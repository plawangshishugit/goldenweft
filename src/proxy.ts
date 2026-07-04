import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* ══════════════════════════════════════════════
     MODE 1 — ADMIN  (/admin, /api/admin)
  ══════════════════════════════════════════════ */
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login"
  ) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin")
  ) {
    const token = req.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!);
      await jwtVerify(token, secret);
    } catch {
      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      response.cookies.set("admin_session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
      });
      return response;
    }
  }

  /* ══════════════════════════════════════════════
     MODE 2 — USER  (/account only)
     NOTE: /api/user/me is NOT protected here —
     it returns { user: null } gracefully when
     no session exists. Protecting it causes
     redirect loops when the Header polls it.
  ══════════════════════════════════════════════ */
  if (pathname.startsWith("/account")) {
    const token = req.cookies.get("user_session")?.value;

    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secret = new TextEncoder().encode(process.env.USER_JWT_SECRET!);
      await jwtVerify(token, secret);
    } catch {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set("user_session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/account/:path*",
    // /api/user/me intentionally excluded — handles auth itself
  ],
};
