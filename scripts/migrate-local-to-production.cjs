require("dotenv/config");
const { PrismaClient } = require("@prisma/client");

const sourceUrl = process.env.SOURCE_DATABASE_URL;
const destinationUrl = process.env.DATABASE_URL;

if (!sourceUrl || !destinationUrl) {
  throw new Error("SOURCE_DATABASE_URL and DATABASE_URL are required");
}
if (sourceUrl === destinationUrl) {
  throw new Error("Source and destination databases must be different");
}

const source = new PrismaClient({ datasources: { db: { url: sourceUrl } } });
const destination = new PrismaClient({
  datasources: { db: { url: destinationUrl } },
});

const tables = [
  ["user", "User"],
  ["category", "Category"],
  ["product", "Product"],
  ["address", "Address"],
  ["productImage", "ProductImage"],
  ["review", "Review"],
  ["banner", "Banner"],
  ["order", "Order"],
  ["orderItem", "OrderItem"],
  ["auditLog", "AuditLog"],
  ["newsletterSubscriber", "NewsletterSubscriber"],
  ["contactMessage", "ContactMessage"],
  ["wishlistItem", "WishlistItem"],
];

async function main() {
  const destinationCounts = await Promise.all(
    tables.map(([model]) => destination[model].count()),
  );
  const destinationTotal = destinationCounts.reduce((sum, count) => sum + count, 0);
  if (destinationTotal > 0) {
    throw new Error(
      `Destination is not empty (${destinationTotal} records). Migration stopped to prevent overwriting production data.`,
    );
  }

  const records = [];
  for (const [model, table] of tables) {
    const rows = await source[model].findMany();
    records.push({ model, table, rows });
    console.log(`Source ${table}: ${rows.length}`);
  }

  await destination.$transaction(
    records
      .filter(({ rows }) => rows.length)
      .map(({ model, rows }) => destination[model].createMany({ data: rows })),
    { timeout: 120000 },
  );

  let mismatch = false;
  for (const { model, table, rows } of records) {
    const destinationCount = await destination[model].count();
    const matches = destinationCount === rows.length;
    console.log(
      `${table}: source=${rows.length}, destination=${destinationCount}, ${matches ? "OK" : "MISMATCH"}`,
    );
    if (!matches) mismatch = true;
  }
  if (mismatch) throw new Error("Migration row-count verification failed");
  console.log("Migration and row-count verification completed successfully.");
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await Promise.allSettled([source.$disconnect(), destination.$disconnect()]);
  });
