import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the hook before importing the component
vi.mock("@/lib/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: vi.fn(),
}));

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import HeroFx from "./hero-fx";

const mockUsePrefersReducedMotion = vi.mocked(usePrefersReducedMotion);

describe("HeroFx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not throw in jsdom (getContext returns null → null-guard fires)", () => {
    mockUsePrefersReducedMotion.mockReturnValue(false);
    // jsdom returns null for getContext('2d'); the null-guard must prevent any crash
    expect(() => render(<HeroFx />)).not.toThrow();
  });

  it("renders null when prefers-reduced-motion is true", () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);
    const { container } = render(<HeroFx />);
    expect(container.firstChild).toBeNull();
  });
});
