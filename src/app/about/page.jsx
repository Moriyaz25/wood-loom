import Image from "next/image";
import Link from "next/link";
import WoodRingDivider from "@/components/ui/WoodRingDivider";
export const metadata = {
  title: "Our Craft | WOODLOOM",
  description:
    "Meet the materials, makers and patient process behind WOODLOOM.",
};
const steps = [
  [
    "01",
    "Choose",
    "Seasoned, responsibly sourced timber selected for stability, grain and the job it needs to do.",
  ],
  [
    "02",
    "Shape",
    "Each block is cut, turned and carved in small batches. The form follows the grain rather than hiding it.",
  ],
  [
    "03",
    "Finish",
    "Surfaces are patiently sanded and finished with food-safe oils that let real wood age naturally.",
  ],
  [
    "04",
    "Inspect",
    "Every piece is checked by hand and carefully packed to travel safely to your home.",
  ],
];
const principles = [
  ["Material first", "We begin with grain, density and intended use—not a trend forecast. The wood helps determine the final form."],
  ["Made in small runs", "Smaller batches allow closer inspection, thoughtful finishing and less unnecessary inventory."],
  ["Designed for rituals", "A tray should carry confidently, a bowl should feel balanced, and an object should be easy to live with."],
  ["Age with character", "Real wood changes gently with light, touch and care. We see that patina as part of the object’s story."],
];
export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[.9fr_1.1fr] md:items-center md:py-20">
        <div>
          <p className="font-data text-xs uppercase tracking-[.24em] text-sienna">
            Made slowly. Lived with daily.
          </p>
          <h1 className="mt-4 max-w-xl font-display text-5xl leading-[1.05] text-walnut md:text-7xl">
            Objects with the maker’s hand still in them.
          </h1>
          <p className="mt-6 max-w-xl font-body text-base leading-7 text-walnut/65">
            WOODLOOM makes wooden tableware, serveware and home objects that
            bring warmth to ordinary rituals—from a quiet breakfast to a table
            full of people.
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[32px]">
          <Image
            src="/images/hero-craft-v1.png"
            alt="Wooden craft made in a small workshop"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover"
          />
        </div>
      </section>
      <section className="border-y border-walnut/10 bg-white/55">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 md:grid-cols-4">
          {[["01", "Natural material"], ["02", "Small-batch process"], ["03", "Finished by hand"], ["04", "Made for daily use"]].map(([n, label]) => (
            <div key={n} className="border-b border-walnut/10 px-4 py-7 even:border-l md:border-b-0 md:border-l md:first:border-l-0">
              <p className="font-data text-xs text-sienna">{n}</p>
              <p className="mt-2 font-body text-xs font-semibold uppercase tracking-[.14em] text-walnut">{label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-walnut py-20 text-ivory">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2">
          <div>
            <p className="font-data text-xs uppercase tracking-[.22em] text-sienna-light">
              Our beginning
            </p>
            <h2 className="mt-4 font-display text-4xl leading-tight">
              A small workshop, a lathe and respect for good material.
            </h2>
          </div>
          <div className="space-y-5 font-body text-sm leading-7 text-ivory/70">
            <p>
              We started by turning reclaimed blocks into bowls and trays,
              learning that wood never gives the same answer twice. A knot might
              move a curve; a darker grain may become the detail that defines
              the finished piece.
            </p>
            <p>
              That lesson remains at the centre of our work. We design useful
              forms, produce in considered batches and avoid forcing natural
              material into factory-perfect sameness. Small variations in tone
              and grain are evidence of the tree—not manufacturing defects.
            </p>
            <p>
              Our goal is simple: make pieces that earn their place at home,
              feel better with use and can be cared for instead of replaced.
            </p>
          </div>
        </div>
      </section>
      <section id="craft" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-20">
        <p className="text-center font-data text-xs uppercase tracking-[.22em] text-sienna">
          From timber to table
        </p>
        <h2 className="mt-3 text-center font-display text-4xl text-walnut">
          How your piece is made
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {steps.map(([n, t, d]) => (
            <article
              key={n}
              className="rounded-2xl border border-walnut/10 bg-ivory p-6 shadow-carve"
            >
              <span className="font-data text-xs text-sienna">{n}</span>
              <h3 className="mt-8 font-display text-2xl text-walnut">{t}</h3>
              <p className="mt-3 font-body text-sm leading-6 text-walnut/60">
                {d}
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="grid overflow-hidden bg-walnut-dark text-ivory lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative min-h-[420px] lg:min-h-[620px]">
            <Image src="/images/walnut-chapati-box-v1.png" alt="Natural wood grain and handcrafted joinery" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
          </div>
          <div className="self-center px-7 py-12 sm:px-12 lg:px-14">
            <p className="font-data text-xs uppercase tracking-[.22em] text-sienna-light">Why wood</p>
            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">No two pieces need to look exactly alike.</h2>
            <div className="mt-6 space-y-5 font-body text-sm leading-7 text-ivory/70">
              <p>Grain is a record of growth. It can run straight, curl around a knot or shift in colour across a single surface. Our forms are intentionally quiet so natural variation remains visible.</p>
              <p>Wood asks for participation. It benefits from being dried after washing, refreshed when it feels pale and kept away from prolonged heat or water. In return, it develops warmth and familiarity.</p>
              <p>Product photographs guide you on form and finish. The piece that reaches you will carry its own grain pattern, tone and small evidence of handwork.</p>
            </div>
            <Link href="/care" className="mt-8 inline-flex rounded-full bg-ivory px-6 py-3 font-body text-xs font-semibold uppercase tracking-[.14em] text-walnut">Understand wood care</Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="max-w-3xl">
          <p className="font-data text-xs uppercase tracking-[.22em] text-sienna">Our design principles</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-walnut md:text-5xl">Quiet objects. Thoughtful details. Honest material.</h2>
        </div>
        <div className="mt-10 grid border-y border-walnut/10 md:grid-cols-2">
          {principles.map(([title, text], index) => (
            <article key={title} className={`px-1 py-8 md:p-8 ${index % 2 ? "md:border-l" : ""} ${index < 2 ? "border-b border-walnut/10" : ""}`}>
              <p className="font-data text-xs text-sienna">0{index + 1}</p>
              <h3 className="mt-4 font-display text-3xl text-walnut">{title}</h3>
              <p className="mt-3 max-w-md font-body text-sm leading-7 text-walnut/60">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-[#eadbc8] py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2">
          <div className="relative min-h-80 overflow-hidden rounded-[28px]">
            <Image
              src="/images/carved-serving-tray-v1.png"
              alt="Hand-carved wooden serving tray"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="self-center">
            <p className="font-data text-xs uppercase tracking-[.2em] text-sienna">
              What we value
            </p>
            <h2 className="mt-3 font-display text-4xl text-walnut">
              Useful, honest and made to last.
            </h2>
            <ul className="mt-7 space-y-5 font-body text-sm leading-6 text-walnut/70">
              <li>
                <strong className="text-walnut">Responsible material:</strong>{" "}
                reclaimed and responsibly sourced wood wherever practical.
              </li>
              <li>
                <strong className="text-walnut">Safer finishes:</strong>{" "}
                finishes selected for the product’s intended use.
              </li>
              <li>
                <strong className="text-walnut">Small-batch making:</strong>{" "}
                closer attention, less excess stock and products with character.
              </li>
              <li>
                <strong className="text-walnut">
                  Repair over replacement:
                </strong>{" "}
                clear care guidance so pieces can serve for years.
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-walnut px-6 py-3 font-body text-sm text-ivory"
              >
                Shop the collection
              </Link>
              <Link
                href="/care"
                className="rounded-full border border-walnut/20 px-6 py-3 font-body text-sm text-walnut"
              >
                Read the care guide
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-5xl px-5 py-16 text-center">
        <WoodRingDivider className="mx-auto mb-7" />
        <p className="font-display text-3xl text-walnut">
          Have a custom size, wedding gift or hospitality project in mind?
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block font-body text-sm text-sienna underline underline-offset-4"
        >
          Talk to our workshop →
        </Link>
      </div>
    </div>
  );
}
