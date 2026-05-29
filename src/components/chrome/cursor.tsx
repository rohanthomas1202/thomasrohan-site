"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const COARSE_QUERY = "(pointer: coarse)";

function subscribeCoarse(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(COARSE_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

// Read coarse-pointer capability without setState-in-effect; false on server.
function useIsCoarsePointer(): boolean {
  return useSyncExternalStore(
    subscribeCoarse,
    () => window.matchMedia(COARSE_QUERY).matches,
    () => false,
  );
}

export function Cursor() {
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  // Derived directly during render — false on server and first client paint when reduced/coarse.
  const active = !reduced && !coarse;
  const [big, setBig] = useState(false);

  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const mxRef = useRef(0);
  const myRef = useRef(0);
  const cxRef = useRef(0);
  const cyRef = useRef(0);
  const rafRef = useRef<number>(0);

  // Main effect: only runs when active === true
  useEffect(() => {
    if (!active) return;

    document.body.style.cursor = "none";

    function onMove(e: MouseEvent) {
      mxRef.current = e.clientX;
      myRef.current = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    }

    function onOver(e: PointerEvent) {
      if ((e.target as Element | null)?.closest?.("[data-hover]")) {
        setBig(true);
      }
    }

    function onOut(e: PointerEvent) {
      if ((e.target as Element | null)?.closest?.("[data-hover]")) {
        setBig(false);
      }
    }

    function loop() {
      cxRef.current += (mxRef.current - cxRef.current) * 0.18;
      cyRef.current += (myRef.current - cyRef.current) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${cxRef.current}px, ${cyRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("pointerover", onOver);
    window.addEventListener("pointerout", onOut);

    return () => {
      document.body.style.cursor = "";
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
    };
  }, [active]);

  // Render null on server or when not active
  if (!active) return null;

  return (
    <>
      {/* Ring — lerp-follows pointer */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed z-[9999] rounded-full mix-blend-difference"
        style={{
          width: big ? 64 : 30,
          height: big ? 64 : 30,
          border: "1.5px solid var(--accent)",
          background: big ? "rgba(197,255,0,0.15)" : "transparent",
          top: 0,
          left: 0,
          translate: "-50% -50%",
          transition:
            "width 0.2s var(--ease-expo), height 0.2s var(--ease-expo), background 0.2s var(--ease-expo)",
          willChange: "transform",
        }}
      />
      {/* Dot — tracks exactly */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed z-[9999] rounded-full mix-blend-difference"
        style={{
          width: 5,
          height: 5,
          background: "var(--accent)",
          top: 0,
          left: 0,
          translate: "-50% -50%",
          willChange: "transform",
        }}
      />
    </>
  );
}
