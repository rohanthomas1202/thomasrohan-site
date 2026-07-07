import type { Metadata } from "next";
import { CaseStudy, type CaseStudyData } from "@/components/case-study";

const data: CaseStudyData = {
  slug: "pokerstats",
  tag: "iOS App",
  title: "PokerStats",
  dek: "A native iOS app for live poker players: three-second hand logging at the table, HUD-style stats computed from your own history, and a leak finder — every formula verified against worked examples.",
  tintClass: "bg-tangerine-tint",
  tldr: {
    problem:
      "Online players get VPIP and c-bet stats for free from HUD software. Live players get a notebook — because no one logs hands at a real table unless it's nearly instant.",
    built:
      "A Swift 6 / SwiftUI / SwiftData app: crash-proof session tracking, a progressive-disclosure hand logger capped at five taps, eight stats computed by pure functions, and a leak finder that compares your numbers to reference ranges.",
    proof:
      "121 tests across 9 suites, including worked examples that trace full hand histories through every stat formula against hand-computed answers.",
  },
  context: [
    "Serious online players make decisions with HUD statistics — how often an opponent enters pots, folds to three-bets, gives up on the river. Live players generate the same information every session and lose all of it, because logging a hand mid-game has to compete with the game itself.",
    "PokerStats bets the whole product on one constraint: if entering a hand takes more than a few seconds, nobody does it twice. Everything else — the stats engine, the leak finder, the cloud backup — only matters if that holds.",
  ],
  built: [
    "The hand logger uses progressive disclosure: a preflop fold is one tap, and the longest possible path through any hand is five — a rule stated in the README and enforced in contributing guidelines. Sessions track buy-ins, rebuys, and P&L with a timer derived from a persisted start date, so a killed app resumes mid-session without losing time. Live Activities put the session on the Dynamic Island; widgets put bankroll on the home screen.",
    "From logged hands, a pure-function StatCalculator computes eight statistics — VPIP, PFR, fold-to-3-bet, c-bet%, WTSD%, W$SD%, hourly rate, and ROI — returning nil rather than a fabricated number when the denominator is zero. A leak finder compares your stats to reference ranges and turns deviations into coaching notes. Sync is offline-first: SwiftData locally, Supabase backup behind Sign in with Apple, row-level security on every table, and a dedicated edge function that deletes storage, metadata, profile, and auth user on account deletion. The app target has zero third-party dependencies, and Fastlane automates TestFlight, release, and an App Store screenshot pipeline across three device sizes with seeded data.",
  ],
  decisions: [
    {
      decision: "Five taps or it doesn't ship",
      why: "The entry-speed cap is the product thesis, written into the contributing rules so a future feature can't quietly add a sixth tap. Preflop fold — the most common hand — is one.",
    },
    {
      decision: "Stats are pure functions with known-answer tests",
      why: "The StatCalculator has no state and no side effects, and three worked examples trace full hand histories through every formula against answers computed by hand. A stats app that's wrong is worse than a notebook.",
    },
    {
      decision: "Return nil, never a guess",
      why: "Zero hands played means VPIP is nil, not 0%. Every formula has explicit zero-denominator tests, because a confident wrong number in a coaching tool compounds.",
    },
    {
      decision: "Offline first, cloud as backup",
      why: "Poker rooms have bad reception. SwiftData owns the source of truth; Supabase holds an encrypted backup with per-user row-level security and a GDPR-style deletion path.",
    },
    {
      decision: "Release engineering from day one",
      why: "Fastlane lanes for TestFlight and release, Xcode Cloud CI, and a screenshot pipeline that boots three simulators with seeded data. Shipping infrastructure isn't an afterthought you bolt on at v1.0.",
    },
  ],
  proves:
    "No AI in this one — that's the point. The verification discipline transfers: known-answer tests on every formula, nil over fabricated numbers, and release automation built before launch, not after.",
  github: "https://github.com/rohanthomas1202/PokerStats",
};

export const metadata: Metadata = {
  title: "PokerStats case study",
  description: data.dek,
  openGraph: {
    type: "article",
    url: "/work/pokerstats",
    title: "PokerStats case study",
    description: data.dek,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PokerStats case study",
    description: data.dek,
    images: ["/opengraph-image"],
  },
};

export default function PokerStatsCaseStudy() {
  return <CaseStudy data={data} />;
}
