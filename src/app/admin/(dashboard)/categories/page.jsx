"use client";
import { useEffect, useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import { useConfirmDialog } from "@/components/ui/ConfirmDialogProvider";
const blank = { name: "", slug: "", description: "", image: "" };
export default function CategoriesPage() {
  const confirmAction = useConfirmDialog();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  async function load() {
    const r = await fetch("/api/admin/categories");
    const d = await r.json();
    setCategories(d.categories || []);
  }
  useEffect(() => {
    load();
  }, []);
  function change(k, v) {
    setForm((f) => ({
      ...f,
      [k]: v,
      ...(k === "name" && !editing
        ? {
            slug: v
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, ""),
          }
        : {}),
    }));
  }
  async function save(e) {
    e.preventDefault();
    setError("");
    const r = await fetch(
      editing ? `/api/admin/categories/${editing}` : "/api/admin/categories",
      {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: form.image || null }),
      },
    );
    const d = await r.json();
    if (!r.ok)
      return setError(
        typeof d.error === "string" ? d.error : "Please check all fields",
      );
    setForm(blank);
    setEditing(null);
    load();
  }
  function edit(c) {
    setEditing(c.id);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      image: c.image || "",
    });
  }
  async function remove(c) {
    const confirmed = await confirmAction({
      eyebrow: "Category removal",
      title: `Delete ${c.name}?`,
      description: "This category will be removed from catalog navigation and product filters.",
      note: c._count.products ? `${c._count.products} product${c._count.products === 1 ? " is" : "s are"} currently assigned to it. Reassign them before deleting.` : "No products are currently assigned to this category.",
      confirmLabel: "Delete category",
      cancelLabel: "Keep category",
    });
    if (!confirmed) return;
    const r = await fetch(`/api/admin/categories/${c.id}`, {
      method: "DELETE",
    });
    const d = await r.json();
    if (!r.ok) return setError(d.error);
    load();
  }
  return (
    <div>
      <div className="rounded-2xl bg-[#21150f] p-6 text-white shadow-xl">
        <p className="font-data text-xs font-semibold uppercase tracking-[.2em] text-[#f38a45]">
          Catalog structure
        </p>
        <h1 className="mt-2 font-display text-4xl text-white">Categories</h1>
        <p className="mt-2 font-body text-sm text-white/65">
          Create collections used by product forms and storefront filters.
        </p>
      </div>
      <form
        onSubmit={save}
        className="mt-5 rounded-2xl border-2 border-[#d46b25]/25 bg-[#fffaf4] p-6 shadow-[0_18px_45px_rgba(42,27,18,.14)]"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Category name"
            value={form.name}
            onChange={(v) => change("name", v)}
          />
          <Field
            label="URL slug"
            value={form.slug}
            onChange={(v) => change("slug", v)}
          />
          <label className="md:col-span-2">
            <span className="font-body text-xs text-walnut/60">
              Description
            </span>
            <textarea
              value={form.description}
              onChange={(e) => change("description", e.target.value)}
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-[#4a2816]/25 bg-white p-3 font-body text-sm text-[#21150f] outline-none focus:border-[#d46b25] focus:ring-2 focus:ring-[#d46b25]/15"
            />
          </label>
          <div className="md:col-span-2">
            <ImageUploader
              value={form.image}
              onChange={(v) => change("image", v)}
            />
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <div className="mt-5 flex gap-3">
          <button className="rounded-full bg-[#d45d12] px-6 py-3 font-body text-sm font-bold text-white shadow-lg transition hover:bg-[#ad4308]">
            {editing ? "Update category" : "Create category"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(blank);
              }}
              className="rounded-full border border-[#4a2816]/25 bg-white px-5 text-sm font-semibold text-[#4a2816]"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="mt-8 grid gap-3">
        {categories.map((c) => (
          <article
            key={c.id}
            className="flex items-center justify-between rounded-2xl border border-[#4a2816]/15 border-l-4 border-l-[#d46b25] bg-white p-5 shadow-[0_10px_28px_rgba(42,27,18,.12)]"
          >
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#21150f]">{c.name}</h2>
              <p className="mt-1 font-body text-xs font-medium text-[#765344]">
                /{c.slug} · {c._count.products} products
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => edit(c)} className="rounded-full bg-[#21150f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d46b25]">
                Edit
              </button>
              <button
                onClick={() => remove(c)}
                className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-700 hover:text-white"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
function Field({ label, value, onChange }) {
  return (
    <label>
      <span className="font-body text-xs font-semibold text-[#583522]">{label}</span>
      <input
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-[#4a2816]/25 bg-white px-4 py-3 font-body text-sm text-[#21150f] outline-none focus:border-[#d46b25] focus:ring-2 focus:ring-[#d46b25]/15"
      />
    </label>
  );
}
