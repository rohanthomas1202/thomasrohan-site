"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Parallax } from "@/components/motion/parallax";
import { useMagnetic } from "@/components/motion/use-magnetic";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const HeroFx = dynamic(() => import("./hero-fx"), { ssr: false });

const HEADLINE_LINES = [
  { key: "l1", node: <>Trading screens</>, delay: "0s" },
  {
    key: "l2",
    node: (
      <>
        at <span className="text-accent">$3T</span> scale.
      </>
    ),
    delay: "0.08s",
  },
  { key: "l3", node: <>Prediction markets</>, delay: "0.16s" },
  { key: "l4", node: <>after hours.</>, delay: "0.24s" },
];

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(false);

  const primaryRef = useRef<HTMLAnchorElement>(null);
  const secondaryRef = useRef<HTMLAnchorElement>(null);
  useMagnetic(primaryRef);
  useMagnetic(secondaryRef);

  useEffect(() => {
    // Reading client-only state (reduced-motion / body class set by the intro) on mount
    // is a valid effect use here; the curtain may have already finished before we mount.
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealed(true);
      return;
    }
    if (document.body.classList.contains("revealed")) {
      setRevealed(true);
      return;
    }
    const onDone = () => setRevealed(true);
    window.addEventListener("intro:done", onDone);
    return () => window.removeEventListener("intro:done", onDone);
  }, [reduced]);

  return (
    <section
      id="top"
      className="relative isolate flex min-h-screen flex-col justify-end overflow-hidden px-6 pb-20 pt-32 sm:pb-28"
    >
      {/* Radial lime glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 100%, rgba(197,255,0,0.18), transparent 60%), radial-gradient(60% 60% at 80% 20%, rgba(197,255,0,0.08), transparent 70%)",
        }}
      />

      {/* Faint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Receding perspective grid floor — the cinematic-depth signature */}
      <Parallax
        depth={10}
        as="div"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55vh]"
      >
        <div
          aria-hidden
          className="absolute inset-x-[-50%] bottom-0 h-full opacity-60"
          style={{
            transform: "rotateX(74deg)",
            transformOrigin: "center bottom",
            backgroundImage:
              "linear-gradient(to right, rgba(197,255,0,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(197,255,0,0.35) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "linear-gradient(to top, #000 8%, transparent 72%)",
            WebkitMaskImage: "linear-gradient(to top, #000 8%, transparent 72%)",
          }}
        />
      </Parallax>

      {/* Particle accent canvas */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <HeroFx />
      </div>

      {/* Avatar — right side, vertically centered, dimmed/shifted on small screens */}
      <Parallax
        depth={34}
        as="div"
        className="pointer-events-none absolute right-[-12%] top-1/2 -z-10 -translate-y-1/2 opacity-20 min-[820px]:right-[2%] min-[820px]:opacity-100"
      >
        <div className="relative">
          <div
            className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(197,255,0,0.22), transparent 75%)",
            }}
          />
          <Image
            src="/rohan-avatar.png"
            priority
            width={520}
            height={520}
            alt="Illustrated portrait of Rohan Thomas"
            className="relative h-auto w-[clamp(280px,32vw,520px)]"
          />
        </div>
      </Parallax>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1300px]">
        {/* Eyebrow */}
        <Parallax depth={6} as="div">
          <div
            className="mb-10 flex items-center gap-3 transition-opacity duration-700"
            style={{ opacity: revealed ? 1 : 0 }}
          >
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              Austin, TX — open to new work
            </span>
          </div>
        </Parallax>

        {/* Headline */}
        <h1 className="display text-[14vw] sm:text-[12vw] lg:text-[7.5rem]">
          {HEADLINE_LINES.map((line) => (
            <span key={line.key} className="block overflow-hidden">
              <span
                className="block transition-transform duration-[1s] ease-[cubic-bezier(.16,1,.3,1)]"
                style={{
                  transform: revealed ? "translateY(0)" : "translateY(110%)",
                  transitionDelay: line.delay,
                }}
              >
                {line.node}
              </span>
            </span>
          ))}
        </h1>

        {/* Sub row */}
        <div
          className="mt-12 grid gap-8 border-t border-border pt-8 transition-all duration-700 sm:grid-cols-3"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(16px)",
            transitionDelay: reduced ? "0s" : "0.6s",
          }}
        >
          <p className="text-sm text-muted sm:col-span-2 sm:max-w-xl">
            Rohan Thomas — full-stack engineer at Charles Schwab. Portfolio
            tooling by day; AI agents, prediction-market scanners &amp; product
            UIs that move by night.
          </p>
          <div className="flex flex-wrap items-start gap-4 sm:justify-self-end">
            <a
              ref={primaryRef}
              href="#work"
              data-hover
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-colors"
            >
              View work
              <span aria-hidden>→</span>
            </a>
            <a
              ref={secondaryRef}
              href="#contact"
              data-hover
              className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-accent"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-700"
        style={{
          opacity: revealed ? 1 : 0,
          transitionDelay: reduced ? "0s" : "0.9s",
        }}
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Scroll
        </span>
        <span className="block h-10 w-px bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  );
}
