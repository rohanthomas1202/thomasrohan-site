import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { Intro } from "./intro";

vi.mock("@/lib/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

describe("Intro (reduced motion — skip path)", () => {
  beforeEach(() => {
    document.body.className = "";
    sessionStorage.clear();
  });

  afterEach(() => {
    document.body.className = "";
    sessionStorage.clear();
  });

  it("adds revealed class to body immediately and renders no curtain", async () => {
    const { container } = render(<Intro />);

    await waitFor(() => {
      expect(document.body.classList.contains("revealed")).toBe(true);
    });

    // No curtain element rendered
    expect(container.firstChild).toBeNull();
  });

  it("dispatches the intro:done event on the skip path", async () => {
    const spy = vi.spyOn(window, "dispatchEvent");
    render(<Intro />);

    await waitFor(() => {
      const fired = spy.mock.calls.some(([e]) => (e as Event).type === "intro:done");
      expect(fired).toBe(true);
    });
    spy.mockRestore();
  });
});
