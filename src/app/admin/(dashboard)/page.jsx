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
      <div className="hidden rounded-2xl bg-[#21150f] p-6 text-white shadow-xl md:block"><p className="font-data text-[10px] font-semibold uppercase tracking-[.2em] text-[#f38a45]">Store overview</p><h1 className="mt-1 font-display text-4xl">Dashboard</h1></div>

      <div className="grid grid-cols-3 gap-2 md:mt-5 md:gap-4">
        <StatCard label="Live products" value={productCount} />
        <StatCard label="Active banners" value={activeBannerCount} />
        <StatCard label="Total orders" value={orderCount} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:mt-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-lg text-walnut">Low stock</h2>
          <div className="mt-3 space-y-2">
            {lowStock.length === 0 && <p className="font-body text-sm text-walnut/50">Nothing running low.</p>}
            {lowStock.map((p) => (
              <div key={p.id} className="flex justify-between rounded-xl border border-[#4a2816]/15 border-l-4 border-l-[#d46b25] bg-white p-4 shadow-md">
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
              <div key={o.id} className="flex justify-between rounded-xl border border-[#4a2816]/15 border-l-4 border-l-[#087f5b] bg-white p-4 shadow-md">
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
    <div className="min-w-0 rounded-2xl border border-[#4a2816]/15 bg-[#fff8f1] p-3 shadow-md sm:p-5">
      <p className="font-data text-xl font-bold text-[#c55312] sm:text-3xl">{value}</p>
      <p className="mt-1 break-words font-body text-[10px] font-semibold leading-4 text-[#4a2816] sm:text-xs">{label}</p>
    </div>
  );
}
