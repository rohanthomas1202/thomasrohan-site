import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Nav } from "./nav";

describe("Nav", () => {
  it("renders the name linking home", () => {
    render(<Nav />);
    const name = screen.getByRole("link", { name: /rohan thomas/i });
    expect(name).toHaveAttribute("href", "/");
  });

  it("renders root-relative anchor links to all four sections", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /^work$/i })).toHaveAttribute("href", "/#work");
    expect(screen.getByRole("link", { name: /offers/i })).toHaveAttribute("href", "/#offers");
    expect(screen.getByRole("link", { name: /track record/i })).toHaveAttribute("href", "/#about");
    expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute("href", "/#contact");
  });
});
