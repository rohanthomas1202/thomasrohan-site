# Playful Redesign — Motion Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Layer the researched, judge-approved motion language onto the static playful base: one loud signature moment on the hero headline, and quiet spring physics everywhere else — plus the zero-motion craft layer (focus rings, selection colors, row tints) and the footer credibility items (copy feedback, Now line).

**Architecture:** All motion via `motion/react` springs + CSS. A shared spring vocabulary (`springs.ts`) keeps physics consistent. `MotionConfig reducedMotion="user"` gates every declarative animation globally (transforms disabled, opacity kept); the one imperative animation (headline boop) gates manually on `usePrefersReducedMotion`. Client boundaries stay at the leaves: sections remain server components rendering small client children.

**Tech Stack:** motion/react v12, Tailwind v4, existing Vitest + RTL harness.

## Global Constraints

- **Spec of record:** `docs/superpowers/specs/2026-07-03-playful-redesign-design.md` — "One signature moment … everything else stays quiet." Copy stays plain: no metaphors, no puns.
- **Motion research verdicts are binding design decisions** (from the judged synthesis): boop spring `stiffness 380, damping 10, mass 0.6`; highlight spring `300/24`; neighbor nudge `30% amplitude, 45ms delay`; reveals `280/20`, once-only, `staggerChildren 0.06–0.08`; press `scale 0.97` (cards `0.985`, origin bottom), spring `400/25`; magnetic spring `150/15` with label counter-parallax; arrow swap `500/30`; nothing loops, nothing scrubs, nothing performs unprompted.
- **Reduced motion:** `<MotionConfig reducedMotion="user">` wraps the app; the headline boop additionally checks `usePrefersReducedMotion()` and falls back to a 150ms opacity highlight crossfade with zero transforms.
- **Quality gates at every commit:** `pnpm test`, `pnpm lint`, `pnpm build` green.
- **Never merge/push to `main`.** Work on `redesign/playful`; push branch only.
- Accents stay: blue `#2456F5`, tangerine `#E56910`, pink `#D6417F`, green `#3E8F4D`, violet `#7351E8` (+ existing `-tint` vars). Card accent ownership unchanged.
- Package manager: pnpm.

**Out of scope:** screenshot-peek-nudge (blocked on five real product screenshots from Rohan), sticker 404, wave-through mailto, metric boop, curtain footer (all consciously deferred per the research synthesis).

---

### Task 1: Motion foundation — shared springs, MotionConfig, test-env stubs

**Files:**
- Create: `src/components/motion/springs.ts`
- Create: `src/components/motion/motion-provider.tsx`
- Modify: `src/app/layout.tsx` (wrap body contents)
- Modify: `vitest.setup.ts` (IntersectionObserver stub)
- Test: `src/components/motion/springs.test.ts`

**Interfaces:**
- Produces: `SPRING` object with keys `press`, `reveal`, `hover`, `arrow`, `magnetic`, `highlight`, `settle` — consumed by every later task; `<MotionProvider>` client wrapper.

- [ ] **Step 1: Write the failing test** — `src/components/motion/springs.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { SPRING } from "./springs";

describe("shared spring vocabulary", () => {
  it("defines the research-mandated physics", () => {
    expect(SPRING.press).toMatchObject({ type: "spring", stiffness: 400, damping: 25 });
    expect(SPRING.reveal).toMatchObject({ type: "spring", stiffness: 280, damping: 20 });
    expect(SPRING.hover).toMatchObject({ type: "spring", stiffness: 350, damping: 22 });
    expect(SPRING.arrow).toMatchObject({ type: "spring", stiffness: 500, damping: 30 });
    expect(SPRING.magnetic).toMatchObject({ stiffness: 150, damping: 15 });
    expect(SPRING.highlight).toMatchObject({ type: "spring", stiffness: 300, damping: 24 });
    expect(SPRING.settle).toMatchObject({ type: "spring", stiffness: 380, damping: 10, mass: 0.6 });
  });
});
```

- [ ] **Step 2: Run it** — `pnpm vitest run src/components/motion/springs.test.ts` — expect FAIL (module missing).

- [ ] **Step 3: Create `src/components/motion/springs.ts`**

```ts
export const SPRING = {
  press: { type: "spring", stiffness: 400, damping: 25 },
  reveal: { type: "spring", stiffness: 280, damping: 20 },
  hover: { type: "spring", stiffness: 350, damping: 22 },
  arrow: { type: "spring", stiffness: 500, damping: 30 },
  magnetic: { stiffness: 150, damping: 15 },
  highlight: { type: "spring", stiffness: 300, damping: 24 },
  settle: { type: "spring", stiffness: 380, damping: 10, mass: 0.6 },
} as const;
```

- [ ] **Step 4: Create `src/components/motion/motion-provider.tsx`**

```tsx
"use client";
import { MotionConfig } from "motion/react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
```

- [ ] **Step 5: Wire into `src/app/layout.tsx`** — import `MotionProvider` and change the body to:

```tsx
<body className="bg-paper text-ink">
  <MotionProvider>
    <Nav />
    {children}
  </MotionProvider>
  <Analytics />
</body>
```

- [ ] **Step 6: Append to `vitest.setup.ts`** (jsdom lacks IntersectionObserver; motion's `whileInView` needs it):

```ts
if (!("IntersectionObserver" in window)) {
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  }
  // @ts-expect-error test stub
  window.IntersectionObserver = IO;
}
```

- [ ] **Step 7: Gates + commit**

```bash
pnpm test && pnpm lint && pnpm build
git add src/components/motion/springs.ts src/components/motion/springs.test.ts src/components/motion/motion-provider.tsx src/app/layout.tsx vitest.setup.ts
git commit -m "feat(motion): shared spring vocabulary, MotionConfig reduced-motion gate, IO test stub"
```

---

### Task 2: `useMagnetic` on motion values + CTA label parallax + tap squish

**Files:**
- Modify: `src/components/motion/use-magnetic.ts` (full rewrite below)
- Modify: `src/components/motion/use-magnetic.test.tsx` (full rewrite below)
- Modify: `src/components/magnetic-link.tsx` (full rewrite below)

**Interfaces:**
- Consumes: `SPRING` from Task 1; `magneticOffset` from `@/lib/magnetic` (unchanged).
- Produces: `useMagnetic(ref, strength?)` now returns `{ x, y }` spring MotionValues (no more direct style writes). `MagneticLink` unchanged signature `{ href, className, children }`.

- [ ] **Step 1: Rewrite the test first** — `src/components/motion/use-magnetic.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { useRef } from "react";
import { motion } from "motion/react";
import { useMagnetic } from "./use-magnetic";

function Btn() {
  const r = useRef<HTMLButtonElement>(null);
  const { x, y } = useMagnetic(r);
  return (
    <motion.button ref={r} style={{ x, y }}>
      x
    </motion.button>
  );
}

describe("useMagnetic (motion values)", () => {
  it("renders and exposes zeroed motion values initially", () => {
    const { getByText } = render(<Btn />);
    const el = getByText("x");
    expect(el.style.transform === "" || el.style.transform === "none").toBe(true);
  });
});
```

- [ ] **Step 2: Run it** — `pnpm vitest run src/components/motion/use-magnetic.test.tsx` — expect FAIL (hook returns void today, destructuring gives undefined).

- [ ] **Step 3: Rewrite `src/components/motion/use-magnetic.ts`**

```ts
"use client";
import { useEffect, type RefObject } from "react";
import { useMotionValue, useSpring } from "motion/react";
import { magneticOffset } from "@/lib/magnetic";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { SPRING } from "@/components/motion/springs";

export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.4) {
  const reduced = usePrefersReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING.magnetic);
  const y = useSpring(rawY, SPRING.magnetic);

  useEffect(() => {
    const el = ref.current;
    rawX.set(0);
    rawY.set(0);
    if (!el || reduced || window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e: PointerEvent) => {
      const o = magneticOffset(e.clientX, e.clientY, el.getBoundingClientRect(), strength);
      rawX.set(o.x);
      rawY.set(o.y);
    };
    const leave = () => {
      rawX.set(0);
      rawY.set(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [ref, strength, reduced, rawX, rawY]);

  return { x, y };
}
```

- [ ] **Step 4: Rewrite `src/components/magnetic-link.tsx`** — shell follows cursor, label counter-travels at 20% (net label movement ≈80% of shell: the "invisible as a feature" two-layer depth), asymmetric squash on press (the one place it's allowed):

```tsx
"use client";
import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useMagnetic } from "@/components/motion/use-magnetic";
import { SPRING } from "@/components/motion/springs";
import { cn } from "@/lib/utils";

export function MagneticLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { x, y } = useMagnetic(ref, 0.3);
  const labelX = useTransform(x, (v) => v * -0.2);
  const labelY = useTransform(y, (v) => v * -0.2);
  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x, y }}
      whileTap={{ scaleX: 1.03, scaleY: 0.95, transition: SPRING.press }}
      className={cn("inline-block", className)}
    >
      <motion.span style={{ x: labelX, y: labelY }} className="inline-block">
        {children}
      </motion.span>
    </motion.a>
  );
}
```

- [ ] **Step 5: Run test** — expect PASS. Note: hero.test.tsx must still pass untouched (CTA roles/names/hrefs unchanged).

- [ ] **Step 6: Also remove the now-dead `hover:scale-[1.03]` + `transition-transform` classes from both CTAs in `src/components/sections/hero.tsx`** (the magnetic pull + tap squash replace them; this also resolves the earlier review note about `useMagnetic` clobbering the scale transition):

Change the two MagneticLink classNames to:

```tsx
className="rounded-full bg-ink px-7 py-3.5 font-medium text-paper"
```
and
```tsx
className="rounded-full border-2 border-ink px-7 py-3.5 font-medium text-ink"
```

- [ ] **Step 7: Gates + commit**

```bash
pnpm test && pnpm lint && pnpm build
git add src/components/motion/use-magnetic.ts src/components/motion/use-magnetic.test.tsx src/components/magnetic-link.tsx src/components/sections/hero.tsx
git commit -m "feat(motion): useMagnetic on spring motion values + CTA label parallax + press squash"
```

---

### Task 3: Zero-motion craft layer — focus rings, row tints, house selection

**Files:**
- Modify: `src/app/globals.css` (append block below)
- Modify: `src/components/sections/about.tsx` (row classes + accent vars)
- Test: `src/components/sections/about.test.tsx` (add one assertion)

**Interfaces:**
- Produces: CSS custom prop convention `--row-accent` (About rows) and `--focus-ring` (any element can override the ring color). Task 4 uses the same override idea with `--card-accent`.

- [ ] **Step 1: Add failing assertion** to `src/components/sections/about.test.tsx`, inside the existing describe:

```tsx
it("renders role and period on each row", () => {
  render(<About />);
  for (const r of roles) {
    expect(screen.getByText(`${r.role} · ${r.period}`)).toBeInTheDocument();
  }
});
```

(This also closes the carried-forward review gap: the "role · period" line had no coverage.)

- [ ] **Step 2: Run** `pnpm vitest run src/components/sections/about.test.tsx` — expect the new test PASSES already (line exists); that is fine — it is a pin, not TDD. Continue.

- [ ] **Step 3: Append to `src/app/globals.css`:**

```css
/* Accent focus rings hugging the corner radius; per-element override via --focus-ring. */
a:focus-visible,
button:focus-visible {
  outline: 2px solid transparent; /* forced-colors fallback */
  box-shadow:
    0 0 0 2px var(--paper),
    0 0 0 5px var(--focus-ring, var(--blue));
}

/* Experience rows: contiguous full-bleed hover targets, tint follows the cursor. */
@media (hover: hover) {
  .exp-row {
    border-radius: 16px;
    transition: background-color 150ms ease-out;
  }
  .exp-row:hover {
    background-color: color-mix(in srgb, var(--row-accent) 8%, transparent);
  }
  .exp-row .exp-metric {
    transition: color 150ms ease-out;
  }
  .exp-row:hover .exp-metric {
    color: var(--row-accent);
  }
}
```

- [ ] **Step 4: Update `src/components/sections/about.tsx`** — give each row a full-bleed hover surface and an owned accent. Add an accent lookup and change the `<li>` and metric span:

```tsx
const ROW_ACCENTS: Record<string, string> = {
  "Charles Schwab": "var(--blue)",
  FedEx: "var(--tangerine)",
  "United Healthcare": "var(--green)",
};
```

`<li>` becomes:

```tsx
<li
  key={r.company}
  style={{ "--row-accent": ROW_ACCENTS[r.company] ?? "var(--blue)" } as React.CSSProperties}
  className="exp-row -mx-4 flex flex-col gap-1 border-b border-line px-4 py-5 sm:flex-row sm:items-baseline sm:gap-6"
>
```

(the `border-t` stays on the `<ul>`; note `-mx-4 px-4` replaces nothing — it widens the hover surface without moving text)

and the metric span gains the class:

```tsx
<span className="exp-metric font-display text-2xl font-bold tracking-tight text-ink">
```

- [ ] **Step 5: Gates + commit**

```bash
pnpm test && pnpm lint && pnpm build
git add src/app/globals.css src/components/sections/about.tsx src/components/sections/about.test.tsx
git commit -m "feat(craft): accent focus rings + dead-zone-free experience row tints"
```

---

### Task 4: Project card choreography — client card with settle-into-tilt, hover straighten, arrow swap, tap squish, per-card selection

**Files:**
- Create: `src/components/project-card.tsx`
- Modify: `src/components/sections/projects.tsx` (slims to server shell — full rewrite below)
- Modify: `src/app/globals.css` (append selection rules)
- Test: `src/components/sections/projects.test.tsx` (add two assertions; existing ones must keep passing)

**Interfaces:**
- Consumes: `SPRING` (Task 1), `Project` type + `projects` data, `cn`.
- Produces: `<ProjectCard project index />` client component. Variant states are named `hidden` / `visible` / `hover` (matching future Reveal propagation).

- [ ] **Step 1: Add failing assertions** to `src/components/sections/projects.test.tsx`:

```tsx
it("gives every card its own selection accent via CSS var", () => {
  render(<Projects />);
  const cards = document.querySelectorAll(".project-card");
  expect(cards.length).toBe(projects.length);
  cards.forEach((c) => {
    expect((c as HTMLElement).style.getPropertyValue("--card-accent")).not.toBe("");
  });
});
```

- [ ] **Step 2: Run** `pnpm vitest run src/components/sections/projects.test.tsx` — expect FAIL (no `.project-card` class yet).

- [ ] **Step 3: Create `src/components/project-card.tsx`:**

```tsx
"use client";
import { motion, type Variants } from "motion/react";
import type { Project } from "@/content/projects";
import { SPRING } from "@/components/motion/springs";
import { cn } from "@/lib/utils";

const ACCENTS: Record<
  string,
  { bg: string; tint: string; deco: string; cssVar: string }
> = {
  "AgentForge Healthcare": { bg: "bg-blue", tint: "bg-blue-tint", deco: "decoration-blue", cssVar: "var(--blue)" },
  "Alcohol Label Verifier": { bg: "bg-tangerine", tint: "bg-tangerine-tint", deco: "decoration-tangerine", cssVar: "var(--tangerine)" },
  ChatBridge: { bg: "bg-pink", tint: "bg-pink-tint", deco: "decoration-pink", cssVar: "var(--pink)" },
  Shipyard: { bg: "bg-green", tint: "bg-green-tint", deco: "decoration-green", cssVar: "var(--green)" },
  "HypeInvest V2": { bg: "bg-violet", tint: "bg-violet-tint", deco: "decoration-violet", cssVar: "var(--violet)" },
};
const FEATURED = new Set(["AgentForge Healthcare", "Alcohol Label Verifier"]);

const cardVariants = (tilt: number): Variants => ({
  hidden: { opacity: 0, y: 24, rotate: 0 },
  visible: { opacity: 1, y: 0, rotate: tilt, transition: SPRING.reveal },
  hover: { rotate: 0, transition: SPRING.hover },
});
const arrowOut: Variants = {
  visible: { x: "0%", y: "0%" },
  hover: { x: "110%", y: "-110%", transition: SPRING.arrow },
};
const arrowIn: Variants = {
  visible: { x: "-110%", y: "110%" },
  hover: { x: "0%", y: "0%", transition: SPRING.arrow },
};
const linkArrow: Variants = {
  visible: { x: 0 },
  hover: { x: 3, transition: SPRING.arrow },
};

function ArrowGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const accent = ACCENTS[project.title] ?? ACCENTS.ChatBridge;
  const featured = FEATURED.has(project.title);
  const primary = project.live ?? project.href;
  const tilt = index % 2 === 0 ? 1 : -1;
  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      whileFocus="hover"
      whileTap={{ scale: 0.985, transition: SPRING.press }}
      viewport={{ once: true, margin: "-15% 0px" }}
      variants={cardVariants(tilt)}
      style={{ "--card-accent": accent.cssVar, "--focus-ring": accent.cssVar, transformOrigin: "center bottom" } as React.CSSProperties}
      className={cn(
        "project-card group relative flex flex-col rounded-3xl p-7 sm:p-8",
        accent.tint,
        featured ? "md:col-span-3 md:min-h-80" : "md:col-span-2 md:min-h-72",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full border-2 border-ink/15 bg-paper px-3 py-1 font-mono text-xs text-ink">
          {project.tag}
        </span>
        <span
          aria-hidden
          className={cn(
            "relative flex size-10 items-center justify-center overflow-hidden rounded-full text-paper",
            accent.bg,
          )}
        >
          <motion.span variants={arrowOut} className="absolute inset-0 flex items-center justify-center">
            <ArrowGlyph />
          </motion.span>
          <motion.span variants={arrowIn} className="absolute inset-0 flex items-center justify-center">
            <ArrowGlyph />
          </motion.span>
        </span>
      </div>
      <h3
        className={cn(
          "mt-6 font-display font-bold tracking-tight text-ink",
          featured ? "text-3xl sm:text-4xl" : "text-2xl",
        )}
      >
        <a href={primary} target="_blank" rel="noreferrer" className="after:absolute after:inset-0">
          {project.title}
        </a>
      </h3>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/75">{project.blurb}</p>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
        {project.stack.split(" · ").map((tech) => (
          <span key={tech} className="rounded-full bg-paper px-3 py-1 font-mono text-xs text-ink-soft">
            {tech}
          </span>
        ))}
        <span className="ml-auto font-mono text-xs text-ink-soft">{project.year}</span>
      </div>
      <div className="relative z-10 mt-4 flex gap-4 text-sm font-medium">
        <a
          href={project.href}
          target="_blank"
          rel="noreferrer"
          className={cn("text-ink underline decoration-2 underline-offset-4 hover:opacity-70", accent.deco)}
        >
          GitHub{" "}
          <motion.span variants={linkArrow} className="inline-block" aria-hidden>
            ↗
          </motion.span>
        </a>
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className={cn("text-ink underline decoration-2 underline-offset-4 hover:opacity-70", accent.deco)}
          >
            Live demo{" "}
            <motion.span variants={linkArrow} className="inline-block" aria-hidden>
              ↗
            </motion.span>
          </a>
        )}
      </div>
    </motion.article>
  );
}
```

- [ ] **Step 4: Rewrite `src/components/sections/projects.tsx`** to a thin server shell:

```tsx
import { projects } from "@/content/projects";
import { ProjectCard } from "@/components/project-card";

export function Projects() {
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">Work</h2>
      <p className="mt-3 max-w-md text-ink-soft">
        Five shipped side projects. Every card links out — GitHub always, live demo when there is one.
      </p>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-6">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Append per-card selection to `src/app/globals.css`:**

```css
/* Selecting text inside a card highlights in that card's accent. */
.project-card ::selection {
  background: var(--card-accent);
  color: var(--paper);
}
```

- [ ] **Step 6: Run** `pnpm vitest run src/components/sections/projects.test.tsx` — all assertions (old + new) must PASS. The old test's rendered hrefs/roles are unchanged by design.

- [ ] **Step 7: Gates + commit**

```bash
pnpm test && pnpm lint && pnpm build
git add src/components/project-card.tsx src/components/sections/projects.tsx src/components/sections/projects.test.tsx src/app/globals.css
git commit -m "feat(projects): card choreography — settle-into-tilt entrance, hover straighten, arrow swap, tap squish, per-card selection"
```

---

### Task 5: Reveal system for About + Footer

**Files:**
- Create: `src/components/motion/reveal.tsx`
- Modify: `src/components/sections/about.tsx`, `src/components/sections/footer.tsx`
- Test: `src/components/motion/reveal.test.tsx`

**Interfaces:**
- Consumes: `SPRING.reveal`.
- Produces: `<Reveal className>` (parent: staggers children 0.07, once-only, -15% margin) and `<RevealItem className>` (child: fade + 24px rise). Both render `motion.div`. Variant names `hidden`/`visible` match Task 4's cards.

- [ ] **Step 1: Write the failing test** — `src/components/motion/reveal.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Reveal, RevealItem } from "./reveal";

describe("Reveal system", () => {
  it("renders children", () => {
    render(
      <Reveal>
        <RevealItem>
          <p>content</p>
        </RevealItem>
      </Reveal>,
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it** — expect FAIL (module missing).

- [ ] **Step 3: Create `src/components/motion/reveal.tsx`:**

```tsx
"use client";
import { motion, type Variants } from "motion/react";
import { SPRING } from "./springs";

const parentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: SPRING.reveal },
};

export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={parentVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Apply to About** — in `src/components/sections/about.tsx`, wrap the section contents: the `<h2>` and `<p>` each inside a `<RevealItem>`, and the `<ul>` inside one `<RevealItem>` too, all inside one `<Reveal>` placed directly inside the `<section>`:

```tsx
<section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
  <Reveal>
    <RevealItem>
      <h2 ...>About</h2>
    </RevealItem>
    <RevealItem>
      <p ...>…paragraph unchanged…</p>
    </RevealItem>
    <RevealItem>
      <ul ...>…rows unchanged…</ul>
    </RevealItem>
  </Reveal>
</section>
```

(import `{ Reveal, RevealItem } from "@/components/motion/reveal"`; all inner markup, classes, and copy stay byte-identical.)

- [ ] **Step 5: Apply to Footer** — same pattern in `src/components/sections/footer.tsx`: wrap the eyebrow `<p>`, the mailto `<a>`, and the links `<div>` each in a `<RevealItem>` inside one `<Reveal>` directly inside `<footer>`. All existing markup/classes unchanged. (Note: the mailto `<a>` is `inline-block` via `.email-fill`; the wrapping div does not change layout.)

- [ ] **Step 6: Run all tests** — about.test.tsx and footer.test.tsx must still pass (they query text/roles, which wrapping divs don't affect).

- [ ] **Step 7: Gates + commit**

```bash
pnpm test && pnpm lint && pnpm build
git add src/components/motion/reveal.tsx src/components/motion/reveal.test.tsx src/components/sections/about.tsx src/components/sections/footer.tsx
git commit -m "feat(motion): once-only staggered reveal system applied to about + footer"
```

---

### Task 6: Hero headline — first-visit rise + the signature moment

**Files:**
- Create: `src/components/sections/hero-headline.tsx`
- Modify: `src/components/sections/hero.tsx` (replace the `<h1>`)
- Test: `src/components/sections/hero-headline.test.tsx`; `src/components/sections/hero.test.tsx` must keep passing unchanged.

**Interfaces:**
- Consumes: `usePrefersReducedMotion`, `SPRING.settle` / `SPRING.highlight` semantics (imperative animate uses the raw numbers).
- Produces: `<HeroHeadline className? />` rendering the `<h1>` with `aria-label` equal to the exact headline; word spans `aria-hidden`.

**Design decisions locked here (from the judged synthesis):** one-shot boop per word (squash → pop 6px with seeded tilt → spring settle 380/10/0.6, re-entrancy guarded); marker highlight in a cycled-random accent TINT (never repeating the last pick) swiping in from the left (spring 300/24) and out to the right; same-line neighbors nudge at 30% amplitude 45ms later (never across a wrap); tap fires it on coarse pointers; first visit only, headline words rise 24px with a 30ms/word stagger (session-gated, SSR renders visible); reduced motion = static 150ms opacity highlight, zero transforms.

- [ ] **Step 1: Write the failing test** — `src/components/sections/hero-headline.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroHeadline, HEADLINE } from "./hero-headline";

describe("HeroHeadline", () => {
  beforeEach(() => sessionStorage.clear());

  it("exposes the exact headline as the h1 accessible name", () => {
    render(<HeroHeadline />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "I build AI products — agents, dev tools, and the interfaces around them.",
      }),
    ).toBeInTheDocument();
  });

  it("renders every word in an aria-hidden span", () => {
    render(<HeroHeadline />);
    const h1 = screen.getByRole("heading", { level: 1 });
    const hiddenWrap = h1.querySelector('[aria-hidden="true"]');
    expect(hiddenWrap).not.toBeNull();
    expect(hiddenWrap!.textContent!.replace(/\s+/g, " ").trim()).toBe(HEADLINE);
  });
});
```

- [ ] **Step 2: Run it** — expect FAIL (module missing).

- [ ] **Step 3: Create `src/components/sections/hero-headline.tsx`:**

```tsx
"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { animate, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export const HEADLINE = "I build AI products — agents, dev tools, and the interfaces around them.";
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
  const [entered, setEntered] = useState(true); // SSR + revisits render at rest
  const [lit, setLit] = useState<number | null>(null);
  const [coarse, setCoarse] = useState(false);
  const color = useRef(HIGHLIGHTS[0]);
  const lastPick = useRef(-1);
  const words = useRef<(HTMLSpanElement | null)[]>([]);
  const busy = useRef<Set<number>>(new Set());
  const unlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
    if (reduced || sessionStorage.getItem("hero-seen")) return;
    sessionStorage.setItem("hero-seen", "1");
    setEntered(false);
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  function boop(i: number, amp: number) {
    const el = words.current[i];
    if (!el || reduced || busy.current.has(i)) return;
    busy.current.add(i);
    animate(
      el,
      { y: -6 * amp, scaleY: 1 - 0.06 * amp, rotate: seedTilt(i) * amp },
      { duration: 0.11, ease: "easeOut" },
    )
      .then(() =>
        animate(el, { y: 0, scaleY: 1, rotate: 0 }, { type: "spring", stiffness: 380, damping: 10, mass: 0.6 }),
      )
      .finally(() => busy.current.delete(i));
  }

  function fire(i: number) {
    const el = words.current[i];
    if (!el) return;
    let p: number;
    do {
      p = Math.floor(Math.random() * HIGHLIGHTS.length);
    } while (p === lastPick.current);
    lastPick.current = p;
    color.current = HIGHLIGHTS[p];
    setLit(i);
    boop(i, 1);
    [i - 1, i + 1].forEach((j) => {
      const n = words.current[j];
      if (n && n.offsetTop === el.offsetTop) setTimeout(() => boop(j, 0.3), 45);
    });
    if (coarse) {
      if (unlightTimer.current) clearTimeout(unlightTimer.current);
      unlightTimer.current = setTimeout(() => setLit(null), 1400);
    }
  }

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
          <motion.span
            key={i}
            className="inline-block"
            animate={entered ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 25, delay: entered ? i * 0.03 : 0 }}
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
                style={{ background: color.current, transformOrigin: lit === i ? "left" : "right" }}
                initial={false}
                animate={
                  reduced
                    ? { opacity: lit === i ? 1 : 0, scaleX: 1 }
                    : { scaleX: lit === i ? 1 : 0, opacity: 1 }
                }
                transition={
                  reduced ? { duration: 0.15 } : { type: "spring", stiffness: 300, damping: 24 }
                }
              />
              {w}
            </span>
            {i < WORDS.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </span>
    </h1>
  );
}
```

(Trailing space INSIDE each outer span keeps natural wrapping; the outer motion.span is `inline-block` so `y` transforms apply.)

- [ ] **Step 4: Wire into `src/components/sections/hero.tsx`** — replace the entire `<h1>…</h1>` block with:

```tsx
<HeroHeadline />
```

and add the import. The className the old h1 carried is already baked into HeroHeadline.

- [ ] **Step 5: Run tests** — `pnpm vitest run src/components/sections/` — hero-headline tests pass AND the untouched hero.test.tsx still passes (its `getByRole(heading, name)` resolves via the aria-label).

- [ ] **Step 6: Gates + commit**

```bash
pnpm test && pnpm lint && pnpm build
git add src/components/sections/hero-headline.tsx src/components/sections/hero-headline.test.tsx src/components/sections/hero.tsx
git commit -m "feat(hero): signature moment — jelly boop + accent highlight + neighbor nudge, first-visit word rise"
```

---

### Task 7: Copy-email celebration

**Files:**
- Create: `src/components/copy-email.tsx`
- Modify: `src/components/sections/footer.tsx` (render beside mailto)
- Test: `src/components/copy-email.test.tsx`

**Interfaces:**
- Produces: `<CopyEmail email />` client button. Never hijacks the mailto anchor.

- [ ] **Step 1: Write the failing test** — `src/components/copy-email.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CopyEmail } from "./copy-email";

const writeText = vi.fn().mockResolvedValue(undefined);
beforeEach(() => {
  writeText.mockClear();
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
});

describe("CopyEmail", () => {
  it("copies the address and confirms", async () => {
    const user = userEvent.setup();
    render(<CopyEmail email="contact@thomasrohan.com" />);
    await user.click(screen.getByRole("button", { name: /copy/i }));
    expect(writeText).toHaveBeenCalledWith("contact@thomasrohan.com");
    expect(await screen.findByText("Copied")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it** — expect FAIL (module missing).

- [ ] **Step 3: Create `src/components/copy-email.tsx`:**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SPRING } from "@/components/motion/springs";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="inline-flex w-24 items-center justify-center rounded-full border-2 border-ink px-3 py-1.5 font-mono text-xs text-ink"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "copied" : "copy"}
          initial={{ opacity: 0, scale: 0.85, filter: "blur(2px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.85, filter: "blur(2px)" }}
          transition={SPRING.highlight}
        >
          {copied ? "Copied" : "Copy"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
```

- [ ] **Step 4: Wire into the footer** — in `src/components/sections/footer.tsx`, wrap the mailto and the new button in a flex row (mailto markup itself unchanged):

```tsx
<div className="mt-4 flex flex-wrap items-center gap-4">
  <a href="mailto:contact@thomasrohan.com" className="email-fill font-display ...unchanged classes except mt-4 moves to the wrapper...">
    …unchanged…
  </a>
  <CopyEmail email="contact@thomasrohan.com" />
</div>
```

(remove `mt-4` from the anchor since the wrapper now carries it)

- [ ] **Step 5: Run tests** — copy-email + footer tests pass.

- [ ] **Step 6: Gates + commit**

```bash
pnpm test && pnpm lint && pnpm build
git add src/components/copy-email.tsx src/components/copy-email.test.tsx src/components/sections/footer.tsx
git commit -m "feat(footer): copy-email button with blur-crossfade confirmation"
```

---

### Task 8: "Now" status line

**Files:**
- Create: `src/lib/now.ts`, `src/components/now-line.tsx`
- Modify: `src/app/page.tsx` (render above Footer)
- Test: `src/lib/now.test.ts`

**Interfaces:**
- Produces: `formatLastCommit(pushedAtIso: string, now: Date): string | null` (null = hide the clause: stale >7 days, invalid, or future) and `NOW_PHRASE` (hand-edited constant); `<NowLine />` async server component.

- [ ] **Step 1: Write the failing test** — `src/lib/now.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { formatLastCommit } from "./now";

const NOW = new Date("2026-07-03T12:00:00Z");

describe("formatLastCommit", () => {
  it("formats recent pushes in hours", () => {
    expect(formatLastCommit("2026-07-03T09:00:00Z", NOW)).toBe("3 hours ago");
  });
  it("formats sub-hour pushes plainly", () => {
    expect(formatLastCommit("2026-07-03T11:40:00Z", NOW)).toBe("in the last hour");
  });
  it("formats older pushes in days", () => {
    expect(formatLastCommit("2026-07-01T12:00:00Z", NOW)).toBe("2 days ago");
  });
  it("hides when stale beyond 7 days", () => {
    expect(formatLastCommit("2026-06-20T12:00:00Z", NOW)).toBeNull();
  });
  it("hides on invalid or future timestamps", () => {
    expect(formatLastCommit("not-a-date", NOW)).toBeNull();
    expect(formatLastCommit("2026-07-04T12:00:00Z", NOW)).toBeNull();
  });
});
```

- [ ] **Step 2: Run it** — expect FAIL (module missing).

- [ ] **Step 3: Create `src/lib/now.ts`:**

```ts
export const NOW_PHRASE = "building AI agents and this site";

export function formatLastCommit(pushedAtIso: string, now: Date): string | null {
  const pushed = new Date(pushedAtIso).getTime();
  const diffMs = now.getTime() - pushed;
  if (Number.isNaN(pushed) || diffMs < 0) return null;
  const hours = diffMs / 3_600_000;
  if (hours < 1) return "in the last hour";
  const days = hours / 24;
  if (days > 7) return null;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always" });
  if (hours < 24) return rtf.format(-Math.round(hours), "hour");
  return rtf.format(-Math.round(days), "day");
}
```

- [ ] **Step 4: Create `src/components/now-line.tsx`** (async server component; renders nothing dynamic on the client; commit clause hides on any failure):

```tsx
import { formatLastCommit, NOW_PHRASE } from "@/lib/now";

export async function NowLine() {
  let commitClause: string | null = null;
  try {
    const res = await fetch(
      "https://api.github.com/users/rohanthomas1202/repos?sort=pushed&per_page=1",
      { next: { revalidate: 3600 } },
    );
    if (res.ok) {
      const repos: { pushed_at?: string }[] = await res.json();
      if (repos[0]?.pushed_at) commitClause = formatLastCommit(repos[0].pushed_at, new Date());
    }
  } catch {
    /* hide the clause on any failure */
  }
  return (
    <p className="mx-auto max-w-6xl px-6 pt-24 font-mono text-xs text-ink-soft">
      <span aria-hidden className="mr-2 inline-block size-2 rounded-full bg-green align-middle" />
      Now: {NOW_PHRASE}
      {commitClause ? ` · last commit ${commitClause}` : ""}
    </p>
  );
}
```

- [ ] **Step 5: Wire into `src/app/page.tsx`** — render between About and Footer:

```tsx
<About />
<NowLine />
<Footer />
```

and in `src/components/sections/footer.tsx` change the footer's `pt-24` to `pt-8` (NowLine now owns the section gap).

- [ ] **Step 6: Run tests + gates.** Note: the build performs the GitHub fetch at prerender; if the sandbox blocks network, the clause silently hides — that is the designed behavior, build must still pass.

- [ ] **Step 7: Commit**

```bash
pnpm test && pnpm lint && pnpm build
git add src/lib/now.ts src/lib/now.test.ts src/components/now-line.tsx src/app/page.tsx src/components/sections/footer.tsx
git commit -m "feat(footer): Now status line with GitHub last-commit freshness (server-rendered, self-hiding)"
```

---

### Task 9: Final gates + push

- [ ] **Step 1:** `pnpm test && pnpm lint && pnpm build` — full green.
- [ ] **Step 2:** `git push origin redesign/playful`.
- [ ] **Step 3:** Controller (not subagent) browser-verifies: no horizontal overflow at 320/375; headline boop fires on hover; cards settle into tilt on scroll; reduced-motion emulation shows no transforms; screenshots captured.

---

## Self-Review Notes

- Signature-moment physics, neighbor rules, color cycling, and reduced-motion fallback are transcribed from the judged synthesis verbatim (springs 380/10/0.6, 300/24, 30%/45ms).
- Variant name `visible` is shared across Reveal and ProjectCard so future propagation composes.
- hero.test.tsx keeps passing because the h1's accessible name comes from `aria-label`.
- Deferred by design: screenshot peek (assets), sticker 404, wave mailto, metric boop, curtain footer.
