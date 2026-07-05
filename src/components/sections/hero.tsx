import { MagneticLink } from "@/components/magnetic-link";
import { HeroHeadline } from "@/components/sections/hero-headline";

export function Hero() {
  return (
    <section className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-6 pt-24 pb-16">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
        Rohan Thomas · Austin, TX · booking new projects
      </p>
      <HeroHeadline />
      <p className="mt-6 max-w-xl text-lg text-ink-soft">
        I spent six years shipping systems where mistakes are expensive: portfolio tools on
        $3T+ in assets at Charles Schwab, 50K packages a day at FedEx. Now I work on AI
        engineering standards across five U.S. Treasury bureaus. I hold every build to that bar.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <MagneticLink
          href="#work"
          className="rounded-full bg-ink px-7 py-3.5 font-medium text-paper"
        >
          See the work ↓
        </MagneticLink>
        <MagneticLink
          href="#contact"
          className="rounded-full border-2 border-ink px-7 py-3.5 font-medium text-ink"
        >
          Get in touch
        </MagneticLink>
      </div>
    </section>
  );
}
