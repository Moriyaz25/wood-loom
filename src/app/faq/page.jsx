import Link from "next/link";
export const metadata = {
  title: "FAQs | WOODLOOM",
  description:
    "Answers about WOODLOOM products, shipping, care, custom orders and returns.",
};
const groups = [
  {
    title: "Products & craft",
    items: [
      [
        "Are WOODLOOM products handmade?",
        "Yes. Our products are made and finished in small batches by skilled artisans. Natural variations in grain, colour and hand-finishing make every piece individual.",
      ],
      [
        "Is the finish food-safe?",
        "Products intended for food contact use an appropriate food-safe finish. Always review the material and care information on the product page.",
      ],
      [
        "Can wood colour or grain vary?",
        "Yes. Wood is a natural material, so grain, knots and tone will vary from photographs. These variations are characteristics, not defects.",
      ],
    ],
  },
  {
    title: "Orders & delivery",
    items: [
      [
        "How much is shipping?",
        "Shipping is set per product based on its size, weight and packing needs. The exact total is shown at checkout.",
      ],
      [
        "How long does delivery take?",
        "Orders are processed in 1–2 working days and normally delivered within 5–7 working days after dispatch, depending on location.",
      ],
      [
        "How can I track my order?",
        "Tracking information is shared once your order has been dispatched.",
      ],
      [
        "Do you offer cash on delivery?",
        "No. Available payment instructions are confirmed directly when your order or quotation is accepted.",
      ],
    ],
  },
  {
    title: "Customisation & care",
    items: [
      [
        "Can I request a custom product?",
        "Yes. Send dimensions, quantity, reference and timeline through WhatsApp. Feasibility and pricing are confirmed before production.",
      ],
      [
        "Do you accept bulk or gifting enquiries?",
        "Yes. We support wedding, corporate, hospitality and festive gifting enquiries subject to production capacity.",
      ],
      [
        "How do I care for wooden products?",
        "Hand wash, dry immediately, never soak or use a dishwasher, and refresh periodically with food-safe mineral oil. See our complete care guide.",
      ],
    ],
  },
];
export default function FaqPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <p className="font-data text-xs uppercase tracking-[.2em] text-sienna">
        Good to know
      </p>
      <h1 className="mt-3 font-display text-5xl text-walnut">
        Frequently asked questions
      </h1>
      <p className="mt-4 max-w-2xl font-body text-base leading-7 text-walnut/60">
        Straightforward answers about handcrafted products, delivery and
        ordering from WOODLOOM.
      </p>
      <div className="mt-12 space-y-12">
        {groups.map((group) => (
          <section key={group.title}>
            <h2 className="font-display text-2xl text-walnut">{group.title}</h2>
            <div className="mt-4 divide-y divide-walnut/10 border-y border-walnut/10">
              {group.items.map(([q, a]) => (
                <details key={q} className="group py-5">
                  <summary className="cursor-pointer list-none font-body text-sm font-semibold text-walnut">
                    {q}
                    <span className="float-right text-xl font-normal group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-3xl font-body text-sm leading-7 text-walnut/60">
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="mt-14 rounded-2xl bg-walnut p-8 text-ivory">
        <h2 className="font-display text-3xl">Still have a question?</h2>
        <p className="mt-2 font-body text-sm text-ivory/65">
          Message us with the product name and your delivery location.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://wa.me/917452905405"
            className="rounded-full bg-[#25D366] px-6 py-3 font-body text-sm text-white"
          >
            WhatsApp us
          </a>
          <Link
            href="/contact"
            className="rounded-full border border-white/25 px-6 py-3 font-body text-sm"
          >
            Contact page
          </Link>
        </div>
      </div>
    </div>
  );
}
