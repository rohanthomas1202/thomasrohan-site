import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Parallax } from "./parallax";

vi.mock("@/lib/use-prefers-reduced-motion", () => ({ usePrefersReducedMotion: () => true }));

describe("Parallax (reduced motion)", () => {
  it("renders children without a transform", () => {
    render(<Parallax depth={40}><span>hi</span></Parallax>);
    const el = screen.getByText("hi").parentElement!;
    expect(el.style.transform).toBe("");
  });
});
