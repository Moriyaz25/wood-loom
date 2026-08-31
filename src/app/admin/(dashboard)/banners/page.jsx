"use client";

import { useEffect, useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import { useConfirmDialog } from "@/components/ui/ConfirmDialogProvider";

const emptyForm = {
  title: "",
  subtitle: "",
  image: "",
  ctaLabel: "",
  ctaLink: "",
  festivalTag: "",
  position: "HERO",
  priority: "0",
  productId: "",
  startDate: "",
  endDate: ""
};

const POSITIONS = ["HERO", "STRIP", "PRODUCT_PAGE", "CATEGORY_TOP"];

export default function AdminBannersPage() {
  const confirmAction = useConfirmDialog();
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function loadBanners() {
    const res = await fetch("/api/admin/banners");
    const data = await res.json();
    setBanners(data.banners || []);
  }

  useEffect(() => {
    loadBanners();
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []));
  }, []);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function toggleActive(banner) {
    setBanners((prev) => prev.map((b) => (b.id === banner.id ? { ...b, active: !b.active } : b)));
    await fetch(`/api/admin/banners/${banner.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !banner.active })
    });
  }

  async function deleteBanner(id) {
    const banner = banners.find((item) => item.id === id);
    const confirmed = await confirmAction({
      eyebrow: "Campaign removal",
      title: `Delete ${banner?.title || "this banner"}?`,
      description: "This campaign creative will be permanently removed from the admin panel and storefront.",
      confirmLabel: "Delete banner",
      cancelLabel: "Keep banner",
    });
    if (!confirmed) return;
    setBanners((prev) => prev.filter((b) => b.id !== id));
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      subtitle: form.subtitle || null,
      image: form.image,
      ctaLabel: form.ctaLabel || null,
      ctaLink: form.ctaLink || null,
      festivalTag: form.festivalTag || null,
      position: form.position,
      priority: Number(form.priority) || 0,
      productId: form.productId || null,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null
    };

    const res = await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const data = await res.json();
      setError(JSON.stringify(data.error));
      setSaving(false);
      return;
    }

    setForm(emptyForm);
    setShowForm(false);
    setSaving(false);
    loadBanners();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-walnut">Banners & Ads</h1>
          <p className="mt-1 font-body text-xs text-walnut/50">
            Runs festival campaigns and per-product promotions across the site — no code changes needed.
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="focus-ring rounded-full bg-sienna px-4 py-2 font-body text-sm text-ivory shadow-carve"
        >
          {showForm ? "Cancel" : "+ New banner"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-notch-sm mt-6 space-y-3 bg-ivory p-6 shadow-carve">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Title" value={form.title} onChange={(v) => updateField("title", v)} required />
            <Field label="Campaign label (optional)" value={form.festivalTag} onChange={(v) => updateField("festivalTag", v)} placeholder="New collection, Limited edition..." />
            <Field label="Subtitle" value={form.subtitle} onChange={(v) => updateField("subtitle", v)} />
            <div><Field label="Image URL" value={form.image} onChange={(v) => updateField("image", v)} required /><ImageUploader value={form.image} onChange={(v) => updateField("image", v)} /></div>
            <Field label="CTA label" value={form.ctaLabel} onChange={(v) => updateField("ctaLabel", v)} placeholder="Shop the edit" />
            <Field label="CTA link" value={form.ctaLink} onChange={(v) => updateField("ctaLink", v)} placeholder="/products" />

            <label className="block">
              <span className="font-body text-xs text-walnut/60">Position</span>
              <select
                value={form.position}
                onChange={(e) => updateField("position", e.target.value)}
                className="focus-ring mt-1 w-full rounded-lg border border-walnut/15 bg-ivory px-3 py-2 font-body text-sm shadow-carve-inset"
              >
                {POSITIONS.map((p) => (
                  <option key={p} value={p}>{p.replace("_", " ")}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="font-body text-xs text-walnut/60">Link to product (optional)</span>
              <select
                value={form.productId}
                onChange={(e) => updateField("productId", e.target.value)}
                className="focus-ring mt-1 w-full rounded-lg border border-walnut/15 bg-ivory px-3 py-2 font-body text-sm shadow-carve-inset"
              >
                <option value="">None</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </label>

            <Field label="Priority (higher shows first)" type="number" value={form.priority} onChange={(v) => updateField("priority", v)} />
            <Field label="Start date (optional)" type="date" value={form.startDate} onChange={(v) => updateField("startDate", v)} />
            <Field label="End date (optional)" type="date" value={form.endDate} onChange={(v) => updateField("endDate", v)} />
          </div>

          {error && <p className="font-body text-xs text-sienna">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="focus-ring rounded-full bg-walnut px-5 py-2 font-body text-sm text-ivory shadow-carve disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save banner"}
          </button>
        </form>
      )}

      <div className="mt-8 space-y-2">
        {banners.map((banner) => (
          <div key={banner.id} className="card-notch-sm flex flex-wrap items-center justify-between gap-3 bg-ivory p-4 shadow-carve">
            <div>
              <p className="font-body text-sm text-walnut">
                {banner.title} {banner.festivalTag && <span className="font-data text-xs text-sienna">· {banner.festivalTag}</span>}
              </p>
              <p className="font-data text-xs text-walnut/50">
                {banner.position} · priority {banner.priority} {banner.product && `· ${banner.product.name}`}
              </p>
            </div>
            <div className="flex items-center gap-4 font-body text-xs">
              <button
                onClick={() => toggleActive(banner)}
                className={`focus-ring rounded-full px-3 py-1 ${banner.active ? "bg-sage text-ivory" : "bg-sand text-walnut/60"}`}
              >
                {banner.active ? "Active" : "Paused"}
              </button>
              <button onClick={() => deleteBanner(banner.id)} className="focus-ring text-sienna hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
        {banners.length === 0 && <p className="font-body text-sm text-walnut/50">No banners yet.</p>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, placeholder }) {
  return (
    <label className="block">
      <span className="font-body text-xs text-walnut/60">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring mt-1 w-full rounded-lg border border-walnut/15 bg-ivory px-3 py-2 font-body text-sm shadow-carve-inset"
      />
    </label>
  );
}
