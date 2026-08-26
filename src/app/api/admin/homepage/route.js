import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  HOME_CONTENT_KEY,
  defaultHomeContent,
  getHomeContent,
} from "@/lib/homeContent";

export async function GET(request) {
  const admin = await getAdminFromRequest(request);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const content = await getHomeContent();
  return NextResponse.json({ content, defaults: defaultHomeContent });
}

export async function PUT(request) {
  const admin = await getAdminFromRequest(request);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const content = body?.content;
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return NextResponse.json(
      { error: "Homepage content must be a JSON object." },
      { status: 422 },
    );
  }

  const saved = await db.siteContent.upsert({
    where: { key: HOME_CONTENT_KEY },
    update: { data: content },
    create: { key: HOME_CONTENT_KEY, data: content },
  });

  return NextResponse.json({ content: saved.data });
}
