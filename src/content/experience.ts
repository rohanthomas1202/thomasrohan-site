export type Role = {
  company: string;
  role: string;
  label: string;
  location: string;
  period: string;
  current?: boolean;
  headline: { metric: string; label: string };
  highlights: { text: string; metric?: string }[];
};

export const roles: Role[] = [
  {
    company: "U.S. Department of the Treasury",
    role: "IT Specialist (Artificial Intelligence)",
    label: "Federal AI engineering",
    location: "Washington, DC",
    period: "2026 → Present",
    current: true,
    headline: { metric: "5", label: "Treasury bureaus supported" },
    highlights: [
      {
        text: "Formulating enterprise-wide AI engineering strategy and standards for secure, ethical AI deployment across",
        metric: "5 bureaus: Treasury, IRS, BEP, U.S. Mint, and TTB.",
      },
      {
        text: "Designing and evaluating production AI-enabled systems with cybersecurity-by-design and DevSecOps practices, aligned to federal AI mandates and Executive Orders.",
      },
      {
        text: "Leading cross-bureau engineering projects spanning cloud-native modernization, data platforms, and secure computing infrastructure.",
      },
    ],
  },
  {
    company: "Charles Schwab",
    role: "Full-Stack Developer → Senior Developer",
    label: "Client data & portfolio tooling",
    location: "Austin, TX",
    period: "2022 → 2026",
    headline: { metric: "$3T+", label: "assets under management tooling" },
    highlights: [
      {
        text: "Architected Angular interfaces for portfolio management tools handling",
        metric: "$3T+ in assets and 100K+ transactions/day.",
      },
      {
        text: "Cut frontend rendering and API response times by",
        metric: "30% via query optimization, lazy loading, and caching.",
      },
      {
        text: "Promoted to Senior Developer on Client Data Technologies, where I led an onsite and offshore team building Kafka-based segmentation and data integrations.",
      },
      {
        text: "Set the team's AI-assisted engineering practices (Claude Code, GitHub Copilot): spec-driven implementation, test generation, and review support.",
      },
      {
        text: "Engineered Spring Boot REST APIs consumed by web and mobile; defined cross-team contracts. Led design reviews on component structure and shared UI patterns.",
      },
      {
        text: "Owned onboarding docs across 3 teams; mentored juniors through pair programming, KT sessions, and code reviews.",
      },
    ],
  },
  {
    company: "FedEx",
    role: "Software Engineering Co-Op",
    label: "Logistics systems",
    location: "Philadelphia, PA",
    period: "2021 → 2022",
    headline: { metric: "+30%", label: "peak-season throughput" },
    highlights: [
      {
        text: "Designed a sortation system across 5 distribution centers, scaling throughput",
        metric: "+30% during peak seasons.",
      },
      {
        text: "Refactored core algorithms in Java, Kotlin, and Spring Boot for",
        metric: "+20% speed and −15% downtime.",
      },
      {
        text: "Shipped an Android app processing",
        metric: "50K+ packages/day, end-to-end from mobile UI to backend.",
      },
    ],
  },
  {
    company: "United Healthcare",
    role: "Software Engineering Intern",
    label: "Claims platform",
    location: "Plano, TX",
    period: "2020",
    headline: { metric: "−80%", label: "claims processing time" },
    highlights: [
      {
        text: "Shipped a batch upload platform replacing manual entry for 1,000+ providers, cutting",
        metric: "processing time by 80%.",
      },
      {
        text: "Integrated MySQL backend handling 10K+ patient records weekly with validation and audit logging.",
      },
    ],
  },
];
