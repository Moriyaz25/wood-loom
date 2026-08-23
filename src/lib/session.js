import { SignJWT, jwtVerify } from "jose";
export const SESSION_COOKIE_NAME = "ic_session";
const SESSION_HOURS = 24;
function secretKey() { const secret = process.env.JWT_SECRET; if (!secret || secret.length < 32 || secret.includes("change-this")) throw new Error("JWT_SECRET must be a strong random value of at least 32 characters"); return new TextEncoder().encode(secret); }
export async function signSessionToken(user) { return new SignJWT({ role: user.role, version: user.tokenVersion }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setSubject(user.id).setIssuedAt().setExpirationTime(`${SESSION_HOURS}h`).sign(secretKey()); }
export async function verifySessionToken(token) { try { const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] }); return payload; } catch { return null; } }
export function sessionCookieOptions() { return { name: SESSION_COOKIE_NAME, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_HOURS * 3600 }; }
