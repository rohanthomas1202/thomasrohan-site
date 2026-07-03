import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
afterEach(() => cleanup());
if (!window.matchMedia) {
  window.matchMedia = (q: string) =>
    ({ matches: false, media: q, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false; } }) as MediaQueryList;
}
if (!("IntersectionObserver" in window)) {
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  }
  // @ts-expect-error test stub
  window.IntersectionObserver = IO;
}
