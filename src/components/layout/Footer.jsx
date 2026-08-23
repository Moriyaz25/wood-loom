import Link from "next/link";
const groups = [
  {
    title: "Explore",
    links: [
      ["/", "Home"],
      ["/products", "Shop all"],
      ["/about", "Our story"],
      ["/contact", "Contact"],
    ],
  },
  {
    title: "Customer care",
    links: [
      ["/shipping-returns", "Shipping & returns"],
      ["/care", "Wood care"],
      ["/faq", "FAQs"],
      ["/account", "My account"],
      ["/contact", "Bulk & gifting"],
    ],
  },
  {
    title: "Policies",
    links: [
      ["/privacy", "Privacy policy"],
      ["/terms", "Terms & conditions"],
      ["/shipping-returns", "Returns policy"],
    ],
  },
];
export default function Footer() {
  return (
    <footer className="mt-20 bg-[#241a14] text-ivory">
      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl">WOODLOOM</p>
            <p className="mt-4 max-w-sm font-body text-sm leading-6 text-ivory/60">
              Handcrafted wooden tableware and home objects made in small
              batches for everyday rituals and meaningful gifting.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://wa.me/917452905405"
                className="rounded-full border border-white/20 px-4 py-2 font-body text-xs"
              >
                WhatsApp: +91 74529 05405
              </a>
              <a
                href="mailto:mozain0145@gmail.com"
                className="rounded-full border border-white/20 px-4 py-2 font-body text-xs"
              >
                mozain0145@gmail.com
              </a>
            </div>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <p className="font-body text-xs uppercase tracking-[.16em] text-ivory/40">
                {g.title}
              </p>
              <ul className="mt-5 space-y-3">
                {g.links.map(([href, label]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-body text-sm text-ivory/70 hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 font-body text-xs text-ivory/40 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} WOODLOOM. Handmade in India.</p>
          <p>
            Direct enquiries · Made-to-order support · Privacy-first accounts
          </p>
        </div>
      </div>
    </footer>
  );
}
