"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
export default function ProductCard({ product }) {
  const add = useCartStore((s) => s.addItem);
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  async function toggleLike() {
    const res = await fetch("/api/account/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
    });
    if (res.status === 401) {
      router.push(
        `/login?next=${encodeURIComponent(`/products/${product.slug}`)}`,
      );
      return;
    }
    if (res.ok) setLiked((await res.json()).liked);
  }
  const image = product.images?.[0]?.url || "/textures/placeholder-product.svg";
  const sale = product.compareAtPrice > product.price;
  const discount = sale
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;
  const quoteUrl = `https://wa.me/917452905405?text=${encodeURIComponent(`Hello WOODLOOM, I would like a quote for ${product.name}.`)}`;
  return (
    <article className="group relative">
      <button
        onClick={toggleLike}
        aria-label={liked ? "Remove from liked items" : "Save to liked items"}
        className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm ${liked ? "text-sienna" : "text-walnut"}`}
      >
        {liked ? "♥" : "♡"}
      </button>
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#eee6da]">
            <Image
              src={image}
              alt={product.images?.[0]?.altText || product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition duration-700 group-hover:scale-[1.04]"
            />
            {sale && (
              <span className="absolute left-3 top-3 rounded-full bg-walnut px-3 py-1 font-body text-[10px] font-medium text-ivory">
                {discount}% OFF
              </span>
            )}
            {product.stock <= 3 && product.stock > 0 && (
              <span className="absolute bottom-3 left-3 rounded-full bg-ivory/90 px-3 py-1 font-body text-[10px] text-sienna">
                Only {product.stock} left
              </span>
            )}
          </div>
        </Link>
        <button
          type="button"
          disabled={product.stock < 1}
          onClick={() => add(product, 1)}
          className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 rounded-full border border-walnut/20 bg-ivory/95 px-4 py-2.5 font-body text-sm font-semibold text-walnut shadow-lg backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-walnut hover:text-ivory disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={`${product.stock ? "Add" : "Sold out"} ${product.name}`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            <path d="M6.5 8.5h11l-.7 11h-9.6l-.7-11Z" />
            <path d="M9 9V6.5a3 3 0 0 1 6 0V9M12 12v5M9.5 14.5h5" />
          </svg>
          {product.stock ? "Add" : "Sold out"}
        </button>
      </div>
      <Link href={`/products/${product.slug}`} className="block">
        <div className="pt-4">
          <p className="font-body text-[11px] uppercase tracking-[.15em] text-sienna">
            {product.category?.name}
          </p>
          <h3 className="mt-1 font-display text-lg text-walnut">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-1 font-body text-sm text-walnut/55">
            {product.shortDesc}
          </p>
          <div className="mt-2 flex items-center gap-2 font-data text-sm">
            <span>₹{product.price.toLocaleString("en-IN")}</span>
            {sale && (
              <span className="text-walnut/35 line-through">
                ₹{product.compareAtPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <p className="mt-1 font-body text-[11px] text-walnut/45">
            Shipping ₹{(product.shippingFee ?? 100).toLocaleString("en-IN")} per
            item
          </p>
        </div>
      </Link>
      <a
        href={quoteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex w-full items-center justify-center rounded-full bg-[#128C7E] py-2.5 font-body text-xs font-medium text-white transition hover:bg-[#075E54]"
      >
        Get quote on WhatsApp
      </a>
    </article>
  );
}
