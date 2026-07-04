import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // ✅ Build absolute URL safely
  const url = new URL("/admin/login", req.url);

  const response = NextResponse.redirect(url);

  // 🔥 Clear admin session cookie
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
