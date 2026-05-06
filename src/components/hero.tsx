"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-line]", {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.08,
        delay: 0.2,
      });
      gsap.from("[data-hero-meta]", {
        opacity: 0,
        y: 16,
        duration: 0.8,
        ease: "power2.out",
        delay: 1.0,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate flex min-h-screen flex-col justify-end overflow-hidden px-6 pb-20 pt-32 sm:pb-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 100%, rgba(197,255,0,0.18), transparent 60%), radial-gradient(60% 60% at 80% 20%, rgba(197,255,0,0.08), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="mx-auto w-full max-w-7xl">
        <div
          data-hero-meta
          className="mb-10 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted"
        >
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
          Austin, TX — open to new work
        </div>

        <h1 className="display text-[14vw] sm:text-[12vw] lg:text-[11rem]">
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              Full-stack
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              <span className="text-accent">engineer.</span>
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              Agents & UIs.
            </span>
          </span>
        </h1>

        <div
          data-hero-meta
          className="mt-12 grid gap-8 border-t border-border pt-8 sm:grid-cols-3"
        >
          <p className="text-sm text-muted sm:col-span-2 sm:max-w-xl">
            Rohan Thomas — full-stack engineer at Charles Schwab, shipping
            Angular &amp; Spring Boot tooling for portfolio managers. After
            hours: AI agents, prediction-market scanners, and product UIs that
            move.
          </p>
          <a
            href="#work"
            className="group inline-flex items-center gap-2 self-start text-sm font-semibold sm:justify-self-end"
          >
            Scroll
            <span className="inline-block h-px w-12 bg-foreground transition-all group-hover:w-20 group-hover:bg-accent" />
          </a>
        </div>
      </div>
    </section>
  );
}
