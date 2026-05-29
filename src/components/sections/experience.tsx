"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { roles } from "@/content/experience";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  // Per-role reveal on scroll
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("li[data-role]", section);
      items.forEach((li) => {
        gsap.fromTo(
          li,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: li,
              start: "top 85%",
            },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="border-t border-border px-6 py-32 sm:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            03 / Experience
          </p>
          <h2 className="display mt-3 text-5xl sm:text-7xl">
            Built at
            <br />
            <span className="text-accent">scale.</span>
          </h2>
        </div>

        <ol className="divide-y divide-border">
          {roles.map((r) => (
            <li
              key={r.company}
              data-role
              className="grid gap-8 py-12 lg:grid-cols-12"
            >
              <div className="lg:col-span-5">
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted">
                  <span>{r.period}</span>
                  {r.current && (
                    <span className="flex items-center gap-1.5 text-accent">
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                      Current
                    </span>
                  )}
                </div>
                <h3 className="display mt-4 text-4xl sm:text-5xl">
                  {r.company}
                </h3>
                <p className="mt-3 text-base text-muted">
                  {r.role} <span className="text-foreground/60">·</span>{" "}
                  {r.location}
                </p>
              </div>

              <ul className="space-y-4 text-sm leading-relaxed lg:col-span-7">
                {r.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="border-l border-border pl-5 text-foreground/85"
                  >
                    {h.text}
                    {h.metric && (
                      <>
                        {" "}
                        <span className="font-medium text-accent">
                          {h.metric}
                        </span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 font-mono text-xs uppercase tracking-widest text-muted">
          <span>UT Dallas — BS Computer Science, 2022</span>
          <span>
            <span className="text-foreground">3.6</span> cumulative ·{" "}
            <span className="text-foreground">4.0</span> major
          </span>
        </div>
      </div>
    </section>
  );
}
