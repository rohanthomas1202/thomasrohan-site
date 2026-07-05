import { offers } from "@/content/offers";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const TINTS = ["bg-blue-tint", "bg-green-tint", "bg-violet-tint"];

export function Offers() {
  return (
    <section id="offers" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <Reveal>
        <RevealItem>
          <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Offers
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="mt-3 max-w-md text-ink-soft">
            Three ways to work with me. Every engagement ends with something running in
            production.
          </p>
        </RevealItem>
        <RevealItem>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {offers.map((o, i) => (
              <article
                key={o.title}
                className={cn("flex flex-col rounded-3xl p-7 sm:p-8", TINTS[i % TINTS.length])}
              >
                <span className="self-start rounded-full border-2 border-ink/15 bg-paper px-3 py-1 font-mono text-xs text-ink">
                  {o.timeline}
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink">
                  {o.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{o.blurb}</p>
              </article>
            ))}
          </div>
        </RevealItem>
      </Reveal>
    </section>
  );
}
