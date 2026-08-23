import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminFromRequest, isSameOrigin } from "@/lib/auth";
import { productSchema } from "@/lib/validators";
import { parseCsv } from "@/lib/csv";
import ExcelJS from "exceljs";
import { rateLimit, safeJson, unauthorized } from "@/lib/security";

const bool = (v) => ["true", "1", "yes"].includes(String(v).toLowerCase());
export async function POST(request) {
  if (!isSameOrigin(request))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const admin = await getAdminFromRequest(request);
  if (!admin) return unauthorized();
  if (!rateLimit(request, `bulk:${admin.id}`, 10, 600000))
    return NextResponse.json({ error: "Too many imports" }, { status: 429 });
  const form = await request.formData();
  const file = form.get("file");
  if (!file || file.size > 5_000_000)
    return NextResponse.json(
      { error: "Excel file is required and must be under 5 MB" },
      { status: 422 },
    );
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(await file.arrayBuffer());
  const ws = wb.getWorksheet("Products") || wb.worksheets[0];
  if (!ws)
    return NextResponse.json(
      { error: "Products sheet is missing" },
      { status: 422 },
    );
  const headers = ws.getRow(3).values.slice(1).map(String);
  const rows = [];
  ws.eachRow((row, n) => {
    if (n <= 3) return;
    const values = row.values.slice(1);
    if (values.every((v) => v === null || v === undefined || v === "")) return;
    rows.push(
      Object.fromEntries(
        headers.map((h, i) => [h, values[i]?.text ?? values[i] ?? ""]),
      ),
    );
  });
  if (!rows.length || rows.length > 500)
    return NextResponse.json(
      { error: "Upload 1 to 500 product rows" },
      { status: 422 },
    );
  const errors = [];
  const valid = [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const categorySlug = r.categorySlug?.toLowerCase();
    if (!categorySlug || !r.categoryName) {
      errors.push({
        row: i + 2,
        error: "categoryName and categorySlug are required",
      });
      continue;
    }
    const category = await db.category.upsert({
      where: { slug: categorySlug },
      update: { name: r.categoryName },
      create: { name: r.categoryName, slug: categorySlug },
    });
    const candidate = {
      name: r.name,
      slug: r.slug?.toLowerCase(),
      sku: r.sku,
      categoryId: category.id,
      shortDesc: r.shortDesc,
      description: r.description,
      price: Number(r.price),
      compareAtPrice: r.compareAtPrice ? Number(r.compareAtPrice) : null,
      stock: Number(r.stock),
      shippingFee: r.shippingFee === "" ? 100 : Number(r.shippingFee),
      images: [
        {
          url: r.imageUrl || "/textures/placeholder-product.svg",
          altText: r.name,
        },
      ],
      materials: r.materials || null,
      dimensions: r.dimensions || null,
      careInstructions: r.careInstructions || null,
      isFeatured: bool(r.isFeatured),
      isPromoted: bool(r.isPromoted),
      status: r.status || "ACTIVE",
    };
    const parsed = productSchema.safeParse(candidate);
    if (!parsed.success)
      errors.push({
        row: i + 2,
        error: Object.values(parsed.error.flatten().fieldErrors)
          .flat()
          .join("; "),
      });
    else valid.push(parsed.data);
  }
  if (errors.length)
    return NextResponse.json(
      { error: "Fix validation errors before importing", rows: errors },
      { status: 422 },
    );
  const results = await db.$transaction(
    valid.map(({ images, ...data }) =>
      db.product.upsert({
        where: { sku: data.sku },
        update: { ...data, images: { deleteMany: {}, create: images } },
        create: { ...data, images: { create: images } },
      }),
    ),
  );
  await db.auditLog.create({
    data: {
      actorId: admin.id,
      action: "BULK_IMPORT",
      entity: "Product",
      metadata: { count: results.length },
    },
  });
  return NextResponse.json({ imported: results.length });
}
