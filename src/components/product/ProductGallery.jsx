"use client";
import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images, name }) {
  const gallery = images?.length ? images : [{ url: "/textures/placeholder-product.svg", altText: name }];
  const [active, setActive] = useState(0);
  return <div>
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand sm:aspect-square lg:rounded-[1.75rem]">
      <Image src={gallery[active].url} alt={gallery[active].altText || `${name} view ${active + 1}`} fill priority className="object-cover" sizes="(max-width:768px) 100vw,55vw" />
      <span className="absolute bottom-4 right-4 rounded-full bg-white/85 px-3 py-1.5 font-data text-[10px] text-walnut backdrop-blur">{active + 1} / {gallery.length}</span>
    </div>
    {gallery.length > 1 && <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">{gallery.slice(0, 4).map((image, index) => <button key={image.id || image.url} type="button" onClick={() => setActive(index)} className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-sand transition ${active === index ? "border-sienna" : "border-transparent opacity-75 hover:opacity-100"}`}><Image src={image.url} alt="" fill className="object-cover" sizes="140px" /></button>)}</div>}
  </div>;
}
