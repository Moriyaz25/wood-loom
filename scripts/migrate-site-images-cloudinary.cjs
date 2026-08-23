require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { PrismaClient } = require("@prisma/client");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
const db = new PrismaClient();
async function main() {
  const files = [
    ["hero-craft-v1", "public/images/hero-craft-v1.png"],
    ["walnut-chapati-box-v1", "public/images/walnut-chapati-box-v1.png"],
    ["carved-serving-tray-v1", "public/images/carved-serving-tray-v1.png"],
  ];
  const urls = {};
  for (const [id, path] of files) {
    const result = await cloudinary.uploader.upload(path, {
      folder: "infinity-creations/site",
      public_id: id,
      overwrite: true,
      resource_type: "image",
    });
    urls[id] = result.secure_url;
  }
  await db.banner.updateMany({
    where: { id: "seed-banner-diwali" },
    data: {
      festivalTag: "New collection",
      subtitle: "Handcrafted wooden living for thoughtful homes",
      ctaLabel: "Explore the collection",
      image: urls["hero-craft-v1"],
    },
  });
  for (const [id] of files)
    await db.productImage.updateMany({
      where: { url: `/images/${id}.png` },
      data: { url: urls[id] },
    });
  console.log(JSON.stringify(urls));
}
main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
