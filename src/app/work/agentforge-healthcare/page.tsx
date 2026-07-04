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
  title: "AgentForge Healthcare case study",
  description: data.dek,
};

export default function AgentForgeCaseStudy() {
  return <CaseStudy data={data} />;
}
