import { roles } from "@/content/experience";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">About</h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink">
        I&apos;m Rohan — a full-stack engineer in Austin, TX. Days are portfolio tools at Charles
        Schwab; nights and weekends are AI products — agents, dev tools, and the interfaces around
        them. I like small teams, fast feedback, and software that feels considered. If you&apos;re
        building something, say hi.
      </p>
      <ul className="mt-12 border-t border-line">
        {roles.map((r) => (
          <li
            key={r.company}
            className="flex flex-col gap-1 border-b border-line py-5 sm:flex-row sm:items-baseline sm:gap-6"
          >
            <span className="w-44 shrink-0 font-display text-lg font-bold text-ink">{r.company}</span>
            <span className="text-sm text-ink-soft">
              {r.role} · {r.period}
            </span>
            <span className="sm:ml-auto sm:text-right">
              <span className="font-display text-2xl font-bold tracking-tight text-ink">
                {r.headline.metric}
              </span>{" "}
              <span className="text-sm text-ink-soft">{r.headline.label}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
