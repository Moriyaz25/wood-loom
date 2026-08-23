"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="font-display text-xl text-walnut">Your bag is empty</p>
        <Link href="/products" className="focus-ring mt-4 inline-block font-body text-sm text-sienna underline">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-display text-2xl text-walnut">Your bag</h1>

      <div className="mt-8 space-y-6">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-4 border-b border-walnut/10 pb-6">
            <div className="card-notch-sm relative h-24 w-24 shrink-0 overflow-hidden bg-sand">
              {item.image && <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />}
            </div>
            <div className="flex-1">
              <p className="font-display text-base text-walnut">{item.name}</p>
              <p className="mt-1 font-data text-sm text-walnut/60">₹{item.price}</p>
              <div className="mt-2 flex items-center gap-3">
                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="focus-ring h-7 w-7 rounded-full shadow-carve">−</button>
                <span className="font-data text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="focus-ring h-7 w-7 rounded-full shadow-carve">+</button>
                <button onClick={() => removeItem(item.productId)} className="focus-ring ml-auto font-body text-xs text-sienna hover:underline">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="font-body text-walnut/70">Subtotal</span>
        <span className="font-data text-lg text-walnut">₹{subtotal()}</span>
      </div>

      <Link
        href="/checkout"
        className="focus-ring mt-6 block rounded-full bg-sienna py-3 text-center font-body text-sm font-medium text-ivory shadow-carve"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}
