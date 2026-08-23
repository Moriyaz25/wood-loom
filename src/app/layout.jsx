import { Fraunces, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import CartDrawer from "@/components/cart/CartDrawer";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import WhatsAppWidget from "@/components/contact/WhatsAppWidget";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-worksans",
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plexmono",
  weight: ["400", "500"],
});

export const metadata = {
  title: "WOODLOOM | Crafted by Nature, Designed for Life",
  description:
    "Hand-turned and hand-carved wooden home decor, made in small batches. Every grain pattern is one of a kind.",
  icons: {
    icon: [
      {
        url: "/images/woodloom-logo-v1.png",
        type: "image/png",
      },
    ],
    shortcut: "/images/woodloom-logo-v1.png",
    apple: "/images/woodloom-logo-v1.png",
  },
  keywords: [
    "handmade wooden crafts",
    "wooden home decor India",
    "hand carved wood products",
    "walnut bowls",
    "artisan wood gifts",
  ],
};

export const viewport = {
  themeColor: "#3A2A1E",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${workSans.variable} ${plexMono.variable}`}
    >
      <body className="font-body">
        <SmoothScrollProvider>
          <Header />
          <main className="min-h-[60vh] pb-24 md:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
          <CartDrawer />
          <WhatsAppWidget />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
