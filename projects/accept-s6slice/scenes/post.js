// scenes/post.js — "The Ring That Rolled Away" Post pass (Foundation Run 13,
// Stage 2), per references/post.md and the bright-exterior-by-day row of
// references/quality-bar.md (the Town row): haze density ~0.0055 from 8 D
// out, `far` 70-90 so the sky keeps its colour, aperture 9, pollen/seeds
// size ~0.010, gamma 1.10, saturation 1.28, vignette. One place, 'street',
// one day look for the whole film — a daytime street chase in a single
// place and a single light state.
//   - light day haze with distance, so the far wall and the shopfronts melt
//     slightly while the chase lane stays crisp;
//   - depth of field with the characters sharp on top (they never enter the
//     filter); focus is the pipeline's automatic pick;
//   - bloom only on the brightest highlights (sunlit stone, the ring's
//     glint, the fountain water), threshold above everything else;
//   - drifting pollen over the street, the day-exterior particle;
//   - a warm bright grade that ties the flat characters to the day set.
// NO grain (post.md: grain makes files huge; this film does not ask).
// NO bursts: a spray burst at the ring's splashdown would sit on the
// gate-locked S10 float tile (33.0 s) and could occlude the ring —
// deliberately omitted, logged here. NO keys anywhere: every setting is
// constant for the whole film.
export const makePost = A => ({
  quality: 'auto', maxBlur: 24, blend: 0.14,
  zones: { street: [0, 0] },
  places: {
    street: {
      air: {
        density: 0.0055, start: [1.2, 6.5], far: 80,
        color: [0.02, 0.025, 0.035],           // linear murk: pale day blue-grey
        lights: 0.15, g: 0.55,                 // sun hangs lightly in the air
        noise: 0.15, noiseScale: 0.22, noiseSpeed: 0.06,
        perLight: { sun: 0.3, lamp: 0.2, fountain: 0.1 },
      },
      dof: { aperture: 9, nearK: 0.22, dead: 0.45 },
      bloom: { k: 0.25, thr: 0.85 },
      particles: [
        // day pollen drifting over the street: visible, slow, sunlit
        { mode: 'box', count: 900, box: [30, 5, 12], vel: [0.05, -0.01, 0.02], size: 0.010, color: [1, 0.95, 0.75], lit: 1.5 },
      ],
      gain: 1.0,
      grade: { gamma: 1.10, contrast: 1.02, saturation: 1.28, gr: 1.0, gg: 1.0, gb: 1.02, vignette: Math.PI / 6 },
    },
  },
});
