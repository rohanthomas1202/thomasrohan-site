import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { useRef } from "react";
import { useMagnetic } from "./use-magnetic";

function Btn() { const r = useRef<HTMLButtonElement>(null); useMagnetic(r); return <button ref={r}>x</button>; }
describe("useMagnetic", () => {
  it("renders without crashing and leaves transform empty initially", () => {
    const { getByText } = render(<Btn />);
    expect((getByText("x") as HTMLButtonElement).style.transform).toBe("");
  });
});
