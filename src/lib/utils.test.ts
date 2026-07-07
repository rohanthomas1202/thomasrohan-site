import { describe, it, expect } from "vitest";
import { accentFromTint } from "./utils";

describe("accentFromTint", () => {
  it("maps every tint class to its accent CSS var", () => {
    expect(accentFromTint("bg-blue-tint")).toBe("var(--blue)");
    expect(accentFromTint("bg-tangerine-tint")).toBe("var(--tangerine)");
    expect(accentFromTint("bg-pink-tint")).toBe("var(--pink)");
    expect(accentFromTint("bg-green-tint")).toBe("var(--green)");
    expect(accentFromTint("bg-violet-tint")).toBe("var(--violet)");
  });

  it("falls back to ink for unknown classes", () => {
    expect(accentFromTint("bg-mystery-tint")).toBe("var(--ink)");
  });
});
