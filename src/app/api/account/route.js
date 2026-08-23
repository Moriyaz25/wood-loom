import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getUserFromRequest,
  isSameOrigin,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import { profileSchema } from "@/lib/validators";
import { safeJson, publicUser } from "@/lib/security";
export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = await db.user.findUnique({
      where: { id: user.id },
      include: {
        addresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] },
        orders: { include: { items: true }, orderBy: { createdAt: "desc" } },
        wishlistItems: {
          include: { product: { include: { images: true, category: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!data)
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    return NextResponse.json({
      user: publicUser(data),
      addresses: data.addresses,
      orders: data.orders,
      wishlist: data.wishlistItems.map((item) => item.product),
    });
  } catch (error) {
    console.error("Account fetch failed", error);
    return NextResponse.json(
      { error: "Could not load account" },
      { status: 500 },
    );
  }
}
export async function PATCH(request) {
  if (!isSameOrigin(request))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const user = await getUserFromRequest(request);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const input = await safeJson(request);
  if (input.error) return input.error;
  const parsed = profileSchema.safeParse(input.data);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 },
    );
  const updated = await db.user.update({
    where: { id: user.id },
    data: {
      ...parsed.data,
      marketingConsentedAt: parsed.data.marketingConsent
        ? user.marketingConsentedAt || new Date()
        : null,
    },
  });
  return NextResponse.json({ user: publicUser(updated) });
}
export async function DELETE(request) {
  if (!isSameOrigin(request))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const user = await getUserFromRequest(request);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db.$transaction([
    db.address.deleteMany({ where: { userId: user.id } }),
    db.user.update({
      where: { id: user.id },
      data: {
        name: "Deleted customer",
        email: `deleted-${user.id}@privacy.invalid`,
        phone: null,
        passwordHash: "DELETED",
        marketingConsent: false,
        marketingConsentedAt: null,
        tokenVersion: { increment: 1 },
      },
    }),
  ]);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return response;
}
