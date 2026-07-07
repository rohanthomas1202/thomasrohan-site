"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cursorAccent } from "@/lib/cursor";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { SPRING } from "@/components/motion/springs";

/* Hybrid devices match `pointer: fine` on the primary pointer alone, so this
   gate admits touchscreen laptops — the mouse-only check lives per-event. */
const QUERIES = ["(pointer: fine)", "(hover: hover)"];
function subscribeFinePointer(onChange: () => void) {
  const lists = QUERIES.map((q) => window.matchMedia(q));
  lists.forEach((l) => l.addEventListener("change", onChange));
  return () => lists.forEach((l) => l.removeEventListener("change", onChange));
}
const finePointerSnapshot = () => QUERIES.every((q) => window.matchMedia(q).matches);

export function CursorDot() {
  const reduced = usePrefersReducedMotion();
  const finePointer = useSyncExternalStore(subscribeFinePointer, finePointerSnapshot, () => false);
  const active = finePointer && !reduced;
  const [accent, setAccent] = useState("var(--ink)");
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, SPRING.cursor);
  const y = useSpring(rawY, SPRING.cursor);
  const scale = useSpring(1, SPRING.cursor);
  const opacity = useMotionValue(0);

  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const isMouse = (e: PointerEvent) => e.pointerType === "mouse";
    /* `cursor-none` is only added once a pointermove proves a live pointer;
       hiding the native cursor while the dot is still invisible would leave
       a stationary mouse user with no cursor at all. */
    const move = (e: PointerEvent) => {
      if (!isMouse(e)) return;
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      opacity.set(1);
      root.classList.add("cursor-none");
    };
    const over = (e: PointerEvent) => {
      if (!isMouse(e)) return;
      const target = (e.target as Element).closest?.("a, button");
      /* Reset on non-interactive content too: client-side navigation unmounts
         a hovered link without a qualifying pointerout, which would otherwise
         strand the dot enlarged with a stale accent. */
      if (!target) {
        scale.set(1);
        setAccent("var(--ink)");
        return;
      }
      scale.set(2.2);
      setAccent(cursorAccent(target));
    };
    const out = (e: PointerEvent) => {
      if (!isMouse(e)) return;
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
  }, [active, rawX, rawY, scale, opacity]);

  if (!active) return null;
  return (
    <motion.div
      aria-hidden
      style={{ x, y, scale, opacity, borderColor: accent }}
      className="pointer-events-none fixed -left-1.5 -top-1.5 z-[100] size-3 rounded-full border-2 border-ink mix-blend-normal"
    />
  );
}
