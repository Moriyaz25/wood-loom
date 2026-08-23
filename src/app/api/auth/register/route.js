import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, signSessionToken, sessionCookieOptions, isSameOrigin } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";
import { rateLimit, safeJson, publicUser } from "@/lib/security";

export async function POST(request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (!rateLimit(request, "register", 5, 15 * 60 * 1000)) return NextResponse.json({ error: "Too many attempts. Try later." }, { status: 429 });
  const input = await safeJson(request); if (input.error) return input.error;
  const parsed = registerSchema.safeParse(input.data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return NextResponse.json({ error: "An account already exists for this email" }, { status: 409 });
  const now = new Date();
  const user = await db.user.create({ data: { name: parsed.data.name, email: parsed.data.email, passwordHash: await hashPassword(parsed.data.password), role: "CUSTOMER", privacyAcceptedAt: now, marketingConsent: parsed.data.marketingConsent, marketingConsentedAt: parsed.data.marketingConsent ? now : null } });
  const response = NextResponse.json({ user: publicUser(user) }, { status: 201 });
  const cookie = sessionCookieOptions(); response.cookies.set(cookie.name, await signSessionToken(user), cookie); return response;
}
