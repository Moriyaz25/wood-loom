import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
import AddToCartPanel from "@/components/product/AddToCartPanel";
import WoodRingDivider from "@/components/ui/WoodRingDivider";
import ProductCard from "@/components/product/ProductCard";

async function getProduct(slug) {
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      reviews: { orderBy: { createdAt: "desc" } },
      banners: { where: { active: true } },
    },
  });
  return product;
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
        product.reviews.reduce((sum, r) => sum + r.rating, 0) /
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
    image: product.images.map((i) => i.url),
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
    <div className="mx-auto max-w-6xl px-5 py-10">
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="card-notch relative aspect-square overflow-hidden bg-sand">
          <Image
            src={product.images[0]?.url || "/textures/placeholder-product.svg"}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="font-data text-xs uppercase tracking-wide text-sienna">
            {product.category.name}
          </p>
          <h1 className="mt-2 font-display text-3xl text-walnut">
            {product.name}
          </h1>
          {avgRating && (
            <p className="mt-1 font-body text-sm text-walnut/60">
              ★ {avgRating} · {product.reviews.length} reviews
            </p>
          )}
          <div className="mt-4 flex items-baseline gap-3 font-data text-xl">
            <span className="text-walnut">₹{product.price}</span>
            {product.compareAtPrice && (
              <span className="text-walnut/40 line-through">
                ₹{product.compareAtPrice}
              </span>
            )}
          </div>
          <p className="mt-2 font-body text-xs text-walnut/55">
            Shipping charge: ₹{product.shippingFee.toLocaleString("en-IN")} per
            item
          </p>
          <p className="mt-4 font-body text-sm text-walnut/70">
            {product.description}
          </p>

          <AddToCartPanel product={product} />

          <div className="mt-8 space-y-2 border-t border-walnut/10 pt-6 font-body text-sm text-walnut/70">
            {product.materials && (
              <p>
                <span className="text-walnut">Materials:</span>{" "}
                {product.materials}
              </p>
            )}
            {product.dimensions && (
              <p>
                <span className="text-walnut">Dimensions:</span>{" "}
                {product.dimensions}
              </p>
            )}
            {product.careInstructions && (
              <p>
                <span className="text-walnut">Care:</span>{" "}
                {product.careInstructions}
              </p>
            )}
          </div>
        </div>
      </div>

      {product.reviews.length > 0 && (
        <div className="mt-16">
          <WoodRingDivider className="mb-8" />
          <h2 className="mb-6 font-display text-xl text-walnut">
            What customers say
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {product.reviews.map((review) => (
              <div
                key={review.id}
                className="card-notch-sm bg-ivory p-5 shadow-carve"
              >
                <p className="font-body text-sm text-walnut">
                  "{review.comment}"
                </p>
                <p className="mt-2 font-data text-xs text-walnut/50">
                  {review.authorName} · ★ {review.rating}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {related.length > 0 && (
        <section className="mt-16 border-t border-walnut/10 pt-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-data text-[10px] uppercase tracking-[.2em] text-sienna">
                More from {product.category.name}
              </p>
              <h2 className="mt-2 font-display text-3xl text-walnut">
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
