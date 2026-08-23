"use client";

import { useEffect, useState } from "react";

const STATUSES = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id, status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-walnut">Orders</h1>

      {loading && <p className="mt-6 font-body text-sm text-walnut/50">Loading...</p>}

      <div className="mt-6 space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="card-notch-sm bg-ivory p-4 shadow-carve">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-data text-sm text-walnut">{order.orderNumber}</p>
                <p className="font-body text-xs text-walnut/60">
                  {order.customerName} · {order.city}, {order.state}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-data text-sm text-walnut">₹{order.total}</span>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="focus-ring rounded-lg border border-walnut/15 bg-ivory px-2 py-1 font-body text-xs"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-2 font-body text-xs text-walnut/50">
              {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
            </div>
          </div>
        ))}
        {!loading && orders.length === 0 && (
          <p className="font-body text-sm text-walnut/50">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
