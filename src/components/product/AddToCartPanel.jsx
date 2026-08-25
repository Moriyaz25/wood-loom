"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export default function AddToCartPanel({ product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const outOfStock = product.stock <= 0;

  return (
    <div className="mt-7 pb-20 lg:pb-0">
      <div className="flex items-stretch gap-3">
        <div className="flex min-w-28 items-center justify-between gap-3 rounded-xl border border-walnut/15 px-3 py-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="focus-ring font-body text-lg text-walnut"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-4 text-center font-data text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            className="focus-ring font-body text-lg text-walnut"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          disabled={outOfStock}
          onClick={() => addItem(product, quantity)}
          className="focus-ring flex-1 rounded-xl bg-walnut px-4 py-3 font-body text-sm font-semibold text-ivory shadow-carve transition hover:-translate-y-0.5 hover:bg-sienna disabled:cursor-not-allowed disabled:bg-walnut/20"
        >
          {outOfStock ? "Out of stock" : "Add to cart"}
        </button>
      </div>
      <button type="button" disabled={outOfStock} onClick={() => { addItem(product, quantity); router.push("/checkout"); }} className="mt-3 w-full rounded-xl border border-walnut/25 py-3.5 font-body text-sm font-semibold text-walnut transition hover:bg-sand disabled:opacity-50">Buy it now</button>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-walnut/10 bg-[#fffaf4]/95 p-3 shadow-[0_-10px_30px_rgba(58,42,30,.12)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3"><div className="min-w-0 flex-1"><p className="truncate font-body text-xs font-semibold text-walnut">{product.name}</p><p className="font-data text-sm text-sienna">₹{product.price.toLocaleString("en-IN")}</p></div><button disabled={outOfStock} onClick={() => addItem(product, quantity)} className="rounded-full bg-walnut px-6 py-3 font-body text-xs font-semibold text-ivory disabled:opacity-50">{outOfStock ? "Sold out" : "Add to cart"}</button></div>
      </div>
    </div>
  );
}
