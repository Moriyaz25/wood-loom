"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCartStore();
  const bagSubtotal = subtotal();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="font-body text-xs font-semibold uppercase tracking-[.18em] text-sienna">
          Your Woodloom Bag
        </p>
        <h1 className="mt-3 font-display text-5xl leading-none text-[#1c1814]">
          Your bag is empty.
        </h1>
        <Link
          href="/products"
          className="focus-ring mt-7 inline-flex rounded-full bg-walnut-dark px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[.14em] text-white"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-col gap-3 border-b border-walnut/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-[.18em] text-sienna">
            Checkout
          </p>
          <h1 className="mt-2 font-display text-5xl uppercase leading-none text-[#1c1814] md:text-6xl">
            Your Woodloom Bag
          </h1>
        </div>
        <p className="font-body text-sm text-walnut/60">
          Shipping is calculated and shown at checkout.
        </p>
      </div>

      <div className="grid gap-10 py-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.productId}
              className="grid grid-cols-[96px_1fr] gap-4 border-b border-walnut/10 pb-6 sm:grid-cols-[128px_1fr]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex min-w-0 flex-col">
                <div className="flex gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-base font-medium text-[#1c1814]">
                      {item.name}
                    </p>
                    <p className="mt-1 font-body text-sm text-walnut/55">
                      Handcrafted · Small batch
                    </p>
                  </div>
                  <p className="font-body text-sm font-medium text-walnut">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-3 pt-5">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    className="focus-ring h-8 w-8 rounded-full border border-walnut/15 bg-white"
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-data text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="focus-ring h-8 w-8 rounded-full border border-walnut/15 bg-white"
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="focus-ring ml-auto font-body text-xs font-medium uppercase tracking-[.12em] text-sienna hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit border border-walnut/10 bg-white p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-3xl text-[#1c1814]">
            Order summary
          </h2>
          <div className="mt-6 space-y-4 border-y border-walnut/10 py-5 font-body text-sm">
            <Row label="Subtotal" value={bagSubtotal} />
            <p className="text-xs leading-6 text-walnut/55">
              Shipping charges will be shown before you place your order.
            </p>
          </div>
          <Row label="Subtotal" value={bagSubtotal} large />
          <Link
            href="/checkout"
            className="focus-ring mt-6 block rounded-full bg-walnut-dark py-3.5 text-center font-body text-xs font-semibold uppercase tracking-[.14em] text-white shadow-carve"
          >
            Checkout →
          </Link>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-walnut/10 bg-white/95 px-5 py-3 backdrop-blur md:hidden">
        <Link
          href="/checkout"
          className="focus-ring block rounded-full bg-walnut-dark py-3.5 text-center font-body text-xs font-semibold uppercase tracking-[.14em] text-white"
        >
          Continue to checkout
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value, large }) {
  return (
    <div
      className={`flex items-center justify-between ${large ? "mt-5 font-display text-3xl text-[#1c1814]" : "text-walnut/70"}`}
    >
      <span>{label}</span>
      <span>₹{value.toLocaleString("en-IN")}</span>
    </div>
  );
}
