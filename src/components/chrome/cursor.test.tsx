import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { Cursor } from "./cursor";

vi.mock("@/lib/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

describe("Cursor", () => {
  it("renders nothing when prefers-reduced-motion is true", () => {
    const { container } = render(<Cursor />);
    expect(container.firstChild).toBeNull();
  });
});
