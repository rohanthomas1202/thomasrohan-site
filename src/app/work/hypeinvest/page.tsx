import type { Metadata } from "next";
import { CaseStudy, type CaseStudyData } from "@/components/case-study";

const data: CaseStudyData = {
  slug: "hypeinvest",
  tag: "Fintech",
  title: "HypeInvest V2",
  dek: "A stock hype index that scores Reddit, YouTube, and news sentiment with Claude and blends them into one signal — built so any source failing degrades the index instead of breaking it.",
  tintClass: "bg-blue-tint",
  tldr: {
    problem:
      "Retail hype moves stocks before fundamentals do, but every sentiment source is a flaky third-party API — and a signal that dies whenever one of them does is worthless.",
    built:
      "A FastAPI backend with a pluggable scraper registry (Reddit, YouTube, news) running concurrently under per-source failure isolation, Claude scoring sentiment in batches, and a documented engagement-weighted index formula. Next.js 16 frontend.",
    proof:
      "Every API response reports sources_used and sources_failed, so degradation is visible instead of silent. Rebuilt from the HackUTD VIII project that won Goldman Sachs' Investment Strategy challenge.",
  },
  context: [
    "The original HypeInvest came out of HackUTD VIII, where it won Goldman Sachs' Investment Strategy challenge: follow retail hype as a leading signal. V2 is the production-shaped rebuild of that idea, and its real subject is a less glamorous question — how do you blend several unreliable data sources into one number without the weakest source setting your uptime?",
    "For any ticker Finnhub can resolve, the index answers: how loudly is the crowd talking, and how do they feel? It's a gauge from −100 to +100, deliberately not a trading system — the docs warn against using hype in isolation.",
  ],
  built: [
    "Scrapers implement a common base class and live in a registry — Reddit via asyncpraw, YouTube via the Data API, and news via NewsAPI — pulling up to 125 items per query from the trailing seven days. They run concurrently, and one scraper throwing doesn't touch the others: failures are isolated per-source and surfaced in the response as sources_used and sources_failed.",
    "Claude Haiku scores sentiment in batches of twenty texts per call, with output clamping, padding, and a parse-failure fallback; if no API key is configured the pipeline degrades to neutral sentiment instead of erroring. The index formula is documented in the code — sign(perception) × tanh(4 × popularity × |perception|) × 100 — weighting engagement per platform, with Finnhub as the primary stock-data source and yfinance as fallback. Pydantic v2 schemas type every boundary.",
  ],
  decisions: [
    {
      decision: "Degrade, don't break",
      why: "Scrapers run under isolation so an exception in one becomes a smaller sample, not a 500. The failure shows up in the response payload — visible degradation over silent failure or a dead endpoint.",
    },
    {
      decision: "A registry, not a hardcoded pipeline",
      why: "Adding a sentiment source is one class implementing the scraper base. The blend logic never changes when the source list does.",
    },
    {
      decision: "Batch the model, bound the cost",
      why: "Twenty texts per Claude call with clamped, padded JSON-array output and a fallback when parsing fails. Per-item calls would multiply cost twentyfold for the same signal.",
    },
    {
      decision: "Show the math",
      why: "The index formula sits in the code with its reasoning — tanh keeps runaway popularity from saturating the scale, engagement weights keep one viral post from being the whole signal. A number you can't derive is a number you can't trust.",
    },
    {
      decision: "A gauge, not a trading system",
      why: "The output is deliberately framed as one input among many. Overclaiming a sentiment score into trade advice is how fintech demos become liabilities.",
    },
  ],
  proves:
    "Signal engineering is mostly failure engineering: isolate unreliable sources, make degradation visible in the API contract, bound LLM cost by design, and document the formula so the number can be audited.",
  github: "https://github.com/rohanthomas1202/HypeInvest-V2",
  extraLinks: [{ label: "Devpost (HackUTD VIII)", href: "https://devpost.com/software/hype-investing" }],
};

export const metadata: Metadata = {
  title: "HypeInvest V2 case study",
  description: data.dek,
  openGraph: {
    type: "article",
    url: "/work/hypeinvest",
    title: "HypeInvest V2 case study",
    description: data.dek,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "HypeInvest V2 case study",
    description: data.dek,
    images: ["/opengraph-image"],
  },
};

export default function HypeInvestCaseStudy() {
  return <CaseStudy data={data} />;
}
