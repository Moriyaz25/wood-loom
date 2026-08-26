"use client";

import { useEffect, useState } from "react";

export default function AdminHomepagePage() {
  const [content, setContent] = useState("");
  const [defaults, setDefaults] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((res) => res.json())
      .then((data) => {
        setContent(JSON.stringify(data.content || {}, null, 2));
        setDefaults(JSON.stringify(data.defaults || {}, null, 2));
      })
      .catch(() => setError("Homepage content load nahi ho paya."));
  }, []);

  async function saveContent(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      setSaving(false);
      setError("JSON valid nahi hai. Comma, quotes aur brackets check karo.");
      return;
    }

    const res = await fetch("/api/admin/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: parsed }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Save nahi ho paya.");
      return;
    }

    setContent(JSON.stringify(data.content, null, 2));
    setMessage("Homepage content saved. Public homepage refresh karo.");
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl leading-none text-[#1c1814]">
            Homepage
          </h1>
          <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-walnut/60">
            Hero ke niche wale homepage sections, headings, review text,
            category tiles, story/gifting copy aur lifestyle images yahan se
            editable hain. Products, categories aur hero banners apne existing
            admin pages se editable rahenge.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setContent(defaults)}
          className="focus-ring rounded-full border border-walnut/15 bg-white px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-[.12em] text-walnut"
        >
          Reset defaults
        </button>
      </div>

      <form onSubmit={saveContent} className="mt-6">
        <label className="block">
          <span className="font-body text-xs font-semibold uppercase tracking-[.16em] text-sienna">
            Homepage JSON
          </span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            spellCheck={false}
            rows={28}
            className="focus-ring mt-2 w-full rounded-xl border border-walnut/15 bg-white p-4 font-data text-xs leading-6 text-[#1c1814] shadow-carve-inset"
          />
        </label>

        {error && <p className="mt-3 font-body text-sm text-sienna">{error}</p>}
        {message && (
          <p className="mt-3 font-body text-sm text-walnut/60">{message}</p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="focus-ring rounded-full bg-walnut-dark px-7 py-3 font-body text-xs font-semibold uppercase tracking-[.14em] text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save homepage"}
          </button>
          <a
            href="/"
            target="_blank"
            className="focus-ring rounded-full border border-walnut/15 px-7 py-3 font-body text-xs font-semibold uppercase tracking-[.14em] text-walnut"
          >
            Preview homepage
          </a>
        </div>
      </form>
    </div>
  );
}
