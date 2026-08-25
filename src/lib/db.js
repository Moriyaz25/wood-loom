import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// Keep local development on DATABASE_URL, but allow deployments to use a
// separately configured hosted database URL. This also avoids accidentally
// connecting a Vercel function to localhost when both values are present.
const databaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_DATABASE_URL
    : process.env.DATABASE_URL;

if (process.env.NODE_ENV === "production" && !databaseUrl) {
  throw new Error(
    "PRODUCTION_DATABASE_URL is required in production and must point to the hosted PostgreSQL database.",
  );
}

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: { db: { url: databaseUrl } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
