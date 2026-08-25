"use client";
import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images, name }) {
  const gallery = images?.length ? images : [{ url: "/textures/placeholder-product.svg", altText: name }];
  const [active, setActive] = useState(0);
  return <div>
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand sm:aspect-square lg:rounded-[1.75rem]">
      {gallery[active].mediaType === "VIDEO" ? <video key={gallery[active].url} src={gallery[active].url} controls playsInline preload="metadata" className="h-full w-full object-cover" /> : <Image src={gallery[active].url} alt={gallery[active].altText || `${name} view ${active + 1}`} fill priority className="object-cover" sizes="(max-width:768px) 100vw,55vw" />}
      <span className="absolute bottom-4 right-4 rounded-full bg-white/85 px-3 py-1.5 font-data text-[10px] text-walnut backdrop-blur">{active + 1} / {gallery.length}</span>
    </div>
    {gallery.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto pb-2 sm:gap-3">{gallery.map((media, index) => <button key={media.id || media.url} type="button" onClick={() => setActive(index)} className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-sand transition sm:w-24 ${active === index ? "border-sienna" : "border-transparent opacity-75 hover:opacity-100"}`}>{media.mediaType === "VIDEO" ? <><video src={media.url} muted preload="metadata" className="h-full w-full object-cover" /><span className="absolute inset-0 flex items-center justify-center bg-black/15 text-2xl text-white">▶</span></> : <Image src={media.url} alt="" fill className="object-cover" sizes="100px" />}</button>)}</div>}
  </div>;
}
