import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const promoted = searchParams.get("promoted");

  const where = { status: "ACTIVE" };
  if (category) where.category = { slug: category };
  if (featured) where.isFeatured = true;
  if (promoted) where.isPromoted = true;

  const products = await db.product.findMany({
    where,
    include: { images: { orderBy: { position: "asc" } }, category: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ products });
}
