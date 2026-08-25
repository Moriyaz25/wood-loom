"use client";
import Image from "next/image";
import { useState } from "react";

export default function ProductMediaUploader({ value, onChange }) {
  const [state, setState] = useState("");
  async function upload(files) {
    const selected = [...files].slice(0, Math.max(0, 8 - value.length));
    if (!selected.length) return;
    const uploaded = [];
    for (let index = 0; index < selected.length; index++) {
      setState(`Uploading ${index + 1} of ${selected.length}…`);
      const form = new FormData(); form.append("file", selected[index]);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) { setState(data.error || "Upload failed"); return; }
      uploaded.push({ url: data.url, mediaType: data.mediaType, altText: "" });
    }
    onChange([...value, ...uploaded]); setState("Media ready");
  }
  function move(index, direction) { const next = [...value]; const target = index + direction; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; onChange(next); }
  return <div className="rounded-2xl border border-walnut/10 bg-white/60 p-4">
    <div className="rounded-xl border border-dashed border-sienna/30 bg-sand/40 p-5 text-center"><input id="product-media" type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" onChange={(event) => upload(event.target.files || [])} className="sr-only" /><label htmlFor="product-media" className="inline-flex cursor-pointer rounded-full bg-walnut px-5 py-2.5 font-body text-xs font-semibold text-ivory">+ Add photos or video</label><p className="mt-2 font-body text-[11px] text-walnut/50">Up to 8 media · images 8 MB · video 20 MB</p><p className="mt-1 font-body text-[11px] text-sienna">{state}</p></div>
    {value.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{value.map((media, index) => <div key={`${media.url}-${index}`} className="overflow-hidden rounded-xl border border-walnut/10 bg-ivory"><div className="relative aspect-square bg-sand">{media.mediaType === "VIDEO" ? <video src={media.url} muted playsInline className="h-full w-full object-cover" /> : <Image src={media.url} alt="" fill className="object-cover" sizes="160px" />}<span className="absolute left-2 top-2 rounded-full bg-walnut/80 px-2 py-1 font-data text-[8px] text-white">{index === 0 ? "COVER" : media.mediaType}</span></div><div className="flex justify-between p-1 text-[10px]"><button type="button" onClick={() => move(index, -1)} className="px-2">←</button><button type="button" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))} className="px-2 text-sienna">Remove</button><button type="button" onClick={() => move(index, 1)} className="px-2">→</button></div></div>)}</div>}
  </div>;
}
