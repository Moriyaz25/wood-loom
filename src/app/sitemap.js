import { db } from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const products = await db.product.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true, updatedAt: true }
  });

  const staticRoutes = ["", "/products", "/about", "/contact", "/care"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date()
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: p.updatedAt
  }));

  return [...staticRoutes, ...productRoutes];
}
