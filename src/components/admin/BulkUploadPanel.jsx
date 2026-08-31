"use client";
import { useState } from "react";
export default function BulkUploadPanel({ onImported }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState([]);
  async function upload() {
    if (!file) return;
    setStatus("Validating…");
    setErrors([]);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/products/import", {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Import failed");
      setErrors(data.rows || []);
      return;
    }
    setStatus(`${data.imported} products imported successfully`);
    setFile(null);
    onImported?.();
  }
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-[#3d2619] bg-[#241811] p-5 text-white shadow-[0_18px_45px_rgba(36,24,17,.22)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl text-white">
            Bulk product upload
          </h2>
          <p className="mt-1 font-body text-xs text-white/65">
            Download the Excel workbook with current category dropdowns, then
            upload up to 500 products.
          </p>
        </div>
        <a
          href="/api/admin/products/template"
          className="rounded-full bg-[#d46b25] px-5 py-2.5 font-body text-xs font-semibold text-white shadow-lg transition hover:bg-[#ee7c2d]"
        >
          Download Excel template
        </a>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          type="file"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setStatus("");
          }}
          className="max-w-full font-body text-xs text-white file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:font-semibold file:text-[#241811]"
        />
        <button
          disabled={!file || status === "Validating…"}
          onClick={upload}
          className="rounded-full bg-[#0b8f68] px-5 py-2.5 font-body text-xs font-semibold text-white transition hover:bg-[#087657] disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/45"
        >
          Validate & import
        </button>
      </div>
      {status && <p className="mt-3 font-body text-xs font-medium text-[#ffb47e]">{status}</p>}
      {errors.length > 0 && (
        <div className="mt-3 max-h-40 overflow-auto rounded-lg bg-red-50 p-3 font-data text-xs text-red-700">
          {errors.slice(0, 30).map((e) => (
            <p key={`${e.row}-${e.error}`}>
              Row {e.row}: {e.error}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
