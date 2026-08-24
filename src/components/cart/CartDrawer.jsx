"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

  useEffect(() => {
    if (!isDrawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => {
      if (event.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isDrawerOpen, closeDrawer]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.button
            aria-label="Close bag"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[70] cursor-default bg-walnut/45 backdrop-blur-sm"
          />
          <div className="pointer-events-none fixed inset-0 z-[71] flex items-end justify-center p-3 sm:items-center sm:p-6">
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="shopping-bag-title"
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="pointer-events-auto flex max-h-[calc(100dvh-24px)] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] border border-white/60 bg-[#fffaf4] shadow-[0_28px_90px_rgba(38,25,17,.35)] sm:max-h-[86vh] sm:rounded-[28px]"
            >
              <div className="flex items-center justify-between border-b border-walnut/10 px-6 py-5 sm:px-8">
                <div>
                  <p className="font-data text-[10px] uppercase tracking-[.2em] text-sienna">
                    Your selection
                  </p>
                  <h2
                    id="shopping-bag-title"
                    className="mt-1 font-display text-xl text-walnut sm:text-2xl"
                  >
                    Shopping bag{" "}
                    <span className="font-body text-sm text-walnut/40">
                      ({items.length})
                    </span>
                  </h2>
                </div>
                <button
                  onClick={closeDrawer}
                  className="rounded-full border border-walnut/10 p-2.5 hover:bg-sand"
                >
                  ✕
                </button>
              </div>
              <div
                data-lenis-prevent
                className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 sm:p-8"
              >
                {!items.length ? (
                  <div className="py-5 text-center">
                    <p className="font-display text-xl text-walnut">
                      Your bag is waiting
                    </p>
                    <p className="mt-2 font-body text-sm text-walnut/55">
                      Explore handcrafted pieces made for everyday rituals.
                    </p>
                    <Link
                      href="/products"
                      onClick={closeDrawer}
                      className="mt-6 inline-block rounded-full bg-walnut px-7 py-3 font-body text-sm text-ivory"
                    >
                      Explore the collection
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <article
                      key={item.productId}
                      className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-3 rounded-2xl bg-white/70 p-3 sm:grid-cols-[76px_1fr_auto] sm:gap-4"
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
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeDrawer}
                          className="font-body text-sm font-medium text-walnut hover:text-sienna"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 font-data text-xs text-walnut/55">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>
                        <div className="mt-2 inline-flex items-center rounded-full border border-walnut/10">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="h-7 w-8"
                          >
                            −
                          </button>
                          <span className="w-7 text-center font-data text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="h-7 w-8"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="col-start-2 justify-self-start text-xs text-walnut/40 hover:text-sienna sm:col-auto sm:self-start sm:p-2"
                      >
                        Remove
                      </button>
                    </article>
                  ))
                )}
              </div>
              {items.length > 0 && (
                <div className="border-t border-walnut/10 bg-white/50 px-6 py-5 sm:px-8">
                  <div className="flex items-end justify-between">
                    <span className="font-body text-sm text-walnut/60">
                      Subtotal{" "}
                      <small className="block">
                        Shipping calculated at checkout
                      </small>
                    </span>
                    <strong className="font-display text-2xl text-walnut">
                      ₹{subtotal().toLocaleString("en-IN")}
                    </strong>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2 sm:gap-3">
                    <Link
                      href="/cart"
                      onClick={closeDrawer}
                      className="rounded-full border border-walnut/20 py-3 text-center font-body text-sm"
                    >
                      View bag
                    </Link>
                    <a
                      href={`https://wa.me/917452905405?text=${encodeURIComponent(`Hello WOODLOOM, I would like a quote for: ${items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeDrawer}
                      className="rounded-full bg-[#128C7E] py-3 text-center font-body text-sm font-medium text-white"
                    >
                      Get WhatsApp quote
                    </a>
                  </div>
                </div>
              )}
            </motion.section>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
