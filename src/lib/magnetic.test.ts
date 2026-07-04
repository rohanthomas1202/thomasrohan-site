import { describe, it, expect } from "vitest";
import { magneticOffset } from "./magnetic";

const rect = { left: 100, top: 100, width: 100, height: 40 };
describe("magneticOffset", () => {
  it("is zero when pointer is at element center", () => {
    expect(magneticOffset(150, 120, rect, 0.4)).toEqual({ x: 0, y: 0 });
  });
  it("pulls toward pointer scaled by strength", () => {
    expect(magneticOffset(200, 120, rect, 0.4).x).toBeCloseTo(20);
  });
});
