import { describe, it, expect } from "vitest";
import { AVAILABILITY, AVAILABILITY_SENTENCE, EYEBROW, NOW_PHRASE, formatLastCommit } from "./now";

describe("availability copy", () => {
  it("keeps each surface's copy verbatim", () => {
    expect(EYEBROW).toBe("Rohan Thomas · Austin, TX · taking new projects");
    expect(AVAILABILITY_SENTENCE).toBe("Taking new projects");
    expect(NOW_PHRASE).toBe("building AI agents · taking on new projects");
  });
  it("sentence-cases whatever AVAILABILITY becomes", () => {
    expect(AVAILABILITY_SENTENCE).toBe(AVAILABILITY.charAt(0).toUpperCase() + AVAILABILITY.slice(1));
  });
});

const NOW = new Date("2026-07-03T12:00:00Z");

describe("formatLastCommit", () => {
  it("formats recent pushes in hours", () => {
    expect(formatLastCommit("2026-07-03T09:00:00Z", NOW)).toBe("3 hours ago");
  });
  it("formats sub-hour pushes plainly", () => {
    expect(formatLastCommit("2026-07-03T11:40:00Z", NOW)).toBe("in the last hour");
  });
  it("formats older pushes in days", () => {
    expect(formatLastCommit("2026-07-01T12:00:00Z", NOW)).toBe("2 days ago");
  });
  it("hides when stale beyond 7 days", () => {
    expect(formatLastCommit("2026-06-20T12:00:00Z", NOW)).toBeNull();
  });
  it("hides on invalid or future timestamps", () => {
    expect(formatLastCommit("not-a-date", NOW)).toBeNull();
    expect(formatLastCommit("2026-07-04T12:00:00Z", NOW)).toBeNull();
  });
});
