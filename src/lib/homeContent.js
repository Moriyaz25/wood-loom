import { db } from "@/lib/db";

export const HOME_CONTENT_KEY = "homepage";

export const defaultHomeContent = {
  collection: {
    eyebrow: "Contemporary Indian Woodcraft",
    title: "Shop by collection",
    description:
      "Crafted by nature. Made for home. Wooden tableware, kitchenware and home objects for slow, lasting rituals.",
    image:
      "https://res.cloudinary.com/h13umivj/image/upload/v1787468919/woodloom/site/collection-collage-v1.png",
  },
  trust: [
    ["MADE BY HAND", "Crafted by skilled artisans"],
    ["SEASONED WOOD", "Selected for lasting quality"],
    ["SMALL BATCH", "No mass production"],
    ["ACROSS INDIA", "Packed and shipped with care"],
  ],
  topPicks: {
    title: "Top Picks",
    description: "Hand-turned pieces selected from the current workshop batch",
  },
  edit: {
    eyebrow: "The Woodloom Edit",
    title:
      "Pieces selected for slow mornings, warm gatherings and everyday rituals.",
    categories: [
      {
        href: "/products",
        title: "Morning Rituals",
        text: "Coffee · Tea · Breakfast",
        image: "/images/carved-serving-tray-v1.png",
      },
      {
        href: "/products",
        title: "Gather & Serve",
        text: "Trays · Bowls · Servingware",
        image: "/images/hero-craft-v1.png",
      },
      {
        href: "/products?category=home-decor",
        title: "Home & Storage",
        text: "Boxes · Organizers · Decor",
        image: "/images/walnut-chapati-box-v1.png",
      },
    ],
  },
  why: {
    eyebrow: "Why WOODLOOM",
    title: "Craft you can feel. Quality you can use.",
    blocks: [
      {
        n: "01",
        title: "Seasoned Wood",
        image: "/images/walnut-chapati-box-v1.png",
        text: "Built to age beautifully, with selected wood and restrained finishes made for daily use.",
      },
      {
        n: "02",
        title: "No Two Pieces Repeat",
        image: "/images/carved-serving-tray-v1.png",
        text: "Every grain tells its own story, so each object carries a quiet variation of tone, line and hand.",
        reverse: true,
      },
      {
        n: "03",
        title: "Made For Everyday",
        image: "/images/hero-craft-v1.png",
        text: "Beautiful enough to display. Practical enough to use for breakfast, hosting and everyday rituals.",
      },
    ],
  },
  story: {
    eyebrow: "Our story",
    title: "From Nagina,\nto your home.",
    text: "Every Woodloom piece begins with carefully selected wood and skilled hands in Nagina, India.",
    image: "/images/hero-craft-v1.png",
    ctaLabel: "Discover our story →",
    ctaLink: "/about",
  },
  process: {
    eyebrow: "Craft process",
    title: "From workshop to your home",
    steps: [
      ["01", "Select", "Material carefully selected"],
      ["02", "Shape", "Shaped by skilled hands"],
      ["03", "Finish", "Sanded, seasoned and finished"],
      ["04", "Pack", "Packed with care"],
    ],
  },
  gifting: {
    eyebrow: "Housewarmings · Weddings · Festive · Corporate",
    title: "A gift made to last.",
    text: "Thoughtful wooden pieces for weddings, housewarmings and celebrations.",
    image: "/images/walnut-chapati-box-v1.png",
  },
  reviews: {
    eyebrow: "Loved in real homes",
    title: "The grain is even more beautiful in person.",
    items: [
      ["Aditi", "New Delhi", "Beautiful finish and very thoughtful packing."],
      ["Rohan", "Mumbai", "It feels handmade in the best way, solid and warm."],
      ["Meera", "Bengaluru", "The tray has become part of our weekend table."],
    ],
  },
  ugc: {
    eyebrow: "Woodloom in your home",
    title: "Made for rituals, hosting and gifting.",
    handle: "@WOODLOOM",
    images: [
      "/images/carved-serving-tray-v1.png",
      "/images/hero-craft-v1.png",
      "/images/walnut-chapati-box-v1.png",
    ],
  },
};

function mergeContent(defaults, saved) {
  if (!saved || typeof saved !== "object" || Array.isArray(saved))
    return defaults;
  return Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => {
      if (!(key in saved)) return [key, value];
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        saved[key] &&
        typeof saved[key] === "object" &&
        !Array.isArray(saved[key])
      ) {
        return [key, { ...value, ...saved[key] }];
      }
      return [key, saved[key]];
    }),
  );
}

export async function getHomeContent() {
  try {
    const record = await db.siteContent.findUnique({
      where: { key: HOME_CONTENT_KEY },
    });
    return mergeContent(defaultHomeContent, record?.data);
  } catch (error) {
    console.error(
      "Homepage content is temporarily unavailable:",
      error instanceof Error ? error.message : error,
    );
    return defaultHomeContent;
  }
}
