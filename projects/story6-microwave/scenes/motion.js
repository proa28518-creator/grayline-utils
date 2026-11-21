// scenes/motion.js — Pure-in-t Master Motion Truth for Story 6 «الشوكولاتة اللي ساحت»
// ONE table of times drives engineer & mocker positions/expressions, popcorn/kettle/box states,
// and all 21 shot cuts aligned strictly to owner's words_owner.txt (56.20 s / 1,686 frames @ 30 fps).

export const FPS = 30;
export const DURATION = 56.20;

// 4 Worlds spaced 400 units apart along X (zero cross-visibility)
export const LAB_X = 0;
export const MICRO_X = 400;
export const SHOW_X = 800;
export const GRID_X = 1200;

// Anchor times (from words_owner.txt)
export const T_MELT = 0.18;      // chocolate melted in pocket
export const T_RADAR = 3.04;     // radar setup
export const T_COLD = 6.26;      // freezing room
export const T_NOHEAT = 7.93;    // no heat source
export const T_HOW = 9.82;       // "how did it melt?"
export const T_MOCK = 11.70;     // colleague laughs
export const T_MOCKLINE = 12.53; // "ya am, this hunts planes, not a cooking oven"
export const T_SILENT = 15.41;   // engineer silent
export const T_DAY2 = 17.34;     // next day, corn bag
export const T_POP = 19.78;      // popcorn explodes
export const T_LAUGH2 = 22.41;   // laughter grows
export const T_EGG = 23.63;      // egg in kettle
export const T_LEAN = 25.85;     // mocker leans in
export const T_BOOM = 28.40;     // egg explodes in his face
export const T_GOT = 30.36;      // engineer understands
export const T_WAVES = 32.26;    // waves shake water molecules
export const T_RUB = 36.46;      // rubbing-hands analogy
export const T_INOUT = 38.24;    // cooks inside-out, no fire
export const T_BOX = 40.61;      // builds iron box
export const T_COMPANY = 43.27;  // company launches first oven
export const T_TALL = 46.14;     // a man's height
export const T_340 = 47.32;      // 340 kg
export const T_5000 = 48.75;     // $5000
export const T_TODAY = 50.34;    // 200M+ today
export const T_START = 53.45;    // all began with a melted chocolate
export const END = 56.20;

// Shot starts (21 shots)
export const SHOTS_T = [
  0.18,  1.35,  3.04,  6.26,  9.82, 11.70, 15.41, 17.34, 19.78, 23.63,
 25.85, 28.40, 30.36, 32.26, 36.46, 38.24, 40.61, 43.27, 46.14, 50.34,
 53.45,
];

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, u) => a + (b - a) * u;
export const smooth = (a, b, x) => {
  const u = clamp((x - a) / (b - a), 0, 1);
  return u * u * (3 - 2 * u);
};
export const easeOutCubic = u => {
  const c = clamp(u, 0, 1);
  return 1 - Math.pow(1 - c, 3);
};
export const easeInOutCubic = u => {
  const c = clamp(u, 0, 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};
export const easeOutExpo = u => (u >= 1 ? 1 : 1 - Math.pow(2, -9 * clamp(u, 0, 1)));

// ---- ENGINEER STATE ----
// ROUND-3 (A31-M2): state now also returns y / bend / lean (degrees, Story-5
// contract) and film.js buildBaseTracks pushes them — previously the bend /
// lean / root.y tracks were fed constant 0, so no torso incline ever read.
export function engineerState(t) {
  const place = t < T_WAVES ? 'lab' : t < T_BOX ? 'micro' : t < T_TODAY ? 'show' : 'grid';

  let x = LAB_X, y = 0, z = 0, face = 0, pose = 'stand', expr = 'neutral', bend = 0, lean = 0;

  if (t < T_MELT) {
    // S01: pocket extreme close, engineer at home
    x = LAB_X - 5; z = -1.55; face = 17; pose = 'stand'; expr = 'puzzled';
  } else if (t < T_RADAR) {
    // S02: camera dolly-out, engineer at home (-5, -1.55), hand in pocket T_MELT..1.35
    x = LAB_X - 5;
    z = -1.55;
    face = 17;
    pose = t < 1.35 ? 'pocket' : 'stand';
    expr = 'puzzled';
  } else if (t < T_COLD) {
    // S03: wide establishing glide, engineer at radar console
    x = LAB_X - 5; z = -1.55; face = 17; pose = 'stand'; expr = 'neutral';
  } else if (t < T_HOW) {
    // S04: slow pace x -6.5 -> -3.5 and back, arms crossed, shivering
    const u = smooth(T_COLD, T_HOW, t);
    const pace = Math.sin(u * Math.PI * 2.0);
    x = LAB_X - 5.0 + pace * 1.5;
    z = -1.55;
    face = 17;
    pose = 'cold';
    expr = 'miserable';
    bend = 5; lean = Math.sin(t * 12.0) * 1.5; // hunched + shiver sway (M2)
} else if (t < T_MOCK) {
  // S05: R4-6 — root shifted south to z -0.95, clear of the radar plinth front
  // (z -1.4, y 1.3..1.8) that was occluding the torso. Hard cuts at T_HOW/T_MOCK
  // hide the step. Pocket chocolate + breath derive from this state, so follow.
  x = LAB_X - 5; z = -0.95;
  face = t < T_HOW + 0.8 ? 32 : 17;
  pose = 'stand';
  expr = 'puzzled';
  bend = 6;
  } else if (t < T_SILENT) {
    // S06: mocker entrance (engineer visible in frame background)
    x = LAB_X - 5; z = -1.55; face = 17; pose = 'stand'; expr = 'neutral';
  } else if (t < T_DAY2) {
    // S07: deadpan medium close-up, cold focus
    x = LAB_X - 5; z = -1.55; face = 17; pose = 'stand'; expr = 'deadpan';
  } else if (t < T_POP) {
    // S08: R7-4 — the crouched head (-5.795,2.332,-2.897) was INSIDE the radar
// device Body box (x -6.25..-3.75, z -6.2..-1.8, y 1.8..6.2): all three ranges
// satisfied, so EVERY exterior ray crossed it — no camera could clear it.
// Root moved WEST out of both the Body and the plinth (x -6.5..-4.3) footprints:
// head becomes (-6.791,2.330,-2.290), max x on any western ray -6.791 < -6.25.
// z -2.8 is 0.2 south of the bench slab front (-3.0) and 0.38 south of the stool,
// legs on floor top y=0, torso z ~-2.52 clear of the slab. He sets the bag at the
// bench's WEST front corner (beside papers/oscilloscope); hard cuts hide the step.
const u = smooth(T_DAY2, T_DAY2 + 0.8, t);
x = lerp(LAB_X - 9.0, LAB_X - 7.2, u);
z = -2.8;
face = 25;
pose = t < T_DAY2 + 0.8 ? 'stand' : t < T_DAY2 + 2.0 ? 'crouch' : 'stand';
expr = 'neutral';
const crouchEnv = smooth(T_DAY2 + 0.8, T_DAY2 + 1.1, t) * (1 - smooth(T_DAY2 + 1.7, T_DAY2 + 2.0, t));
bend = 16 * crouchEnv; lean = 4 * crouchEnv;
  } else if (t < T_EGG) {
    // S09: popcorn explodes, camera shake/orbit
    x = LAB_X - 5; z = -1.55; face = 17; pose = 'stand'; expr = 'neutral';
  } else if (t < T_LEAN) {
    // S10: over-shoulder, puts egg in kettle
    x = LAB_X - 5;
    z = -1.55;
    face = 17;
    pose = t < T_EGG + 0.8 ? 'reach' : 'stand';
    expr = 'neutral';
    bend = t < T_EGG + 0.8 ? 10 : 0; // reach incline while placing (M2)
  } else if (t < T_BOOM) {
    // S11: tight two-shot, mocker leans in (engineer holds position)
    x = LAB_X - 5; z = -1.55; face = 17; pose = 'stand'; expr = 'neutral';
  } else if (t < T_GOT) {
    // S12: egg explosion (engineer reacts slightly back)
    x = LAB_X - 5; z = -1.55; face = 17; pose = 'stand'; expr = 'neutral';
  } else if (t < T_WAVES) {
    // S13: hero close-up, smile, picks up notebook. ROUND-5: stands CLEAR of the
    // bench (x -5.5, south of it at z -0.8) so legs don't dangle through the slab.
    x = LAB_X - 5.5; z = -0.8; face = 17;
    pose = t < T_GOT + 0.6 ? 'stand' : 'write';
    expr = 'smile';
    bend = t < T_GOT + 0.6 ? 0 : 8;
  } else if (t < T_BOX) {
    // S14..S16: micro world shots (engineer stays in lab, explaining)
    x = LAB_X - 5; z = -1.55; face = 17; pose = 'stand'; expr = 'explaining';
    bend = t >= T_RUB && t < T_INOUT ? 10 : 0; // S15 hands-rub incline at the chest (M2)
  } else if (t < T_COMPANY) {
    // S17: welding the iron box — hero stands AT the wave bench WEST of the box
    // (2.4, -4.6) not leaning over it, so he stays inside the S17 camera frustum.
    // Face sweeps with the orbit so the face reads at arc start/mid/end.
    x = LAB_X + 2.4;
    z = -4.6;
    face = lerp(-65, 62, easeInOutCubic((t - T_BOX) / (T_COMPANY - T_BOX)));
    pose = 'weld';
    expr = 'focus';
    bend = 12 + 6 * smooth(T_BOX, T_COMPANY, t);
    lean = 2;
  } else if (t < T_TALL) {
    // S18: showroom curtain reveal (engineer in crowd background)
    x = SHOW_X - 10; z = -5; face = 72; pose = 'stand'; expr = 'neutral';
} else if (t < T_TODAY) {
// S19: R4-7 — the reference man stays ON the plinth deck (y 0.8) for the whole
// height/weight/price window, beside oven + gauge, inside the S19 frustum.
// Deck spans show-local x -4.8..0.8, z +-1.5; (-3.70, 0.95) is on it, feet planted.
// D10 (desk ruling): face 90 -> 40 kills the two-tone head split at the cost of
// the pure-profile read; x -3.5 -> -3.70, z 0.9 -> 0.95 (Neon item 12). Clearances:
// gauge (-4.3,-0.6) 0.60 west / 1.55 north; oven cabinet west edge -2.80, 0.90 east.
x = SHOW_X - 3.70; z = 0.95; y = 0.8;
face = 40; pose = 'stand'; expr = 'neutral';
  } else if (t < T_START) {
    // S20: exponential zoom-out (engineer small in initial kitchen)
    x = GRID_X; z = 0; face = 90; pose = 'stand'; expr = 'neutral';
  } else {
    // S21: loop match-cut back to opening (engineer at home)
    x = LAB_X - 5;
    z = -1.55;
    face = 17;
    pose = 'stand';
    expr = 'puzzled';
  }

  return { place, x, y, z, face, pose, expr, bend, lean };
}

// ---- MOCKER STATE ----
export function mockerState(t) {
  const place = 'lab';
  let x = LAB_X + 14, y = 0, z = -1.55, face = 0, pose = 'stand', expr = 'neutral', bend = 0, lean = 0; // off-stage default

  if (t < T_MOCK) {
    // Mocker not yet entered, off-stage right
    x = LAB_X + 14; z = -1.55; face = 0; pose = 'stand'; expr = 'neutral';
  } else if (t < T_MOCKLINE) {
    // S06: entrance walk T_MOCK..T_MOCKLINE to (1.7, -1.3)
    const u = smooth(T_MOCK, T_MOCKLINE, t);
    x = lerp(LAB_X + 14, LAB_X + 1.7, u);
    z = lerp(-1.55, -1.3, u);
    face = -20;
    pose = 'gesture';
    expr = 'smug';
} else if (t < T_SILENT) {
// S06 continued: big close-up, laughing, dismissive wave
x = LAB_X + 1.7; z = -1.3; face = -20; pose = 'gesture'; expr = 'smug';
// D13: chuckle sway (M2) + head-back bias 8–12deg with a 2.5 Hz bounce across the
// laugh peak 12.85–14.20 (Neon item 15; the desk routes head-back through lean).
const chuck = smooth(12.85, 13.10, t) * (1 - smooth(14.00, 14.20, t));
lean = Math.sin((t - T_MOCK) * 8.0) * 4
+ chuck * (10 + 2 * Math.sin((t - 12.85) * Math.PI * 5.0));
  } else if (t < T_DAY2) {
    // S07: mocker stays in lab right side
    x = LAB_X + 2; z = -1.55; face = -20; pose = 'stand'; expr = 'smug';
  } else if (t < T_POP) {
    // S08: background, watching corn bag, smirking
    x = LAB_X + 2; z = -1.55; face = -20; pose = 'stand'; expr = 'smug';
  } else if (t < T_EGG) {
    // S09: RE-BLOCK (governing spec S10/S12) — during the popcorn beats he walks
    // from the lab right side (2, -1.55) to the kettle bench end (-1.5, -3.2),
    // laughing as he comes. Arrives just before S10 so the egg two-shot can exist.
    const u = smooth(T_POP, T_EGG - 0.3, t);
    x = lerp(LAB_X + 2, LAB_X - 1.5, u);
    z = lerp(-1.55, -3.2, u);
    face = Math.round(lerp(-20, -52, u));
    pose = u < 0.95 ? 'walk' : 'lean';
    expr = 'laugh';
    const laughEnv = u < 0.95 ? 0 : clamp((t - T_LAUGH2) / (T_EGG - T_LAUGH2), 0, 1);
    const stage = laughEnv * 3.0;
    let growBend = 4, growLean = 0;
    if (stage < 1.0) {
      const s = smooth(0, 1, stage);
      growBend = 4 + 6 * s;
      growLean = -5 * s;
    } else if (stage < 2.0) {
      const s = smooth(0, 1, stage - 1.0);
      growBend = 10 - 8 * s;
      growLean = -5 - 4 * s;
    } else {
      const s = smooth(0, 1, stage - 2.0);
      growBend = 2 + 12 * s;
      growLean = -9 - 3 * s;
    }
    bend = u < 0.95 ? 4 : growBend;
    lean = u < 0.95 ? 0 : growLean;
  } else if (t < T_LEAN) {
    // S10: at the kettle (-1.5, -3.2), leaning in — the lean RAMP starts here
    // (M2: bend channel live) and completes into S11's full peer.
    x = LAB_X - 1.5; z = -3.2; face = -52; pose = 'lean'; expr = 'curious';
    bend = lerp(14, 25, smooth(T_EGG, T_LEAN - 0.3, t));
    lean = -5;
  } else if (t < T_BOOM) {
    // S11: R3-1 — the lean as BLOCKING. The MOCKER's feet stay at the locked
    // re-block (-1.5, -3.2); over the first 0.5 s his hips translate toward
    // the kettle (root shift, feet counter-shifted in film.js limb tracks so
    // the feet stay planted), his facing turns from -52 to -100 (toward the
    // kettle azimuth), bend ramps 25 -> 47 and lean settles -12 — landing his
    // head at approx (-2.65, 1.95, -3.85), R3-1's authored head target, face
    // ~0.5 from the kettle rim. Peer then HELD to the cut (>= 60% of the shot).
    const u = smooth(T_LEAN, T_LEAN + 0.5, t);
    x = lerp(LAB_X - 1.5, LAB_X - 1.85, u);
    z = lerp(-3.2, -3.42, u);
    face = lerp(-52, -100, u);
    pose = 'lean'; expr = 'curious';
    bend = lerp(25, 47, u);
    lean = lerp(-5, -12, u);
  } else if (t < T_GOT) {
    // S12: egg blast recoil — from the S11 lean spot (-1.85, -3.42) backward
    // in +z with dx +0.30 <= 0.4 (spec), fast 0.3 s throw then HELD so the
    // splattered face reads to the cut. Torso snaps back (bend -10) through
    // the reel, then settles upright under the yolk.
    const u = smooth(T_BOOM, T_BOOM + 0.3, t);
    x = lerp(LAB_X - 1.85, LAB_X - 1.55, u);
    z = lerp(-3.42, -2.5, u);
    face = -40;
    pose = t < T_BOOM + 0.55 ? 'reel' : 'stand';
    expr = 'splattered';
    bend = t < T_BOOM + 0.55 ? -10 : lerp(-10, 2, smooth(T_BOOM + 0.55, T_GOT, t));
    lean = 0;
  } else if (t < T_WAVES) {
    // S13: aftermath at the recoil spot, egg dripping from face, silent humiliation
    x = LAB_X - 1.55; z = -2.5; face = -40; pose = 'stand'; expr = 'yolk';
    bend = 6; lean = 3; // slumped under the yolk (M2)
  } else {
    // S14+: mocker off-stage (story moves to micro/show/grid worlds)
    x = LAB_X + 14; z = -1.55; face = 0; pose = 'stand'; expr = 'neutral';
  }

  return { place, x, y, z, face, pose, expr, bend, lean };
}

// ---- POPCORN STATE (0 = kernels in bag, 1 = fully popped/exploded) ----
// ROUND-4 (M1): returns the real settle/decay value consistent with the
// settle envelope in set.js (903-932). The state function contract (Story-5)
// requires consumers read the settling value, not a frozen 1.
export function popcornState(t) {
  if (t < T_DAY2) return 0;
  if (t < T_POP) return smooth(T_DAY2 + 1.2, T_POP, t) * 0.3; // heating
  if (t < T_POP + 0.8) return 0.3 + easeOutExpo((t - T_POP) / 0.8) * 0.7; // burst to 1.0
  // Settle envelope T_POP+0.9 -> +2.4: exponential decay from 1.0 to 0.02 (kernels landed)
  if (t < T_POP + 2.4) {
    const u = (t - (T_POP + 0.9)) / 1.5; // 0..1 over the 1.5s settle window
    return 1.0 - easeOutExpo(u) * 0.98; // 1.0 -> 0.02
  }
  return 0.02; // settled (small residual so consumers never read exact 0 post-settle)
}

// ---- R11-1 CORN BAG (carry -> lower -> release -> placed -> empty at T_POP) ----
// F8: the carry/lower height rides the S08 crouch envelope, recomputed here from
// the engineerState S08 branch: smooth(18.14,18.44,t)*(1-smooth(19.04,19.34,t)).
// x/z EXACTLY as A90 authored (hunt H3/H8: the horizontal tracking is correct).
export function cornBagState(t) {
if (t < T_DAY2) return { vis: false };
const P = [LAB_X - 6.75, 0, -2.86];
const u = smooth(T_DAY2, T_DAY2 + 0.8, t);
const rx = lerp(LAB_X - 9.0, LAB_X - 7.2, u);
const crouchEnv = smooth(T_DAY2 + 0.8, T_DAY2 + 1.1, t) * (1 - smooth(T_DAY2 + 1.7, T_DAY2 + 2.0, t));
const hand = [rx + 0.34, 0.92 + 0.03 * Math.sin(t * 7) - 0.30 * crouchEnv, -2.64];
const k = smooth(T_DAY2 + 1.0, T_DAY2 + 1.5, t);      // lower 18.34 -> 18.84, inside the crouch envelope (18.14..19.34)
const pos = [lerp(hand[0], P[0], k), lerp(hand[1], P[1], k), lerp(hand[2], P[2], k)];
const s = t - (T_DAY2 + 1.5);
if (s > 0) pos[1] += Math.max(0, 0.02 * Math.sin(s * 18) * Math.exp(-s * 6)); // settle tick
const empty = smooth(T_POP, T_POP + 0.25, t);
return { vis: true, pos, rotY: lerp(0.4, 0.15, k), squash: 1 - 0.62 * empty,
tilt: 0.14 * empty, placed: k > 0.999 };
}

// ---- KETTLE STATE (progress: 'empty' | 'egg_in' | 'trembling' | 'exploded') ----
export function kettleState(t) {
  if (t < T_EGG) return 'empty';
  if (t < T_LEAN) return 'egg_in'; // R4-11: tremble starts AT T_LEAN (25.85)
  if (t < T_BOOM) return 'trembling'; // full 2.55 s build to the boom
  return 'exploded';
}

// ---- BOX BUILD STATE (R11-4 process beats; A22 face keys unchanged) ----
// RULINGS_01 Q1: S16 is the FOOD CROSS-SECTION — no box on stage before T_BOX.
// assemble 40.61->41.05 | weld 41.05->42.15 | door 42.10->42.55 | glow 42.55->42.85.
// F9: assemble starts at 0 — A90's 0.12 floor popped the box in at 12% on the cut.
// Returns the beat OBJECT; set.js update() must alias `const boxVis = bs.assemble`
// before the retained waveRings/sparkGrp readers (F5 — separate commission).
export function boxBuildState(t) {
const a = smooth(40.61, 41.05, t);
const assemble = t < 40.61 ? 0 : a;
const weld = smooth(41.05, 41.2, t) * (1 - smooth(42.0, 42.15, t));
const door = smooth(42.10, 42.55, t);
const glow = smooth(42.55, 42.85, t);
return { assemble, weld, door, glow,
weldX: lerp(-0.4, 0.4, smooth(41.1, 42.0, t)),
pulse: 0.5 + 0.5 * Math.sin(t * 15) };
}

// ---- R11-2 S14 WAVE PHASE (emission under L17, dimmed behind molecule for L18) ----
export function wavePhaseState(t) {
const on = t >= 32.26 && t < 36.46;
const emit = 1 - smooth(33.9, 34.3, t);
const macro = smooth(33.9, 34.3, t) * (1 - smooth(36.16, 36.46, t));
return { on, emit, macro, flow: (t * 1.4) % 1, pulse: 0.5 + 0.5 * Math.sin(t * 16) };
}
// ---- R11-3 HAND-RUB (S15 analogy) ----
export function handRubState(t) {
const on = t >= 36.46 && t < 38.24;
const e = smooth(36.6, 37.2, t);
const w = (t - 36.46) * 2 * Math.PI * 3.1;
return { on, slide: 0.15 * Math.sin(w) * e, wob: 0.1 * Math.sin(w + 1.2) * e,
energy: e, heat: smooth(36.9, 37.55, t) };
}
// ---- R11-5 SCALE (rest -> SLAM at T_340 -> damped settle) ----
export function scaleState(t) {
const rest = -2.05, end = -0.785, tau = t - T_340;
let a = rest;
if (tau >= 0) {
a = tau < 0.12 ? lerp(rest, end, tau / 0.12)
: end + 0.28 * Math.sin((tau - 0.12) * 14) * Math.exp(-(tau - 0.12) * 4.5);
}
return { needle: a, pulse: tau >= 0 ? Math.exp(-tau * 2.5) : 0 };
}
// ---- R11-6 PRICE TAG (edge-on until T_5000, pendulum release toward camera) ----
export function tagState(t) {
const tau = t - T_5000;
const angle = tau < 0 ? -1.35 : -1.35 * Math.exp(-3.0 * tau) * Math.cos(5.2 * tau);
const faceOn = tau < 0 ? 0 : smooth(0, 0.25, tau);
return { vis: t >= 46.14 && t < 50.34, angle, faceOn, sway: 0.06 * Math.sin(t * 1.7) };
}
