// scenes/motion.js — Pure-in-t Master Motion Truth for Story 5 «المصعد المفتوح»
// ONE table of times drives the 3-door metronome, Farida's positions/flight, leather_bag PROP GUARD,
// sideways elevator shaft velocity/shake/roll, roulette floor dial spin, passing rain cars & splashes,
// and all 31 shot cuts aligned strictly to owner's words_owner.txt (60.76 s / 1,823 frames @ 30 fps).

export const FPS = 30;
export const DURATION = 60.76;

// 4 Places spaced 400 D apart along X (zero cross-visibility)
export const LOBBY_X  = 0;
export const RAIN_X   = 400;
export const SHAFT_X  = 800;
export const COSMOS_X = 1200;

// Three-door metronome anchor times (from words_owner.txt)
export const T_BTN_PRESS   = 10.43; // بتدوس على الزرار
export const T_DOOR1_OPEN  = 11.35; // الباب بيفتح ببطء (Anchor 1)
export const T_DOOR1_CLOSE = 22.93; // الباب بيقفل
export const T_RAIN_CUT    = 23.90; // وفجأة بيفتح على شارع غرقان في المطر (Anchor 2)
export const T_DOOR2_SLAM  = 33.62; // الباب بيخبط في وشها ويقفل
export const T_SHAFT_CUT   = 35.30; // الأسانسير بيتهز ويتحرك بالعرض
export const T_ROULETTE    = 37.19; // أرقام الأدوار بتلف زي الروليت
export const T_HEARTBEAT   = 40.80; // وقلبها بينط من مكانه
export const T_COSMOS_CUT  = 42.93; // الباب بيفتح تالت مرة (Anchor 3)
export const T_BAG_DROP    = 52.53; // وبتقول لنفسها (sets leather_bag cleanly on cab floor)
export const T_SPEAK_LINE  = 53.78; // ما أنا كده كده مش عارفة أوصل (Farida lip-sync!)
export const T_LEAP        = 55.29; // بتنط (THE FINAL LEAP!)

export const SHOTS_T = [
  0.00,  2.03,  4.97,  7.59, 10.43, 11.35, 12.54, 14.02, 16.25, 18.30,
 19.21, 21.89, 23.90, 26.41, 27.76, 29.84, 31.48, 33.62, 35.30, 37.19,
 39.17, 40.80, 42.93, 45.61, 47.82, 50.20, 52.53, 53.78, 55.29, 57.82,
 59.53,
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

// ---- 1. ELEVATOR DOOR METRONOME (0 = closed, 1 = fully open) ----
export function doorOpen(t) {
  if (t < T_DOOR1_OPEN) {
    if (t >= 0.35 && t <= 1.85) {
      const env = Math.sin(clamp((t - 0.35) / 1.50, 0, 1) * Math.PI);
      return Math.max(0, 0.045 * env * Math.abs(Math.sin(t * 26)));
    }
    return 0;
  }
  if (t < T_DOOR1_CLOSE) return easeInOutCubic((t - T_DOOR1_OPEN) / 1.07);
  if (t < T_RAIN_CUT)    return 1 - easeInOutCubic((t - T_DOOR1_CLOSE) / 0.91);
  if (t < T_DOOR2_SLAM)  return easeOutCubic((t - T_RAIN_CUT) / 0.68);
  if (t < T_SHAFT_CUT) {
    if (t < 33.98) return 1 - easeOutCubic((t - T_DOOR2_SLAM) / 0.36);
    if (t < 34.18) return 0.04 * Math.sin(((t - 33.98) / 0.20) * Math.PI);
    return 0;
  }
  if (t < T_COSMOS_CUT) return 0;
  return easeInOutCubic((t - T_COSMOS_CUT) / 1.55);
}

// ---- 2. LOBBY FLICKERING YELLOW GLOBES DRIVER (pure in t) ----
export function lobbyFlicker(t, phase = 0) {
  // Synchronized 3-frame eerie glitch flash right on L7 (12.54 s "نفس اللوبي")!
  if (t >= 12.50 && t <= 12.78) {
    const f = Math.floor((t - 12.50) * FPS);
    if (f === 1 || f === 2 || f === 5) return 0.22;
    return 1.20;
  }
  const boost = (t >= 7.40 && t <= 10.43) ? 1.0 : 0.42;
  const w1 = Math.sin(t * 17.3 + phase * 3.1);
  const w2 = Math.sin(t * 31.7 + phase * 7.4);
  const dip = (w1 * w2 > 0.38) ? (1 - 0.68 * boost) : 1.0;
  const pulse = 0.90 + 0.10 * Math.sin(t * 3.14 + phase);
  return clamp(dip * pulse, 0.22, 1.18);
}

// ---- 3. SIDEWAYS SHAFT VELOCITY, SHAKE & ROULETTE SPIN ----
export function shaftIntensity(t) {
  if (t < T_SHAFT_CUT || t >= T_COSMOS_CUT) return 0;
  const rampIn = smooth(T_SHAFT_CUT, T_SHAFT_CUT + 0.55, t);
  const brakeOut = 1 - smooth(41.95, 42.58, t);
  return rampIn * brakeOut;
}

export function shaftOffsetX(t) {
  if (t < T_SHAFT_CUT) return 0;
  const dt = clamp(t - T_SHAFT_CUT, 0, T_COSMOS_CUT - T_SHAFT_CUT);
  const cruise = dt * 36.0;
  const brakeDt = Math.max(0, t - 42.0);
  return cruise - brakeDt * brakeDt * 22.0;
}

export function cabShake(t) {
  if (t >= T_DOOR2_SLAM && t <= 34.45) {
    const d = Math.exp(-(t - T_DOOR2_SLAM) * 5.5);
    return {
      x: Math.sin(t * 68) * 0.10 * d,
      y: Math.cos(t * 54) * 0.08 * d,
      roll: Math.sin(t * 42) * 0.07 * d,
    };
  }
  const k = shaftIntensity(t);
  if (k <= 0.001) return { x: 0, y: 0, roll: 0 };
  return {
    x: (Math.sin(t * 29.0) * 0.14 + Math.sin(t * 13.7) * 0.18) * k,
    y: (Math.cos(t * 37.0) * 0.06 + Math.sin(t * 19.3) * 0.05) * k,
    roll: (Math.sin(t * 4.6) * 0.11 + Math.sin(t * 15.2) * 0.04) * k,
  };
}

export function rouletteAngle(t) {
  if (t < T_DOOR1_OPEN) {
    return 0.35 + Math.sin(t * 19.0) * 0.28 * smooth(0.2, 1.8, t) * (1 - smooth(1.8, 2.5, t));
  }
  if (t < T_SHAFT_CUT) return 0.35;
  if (t < T_COSMOS_CUT) {
    const dt = t - T_SHAFT_CUT;
    const overdrive = smooth(T_ROULETTE - 0.15, T_ROULETTE + 0.35, t);
    const brake = 1 - smooth(41.90, 42.58, t);
    return 0.35 + dt * (4.5 + 18.0 * overdrive) * (0.35 + 0.65 * brake);
  }
  return Math.PI * 0.5;
}

// ---- 4. PASSING NOIR CARS & 3D WATER SPRAY IN RAIN STREET ----
// Street runs straight into -Z along x = RAIN_X - 3.8 (left two-thirds of frame!),
// while warm open brass elevator sits on the RIGHT curb at x = RAIN_X + 2.4!
export function rainCarStates(t) {
  // Car 1: rockets along x = RAIN_X - 3.6 from z = -26 -> +14 during S15 (27.6..29.9) kicking up sculpted 3D splash right beside Farida!
  const u1 = (t - 27.45) / 2.45;
  const z1 = lerp(-30, 12, clamp(u1, -0.1, 1.2));
  const splash1 = smooth(27.80, 28.25, t) * (1 - smooth(29.10, 29.75, t));

  // Car 2: distant lane x = RAIN_X - 7.8 heading away (-Z) during S13-S15
  const u2 = (t - 24.10) / 3.40;
  const z2 = lerp(6, -38, clamp(u2, -0.1, 1.2));
  const splash2 = smooth(24.6, 25.3, t) * (1 - smooth(26.5, 27.2, t));

  // Car 3: background lane during S16-S17 (29.8..33.6)
  const u3 = (t - 29.80) / 3.60;
  const z3 = lerp(-36, 10, clamp(u3, -0.1, 1.2));
  const splash3 = smooth(30.4, 31.0, t) * (1 - smooth(32.4, 33.2, t));

  return {
    car1: { x: RAIN_X - 3.6, z: z1, dir:  1, splash: splash1 },
    car2: { x: RAIN_X - 7.8, z: z2, dir: -1, splash: splash2 },
    car3: { x: RAIN_X - 5.2, z: z3, dir:  1, splash: splash3 },
  };
}

// ---- 5. FARIDA'S MASTER WORLD STATE ----
export function faridaState(t) {
  // PLACE 1: LOBBY (0.00 - 23.90 s), elevator portal at z = -4.80
  if (t < T_RAIN_CUT) {
    let x = 0.0, y = 0.0, z = -1.55, ry = 16, bend = 0, lean = 0;

    if (t >= 4.97 && t < 7.59) {
      const k = smooth(5.10, 5.65, t) * (1 - smooth(7.15, 7.55, t));
      lean = 10 * k;
      bend = 5 * k;
    }

    if (t >= 10.10 && t < 11.35) {
      const u = smooth(10.10, 10.52, t);
      x = lerp(0.0, 1.05, u);
      z = lerp(-1.55, -3.65, u);
      ry = lerp(16, 28, u);
    } else if (t >= 11.35 && t < 12.54) {
      const u = smooth(11.35, 12.30, t);
      x = lerp(1.05, 0.38, u);
      z = lerp(-3.65, -3.15, u);
      ry = lerp(28, 18, u);
    } else if (t >= 12.54 && t < 16.25) {
      const u = smooth(12.54, 13.15, t);
      x = lerp(0.38, 0.12, u);
      z = lerp(-3.15, -4.45, u);
      ry = lerp(18, 14, u);
    } else if (t >= 16.25 && t < 18.30) {
      const u = smooth(16.25, 16.65, t);
      x = lerp(0.12, 0.95, u);
      z = lerp(-4.45, -4.75, u);
      ry = lerp(14, 26, u);
      bend = 6 * smooth(16.5, 17.0, t);
    } else if (t >= 18.30 && t < 21.89) {
      const u = smooth(18.30, 18.80, t);
      x = lerp(0.95, 0.08, u);
      z = lerp(-4.75, -4.55, u);
      ry = lerp(26, 12, u);
      bend = 9 * (1 - smooth(19.21, 19.60, t));
    } else if (t >= 21.89) {
      const u = smooth(21.89, 22.85, t);
      x = lerp(0.08, 0.0, u);
      z = lerp(-4.55, -6.15, u);
      ry = lerp(12, 0, u);
    }

    return { x: LOBBY_X + x, y, z, ry, bend, lean, flying: false, place: 'lobby' };
  }

  // PLACE 2: RAIN STREET (23.90 - 35.30 s) — Opus Key-Frame-B Warm/Cool Split!
  // Warm glowing brass elevator cab sits on RIGHT curb [RAIN_X + 2.4, 0, -1.5] opening diagonally toward -X/+Z!
  // 64 D Neon Rain Street stretches straight into -Z along x = RAIN_X - 3.5!
  // Farida faces +Z/-X (ry = -26 deg) toward cameras at +Z looking straight down the 64 D neon rain street!
  if (t < T_SHAFT_CUT) {
    let x = 1.05, y = 0.0, z = -1.15, ry = -26, bend = 0, lean = 0;

    if (t >= 29.84 && t < 31.48) {
      // Leans out across the brass threshold extending her right arm into the cobalt rain!
      const u = smooth(29.84, 30.40, t);
      x = lerp(1.05, 0.45, u);
      z = lerp(-1.15, -0.75, u);
      ry = lerp(-26, -34, u);
      bend = 12 * u;
    } else if (t >= 31.48 && t < T_DOOR2_SLAM) {
      // Beams joyfully and takes one brave step onto the wet threshold!
      const u = smooth(32.35, 33.15, t);
      x = lerp(0.45, 0.18, u);
      z = lerp(-0.75, -0.58, u);
      ry = lerp(-34, -22, u);
      bend = lerp(12, 6, u);
    } else if (t >= T_DOOR2_SLAM) {
      // WHAM! Recoils sharply backward back inside the warm brass cab as doors slam!
      const u = easeOutCubic((t - T_DOOR2_SLAM) / 0.34);
      x = lerp(0.18, 1.55, u);
      z = lerp(-0.58, -1.45, u);
      ry = -28;
      bend = -14 * Math.sin(clamp((t - T_DOOR2_SLAM) / 0.70, 0, 1) * Math.PI);
    }

    return { x: RAIN_X + x, y, z, ry, bend, lean, flying: false, place: 'rain_street' };
  }

  // PLACE 3: SIDEWAYS SHAFT (35.30 - 42.93 s), panoramic cab at [800, 0, 0]
  if (t < T_COSMOS_CUT) {
    const sh = cabShake(t);
    const k = shaftIntensity(t);
    const lean = Math.sin(t * 4.6) * 14 * k;
    const bend = (t >= 39.17 && t < 40.80) ? 8 : 4 * k;
    return {
      x: SHAFT_X + sh.x * 0.8,
      y: Math.max(0, sh.y * 0.5),
      z: 0.35,
      ry: 10 + Math.sin(t * 3.8) * 6 * k,
      bend,
      lean,
      flying: false,
      place: 'sideways_shaft',
    };
  }

  // PLACE 4: COSMOS (42.93 - 60.76 s) — Floating Open Cab on RIGHT third [COSMOS_X + 2.3, 0, -1.5] angled -62 deg!
  // 80%+ of EVERY frame behind & beneath Farida is PURE DEEP VELVET-INDIGO COSMOS, 3D NEBULAE & RINGED PLANET!
  if (t < T_LEAP) {
    let x = 1.05, y = 0.0, z = -1.10, ry = -22, bend = 0, lean = 0;

    if (t >= 45.61 && t < 47.82) {
      const u = smooth(45.8, 47.4, t);
      x = lerp(1.05, 0.55, u);
      z = lerp(-1.10, -0.78, u);
      ry = lerp(-22, -26, u);
    } else if (t >= 47.82 && t < 50.20) {
      // Stands at the literal golden brink as ghost marble tiles crumble away beneath her!
      x = 0.50; z = -0.74; ry = -26;
      bend = 13 * smooth(48.10, 48.80, t) * (1 - smooth(49.70, 50.15, t));
    } else if (t >= 50.20 && t < T_BAG_DROP) {
      // Looks down at leather_bag, then lifts chin up to the blazing cosmos!
      x = 0.56; z = -0.78;
      ry = lerp(-26, -18, smooth(50.3, 51.9, t));
      bend = lerp(7, -6, smooth(51.2, 52.1, t));
    } else if (t >= T_BAG_DROP && t < T_SPEAK_LINE) {
      // Smoothly crouches slightly to set leather_bag onto the golden cab floor, then rises tall & free!
      x = 0.65; z = -0.84; ry = -20;
      const crouch = Math.sin(clamp((t - T_BAG_DROP) / 0.85, 0, 1) * Math.PI);
      bend = 14 * crouch;
      lean = 8 * crouch;
    } else if (t >= T_SPEAK_LINE) {
      // Poised, luminous for her ONLY lip-synced line ("ما أنا كده كده مش عارفة أوصل"), then spring anticipation!
      x = 0.55; z = -0.76; ry = -16;
      const antic = smooth(54.95, 55.28, t);
      bend = 18 * antic;
      y = -0.06 * antic;
    }

    return { x: COSMOS_X + x, y, z, ry, bend, lean, flying: false, place: 'cosmos' };
  }

  // THE FINAL LEAP & ACCELERATING SPIRAL COSMIC FLIGHT! (55.29 -> 60.76 s)
  // Springs off the floating brass threshold outward into -X / +Y / -Z while camera glides ahead on +Z side!
  const ft = t - T_LEAP; // 0 .. 5.47 s
  const u = clamp(ft / 5.47, 0, 1);
  const x = COSMOS_X + 0.55 - 10.5 * Math.pow(u, 1.05) + Math.sin(ft * 1.45) * 1.2 * smooth(0.3, 3.5, ft);
  const y = 0.0 + 11.4 * Math.pow(u, 0.86) + Math.sin(ft * 2.1) * 0.34;
  const z = -0.76 - 14.5 * Math.pow(u, 1.08);
  const ry = lerp(-12, -20, smooth(0.0, 4.5, ft)); // keeps full joyful face cleanly within 20-35 deg of front camera!
  const bend = lerp(22, 13, smooth(0.2, 2.5, ft));
  const lean = Math.sin(ft * 1.45) * 11;

  return { x, y, z, ry, bend, lean, flying: true, place: 'cosmos' };
}

// ---- 6. FARIDA BASE TRACKS ----
export function buildFaridaBaseTracks() {
  const rx = [], ryY = [], rz = [], yaw = [], bend = [], lean = [];
  const step = 0.12;
  const times = new Set();
  for (let t = 0; t <= DURATION; t = +(t + step).toFixed(3)) times.add(t);
  for (const tc of SHOTS_T) {
    if (tc > 0.02) times.add(+(tc - 0.017).toFixed(3));
    times.add(tc);
  }
  times.add(+(DURATION).toFixed(3));
  const sorted = [...times].sort((a, b) => a - b);

  for (const t of sorted) {
    const s = faridaState(t);
    rx.push([t, +s.x.toFixed(3)]);
    ryY.push([t, +s.y.toFixed(3)]);
    rz.push([t, +s.z.toFixed(3)]);
    yaw.push([t, +s.ry.toFixed(1)]);
    bend.push([t, +s.bend.toFixed(1)]);
    lean.push([t, +s.lean.toFixed(1)]);
  }
  return {
    'root.x': rx,
    'root.y': ryY,
    'root.z': rz,
    'root.ry': yaw,
    'body.bend': bend,
    'body.lean': lean,
  };
}

// ---- 7. LEATHER BAG PROP GUARD KEYS ----
// FIX #2: in 'body' space (origin at hips y=1.30), at: [0, 0.44, 0.46] holds suitcase tightly across CHEST, 100% below chin!
export function buildLeatherBagKeys() {
  return [
    { t: 0.00, in: 'hand:L', owner: 'farida', at: [0, 0, 0], rot: [0, 0, 0] },
    { t: T_SHAFT_CUT, in: 'body', owner: 'farida', at: [0.0, 0.44, 0.46], rot: [4, 0, -3] },
    { t: T_COSMOS_CUT, in: 'hand:L', owner: 'farida', at: [0, 0, 0], rot: [0, 0, 0] },
    // Smoothly placed onto the floating brass elevator floor during S27 (52.53 -> 53.20 s)!
    { t: 52.88, in: 'world', at: [COSMOS_X + 1.48, 0.75, -1.28], rot: [0, -24, 0], pass: 0.34 },
  ];
}
