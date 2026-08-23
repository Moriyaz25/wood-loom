"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleSignIn from "@/components/auth/GoogleSignIn";

export default function AuthCard({ mode, googleClientId }) {
  const router = useRouter();
  const search = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    privacyAccepted: false,
    marketingConsent: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const register = mode === "register";
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const endpoint = register ? "/api/auth/register" : "/api/auth/login";
    const payload = register
      ? form
      : { email: form.email, password: form.password };
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(
        typeof data.error === "string"
          ? data.error
          : data.error?.fieldErrors
            ? Object.values(data.error.fieldErrors).flat()[0]
            : "Please check your details",
      );
      setLoading(false);
      return;
    }
    const next = search.get("next");
    router.push(next?.startsWith("/") ? next : "/account");
    router.refresh();
  }
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <form onSubmit={submit} className="card-notch bg-ivory p-8 shadow-carve">
        <p className="font-data text-xs uppercase tracking-[.2em] text-sienna">
          Private & secure
        </p>
        <h1 className="mt-2 font-display text-3xl text-walnut">
          {register ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 font-body text-sm text-walnut/60">
          {register
            ? "Track orders, save addresses and manage your privacy choices."
            : "Sign in to continue securely."}
        </p>
        <GoogleSignIn clientId={googleClientId} />
        <div className="mt-7 space-y-4">
          {register && (
            <Field
              label="Full name"
              autoComplete="name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />
          )}
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />
          <Field
            label="Password"
            type="password"
            autoComplete={register ? "new-password" : "current-password"}
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
          />
          {register && (
            <>
              <label className="flex gap-3 font-body text-xs text-walnut/70">
                <input
                  type="checkbox"
                  required
                  checked={form.privacyAccepted}
                  onChange={(e) =>
                    setForm({ ...form, privacyAccepted: e.target.checked })
                  }
                />
                <span>
                  I agree to the{" "}
                  <Link className="text-sienna underline" href="/privacy">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link className="text-sienna underline" href="/terms">
                    Terms
                  </Link>
                  .
                </span>
              </label>
              <label className="flex gap-3 font-body text-xs text-walnut/70">
                <input
                  type="checkbox"
                  checked={form.marketingConsent}
                  onChange={(e) =>
                    setForm({ ...form, marketingConsent: e.target.checked })
                  }
                />
                <span>Send me occasional product news (optional).</span>
              </label>
            </>
          )}
        </div>
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 font-body text-sm text-red-700"
          >
            {error}
          </p>
        )}
        <button
          disabled={loading}
          className="focus-ring mt-6 w-full rounded-full bg-walnut py-3 font-body text-sm font-medium text-ivory shadow-carve disabled:opacity-60"
        >
          {loading ? "Please wait…" : register ? "Create account" : "Sign in"}
        </button>
        <p className="mt-5 text-center font-body text-sm text-walnut/60">
          {register ? "Already a customer?" : "New here?"}{" "}
          <Link
            className="text-sienna underline"
            href={register ? "/login" : "/register"}
          >
            {register ? "Sign in" : "Create account"}
          </Link>
        </p>
      </form>
    </div>
  );
}
function Field({ label, value, onChange, type = "text", autoComplete }) {
  return (
    <label className="block">
      <span className="font-body text-xs text-walnut/60">{label}</span>
      <input
        required
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring mt-1 w-full rounded-xl border border-walnut/15 bg-white px-4 py-3 font-body text-sm shadow-carve-inset"
      />
    </label>
  );
}
