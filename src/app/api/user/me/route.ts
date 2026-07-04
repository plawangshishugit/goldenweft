import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("user_session")?.value;

    if (!token) return NextResponse.json({ user: null });

    const secret = new TextEncoder().encode(process.env.USER_JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      user: {
        userId: payload.userId as string,
        email: payload.email as string,
        name: payload.name as string,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
