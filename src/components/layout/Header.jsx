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
  const pathname = usePathname();
  const count = useCartStore((s) => s.itemCount());
  const open = useCartStore((s) => s.openDrawer);
  const [scrolled, setScrolled] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="bg-walnut-dark px-4 py-2 text-center font-body text-[8px] font-semibold uppercase tracking-[.24em] text-white sm:text-[9px]">
        <span className="sm:hidden">
          Handcrafted in India - Small-batch making
        </span>
        <span className="hidden sm:inline">
          Handcrafted in India <span className="mx-3 opacity-35">-</span>
          Shipping across India <span className="mx-3 opacity-35">-</span>
          Small-batch making
        </span>
      </div>
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          scrolled
            ? "border-walnut/10 bg-white/88 shadow-[0_12px_35px_rgba(42,27,18,.08)] backdrop-blur-xl"
            : "border-transparent bg-[#f7f3ec]/82 backdrop-blur-md"
        }`}
      >
        <div
          className={`mx-auto grid max-w-[1500px] grid-cols-[auto_1fr_auto] items-center px-4 transition-all duration-300 sm:px-5 lg:grid-cols-[1fr_auto_1fr] lg:px-9 ${
            scrolled ? "h-16" : "h-[70px]"
          }`}
        >
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-walnut lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Icon type="menu" />
          </button>
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className={`font-body text-[13px] font-medium tracking-wide transition hover:text-walnut ${
                  pathname === href ? "text-walnut" : "text-walnut/65"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href="/"
            className="relative h-10 w-40 justify-self-center sm:w-44 lg:h-11 lg:w-48"
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
          <div className="flex items-center justify-self-end gap-1 text-walnut">
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
              className="focus-ring ml-1 flex h-10 items-center gap-2 rounded-full border border-walnut/15 bg-white/70 px-3.5 font-body text-xs font-medium transition hover:border-walnut hover:bg-white"
            >
              <Icon type="bag" />
              <span className="hidden md:inline">Bag</span>
              <span className="font-data">{hydrated ? count : 0}</span>
            </button>
          </div>
        </div>
      </header>
      <div
        className={`fixed inset-0 z-[80] bg-walnut-dark/35 backdrop-blur-sm transition-opacity lg:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />
      <aside
        className={`fixed left-0 top-0 z-[90] h-dvh w-[86vw] max-w-sm bg-[#f7f3ec] px-6 py-5 shadow-[18px_0_60px_rgba(42,27,18,.18)] transition-transform duration-300 lg:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex items-center justify-between">
          <p className="font-body text-[10px] font-semibold uppercase tracking-[.22em] text-walnut/60">
            WOODLOOM
          </p>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-walnut/10 bg-white/70"
            aria-label="Close menu"
          >
            <Icon type="close" />
          </button>
        </div>
        <nav className="mt-12 space-y-6">
          {NAV.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="block font-display text-4xl leading-none text-walnut"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-12 border-t border-walnut/10 pt-6 font-body text-sm leading-7 text-walnut/65">
          <p className="font-semibold uppercase tracking-[.16em] text-walnut">
            Crafted in Nagina, India
          </p>
          <p className="mt-3">
            Contemporary wooden tableware, homeware and gifting pieces made in
            small batches.
          </p>
          <Link
            href="/contact"
            className="focus-ring mt-7 inline-flex rounded-full bg-walnut px-6 py-3 text-xs font-semibold uppercase tracking-[.14em] text-white"
          >
            Corporate enquiry
          </Link>
        </div>
      </aside>
    </>
  );
}

function CircleLink({ href, label, hide, children }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`${hide ? "hidden sm:flex" : "flex"} focus-ring h-10 w-10 items-center justify-center rounded-full transition hover:bg-sand/70`}
    >
      {children}
    </Link>
  );
}

function Icon({ type }) {
  if (type === "menu")
    return (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M3 6h14M3 10h14M3 14h14" />
      </svg>
    );
  if (type === "close")
    return (
      <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="M4 4l10 10M14 4 4 14" />
      </svg>
    );
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
