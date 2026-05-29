import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ScrollProgress } from "./scroll-progress";

describe("ScrollProgress", () => {
  it("renders a bar element with the accent class", () => {
    const { container } = render(<ScrollProgress />);
    const bar = container.querySelector("div");
    expect(bar).not.toBeNull();
    expect(bar?.className).toContain("bg-accent");
  });

  it("is aria-hidden", () => {
    const { container } = render(<ScrollProgress />);
    const bar = container.querySelector("div");
    expect(bar?.getAttribute("aria-hidden")).toBe("true");
  });
});
