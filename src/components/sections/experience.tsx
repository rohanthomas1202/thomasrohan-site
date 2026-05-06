type Role = {
  company: string;
  role: string;
  location: string;
  period: string;
  current?: boolean;
  highlights: { text: string; metric?: string }[];
};

const roles: Role[] = [
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

export function Experience() {
  return (
    <section
      id="experience"
      className="border-t border-border px-6 py-32 sm:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            03 / Experience
          </p>
          <h2 className="display mt-3 text-5xl sm:text-7xl">
            Built at
            <br />
            <span className="text-accent">scale.</span>
          </h2>
        </div>

        <ol className="divide-y divide-border">
          {roles.map((r) => (
            <li key={r.company} className="grid gap-8 py-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted">
                  <span>{r.period}</span>
                  {r.current && (
                    <span className="flex items-center gap-1.5 text-accent">
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                      Current
                    </span>
                  )}
                </div>
                <h3 className="display mt-4 text-4xl sm:text-5xl">
                  {r.company}
                </h3>
                <p className="mt-3 text-base text-muted">
                  {r.role} <span className="text-foreground/60">·</span>{" "}
                  {r.location}
                </p>
              </div>

              <ul className="space-y-4 text-sm leading-relaxed lg:col-span-7">
                {r.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="border-l border-border pl-5 text-foreground/85"
                  >
                    {h.text}
                    {h.metric && (
                      <>
                        {" "}
                        <span className="font-medium text-accent">
                          {h.metric}
                        </span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 font-mono text-xs uppercase tracking-widest text-muted">
          <span>UT Dallas — BS Computer Science, 2022</span>
          <span>
            <span className="text-foreground">3.6</span> cumulative ·{" "}
            <span className="text-foreground">4.0</span> major
          </span>
        </div>
      </div>
    </section>
  );
}
