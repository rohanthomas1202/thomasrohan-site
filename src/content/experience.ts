export type Role = {
  company: string;
  role: string;
  location: string;
  period: string;
  current?: boolean;
  highlights: { text: string; metric?: string }[];
};

export const roles: Role[] = [
  {
    company: "Charles Schwab",
    role: "Full-Stack Java Developer",
    location: "Austin, TX",
    period: "2022 → Present",
    current: true,
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
    location: "Philadelphia, PA",
    period: "2021 → 2022",
    highlights: [
      {
        text: "Designed a sortation system across 5 distribution centers, scaling throughput",
        metric: "+30% during peak seasons.",
      },
      {
        text: "Refactored core algorithms in Java, Kotlin, and Spring Boot —",
        metric: "+20% speed, −15% downtime.",
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
    location: "Plano, TX",
    period: "2020",
    highlights: [
      {
        text: "Shipped a batch upload platform replacing manual entry for 1,000+ providers —",
        metric: "−80% processing time.",
      },
      {
        text: "Integrated MySQL backend handling 10K+ patient records weekly with validation and audit logging.",
      },
    ],
  },
];
