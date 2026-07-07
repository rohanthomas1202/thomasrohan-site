import type { Metadata } from "next";
import { CaseStudy, type CaseStudyData } from "@/components/case-study";

const data: CaseStudyData = {
  slug: "shipyard",
  tag: "Dev Tools",
  title: "Shipyard",
  dek: "An autonomous coding agent built on LangGraph: typed plan steps, anchor-based surgical edits, parallel sub-agents, and per-task model routing — backed by 606 tests.",
  tintClass: "bg-green-tint",
  tldr: {
    problem:
      "Coding agents fail in boring ways: edits that miss their target line, one expensive model doing every job, and runs that die halfway with no way to resume.",
    built:
      "A LangGraph agent with a 10-node graph that plans typed edit steps, edits files by anchor with fuzzy fallback, fans work out to parallel sub-agents grouped by directory, and routes each task to the right model tier.",
    proof:
      "606 test functions across 64 files plus Playwright end-to-end specs, SQLite-checkpointed crash recovery, and a React IDE frontend with human approval gates.",
  },
  context: [
    "I built Shipyard to learn how coding agents actually break, by owning every layer of one — 462 commits in about eight days. The interesting failures were never the model being dumb; they were mechanical. Line-number edits drift the moment an earlier edit lands. Big tasks starve on context. A single model tier is either too slow for validation or too weak for planning.",
    "So the design centers on the unglamorous parts: how an edit finds its target, how work splits so agents don't collide, and what happens when a step fails.",
  ],
  built: [
    "A LangGraph state machine with ten nodes and conditional routing takes an instruction from plan to validated diff. Edits are anchor-based — the agent quotes the code it intends to replace, and a whitespace-normalized fuzzy matcher with indentation adjustment finds it even after nearby changes — with ast-grep operations and a full LSP client for code intelligence.",
    "A coordinator groups plan steps by directory and fans them out to parallel reader→editor→validator subgraphs, with a merger reconciling results and a DAG scheduler sequencing dependencies. Every run checkpoints to SQLite and can resume after a crash, and a React IDE frontend streams agent activity over WebSockets with reconnection replay, a diff viewer, and approval gates before edits land. The runtime routes between OpenAI reasoning and fast tiers per task, escalating automatically when a cheap model's output fails validation.",
  ],
  decisions: [
    {
      decision: "Anchors, not line numbers",
      why: "Line numbers are stale the moment a previous edit lands. Quoting the target code and fuzzy-matching it survives drift, and a miss fails loudly instead of editing the wrong line silently.",
    },
    {
      decision: "Route models by task tier",
      why: "Planning gets a reasoning model; validation gets a fast one. A policy layer escalates automatically when output fails checks, so cost stays proportional to difficulty instead of every step paying the premium rate.",
    },
    {
      decision: "Parallelism by directory",
      why: "Sub-agents fan out over directory groups, so two agents never fight over the same file. It's a crude partition that eliminates the whole conflict class instead of managing it.",
    },
    {
      decision: "Rollback and retry on failed validation",
      why: "A syntax-breaking edit rolls back and retries up to three times before surfacing. The agent cleaning up its own misses is the difference between a tool and a demo.",
    },
    {
      decision: "Humans gate the merge",
      why: "Every edit streams to a diff viewer and waits for approval. Autonomy in the loop, authority outside it.",
    },
  ],
  proves:
    "Most of what I know about agents came from building this — not the prompts, but the plumbing that makes an agent survivable: edits that can't silently miss, crash recovery, cost-aware routing, and a human veto at the end.",
  github: "https://github.com/rohanthomas1202/Shipyard",
};

export const metadata: Metadata = {
  title: "Shipyard case study",
  description: data.dek,
  openGraph: {
    type: "article",
    url: "/work/shipyard",
    title: "Shipyard case study",
    description: data.dek,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipyard case study",
    description: data.dek,
    images: ["/opengraph-image"],
  },
};

export default function ShipyardCaseStudy() {
  return <CaseStudy data={data} />;
}
