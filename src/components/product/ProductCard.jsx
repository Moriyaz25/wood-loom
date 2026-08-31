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

  const imageMedia =
    product.images?.filter((media) => media.mediaType !== "VIDEO") || [];
  const cover = imageMedia[0] || product.images?.[0];
  const hover = imageMedia[1];
  const image =
    cover?.mediaType === "VIDEO"
      ? "/textures/placeholder-product.svg"
      : cover?.url || "/textures/placeholder-product.svg";
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
        className={`focus-ring absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm transition hover:scale-105 ${
          liked ? "text-sienna" : "text-walnut"
        }`}
      >
        {liked ? "♥" : "♡"}
      </button>
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#eee6da]">
            <Image
              src={image}
              alt={product.images?.[0]?.altText || product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-[1.025]"
            />
            {hover?.url && (
              <Image
                src={hover.url}
                alt={hover.altText || product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover opacity-0 transition duration-300 group-hover:scale-[1.025] group-hover:opacity-100"
              />
            )}
            {sale && (
              <span className="absolute left-3 top-3 rounded-full bg-walnut px-3 py-1 font-body text-[10px] font-medium text-white">
                {discount}% OFF
              </span>
            )}
            {product.stock <= 3 && product.stock > 0 && (
              <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 font-body text-[10px] text-sienna">
                Only {product.stock} left
              </span>
            )}
          </div>
        </Link>
        <button
          type="button"
          disabled={product.stock < 1}
          onClick={() => add(product, 1)}
          className="focus-ring absolute inset-x-3 bottom-3 z-10 inline-flex translate-y-2 items-center justify-center gap-2 rounded-full border border-walnut/15 bg-white/95 px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-[.12em] text-walnut opacity-0 shadow-lg backdrop-blur-sm transition duration-200 hover:bg-walnut-dark hover:text-white group-hover:translate-y-0 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60 max-sm:translate-y-0 max-sm:opacity-100"
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
          {product.stock ? "Quick add" : "Sold out"}
        </button>
      </div>
      <Link href={`/products/${product.slug}`} className="block">
        <div className="pt-4">
          <p className="font-body text-[10px] uppercase tracking-[.18em] text-sienna">
            {product.category?.name}
          </p>
          <h3 className="mt-1 font-body text-sm font-medium leading-snug text-[#1c1814] sm:text-base">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-1 font-body text-sm text-walnut/55">
            Hand-turned · Small batch
          </p>
          <div className="mt-2 flex items-center gap-2 font-body text-sm font-medium">
            <span>₹{product.price.toLocaleString("en-IN")}</span>
            {sale && (
              <span className="text-walnut/35 line-through">
                ₹{product.compareAtPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Link>
      <a
        href={quoteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex w-full items-center justify-center rounded-full border border-walnut/10 py-2.5 font-body text-xs font-medium text-walnut/65 transition hover:border-walnut hover:text-walnut"
      >
        Get quote on WhatsApp
      </a>
    </article>
  );
}
