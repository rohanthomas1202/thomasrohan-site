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
