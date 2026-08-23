import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const position = searchParams.get("position") || "HERO";
  const now = new Date();

  const banners = await db.banner.findMany({
    where: {
      position,
      active: true,
      AND: [
        { OR: [{ startDate: null }, { startDate: { lte: now } }] },
        { OR: [{ endDate: null }, { endDate: { gte: now } }] }
      ]
    },
    include: { product: { select: { slug: true } } },
    orderBy: { priority: "desc" }
  });

  return NextResponse.json({ banners });
}
