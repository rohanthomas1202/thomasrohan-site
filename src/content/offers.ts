export type Offer = {
  title: string;
  timeline: string;
  blurb: string;
};

export const offers: Offer[] = [
  {
    title: "AI product sprint",
    timeline: "2 to 4 weeks",
    blurb:
      "A scoped build that goes from prototype to production, with an eval suite and a real deployment at the end.",
  },
  {
    title: "Embedded build",
    timeline: "monthly",
    blurb:
      "I join your team and build the agent, eval, and interface work alongside your engineers. Short loops, working software every week.",
  },
  {
    title: "Advisory & eval review",
    timeline: "1 to 2 weeks",
    blurb:
      "Architecture and eval review for AI features you already have in flight. The goal is to find the failure modes before your users do.",
  },
];
