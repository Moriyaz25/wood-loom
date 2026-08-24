"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

const TABS = [
  {
    href: "/",
    label: "Home",
    icon: (active) => (
      <path d="M4 11.5L12 5l8 6.5M6 10v9h12v-9" stroke={active ? "#B5652D" : "#3A2A1E"} strokeWidth="1.7" fill="none" />
    )
  },
  {
    href: "/products",
    label: "Shop",
    icon: (active) => (
      <path
        d="M6 8h12l-1.2 10.2a2 2 0 01-2 1.8H9.2a2 2 0 01-2-1.8L6 8zM9 8V6a3 3 0 016 0v2"
        stroke={active ? "#B5652D" : "#3A2A1E"}
        strokeWidth="1.7"
        fill="none"
      />
    )
  },
  {
    href: "/contact",
    label: "Help",
    icon: (active) => (
      <>
        <circle cx="12" cy="12" r="8" stroke={active ? "#B5652D" : "#3A2A1E"} strokeWidth="1.7" fill="none" />
        <path d="M12 15v.01M12 9a2 2 0 011.8 2.9c-.3.6-1 .9-1.4 1.4-.3.3-.4.6-.4 1" stroke={active ? "#B5652D" : "#3A2A1E"} strokeWidth="1.5" fill="none" />
      </>
    )
  }
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  const openDrawer = useCartStore((s) => s.openDrawer);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-walnut/10 bg-ivory/95 py-2 backdrop-blur-md md:hidden" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 6px)" }}>
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link key={tab.href} href={tab.href} className="focus-ring flex flex-col items-center gap-1 px-3 py-1">
            <svg width="22" height="22" viewBox="0 0 24 24">{tab.icon(active)}</svg>
            <span className={`font-body text-[10px] ${active ? "text-sienna" : "text-walnut/70"}`}>{tab.label}</span>
          </Link>
        );
      })}

      <button onClick={openDrawer} className="focus-ring relative flex flex-col items-center gap-1 px-3 py-1">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3A2A1E" strokeWidth="1.7">
          <path d="M6 8h12l-1.2 10.2a2 2 0 01-2 1.8H9.2a2 2 0 01-2-1.8L6 8z" />
          <path d="M9 8V6a3 3 0 016 0v2" />
        </svg>
        {hydrated && itemCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-sienna font-data text-[9px] text-ivory">
            {itemCount}
          </span>
        )}
        <span className="font-body text-[10px] text-walnut/70">Cart</span>
      </button>
    </nav>
  );
}
