import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export type AdminSession = {
  role: "admin";
  email: string;
  iat?: number;
  exp?: number;
};

/**
 * Verify a JWT token string and return session payload
 */
export function verifyAdminToken(token: string): AdminSession | null {
  try {
    const secret = process.env.ADMIN_JWT_SECRET!;
    return jwt.verify(token, secret) as AdminSession;
  } catch {
    return null;
  }
}

/**
 * Read and verify admin session from HTTP-only cookie
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("admin_session")?.value ||
    cookieStore.get("admin_token")?.value; // backward compatibility

  if (!token) return null;
  return verifyAdminToken(token);
}

/**
 * Async boolean helper — use await isAdminAuthenticated()
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}
