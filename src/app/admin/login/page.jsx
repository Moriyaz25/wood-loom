"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Login failed");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5">
      <form onSubmit={handleSubmit} className="card-notch w-full max-w-sm bg-ivory p-8 shadow-carve">
        <h1 className="font-display text-xl text-walnut">Admin sign in</h1>
        <p className="mt-1 font-body text-xs text-walnut/50">WOODLOOM control panel</p>

        <label className="mt-6 block">
          <span className="font-body text-xs text-walnut/60">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus-ring mt-1 w-full rounded-lg border border-walnut/15 bg-ivory px-3 py-2 font-body text-sm shadow-carve-inset"
          />
        </label>

        <label className="mt-4 block">
          <span className="font-body text-xs text-walnut/60">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus-ring mt-1 w-full rounded-lg border border-walnut/15 bg-ivory px-3 py-2 font-body text-sm shadow-carve-inset"
          />
        </label>

        {error && <p className="mt-3 font-body text-sm text-sienna">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="focus-ring mt-6 w-full rounded-full bg-sienna py-2.5 font-body text-sm font-medium text-ivory shadow-carve disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
