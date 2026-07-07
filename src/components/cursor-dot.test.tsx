import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CursorDot } from "./cursor-dot";

describe("CursorDot", () => {
  it("renders nothing without a fine hover-capable pointer (jsdom default)", () => {
    const { container } = render(<CursorDot />);
    expect(container).toBeEmptyDOMElement();
    expect(document.documentElement.classList.contains("cursor-none")).toBe(false);
  });
});
