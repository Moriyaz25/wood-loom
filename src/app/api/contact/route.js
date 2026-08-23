import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isSameOrigin } from "@/lib/auth";
import { rateLimit, safeJson } from "@/lib/security";
import { sendMail } from "@/lib/mailer";
const schema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().email().max(254), message: z.string().trim().min(10).max(2000), privacyAccepted: z.literal(true) }).strict();
export async function POST(request) { if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 }); if (!rateLimit(request, "contact", 5, 3600000)) return NextResponse.json({ error: "Too many messages. Try later." }, { status: 429 }); const input = await safeJson(request); if (input.error) return input.error; const parsed = schema.safeParse(input.data); if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 }); const { privacyAccepted, ...data } = parsed.data; await db.contactMessage.create({ data: { ...data, email: data.email.toLowerCase(), privacyAcceptedAt: new Date() } }); await Promise.allSettled([sendMail({to:data.email,subject:"We received your message",text:`Hello ${data.name},\n\nThanks for contacting Infinity Creations. We will reply shortly.`}),process.env.STORE_NOTIFICATION_EMAIL?sendMail({to:process.env.STORE_NOTIFICATION_EMAIL,subject:`Customer message from ${data.name}`,text:`From: ${data.email}\n\n${data.message}`}):Promise.resolve()]); return NextResponse.json({ ok: true }, { status: 201 }); }
