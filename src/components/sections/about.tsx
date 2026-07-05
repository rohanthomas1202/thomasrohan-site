import { roles } from "@/content/experience";
import { Reveal, RevealItem } from "@/components/motion/reveal";

const ROW_ACCENTS: Record<string, string> = {
  "U.S. Department of the Treasury": "var(--violet)",
  "Charles Schwab": "var(--blue)",
  FedEx: "var(--tangerine)",
  "United Healthcare": "var(--green)",
};

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <Reveal>
        <RevealItem>
          <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Track record
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink">
            I&apos;m Rohan, an engineer in Austin. I build AI products for domains where wrong
            answers cost money. Right now that&apos;s the U.S. Treasury, where I work on AI
            engineering standards across five bureaus, including the IRS and TTB. Before that I
            spent four years on portfolio tools at Charles Schwab, where a bad deploy touches
            $3T+ in assets. I like small teams, short loops, and working software every week.
          </p>
        </RevealItem>
        <RevealItem>
          <ul className="mt-12 border-t border-line">
            {roles.map((r) => (
              <li
                key={r.company}
                style={{ "--row-accent": ROW_ACCENTS[r.company] ?? "var(--blue)" } as React.CSSProperties}
                className="exp-row -mx-4 border-b border-line px-4 py-5"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="w-44 shrink-0 font-display text-lg font-bold text-ink">
                    {r.company}
                  </span>
                  <span className="text-sm text-ink-soft">
                    {r.label} · {r.period}
                  </span>
                  <span className="sm:ml-auto sm:text-right">
                    <span className="exp-metric font-display text-2xl font-bold tracking-tight text-ink">
                      {r.headline.metric}
                    </span>{" "}
                    <span className="text-sm text-ink-soft">{r.headline.label}</span>
                  </span>
                </div>
                <ul className="mt-3 flex flex-col gap-1.5 sm:pl-[12.5rem]">
                  {r.highlights.slice(0, 2).map((h) => (
                    <li key={h.text} className="text-sm leading-relaxed text-ink-soft">
                      {h.text}
                      {h.metric ? <span className="font-medium text-ink"> {h.metric}</span> : null}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </RevealItem>
      </Reveal>
    </section>
  );
}
