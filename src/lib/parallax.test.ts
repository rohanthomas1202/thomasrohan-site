import { describe, it, expect } from "vitest";
import { depthTransform } from "./parallax";

describe("depthTransform", () => {
  it("returns zero offset at center with no scroll", () => {
    expect(depthTransform(40, 0, 0, 0)).toEqual({ x: 0, y: 0 });
  });
  it("moves opposite the pointer, scaled by depth", () => {
    const { x } = depthTransform(40, 0.5, 0, 0);
    expect(x).toBeCloseTo(-20);
  });
  it("adds downward scroll drift scaled by depth", () => {
    const { y } = depthTransform(40, 0, 0, 1000);
    expect(y).toBeCloseTo(-0 - 1000 * 40 * 0.012);
  });
});
