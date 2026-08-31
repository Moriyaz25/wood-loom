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
  const { images, ...data } = parsed.data;
  const product = await db.$transaction(async (tx) => {
    if (images) {
      await tx.productImage.deleteMany({ where: { productId: id } });
    }
    return tx.product.update({
      where: { id },
      data: {
        ...data,
        ...(images
          ? {
              images: {
                create: images.map((image, position) => ({
                  ...image,
                  position,
                })),
              },
            }
          : {}),
      },
      include: { images: { orderBy: { position: "asc" } }, category: true },
    });
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
