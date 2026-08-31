"use client";

import { useState } from "react";
import Link from "next/link";

const reasons = [
  ["Order support", "Tracking, delivery, damage or an order update"],
  ["Custom piece", "A different size, form, finish or personalised detail"],
  ["Bulk gifting", "Wedding, festive, corporate or hospitality requirements"],
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "", privacyAccepted: false });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  async function submit(event) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "Please check your message and try again.");
      setStatus("sent");
    } catch (requestError) {
      setError(requestError.message || "We could not send your message.");
      setStatus("idle");
    }
  }

  return (
    <div>
      <section className="border-b border-walnut/10 bg-white/45">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.05fr_.95fr] md:items-end md:py-20">
          <div>
            <p className="font-data text-xs uppercase tracking-[.22em] text-sienna">Talk to WOODLOOM</p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[.96] text-walnut sm:text-6xl md:text-7xl">Tell us what you are looking for.</h1>
          </div>
          <p className="max-w-lg font-body text-sm leading-7 text-walnut/60 md:pb-1">Get help with an existing order, discuss a custom wooden piece or plan gifting for a larger occasion. More detail helps us give you a useful answer sooner.</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <aside>
            <p className="font-body text-xs font-semibold uppercase tracking-[.16em] text-walnut/45">How we can help</p>
            <div className="mt-5 divide-y divide-walnut/10 border-y border-walnut/10">
              {reasons.map(([title, text], index) => (
                <div key={title} className="grid grid-cols-[34px_1fr] gap-3 py-5">
                  <span className="font-data text-xs text-sienna">0{index + 1}</span>
                  <div><h2 className="font-display text-2xl text-walnut">{title}</h2><p className="mt-1 font-body text-xs leading-5 text-walnut/55">{text}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl bg-walnut p-6 text-ivory">
              <p className="font-display text-2xl">Prefer a quick conversation?</p>
              <p className="mt-2 font-body text-xs leading-6 text-ivory/65">WhatsApp is useful for product photos, dimensions and order references.</p>
              <a href="https://wa.me/917452905405" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex rounded-full bg-[#25D366] px-5 py-2.5 font-body text-xs font-semibold text-white">Start WhatsApp chat</a>
            </div>
            <p className="mt-6 font-body text-xs leading-6 text-walnut/50">For care questions, our <Link href="/care" className="text-sienna underline underline-offset-4">wood care guide</Link> may have the answer immediately.</p>
          </aside>

          <section className="rounded-[28px] border border-walnut/10 bg-white p-6 shadow-carve sm:p-9">
            {status === "sent" ? (
              <div role="status" className="py-12 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-xl text-sage">✓</span>
                <h2 className="mt-5 font-display text-4xl text-walnut">Message received.</h2>
                <p className="mx-auto mt-3 max-w-md font-body text-sm leading-7 text-walnut/60">Thank you for writing to us. We will review the details and reply through the email you provided.</p>
                <Link href="/products" className="mt-7 inline-flex rounded-full bg-walnut px-6 py-3 font-body text-xs font-semibold uppercase tracking-[.14em] text-white">Continue browsing</Link>
              </div>
            ) : (
              <form onSubmit={submit}>
                <p className="font-data text-xs uppercase tracking-[.2em] text-sienna">Send an enquiry</p>
                <h2 className="mt-2 font-display text-4xl text-walnut">Write to the workshop</h2>
                <p className="mt-3 font-body text-xs leading-6 text-walnut/55">For order support, include your order number. For custom work, include size, quantity, preferred timeline and reference details.</p>
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <Field label="Your name" type="text" value={form.name} onChange={(value) => update("name", value)} autoComplete="name" />
                  <Field label="Email address" type="email" value={form.email} onChange={(value) => update("email", value)} autoComplete="email" />
                </div>
                <label className="mt-5 block">
                  <span className="font-body text-xs text-walnut/60">How can we help?</span>
                  <textarea required minLength={10} maxLength={2000} rows={7} value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Share the product, order number, quantity or dimensions…" className="focus-ring mt-2 w-full resize-y rounded-xl border border-walnut/15 bg-sand-light px-4 py-3.5 font-body text-sm leading-6 text-walnut shadow-carve-inset" />
                  <span className="mt-1 block text-right font-data text-[10px] text-walnut/35">{form.message.length} / 2000</span>
                </label>
                <label className="mt-4 flex items-start gap-3 font-body text-xs leading-5 text-walnut/65">
                  <input type="checkbox" required checked={form.privacyAccepted} onChange={(event) => update("privacyAccepted", event.target.checked)} className="mt-0.5 h-4 w-4 accent-walnut" />
                  <span>I agree that my details will be used to respond to this request, as explained in the <Link href="/privacy" className="text-sienna underline">Privacy Policy</Link>.</span>
                </label>
                {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-700">{error}</p>}
                <button disabled={status === "sending"} className="mt-7 w-full rounded-full bg-walnut px-6 py-3.5 font-body text-xs font-semibold uppercase tracking-[.14em] text-ivory transition hover:bg-sienna disabled:cursor-wait disabled:opacity-50 sm:w-auto">{status === "sending" ? "Sending…" : "Send enquiry"}</button>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function Field({ label, type, value, onChange, autoComplete }) {
  return <label className="block"><span className="font-body text-xs text-walnut/60">{label}</span><input type={type} required value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} className="focus-ring mt-2 w-full rounded-xl border border-walnut/15 bg-sand-light px-4 py-3.5 font-body text-sm text-walnut shadow-carve-inset" /></label>;
}
