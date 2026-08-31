import Link from "next/link";

const groups = [
  {
    title: "Shop",
    links: [
      ["/products", "All Products"],
      ["/products?featured=1", "New Arrivals"],
      ["/products", "Tableware"],
      ["/products?category=home-decor", "Home Decor"],
      ["/contact", "Gifts"],
    ],
  },
  {
    title: "About",
    links: [
      ["/about", "Our Story"],
      ["/about#craft", "Our Craft"],
      ["/care", "Wood Care"],
      ["/faq", "FAQs"],
    ],
  },
  {
    title: "Help",
    links: [
      ["/shipping-returns", "Shipping"],
      ["/shipping-returns", "Returns"],
      ["/care", "Care Guide"],
      ["/contact", "Contact"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-walnut-dark text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-5xl leading-none">WOODLOOM</p>
            <p className="mt-4 max-w-sm font-body text-sm leading-7 text-white/62">
              Crafted by nature. Made for home. Contemporary Indian woodcraft
              made in small batches in Nagina, India.
            </p>
            <p className="mt-8 font-body text-xs font-semibold uppercase tracking-[.18em] text-white/50">
              Made in India · Delivered across India
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://wa.me/917452905405"
                className="rounded-full border border-white/20 px-4 py-2 font-body text-xs text-white/75 transition hover:border-white hover:text-white"
              >
                WhatsApp: +91 74529 05405
              </a>
              <a
                href="mailto:mozain0145@gmail.com"
                className="rounded-full border border-white/20 px-4 py-2 font-body text-xs text-white/75 transition hover:border-white hover:text-white"
              >
                mozain0145@gmail.com
              </a>
            </div>
          </div>
          {groups.map((group) => (
            <div key={group.title}>
              <p className="font-body text-xs uppercase tracking-[.16em] text-white/40">
                {group.title}
              </p>
              <ul className="mt-5 space-y-3">
                {group.links.map(([href, label]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-body text-sm text-white/70 transition hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 font-body text-xs text-white/40 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} WOODLOOM. Handmade in India.</p>
          <p>
            Careful shipping · Secure accounts · Small-batch craft
          </p>
        </div>
      </div>
    </footer>
  );
}
