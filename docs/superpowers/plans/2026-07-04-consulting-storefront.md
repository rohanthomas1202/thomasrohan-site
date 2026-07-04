# Consulting Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert thomasrohan.com from a job-seeker portfolio into a consulting storefront: rewritten copy, a new Offers section, rendered experience highlights, two case-study pages, and cal.com booking links.

**Architecture:** Single-page Next.js 16 App Router site (`src/app/page.tsx`) with typed content files (`src/content/*.ts`) rendered by section components (`src/components/sections/*.tsx`). This plan edits copy in content files + components, adds one new section (Offers), and adds two static case-study routes under `src/app/work/<slug>/page.tsx` sharing a `CaseStudy` component. Motion system, palette, and fonts are untouched.

**Tech Stack:** Next.js 16.2.4, React 19, Tailwind 4 (tokens in `globals.css` via `@theme`), motion/react, Vitest + Testing Library (jsdom). Package manager: **pnpm**.

**Spec:** `docs/superpowers/specs/2026-07-04-consulting-storefront-design.md` — copy in this plan is copied verbatim from the spec; if they ever disagree, the spec wins.

## Global Constraints

- Booking URL everywhere: `https://cal.com/rohanthomas` — import from `src/lib/site.ts` (`BOOKING_URL`), never hardcode in components.
- Availability copy is exactly "booking new projects" / "taking on new projects" — no slot counts, no quarters, no dates.
- Honesty rules: no testimonials, no client claims, no invented metrics. AgentForge figures are **14 tools / 6-layer verification / 92-case eval suite** (from the repo README — the old 5/3/57 site copy is stale). Label Verifier is framed as a proof-of-concept build; the fictional stakeholder names from its take-home brief (Marcus, Jenny, Dave, Sarah) must never appear.
- Timeline ceilings: "Six years shipping systems" (2020–2026), "four years at Charles Schwab" (2022→). Never "eight years."
- Existing design language only: color/tint tokens from `globals.css` (`bg-blue-tint` etc.), `font-display` headings, `rounded-3xl` cards, `Reveal`/`RevealItem` for scroll motion. No new fonts, colors, or motion primitives.
- Section ids stay: `#work`, `#about`, `#contact`; new section id `#offers`. Nav labels change; ids don't.
- External links: `target="_blank" rel="noreferrer"`. Internal links (case studies, back-home): no `target`.
- Commands: `pnpm test` (vitest run), `pnpm test <path>` for one file, `pnpm lint`, `pnpm build`. Run from repo root `/Users/rohanthomas/Website`.
- Commit after every task with a conventional-commit message; end commit bodies with the session trailer used in recent commits (`Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` + `Claude-Session: https://claude.ai/code/session_01SbCVG84H1QdptKuUctef68`).

---

### Task 1: Booking constant + Hero rewrite

**Files:**
- Create: `src/lib/site.ts`
- Modify: `src/components/sections/hero.tsx`
- Modify: `src/components/sections/hero-headline.tsx:28-29` (HEADLINE const only)
- Modify: `src/components/magnetic-link.tsx` (add optional `target`/`rel` props)
- Test: `src/components/sections/hero.test.tsx`, `src/components/sections/hero-headline.test.tsx`

**Interfaces:**
- Produces: `BOOKING_URL: string` exported from `src/lib/site.ts` (value `"https://cal.com/rohanthomas"`) — Tasks 3, 5, 7, 8 import it.
- Produces: `MagneticLink` accepts optional `target?: string` and `rel?: string` props.
- Produces: `HEADLINE` const becomes `"I build AI products that survive production."` (hero-headline word-animation code is otherwise untouched).

- [ ] **Step 1: Write the failing tests** — replace the three tests in `src/components/sections/hero.test.tsx` with:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./hero";
import { BOOKING_URL } from "@/lib/site";

describe("Hero", () => {
  it("renders the headline verbatim", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "I build AI products that survive production.",
      }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow and sub-line", () => {
    render(<Hero />);
    expect(
      screen.getByText(/Rohan Thomas · Austin, TX · booking new projects/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Six years shipping systems where mistakes are expensive/)).toBeInTheDocument();
  });

  it("renders both magnetic CTAs with correct targets", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /see the work/i })).toHaveAttribute("href", "#work");
    const book = screen.getByRole("link", { name: /book an intro call/i });
    expect(book).toHaveAttribute("href", BOOKING_URL);
    expect(book).toHaveAttribute("target", "_blank");
  });
});
```

And in `src/components/sections/hero-headline.test.tsx`, update the accessible-name assertion (line 13) to the new headline:

```tsx
        name: "I build AI products that survive production.",
```

(The second test in that file compares against the `HEADLINE` export and needs no change.)

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/components/sections/hero.test.tsx src/components/sections/hero-headline.test.tsx`
Expected: FAIL — `Cannot find module '@/lib/site'` and/or heading-name mismatches.

- [ ] **Step 3: Implement**

Create `src/lib/site.ts`:

```ts
export const BOOKING_URL = "https://cal.com/rohanthomas";
```

In `src/components/sections/hero-headline.tsx`, change only the `HEADLINE` const:

```ts
export const HEADLINE = "I build AI products that survive production.";
```

In `src/components/magnetic-link.tsx`, pass through optional `target`/`rel`:

```tsx
export function MagneticLink({
  href,
  className,
  children,
  target,
  rel,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { x, y } = useMagnetic(ref, 0.3);
  const labelX = useTransform(x, (v) => v * -0.2);
  const labelY = useTransform(y, (v) => v * -0.2);
  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
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

Replace `src/components/sections/hero.tsx` body:

```tsx
import { MagneticLink } from "@/components/magnetic-link";
import { HeroHeadline } from "@/components/sections/hero-headline";
import { BOOKING_URL } from "@/lib/site";

export function Hero() {
  return (
    <section className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-6 pt-24 pb-16">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
        Rohan Thomas · Austin, TX · booking new projects
      </p>
      <HeroHeadline />
      <p className="mt-6 max-w-xl text-lg text-ink-soft">
        Six years shipping systems where mistakes are expensive — portfolio tools on $3T+ in
        assets at Charles Schwab, 50K packages a day at FedEx, healthcare claims at UnitedHealth.
        Now I bring that bar to AI.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <MagneticLink
          href="#work"
          className="rounded-full bg-ink px-7 py-3.5 font-medium text-paper"
        >
          See the work ↓
        </MagneticLink>
        <MagneticLink
          href={BOOKING_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border-2 border-ink px-7 py-3.5 font-medium text-ink"
        >
          Book an intro call
        </MagneticLink>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/components/sections/hero.test.tsx src/components/sections/hero-headline.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/site.ts src/components/magnetic-link.tsx src/components/sections/hero.tsx src/components/sections/hero-headline.tsx src/components/sections/hero.test.tsx src/components/sections/hero-headline.test.tsx
git commit -m "feat(hero): consulting-storefront positioning — production headline, capability subhead, booking CTA"
```

---

### Task 2: Work section — blurbs, case-study links, intro

**Files:**
- Modify: `src/content/projects.ts`
- Modify: `src/components/project-card.tsx`
- Modify: `src/components/sections/projects.tsx:8-10` (intro copy)
- Test: `src/components/sections/projects.test.tsx`, `src/content/content.test.ts`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `Project` type gains `caseStudy?: string` (internal path). AgentForge → `"/work/agentforge-healthcare"`, Label Verifier → `"/work/alcohol-label-verifier"`. Tasks 7–8 must create pages at exactly these routes.
- Produces: card primary link = `caseStudy ?? live ?? href`; internal when `caseStudy` (no `target`), external otherwise.

- [ ] **Step 1: Write the failing tests** — in `src/components/sections/projects.test.tsx`, replace the `"makes the whole card clickable"` test and add a case-study-link test:

```tsx
  it("makes the whole card clickable via a stretched title link", () => {
    render(<Projects />);
    const title = screen.getByRole("link", { name: /AgentForge Healthcare/ });
    expect(title).toHaveAttribute("href", "/work/agentforge-healthcare");
    expect(title).not.toHaveAttribute("target");
  });

  it("adds an internal case-study link on cards that have one, keeping GitHub", () => {
    render(<Projects />);
    const caseLinks = screen.getAllByRole("link", { name: /case study/i });
    expect(caseLinks.map((a) => a.getAttribute("href"))).toEqual([
      "/work/agentforge-healthcare",
      "/work/alcohol-label-verifier",
    ]);
    for (const p of projects) {
      if (p.caseStudy) expect(screen.getAllByRole("link").map((a) => a.getAttribute("href"))).toContain(p.href);
    }
  });

  it("cards without a case study still open externally", () => {
    render(<Projects />);
    const chat = screen.getByRole("link", { name: /^ChatBridge$/ });
    expect(chat).toHaveAttribute("href", "https://github.com/rohanthomas1202/chatbridge");
    expect(chat).toHaveAttribute("target", "_blank");
  });
```

In `src/content/content.test.ts`, extend the projects describe block:

```ts
  it("case-study paths are internal /work/ routes", () => {
    const withCase = projects.filter((p) => p.caseStudy);
    expect(withCase.length).toBe(2);
    for (const p of withCase) {
      expect(p.caseStudy).toMatch(/^\/work\/[a-z0-9-]+$/);
    }
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/components/sections/projects.test.tsx src/content/content.test.ts`
Expected: FAIL — `caseStudy` doesn't exist; stretched link still points at GitHub.

- [ ] **Step 3: Implement content** — replace `src/content/projects.ts`:

```ts
export type Project = {
  title: string;
  blurb: string;
  stack: string;
  year: string;
  tag: string;
  href: string;
  live?: string;
  caseStudy?: string;
};

export const projects: Project[] = [
  {
    title: "AgentForge Healthcare",
    blurb:
      'Clinical staff can’t trust an agent that’s right "usually." A FHIR-native healthcare agent — 14 tools, a 6-layer verification pipeline, a 92-case eval suite. Every answer checked before a human sees it.',
    stack: "Python · LangGraph · FHIR R4",
    year: "2026",
    tag: "AI Agent",
    href: "https://github.com/rohanthomas1202/agentforge-healthcare",
    caseStudy: "/work/agentforge-healthcare",
  },
  {
    title: "Alcohol Label Verifier",
    blurb:
      "TTB label review is manual, slow, and fine-heavy. This pipeline turns a label upload into a structured compliance verdict in seconds — with a violation report you can act on.",
    stack: "TypeScript · Next.js · Claude Vision",
    year: "2026",
    tag: "Vision AI",
    href: "https://github.com/rohanthomas1202/Alcohol-Label-Verifier",
    live: "https://alcohol-label-verifier-two.vercel.app",
    caseStudy: "/work/alcohol-label-verifier",
  },
  {
    title: "ChatBridge",
    blurb:
      "A chat platform that treats plugins as untrusted code — sandboxed iframe runtime, with chess (Stockfish WASM), weather, and Spotify OAuth plugins shipped to prove the model.",
    stack: "React · Zustand · Mantine · Hono",
    year: "2026",
    tag: "Platform",
    href: "https://github.com/rohanthomas1202/chatbridge",
  },
  {
    title: "Shipyard",
    blurb:
      "An autonomous coding agent on LangGraph + Claude — surgical file edits, sub-agent coordination, injectable context. Everything it taught me feeds the agents I ship for clients.",
    stack: "Python · LangGraph · Claude",
    year: "2026",
    tag: "Dev Tools",
    href: "https://github.com/rohanthomas1202/Shipyard",
  },
  {
    title: "HypeInvest V2",
    blurb:
      "Real-time retail-sentiment index aggregating Reddit, YouTube, Bluesky, and StockTwits into one tradeable signal. (Won HackUTD.)",
    stack: "Next.js 15 · React 19 · FastAPI",
    year: "2026",
    tag: "Fintech",
    href: "https://github.com/rohanthomas1202/HypeInvest-V2",
  },
];
```

In `src/components/sections/projects.tsx`, replace the intro `<p>` (keep everything else):

```tsx
      <p className="mt-3 max-w-md text-ink-soft">
        Selected builds. Each one went from problem to deployed system — here&apos;s what I
        decided and why.
      </p>
```

In `src/components/project-card.tsx`:

1. Replace the `primary` line (line 54):

```tsx
  const primary = project.caseStudy ?? project.live ?? project.href;
  const external = !project.caseStudy;
```

2. Replace the stretched title link (line 99):

```tsx
        <a
          href={primary}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          className="after:absolute after:inset-0"
        >
          {project.title}
        </a>
```

3. In the footer-links `<div>` (line 112), insert a Case study link *before* the GitHub link:

```tsx
        {project.caseStudy && (
          <a
            href={project.caseStudy}
            className={cn("text-ink underline decoration-2 underline-offset-4 hover:opacity-70", accent.deco)}
          >
            Case study{" "}
            <motion.span variants={linkArrow} className="inline-block" aria-hidden>
              →
            </motion.span>
          </a>
        )}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/components/sections/projects.test.tsx src/content/content.test.ts`
Expected: PASS. (The pre-existing `"links every project to GitHub"` test must still pass — GitHub footer links remain on every card.)

- [ ] **Step 5: Commit**

```bash
git add src/content/projects.ts src/components/project-card.tsx src/components/sections/projects.tsx src/components/sections/projects.test.tsx src/content/content.test.ts
git commit -m "feat(work): problem-first blurbs, current AgentForge figures, internal case-study links"
```

---

### Task 3: Offers section

**Files:**
- Create: `src/content/offers.ts`
- Create: `src/components/sections/offers.tsx`
- Create: `src/components/sections/offers.test.tsx`
- Modify: `src/app/page.tsx` (insert `<Offers />` between `<Projects />` and `<About />`)

**Interfaces:**
- Consumes: `BOOKING_URL` from `src/lib/site.ts` (Task 1).
- Produces: `Offer` type `{ title: string; timeline: string; blurb: string }`, `offers: Offer[]` (3 entries), `<Offers />` section with `id="offers"`. Task 6's nav links to `#offers`.

- [ ] **Step 1: Write the failing test** — create `src/components/sections/offers.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Offers } from "./offers";
import { offers } from "@/content/offers";
import { BOOKING_URL } from "@/lib/site";

describe("Offers", () => {
  it("renders the offers section with all three engagements", () => {
    render(<Offers />);
    expect(document.getElementById("offers")).toBeInTheDocument();
    expect(offers.length).toBe(3);
    for (const o of offers) {
      expect(screen.getByText(o.title)).toBeInTheDocument();
      expect(screen.getByText(o.timeline)).toBeInTheDocument();
      expect(screen.getByText(o.blurb)).toBeInTheDocument();
    }
  });

  it("every offer card links to the booking page", () => {
    render(<Offers />);
    const links = screen.getAllByRole("link", { name: /book an intro call/i });
    expect(links.length).toBe(3);
    for (const l of links) {
      expect(l).toHaveAttribute("href", BOOKING_URL);
      expect(l).toHaveAttribute("target", "_blank");
    }
  });

  it("states the production promise in the intro", () => {
    render(<Offers />);
    expect(
      screen.getByText(/Every engagement ends with something running in production — not a deck\./),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/sections/offers.test.tsx`
Expected: FAIL — `Cannot find module './offers'`.

- [ ] **Step 3: Implement** — create `src/content/offers.ts`:

```ts
export type Offer = {
  title: string;
  timeline: string;
  blurb: string;
};

export const offers: Offer[] = [
  {
    title: "AI product sprint",
    timeline: "2–4 weeks",
    blurb:
      "Prototype to production: a scoped build that ships with an eval suite and a deployment — not a demo.",
  },
  {
    title: "Embedded build",
    timeline: "monthly",
    blurb:
      "I join your team and ship the agent, eval, and interface layer alongside your engineers. Short loops, working software every week.",
  },
  {
    title: "Advisory & eval review",
    timeline: "1–2 weeks",
    blurb:
      "Architecture and eval review for AI features already in flight — find the failure modes before your users do.",
  },
];
```

Create `src/components/sections/offers.tsx`:

```tsx
import { offers } from "@/content/offers";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { BOOKING_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const TINTS = ["bg-blue-tint", "bg-green-tint", "bg-violet-tint"];

export function Offers() {
  return (
    <section id="offers" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <Reveal>
        <RevealItem>
          <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Offers
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="mt-3 max-w-md text-ink-soft">
            Three ways to work with me. Every engagement ends with something running in production
            — not a deck.
          </p>
        </RevealItem>
        <RevealItem>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {offers.map((o, i) => (
              <article
                key={o.title}
                className={cn("flex flex-col rounded-3xl p-7 sm:p-8", TINTS[i % TINTS.length])}
              >
                <span className="self-start rounded-full border-2 border-ink/15 bg-paper px-3 py-1 font-mono text-xs text-ink">
                  {o.timeline}
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink">
                  {o.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{o.blurb}</p>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto self-start pt-6 text-sm font-medium text-ink underline decoration-2 underline-offset-4 hover:opacity-70"
                >
                  Book an intro call ↗
                </a>
              </article>
            ))}
          </div>
        </RevealItem>
      </Reveal>
    </section>
  );
}
```

In `src/app/page.tsx`, add the import and render between Projects and About:

```tsx
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Offers } from "@/components/sections/offers";
import { About } from "@/components/sections/about";
import { NowLine } from "@/components/now-line";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <Offers />
      <About />
      <NowLine />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/sections/offers.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/content/offers.ts src/components/sections/offers.tsx src/components/sections/offers.test.tsx src/app/page.tsx
git commit -m "feat(offers): new section — sprint, embedded build, advisory, each with booking CTA"
```

---

### Task 4: Track record — bio, outcome labels, rendered highlights

**Files:**
- Modify: `src/content/experience.ts` (add `label` field per role)
- Modify: `src/components/sections/about.tsx`
- Test: `src/components/sections/about.test.tsx`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `Role` type gains required `label: string` (outcome label rendered as `{label} · {period}`). The `role` field stays for data fidelity but is no longer rendered.

- [ ] **Step 1: Write the failing tests** — replace `src/components/sections/about.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "./about";
import { roles } from "@/content/experience";

describe("About (Track record)", () => {
  it("renders the section with the consulting-framed intro", () => {
    render(<About />);
    expect(document.getElementById("about")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Track record" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/building AI products for domains where wrong answers cost money/),
    ).toBeInTheDocument();
  });

  it("renders one row per role with its headline metric", () => {
    render(<About />);
    for (const r of roles) {
      expect(screen.getByText(r.company)).toBeInTheDocument();
      expect(screen.getByText(r.headline.metric)).toBeInTheDocument();
      expect(screen.getByText(r.headline.label)).toBeInTheDocument();
    }
  });

  it("renders outcome label and period on each row", () => {
    render(<About />);
    for (const r of roles) {
      expect(screen.getByText(`${r.label} · ${r.period}`)).toBeInTheDocument();
    }
  });

  it("renders up to two highlights per role (regression: highlights were dead data)", () => {
    render(<About />);
    for (const r of roles) {
      for (const h of r.highlights.slice(0, 2)) {
        expect(screen.getByText(new RegExp(h.text.slice(0, 40).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))).toBeInTheDocument();
      }
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/components/sections/about.test.tsx`
Expected: FAIL — no `label` field, heading still "About", highlights not rendered.

- [ ] **Step 3: Implement** — in `src/content/experience.ts`, add `label: string` to the `Role` type and a label per role:

```ts
export type Role = {
  company: string;
  role: string;
  label: string;
  location: string;
  period: string;
  current?: boolean;
  headline: { metric: string; label: string };
  highlights: { text: string; metric?: string }[];
};
```

Add to each role (leave every other field exactly as-is):

- Charles Schwab: `label: "Portfolio tooling",`
- FedEx: `label: "Logistics systems",`
- United Healthcare: `label: "Claims platform",`

Replace `src/components/sections/about.tsx`:

```tsx
import { roles } from "@/content/experience";
import { Reveal, RevealItem } from "@/components/motion/reveal";

const ROW_ACCENTS: Record<string, string> = {
  "Charles Schwab": "var(--blue)",
  FedEx: "var(--tangerine)",
  "United Healthcare": "var(--green)",
};

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <Reveal>
        <RevealItem>
          <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Track record
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink">
            I&apos;m Rohan — an engineer in Austin, TX building AI products for domains where
            wrong answers cost money. I spent four years on portfolio tools at Charles Schwab,
            where a bad deploy touches $3T+ in assets; that&apos;s the reliability bar I bring to
            AI. I work best embedded with small teams: short loops, working software every week,
            no decks.
          </p>
        </RevealItem>
        <RevealItem>
          <ul className="mt-12 border-t border-line">
            {roles.map((r) => (
              <li
                key={r.company}
                style={{ "--row-accent": ROW_ACCENTS[r.company] ?? "var(--blue)" } as React.CSSProperties}
                className="exp-row -mx-4 border-b border-line px-4 py-5"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="w-44 shrink-0 font-display text-lg font-bold text-ink">
                    {r.company}
                  </span>
                  <span className="text-sm text-ink-soft">
                    {r.label} · {r.period}
                  </span>
                  <span className="sm:ml-auto sm:text-right">
                    <span className="exp-metric font-display text-2xl font-bold tracking-tight text-ink">
                      {r.headline.metric}
                    </span>{" "}
                    <span className="text-sm text-ink-soft">{r.headline.label}</span>
                  </span>
                </div>
                <ul className="mt-3 flex flex-col gap-1.5 sm:pl-[12.5rem]">
                  {r.highlights.slice(0, 2).map((h) => (
                    <li key={h.text} className="text-sm leading-relaxed text-ink-soft">
                      {h.text}
                      {h.metric ? <span className="font-medium text-ink"> {h.metric}</span> : null}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </RevealItem>
      </Reveal>
    </section>
  );
}
```

(`sm:pl-[12.5rem]` = the `w-44` company column (11rem) + `gap-6` (1.5rem), so highlights align under the label column.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/components/sections/about.test.tsx src/content/content.test.ts`
Expected: PASS — including the untouched content tests (the `role` field still exists).

- [ ] **Step 5: Commit**

```bash
git add src/content/experience.ts src/components/sections/about.tsx src/components/sections/about.test.tsx
git commit -m "feat(track-record): consulting bio, outcome labels, render previously-dead highlights"
```

---

### Task 5: Now line + Footer conversion mechanics

**Files:**
- Modify: `src/lib/now.ts:1` (NOW_PHRASE only)
- Modify: `src/components/sections/footer.tsx`
- Test: `src/components/sections/footer.test.tsx`

**Interfaces:**
- Consumes: `BOOKING_URL` from `src/lib/site.ts` (Task 1).
- Produces: nothing consumed downstream.

- [ ] **Step 1: Write the failing tests** — add to `src/components/sections/footer.test.tsx` (keep the three existing tests; add these two and update nothing else):

```tsx
import { BOOKING_URL } from "@/lib/site";

  it("renders the Work with me eyebrow and reply promise", () => {
    render(<Footer />);
    expect(screen.getByText("Work with me")).toBeInTheDocument();
    expect(
      screen.getByText(/I reply within 24 hours, usually with questions\./),
    ).toBeInTheDocument();
  });

  it("offers a booking link as the email alternative", () => {
    render(<Footer />);
    const book = screen.getByRole("link", { name: /book a 30-minute intro call/i });
    expect(book).toHaveAttribute("href", BOOKING_URL);
    expect(book).toHaveAttribute("target", "_blank");
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/components/sections/footer.test.tsx`
Expected: FAIL — "Work with me" not found.

- [ ] **Step 3: Implement** — in `src/lib/now.ts` line 1:

```ts
export const NOW_PHRASE = "building AI agents · taking on new projects";
```

In `src/components/sections/footer.tsx`: change the eyebrow text `Contact` → `Work with me`, and insert a new `<RevealItem>` between the email row and the bottom-bar `<RevealItem>`:

```tsx
        <RevealItem>
          <p className="mt-6 max-w-xl text-ink-soft">
            Tell me what you&apos;re building and where it&apos;s stuck — I reply within 24 hours,
            usually with questions.
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm font-medium text-ink underline decoration-2 underline-offset-4 hover:opacity-70"
          >
            Or skip the email — book a 30-minute intro call ↗
          </a>
        </RevealItem>
```

Add the import at the top: `import { BOOKING_URL } from "@/lib/site";`

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/components/sections/footer.test.tsx src/lib/now.test.ts`
Expected: PASS (5 footer tests; now tests unaffected — they only cover `formatLastCommit`).

- [ ] **Step 5: Commit**

```bash
git add src/lib/now.ts src/components/sections/footer.tsx src/components/sections/footer.test.tsx
git commit -m "feat(contact): Work with me framing, 24h reply promise, booking link, availability in Now line"
```

---

### Task 6: Nav — Offers link, Track record label, root-relative anchors

**Files:**
- Modify: `src/components/nav.tsx:3-7`
- Test: `src/components/nav.test.tsx`

**Interfaces:**
- Consumes: `#offers` section (Task 3).
- Produces: nav anchors are root-relative (`/#work`) so they also work from `/work/*` case-study pages (Tasks 7–8).

- [ ] **Step 1: Write the failing test** — replace the anchor test in `src/components/nav.test.tsx`:

```tsx
  it("renders root-relative anchor links to all four sections", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /^work$/i })).toHaveAttribute("href", "/#work");
    expect(screen.getByRole("link", { name: /offers/i })).toHaveAttribute("href", "/#offers");
    expect(screen.getByRole("link", { name: /track record/i })).toHaveAttribute("href", "/#about");
    expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute("href", "/#contact");
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/nav.test.tsx`
Expected: FAIL — hrefs are `#work` etc., no Offers link.

- [ ] **Step 3: Implement** — in `src/components/nav.tsx`, replace the links array:

```tsx
const links = [
  { href: "/#work", label: "Work" },
  { href: "/#offers", label: "Offers" },
  { href: "/#about", label: "Track record" },
  { href: "/#contact", label: "Contact" },
];
```

(Root-relative `href="/#work"` is a same-document fragment jump when already on `/`, and a normal navigation home from `/work/*` pages. Plain `<a>` stays — no `Link` needed for hash targets.)

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/nav.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/nav.tsx src/components/nav.test.tsx
git commit -m "feat(nav): Offers link, Track record label, root-relative anchors for case-study pages"
```

---

### Task 7: CaseStudy component + AgentForge page

**Files:**
- Create: `src/components/case-study.tsx`
- Create: `src/app/work/agentforge-healthcare/page.tsx`
- Create: `src/components/case-study.test.tsx`

**Interfaces:**
- Consumes: `BOOKING_URL` (Task 1); route path promised by Task 2 (`/work/agentforge-healthcare`).
- Produces: `CaseStudyData` type + `CaseStudy` component, reused verbatim by Task 8:

```ts
export type CaseStudyData = {
  tag: string;
  title: string;
  dek: string;
  tintClass: string;   // e.g. "bg-blue-tint"
  tldr: { problem: string; built: string; proof: string };
  context: string[];   // paragraphs
  built: string[];     // paragraphs
  decisions: { decision: string; why: string }[];
  proves: string;
  github: string;
  live?: string;
  extraLinks?: { label: string; href: string }[];
};
```

- [ ] **Step 1: Write the failing test** — create `src/components/case-study.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AgentForgePage from "@/app/work/agentforge-healthcare/page";
import { BOOKING_URL } from "@/lib/site";

describe("AgentForge case study", () => {
  it("renders the title, dek, and TL;DR strip", () => {
    render(<AgentForgePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "AgentForge Healthcare" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Problem")).toBeInTheDocument();
    expect(screen.getByText("Built")).toBeInTheDocument();
    expect(screen.getByText("Proof")).toBeInTheDocument();
  });

  it("renders decisions as decision → why pairs", () => {
    render(<AgentForgePage />);
    expect(screen.getByRole("heading", { name: "Decisions" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 }).length).toBeGreaterThanOrEqual(3);
  });

  it("demotes GitHub to a verify link and keeps the booking CTA", () => {
    render(<AgentForgePage />);
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/rohanthomas1202/agentforge-healthcare",
    );
    expect(screen.getByRole("link", { name: /book an intro call/i })).toHaveAttribute(
      "href",
      BOOKING_URL,
    );
    expect(screen.getByRole("link", { name: /rohan thomas/i })).toHaveAttribute("href", "/");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/case-study.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement** — create `src/components/case-study.tsx`:

```tsx
import Link from "next/link";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { BOOKING_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

export type CaseStudyData = {
  tag: string;
  title: string;
  dek: string;
  tintClass: string;
  tldr: { problem: string; built: string; proof: string };
  context: string[];
  built: string[];
  decisions: { decision: string; why: string }[];
  proves: string;
  github: string;
  live?: string;
  extraLinks?: { label: string; href: string }[];
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <RevealItem>
      <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
      {children}
    </RevealItem>
  );
}

export function CaseStudy({ data }: { data: CaseStudyData }) {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <Reveal>
        <RevealItem>
          <Link href="/" className="font-mono text-xs uppercase tracking-widest text-ink-soft hover:text-ink">
            ← Rohan Thomas
          </Link>
        </RevealItem>
        <RevealItem>
          <span className="mt-8 inline-block rounded-full border-2 border-ink/15 bg-paper px-3 py-1 font-mono text-xs text-ink">
            {data.tag}
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {data.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{data.dek}</p>
        </RevealItem>
        <RevealItem>
          <dl className={cn("mt-10 grid grid-cols-1 gap-6 rounded-3xl p-7 sm:grid-cols-3 sm:p-8", data.tintClass)}>
            {(
              [
                ["Problem", data.tldr.problem],
                ["Built", data.tldr.built],
                ["Proof", data.tldr.proof],
              ] as const
            ).map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-xs uppercase tracking-widest text-ink-soft">{k}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </RevealItem>
        <Section title="Context">
          {data.context.map((p) => (
            <p key={p} className="mt-4 leading-relaxed text-ink">
              {p}
            </p>
          ))}
        </Section>
        <Section title="What I built">
          {data.built.map((p) => (
            <p key={p} className="mt-4 leading-relaxed text-ink">
              {p}
            </p>
          ))}
        </Section>
        <Section title="Decisions">
          <ul className="mt-2">
            {data.decisions.map((d) => (
              <li key={d.decision} className="mt-6">
                <h3 className="font-display text-lg font-bold text-ink">{d.decision}</h3>
                <p className="mt-1 leading-relaxed text-ink-soft">{d.why}</p>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="What this proves">
          <p className="mt-4 leading-relaxed text-ink">{data.proves}</p>
        </Section>
        <RevealItem>
          <div className="mt-14 flex flex-wrap items-center gap-6 border-t border-line pt-6 text-sm font-medium">
            <a href={data.github} target="_blank" rel="noreferrer" className="text-ink underline decoration-2 underline-offset-4 hover:opacity-70">
              GitHub ↗
            </a>
            {data.live && (
              <a href={data.live} target="_blank" rel="noreferrer" className="text-ink underline decoration-2 underline-offset-4 hover:opacity-70">
                Live demo ↗
              </a>
            )}
            {data.extraLinks?.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-ink underline decoration-2 underline-offset-4 hover:opacity-70">
                {l.label} ↗
              </a>
            ))}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noreferrer"
              className="ml-auto rounded-full bg-ink px-6 py-3 font-medium text-paper no-underline"
            >
              Book an intro call
            </a>
          </div>
        </RevealItem>
      </Reveal>
    </main>
  );
}
```

Create `src/app/work/agentforge-healthcare/page.tsx`:

```tsx
import type { Metadata } from "next";
import { CaseStudy, type CaseStudyData } from "@/components/case-study";

const data: CaseStudyData = {
  tag: "AI Agent",
  title: "AgentForge Healthcare",
  dek: "A healthcare agent that has to be right — 14 tools over live EHR data, six verification layers on every response, and a 92-case eval suite published open source.",
  tintClass: "bg-blue-tint",
  tldr: {
    problem: "Clinical staff can't act on an agent that's right “usually.” In healthcare, a hallucinated drug interaction is a liability, not a bug.",
    built: "A LangGraph agent over OpenEMR's FHIR R4 API — 14 tools from patient summaries to dosage checks, behind a 6-layer verification pipeline.",
    proof: "92-case eval suite — happy path, edge cases, 11 adversarial (prompt injection, role overrides), multi-step — open source under MIT.",
  },
  context: [
    "Electronic health records hold the data clinicians need, but getting answers out of them is slow. An AI agent can read FHIR APIs and answer in seconds — the problem is trust. A wrong answer about drug interactions, allergies, or dosage isn't a UX bug; it's a safety incident.",
    "AgentForge is my answer to the question every AI-in-healthcare team faces: how do you let a language model near patient data without letting it improvise?",
  ],
  built: [
    "A LangGraph agent that queries a real EHR (OpenEMR) through its OAuth2-authenticated FHIR R4 API plus custom MariaDB tables. Fourteen tools cover patient summaries, drug interactions, FDA safety and recalls, allergy cross-reactivity, lab results, care gaps, insurance coverage, appointments, and clinical trials.",
    "The core of the system is what happens after the model answers. Every response passes a 6-layer verification pipeline: drug-safety contradiction detection, allergy cross-reactivity checks, confidence scoring, claim-by-claim grounding against raw tool outputs (hallucination detection), PHI detection, and FDA dosage-limit checks. Deployed on AWS as a three-container Docker stack with LangSmith observability.",
  ],
  decisions: [
    {
      decision: "Verification lives outside the model",
      why: "Prompting a model to be careful isn't a safety property. Every response is checked by six independent verifiers after generation — and each verifier fails safe, so a crashed check degrades to a warning instead of blocking care.",
    },
    {
      decision: "The eval suite is the spec",
      why: "92 test cases across happy-path, edge, adversarial, and multi-step categories define what 'working' means — including 11 attacks like prompt injection and role overrides. The dataset is published open source (MIT), because an eval you won't show anyone is marketing.",
    },
    {
      decision: "An EHR abstraction layer from day one",
      why: "Tools talk to a BaseEHRProvider interface, not to OpenEMR. Real and mock clients are interchangeable, and the system ports to Epic or Cerner without touching tool code.",
    },
    {
      decision: "Centralized input sanitization",
      why: "All 14 tools pass inputs through one sanitizer — defense-in-depth against prompt injection and SQL injection, in one place instead of fourteen.",
    },
    {
      decision: "PHI has a hard line",
      why: "A detected SSN blocks the response outright; other PHI (phone, email, address, MRN) warns. Not every violation deserves the same response — but some do.",
    },
  ],
  proves:
    "If your AI product operates where a wrong answer costs money or safety — healthcare, finance, compliance — this is the discipline I bring: verification layers outside the model, adversarial evals before launch, and abstraction boundaries that survive a vendor change.",
  github: "https://github.com/rohanthomas1202/agentforge-healthcare",
  live: "http://54.236.183.203",
  extraLinks: [
    { label: "Eval dataset", href: "https://github.com/rohanthomas1202/healthcare-agent-eval" },
  ],
};

export const metadata: Metadata = {
  title: "AgentForge Healthcare — case study",
  description: data.dek,
};

export default function AgentForgeCaseStudy() {
  return <CaseStudy data={data} />;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/case-study.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/case-study.tsx src/app/work/agentforge-healthcare/page.tsx src/components/case-study.test.tsx
git commit -m "feat(case-study): shared CaseStudy layout + AgentForge Healthcare page"
```

---

### Task 8: Label Verifier case-study page

**Files:**
- Create: `src/app/work/alcohol-label-verifier/page.tsx`
- Test: append to `src/components/case-study.test.tsx`

**Interfaces:**
- Consumes: `CaseStudy` + `CaseStudyData` from Task 7; route path promised by Task 2 (`/work/alcohol-label-verifier`).

- [ ] **Step 1: Write the failing test** — append to `src/components/case-study.test.tsx`:

```tsx
import LabelVerifierPage from "@/app/work/alcohol-label-verifier/page";

describe("Label Verifier case study", () => {
  it("renders title, live demo, GitHub, and booking links", () => {
    render(<LabelVerifierPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Alcohol Label Verifier" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /live demo/i })).toHaveAttribute(
      "href",
      "https://alcohol-label-verifier-two.vercel.app",
    );
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/rohanthomas1202/Alcohol-Label-Verifier",
    );
    expect(screen.getByRole("link", { name: /book an intro call/i })).toHaveAttribute(
      "href",
      BOOKING_URL,
    );
  });

  it("frames the build honestly as a proof of concept", () => {
    render(<LabelVerifierPage />);
    expect(screen.getByText(/proof of concept/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/case-study.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement** — create `src/app/work/alcohol-label-verifier/page.tsx`:

```tsx
import type { Metadata } from "next";
import { CaseStudy, type CaseStudyData } from "@/components/case-study";

const data: CaseStudyData = {
  tag: "Vision AI",
  title: "Alcohol Label Verifier",
  dek: "TTB compliance checks that used to be done by eye — from label upload to a field-by-field verdict in seconds.",
  tintClass: "bg-tangerine-tint",
  tldr: {
    problem: "TTB label approval means proving the artwork matches the application — brand, class, ABV, net contents, government warning. By eye, it's slow and error-prone.",
    built: "Claude vision extracts what's printed on the label; deterministic TypeScript does every comparison. Single-label and batch-CSV modes.",
    proof: "Verdicts in ~2–4 seconds against a sub-5s target; every matching rule unit-tested without a single API call.",
  },
  context: [
    "Submitting an alcohol label for TTB approval means proving that what's printed on the bottle matches what's on the application: brand name, class/type, alcohol content, net contents, producer, and the exact government warning — down to the ALL-CAPS, bold “GOVERNMENT WARNING:” prefix. Reviewers do this by eye, and mistakes mean rejections and fines.",
    "I built this as a proof of concept against a realistic TTB review brief: could the visual comparison be automated without handing the compliance decision to a black box?",
  ],
  built: [
    "An upload flow where Claude's vision model does exactly one job: extract what is printed on the label into structured JSON via tool use. All matching happens in pure TypeScript — case- and punctuation-insensitive text comparison, numeric parsing so “0.75 L” matches “750 mL” and “45%” matches “45.0% Alc./Vol.”, and a government-warning validator that checks the body word-for-word plus the prefix's capitalization and bold weight separately.",
    "Batch mode runs a CSV of applications against a folder of label images, five verifications in flight with live progress, and exports regulator-friendly CSV results. Image-quality problems — glare, blur, skew — surface as review reasons instead of silent failures.",
  ],
  decisions: [
    {
      decision: "The AI extracts; the code decides",
      why: "Claude never judges compliance — it only reads the label. Every matching rule is deterministic TypeScript, unit-tested against fixed inputs with zero API calls, and tunable without touching a prompt. When a regulator asks why a label failed, there's a rule to point to.",
    },
    {
      decision: "Uncertainty demotes to review, never to reject",
      why: "A glared or blurry photo may have corrupted extraction. Those cases return a “review” verdict with reasons — the tool preserves human judgment instead of manufacturing false rejections.",
    },
    {
      decision: "Latency was engineered, not hoped for",
      why: "The brief had a hard sub-5-second requirement. Prompt caching on the system prompt and tool schema brings verdicts to ~3–4s cold and ~2s warm.",
    },
    {
      decision: "Minimal integration surface",
      why: "One outbound API call per verification, no database, no stored images or PII — processed in memory and discarded. The whole deployment is one Next.js app and one environment variable.",
    },
    {
      decision: "Documented trade-offs over hidden ones",
      why: "The README states what the system can't do — black-box extraction risk, canonical-warning-only matching — with the mitigation for each. Compliance software earns trust by being explicit about its limits.",
    },
  ],
  proves:
    "This is how I turn a regulatory workflow into software: find the deterministic core, keep the model at the edges, test everything that can be tested, and surface uncertainty instead of hiding it. The same shape applies to any document-heavy compliance process.",
  github: "https://github.com/rohanthomas1202/Alcohol-Label-Verifier",
  live: "https://alcohol-label-verifier-two.vercel.app",
};

export const metadata: Metadata = {
  title: "Alcohol Label Verifier — case study",
  description: data.dek,
};

export default function LabelVerifierCaseStudy() {
  return <CaseStudy data={data} />;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/case-study.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/app/work/alcohol-label-verifier/page.tsx src/components/case-study.test.tsx
git commit -m "feat(case-study): Alcohol Label Verifier page — POC framing, decisions from the repo's own trade-offs"
```

---

### Task 9: Metadata + OG image

**Files:**
- Modify: `src/app/layout.tsx:17-43` (description const + metadata object)
- Modify: `src/app/opengraph-image.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing consumed downstream. (No unit tests assert metadata; verification is `pnpm build` in Task 10.)

- [ ] **Step 1: Implement layout metadata** — in `src/app/layout.tsx`, replace the `description` const and the title/OG/twitter/keywords fields:

```ts
const description =
  "I design and ship production AI systems — agents, evals, and the interfaces around them — for domains where wrong answers cost money. Austin, TX. Booking new projects.";
```

```ts
  title: {
    default: "Rohan Thomas — AI products that survive production",
    template: "%s — Rohan Thomas",
  },
  description,
  keywords: ["Rohan Thomas", "AI consultant", "AI agents", "LLM evals", "AI product engineering", "Austin"],
```

And in `openGraph`/`twitter`, set `title: "Rohan Thomas — AI products that survive production"` (descriptions already reference the const).

- [ ] **Step 2: Implement OG image** — in `src/app/opengraph-image.tsx`, update alt (line 3), eyebrow (line 26), and headline (line 29):

```tsx
export const alt = "Rohan Thomas — AI products that survive production";
```

```tsx
          Rohan Thomas · Austin, TX · booking new projects
```

```tsx
          I build AI products that survive production.
```

(Everything else — palette dots, layout, `thomasrohan.com` — unchanged.)

- [ ] **Step 3: Verify with a build**

Run: `pnpm build`
Expected: build succeeds; `/`, `/work/agentforge-healthcare`, `/work/alcohol-label-verifier` all listed as static routes.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/opengraph-image.tsx
git commit -m "feat(meta): storefront title, offer-led description, OG image copy"
```

---

### Task 10: Full verification

**Files:** none created — verification only.

- [ ] **Step 1: Full test suite**

Run: `pnpm test`
Expected: all files pass, zero failures.

- [ ] **Step 2: Lint**

Run: `pnpm lint`
Expected: no errors.

- [ ] **Step 3: Build**

Run: `pnpm build`
Expected: success, 3 static pages (`/`, two `/work/*` routes) plus icon/OG assets.

- [ ] **Step 4: Browser verification** (use the superpowers:verification-before-completion discipline; drive the real flow)

Start `pnpm dev`, then verify in a browser (Playwright MCP tools are available):
1. `/` renders hero with new headline, eyebrow says "booking new projects", CTAs = "See the work ↓" + "Book an intro call" (cal.com href).
2. Section order: Work → Offers → Track record → Now line → Work with me footer. Nav shows Work / Offers / Track record / Contact and each link scrolls.
3. AgentForge and Label Verifier cards navigate to their case-study pages (same tab); other cards open GitHub in a new tab. "Case study →" links present on exactly those two cards.
4. Case-study pages: back link returns home, TL;DR strip renders, footer has GitHub/Live demo/booking links. Nav links from a case-study page navigate back to home sections.
5. Track record rows show outcome labels and two highlight lines each.
6. Footer shows the reply promise + "book a 30-minute intro call" link.
7. No console errors on any page.

- [ ] **Step 5: Report** — summarize verification results to the user; do not claim success without the outputs above.
