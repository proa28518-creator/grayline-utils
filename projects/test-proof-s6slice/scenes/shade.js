// scenes/shade.js — Two-Colour Character & Prop Shading Pass for Story 6 «الشوكولاتة اللي ساحت»
// Generic shading for LAB (warm fluorescent), MICRO (neutral close-up), SHOW (stage spotlight), GRID (cool technical).
// ROUND-3 (A31-M3): hard steps strictly on shot cuts (SHOTS_T) so the light
// sampler never reads across a cut — Story-5 contract. Was `steps: []`,
// which blended character shading across all 20 boundaries.
import { LAB_X, MICRO_X, SHOW_X, GRID_X, SHOTS_T } from './motion.js';

export const makeShade = () => ({
  zones: {
    lab:   [LAB_X,   0],
    micro: [MICRO_X, 0],
    show:  [SHOW_X,  0],
    grid:  [GRID_X,  0],
  },
  steps: SHOTS_T.slice(1),
  places: {
    lab: {
      exposure: 1.04,
      sat: 0.98,
      keyTint:  [1.06, 0.94, 0.72],
      fillTint: [0.58, 0.68, 0.82],
      hard: 0.48,
      rim: 0.54,
      rimFill: 0.36,
      low: 0.50,
      chest: 0.34,
      front: -0.16,
      floor:  [0.46, 0.48, 0.50],
      keyMin: [0.82, 0.78, 0.68],
      extra: [
        { id: 'cool_window_fill', kind: 'sun', dir: [-0.75, 0.30, 0.60], color: [0.62, 0.78, 0.92], power: 0.28 },
      ],
      aerial: { color: [0.08, 0.07, 0.05], density: 0.005, max: 0.10 },
      metal: { spec: 0.82, env: 0.36, keep: 0.62 },
    },

    micro: {
      exposure: 1.06,
      sat: 1.00,
      // A7 P9: night-blue key so characters in the molecule world take the
      // world's blue, not a warm-neutral tint.
      keyTint:  [0.84, 0.91, 1.08],
      fillTint: [0.78, 0.84, 0.92],
      hard: 0.52,
      rim: 0.50,
      rimFill: 0.32,
      low: 0.48,
      chest: 0.36,
      front: -0.14,
      floor:  [0.48, 0.48, 0.52],
      keyMin: [0.84, 0.82, 0.76],
      extra: [],
      aerial: { color: [0.07, 0.06, 0.05], density: 0.004, max: 0.08 },
      metal: { spec: 0.84, env: 0.34, keep: 0.64 },
    },

    show: {
      exposure: 1.08,
      sat: 1.04,
      keyTint:  [1.10, 0.88, 0.62],
      fillTint: [0.64, 0.72, 0.96],
      hard: 0.54,
      rim: 0.60,
      rimFill: 0.38,
      low: 0.52,
      chest: 0.32,
      front: -0.18,
      floor:  [0.44, 0.46, 0.54],
      keyMin: [0.86, 0.76, 0.64],
      extra: [
        { id: 'stage_spotlight', kind: 'point', pos: [SHOW_X + 1.8, 4.5, -2.0], color: [1.0, 0.92, 0.78], power: 1.40, fall: 0.20, range: 10 },
        { id: 'audience_cool', kind: 'sun', dir: [-0.80, 0.20, 0.55], color: [0.48, 0.68, 0.92], power: 0.30 },
      ],
      aerial: { color: [0.06, 0.05, 0.07], density: 0.005, max: 0.10 },
      metal: { spec: 0.86, env: 0.38, keep: 0.60 },
    },

    grid: {
      exposure: 1.02,
      sat: 1.02,
      // A7 P3: warm the grid character shading to match the warm homes.
      // ROUND-3 (B5): fill/keyMin warmed further in step with the set.js
      // grid_amb warming — the anchor kitchen's furniture and the engineer
      // must read warm, not blue-grey (phase-2 residual).
      keyTint:  [1.05, 0.95, 0.78],
      fillTint: [0.68, 0.64, 0.66],
      hard: 0.46,
      rim: 0.58,
      rimFill: 0.40,
      low: 0.54,
      chest: 0.30,
      front: -0.12,
      floor:  [0.46, 0.50, 0.58],
      keyMin: [0.84, 0.82, 0.76],
      extra: [
        // A12 F2 (partial): cyan wash softened 0.34 -> 0.15 so it stops
        // fighting the warm grid grade; full removal is a look decision.
        { id: 'blueprint_cyan', kind: 'sun', dir: [-0.70, 0.35, 0.62], color: [0.52, 0.88, 1.0], power: 0.15 },
      ],
      aerial: { color: [0.05, 0.06, 0.08], density: 0.003, max: 0.06 },
      metal: { spec: 0.84, env: 0.40, keep: 0.66 },
    },
  },
});
