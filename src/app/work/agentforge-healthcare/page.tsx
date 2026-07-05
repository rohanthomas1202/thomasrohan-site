import type { Metadata } from "next";
import { CaseStudy, type CaseStudyData } from "@/components/case-study";

const data: CaseStudyData = {
  tag: "AI Agent",
  title: "AgentForge Healthcare",
  dek: "A healthcare agent with 14 tools over live EHR data, six verification layers on every response, and a 92-case eval suite published as open source.",
  tintClass: "bg-blue-tint",
  tldr: {
    problem: "Clinical staff can't act on an agent that's only right most of the time. In healthcare, a hallucinated drug interaction is a safety incident.",
    built: "A LangGraph agent on OpenEMR's FHIR R4 API, with 14 tools covering everything from patient summaries to dosage checks, and a 6-layer verification pipeline behind them.",
    proof: "A 92-case eval suite covering happy path, edge cases, 11 adversarial attacks, and multi-step reasoning. Open source under MIT.",
  },
  context: [
    "Electronic health records hold the data clinicians need, but getting answers out of them is slow. An AI agent can read FHIR APIs and answer in seconds. The problem is trust. A wrong answer about drug interactions, allergies, or dosage is a safety incident.",
    "AgentForge is my answer to the question every AI-in-healthcare team faces: how do you let a language model near patient data without letting it improvise?",
  ],
  built: [
    "A LangGraph agent that queries a real EHR (OpenEMR) through its OAuth2-authenticated FHIR R4 API plus custom MariaDB tables. Fourteen tools cover patient summaries, drug interactions, FDA safety and recalls, allergy cross-reactivity, lab results, care gaps, insurance coverage, appointments, and clinical trials.",
    "The core of the system is what happens after the model answers. Every response passes a 6-layer verification pipeline: drug-safety contradiction detection, allergy cross-reactivity checks, confidence scoring, claim-by-claim grounding against raw tool outputs, PHI detection, and FDA dosage-limit checks. Deployed on AWS as a three-container Docker stack with LangSmith observability.",
  ],
  decisions: [
    {
      decision: "Verification lives outside the model",
      why: "Prompting a model to be careful isn't a safety property. Every response is checked by six independent verifiers after generation. Each verifier fails safe, so a crashed check turns into a warning instead of blocking care.",
    },
    {
      decision: "The eval suite is the spec",
      why: "92 test cases across happy path, edge, adversarial, and multi-step categories define what working means, including 11 attacks like prompt injection and role overrides. The dataset is published under MIT. An eval you won't show anyone is just marketing.",
    },
    {
      decision: "An EHR abstraction layer from day one",
      why: "Tools talk to a BaseEHRProvider interface, not to OpenEMR. Real and mock clients are interchangeable, and the system ports to Epic or Cerner without touching tool code.",
    },
    {
      decision: "Centralized input sanitization",
      why: "All 14 tools pass inputs through one sanitizer. Defense against prompt injection and SQL injection lives in one place instead of fourteen.",
    },
    {
      decision: "PHI has a hard line",
      why: "A detected SSN blocks the response outright. Other PHI, like phone numbers and addresses, raises a warning instead.",
    },
  ],
  proves:
    "If your AI product operates somewhere a wrong answer costs money or safety, this is the discipline I bring: verification layers outside the model, adversarial evals before launch, and abstraction boundaries that survive a vendor change.",
  github: "https://github.com/rohanthomas1202/agentforge-healthcare",
  live: "http://54.236.183.203",
  extraLinks: [
    { label: "Eval dataset", href: "https://github.com/rohanthomas1202/healthcare-agent-eval" },
  ],
};

export const metadata: Metadata = {
  title: "AgentForge Healthcare case study",
  description: data.dek,
  openGraph: {
    type: "article",
    url: "/work/agentforge-healthcare",
    title: "AgentForge Healthcare case study",
    description: data.dek,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentForge Healthcare case study",
    description: data.dek,
    images: ["/opengraph-image"],
  },
};

export default function AgentForgeCaseStudy() {
  return <CaseStudy data={data} />;
}
