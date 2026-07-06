import { describe, it, expect } from "vitest";
import { projects } from "./projects";
import { roles } from "./experience";

describe("projects content", () => {
  it("has projects, each with a title and valid href", () => {
    expect(projects.length).toBeGreaterThan(0);
    for (const p of projects) {
      expect(p.title.trim().length).toBeGreaterThan(0);
      expect(p.href).toMatch(/^https?:\/\//);
      if (p.live) expect(p.live).toMatch(/^https?:\/\//);
    }
  });

  it("every project has an internal /work/ case-study route", () => {
    for (const p of projects) {
      expect(p.caseStudy).toMatch(/^\/work\/[a-z0-9-]+$/);
    }
  });

  it("every project has an accent token", () => {
    for (const p of projects) {
      expect(p.accent).toBeTruthy();
    }
  });
});
describe("experience content", () => {
  it("each role has a period and at least one highlight", () => {
    expect(roles.length).toBeGreaterThan(0);
    for (const r of roles) {
      expect(r.period.trim().length).toBeGreaterThan(0);
      expect(r.highlights.length).toBeGreaterThan(0);
    }
  });
});
describe("compressed experience view", () => {
  it("every role has a headline metric and label", () => {
    for (const r of roles) {
      expect(r.headline.metric.length).toBeGreaterThan(0);
      expect(r.headline.label.length).toBeGreaterThan(0);
    }
  });
});
