type PushEvent = {
  type: "PushEvent";
  repo: { name: string };
  /* GitHub's events API stopped shipping payload.commits — a push now
     carries only the head SHA, so the message needs a per-commit lookup. */
  payload: { head: string };
  created_at: string;
};

export type RecentPush = {
  repo: string; // full name, owner/repo
  sha: string;
  iso: string;
};

export type RecentCommit = {
  repo: string; // short name, no owner
  message: string;
  url: string;
  iso: string;
};

function isPushEvent(event: unknown): event is PushEvent {
  const e = event as PushEvent;
  return (
    e?.type === "PushEvent" &&
    typeof e.repo?.name === "string" &&
    typeof e.payload?.head === "string" &&
    typeof e.created_at === "string"
  );
}

function firstLine(message: string): string {
  const line = message.split("\n")[0];
  return line.length > 80 ? `${line.slice(0, 79).trimEnd()}…` : line;
}

export function shapePushes(events: unknown[], limit = 3): RecentPush[] {
  const seen = new Set<string>();
  return events
    .filter(isPushEvent)
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .filter((e) => {
      if (seen.has(e.repo.name)) return false;
      seen.add(e.repo.name);
      return true;
    })
    .slice(0, limit)
    .map((e) => ({ repo: e.repo.name, sha: e.payload.head, iso: e.created_at }));
}

export function commitMessage(commit: unknown): string | null {
  const m = (commit as { commit?: { message?: unknown } })?.commit?.message;
  return typeof m === "string" && m.length > 0 ? firstLine(m) : null;
}

export function relativeTime(iso: string, now: Date): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  if (days <= 14) return `${days} d ago`;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(iso));
}

async function ghFetch(url: string): Promise<unknown> {
  /* GitHub's API 403s requests without a User-Agent, and Node's fetch
     sends none by default. */
  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "user-agent": "thomasrohan.com",
  };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers,
    /* A stalled connection aborts into the caller's catch — the failure
       mode is silence, never a hung render. */
    signal: AbortSignal.timeout(3000),
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return res.json();
}

export async function getRecentCommits(): Promise<RecentCommit[]> {
  try {
    const events = await ghFetch("https://api.github.com/users/rohanthomas1202/events/public");
    const pushes = shapePushes(events as unknown[]);
    const commits = await Promise.all(
      pushes.map(async (p) => {
        try {
          const message = commitMessage(
            await ghFetch(`https://api.github.com/repos/${p.repo}/commits/${p.sha}`),
          );
          if (!message) return null;
          return {
            repo: p.repo.split("/").pop() ?? p.repo,
            message,
            url: `https://github.com/${p.repo}/commit/${p.sha}`,
            iso: p.iso,
          };
        } catch {
          return null; // e.g. force-pushed head no longer exists — skip the row
        }
      }),
    );
    return commits.filter((c): c is RecentCommit => c !== null);
  } catch {
    return [];
  }
}
