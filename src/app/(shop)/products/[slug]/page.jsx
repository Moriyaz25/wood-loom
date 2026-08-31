import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import AddToCartPanel from "@/components/product/AddToCartPanel";
import WoodRingDivider from "@/components/ui/WoodRingDivider";
import ProductCard from "@/components/product/ProductCard";
import ProductGallery from "@/components/product/ProductGallery";

export const dynamic = "force-dynamic";

async function getProduct(slug) {
  return db.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      reviews: { orderBy: { createdAt: "desc" } },
      banners: { where: { active: true } },
    },
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} | WOODLOOM`,
    description: product.shortDesc,
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product || product.status !== "ACTIVE") notFound();

  const avgRating = product.reviews.length
    ? (
        product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      ).toFixed(1)
    : null;
  const related = await db.product.findMany({
    where: {
      id: { not: product.id },
      status: "ACTIVE",
      categoryId: product.categoryId,
    },
    include: { images: { orderBy: { position: "asc" } }, category: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 4,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc,
    sku: product.sku,
    image: product.images
      .filter((item) => item.mediaType !== "VIDEO")
      .map((item) => item.url),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    ...(avgRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating,
        reviewCount: product.reviews.length,
      },
    }),
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-10 lg:px-9">
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,.92fr)] lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div className="lg:sticky lg:top-24 lg:self-start lg:py-4">
          <p className="font-body text-xs font-semibold uppercase tracking-[.18em] text-sienna">
            {product.category.name}
          </p>
          <h1 className="mt-2 font-display text-5xl leading-none text-[#1c1814] sm:text-6xl">
            {product.name}
          </h1>
          <p className="mt-3 font-body text-sm text-walnut/60">
            ★ {avgRating || "4.9"} · {product.reviews.length || "Woodloom"}{" "}
            reviews
          </p>
          <div className="mt-5 flex items-baseline gap-3 font-body text-xl font-medium">
            <span className="text-walnut">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.compareAtPrice && (
              <span className="text-walnut/40 line-through">
                ₹{product.compareAtPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <p className="mt-2 font-body text-xs text-walnut/55">
            Shipping charges are calculated at checkout.
          </p>
          <p className="mt-5 font-body text-[15px] leading-7 text-walnut/70">
            {product.description}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 font-body text-sm text-walnut/70">
            <p>✓ Food safe</p>
            <p>✓ Handmade</p>
            <p>✓ Small batch</p>
            <p>✓ Ships from India</p>
          </div>

          <AddToCartPanel product={product} />

          <div className="mt-8 divide-y divide-walnut/10 border-y border-walnut/10 font-body text-sm text-walnut/70">
            <Detail title="Material">
              {product.materials || "Seasoned natural wood"}
            </Detail>
            <Detail title="Dimensions">
              {product.dimensions || "Dimensions vary by handcrafted piece"}
            </Detail>
            <Detail title="Care">
              {product.careInstructions ||
                "Hand wash and dry immediately. Do not soak."}
            </Detail>
            <Detail title="Shipping">
              Ships from India. International duties and taxes can be configured
              when worldwide checkout is enabled.
            </Detail>
            <Detail title="Returns">
              Eligible returns follow the Woodloom shipping and returns policy.
            </Detail>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-walnut/10 pt-6 font-body text-xs text-walnut/60">
            <p>◇ Handcrafted in India</p>
            <p>◇ Carefully packed</p>
            <p>◇ Natural wood grain</p>
            <p>◇ Secure UPI payment</p>
          </div>
        </div>
      </div>

      {product.reviews.length > 0 && (
        <div className="mt-16">
          <WoodRingDivider className="mb-8" />
          <h2 className="mb-6 font-display text-3xl text-[#1c1814]">
            Loved in real homes
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {product.reviews.map((review) => (
              <div
                key={review.id}
                className="border border-walnut/10 bg-white p-5"
              >
                <p className="font-display text-2xl leading-snug text-[#1c1814]">
                  “{review.comment}”
                </p>
                <p className="mt-3 font-body text-xs uppercase tracking-[.14em] text-walnut/50">
                  {review.authorName} · ★ {review.rating}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {related.length > 0 && (
        <section className="mt-16 border-t border-walnut/10 pt-12">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="font-body text-[10px] font-semibold uppercase tracking-[.2em] text-sienna">
                More from {product.category.name}
              </p>
              <h2 className="mt-2 font-display text-4xl leading-none text-[#1c1814]">
                You may also love
              </h2>
            </div>
            <a
              href={`/products?category=${product.category.slug}`}
              className="font-body text-sm text-walnut/60 underline decoration-sienna/40 underline-offset-4"
            >
              View category
            </a>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Detail({ title, children }) {
  return (
    <details className="group py-4" open={title === "Material"}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-body text-xs font-semibold uppercase tracking-[.16em] text-[#1c1814]">
        {title}
        <span className="text-lg leading-none text-walnut/45 group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="mt-3 max-w-xl font-body text-sm leading-7 text-walnut/62">
        {children}
      </p>
    </details>
  );
}
