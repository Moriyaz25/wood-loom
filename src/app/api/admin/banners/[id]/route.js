import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";
import { bannerPatchSchema } from "@/lib/validators";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = bannerPatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  const banner = await db.banner.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ banner });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.banner.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
