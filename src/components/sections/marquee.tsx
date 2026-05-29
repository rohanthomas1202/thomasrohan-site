"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const stack = [
  "TypeScript",
  "Java",
  "Python",
  "React",
  "Next.js",
  "Angular",
  "Spring Boot",
  "FastAPI",
  "Tailwind",
  "shadcn/ui",
  "Mantine",
  "Zustand",
  "Prisma",
  "MongoDB",
  "MySQL",
  "Vercel",
  "LangGraph",
  "Claude",
];

// Offset the second row so the two rows show different items in alignment.
const stackB = [...stack.slice(9), ...stack.slice(0, 9)];

function Row({
  items,
  from,
  to,
  duration,
  reduced,
}: {
  items: string[];
  from: string;
  to: string;
  duration: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      className="flex gap-12 whitespace-nowrap"
      animate={reduced ? undefined : { x: [from, to] }}
      transition={
        reduced ? undefined : { duration, repeat: Infinity, ease: "linear" }
      }
    >
      {[...items, ...items].map((s, i) => (
        <span
          key={i}
          className="display flex items-center gap-12 text-5xl text-muted/70 sm:text-7xl"
        >
          {s}
          <span className="inline-block h-3 w-3 rounded-full bg-accent" />
        </span>
      ))}
    </motion.div>
  );
}

const edgeMask =
  "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)";

export function Marquee() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="stack"
      className="overflow-hidden border-y border-border py-10"
      style={{
        maskImage: edgeMask,
        WebkitMaskImage: edgeMask,
      }}
    >
      <div className="flex flex-col gap-6">
        <Row
          items={stack}
          from="0%"
          to="-50%"
          duration={32}
          reduced={reduced}
        />
        <Row
          items={stackB}
          from="-50%"
          to="0%"
          duration={40}
          reduced={reduced}
        />
      </div>
    </section>
  );
}
