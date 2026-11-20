// scenes/shade.js — Two-Colour Character & Prop Shading Pass for Story 5 «المصعد المفتوح»
// Hard steps strictly on shot cuts (SHOTS_T) so zero mid-shot shading flicker occurs.
import { SHOTS_T, LOBBY_X, RAIN_X, SHAFT_X, COSMOS_X } from './motion.js';

export const makeShade = () => ({
  zones: {
    lobby:          [LOBBY_X,  0],
    rain_street:    [RAIN_X,   0],
    sideways_shaft: [SHAFT_X,  0],
    cosmos:         [COSMOS_X, 0],
  },
  steps: SHOTS_T.slice(1),
  places: {
    lobby: {
      exposure: 1.06,
      sat: 0.98,
      keyTint:  [1.08, 0.92, 0.66],
      fillTint: [0.52, 0.72, 0.70],
      hard: 0.50,
      rim: 0.52,
      rimFill: 0.34,
      low: 0.50,
      chest: 0.34,
      front: -0.16,
      floor:  [0.44, 0.46, 0.44],
      keyMin: [0.84, 0.78, 0.66],
      extra: [
        { id: 'emerald_fill', kind: 'sun', dir: [-0.80, 0.25, 0.55], color: [0.28, 0.54, 0.52], power: 0.32 },
      ],
      aerial: { color: [0.09, 0.07, 0.03], density: 0.006, max: 0.12 },
      metal: { spec: 0.80, env: 0.34, keep: 0.64 },
    },

    rain_street: {
      exposure: 1.08,
      sat: 1.02,
      keyTint:  [0.74, 0.92, 1.12],
      fillTint: [1.08, 0.76, 0.44],
      hard: 0.48,
      rim: 0.62,
      rimFill: 0.40,
      low: 0.52,
      chest: 0.32,
      front: -0.15,
      floor:  [0.42, 0.48, 0.60],
      keyMin: [0.78, 0.84, 0.94],
      extra: [
        // Warm amber cab key from RIGHT side against cold cobalt neon rain street on LEFT!
        { id: 'cab_amber_right', kind: 'point', pos: [RAIN_X + 2.4, 3.2, -1.2], color: [1.0, 0.74, 0.36], power: 1.15, fall: 0.18, range: 9 },
        { id: 'neon_cyan_left',  kind: 'sun',   dir: [-0.82, 0.28, 0.50], color: [0.32, 0.82, 1.0], power: 0.36 },
      ],
      aerial: { color: [0.03, 0.07, 0.15], density: 0.005, max: 0.10 },
      metal: { spec: 0.86, env: 0.38, keep: 0.62 },
    },

    sideways_shaft: {
      exposure: 1.06,
      sat: 1.04,
      keyTint:  [1.12, 0.82, 0.52],
      fillTint: [0.44, 0.62, 0.90],
      hard: 0.56,
      rim: 0.64,
      rimFill: 0.38,
      low: 0.48,
      chest: 0.36,
      front: -0.18,
      floor:  [0.42, 0.44, 0.56],
      keyMin: [0.84, 0.74, 0.64],
      extra: [
        { id: 'steel_rim', kind: 'sun', dir: [-0.85, 0.30, -0.40], color: [0.32, 0.55, 0.92], power: 0.36 },
      ],
      aerial: { color: [0.10, 0.06, 0.03], density: 0.007, max: 0.12 },
      metal: { spec: 0.88, env: 0.36, keep: 0.60 },
    },

    cosmos: {
      exposure: 1.08,
      sat: 1.06,
      keyTint:  [1.08, 0.95, 0.74],
      fillTint: [0.54, 0.68, 1.08],
      hard: 0.44,
      rim: 0.70,
      rimFill: 0.44,
      low: 0.56,
      chest: 0.28,
      front: -0.14,
      floor:  [0.50, 0.48, 0.68],
      keyMin: [0.86, 0.84, 0.94],
      extra: [
        { id: 'star_cyan_rim', kind: 'sun', dir: [-0.72, 0.42, 0.55], color: [0.42, 0.90, 1.0], power: 0.42 },
        { id: 'nebula_gold',   kind: 'sun', dir: [0.68, 0.52, -0.50], color: [1.0, 0.80, 0.44], power: 0.36 },
      ],
      aerial: { color: [0.05, 0.04, 0.14], density: 0.0025, max: 0.06 },
      metal: { spec: 0.86, env: 0.42, keep: 0.65 },
    },
  },
});
