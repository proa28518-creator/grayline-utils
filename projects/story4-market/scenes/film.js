// scenes/film.js — Story 4: «الناجي الوحيد من الطابور» (The Only Survivor of the Checkout Line)
// Governing timing: owner's recorded performance in audio/clean.json / voice_words.txt (58.64 s, 1,759 frames @ 30 fps).
// Built from scenes/BIBLE.md, shots.md, script_performed_ar.md, and scenes/motion.js.

import { makePost } from './post.js';
import { makeShade } from './shade.js';
import {
  DURATION, FPS, OUTER_X, T_SOUP_HIT, T_HOP_ON, T_GUARD_FALL, T_THAW, T_JUMP_OFF, T_SHATTER,
  cartState, clerkState, guardFallProgress,
  buildRedCartKeys, buildGuardCapKeys, buildClerkBaseTracks,
} from './motion.js';

// Build clerk's dynamic arms & legs tracks synced to motion.js (pushing -> running -> riding step-bar -> airborne leap)
function buildClerkLimbs() {
  const armR = [], armL = [], legR = [], legL = [];
  const step = 0.20;
  for (let t = 0; t <= T_SHATTER; t = +(t + step).toFixed(3)) {
    const s = clerkState(t);
    if (s.airborne) {
      // Epic mid-air superhero/cartoon leap! Arms flung wide & high, legs kicked back/bent!
      armR.push([t, [-0.56, 0.88, 0.34]]);
      armL.push([t, [ 0.56, 0.92, 0.28]]);
      legR.push([t, [-0.22, 1.02, 0.34]]);
      legL.push([t, [ 0.24, 0.94, 0.22]]);
    } else if (t >= T_HOP_ON) {
      // Riding the rear step-bar (y = 0.34): both hands locked tightly onto the red cart push-handle!
      // During sharp right swerve (34..37s) wrench handle hard right!
      const sw = (t >= 33.96 && t <= 36.8) ? -0.18 : 0;
      armR.push([t, [-0.36 + sw, 0.24, 0.56]]);
      armL.push([t, [ 0.36 + sw, 0.24, 0.56]]);
      // Feet firmly planted together on the step-bar!
      legR.push([t, [-0.20, 0.0, 0.02]]);
      legL.push([t, [ 0.20, 0.0, 0.02]]);
    } else if (t >= 4.28) {
      // Pushing & running behind red_cart: hands gripping handle, dynamic running stride in root space!
      const braking = t >= 14.27 && t < 16.41;
      armR.push([t, [-0.35, braking ? 0.30 : 0.38, 0.62]]);
      armL.push([t, [ 0.35, braking ? 0.30 : 0.38, 0.62]]);
      if (braking) {
        // Heels dug forward into the tile floor!
        legR.push([t, [-0.22, 0.0, 0.42]]);
        legL.push([t, [ 0.22, 0.0, 0.28]]);
      } else {
        const ph = t * 11.5;
        const sr = Math.sin(ph), sl = Math.sin(ph + Math.PI);
        legR.push([t, [-0.20, Math.max(0, sr * 0.24), sr * 0.44]]);
        legL.push([t, [ 0.20, Math.max(0, sl * 0.24), sl * 0.44]]);
      }
    } else {
      // S01-S02 standing beside/behind cart handle: hands on handle (clips override for gestures in S01/S02)
      armR.push([t, [-0.36, 0.36, 0.54]]);
      armL.push([t, [ 0.36, 0.36, 0.54]]);
      legR.push([t, [-0.18, 0.0, 0.0]]);
      legL.push([t, [ 0.18, 0.0, 0.0]]);
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

// Build frozen guard's rigid statue topple track (at [0.25, 0, 6.2]: leaning 22 deg mid-stride until 30.60s, then falling sideways like a solid statue!)
function buildGuardTracks() {
  const lean = [], bend = [], rx = [], ryY = [], legL = [];
  lean.push([0, 0], [T_GUARD_FALL, 0]);
  bend.push([0, 22], [T_GUARD_FALL, 22], [T_GUARD_FALL + 0.72, 10]);
  rx.push([0, 0.25], [T_GUARD_FALL, 0.25]);
  ryY.push([0, 0], [T_GUARD_FALL, 0]);
  // Frozen mid-stride: left foot lifted off floor!
  legL.push([0, [0.22, 0.34, -0.36]], [T_GUARD_FALL + 0.72, [0.22, 0.18, -0.15]]);
  for (let i = 1; i <= 8; i++) {
    const dt = (i / 8) * 0.75;
    const t = +(T_GUARD_FALL + dt).toFixed(3);
    const u = guardFallProgress(t);
    lean.push([t, +(-84 * u).toFixed(1)]);
    rx.push([t, +(0.25 - 0.65 * u).toFixed(3)]);
    ryY.push([t, +(-0.18 * u).toFixed(3)]);
  }
  return {
    'root.x': rx,
    'root.y': ryY,
    'body.lean': lean,
    'body.bend': bend,
    'legL.in': 'root',
    'legL.foot': legL,
    'armR.hand': [-0.46, 0.56, 0.42],
    'armL.hand': [ 0.42, 0.25, -0.35],
  };
}

// Helper to build a smooth moving path camera relative to clerk/cart at given times
function camKeysFrom(times, fn) {
  return times.map(t => ({ t, ...fn(t) }));
}

// Helper for clerk world head point at time t
const headAt = t => {
  const s = clerkState(t);
  return [s.x, s.y + 2.38, s.z];
};

// Build all 24 shots (aligned strictly to owner's voice_words.txt timing, 58.64 s total)
function buildShots() {
  return [
    // S01 (0.00 - 1.81): FRAME 0 HERO PROOF — "خلاص مفيش صبر!"
    // Head ~375 px (dist ~10.2 D, fov 28), low angle y=2.15, Dutch roll +2.2 -> +3.2,
    // red cart gleaming in lower third, 48 D corridor depth + fluorescents + frozen mom behind!
    {
      t0: 0.00, t1: 'line:1.word:4',
      camera: {
        move: 'push',
        from: { pos: [0.65, 2.15, -13.65], target: [0.0, 2.08, -23.65], fov: 28 },
        to:   { pos: [0.48, 2.20, -14.65], target: [0.0, 2.15, -23.65], fov: 28 },
        roll: [2.2, 3.2],
      },
    },

    // S02 (1.81 - 4.28): Depth two-shot — "أنا الوحيد اللي بيتحرك في الطابور الواقف ده!"
    // QWEN REVERSE ANGLE: from behind-right so the clerk's raised RIGHT hand lands ON her face in
    // screen space while BOTH heads stay fully inside; red cart reads in the lower fifth. fov 33.
    {
      t0: 'line:1.word:4', t1: 'line:2.start',
      camera: {
        move: 'push',
        from: { pos: [-1.05, 2.16, -10.30], target: [-1.50, 2.00, -22.90], fov: 31 },
        to:   { pos: [-1.30, 2.20, -11.00], target: [-1.55, 2.02, -22.90], fov: 31 },
        roll: [-1.8, -2.8],
      },
    },

    // S03 (4.28 - 6.43): Low 3/4 push step — "زقيت عربية التسوق الحمرا خطوة.."
    // Restaged camera to left-front (-X) so shopper_receipt never blocks clerk; big saturated red cart fills lower-mid frame!
    {
      t0: 'line:2.start', t1: 'line:2.word:6',
      camera: {
        move: 'path',
        keys: camKeysFrom([4.28, 5.35, 6.43], t => {
          const c = cartState(t);
          const u = (t - 4.28) / 2.15;
          return {
            pos: [c.x - 1.55 + u * 0.35, 1.95, c.z + 9.8 - u * 0.8],
            target: [c.x + 0.10, 1.68, c.z - 0.3],
            fov: 28,
            roll: 1.8 + u * 1.4,
          };
        }),
      },
    },

    // S04 (6.43 - 9.98): Low dramatic broken-wheel yank — "وفجأة عجلتها المكسورة خانتني وشدتني لقدام!"
    // Restaged slightly wider so shopper_milk fits cleanly on left without edge clipping while bent sparking wheel_fr & red cart dominate!
    {
      t0: 'line:2.word:6', t1: 'line:3.start', lowCam: true,
      camera: {
        move: 'path',
        keys: camKeysFrom([6.43, 7.6, 8.8, 9.98], t => {
          const c = cartState(t);
          const u = (t - 6.43) / 3.55;
          return {
            pos: [c.x + 1.05 - u * 0.25, 0.98 + u * 0.65, c.z + 10.4 - u * 0.6],
            target: [c.x - 0.15, 1.42 + u * 0.28, c.z - 0.2],
            fov: 30,
            roll: -2.6 - u * 1.4,
            shake: 1.1,
          };
        }),
      },
    },

    // S05 (9.98 - 11.61): THE SINGLE ESTABLISHING WIDE — "المتجر كله كأنه متجمد في الزمن،"
    // Restaged sightline along left-center (-X) past the right-offset soup pyramid (x=+1.35): 100% UNOBSTRUCTED 54 D frozen aisle + statues + red cart!
    {
      t0: 'line:3.start', t1: 'line:3.word:7',
      camera: {
        move: 'path',
        keys: camKeysFrom([9.98, 10.8, 11.61], t => {
          const c = cartState(t);
          const u = (t - 9.98) / 1.63;
          return {
            pos: [-2.15 + u * 0.20, 2.55, c.z + 14.8 + u * 0.4],
            target: [-0.25, 1.98, c.z - 0.8],
            fov: 31,
            roll: 1.5 + u * 1.0,
          };
        }),
      },
    },

    // S06 (11.61 - 14.27): Cart hood-mount acceleration rush — "والعربية بتزيد سرعتها معايا خطوة بخطوة!"
    // Restaged closer & left-angled (cam.z before/clear of right-offset soup pyramid) -> 100% clear blazing red cart + panicked ~390 px face!
    {
      t0: 'line:3.word:7', t1: 'line:4.start',
      camera: {
        move: 'path',
        keys: camKeysFrom([11.61, 12.9, 14.27], t => {
          const c = cartState(t);
          const u = (t - 11.61) / 2.66;
          return {
            pos: [c.x - 1.85 + u * 0.35, 2.02, c.z + 8.0 - u * 0.7],
            target: [c.x, 1.92, c.z - 0.6],
            fov: 29,
            roll: -2.4 - u * 1.6,
            shake: 1.4,
          };
        }),
      },
    },

    // S07 (14.27 - 15.80): Braking fail toward towering soup pyramid — "حاولت أفرمل، بس مفيش فايدة"
    // Restaged left-front 3/4 view: FULL clerk braking (-20 deg lean) + FULL red cart on LEFT, towering soup pyramid looming ahead on RIGHT!
    {
      t0: 'line:4.start', t1: 'line:4.word:6',
      camera: {
        move: 'path',
        keys: camKeysFrom([14.27, 15.05, 15.80], t => {
          const c = cartState(t);
          const u = (t - 14.27) / 1.53;
          return {
            pos: [c.x - 2.95 + u * 0.35, 2.05, c.z + 8.6 - u * 0.6],
            target: [c.x + 0.45, 1.78, c.z - 0.1],
            fov: 30,
            roll: 2.8 + u * 1.4,
            shake: 1.6,
          };
        }),
      },
    },

    // S08 (15.80 - 18.98): SOUP PYRAMID IMPACT — "العربية دخلت في رف علب الشوربة بكل قوتها!"
    // Restaged slightly wider & right-angled so clerk's wincing face & bright red cart read cleanly as tomato soup cans burst left & right!
    {
      t0: 'line:4.word:6', t1: 'line:5.start',
      camera: {
        move: 'path',
        keys: camKeysFrom([15.80, 16.41, 17.5, 18.98], t => {
          const c = cartState(t);
          const u = (t - 15.80) / 3.18;
          return {
            pos: [c.x + 2.25 - u * 0.4, 2.15, c.z + 9.4 - u * 0.6],
            target: [c.x + 0.05, 1.92, c.z - 0.4],
            fov: 29,
            roll: -3.5 + u * 6.5,
            shake: t >= 16.35 && t <= 17.2 ? 2.4 : 1.3,
          };
        }),
      },
    },

    // S09 (18.98 - 20.84): SPECTACLE TEST #3 HERO SHOT #1 — "الرفوف بدأت تقع ورايا بالبطيء،"
    // Full expressive front-3/4 face + blazing red cart + 42 crystal-clear suspended tomato soup cans + domino collapsing shelves!
    {
      t0: 'line:5.start', t1: 'line:5.word:6',
      camera: {
        move: 'path',
        keys: camKeysFrom([18.98, 19.9, 20.84], t => {
          const c = cartState(t);
          const u = (t - 18.98) / 1.86;
          return {
            pos: [c.x + 1.85 - u * 0.45, 2.25, c.z + 10.6 - u * 0.6],
            target: [c.x - 0.20, 2.38, c.z - 1.5],
            fov: 29,
            roll: 2.2 + u * 1.2,
            shake: 0.7,
          };
        }),
      },
    },

    // S10 (20.84 - 23.72): SPECTACLE TEST #3 HERO SHOT #2 — "وتلت المتجر بيقع علبة ورا علبة!"
    // Tight reaction face (~390 px, full front-3/4 clear!) framed by crisp individual suspended tomato soup cans & collapsing shelves!
    {
      t0: 'line:5.word:6', t1: 'line:6.start',
      camera: {
        move: 'path',
        keys: camKeysFrom([20.84, 22.25, 23.72], t => {
          const c = cartState(t);
          const u = (t - 20.84) / 2.88;
          return {
            pos: [c.x - 1.25 + u * 0.30, 2.35, c.z + 8.9 - u * 0.65],
            target: [c.x + 0.08, 2.32, c.z - 0.9],
            fov: 28,
            roll: -2.0 - u * 1.5,
            shake: 0.8,
          };
        }),
      },
    },

    // S11 (23.72 - 25.93): Hop onto rear step-bar — "نطيت على حرف العربية، وهي بتكسر في الرفوف"
    // Restaged closer (c.z + 9.2) & clear of guard (now at z=6.2): clean full action view of clerk surfing the red cart step-bar!
    {
      t0: 'line:6.start', t1: 'line:6.word:9',
      camera: {
        move: 'path',
        keys: camKeysFrom([23.72, 24.8, 25.93], t => {
          const c = cartState(t);
          const u = (t - 23.72) / 2.21;
          return {
            pos: [c.x + 2.10 - u * 0.35, 2.02, c.z + 9.2 - u * 0.5],
            target: [c.x, 1.85, c.z - 0.35],
            fov: 29,
            roll: 2.8 + u * 1.2,
            shake: 1.5,
          };
        }),
      },
    },

    // S12 (25.93 - 28.24): Screaming iron wheels & flying sparks — "وصوت عجلاتها الحديد بيصرخ في المكان!"
    // Restaged completely clear of guard (cam.z stays <= 5.4, well before guard at z=6.2, or angled cleanly from right-front!):
    // crisp low Dutch view from sparking front-right wheel up to clerk's roaring face!
    {
      t0: 'line:6.word:9', t1: 'line:7.start', lowCam: true,
      camera: {
        move: 'path',
        keys: camKeysFrom([25.93, 27.1, 28.24], t => {
          const c = cartState(t);
          const u = (t - 25.93) / 2.31;
          return {
            pos: [c.x + 2.35, 0.92 + u * 0.65, c.z + 7.2 - u * 0.5],
            target: [c.x - 0.05, 1.48 + u * 0.45, c.z - 0.35],
            fov: 31,
            roll: -3.4 - u * 1.4,
            shake: 2.0,
          };
        }),
      },
    },

    // S13 (28.24 - 30.60): Frozen Security Guard dead ahead — "وفجأة، حارس الأمن اللي كان واقف زي التمثال"
    // Depth two-shot aligned to guard at z=6.2: frozen security guard right-foreground, clerk & blazing red cart hurtling straight toward him!
    {
      t0: 'line:7.start', t1: 'line:7.word:9',
      camera: {
        move: 'path',
        keys: camKeysFrom([28.24, 29.4, 30.60], t => {
          const u = (t - 28.24) / 2.36;
          return {
            pos: [-1.85 + u * 0.25, 2.15, 15.1 - u * 1.1],
            target: [0.10, 1.98, 5.2 - u * 0.4],
            fov: 28,
            roll: 2.0 + u * 1.5,
            shake: 1.2,
          };
        }),
      },
    },

    // S14 (30.60 - 32.33): Rigid guard topples across aisle — "مال ووقع قدامي!"
    // Restaged slightly wider & shifted left so the ENTIRE falling guard (full face + moustache + launching cap!) AND clerk + red cart fit cleanly!
    {
      t0: 'line:7.word:9', t1: 'line:8.start',
      camera: {
        move: 'path',
        keys: camKeysFrom([30.60, 31.45, 32.33], t => {
          const u = (t - 30.60) / 1.73;
          return {
            pos: [1.55 - u * 0.30, 2.25 - u * 0.35, 15.8 - u * 0.8],
            target: [-0.65, 1.68 - u * 0.22, 5.2],
            fov: 30,
            roll: -2.2 - u * 1.8,
            shake: 2.0,
          };
        }),
      },
    },

    // S15 (32.33 - 33.96): Officer cap rolls under front wheel — "قبعته اتدحرجت تحت العجلة بالظبط،"
    // Ground-level low action shot (lowCam: true): peaked navy cap rolling straight toward wheel_fr, clerk peering over red cart!
    {
      t0: 'line:8.start', t1: 'line:8.word:6', lowCam: true,
      camera: {
        move: 'path',
        keys: camKeysFrom([32.33, 33.15, 33.96], t => {
          const c = cartState(t);
          const u = (t - 32.33) / 1.63;
          return {
            pos: [1.35 - u * 0.20, 0.85, c.z + 9.4 - u * 0.7],
            target: [c.x + 0.05, 1.32, c.z + 0.35],
            fov: 30,
            roll: 3.2 + u * 1.4,
            shake: 1.8,
          };
        }),
      },
    },

    // S16 (33.96 - 36.15): Hard right swerve whip-orbit — "فخلتني أكسر يمين في ملف حاد!"
    // Restaged clear of crate row (now starts at z=10.6): unobstructed close-medium on clerk wrenching red cart handle hard right!
    {
      t0: 'line:8.word:6', t1: 'line:9.start',
      camera: {
        move: 'path',
        keys: camKeysFrom([33.96, 35.05, 36.15], t => {
          const c = cartState(t);
          const u = (t - 33.96) / 2.19;
          return {
            pos: [c.x + 1.45 - u * 0.45, 2.18, c.z + 8.6 - u * 0.5],
            target: [c.x, 1.88, c.z - 0.3],
            fov: 29,
            roll: 4.0 - u * 8.5,
            shake: 2.2,
          };
        }),
      },
    },

    // S17 (36.15 - 37.65): Two-wheel +24 deg drift — "العربية طارت على عجلتين"
    // Restaged cleanly right-front of the tilted cart (crates start at z=10.6 -> ZERO crate occlusion!):
    // FULL +24 deg two-wheel tilt of the blazing red cart + airborne left wheels + surfing clerk!
    {
      t0: 'line:9.start', t1: 'line:9.word:5',
      camera: {
        move: 'path',
        keys: camKeysFrom([36.15, 36.9, 37.65], t => {
          const c = cartState(t);
          const u = (t - 36.15) / 1.50;
          return {
            pos: [c.x + 2.85, 1.78, c.z + 8.4 - u * 0.5],
            target: [c.x - 0.05, 1.62, c.z - 0.25],
            fov: 30,
            roll: -4.2 - u * 0.6,
            shake: 1.8,
          };
        }),
      },
    },

    // S18 (37.65 - 40.12): Plowing through exploding crate row — "ومسحت صف الصناديق في زحليقة مجنونة!"
    // Restaged so wooden FRESH crates explode LEFT and RIGHT while the blazing red cart & clerk blast cleanly down the center!
    {
      t0: 'line:9.word:5', t1: 'line:10.start',
      camera: {
        move: 'path',
        keys: camKeysFrom([37.65, 38.9, 40.12], t => {
          const c = cartState(t);
          const u = (t - 37.65) / 2.47;
          return {
            pos: [c.x + 2.25 - u * 0.45, 2.02, c.z + 8.8 - u * 0.6],
            target: [c.x + 0.05, 1.76, c.z - 0.25],
            fov: 30,
            roll: 3.0 + u * 1.4,
            shake: 2.1,
          };
        }),
      },
    },

    // S19 (40.12 - 42.91): High-speed foyer hood-cam — "السرعة بقت بره السيطرة خالص ناحية البيبان الإزاز،"
    // Pull back 0.7 D so panicked head lands squarely at ~405 px above the blazing red cart nose!
    {
      t0: 'line:10.start', t1: 'line:10.word:9',
      camera: {
        move: 'path',
        keys: camKeysFrom([40.12, 41.5, 42.91], t => {
          const c = cartState(t);
          const u = (t - 40.12) / 2.79;
          return {
            pos: [c.x - 0.45, 2.35, c.z + 9.3 - u * 0.8],
            target: [c.x, 2.18, c.z - 0.6],
            fov: 28,
            roll: -2.2 - u * 1.5,
            shake: 2.2,
          };
        }),
      },
    },

    // S20 (42.91 - 45.28): Time thaws in checkout foyer — "والوقت بدأ يرجع لطبيعته تدريجي!"
    // Shows BOTH clerk + blazing red cart on right AND full waking shocked shopper_foyer_2 on left (zero edge-clip!)
    {
      t0: 'line:10.word:9', t1: 'line:11.start',
      camera: {
        move: 'path',
        keys: camKeysFrom([42.91, 44.1, 45.28], t => {
          const c = cartState(t);
          const u = (t - 42.91) / 2.37;
          return {
            pos: [c.x - 2.0 + u * 0.25, 2.28, Math.min(31.4, c.z + 11.5)],
            target: [c.x - 1.0, 1.98, c.z + 0.1],
            fov: 35,
            roll: 2.0 + u * 1.0,
            shake: 1.2,
          };
        }),
      },
    },

    // S21 (45.28 - 48.49): Epic mid-air leap off red cart — "قبل ما أخبط في الباب بثانية واحدة، نطيت من العربية في الهوا!"
    // Wide dynamic side-front angle (dist ~8.5 D, fov 36): BOTH full-body airborne clerk (head ~350 px cleanly inside!)
    // AND driverless blazing red_cart rocketing straight at the glowing EXIT glass doors read in ONE epic frame!
    {
      t0: 'line:11.start', t1: 'line:12.start',
      camera: {
        move: 'path',
        keys: camKeysFrom([45.28, 46.8, 47.72, 48.49], t => {
          const c = cartState(t);
          const cl = clerkState(t);
          const u = (t - 45.28) / 3.21;
          return {
            pos: [-5.60 + u * 0.35, 1.62 + cl.y * 0.30, 31.3],
            target: [0.45, 1.95 + cl.y * 0.75, 28.1],
            fov: 36,
            roll: -2.6 + u * 1.6,
            shake: 1.4,
          };
        }),
      },
    },

    // S22 (48.49 - 50.52): SEAM CUT GLASS SHATTER — "العربية دشدشت الإزاز.."
    // Crisp curved glass shatter burst with miniature red cart bursting straight out of the snow globe crack, ZERO character overlapping the globe!
    {
      t0: 'line:12.start', t1: 'line:12.word:5', seam: true, lowCam: true,
      camera: {
        move: 'path',
        keys: [
          { t: 48.49, pos: [OUTER_X + 0.35, 2.48, 4.45], target: [OUTER_X + 0.05, 2.38, 0.28], fov: 28, roll: 2.0, shake: 2.2 },
          { t: 49.40, pos: [OUTER_X + 0.55, 2.54, 5.55], target: [OUTER_X + 0.05, 2.40, 0.24], fov: 28, roll: 1.0, shake: 1.0 },
          { t: 50.52, pos: [OUTER_X + 0.72, 2.60, 6.70], target: [OUTER_X + 0.05, 2.42, 0.20], fov: 29, roll: 0.4, shake: 0.3 },
        ],
      },
    },

    // S23 (50.52 - 53.93): SPECTACLE TEST #4 HERO SHOT #1 — "عشان نكتشف إن المتجر كله جوه كرة ثلجية عملاقة!"
    // Centered cleanly on the full curved glass snow globe, brass SUPERMARKET plaque, warm wooden desk & glowing cyan mini-market inside — ZERO edge-clipped faces!
    {
      t0: 'line:12.word:5', t1: 'line:13.start', lowCam: true,
      camera: {
        move: 'push',
        from: { pos: [OUTER_X + 0.22, 2.50, 9.10], target: [OUTER_X + 0.05, 3.05, 0.20], fov: 34 },
        to:   { pos: [OUTER_X + 0.28, 2.54, 8.45], target: [OUTER_X + 0.05, 3.10, 0.18], fov: 34 },
        roll: [1.0, 0.0],
      },
    },

    // S24 (53.93 - 58.64): SPECTACLE TEST #4 PAYOFF SHOT #2 — "وإحنا مش أكتر من تحفة إزاز على مكتب عميل حقيقي.. واقف في طابور متجر تاني!"
    // Full margin around exhausted real_customer on left + outer_queue_1 + full glowing cracked snow globe & SUPERMARKET plaque on wooden desk right!
    {
      t0: 'line:13.start', t1: 59.0, lowCam: true,
      camera: {
        move: 'push',
        from: { pos: [OUTER_X - 0.95, 2.55, 11.00], target: [OUTER_X - 0.35, 3.66, -0.55], fov: 38 },
        to:   { pos: [OUTER_X - 0.95, 2.58, 10.30], target: [OUTER_X - 0.35, 3.62, -0.50], fov: 38 },
        roll: [0.8, 1.4],
      },
    },
  ];
}

export default {
  fps: FPS,
  size: [1080, 1920],
  duration: DURATION,
  endHold: false,
  language: 'ar',
  captions: 'words',
  world: {
    set: 'own',
    setOpts: {
      post: { ...makePost(), shade: makeShade() },
    },
  },
  cast: {
    // Hero (moves continuously down supermarket aisle via motion.js)
    clerk:           { spec: 'cast/clerk.json',           at: [0.0, -23.65], ry: 6 },

    // Frozen supermarket shoppers (staged at 30-60 deg — zero row of backs!)
    shopper_milk:    { spec: 'cast/shopper_milk.json',    at: [-2.15, -22.2], ry: 42 },
    shopper_receipt: { spec: 'cast/shopper_receipt.json', at: [ 2.85, -18.8], ry: -48 },
    shopper_kid:     { spec: 'cast/shopper_kid.json',     at: [-2.85, -15.4], ry: 45, y: 0.48 },
    shopper_tug_a:   { spec: 'cast/shopper_tug_a.json',   at: [ 2.25, -14.2], ry: -28 },
    shopper_tug_b:   { spec: 'cast/shopper_tug_b.json',   at: [ 3.05, -12.8], ry: -68 },
    guard:           { spec: 'cast/guard.json',           at: [ 0.25,   6.2], ry: -18 },

    // Checkout foyer shoppers (frozen until line 10 word 11 "يرجع", then nearest 3 wake up!)
    shopper_foyer_1: { spec: 'cast/shopper_foyer_1.json', at: [ 2.55,  21.8], ry: -46 },
    shopper_foyer_2: { spec: 'cast/shopper_foyer_2.json', at: [-2.10,  22.6], ry:  48 },
    shopper_foyer_3: { spec: 'cast/shopper_foyer_3.json', at: [ 2.85,  25.0], ry: -54 },

    // Outer real-world store cast (x = +400 D; positioned cleanly LEFT & RIGHT of snow globe at x=+0.05 so zero actor overlaps the curved glass sphere!)
    real_customer:   { spec: 'cast/real_customer.json',   at: [OUTER_X - 2.35, -2.35], ry:  26 },
    outer_cashier:   { spec: 'cast/outer_cashier.json',   at: [OUTER_X + 2.35, -2.55], ry: -26 },
    outer_queue_1:   { spec: 'cast/outer_queue_1.json',   at: [OUTER_X - 1.65, -6.20], ry:  14 },
    outer_queue_2:   { spec: 'cast/outer_queue_2.json',   at: [OUTER_X + 1.45, -9.60], ry: -16 },
  },

  voice: {
    file: 'audio/clean.wav',
    words: 'audio/clean.json',
    // Exact 156 performed Arabic words from owner's voice_words.txt / audio/clean.json
    lines: [
      { who: 'clerk', text: 'خلاص مفيش صبر! أنا الوحيد اللي بيتحرك في الطابور الواقف ده!' },
      { who: 'clerk', text: 'زقيت عربية التسوق الحمرا خطوة.. وفجأة عجلتها المكسورة خانتني وشدتني لقدام!' },
      { who: 'clerk', text: 'المتجر كله كأنه متجمد في الزمن، والعربية بتزيد سرعتها معايا خطوة بخطوة!' },
      { who: 'clerk', text: 'حاولت أفرمل، بس مفيش فايدة العربية دخلت في رف علب الشوربة بكل قوتها!' },
      { who: 'clerk', text: 'الرفوف بدأت تقع ورايا بالبطيء، وتلت المتجر بيقع علبة ورا علبة!' },
      { who: 'clerk', text: 'نطيت على حرف العربية، وهي بتكسر في الرفوف وصوت عجلاتها الحديد بيصرخ في المكان!' },
      { who: 'clerk', text: 'وفجأة، حارس الأمن اللي كان واقف زي التمثال مال ووقع قدامي!' },
      { who: 'clerk', text: 'قبعته اتدحرجت تحت العجلة بالظبط، فخلتني أكسر يمين في ملف حاد!' },
      { who: 'clerk', text: 'العربية طارت على عجلتين ومسحت صف الصناديق في زحليقة مجنونة!' },
      { who: 'clerk', text: 'السرعة بقت بره السيطرة خالص ناحية البيبان الإزاز، والوقت بدأ يرجع لطبيعته تدريجي!' },
      { who: 'clerk', text: 'قبل ما أخبط في الباب بثانية واحدة، نطيت من العربية في الهوا!' },
      { who: null,    text: 'العربية دشدشت الإزاز.. عشان نكتشف إن المتجر كله جوه كرة ثلجية عملاقة!' },
      { who: null,    text: 'وإحنا مش أكتر من تحفة إزاز على مكتب عميل حقيقي.. واقف في طابور متجر تاني!' },
    ],
  },

  acts: {
    clerk: {
      base: {
        ...buildClerkBaseTracks(),
        ...buildClerkLimbs(),
      },
      // Expressive face keys on EVERY line & action word — Frame 0 EXPLODES with exasperation!
      face: [
        // F0: EXPLOSIVE "طفح الكيل! / خلاص مفيش صبر!" face — wide raging eyes + heavy knit brows + big shout mouth!
        { t: 0.00,             eyes: 'wide',     brow: 'knit',      mouth: 'wide', react: false },
        { t: 'line:1.word:4',  eyes: 'angry',    brow: 'knit',      mouth: 'grid', react: false },
        { t: 'line:1.word:7',  eyes: 'wide',     brow: 'up',        mouth: 'o',    react: false },
        // L2: Push -> broken wheel surprise yank
        { t: 'line:2.start',   eyes: 'angry',    brow: 'knit',      mouth: 'tight', react: false },
        { t: 'line:2.word:6',  eyes: 'wide',     brow: 'worried',   mouth: 'o',    react: false },
        { t: 'line:2.word:9',  eyes: 'wide',     brow: 'worried',   mouth: 'wide', react: false },
        // L3: Frozen wide -> panicked speed rush
        { t: 'line:3.start',   eyes: 'wide',     brow: 'up',        mouth: 'o',    react: false },
        { t: 'line:3.word:8',  eyes: 'wide',     brow: 'worried',   mouth: 'wide', react: false },
        // L4: Braking strain -> soup pyramid impact wince!
        { t: 'line:4.start',   eyes: 'wince',    brow: 'knit',      mouth: 'grid', react: false },
        { t: 'line:4.word:7',  eyes: 'wince',    brow: 'knit',      mouth: 'wide', react: false },
        // L5: Slow-motion soup-can awe & horror!
        { t: 'line:5.start',   eyes: 'pinpoint', brow: 'worried',   mouth: 'o',    react: false },
        { t: 'line:5.word:8',  eyes: 'wide',     brow: 'worried',   mouth: 'wide', react: false },
        // L6: Adrenaline surf on step-bar -> screaming iron wheels
        { t: 'line:6.start',   eyes: 'angry',    brow: 'knit',      mouth: 'grid', react: false },
        { t: 'line:6.word:12', eyes: 'wide',     brow: 'worried',   mouth: 'wide', react: false },
        // L7: Frozen guard horror -> gasp as he topples!
        { t: 'line:7.start',   eyes: 'pinpoint', brow: 'worried',   mouth: 'gulp', react: false },
        { t: 'line:7.word:10', eyes: 'wide',     brow: 'worried',   mouth: 'wide', react: false },
        // L8: Cap rolling under wheel -> clenched-teeth hard right swerve!
        { t: 'line:8.start',   eyes: 'wide',     brow: 'worried',   mouth: 'o',    react: false },
        { t: 'line:8.word:7',  eyes: 'wince',    brow: 'knit',      mouth: 'grid', react: false },
        // L9: Two-wheel rally surf -> crazy crate slide!
        { t: 'line:9.start',   eyes: 'wide',     brow: 'up',        mouth: 'wide', react: false },
        { t: 'line:9.word:5',  eyes: 'angry',    brow: 'knit',      mouth: 'grid', react: false },
        // L10: Out of control toward glass -> time thawing shock!
        { t: 'line:10.start',  eyes: 'wide',     brow: 'worried',   mouth: 'wide', react: false },
        { t: 'line:10.word:11', eyes: 'pinpoint', brow: 'worried',  mouth: 'o',    react: false },
        // L11: Mid-air leap!
        { t: 'line:11.start',  eyes: 'wide',     brow: 'worried',   mouth: 'grid', react: false },
        { t: 'line:11.word:8', eyes: 'wide',     brow: 'up',        mouth: 'wide', react: false },
      ],
      clips: [
        // S01: Dramatic arms-thrown-up exasperation burst right at Frame 0!
        { clip: 'shock_pop', t0: 0.0, params: { hold: 0.9, out: 6 }, face: false },
        // S02: Waves right hand right in front of the frozen mom's unblinking face!
        { clip: 'wave', at: 'line:1.word:5', params: { side: 'R', hold: 58 }, face: false },
        // S04: Shock jolt when broken wheel yanks him!
        { clip: 'shock_pop', at: 'line:2.word:8', params: { hold: 0.25, out: 6 }, face: false },
        // S08: Brace on soup pyramid impact!
        { clip: 'wince', at: 'line:4.word:7', params: { hold: 0.35, out: 6 }, face: false },
        // S10: Hand to temple in disbelief watching third of the store collapse in slow-mo!
        { clip: 'hand_to_temple', at: 'line:5.word:7', params: { side: 'L', hold: 1.4, out: 6 }, face: false },
        // S14: Recoil shock when guard crashes down!
        { clip: 'shock_pop', at: 'line:7.word:10', params: { hold: 0.35, out: 6 }, face: false },
        // S21 (Qwen): arms thrown OUT for balance across the airborne window!
        { clip: 'shock_pop', at: 'line:11.start', params: { hold: 2.2, out: 6 }, face: false },
      ],
      look: [
        { t: 0.00,             at: [0.6, 2.3, -14.0] },   // straight at camera on Frame 0!
        { t: 'line:1.word:5',  at: [-1.8, 2.2, -21.0] },  // looks at frozen mom & floating milk
        { t: 'line:2.start',   at: [0.0, 1.5, -18.0] },   // looks down at red cart
        { t: 'line:2.word:7',  at: [0.4, 0.8, -16.0] },   // looks at bent front wheel
        { t: 'line:3.start',   at: [0.0, 2.1, -6.0] },    // looks ahead down aisle
        { t: 'line:5.start',   at: [-1.8, 3.2, 1.5] },    // camera-side 3/4 upward awe glance (keeps full face clear in S09/S10!)
        { t: 'line:6.start',   at: [0.0, 2.1, 8.0] },     // forward focus riding step-bar
        { t: 'line:7.start',   at: [0.25, 2.2, 6.2] },    // locked onto frozen guard
        { t: 'line:8.start',   at: [0.2, 0.6, 5.2] },     // peers down at rolling officer cap!
        { t: 'line:8.word:7',  at: [-2.4, 1.8, 12.0] },   // looks hard right into swerve!
        { t: 'line:10.start',  at: [0.0, 2.4, 32.0] },    // locked onto glowing glass doors!
        { t: 'line:11.start',  at: [0.45, 2.75, 32.4] },  // S21 (Qwen): gaze HIGH on door header, pitch forward over cart!
      ],
    },

    // ---- FROZEN STATUES (Zero blink, zero gaze, dead-still museum poses!) ----
    shopper_milk: {
      blink: false, gaze: false, listen: [],
      base: {
        'body.bend': -12, 'body.lean': -8,
        'armR.hand': [-0.52, 0.72, 0.42],
        'armL.hand': [ 0.54, 0.66, 0.36],
      },
      face: [{ t: 0, eyes: 'stare', brow: 'on', mouth: 'flat', react: false }],
    },
    shopper_receipt: {
      blink: false, gaze: false, listen: [],
      base: {
        'body.bend': 14,
        'armR.hand': [-0.32, 0.56, 0.55],
        'armL.hand': [ 0.36, 0.48, 0.52],
      },
      face: [{ t: 0, eyes: 'pinpoint', brow: 'worried', mouth: 'o', react: false }],
    },
    shopper_kid: {
      blink: false, gaze: false, listen: [],
      base: {
        'root.y': 0.48, // frozen hovering mid-jump!
        'body.bend': 10,
        'armR.hand': [-0.36, 0.92, 0.25],
        'armL.hand': [ 0.42, 0.58, -0.15],
        'legR.in': 'root', 'legL.in': 'root',
        'legR.foot': [-0.18, 0.28, -0.24],
        'legL.foot': [ 0.18, 0.12,  0.22],
      },
      face: [{ t: 0, eyes: 'wide', brow: 'up', mouth: 'D', react: false }],
    },
    shopper_tug_a: {
      blink: false, gaze: false, listen: [],
      base: {
        'body.bend': -14, 'body.lean': 12,
        'armR.hand': [-0.35, 0.50, 0.62],
        'armL.hand': [ 0.28, 0.46, 0.58],
      },
      face: [{ t: 0, eyes: 'angry', brow: 'knit', mouth: 'wide', react: false }],
    },
    shopper_tug_b: {
      blink: false, gaze: false, listen: [],
      base: {
        'body.bend': -14, 'body.lean': -12,
        'armR.hand': [-0.32, 0.48, 0.60],
        'armL.hand': [ 0.34, 0.50, 0.62],
      },
      face: [{ t: 0, eyes: 'angry', brow: 'knit', mouth: 'grid', react: false }],
    },
    guard: {
      blink: false, gaze: false, listen: [],
      base: {
        ...buildGuardTracks(),
        // Hide guard's attached hat right when guard_cap prop launches at 31.25s!
        'hat.on': [[0, true, 'snap'], [31.25, false, 'snap']],
      },
      face: [{ t: 0, eyes: 'stare', brow: 'down', mouth: 'flat', react: false }],
    },

    // ---- CHECKOUT FOYER SHOPPERS (Frozen dead still until 2f after line:10.word:11 "يرجع", then wake in terror!) ----
    shopper_foyer_1: {
      blink: false, gaze: false, listen: [],
      face: [
        { t: 0,     eyes: 'stare', brow: 'on',      mouth: 'flat', react: false },
        { t: 43.65, eyes: 'wide',  brow: 'worried', mouth: 'o',    react: 'recoil' },
      ],
      clips: [{ clip: 'shock_pop', t0: 43.68, params: { hold: 1.5, out: 6 }, face: false }],
    },
    shopper_foyer_2: {
      blink: false, gaze: false, listen: [],
      face: [
        { t: 0,     eyes: 'stare', brow: 'on',      mouth: 'flat', react: false },
        { t: 43.68, eyes: 'wide',  brow: 'worried', mouth: 'o',    react: 'recoil' },
      ],
      clips: [{ clip: 'brace', t0: 43.72, params: { hold: 1.5, out: 6 }, face: false }],
    },
    shopper_foyer_3: {
      blink: false, gaze: false, listen: [],
      face: [
        { t: 0,     eyes: 'stare', brow: 'down',    mouth: 'tight', react: false },
        { t: 43.72, eyes: 'wide',  brow: 'worried', mouth: 'o',     react: 'recoil' },
      ],
      clips: [{ clip: 'lean_back', t0: 43.75, params: { hold: 1.5, out: 6 }, face: false }],
    },

    // ---- OUTER REAL-WORLD STORE CAST (S23-S24: exhausted deadpan stuck in an even longer queue!) ----
    real_customer: {
      blink: { seed: 71, every: [1.8, 2.6] },
      listen: [],
      base: { 'body.bend': 4 },
      face: [
        { t: 0,     eyes: 'half', brow: 'down',      mouth: 'flat',  react: false },
        { t: 54.40, eyes: 'half', brow: 'quizzical', mouth: 'frown', react: false },
        { t: 56.50, eyes: 'sad',  brow: 'down',      mouth: 'flat',  react: false },
      ],
      look: [
        { t: 48.49, at: [OUTER_X + 0.05, 2.35, 0.25] }, // glances down at the cracked snow globe!
        { t: 56.40, at: [OUTER_X + 0.50, 2.40, 6.00] }, // deadpan glance toward camera/endless line!
      ],
      clips: [
        { clip: 'akimbo', t0: 53.93, params: { side: 'R' }, face: false },
      ],
    },
    outer_cashier: {
      blink: { seed: 72, every: [2.2, 3.0] },
      listen: [],
      base: { 'body.bend': 8 },
      face: [{ t: 0, eyes: 'half', brow: 'down', mouth: 'flat', react: false }],
      look: [{ t: 48.49, at: [OUTER_X + 0.05, 2.35, 0.25] }],
    },
    outer_queue_1: {
      blink: { seed: 73, every: [2.0, 2.8] },
      listen: [],
      face: [{ t: 0, eyes: 'half', brow: 'down', mouth: 'frown', react: false }],
    },
    outer_queue_2: {
      blink: { seed: 74, every: [2.4, 3.2] },
      listen: [],
      face: [{ t: 0, eyes: 'half', brow: 'on', mouth: 'flat', react: false }],
    },
  },

  props: [
    // 1. HERO ANCHOR PROP: Saturated Crimson Red Shopping Cart (continuous PROP GUARD trajectory 0 -> 48.49s!)
    {
      id: 'red_cart',
      kind: 'red_cart',
      in: 'world',
      at: [0.0, 0.0, -22.6],
      rot: [0, 0, 0],
      keys: buildRedCartKeys(),
    },
    // 2. Floating Frozen Milk Carton beside shopper_milk in S01-S02 (dips down at checkout thaw!)
    {
      id: 'floating_milk',
      kind: 'milk_carton',
      in: 'world',
      at: [-1.45, 1.98, -21.7],
      rot: [18, 28, -24],
      keys: [
        // Clean cut-based move to foyer checkout area for S20 thaw beat (42.91s), then drops slightly at 43.65s!
        { t: 42.91, in: 'world', at: [1.95, 2.08, 22.0], rot: [15, -24, 20], pass: 0.01 },
        { t: 43.65, in: 'world', at: [1.95, 1.62, 22.0], rot: [28, -18, 34], pass: 0.25 },
        { t: T_SHATTER, in: 'hidden' },
      ],
    },
    // 3. Security Guard's Officer Cap (pops off at S14 guard fall, rolls right under wheel_fr in S15!)
    {
      id: 'guard_cap',
      kind: 'guard_cap',
      in: 'hidden',
      at: [0.15, 2.38, 5.10],
      rot: [0, 0, 0],
      keys: buildGuardCapKeys(),
    },
  ],

  shots: buildShots(),
};
