import { formatLastCommit, NOW_PHRASE } from "@/lib/now";

export async function NowLine() {
  let commitClause: string | null = null;
  try {
    const res = await fetch(
      "https://api.github.com/users/rohanthomas1202/repos?sort=pushed&per_page=1",
      { next: { revalidate: 3600 } },
    );
    if (res.ok) {
      const repos: { pushed_at?: string }[] = await res.json();
      if (repos[0]?.pushed_at) commitClause = formatLastCommit(repos[0].pushed_at, new Date());
    }
  } catch {
    /* hide the clause on any failure */
  }
  return (
    <p className="mx-auto max-w-6xl px-6 pt-24 font-mono text-xs text-ink-soft">
      <span aria-hidden className="mr-2 inline-block size-2 rounded-full bg-green align-middle" />
      Now: {NOW_PHRASE}
      {commitClause ? ` · last commit ${commitClause}` : ""}
    </p>
  );
}
