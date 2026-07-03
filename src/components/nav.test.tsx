import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Nav } from "./nav";

describe("Nav", () => {
  it("renders the name linking home", () => {
    render(<Nav />);
    const name = screen.getByRole("link", { name: /rohan thomas/i });
    expect(name).toHaveAttribute("href", "/");
  });

  it("renders anchor links to work, about, and contact", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /work/i })).toHaveAttribute("href", "#work");
    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute("href", "#about");
    expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute("href", "#contact");
  });
});
