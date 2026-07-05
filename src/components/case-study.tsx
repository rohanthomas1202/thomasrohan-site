import Link from "next/link";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export type CaseStudyData = {
  tag: string;
  title: string;
  dek: string;
  tintClass: string;
  tldr: { problem: string; built: string; proof: string };
  context: string[];
  built: string[];
  decisions: { decision: string; why: string }[];
  proves: string;
  github: string;
  live?: string;
  extraLinks?: { label: string; href: string }[];
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <RevealItem>
      <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
      {children}
    </RevealItem>
  );
}

export function CaseStudy({ data }: { data: CaseStudyData }) {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <Reveal>
        <RevealItem>
          <Link href="/" className="font-mono text-xs uppercase tracking-widest text-ink-soft hover:text-ink">
            ← Rohan Thomas
          </Link>
        </RevealItem>
        <RevealItem>
          <span className="mt-8 inline-block rounded-full border-2 border-ink/15 bg-paper px-3 py-1 font-mono text-xs text-ink">
            {data.tag}
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {data.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{data.dek}</p>
        </RevealItem>
        <RevealItem>
          <dl className={cn("mt-10 grid grid-cols-1 gap-6 rounded-3xl p-7 sm:grid-cols-3 sm:p-8", data.tintClass)}>
            {(
              [
                ["Problem", data.tldr.problem],
                ["Built", data.tldr.built],
                ["Proof", data.tldr.proof],
              ] as const
            ).map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-xs uppercase tracking-widest text-ink-soft">{k}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </RevealItem>
        <Section title="Context">
          {data.context.map((p) => (
            <p key={p} className="mt-4 leading-relaxed text-ink">
              {p}
            </p>
          ))}
        </Section>
        <Section title="What I built">
          {data.built.map((p) => (
            <p key={p} className="mt-4 leading-relaxed text-ink">
              {p}
            </p>
          ))}
        </Section>
        <Section title="Decisions">
          <ul className="mt-2">
            {data.decisions.map((d) => (
              <li key={d.decision} className="mt-6">
                <h3 className="font-display text-lg font-bold text-ink">{d.decision}</h3>
                <p className="mt-1 leading-relaxed text-ink-soft">{d.why}</p>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="What this proves">
          <p className="mt-4 leading-relaxed text-ink">{data.proves}</p>
        </Section>
        <RevealItem>
          <div className="mt-14 flex flex-wrap items-center gap-6 border-t border-line pt-6 text-sm font-medium">
            <a href={data.github} target="_blank" rel="noreferrer" className="text-ink underline decoration-2 underline-offset-4 hover:opacity-70">
              GitHub ↗
            </a>
            {data.live && (
              <a href={data.live} target="_blank" rel="noreferrer" className="text-ink underline decoration-2 underline-offset-4 hover:opacity-70">
                Live demo ↗
              </a>
            )}
            {data.extraLinks?.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-ink underline decoration-2 underline-offset-4 hover:opacity-70">
                {l.label} ↗
              </a>
            ))}
          </div>
        </RevealItem>
      </Reveal>
    </main>
  );
}
