import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [productCount, activeBannerCount, orderCount, lowStock, recentOrders] = await Promise.all([
    db.product.count({ where: { status: "ACTIVE" } }),
    db.banner.count({ where: { active: true } }),
    db.order.count(),
    db.product.findMany({ where: { stock: { lte: 3 }, status: "ACTIVE" }, take: 5 }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl text-walnut">Dashboard</h1>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatCard label="Live products" value={productCount} />
        <StatCard label="Active banners" value={activeBannerCount} />
        <StatCard label="Total orders" value={orderCount} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-lg text-walnut">Low stock</h2>
          <div className="mt-3 space-y-2">
            {lowStock.length === 0 && <p className="font-body text-sm text-walnut/50">Nothing running low.</p>}
            {lowStock.map((p) => (
              <div key={p.id} className="card-notch-sm flex justify-between bg-ivory p-3 shadow-carve">
                <span className="font-body text-sm text-walnut">{p.name}</span>
                <span className="font-data text-sm text-sienna">{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg text-walnut">Recent orders</h2>
          <div className="mt-3 space-y-2">
            {recentOrders.length === 0 && <p className="font-body text-sm text-walnut/50">No orders yet.</p>}
            {recentOrders.map((o) => (
              <div key={o.id} className="card-notch-sm flex justify-between bg-ivory p-3 shadow-carve">
                <span className="font-data text-sm text-walnut">{o.orderNumber}</span>
                <span className="font-body text-xs text-walnut/60">{o.status}</span>
                <span className="font-data text-sm text-walnut">₹{o.total}</span>
              </div>
            ))}
          </div>
          <Link href="/admin/orders" className="focus-ring mt-3 inline-block font-body text-xs text-sienna hover:underline">
            View all orders →
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card-notch-sm bg-ivory p-5 shadow-carve">
      <p className="font-data text-2xl text-walnut">{value}</p>
      <p className="font-body text-xs text-walnut/60">{label}</p>
    </div>
  );
}
