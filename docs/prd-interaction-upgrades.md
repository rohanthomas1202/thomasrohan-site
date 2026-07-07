# PRD: Interaction & Content Upgrades

Five features from the July 2026 deep-research pass (18 adversarially verified claims; sources: Next.js view-transitions guide, MDN scroll-driven animations, motion.dev performance docs, Chrome view-transitions-2025, recruiter-behavior studies). No feature may violate the two global constraints below.

## Global constraints (apply to every feature)

- **Compositor-only animation.** Animate `transform` and `opacity` only. Never animate layout properties (height, padding, top) or paint properties (background-color on large surfaces, box-shadow directly — fake shadows with a pre-rendered `::after` layer whose *opacity* animates).
- **Reduced motion.** `MotionConfig reducedMotion="user"` (already in `src/components/motion/motion-provider.tsx`) covers all motion/react transform animations. CSS-only effects must sit behind the existing kill-switch in `globals.css` or their own `@media (prefers-reduced-motion: reduce)` rule. View-transition pseudo-elements are NOT covered by the existing `*` kill-switch and need an explicit rule.
- **Existing vocabulary.** All springs come from `SPRING` in `src/components/motion/springs.ts` (add new entries there + assert them in `springs.test.ts`). All colors come from the CSS vars in `globals.css` (paper/ink/line + 5 accents + tints). Fonts: `font-display` (Bricolage) for headings, `font-mono` for meta text.
- **Tests + build green after every feature.** `npx vitest run` and `npm run build` must pass before a feature is considered done. New logic gets tests; pure functions preferred so jsdom can test them.

## Current state (inventory — do not rebuild these)

- `src/components/project-card.tsx` — motion.article with `hidden/visible/hover` variants (entrance tilt, arrow swap on hover), `--card-accent` CSS var, focus-tracking state.
- `src/components/motion/` — `springs.ts` (shared physics), `reveal.tsx` (`Reveal`/`RevealItem` staggerChildren 0.07), `use-magnetic.ts` (pointer-tracking motion values; guards: `prefers-reduced-motion`, `pointer: coarse`), `motion-provider.tsx`.
- `src/components/magnetic-link.tsx` — magnetic anchor used by hero CTAs.
- `src/components/case-study.tsx` — shared case-study renderer (`CaseStudyData`), used by all 7 `/work/*` pages.
- `src/app/layout.tsx` — fonts, metadata, `<MotionProvider><Nav/>{children}</MotionProvider>`.
- Internal links (card arrow, "Case study →", case-study back link) are plain `<a>` — full page reloads today.
- `vitest.setup.ts` stubs `matchMedia` (always `matches: false`) and `IntersectionObserver`.

## Implementation order

F1 → F4 → F2 → F5 → F3. F1/F4/F2/F5 all touch `project-card.tsx` (sequential, no worktrees). F2 must precede F5 because F2 converts the arrow `<a>` to a client-side `Link` and F5 then magnetizes that final element. F3 is independent and goes last.

---

## F1 — Card hover depth (lift + accent shadow + arrow press)

**Goal.** Cards physically respond to hover: lift, straighten, and cast an accent-tinted shadow. Research spec: 4–8px translateY lift, ~1.02 scale, shadow increase, 200–300ms ease-out.

**UX spec.**
- Hover variant of the card gains `y: -6` and `scale: 1.02` (keep existing `rotate: 0`), spring `SPRING.hover`. Entrance (`visible`) re-states `scale: 1` and the hover variant's `y`/`opacity` interplay must preserve the existing focus-routing comment (missing props fall back to `hidden`).
- Shadow: new `.project-card::after` in `globals.css` — `inset: 0`, same `border-radius` (1.5rem, matches rounded-3xl), `box-shadow: 0 16px 40px -16px color-mix(in srgb, var(--card-accent) 45%, transparent)`, `opacity: 0`, `transition: opacity 250ms var(--ease-expo)`, `pointer-events: none`, `z-index: -1`. `.project-card:hover::after, .project-card:focus-within::after { opacity: 1 }`, wrapped in `@media (hover: hover)` for the hover half. Card needs `position: relative` (already has `relative`)? Verify; if `z-index: -1` clips under the tint background, put `::after` behind via `z-index: 0` on card content instead — pick whichever renders the shadow outside the card edges correctly.
- Arrow button press: `whileTap={{ scale: 0.9, transition: SPRING.press }}` on the arrow anchor.

**A11y/perf.** Shadow animates via opacity (compositor-safe). Global CSS kill-switch zeroes the transition under reduced motion; motion/react handles the transforms. No layout properties animated.

**Tests.** Extend `projects.test.tsx` or a card test: hover variant contains `y: -6` and `scale: 1.02` (export `cardVariants` or assert via rendered component props); globals.css is not unit-testable — acceptance is visual.

**Acceptance.** Hovering any card lifts it with an accent shadow; keyboard focus into the card shows the same depth; no test/build regressions.

---

## F4 — Scroll polish (grid column stagger + case-study reading progress)

**Goal.** Grid rows cascade in left-to-right instead of landing simultaneously; case-study pages get a thin accent reading-progress bar.

**UX spec — stagger.**
- New pure helper `src/lib/grid.ts`: `columnPosition(index: number, projects: Project[]): number` — walks the same span math as `projects.test.tsx` (featured||wide → 3, else 2, 6-col rows) and returns the card's 0-based position within its row.
- `ProjectCard` applies `delay: columnPosition * 0.08` to the `visible` variant's transition (`{ ...SPRING.reveal, delay }`).
- Unit tests for `columnPosition` against the current 7-project packing: expect positions `[0,1,0,1,2,0,1]`.

**UX spec — reading progress.**
- New client component `src/components/reading-progress.tsx`: `useScroll().scrollYProgress` bound directly to `scaleX` (no spring — direct binding stays accurate and is scroll-positional, not autonomous motion) on a `fixed top-0 left-0 right-0 h-1 origin-left z-[60]` bar, `aria-hidden`, `pointer-events-none`.
- Color: the case-study accent. New pure helper `accentFromTint(tintClass: string): string` in `src/lib/utils.ts` or `src/lib/grid.ts` — maps `"bg-blue-tint"` → `"var(--blue)"` (all 5 accents; unknown → `"var(--ink)"`). Unit-test all 6 cases.
- Mount inside `CaseStudy` (`src/components/case-study.tsx`), passing the resolved color. Home page gets no bar.
- Reduced motion: bar stays (it is a progress indicator driven by scroll position, not decorative motion); no smoothing spring means nothing to disable.

**Tests.** `columnPosition` positions; `accentFromTint` mapping; case-study test asserts the progress bar element renders with the accent color style.

**Acceptance.** Rows visibly cascade on scroll-in; every `/work/*` page shows a top progress bar in its accent; tests/build green.

---

## F2 — View transitions (card → case-study morph)

**Goal.** Clicking a card's arrow or "Case study →" morphs the card title into the case-study `<h1>`; everything else crossfades. Back navigation morphs in reverse. Bonus: internal navigation becomes client-side (currently full page loads).

**Architecture.**
- Add dependency `next-view-transitions` (^0.3.x — stable, MIT; chosen over React's `<ViewTransition>` because that requires the experimental `viewTransition` flag on a production site).
- `src/app/layout.tsx`: wrap per the library README — `<ViewTransitions>` around the `<html>` element in the root layout.
- Replace internal `<a>`s with `Link` from `next-view-transitions`: card arrow (only when `!external` — keep plain `<a target="_blank">` for external), card "Case study →", and the case-study back link (currently `next/link` — swap to the library's `Link`, same API).
- **Morph names.** Card `<h3>` gets inline style `viewTransitionName: "cs-" + slug` where `slug = project.caseStudy.split("/").pop()`. `CaseStudyData` gains required `slug: string`; each of the 7 `/work/*` pages sets it to its directory name (`agentforge-healthcare`, `alcohol-label-verifier`, `truthlayer`, `shipyard`, `chatbridge`, `pokerstats`, `hypeinvest`). `CaseStudy` puts `viewTransitionName: "cs-" + data.slug` on the `<h1>`. Names are unique per page (7 distinct slugs on home; 1 on each case-study page).
- **Reduced motion + duration.** In `globals.css`:
  ```css
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation-duration: 250ms; }
  @media (prefers-reduced-motion: reduce) {
    ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation-duration: 0.01ms !important; }
  }
  ```
- Unsupported browsers: `Link` still performs normal client-side navigation (verified graceful degradation).

**A11y/perf.** Morph + crossfade only — no directional slides (highest motion-sensitivity trigger, per verified Next.js guidance). 250ms cap because view transitions can't be interrupted mid-flight (Motion tier-list caveat).

**Tests.** `content.test.ts`: every project's `caseStudy` tail is a nonempty kebab slug (exists). `case-study.test.tsx`: `<h1>` carries `view-transition-name` matching `cs-<slug>`. `projects.test.tsx`: card title carries `view-transition-name` matching its `caseStudy` slug; arrow for internal links has no `target` (exists) and still resolves to `/work/*`. If `next-view-transitions` `Link` needs a router in jsdom, mock `next/navigation`'s router minimally in the affected test files (there may be an existing pattern in `nav.test.tsx`).

**Acceptance.** In Chrome/Safari/Firefox current: card title morphs into the case-study title on click and back; other browsers navigate normally; reduced-motion users get an instant swap; tests/build green.

---

## F5 — Cursor identity (magnetic card arrows + site cursor dot)

**Goal.** Extend the site's existing magnetism to the card arrow buttons, and add a custom cursor dot that adopts each card's accent — the landonorris.com signature, built with the guards the site already uses.

**UX spec — magnetic arrows.**
- Card arrow anchor becomes a magnetic element: `useMagnetic(ref, 0.25)` (hook already guards reduced-motion + coarse pointers), `style={{ x, y }}` on the (motion) `Link`/`a` from F2. Inner arrow-swap spans unchanged. Combined with F1's `whileTap`.

**UX spec — cursor dot.**
- New client component `src/components/cursor-dot.tsx`, mounted once in `layout.tsx` inside `MotionProvider`.
- **Activation guards (all required):** `matchMedia("(pointer: fine)")`, `matchMedia("(hover: hover)")`, and NOT `prefers-reduced-motion` (use `usePrefersReducedMotion` from `src/lib/use-prefers-reduced-motion.ts`). When inactive, render `null` — native cursor untouched. Note: the vitest `matchMedia` stub returns `matches: false`, so the component renders `null` in jsdom by default — test exactly that, and test helpers separately.
- Visual: a `fixed` 12px ring (`border-2`, `border-ink`, `rounded-full`, `pointer-events-none`, `z-[100]`, `mix-blend-mode: normal`) tracking the pointer via `useMotionValue` + `useSpring` with a new `SPRING.cursor = { stiffness: 600, damping: 40 }` (add to springs.ts + springs.test.ts) — stiff enough to never feel laggy.
- Interactive state: on `pointerover`, if `target.closest("a, button")` → scale ring to 2.2 and set its border color to the accent: new pure helper `cursorAccent(el: Element): string` in `src/lib/cursor.ts` — walks `el.closest(".project-card")`, reads its inline `--card-accent` custom property, falls back to `"var(--ink)"`. On `pointerout` of interactive → revert.
- While active, hide the native cursor: toggle a `cursor-none` class on `document.documentElement`; `globals.css`: `html.cursor-none, html.cursor-none * { cursor: none }`. Remove the class on unmount/deactivation and when the pointer leaves the document (also hide the dot via opacity 0).
- Do NOT add magnetic snap-to-target for the dot (Motion+ Cursor is a paid product; the DIY dot + magnetic targets already reads as one system).

**Tests.** `cursorAccent`: element inside a mocked `.project-card` with inline `--card-accent` returns it; element outside returns `var(--ink)`. `cursor-dot.test.tsx`: renders `null` under the default jsdom matchMedia stub. Springs test gains the `cursor` entry.

**Acceptance.** On a fine-pointer/hover device without reduced motion: a single accent-aware dot replaces the cursor, grows over links/buttons, and the card arrows lean toward the pointer. Touch devices and reduced-motion users see zero change; tests/build green.

---

## F3 — GitHub activity strip ("Recently shipped")

**Goal.** Surface live proof-of-work: the latest public commits, refreshed hourly, failing invisibly. Verified rationale: live GitHub activity adds credibility with technical reviewers; recruiters spend ~30s, so this is one compact strip, not a dashboard.

**Architecture.**
- `src/lib/github.ts`:
  - Types for the subset of the GitHub Events API used (`PushEvent` → `repo.name`, `payload.commits[].{message, sha}`, `created_at`).
  - `shapeCommits(events: unknown[], limit = 3): RecentCommit[]` — pure. Filter `type === "PushEvent"`, take each event's **last** commit (most recent in push), first line of message truncated to 80 chars, dedupe by repo (breadth over depth), sort newest-first, cap at `limit`. `RecentCommit = { repo: string /* short name, no owner */, message: string, url: string /* https://github.com/<full>/commit/<sha> */, iso: string }`.
  - `relativeTime(iso: string, now: Date): string` — pure: "just now", "N min ago", "N h ago", "N d ago", falls back to `Intl` month+day past 14 days.
  - `getRecentCommits(): Promise<RecentCommit[]>` — `fetch("https://api.github.com/users/rohanthomas1202/events/public", { next: { revalidate: 3600 }, headers })` with `Authorization: Bearer ${process.env.GITHUB_TOKEN}` only when the env var exists (unauthenticated is fine: 1 origin request/hour after ISR caching). Any non-OK/throw → `[]`.
- `src/components/sections/github-activity.tsx`:
  - `GitHubActivity` — async server component: `const commits = await getRecentCommits(); if (!commits.length) return null; return <CommitList commits={commits} now={...} />`. Compute relative times server-side at render (they're at-most-an-hour stale, matching the revalidate window — acceptable; do not ship a client clock for this).
  - `CommitList` — sync, exported for tests. Design: a `border-t border-line` strip inside a `max-w-6xl` section directly after `<Projects />` in `page.tsx`. Header row: `font-mono text-xs uppercase tracking-widest text-ink-soft` label "Recently shipped" + right-aligned link "@rohanthomas1202 ↗" to the GitHub profile. Rows: `font-mono text-xs` — accent-dotted repo name, `text-ink` message, `text-ink-soft` relative time; each row an external `<a>` to the commit. No animation beyond wrapping the section in the existing `Reveal`/`RevealItem`.
- `page.tsx` stays a server component; the fetch's `revalidate: 3600` makes the route ISR — intended.

**A11y/perf.** Zero client JS added (server-rendered). External links `target="_blank" rel="noreferrer"`. Failure mode is silence, never a broken section.

**Tests.** `github.test.ts` with a fixture events array: filtering, last-commit selection, first-line truncation, repo dedupe, ordering, limit, commit URL construction; `relativeTime` boundaries (59s/59min/23h/13d/older) with injected `now`. `github-activity.test.tsx`: `CommitList` renders repo names, messages, profile link; renders nothing… (empty case handled by the async wrapper returning null — assert `CommitList` with `[]` is safe if exported that way or skip).

**Acceptance.** Home page shows up to 3 recent public commits with relative times, updated within an hour of pushes; if GitHub is down or rate-limited the section silently disappears; `robinhood-agent` (private) can never appear (public events only); tests/build green.

---

## Out of scope (explicit)

- Hero parallax (vestibular risk, low value on a short page).
- Smooth-scroll libraries (Lenis etc. — INP + reduced-motion hazards).
- Full contribution-graph embeds, testimonials, /now page, blog (future turns).
- React's experimental `viewTransition` flag (revisit when stable).

## Rollout

Single branch (`main`) commit per convention after all five land and the review pass clears; production deploy via `vercel --prod` on explicit approval. Post-deploy visual QA checklist: card hover depth, row cascade, title morph home↔case study (Chrome + Safari), cursor dot on desktop + absence on touch/reduced-motion, GitHub strip presence, Lighthouse INP unchanged.
