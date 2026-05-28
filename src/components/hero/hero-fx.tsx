"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
}

const PARTICLE_COUNT = 64;
const PROXIMITY = 140;
const MAX_DPR = 2;

function makeParticles(width: number, height: number): Particle[] {
  const arr: Particle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    arr.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.4 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      a: 0.1 + Math.random() * 0.5,
    });
  }
  return arr;
}

export default function HeroFx() {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- state ---
    let particles: Particle[] = [];
    let logicalW = 0;
    let logicalH = 0;
    let rafId = 0;
    let isVisible = true;
    let isPageVisible = true;

    const mouse = { x: -9999, y: -9999 };

    // --- helpers ---
    function applyDpr() {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const parent = canvas!.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      logicalW = w;
      logicalH = h;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = makeParticles(w, h);
    }

    function drawFrame() {
      ctx!.clearRect(0, 0, logicalW, logicalH);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // wrap at edges
        if (p.x < -p.r) p.x = logicalW + p.r;
        else if (p.x > logicalW + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = logicalH + p.r;
        else if (p.y > logicalH + p.r) p.y = -p.r;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const near = dist < PROXIMITY;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, near ? p.r * 1.8 : p.r, 0, Math.PI * 2);
        if (near) {
          ctx!.fillStyle = `rgba(197,255,0,${Math.min(p.a + 0.3, 1)})`;
        } else {
          ctx!.fillStyle = `rgba(255,255,255,${p.a * 0.5})`;
        }
        ctx!.fill();
      }
    }

    function loop() {
      drawFrame();
      rafId = requestAnimationFrame(loop);
    }

    function startLoop() {
      if (rafId) return;
      rafId = requestAnimationFrame(loop);
    }

    function stopLoop() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    function maybeToggle() {
      if (isVisible && isPageVisible) {
        startLoop();
      } else {
        stopLoop();
      }
    }

    // --- resize ---
    let ro: ResizeObserver | null = null;
    const parent = canvas.parentElement;

    if (typeof ResizeObserver !== "undefined" && parent) {
      ro = new ResizeObserver(() => {
        applyDpr();
      });
      ro.observe(parent);
    } else {
      window.addEventListener("resize", applyDpr);
    }

    // --- intersection ---
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0]?.isIntersecting ?? true;
          maybeToggle();
        },
        { threshold: 0 },
      );
      io.observe(canvas);
    }

    // --- visibility change ---
    function onVisibilityChange() {
      isPageVisible = !document.hidden;
      maybeToggle();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    // --- pointer ---
    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    canvas.addEventListener("pointermove", onPointerMove);

    // --- init ---
    applyDpr();
    startLoop();

    return () => {
      stopLoop();
      ro?.disconnect();
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("pointermove", onPointerMove);
      if (!ro) {
        window.removeEventListener("resize", applyDpr);
      }
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
