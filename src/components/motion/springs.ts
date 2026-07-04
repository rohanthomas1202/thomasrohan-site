export const SPRING = {
  press: { type: "spring", stiffness: 400, damping: 25 },
  reveal: { type: "spring", stiffness: 280, damping: 20 },
  hover: { type: "spring", stiffness: 350, damping: 22 },
  arrow: { type: "spring", stiffness: 500, damping: 30 },
  magnetic: { stiffness: 150, damping: 15 },
  highlight: { type: "spring", stiffness: 300, damping: 24 },
  settle: { type: "spring", stiffness: 380, damping: 10, mass: 0.6 },
} as const;
