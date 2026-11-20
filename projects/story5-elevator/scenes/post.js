// scenes/post.js — Calibrated 4-World Colour Script Post Pipeline for Story 5 «المصعد المفتوح»
// Tuned after Frame 0 + 14-anchor visual inspection: high bloom threshold (0.86-0.90) so brass & walls stay rich and deep,
// zero white-out clipping, razor-sharp Farida + crisp stars, rain streaks, and horizontal shaft sparks!
import { LOBBY_X, RAIN_X, SHAFT_X, COSMOS_X, T_LEAP } from './motion.js';

export const makePost = () => ({
  quality: 'auto',
  maxBlur: 20,
  blend: 0.08,
  zones: {
    lobby:          [LOBBY_X,  0],
    rain_street:    [RAIN_X,   0],
    sideways_shaft: [SHAFT_X,  0],
    cosmos:         [COSMOS_X, 0],
  },
  focus: [
    [0.00, 61.00, 'farida'],
  ],
  places: {
    lobby: {
      rig: 'lobby',
      air: {
        density: 0.011, start: [3.0, 12.0], far: 58,
        color: [0.036, 0.028, 0.014],
        lights: 0.16, g: 0.42,
        noise: 0.14, noiseScale: 0.18, noiseSpeed: 0.08,
      },
      dof: { aperture: 9, nearK: 0.14, dead: 2.4 },
      bloom: { k: 0.18, thr: 0.88 },
      particles: [
        { mode: 'box', count: 750, box: [18, 8.5, 24], vel: [0.04, -0.02, 0.03], velVar: [0.05, 0.03, 0.05], sway: 0.14, swaySpeed: 0.65, size: 0.011, color: [1.0, 0.84, 0.48], alpha: 0.48, lit: 1.2, ambient: 0.25 },
      ],
      gain: 0.98,
      grade: { gamma: 0.92, contrast: 1.12, saturation: 1.16, gr: 1.04, gg: 0.99, gb: 0.91, vignette: 0.40 },
    },

    rain_street: {
      rig: 'rain_street',
      air: {
        density: 0.010, start: [3.0, 11.0], far: 64,
        color: [0.012, 0.026, 0.060],
        lights: 0.18, g: 0.48,
        noise: 0.12, noiseScale: 0.18, noiseSpeed: 0.28,
      },
      dof: { aperture: 8, nearK: 0.12, dead: 2.6 },
      bloom: { k: 0.24, thr: 0.84 },
      particles: [
        { mode: 'box', count: 1400, box: [22, 12, 26], vel: [-1.4, -10.5, 0.4], velVar: [0.4, 1.8, 0.3], shutter: 0.026, cocK: 0.08, nearFade: 1.6, size: 0.0085, color: [0.76, 0.90, 1.0], alpha: 0.58, lit: 1.2, ambient: 0.40 },
        { mode: 'box', count: 320, box: [18, 2.4, 20], vel: [0.45, 0.22, 0.1], velVar: [0.3, 0.2, 0.2], size: 0.013, color: [0.68, 0.88, 1.0], alpha: 0.32, lit: 1.1, ambient: 0.32 },
      ],
      gain: 0.98,
      grade: { gamma: 0.94, contrast: 1.14, saturation: 1.20, gr: 0.94, gg: 1.00, gb: 1.08, vignette: 0.40 },
    },

    sideways_shaft: {
      rig: 'sideways_shaft',
      air: {
        density: 0.013, start: [2.5, 10.0], far: 44,
        color: [0.034, 0.020, 0.012],
        lights: 0.18, g: 0.45,
        noise: 0.18, noiseScale: 0.22, noiseSpeed: 0.45,
      },
      dof: { aperture: 7, nearK: 0.12, dead: 2.8 },
      bloom: { k: 0.24, thr: 0.84 },
      particles: [
        { mode: 'box', count: 720, box: [22, 8, 18], vel: [-12.5, -0.35, 0.0], velVar: [3.2, 0.8, 0.4], shutter: 0.034, cocK: 0.12, nearFade: 1.5, size: 0.011, color: [1.0, 0.72, 0.28], alpha: 0.78, lit: 1.1, ambient: 0.75 },
      ],
      gain: 0.98,
      grade: { gamma: 0.92, contrast: 1.16, saturation: 1.18, gr: 1.05, gg: 0.98, gb: 0.92, vignette: 0.44 },
    },

    cosmos: {
      rig: 'cosmos',
      air: {
        density: 0.0032, start: [8.0, 26.0], far: 120,
        color: [0.018, 0.014, 0.048],
        lights: 0.12, g: 0.44,
        noise: 0.08, noiseScale: 0.12, noiseSpeed: 0.06,
      },
      dof: { aperture: 6, nearK: 0.10, dead: 3.6 },
      bloom: { k: 0.26, thr: 0.84 },
      particles: [
        { mode: 'box', count: 900, box: [28, 18, 34], vel: [0.06, 0.09, -0.08], velVar: [0.12, 0.12, 0.12], sway: 0.22, swaySpeed: 0.55, nearFade: 1.8, size: 0.014, color: [1.0, 0.92, 0.68], alpha: 0.72, lit: 0.9, ambient: 0.85 },
        { mode: 'box', count: 450, box: [26, 16, 32], vel: [-0.05, 0.06, 0.05], velVar: [0.10, 0.10, 0.10], sway: 0.18, swaySpeed: 0.45, nearFade: 1.8, size: 0.013, color: [0.58, 0.92, 1.0], alpha: 0.65, lit: 0.9, ambient: 0.85 },
        { mode: 'burst', t0: T_LEAP, life: 2.2, count: 320, at: [COSMOS_X + 0.5, 0.9, -0.8], spread: [2.4, 2.2, 2.4], vel: [-1.4, 1.2, -1.6], gravity: 0.15, size: 0.024, color: [1.0, 0.88, 0.50], alpha: 0.85, ambient: 0.95 },
      ],
      gain: 1.00,
      grade: { gamma: 0.96, contrast: 1.14, saturation: 1.24, gr: 1.01, gg: 0.99, gb: 1.06, vignette: 0.34 },
    },
  },
});
