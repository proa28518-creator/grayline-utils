/* Seat attribution: authored by the builder seat (Roro / Muse, lane 4 of the construction-chair race), 2026-11-23, for the Fudai Wall Build pass. Method source: the cartoon-shorts tree only. The «Production and rules» package was not opened, read, copied or referenced. No local renders. */
// set.js — the film's own set (world: { set: 'own' }).
// Five places, 400 D apart, each in its own dome and fog. D = real metres x 1.6.
// Wall 15.5 m = 24.8 D. Wave 15 m = 24 D. Neighbours' walls 10 m = 16 D.
// Named groups (wall, wave, gravestone, rock) so camera keys can ride them
// ({ object: 'wall', offset }) and setOpts can drive them in update(t).
// Everything falls back to a plain previz when a file is missing.
// update(t) is pure in t — no state kept from the previous frame.

import { createLightRig } from '../world/look/lights.js';

export async function buildSet(THREE, scene, opts, kit) {
  const base = kit('plain', opts);

  // ---- Places (400 D apart; far end 25 D+ behind the faces; 2+ practicals each) ----
  const PLACES = {
    // A [0,0] — village coast & the Wall. Day: warm golden low sun vs cool blue-violet shadows.
    // Storm state from 35.70 (line 13), sunrise state from 64.49 (line 23).
    A: {
      sky: [0.98, 0.75, 0.45], ground: [0.35, 0.32, 0.28],
      fog: { color: '#e8c9a0', density: 0.0055 },
      lights: [
        { id: 'sun', kind: 'sun', color: '#ffb45e', power: 1.0, dir: [-0.4, -0.5, 0.3] },
        { id: 'harbour', kind: 'point', color: '#ffd9a0', power: 0.8, pos: [-4, 2.2, -6] },
        { id: 'beacon', kind: 'point', color: '#ff5a3c', power: 1.2, pos: [0, 24.8, 0] },
      ],
      states: [
        { from: 35.70, sky: [0.45, 0.55, 0.70], fog: { color: '#5a6a80', density: 0.012 } },
        { from: 64.49, sky: [1.0, 0.82, 0.55], fog: { color: '#f0d0a0', density: 0.0055 } },
      ],
    },
    // B [400,0] — mountain rock (flashback). Warm sepia/amber.
    B: {
      sky: [0.85, 0.65, 0.40], ground: [0.45, 0.35, 0.25],
      fog: { color: '#d9b078', density: 0.008 },
      lights: [
        { id: 'sun', kind: 'sun', color: '#e8a860', power: 0.9, dir: [-0.3, -0.6, 0.2] },
        { id: 'skyglow', kind: 'point', color: '#f0c080', power: 0.5, pos: [6, 8, -10] },
      ],
    },
    // C [400,-400] — the room (analogy). Warm amber interior; depth from the window.
    C: {
      sky: [0.55, 0.40, 0.28], ground: [0.40, 0.30, 0.22],
      fog: { color: '#8a6a48', density: 0.02 },
      lights: [
        { id: 'lamp', kind: 'point', color: '#ffc878', power: 1.0, pos: [1.5, 2.2, 1] },
        { id: 'window', kind: 'point', color: '#ffe0b0', power: 0.7, pos: [-2, 1.8, -2] },
      ],
    },
    // D [-400,0] — neighbouring villages. Storm blue-grey, cold.
    D: {
      sky: [0.45, 0.55, 0.70], ground: [0.30, 0.32, 0.36],
      fog: { color: '#5a6a80', density: 0.012 },
      lights: [
        { id: 'sun', kind: 'sun', color: '#9aa8c0', power: 0.8, dir: [-0.4, -0.5, 0.3] },
        { id: 'foam', kind: 'point', color: '#cfe0f0', power: 0.6, pos: [0, 6, -8] },
      ],
    },
    // E [0,-400] — hill cemetery. Blue-gold melancholic, then warm golden.
    E: {
      sky: [0.70, 0.60, 0.55], ground: [0.35, 0.38, 0.30],
      fog: { color: '#c9b090', density: 0.007 },
      lights: [
        { id: 'sun', kind: 'sun', color: '#e8b060', power: 0.9, dir: [-0.5, -0.4, 0.2] },
        { id: 'skyglow', kind: 'point', color: '#f0c890', power: 0.5, pos: [4, 6, -12] },
      ],
    },
  };

  const rig = createLightRig(THREE, PLACES, {});

  // ---- Named groups (camera keys ride these; setOpts drives the wave) ----
  // The wall + steel gate at place A: 24.8 D tall, standing at x 0, z -8, facing +Z.
  const wall = new THREE.Group();
  wall.name = 'wall';
  wall.position.set(0, 0, -8);
  base.group.add(wall);

  // The wave at place A: 24 D tall water wall, driven by setOpts.wave (0..1) in update(t).
  // It rises off-screen to the sea side (z -30) and is hidden until the quake.
  const wave = new THREE.Group();
  wave.name = 'wave';
  wave.position.set(0, 0, -30);
  wave.visible = false;
  base.group.add(wave);

  // The gravestone at place E (hill cemetery), overlooking the village.
  const gravestone = new THREE.Group();
  gravestone.name = 'gravestone';
  gravestone.position.set(0, 0, -402);
  base.group.add(gravestone);

  // The old rock at place B (flashback), with the carved tsunami mark.
  const rock = new THREE.Group();
  rock.name = 'rock';
  rock.position.set(402, 0, -2);
  base.group.add(rock);

  // ---- update(t): pure in t. Drives the wave from setOpts.wave (0..1). ----
  function update(t) {
    base.update?.(t);
    rig.update(t);
    const w = (opts && opts.setOpts && opts.setOpts.wave) || 0;
    // Wave rises from the sea between line 15 (sea pulls back) and line 16 (wave returns).
    // w is 0 before 39.28, ramps to 1 by 44.81, holds through the impact, falls after 63.69.
    const h = w * 24; // D
    wave.visible = w > 0.001;
    wave.scale.set(1, Math.max(h / 24, 0.001), 1);
    wave.position.y = 0;
  }

  return { ...base, points: { wall, wave, gravestone, rock }, rig, update };
}
