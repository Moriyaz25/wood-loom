# Infinity Creations — Full E-commerce Store

Handmade wooden crafts ke liye production-ready e-commerce. Next.js App Router + PostgreSQL (Prisma) + admin-controlled banner/ad system.

## 1. Setup (local)

```bash
# 1. Dependencies install karo
npm install

# 2. .env file banao
cp .env.example .env
# .env me apna DATABASE_URL daalo (local Postgres ya Supabase/Neon/Railway ka)
# JWT_SECRET me koi bhi lambi random string daal do

# 3. Database schema push karo
npm run db:push

# 4. Demo data (admin user + 1 category + 1 product + 1 banner) seed karo
npm run db:seed

# 5. Dev server chalao
npm run dev
```

Site khulega `http://localhost:3000` pe. Admin panel: `http://localhost:3000/admin/login`
(demo login: `.env` me diya `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD`, seed ke baad turant password change kar lena).

## 2. Folder structure — sab kuch ek hi repo me

```
src/
  app/
    api/              → saari backend APIs (Next.js route handlers = tumhara "Node.js backend")
      products/       → public product APIs
      banners/        → public banner APIs
      admin/          → protected admin APIs (products, banners, orders, login)
      orders/         → checkout/order creation
    (shop)/           → customer-facing shop pages (products, cart, checkout)
    admin/
      login/          → admin login (no sidebar)
      (dashboard)/    → dashboard, products, banners, orders (sidebar-protected)
  components/         → sab UI pieces, strictly folder-per-concern (layout/ui/product/cart/banners/admin)
  lib/                → db.js (Prisma client), auth.js (JWT via `jose`), validators.js (zod schemas)
  store/               → cartStore.js (zustand, persisted)
  hooks/               → useLenis.js (smooth scroll)
prisma/
  schema.prisma        → poora DB schema
  seed.js              → demo data
```

Koi bhi cheez mix nahi ki — components apne concern ke hisaab se separate hain, isliye future me kisi ek part ko badalna/enhance karna (jaise sirf cart UI redesign karna) baaki system ko touch nahi karega.

## 3. Design system — "Organic Neumorphism + Warm Glass"

Deliberately generic AI-look (cream + terracotta + rounded cards) se bachne ke liye:

- **Colors**: walnut (deep brown), sand (warm background), sienna (burnt-orange accent), sage (secondary accent), ivory (card surface)
- **Type**: Fraunces (display/serif, character wale headings), Work Sans (body), IBM Plex Mono (prices/SKU/data)
- **Signature element**: wood growth-ring motif (`WoodRingDivider` component) as section dividers — literal to the product, not decorative for decoration's sake
- **Cards**: notch-cut corners (`.card-notch`) instead of plain rounded corners — feels carved, not templated
- **Motion**: Lenis smooth scroll + GSAP ScrollTrigger stagger reveals on product grids; sirf hero me halka Three.js (rotating stylised bowl) — poori site 3D nahi ki, warna mobile pe heavy ho jaati

## 4. Admin-controlled banner/ad system (core feature)

`/admin/banners` se tum:
- Kisi bhi festival (Diwali, Holi, etc.) ke liye naya banner bana sakte ho — title, image, CTA, date range
- Kisi bhi product ko directly link kar sakte ho (banner click → us product ka page)
- Position choose kar sakte ho: `HERO` (homepage top), `STRIP`, `PRODUCT_PAGE`, `CATEGORY_TOP`
- `startDate`/`endDate` set karo to banner apne aap us window ke bahar disappear ho jayega — automatic hai, code change ki zaroorat nahi
- Product listing me kisi product ko "Promoted" toggle karo — vo tag automatically homepage/ads ke saath jud jata hai

## 5. Mobile "app-like" feel

- Bottom tab navigation (Home / Shop / Help / Cart) — hamburger menu ki jagah, jaisa native app me hota hai
- Header scroll pe shrink hota hai (sticky, smaller on scroll)
- Safe-area padding taaki iPhone/Android notch/gesture-bar overlap na ho

## 6. SEO

- `sitemap.js` aur `robots.js` automatic generate hote hain (`/sitemap.xml`, `/robots.txt`)
- Har product page pe JSON-LD structured data (Google rich results ke liye)
- Metadata (title/description) har page pe set hai

## 7. Abhi jo cheezein production ke liye add karni hongi (ye scope se bahar rakhi hain, deliberately)

- **Payment gateway** (Razorpay/Stripe) — abhi checkout order create karta hai lekin payment collect nahi karta; COD ya manual-payment-confirmation flow maan ke chala hai
- **Image upload** — abhi image URL manually daalni padti hai admin panel me; S3/Cloudinary/UploadThing integrate karna baad me easy hai (`ProductImage.url` field already text hai)
- **Categories admin UI** — abhi category Prisma Studio (`npx prisma studio`) se banani padegi; ek chhota admin/categories page baad me add kar sakte hain
- **Email notifications** (order confirmation, shipping updates) — Resend/SES jaisi service se wire karna hoga
- **Rate limiting / CAPTCHA** on checkout & contact form, taaki spam se bacha ja sake

## 8. Security note (important — please read)

Next.js 14.x reached end-of-life in late 2025. This project pins `next@14.2.35`,
the final patched release, which fixes the critical middleware auth-bypass bug
(CVE-2025-29927) — this matters here specifically because `src/middleware.js`
is what protects every `/admin` route. Since 14.x won't receive any more
security patches going forward, plan to migrate to Next.js 15 (stable, actively
patched) before this goes live for real customers/payments. The App Router
structure in this project carries over to 15 with minimal changes.

Bata dena in me se kaunsa pehle chahiye — payment integration ya image upload dono most-asked hote hain agla step ke roop me.
