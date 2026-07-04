import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export async function requireAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) redirect("/admin/login");

  try {
    jwt.verify(token, process.env.ADMIN_JWT_SECRET!);
  } catch {
    redirect("/admin/login");
  }
}
