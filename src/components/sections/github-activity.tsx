import { getRecentCommits, relativeTime, type RecentCommit } from "@/lib/github";
import { Reveal, RevealItem } from "@/components/motion/reveal";

const DOT_ACCENTS = ["var(--blue)", "var(--tangerine)", "var(--pink)", "var(--green)", "var(--violet)"];

export async function GitHubActivity() {
  const commits = await getRecentCommits();
  if (!commits.length) return null;
  /* Relative times are computed at render; at most an hour stale, same as the ISR window. */
  return <CommitList commits={commits} now={new Date()} />;
}

export function CommitList({ commits, now }: { commits: RecentCommit[]; now: Date }) {
  if (!commits.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-6">
      <Reveal className="border-t border-line pt-6">
        <RevealItem>
          <div className="flex items-baseline justify-between gap-4 font-mono text-xs uppercase tracking-widest text-ink-soft">
            <span>Recently shipped</span>
            <a
              href="https://github.com/rohanthomas1202"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink"
            >
              @rohanthomas1202 ↗
            </a>
          </div>
        </RevealItem>
        <div className="mt-4">
          {commits.map((c, i) => (
            <RevealItem key={c.url}>
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-wrap items-baseline gap-x-3 gap-y-0.5 py-1.5 font-mono text-xs"
              >
                <span className="flex items-baseline gap-2 text-ink-soft">
                  <span
                    aria-hidden
                    className="inline-block size-2 self-center rounded-full"
                    style={{ background: DOT_ACCENTS[i % DOT_ACCENTS.length] }}
                  />
                  {c.repo}
                </span>
                <span className="text-ink group-hover:underline">{c.message}</span>
                <span className="ml-auto text-ink-soft">{relativeTime(c.iso, now)}</span>
              </a>
            </RevealItem>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
