import type { Metadata } from "next";
import { CaseStudy, type CaseStudyData } from "@/components/case-study";

const data: CaseStudyData = {
  tag: "Vision AI",
  title: "Alcohol Label Verifier",
  dek: "TTB compliance checks that used to be done by eye. Upload a label and get a field-by-field verdict in seconds.",
  tintClass: "bg-tangerine-tint",
  tldr: {
    problem: "TTB label approval means proving the artwork matches the application: brand, class, ABV, net contents, government warning. Doing it by eye is slow and error prone.",
    built: "Claude vision extracts what's printed on the label; deterministic TypeScript does every comparison. Single-label and batch-CSV modes.",
    proof: "Verdicts in 2 to 4 seconds against a sub-5s target. Every matching rule is unit tested without a single API call.",
  },
  context: [
    "Submitting an alcohol label for TTB approval means proving that what's printed on the bottle matches what's on the application: brand name, class and type, alcohol content, net contents, producer, and the exact government warning, down to the ALL-CAPS bold \"GOVERNMENT WARNING:\" prefix. Reviewers do this by eye, and mistakes mean rejections and fines.",
    "I built this as a proof of concept against a realistic TTB review brief: could the visual comparison be automated without handing the compliance decision to a black box?",
  ],
  built: [
    "An upload flow where Claude's vision model does exactly one job: extract what is printed on the label into structured JSON via tool use. All matching happens in pure TypeScript: case and punctuation insensitive comparison, numeric parsing so \"0.75 L\" matches \"750 mL\" and \"45%\" matches \"45.0% Alc./Vol.\", and a government-warning validator that checks the body word for word plus the prefix's capitalization and bold weight separately.",
    "Batch mode runs a CSV of applications against a folder of label images, five verifications in flight with live progress, and exports regulator-friendly CSV results. Image quality problems like glare, blur, and skew surface as review reasons instead of silent failures.",
  ],
  decisions: [
    {
      decision: "The AI extracts; the code decides",
      why: "Claude never judges compliance. It only reads the label. Every matching rule is deterministic TypeScript, unit tested against fixed inputs with zero API calls, and tunable without touching a prompt. When a regulator asks why a label failed, there is a rule to point to.",
    },
    {
      decision: "Uncertainty demotes to review",
      why: "A glared or blurry photo may have corrupted extraction. Those cases return a review verdict with reasons, so the tool preserves human judgment instead of manufacturing false rejections.",
    },
    {
      decision: "Latency was engineered",
      why: "The brief had a hard sub-5-second requirement. Prompt caching on the system prompt and tool schema brings verdicts to about 3 or 4 seconds cold and about 2 seconds warm.",
    },
    {
      decision: "Minimal integration surface",
      why: "One outbound API call per verification, no database, and no stored images or PII. Everything is processed in memory and discarded. The whole deployment is one Next.js app and one environment variable.",
    },
    {
      decision: "Documented trade-offs over hidden ones",
      why: "The README states what the system can't do, like black box extraction risk and canonical-only warning matching, along with the mitigation for each. Compliance software earns trust by being explicit about its limits.",
    },
  ],
  proves:
    "This is how I turn a regulatory workflow into software: find the deterministic core, keep the model at the edges, test everything that can be tested, and surface uncertainty instead of hiding it. The same shape applies to any document-heavy compliance process.",
  github: "https://github.com/rohanthomas1202/Alcohol-Label-Verifier",
  live: "https://alcohol-label-verifier-two.vercel.app",
};

export const metadata: Metadata = {
  title: "Alcohol Label Verifier case study",
  description: data.dek,
  openGraph: {
    type: "article",
    url: "/work/alcohol-label-verifier",
    title: "Alcohol Label Verifier case study",
    description: data.dek,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alcohol Label Verifier case study",
    description: data.dek,
    images: ["/opengraph-image"],
  },
};

export default function LabelVerifierCaseStudy() {
  return <CaseStudy data={data} />;
}
