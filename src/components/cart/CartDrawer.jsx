"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    subtotal,
  } = useCartStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  if (!hydrated || !isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close shopping bag"
        onClick={closeDrawer}
        className="absolute inset-0 bg-walnut/50 backdrop-blur-sm"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="shopping-bag-title"
        className="relative z-10 flex max-h-[calc(100dvh-24px)] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] border border-white/60 bg-[#fffaf4] shadow-[0_28px_90px_rgba(38,25,17,.35)] sm:max-h-[min(86vh,720px)] sm:rounded-[28px]"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-walnut/10 px-5 py-4 sm:px-8 sm:py-5">
          <div className="min-w-0">
            <p className="font-data text-[10px] uppercase tracking-[.2em] text-sienna">
              Your selection
            </p>
            <h2
              id="shopping-bag-title"
              className="mt-1 truncate font-display text-xl text-walnut sm:text-2xl"
            >
              Shopping bag{" "}
              <span className="font-body text-sm text-walnut/40">
                ({items.length})
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close shopping bag"
            className="ml-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-walnut/10 text-xl text-walnut hover:bg-sand"
          >
            ×
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 sm:p-8">
          {!items.length ? (
            <div className="px-2 py-8 text-center sm:py-12">
              <p className="font-display text-xl text-walnut">
                Your bag is waiting
              </p>
              <p className="mx-auto mt-2 max-w-sm font-body text-sm leading-6 text-walnut/55">
                Explore handcrafted pieces made for everyday rituals.
              </p>
              <Link
                href="/products"
                onClick={closeDrawer}
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-walnut px-7 py-3 font-body text-sm text-ivory"
              >
                Explore the collection
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <article
                key={item.productId}
                className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 rounded-2xl bg-white/75 p-3 sm:grid-cols-[76px_minmax(0,1fr)_auto] sm:items-center sm:gap-4"
              >
                <Link
                  href={`/products/${item.slug}`}
                  onClick={closeDrawer}
                  className="relative aspect-square overflow-hidden rounded-xl bg-sand"
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="76px"
                      className="object-cover"
                    />
                  )}
                </Link>
                <div className="min-w-0">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeDrawer}
                    className="block truncate font-body text-sm font-medium text-walnut hover:text-sienna"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 font-data text-xs text-walnut/55">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>
                  <div className="mt-2 inline-flex items-center rounded-full border border-walnut/10">
                    <button
                      type="button"
                      aria-label={`Decrease ${item.name} quantity`}
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="h-8 w-9"
                    >
                      −
                    </button>
                    <span className="w-7 text-center font-data text-xs">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="h-8 w-9"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="col-start-2 justify-self-start font-body text-xs text-walnut/45 hover:text-sienna sm:col-auto sm:self-start sm:p-2"
                >
                  Remove
                </button>
              </article>
            ))
          )}
        </div>

        {items.length > 0 && (
          <footer className="shrink-0 border-t border-walnut/10 bg-white/70 px-5 py-4 sm:px-8 sm:py-5">
            <div className="flex items-end justify-between gap-4">
              <span className="font-body text-sm text-walnut/60">
                Subtotal
                <small className="block text-[11px]">
                  Shipping calculated at checkout
                </small>
              </span>
              <strong className="shrink-0 font-display text-2xl text-walnut">
                ₹{subtotal().toLocaleString("en-IN")}
              </strong>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 sm:gap-3">
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="flex min-h-11 items-center justify-center rounded-full border border-walnut/20 px-4 py-3 text-center font-body text-sm"
              >
                View bag
              </Link>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="flex min-h-11 items-center justify-center rounded-full bg-walnut px-4 py-3 text-center font-body text-sm font-semibold text-ivory"
              >
                Continue to checkout
              </Link>
            </div>
          </footer>
        )}
      </section>
    </div>
  );
}
