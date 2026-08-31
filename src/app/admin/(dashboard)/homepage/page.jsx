"use client";

import { useEffect, useState } from "react";

export default function AdminHomepagePage() {
  const [content, setContent] = useState(null);
  const [defaults, setDefaults] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((response) => response.json())
      .then((data) => {
        setContent(data.content || {});
        setDefaults(data.defaults || {});
      })
      .catch(() => setError("Homepage content could not be loaded."));
  }, []);

  function update(path, value) {
    setContent((current) => {
      const next = structuredClone(current);
      let target = next;
      path.slice(0, -1).forEach((key) => {
        target = target[key];
      });
      target[path.at(-1)] = value;
      return next;
    });
    setMessage("");
  }

  async function saveContent(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    const response = await fetch("/api/admin/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const data = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) {
      setError(data.error || "Homepage could not be saved.");
      return;
    }
    setContent(data.content);
    setMessage("Homepage saved successfully. Refresh the storefront preview.");
  }

  if (!content)
    return <div className="rounded-2xl bg-[#21150f] p-8 font-body text-white">Loading homepage editor…</div>;

  return (
    <div>
      <header className="rounded-2xl bg-[#21150f] p-6 text-white shadow-xl sm:p-8">
        <p className="font-data text-[10px] font-semibold uppercase tracking-[.2em] text-[#f38a45]">Storefront CMS</p>
        <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl">Homepage editor</h1>
            <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-white/65">Edit storefront headings, stories, cards and images section by section. Product selections remain controlled from Products → Featured.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setContent(structuredClone(defaults))} className="rounded-full border border-white/20 px-5 py-2.5 font-body text-xs font-semibold text-white hover:bg-white/10">Reset defaults</button>
            <a href="/" target="_blank" className="rounded-full bg-[#d46b25] px-5 py-2.5 font-body text-xs font-semibold text-white hover:bg-[#ee7b2d]">Open preview</a>
          </div>
        </div>
      </header>

      <form onSubmit={saveContent} className="mt-6 space-y-4">
        <EditorSection number="01" title="Collection hero" description="The large collection introduction below the main banner.">
          <Grid>
            <Field label="Eyebrow" value={content.collection.eyebrow} onChange={(value) => update(["collection", "eyebrow"], value)} />
            <Field label="Heading" value={content.collection.title} onChange={(value) => update(["collection", "title"], value)} />
            <Field wide label="Description" multiline value={content.collection.description} onChange={(value) => update(["collection", "description"], value)} />
            <Field wide label="Image URL" value={content.collection.image} onChange={(value) => update(["collection", "image"], value)} />
          </Grid>
        </EditorSection>

        <EditorSection number="02" title="Trust badges" description="Four short promises shown directly under the homepage banner.">
          <div className="grid gap-3 md:grid-cols-2">
            {content.trust.map((item, index) => <PairCard key={index} index={index} firstLabel="Badge title" secondLabel="Supporting text" item={item} onFirst={(value) => update(["trust", index, 0], value)} onSecond={(value) => update(["trust", index, 1], value)} />)}
          </div>
        </EditorSection>

        <EditorSection number="03" title="Featured products heading" description="Products themselves rotate from the Featured pool in Products admin.">
          <Grid>
            <Field label="Section heading" value={content.topPicks.title} onChange={(value) => update(["topPicks", "title"], value)} />
            <Field label="Description" value={content.topPicks.description} onChange={(value) => update(["topPicks", "description"], value)} />
          </Grid>
        </EditorSection>

        <EditorSection number="04" title="The Woodloom Edit" description="Three visual category cards for shopping occasions.">
          <Grid>
            <Field label="Eyebrow" value={content.edit.eyebrow} onChange={(value) => update(["edit", "eyebrow"], value)} />
            <Field label="Heading" value={content.edit.title} onChange={(value) => update(["edit", "title"], value)} />
          </Grid>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {content.edit.categories.map((card, index) => <CardEditor key={index} title={`Card ${index + 1}`} fields={[["Title", "title"], ["Caption", "text"], ["Link", "href"], ["Image URL", "image"]]} item={card} onChange={(key, value) => update(["edit", "categories", index, key], value)} />)}
          </div>
        </EditorSection>

        <EditorSection number="05" title="Why WOODLOOM" description="Long-form craft and quality storytelling blocks.">
          <Grid>
            <Field label="Eyebrow" value={content.why.eyebrow} onChange={(value) => update(["why", "eyebrow"], value)} />
            <Field label="Heading" value={content.why.title} onChange={(value) => update(["why", "title"], value)} />
          </Grid>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {content.why.blocks.map((block, index) => <CardEditor key={index} title={`Story ${index + 1}`} fields={[["Title", "title"], ["Story text", "text"], ["Image URL", "image"]]} item={block} onChange={(key, value) => update(["why", "blocks", index, key], value)} />)}
          </div>
        </EditorSection>

        <EditorSection number="06" title="Brand story" description="Dark editorial section linking visitors to Our Story.">
          <Grid>
            {[['Eyebrow','eyebrow'],['Heading','title'],['Story text','text'],['Image URL','image'],['Button label','ctaLabel'],['Button link','ctaLink']].map(([label,key]) => <Field key={key} label={label} value={content.story[key]} multiline={key === "text"} onChange={(value) => update(["story", key], value)} />)}
          </Grid>
        </EditorSection>

        <EditorSection number="07" title="Craft process" description="Four steps explaining how an item reaches the customer.">
          <Grid><Field label="Eyebrow" value={content.process.eyebrow} onChange={(value) => update(["process", "eyebrow"], value)} /><Field label="Heading" value={content.process.title} onChange={(value) => update(["process", "title"], value)} /></Grid>
          <div className="mt-4 grid gap-3 md:grid-cols-2">{content.process.steps.map((item,index) => <PairCard key={index} index={index} firstLabel="Step title" secondLabel="Step description" item={[item[1],item[2]]} onFirst={(value) => update(["process","steps",index,1],value)} onSecond={(value) => update(["process","steps",index,2],value)} />)}</div>
        </EditorSection>

        <EditorSection number="08" title="Gifting" description="Corporate, wedding and occasion gifting banner.">
          <Grid>{[['Eyebrow','eyebrow'],['Heading','title'],['Description','text'],['Image URL','image']].map(([label,key]) => <Field key={key} label={label} value={content.gifting[key]} multiline={key === "text"} onChange={(value) => update(["gifting", key], value)} />)}</Grid>
        </EditorSection>

        <EditorSection number="09" title="Customer reviews" description="Homepage social proof. Use only approved, genuine reviews.">
          <Grid><Field label="Eyebrow" value={content.reviews.eyebrow} onChange={(value) => update(["reviews","eyebrow"],value)} /><Field label="Heading" value={content.reviews.title} onChange={(value) => update(["reviews","title"],value)} /></Grid>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">{content.reviews.items.map((review,index) => <div key={index} className="rounded-xl border border-[#4a2816]/15 bg-[#fff8f1] p-4"><p className="font-data text-[10px] font-semibold text-[#c55f1d]">REVIEW {index+1}</p><Field label="Name" value={review[0]} onChange={(value) => update(["reviews","items",index,0],value)} /><Field label="City" value={review[1]} onChange={(value) => update(["reviews","items",index,1],value)} /><Field label="Review" multiline value={review[2]} onChange={(value) => update(["reviews","items",index,2],value)} /></div>)}</div>
        </EditorSection>

        <EditorSection number="10" title="Lifestyle gallery" description="Duplicate images are automatically removed on the storefront.">
          <Grid><Field label="Eyebrow" value={content.ugc.eyebrow} onChange={(value) => update(["ugc","eyebrow"],value)} /><Field label="Heading" value={content.ugc.title} onChange={(value) => update(["ugc","title"],value)} /><Field label="Social handle" value={content.ugc.handle} onChange={(value) => update(["ugc","handle"],value)} /></Grid>
          <div className="mt-4 grid gap-3 md:grid-cols-2">{content.ugc.images.map((image,index) => <Field key={index} label={`Image ${index+1} URL`} value={image} onChange={(value) => update(["ugc","images",index],value)} />)}</div>
        </EditorSection>

        {error && <p className="rounded-xl bg-red-50 p-4 font-body text-sm font-semibold text-red-700">{error}</p>}
        {message && <p className="rounded-xl bg-emerald-50 p-4 font-body text-sm font-semibold text-emerald-800">{message}</p>}
        <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/20 bg-[#21150f]/95 p-4 text-white shadow-2xl backdrop-blur-xl">
          <p className="font-body text-xs text-white/60">Changes go live after saving.</p>
          <button disabled={saving} className="rounded-full bg-[#d46b25] px-7 py-3 font-body text-xs font-bold uppercase tracking-[.14em] text-white hover:bg-[#ee7b2d] disabled:opacity-50">{saving ? "Saving…" : "Save homepage"}</button>
        </div>
      </form>
    </div>
  );
}

function EditorSection({ number, title, description, children }) {
  return <details open className="group rounded-2xl border border-[#4a2816]/15 bg-white shadow-[0_10px_30px_rgba(42,27,18,.1)]"><summary className="flex cursor-pointer list-none items-center gap-4 p-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#21150f] font-data text-xs text-white">{number}</span><span className="min-w-0 flex-1"><span className="block font-display text-2xl text-[#21150f]">{title}</span><span className="mt-1 block font-body text-xs text-[#704934]">{description}</span></span><span className="text-2xl text-[#c55f1d] transition group-open:rotate-45">+</span></summary><div className="border-t border-[#4a2816]/10 p-5">{children}</div></details>;
}
function Grid({ children }) { return <div className="grid gap-4 md:grid-cols-2">{children}</div>; }
function Field({ label, value = "", onChange, multiline, wide }) {
  const classes = "mt-1.5 w-full rounded-xl border border-[#4a2816]/20 bg-[#fffaf4] px-4 py-3 font-body text-sm text-[#21150f] outline-none transition focus:border-[#c55f1d] focus:ring-2 focus:ring-[#c55f1d]/15";
  return <label className={`block ${wide ? "md:col-span-2" : ""}`}><span className="font-body text-xs font-semibold text-[#583522]">{label}</span>{multiline ? <textarea rows={3} value={value} onChange={(event) => onChange(event.target.value)} className={classes} /> : <input value={value} onChange={(event) => onChange(event.target.value)} className={classes} />}</label>;
}
function PairCard({ index, firstLabel, secondLabel, item, onFirst, onSecond }) { return <div className="rounded-xl border border-[#4a2816]/15 bg-[#fff8f1] p-4"><p className="mb-3 font-data text-[10px] font-semibold text-[#c55f1d]">ITEM {index+1}</p><Field label={firstLabel} value={item[0]} onChange={onFirst} /><Field label={secondLabel} value={item[1]} onChange={onSecond} /></div>; }
function CardEditor({ title, fields, item, onChange }) { return <div className="rounded-xl border border-[#4a2816]/15 bg-[#fff8f1] p-4"><p className="mb-3 font-body text-sm font-bold text-[#21150f]">{title}</p>{fields.map(([label,key]) => <Field key={key} label={label} multiline={key === "text"} value={item[key]} onChange={(value) => onChange(key,value)} />)}</div>; }
