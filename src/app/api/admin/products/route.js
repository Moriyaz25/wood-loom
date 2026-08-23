import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";
import { productSchema } from "@/lib/validators";

export async function GET(request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await db.product.findMany({
    include: { images: true, category: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ products });
}

export async function POST(request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { images, ...data } = parsed.data;
  const product = await db.product.create({
    data: {
      ...data,
      images: { create: images.map((img, i) => ({ ...img, position: i })) }
    },
    include: { images: true }
  });

  return NextResponse.json({ product }, { status: 201 });
}
