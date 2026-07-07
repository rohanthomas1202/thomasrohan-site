import { describe, it, expect } from "vitest";
import { shapeCommits, relativeTime } from "./github";

function pushEvent(
  repo: string,
  createdAt: string,
  commits: { message: string; sha: string }[],
): unknown {
  return { type: "PushEvent", repo: { name: repo }, payload: { commits }, created_at: createdAt };
}

const EVENTS = [
  pushEvent("rohanthomas1202/website", "2026-07-05T12:00:00Z", [
    { message: "fix: earlier commit", sha: "aaa111" },
    { message: "feat: hero polish\n\nlong body that should be dropped", sha: "bbb222" },
  ]),
  { type: "WatchEvent", repo: { name: "rohanthomas1202/website" }, created_at: "2026-07-05T13:00:00Z" },
  pushEvent("rohanthomas1202/website", "2026-07-04T09:00:00Z", [
    { message: "chore: older push to same repo", sha: "ccc333" },
  ]),
  pushEvent("rohanthomas1202/truthlayer", "2026-07-05T15:00:00Z", [
    { message: "feat: verify claims", sha: "ddd444" },
  ]),
  pushEvent("rohanthomas1202/shipyard", "2026-07-03T08:00:00Z", [
    { message: "docs: readme", sha: "eee555" },
  ]),
  pushEvent("rohanthomas1202/pokerstats", "2026-07-02T08:00:00Z", [
    { message: "fix: equity calc", sha: "fff666" },
  ]),
];

describe("shapeCommits", () => {
  it("keeps only push events and takes each push's last commit", () => {
    const commits = shapeCommits(EVENTS, 10);
    const website = commits.find((c) => c.repo === "website");
    expect(website?.message).toBe("feat: hero polish");
    expect(website?.url).toBe("https://github.com/rohanthomas1202/website/commit/bbb222");
  });

  it("dedupes by repo keeping the newest push and sorts newest-first", () => {
    const commits = shapeCommits(EVENTS, 10);
    expect(commits.map((c) => c.repo)).toEqual(["truthlayer", "website", "shipyard", "pokerstats"]);
    expect(commits.filter((c) => c.repo === "website")).toHaveLength(1);
  });

  it("caps at the limit (default 3)", () => {
    expect(shapeCommits(EVENTS)).toHaveLength(3);
    expect(shapeCommits(EVENTS, 2).map((c) => c.repo)).toEqual(["truthlayer", "website"]);
  });

  it("strips the owner from repo names and keeps the iso timestamp", () => {
    const [first] = shapeCommits(EVENTS);
    expect(first.repo).toBe("truthlayer");
    expect(first.iso).toBe("2026-07-05T15:00:00Z");
  });

  it("truncates long first lines to 80 chars", () => {
    const long = "a".repeat(120);
    const [commit] = shapeCommits([
      pushEvent("me/repo", "2026-07-05T12:00:00Z", [{ message: long, sha: "abc" }]),
    ]);
    expect(commit.message).toHaveLength(80);
    expect(commit.message.endsWith("…")).toBe(true);
  });

  it("ignores malformed events and empty pushes", () => {
    expect(
      shapeCommits([
        null,
        42,
        { type: "PushEvent" },
        pushEvent("me/empty", "2026-07-05T12:00:00Z", []),
      ]),
    ).toEqual([]);
  });
});

const NOW = new Date("2026-07-05T12:00:00Z");

describe("relativeTime", () => {
  it("says just now under a minute", () => {
    expect(relativeTime("2026-07-05T11:59:01Z", NOW)).toBe("just now");
  });
  it("counts minutes under an hour", () => {
    expect(relativeTime("2026-07-05T11:01:00Z", NOW)).toBe("59 min ago");
  });
  it("counts hours under a day", () => {
    expect(relativeTime("2026-07-04T13:00:00Z", NOW)).toBe("23 h ago");
  });
  it("counts days up to 14", () => {
    expect(relativeTime("2026-06-22T12:00:00Z", NOW)).toBe("13 d ago");
  });
  it("falls back to month + day past 14 days", () => {
    expect(relativeTime("2026-06-01T12:00:00Z", NOW)).toBe("Jun 1");
  });
});
