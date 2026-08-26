"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/banners", label: "Banners & Ads" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto min-h-[80vh] max-w-6xl px-4 py-5 sm:px-5 sm:py-8 md:flex md:gap-8">
      <div className="mb-5 flex items-center justify-between rounded-2xl border border-walnut/10 bg-white/70 p-3 shadow-carve md:hidden">
        <div>
          <p className="font-data text-[9px] uppercase tracking-[.18em] text-sienna">
            Control panel
          </p>
          <p className="mt-0.5 font-display text-lg text-walnut">
            {LINKS.find((link) => link.href === pathname)?.label || "Admin"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle admin navigation"
          className="focus-ring flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full bg-walnut text-ivory"
        >
          <span className="h-px w-4 bg-current" />
          <span className="h-px w-4 bg-current" />
          <span className="h-px w-4 bg-current" />
        </button>
      </div>
      {menuOpen && (
        <div className="mb-5 rounded-2xl border border-walnut/10 bg-ivory p-3 shadow-carve md:hidden">
          <AdminNav
            pathname={pathname}
            onNavigate={() => setMenuOpen(false)}
            onLogout={handleLogout}
          />
        </div>
      )}
      <aside className="hidden w-48 shrink-0 md:block">
        <p className="font-display text-lg text-walnut">Control panel</p>
        <AdminNav pathname={pathname} onLogout={handleLogout} />
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function AdminNav({ pathname, onNavigate, onLogout }) {
  return (
    <>
      <nav className="flex flex-col gap-1 font-body text-sm md:mt-6">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`focus-ring rounded-lg px-3 py-2.5 transition-colors ${pathname === link.href ? "bg-sienna text-ivory" : "text-walnut/70 hover:bg-sand"}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={onLogout}
        className="focus-ring mt-3 w-full rounded-lg px-3 py-2.5 text-left font-body text-sm text-walnut/50 hover:bg-sand md:mt-8"
      >
        Sign out
      </button>
    </>
  );
}
