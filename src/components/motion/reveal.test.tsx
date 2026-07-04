import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Reveal, RevealItem } from "./reveal";

describe("Reveal system", () => {
  it("renders children", () => {
    render(
      <Reveal>
        <RevealItem>
          <p>content</p>
        </RevealItem>
      </Reveal>,
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
