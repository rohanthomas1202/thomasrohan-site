import { describe, it, expect } from "vitest";
import { SPRING } from "./springs";

describe("shared spring vocabulary", () => {
  it("defines the research-mandated physics", () => {
    expect(SPRING.press).toMatchObject({ type: "spring", stiffness: 400, damping: 25 });
    expect(SPRING.reveal).toMatchObject({ type: "spring", stiffness: 280, damping: 20 });
    expect(SPRING.hover).toMatchObject({ type: "spring", stiffness: 350, damping: 22 });
    expect(SPRING.arrow).toMatchObject({ type: "spring", stiffness: 500, damping: 30 });
    expect(SPRING.magnetic).toMatchObject({ stiffness: 150, damping: 15 });
    expect(SPRING.highlight).toMatchObject({ type: "spring", stiffness: 300, damping: 24 });
    expect(SPRING.settle).toMatchObject({ type: "spring", stiffness: 380, damping: 10, mass: 0.6 });
    expect(SPRING.cursor).toMatchObject({ stiffness: 600, damping: 40 });
  });
});
