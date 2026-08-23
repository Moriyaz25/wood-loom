import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import {
  SESSION_COOKIE_NAME,
  signSessionToken,
  verifySessionToken,
  sessionCookieOptions,
} from "@/lib/session";
export {
  SESSION_COOKIE_NAME,
  signSessionToken,
  verifySessionToken,
  sessionCookieOptions,
} from "@/lib/session";

export const ADMIN_COOKIE_NAME = SESSION_COOKIE_NAME;

export const hashPassword = (plain) => bcrypt.hash(plain, 12);
export const verifyPassword = (plain, hash) =>
  hash ? bcrypt.compare(plain, hash) : false;

export const signAdminToken = signSessionToken;
export const verifyAdminToken = verifySessionToken;

export async function getUserFromRequest(request) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const payload = token ? await verifySessionToken(token) : null;
  if (!payload?.sub) return null;
  const user = await db.user.findUnique({ where: { id: payload.sub } });
  if (!user || user.tokenVersion !== payload.version) return null;
  return user;
}

export async function getAdminFromRequest(request) {
  const user = await getUserFromRequest(request);
  return user && ["ADMIN", "STAFF"].includes(user.role) ? user : null;
}

export function isSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}
