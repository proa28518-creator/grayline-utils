// scenes/post.js — Calibrated 4-World Colour Script Post Pipeline for Story 6 «الشوكولاتة اللي ساحت»
// Generic grading for LAB (radar lab), MICRO (microwave close-up), SHOW (1950s show demo), GRID (technical diagrams).
import { LAB_X, MICRO_X, SHOW_X, GRID_X } from './motion.js';

export const makePost = () => ({
  quality: 'auto',
  maxBlur: 20,
  blend: 0.08,
  zones: {
    lab:   [LAB_X,   0],
    micro: [MICRO_X, 0],
    show:  [SHOW_X,  0],
    grid:  [GRID_X,  0],
  },
  // A12 F3 (phase-2): focus follows the SUBJECT of each world instead of
  // locking the engineer for all 56.2 s. world/look/focus.js accepts a world
  // point [x,y,z] (focus distance = its view depth); first matching span
  // wins, so specific spans come first and the engineer catch-all last.
  focus: [
    [32.26, 36.46, [400, 3, 0]],           // S14 micro: the hero molecule
    // ROUND-3 (R3-9): S16's food moved to the micro void (micro-local
    // (0, ~1.35, -2.5)) — focus follows it there (was the lab bench cluster).
    [38.24, 40.61, [400, 1.35, -2.50]],    // S16: food cross-section in the void
    [43.27, 50.34, [798, 2.4, 0]],         // S18–S19 showroom: the giant oven
    [50.34, 53.45, [1201.3, 1.25, -2.95]], // S20 grid: anchor-kitchen microwave
    [0.00, 56.29, 'engineer'],             // lab shots + S15/S17/S21 catch-all
  ],
  places: {
    lab: {
      rig: 'lab',
      air: {
        density: 0.010, start: [3.0, 11.0], far: 54,
        color: [0.032, 0.028, 0.022],
        lights: 0.16, g: 0.42,
        noise: 0.12, noiseScale: 0.18, noiseSpeed: 0.05,
      },
      dof: { aperture: 8, nearK: 0.14, dead: 2.4 },
      bloom: { k: 0.20, thr: 0.86 },
      particles: [
        { mode: 'box', count: 650, box: [18, 8.5, 22], vel: [0.03, -0.02, 0.02], velVar: [0.04, 0.03, 0.04], sway: 0.12, swaySpeed: 0.60, size: 0.010, color: [1.0, 0.92, 0.78], alpha: 0.42, lit: 1.0, ambient: 0.28 },
      ],
      gain: 1.28,
      grade: { gamma: 1.05, contrast: 1.06, saturation: 1.12, gr: 1.05, gg: 1.02, gb: 0.94, vignette: 0.32 },
    },

    micro: {
      rig: 'micro',
      air: {
        density: 0.008, start: [2.5, 9.0], far: 42,
        color: [0.028, 0.024, 0.020],
        lights: 0.18, g: 0.44,
        noise: 0.10, noiseScale: 0.16, noiseSpeed: 0.06,
      },
      dof: { aperture: 6, nearK: 0.12, dead: 2.8 },
      bloom: { k: 0.22, thr: 0.88 },
      particles: [
        { mode: 'box', count: 420, box: [14, 7, 18], vel: [0.02, -0.01, 0.02], velVar: [0.03, 0.02, 0.03], sway: 0.10, swaySpeed: 0.55, size: 0.009, color: [0.96, 0.88, 0.72], alpha: 0.38, lit: 1.0, ambient: 0.32 },
      ],
      gain: 1.26,
      grade: { gamma: 1.06, contrast: 1.08, saturation: 1.10, gr: 1.03, gg: 1.01, gb: 0.92, vignette: 0.30 },
    },

    show: {
      rig: 'show',
      air: {
        density: 0.009, start: [3.0, 10.0], far: 48,
        color: [0.024, 0.022, 0.028],
        lights: 0.20, g: 0.46,
        noise: 0.14, noiseScale: 0.20, noiseSpeed: 0.05,
      },
      dof: { aperture: 7, nearK: 0.13, dead: 2.6 },
      bloom: { k: 0.24, thr: 0.86 },
      particles: [
        { mode: 'box', count: 580, box: [16, 8, 20], vel: [0.04, -0.02, 0.03], velVar: [0.05, 0.03, 0.04], sway: 0.13, swaySpeed: 0.62, size: 0.011, color: [1.0, 0.86, 0.64], alpha: 0.45, lit: 1.05, ambient: 0.30 },
      ],
      gain: 1.30,
      grade: { gamma: 1.04, contrast: 1.08, saturation: 1.16, gr: 1.04, gg: 1.01, gb: 0.96, vignette: 0.34 },
    },

    grid: {
      rig: 'grid',
      air: {
        density: 0.006, start: [4.0, 12.0], far: 60,
        color: [0.018, 0.020, 0.026],
        lights: 0.14, g: 0.40,
        noise: 0.08, noiseScale: 0.14, noiseSpeed: 0.05,
      },
      dof: { aperture: 9, nearK: 0.10, dead: 3.0 },
      bloom: { k: 0.18, thr: 0.90 },
      particles: [
        { mode: 'box', count: 380, box: [16, 8, 20], vel: [0.02, -0.01, 0.02], velVar: [0.03, 0.02, 0.03], sway: 0.08, swaySpeed: 0.50, size: 0.008, color: [0.88, 0.94, 1.0], alpha: 0.35, lit: 0.9, ambient: 0.40 },
      ],
      gain: 1.28,
      // A7 P3: warm the grid grade (gb down, gr up) — the homes must read warm.
      grade: { gamma: 1.07, contrast: 1.06, saturation: 1.08, gr: 1.05, gg: 1.02, gb: 0.94, vignette: 0.30 },
    },
  },
});
