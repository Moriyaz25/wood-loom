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
    <section className="card-notch-sm mt-6 border border-sage/20 bg-sage/5 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg text-walnut">
            Bulk product upload
          </h2>
          <p className="mt-1 font-body text-xs text-walnut/60">
            Download the Excel workbook with current category dropdowns, then
            upload up to 500 products.
          </p>
        </div>
        <a
          href="/api/admin/products/template"
          className="rounded-full border border-walnut/20 bg-ivory px-4 py-2 font-body text-xs shadow-carve"
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
          className="font-body text-xs"
        />
        <button
          disabled={!file || status === "Validating…"}
          onClick={upload}
          className="rounded-full bg-walnut px-5 py-2 font-body text-xs text-ivory disabled:opacity-40"
        >
          Validate & import
        </button>
      </div>
      {status && <p className="mt-3 font-body text-xs">{status}</p>}
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
