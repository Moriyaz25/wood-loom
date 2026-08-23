import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signAdminToken, sessionCookieOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/security";

export async function POST(request) {
  if (!rateLimit(request, "admin-login", 6, 15 * 60 * 1000)) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  if (!["ADMIN", "STAFF"].includes(user.role)) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signAdminToken(user);
  const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  const cookie = sessionCookieOptions();
  response.cookies.set(cookie.name, token, cookie);
  return response;
}
