import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroHeadline, HEADLINE } from "./hero-headline";

describe("HeroHeadline", () => {
  beforeEach(() => sessionStorage.clear());

  it("exposes the exact headline as the h1 accessible name", () => {
    render(<HeroHeadline />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "I build AI products — agents, dev tools, and the interfaces around them.",
      }),
    ).toBeInTheDocument();
  });

  it("renders every word in an aria-hidden span", () => {
    render(<HeroHeadline />);
    const h1 = screen.getByRole("heading", { level: 1 });
    const hiddenWrap = h1.querySelector('[aria-hidden="true"]');
    expect(hiddenWrap).not.toBeNull();
    expect(hiddenWrap!.textContent!.replace(/\s+/g, " ").trim()).toBe(HEADLINE);
  });
});
