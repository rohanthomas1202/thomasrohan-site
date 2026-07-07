"use client";
import { motion, useScroll } from "motion/react";

/* Direct scrollYProgress→scaleX binding (no spring): the bar is a scroll-positional
   progress indicator, not autonomous motion, so it stays under reduced motion. */
export function ReadingProgress({ color }: { color: string }) {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: scrollYProgress, backgroundColor: color }}
      className="reading-progress pointer-events-none fixed left-0 right-0 top-0 z-[60] h-1 origin-left"
    />
  );
}
