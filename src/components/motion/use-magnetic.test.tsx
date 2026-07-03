import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { useRef } from "react";
import { motion } from "motion/react";
import { useMagnetic } from "./use-magnetic";

function Btn() {
  const r = useRef<HTMLButtonElement>(null);
  const { x, y } = useMagnetic(r);
  return (
    <motion.button ref={r} style={{ x, y }}>
      x
    </motion.button>
  );
}

describe("useMagnetic (motion values)", () => {
  it("renders and exposes zeroed motion values initially", () => {
    const { getByText } = render(<Btn />);
    const el = getByText("x");
    expect(el.style.transform === "" || el.style.transform === "none").toBe(true);
  });
});
