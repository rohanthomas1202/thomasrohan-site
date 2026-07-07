import type { Metadata } from "next";
import { CaseStudy, type CaseStudyData } from "@/components/case-study";

const data: CaseStudyData = {
  slug: "truthlayer",
  tag: "Arb Scanner",
  title: "TruthLayer",
  dek: "A real-time arbitrage scanner that matches equivalent contracts across Polymarket and Kalshi with a four-tier pipeline, then grades every detected edge against real settlement outcomes.",
  tintClass: "bg-violet-tint",
  tldr: {
    problem:
      "Two prediction markets often price the same event differently — but they word that event two different ways, and acting on a false match loses real money.",
    built:
      "A scanner that polls both venues on a 30-second loop and matches contracts through four tiers: keyword similarity, FAISS embeddings, Claude verification, and entity extraction. Fee-adjusted spreads stream to a live dashboard.",
    proof:
      "42 backend test files, a written 38/38 requirements audit, and a scoreboard where every detected arb is tracked through settlement. 65 stars on GitHub.",
  },
  context: [
    "Polymarket and Kalshi frequently list contracts on the same underlying event, and their prices disagree often enough to matter. The hard part isn't spotting a spread — it's deciding that two differently-worded contracts really settle on the same outcome. “Fed cuts rates in March” and “No rate cut before Q2” might be the same bet inverted, or subtly different bets.",
    "TruthLayer treats that matching problem as the product. A false positive — pairing two contracts that don't actually settle together — is worse than a missed opportunity, because it turns an “arbitrage” into an open position. Everything in the system is built around that asymmetry.",
  ],
  built: [
    "A FastAPI and PostgreSQL backend that ingests both venues with circuit breakers, retries, and freshness tracking — a 30-second pricing loop and a 15-minute matching loop. Candidate matches climb a four-tier pipeline: cheap keyword similarity first, FAISS embedding search second, Claude as a verification layer third, and entity extraction last. A 17-pattern framing taxonomy rejects near-matches that differ in date, threshold, or negation.",
    "Confirmed matches become tracked arbitrage opportunities with fee-adjusted spreads, using each venue's actual p×(1−p) fee curve. Every opportunity moves through a lifecycle state machine — detected, confirmed, stale, expired — and streams to a Next.js dashboard over server-sent events. Sixteen Alembic migrations, RSA-signed Kalshi requests, and health endpoints round out the operational layer.",
  ],
  decisions: [
    {
      decision: "Precision over recall",
      why: "A missed arb costs nothing; a false match costs money. The matcher is tuned to reject aggressively, and the 17-pattern framing taxonomy exists to kill the plausible-but-wrong pairs that embeddings alone wave through.",
    },
    {
      decision: "The LLM is a verifier, not an oracle",
      why: "Claude never generates matches. Cheaper tiers propose candidates; the model's only job is to confirm or reject them with the contract text in front of it. That keeps LLM cost bounded and makes its failure mode a rejected match, not an invented one.",
    },
    {
      decision: "Settlement is the ground truth",
      why: "Every detected arb is tracked through to how the contracts actually settled, and the scoreboard is computed from those outcomes. A scanner that only shows live spreads can't be wrong yet — one graded against settlement can, and that's the point.",
    },
    {
      decision: "Fees before spreads",
      why: "Both venues charge fees that peak exactly where arbs look juiciest, near 50¢. Spreads are computed net of each venue's fee curve, so a “4% edge” that dies after fees never reaches the dashboard.",
    },
    {
      decision: "Prices are append-only history",
      why: "Every snapshot lands in an append-only store with top-of-book depth, so any past claim the scanner made can be re-derived and audited later.",
    },
  ],
  proves:
    "If your AI product touches money, this is the shape I reach for: cheap filters first and an LLM as the verification layer, a precision-first bias with the false-positive taxonomy written down, and a scoreboard graded against reality instead of a demo that can't be wrong.",
  github: "https://github.com/rohanthomas1202/truthlayer",
};

export const metadata: Metadata = {
  title: "TruthLayer case study",
  description: data.dek,
  openGraph: {
    type: "article",
    url: "/work/truthlayer",
    title: "TruthLayer case study",
    description: data.dek,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "TruthLayer case study",
    description: data.dek,
    images: ["/opengraph-image"],
  },
};

export default function TruthLayerCaseStudy() {
  return <CaseStudy data={data} />;
}
