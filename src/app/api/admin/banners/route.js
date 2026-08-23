import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";
import { bannerSchema } from "@/lib/validators";

export async function GET(request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const banners = await db.banner.findMany({
    include: { product: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ banners });
}

export async function POST(request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = bannerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const banner = await db.banner.create({ data: parsed.data });
  return NextResponse.json({ banner }, { status: 201 });
}
