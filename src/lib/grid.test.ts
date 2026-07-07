import { describe, it, expect } from "vitest";
import { columnPosition } from "./grid";
import { projects, type Project } from "@/content/projects";

describe("columnPosition", () => {
  it("places the current 7-project packing at [0,1,0,1,2,0,1]", () => {
    expect(projects.map((_, i) => columnPosition(i, projects))).toEqual([
      0, 1, 0, 1, 2, 0, 1,
    ]);
  });

  it("wraps a card that would straddle the row edge to position 0", () => {
    const p = (over: Partial<Project>): Project =>
      ({ title: "t", blurb: "b", stack: "s", year: "y", tag: "g", href: "h", accent: "blue", ...over }) as Project;
    const grid = [p({}), p({}), p({ wide: true }), p({})];
    // spans 2+2 fill 4; the wide 3 wraps to a new row, the last 2 follows it
    expect(grid.map((_, i) => columnPosition(i, grid))).toEqual([0, 1, 0, 1]);
  });
});
