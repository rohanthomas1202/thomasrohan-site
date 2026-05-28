import { describe, it, expect, vi } from "vitest";
import { pointerStore } from "./pointer-store";

describe("pointerStore", () => {
  it("starts centered with zero scroll", () => {
    const s = pointerStore.get();
    expect(s.nx).toBe(0); expect(s.ny).toBe(0); expect(s.scrollY).toBe(0);
  });
  it("notifies subscribers and allows unsubscribe", () => {
    const cb = vi.fn();
    const off = pointerStore.subscribe(cb);
    pointerStore.set({ nx: 0.25 });
    expect(cb).toHaveBeenCalled();
    off();
    cb.mockClear();
    pointerStore.set({ nx: 0.1 });
    expect(cb).not.toHaveBeenCalled();
  });
});
