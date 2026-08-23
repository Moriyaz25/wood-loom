"use client";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function GoogleSignIn({ clientId }) {
  const router = useRouter();
  const search = useSearchParams();
  const host = useRef(null);
  const [error, setError] = useState("");
  function render() {
    if (!clientId || !window.google || !host.current) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async ({ credential }) => {
        setError("");
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential }),
        });
        const data = await res.json();
        if (!res.ok) return setError(data.error || "Google sign-in failed");
        const next = search.get("next");
        router.push(next?.startsWith("/") ? next : "/account");
        router.refresh();
      },
    });
    host.current.replaceChildren();
    window.google.accounts.id.renderButton(host.current, {
      theme: "outline",
      size: "large",
      shape: "pill",
      width: Math.min(340, host.current.clientWidth || 340),
      text: "continue_with",
    });
  }
  useEffect(() => {
    render();
  }, []);
  if (!clientId) return null;
  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={render}
      />
      <div className="my-5 flex items-center gap-3 text-xs text-walnut/40">
        <span className="h-px flex-1 bg-walnut/10" />
        or
        <span className="h-px flex-1 bg-walnut/10" />
      </div>
      <div ref={host} className="flex justify-center" />
      {error && (
        <p className="mt-3 text-center font-body text-xs text-red-700">
          {error}
        </p>
      )}
    </>
  );
}
