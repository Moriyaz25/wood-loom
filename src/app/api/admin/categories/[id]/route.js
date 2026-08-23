import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminFromRequest, isSameOrigin } from "@/lib/auth";
import { categorySchema } from "@/lib/validators";
export async function PATCH(request, { params }) {
  if (!(await getAdminFromRequest(request)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSameOrigin(request))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const parsed = categorySchema.partial().safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 },
    );
  const { id } = await params;
  return NextResponse.json({
    category: await db.category.update({ where: { id }, data: parsed.data }),
  });
}
export async function DELETE(request, { params }) {
  if (!(await getAdminFromRequest(request)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSameOrigin(request))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const { id } = await params;
  const count = await db.product.count({ where: { categoryId: id } });
  if (count)
    return NextResponse.json(
      { error: "Move or archive products in this category first" },
      { status: 409 },
    );
  await db.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
