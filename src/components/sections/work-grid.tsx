"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { projects, featuredStack } from "@/content/projects";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function WorkGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const featuredCardRef = useRef<HTMLAnchorElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const reduced = usePrefersReducedMotion();

  // Featured card pointer tilt
  useEffect(() => {
    const card = featuredCardRef.current;
    if (!card) return;
    if (reduced) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);   // -1 to 1
      const dy = (e.clientY - cy) / (rect.height / 2);  // -1 to 1
      const rotateY = dx * 7;   // max 7deg
      const rotateX = -dy * 6;  // max 6deg
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      // scale the image inside for depth
      const img = card.querySelector("img");
      if (img) img.style.transform = "scale(1.04)";
    };

    const handlePointerLeave = () => {
      card.style.transform = "";
      const img = card.querySelector("img");
      if (img) img.style.transform = "";
    };

    card.addEventListener("pointermove", handlePointerMove);
    card.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      card.removeEventListener("pointermove", handlePointerMove);
      card.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [reduced]);

  // Grid assemble-on-scroll
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(grid.querySelectorAll("li"));
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0, rotateX: -8 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 80%",
          },
        },
      );
    }, grid);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="border-t border-border px-6 py-32 sm:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            02 / Selected Work
          </p>
          <h2 className="display mt-3 text-5xl sm:text-7xl">
            Selected
            <br />
            <span className="text-accent">work.</span>
          </h2>
        </div>

        {/* Featured */}
        <article className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              ★ Featured
            </p>
            <h3 className="display mt-4 text-5xl sm:text-6xl">TruthLayer</h3>
            <p className="mt-3 text-lg text-muted">
              Cross-market arbitrage scanner — Polymarket × Kalshi.
            </p>

            <div className="mt-10 space-y-6 text-sm leading-relaxed">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Problem
                </p>
                <p className="mt-2">
                  Polymarket and Kalshi list the same events but rarely price
                  them the same. The spread closes in minutes, and watching
                  hundreds of markets at once isn&apos;t a human job.
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Approach
                </p>
                <p className="mt-2">
                  A scanner that pairs contracts across both exchanges using
                  FAISS for cheap recall, then a Claude pass for semantic
                  confirmation. Spreads are fee-adjusted, ranked, and tracked
                  through to settlement.
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Result
                </p>
                <p className="mt-2">
                  Live, running 24/7. 481 opportunities detected; scoreboard
                  tracks post-fee, post-resolution P&amp;L — not paper gains.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {featuredStack.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="https://frontend-indol-five-84.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-105"
              >
                Live demo →
              </a>
              <a
                href="https://github.com/rohanthomas1202/truthlayer"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                GitHub
              </a>
            </div>
          </div>

          <a
            ref={featuredCardRef}
            href="https://frontend-indol-five-84.vercel.app"
            target="_blank"
            rel="noreferrer"
            data-hover
            className="group lg:col-span-7"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="relative aspect-[2/1] overflow-hidden rounded-xl border border-border bg-background">
              <Image
                src="/work/edgeterminal.png"
                alt="TruthLayer performance dashboard — 481 detected arbs, 53.3% win rate, calibration buckets, resolved P&L table"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/30 via-transparent to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5"
              />
            </div>
          </a>
        </article>

        {/* More work */}
        <div className="mt-32 mb-12 flex items-end justify-between">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            More work
          </p>
          <a
            href="https://github.com/rohanthomas1202"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            View all on GitHub →
          </a>
        </div>

        <ul
          ref={gridRef}
          style={{ perspective: "800px" }}
          className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((p, i) => (
            <li
              key={p.title}
              className={cn(
                "group relative aspect-[4/5] overflow-hidden bg-background transition-colors hover:bg-accent",
              )}
            >
              <a
                href={p.live ?? p.href}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 flex flex-col justify-between p-6"
              >
                <div className="flex justify-between font-mono text-xs uppercase tracking-widest">
                  <span className="text-muted group-hover:text-black/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-muted group-hover:text-black/70">
                    {p.tag}
                  </span>
                </div>
                <div>
                  <h3 className="display text-4xl transition-transform duration-500 ease-[cubic-bezier(0.2,0.9,0.1,1)] group-hover:-translate-y-1 group-hover:text-black sm:text-5xl">
                    {p.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-xs text-muted transition-colors group-hover:text-black/80">
                    {p.blurb}
                  </p>
                  <div className="mt-4 flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted group-hover:text-black/70">
                    <span>{p.stack}</span>
                    <span>{p.year}</span>
                  </div>
                </div>
              </a>
              <div
                aria-hidden
                className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-black transition-transform duration-500 group-hover:scale-x-100"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
