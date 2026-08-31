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
    <div className="mx-auto min-h-[80vh] max-w-7xl px-4 py-5 sm:px-5 sm:py-8 md:flex md:gap-6">
      <div className="mb-5 flex items-center justify-between rounded-2xl border border-walnut/20 bg-walnut-dark p-4 text-white shadow-[0_18px_45px_rgba(42,27,18,.2)] md:hidden">
        <div>
          <p className="font-data text-[9px] uppercase tracking-[.18em] text-sienna-light">
            Control panel
          </p>
          <p className="mt-0.5 font-display text-lg text-white">
            {LINKS.find((link) => link.href === pathname)?.label || "Admin"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle admin navigation"
          className="focus-ring flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full bg-white/10 text-white"
        >
          <span className="h-px w-4 bg-current" />
          <span className="h-px w-4 bg-current" />
          <span className="h-px w-4 bg-current" />
        </button>
      </div>
      {menuOpen && (
        <div className="mb-5 rounded-2xl bg-walnut-dark p-3 text-white shadow-[0_18px_45px_rgba(42,27,18,.22)] md:hidden">
          <AdminNav
            pathname={pathname}
            onNavigate={() => setMenuOpen(false)}
            onLogout={handleLogout}
          />
        </div>
      )}
      <aside className="hidden w-56 shrink-0 rounded-[24px] bg-walnut-dark p-5 text-white shadow-[0_24px_60px_rgba(42,27,18,.2)] md:block md:self-start md:sticky md:top-24">
        <p className="font-data text-[9px] uppercase tracking-[.2em] text-sienna-light">WOODLOOM Admin</p>
        <p className="mt-2 font-display text-2xl text-white">Control panel</p>
        <AdminNav pathname={pathname} onLogout={handleLogout} />
      </aside>

      <div className="min-w-0 flex-1 rounded-[24px] border border-[#2a1b12]/15 bg-white p-4 shadow-[0_24px_65px_rgba(42,27,18,.18)] sm:p-6">{children}</div>
    </div>
  );
}

function AdminNav({ pathname, onNavigate, onLogout }) {
  return (
    <>
      <nav className="flex flex-col gap-1.5 font-body text-sm md:mt-7">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`focus-ring rounded-xl px-3.5 py-3 transition-colors ${pathname === link.href ? "bg-sienna text-white shadow-lg" : "text-white/72 hover:bg-white/10 hover:text-white"}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={onLogout}
        className="focus-ring mt-3 w-full rounded-xl border-t border-white/10 px-3.5 py-3 text-left font-body text-sm text-white/55 hover:bg-white/10 hover:text-white md:mt-8"
      >
        Sign out
      </button>
    </>
  );
}
