import { createRemoteJWKSet, jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  isSameOrigin,
  sessionCookieOptions,
  signSessionToken,
} from "@/lib/auth";
import { publicUser, rateLimit, safeJson } from "@/lib/security";

const googleKeys = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

export async function POST(request) {
  if (!isSameOrigin(request))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (!rateLimit(request, "google-login", 10, 15 * 60 * 1000))
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  const clientId =
    process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId)
    return NextResponse.json(
      { error: "Google sign-in is not configured" },
      { status: 503 },
    );
  const input = await safeJson(request);
  if (input.error) return input.error;
  try {
    const { payload } = await jwtVerify(input.data.credential, googleKeys, {
      issuer: ["https://accounts.google.com", "accounts.google.com"],
      audience: clientId,
    });
    if (!payload.email || !payload.email_verified || !payload.sub)
      throw new Error("Unverified Google identity");
    const email = payload.email.toLowerCase();
    let user = await db.user.findUnique({ where: { email } });
    if (user?.googleSubject && user.googleSubject !== payload.sub)
      throw new Error("Identity mismatch");
    user = user
      ? await db.user.update({
          where: { id: user.id },
          data: { googleSubject: payload.sub, lastLoginAt: new Date() },
        })
      : await db.user.create({
          data: {
            name: payload.name || email.split("@")[0],
            email,
            passwordHash: null,
            authProvider: "google",
            googleSubject: payload.sub,
            privacyAcceptedAt: new Date(),
            lastLoginAt: new Date(),
          },
        });
    const response = NextResponse.json({ user: publicUser(user) });
    const cookie = sessionCookieOptions();
    response.cookies.set(cookie.name, await signSessionToken(user), cookie);
    return response;
  } catch (error) {
    console.error("Google authentication failed", error);
    return NextResponse.json(
      { error: "Google sign-in could not be verified" },
      { status: 401 },
    );
  }
}
