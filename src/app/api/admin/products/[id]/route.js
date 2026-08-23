import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";
import { productPatchSchema } from "@/lib/validators";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = productPatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  // Partial update: lets the admin panel flip isPromoted/isFeatured/stock/price
  // independently without resending the whole product payload.
  const product = await db.product.update({
    where: { id },
    data: parsed.data,
    include: { images: true }
  });

  return NextResponse.json({ product });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.product.update({ where: { id }, data: { status: "ARCHIVED" } });
  return NextResponse.json({ ok: true });
}
