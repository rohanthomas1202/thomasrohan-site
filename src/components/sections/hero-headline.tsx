"use client";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { animate, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const COARSE_QUERY = "(pointer: coarse)";
function subscribeCoarse(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(COARSE_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function useCoarsePointer(): boolean {
  return useSyncExternalStore(
    subscribeCoarse,
    () => window.matchMedia(COARSE_QUERY).matches,
    () => false,
  );
}

export const HEADLINE = "I build AI products that survive production.";
const WORDS = HEADLINE.split(" ");
const HIGHLIGHTS = [
  "var(--blue-tint)",
  "var(--tangerine-tint)",
  "var(--pink-tint)",
  "var(--green-tint)",
  "var(--violet-tint)",
];
/* deterministic seeded tilt in [-3, 3], stable across renders */
const seedTilt = (i: number) => (((i * 7919) % 13) - 6) / 2;

export function HeroHeadline({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const [entered, setEntered] = useState(true); // SSR + revisits render at rest
  const [lit, setLit] = useState<number | null>(null);
  const [colors, setColors] = useState<Record<number, string>>({});
  const lastPick = useRef(-1);
  const words = useRef<(HTMLSpanElement | null)[]>([]);
  const busy = useRef<Set<number>>(new Set());
  const unlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    if (reduced || sessionStorage.getItem("hero-seen")) return;
    sessionStorage.setItem("hero-seen", "1");
    // Intentional: flip to hidden pre-paint (layout effect, runs before the browser paints)
    // so the rAF flip-back below is what the user actually sees animate — the standard
    // flash-free entrance pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntered(false);
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  const boop = useCallback(
    (i: number, amp: number) => {
      const el = words.current[i];
      if (!el || reduced || busy.current.has(i)) return;
      busy.current.add(i);
      animate(
        el,
        { y: -6 * amp, scaleY: 1 - 0.06 * amp, rotate: seedTilt(i) * amp },
        { duration: 0.11, ease: "easeOut" },
      )
        .then(() =>
          animate(
            el,
            { y: 0, scaleY: 1, rotate: 0 },
            { type: "spring", stiffness: 380, damping: 10, mass: 0.6 },
          ),
        )
        .finally(() => busy.current.delete(i));
    },
    [reduced],
  );

  const fire = useCallback(
    (i: number) => {
      const el = words.current[i];
      if (!el) return;
      let p: number;
      do {
        p = Math.floor(Math.random() * HIGHLIGHTS.length);
      } while (p === lastPick.current);
      lastPick.current = p;
      setColors((m) => ({ ...m, [i]: HIGHLIGHTS[p] }));
      setLit(i);
      boop(i, 1);
      [i - 1, i + 1].forEach((j) => {
        const n = words.current[j];
        if (n && n.offsetTop === el.offsetTop)
          setTimeout(() => boop(j, 0.3), 45);
      });
      if (coarse) {
        if (unlightTimer.current) clearTimeout(unlightTimer.current);
        unlightTimer.current = setTimeout(() => setLit(null), 1400);
      }
    },
    [boop, coarse],
  );

  return (
    <h1
      aria-label={HEADLINE}
      className={cn(
        "isolate mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl",
        className,
      )}
    >
      <span aria-hidden="true">
        {WORDS.map((w, i) => (
          <span key={i}>
            {i > 0 ? " " : ""}
            <motion.span
              className="inline-block"
              animate={entered ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 25,
                delay: entered ? i * 0.03 : 0,
              }}
            >
              <span
                ref={(el) => {
                  words.current[i] = el;
                }}
                onPointerEnter={coarse ? undefined : () => fire(i)}
                onPointerLeave={coarse ? undefined : () => setLit(null)}
                onClick={coarse ? () => fire(i) : undefined}
                className="relative inline-block cursor-default px-[0.04em]"
              >
                <motion.span
                  aria-hidden
                  className="absolute inset-y-[0.05em] -inset-x-[0.08em] -z-10 rounded-[0.2em]"
                  style={{
                    background: colors[i] ?? HIGHLIGHTS[0],
                    transformOrigin: lit === i ? "left" : "right",
                  }}
                  initial={false}
                  animate={
                    reduced
                      ? { opacity: lit === i ? 1 : 0, scaleX: 1 }
                      : { scaleX: lit === i ? 1 : 0, opacity: 1 }
                  }
                  transition={
                    reduced
                      ? { duration: 0.15 }
                      : { type: "spring", stiffness: 300, damping: 24 }
                  }
                />
                {w}
              </span>
            </motion.span>
          </span>
        ))}
      </span>
    </h1>
  );
}
