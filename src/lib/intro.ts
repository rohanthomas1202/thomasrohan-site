export const INTRO_KEY = "rt-intro-played";
export function shouldPlayIntro(storage: Storage, reducedMotion: boolean) {
  if (reducedMotion) return false;
  return storage.getItem(INTRO_KEY) !== "1";
}
export function markIntroPlayed(storage: Storage) {
  storage.setItem(INTRO_KEY, "1");
}
