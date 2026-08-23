import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signSessionToken, sessionCookieOptions, isSameOrigin } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { rateLimit, safeJson, publicUser } from "@/lib/security";

export async function POST(request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (!rateLimit(request, "login", 8, 15 * 60 * 1000)) return NextResponse.json({ error: "Too many sign-in attempts. Try in 15 minutes." }, { status: 429 });
  const input = await safeJson(request); if (input.error) return input.error;
  const parsed = loginSchema.safeParse(input.data);
  if (!parsed.success) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const response = NextResponse.json({ user: publicUser(user) }); const cookie = sessionCookieOptions(); response.cookies.set(cookie.name, await signSessionToken(user), cookie); return response;
}
