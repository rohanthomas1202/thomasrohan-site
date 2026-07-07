import { describe, it, expect } from "vitest";
import { shapePushes, commitMessage, relativeTime } from "./github";

/* Mirrors the live events API shape: pushes carry only the head SHA. */
function pushEvent(repo: string, createdAt: string, head: string): unknown {
  return { type: "PushEvent", repo: { name: repo }, payload: { head }, created_at: createdAt };
}

const EVENTS = [
  pushEvent("rohanthomas1202/website", "2026-07-05T12:00:00Z", "bbb222"),
  { type: "WatchEvent", repo: { name: "rohanthomas1202/website" }, created_at: "2026-07-05T13:00:00Z" },
  pushEvent("rohanthomas1202/website", "2026-07-04T09:00:00Z", "ccc333"),
  pushEvent("rohanthomas1202/truthlayer", "2026-07-05T15:00:00Z", "ddd444"),
  pushEvent("rohanthomas1202/shipyard", "2026-07-03T08:00:00Z", "eee555"),
  pushEvent("rohanthomas1202/pokerstats", "2026-07-02T08:00:00Z", "fff666"),
];

describe("shapePushes", () => {
  it("keeps only push events with their head SHA", () => {
    const pushes = shapePushes(EVENTS, 10);
    const website = pushes.find((p) => p.repo === "rohanthomas1202/website");
    expect(website?.sha).toBe("bbb222");
  });

  it("dedupes by repo keeping the newest push and sorts newest-first", () => {
    const pushes = shapePushes(EVENTS, 10);
    expect(pushes.map((p) => p.repo.split("/").pop())).toEqual([
      "truthlayer",
      "website",
      "shipyard",
      "pokerstats",
    ]);
  });

  it("caps at the limit (default 3)", () => {
    expect(shapePushes(EVENTS)).toHaveLength(3);
    expect(shapePushes(EVENTS, 2).map((p) => p.sha)).toEqual(["ddd444", "bbb222"]);
  });

  it("keeps the iso timestamp of the push", () => {
    const [first] = shapePushes(EVENTS);
    expect(first.iso).toBe("2026-07-05T15:00:00Z");
  });

  it("ignores malformed events, including old-shape pushes without a head", () => {
    expect(
      shapePushes([
        null,
        42,
        { type: "PushEvent" },
        { type: "PushEvent", repo: { name: "me/old" }, payload: { commits: [] }, created_at: "2026-07-05T12:00:00Z" },
      ]),
    ).toEqual([]);
  });
});

describe("commitMessage", () => {
  it("takes the first line of the commit message", () => {
    expect(
      commitMessage({ commit: { message: "feat: hero polish\n\nlong body that should be dropped" } }),
    ).toBe("feat: hero polish");
  });

  it("truncates long first lines to 80 chars", () => {
    const message = commitMessage({ commit: { message: "a".repeat(120) } });
    expect(message).toHaveLength(80);
    expect(message?.endsWith("…")).toBe(true);
  });

  it("returns null for malformed or empty responses", () => {
    expect(commitMessage(null)).toBeNull();
    expect(commitMessage({})).toBeNull();
    expect(commitMessage({ commit: { message: "" } })).toBeNull();
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
