"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "./ProductCard";
import WoodRingDivider from "@/components/ui/WoodRingDivider";

gsap.registerPlugin(ScrollTrigger);

export default function ProductGrid({ products, title, description }) {
  const gridRef = useRef(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll("[data-card]");
    if (!cards?.length) return;

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 32,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, [products]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      {title && (
        <div className="mb-10 text-center">
          <p className="font-body text-xs font-semibold uppercase tracking-[.18em] text-sienna">
            Current workshop batch
          </p>
          <h2 className="mt-2 font-display text-4xl leading-none text-[#1c1814] md:text-5xl">
            {title}
          </h2>
          {description && (
            <p className="mx-auto mt-3 max-w-xl font-body text-sm leading-6 text-walnut/60">
              {description}
            </p>
          )}
          <WoodRingDivider className="mt-4" />
        </div>
      )}

      <div
        ref={gridRef}
        className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
      >
        {products.map((product) => (
          <div key={product.id} data-card>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="py-12 text-center font-body text-sm text-walnut/50">
          No pieces here yet — check back soon.
        </p>
      )}
    </section>
  );
}
