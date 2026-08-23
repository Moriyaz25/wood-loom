require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();
async function main() {
  const old = await db.banner.findUnique({
    where: { id: "seed-banner-diwali" },
  });
  if (old) {
    await db.banner.upsert({
      where: { id: "seed-banner-home" },
      update: {
        festivalTag: "New collection",
        title: "Handcrafted wooden living",
        subtitle: "Handcrafted wooden living for thoughtful homes",
        ctaLabel: "Explore the collection",
      },
      create: {
        ...old,
        id: "seed-banner-home",
        createdAt: undefined,
        festivalTag: "New collection",
        title: "Handcrafted wooden living",
        subtitle: "Handcrafted wooden living for thoughtful homes",
        ctaLabel: "Explore the collection",
      },
    });
    await db.banner.delete({ where: { id: "seed-banner-diwali" } });
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
