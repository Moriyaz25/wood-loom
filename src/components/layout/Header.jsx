"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
const NAV = [
  ["/products", "Shop"],
  ["/products?featured=1", "New arrivals"],
  ["/products?category=home-decor", "Home decor"],
  ["/about", "Our story"],
];
export default function Header() {
  const pathname = usePathname(),
    count = useCartStore((s) => s.itemCount()),
    open = useCartStore((s) => s.openDrawer);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 18);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <>
      <div className="bg-walnut px-4 py-2 text-center font-body text-[9px] font-medium uppercase tracking-[.2em] text-ivory">
        Handcrafted in India <span className="mx-3 opacity-35">•</span>{" "}
        Worldwide shipping <span className="mx-3 opacity-35">•</span>{" "}
        Small-batch making
      </div>
      <header
        className={`sticky top-0 z-40 border-b border-walnut/10 bg-[#fffaf4]/90 backdrop-blur-xl transition-all duration-300 ${scrolled ? "shadow-[0_8px_30px_rgba(58,42,30,.07)]" : ""}`}
      >
        <div
          className={`mx-auto grid max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center px-5 transition-all duration-300 lg:px-9 ${scrolled ? "h-16" : "h-[72px]"}`}
        >
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className={`font-body text-sm font-semibold tracking-wide transition hover:text-sienna ${pathname === href ? "text-walnut" : "text-walnut/70"}`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href="/"
            className="relative h-11 w-48 justify-self-start lg:justify-self-center"
          >
            <Image
              src="/images/woodloom-logo-v1.png"
              alt="WOODLOOM"
              fill
              priority
              className="object-contain"
              sizes="192px"
            />
          </Link>
          <div className="flex items-center justify-self-end gap-1">
            <CircleLink href="/products" label="Search" hide>
              <Icon type="search" />
            </CircleLink>
            <CircleLink href="/account?tab=liked" label="Saved items" hide>
              <Icon type="heart" />
            </CircleLink>
            <CircleLink href="/account" label="My account">
              <Icon type="user" />
            </CircleLink>
            <button
              onClick={open}
              className="ml-1 flex h-10 items-center gap-2 rounded-full border border-walnut/15 bg-white/60 px-3.5 font-body text-xs hover:border-sienna"
            >
              <Icon type="bag" />
              <span className="hidden md:inline">Bag</span>
              <span className="font-data">{count}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
function CircleLink({ href, label, hide, children }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`${hide ? "hidden sm:flex" : "flex"} h-10 w-10 items-center justify-center rounded-full transition hover:bg-sand`}
    >
      {children}
    </Link>
  );
}
function Icon({ type }) {
  if (type === "search")
    return (
      <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <circle cx="8" cy="8" r="5.5" />
        <path d="m12 12 4 4" />
      </svg>
    );
  if (type === "heart")
    return (
      <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M9 16S2 12 2 6.8C2 3.3 6.5 2 9 5c2.5-3 7-1.7 7 1.8C16 12 9 16 9 16Z" />
      </svg>
    );
  if (type === "user")
    return (
      <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <circle cx="9" cy="6" r="3" />
        <path d="M3 17c.6-3.5 2.6-5 6-5s5.4 1.5 6 5" />
      </svg>
    );
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 7h12l-1 10H5L4 7Z" />
      <path d="M7 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
