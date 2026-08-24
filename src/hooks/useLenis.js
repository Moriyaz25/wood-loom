"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Mounts smooth scrolling site-wide and keeps GSAP ScrollTrigger in sync.
 * Respects prefers-reduced-motion by skipping smoothing entirely.
 */
export default function useLenis() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const usesTouch = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReduced || usesTouch) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    document.documentElement.classList.add("lenis");

    return () => {
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
    };
  }, []);
}
