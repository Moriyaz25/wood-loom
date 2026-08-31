"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import { useConfirmDialog } from "@/components/ui/ConfirmDialogProvider";

export default function AccountPage() {
  const confirmAction = useConfirmDialog();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("orders");
  useEffect(() => {
    fetch("/api/account", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => router.push("/login"));
  }, [router]);
  useEffect(() => {
    if (data?.user?.role === "ADMIN" || data?.user?.role === "STAFF")
      router.replace("/admin");
  }, [data, router]);
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }
  async function removeAccount() {
    const confirmed = await confirmAction({
      eyebrow: "Privacy & data",
      title: "Delete your WOODLOOM account?",
      description: "Your profile, saved addresses and wishlist will be permanently removed.",
      note: "Historic order records will be anonymised and retained only where legally required.",
      confirmLabel: "Delete my account",
      cancelLabel: "Keep my account",
    });
    if (!confirmed) return;
    await fetch("/api/account", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }
  if (!data)
    return (
      <div className="mx-auto max-w-6xl px-5 py-20 font-body text-walnut/60">
        Loading your account…
      </div>
    );
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-data text-xs uppercase tracking-[.2em] text-sienna">
            Your private space
          </p>
          <h1 className="mt-2 font-display text-3xl text-walnut">
            Hello, {data.user.name}
          </h1>
          <p className="mt-1 font-body text-sm text-walnut/60">
            {data.user.email}
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-full border border-walnut/20 px-5 py-2 font-body text-sm"
        >
          Sign out
        </button>
      </div>
      <div className="mt-10 grid gap-8 md:grid-cols-[220px_1fr]">
        <nav className="space-y-2">
          {[
            ["profile", "Profile settings"],
            ["orders", "Orders"],
            ["liked", `Liked items (${data.wishlist?.length || 0})`],
            ["addresses", "Addresses"],
            ["privacy", "Privacy & data"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full rounded-xl px-4 py-3 text-left font-body text-sm ${tab === id ? "bg-walnut text-ivory" : "bg-ivory text-walnut shadow-carve"}`}
            >
              {label}
            </button>
          ))}
        </nav>
        <section>
          {tab === "profile" && (
            <ProfileEditor
              user={data.user}
              onSaved={(user) => setData({ ...data, user })}
            />
          )}
          {tab === "liked" && (
            <div>
              <h2 className="font-display text-2xl text-walnut">Liked items</h2>
              <p className="mt-1 font-body text-sm text-walnut/50">
                Pieces you saved for later.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
                {data.wishlist?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {!data.wishlist?.length && (
                <div className="mt-6">
                  <Empty text="You have not liked any pieces yet." />
                </div>
              )}
            </div>
          )}
          {tab === "orders" && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-walnut">
                Track your orders
              </h2>
              {data.orders.map((o) => (
                <article
                  key={o.id}
                  className="rounded-xl border border-walnut/10 bg-white p-5 shadow-carve"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-data text-sm text-walnut">
                        {o.orderNumber}
                      </p>
                      <p className="font-body text-xs text-walnut/50">
                        {new Date(o.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-data text-sm">
                        ₹{o.total.toLocaleString("en-IN")}
                      </p>
                      <p className="font-body text-xs text-sage">{o.status}</p>
                    </div>
                  </div>
                  <p className="mt-3 font-body text-xs text-walnut/60">
                    {o.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}
                  </p>
                  <OrderTimeline status={o.status} />
                  <div className="mt-4 grid gap-2 rounded-xl bg-sand/35 p-3 font-body text-xs text-walnut/60 sm:grid-cols-2">
                    <p>Payment: {o.paymentStatus || "PENDING"}</p>
                    <p>Method: {o.paymentMethod || "UPI"}</p>
                    {o.paymentReference && (
                      <p className="sm:col-span-2">
                        UPI ref: {o.paymentReference}
                      </p>
                    )}
                  </div>
                </article>
              ))}
              {!data.orders.length && <Empty text="No orders yet." />}
            </div>
          )}
          {tab === "addresses" && (
            <div>
              <h2 className="font-display text-2xl text-walnut">
                Saved addresses
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {data.addresses.map((a) => (
                  <article
                    key={a.id}
                    className="card-notch-sm bg-ivory p-5 font-body text-sm text-walnut/70 shadow-carve"
                  >
                    <p className="font-medium text-walnut">{a.label}</p>
                    <p className="mt-2">
                      {a.recipientName}
                      <br />
                      {a.addressLine1}
                      <br />
                      {a.city}, {a.state} {a.pincode}
                      <br />
                      {a.phone}
                    </p>
                  </article>
                ))}
                {!data.addresses.length && (
                  <Empty text="Save an address during checkout." />
                )}
              </div>
            </div>
          )}
          {tab === "privacy" && (
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl text-walnut">
                Privacy controls
              </h2>
              <p className="mt-3 font-body text-sm leading-6 text-walnut/70">
                Download a copy of your account information at any time. You can
                also delete your profile and saved addresses. Historic invoices
                are anonymised and retained only where legally required.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/api/account/export"
                  className="rounded-full bg-walnut px-5 py-2.5 font-body text-sm text-ivory"
                >
                  Download my data
                </a>
                <button
                  onClick={removeAccount}
                  className="rounded-full border border-red-300 px-5 py-2.5 font-body text-sm text-red-700"
                >
                  Delete my account
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
function OrderTimeline({ status }) {
  const steps = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"];
  const activeIndex =
    status === "CANCELLED" ? -1 : Math.max(0, steps.indexOf(status));
  return (
    <div className="mt-5">
      <div className="grid grid-cols-5 gap-1">
        {steps.map((step, index) => {
          const active = index <= activeIndex;
          return (
            <div key={step} className="min-w-0">
              <div
                className={`h-1 rounded-full ${active ? "bg-walnut" : "bg-walnut/12"}`}
              />
              <p
                className={`mt-2 truncate font-body text-[10px] uppercase tracking-[.1em] ${active ? "text-walnut" : "text-walnut/38"}`}
              >
                {step.toLowerCase()}
              </p>
            </div>
          );
        })}
      </div>
      {status === "CANCELLED" && (
        <p className="mt-3 font-body text-xs text-sienna">
          This order has been cancelled.
        </p>
      )}
    </div>
  );
}
function Empty({ text }) {
  return (
    <p className="rounded-xl border border-dashed border-walnut/20 p-8 font-body text-sm text-walnut/50">
      {text}
    </p>
  );
}
function ProfileEditor({ user, onSaved }) {
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone || "",
    marketingConsent: user.marketingConsent || false,
  });
  const [status, setStatus] = useState("");
  async function save(e) {
    e.preventDefault();
    setStatus("Saving…");
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, phone: form.phone || null }),
    });
    const json = await res.json();
    if (!res.ok) return setStatus("Please check your details");
    onSaved(json.user);
    setStatus("Profile updated");
  }
  return (
    <form onSubmit={save} className="max-w-xl">
      <h2 className="font-display text-2xl text-walnut">Profile settings</h2>
      <p className="mt-1 font-body text-sm text-walnut/50">
        Update the details used for enquiries and address prefill.
      </p>
      <div className="mt-6 grid gap-4">
        <label className="font-body text-xs text-walnut/60">
          Full name
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 block w-full rounded-xl border border-walnut/15 bg-white px-4 py-3 text-sm"
          />
        </label>
        <label className="font-body text-xs text-walnut/60">
          Email
          <input
            disabled
            value={user.email}
            className="mt-1 block w-full rounded-xl border border-walnut/10 bg-sand/50 px-4 py-3 text-sm"
          />
        </label>
        <label className="font-body text-xs text-walnut/60">
          Phone
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-1 block w-full rounded-xl border border-walnut/15 bg-white px-4 py-3 text-sm"
          />
        </label>
        <label className="flex gap-3 font-body text-sm text-walnut/65">
          <input
            type="checkbox"
            checked={form.marketingConsent}
            onChange={(e) =>
              setForm({ ...form, marketingConsent: e.target.checked })
            }
          />
          Receive occasional product and workshop updates
        </label>
      </div>
      <button className="mt-6 rounded-full bg-walnut px-6 py-3 font-body text-sm text-white">
        Save profile
      </button>
      {status && (
        <span className="ml-4 font-body text-xs text-walnut/50">{status}</span>
      )}
    </form>
  );
}
