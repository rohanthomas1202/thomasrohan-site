type PushEvent = {
  type: "PushEvent";
  repo: { name: string };
  payload: { commits: { message: string; sha: string }[] };
  created_at: string;
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
    Array.isArray(e.payload?.commits) &&
    typeof e.created_at === "string"
  );
}

function firstLine(message: string): string {
  const line = message.split("\n")[0];
  return line.length > 80 ? `${line.slice(0, 79).trimEnd()}…` : line;
}

export function shapeCommits(events: unknown[], limit = 3): RecentCommit[] {
  const seen = new Set<string>();
  return events
    .filter(isPushEvent)
    .filter((e) => e.payload.commits.length > 0)
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .filter((e) => {
      if (seen.has(e.repo.name)) return false;
      seen.add(e.repo.name);
      return true;
    })
    .slice(0, limit)
    .map((e) => {
      const commit = e.payload.commits[e.payload.commits.length - 1]; // last = most recent in push
      return {
        repo: e.repo.name.split("/").pop() ?? e.repo.name,
        message: firstLine(commit.message),
        url: `https://github.com/${e.repo.name}/commit/${commit.sha}`,
        iso: e.created_at,
      };
    });
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

export async function getRecentCommits(): Promise<RecentCommit[]> {
  try {
    const headers: Record<string, string> = { accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch("https://api.github.com/users/rohanthomas1202/events/public", {
      next: { revalidate: 3600 },
      headers,
    });
    if (!res.ok) return [];
    const events: unknown[] = await res.json();
    return shapeCommits(events);
  } catch {
    return [];
  }
}
