"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cursorAccent } from "@/lib/cursor";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { SPRING } from "@/components/motion/springs";

export function CursorDot() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  const [accent, setAccent] = useState("var(--ink)");
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, SPRING.cursor);
  const y = useSpring(rawY, SPRING.cursor);
  const scale = useSpring(1, SPRING.cursor);
  const opacity = useMotionValue(0);

  useEffect(() => {
    const fine =
      window.matchMedia("(pointer: fine)").matches &&
      window.matchMedia("(hover: hover)").matches;
    const on = fine && !reduced;
    setActive(on);
    if (!on) return;
    const root = document.documentElement;
    root.classList.add("cursor-none");
    const move = (e: PointerEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      opacity.set(1);
      root.classList.add("cursor-none");
    };
    const over = (e: PointerEvent) => {
      const target = (e.target as Element).closest?.("a, button");
      if (!target) return;
      scale.set(2.2);
      setAccent(cursorAccent(target));
    };
    const out = (e: PointerEvent) => {
      const target = (e.target as Element).closest?.("a, button");
      if (!target || target.contains(e.relatedTarget as Node)) return;
      scale.set(1);
      setAccent("var(--ink)");
    };
    const leave = () => {
      opacity.set(0);
      root.classList.remove("cursor-none");
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerout", out);
    root.addEventListener("pointerleave", leave);
    return () => {
      root.classList.remove("cursor-none");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerout", out);
      root.removeEventListener("pointerleave", leave);
    };
  }, [reduced, rawX, rawY, scale, opacity]);

  if (!active) return null;
  return (
    <motion.div
      aria-hidden
      style={{ x, y, scale, opacity, borderColor: accent }}
      className="pointer-events-none fixed -left-1.5 -top-1.5 z-[100] size-3 rounded-full border-2 border-ink mix-blend-normal"
    />
  );
}
