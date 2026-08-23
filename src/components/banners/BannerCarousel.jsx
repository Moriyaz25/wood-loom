"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
const IMG = {
  box: "https://res.cloudinary.com/h13umivj/image/upload/v1787465294/infinity-creations/site/walnut-chapati-box-v1.png",
  tray: "https://res.cloudinary.com/h13umivj/image/upload/v1787465312/infinity-creations/site/carved-serving-tray-v1.png",
  life: "https://res.cloudinary.com/h13umivj/image/upload/v1787465282/infinity-creations/site/hero-craft-v1.png",
};
export default function BannerCarousel() {
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const x = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), {
    stiffness: 90,
    damping: 20,
  });
  const y = useSpring(useTransform(my, [-0.5, 0.5], [-5, 5]), {
    stiffness: 90,
    damping: 20,
  });
  function move(e) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  return (
    <section
      onMouseMove={move}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative overflow-hidden bg-[#f7f1e8] px-6 py-9 sm:px-9 md:min-h-[510px] md:px-12 md:py-10 lg:px-14"
    >
      <div className="grid items-center gap-12 md:grid-cols-[45%_55%] md:gap-5">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <p className="font-body text-[10px] font-semibold uppercase tracking-[.3em] text-sienna">
            New collection
          </p>
          <h1 className="mt-5 max-w-[650px] font-display text-[clamp(3.1rem,5.2vw,5.5rem)] uppercase leading-[.97] tracking-[-.025em] text-[#281b14]">
            Crafted from wood.
            <br />
            Made for home.
          </h1>
          <span className="mt-7 block h-px w-11 bg-sienna" />
          <p className="mt-6 max-w-sm font-body text-base leading-7 text-walnut/65">
            Handcrafted tableware &amp; homeware, made by Indian artisans.
          </p>
          <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
            <Link
              href="/products"
              className="group rounded-sm bg-walnut px-5 py-4 text-center font-body text-[11px] font-semibold uppercase tracking-[.15em] text-white transition duration-200 hover:-translate-y-0.5 hover:bg-sienna"
            >
              Explore collection
            </Link>
            <Link
              href="/about"
              className="rounded-sm border border-walnut/35 px-5 py-4 text-center font-body text-[11px] font-semibold uppercase tracking-[.15em] text-walnut transition duration-200 hover:-translate-y-0.5 hover:border-walnut hover:bg-white/60"
            >
              Our story
            </Link>
          </div>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-walnut/15 px-4 py-2 font-body text-[9px] font-semibold uppercase tracking-[.15em] text-walnut/65">
            <Pin /> Crafted in Nagina, India
          </div>
        </motion.div>
        <motion.div
          style={{ x, y }}
          initial={{ opacity: 0, scale: 0.975 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[400px] sm:h-[440px] md:h-[430px]"
        >
          <Photo
            src={IMG.box}
            alt="Handcrafted walnut storage box"
            className="left-0 top-0 h-[70%] w-[62%]"
            priority
          />
          <Photo
            src={IMG.tray}
            alt="Carved walnut serving tray"
            className="right-0 top-0 h-[38%] w-[36%]"
          />
          <Photo
            src={IMG.life}
            alt="Wooden bowl on a carved tray"
            className="bottom-0 right-[8%] z-10 h-[48%] w-[48%] border-[7px] border-[#f7f1e8]"
          />
        </motion.div>
      </div>
      <a
        href="#collections"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-body text-[9px] uppercase tracking-[.25em] text-walnut/45 lg:flex"
      >
        Scroll to explore <span className="animate-bounce text-base">↓</span>
      </a>
    </section>
  );
}
function Photo({ src, alt, className, priority }) {
  return (
    <div
      className={`group absolute overflow-hidden rounded-xl bg-[#e8ded0] shadow-[0_12px_35px_rgba(58,42,30,.10)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover transition duration-700 group-hover:scale-[1.02]"
        sizes="(max-width:768px) 70vw,35vw"
      />
    </div>
  );
}
function Pin() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
    >
      <path d="M13 6.5c0 3.5-5 7-5 7s-5-3.5-5-7a5 5 0 0 1 10 0Z" />
      <circle cx="8" cy="6.5" r="1.6" />
    </svg>
  );
}
