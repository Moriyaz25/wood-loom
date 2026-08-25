"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

const empty = {
  customerName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  notes: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const idempotencyKey = useRef(null);
  const [form, setForm] = useState(empty);
  const [email, setEmail] = useState("");
  const [saveAddress, setSaveAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    idempotencyKey.current = crypto.randomUUID();
    fetch("/api/account", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/login?next=/checkout");
          return null;
        }
        if (!response.ok) throw new Error("Could not load your account");
        return response.json();
      })
      .then((data) => {
        if (!data) return;
        const address =
          data.addresses?.find((item) => item.isDefault) || data.addresses?.[0];
        setEmail(data.user.email || "");
        setForm({
          customerName: address?.recipientName || data.user.name || "",
          phone: address?.phone || data.user.phone || "",
          addressLine1: address?.addressLine1 || "",
          addressLine2: address?.addressLine2 || "",
          city: address?.city || "",
          state: address?.state || "",
          pincode: address?.pincode || "",
          notes: "",
        });
        setLoading(false);
      })
      .catch(() => {
        setError("We could not load your saved profile. Please sign in again.");
        setLoading(false);
      });
  }, [router]);

  async function submitCheckout(event) {
    event.preventDefault();
    if (!items.length || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          addressLine2: form.addressLine2 || null,
          notes: form.notes || null,
          saveAddress,
          paymentMethod,
          idempotencyKey: idempotencyKey.current,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await response.json();
      if (response.status === 401) {
        router.push("/login?next=/checkout");
        return;
      }
      if (!response.ok) {
        const fields = data.error?.fieldErrors;
        throw new Error(
          (fields && Object.values(fields).flat().find(Boolean)) ||
            (typeof data.error === "string" ? data.error : "Checkout failed"),
        );
      }
      clearCart();
      router.push(
        `/order-confirmed?orderNumber=${encodeURIComponent(data.order.orderNumber)}&payment=pending&method=${paymentMethod.toLowerCase()}`,
      );
    } catch (checkoutError) {
      setError(checkoutError.message || "Could not save your checkout details");
      setSubmitting(false);
    }
  }

  if (loading)
    return (
      <div className="mx-auto max-w-5xl px-5 py-24 font-body text-walnut/55">
        Loading your saved details…
      </div>
    );
  const productSubtotal = subtotal();
  const shippingTotal = items.reduce(
    (sum, item) => sum + (item.shippingFee ?? 100) * item.quantity,
    0,
  );
  const fields = [
    ["customerName", "Full name", "text", true],
    ["phone", "Mobile number", "tel", true],
    ["addressLine1", "House, street and area", "text", true],
    ["addressLine2", "Apartment, landmark (optional)", "text", false],
    ["city", "City", "text", true],
    ["state", "State", "text", true],
    ["pincode", "PIN code", "text", true],
  ];
  const autocomplete = {
    customerName: "name",
    phone: "tel",
    addressLine1: "address-line1",
    addressLine2: "address-line2",
    city: "address-level2",
    state: "address-level1",
    pincode: "postal-code",
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <nav aria-label="Checkout progress" className="mb-8 grid grid-cols-3 overflow-hidden rounded-full border border-walnut/10 bg-white p-1 font-body text-[10px] font-semibold uppercase tracking-[.12em] text-walnut/45 sm:text-xs">
        <span className="rounded-full bg-walnut px-3 py-2.5 text-center text-ivory">1 · Address</span>
        <span className="px-3 py-2.5 text-center text-walnut">2 · Payment</span>
        <span className="px-3 py-2.5 text-center">3 · Confirm</span>
      </nav>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-data text-xs uppercase tracking-[.2em] text-sienna">
            Secure checkout
          </p>
          <h1 className="mt-2 font-display text-4xl text-walnut sm:text-5xl">
            Delivery details
          </h1>
        </div>
        <p className="max-w-md font-body text-sm leading-6 text-walnut/60">
          Signed in as {email}. Your saved address is prefilled and can be
          updated before submission.
        </p>
      </div>
      <form
        onSubmit={submitCheckout}
        className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px]"
      >
        <section className="rounded-2xl border border-walnut/10 bg-ivory p-5 shadow-carve sm:p-8">
          <div className="mb-5 rounded-xl border border-walnut/10 bg-white/70 px-4 py-3">
            <span className="font-body text-xs uppercase tracking-[.14em] text-walnut/45">
              Country / region
            </span>
            <p className="mt-1 font-body text-sm font-semibold text-walnut">
              India
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(([key, label, type, required]) => (
              <label
                key={key}
                className={`font-body text-xs text-walnut/60 ${key.startsWith("address") ? "sm:col-span-2" : ""}`}
              >
                {label}
                <input
                  type={type}
                  required={required}
                  inputMode={
                    key === "phone" || key === "pincode" ? "numeric" : undefined
                  }
                  autoComplete={autocomplete[key]}
                  value={form[key]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                  className="mt-1.5 block w-full rounded-xl border border-walnut/15 bg-white px-4 py-3.5 text-sm text-walnut outline-none transition focus:border-sienna focus:ring-2 focus:ring-sienna/10"
                />
              </label>
            ))}
            <label className="font-body text-xs text-walnut/60 sm:col-span-2">
              Order note (optional)
              <textarea
                rows={3}
                value={form.notes}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))
                }
                className="mt-1.5 block w-full resize-none rounded-xl border border-walnut/15 bg-white px-4 py-3.5 text-sm text-walnut outline-none transition focus:border-sienna focus:ring-2 focus:ring-sienna/10"
              />
            </label>
          </div>
          <label className="mt-5 flex cursor-pointer items-start gap-3 font-body text-sm text-walnut/70">
            <input
              type="checkbox"
              checked={saveAddress}
              onChange={(event) => setSaveAddress(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-walnut"
            />
            Save this address securely to my profile for future checkout
          </label>
          <div className="mt-8 border-t border-walnut/10 pt-7">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="font-data text-[10px] uppercase tracking-[.18em] text-sienna">Payment</p>
                <h2 className="mt-1 font-display text-2xl text-walnut">Choose how to pay</h2>
              </div>
              <span className="font-body text-[11px] text-walnut/45">Secure · No card data stored</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <PaymentChoice active={paymentMethod === "UPI"} onClick={() => setPaymentMethod("UPI")} icon="UPI" title="UPI / QR" description="Pay using any UPI app" />
              <PaymentChoice active={paymentMethod === "CARD"} onClick={() => setPaymentMethod("CARD")} icon="CARD" title="Credit / Debit Card" description="Processed by a secure gateway" />
            </div>
            <div className="mt-4 rounded-xl border border-sienna/15 bg-sienna/[.05] p-4 font-body text-xs leading-5 text-walnut/65">
              {paymentMethod === "UPI"
                ? "The final UPI ID, QR and order-linked instructions will appear here once configured."
                : "Card details will be collected only by a PCI-compliant gateway. WOODLOOM will never store your card number or CVV."}
            </div>
          </div>
        </section>
        <aside className="rounded-2xl border border-walnut/10 bg-white p-5 shadow-carve sm:p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-2xl text-walnut">Order summary</h2>
          <div className="mt-5 max-h-64 space-y-4 overflow-auto pr-1">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between gap-4 font-body text-sm"
              >
                <span className="text-walnut/70">
                  {item.name}{" "}
                  <span className="text-walnut/40">× {item.quantity}</span>
                </span>
                <span className="shrink-0 text-walnut">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3 border-t border-walnut/10 pt-5 font-body text-sm">
            <div className="flex justify-between text-walnut/60">
              <span>Subtotal</span>
              <span>₹{productSubtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-walnut/60">
              <span>Product shipping</span>
              <span>₹{shippingTotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between border-t border-walnut/10 pt-4 font-display text-xl text-walnut">
              <span>Total</span>
              <span>
                ₹{(productSubtotal + shippingTotal).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-700"
            >
              {error}
            </p>
          )}
          {items.length ? (
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-full bg-walnut px-5 py-3.5 font-body text-sm font-semibold text-ivory transition hover:bg-sienna disabled:cursor-wait disabled:opacity-60"
            >
              {submitting ? "Creating secure order…" : `Continue with ${paymentMethod === "UPI" ? "UPI" : "card"}`}
            </button>
          ) : (
            <Link
              href="/products"
              className="mt-6 block rounded-full bg-walnut py-3.5 text-center font-body text-sm font-semibold text-ivory"
            >
              Browse products
            </Link>
          )}
          <p className="mt-4 text-center font-body text-xs leading-5 text-walnut/45">
            Payment remains pending until the configured payment flow confirms it.
          </p>
        </aside>
      </form>
    </main>
  );
}

function PaymentChoice({ active, onClick, icon, title, description }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-2xl border p-4 text-left transition ${active ? "border-sienna bg-white shadow-carve ring-2 ring-sienna/10" : "border-walnut/10 bg-white/60 hover:border-walnut/25"}`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="rounded-lg bg-walnut px-2.5 py-1 font-data text-[9px] tracking-wider text-ivory">{icon}</span>
        <span className={`h-4 w-4 rounded-full border-2 ${active ? "border-sienna bg-sienna shadow-[inset_0_0_0_3px_white]" : "border-walnut/25"}`} />
      </span>
      <span className="mt-4 block font-body text-sm font-semibold text-walnut">{title}</span>
      <span className="mt-1 block font-body text-xs text-walnut/50">{description}</span>
    </button>
  );
}
