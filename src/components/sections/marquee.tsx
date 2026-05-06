"use client";

import { motion } from "motion/react";

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

export function Marquee() {
  return (
    <section
      id="stack"
      className="overflow-hidden border-y border-border py-10"
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      >
        {[...stack, ...stack].map((s, i) => (
          <span
            key={i}
            className="display flex items-center gap-12 text-5xl text-muted/70 sm:text-7xl"
          >
            {s}
            <span className="inline-block h-3 w-3 rounded-full bg-accent" />
          </span>
        ))}
      </motion.div>
    </section>
  );
}
