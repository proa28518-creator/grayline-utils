// scenes/post.js — 4-State Colour Script Post Pipeline for Story 4 ("الناجي الوحيد من الطابور").
// Calibrated to BIBLE.md & references/quality-bar.md:
//   - market_cold   (0.00 - 15.80 s): Cold Fluorescent Limbo, zero-velocity frozen dust particles, crisp cyan depth
//   - market_soup   (15.80 - 28.24 s): Amber-Tomato Avalanche, gentle aperture so slow-mo soup cans stay razor-sharp, swirling amber dust
//   - market_hazard (28.24 - 40.12 s): High-Contrast Hazard Sparks, warm spark bloom & crisp isolation
//   - market_thaw   (40.12 - 48.49 s): Thawing Glare, bright caustic bloom pouring from front glass doors
//   - outer         (48.49 - 58.64 s): Golden Outer Store Reveal, warm tungsten grade, macro bokeh over 38 D outer queue, floating snow
import { OUTER_X } from './motion.js';

export const makePost = () => ({
  quality: 'auto',
  maxBlur: 22,
  blend: 0.08,
  zones: {
    market: [0, 0],
    outer:  [OUTER_X, 0],
  },
  // Clean state switches strictly on shot cuts (zero mid-shot pops!)
  states: [
    { from: 15.80, zone: 'market', use: 'market_soup' },
    { from: 28.24, zone: 'market', use: 'market_hazard' },
    { from: 40.12, zone: 'market', use: 'market_thaw' },
  ],
  // Per-shot focus overrides so S09/S10 soup cans & S22-S24 snow globe stay tack-sharp!
  focus: [
    [0.00,  15.80, 'clerk'],
    [15.80, 18.98, 'red_cart'],
    [18.98, 23.72, 'clerk'],
    [23.72, 32.33, 'clerk'],
    [32.33, 33.96, 'guard_cap'],
    [33.96, 48.49, 'clerk'],
    [48.49, 53.93, [OUTER_X, 2.52, 0.20]], // snow globe center!
    [53.93, 59.00, [OUTER_X, 2.30, -0.50]], // between snow globe & real_customer!
  ],
  places: {
    market: {
      rig: 'market',
      air: {
        density: 0.011, start: [2.5, 10.0], far: 68,
        color: [0.022, 0.055, 0.072],
        lights: 0.22, g: 0.45,
        noise: 0.14, noiseScale: 0.18, noiseSpeed: 0.0,
      },
      dof: { aperture: 9, nearK: 0.16, dead: 1.8 },
      bloom: { k: 0.24, thr: 0.78 },
      particles: [
        // Frozen zero-velocity dust motes hanging dead still in frozen time!
        { mode: 'box', count: 550, box: [18, 7, 26], vel: [0, 0, 0], sway: 0, size: 0.012, color: [0.85, 0.97, 1.0], alpha: 0.55, lit: 1.3, ambient: 0.25 },
      ],
      gain: 1.04,
      grade: { gamma: 0.98, contrast: 1.06, saturation: 1.12, gr: 0.98, gg: 1.01, gb: 1.04, vignette: 0.28 },
    },
    market_soup: {
      rig: 'market',
      air: {
        density: 0.014, start: [3.0, 12.0], far: 64,
        color: [0.065, 0.042, 0.028],
        lights: 0.28, g: 0.50,
        noise: 0.22, noiseScale: 0.20, noiseSpeed: 0.25,
      },
      // Very gentle aperture + wide dead zone so ALL 42 mid-air soup cans read crisp one by one!
      dof: { aperture: 6, nearK: 0.12, dead: 4.5 },
      bloom: { k: 0.28, thr: 0.76 },
      particles: [
        // Warm swirling avalanche dust motes
        { mode: 'box', count: 700, box: [18, 7, 22], vel: [0.15, 0.12, 0.35], velVar: [0.2, 0.15, 0.25], sway: 0.18, swaySpeed: 1.2, size: 0.014, color: [1.0, 0.84, 0.62], alpha: 0.55, lit: 1.4, ambient: 0.25 },
      ],
      gain: 1.05,
      grade: { gamma: 0.97, contrast: 1.09, saturation: 1.16, gr: 1.04, gg: 1.00, gb: 0.96, vignette: 0.30 },
    },
    market_hazard: {
      rig: 'market',
      air: {
        density: 0.013, start: [2.5, 11.0], far: 62,
        color: [0.026, 0.038, 0.062],
        lights: 0.26, g: 0.52,
        noise: 0.18, noiseScale: 0.22, noiseSpeed: 0.35,
      },
      dof: { aperture: 9, nearK: 0.14, dead: 2.2 },
      bloom: { k: 0.32, thr: 0.74 },
      particles: [
        // Flying speed dust + orange sparks
        { mode: 'box', count: 550, box: [16, 6, 22], vel: [0.0, 0.08, -1.8], velVar: [0.3, 0.2, 0.6], shutter: 0.04, cocK: 0.2, size: 0.011, color: [1.0, 0.78, 0.42], alpha: 0.62, lit: 1.3, ambient: 0.4 },
      ],
      gain: 1.04,
      grade: { gamma: 0.95, contrast: 1.12, saturation: 1.15, gr: 1.03, gg: 0.99, gb: 0.98, vignette: 0.34 },
    },
    market_thaw: {
      rig: 'market',
      air: {
        density: 0.012, start: [2.5, 10.0], far: 60,
        color: [0.055, 0.075, 0.085],
        lights: 0.34, g: 0.58,
        noise: 0.15, noiseScale: 0.20, noiseSpeed: 0.4,
      },
      dof: { aperture: 8, nearK: 0.15, dead: 2.4 },
      bloom: { k: 0.38, thr: 0.72 },
      particles: [
        { mode: 'box', count: 600, box: [16, 6, 22], vel: [0, -0.15, -2.4], velVar: [0.25, 0.15, 0.8], shutter: 0.03, cocK: 0.25, size: 0.013, color: [0.95, 0.98, 1.0], alpha: 0.65, lit: 1.4, ambient: 0.45 },
      ],
      gain: 1.06,
      grade: { gamma: 1.00, contrast: 1.08, saturation: 1.14, gr: 1.02, gg: 1.01, gb: 1.00, vignette: 0.28 },
    },
    outer: {
      rig: 'outer',
      air: {
        density: 0.009, start: [3.5, 12.0], far: 54,
        color: [0.075, 0.052, 0.032],
        lights: 0.24, g: 0.50,
        noise: 0.10, noiseScale: 0.16, noiseSpeed: 0.08,
      },
      // Warm macro bokeh behind the desk while keeping snow globe + real_customer sharp!
      dof: { aperture: 11, nearK: 0.16, dead: 2.0 },
      bloom: { k: 0.28, thr: 0.78 },
      particles: [
        // Drifting white snow particles escaping from the cracked snow globe!
        { mode: 'box', count: 420, box: [12, 6, 12], vel: [0.08, -0.18, 0.06], velVar: [0.15, 0.08, 0.15], sway: 0.15, swaySpeed: 1.0, size: 0.016, color: [1.0, 0.99, 0.96], alpha: 0.72, lit: 1.1, ambient: 0.55 },
      ],
      gain: 1.06,
      grade: { gamma: 1.04, contrast: 1.06, saturation: 1.20, gr: 1.05, gg: 1.01, gb: 0.93, vignette: 0.30 },
    },
  },
});
