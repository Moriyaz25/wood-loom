import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import BannerCarousel from "@/components/banners/BannerCarousel";
import ProductGrid from "@/components/product/ProductGrid";
import { getHomeContent } from "@/lib/homeContent";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const now = new Date();
    const [banners, featured, categories, homeContent] = await Promise.all([
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
      getHomeContent(),
    ]);
    return { banners, featured, categories, homeContent };
  } catch (error) {
    console.error(
      "Homepage data is temporarily unavailable:",
      error instanceof Error ? error.message : error,
    );
    return {
      banners: [],
      featured: [],
      categories: [],
      homeContent: await getHomeContent(),
    };
  }
}

export default async function HomePage() {
  const { banners, featured, categories, homeContent } = await getData();

  return (
    <div>
      <section className="mx-auto max-w-[1500px] bg-[#f7f3ec]">
        {banners.length ? (
          <BannerCarousel banners={banners} />
        ) : (
          <FallbackHero />
        )}
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 border-y border-walnut/10 bg-white/45 px-5 py-2 sm:grid-cols-2 md:grid-cols-4">
        {homeContent.trust.map(([title, text]) => (
          <div
            key={title}
            className="flex items-center gap-3 border-b border-walnut/10 px-2 py-4 last:border-b-0 sm:border-b-0 sm:odd:border-r md:border-r md:last:border-r-0"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-walnut/15 text-walnut/55">
              <TrustIcon />
            </span>
            <div>
              <p className="font-body text-[11px] font-semibold tracking-[.18em] text-[#1c1814]">
                {title}
              </p>
              <p className="mt-0.5 font-body text-[11px] text-walnut/55">
                {text}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section
        id="collections"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[.18em] text-sienna">
              {homeContent.collection.eyebrow}
            </p>
            <Link
              href="/products"
              className="group mt-3 inline-flex items-center gap-4 font-display text-5xl leading-none text-[#1c1814] md:text-6xl"
            >
              {homeContent.collection.title}
              <span className="transition-transform group-hover:translate-x-2">
                →
              </span>
            </Link>
          </div>
          <p className="max-w-md font-body text-sm leading-7 text-walnut/60">
            {homeContent.collection.description}
          </p>
        </div>
        <Link
          href="/products"
          className="relative mt-9 block h-[260px] overflow-hidden bg-sand sm:h-[360px] lg:h-[460px]"
        >
          <Image
            src={homeContent.collection.image}
            alt="WOODLOOM handcrafted wooden collection"
            fill
            className="object-cover transition duration-700 hover:scale-[1.02]"
            sizes="(max-width:1280px) 100vw,1280px"
          />
        </Link>
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="rounded-full border border-walnut/15 bg-white px-5 py-2.5 font-body text-sm font-medium text-walnut transition hover:border-walnut"
            >
              {category.name}
              <span className="ml-1 text-walnut/35">
                {category._count.products}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <ProductGrid
          products={featured}
          title={homeContent.topPicks.title}
          description={homeContent.topPicks.description}
        />
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <Heading
          eyebrow={homeContent.edit.eyebrow}
          title={homeContent.edit.title}
        />
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {homeContent.edit.categories.map((item) => (
            <Collection key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <Heading
          eyebrow={homeContent.why.eyebrow}
          title={homeContent.why.title}
        />
        <div className="mt-10 grid gap-10">
          {homeContent.why.blocks.map((item) => (
            <Reason key={item.n} {...item}>
              {item.text}
            </Reason>
          ))}
        </div>
      </section>

      <section className="bg-walnut-dark text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-2 md:items-center">
          <div className="relative min-h-[360px] overflow-hidden rounded-xl shadow-[0_24px_60px_rgba(0,0,0,.22)]">
            <Image
              src={homeContent.story.image}
              alt="Woodloom craft story"
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
          <div className="md:px-6">
            <p className="font-body text-xs uppercase tracking-[.18em] text-white/55">
              {homeContent.story.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-5xl uppercase leading-[.9] md:text-7xl">
              {homeContent.story.title.split("\n").map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-6 font-body leading-7 text-white/68">
              {homeContent.story.text}
            </p>
            <Link
              href={homeContent.story.ctaLink}
              className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[.14em] text-walnut-dark"
            >
              {homeContent.story.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <Heading
          eyebrow={homeContent.process.eyebrow}
          title={homeContent.process.title}
        />
        <div className="mt-10 grid gap-0 border-y border-walnut/10 md:grid-cols-4">
          {homeContent.process.steps.map(([n, title, text]) => (
            <Step key={n} n={n} title={title}>
              {text}
            </Step>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="grid overflow-hidden rounded-xl bg-walnut-dark text-white md:grid-cols-[1.05fr_.95fr]">
          <div className="px-7 py-14 md:px-14 md:py-20">
            <p className="font-body text-xs uppercase tracking-[.18em] text-white/55">
              {homeContent.gifting.eyebrow}
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-5xl uppercase leading-[.9] md:text-7xl">
              {homeContent.gifting.title}
            </h2>
            <p className="mt-5 max-w-xl font-body text-sm leading-7 text-white/68">
              {homeContent.gifting.text}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-white px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[.14em] text-walnut-dark"
              >
                Shop gifts
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/25 px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[.14em] text-white"
              >
                Corporate enquiry
              </Link>
            </div>
          </div>
          <div className="relative min-h-[320px]">
            <Image
              src={homeContent.gifting.image}
              alt="WOODLOOM wooden gift box"
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 45vw"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <Heading
          eyebrow={homeContent.reviews.eyebrow}
          title={homeContent.reviews.title}
        />
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {homeContent.reviews.items.map(([name, city, text]) => (
            <article
              key={name}
              className="border border-walnut/10 bg-white p-6"
            >
              <p className="font-display text-2xl leading-snug text-[#1c1814]">
                “{text}”
              </p>
              <p className="mt-5 font-body text-xs uppercase tracking-[.16em] text-sienna">
                ★★★★★
              </p>
              <p className="mt-3 font-body text-sm text-walnut/60">
                — {name}, {city}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <Heading
            eyebrow={homeContent.ugc.eyebrow}
            title={homeContent.ugc.title}
          />
          <p className="font-body text-xs font-semibold uppercase tracking-[.16em] text-walnut/55">
            {homeContent.ugc.handle}
          </p>
        </div>
        <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-6">
          {homeContent.ugc.images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="relative aspect-[4/5] overflow-hidden bg-sand md:odd:mt-8"
            >
              <Image
                src={src}
                alt="WOODLOOM lifestyle moment"
                fill
                className="object-cover transition duration-500 hover:scale-[1.03]"
                sizes="(max-width:768px) 50vw, 16vw"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Heading({ eyebrow, title }) {
  return (
    <div>
      <p className="font-body text-xs font-semibold uppercase tracking-[.18em] text-sienna">
        {eyebrow}
      </p>
      <h2 className="mt-2 max-w-4xl font-display text-4xl leading-[1.02] text-[#1c1814] md:text-5xl">
        {title}
      </h2>
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

function Collection({ href, title, text, image }) {
  return (
    <Link
      href={href}
      className="group relative min-h-[390px] overflow-hidden bg-sand"
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition duration-700 group-hover:scale-[1.03]"
        sizes="(max-width:768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/8 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <h3 className="font-display text-4xl leading-none">{title}</h3>
        <p className="mt-2 font-body text-xs uppercase tracking-[.16em] text-white/75">
          {text}
        </p>
      </div>
    </Link>
  );
}

function Reason({ n, title, children, image, reverse }) {
  return (
    <article
      className={`grid gap-6 md:grid-cols-2 md:items-center ${reverse ? "md:[&>div:first-child]:order-2" : ""}`}
    >
      <div className="relative min-h-[300px] overflow-hidden bg-sand md:min-h-[420px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 50vw"
        />
      </div>
      <div className="max-w-xl md:px-10">
        <p className="font-data text-xs text-sienna">{n}</p>
        <h3 className="mt-4 font-display text-5xl leading-none text-[#1c1814]">
          {title}
        </h3>
        <p className="mt-5 font-body text-sm leading-7 text-walnut/65">
          {children}
        </p>
      </div>
    </article>
  );
}

function Step({ n, title, children }) {
  return (
    <article className="border-b border-walnut/10 px-1 py-7 last:border-b-0 md:border-b-0 md:border-r md:px-6 md:last:border-r-0">
      <p className="font-data text-xs text-sienna">{n}</p>
      <h3 className="mt-5 font-display text-3xl text-[#1c1814]">{title}</h3>
      <p className="mt-2 font-body text-sm leading-6 text-walnut/60">
        {children}
      </p>
    </article>
  );
}

function FallbackHero() {
  return (
    <div
      className="relative isolate flex min-h-[560px] items-end overflow-hidden bg-walnut bg-cover bg-center px-6 py-10 text-white sm:items-center sm:px-10 md:min-h-[640px] md:px-16"
      style={{ backgroundImage: "url('/images/hero-craft-v1.png')" }}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/25 to-black/5 sm:bg-gradient-to-r sm:from-black/72 sm:via-black/22 sm:to-transparent" />
      <div className="max-w-xl">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[.24em] sm:text-xs">
          New collection
        </p>
        <h1 className="mt-4 font-display text-6xl uppercase leading-[.9] sm:text-7xl md:text-8xl">
          Crafted from wood.
          <br />
          Made for home.
        </h1>
        <p className="mt-5 max-w-sm font-body text-sm leading-7 text-white/75">
          Handcrafted tableware & homeware, made by Indian artisans.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="rounded-full bg-white px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[.14em] text-walnut-dark"
          >
            Explore collection
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-white/30 px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[.14em] text-white"
          >
            Our story
          </Link>
        </div>
      </div>
    </div>
  );
}
