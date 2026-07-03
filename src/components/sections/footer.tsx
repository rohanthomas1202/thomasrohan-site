export function Footer() {
  return (
    <footer id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-16 pt-24">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">Contact</p>
      <a
        href="mailto:claude@thomasrohan.com"
        className="email-fill mt-4 font-display text-[clamp(1.25rem,7.5vw,3.75rem)] font-bold tracking-tight text-ink"
      >
        <span aria-hidden className="fill">
          claude@thomasrohan.com
        </span>
        claude@thomasrohan.com
      </a>
      <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-line pt-6 text-sm">
        <a
          href="https://github.com/rohanthomas1202"
          target="_blank"
          rel="noreferrer"
          className="text-ink hover:underline"
        >
          GitHub ↗
        </a>
        <a
          href="https://linkedin.com/in/RohanSThomas"
          target="_blank"
          rel="noreferrer"
          className="text-ink hover:underline"
        >
          LinkedIn ↗
        </a>
        <span className="ml-auto text-ink-soft">Built in Austin. © 2026 Rohan Thomas.</span>
      </div>
    </footer>
  );
}
