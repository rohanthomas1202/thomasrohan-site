import { describe, it, expect, beforeEach } from "vitest";
import { shouldPlayIntro, markIntroPlayed, INTRO_KEY } from "./intro";

beforeEach(() => sessionStorage.clear());
describe("shouldPlayIntro", () => {
  it("pins the storage key", () => { expect(INTRO_KEY).toBe("rt-intro-played"); });
  it("plays on first visit", () => { expect(shouldPlayIntro(sessionStorage, false)).toBe(true); });
  it("does not play when reduced motion is on", () => { expect(shouldPlayIntro(sessionStorage, true)).toBe(false); });
  it("does not play once marked", () => { markIntroPlayed(sessionStorage); expect(shouldPlayIntro(sessionStorage, false)).toBe(false); });
});
