// scenes/motion.js — Single source of truth (pure in t) for Story 4 ("الناجي الوحيد من الطابور").
// Governing clock: owner's recorded performance in voice_words.txt / audio/clean.json (58.64 s, 1,759 frames @ 30 fps).
// Drives scenes/film.js (clerk timeline, red_cart & guard_cap prop keys, 24 cameras), scenes/set.js (soup cans, collapsing shelves,
// guard topple, crate sweep, glass shatter, snow globe), scenes/post.js, and scenes/shade.js.

export const DURATION = 58.64;
export const FPS = 30;

// Exact 24-shot start times aligned to voice_words.txt (owner performed timing)
export const SHOTS_T = [
  0.00,  // S01: L1a — Frame 0 hero explosion ("خلاص مفيش صبر!")
  1.81,  // S02: L1b — Depth 2-shot with frozen mom + floating milk ("أنا الوحيد اللي بيتحرك...")
  4.28,  // S03: L2a — Low 3/4 push step on red cart ("زقيت عربية التسوق الحمرا خطوة..")
  6.43,  // S04: L2b — Low bent wheel yank ("وفجأة عجلتها المكسورة خانتني وشدتني لقدام!")
  9.98,  // S05: L3a — Establishing wide: 54 D frozen aisle ("المتجر كله كأنه متجمد في الزمن،")
  11.61, // S06: L3b — Hood-cam speed rush ("والعربية بتزيد سرعتها معايا خطوة بخطوة!")
  14.27, // S07: L4a — Braking fail toward soup pyramid ("حاولت أفرمل، بس مفيش فايدة")
  15.80, // S08: L4b — Impact into soup pyramid at 16.41s ("العربية دخلت في رف علب الشوربة بكل قوتها!")
  18.98, // S09: L5a — Slow-mo floating soup cans + domino shelves #1 ("الرفوف بدأت تقع ورايا بالبطيء،")
  20.84, // S10: L5b — Tight face + readable mid-air soup cans #2 ("وتلت المتجر بيقع علبة ورا علبة!")
  23.72, // S11: L6a — Hop onto cart rear step-bar ("نطيت على حرف العربية، وهي بتكسر في الرفوف")
  25.93, // S12: L6b — Low sparks & screaming iron wheels ("وصوت عجلاتها الحديد بيصرخ في المكان!")
  28.24, // S13: L7a — Depth 2-shot toward frozen guard ahead ("وفجأة، حارس الأمن اللي كان واقف زي التمثال")
  30.60, // S14: L7b — Frozen guard topples across aisle ("مال ووقع قدامي!")
  32.33, // S15: L8a — Low chase: officer cap rolls under front wheel ("قبعته اتدحرجت تحت العجلة بالظبط،")
  33.96, // S16: L8b — Hard right swerve whip-orbit ("فخلتني أكسر يمين في ملف حاد!")
  36.15, // S17: L9a — Two-wheel +24 deg drift ("العربية طارت على عجلتين")
  37.65, // S18: L9b — Plowing through exploding crate row ("ومسحت صف الصناديق في زحليقة مجنونة!")
  40.12, // S19: L10a — High-speed hood cam toward glowing glass doors ("السرعة بقت بره السيطرة خالص ناحية البيبان الإزاز،")
  42.91, // S20: L10b — Foyer thaw: nearest 3 shoppers wake at 43.59s ("والوقت بدأ يرجع لطبيعته تدريجي!")
  45.28, // S21: L11 — Mid-air jump off cart at 47.09s ("قبل ما أخبط في الباب بثانية واحدة، نطيت من العربية في الهوا!")
  48.49, // S22: L12a — Seam cut: glass shatter through snow globe dome ("العربية دشدشت الإزاز..")
  50.52, // S23: L12b — Snow-globe full reveal on desk ("عشان نكتشف إن المتجر كله جوه كرة ثلجية عملاقة!")
  53.93, // S24: L13 — Payoff: desk + snow globe + bored real customer & outer queue ("وإحنا مش أكتر من تحفة إزاز على مكتب عميل حقيقي..")
];

// Key narrative event times (seconds)
export const T_PUSH      = 4.28;
export const T_YANK      = 6.43;
export const T_SOUP_HIT  = 16.41;
export const T_HOP_ON    = 23.72;
export const T_GUARD_FALL = 30.60;
export const T_CAP_ROLL  = 32.33;
export const T_SWERVE    = 33.96;
export const T_TWOWHEEL  = 36.15;
export const T_CRATES    = 37.65;
export const T_THAW      = 43.59;
export const T_JUMP_OFF  = 47.09;
export const T_SHATTER   = 48.49;

export const OUTER_X = 400;

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp  = (a, b, k) => a + (b - a) * k;
export const smooth = k => { const u = clamp(k, 0, 1); return u * u * (3 - 2 * u); };

// Piecewise smooth Hermite/smoothstep track evaluator: keys = [[t, val], ...]
function sampleTrack(keys, t) {
  if (t <= keys[0][0]) return keys[0][1];
  const last = keys[keys.length - 1];
  if (t >= last[0]) return last[1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i], [t1, v1] = keys[i + 1];
    if (t <= t1) {
      const u = (t - t0) / Math.max(1e-6, t1 - t0);
      return lerp(v0, v1, smooth(u));
    }
  }
  return last[1];
}

// Continuous linear-blended track for constant-velocity segments (no artificial stop-start at waypoints)
function sampleLinear(keys, t) {
  if (t <= keys[0][0]) return keys[0][1];
  const last = keys[keys.length - 1];
  if (t >= last[0]) return last[1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i], [t1, v1] = keys[i + 1];
    if (t <= t1) return lerp(v0, v1, (t - t0) / Math.max(1e-6, t1 - t0));
  }
  return last[1];
}

// Cart Z trajectory (continuous from z = -22.6 at t=0 to z = +32.0 at t=48.49)
const CART_Z = [
  [0.00,  -22.60],
  [4.28,  -22.60],
  [6.43,  -21.10],
  [9.98,  -17.20],
  [14.27, -10.50],
  [16.41,  -7.60], // hits soup pyramid!
  [18.98,  -5.20],
  [20.84,  -3.60],
  [23.72,  -1.40], // clerk hops onto rear step-bar
  [25.93,   0.40],
  [28.24,   2.10],
  [30.60,   3.20],
  [32.33,   3.70],
  [33.96,   4.45], // guard cap right under front wheel -> hard right swerve!
  [36.15,   7.40], // two-wheel drift enters crate lane
  [37.65,  10.30], // sweeps crate row
  [40.12,  16.20], // high-speed foyer sprint
  [42.91,  20.80],
  [45.28,  24.60],
  [47.09,  27.20], // clerk leaps off!
  [48.49,  32.10], // cart smashes through glass doors!
];

// Cart X trajectory (right swerve = -X when facing +Z; slight right veer at 16.41s to hit endcap soup pyramid at x = +1.15!)
const CART_X = [
  [0.00,   0.00],
  [6.43,   0.00],
  [8.40,  -0.14],
  [11.60,  0.06],
  [14.27,  0.32],
  [16.41,  0.85], // hits soup pyramid base at x = +1.15!
  [19.20,  0.15],
  [23.72,  0.00],
  [28.24, -0.15],
  [32.33, -0.20],
  [33.96, -0.40], // swerve begins
  [36.15, -2.05], // hard right toward crate row (starts z = 10.6)
  [38.80, -2.15],
  [40.12, -1.50],
  [42.91, -0.35],
  [45.28,  0.00],
  [48.49,  0.00],
];

// Cart heading ry (deg, 0 = +Z, negative = turning right toward -X)
const CART_RY = [
  [0.00,    0.0],
  [6.43,    0.0],
  [8.40,   -5.0],
  [11.60,   4.0],
  [16.41,   3.0],
  [23.72,   0.0],
  [32.33,  -3.0],
  [34.30, -34.0], // sharp right crank!
  [36.15, -20.0],
  [37.65,  -8.0],
  [39.80,  14.0], // curving back into foyer center
  [42.50,   6.0],
  [45.28,   0.0],
  [48.49,   0.0],
];

// Cart Z-roll tilt (deg, +24 on two wheels during S17-S18!)
const CART_ROLL = [
  [0.00,   0.0],
  [33.96,  0.0],
  [35.20, 14.0],
  [36.45, 24.0],
  [38.90, 22.0],
  [40.12,  4.0],
  [41.50,  0.0],
  [48.49,  0.0],
];

export function cartState(t) {
  const ct = clamp(t, 0, T_SHATTER);
  const z = sampleLinear(CART_Z, ct);
  const x = sampleTrack(CART_X, ct);
  const ry = sampleTrack(CART_RY, ct);
  const roll = sampleTrack(CART_ROLL, ct);
  const dt = 0.05;
  const z2 = sampleLinear(CART_Z, clamp(ct + dt, 0, T_SHATTER));
  const x2 = sampleTrack(CART_X, clamp(ct + dt, 0, T_SHATTER));
  const speed = Math.hypot(x2 - x, z2 - z) / dt;
  const wheelSpin = (z + 22.6) / 0.115;
  const wobble = ct > T_YANK ? ct : 0;
  // Sparks erupt during broken-wheel yank, screeching ride, swerve & two-wheel drift
  const sparks =
    (ct >= 6.8 && ct <= 9.8) ? 0.65 :
    (ct >= 24.4 && ct <= 28.4) ? 1.25 :
    (ct >= 34.0 && ct <= 39.8) ? 1.15 : 0;
  // Slight lift when leaning 24 deg on two wheels so inner wheels clear ground & outer wheels touch ground
  const y = Math.abs(roll) > 1 ? Math.sin(Math.abs(roll) * Math.PI / 180) * 0.36 : 0;
  return { x, y, z, ry, roll, speed, wheelSpin, wobble, sparks, visible: t < T_SHATTER };
}

// Clerk synchronized position (pushing behind handle until 23.72, standing on step-bar 23.72..47.09, leaping off 47.09..48.49)
export function clerkState(t) {
  if (t >= T_SHATTER) {
    // Parked out of frame in outer world (miniature diorama clerk lives inside snow globe)
    return { x: 0, y: 0, z: 28.4, ry: 0, lean: 0, bend: 0, airborne: false };
  }
  const c = cartState(t);
  const rad = c.ry * Math.PI / 180;
  // Behind cart handle: 1.05 D when walking/running, 0.80 D when standing on rear step-bar
  const riding = t >= T_HOP_ON;
  const jumping = t >= T_JUMP_OFF;

  if (jumping) {
    const u = clamp((t - T_JUMP_OFF) / (T_SHATTER - T_JUMP_OFF), 0, 1);
    const c0 = cartState(T_JUMP_OFF);
    const x0 = c0.x, z0 = c0.z - 0.80;
    const x = lerp(x0, 1.55, smooth(u));
    const z = lerp(z0, 28.6, u);
    // Theatrical airborne arc peaking cleanly at y = 1.45 D around t = 47.72s (full body + face + cart all inside S21!)
    const y = 0.34 * (1 - u) + 1.38 * Math.sin(Math.PI * clamp(u * 1.08, 0, 1));
    const ry = lerp(0, -48, smooth(u));
    return { x, y, z, ry, lean: -16 * Math.sin(Math.PI * u), bend: 20 * Math.sin(Math.PI * u), airborne: true };
  }

  const hopU = clamp((t - T_HOP_ON) / 0.34, 0, 1);
  const backDist = lerp(1.02, 0.78, smooth(hopU));
  const x = c.x - Math.sin(rad) * backDist;
  const z = c.z - Math.cos(rad) * backDist;
  const y = riding ? (c.y + 0.34 + (hopU < 1 ? 0.35 * Math.sin(Math.PI * hopU) : 0)) : 0;

  // Dynamic body lean/bend cues for life & momentum
  let bend = 0;
  if (t >= 4.28 && t < 6.43) bend = 10;          // pushing cart
  else if (t >= 6.43 && t < 14.27) bend = 18;    // yanked / running forward
  else if (t >= 14.27 && t < 16.41) bend = -20;  // braking heels dug in!
  else if (t >= 16.41 && t < 23.72) bend = 12;   // surging past soup collapse
  else if (t >= 23.72 && t < 33.96) bend = 15;   // surfing step-bar
  else if (t >= 33.96 && t < 40.12) bend = 18;   // rally swerve & two-wheel drift
  else if (t >= 40.12) bend = 22;                // full-speed crouch toward glass

  // Counter-lean with two-wheel cart tilt!
  const lean = riding ? -c.roll * 0.78 : 0;
  // Slightly cheated facing in S01/S02 so his face is bright & front-3/4 to camera
  const ry = t < 4.28 ? 6 : c.ry;
  return { x, y, z, ry, lean, bend, airborne: false };
}

// Guard topple state (S13-S15): frozen leaning forward 22 deg on one foot at [0.15, 0, 5.1], topples sideways to 88 deg at T_GUARD_FALL
export function guardFallProgress(t) {
  if (t <= T_GUARD_FALL) return 0;
  return smooth((t - T_GUARD_FALL) / 0.72);
}

// Guard cap rolling trajectory (guard sits at [0.25, 0, 6.2]; cap launches at 31.25s and rolls right in front of wheel_fr by 33.15s!)
export function guardCapState(t) {
  if (t < 31.25) return { visible: false, x: -0.9, y: 0.14, z: 6.2, rx: 0, ry: 0, rz: 0 };
  if (t < 32.33) {
    const u = smooth((t - 31.25) / 1.08);
    return {
      visible: true,
      x: lerp(-1.35, -0.75, u),
      y: 0.14 + 0.35 * Math.sin(Math.PI * u),
      z: lerp(6.20, 5.75, u),
      rx: 90, ry: lerp(15, 75, u), rz: lerp(0, 180, u),
    };
  }
  const u = clamp((t - 32.33) / 1.65, 0, 1);
  // Rolls edge-on straight into the path of red_cart's front-right wheel (cart at z ~ 4.1 -> 4.9)!
  return {
    visible: t < T_SHATTER,
    x: lerp(-0.75, 0.25, smooth(u)),
    y: 0.22, // standing on brim edge while rolling!
    z: lerp(5.75, 5.05, u),
    rx: 88,
    ry: 82,
    rz: 180 + u * 540,
  };
}

// Build dense smooth world-prop keys for red_cart so PROP GUARD sees smooth motion (< 15 px/frame) on every single frame!
export function buildRedCartKeys() {
  const keys = [];
  const step = 0.20;
  for (let t = 0; t <= T_SHATTER - 0.05; t = +(t + step).toFixed(3)) {
    const c = cartState(t);
    keys.push({
      t,
      in: 'world',
      at: [+c.x.toFixed(3), +c.y.toFixed(3), +c.z.toFixed(3)],
      rot: [0, +c.ry.toFixed(2), +c.roll.toFixed(2)],
      pass: 0.10,
      spin: +c.wheelSpin.toFixed(2),
      wobble: +c.wobble.toFixed(2),
      sparks: +c.sparks.toFixed(2),
    });
  }
  // Exact key just before the glass shatter seam cut
  const cEnd = cartState(T_SHATTER - 0.02);
  keys.push({
    t: +(T_SHATTER - 0.02).toFixed(3),
    in: 'world',
    at: [+cEnd.x.toFixed(3), +cEnd.y.toFixed(3), +cEnd.z.toFixed(3)],
    rot: [0, +cEnd.ry.toFixed(2), +cEnd.roll.toFixed(2)],
    pass: 0.01,
  });
  // Hide cleanly on the seam cut at 48.49s (outer world displays red_cart_mini bursting out of the snow globe)
  keys.push({ t: T_SHATTER, in: 'hidden' });
  return keys;
}

// Build smooth world-prop keys for guard_cap (hidden until S14 cut or pop-off, then rolling into S15-S16, hidden on S19 cut)
export function buildGuardCapKeys() {
  const keys = [];
  // Appear on S14 cut (30.60s) tucked at guard's head at z = 6.2
  keys.push({ t: 30.60, in: 'world', at: [0.25, 2.38, 6.20], rot: [0, 0, 0], pass: 0.01 });
  // Follow guard's falling head arc 30.60 -> 31.32
  for (let t = 30.80; t <= 31.30; t = +(t + 0.10).toFixed(2)) {
    const u = guardFallProgress(t);
    const ang = u * 86 * Math.PI / 180;
    const x = 0.25 - Math.sin(ang) * 2.2;
    const y = Math.max(0.18, 0.25 + Math.cos(ang) * 2.15);
    keys.push({ t, in: 'world', at: [+x.toFixed(3), +y.toFixed(3), 6.20], rot: [0, 0, +(u * 85).toFixed(1)], pass: 0.05 });
  }
  // Roll edge-on across aisle in S15-S16 (31.40 -> 34.40)
  for (let t = 31.45; t <= 34.45; t = +(t + 0.15).toFixed(2)) {
    const gc = guardCapState(t);
    keys.push({
      t, in: 'world',
      at: [+gc.x.toFixed(3), +gc.y.toFixed(3), +gc.z.toFixed(3)],
      rot: [+gc.rx.toFixed(1), +gc.ry.toFixed(1), +gc.rz.toFixed(1)],
      pass: 0.075,
    });
  }
  // Hide cleanly on S19 cut (40.12s) well after leaving the aisle
  keys.push({ t: 40.12, in: 'hidden' });
  return keys;
}

// Build dense smooth base tracks for clerk (root.x, root.y, root.z, root.ry, body.bend, body.lean)
export function buildClerkBaseTracks() {
  const rx = [], ryY = [], rz = [], rYaw = [], bend = [], lean = [];
  const step = 0.20;
  for (let t = 0; t <= T_SHATTER; t = +(t + step).toFixed(3)) {
    const s = clerkState(t);
    rx.push([t, +s.x.toFixed(3)]);
    ryY.push([t, +s.y.toFixed(3)]);
    rz.push([t, +s.z.toFixed(3)]);
    rYaw.push([t, +s.ry.toFixed(2)]);
    bend.push([t, +s.bend.toFixed(2)]);
    lean.push([t, +s.lean.toFixed(2)]);
  }
  // Add exact peak of mid-air jump at 47.72s for extra crisp leap silhouette
  const sPeak = clerkState(47.72);
  rx.push([47.72, +sPeak.x.toFixed(3)]);
  ryY.push([47.72, +sPeak.y.toFixed(3)]);
  rz.push([47.72, +sPeak.z.toFixed(3)]);
  rYaw.push([47.72, +sPeak.ry.toFixed(2)]);
  bend.push([47.72, +sPeak.bend.toFixed(2)]);
  lean.push([47.72, +sPeak.lean.toFixed(2)]);

  const sortT = arr => arr.sort((a, b) => a[0] - b[0]);
  return {
    'root.x': sortT(rx),
    'root.y': sortT(ryY),
    'root.z': sortT(rz),
    'root.ry': sortT(rYaw),
    'body.bend': sortT(bend),
    'body.lean': sortT(lean),
  };
}
