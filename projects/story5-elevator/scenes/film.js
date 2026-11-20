// scenes/film.js — Story 5 «المصعد المفتوح» (The Open Elevator)
// Governing timing: owner's recorded performance in voice_owner.wav + audio/clean.json (60.76 s / 1,823 frames @ 30 fps).
// 34 exact Arabic lines (145 words), 4 worlds spaced 400 D apart, 3-door metronome, 31 cinematic shots,
// expressive frame-accurate facial acting on every spoken line & action word, plus lip-sync on Line 30!

import { makePost } from './post.js';
import { makeShade } from './shade.js';
import {
  DURATION, FPS,
  LOBBY_X, RAIN_X, SHAFT_X, COSMOS_X,
  T_BTN_PRESS, T_DOOR1_OPEN, T_DOOR1_CLOSE, T_RAIN_CUT, T_DOOR2_SLAM,
  T_SHAFT_CUT, T_ROULETTE, T_HEARTBEAT, T_COSMOS_CUT, T_BAG_DROP, T_SPEAK_LINE, T_LEAP,
  clamp, lerp, smooth, faridaState, buildFaridaBaseTracks, buildLeatherBagKeys,
} from './motion.js';

// ---- Dynamic Limb Choreography synced to motion.js (heavy bag -> button press -> rain reach -> double-hand clutch -> weightless flight!) ----
function buildFaridaLimbs() {
  const armR = [], armL = [], legR = [], legL = [];
  const step = 0.16;
  for (let t = 0; t <= DURATION; t = +(t + step).toFixed(3)) {
    const s = faridaState(t);

    if (s.flying) {
      // S29-S31: PURE WEIGHTLESS COSMIC FLIGHT! BOTH arms spread wide & forward like joyful wings, legs trailing!
      const ft = t - T_LEAP;
      const flap = Math.sin(ft * 2.2) * 0.14;
      armR.push([t, [-0.82, 0.56 + flap, 0.36]]);
      armL.push([t, [ 0.82, 0.60 - flap, 0.36]]);
      legR.push([t, [-0.22, 0.52 + Math.sin(ft * 1.8) * 0.08, -0.52]]);
      legL.push([t, [ 0.24, 0.36 + Math.cos(ft * 1.8) * 0.08, -0.68]]);
    } else if (t >= T_SHAFT_CUT && t < T_COSMOS_CUT) {
      // S19-S22 (Sideways Shaft): BOTH HANDS clutching heavy leather_bag tightly across chest (clearly below chin!)
      const sh = Math.sin(t * 22.0) * 0.04;
      armR.push([t, [-0.26 + sh, 0.08, 0.42]]);
      armL.push([t, [ 0.26 + sh, 0.08, 0.42]]);
      legR.push([t, [-0.24, 0.0, 0.06]]);
      legL.push([t, [ 0.24, 0.0, -0.06]]);
    } else if (t >= T_BAG_DROP && t < T_SPEAK_LINE) {
      // S27: Calmly lowering left arm to set leather_bag onto cab floor, then relaxing freely!
      const u = smooth(T_BAG_DROP, 53.05, t);
      const lift = smooth(53.05, 53.65, t);
      armL.push([t, [lerp(0.34, 0.48, u), lerp(-0.18, -0.45, u * (1 - lift)), lerp(0.10, 0.36, u * (1 - lift))]]);
      armR.push([t, [-0.30, -0.10, 0.08]]);
      legR.push([t, [-0.18, 0.0, 0.0]]);
      legL.push([t, [ 0.18, 0.0, 0.0]]);
    } else if (t >= T_SPEAK_LINE && t < T_LEAP) {
      // S28: Free, light, hands relaxed at sides -> crouch spring anticipation right before T_LEAP!
      const antic = smooth(54.92, 55.26, t);
      armR.push([t, [-0.34 - antic * 0.20, -0.08 - antic * 0.12, 0.12 - antic * 0.24]]);
      armL.push([t, [ 0.34 + antic * 0.20, -0.08 - antic * 0.12, 0.12 - antic * 0.24]]);
      legR.push([t, [-0.20, 0.0, 0.08 * antic]]);
      legL.push([t, [ 0.20, 0.0, -0.08 * antic]]);
    } else if (t >= 29.84 && t < 31.48) {
      // S16 ("بتمد إيديها تلمس المطر"): Right arm reaches gracefully forward out into the silver rain!
      const u = smooth(29.84, 30.40, t);
      armR.push([t, [lerp(-0.30, -0.18, u), lerp(-0.12, 0.38, u), lerp(0.08, 0.78, u)]]);
      armL.push([t, [ 0.34, -0.22, 0.05]]);
      legR.push([t, [-0.18, 0.0, 0.08 * u]]);
      legL.push([t, [ 0.18, 0.0, -0.04 * u]]);
    } else if (t >= 31.48 && t < T_DOOR2_SLAM) {
      // S17 ("بتبتسم وبتخطو خطوة"): Gentle joyful reach + bold forward foot lift/step!
      const stepU = Math.sin(clamp((t - 32.35) / 0.80, 0, 1) * Math.PI);
      armR.push([t, [-0.32, 0.22, 0.56]]);
      armL.push([t, [ 0.35, -0.22, 0.04]]);
      legR.push([t, [-0.18, 0.24 * stepU, 0.36 * stepU]]);
      legL.push([t, [ 0.18, 0.0, -0.08 * stepU]]);
    } else if (t >= 10.30 && t < 11.25) {
      // S05 ("بتدوس على الزرار"): Right hand reaches cleanly out & presses glowing brass button!
      const jab = Math.sin(clamp((t - 10.35) / 0.72, 0, 1) * Math.PI);
      armR.push([t, [-0.26 - 0.18 * jab, -0.08 + 0.44 * jab, 0.12 + 0.58 * jab]]);
      armL.push([t, [ 0.35, -0.24, 0.04]]);
      legR.push([t, [-0.18, 0.0, 0.0]]);
      legL.push([t, [ 0.18, 0.0, 0.0]]);
    } else if (t >= 16.25 && t < 18.25) {
      // S09 ("بتجرب كل الزراير واحد ورا التاني"): Rapid frantic cascading button jabs!
      const jab = Math.abs(Math.sin((t - 16.25) * 10.5));
      const row = Math.sin((t - 16.25) * 3.8) * 0.18;
      armR.push([t, [-0.38, 0.24 + row, 0.42 + 0.30 * jab]]);
      armL.push([t, [ 0.35, -0.24, 0.04]]);
      legR.push([t, [-0.18, 0.0, 0.0]]);
      legL.push([t, [ 0.18, 0.0, 0.0]]);
    } else if (t >= 4.97 && t < 7.59) {
      // S03 ("والشنطة الجلد تقيلة جداً لدرجة إيدها وجعتها"): Heavy bag sags left arm down, then she hoists it & rubs/flexes!
      const hoist = Math.sin(clamp((t - 6.30) / 0.90, 0, 1) * Math.PI);
      armL.push([t, [ 0.38, -0.34 + 0.24 * hoist, 0.08]]);
      armR.push([t, [-0.24, -0.08 + 0.22 * hoist, 0.22 * hoist]]);
      legR.push([t, [-0.18, 0.0, 0.0]]);
      legL.push([t, [ 0.18, 0.0, 0.0]]);
    } else {
      // Default poised stance holding heavy leather_bag in left hand (sags naturally under weight)
      const walkBob = ((t >= 21.89 && t <= 22.85) || (t >= 12.54 && t <= 13.15))
        ? Math.sin(t * 11.0) * 0.16 : 0;
      armR.push([t, [-0.30, -0.14, 0.06]]);
      armL.push([t, [ 0.35, -0.24, 0.05]]);
      legR.push([t, [-0.18, Math.max(0, walkBob), walkBob * 1.4]]);
      legL.push([t, [ 0.18, Math.max(0, -walkBob), -walkBob * 1.4]]);
    }
  }
  return {
    'armR.hand': armR,
    'armL.hand': armL,
    'legR.in': 'root',
    'legL.in': 'root',
    'legR.foot': legR,
    'legL.foot': legL,
  };
}

// Helper for Farida's world head point at time t
const headAt = t => {
  const s = faridaState(t);
  return [s.x, s.y + 2.34, s.z];
};

function camKeysFrom(times, fn) {
  return times.map(t => ({ t, ...fn(t) }));
}

// ---- ALL 31 CINEMATIC SHOTS (strictly aligned to words_owner.txt & shots.md) ----
function buildShots() {
  return [
    // S01 (0.00 - 2.03): FRAME 0 HERO PROOF — "باب الأسانسير ده شكله اتجنن"
    // Head ~385 px (dist ~10.0 D, fov 27), low y=2.10, Dutch roll +2.0 -> +3.2,
    // ornate shuddering brass elevator kiosk & 48 D decaying hotel atrium + flickering globes behind!
    {
      t0: 0.00, t1: 'line:2.start',
      camera: {
        move: 'push',
        from: { pos: [1.15, 2.12, 8.35], target: [0.0, 2.26, -1.55], fov: 27 },
        to:   { pos: [0.85, 2.18, 7.45], target: [0.0, 2.30, -1.55], fov: 27 },
        roll: [2.0, 3.2],
      },
    },

    // S02 (2.03 - 4.97): LOBBY ESTABLISHING WIDE — "الست فريدة واقفة في لوبي فندق قديم وكئيب"
    // Head ~225 px (dist ~16.2 D, fov 30), showcasing the full 50 D grand decaying hotel lobby & marble floor!
    {
      t0: 'line:2.start', t1: 'line:3.start',
      camera: {
        move: 'push',
        from: { pos: [-3.4, 2.25, 14.4], target: [0.0, 2.55, -1.55], fov: 30 },
        to:   { pos: [-1.8, 2.35, 12.8], target: [0.0, 2.45, -1.55], fov: 30 },
        roll: [-1.8, -2.8],
      },
    },

    // S03 (4.97 - 7.59): HERO PROP & PAIN — "والشنطة الجلد تقيلة جداً لدرجة إيدها وجعتها"
    // Low left-angled framing showing BOTH Farida's wincing face (~345 px) AND heavy leather_bag pulling her arm!
    {
      t0: 'line:3.start', t1: 'line:4.start',
      camera: {
        move: 'push',
        from: { pos: [-2.4, 1.85, 8.75], target: [0.22, 1.98, -1.55], fov: 27 },
        to:   { pos: [-2.0, 1.92, 7.95], target: [0.24, 2.02, -1.55], fov: 27 },
        roll: [2.8, 4.0],
      },
    },

    // S04 (7.59 - 10.43): FLICKERING YELLOW GLOBES OVER SHINY MARBLE — "واللمض الصفرا بتطفي وتنور..."
    // Low upward-tilted sweeping orbit catching glowing flickering ceiling globes & yellow marble reflections!
    {
      t0: 'line:4.start', t1: 'line:5.start',
      camera: {
        move: 'path',
        keys: [
          { t: 7.59,  pos: [ 2.8, 1.72, 9.2], target: [0.0, 2.68, -1.55], fov: 28, roll: -2.5 },
          { t: 9.00,  pos: [ 0.6, 1.65, 8.8], target: [0.0, 2.85, -1.55], fov: 28, roll:  0.0 },
          { t: 10.43, pos: [-1.8, 1.88, 8.2], target: [0.5, 2.45, -2.50], fov: 28, roll:  2.0 },
        ],
      },
    },

    // S05 (10.43 - 11.35): BUTTON PRESS — "بتدوس على الزرار"
    // Oblique low push highlighting her right arm pressing the glowing brass call button!
    {
      t0: 'line:5.start', t1: 'line:6.start',
      camera: {
        move: 'push',
        from: { pos: [3.2, 2.05, 6.2], target: [1.10, 2.18, -3.65], fov: 26 },
        to:   { pos: [2.8, 2.10, 5.4], target: [1.15, 2.18, -3.65], fov: 26 },
        roll: [2.2, 3.2],
      },
    },

    // S06 (11.35 - 12.54): ANCHOR 1 — DOOR OPEN #1 — "الباب بيفتح ببطء"
    // Slow dramatic low push as twin Art-Deco brass doors glide apart behind Farida!
    {
      t0: 'line:6.start', t1: 'line:7.start',
      camera: {
        move: 'push',
        from: { pos: [-1.6, 2.08, 7.3], target: [0.30, 2.24, -3.45], fov: 27 },
        to:   { pos: [-1.2, 2.12, 6.3], target: [0.22, 2.26, -3.45], fov: 27 },
        roll: [-1.5, -2.4],
      },
    },

    // S07 (12.54 - 14.02): RECURSIVE LOBBY SHOCK — "تلاقي نفسها في نفس اللوبي"
    // Dramatic 3/4 reveal looking straight past Farida's wide-eyed face through the open brass portal into the 50 D identical lobby!
    {
      t0: 'line:7.start', t1: 'line:8.start',
      camera: {
        move: 'push',
        from: { pos: [1.55, 2.12, 6.1], target: [0.10, 2.30, -4.45], fov: 28 },
        to:   { pos: [1.15, 2.16, 5.2], target: [0.06, 2.32, -4.45], fov: 28 },
        roll: [2.0, 3.4],
      },
    },

    // S08 (14.02 - 16.25): DEADPAN STUNNED CLOSE-UP — "كأنها متحركتش سنتي"
    // Tight hero portrait (~405 px), eyes darting left then right, identical marble atrium receding behind!
    {
      t0: 'line:8.start', t1: 'line:9.start',
      camera: {
        move: 'push',
        from: { pos: [-0.85, 2.20, 5.35], target: [0.12, 2.30, -4.45], fov: 26 },
        to:   { pos: [-0.62, 2.24, 4.55], target: [0.12, 2.32, -4.45], fov: 26 },
        roll: [-1.2, -2.2],
      },
    },

    // S09 (16.25 - 18.30): FRANTIC BUTTON MASHING — "بتجرب كل الزراير واحد ورا التاني"
    // Energetic oblique medium-close as she jabs all 6 glowing buttons in rapid succession!
    {
      t0: 'line:9.start', t1: 'line:10.start',
      camera: {
        move: 'path',
        keys: [
          { t: 16.25, pos: [2.55, 2.05, 5.4], target: [0.95, 2.20, -4.75], fov: 27, roll: 3.2, shake: 0.4 },
          { t: 17.30, pos: [2.15, 2.12, 4.8], target: [1.05, 2.22, -4.75], fov: 27, roll: 4.5, shake: 0.6 },
          { t: 18.30, pos: [1.85, 2.15, 4.4], target: [0.95, 2.22, -4.75], fov: 27, roll: 4.8, shake: 0.3 },
        ],
      },
    },

    // S10 (18.30 - 19.21): EXHAUSTED SLUMP — "مفيش فايدة"
    {
      t0: 'line:10.start', t1: 'line:11.start',
      camera: {
        move: 'push',
        from: { pos: [-0.95, 2.12, 5.15], target: [0.12, 2.22, -4.60], fov: 26 },
        to:   { pos: [-0.75, 2.06, 4.55], target: [0.12, 2.16, -4.60], fov: 26 },
        roll: [-2.4, -3.0],
      },
    },

    // S11 (19.21 - 21.89): COLD MIRRORED LOBBY ORBIT — "هو هو نفس المكان بيستقبلها ببرود"
    {
      t0: 'line:11.start', t1: 'line:12.start',
      camera: {
        move: 'path',
        keys: [
          { t: 19.21, pos: [ 1.9, 2.10, 6.8], target: [0.08, 2.28, -4.55], fov: 28, roll: 1.5 },
          { t: 20.55, pos: [ 0.2, 2.14, 6.5], target: [0.05, 2.30, -4.55], fov: 28, roll: 2.2 },
          { t: 21.89, pos: [-1.4, 2.18, 6.1], target: [0.05, 2.30, -4.55], fov: 28, roll: 2.8 },
        ],
      },
    },

    // S12 (21.89 - 23.90): STEP BACK & DOOR CLOSE #1 — "بترجع لورا / الباب بيقفل"
    {
      t0: 'line:12.start', t1: 'line:14.start',
      camera: {
        move: 'path',
        keys: [
          { t: 21.89, pos: [ 0.9, 2.12, 4.6], target: [0.0, 2.26, -5.2], fov: 27, roll: -1.8 },
          { t: 22.93, pos: [ 0.5, 2.15, 5.4], target: [0.0, 2.26, -5.8], fov: 27, roll: -2.2 },
          { t: 23.90, pos: [ 0.2, 2.18, 6.1], target: [0.0, 2.26, -6.0], fov: 27, roll: -2.6 },
        ],
      },
    },

    // S13 (23.90 - 26.41): ANCHOR 2 — DOOR OPEN #2 → RAIN STREET REALITY BREAK! — "وفجأة بيفتح على شارع غرقان في المطر"
    // Warm/Cool Split: Warm brass elevator doorway on RIGHT, 64 D nocturnal neon rain street + Arabic neon signs stretching straight behind!
    {
      t0: 'line:14.start', t1: 'line:15.start',
      camera: {
        move: 'path',
        keys: [
          { t: 23.90, pos: [RAIN_X - 1.4, 2.05, 8.8], target: [RAIN_X + 0.5, 2.28, -1.15], fov: 28, roll: 3.0, shake: 0.7 },
          { t: 24.75, pos: [RAIN_X - 1.1, 2.12, 8.1], target: [RAIN_X + 0.4, 2.30, -1.15], fov: 28, roll: 2.2, shake: 0.3 },
          { t: 26.41, pos: [RAIN_X - 0.8, 2.16, 7.6], target: [RAIN_X + 0.3, 2.30, -1.15], fov: 28, roll: 1.5, shake: 0.1 },
        ],
      },
    },

    // S14 (26.41 - 27.76): RAIN STREET ESTABLISHING WIDE — "النور عاكس على الأسفلت"
    // Low gleaming wet-asphalt wide (~215 px) showing neon Arabic signs, streetlamps & glowing warm elevator on the right curb!
    {
      t0: 'line:15.start', t1: 'line:16.start',
      camera: {
        move: 'push',
        from: { pos: [RAIN_X - 4.8, 1.55, 13.8], target: [RAIN_X - 1.0, 2.15, -1.6], fov: 30 },
        to:   { pos: [RAIN_X - 3.6, 1.72, 12.2], target: [RAIN_X - 0.6, 2.20, -1.4], fov: 30 },
        roll: [-2.0, -1.0],
      },
    },

    // S15 (27.76 - 29.84): CAR WHOOSH & 3D WATER SPRAY — "والمية بتطير من تحت العربيات"
    // Low kinetic sidewalk angle framing Farida (right) AND Car 1 blasting a glowing 3D cyan/white spray plume right beside her (left)!
    {
      t0: 'line:16.start', t1: 'line:17.start',
      camera: {
        move: 'path',
        keys: [
          { t: 27.76, pos: [RAIN_X - 2.6, 1.72, 9.6], target: [RAIN_X - 0.5, 2.08, -1.2], fov: 28, roll: 2.8, shake: 0.5 },
          { t: 28.60, pos: [RAIN_X - 2.2, 1.80, 9.0], target: [RAIN_X - 0.4, 2.14, -1.2], fov: 28, roll: 3.8, shake: 1.1 },
          { t: 29.84, pos: [RAIN_X - 1.6, 1.92, 8.4], target: [RAIN_X + 0.1, 2.20, -1.0], fov: 28, roll: 4.2, shake: 0.4 },
        ],
      },
    },

    // S16 (29.84 - 31.48): KEY FRAME B — HAND IN THE RAIN — "بتمد إيديها تلمس المطر"
    // Opus Rule-of-Thirds Warm/Cool Split: Farida in warm golden doorway on right third, reaching into cobalt neon rain street on left!
    {
      t0: 'line:17.start', t1: 'line:18.start',
      camera: {
        move: 'push',
        from: { pos: [RAIN_X - 2.2, 2.04, 8.2], target: [RAIN_X + 0.15, 2.20, -0.85], fov: 26 },
        to:   { pos: [RAIN_X - 1.8, 2.10, 7.5], target: [RAIN_X + 0.20, 2.24, -0.80], fov: 26 },
        roll: [-1.4, -2.2],
      },
    },

    // S17 (31.48 - 33.62): WARM SMILE & BRAVE STEP — "بتبتسم وبتخطو خطوة"
    // Radiant low push-in (~390 px) bathed in cobalt neon & warm golden cab glow as she smiles & steps boldly forward!
    {
      t0: 'line:18.start', t1: 'line:19.start',
      camera: {
        move: 'push',
        from: { pos: [RAIN_X - 1.2, 2.08, 8.4], target: [RAIN_X + 0.25, 2.24, -0.68], fov: 26 },
        to:   { pos: [RAIN_X - 0.9, 2.14, 7.6], target: [RAIN_X + 0.20, 2.28, -0.60], fov: 26 },
        roll: [1.2, 2.2],
      },
    },

    // S18 (33.62 - 35.30): DOOR CYCLE 2 VIOLENT SLAM! — "الباب بيخبط في وشها ويقفل"
    // Angled impact shot so Farida's shocked wide-eyed face reads cleanly through the antique bronze grille + golden slam sparks!
    {
      t0: 'line:19.start', t1: 'line:20.start',
      camera: {
        move: 'path',
        keys: [
          { t: 33.62, pos: [RAIN_X - 2.4, 2.12, 7.4], target: [RAIN_X + 1.0, 2.26, -1.10], fov: 27, roll:  4.5, shake: 1.4 },
          { t: 33.98, pos: [RAIN_X - 2.8, 2.18, 6.8], target: [RAIN_X + 1.2, 2.28, -1.25], fov: 27, roll: -3.8, shake: 2.8 },
          { t: 35.30, pos: [RAIN_X - 2.6, 2.16, 7.2], target: [RAIN_X + 1.3, 2.26, -1.35], fov: 27, roll: -2.0, shake: 1.0 },
        ],
      },
    },

    // S19 (35.30 - 37.19): SIDEWAYS ELEVATOR LAUNCH! — "الأسانسير بيتهز ويتحرك بالعرض"
    // Banking high-energy cab shot (~335 px): panoramic windows behind her show colossal steel girders & sparks whipping sideways!
    {
      t0: 'line:20.start', t1: 'line:21.start',
      camera: {
        move: 'path',
        keys: [
          { t: 35.30, pos: [SHAFT_X - 0.9, 2.02, 10.6], target: [SHAFT_X, 2.38, 0.35], fov: 28, roll: -5.5, shake: 2.4 },
          { t: 36.25, pos: [SHAFT_X + 0.8, 2.14,  9.9], target: [SHAFT_X, 2.42, 0.35], fov: 28, roll:  6.2, shake: 2.6 },
          { t: 37.19, pos: [SHAFT_X + 0.4, 2.08,  9.4], target: [SHAFT_X, 2.44, 0.35], fov: 28, roll:  7.5, shake: 2.4 },
        ],
      },
    },

    // S20 (37.19 - 39.17): HERO ROULETTE FLOOR DIAL! — "أرقام الأدوار بتلف زي الروليت"
    // Low upward-tilted hero frame placing the spinning crimson-and-gold Roulette Floor Dial right above Farida's dizzy face!
    {
      t0: 'line:21.start', t1: 'line:22.start',
      camera: {
        move: 'path',
        keys: [
          { t: 37.19, pos: [SHAFT_X + 0.6, 1.72, 10.2], target: [SHAFT_X, 2.76, -0.30], fov: 27, roll:  5.0, shake: 2.0 },
          { t: 38.20, pos: [SHAFT_X - 0.4, 1.78,  9.5], target: [SHAFT_X, 2.82, -0.40], fov: 27, roll: -4.2, shake: 2.2 },
          { t: 39.17, pos: [SHAFT_X - 0.7, 1.82,  9.1], target: [SHAFT_X, 2.78, -0.35], fov: 27, roll: -4.5, shake: 1.8 },
        ],
      },
    },

    // S21 (39.17 - 40.80): CLUTCHING HEAVY LEATHER BAG — "وهي ماسكة الشنطة بإيديها الاتنين"
    // Counter-banked medium-close (~365 px) showcasing Farida hugging leather_bag tightly with BOTH hands!
    {
      t0: 'line:22.start', t1: 'line:23.start',
      camera: {
        move: 'path',
        keys: [
          { t: 39.17, pos: [SHAFT_X - 1.1, 1.98, 9.8], target: [SHAFT_X, 2.08, 0.35], fov: 27, roll: -6.5, shake: 2.3 },
          { t: 40.00, pos: [SHAFT_X + 0.9, 2.04, 9.2], target: [SHAFT_X, 2.12, 0.35], fov: 27, roll:  5.2, shake: 2.4 },
          { t: 40.80, pos: [SHAFT_X + 0.5, 2.08, 8.9], target: [SHAFT_X, 2.16, 0.35], fov: 27, roll:  6.0, shake: 2.0 },
        ],
      },
    },

    // S22 (40.80 - 42.93): HEARTBEAT & DEAD STOP — "وقلبها بينط من مكانه"
    // Electric tight push-in (~415 px) with pulsing crimson-gold heartbeat rings, braking to ZERO shake & dead silence at 42.55!
    {
      t0: 'line:23.start', t1: 'line:24.start',
      camera: {
        move: 'path',
        keys: [
          { t: 40.80, pos: [SHAFT_X + 0.5, 2.14, 9.0], target: [SHAFT_X, 2.26, 0.35], fov: 26, roll: 3.5, shake: 1.8 },
          { t: 41.90, pos: [SHAFT_X + 0.3, 2.18, 8.4], target: [SHAFT_X, 2.28, 0.35], fov: 26, roll: 1.5, shake: 0.9 },
          { t: 42.55, pos: [SHAFT_X + 0.1, 2.22, 8.1], target: [SHAFT_X, 2.30, 0.35], fov: 26, roll: 0.0, shake: 0.0, stop: true },
          { t: 42.93, pos: [SHAFT_X + 0.1, 2.22, 8.0], target: [SHAFT_X, 2.30, 0.35], fov: 26, roll: 0.0, shake: 0.0 },
        ],
      },
    },

    // S23 (42.93 - 45.61): ANCHOR 3 — DOOR OPEN #3 → COSMOS REVEAL! — "الباب بيفتح تالت مرة / على الفضا"
    // Floating warm brass elevator on RIGHT third, 80% pure deep velvet-indigo cosmos, 3D nebulae & ringed golden planet behind Farida!
    {
      t0: 'line:24.start', t1: 'line:26.start',
      camera: {
        move: 'path',
        keys: [
          { t: 42.93, pos: [COSMOS_X - 1.6, 2.08, 8.8], target: [COSMOS_X + 0.6, 2.30, -1.10], fov: 28, roll: 0.0 },
          { t: 44.48, pos: [COSMOS_X - 1.1, 2.16, 8.3], target: [COSMOS_X + 0.4, 2.32, -1.10], fov: 28, roll: 1.0 },
          { t: 45.61, pos: [COSMOS_X - 0.6, 2.22, 7.9], target: [COSMOS_X + 0.3, 2.32, -1.10], fov: 28, roll: 1.8 },
        ],
      },
    },

    // S24 (45.61 - 47.82): COSMOS ESTABLISHING WIDE — "نجوم في كل حتة وسكون تام"
    // Reverent weightless wide (~210 px) showing the ENTIRE golden Art-Deco elevator cab floating freely in infinite starry cosmos!
    {
      t0: 'line:26.start', t1: 'line:27.start',
      camera: {
        move: 'path',
        keys: [
          { t: 45.61, pos: [COSMOS_X - 4.8, 2.25, 14.8], target: [COSMOS_X + 0.8, 2.25, -1.2], fov: 30, roll: -1.2 },
          { t: 47.82, pos: [COSMOS_X - 3.0, 2.45, 13.6], target: [COSMOS_X + 0.6, 2.20, -1.0], fov: 30, roll:  1.2 },
        ],
      },
    },

    // S25 (47.82 - 50.20): THE ABYSS BENEATH THE THRESHOLD — "والأرض اختفت من تحتها"
    // Dramatic low-edge angle showing Farida's shoes on the floating brass brink while the ghost marble tiles crumble into the starry abyss below!
    {
      t0: 'line:27.start', t1: 'line:28.start',
      camera: {
        move: 'path',
        keys: [
          { t: 47.82, pos: [COSMOS_X - 2.6, 0.85, 9.2], target: [COSMOS_X + 0.2, 1.55, -0.75], fov: 28, roll: 2.2 },
          { t: 49.00, pos: [COSMOS_X - 2.0, 0.95, 8.6], target: [COSMOS_X + 0.2, 1.65, -0.75], fov: 28, roll: 1.5 },
          { t: 50.20, pos: [COSMOS_X - 1.5, 1.15, 8.2], target: [COSMOS_X + 0.3, 1.75, -0.75], fov: 28, roll: 0.8 },
        ],
      },
    },

    // S26 (50.20 - 52.53): BAG VS. STARS — "بتبص للشنطة وبتبص للنجوم"
    {
      t0: 'line:28.start', t1: 'line:29.start',
      camera: {
        move: 'path',
        keys: [
          { t: 50.20, pos: [COSMOS_X - 2.0, 1.95, 8.6], target: [COSMOS_X + 0.4, 2.08, -0.78], fov: 27, roll: -1.5 },
          { t: 51.35, pos: [COSMOS_X - 1.2, 2.05, 8.1], target: [COSMOS_X + 0.4, 2.22, -0.78], fov: 27, roll:  0.0 },
          { t: 52.53, pos: [COSMOS_X - 0.6, 2.15, 7.8], target: [COSMOS_X + 0.5, 2.26, -0.78], fov: 27, roll:  1.5 },
        ],
      },
    },

    // S27 (52.53 - 53.78): SETTING DOWN THE HEAVY BAG — "وبتقول لنفسها"
    {
      t0: 'line:29.start', t1: 'line:30.start',
      camera: {
        move: 'push',
        from: { pos: [COSMOS_X - 1.8, 1.92, 8.5], target: [COSMOS_X + 0.75, 1.95, -0.95], fov: 27 },
        to:   { pos: [COSMOS_X - 1.3, 2.08, 7.8], target: [COSMOS_X + 0.65, 2.10, -0.85], fov: 27 },
        roll: [1.0, 0.0],
      },
    },

    // S28 (53.78 - 55.29): HER ONLY LIP-SYNCED SPOKEN LINE! — "ما أنا كده كده مش عارفة أوصل"
    // Intimate hero portrait (~410 px) against deep velvet starry space & ringed golden planet!
    {
      t0: 'line:30.start', t1: 'line:31.start',
      camera: {
        move: 'push',
        from: { pos: [COSMOS_X - 0.9, 2.20, 7.8], target: [COSMOS_X + 0.55, 2.34, -0.76], fov: 26 },
        to:   { pos: [COSMOS_X - 0.6, 2.26, 7.1], target: [COSMOS_X + 0.55, 2.36, -0.76], fov: 26 },
        roll: [0.0, 1.6],
      },
    },

    // S29 (55.29 - 57.82): THE FINAL LEAP & WEIGHTLESS FLIGHT! — "بتنط / وبطير وسط النجوم"
    // Sweeping flight camera gliding ahead on +Z side looking past joyous flying Farida toward the giant ringed planet & distant glowing cab!
    {
      t0: 'line:31.start', t1: 'line:33.start',
      camera: {
        move: 'path',
        keys: camKeysFrom([55.29, 55.85, 56.50, 57.20, 57.82], t => {
          const s = faridaState(t);
          const u = smooth(55.29, 57.82, t);
          return {
            pos:    [s.x - lerp(2.8, 2.0, u), s.y + lerp(1.5, 1.9, u), s.z + lerp(9.6, 9.0, u)],
            target: [s.x, s.y + 2.05, s.z],
            fov: 28,
            roll: lerp(2.5, -3.0, u),
          };
        }),
      },
    },

    // S30 (57.82 - 59.53): WEIGHTLESS BLISS HERO PORTRAIT — "خفيفة لأول مرة"
    {
      t0: 'line:33.start', t1: 'line:34.start',
      camera: {
        move: 'path',
        keys: camKeysFrom([57.82, 58.40, 59.00, 59.53], t => {
          const s = faridaState(t);
          const u = smooth(57.82, 59.53, t);
          return {
            pos:    [s.x + lerp(-2.2, 1.2, u), s.y + 2.15, s.z + lerp(8.4, 8.0, u)],
            target: [s.x, s.y + 2.24, s.z],
            fov: 26,
            roll: lerp(-2.0, 1.2, u),
          };
        }),
      },
    },

    // S31 (59.53 - 60.76): ICONIC FINALE SOAR — "مش راجعة تاني"
    {
      t0: 'line:34.start', t1: DURATION,
      camera: {
        move: 'path',
        keys: camKeysFrom([59.53, 60.15, DURATION], t => {
          const s = faridaState(t);
          const u = smooth(59.53, DURATION, t);
          return {
            pos:    [s.x - lerp(2.4, 4.8, u), s.y + lerp(1.8, 1.5, u), s.z + lerp(11.2, 14.6, u)],
            target: [s.x + 0.3 * u, s.y + 2.10, s.z - 0.4 * u],
            fov: 28,
            roll: lerp(1.0, 2.0, u),
          };
        }),
      },
    },
  ];
}

// =========================================================================
// EXPORT DEFAULT FILM DEFINITION
// =========================================================================
export default {
  fps: FPS,
  size: [1080, 1920],
  endFrame: Math.round(DURATION * FPS), // 1,823 frames
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
    farida: {
      spec: 'cast/farida.json',
      at: [LOBBY_X, -1.55],
      ry: 16,
    },
  },

  voice: {
    file: 'voice_owner.wav',
    words: 'audio/clean.json',
    // Exact 34 performed Arabic lines (145 words verbatim from script_performed_ar.md & words_owner.txt)
    lines: [
      { who: null,     text: 'باب الأسانسير ده شكله اتجنن' },
      { who: null,     text: 'الست فريدة واقفة في لوبي فندق قديم وكئيب' },
      { who: null,     text: 'والشنطة الجلد تقيلة جداً لدرجة إيدها وجعتها' },
      { who: null,     text: 'واللمض الصفرا بتطفي وتنور فوق الرخام اللي بيلمع' },
      { who: null,     text: 'بتدوس على الزرار' },
      { who: null,     text: 'الباب بيفتح ببطء' },
      { who: null,     text: 'تلاقي نفسها في نفس اللوبي' },
      { who: null,     text: 'كأنها متحركتش سنتي' },
      { who: null,     text: 'بتجرب كل الزراير واحد ورا التاني' },
      { who: null,     text: 'مفيش فايدة' },
      { who: null,     text: 'هو هو نفس المكان بيستقبلها ببرود' },
      { who: null,     text: 'بترجع لورا' },
      { who: null,     text: 'الباب بيقفل' },
      { who: null,     text: 'وفجأة بيفتح على شارع غرقان في المطر' },
      { who: null,     text: 'النور عاكس على الأسفلت' },
      { who: null,     text: 'والمية بتطير من تحت العربيات' },
      { who: null,     text: 'بتمد إيديها تلمس المطر' },
      { who: null,     text: 'بتبتسم وبتخطو خطوة' },
      { who: null,     text: 'الباب بيخبط في وشها ويقفل' },
      { who: null,     text: 'الأسانسير بيتهز ويتحرك بالعرض' },
      { who: null,     text: 'أرقام الأدوار بتلف زي الروليت' },
      { who: null,     text: 'وهي ماسكة الشنطة بإيديها الاتنين' },
      { who: null,     text: 'وقلبها بينط من مكانه' },
      { who: null,     text: 'الباب بيفتح تالت مرة' },
      { who: null,     text: 'على الفضا' },
      { who: null,     text: 'نجوم في كل حتة وسكون تام' },
      { who: null,     text: 'والأرض اختفت من تحتها' },
      { who: null,     text: 'بتبص للشنطة وبتبص للنجوم' },
      { who: null,     text: 'وبتقول لنفسها' },
      { who: 'farida', text: 'ما أنا كده كده مش عارفة أوصل' },
      { who: null,     text: 'بتنط' },
      { who: null,     text: 'وبطير وسط النجوم' },
      { who: null,     text: 'خفيفة لأول مرة' },
      { who: null,     text: 'مش راجعة تاني' },
    ],
  },

  acts: {
    farida: {
      blink: { seed: 51, every: [1.9, 2.7] },
      listen: [],
      base: {
        ...buildFaridaBaseTracks(),
        ...buildFaridaLimbs(),
      },
      // DAZZLING FACIAL ACTING ON EVERY SPOKEN LINE & ACTION WORD!
      // All face keys kept >= 4 frames (0.13 s) clear of every shot cut!
      face: [
        // Beat 1: Lobby Hook & Exhaustion
        { t: 0.00,  eyes: 'wide',     brow: 'quizzical', mouth: 'o',        react: false }, // Frame 0: immediate expressive shock!
        { t: 1.38,  eyes: 'wince',    brow: 'knit',      mouth: 'frown',    react: false }, // "اتجنن"
        { t: 2.25,  eyes: 'sad',      brow: 'worried',   mouth: 'frown',    react: false }, // L2: old gloomy hotel lobby
        { t: 3.90,  eyes: 'half',     brow: 'down',      mouth: 'flat',     react: false }, // "قديم وكئيب"
        { t: 5.20,  eyes: 'wince',    brow: 'knit',      mouth: 'grid',     react: false }, // L3: heavy leather bag!
        { t: 6.75,  eyes: 'wince',    brow: 'worried',   mouth: 'frown',    react: false }, // "إيدها وجعتها"
        { t: 7.80,  eyes: 'open',     brow: 'up',        mouth: 'rest',     react: false }, // L4: glancing up at flickering lamps
        { t: 8.55,  eyes: 'half',     brow: 'quizzical', mouth: 'tight',    react: false }, // "بتطفي وتنور"

        // Beat 2: Door Cycle 1 — Recursive Lobby Trap
        { t: 10.60, eyes: 'angry',    brow: 'down',      mouth: 'tight',    react: false }, // L5: pressing button determinedly
        { t: 11.55, eyes: 'open',     brow: 'up',        mouth: 'rest',     react: false }, // L6: watching door open slowly
        { t: 12.75, eyes: 'wide',     brow: 'up',        mouth: 'o',        react: 'recoil' }, // L7: SHOCK — exact same lobby!!
        { t: 14.25, eyes: 'look_l',   brow: 'quizzical', mouth: 'flat',     react: false }, // L8: checking left...
        { t: 15.10, eyes: 'look_r',   brow: 'quizzical', mouth: 'tight',    react: false }, // ...checking right ("متحركتش سنتي")
        { t: 16.45, eyes: 'angry',    brow: 'knit',      mouth: 'grid',     react: false }, // L9: mashing every button frantically!
        { t: 18.48, eyes: 'half',     brow: 'down',      mouth: 'frown',    react: false }, // L10: "مفيش فايدة" exhausted slump
        { t: 19.45, eyes: 'sad',      brow: 'down',      mouth: 'flat',     react: false }, // L11: cold identical place
        { t: 22.10, eyes: 'half',     brow: 'worried',   mouth: 'tight',    react: false }, // L12-13: stepping back, door closing

        // Beat 3: Door Cycle 2 — Reality Break onto Neon Rain Street!
        { t: 24.15, eyes: 'wide',     brow: 'up',        mouth: 'o',        react: 'recoil' }, // L14: SUDDEN RAIN STREET AWE!
        { t: 26.60, eyes: 'open',     brow: 'up',        mouth: 'smile',    react: false }, // L15: glowing reflections on asphalt
        { t: 28.05, eyes: 'wide',     brow: 'up',        mouth: 'D',        react: false }, // L16: water spraying from cars!
        { t: 30.08, eyes: 'open',     brow: 'up',        mouth: 'smile',    react: false }, // L17: reaching hand into rain
        { t: 31.68, eyes: 'arc',      brow: 'up',        mouth: 'crescent', react: false, hold: true }, // L18: RADIANT JOYFUL SMILE!
        { t: 33.80, eyes: 'wide',     brow: 'worried',   mouth: 'o',        react: 'recoil' }, // L19: WHAM! Door slams in her face!

        // Beat 4: Sideways Shaft & Roulette Chaos
        { t: 35.55, eyes: 'wide',     brow: 'worried',   mouth: 'wide',     react: false }, // L20: elevator shakes & shoots sideways!
        { t: 37.45, eyes: 'wide',     brow: 'up',        mouth: 'o',        react: false }, // L21: staring up at spinning Roulette Dial!
        { t: 39.38, eyes: 'wince',    brow: 'knit',      mouth: 'grid',     react: false }, // L22: hugging leather_bag tightly!
        { t: 41.05, eyes: 'pinpoint', brow: 'worried',   mouth: 'gulp',     react: false }, // L23: pounding heart — pure terror!
        { t: 42.52, eyes: 'wide',     brow: 'worried',   mouth: 'tight',    react: false }, // dead silent stop...

        // Beat 5: Door Cycle 3 — Open Cosmos, Letting Go & Weightless Flight!
        { t: 43.35, eyes: 'wide',     brow: 'up',        mouth: 'o',        react: false }, // L24-25: OPENING ONTO THE COSMOS!
        { t: 45.85, eyes: 'open',     brow: 'up',        mouth: 'smile',    react: false }, // L26: stars everywhere & total stillness
        { t: 48.10, eyes: 'wide',     brow: 'up',        mouth: 'o',        react: false }, // L27: floor vanished beneath her!
        { t: 50.45, eyes: 'half',     brow: 'on',        mouth: 'rest',     react: false }, // L28a: looking down at heavy leather_bag
        { t: 51.55, eyes: 'open',     brow: 'up',        mouth: 'smile',    react: false }, // L28b: lifting gaze up to the stars!
        { t: 52.75, eyes: 'arc',      brow: 'on',        mouth: 'smile',    react: false }, // L29: setting bag down peacefully
        { t: 53.98, eyes: 'smug',     brow: 'up',        mouth: 'smirk',    react: false }, // L30: HER LIP-SYNCED LINE!
        { t: 54.68, eyes: 'arc',      brow: 'up',        mouth: 'crescent', react: false, hold: true }, // wry liberated smile right before leap!
        { t: 55.50, eyes: 'wide',     brow: 'up',        mouth: 'D',        react: false }, // L31: LEAPING INTO THE STARS!
        { t: 56.45, eyes: 'arc',      brow: 'up',        mouth: 'crescent', react: false, hold: true }, // L32: FLYING AMONG THE STARS!
        { t: 58.05, eyes: 'arc',      brow: 'up',        mouth: 'crescent', react: false, hold: true }, // L33: weightless for the first time!
        { t: 59.72, eyes: 'arc',      brow: 'up',        mouth: 'smile',    react: false, hold: true }, // L34: never going back!
      ],

      // Expressive gaze targets (always kept 2-3 D toward camera side so face never turns to profile!)
      look: [
        { t: 0.00,  at: [LOBBY_X + 0.8, 2.35,  4.0] },
        { t: 2.30,  at: [LOBBY_X - 3.0, 2.50,  2.5] },
        { t: 3.60,  at: [LOBBY_X + 3.2, 2.50,  2.5] },
        { t: 5.25,  at: [LOBBY_X + 1.2, 1.35,  1.2] }, // looks down at heavy leather_bag!
        { t: 7.80,  at: [LOBBY_X + 0.4, 5.20,  3.2] }, // looks up at flickering yellow ceiling globes!
        { t: 10.55, at: [LOBBY_X + 2.2, 1.95, -1.5] }, // focuses on brass button panel
        { t: 12.75, at: [LOBBY_X + 0.5, 2.35,  3.5] }, // stunned forward gaze
        { t: 16.45, at: [LOBBY_X + 2.2, 2.00, -2.5] }, // eyes on cascading buttons
        { t: 24.15, at: [RAIN_X  - 2.2, 2.35,  5.5] }, // eyes wide toward neon rain street
        { t: 28.05, at: [RAIN_X  - 3.4, 1.85,  4.0] }, // tracks speeding noir car & water spray!
        { t: 30.10, at: [RAIN_X  - 1.8, 2.05,  4.2] }, // watches raindrops on her outstretched hand
        { t: 37.45, at: [SHAFT_X + 0.3, 4.40,  4.2] }, // looks UP toward the spinning Roulette Floor Dial!
        { t: 39.40, at: [SHAFT_X + 0.2, 2.15,  5.0] }, // wide-eyed ahead clutching bag
        { t: 43.35, at: [COSMOS_X - 2.4, 2.65,  5.5] }, // gazing out into infinite cosmos
        { t: 48.10, at: [COSMOS_X - 1.4, 1.35,  4.5] }, // peering down over the missing floor brink!
        { t: 50.45, at: [COSMOS_X + 1.4, 1.40,  3.5] }, // L28a: looking down at leather_bag!
        { t: 51.55, at: [COSMOS_X - 2.8, 4.40,  5.5] }, // L28b: lifting eyes UP to the blazing stars!
        { t: 53.95, at: [COSMOS_X - 0.8, 2.34,  6.5] }, // L30: intimate direct gaze toward lens while speaking!
        { t: 55.50, at: [COSMOS_X - 8.0, 10.5,  5.0] }, // L31-34: soaring joyfully with full face toward camera!
      ],

      // Targeted animation clips (strictly >= 4 frames clear of cuts, never fighting base limb tracks)
      clips: [
        { clip: 'hand_to_temple', t0: 1.40, params: { side: 'R', hold: 0.40, out: 5 }, face: false },
        { clip: 'shock_pop',      t0: 12.78, params: { hold: 0.25, out: 6 }, face: false },
        { clip: 'shock_pop',      t0: 24.18, params: { hold: 0.28, out: 6 }, face: false },
        { clip: 'shock_pop',      t0: 33.82, params: { hold: 0.32, out: 6 }, face: false },
      ],
    },
  },

  props: [
    // HERO PROP: Heavy Vintage Cognac Leather Suitcase (continuous PROP GUARD from 0.00 -> 60.76 s!)
    {
      id: 'leather_bag',
      kind: 'leather_bag',
      owner: 'farida',
      in: 'hand:L',
      at: [0, 0, 0],
      rot: [0, 0, 0],
      keys: buildLeatherBagKeys(),
    },
  ],

  shots: buildShots(),
  captions: 'words',
};
