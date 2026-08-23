import ExcelJS from "exceljs";
import { db } from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";
import { unauthorized } from "@/lib/security";
const HEADERS = [
  "name",
  "slug",
  "sku",
  "categoryName",
  "categorySlug",
  "shortDesc",
  "description",
  "price",
  "compareAtPrice",
  "stock",
  "shippingFee",
  "imageUrl",
  "materials",
  "dimensions",
  "careInstructions",
  "isFeatured",
  "isPromoted",
  "status",
];
export async function GET(request) {
  if (!(await getAdminFromRequest(request))) return unauthorized();
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });
  const wb = new ExcelJS.Workbook();
  wb.creator = "WOODLOOM";
  const ws = wb.addWorksheet("Products", {
    views: [{ state: "frozen", ySplit: 3 }],
  });
  ws.mergeCells("A1:R1");
  ws.getCell("A1").value = "WOODLOOM · Bulk Product Import";
  ws.getCell("A1").font = { bold: true, size: 18, color: { argb: "FFFFFFFF" } };
  ws.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF3A2A1E" },
  };
  ws.getRow(3).values = HEADERS;
  ws.getRow(3).font = { bold: true, color: { argb: "FFFFFFFF" } };
  ws.getRow(3).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFB5652D" },
  };
  ws.addRow([
    "Walnut Serving Bowl",
    "walnut-serving-bowl",
    "WL-BOWL-002",
    categories[0]?.name || "Home Decor",
    categories[0]?.slug || "home-decor",
    "Hand-turned walnut bowl",
    "Food-safe wooden serving bowl",
    2499,
    2999,
    12,
    100,
    "https://res.cloudinary.com/...",
    "Walnut",
    "22cm x 8cm",
    "Hand wash only",
    true,
    false,
    "ACTIVE",
  ]);
  ws.columns.forEach(
    (c, i) =>
      (c.width = [
        28, 28, 18, 22, 22, 32, 42, 14, 18, 12, 16, 42, 20, 20, 28, 14, 14, 14,
      ][i]),
  );
  ws.autoFilter = "A3:R3";
  const cs = wb.addWorksheet("Categories");
  cs.columns = [
    { header: "categoryName", key: "name", width: 30 },
    { header: "categorySlug", key: "slug", width: 30 },
  ];
  categories.forEach((c) => cs.addRow({ name: c.name, slug: c.slug }));
  cs.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  cs.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF3A2A1E" },
  };
  for (let row = 4; row <= 503; row++) {
    ws.getCell(`D${row}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: [`Categories!$A$2:$A$${Math.max(2, categories.length + 1)}`],
    };
    ws.getCell(`E${row}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: [`Categories!$B$2:$B$${Math.max(2, categories.length + 1)}`],
    };
    ws.getCell(`R${row}`).dataValidation = {
      type: "list",
      formulae: ['"ACTIVE,DRAFT,ARCHIVED"'],
    };
  }
  const buffer = await wb.xlsx.writeBuffer();
  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        "attachment; filename=woodloom-products-template.xlsx",
      "Cache-Control": "no-store",
    },
  });
}
