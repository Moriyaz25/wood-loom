import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  return NextResponse.json({ admin });
}
