import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
export async function GET(request) { const user = await getUserFromRequest(request); if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const data = await db.user.findUnique({ where: { id: user.id }, select: { name: true, email: true, phone: true, marketingConsent: true, privacyAcceptedAt: true, createdAt: true, addresses: true, orders: { include: { items: true } } } }); return new NextResponse(JSON.stringify(data, null, 2), { headers: { "Content-Type": "application/json", "Content-Disposition": "attachment; filename=your-woodloom-data.json", "Cache-Control": "no-store" } }); }
