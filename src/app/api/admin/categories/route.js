import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminFromRequest, isSameOrigin } from "@/lib/auth";
import { categorySchema } from "@/lib/validators";
export async function GET(request) {
  if (!(await getAdminFromRequest(request)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ categories });
}
export async function POST(request) {
  const admin = await getAdminFromRequest(request);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSameOrigin(request))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const parsed = categorySchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 },
    );
  const category = await db.category.create({ data: parsed.data });
  return NextResponse.json({ category }, { status: 201 });
}
