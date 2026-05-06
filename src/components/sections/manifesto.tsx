"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-word]");
      gsap.fromTo(
        words,
        { opacity: 0.18 },
        {
          opacity: 1,
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
  }, []);

  const text =
    "I build software that ships. Trading interfaces moving $3T+ in assets by day; autonomous agents, arbitrage scanners, and plugin platforms by night. The seam between systems and craft is where the work gets interesting.";

  return (
    <section
      ref={root}
      id="about"
      className="border-t border-border px-6 py-32 sm:py-48"
    >
      <div className="mx-auto max-w-7xl">
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
