"use client";

import { useEffect, useState } from "react";
import BulkUploadPanel from "@/components/admin/BulkUploadPanel";
import ProductMediaUploader from "@/components/admin/ProductMediaUploader";
import { useConfirmDialog } from "@/components/ui/ConfirmDialogProvider";

const emptyForm = {
  name: "",
  slug: "",
  shortDesc: "",
  description: "",
  price: "",
  compareAtPrice: "",
  stock: "",
  shippingFee: "100",
  sku: "",
  materials: "",
  dimensions: "",
  careInstructions: "",
  categoryId: "",
  media: [],
};

export default function AdminProductsPage() {
  const confirmAction = useConfirmDialog();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    const [res, categoryRes] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/categories"),
    ]);
    const [data, categoryData] = await Promise.all([
      res.json(),
      categoryRes.json(),
    ]);
    setProducts(data.products || []);
    setCategories(categoryData.categories || []);
  }

  useEffect(() => {
    loadProducts();
    fetch("/api/products").then((r) => r.json()); // warms cache, category list below is derived
  }, []);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function closeForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError(null);
  }

  function editProduct(product) {
    setForm({
      name: product.name,
      slug: product.slug,
      shortDesc: product.shortDesc,
      description: product.description,
      price: String(product.price),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
      stock: String(product.stock),
      shippingFee: String(product.shippingFee ?? 0),
      sku: product.sku,
      materials: product.materials || "",
      dimensions: product.dimensions || "",
      careInstructions: product.careInstructions || "",
      categoryId: product.categoryId,
      media: (product.images || []).map(({ url, altText, mediaType }) => ({ url, altText, mediaType })),
    });
    setEditingId(product.id);
    setShowForm(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function togglePromoted(product) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, isPromoted: !p.isPromoted } : p,
      ),
    );
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPromoted: !product.isPromoted }),
    });
  }

  async function toggleFeatured(product) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, isFeatured: !p.isFeatured } : p,
      ),
    );
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !product.isFeatured }),
    });
  }

  async function deleteProduct(id) {
    const product = products.find((item) => item.id === id);
    const confirmed = await confirmAction({
      eyebrow: "Product visibility",
      title: `Remove ${product?.name || "this product"}?`,
      description: "It will disappear from the storefront and customers will no longer be able to purchase it.",
      note: "Existing order history will remain safely preserved.",
      confirmLabel: "Remove product",
      cancelLabel: "Keep product",
    });
    if (!confirmed) return;
    setError(null);
    const previous = products;
    setProducts((current) => current.filter((product) => product.id !== id));
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setProducts(previous);
      setError(data.error || "Product could not be removed. Please try again.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      slug: form.slug,
      shortDesc: form.shortDesc,
      description: form.description,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      stock: Number(form.stock),
      shippingFee: Number(form.shippingFee),
      sku: form.sku,
      materials: form.materials || null,
      dimensions: form.dimensions || null,
      careInstructions: form.careInstructions || null,
      categoryId: form.categoryId,
      images: form.media.length ? form.media : [{ url: "/textures/placeholder-product.svg", mediaType: "IMAGE" }],
    };

    const res = await fetch(editingId ? `/api/admin/products/${editingId}` : "/api/admin/products", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(JSON.stringify(data.error));
      setSaving(false);
      return;
    }

    closeForm();
    setSaving(false);
    loadProducts();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div><p className="font-data text-[10px] font-semibold uppercase tracking-[.2em] text-[#c55f1d]">Catalog management</p><h1 className="mt-1 font-display text-4xl text-[#21150f]">Products</h1></div>
        <button
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
          className="focus-ring rounded-full bg-[#d46b25] px-5 py-3 font-body text-sm font-semibold text-white shadow-[0_10px_24px_rgba(212,107,37,.3)] transition hover:bg-[#b95016]"
        >
          {showForm ? "Cancel" : "+ Add product"}
        </button>
      </div>

      <BulkUploadPanel onImported={loadProducts} />

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-2xl border-2 border-[#d46b25]/25 bg-[#fffaf4] p-6 shadow-[0_18px_45px_rgba(42,27,18,.14)]"
        >
          <div className="flex items-start justify-between gap-4 border-b border-walnut/10 pb-4">
            <div>
              <p className="font-data text-[10px] uppercase tracking-[.18em] text-sienna">{editingId ? "Edit catalog item" : "New catalog item"}</p>
              <h2 className="mt-1 font-display text-3xl text-walnut">{editingId ? `Editing ${form.name}` : "Add a new product"}</h2>
            </div>
            {editingId && <span className="rounded-full bg-sage/15 px-3 py-1 font-body text-xs font-semibold text-sage-dark">Editing</span>}
          </div>
          {categories.length === 0 && (
            <p className="font-body text-xs text-walnut/50">
              No categories yet — create one directly in the database (Prisma
              Studio) before adding your first product, then this dropdown will
              populate.
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Name"
              value={form.name}
              onChange={(v) => updateField("name", v)}
              required
            />
            <Field
              label="Slug"
              value={form.slug}
              onChange={(v) => updateField("slug", v)}
              required
            />
            <Field
              label="SKU"
              value={form.sku}
              onChange={(v) => updateField("sku", v)}
              required
            />
            <label className="block">
              <span className="font-body text-xs text-walnut/60">Category</span>
              <select
                value={form.categoryId}
                onChange={(e) => updateField("categoryId", e.target.value)}
                required
                className="focus-ring mt-1 w-full rounded-lg border border-walnut/15 bg-ivory px-3 py-2 font-body text-sm shadow-carve-inset"
              >
                <option value="">Select...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label="Price (₹)"
              type="number"
              value={form.price}
              onChange={(v) => updateField("price", v)}
              required
            />
            <Field
              label="Compare-at price (₹)"
              type="number"
              value={form.compareAtPrice}
              onChange={(v) => updateField("compareAtPrice", v)}
            />
            <Field
              label="Stock"
              type="number"
              value={form.stock}
              onChange={(v) => updateField("stock", v)}
              required
            />
            <Field
              label="Shipping charge (₹)"
              type="number"
              value={form.shippingFee}
              onChange={(v) => updateField("shippingFee", v)}
              required
            />
          </div>
          <div><p className="mb-2 font-body text-xs text-walnut/60">Product gallery <span className="text-sienna">*</span></p><ProductMediaUploader value={form.media} onChange={(value) => updateField("media", value)} /></div>
          <Field
            label="Short description"
            value={form.shortDesc}
            onChange={(v) => updateField("shortDesc", v)}
            required
          />
          <label className="block">
            <span className="font-body text-xs text-walnut/60">
              Full description
            </span>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              required
              rows={3}
              className="focus-ring mt-1 w-full rounded-lg border border-walnut/15 bg-ivory px-3 py-2 font-body text-sm shadow-carve-inset"
            />
          </label>
          <div className="grid grid-cols-3 gap-3">
            <Field
              label="Materials"
              value={form.materials}
              onChange={(v) => updateField("materials", v)}
            />
            <Field
              label="Dimensions"
              value={form.dimensions}
              onChange={(v) => updateField("dimensions", v)}
            />
            <Field
              label="Care instructions"
              value={form.careInstructions}
              onChange={(v) => updateField("careInstructions", v)}
            />
          </div>

          {error && <p className="font-body text-xs text-sienna">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="focus-ring rounded-full bg-walnut px-5 py-2 font-body text-sm text-ivory shadow-carve disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Save changes" : "Save product"}
          </button>
        </form>
      )}

      <div className="mt-8 space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#2a1b12]/15 border-l-4 border-l-[#d46b25] bg-white p-5 shadow-[0_10px_28px_rgba(42,27,18,.1)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(42,27,18,.16)]"
          >
            <div>
              <p className="font-body text-base font-semibold text-[#21150f]">{product.name}</p>
              <p className="mt-1 font-data text-xs font-medium text-[#765344]">
                ₹{product.price} · shipping ₹{product.shippingFee} per unit ·
                stock {product.stock} · {product.category.name}
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 font-body text-xs sm:w-auto sm:gap-4">
              <button onClick={() => editProduct(product)} className="focus-ring rounded-full bg-[#21150f] px-4 py-2 font-semibold text-white transition hover:bg-[#d46b25]">Edit product</button>
              <PriceEditor product={product} onSaved={loadProducts} />
              <ShippingEditor product={product} onSaved={loadProducts} />
              <ToggleChip
                active={product.isPromoted}
                onClick={() => togglePromoted(product)}
                label="Promoted (ads)"
              />
              <ToggleChip
                active={product.isFeatured}
                onClick={() => toggleFeatured(product)}
                label="Featured"
              />
              <button
                onClick={() => deleteProduct(product.id)}
                className="focus-ring rounded-full border border-red-200 px-3 py-2 font-semibold text-red-700 transition hover:bg-red-700 hover:text-white"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="font-body text-sm text-walnut/50">No products yet.</p>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }) {
  return (
    <label className="block">
      <span className="font-body text-xs font-semibold text-[#513326]">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring mt-1 w-full rounded-lg border border-[#513326]/25 bg-white px-3 py-2.5 font-body text-sm text-[#21150f] shadow-sm"
      />
    </label>
  );
}

function PriceEditor({ product, onSaved }) {
  const [value, setValue] = useState(String(product.price));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function save() {
    const price = Number(value);
    if (!Number.isInteger(price) || price <= 0) {
      setMessage("Enter a valid whole-number price");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error?.formErrors?.[0] || "Could not update price");
      setMessage("Saved");
      await onSaved();
    } catch (error) {
      setMessage(error.message || "Could not update price");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-1 rounded-full border border-[#513326]/25 bg-[#fff8f1] px-2 py-1">
        <span className="font-medium text-[#765344]">Price ₹</span>
        <input min="1" step="1" inputMode="numeric" type="number" value={value} onChange={(event) => { setValue(event.target.value); setMessage(""); }} className="w-20 bg-transparent text-right outline-none" aria-label={`Price for ${product.name}`} />
        <button type="button" onClick={save} disabled={saving || value === String(product.price)} className="rounded-full bg-[#6b351c] px-2.5 py-1 font-semibold text-white disabled:bg-[#d7c7bc]">{saving ? "…" : "Save"}</button>
      </div>
      {message && <p className={`mt-1 text-[10px] ${message === "Saved" ? "text-green-700" : "text-red-600"}`}>{message}</p>}
    </div>
  );
}

function ShippingEditor({ product, onSaved }) {
  const [value, setValue] = useState(String(product.shippingFee ?? 100));
  const [saving, setSaving] = useState(false);
  async function save() {
    setSaving(true);
    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shippingFee: Number(value) }),
    });
    setSaving(false);
    if (response.ok) onSaved();
  }
  return (
    <div className="flex items-center gap-1 rounded-full border border-[#513326]/25 bg-[#fff8f1] px-2 py-1">
      <span className="font-medium text-[#765344]">Shipping ₹</span>
      <input
        min="0"
        type="number"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="w-16 bg-transparent text-right outline-none"
        aria-label={`Shipping charge for ${product.name}`}
      />
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="rounded-full bg-[#6b351c] px-2.5 py-1 font-semibold text-white disabled:opacity-50"
      >
        {saving ? "…" : "Save"}
      </button>
    </div>
  );
}

function ToggleChip({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`focus-ring rounded-full px-3 py-1 transition-colors ${
        active ? "bg-[#087f5b] font-semibold text-white shadow-sm" : "border border-[#a96b42]/35 bg-[#fff4e8] font-semibold text-[#9a4d1d]"
      }`}
    >
      {label}
    </button>
  );
}
