import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkoutSchema } from "@/lib/validators";
import { getUserFromRequest, isSameOrigin } from "@/lib/auth";
import { rateLimit, safeJson } from "@/lib/security";
import { nanoid } from "nanoid";
import { sendOrderEmails } from "@/lib/mailer";
export async function POST(request) {
  if (!isSameOrigin(request))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const user = await getUserFromRequest(request);
  if (!user)
    return NextResponse.json(
      { error: "Please sign in to checkout" },
      { status: 401 },
    );
  if (!rateLimit(request, `checkout:${user.id}`, 5, 600000))
    return NextResponse.json(
      { error: "Too many checkout attempts" },
      { status: 429 },
    );
  const input = await safeJson(request);
  if (input.error) return input.error;
  const parsed = checkoutSchema.safeParse(input.data);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 },
    );
  const existing = await db.order.findUnique({
    where: { idempotencyKey: parsed.data.idempotencyKey },
  });
  if (existing)
    return NextResponse.json({
      order: {
        orderNumber: existing.orderNumber,
        total: existing.total,
        status: existing.status,
      },
    });
  const { items, saveAddress, idempotencyKey, paymentMethod, paymentReference, ...customer } = parsed.data;
  const uniqueIds = [...new Set(items.map((i) => i.productId))];
  if (uniqueIds.length !== items.length)
    return NextResponse.json(
      { error: "Duplicate cart items" },
      { status: 422 },
    );
  const products = await db.product.findMany({
    where: { id: { in: uniqueIds }, status: "ACTIVE" },
  });
  if (products.length !== uniqueIds.length)
    return NextResponse.json(
      { error: "A product is no longer available" },
      { status: 409 },
    );
  const subtotal = items.reduce(
    (sum, item) =>
      sum + products.find((p) => p.id === item.productId).price * item.quantity,
    0,
  );
  const shippingFee = items.reduce((sum, item) => {
    const product = products.find(
      (candidate) => candidate.id === item.productId,
    );
    return sum + product.shippingFee * item.quantity;
  }, 0);
  try {
    const order = await db.$transaction(
      async (tx) => {
        for (const item of items) {
          const changed = await tx.product.updateMany({
            where: {
              id: item.productId,
              status: "ACTIVE",
              stock: { gte: item.quantity },
            },
            data: { stock: { decrement: item.quantity } },
          });
          if (changed.count !== 1) throw new Error("OUT_OF_STOCK");
        }
        const created = await tx.order.create({
          data: {
            orderNumber: `WL-${nanoid(10).toUpperCase()}`,
            idempotencyKey,
            userId: user.id,
            email: user.email,
            ...customer,
            paymentStatus: "PENDING",
            paymentMethod,
            paymentReference,
            paymentSubmittedAt: paymentReference ? new Date() : null,
            subtotal,
            shippingFee,
            total: subtotal + shippingFee,
            items: {
              create: items.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                return {
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: item.quantity,
                };
              }),
            },
          },
        });
        if (saveAddress)
          await tx.address.create({
            data: {
              userId: user.id,
              label: "Home",
              recipientName: customer.customerName,
              phone: customer.phone,
              addressLine1: customer.addressLine1,
              addressLine2: customer.addressLine2,
              city: customer.city,
              state: customer.state,
              pincode: customer.pincode,
            },
          });
        return created;
      },
      { isolationLevel: "Serializable" },
    );
    const orderWithItems = await db.order.findUnique({
      where: { id: order.id },
      include: { items: true },
    });
    await sendOrderEmails(orderWithItems, user);
    return NextResponse.json(
      {
        order: {
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status,
          paymentStatus: order.paymentStatus,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error.message === "OUT_OF_STOCK")
      return NextResponse.json(
        { error: "Stock changed while checking out. Please review your cart." },
        { status: 409 },
      );
    if (error.code === "P2002") {
      const order = await db.order.findUnique({ where: { idempotencyKey } });
      if (order)
        return NextResponse.json({
          order: {
            orderNumber: order.orderNumber,
            total: order.total,
            status: order.status,
          },
        });
    }
    console.error("Order creation failed", error);
    return NextResponse.json(
      { error: "Could not place order" },
      { status: 500 },
    );
  }
}
