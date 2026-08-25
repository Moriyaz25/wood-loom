import { z } from "zod";

const clean = (min, max) => z.string().trim().min(min).max(max);
const optionalText = (max) => z.string().trim().max(max).optional().nullable();
const slug = z
  .string()
  .trim()
  .min(2)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const imageUrl = z
  .string()
  .max(1000)
  .refine(
    (v) => v.startsWith("/") || /^https:\/\/[a-z0-9.-]+(?:\/|$)/i.test(v),
    "Use a local path or HTTPS image URL",
  );

export const passwordSchema = z
  .string()
  .min(10)
  .max(128)
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[0-9]/, "Add a number");
export const registerSchema = z
  .object({
    name: clean(2, 80),
    email: z
      .string()
      .trim()
      .email()
      .max(254)
      .transform((v) => v.toLowerCase()),
    password: passwordSchema,
    privacyAccepted: z.literal(true),
    marketingConsent: z.boolean().optional().default(false),
  })
  .strict();
export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email()
      .max(254)
      .transform((v) => v.toLowerCase()),
    password: z.string().min(1).max(128),
  })
  .strict();

const productBaseSchema = z
  .object({
    name: clean(2, 160),
    slug,
    shortDesc: clean(2, 240),
    description: clean(2, 5000),
    price: z.number().int().positive().max(100000000),
    compareAtPrice: z
      .number()
      .int()
      .positive()
      .max(100000000)
      .optional()
      .nullable(),
    stock: z.number().int().min(0).max(1000000),
    shippingFee: z.number().int().min(0).max(100000),
    sku: clean(2, 80),
    materials: optionalText(500),
    dimensions: optionalText(300),
    careInstructions: optionalText(1000),
    categoryId: z.string().cuid(),
    isFeatured: z.boolean().optional(),
    isPromoted: z.boolean().optional(),
    status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
    images: z
      .array(z.object({ url: imageUrl, altText: optionalText(200) }).strict())
      .min(1)
      .max(12),
  })
  .strict();
export const productSchema = productBaseSchema.refine(
  (v) => !v.compareAtPrice || v.compareAtPrice > v.price,
  { message: "Compare-at price must exceed price", path: ["compareAtPrice"] },
);

export const productPatchSchema = productBaseSchema
  .omit({ images: true })
  .partial()
  .strict();
export const categorySchema = z
  .object({
    name: clean(2, 80),
    slug,
    description: optionalText(500),
    image: imageUrl.optional().nullable(),
  })
  .strict();

const bannerBaseSchema = z
  .object({
    title: clean(2, 120),
    subtitle: optionalText(240),
    image: imageUrl,
    ctaLabel: optionalText(60),
    ctaLink: z
      .string()
      .max(300)
      .regex(/^\/(?!\/)/, "CTA must be an internal path")
      .optional()
      .nullable(),
    festivalTag: optionalText(60),
    position: z.enum(["HERO", "STRIP", "PRODUCT_PAGE", "CATEGORY_TOP"]),
    priority: z.number().int().min(-1000).max(1000).optional(),
    active: z.boolean().optional(),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime().optional().nullable(),
    productId: z.string().cuid().optional().nullable(),
  })
  .strict();
export const bannerSchema = bannerBaseSchema.refine(
  (v) =>
    !v.startDate || !v.endDate || new Date(v.endDate) >= new Date(v.startDate),
  { message: "End date must be after start date", path: ["endDate"] },
);
export const bannerPatchSchema = bannerBaseSchema.partial().strict();

const checkoutBaseSchema = z
  .object({
    idempotencyKey: z.string().uuid(),
    customerName: clean(2, 80),
    phone: z
      .string()
      .trim()
      .regex(/^[6-9][0-9]{9}$/, "Enter a valid 10-digit Indian mobile number"),
    addressLine1: clean(4, 200),
    addressLine2: optionalText(200),
    city: clean(2, 80),
    state: clean(2, 80),
    pincode: z
      .string()
      .trim()
      .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit PIN code"),
    notes: optionalText(500),
    paymentMethod: z.enum(["UPI", "CARD"]),
    paymentReference: optionalText(80),
    saveAddress: z.boolean().optional().default(false),
    items: z
      .array(
        z
          .object({
            productId: z.string().cuid(),
            quantity: z.number().int().min(1).max(20),
          })
          .strict(),
      )
      .min(1)
      .max(50),
  })
  .strict();

export const checkoutSchema = checkoutBaseSchema
  .superRefine((value, context) => {
    if (value.paymentMethod === "UPI" && !value.paymentReference?.trim()) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["paymentReference"], message: "Enter the UPI transaction/reference number" });
    }
  });

export const profileSchema = z
  .object({
    name: clean(2, 80),
    phone: z
      .string()
      .trim()
      .regex(/^[6-9][0-9]{9}$/, "Enter a valid 10-digit Indian mobile number")
      .optional()
      .nullable(),
    marketingConsent: z.boolean(),
  })
  .strict();
export const addressSchema = checkoutBaseSchema
  .pick({
    customerName: true,
    phone: true,
    addressLine1: true,
    addressLine2: true,
    city: true,
    state: true,
    pincode: true,
  })
  .extend({
    label: clean(1, 40),
    isDefault: z.boolean().optional().default(false),
  })
  .strict();
