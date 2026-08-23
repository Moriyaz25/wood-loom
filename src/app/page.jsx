import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import BannerCarousel from "@/components/banners/BannerCarousel";
import ProductGrid from "@/components/product/ProductGrid";
export const dynamic = "force-dynamic";

async function getData() {
  const now = new Date();
  const [banners, featured, categories] = await Promise.all([
    db.banner.findMany({
      where: {
        position: "HERO",
        active: true,
        AND: [
          { OR: [{ startDate: null }, { startDate: { lte: now } }] },
          { OR: [{ endDate: null }, { endDate: { gte: now } }] },
        ],
      },
      orderBy: { priority: "desc" },
    }),
    db.product.findMany({
      where: { status: "ACTIVE", isFeatured: true },
      include: { images: true, category: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany({
      where: { products: { some: { status: "ACTIVE" } } },
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
  ]);
  return { banners, featured, categories };
}

export default async function HomePage() {
  const { banners, featured, categories } = await getData();
  return (
    <div>
      <section className="mx-auto max-w-[1500px] bg-[#f7f1e8]">
        {banners.length ? (
          <BannerCarousel banners={banners} />
        ) : (
          <FallbackHero />
        )}
      </section>
      <section className="mx-auto grid max-w-7xl grid-cols-2 border-b border-walnut/10 px-5 py-6 md:grid-cols-4">
        {[
          ["Made by Hand", "Crafted by skilled artisans"],
          ["Seasoned Wood", "Selected for lasting quality"],
          ["Direct from Makers", "Supporting Indian craftsmanship"],
          ["Made to Order", "Thoughtfully crafted for you"],
        ].map(([t, s]) => (
          <div
            key={t}
            className="flex items-center gap-3 px-3 py-3 md:border-r md:border-walnut/10"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-walnut/15 text-walnut/55">
              <TrustIcon />
            </span>
            <div>
              <p className="font-display text-base">{t}</p>
              <p className="mt-0.5 font-body text-[11px] text-walnut/50">{s}</p>
            </div>
          </div>
        ))}
      </section>
      <section
        id="collections"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14"
      >
        <Link
          href="/products"
          className="group inline-flex items-center gap-4 font-display text-4xl text-walnut md:text-5xl"
        >
          Shop by collection{" "}
          <span className="transition-transform group-hover:translate-x-2">
            →
          </span>
        </Link>
        <Link
          href="/products"
          className="relative mt-8 block h-[250px] overflow-hidden bg-sand sm:h-[340px] lg:h-[440px]"
        >
          <Image
            src="https://res.cloudinary.com/h13umivj/image/upload/v1787468919/woodloom/site/collection-collage-v1.png"
            alt="WOODLOOM handcrafted wooden collection"
            fill
            className="object-cover transition duration-700 hover:scale-[1.01]"
            sizes="(max-width:1280px) 100vw,1280px"
          />
        </Link>
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="rounded-full border border-walnut/15 bg-ivory px-5 py-2.5 font-body text-sm font-medium text-walnut transition hover:border-sienna hover:text-sienna"
            >
              {category.name}{" "}
              <span className="ml-1 text-walnut/35">
                {category._count.products}
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-ivory">
        <ProductGrid
          products={featured}
          title="Top picks"
          description="Useful, beautiful pieces selected from the current workshop batch"
        />
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16">
        <Heading
          eyebrow="Why WOODLOOM"
          title="Craft you can feel. Quality you can use."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Reason n="01" title="Seasoned wood that lasts">
            We choose stable, properly dried timber and finish it for the
            realities of daily kitchen and dining use.
          </Reason>
          <Reason n="02" title="No two pieces repeat">
            Grain, tone and the subtle marks of hand-finishing make each object
            individual—not factory-uniform.
          </Reason>
          <Reason n="03" title="Designed for real homes">
            A tray should serve beautifully and live beautifully on the counter.
            Every form earns its place.
          </Reason>
        </div>
      </section>
      <section className="bg-[#2e2119] text-ivory">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center">
          <div
            className="min-h-[350px] rounded-2xl bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/h13umivj/image/upload/v1787465282/infinity-creations/site/hero-craft-v1.png')",
            }}
          />
          <div className="md:px-6">
            <p className="font-body text-xs uppercase tracking-[.18em] text-sienna-light">
              Our story
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
              The craft was always here. We bring it into everyday homes.
            </h2>
            <p className="mt-6 font-body leading-7 text-ivory/65">
              WOODLOOM works with skilled makers and natural materials to create
              pieces that are useful from day one and more personal with time.
              We believe good craft should not stay hidden behind showrooms or
              trends.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex rounded-full bg-ivory px-7 py-3.5 font-body text-sm text-walnut"
            >
              Read our story
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16">
        <Heading eyebrow="From workshop to your home" title="How it works" />
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          <Step n="01" title="Material selected">
            Wood is chosen for stability, grain and the purpose of the final
            piece.
          </Step>
          <Step n="02" title="Shaped by hand">
            Each object is turned, carved, sanded and finished in small batches.
          </Step>
          <Step n="03" title="Packed with care">
            Your order is checked, protected and prepared for delivery across
            India.
          </Step>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="rounded-[2rem] bg-sienna px-7 py-14 text-center text-ivory md:px-20">
          <p className="font-body text-xs uppercase tracking-[.18em]">
            Housewarmings · weddings · festive gifting
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl font-display text-4xl md:text-5xl">
            A gift that becomes part of everyday life.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-sm leading-6 text-ivory/75">
            Ask us about personalised notes, custom finishes and thoughtful bulk
            gifting for teams and celebrations.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-flex rounded-full bg-ivory px-7 py-3.5 font-body text-sm text-walnut"
          >
            Plan a gift
          </Link>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-5 pb-20">
        <Heading eyebrow="Good to know" title="Frequently asked questions" />
        <div className="mt-8 divide-y divide-walnut/10">
          {[
            [
              "Is the finish food-safe?",
              "Food-contact products are finished with appropriate food-safe oils or coatings; each product page lists its specific finish.",
            ],
            [
              "Why does my product look slightly different?",
              "Natural grain and hand-finishing create variations in tone and pattern. That individuality is part of authentic craft.",
            ],
            [
              "How should I care for wooden serveware?",
              "Hand wash, dry immediately, avoid soaking and refresh periodically with food-grade mineral oil.",
            ],
            [
              "Can you customise or supply bulk gifts?",
              "Yes. Use WhatsApp or the contact form with quantity, timeline and personalisation details.",
            ],
          ].map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="cursor-pointer list-none font-display text-lg">
                {q}
                <span className="float-right">+</span>
              </summary>
              <p className="mt-3 max-w-2xl font-body text-sm leading-6 text-walnut/60">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
function Heading({ eyebrow, title }) {
  return (
    <div>
      <p className="font-body text-xs uppercase tracking-[.18em] text-sienna">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-3xl md:text-4xl">{title}</h2>
    </div>
  );
}
function TrustIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
    >
      <path d="M12 21c0-7 2-11 7-15-5 1-8 3-9 7-1-3-3-5-6-6 1 6 3 10 8 14Z" />
      <path d="M12 21V11" />
    </svg>
  );
}
function Collection({ href, title, image }) {
  return (
    <Link
      href={href}
      className="group relative min-h-[360px] overflow-hidden rounded-2xl bg-cover bg-center"
      style={{ backgroundImage: `url('${image}')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-6 text-ivory">
        <h3 className="font-display text-2xl">{title}</h3>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl backdrop-blur">
          →
        </span>
      </div>
    </Link>
  );
}
function Reason({ n, title, children }) {
  return (
    <article className="rounded-2xl border border-walnut/10 bg-ivory p-7">
      <p className="font-data text-xs text-sienna">{n}</p>
      <h3 className="mt-8 font-display text-2xl">{title}</h3>
      <p className="mt-3 font-body text-sm leading-6 text-walnut/60">
        {children}
      </p>
    </article>
  );
}
function Step({ n, title, children }) {
  return (
    <article>
      <p className="font-display text-5xl text-sienna/25">{n}</p>
      <h3 className="mt-4 font-display text-2xl">{title}</h3>
      <p className="mt-3 font-body text-sm leading-6 text-walnut/60">
        {children}
      </p>
    </article>
  );
}
function FallbackHero() {
  return (
    <div
      className="flex min-h-[600px] items-center rounded-[2rem] bg-walnut bg-cover bg-center px-8 text-ivory md:px-16"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/h13umivj/image/upload/v1787465282/infinity-creations/site/hero-craft-v1.png')",
      }}
    >
      <div className="max-w-xl">
        <p className="font-body text-xs uppercase tracking-[.2em]">
          Handcrafted in India
        </p>
        <h1 className="mt-4 font-display text-5xl md:text-7xl">
          Wood, shaped into stories.
        </h1>
        <Link
          href="/products"
          className="mt-8 inline-flex rounded-full bg-ivory px-7 py-3.5 font-body text-sm text-walnut"
        >
          Shop the collection
        </Link>
      </div>
    </div>
  );
}
