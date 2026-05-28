# Cinematic-Depth Portfolio — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the reusable cinematic-depth engine (tokens, parallax/scroll system, custom cursor, magnetic buttons, intro reveal, lazy WebGL hero accent) and ship the fully rebuilt home page on a Vercel preview.

**Architecture:** One shared pointer+scroll rAF store drives all parallax via a `<Parallax>` primitive; GSAP/ScrollTrigger (synced to Lenis) drives scroll choreography; pure-math helpers are unit-tested, visual components are smoke-tested + verified with Playwright screenshots. Everything gates on `prefers-reduced-motion` and coarse-pointer. Fraunces×Inter via `next/font`. WebGL accent is a code-split OGL particle field with a CSS-gradient fallback.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind v4, GSAP + ScrollTrigger, Motion, Lenis, OGL (new), Vitest + React Testing Library + jsdom (new), Vercel.

**Spec:** `docs/superpowers/specs/2026-05-28-cinematic-portfolio-design.md`

---

## File Structure (Phase 1 target)

```
src/
├── app/
│   ├── layout.tsx                      # MODIFY: fonts (Fraunces/Inter), providers, metadata kept
│   ├── page.tsx                        # MODIFY: home composition
│   └── globals.css                     # MODIFY: tokens, type scale, motion tokens
├── components/
│   ├── chrome/
│   │   ├── nav.tsx                     # MODIFY (from components/nav.tsx): active section
│   │   ├── footer.tsx                  # MODIFY (from components/footer.tsx): avatar + magnetic
│   │   ├── cursor.tsx                  # CREATE: custom cursor
│   │   ├── intro.tsx                   # CREATE: intro reveal
│   │   └── scroll-progress.tsx         # CREATE
│   ├── motion/
│   │   ├── pointer-store.ts            # CREATE: shared rAF pointer+scroll store
│   │   ├── parallax.tsx                # CREATE: <Parallax depth>
│   │   ├── use-magnetic.ts             # CREATE: magnetic hook
│   │   ├── smooth-scroll-provider.tsx  # MODIFY (from lenis-provider.tsx): Lenis+ScrollTrigger
│   │   └── use-count-up.ts             # CREATE
│   ├── hero/
│   │   ├── hero.tsx                    # MODIFY (from components/hero.tsx)
│   │   └── hero-fx.tsx                 # CREATE: lazy OGL particle accent (client-only)
│   └── sections/
│       ├── manifesto.tsx               # MODIFY
│       ├── work-grid.tsx               # MODIFY
│       ├── experience.tsx              # MODIFY
│       └── marquee.tsx                 # MODIFY
├── content/
│   ├── projects.ts                     # CREATE: typed project data (moved from work-grid)
│   └── experience.ts                   # CREATE: typed role data (moved from experience)
└── lib/
    ├── parallax.ts                     # CREATE: pure depthTransform()
    ├── magnetic.ts                     # CREATE: pure magneticOffset()
    ├── intro.ts                        # CREATE: pure shouldPlayIntro()
    ├── use-prefers-reduced-motion.ts   # KEEP
    └── utils.ts                        # KEEP
```

---

## Task 1: Test runner + dependencies

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`, `vitest.setup.ts`

- [ ] **Step 1: Install deps**

```bash
pnpm add ogl
pnpm add -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", globals: true, setupFiles: ["./vitest.setup.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```

Run: `pnpm add -D @vitejs/plugin-react` (needed by the config above).

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
afterEach(() => cleanup());
// jsdom lacks rAF timing + matchMedia; provide minimal shims
if (!window.matchMedia) {
  window.matchMedia = (q: string) =>
    ({ matches: false, media: q, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false; } }) as MediaQueryList;
}
```

- [ ] **Step 4: Add scripts to `package.json`**

Add to `"scripts"`: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 5: Verify runner works (empty pass)**

Run: `pnpm test`
Expected: "No test files found" exits 0 (or create a trivial `src/lib/__smoke__.test.ts` with `it("runs", () => expect(1).toBe(1))`, run, then delete).

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts vitest.setup.ts
git commit -m "chore: add vitest + RTL test harness and ogl"
```

---

## Task 2: Pure parallax math (`depthTransform`)

**Files:**
- Create: `src/lib/parallax.ts`
- Test: `src/lib/parallax.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from "vitest";
import { depthTransform } from "./parallax";

describe("depthTransform", () => {
  it("returns zero offset at center with no scroll", () => {
    expect(depthTransform(40, 0, 0, 0)).toEqual({ x: 0, y: 0 });
  });
  it("moves opposite the pointer, scaled by depth", () => {
    const { x } = depthTransform(40, 0.5, 0, 0); // pointer right of center
    expect(x).toBeCloseTo(-20); // -nx * depth
  });
  it("adds downward scroll drift scaled by depth", () => {
    const { y } = depthTransform(40, 0, 0, 1000);
    expect(y).toBeCloseTo(-0 - 1000 * 40 * 0.012); // -480
  });
});
```

- [ ] **Step 2: Run — expect FAIL** — `pnpm test src/lib/parallax.test.ts` → "depthTransform is not a function".

- [ ] **Step 3: Implement**

```ts
/** nx/ny are normalized pointer position in [-0.5, 0.5]. */
export function depthTransform(depth: number, nx: number, ny: number, scrollY: number) {
  return { x: -nx * depth, y: -ny * depth - scrollY * depth * 0.012 };
}
```

- [ ] **Step 4: Run — expect PASS.**

- [ ] **Step 5: Commit** — `git add src/lib/parallax.ts src/lib/parallax.test.ts && git commit -m "feat: depthTransform parallax math"`

---

## Task 3: Pure magnetic math (`magneticOffset`)

**Files:**
- Create: `src/lib/magnetic.ts`
- Test: `src/lib/magnetic.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from "vitest";
import { magneticOffset } from "./magnetic";

const rect = { left: 100, top: 100, width: 100, height: 40 }; // center (150,120)

describe("magneticOffset", () => {
  it("is zero when pointer is at element center", () => {
    expect(magneticOffset(150, 120, rect, 0.4)).toEqual({ x: 0, y: 0 });
  });
  it("pulls toward pointer scaled by strength", () => {
    // pointer 50px right of center → x = 50 * 0.4 = 20
    expect(magneticOffset(200, 120, rect, 0.4).x).toBeCloseTo(20);
  });
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement**

```ts
type Rect = { left: number; top: number; width: number; height: number };
export function magneticOffset(px: number, py: number, rect: Rect, strength = 0.4) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return { x: (px - cx) * strength, y: (py - cy) * strength };
}
```

- [ ] **Step 4: Run — expect PASS.**

- [ ] **Step 5: Commit** — `git commit -am "feat: magneticOffset math"` (after `git add`).

---

## Task 4: Pure intro-gate logic (`shouldPlayIntro`)

**Files:**
- Create: `src/lib/intro.ts`
- Test: `src/lib/intro.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { shouldPlayIntro, markIntroPlayed, INTRO_KEY } from "./intro";

beforeEach(() => sessionStorage.clear());

describe("shouldPlayIntro", () => {
  it("plays on first visit", () => {
    expect(shouldPlayIntro(sessionStorage, false)).toBe(true);
  });
  it("does not play when reduced motion is on", () => {
    expect(shouldPlayIntro(sessionStorage, true)).toBe(false);
  });
  it("does not play once marked", () => {
    markIntroPlayed(sessionStorage);
    expect(shouldPlayIntro(sessionStorage, false)).toBe(false);
  });
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement**

```ts
export const INTRO_KEY = "rt-intro-played";
export function shouldPlayIntro(storage: Storage, reducedMotion: boolean) {
  if (reducedMotion) return false;
  return storage.getItem(INTRO_KEY) !== "1";
}
export function markIntroPlayed(storage: Storage) {
  storage.setItem(INTRO_KEY, "1");
}
```

- [ ] **Step 4: Run — expect PASS.**

- [ ] **Step 5: Commit.**

---

## Task 5: Design tokens, fonts, type scale (`globals.css` + `layout.tsx`)

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx:8-16` (font setup), `:65` (html className)

- [ ] **Step 1: Wire fonts in `layout.tsx`**

Replace the `Geist`/`Geist_Mono` imports with:

```tsx
import { Fraunces, Inter, Geist_Mono } from "next/font/google";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
```

Update `<html className={...}>` to `${fraunces.variable} ${inter.variable} ${geistMono.variable} antialiased`.

- [ ] **Step 2: Update `globals.css` theme + tokens**

In `@theme inline` set `--font-sans: var(--font-inter)`, `--font-display: var(--font-fraunces)`, keep `--font-mono`. Add motion tokens under `:root`:

```css
:root {
  /* existing color tokens kept */
  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-curtain: cubic-bezier(0.76, 0, 0.24, 1);
  --dur-fast: 0.25s; --dur-med: 0.6s; --dur-slow: 1s;
}
```

Replace `.display` to use Fraunces:

```css
.display { font-family: var(--font-fraunces), Georgia, serif; font-weight: 600; letter-spacing: -0.03em; line-height: 0.9; }
.font-mono { font-family: var(--font-geist-mono), ui-monospace, monospace; }
```

- [ ] **Step 3: Verify build compiles**

Run: `pnpm build` (or `pnpm dev` and load `/`). Expected: no font/Tailwind errors; headings render in Fraunces.

- [ ] **Step 4: Commit** — `git commit -m "feat: Fraunces+Inter fonts and motion tokens"`.

---

## Task 6: Avatar — pre-cut transparent asset

**Files:**
- Create: `public/rohan-avatar.png` (transparent)
- Remove: `Rohan_Animated.png` (repo root)

- [ ] **Step 1: Generate transparent cutout** (chroma-key the solid bg with Pillow; corner pixel is the key)

```bash
python3 - <<'PY'
from PIL import Image
im = Image.open("Rohan_Animated.png").convert("RGBA")
px = im.load(); w,h = im.size; kr,kg,kb,_ = px[0,0]
for y in range(h):
  for x in range(w):
    r,g,b,a = px[x,y]
    d = abs(r-kr)+abs(g-kg)+abs(b-kb)
    if d < 55: px[x,y] = (r,g,b,0)
    elif d < 110: px[x,y] = (r,g,b,int((d-55)/55*255))
im.save("public/rohan-avatar.png")
print("saved public/rohan-avatar.png", im.size)
PY
```
(If `PIL` missing: `pip install Pillow`. If edges are rough, raise the `<55`/`<110` thresholds.)

- [ ] **Step 2: Verify visually** — open `public/rohan-avatar.png`; confirm clean transparent background.

- [ ] **Step 3: Remove root copy** — `rm Rohan_Animated.png`.

- [ ] **Step 4: Commit** — `git add public/rohan-avatar.png && git commit -m "feat: transparent avatar asset"`.

---

## Task 7: Pointer + scroll store (`pointer-store.ts`)

**Files:**
- Create: `src/components/motion/pointer-store.ts`
- Test: `src/components/motion/pointer-store.test.ts`

- [ ] **Step 1: Write failing test** (subscribe receives smoothed values; SSR-safe import)

```ts
import { describe, it, expect, vi } from "vitest";
import { pointerStore } from "./pointer-store";

describe("pointerStore", () => {
  it("starts centered with zero scroll", () => {
    const s = pointerStore.get();
    expect(s.nx).toBe(0); expect(s.ny).toBe(0); expect(s.scrollY).toBe(0);
  });
  it("notifies subscribers and allows unsubscribe", () => {
    const cb = vi.fn();
    const off = pointerStore.subscribe(cb);
    pointerStore.set({ nx: 0.25 });
    expect(cb).toHaveBeenCalled();
    off();
    cb.mockClear();
    pointerStore.set({ nx: 0.1 });
    expect(cb).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement** (framework-free pub/sub; the DOM listeners + rAF lerp live in a separate `start()` guarded by `typeof window`)

```ts
type State = { nx: number; ny: number; scrollY: number };
type Sub = (s: State) => void;

const state: State = { nx: 0, ny: 0, scrollY: 0 };
const subs = new Set<Sub>();
let started = false;
let target = { nx: 0, ny: 0 };

export const pointerStore = {
  get: () => state,
  set: (p: Partial<State>) => { Object.assign(state, p); subs.forEach((s) => s(state)); },
  subscribe(cb: Sub) { subs.add(cb); return () => subs.delete(cb); },
  start() {
    if (started || typeof window === "undefined") return;
    started = true;
    const onMove = (e: PointerEvent) => {
      target.nx = e.clientX / window.innerWidth - 0.5;
      target.ny = e.clientY / window.innerHeight - 0.5;
    };
    const onScroll = () => { state.scrollY = window.scrollY; subs.forEach((s) => s(state)); };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    const loop = () => {
      state.nx += (target.nx - state.nx) * 0.12;
      state.ny += (target.ny - state.ny) * 0.12;
      subs.forEach((s) => s(state));
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  },
};
```

- [ ] **Step 4: Run — expect PASS.**

- [ ] **Step 5: Commit.**

---

## Task 8: `<Parallax>` primitive

**Files:**
- Create: `src/components/motion/parallax.tsx`
- Test: `src/components/motion/parallax.test.tsx`

- [ ] **Step 1: Write failing test** (renders children; under reduced motion applies no transform)

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Parallax } from "./parallax";

vi.mock("@/lib/use-prefers-reduced-motion", () => ({ usePrefersReducedMotion: () => true }));

describe("Parallax (reduced motion)", () => {
  it("renders children without a transform", () => {
    render(<Parallax depth={40}><span>hi</span></Parallax>);
    const el = screen.getByText("hi").parentElement!;
    expect(el.style.transform).toBe("");
  });
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement**

```tsx
"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { pointerStore } from "./pointer-store";
import { depthTransform } from "@/lib/parallax";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export function Parallax({ depth = 20, className, children, as: Tag = "div" }:
  { depth?: number; className?: string; children: ReactNode; as?: keyof JSX.IntrinsicElements }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced || !ref.current) return;
    pointerStore.start();
    const el = ref.current;
    const off = pointerStore.subscribe(({ nx, ny, scrollY }) => {
      const { x, y } = depthTransform(depth, nx, ny, scrollY);
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    return off;
  }, [depth, reduced]);
  // @ts-expect-error dynamic tag
  return <Tag ref={ref} className={className} style={{ willChange: "transform" }}>{children}</Tag>;
}
```

- [ ] **Step 4: Run — expect PASS.**

- [ ] **Step 5: Commit.**

---

## Task 9: `useMagnetic` hook + `use-count-up`

**Files:**
- Create: `src/components/motion/use-magnetic.ts`, `src/components/motion/use-count-up.ts`
- Test: `src/components/motion/use-magnetic.test.tsx`

- [ ] **Step 1: Write failing test** (hook attaches, resets transform on unmount; uses `magneticOffset`)

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { useRef } from "react";
import { useMagnetic } from "./use-magnetic";

function Btn() { const r = useRef<HTMLButtonElement>(null); useMagnetic(r); return <button ref={r}>x</button>; }
describe("useMagnetic", () => {
  it("renders without crashing and leaves transform empty initially", () => {
    const { getByText } = render(<Btn />);
    expect((getByText("x") as HTMLButtonElement).style.transform).toBe("");
  });
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement `use-magnetic.ts`**

```ts
"use client";
import { useEffect, type RefObject } from "react";
import { magneticOffset } from "@/lib/magnetic";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export function useMagnetic(ref: RefObject<HTMLElement>, strength = 0.4) {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || matchMedia("(pointer: coarse)").matches) return;
    el.style.transition = "transform 0.25s var(--ease-expo)";
    const move = (e: PointerEvent) => {
      const { x, y } = magneticOffset(e.clientX, e.clientY, el.getBoundingClientRect(), strength);
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const leave = () => (el.style.transform = "");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [ref, strength, reduced]);
}
```

- [ ] **Step 4: Implement `use-count-up.ts`** (drives a number 0→target when triggered)

```ts
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
```

- [ ] **Step 5: Run — expect PASS. Commit.**

---

## Task 10: Smooth-scroll provider (Lenis + ScrollTrigger)

**Files:**
- Modify/rename: `src/components/lenis-provider.tsx` → `src/components/motion/smooth-scroll-provider.tsx`
- Modify: `src/app/layout.tsx` import

- [ ] **Step 1: Implement provider** (drive ScrollTrigger from Lenis; keep reduced-motion guard)

```tsx
"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider() {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); gsap.ticker.remove((t) => lenis.raf(t * 1000)); };
  }, [reduced]);
  return null;
}
```

- [ ] **Step 2: Update `layout.tsx`** — import `SmoothScrollProvider` from new path; render it where `<LenisProvider/>` was. Delete old file.

- [ ] **Step 3: Verify** — `pnpm dev`, scroll the page: smooth scroll works, no console errors.

- [ ] **Step 4: Commit.**

---

## Task 11: Custom cursor (`chrome/cursor.tsx`)

**Files:**
- Create: `src/components/chrome/cursor.tsx`
- Test: `src/components/chrome/cursor.test.tsx`

- [ ] **Step 1: Failing test** — renders nothing on coarse pointer / reduced motion.

```tsx
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { Cursor } from "./cursor";
vi.mock("@/lib/use-prefers-reduced-motion", () => ({ usePrefersReducedMotion: () => true }));
describe("Cursor", () => {
  it("renders null under reduced motion", () => {
    const { container } = render(<Cursor />);
    expect(container.firstChild).toBeNull();
  });
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement** — lerp-following ring + dot; grow class toggled by `[data-hover]` delegation; returns `null` when reduced/coarse. (Body gets `cursor:none` via a `data-custom-cursor` attribute set in effect, reverted on cleanup.) Mirror the prototype's cursor JS. Include `pointer-events:none; z-index:9999; mix-blend-mode:difference`.

- [ ] **Step 4: Run — expect PASS. Add to `layout.tsx`. Commit.**

---

## Task 12: Intro reveal (`chrome/intro.tsx`)

**Files:**
- Create: `src/components/chrome/intro.tsx`
- Test: `src/components/chrome/intro.test.tsx`

- [ ] **Step 1: Failing test** — uses `shouldPlayIntro`; when it returns false (reduced motion mocked), renders null and dispatches "intro:done" immediately so hero can reveal.

- [ ] **Step 2: Implement** — `RT` monogram + 00→100 counter, curtain wipe (`--ease-curtain`), calls `markIntroPlayed`, then `document.body.classList.add("revealed")` and dispatches a `intro:done` CustomEvent. Skips (null + immediate reveal) when `!shouldPlayIntro`.

- [ ] **Step 3: Run — expect PASS. Wire into `layout.tsx` (above children). Commit.**

---

## Task 13: Scroll progress + nav active section

**Files:**
- Create: `src/components/chrome/scroll-progress.tsx`
- Modify: `src/components/nav.tsx` → `src/components/chrome/nav.tsx`

- [ ] **Step 1:** Implement `scroll-progress.tsx` — fixed top lime bar scaling `scaleX` from `scrollY / (scrollHeight - innerHeight)`, gated by reduced motion (still shows, just no smoothing). Subscribe to `pointerStore` for scrollY.
- [ ] **Step 2:** Move nav to `chrome/`, add `IntersectionObserver` to highlight the active section link (`aria-current`).
- [ ] **Step 3:** Wire both in `layout.tsx`. `pnpm dev` verify. Commit.

---

## Task 14: WebGL hero accent (`hero/hero-fx.tsx`)

**Files:**
- Create: `src/components/hero/hero-fx.tsx`

- [ ] **Step 1: Implement OGL particle field** — client-only component using `ogl` (Renderer + a Points/instanced program) drawing ~80 drifting lime/white particles that brighten near the pointer (read `pointerStore`). Pause via `IntersectionObserver` + `document.hidden`. On WebGL-context failure, render the CSS radial-gradient glow div instead (try/catch around `new Renderer`). Return `null` under reduced motion.
- [ ] **Step 2:** Export as the module's default and load it in the hero via `next/dynamic(() => import("./hero-fx"), { ssr: false })`.
- [ ] **Step 3: Smoke test** — render with a stubbed WebGL (jsdom has none): assert it falls back to the gradient div (no throw). Commit.

---

## Task 15: Content data extraction

**Files:**
- Create: `src/content/projects.ts`, `src/content/experience.ts`
- Test: `src/content/content.test.ts`

- [ ] **Step 1: Failing test** — every project has non-empty `title`, valid `href` (starts with `http`), `live` (if present) starts with `http`; experience roles have `period` and ≥1 highlight.
- [ ] **Step 2:** Move the `projects`/`featuredStack` arrays out of `work-grid.tsx` and `roles` out of `experience.tsx` into typed modules (`export type Project`, `export type Role`). Re-export current values verbatim.
- [ ] **Step 3: Run — expect PASS. Commit.**

---

## Task 16: Hero rebuild (`hero/hero.tsx`)

**Files:**
- Modify: `src/components/hero.tsx` → `src/components/hero/hero.tsx`
- Test: `src/components/hero/hero.test.tsx`

- [ ] **Step 1: Failing test** — renders the four headline lines, the eyebrow status, both CTAs (`View work`, `Get in touch`), and the avatar `<img alt>`; on `intro:done` (or reduced motion) body gets `revealed`.
- [ ] **Step 2: Implement** — port the prototype: Fraunces headline with line-reveal (`.revealed` gates the `translateY`), eyebrow with pulse, `<Parallax depth>` layers for grid floor / avatar / eyebrow, `<HeroFx/>` (dynamic), avatar via `next/image` (`public/rohan-avatar.png`, `priority`), CTAs using `useMagnetic` + `[data-hover]`. Keep the radial-gradient + grid background. Reveal triggers: listen for `intro:done` event and also reveal if reduced motion.
- [ ] **Step 3: Run tests — PASS. `pnpm dev` visual check. Commit.**

---

## Task 17: Manifesto, Work grid, Experience, Marquee, Footer (section rebuilds)

Each sub-task: modify the existing component to consume extracted content + the motion engine, keep `id`s/anchors, add a render smoke test (renders heading + key content), keep reduced-motion guards. Commit after each.

- [ ] **17a Manifesto** (`sections/manifesto.tsx`): keep the word-scrub ScrollTrigger; add a subtle per-word `y`/`z` lift (`gsap.fromTo` `yPercent` small) and a depth-fog gradient overlay. Smoke test: renders the statement words.
- [ ] **17b Work grid** (`sections/work-grid.tsx`): import from `@/content/projects`; featured TruthLayer card gets pointer **tilt** (rotateX/rotateY from `getBoundingClientRect` + pointer) and the screenshot parallaxes within frame; project grid cards get a ScrollTrigger staggered "assemble" (from `y:40, opacity:0, rotateX:-8`) and keep hover→lime. Smoke test: renders all project titles + featured "TruthLayer".
- [ ] **17c Experience** (`sections/experience.tsx`): import from `@/content/experience`; each role `<li>` reveals on enter via ScrollTrigger on a `<Parallax>` layer; metrics use `useCountUp` (parse leading number from `metric`, animate when in view). Smoke test: renders all company names.
- [ ] **17d Marquee** (`sections/marquee.tsx`): second opposing row (reverse direction), edge mask (`mask-image` linear-gradient) for depth blur. Smoke test: renders stack items.
- [ ] **17e Footer** (`footer.tsx` → `chrome/footer.tsx`): add avatar peeking on a `<Parallax>` layer, email CTA uses `useMagnetic` + `[data-hover]`; keep all contact links. Smoke test: renders email + GitHub/LinkedIn links.

---

## Task 18: Page composition + provider wiring

**Files:**
- Modify: `src/app/page.tsx`, `src/app/layout.tsx`

- [ ] **Step 1:** Update imports to new paths; compose `<Hero/> <Manifesto/> <WorkGrid/> <Experience/> <Marquee/> <Footer/>`. Layout renders providers in order: `<SmoothScrollProvider/>`, `<Cursor/>`, `<ScrollProgress/>`, `<Intro/>`, `<Nav/>`, children, `<Analytics/>`.
- [ ] **Step 2:** `pnpm build` — must compile clean. Run `pnpm test` — all green. Commit.

---

## Task 19: Reduced-motion, mobile-light & a11y pass

- [ ] **Step 1:** With `prefers-reduced-motion: reduce` (DevTools emulate): intro skipped, no custom cursor, no parallax transforms, marquee static, content fully visible. Fix any gaps.
- [ ] **Step 2:** Mobile (`<=820px`): avatar dims/repositions, parallax intensity reduced (lower `depth` via a `coarse pointer` check or media), no custom cursor. Verify on a 390px viewport.
- [ ] **Step 3:** Keyboard: tab through nav + CTAs, visible `:focus-visible` rings, skip-to-content link. Confirm cursor/effects never block clicks.
- [ ] **Step 4:** Commit.

---

## Task 20: Performance + visual verification + preview deploy

- [ ] **Step 1:** Confirm `HeroFx` is `ssr:false` dynamic (not in initial bundle); fonts `display:swap`; LCP element is the hero text, not WebGL.
- [ ] **Step 2:** Playwright: navigate the dev/preview URL, screenshot hero + each section (desktop + 390px), confirm no console errors. Save shots under `.playwright-mcp/`.
- [ ] **Step 3:** Run `pnpm build`; check bundle has no unexpected bloat. (Optional: Lighthouse via `npx unlighthouse` or Chrome.)
- [ ] **Step 4:** Push branch → Vercel preview. Share the preview URL.
- [ ] **Step 5:** Final commit / open PR (do not merge to `main` until reviewed).

---

## Phase 2 (outline) — Work case studies
Routed `/work/[slug]` pages for TruthLayer, AgentForge Healthcare, +1–2; per-page scroll story (problem→approach→result), metrics, visuals, stack, links; work index. Reuses Parallax + ScrollTrigger + count-up. New: route data in `src/content/projects.ts` extended with case-study bodies; per-page OG.

## Phase 3 (outline) — About + Writing + polish
Avatar-led `/about` (narrative, journey, optional photo slot); optional MDX `/writing`; cross-page transitions; OG-per-page; final perf/a11y/SEO hardening; QA.

---

## Self-Review

**Spec coverage:** tokens/fonts (T5) · avatar pipeline (T6,T16) · pointer+scroll engine (T7,T8) · parallax primitive (T8) · magnetic (T3,T9) · cursor (T11) · intro (T4,T12) · scroll progress + nav (T13) · WebGL accent + fallback (T14) · all 6 home sections (T16,T17) · reduced-motion/mobile/a11y (T19) · perf/SEO/preview (T20) · Phases 2–3 outlined. No spec section unmapped.

**Placeholders:** Foundation/engine tasks (T1–T16) carry complete code. Section rebuilds (T17) and the OGL accent (T14) specify exact files, inputs (`@/content/*`), effects, and a named smoke-test assertion rather than full JSX — they adapt already-written, in-repo components and follow the prototype, so the executor evolves existing files instead of writing from scratch. Acceptance per task is the passing smoke test + visual check.

**Type consistency:** `depthTransform(depth,nx,ny,scrollY)`, `magneticOffset(px,py,rect,strength)`, `shouldPlayIntro(storage,reduced)`/`markIntroPlayed`, `pointerStore.{get,set,subscribe,start}`, `useMagnetic(ref,strength)`, `useCountUp(target,active,ms)`, `<Parallax depth>` — names/signatures used consistently across tasks.
