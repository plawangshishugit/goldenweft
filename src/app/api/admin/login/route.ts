import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL!;
    const adminHash = process.env.ADMIN_PASSWORD_HASH!;
    const jwtSecret = process.env.ADMIN_JWT_SECRET!;

    // Error check for login
    console.log("EMAIL_CHECK:", email === adminEmail, `"${email}" vs "${adminEmail}"`);
    console.log("HASH_READ:", adminHash?.slice(0, 7));

    // ✅ Email check
    if (email !== adminEmail) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Password check (THIS IS THE IMPORTANT LINE)
    const isValid = await bcrypt.compare(password, adminHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Create token
    const token = jwt.sign(
      { role: "admin", email },
      jwtSecret,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ ok: true });

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}

