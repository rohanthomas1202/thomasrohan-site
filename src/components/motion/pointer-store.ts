type State = { nx: number; ny: number; scrollY: number };
type Sub = (s: State) => void;

const state: State = { nx: 0, ny: 0, scrollY: 0 };
const subs = new Set<Sub>();
let started = false;
let target = { nx: 0, ny: 0 };

export const pointerStore = {
  get: () => state,
  set: (p: Partial<State>) => { Object.assign(state, p); subs.forEach((s) => s(state)); },
  subscribe(cb: Sub) { subs.add(cb); return () => subs.delete(cb); },
  start() {
    if (started || typeof window === "undefined") return;
    started = true;
    const onMove = (e: PointerEvent) => {
      target.nx = e.clientX / window.innerWidth - 0.5;
      target.ny = e.clientY / window.innerHeight - 0.5;
    };
    const onScroll = () => { state.scrollY = window.scrollY; subs.forEach((s) => s(state)); };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    const loop = () => {
      state.nx += (target.nx - state.nx) * 0.12;
      state.ny += (target.ny - state.ny) * 0.12;
      subs.forEach((s) => s(state));
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  },
};
