"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider() {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const onTick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, [reduced]);
  return null;
}
