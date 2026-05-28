"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { depthTransform } from "@/lib/parallax";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { pointerStore } from "./pointer-store";

interface ParallaxProps {
  depth?: number;
  className?: string;
  children: ReactNode;
  as?: React.ElementType;
}

export function Parallax({ depth = 20, className, children, as: Tag = "div" }: ParallaxProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    pointerStore.start();
    const off = pointerStore.subscribe(({ nx, ny, scrollY }) => {
      const { x, y } = depthTransform(depth, nx, ny, scrollY);
      el.style.transform = `translate3d(${x}px,${y}px,0)`;
    });
    return () => { off(); };
  }, [depth, reduced]);

  // Cast through unknown to give Tag a ref-compatible signature.
  // Safe: every DOM string tag forwards a ref; consumer-supplied components
  // are expected to forward refs too (the Parallax contract).
  const El = Tag as unknown as React.ComponentType<
    React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
  >;

  return (
    <El ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </El>
  );
}
