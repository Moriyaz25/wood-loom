import Link from "next/link";
export const metadata = {
  title: "Shipping Policy | WOODLOOM",
  description:
    "WOODLOOM shipping charges, processing, delivery timelines and tracking across India.",
};
const sections = [
  [
    "Shipping Charges",
    <>
      We deliver across India. Shipping is configured per product according to
      its size, weight and protective packing requirements. The exact charge for
      every item and the combined shipping total are shown at checkout.
    </>,
  ],
  [
    "Delivery Timeline",
    <>
      After dispatch, orders are normally delivered within{" "}
      <strong>5 to 7 working days</strong>, depending on location and courier
      conditions.
    </>,
  ],
  [
    "Order Processing",
    <>
      Orders are processed within <strong>1 to 2 working days</strong> before
      dispatch. Every product is checked and securely packed to reduce the risk
      of damage in transit.
    </>,
  ],
  [
    "Delivery Coverage",
    <>
      We currently ship across India. Remote or hard-to-reach locations may take
      slightly longer; where possible, we will keep you informed about material
      delays.
    </>,
  ],
  [
    "Order Tracking",
    <>
      Once an order ships, available courier and tracking details are shared
      with you so you can follow its journey.
    </>,
  ],
  [
    "Delays & Address Changes",
    <>
      Courier delays caused by weather, public holidays or access restrictions
      can occasionally occur. Contact us immediately for an address correction;
      changes cannot be guaranteed after dispatch.
    </>,
  ],
];
export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 md:py-20">
      <header className="max-w-3xl">
        <p className="font-data text-xs uppercase tracking-[.22em] text-sienna">
          From workshop to doorstep
        </p>
        <h1 className="mt-3 font-display text-5xl text-walnut md:text-6xl">
          Shipping Policy
        </h1>
        <p className="mt-5 font-body text-base leading-7 text-walnut/65">
          Clear timelines, delivery details, and how your order reaches you.
          Everything you need to know about shipping, from dispatch to doorstep.
        </p>
        <p className="mt-4 font-body text-xs text-walnut/40">
          Last updated: 23 August 2026
        </p>
      </header>
      <div className="mt-12 grid gap-x-14 gap-y-10 md:grid-cols-2">
        {sections.map(([title, body]) => (
          <section key={title}>
            <h2 className="font-display text-2xl text-walnut">{title}</h2>
            <p className="mt-3 font-body text-sm leading-7 text-walnut/65">
              {body}
            </p>
          </section>
        ))}
      </div>
      <section className="mt-14 rounded-2xl bg-walnut p-8 text-ivory">
        <h2 className="font-display text-3xl">Need help with a delivery?</h2>
        <p className="mt-3 max-w-2xl font-body text-sm leading-6 text-ivory/65">
          Share your order details through an official channel. Never send
          passwords or banking credentials.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="mailto:mozain0145@gmail.com"
            className="rounded-full bg-ivory px-6 py-3 font-body text-sm text-walnut"
          >
            mozain0145@gmail.com
          </a>
          <a
            href="https://wa.me/917452905405"
            className="rounded-full bg-[#25D366] px-6 py-3 font-body text-sm text-white"
          >
            WhatsApp us
          </a>
        </div>
      </section>
      <p className="mt-8 font-body text-sm text-walnut/55">
        For damaged or incorrect items, see the return information in our{" "}
        <Link href="/terms" className="text-sienna underline">
          terms and conditions
        </Link>
        .
      </p>
    </div>
  );
}
