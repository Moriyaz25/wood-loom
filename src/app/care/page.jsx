import Link from "next/link";
export const metadata = {
  title: "Wood Care Guide | WOODLOOM",
  description:
    "Clean, oil and store handmade wooden products so they last beautifully.",
};
const cards = [
  [
    "After every use",
    "Hand wash with mild soap and lukewarm water. Rinse quickly, wipe dry immediately and let the piece air-dry upright.",
  ],
  [
    "Every 2–3 months",
    "When the surface looks pale or feels dry, apply a thin coat of food-safe mineral oil. Leave it to absorb, then wipe away excess.",
  ],
  [
    "For stubborn odours",
    "Rub with coarse salt and half a lemon, rinse briefly and dry. Test on a discreet area first and do not leave acidic juice sitting.",
  ],
  [
    "For light scratches",
    "Very gently sand with fine-grit paper in the grain direction, remove dust and re-oil. Contact us before treating deep cracks.",
  ],
];
export default function CarePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="max-w-3xl">
        <p className="font-data text-xs uppercase tracking-[.22em] text-sienna">
          Keep it for years
        </p>
        <h1 className="mt-3 font-display text-5xl text-walnut md:text-6xl">
          The complete wood care guide
        </h1>
        <p className="mt-5 font-body text-base leading-7 text-walnut/65">
          Real wood responds to water, heat and humidity. A few simple habits
          protect its finish and make the grain richer over time.
        </p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {cards.map(([t, d], i) => (
          <article key={t} className="rounded-2xl bg-ivory p-7 shadow-carve">
            <span className="font-data text-xs text-sienna">0{i + 1}</span>
            <h2 className="mt-5 font-display text-2xl text-walnut">{t}</h2>
            <p className="mt-3 font-body text-sm leading-7 text-walnut/65">
              {d}
            </p>
          </article>
        ))}
      </div>
      <section className="mt-16 grid gap-8 rounded-[28px] bg-walnut p-8 text-ivory md:grid-cols-2 md:p-12">
        <div>
          <h2 className="font-display text-3xl">What to avoid</h2>
          <p className="mt-3 font-body text-sm leading-6 text-ivory/60">
            Most damage comes from prolonged water or sudden temperature
            changes.
          </p>
        </div>
        <ul className="space-y-3 font-body text-sm text-ivory/75">
          <li>× Dishwasher, microwave, oven or refrigerator storage</li>
          <li>× Soaking in a sink or leaving wet overnight</li>
          <li>
            × Bleach, harsh scrubbers or cooking oils that can turn rancid
          </li>
          <li>× Direct flame, hot pans and long exposure to strong sunlight</li>
        </ul>
      </section>
      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-3xl text-walnut">
          A note on natural change
        </h2>
        <div className="mt-5 space-y-4 font-body text-sm leading-7 text-walnut/65">
          <p>
            Colour deepening, a softer sheen and small marks are normal signs of
            use. Seasonal movement can also occur as humidity changes. These
            characteristics make every piece individual.
          </p>
          <p>
            If a product develops a structural crack, unusual odour or loose
            component, stop using it for food and send us clear photographs. We
            will help assess whether it can be safely restored.
          </p>
        </div>
        <Link
          href="/contact"
          className="mt-7 inline-block rounded-full bg-sienna px-6 py-3 font-body text-sm text-white"
        >
          Ask us about care
        </Link>
      </section>
    </div>
  );
}
