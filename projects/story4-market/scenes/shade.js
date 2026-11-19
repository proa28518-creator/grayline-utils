// scenes/shade.js — Character & Prop Two-Colour Shading Pass for Story 4 ("الناجي الوحيد من الطابور").
// Clean hard steps strictly on shot cuts (SHOTS_T) so zero mid-shot shading flicker occurs.
// Market: crisp fluorescent cyan-white key vs deep cool teal-slate shadow (shifting warmer on soup & spark beats).
// Outer: warm tungsten golden key vs rich dusk-plum shadow.
import { SHOTS_T, OUTER_X } from './motion.js';

export const makeShade = () => ({
  zones: {
    market: [0, 0],
    outer:  [OUTER_X, 0],
  },
  steps: SHOTS_T.slice(1),
  places: {
    market: {
      exposure: 1.05,
      sat: 0.95,
      keyTint:  [0.95, 0.99, 1.04],
      fillTint: [0.68, 0.84, 0.98],
      hard: 0.48,
      rim: 0.45,
      rimFill: 0.32,
      low: 0.50,
      chest: 0.32,
      front: -0.18,
      floor:  [0.44, 0.52, 0.60],
      keyMin: [0.82, 0.85, 0.88],
      extra: [
        { id: 'cool_side', kind: 'sun', dir: [-0.75, 0.35, 0.55], color: [0.35, 0.58, 0.75], power: 0.28 },
      ],
      aerial: { color: [0.06, 0.12, 0.16], density: 0.008, max: 0.14 },
      metal: { spec: 0.65, env: 0.30, keep: 0.65 },
    },
    outer: {
      exposure: 1.06,
      sat: 1.02,
      keyTint:  [1.06, 0.94, 0.76],
      fillTint: [0.76, 0.72, 0.90],
      hard: 0.46,
      rim: 0.48,
      rimFill: 0.35,
      low: 0.52,
      chest: 0.30,
      front: -0.15,
      floor:  [0.48, 0.42, 0.50],
      keyMin: [0.86, 0.82, 0.74],
      extra: [
        { id: 'globe_cyan_bounce', kind: 'point', pos: [OUTER_X, 2.4, 0.4], color: [0.45, 0.88, 1.0], power: 0.85, fall: 0.22, range: 6 },
      ],
      aerial: { color: [0.14, 0.10, 0.06], density: 0.006, max: 0.12 },
      metal: { spec: 0.72, env: 0.35, keep: 0.65 },
    },
  },
});
