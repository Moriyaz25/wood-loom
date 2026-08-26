import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

const VALID_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];
const VALID_PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export async function GET(request, { params }) {
  const { id } = await params;
  const admin = await getAdminFromRequest(request);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: { select: { name: true, email: true, phone: true } },
    },
  });
  if (!order)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });

  return NextResponse.json({ order });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const admin = await getAdminFromRequest(request);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status, paymentStatus } = await request.json();
  const data = {};
  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 422 });
    }
    data.status = status;
  }
  if (paymentStatus) {
    if (!VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
      return NextResponse.json(
        { error: "Invalid payment status" },
        { status: 422 },
      );
    }
    data.paymentStatus = paymentStatus;
  }
  if (!Object.keys(data).length) {
    return NextResponse.json({ error: "Invalid status" }, { status: 422 });
  }

  const order = await db.order.update({ where: { id }, data });
  return NextResponse.json({ order });
}
