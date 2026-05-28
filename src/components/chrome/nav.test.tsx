import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Nav } from "./nav";

describe("Nav", () => {
  it("renders all four nav link labels", () => {
    const { getByText } = render(<Nav />);
    expect(getByText("Work")).toBeTruthy();
    expect(getByText("Experience")).toBeTruthy();
    expect(getByText("Stack")).toBeTruthy();
    expect(getByText("Contact")).toBeTruthy();
  });

  it("renders the Get in touch CTA", () => {
    render(<Nav />);
    expect(screen.getByText("Get in touch")).toBeTruthy();
  });
});
