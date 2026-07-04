import { MagneticLink } from "@/components/magnetic-link";
import { HeroHeadline } from "@/components/sections/hero-headline";
import { BOOKING_URL } from "@/lib/site";

export function Hero() {
  return (
    <section className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-6 pt-24 pb-16">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
        Rohan Thomas · Austin, TX · booking new projects
      </p>
      <HeroHeadline />
      <p className="mt-6 max-w-xl text-lg text-ink-soft">
        Six years shipping systems where mistakes are expensive — $3T+ in assets at Charles
        Schwab, 50K packages a day at FedEx — and now setting AI engineering standards across
        five U.S. Treasury bureaus. That&apos;s the bar I bring to every build.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <MagneticLink
          href="#work"
          className="rounded-full bg-ink px-7 py-3.5 font-medium text-paper"
        >
          See the work ↓
        </MagneticLink>
        <MagneticLink
          href={BOOKING_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border-2 border-ink px-7 py-3.5 font-medium text-ink"
        >
          Book an intro call
        </MagneticLink>
      </div>
    </section>
  );
}
