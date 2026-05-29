"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { shouldPlayIntro, markIntroPlayed } from "@/lib/intro";

function dispatchDone() {
  document.body.classList.add("revealed");
  window.dispatchEvent(new CustomEvent("intro:done"));
}

export function Intro() {
  const reduced = usePrefersReducedMotion();
  // null = not yet resolved (server render)
  const [play, setPlay] = useState<boolean | null>(null);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false); // fully unmount after transition
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Decide on mount whether to play
  useEffect(() => {
    const shouldPlay = shouldPlayIntro(sessionStorage, reduced);
    // Reading client-only state (sessionStorage) on mount is a valid effect use here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlay(shouldPlay);
    if (!shouldPlay) {
      dispatchDone();
    }
  }, [reduced]);

  // Counter loop — only when play === true
  useEffect(() => {
    if (!play) return;

    let n = 0;
    const id = setInterval(() => {
      const step = Math.ceil((100 - n) / 6) + 1;
      n = Math.min(n + step, 100);
      setCount(n);
      if (n >= 100) {
        clearInterval(id);
        // After ~420ms delay, animate curtain up
        timerRef.current = setTimeout(() => {
          markIntroPlayed(sessionStorage);
          setDone(true);
          dispatchDone();
          // Unmount after transition completes (1s + buffer)
          timerRef.current = setTimeout(() => setGone(true), 1200);
        }, 420);
      }
    }, 34);

    return () => {
      clearInterval(id);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [play]);

  // Not yet decided (server render) or not playing or fully gone → no curtain
  if (play === null || !play || gone) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9000] bg-background flex items-end justify-between p-12${done ? " pointer-events-none" : ""}`}
      style={{
        transform: done ? "translateY(-101%)" : "translateY(0)",
        transition: done ? "transform 1s var(--ease-curtain)" : "none",
        willChange: "transform",
      }}
    >
      {/* Monogram */}
      <span
        className="display select-none leading-none text-foreground"
        style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontWeight: 300,
          fontSize: "clamp(80px, 18vw, 260px)",
        }}
      >
        RT
      </span>

      {/* Counter label */}
      <span
        className="font-mono text-muted self-end pb-1 text-sm tracking-widest"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        Rohan Thomas / loading {String(count).padStart(2, "0")} → 100
      </span>
    </div>
  );
}
