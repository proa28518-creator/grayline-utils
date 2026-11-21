// Story 6 «الشوكولاتة اللي ساحت» (The Melted Chocolate / The Microwave)
// 1945 radar lab, 56.20 s, 1,686 frames @ 30 fps, 21 shots, 2 characters, 4 worlds
// Governing timing: owner's voice_owner.wav + audio/clean.json + motion.js state functions

import { makePost } from './post.js';
import { makeShade } from './shade.js';
import {
  DURATION, FPS,
  LAB_X, MICRO_X, SHOW_X, GRID_X,
  T_MELT, T_RADAR, T_COLD, T_NOHEAT, T_HOW, T_MOCK, T_MOCKLINE, T_SILENT,
  T_DAY2, T_POP, T_LAUGH2, T_EGG, T_LEAN, T_BOOM, T_GOT, T_WAVES, T_RUB,
  T_INOUT, T_BOX, T_COMPANY, T_TALL, T_340, T_5000, T_TODAY, T_START, END,
  SHOTS_T,
  clamp, lerp, smooth, easeOutCubic, easeInOutCubic, easeOutExpo,
  engineerState, mockerState, popcornState, kettleState, boxBuildState,
} from './motion.js';

// ---- ENGINEER LIMB TRACKS (sampled from engineerState every 0.16 s) ----
function buildEngineerLimbs() {
  const armR = [], armL = [], legR = [], legL = [];
  const step = 0.16;
  
  for (let t = 0; t <= DURATION; t = +(t + step).toFixed(3)) {
    const s = engineerState(t);
    
    if (s.pose === 'pocket') {
      // S02: hand in/out of pocket
      const u = (t - T_MELT) / (1.35 - T_MELT);
      armR.push([t, [-0.26, 0.08 - u * 0.20, 0.28]]);
      armL.push([t, [ 0.32, -0.12, 0.10]]);
      legR.push([t, [-0.18, 0.0, 0.0]]);
      legL.push([t, [ 0.18, 0.0, 0.0]]);
    } else if (s.pose === 'cold') {
      // S04: arms crossed, shivering
      const shiver = Math.sin(t * 12.0) * 0.04;
      armR.push([t, [-0.18 + shiver, 0.16, 0.38]]);
      armL.push([t, [ 0.18 - shiver, 0.16, 0.38]]);
      legR.push([t, [-0.18, 0.0, 0.0]]);
      legL.push([t, [ 0.18, 0.0, 0.0]]);
    } else if (s.pose === 'crouch') {
      // S08: crouching to set corn bag
      armR.push([t, [-0.28, -0.15, 0.42]]);
      armL.push([t, [ 0.28, -0.15, 0.42]]);
      legR.push([t, [-0.22, -0.30, 0.18]]);
      legL.push([t, [ 0.22, -0.30, 0.18]]);
    } else if (s.pose === 'reach') {
      // S10: reaching to place egg in kettle
      armR.push([t, [-0.32, 0.08, 0.62]]);
      armL.push([t, [ 0.30, -0.18, 0.12]]);
      legR.push([t, [-0.18, 0.0, 0.06]]);
      legL.push([t, [ 0.18, 0.0, -0.06]]);
    } else if (s.pose === 'write') {
      // S13: picking up notebook, writing
      armR.push([t, [-0.26, 0.18, 0.38]]);
      armL.push([t, [ 0.24, 0.12, 0.32]]);
      legR.push([t, [-0.18, 0.0, 0.0]]);
      legL.push([t, [ 0.18, 0.0, 0.0]]);
    } else if (s.pose === 'weld') {
      // S17: welding iron box, animated hands
      const wt = (t - T_BOX) / (T_COMPANY - T_BOX);
      const wobble = Math.sin(wt * 18.0) * 0.12;
      armR.push([t, [-0.30 + wobble, 0.22, 0.48]]);
      armL.push([t, [ 0.28 - wobble * 0.8, 0.18, 0.44]]);
      legR.push([t, [-0.20, 0.0, 0.08]]);
      legL.push([t, [ 0.20, 0.0, -0.08]]);
    } else if (T_RUB <= t && t < T_INOUT) {
      // S15: rubbing hands at chest front
      armR.push([t, [-0.10 + Math.sin(t * 40) * 0.05, 0.20, 0.42]]);
      armL.push([t, [ 0.10 - Math.sin(t * 40) * 0.05, 0.16, 0.42]]);
      legR.push([t, [-0.18, 0.0, 0.0]]);
      legL.push([t, [ 0.18, 0.0, 0.0]]);
    } else {
      // Default standing: calm, hands at sides
      armR.push([t, [-0.32, -0.12, 0.10]]);
      armL.push([t, [ 0.32, -0.12, 0.10]]);
      legR.push([t, [-0.18, 0.0, 0.0]]);
      legL.push([t, [ 0.18, 0.0, 0.0]]);
    }
  }
  
  return { 'armR.hand': armR, 'armL.hand': armL, 'legR.in': 'root', 'legL.in': 'root', 'legR.foot': legR, 'legL.foot': legL };
}

// ---- MOCKER LIMB TRACKS (sampled from mockerState every 0.16 s) ----
function buildMockerLimbs() {
  const armR = [], armL = [], legR = [], legL = [];
  const step = 0.16;
  
  for (let t = 0; t <= DURATION; t = +(t + step).toFixed(3)) {
    const s = mockerState(t);
    
if (s.pose === 'gesture') {
// S06: dismissive wave, laughing entrance. D13: the wave is RAISED and SWEPT
// across 12.60–13.60 so the dismissive gesture reads once the desk removes the
// R6-2 crown slab (D1).
// TRANSLATION (shown, per the desk's Q16 answer): limb targets are DELTAS in the
// rig's hand-target space — leg targets sit at y 0.0 (floor contact) and the arm
// targets are sub-unit offsets, not world heights. Neon's world hand height
// 1.85–2.05 for a ~2.9-unit figure with a rest hand at ~1.10 implies a delta of
// +0.75..+0.95; this branch already carries +0.32, so the INCREMENT is
// +0.43..+0.63 -> R11_GESTURE_RAISE = 0.55 (mid). Lateral +0.40 outward (Neon
// +0.25..+0.55). Sweep +-0.30 at arm length ~0.8 = +-20.6deg = 41deg peak-to-peak
// (Neon 35–45deg). The solver span is NOT inlined — see named gap §11.
const R11_GESTURE_RAISE = 0.55;
const raise = smooth(12.60, 12.85, t) * (1 - smooth(13.35, 13.60, t));
const wave = Math.sin((t - T_MOCK) * 8.0) * (0.18 + 0.12 * raise);
armR.push([t, [-0.28 + wave - 0.40 * raise, 0.32 + R11_GESTURE_RAISE * raise, 0.48 + 0.24 * raise]]);
armL.push([t, [ 0.34, -0.18, 0.08]]);
legR.push([t, [-0.18, 0.0, 0.0]]);
legL.push([t, [ 0.18, 0.0, 0.0]]);
    } else if (s.pose === 'laugh') {
      // S09: clutching belly during popcorn burst
      armR.push([t, [-0.22, 0.06, 0.32]]);
      armL.push([t, [ 0.22, 0.06, 0.32]]);
      legR.push([t, [-0.20, 0.0, 0.08]]);
      legL.push([t, [ 0.20, 0.0, -0.08]]);
    } else if (s.pose === 'walk') {
      // S09: the re-block walk (A31-L4 fix: the gait phase is anchored to the
      // S09 walk window T_POP..T_EGG — it was anchored to T_EGG..T_LEAN, so
      // the swing started mid-cycle at an arbitrary phase).
      const wu = clamp((t - T_POP) / (T_EGG - T_POP), 0, 1);
      const swing = Math.sin(wu * 12.0) * 0.22;
      armR.push([t, [-0.28 - swing, -0.10, 0.14]]);
      armL.push([t, [ 0.28 + swing, -0.10, 0.14]]);
      legR.push([t, [-0.18 + swing * 0.7, 0.0, 0.10]]);
      legL.push([t, [ 0.18 - swing * 0.7, 0.0, -0.10]]);
    } else if (s.pose === 'lean') {
      // S10–S11: leaning in close to the kettle. ROUND-3 (R3-1): during S11
      // the root translates toward the kettle (hip shift in mockerState);
      // the foot targets are counter-shifted by the same delta so his FEET
      // stay planted at the locked re-block (-1.5, -3.2) while his hips and
      // head travel — the lean is blocking, not a foot slide.
      let fx = 0, fz = 0;
      if (t >= T_LEAN && t < T_BOOM) {
        const u = smooth(T_LEAN, T_LEAN + 0.5, t);
        fx = 0.35 * u; fz = 0.22 * u;
      }
      armR.push([t, [-0.24, 0.12, 0.42]]);
      armL.push([t, [ 0.24, 0.12, 0.42]]);
      legR.push([t, [-0.22 + fx, 0.0, 0.18 + fz]]);
      legL.push([t, [ 0.18 + fx, 0.0, -0.08 + fz]]);
    } else if (s.pose === 'reel') {
      // S12: reeling back from egg explosion
      armR.push([t, [-0.38, 0.28, 0.24]]);
      armL.push([t, [ 0.38, 0.28, 0.24]]);
      legR.push([t, [-0.20, 0.0, -0.12]]);
      legL.push([t, [ 0.20, 0.0, 0.12]]);
    } else {
      // Default standing
      armR.push([t, [-0.32, -0.12, 0.10]]);
      armL.push([t, [ 0.32, -0.12, 0.10]]);
      legR.push([t, [-0.18, 0.0, 0.0]]);
      legL.push([t, [ 0.18, 0.0, 0.0]]);
    }
  }
  
  return { 'armR.hand': armR, 'armL.hand': armL, 'legR.in': 'root', 'legL.in': 'root', 'legR.foot': legR, 'legL.foot': legL };
}

// ---- SHOTS (21 shots, world coordinates, LAB_X = 0) ----
function buildShots() {
  return [
    // S01 (0.18–1.35): ROUND-5 F5 — dolly OUT from pocket to WAIST-UP end frame.
    // The dolly must land waist-up (hands + torso + face all in frame) so the
    // chocolate's pocket tuck reads and S21 can loop-match it. End key pulled
    // further back: d≈5.2 from pocket center, fov 31 (narrower to hold framing).
    {
      t0: T_MELT, t1: 1.35,
      camera: {
        move: 'path',
        keys: [
          { t: T_MELT, pos: [-4.11, 1.93, -0.36], target: [-4.68, 1.94, -1.18], fov: 33, roll: 0.8 },
          { t: 0.68,   pos: [-3.97, 1.91, -0.16], target: [-4.70, 1.94, -1.24], fov: 32, roll: 0.5 },
          { t: 1.35,   pos: [-4.15, 2.18, 2.80],  target: [-5.00, 1.96, -1.55], fov: 31, roll: 0.2 },
        ],
      },
    },

    // S02 (1.35–3.04): push from (-5.5, 1.95, 4.4) tgt (-5, 2.50, -2.8) fov 26 -> to (-5.1, 2.25, 10.6) tgt (-5, 2.60, -3.2) fov 29, roll [-1.5, -2.2]
    {
      t0: 1.35, t1: T_RADAR,
      camera: {
        move: 'push',
        from: { pos: [-5.5, 1.95, 4.4], target: [-5, 2.50, -2.8], fov: 26 },
        to:   { pos: [-5.1, 2.25, 10.6], target: [-5, 2.60, -3.2], fov: 29 },
        roll: [-1.5, -2.2],
      },
    },

    // S03 (3.04–6.26): path t=T_RADAR pos (-9.8, 2.90, 10.6) tgt (-5.6, 2.60, -3.2) fov 30 roll 0; t=4.50 pos (-7.0, 3.20, 8.8) tgt (-5.3, 3.80, -5.8) fov 28 roll -1.0; t=T_COLD pos (-0.9, 4.60, 2.2) tgt (-0.6, 5.95, -7.85) fov 26 roll -1.5 (A31-L7: comment corrected to the code's actual key 3)
    {
      t0: T_RADAR, t1: T_COLD,
      camera: {
        move: 'path',
        keys: [
          { t: T_RADAR, pos: [-9.8, 2.90, 10.6], target: [-5.6, 2.60, -3.2], fov: 30, roll: 0.0 },
          { t: 4.50,    pos: [-7.0, 3.20, 8.8], target: [-5.3, 3.80, -5.8], fov: 28, roll: -1.0 },
          { t: T_COLD,  pos: [-0.9, 4.60, 2.2], target: [-0.6, 5.95, -7.85], fov: 26, roll: -1.5 },
        ],
      },
    },

// S04 (6.26–9.82): MERGED — Neon item 4 endpoints + C1 f8's mid reframe recomputed
// onto them at u = 0.460674 (dPos [0.45,0.10,0.25], dTgt [0.12,0.18,0], dFov -2.5).
// Tightened from the old (-7.5..-3.6, fov 29) to (-5.60..-4.20, fov 27/26): the
// dead left wall is cut and the mouth/fog side is biased. Key gaps 1.64 / 1.92 s.
{
t0: T_COLD, t1: T_HOW,
camera: {
move: 'path',
keys: [
{ t: T_COLD, pos: [-5.60, 2.15, 6.20], target: [-4.85, 2.25, -1.55], fov: 27,    roll: 0.0 },
{ t: 7.90,   pos: [-4.505, 2.264, 6.081], target: [-4.684, 2.444, -1.550], fov: 24.04, roll: 0.276 },
{ t: T_HOW,  pos: [-4.20, 2.18, 5.40], target: [-4.75, 2.28, -1.55], fov: 26,    roll: 0.6 },
],
roll: [0.0, 0.6],
},
},

// S05 (9.82–11.70): D2 — target.y 1.92 -> 2.18 and the crane pulled +0.45 z so the
// FULL head (hairline + margin) holds with the chest-up read. R4-6 root z -0.95
// and the plinth clearance are untouched; the horn/radar screen bands keep their
// azimuth.
{
t0: T_HOW, t1: T_MOCK,
camera: {
move: 'push',
from: { pos: [-3.80, 3.25, 2.05], target: [-5.00, 2.18, -0.95], fov: 36 },
to:   { pos: [-3.95, 3.10, 1.65], target: [-5.00, 2.18, -0.95], fov: 35 },
roll: [0.0, 0.5],
},
},

// S06 (11.70–15.41): R11-7 / F1 — mid reframe at 13.30 (u = 1.60/3.71 = 0.431267):
// pos = lerp(from,to,u) + [-0.4,0.05,0.3]; target = lerp + [0,0.05,0];
// fov = lerp - 2. Dutch [5.0,5.8] preserved verbatim and sampled into the keys.
// Key gaps 1.60 / 2.11 s.
{
t0: T_MOCK, t1: T_SILENT,
camera: {
move: 'path',
keys: [
{ t: T_MOCK,   pos: [1.3, 2.35, 4.5],   target: [1.7, 2.34, -1.3],   fov: 25,     roll: 5.0 },
{ t: 13.30,    pos: [0.835, 2.400, 5.188], target: [1.700, 2.381, -1.300], fov: 23.431, roll: 5.345 },
{ t: T_SILENT, pos: [1.15, 2.35, 5.4],  target: [1.7, 2.32, -1.3],   fov: 26,     roll: 5.8 },
],
roll: [5.0, 5.8],
},
},

// S07 (15.41–17.34): D3 — camera up (2.85/2.75), target down (2.05/2.08), fov 27/26.
// table1 top y 1.30 (x -8..-2, z -5..-3) drops below the chin line so shoulders +
// coat read; engineerState S07 is x -5, z -1.55, stand, deadpan (unchanged).
{
t0: T_SILENT, t1: T_DAY2,
camera: {
move: 'push',
from: { pos: [-5.65, 2.85, 5.10], target: [-5.00, 2.05, -1.55], fov: 27 },
to:   { pos: [-5.45, 2.75, 3.90], target: [-5.00, 2.08, -1.55], fov: 26 },
roll: [0.0, 0.5],
},
},

// S08 (17.34–19.78): R7-4 — hero sightline restored. R6-6c's centred lane put the
// radar Body between lens and hero (ray met its south face at (-5.946,2.294,-1.8)).
// With the root moved west (motion.js), this SW lane holds all four clauses:
//  - head (-6.791,2.330,-2.290): lateral +0.443 of +-0.996 -> face [0.194,0.694]
//    = 70%, ~14% of frame height, vertical +0.794 of +-1.770 (45% up); facing 25
//    vs camera azimuth -14.5 => 39.5deg off = three-quarter FRONT (A22 17.34 face).
//  - bench leg (-7.7,0.625,-3.2): lateral -0.675 of +-1.147 (59% left), fully in;
//    its contact pad (-7.7,0.016,-3.2) at 70% down, fully in -> grounding reads.
//  - morning bench patch (-6.6,1.315,-4.2) lateral +0.12 (centre), its western
//    half clear of the plinth; wall patch (-6.6,2.6,-7.74) lateral -0.82 of
//    +-2.02, 37% up -> day-change cue visible.
//  - his own heroContact follows engineerState -> pad under him at 74% down.
// The Body's near-west corner projects at 1.095 of +-0.939 -> mostly out of frame
// right, so it cannot interpose. The wall clock stays out of this framing (R7-5
// proves it separately instead of widening this shot to d~27).
{
  t0: T_DAY2, t1: T_POP,
  camera: {
    move: 'push',
    from: { pos: [-8.60, 2.05, 2.60], target: [-7.00, 1.45, -3.20], fov: 38 },
    to:   { pos: [-8.45, 2.00, 2.25], target: [-7.00, 1.45, -3.20], fov: 38 },
    roll: [-0.6, -0.3],
  },
},

// S09 (19.78–23.63): D4 — ONLY the 21.20 hero key changes (Neon item 7): closer,
// lower, fov 30, so the horn exits top-right and the bowl+cone own the frame.
// 19.78 / 22.80 / 23.63 keys BYTE-IDENTICAL; the R4-4 envelope is untouched.
{
t0: T_POP, t1: T_EGG,
camera: {
move: 'path',
keys: [
{ t: T_POP, pos: [5.50, 2.60, 0.30],   target: [-3.00, 1.75, -4.00], fov: 34, roll: 0.5 },
{ t: 21.20, pos: [-2.10, 2.25, 0.85],  target: [-3.85, 1.88, -3.45], fov: 30, roll: 0.2 },
{ t: 22.80, pos: [-1.55, 2.38, -0.10], target: [-1.29, 2.26, -3.10], fov: 34, roll: 0.2 },
{ t: T_EGG, pos: [1.15, 2.26, -1.50],  target: [-2.90, 1.80, -4.00], fov: 34, roll: 0.0 },
],
},
},

// S10 (23.63–25.85): D5 — every key targets the PLACED EGG (-2.75,1.65,-4.05),
// Neon's resting-centre y (was 1.72, the kettle mouth). fov 32 throughout.
// R3-8's >= 0.5 s static hold preserved: 25.35 -> T_LEAN (0.50 s).
{
t0: T_EGG, t1: T_LEAN,
camera: {
move: 'path',
keys: [
{ t: T_EGG,  pos: [-0.45, 2.18, -0.10], target: [-2.75, 1.65, -4.05], fov: 32, roll: 0.0 },
{ t: 24.50,  pos: [-0.62, 2.15, -0.38], target: [-2.75, 1.65, -4.05], fov: 32, roll: 0.2 },
{ t: 25.35,  pos: [-0.75, 2.12, -0.55], target: [-2.75, 1.65, -4.05], fov: 32, roll: 0.4 },
{ t: T_LEAN, pos: [-0.75, 2.12, -0.55], target: [-2.75, 1.65, -4.05], fov: 32, roll: 0.4 },
],
},
},

    // S11 (25.85–28.40): R3-1 staging (hero OUT; the MOCKER's lean as blocking
    // — feet locked (-1.5, -3.2), hips/head travelling to (-2.65, 1.95, -3.85)
    // via bend/lean + hip shift in motion.js; sleeve withdraws frame-left in
    // the first 0.3 s; peer held >= 60%).
    // CAMERA DEVIATION (documented, ray-verified twice): R3-1's authored
    // camera (-6.3, 2.35, -3.25) cannot see the subject — the radar cabinet
    // body (world x -6.25..-3.75, z -6.2..-1.8, y 1.8..6.2 — GLB-verified:
    // radar_device.glb Body bounds at anchor (-5, 1.3, -4) rotY 90°) stands
    // on the ray: at x=-5 the ray passes (-5, 2.19, -3.47), inside the
    // cabinet. First substitute (south-east, (0.35, 2.25, -1.15)) FAILED its
    // proof still (S11, round-3): with his facing at -100 the SE camera sees
    // only the back of his head (148° off his facing). Final position: the
    // south-west gap past the cabinet's SE corner — camera (-4.33, 2.58,
    // -0.13), whose ray clears the corner (passes x -3.60 at z -1.8, east of
    // the -3.75 face; z -1.47 at x -3.75, south of the -1.8 face) and meets
    // his facing at ~76°: a true profile peer, kettle at frame-left of his
    // face, charcoal panel behind. Slight creep in along the same axis.
    {
      t0: T_LEAN, t1: T_BOOM,
      camera: {
        move: 'push',
        from: { pos: [-4.33, 2.58, -0.13], target: [-2.70, 1.90, -3.88], fov: 33 },
        to:   { pos: [-4.05, 2.50, -0.45], target: [-2.70, 1.90, -3.88], fov: 33 },
        roll: [0.0, 0.5],
      },
    },

    // S12 (28.40–30.36): R7-3 — the splat is DONE (hue 35, ~32%); the crop was the
// blocker. Old keys @29.30: head (-1.329,2.396,-2.763) sat at lateral +0.5755 of
// half-width 0.5702 = 101% -> the head CENTRE was outside the right edge, so the
// second eye was off-frame. Retargeted onto the face, fov 34 -> 40, same SE axis
// and dutch roll kept.
// @29.30 now: head lateral +0.3325 of +-0.8075 -> face spans [0.083,0.583] = 72%,
// BOTH eyes in with 28% margin; face ~17.5% of frame height; head vertical +0.148
// of +-1.430. Kettle (-3,1.55,-4) lateral -0.985 of +-1.120 -> centre at 88% left,
// survives at frame-left (42% down). Horn mast lateral -4.55 vs +-1.53 -> still
// out of frame (no horn rings). Margins hold at both push extremes (69% / 77%).
{
  t0: T_BOOM, t1: T_GOT,
  camera: {
    move: 'push',
    from: { pos: [-0.62, 1.88, 1.28], target: [-1.77, 2.29, -3.15], fov: 40 },
    to:   { pos: [-0.78, 1.92, 0.92], target: [-1.77, 2.29, -3.15], fov: 40 },
    roll: [-2.0, -2.5],
  },
},

// S13 (30.36–32.26): D6 — STALE TARGET CORRECTED. motion.js S13 has been
// x = LAB_X-5.5, z = -0.8 since round 5; the entry still targeted (-5,-1.55),
// framing empty floor 0.5 east / 0.75 north of the hero. Materialised on the
// real root. The smile itself (face track) is untouched.
{
t0: T_GOT, t1: T_WAVES,
camera: {
move: 'push',
from: { pos: [-5.5, 2.30, 7.25], target: [-5.5, 2.32, -0.8], fov: 26 },
to:   { pos: [-5.5, 2.35, 6.25], target: [-5.5, 2.35, -0.8], fov: 25 },
roll: [0.0, 0.5],
},
},

// S14 (32.26–36.46): R11-2 / F1+F3 — opens WIDE on the emission (horn + ribbons +
// rings at the molecule's real height y 3.0), dives at 33.70, then the CURRENT
// 34.20 / T_RUB keys VERBATIM (L18 macro + grade keep-list). Opening targets y 2.9.
// Key gaps 1.44 / 0.50 / 2.26 s — A56 pass preserved. Roll envelope sampled from
// the current entry (0.0 -> 1.0 -> 1.5) at the new key time.
{
t0: T_WAVES, t1: T_RUB,
camera: {
move: 'path',
keys: [
{ t: T_WAVES, pos: [MICRO_X - 0.4, 3.4, 8.4],  target: [MICRO_X - 1.2, 2.9, 0],  fov: 44, roll: 0.0 },
{ t: 33.70,   pos: [MICRO_X - 0.2, 3.25, 4.5], target: [MICRO_X - 0.6, 2.9, 0],  fov: 42, roll: 0.74 },
{ t: 34.20,   pos: [MICRO_X - 1.6, 3.2, 7.6],  target: [MICRO_X + 0.2, 2.9, 0],  fov: 28, roll: 1.0 },
{ t: T_RUB,   pos: [MICRO_X + 1.8, 3.0, 6.4],  target: [MICRO_X + 0.3, 2.85, 0], fov: 27, roll: 1.5 },
],
},
},

// S15 (36.46–38.24): R11-3 / F1 — push onto the hand-rub vignette in the MICRO
// world (micro-local x 6 -> world 406). A90's formula endpoints, materialised.
{
t0: T_RUB, t1: T_INOUT,
camera: {
move: 'push',
from: { pos: [406, 1.9, 3.4], target: [406, 1.42, 0], fov: 40 },
to:   { pos: [406, 1.65, 2.5], target: [406, 1.34, 0], fov: 38 },
roll: [0, 1.0],
},
},

    // S16 (38.24–40.61): RULINGS Q1 (food cross-section) + R3-9 RESTAGE —
    // the potato half now sits in the MICRO world's dark neutral void (its
    // own pedestal + backdrop disc at micro-local (0, ~1.0, -2.5)), NOT on
    // the kettle bench; the kettle cluster is out of this frame entirely.
    // Insert at d≈2.1, fov 32 (food ≈76% of frame width), then the owner's
    // pull-back to d≈3.5 reveals the heat/steam reading core-out, no flame.
    {
      t0: T_INOUT, t1: T_BOX,
      camera: {
        move: 'path',
        keys: [
          { t: T_INOUT, pos: [MICRO_X + 0.28, 1.78, -0.42], target: [MICRO_X, 1.48, -2.50], fov: 32, roll: 0 },
          { t: 39.20,   pos: [MICRO_X + 0.34, 1.86, -0.30], target: [MICRO_X, 1.50, -2.50], fov: 32, roll: 0.3 },
          { t: T_BOX,   pos: [MICRO_X + 0.75, 2.15, 0.85],  target: [MICRO_X, 1.55, -2.50], fov: 32, roll: 0.8 },
        ],
      },
    },

// S17 (40.61–43.27): R11-4 / F1+F4 — TWO-SHOT on the real pair: wave box
// (5,1.3,-5) + engineer (2.4,-4.6) (motion.js S17 branch UNCHANGED, pose 'weld').
// SW-side at 45deg azimuth, which compresses the 2.63 separation to ~1.14 on
// screen while keeping the engineer screen-left and the box screen-right (the
// box ray clears his head by 1.34-1.74 in z — no occlusion). FULL head + hairline
// in frame at all three face keys 40.61 / 41.72 / 42.70 (vertical margin > 1.0
// world unit above the crown), full box + spark headroom, feet also in frame.
// d 6.64 -> 6.03, fov 44 -> 42: portrait half-width = 0.5625 x half-height, so
// d~5 / fov 38-40 (half-width ~1.02) cannot hold the 2.77-unit span at 40.61.
// Key gaps 1.11 / 0.98 / 0.57 s. Roll ramp = the current entry's 0.4*u envelope.
{
t0: T_BOX, t1: T_COMPANY,
camera: {
move: 'path',
keys: [
{ t: T_BOX,     pos: [-1.01, 2.34, -0.17], target: [3.66, 1.68, -4.84], fov: 44, roll: 0.0 },
{ t: 41.72,     pos: [-0.66, 2.30, -0.36], target: [3.76, 1.66, -4.78], fov: 43, roll: 0.167 },
{ t: 42.70,     pos: [-0.35, 2.32, -0.51], target: [3.86, 1.70, -4.72], fov: 42, roll: 0.314 },
{ t: T_COMPANY, pos: [-0.40, 2.32, -0.50], target: [3.84, 1.70, -4.74], fov: 42, roll: 0.4 },
],
},
},

// S18 (43.27–46.14): MERGED — C1 f10's key set with Neon item 11's 44.60 / T_TALL.
// Calendar 1945 -> flip -> curtain reveal keys 1–2 verbatim. D9 = gauge FULLY IN
// (Neon's frustum proof: gauge margin 1.13 / 0.80). The 44.55 mid key keeps f10's
// FORMULA (lerp 43.75->44.60 at u=0.941176, pos +[0.3,0,0.15], target untouched)
// recomputed onto the new 44.60 — f10's literal number would whip 43 u/s here.
// Key gaps 0.48 / 0.80 / 0.05 / 1.54 s.
{
t0: T_COMPANY, t1: T_TALL,
camera: {
move: 'path',
keys: [
{ t: T_COMPANY, pos: [794.6, 3.15, -1.0],  target: [794.4, 3.05, -5.50], fov: 33, roll: 0 },
{ t: 43.75,     pos: [795.6, 3.00, 2.5],   target: [797.2, 2.70, -2.00], fov: 33, roll: 0.2 },
{ t: 44.55,     pos: [799.288, 2.812, 15.168], target: [797.576, 2.418, -0.118], fov: 34.88, roll: 0.388 },
{ t: 44.60,     pos: [799.2, 2.80, 15.8],  target: [797.6, 2.40, 0], fov: 35, roll: 0.4 },
{ t: T_TALL,    pos: [799.0, 2.70, 14.5],  target: [797.6, 2.40, 0], fov: 34, roll: 0.6 },
],
},
},

// S19 (46.14–50.34): C1 f7 verbatim EXCEPT the 47.10 dial/plaque reframe (Ruling 1) and the 48.55 on-axis price-tag reframe (Ruling 2).
// Key gaps 0.96 / 1.45 / 1.35 / 0.44 s.
{
t0: T_TALL, t1: T_TODAY,
camera: {
move: 'path',
keys: [
{ t: T_TALL,  pos: [SHOW_X - 0.2, 2.2, 9.5],  target: [SHOW_X - 0.4, 1.5, 0],    fov: 44, roll: 0.0 },
{ t: 47.10,   pos: [SHOW_X + 3.67, 2.20, 9.10], target: [SHOW_X + 3.67, 2.20, 0.80], fov: 40, roll: 0.14 },
{ t: 48.55,   pos: [SHOW_X - 1.16, 2.95, 5.59], target: [SHOW_X - 1.16, 2.95, 0.94], fov: 40, roll: 0.33 },
{ t: 49.90,   pos: [SHOW_X + 0.6, 2.0, 7.2],  target: [SHOW_X + 0.5, 1.6, 0.3],  fov: 42, roll: 0.46 },
{ t: T_TODAY, pos: [SHOW_X + 0.55, 2.0, 7.1], target: [SHOW_X + 0.5, 1.6, 0.3],  fov: 42, roll: 0.5 },
],
},
},

    // S20 (50.34–53.45): RULINGS Q5 sequence — the morph (giant -> countertop)
    // lands INSIDE the hero kitchen: keys 1–2 HOLD there 0.96 s (bench
    // refinement: >= 0.9 s; d~2.9 from the kitchen microwave at grid-local
    // (1.35, 1.24, -3)). The hold sits on the kitchen's RIGHT side: the
    // engineer stands at (GRID_X, 0) by design ("small in initial kitchen"),
    // and a centre hold put him at the lens's left edge, cropped huge; from
    // the right he is ~70° off-axis during the hold and enters the frame
    // naturally, small, as the pull-back widens. Then an exponential
    // pull-back in +z (d ~9 -> ~18 ->
    // ~35) with an elastic overshoot + settle at the end (z 31.5 -> 30.0),
    // revealing the home_block apartment grid. The pull lane in +z never
    // crosses a divider — the anchor kitchen stays whole the whole move.
    // (Was: started 9 units out, no kitchen anchor, near-linear.)
    {
      t0: T_TODAY, t1: T_START,
      camera: {
        move: 'path',
        keys: [
          { t: T_TODAY, pos: [GRID_X + 2.6, 1.6, -0.3],  target: [GRID_X + 1.3, 1.25, -2.95], fov: 33, roll: 0 },
          { t: 51.30,   pos: [GRID_X + 2.55, 1.62, -0.38], target: [GRID_X + 1.3, 1.26, -2.95], fov: 33, roll: 0 },
          { t: 52.00,   pos: [GRID_X + 1.2, 2.2, 5.5],   target: [GRID_X + 0.6, 1.8, -4], fov: 34, roll: -0.4 },
          { t: 52.65,   pos: [GRID_X - 1.2, 4.6, 14.0],  target: [GRID_X + 0.2, 2.6, -7], fov: 36, roll: -0.8 },
          { t: 53.15,   pos: [GRID_X - 2.7, 9.3, 31.5],  target: [GRID_X, 3.5, -10], fov: 37, roll: -1.2 },
          { t: T_START, pos: [GRID_X - 2.5, 9.0, 30.0],  target: [GRID_X, 3.5, -10], fov: 37, roll: -1.2 },
        ],
      },
    },

    // S21 (53.45–56.20): ROUND-5 F5 — LOCKED loop match to S01 exact camera.
    // Same path shape/positions/targets/fov/roll as S01, retimed to S21 window.
    {
      t0: T_START, t1: END,
      camera: {
        move: 'path',
        keys: [
          { t: T_START, pos: [-4.11, 1.93, -0.36], target: [-4.68, 1.94, -1.18], fov: 33, roll: 0.8 },
          { t: 53.95,   pos: [-3.97, 1.91, -0.16], target: [-4.70, 1.94, -1.24], fov: 32, roll: 0.5 },
          { t: END,     pos: [-4.15, 2.18, 2.80],  target: [-5.00, 1.96, -1.55], fov: 31, roll: 0.2 },
        ],
      },
    },
  ];
}

// ---- EXPORT ----

function buildBaseTracks(stateFn) {
  const rx = [], ryY = [], rz = [], yaw = [], bend = [], lean = [];
  const step = 0.12;
  const times = new Set();
  for (let t = 0; t <= DURATION; t = +(t + step).toFixed(3)) times.add(t);
  for (const tc of SHOTS_T) {
    if (tc > 0.02) times.add(+(tc - 0.017).toFixed(3));
    times.add(tc);
  }
  times.add(+DURATION.toFixed(3));
  const sorted = [...times].sort((a, b) => a - b);
  for (const t of sorted) {
    const s = stateFn(t);
    rx.push([t, +s.x.toFixed(3)]);
    // ROUND-3 (A31-M2): root.y / bend / lean are REAL now — the state
    // functions return them (Story-5 contract). Previously this builder fed
    // constant 0 to all three tracks, so the mocker's lean and the engineer's
    // crouch could never read.
    ryY.push([t, +((s.y ?? 0)).toFixed(3)]);
    rz.push([t, +s.z.toFixed(3)]);
    yaw.push([t, +(+s.face).toFixed(1)]);
    bend.push([t, +((s.bend ?? 0)).toFixed(1)]);
    lean.push([t, +((s.lean ?? 0)).toFixed(1)]);
  }
  return { 'root.x': rx, 'root.y': ryY, 'root.z': rz, 'root.ry': yaw, 'body.bend': bend, 'body.lean': lean };
}

export default {
  fps: FPS,
  size: [1080, 1920],
  // endFrame OFF (was the number 1686 = the film's frame count, which the
  // pipeline reads as "endFraming enabled"): lib/film/end.js endFraming()
  // judged S21's last frame headless and DELETED S20+S21, extending S19's
  // showroom camera to the end (resolve log: "shot S19 runs to the end").
  // The owner's plan authors S20 (grid pull-back) and S21 (pocket loop)
  // explicitly, so the authored ending stands — same precedent as
  // lib/film/page.js, which sets endFrame=false for authored cameras.
  endFrame: false,
  drift: false,

  world: {
    set: 'own',
    setOpts: {
      post: {
        ...makePost(),
        shade: makeShade(),
      },
    },
  },

  cast: {
    engineer: {
      spec: 'cast/engineer.json',
      at: [LAB_X - 5, -1.55],
      ry: 17,
    },
    mocker: {
      spec: 'cast/mocker.json',
      at: [LAB_X + 2, -1.55],
      ry: -20,
    },
  },

  voice: {
    file: 'voice_owner.wav',
    words: 'audio/clean.json',
    lines: [
      { who: null, text: 'الشوكولاتة ساحت في جيبه وهو واقف قدام جهاز حرب' },
      { who: null, text: 'كان مهندس شغال على جهاز رادار بيصطاد طيارات العدو من بعيد' },
      { who: null, text: 'بيقف قدامه بالساعات في أوضة تلج' },
      { who: null, text: 'مفيش فيها أي مصدر حرارة' },
      { who: null, text: 'فازاي الشوكولاتة تسيح؟' },
      { who: null, text: 'زميله ضحك وقاله: يا عم ده جهاز بيصطاد طيارات' },
      { who: null, text: 'مش فرن بيطبخ' },
      { who: null, text: 'المهندس ما ردش بكلمة' },
      { who: null, text: 'تاني يوم' },
      { who: null, text: 'جاب كيس ذرة وحطه جنب الجهاز' },
      { who: null, text: 'وفجأة الذرة فرقعت وبقت فشار طار في كل حتة' },
      { who: null, text: 'والضحك زاد أكتر' },
      { who: null, text: 'قام حط بيضة جوه براد وقربها من الجهاز' },
      { who: null, text: 'وزميله الفضولي قرب وشه عشان يشوف إيه اللي بيحصل' },
      { who: null, text: 'فجأة البيضة انفجرت في وشه' },
      { who: null, text: 'ساعتها المهندس فهم اللعبة' },
      { who: null, text: 'الجهاز بيطلع موجات دقيقة' },
      { who: null, text: 'بتهز جزيئات الماية جوه الأكل بسرعة رهيبة' },
      { who: null, text: 'زي ما تحك إيديك في بعض فتسخن' },
      { who: null, text: 'فالأكل بيستوي من جوه لبره من غير نار' },
      { who: null, text: 'قرر يبني صندوق حديد ويحبس الموجات دي جواه' },
      { who: null, text: 'وبعد سنتين الشركة نزلت' },
      { who: null, text: 'أول فرن بالموجات' },
      { who: null, text: 'كان طوله قد طول راجل' },
      { who: null, text: 'وزنه 340 كيلو' },
      { who: null, text: 'وتمنه 5000 دولار' },
      { who: null, text: 'النهارده في أكتر من 200 مليون صندوق زيه في بيوتنا كلنا' },
      { who: null, text: 'وكل ده بدأ بمجرد شوكولاتة ساحت في جيب' }
    ],
  },

  acts: {
    engineer: {
      blink: { seed: 12, every: [2.0, 2.8] },
      
      base: {
        ...buildBaseTracks(engineerState),
        ...buildEngineerLimbs(),
      },

      face: [
        { t: 0.18, eyes: 'open', brow: 'quizzical', mouth: 'rest', react: false },
        { t: 1.80, eyes: 'wince', brow: 'worried', mouth: 'frown', react: false },
        { t: 3.04, eyes: 'open', brow: 'on', mouth: 'rest', react: false },
        { t: 6.26, eyes: 'half', brow: 'down', mouth: 'flat', react: false },
        { t: 9.82, eyes: 'wide', brow: 'up', mouth: 'o', react: 'recoil' },
        { t: 10.80, eyes: 'open', brow: 'quizzical', mouth: 'rest', react: false },
        { t: 11.70, eyes: 'open', brow: 'on', mouth: 'rest', react: false },
        { t: 15.41, eyes: 'half', brow: 'down', mouth: 'flat', react: false },
        // A22 §4 (L9 hinge): REPLACED the plain neutral reset — brow down +
        // flat carries S07's deadpan resolve into the new morning; this key
        // is also the "focused experimenter" for L10 until the 19.78 key.
        { t: 17.34, eyes: 'open', brow: 'down', mouth: 'flat', react: false },
        { t: 19.78, eyes: 'open', brow: 'up', mouth: 'rest', react: false },
        { t: 23.63, eyes: 'open', brow: 'on', mouth: 'rest', react: false },
        { t: 28.40, eyes: 'open', brow: 'on', mouth: 'rest', react: false },
        { t: 30.36, eyes: 'open', brow: 'up', mouth: 'smile', react: false },
        { t: 31.50, eyes: 'arc', brow: 'on', mouth: 'smile', react: false, hold: true },
        { t: 32.26, eyes: 'open', brow: 'on', mouth: 'rest', react: false },
        // ROUND-3 face completion (A22 + api_consults_2 table): the track
        // previously ENDED at 32.26, leaving S14–S21 on a stale neutral.
        // Every later line now has a defined expression; NO smile anywhere
        // outside S13 (30.36–31.74) — the arc's single-smile law stands.
        { t: 36.46, eyes: 'open', brow: 'down', mouth: 'flat', react: false },
        { t: 38.24, eyes: 'open', brow: 'up', mouth: 'rest', react: false },
        // A22 §2 verbatim — S17 build arc: focused -> effort -> satisfaction
        // (brow lift only at the seal; no smile).
        { t: 40.61, eyes: 'open', brow: 'down', mouth: 'flat', react: false },
        { t: 41.72, eyes: 'wince', brow: 'knit', mouth: 'grid', react: false },
        { t: 42.70, eyes: 'open', brow: 'up', mouth: 'rest', react: false },
        { t: 43.27, eyes: 'open', brow: 'on', mouth: 'rest', react: false },
        { t: 46.14, eyes: 'open', brow: 'on', mouth: 'rest', react: false },
        { t: 50.34, eyes: 'open', brow: 'on', mouth: 'rest', react: false },
        // A22 §3 verbatim — S21 mirrors S01's keys at +53.27 (loop match).
        { t: 53.45, eyes: 'open', brow: 'quizzical', mouth: 'rest', react: false },
        { t: 55.07, eyes: 'wince', brow: 'worried', mouth: 'frown', react: false },
      ],

      gaze: [
        [0.18, 2.71, 'down'],
        [3.04, 6.26, 'device'],
        [9.82, 11.16, 'chocolate'],
        [15.41, 17.34, 'front'],
        [30.36, 32.26, 'notebook'],
        // A22 §2 optional gaze, SAFE form: 'wave_box' is a registered set
        // point (set.js points) — A22's draft name 'box' is not.
        [40.61, 43.27, 'wave_box'],
        // A22 §3: S01's gaze mirrored for the loop.
        [53.45, 56.20, 'down'],
      ],
    },

    mocker: {
      blink: { seed: 34, every: [2.2, 3.0] },
      
      base: {
        ...buildBaseTracks(mockerState),
        ...buildMockerLimbs(),
      },

      face: [
{ t: 11.70, eyes: 'smug', brow: 'on', mouth: 'crescent', react: false },
// D13: FULL laugh. 12.53 is the T_MOCKLINE key and STANDS (desk); Neon's 12.40 /
// 12.85 (PEAK) / 14.40 / 15.10 are added around it. No 'smile' token — S13's
// single-smile law holds.
{ t: 12.40, eyes: 'arc', brow: 'up', mouth: 'D', react: false },
{ t: 12.53, eyes: 'smug', brow: 'on', mouth: 'D', react: false },
{ t: 12.85, eyes: 'arc', brow: 'up', mouth: 'wide', react: false },
{ t: 14.40, eyes: 'arc', brow: 'on', mouth: 'D', react: false },
{ t: 14.82, eyes: 'arc', brow: 'on', mouth: 'crescent', react: false },
{ t: 15.10, eyes: 'smug', brow: 'on', mouth: 'crescent', react: false },
{ t: 15.41, eyes: 'smug', brow: 'on', mouth: 'smirk', react: false },
{ t: 19.78, eyes: 'arc', brow: 'on', mouth: 'crescent', react: false },
{ t: 22.41, eyes: 'arc', brow: 'on', mouth: 'wide', react: false },
{ t: 25.85, eyes: 'open', brow: 'up', mouth: 'o', react: false },
{ t: 28.40, eyes: 'wide', brow: 'worried', mouth: 'o', react: 'recoil' },
{ t: 29.00, eyes: 'wince', brow: 'knit', mouth: 'grid', react: false },
{ t: 30.36, eyes: 'sad', brow: 'worried', mouth: 'frown', react: false },
      ],

      gaze: [
        [11.70, 15.41, 'engineer'],
        [19.78, 23.63, 'popcorn'],
        [25.85, 28.40, 'kettle'],
      ],
    },
  },

  props: [],

  shots: buildShots(),

  captions: 'words',
};
