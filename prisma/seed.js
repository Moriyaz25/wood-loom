require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const db = new PrismaClient();

async function main() {
  if (
    process.env.NODE_ENV === "production" &&
    !process.env.ADMIN_SEED_PASSWORD
  ) {
    throw new Error("ADMIN_SEED_PASSWORD is required in production");
  }
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_SEED_PASSWORD || "LocalDevOnly-ChangeMe-123!",
    12,
  );

  await db.user.upsert({
    where: {
      email: process.env.ADMIN_SEED_EMAIL || "admin@infinitycreations.in",
    },
    update: {},
    create: {
      name: "Admin",
      email: process.env.ADMIN_SEED_EMAIL || "admin@infinitycreations.in",
      passwordHash,
      role: "ADMIN",
      privacyAcceptedAt: new Date(),
    },
  });

  const category = await db.category.upsert({
    where: { slug: "home-decor" },
    update: {},
    create: {
      name: "Home Decor",
      slug: "home-decor",
      description: "Handcrafted wooden pieces for the home",
    },
  });

  const product = await db.product.upsert({
    where: { slug: "walnut-grain-bowl" },
    update: {},
    create: {
      name: "Walnut Grain Bowl",
      slug: "walnut-grain-bowl",
      shortDesc: "Hand-turned walnut bowl with natural edge",
      description:
        "Each bowl is turned from a single block of reclaimed walnut, sanded through eight grits and finished with food-safe oil. No two grain patterns repeat.",
      price: 2499,
      compareAtPrice: 2999,
      stock: 12,
      sku: "IC-BOWL-001",
      materials: "Reclaimed walnut, food-safe mineral oil finish",
      dimensions: "Dia 22cm x H 8cm",
      careInstructions: "Hand wash only. Re-oil every 3 months.",
      categoryId: category.id,
      isFeatured: true,
      isPromoted: true,
      images: {
        create: [
          {
            url: "/textures/placeholder-product.svg",
            altText: "Walnut Grain Bowl",
            position: 0,
          },
        ],
      },
    },
  });

  await db.banner.deleteMany({ where: { id: "seed-banner-diwali" } });
  await db.banner.upsert({
    where: { id: "seed-banner-home" },
    update: {
      title: "Handcrafted wooden living",
      subtitle: "Handcrafted wooden living for thoughtful homes",
      ctaLabel: "Explore the collection",
      festivalTag: "New collection",
    },
    create: {
      id: "seed-banner-home",
      title: "Handcrafted wooden living",
      subtitle: "Handcrafted wooden living for thoughtful homes",
      image: "/textures/placeholder-banner.svg",
      ctaLabel: "Explore the collection",
      ctaLink: "/products",
      festivalTag: "New collection",
      position: "HERO",
      priority: 10,
      active: true,
      productId: product.id,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
