import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
import ProductGrid from "@/components/product/ProductGrid";

export const metadata = {
  title: "Shop All | WOODLOOM",
  description: "Browse hand-turned and hand-carved wooden home decor, made in small batches."
};


export default async function ProductsPage({ searchParams }) {
  const where = { status: "ACTIVE" };
  if (searchParams?.category) where.category = { slug: searchParams.category };
  if (searchParams?.featured) where.isFeatured = true;

  const products = await db.product.findMany({
    where,
    include: { images: true, category: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="pt-10">
      <ProductGrid products={products} title="Shop all" description={`${products.length} handmade pieces`} />
    </div>
  );
}
