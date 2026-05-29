"use client";
import { useEffect, type RefObject } from "react";
import { magneticOffset } from "@/lib/magnetic";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.4) {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const el = ref.current;
    // Clear any stale offset (e.g. if reduced-motion/coarse becomes true at runtime).
    if (el) el.style.transform = "";
    if (!el || reduced || window.matchMedia("(pointer: coarse)").matches) return;
    el.style.transition = "transform 0.25s var(--ease-expo)";
    const move = (e: PointerEvent) => {
      const { x, y } = magneticOffset(e.clientX, e.clientY, el.getBoundingClientRect(), strength);
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const leave = () => (el.style.transform = "");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [ref, strength, reduced]);
}
