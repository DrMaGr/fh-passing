const mirrorX = x => 91.4 - x; // Pitch is 91.4m wide

export const playerPositions = {
  // Home team
  GK:  { x: 5.4,   y: 27.6 },
  LB:  { x: 15.4,  y: 18.9 },
  RB:  { x: 16.3,  y: 34.6 },
  LHB: { x: 25.9,  y: 4.0 },
  RHB: { x: 27.2,  y: 51.6 },
  CH:  { x: 27.3,  y: 26.4 },
  LI:  { x: 37.1,  y: 13.9 },
  RI:  { x: 37.6,  y: 42.1 },
  LW:  { x: 43.4,  y: 2.0 },
  RW:  { x: 43.9,  y: 52.7 },
  CF:  { x: 43.9,  y: 28.0 }
};

export const oppositionPositions = {
  GK:  { x: 86,   y: 27.6 },
  LB:  { x: 74.1,  y: 33.2 },
  RB:  { x: 75.4,  y: 17.5 },
  LHB: { x: 64.4,  y: 48.2 },
  RHB: { x: 63.8,  y: 11.0 },
  CH:  { x: 62.4,  y: 28.3 },
  LI:  { x: 56.0,  y: 42.1 },
  RI:  { x: 51.9,  y: 13.9 },
  LW:  { x: 48.9,  y: 52.7 },
  RW:  { x: 48.9,  y: 2.0 },
  CF:  { x: 48.1,  y: 28.0 }
};
