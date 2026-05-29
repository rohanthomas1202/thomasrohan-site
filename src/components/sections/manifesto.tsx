"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-word]");
      gsap.fromTo(
        words,
        { opacity: 0.18, yPercent: 18 },
        {
          opacity: 1,
          yPercent: 0,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            end: "bottom 40%",
            scrub: true,
          },
        },
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const text =
    "I build software that ships. Trading interfaces moving $3T+ in assets by day; autonomous agents, arbitrage scanners, and plugin platforms by night. The seam between systems and craft is where the work gets interesting.";

  return (
    <section
      ref={root}
      id="about"
      className="relative border-t border-border px-6 py-32 sm:py-48"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 45%, rgba(197,255,0,0.04), transparent 70%), linear-gradient(var(--background), transparent 30%, transparent 70%, var(--background))",
        }}
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-muted">
          <span>01 / Manifesto</span>
          <span>What I believe</span>
        </div>
        <p className="display max-w-5xl text-3xl leading-[1.1] sm:text-5xl lg:text-6xl">
          {text.split(" ").map((w, i) => (
            <span key={i} data-word className="inline-block">
              {w}&nbsp;
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
