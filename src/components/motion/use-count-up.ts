"use client";
import { useEffect, useRef, useState } from "react";
export function useCountUp(target: number, active: boolean, ms = 1200) {
  const [v, setV] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, active, ms]);
  return v;
}
