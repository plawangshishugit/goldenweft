import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

export type UserPayload = {
  userId: string;
  email: string;
  name: string;
};

export async function requireUserAuth(): Promise<UserPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_session")?.value;

  if (!token) redirect("/login");

  try {
    const secret = new TextEncoder().encode(process.env.USER_JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as UserPayload;
  } catch {
    redirect("/login");
  }
}

/**
 * Same as requireUserAuth, but returns null instead of redirecting when
 * there's no valid session. For endpoints like checkout that must keep
 * working for guests — a logged-in customer's order just gets linked to
 * their account as a bonus.
 */
export async function getOptionalUserSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_session")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.USER_JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as UserPayload;
  } catch {
    return null;
  }
}
