import { NextResponse } from "next/server";

const buckets = globalThis.__icRateBuckets || new Map();
globalThis.__icRateBuckets = buckets;

export function rateLimit(request, scope, limit = 10, windowMs = 60000) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const recent = (buckets.get(key) || []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) return false;
  recent.push(now); buckets.set(key, recent); return true;
}

export const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });
export const forbidden = () => NextResponse.json({ error: "Forbidden" }, { status: 403 });

export async function safeJson(request) {
  try { return { data: await request.json() }; }
  catch { return { error: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) }; }
}

export function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, marketingConsent: user.marketingConsent, createdAt: user.createdAt };
}
