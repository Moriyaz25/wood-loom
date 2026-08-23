"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/banners", label: "Banners & Ads" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-6xl gap-8 px-5 py-8">
      <aside className="w-48 shrink-0">
        <p className="font-display text-lg text-walnut">Control panel</p>
        <nav className="mt-6 flex flex-col gap-1 font-body text-sm">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`focus-ring rounded-lg px-3 py-2 transition-colors ${
                pathname === link.href
                  ? "bg-sienna text-ivory"
                  : "text-walnut/70 hover:bg-sand"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="focus-ring mt-8 w-full rounded-lg px-3 py-2 text-left font-body text-sm text-walnut/50 hover:bg-sand"
        >
          Sign out
        </button>
      </aside>

      <div className="flex-1">{children}</div>
    </div>
  );
}
