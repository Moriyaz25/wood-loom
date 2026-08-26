"use client";

import { useEffect, useState } from "react";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [details, setDetails] = useState({});

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  }, []);

  async function updateOrder(id, patch) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    );
    setDetails((prev) =>
      prev[id] ? { ...prev, [id]: { ...prev[id], ...patch } } : prev,
    );
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }

  async function openDetails(order) {
    const next = openId === order.id ? null : order.id;
    setOpenId(next);
    if (!next || details[order.id]) return;
    const res = await fetch(`/api/admin/orders/${order.id}`);
    const data = await res.json();
    if (res.ok) setDetails((prev) => ({ ...prev, [order.id]: data.order }));
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-[#1c1814]">Orders</h1>
      <p className="mt-1 font-body text-sm text-walnut/55">
        Click any order to view customer, address, payment reference and items.
      </p>

      {loading && (
        <p className="mt-6 font-body text-sm text-walnut/50">Loading...</p>
      )}

      <div className="mt-6 space-y-3">
        {orders.map((order) => {
          const detail = details[order.id] || order;
          return (
            <article
              key={order.id}
              className="border border-walnut/10 bg-white p-4 shadow-carve"
            >
              <button
                type="button"
                onClick={() => openDetails(order)}
                className="focus-ring w-full text-left"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-data text-sm text-walnut">
                      {order.orderNumber}
                    </p>
                    <p className="font-body text-xs text-walnut/60">
                      {order.customerName} · {order.city}, {order.state}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-body text-sm font-semibold text-walnut">
                      ₹{order.total.toLocaleString("en-IN")}
                    </span>
                    <span className="rounded-full bg-sand px-3 py-1 font-body text-[11px] text-walnut/70">
                      {order.status}
                    </span>
                    <span className="font-body text-xs text-sienna">
                      {openId === order.id ? "Hide" : "Details"}
                    </span>
                  </div>
                </div>
                <div className="mt-2 font-body text-xs text-walnut/50">
                  {order.items
                    .map((item) => `${item.name} ×${item.quantity}`)
                    .join(", ")}
                </div>
              </button>

              {openId === order.id && (
                <div className="mt-5 grid gap-5 border-t border-walnut/10 pt-5 lg:grid-cols-[1fr_280px]">
                  <div className="space-y-4 font-body text-sm text-walnut/70">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[.14em] text-sienna">
                        Customer
                      </p>
                      <p className="mt-2">{detail.customerName}</p>
                      <p>{detail.email}</p>
                      <p>{detail.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[.14em] text-sienna">
                        Delivery address
                      </p>
                      <p className="mt-2">
                        {detail.addressLine1}
                        {detail.addressLine2 ? `, ${detail.addressLine2}` : ""}
                        <br />
                        {detail.city}, {detail.state} {detail.pincode}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[.14em] text-sienna">
                        Items
                      </p>
                      <div className="mt-2 divide-y divide-walnut/10">
                        {detail.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between py-2"
                          >
                            <span>
                              {item.name} × {item.quantity}
                            </span>
                            <span>
                              ₹
                              {(item.price * item.quantity).toLocaleString(
                                "en-IN",
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {detail.notes && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[.14em] text-sienna">
                          Note
                        </p>
                        <p className="mt-2">{detail.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4 rounded-xl border border-walnut/10 bg-sand/35 p-4">
                    <label className="block font-body text-xs text-walnut/60">
                      Order status
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrder(order.id, { status: e.target.value })
                        }
                        className="focus-ring mt-1 w-full rounded-lg border border-walnut/15 bg-white px-2 py-2 font-body text-xs"
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block font-body text-xs text-walnut/60">
                      Payment status
                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          updateOrder(order.id, {
                            paymentStatus: e.target.value,
                          })
                        }
                        className="focus-ring mt-1 w-full rounded-lg border border-walnut/15 bg-white px-2 py-2 font-body text-xs"
                      >
                        {PAYMENT_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="font-body text-xs leading-6 text-walnut/60">
                      <p>Method: {detail.paymentMethod}</p>
                      <p>
                        Reference: {detail.paymentReference || "Not entered"}
                      </p>
                      <p>
                        Subtotal: ₹{detail.subtotal.toLocaleString("en-IN")}
                      </p>
                      <p>
                        Shipping: ₹{detail.shippingFee.toLocaleString("en-IN")}
                      </p>
                      <p className="font-semibold text-walnut">
                        Total: ₹{detail.total.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
        {!loading && orders.length === 0 && (
          <p className="font-body text-sm text-walnut/50">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
