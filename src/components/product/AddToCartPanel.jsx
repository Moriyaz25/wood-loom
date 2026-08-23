"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function AddToCartPanel({ product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const outOfStock = product.stock <= 0;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 rounded-full px-3 py-2 shadow-carve">
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
          className="focus-ring flex-1 rounded-full bg-sienna py-3 font-body text-sm font-medium text-ivory shadow-carve transition-colors hover:bg-sienna-dark disabled:cursor-not-allowed disabled:bg-walnut/20"
        >
          {outOfStock ? "Out of stock" : "Add to bag"}
        </button>
      </div>
      <a
        href={`https://wa.me/917452905405?text=${encodeURIComponent(`Hello WOODLOOM, I would like a quote for ${product.name}.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex w-full items-center justify-center rounded-full bg-[#128C7E] py-3 font-body text-sm font-medium text-white"
      >
        Get quote on WhatsApp
      </a>
    </div>
  );
}
