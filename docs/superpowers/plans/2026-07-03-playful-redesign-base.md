# Playful Redesign — Static Base Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut `redesign/playful` from `main` and build the complete static (pre-motion) version of the approved Playful Redesign: cream/ink/five-accent tokens, Bricolage Grotesque type, and the four-section single page (hero, projects, about, footer) with a minimal nav.

**Architecture:** Server components everywhere except where `useMagnetic` forces a client boundary (hero CTAs, footer email). New sections live in `src/components/sections/`; the test harness, typed content, and kept motion utilities are ported wholesale from `redesign/cinematic-depth` via `git checkout <branch> -- <paths>`. Old components are deleted and `gsap`/`lenis` dropped only in the final assembly task so every commit builds green.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4 (`@theme inline` tokens), `motion` (installed, unused in this plan), Vitest + React Testing Library, pnpm.

## Global Constraints

- **Spec of record:** `docs/superpowers/specs/2026-07-03-playful-redesign-design.md` — copy rules: plain & direct, **no metaphors, no day/night wordplay, no puns**.
- **Canvas:** cream `#FAF6EF`, ink `#1A1815`. **No dark mode.**
- **Accents (exactly five):** electric blue `#2456F5`, tangerine `#E56910`, pink `#D6417F`, leaf green `#3E8F4D`, violet `#7351E8`. Each project card owns exactly one.
- **Type:** Bricolage Grotesque (display), Inter (body), Geist Mono (stack tags) — all via `next/font/google`.
- **Shape:** 24px card corners, sticker-style chips, cards rest at ±1° and straighten on hover (CSS transition only in this plan; springs come in the motion plan).
- **Animation in this plan:** none beyond `useMagnetic` on hero CTAs + CSS hover transitions. Everything respects reduced motion (globals.css kill-switch + `usePrefersReducedMotion` inside `useMagnetic`).
- **Quality gates at every commit:** `pnpm test`, `pnpm lint`, `pnpm build` all green.
- **Never merge/push to `main`.** Branch pushes only (Vercel previews). PR #1 (`redesign/cinematic-depth`) stays open.
- Email: `claude@thomasrohan.com` · GitHub: `https://github.com/rohanthomas1202` · LinkedIn: `https://linkedin.com/in/RohanSThomas`.
- Package manager is **pnpm** (lockfile: `pnpm-lock.yaml`).

**Out of scope for this plan:** all motion-research items (reveals, tap squish, jelly headline, screenshots, Now line), dark mode, case studies. They land in a follow-up plan on top of this base.

---

### Task 1: Preserve WIP and cut `redesign/playful` from main

The working tree (on `redesign/cinematic-depth`) has a modified `README.md` that belongs to the cinematic work, and the untracked approved spec that belongs to the new branch.

**Files:**
- Commit to `redesign/cinematic-depth`: `README.md`
- Commit to new `redesign/playful`: `docs/superpowers/specs/2026-07-03-playful-redesign-design.md`

- [ ] **Step 1: Commit the cinematic README to its own branch**

```bash
git add README.md
git commit -m "docs: README overhaul for cinematic direction"
```

- [ ] **Step 2: Cut the new branch from main**

The spec doc is untracked, so it survives the switch.

```bash
git checkout -b redesign/playful main
git status --short
```

Expected: only `?? docs/superpowers/specs/2026-07-03-playful-redesign-design.md` (plus this plan file `?? docs/superpowers/plans/2026-07-03-playful-redesign-base.md`).

- [ ] **Step 3: Commit the spec + plan on the new branch**

```bash
git add docs/superpowers
git commit -m "docs: add approved playful redesign spec + base implementation plan"
```

- [ ] **Step 4: Sanity-check the inherited site builds**

```bash
pnpm install && pnpm build
```

Expected: build succeeds (this is the old `main` site, untouched).

---

### Task 2: Port the test harness and kept modules from `redesign/cinematic-depth`

**Files:**
- Create (via git): `vitest.config.ts`, `vitest.setup.ts`, `src/content/projects.ts`, `src/content/experience.ts`, `src/content/content.test.ts`, `src/lib/magnetic.ts`, `src/lib/magnetic.test.ts`, `src/lib/__smoke__.test.ts`, `src/components/motion/use-magnetic.ts`, `src/components/motion/use-magnetic.test.tsx`
- Overwrite (via git): `src/lib/use-prefers-reduced-motion.ts` (branch version uses `useSyncExternalStore`)
- Modify: `package.json` (test scripts + devDependencies)

**Interfaces:**
- Produces: `projects: Project[]` and `featuredStack: string[]` from `@/content/projects` (`Project = { title, blurb, stack, year, tag, href, live? }`); `roles: Role[]` from `@/content/experience`; `useMagnetic(ref: RefObject<HTMLElement | null>, strength?: number)` from `@/components/motion/use-magnetic`; `usePrefersReducedMotion(): boolean` from `@/lib/use-prefers-reduced-motion`; `cn(...)` from `@/lib/utils` (already on main).
- Note: `useMagnetic` sets `transition: transform 0.25s var(--ease-expo)` — Task 3 MUST define `--ease-expo` in globals.css.

- [ ] **Step 1: Port files from the cinematic branch**

```bash
git checkout redesign/cinematic-depth -- \
  vitest.config.ts vitest.setup.ts \
  src/content \
  src/lib/magnetic.ts src/lib/magnetic.test.ts src/lib/__smoke__.test.ts \
  src/lib/use-prefers-reduced-motion.ts \
  src/components/motion/use-magnetic.ts src/components/motion/use-magnetic.test.tsx
```

- [ ] **Step 2: Add test scripts and devDependencies to package.json**

In `package.json`, set `scripts` to:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

and add to `devDependencies` (keep existing entries):

```json
{
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/react": "^16.3.2",
  "@testing-library/user-event": "^14.6.1",
  "@vitejs/plugin-react": "^6.0.2",
  "@vitest/ui": "^4.1.7",
  "jsdom": "^29.1.1",
  "vitest": "^4.1.7"
}
```

- [ ] **Step 3: Install and run the ported suite**

```bash
pnpm install && pnpm test
```

Expected: all ported tests PASS (content, magnetic, use-magnetic, smoke).

- [ ] **Step 4: Lint + build, then commit**

```bash
pnpm lint && pnpm build
git add -A
git commit -m "chore: port vitest harness, typed content, and kept motion utilities from cinematic branch"
```

---

### Task 3: Design tokens + fonts

**Files:**
- Modify: `src/app/globals.css` (full rewrite below)
- Modify: `src/app/layout.tsx` (font loaders only — lines 1–16 of the current file; leave metadata and body for Task 9)

**Interfaces:**
- Produces Tailwind utilities used by every later task: `bg-paper`, `text-ink`, `text-ink-soft`, `border-line`, and per-accent `text-/bg-/border-` for `blue`, `tangerine`, `pink`, `green`, `violet` and tints `blue-tint`, `tangerine-tint`, `pink-tint`, `green-tint`, `violet-tint`; fonts `font-display`, `font-sans`, `font-mono`; CSS vars `--ease-expo`, `--accent` (per-card override), `--accent-tint`.
- Old utilities `bg-background`, `text-foreground`, `text-muted`, `text-accent`, `border-border` stay mapped (to new values) so the still-wired old components compile; Task 9 deletes them.

- [ ] **Step 1: Rewrite `src/app/globals.css`**

```css
@import "tailwindcss";

:root {
  --paper: #FAF6EF;
  --ink: #1A1815;
  --ink-soft: #6B6459;
  --line: #E7DFD1;

  --blue: #2456F5;
  --tangerine: #E56910;
  --pink: #D6417F;
  --green: #3E8F4D;
  --violet: #7351E8;

  --blue-tint: #E3EAFE;
  --tangerine-tint: #FDE9D8;
  --pink-tint: #FBE0EC;
  --green-tint: #E1F0E3;
  --violet-tint: #EAE4FC;

  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);

  /* transition aliases — Task 9 removes these with the old components */
  --background: var(--paper);
  --foreground: var(--ink);
  --muted: var(--ink-soft);
  --accent-legacy: var(--blue);
  --border-legacy: var(--line);
}

@theme inline {
  --color-paper: var(--paper);
  --color-ink: var(--ink);
  --color-ink-soft: var(--ink-soft);
  --color-line: var(--line);

  --color-blue: var(--blue);
  --color-tangerine: var(--tangerine);
  --color-pink: var(--pink);
  --color-green: var(--green);
  --color-violet: var(--violet);

  --color-blue-tint: var(--blue-tint);
  --color-tangerine-tint: var(--tangerine-tint);
  --color-pink-tint: var(--pink-tint);
  --color-green-tint: var(--green-tint);
  --color-violet-tint: var(--violet-tint);

  /* transition aliases — Task 9 removes */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-accent: var(--accent-legacy);
  --color-border: var(--border-legacy);

  --font-display: var(--font-bricolage);
  --font-sans: var(--font-inter);
  --font-mono: var(--font-geist-mono);
}

html {
  scroll-behavior: smooth;
}

html,
body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-sans), system-ui, sans-serif;
}

body {
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

::selection {
  background: var(--violet-tint);
  color: var(--ink);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

(The `.lenis` rules and `.display` class from the old file are intentionally gone; old components still compile without them.)

- [ ] **Step 2: Swap font loaders in `src/app/layout.tsx`**

Replace the imports and font constants at the top of the file (currently `Geist, Geist_Mono`):

```tsx
import { Bricolage_Grotesque, Inter, Geist_Mono } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
```

and update the `<html>` className to:

```tsx
className={`${bricolage.variable} ${inter.variable} ${geistMono.variable} antialiased`}
```

(`--font-geist-sans` disappears; globals.css no longer references it.)

- [ ] **Step 3: Verify gates, then commit**

```bash
pnpm test && pnpm lint && pnpm build
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: cream/ink/five-accent design tokens + Bricolage Grotesque, Inter, Geist Mono"
```

---

### Task 4: Minimal top nav

**Files:**
- Create: `src/components/nav.tsx` (overwrites main's old nav — full replacement below)
- Test: `src/components/nav.test.tsx`

**Interfaces:**
- Produces: `<Nav />` (server component, no props). Anchor targets `#work`, `#about`, `#contact` are produced by Tasks 7, 8, 9.

- [ ] **Step 1: Write the failing test**

Create `src/components/nav.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Nav } from "./nav";

describe("Nav", () => {
  it("renders the name linking home", () => {
    render(<Nav />);
    const name = screen.getByRole("link", { name: /rohan thomas/i });
    expect(name).toHaveAttribute("href", "/");
  });

  it("renders anchor links to work, about, and contact", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /work/i })).toHaveAttribute("href", "#work");
    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute("href", "#about");
    expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute("href", "#contact");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/nav.test.tsx`
Expected: FAIL (old nav has different links / missing anchors).

- [ ] **Step 3: Replace `src/components/nav.tsx`**

```tsx
const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-paper/85 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="font-display text-lg font-bold tracking-tight text-ink">
          Rohan Thomas
        </a>
        <ul className="flex items-center gap-6">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-ink-soft transition-colors hover:text-ink focus-visible:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/components/nav.test.tsx`
Expected: PASS. Note: main's `layout.tsx` already renders `<Nav />` from this path, so the new nav is live immediately and the build stays green.

- [ ] **Step 5: Gates + commit**

```bash
pnpm test && pnpm lint && pnpm build
git add src/components/nav.tsx src/components/nav.test.tsx
git commit -m "feat(nav): minimal top nav — name + Work/About/Contact anchors"
```

---

### Task 5: Hero section

**Files:**
- Create: `src/components/sections/hero.tsx`
- Create: `src/components/magnetic-link.tsx` (client wrapper both hero and footer reuse)
- Test: `src/components/sections/hero.test.tsx`

**Interfaces:**
- Consumes: `useMagnetic` from `@/components/motion/use-magnetic`, `cn` from `@/lib/utils`.
- Produces: `<Hero />` (server component); `<MagneticLink href className children />` (client component rendering `<a>`).

- [ ] **Step 1: Write the failing test**

Create `src/components/sections/hero.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./hero";

describe("Hero", () => {
  it("renders the headline verbatim", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "I build AI products — agents, dev tools, and the interfaces around them.",
      }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow and sub-line", () => {
    render(<Hero />);
    expect(screen.getByText(/Rohan Thomas · Austin, TX · open to collabs/)).toBeInTheDocument();
    expect(screen.getByText(/Full-stack engineer at Charles Schwab\./)).toBeInTheDocument();
  });

  it("renders both magnetic CTAs with correct targets", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /see the work/i })).toHaveAttribute("href", "#work");
    expect(screen.getByRole("link", { name: /say hi/i })).toHaveAttribute(
      "href",
      "mailto:claude@thomasrohan.com",
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/sections/hero.test.tsx`
Expected: FAIL — "Cannot find module './hero'".

- [ ] **Step 3: Create `src/components/magnetic-link.tsx`**

```tsx
"use client";
import { useRef } from "react";
import { useMagnetic } from "@/components/motion/use-magnetic";
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
  useMagnetic(ref, 0.3);
  return (
    <a ref={ref} href={href} className={cn("inline-block", className)}>
      {children}
    </a>
  );
}
```

- [ ] **Step 4: Create `src/components/sections/hero.tsx`**

```tsx
import { MagneticLink } from "@/components/magnetic-link";

export function Hero() {
  return (
    <section className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-6 pt-24 pb-16">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
        Rohan Thomas · Austin, TX · open to collabs
      </p>
      <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl">
        I build AI products — agents, dev tools, and the interfaces around them.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-ink-soft">
        Full-stack engineer at Charles Schwab. Five shipped side projects and counting.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <MagneticLink
          href="#work"
          className="rounded-full bg-ink px-7 py-3.5 font-medium text-paper transition-transform hover:scale-[1.03]"
        >
          See the work ↓
        </MagneticLink>
        <MagneticLink
          href="mailto:claude@thomasrohan.com"
          className="rounded-full border-2 border-ink px-7 py-3.5 font-medium text-ink transition-transform hover:scale-[1.03]"
        >
          Say hi
        </MagneticLink>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm vitest run src/components/sections/hero.test.tsx`
Expected: PASS.

- [ ] **Step 6: Gates + commit**

```bash
pnpm test && pnpm lint && pnpm build
git add src/components/sections/hero.tsx src/components/sections/hero.test.tsx src/components/magnetic-link.tsx
git commit -m "feat(hero): playful hero — plain headline, eyebrow, sub-line, two magnetic CTAs"
```

---

### Task 6: Compressed experience data

The About section renders 3 one-liner rows with a single headline metric each. Add that compressed view to the data file (full detail stays for future use).

**Files:**
- Modify: `src/content/experience.ts` (add `headline` to `Role` and each entry)
- Modify: `src/content/content.test.ts` (add assertions)

**Interfaces:**
- Produces: `Role.headline: { metric: string; label: string }` — consumed by Task 8's `<About />`.

- [ ] **Step 1: Add failing assertions to `src/content/content.test.ts`**

Append inside the existing `describe` for roles (or add a new one):

```ts
describe("compressed experience view", () => {
  it("every role has a headline metric and label", () => {
    for (const r of roles) {
      expect(r.headline.metric.length).toBeGreaterThan(0);
      expect(r.headline.label.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/content/content.test.ts`
Expected: FAIL — `headline` is undefined (type error at compile).

- [ ] **Step 3: Update `src/content/experience.ts`**

Extend the type:

```ts
export type Role = {
  company: string;
  role: string;
  location: string;
  period: string;
  current?: boolean;
  headline: { metric: string; label: string };
  highlights: { text: string; metric?: string }[];
};
```

Add to each role (keep all existing fields):

```ts
// Charles Schwab
headline: { metric: "$3T+", label: "assets under management tooling" },
// FedEx
headline: { metric: "+30%", label: "peak-season throughput" },
// United Healthcare
headline: { metric: "−80%", label: "claims processing time" },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/content/content.test.ts`
Expected: PASS.

- [ ] **Step 5: Gates + commit**

```bash
pnpm test && pnpm lint && pnpm build
git add src/content/experience.ts src/content/content.test.ts
git commit -m "feat(content): add compressed headline metric per role"
```

---

### Task 7: Projects section (the star)

**Files:**
- Create: `src/components/sections/projects.tsx`
- Test: `src/components/sections/projects.test.tsx`

**Interfaces:**
- Consumes: `projects` from `@/content/projects`, `cn` from `@/lib/utils`.
- Produces: `<Projects />` (server component) rendering `<section id="work">`.

**Design decisions locked here:** accent assignment by title — AgentForge Healthcare → blue, Alcohol Label Verifier → tangerine, ChatBridge → pink, Shipyard → green, HypeInvest V2 → violet. Featured (larger): AgentForge Healthcare and Alcohol Label Verifier. Card = tint background + 24px corners + ±1° alternating rest tilt, straightening on hover via CSS. Whole card clickable via a stretched title link (live demo wins over GitHub as primary target); explicit GitHub/Live links sit above it with `relative z-10`. Arrow-out affordance: full-accent circle badge, top-right.

- [ ] **Step 1: Write the failing test**

Create `src/components/sections/projects.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Projects } from "./projects";
import { projects } from "@/content/projects";

describe("Projects", () => {
  it("renders a work section with all project titles", () => {
    render(<Projects />);
    expect(document.getElementById("work")).toBeInTheDocument();
    for (const p of projects) {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    }
  });

  it("links every project to GitHub, and live demos where present", () => {
    render(<Projects />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const p of projects) {
      expect(hrefs).toContain(p.href);
      if (p.live) expect(hrefs).toContain(p.live);
    }
  });

  it("makes the whole card clickable via a stretched title link", () => {
    render(<Projects />);
    const title = screen.getByRole("link", { name: /AgentForge Healthcare/ });
    expect(title).toHaveAttribute("href", "https://github.com/rohanthomas1202/agentforge-healthcare");
  });

  it("renders stack tags as individual chips", () => {
    render(<Projects />);
    expect(screen.getByText("LangGraph")).toBeInTheDocument();
    expect(screen.getByText("FHIR R4")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/sections/projects.test.tsx`
Expected: FAIL — "Cannot find module './projects'".

- [ ] **Step 3: Create `src/components/sections/projects.tsx`**

```tsx
import { projects, type Project } from "@/content/projects";
import { cn } from "@/lib/utils";

const ACCENTS: Record<string, { text: string; bg: string; tint: string }> = {
  "AgentForge Healthcare": { text: "text-blue", bg: "bg-blue", tint: "bg-blue-tint" },
  "Alcohol Label Verifier": { text: "text-tangerine", bg: "bg-tangerine", tint: "bg-tangerine-tint" },
  ChatBridge: { text: "text-pink", bg: "bg-pink", tint: "bg-pink-tint" },
  Shipyard: { text: "text-green", bg: "bg-green", tint: "bg-green-tint" },
  "HypeInvest V2": { text: "text-violet", bg: "bg-violet", tint: "bg-violet-tint" },
};
const FEATURED = new Set(["AgentForge Healthcare", "Alcohol Label Verifier"]);

function Card({ project, index }: { project: Project; index: number }) {
  const accent = ACCENTS[project.title] ?? ACCENTS.ChatBridge;
  const featured = FEATURED.has(project.title);
  const primary = project.live ?? project.href;
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-3xl p-7 transition-transform duration-300 hover:rotate-0 sm:p-8",
        accent.tint,
        index % 2 === 0 ? "rotate-[1deg]" : "rotate-[-1deg]",
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
            "flex size-10 items-center justify-center rounded-full text-lg text-paper",
            accent.bg,
          )}
        >
          ↗
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
        <a href={project.href} target="_blank" rel="noreferrer" className={cn("hover:underline", accent.text)}>
          GitHub ↗
        </a>
        {project.live && (
          <a href={project.live} target="_blank" rel="noreferrer" className={cn("hover:underline", accent.text)}>
            Live demo ↗
          </a>
        )}
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">Work</h2>
      <p className="mt-3 max-w-md text-ink-soft">
        Five shipped side projects. Every card links out — GitHub always, live demo when there is one.
      </p>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-6">
        {projects.map((p, i) => (
          <Card key={p.title} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/components/sections/projects.test.tsx`
Expected: PASS.

- [ ] **Step 5: Gates + commit**

```bash
pnpm test && pnpm lint && pnpm build
git add src/components/sections/projects.tsx src/components/sections/projects.test.tsx
git commit -m "feat(projects): color-blocked project cards — five accents, two featured, sticker tilt"
```

---

### Task 8: About section

**Files:**
- Create: `src/components/sections/about.tsx`
- Test: `src/components/sections/about.test.tsx`

**Interfaces:**
- Consumes: `roles` (with `headline` from Task 6) from `@/content/experience`.
- Produces: `<About />` rendering `<section id="about">`.

**Copy (draft for Rohan's review — plain, first-person, no puns):**
> I'm Rohan — a full-stack engineer in Austin, TX. Days are portfolio tools at Charles Schwab; nights and weekends are AI products — agents, dev tools, and the interfaces around them. I like small teams, fast feedback, and software that feels considered. If you're building something, say hi.

- [ ] **Step 1: Write the failing test**

Create `src/components/sections/about.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "./about";
import { roles } from "@/content/experience";

describe("About", () => {
  it("renders the about section with the intro paragraph", () => {
    render(<About />);
    expect(document.getElementById("about")).toBeInTheDocument();
    expect(screen.getByText(/I'm Rohan — a full-stack engineer in Austin, TX\./)).toBeInTheDocument();
  });

  it("renders one compressed row per role with its headline metric", () => {
    render(<About />);
    for (const r of roles) {
      expect(screen.getByText(r.company)).toBeInTheDocument();
      expect(screen.getByText(r.headline.metric)).toBeInTheDocument();
      expect(screen.getByText(r.headline.label)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/sections/about.test.tsx`
Expected: FAIL — "Cannot find module './about'".

- [ ] **Step 3: Create `src/components/sections/about.tsx`**

```tsx
import { roles } from "@/content/experience";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">About</h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink">
        I&apos;m Rohan — a full-stack engineer in Austin, TX. Days are portfolio tools at Charles
        Schwab; nights and weekends are AI products — agents, dev tools, and the interfaces around
        them. I like small teams, fast feedback, and software that feels considered. If you&apos;re
        building something, say hi.
      </p>
      <ul className="mt-12 border-t border-line">
        {roles.map((r) => (
          <li
            key={r.company}
            className="flex flex-col gap-1 border-b border-line py-5 sm:flex-row sm:items-baseline sm:gap-6"
          >
            <span className="w-44 shrink-0 font-display text-lg font-bold text-ink">{r.company}</span>
            <span className="text-sm text-ink-soft">
              {r.role} · {r.period}
            </span>
            <span className="sm:ml-auto sm:text-right">
              <span className="font-display text-2xl font-bold tracking-tight text-ink">
                {r.headline.metric}
              </span>{" "}
              <span className="text-sm text-ink-soft">{r.headline.label}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/components/sections/about.test.tsx`
Expected: PASS.

- [ ] **Step 5: Gates + commit**

```bash
pnpm test && pnpm lint && pnpm build
git add src/components/sections/about.tsx src/components/sections/about.test.tsx
git commit -m "feat(about): plain intro paragraph + three compressed experience rows"
```

---

### Task 9: Contact footer

**Files:**
- Create: `src/components/sections/footer.tsx`
- Test: `src/components/sections/footer.test.tsx`
- Modify: `src/app/globals.css` (append `.email-fill` rules)

**Interfaces:**
- Produces: `<Footer />` rendering `<footer id="contact">`. Uses the `.email-fill` CSS hover-fill (pure CSS, reduced-motion-safe via the global kill-switch).

- [ ] **Step 1: Write the failing test**

Create `src/components/sections/footer.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";

describe("Footer", () => {
  it("renders the oversized mailto", () => {
    render(<Footer />);
    const mail = screen.getByRole("link", { name: /claude@thomasrohan\.com/i });
    expect(mail).toHaveAttribute("href", "mailto:claude@thomasrohan.com");
  });

  it("renders GitHub and LinkedIn links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/rohanthomas1202",
    );
    expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/RohanSThomas",
    );
  });

  it("renders a plain sign-off", () => {
    render(<Footer />);
    expect(screen.getByText(/Built in Austin/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/sections/footer.test.tsx`
Expected: FAIL — "Cannot find module './footer'".

- [ ] **Step 3: Append the fill effect to `src/app/globals.css`**

```css
/* Footer email: ink fill rises on hover. Layered spans; reduced-motion kill-switch zeroes the transition. */
.email-fill {
  position: relative;
  display: inline-block;
  border-radius: 0.5rem;
}
.email-fill .fill {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  color: var(--paper);
  background: var(--ink);
  border-radius: 0.5rem;
  clip-path: inset(100% 0 0 0);
  transition: clip-path 0.45s var(--ease-expo);
}
.email-fill:hover .fill,
.email-fill:focus-visible .fill {
  clip-path: inset(0 0 0 0);
}
```

- [ ] **Step 4: Create `src/components/sections/footer.tsx`**

```tsx
export function Footer() {
  return (
    <footer id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-16 pt-24">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">Contact</p>
      <a
        href="mailto:claude@thomasrohan.com"
        className="email-fill mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl md:text-6xl"
      >
        <span aria-hidden className="fill">
          claude@thomasrohan.com
        </span>
        claude@thomasrohan.com
      </a>
      <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-line pt-6 text-sm">
        <a
          href="https://github.com/rohanthomas1202"
          target="_blank"
          rel="noreferrer"
          className="text-ink hover:underline"
        >
          GitHub ↗
        </a>
        <a
          href="https://linkedin.com/in/RohanSThomas"
          target="_blank"
          rel="noreferrer"
          className="text-ink hover:underline"
        >
          LinkedIn ↗
        </a>
        <span className="ml-auto text-ink-soft">Built in Austin. © 2026 Rohan Thomas.</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm vitest run src/components/sections/footer.test.tsx`
Expected: PASS.

- [ ] **Step 6: Gates + commit**

```bash
pnpm test && pnpm lint && pnpm build
git add src/components/sections/footer.tsx src/components/sections/footer.test.tsx src/app/globals.css
git commit -m "feat(footer): oversized mailto with hover fill, GitHub/LinkedIn, plain sign-off"
```

---

### Task 10: Assembly — swap the page, delete the old site, drop gsap/lenis

This task must be one atomic commit: the deletions and the wiring depend on each other.

**Files:**
- Modify: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css` (remove transition aliases), `package.json` (remove `gsap`, `lenis`)
- Delete: `src/components/hero.tsx`, `src/components/footer.tsx`, `src/components/lenis-provider.tsx`, `src/components/sections/manifesto.tsx`, `src/components/sections/marquee.tsx`, `src/components/sections/work-grid.tsx`, `src/components/sections/experience.tsx`

**Interfaces:**
- Consumes: `<Hero />`, `<Projects />`, `<About />`, `<Footer />`, `<Nav />` from Tasks 4–9.

- [ ] **Step 1: Rewrite `src/app/page.tsx`**

```tsx
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <About />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Rewrite `src/app/layout.tsx` body + metadata**

Keep the Task 3 font loaders. Full file:

```tsx
import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Nav } from "@/components/nav";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

const description =
  "I build AI products — agents, dev tools, and the interfaces around them. Full-stack engineer at Charles Schwab in Austin, TX. Five shipped side projects and counting. Open to collabs.";

export const metadata: Metadata = {
  metadataBase: new URL("https://thomasrohan.com"),
  title: {
    default: "Rohan Thomas — I build AI products",
    template: "%s — Rohan Thomas",
  },
  description,
  keywords: ["Rohan Thomas", "full-stack engineer", "AI agents", "dev tools", "Austin", "Next.js"],
  authors: [{ name: "Rohan Thomas", url: "https://thomasrohan.com" }],
  creator: "Rohan Thomas",
  openGraph: {
    type: "website",
    url: "https://thomasrohan.com",
    title: "Rohan Thomas — I build AI products",
    description,
    siteName: "Rohan Thomas",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohan Thomas — I build AI products",
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${inter.variable} ${geistMono.variable} antialiased`}
    >
      <body className="bg-paper text-ink">
        <Nav />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Delete old components**

```bash
git rm src/components/hero.tsx src/components/footer.tsx src/components/lenis-provider.tsx \
  src/components/sections/manifesto.tsx src/components/sections/marquee.tsx \
  src/components/sections/work-grid.tsx src/components/sections/experience.tsx
```

- [ ] **Step 4: Remove the transition aliases from `src/app/globals.css`**

Delete the five `--background/--foreground/--muted/--accent-legacy/--border-legacy` declarations in `:root` and the five `--color-background/--color-foreground/--color-muted/--color-accent/--color-border` lines in `@theme inline` (both marked with "transition aliases" comments).

- [ ] **Step 5: Drop dead dependencies**

```bash
pnpm remove gsap lenis
grep -rn "gsap\|lenis" src/ && echo "LEFTOVER REFERENCES — fix before continuing" || echo "clean"
```

Expected: `clean`.

- [ ] **Step 6: Full gates**

```bash
pnpm test && pnpm lint && pnpm build
```

Expected: all green. If the build complains about an unknown utility class, an old component still references a removed alias — Step 3/4 missed something.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: assemble playful single page — swap sections, delete cinematic-era components, drop gsap/lenis"
```

---

### Task 11: Icon, OG image, README

**Files:**
- Modify: `src/app/icon.tsx`, `src/app/opengraph-image.tsx`, `README.md`

- [ ] **Step 1: Rewrite `src/app/icon.tsx`**

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2456F5",
          color: "#FAF6EF",
          fontSize: 22,
          fontWeight: 800,
          fontFamily: "sans-serif",
          letterSpacing: -1,
          borderRadius: 8,
        }}
      >
        R
      </div>
    ),
    { ...size },
  );
}
```

- [ ] **Step 2: Rewrite `src/app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rohan Thomas — I build AI products";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENTS = ["#2456F5", "#E56910", "#D6417F", "#3E8F4D", "#7351E8"];

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAF6EF",
          color: "#1A1815",
          fontFamily: "sans-serif",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 3, textTransform: "uppercase", color: "#6B6459" }}>
          Rohan Thomas · Austin, TX
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, maxWidth: 980 }}>
          I build AI products — agents, dev tools, and the interfaces around them.
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 14 }}>
            {ACCENTS.map((c) => (
              <div key={c} style={{ width: 28, height: 28, borderRadius: 14, background: c, display: "flex" }} />
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#6B6459" }}>thomasrohan.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
```

- [ ] **Step 3: Rewrite `README.md`**

```markdown
# thomasrohan.com

Personal site for [Rohan Thomas](https://github.com/rohanthomas1202) — full-stack engineer at Charles Schwab, building AI products after hours.

→ Live at **[thomasrohan.com](https://thomasrohan.com)**

## Design

Playful and personal: warm cream canvas, five saturated accent colors (one per project card), Bricolage Grotesque display type, sticker-style chips, and springy interaction. Copy stays plain. Single scrolling page — work, about, contact.

Spec: `docs/superpowers/specs/2026-07-03-playful-redesign-design.md`

## Stack

- [Next.js 16](https://nextjs.org) — App Router, Turbopack
- [React 19](https://react.dev), TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Motion](https://motion.dev) — springs and micro-interactions
- [Vitest](https://vitest.dev) + React Testing Library
- [Vercel Analytics](https://vercel.com/docs/analytics)

## Develop

pnpm install
pnpm dev        # localhost:3000
pnpm test       # vitest
pnpm lint
pnpm build
```

(Wrap the four commands in a fenced code block in the actual file.)

- [ ] **Step 4: Gates + commit + push for preview**

```bash
pnpm test && pnpm lint && pnpm build
git add src/app/icon.tsx src/app/opengraph-image.tsx README.md
git commit -m "chore: favicon, OG image, and README for the playful direction"
git push -u origin redesign/playful
```

Expected: push succeeds; Vercel produces a preview URL for Rohan's review.

---

## Self-Review Notes

- **Spec coverage:** canvas/accents/type/shape → Task 3; hero copy + magnetic CTAs → Task 5; projects with featured sizing, chips, year, tag, outbound links, clickable cards, arrow affordance → Task 7; about paragraph + 3 compressed rows → Tasks 6+8; footer mailto fill + socials + sign-off → Task 9; nav → Task 4; deletions + dependency removal → Task 10; quality gates → every task. Deliberately deferred (per spec's motion section + follow-up motion plan): spring hover states, in-view reveals, signature headline moment.
- **Known judgment calls flagged for Rohan:** exact accent hexes, About paragraph copy, metadata copy, card tint backgrounds (vs. fully saturated card faces).
- **Type consistency:** `Role.headline` defined in Task 6, consumed in Task 8; `MagneticLink` defined in Task 5, reused nowhere else in this plan (footer uses pure CSS fill instead — magnetic email is a motion-plan item).
