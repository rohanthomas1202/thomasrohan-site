"use client";
import { useEffect, type RefObject } from "react";
import { useMotionValue, useSpring } from "motion/react";
import { magneticOffset } from "@/lib/magnetic";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { SPRING } from "@/components/motion/springs";

export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.4) {
  const reduced = usePrefersReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING.magnetic);
  const y = useSpring(rawY, SPRING.magnetic);

  useEffect(() => {
    const el = ref.current;
    rawX.set(0);
    rawY.set(0);
    if (!el || reduced || window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e: PointerEvent) => {
      const o = magneticOffset(e.clientX, e.clientY, el.getBoundingClientRect(), strength);
      rawX.set(o.x);
      rawY.set(o.y);
    };
    const leave = () => {
      rawX.set(0);
      rawY.set(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [ref, strength, reduced, rawX, rawY]);

  return { x, y };
}
