// scenes/set.js — Story 5 «المصعد المفتوح» (The Open Elevator) — 4-World Flagship Custom Set (Pass 2 Calibrated)
// Calibrated rich painterly lighting (zero white-out clipping!), deep emerald-gold 1930s Art-Deco Lobby,
// Opus Key-Frame-B Warm/Cool Split Rain Street (warm brass elevator on right, 64 D neon rain street + cars/spray on left!),
// High-contrast Sideways Clockwork Shaft + blazing Roulette Floor Dial, and Deep Velvet-Indigo Open Cosmos + Ringed Planet!
// Also loads optional Blender hero GLBs from assets/set/ (graceful fallback if not yet built).

import { createLightRig } from '../world/look/lights.js';
import { createPost } from '../world/look/post.js';
import { createRigShade } from '../world/look/rigshade.js';
import { createKit } from '../world/look/rigkit.js';
import { readGlb } from '../world/look/glb.js';
import { outline } from '../engine/shade.js';
import {
  LOBBY_X, RAIN_X, SHAFT_X, COSMOS_X,
  T_BTN_PRESS, T_DOOR2_SLAM, T_HEARTBEAT, T_LEAP,
  clamp, lerp, smooth, doorOpen, lobbyFlicker,
  shaftIntensity, shaftOffsetX, cabShake, rouletteAngle, rainCarStates, faridaState,
} from './motion.js';

function mkRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function makeTex(THREE, w, h, draw, repeat = true) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// 1. Rich Glossy Art-Deco Deep Emerald & Antique Ivory Checkered Marble Floor
function marbleFloorTex(THREE) {
  return makeTex(THREE, 512, 512, (g, W, H) => {
    const n = 4, s = W / n;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const dark = (r + c) % 2 === 0;
        g.fillStyle = dark ? '#0f2625' : '#9c8c6e';
        g.fillRect(c * s, r * s, s, s);
        g.strokeStyle = dark ? 'rgba(202, 178, 122, 0.28)' : 'rgba(32, 58, 54, 0.24)';
        g.lineWidth = 2.5;
        g.beginPath();
        g.moveTo(c * s + 10, r * s + s * 0.24);
        g.bezierCurveTo(c * s + s * 0.4, r * s + s * 0.1, c * s + s * 0.65, r * s + s * 0.85, c * s + s - 10, r * s + s * 0.72);
        g.stroke();
        g.fillStyle = dark ? 'rgba(255, 212, 118, 0.08)' : 'rgba(255, 240, 200, 0.16)';
        g.fillRect(c * s + 8, r * s + 8, s - 16, s - 16);
      }
    }
    g.strokeStyle = 'rgba(156, 118, 48, 0.75)';
    g.lineWidth = 5;
    for (let i = 0; i <= n; i++) {
      g.beginPath(); g.moveTo(0, i * s); g.lineTo(W, i * s); g.stroke();
      g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, H); g.stroke();
    }
  });
}

// 2. Art-Deco Coffered Mahogany & Antique Gold Ceiling
function cofferCeilingTex(THREE) {
  return makeTex(THREE, 512, 512, (g, W, H) => {
    g.fillStyle = '#1f120b';
    g.fillRect(0, 0, W, H);
    const n = 2, s = W / n;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      g.fillStyle = '#2d1a10';
      g.fillRect(c * s + 18, r * s + 18, s - 36, s - 36);
      g.strokeStyle = '#997128';
      g.lineWidth = 6;
      g.strokeRect(c * s + 28, r * s + 28, s - 56, s - 56);
      g.fillStyle = '#170e09';
      g.fillRect(c * s + 44, r * s + 44, s - 88, s - 88);
    }
  });
}

// 3. Ornate Art-Deco Antique Bronze Elevator Door Panel
function brassDoorTex(THREE) {
  return makeTex(THREE, 256, 256, (g, W, H) => {
    const gr = g.createLinearGradient(0, 0, W, H);
    gr.addColorStop(0, '#78541c');
    gr.addColorStop(0.5, '#593c12');
    gr.addColorStop(1, '#3b260b');
    g.fillStyle = gr;
    g.fillRect(0, 0, W, H);
    g.fillStyle = '#241509';
    g.fillRect(20, 20, W - 40, H - 40);
    g.strokeStyle = '#c4963c';
    g.lineWidth = 7;
    g.strokeRect(20, 20, W - 40, H - 40);
    // Art-Deco stepped diamond emblem
    g.strokeStyle = '#d9ad4c';
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(W / 2, 42); g.lineTo(W - 42, H / 2); g.lineTo(W / 2, H - 42); g.lineTo(42, H / 2);
    g.closePath(); g.stroke();
    g.beginPath();
    g.moveTo(W / 2, 74); g.lineTo(W - 74, H / 2); g.lineTo(W / 2, H - 74); g.lineTo(74, H / 2);
    g.closePath(); g.stroke();
  }, false);
}

// 4. Mirror-Wet Nocturnal Rain Asphalt with Vivid Neon Reflections
function wetAsphaltTex(THREE) {
  return makeTex(THREE, 512, 512, (g, W, H) => {
    g.fillStyle = '#09101d';
    g.fillRect(0, 0, W, H);
    const rng = mkRng(2026);
    for (let i = 0; i < 72; i++) {
      const x = rng() * W, y = rng() * H, rw = 14 + rng() * 58, rh = 44 + rng() * 165;
      const pick = i % 4;
      g.fillStyle = pick === 0 ? 'rgba(42, 185, 255, 0.22)'
                  : pick === 1 ? 'rgba(255, 168, 52, 0.22)'
                  : pick === 2 ? 'rgba(255, 62, 134, 0.18)'
                  : 'rgba(110, 165, 235, 0.12)';
      g.fillRect(x, y, rw, rh);
    }
    // Crisp wet golden dashed lane markers
    g.fillStyle = 'rgba(235, 200, 102, 0.42)';
    g.fillRect(W * 0.485, 20, W * 0.03, 180);
    g.fillRect(W * 0.485, 280, W * 0.03, 180);
  });
}

// 5. Arabic Neon Sign Texture
function neonSignTex(THREE, text, fg, glow, bg = '#0b1020') {
  return makeTex(THREE, 512, 192, (g, W, H) => {
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);
    g.strokeStyle = glow;
    g.lineWidth = 10;
    g.strokeRect(14, 14, W - 28, H - 28);
    g.strokeStyle = '#ffffff';
    g.lineWidth = 3;
    g.strokeRect(20, 20, W - 40, H - 40);
    g.shadowColor = glow;
    g.shadowBlur = 22;
    g.fillStyle = fg;
    g.font = '900 84px Arial, Tahoma, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(text, W / 2, H / 2 + 4);
  }, false);
}

// 6. Hero Art-Deco Spinning Roulette Floor Dial Texture
function rouletteDialTex(THREE) {
  return makeTex(THREE, 512, 512, (g, W, H) => {
    const cx = W / 2, cy = H / 2, R = W * 0.47;
    g.fillStyle = '#140c06';
    g.fillRect(0, 0, W, H);
    const rg = g.createRadialGradient(cx, cy, 18, cx, cy, R);
    rg.addColorStop(0, '#ffe8b0');
    rg.addColorStop(0.62, '#d8a242');
    rg.addColorStop(0.90, '#966018');
    rg.addColorStop(1, '#3b2008');
    g.fillStyle = rg;
    g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill();

    const labels = ['1', '4', '7', '13', '29', '42', '99', '0', '??', '∞', '★', '19'];
    const n = labels.length;
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2;
      const a1 = ((i + 1) / n) * Math.PI * 2;
      g.fillStyle = i % 2 === 0 ? 'rgba(155, 22, 30, 0.90)' : 'rgba(18, 18, 28, 0.92)';
      g.beginPath();
      g.moveTo(cx, cy);
      g.arc(cx, cy, R * 0.92, a0, a1);
      g.closePath();
      g.fill();

      g.strokeStyle = '#e8c15a';
      g.lineWidth = 4;
      g.beginPath();
      g.moveTo(cx, cy);
      g.lineTo(cx + Math.cos(a0) * R * 0.94, cy + Math.sin(a0) * R * 0.94);
      g.stroke();

      const am = (a0 + a1) / 2;
      g.save();
      g.translate(cx + Math.cos(am) * R * 0.67, cy + Math.sin(am) * R * 0.67);
      g.rotate(am + Math.PI / 2);
      g.fillStyle = labels[i] === '★' ? '#ffe96e' : '#fff4d8';
      g.font = '900 48px Georgia, serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(labels[i], 0, 0);
      g.restore();
    }

    g.strokeStyle = '#eab949';
    g.lineWidth = 10;
    g.beginPath(); g.arc(cx, cy, R * 0.42, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#261308';
    g.beginPath(); g.arc(cx, cy, R * 0.36, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#f0c456';
    g.lineWidth = 6;
    g.beginPath(); g.arc(cx, cy, R * 0.94, 0, Math.PI * 2); g.stroke();
  }, false);
}

// 7. Deep Velvet-Indigo Cosmic Nebula & Crisp Starfield Sky Dome Texture
function cosmosSkyTex(THREE) {
  return makeTex(THREE, 1024, 512, (g, W, H) => {
    const bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0.00, '#030516');
    bg.addColorStop(0.32, '#0b0a2a');
    bg.addColorStop(0.55, '#130e3a');
    bg.addColorStop(0.78, '#0a1230');
    bg.addColorStop(1.00, '#030514');
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);

    // Rich swirling Milky Way turquoise, royal-violet & rose-gold nebulae
    const clouds = [
      [W * 0.22, H * 0.46, 250, 'rgba(32, 168, 212, 0.24)'],
      [W * 0.48, H * 0.44, 300, 'rgba(154, 58, 206, 0.24)'],
      [W * 0.72, H * 0.50, 260, 'rgba(235, 148, 62, 0.20)'],
      [W * 0.86, H * 0.38, 220, 'rgba(48, 192, 224, 0.22)'],
      [W * 0.14, H * 0.62, 210, 'rgba(205, 68, 146, 0.20)'],
      [W * 0.58, H * 0.58, 240, 'rgba(56, 128, 232, 0.20)'],
    ];
    for (const [cx, cy, r, col] of clouds) {
      const rg = g.createRadialGradient(cx, cy, 10, cx, cy, r);
      rg.addColorStop(0, col);
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = rg;
      g.fillRect(cx - r, cy - r, r * 2, r * 2);
    }

    const rng = mkRng(5555);
    for (let i = 0; i < 1800; i++) {
      const x = rng() * W, y = rng() * H;
      const rad = rng() < 0.045 ? (2.2 + rng() * 2.1) : (0.6 + rng() * 1.3);
      const p = rng();
      g.fillStyle = p < 0.55 ? '#ffffff' : p < 0.78 ? '#ffe296' : p < 0.92 ? '#8ce8ff' : '#f2a8ff';
      g.globalAlpha = 0.50 + rng() * 0.50;
      g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
      if (rad > 2.5) {
        g.strokeStyle = g.fillStyle;
        g.lineWidth = 1.3;
        g.beginPath();
        g.moveTo(x - rad * 3.4, y); g.lineTo(x + rad * 3.4, y);
        g.moveTo(x, y - rad * 3.4); g.lineTo(x, y + rad * 3.4);
        g.stroke();
      }
    }
    g.globalAlpha = 1;
  }, false);
}

// 8. Painted Nocturnal Storm Cloud Sky Dome for Rain Street
function rainSkyTex(THREE) {
  return makeTex(THREE, 1024, 512, (g, W, H) => {
    const bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0.0, '#040a1a');
    bg.addColorStop(0.45, '#0b1834');
    bg.addColorStop(0.72, '#14264a');
    bg.addColorStop(1.0, '#081020');
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);
    const rng = mkRng(404);
    for (let i = 0; i < 42; i++) {
      const cx = rng() * W, cy = H * (0.15 + rng() * 0.55), r = 60 + rng() * 130;
      const rg = g.createRadialGradient(cx, cy, 8, cx, cy, r);
      rg.addColorStop(0, i % 3 === 0 ? 'rgba(72, 126, 192, 0.24)' : 'rgba(20, 40, 76, 0.30)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = rg;
      g.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
  }, false);
}

// 9. Backlit Shaft Floor Plaque Texture
function shaftPlaqueTex(THREE, num) {
  return makeTex(THREE, 256, 256, (g, W, H) => {
    g.fillStyle = '#1c120a';
    g.fillRect(0, 0, W, H);
    g.strokeStyle = '#c89638';
    g.lineWidth = 14;
    g.strokeRect(12, 12, W - 24, H - 24);
    g.fillStyle = '#ffd670';
    g.font = '900 124px Georgia, serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(num, W / 2, H / 2 + 8);
  }, false);
}

// ---- CALIBRATED LIGHT RIG DATA (rich painterly pools — ZERO white-out clipping!) ----
const PLACES = {
  lobby: {
    sky: [0.14, 0.12, 0.08],
    ground: [0.06, 0.09, 0.08],
    fog: { color: '#18140d', density: 0.011 },
    ao: { floor: 0, h: 1.8, amt: 0.45 },
    lights: [
      { id: 'lobby_amb',   kind: 'sun',   dir: [0.35, 0.85, 0.40], color: [0.88, 0.72, 0.44], power: 0.42, wrap: 0.30 },
      { id: 'globe_near',  kind: 'point', pos: [0.0, 7.2, 1.5],    color: [1.0, 0.78, 0.34], power: 1.65, fall: 0.12, range: 24, wrap: 0.26, drive: 'flickerA' },
      { id: 'globe_mid',   kind: 'point', pos: [0.0, 7.2, -14.0],  color: [1.0, 0.76, 0.32], power: 1.85, fall: 0.10, range: 28, wrap: 0.26, drive: 'flickerB' },
      { id: 'globe_far',   kind: 'point', pos: [0.0, 7.6, -34.0],  color: [1.0, 0.74, 0.34], power: 2.10, fall: 0.08, range: 34, wrap: 0.28, drive: 'flickerC' },
      { id: 'elev_warm',   kind: 'point', pos: [0.0, 3.8, -5.8],   color: [1.0, 0.68, 0.26], power: 1.25, fall: 0.18, range: 14, wrap: 0.28 },
      { id: 'emerald_rim', kind: 'sun',   dir: [-0.75, 0.22, -0.60], color: [0.18, 0.46, 0.44], power: 0.32, wrap: 0.24 },
    ],
  },

  rain_street: {
    sky: [0.08, 0.15, 0.30],
    ground: [0.04, 0.07, 0.14],
    fog: { color: '#091428', density: 0.011 },
    ao: { floor: 0, h: 1.5, amt: 0.38 },
    lights: [
      { id: 'moon_wash',   kind: 'sun',   dir: [-0.30, 0.78, 0.55], color: [0.46, 0.70, 1.0], power: 0.48, wrap: 0.30 },
      { id: 'cab_warm',    kind: 'point', pos: [RAIN_X + 2.4, 3.4, -1.5], color: [1.0, 0.70, 0.30], power: 1.65, fall: 0.18, range: 14, wrap: 0.28 },
      { id: 'street_l1',   kind: 'point', pos: [RAIN_X - 9.0, 6.2, -10.0], color: [1.0, 0.74, 0.36], power: 2.1, fall: 0.10, range: 26, wrap: 0.28 },
      { id: 'street_r1',   kind: 'point', pos: [RAIN_X + 2.5, 6.2, -20.0], color: [0.34, 0.84, 1.0], power: 2.2, fall: 0.09, range: 28, wrap: 0.28 },
      { id: 'neon_coral',  kind: 'point', pos: [RAIN_X - 9.5, 5.2, -24.0], color: [1.0, 0.28, 0.54], power: 2.2, fall: 0.09, range: 30, wrap: 0.28 },
      { id: 'street_far',  kind: 'point', pos: [RAIN_X - 3.5, 7.0, -44.0], color: [0.58, 0.78, 1.0], power: 2.4, fall: 0.06, range: 40, wrap: 0.28 },
    ],
  },

  sideways_shaft: {
    sky: [0.09, 0.08, 0.12],
    ground: [0.05, 0.04, 0.06],
    fog: { color: '#110d0c', density: 0.015 },
    ao: { floor: 0, h: 1.4, amt: 0.44 },
    lights: [
      { id: 'shaft_amb',   kind: 'sun',   dir: [0.25, 0.80, 0.55], color: [0.54, 0.66, 0.88], power: 0.36, wrap: 0.28 },
      { id: 'swing_bulb',  kind: 'point', pos: [SHAFT_X, 3.5, 0.2], color: [1.0, 0.72, 0.30], power: 1.65, fall: 0.18, range: 14, wrap: 0.28, move: 'swingBulbPos' },
      { id: 'roulette_gl', kind: 'point', pos: [SHAFT_X, 3.2, -1.6], color: [1.0, 0.56, 0.18], power: 1.15, fall: 0.24, range: 10, wrap: 0.26 },
      { id: 'shaft_glow1', kind: 'point', pos: [SHAFT_X - 8, 4.5, -10], color: [1.0, 0.52, 0.18], power: 2.4, fall: 0.08, range: 28, wrap: 0.28, drive: 'shaftFlashA' },
      { id: 'shaft_glow2', kind: 'point', pos: [SHAFT_X + 8, 4.5, -18], color: [0.32, 0.62, 1.0], power: 2.4, fall: 0.08, range: 28, wrap: 0.28, drive: 'shaftFlashB' },
    ],
  },

  cosmos: {
    sky: [0.09, 0.09, 0.24],
    ground: [0.05, 0.07, 0.18],
    fog: { color: '#07071b', density: 0.0032 },
    ao: { floor: -50, h: 1.0, amt: 0.08 },
    lights: [
      { id: 'star_key',    kind: 'sun',   dir: [0.45, 0.68, 0.58],  color: [1.0, 0.90, 0.68], power: 0.54, wrap: 0.34 },
      { id: 'nebula_fill', kind: 'sun',   dir: [-0.65, 0.35, -0.68], color: [0.40, 0.80, 1.0], power: 0.42, wrap: 0.34 },
      { id: 'cab_gold',    kind: 'point', pos: [COSMOS_X + 2.4, 3.3, -1.5], color: [1.0, 0.72, 0.30], power: 1.55, fall: 0.18, range: 16, wrap: 0.28 },
      { id: 'planet_rim',  kind: 'point', pos: [COSMOS_X - 10, 14, -20], color: [0.78, 0.54, 1.0], power: 2.2, fall: 0.06, range: 46, wrap: 0.32 },
      { id: 'flight_glow', kind: 'point', pos: [COSMOS_X - 5, 7, -10], color: [1.0, 0.84, 0.48], power: 1.9, fall: 0.09, range: 32, wrap: 0.32 },
    ],
  },
};

const DRIVERS = {
  flickerA: t => lobbyFlicker(t, 0.0),
  flickerB: t => lobbyFlicker(t, 1.7),
  flickerC: t => lobbyFlicker(t, 3.3),
  swingBulbPos: t => {
    const k = shaftIntensity(t);
    const sw = Math.sin(t * 7.2) * 1.15 * k;
    return [SHAFT_X + sw, 3.55 - Math.abs(sw) * 0.14, 0.15];
  },
  shaftFlashA: t => 0.65 + 0.55 * Math.max(0, Math.sin(t * 14.0)),
  shaftFlashB: t => 0.65 + 0.55 * Math.max(0, Math.cos(t * 11.5)),
};

// ---- Helper: Build an Ornate Art-Deco Antique Brass & Mahogany Elevator Cab + Windowed Doors ----
function buildElevatorCab(THREE, K, place, doorTex, { openBack = false, panoramicBack = false, undercarriage = false } = {}) {
  const cab = new THREE.Group();
  // Deep rich antique materials — zero white-out clipping!
  const brassMat   = K.surface(place, '#8c621f', { gloss: 0.45, spec: 0.32 });
  const brassDark  = K.surface(place, '#4a3210', { gloss: 0.32, spec: 0.22 });
  const mahogMat   = K.surface(place, '#2e140b', { gloss: 0.24, spec: 0.18 });
  const floorMat   = K.surface(place, '#1d120c', { gloss: 0.30, spec: 0.20 });
  const doorMat    = K.surface(place, '#7a541b', { map: doorTex, gloss: 0.35, spec: 0.25 });
  const glowAmber  = new THREE.MeshBasicMaterial({ color: 0xffd570 });
  const trimGold   = K.surface(place, '#b8862d', { gloss: 0.48, spec: 0.35 });

  const W = 4.2, H = 4.6, D = 3.8; // interior z = 0 .. +3.8 (doors at z = 0)

  // Cab floor slab + antique gold threshold lip
  const floor = new THREE.Mesh(new THREE.BoxGeometry(W, 0.22, D), floorMat);
  floor.position.set(0, -0.11, D / 2);
  cab.add(floor);
  const lip = new THREE.Mesh(new THREE.BoxGeometry(W + 0.12, 0.08, 0.28), trimGold);
  lip.position.set(0, -0.02, 0.04);
  cab.add(lip);

  if (undercarriage) {
    const under = new THREE.Mesh(new THREE.BoxGeometry(W * 0.90, 0.36, D * 0.90), brassDark);
    under.position.set(0, -0.38, D / 2);
    cab.add(under);
    for (const cx of [-1.2, 0, 1.2]) {
      const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.024, 3.6 + Math.abs(cx) * 0.6, 8), brassMat);
      cable.position.set(cx, -2.2, D / 2 + (cx === 0 ? 0.2 : -0.2));
      cable.rotation.z = cx * 0.08;
      cab.add(cable);
    }
    const crown = new THREE.Mesh(new THREE.BoxGeometry(W * 0.85, 0.36, D * 0.85), brassMat);
    crown.position.set(0, H + 0.30, D / 2);
    cab.add(crown);
    const topCable = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.8, 8), brassDark);
    topCable.position.set(0, H + 1.8, D / 2);
    cab.add(topCable);
  }

  // Cab ceiling + warm glowing brass Art-Deco dome lamp
  const ceil = new THREE.Mesh(new THREE.BoxGeometry(W + 0.16, 0.26, D + 0.16), mahogMat);
  ceil.position.set(0, H + 0.13, D / 2);
  cab.add(ceil);
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 12, 0, Math.PI * 2, Math.PI * 0.4, Math.PI * 0.6), glowAmber);
  lamp.position.set(0, H - 0.04, D * 0.48);
  cab.add(lamp);

  // Front Art-Deco brass portal frame + side walls
  for (const s of [-1, 1]) {
    const jamb = new THREE.Mesh(new THREE.BoxGeometry(0.52, H + 0.2, 0.40), brassMat);
    jamb.position.set(s * 1.86, H / 2, 0);
    cab.add(jamb);
    const sideLower = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.65, D), mahogMat);
    sideLower.position.set(s * (W / 2), 0.825, D / 2);
    cab.add(sideLower);
    const sideRail = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, D), brassMat);
    sideRail.position.set(s * (W / 2), 1.70, D / 2);
    cab.add(sideRail);
    for (let bz = 0.6; bz <= D - 0.4; bz += 0.90) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.09, H - 1.7, 0.09), brassDark);
      bar.position.set(s * (W / 2), 1.7 + (H - 1.7) / 2, bz);
      cab.add(bar);
    }
  }
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(W + 0.4, 0.58, 0.44), brassMat);
  lintel.position.set(0, H - 0.15, 0);
  cab.add(lintel);

  // Stepped Art-Deco crown moulding on top of portal
  const crownStep1 = new THREE.Mesh(new THREE.BoxGeometry(W * 0.74, 0.22, 0.48), brassDark);
  crownStep1.position.set(0, H + 0.25, 0);
  cab.add(crownStep1);
  const crownStep2 = new THREE.Mesh(new THREE.BoxGeometry(W * 0.48, 0.18, 0.50), trimGold);
  crownStep2.position.set(0, H + 0.44, 0);
  cab.add(crownStep2);

  if (!openBack) {
    const backLower = new THREE.Mesh(new THREE.BoxGeometry(W, 1.45, 0.20), mahogMat);
    backLower.position.set(0, 0.725, D);
    cab.add(backLower);
    const backRail = new THREE.Mesh(new THREE.BoxGeometry(W, 0.12, 0.26), brassMat);
    backRail.position.set(0, 1.50, D);
    cab.add(backRail);
    const xs = panoramicBack ? [-1.45, 0.0, 1.45] : [-1.5, -0.5, 0.5, 1.5];
    for (const bx of xs) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.085, H - 1.5, 0.10), brassDark);
      m.position.set(bx, 1.5 + (H - 1.5) / 2, D);
      cab.add(m);
    }
  }

  // Twin Sliding Art-Deco Windowed Brass Doors (dark antique bronze stiles so Farida reads crisp behind them!)
  function buildWindowedDoor(side) {
    const dg = new THREE.Group();
    const lower = new THREE.Mesh(new THREE.BoxGeometry(1.60, 1.62, 0.14), doorMat);
    lower.position.set(0, 0.81, 0);
    dg.add(lower);
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(1.60, 0.42, 0.14), brassDark);
    topBar.position.set(0, 3.97, 0);
    dg.add(topBar);
    for (const sx of [-0.71, 0.71]) {
      const stile = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.14, 0.14), brassDark);
      stile.position.set(sx, 2.69, 0);
      dg.add(stile);
    }
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(1.24, 2.12),
      new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.10, side: THREE.DoubleSide, depthWrite: false })
    );
    glass.position.set(0, 2.69, 0);
    dg.add(glass);
    // Thin antique gold Art-Deco diamond grille bars
    for (const diag of [-1, 1]) {
      const barTop = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.90, 0.045), trimGold);
      barTop.position.set(diag * 0.26, 3.38, 0);
      barTop.rotation.z = diag * 0.56;
      dg.add(barTop);
      const barBot = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.90, 0.045), trimGold);
      barBot.position.set(diag * 0.26, 1.98, 0);
      barBot.rotation.z = -diag * 0.56;
      dg.add(barBot);
    }
    const pull = new THREE.Mesh(new THREE.CylinderGeometry(0.030, 0.030, 0.52, 8), trimGold);
    pull.position.set(-side * 0.62, 1.50, 0.11);
    dg.add(pull);
    return dg;
  }
  const doorL = buildWindowedDoor(-1);
  const doorR = buildWindowedDoor( 1);
  doorL.position.set(-0.81, 0.0, 0.02);
  doorR.position.set( 0.81, 0.0, 0.02);
  cab.add(doorL, doorR);

  return { cab, doorL, doorR, lamp };
}

export async function buildSet(THREE, scene, opts = {}, kit) {
  const base = kit('plain', { ...opts, noGround: true });
  const group = base.group;
  const rig = createLightRig(THREE, PLACES, DRIVERS);
  const look = opts.post ? createPost(THREE, rig, opts.post) : undefined;
  if (look && opts.post.shade) {
    look.shading = createRigShade(THREE, rig, opts.post.shade);
  }
  const K = createKit(THREE, rig, { shadow: base.uniforms, group });

  const marbleTex  = marbleFloorTex(THREE);   marbleTex.repeat.set(14, 34);
  const ceilingTex = cofferCeilingTex(THREE); ceilingTex.repeat.set(8, 22);
  const doorTex    = brassDoorTex(THREE);
  const asphaltTex = wetAsphaltTex(THREE);    asphaltTex.repeat.set(6, 16);
  const dialTex    = rouletteDialTex(THREE);
  const cosmosTex  = cosmosSkyTex(THREE);
  const rainSky    = rainSkyTex(THREE);

  // =========================================================================
  // PLACE 1: `lobby` @ [0, 0] — Grand Decaying Art-Deco Hotel Atrium + Recursive Lobby
  // =========================================================================
  const lobbyG = new THREE.Group();
  lobbyG.name = 'place_lobby';
  group.add(lobbyG);

  const lobbyDome = new THREE.Mesh(
    new THREE.SphereGeometry(125, 24, 16),
    new THREE.MeshBasicMaterial({ color: 0x100d08, side: THREE.BackSide, depthWrite: true })
  );
  lobbyDome.position.set(LOBBY_X, 0, -16);
  lobbyDome.renderOrder = -10;
  lobbyG.add(lobbyDome);

  const lobbyFloorMat = K.surface('lobby', '#c8beaa', { map: marbleTex, gloss: 0.55, spec: 0.35 });
  const lobbyFloor = new THREE.Mesh(new THREE.PlaneGeometry(30, 78), lobbyFloorMat);
  lobbyFloor.rotation.x = -Math.PI / 2;
  lobbyFloor.position.set(0, 0, -16);
  lobbyG.add(lobbyFloor);

  const lobbyCeilMat = K.surface('lobby', '#8a7662', { map: ceilingTex, gloss: 0.16, spec: 0.10 });
  const lobbyCeil = new THREE.Mesh(new THREE.PlaneGeometry(30, 78), lobbyCeilMat);
  lobbyCeil.rotation.x = Math.PI / 2;
  lobbyCeil.position.set(0, 10.6, -16);
  lobbyG.add(lobbyCeil);

  const wallMat    = K.surface('lobby', '#172926', { gloss: 0.16, spec: 0.10 });
  const mahogMat   = K.surface('lobby', '#2e140b', { gloss: 0.26, spec: 0.18 });
  const brassMat   = K.surface('lobby', '#8e6420', { gloss: 0.44, spec: 0.32 });
  const velvetMat  = K.surface('lobby', '#5a1620', { gloss: 0.12, spec: 0.08 });
  const creamMat   = K.surface('lobby', '#9c8a6c', { gloss: 0.14, spec: 0.08 });

  for (const s of [-1, 1]) {
    const sw = new THREE.Mesh(new THREE.BoxGeometry(0.6, 10.8, 78), wallMat);
    sw.position.set(s * 14.2, 5.4, -16);
    lobbyG.add(sw);
    const wainscot = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.8, 78), mahogMat);
    wainscot.position.set(s * 13.8, 1.4, -16);
    lobbyG.add(wainscot);
  }

  // Far back wall @ z = -52 D with Monumental Grand Staircase & Tall Arched Amber Windows!
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(30, 11, 0.8), wallMat);
  backWall.position.set(0, 5.5, -52.5);
  lobbyG.add(backWall);
  for (let st = 0; st < 9; st++) {
    const stepM = new THREE.Mesh(new THREE.BoxGeometry(10.5 - st * 0.25, 0.42, 0.9), creamMat);
    stepM.position.set(0, 0.21 + st * 0.42, -45.5 - st * 0.65);
    lobbyG.add(stepM);
    const carpet = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.44, 0.92), velvetMat);
    carpet.position.set(0, 0.22 + st * 0.42, -45.5 - st * 0.65);
    lobbyG.add(carpet);
  }
  const winGlowMat = new THREE.MeshBasicMaterial({ color: 0xe6b45a });
  for (const wx of [-8.2, 0.0, 8.2]) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(3.2, 5.8, 0.2), winGlowMat);
    win.position.set(wx, 6.2, -51.9);
    lobbyG.add(win);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(3.5, 6.1, 0.16), brassMat);
    frame.position.set(wx, 6.2, -52.0);
    lobbyG.add(frame);
  }

  // Twin Rows of Fluted Mahogany & Antique-Brass Colonnade Pillars + 14 Flickering Amber Ceiling Globes!
  const lobbyGlobes = [];
  for (let z = 12; z >= -44; z -= 6.5) {
    for (const s of [-1, 1]) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.54, 10.6, 12), mahogMat);
      col.position.set(s * 6.8, 5.3, z);
      lobbyG.add(col);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.48, 1.35), brassMat);
      cap.position.set(s * 6.8, 10.2, z);
      lobbyG.add(cap);
      const baseP = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.65, 1.38), brassMat);
      baseP.position.set(s * 6.8, 0.32, z);
      lobbyG.add(baseP);

      const sMat = new THREE.MeshBasicMaterial({ color: 0xf0be4e });
      const sconce = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), sMat);
      sconce.position.set(s * 6.15, 4.4, z);
      lobbyG.add(sconce);
      lobbyGlobes.push({ mat: sMat, poolMat: null, phase: z * 0.37 + s * 1.4 });
    }

    if (Math.abs(z - (-4.8)) > 2.2) {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.5, 8), brassMat);
      rod.position.set(0, 9.35, z);
      lobbyG.add(rod);
      const gMat = new THREE.MeshBasicMaterial({ color: 0xf6c958 });
      const globe = new THREE.Mesh(new THREE.SphereGeometry(0.54, 16, 12), gMat);
      globe.position.set(0, 7.9, z);
      lobbyG.add(globe);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.60, 0.055, 8, 20), brassMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, 7.9, z);
      lobbyG.add(ring);

      const poolMat = new THREE.MeshBasicMaterial({ color: 0xeeb846, transparent: true, opacity: 0.22, depthWrite: false });
      const pool = new THREE.Mesh(new THREE.CircleGeometry(1.9, 20), poolMat);
      pool.rotation.x = -Math.PI / 2;
      pool.position.set(0, 0.015, z);
      lobbyG.add(pool);
      lobbyGlobes.push({ mat: gMat, poolMat, phase: z * 0.51 });
    }
  }

  // Grand Hotel Dressing (reception desk, velvet armchairs, chandelier anchor)
  const desk = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.45, 5.2), mahogMat);
  desk.position.set(-9.5, 0.725, 0.5);
  lobbyG.add(desk);
  const deskLamp = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 10), new THREE.MeshBasicMaterial({ color: 0x4ad684 }));
  deskLamp.position.set(-9.1, 1.85, 0.5);
  lobbyG.add(deskLamp);

  for (const [fx, fz] of [[-4.8, 3.6], [4.9, 3.2], [-4.8, -14.5], [4.8, -14.5]]) {
    const chair = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.15, 1.25), velvetMat);
    chair.position.set(fx, 0.58, fz);
    lobbyG.add(chair);
    const armBack = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.75, 0.28), velvetMat);
    armBack.position.set(fx, 1.35, fz - 0.48);
    lobbyG.add(armBack);
  }

  // Sculpted Chandelier Anchor in recursive/grand lobby (upgraded by Blender GLB when available!)
  const chandelierAnchor = new THREE.Group();
  chandelierAnchor.position.set(0, 7.6, -18.5);
  lobbyG.add(chandelierAnchor);

  // HERO FREESTANDING ART-DECO BRASS ELEVATOR KIOSK @ z = -4.8 D
  const lobbyCab = buildElevatorCab(THREE, K, 'lobby', doorTex, { openBack: true });
  lobbyCab.cab.rotation.y = Math.PI;
  lobbyCab.cab.position.set(0, 0, -4.8);
  lobbyG.add(lobbyCab.cab);

  const crestAnchor = new THREE.Group();
  crestAnchor.position.set(0, 4.95, -4.60);
  lobbyG.add(crestAnchor);

  // Semicircular Glowing Art-Deco Floor Dial mounted above Lobby Elevator Lintel
  const lobbyDialDisc = new THREE.Mesh(
    new THREE.CircleGeometry(0.92, 24, 0, Math.PI),
    new THREE.MeshBasicMaterial({ color: 0xeec462 })
  );
  lobbyDialDisc.position.set(0, 4.72, -4.52);
  lobbyG.add(lobbyDialDisc);
  const lobbyDialRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.94, 0.085, 8, 24, Math.PI),
    brassMat
  );
  lobbyDialRim.position.set(0, 4.72, -4.50);
  lobbyG.add(lobbyDialRim);
  const lobbyDialNeedle = new THREE.Group();
  lobbyDialNeedle.position.set(0, 4.74, -4.46);
  const needleMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.82, 0.05), new THREE.MeshBasicMaterial({ color: 0xd92222 }));
  needleMesh.position.y = 0.35;
  lobbyDialNeedle.add(needleMesh);
  lobbyG.add(lobbyDialNeedle);

  // 12-Button (4x3) Antique Brass Panel on Right Jamb
  const btnPlate = new THREE.Mesh(new THREE.BoxGeometry(0.56, 1.12, 0.08), brassMat);
  btnPlate.position.set(2.02, 1.65, -4.55);
  lobbyG.add(btnPlate);
  const lobbyButtons = [];
  for (let i = 0; i < 12; i++) {
    const bm = new THREE.MeshBasicMaterial({ color: 0x6b5028 });
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.05, 10), bm);
    btn.rotation.x = Math.PI / 2;
    const col = i % 3, row = Math.floor(i / 3);
    btn.position.set(2.02 + (col - 1) * 0.14, 2.02 - row * 0.23, -4.50);
    lobbyG.add(btn);
    lobbyButtons.push(bm);
  }

  // =========================================================================
  // PLACE 2: `rain_street` @ [400, 0] — Opus Key-Frame-B Warm/Cool Split!
  // Warm Brass Elevator Cab on RIGHT curb [RAIN_X + 2.45, 0, -1.5] angled -64 deg,
  // opening onto 64 D Nocturnal Neon Rain Street stretching straight into -Z along x = RAIN_X - 3.6!
  // =========================================================================
  const rainG = new THREE.Group();
  rainG.name = 'place_rain_street';
  rainG.position.set(RAIN_X, 0, 0);
  group.add(rainG);

  const rainDome = new THREE.Mesh(
    new THREE.SphereGeometry(132, 28, 18),
    new THREE.MeshBasicMaterial({ map: rainSky, side: THREE.BackSide, depthWrite: true })
  );
  rainDome.position.set(-3.0, 0, -24);
  rainDome.renderOrder = -10;
  rainG.add(rainDome);

  // Warm Brass Elevator Cab placed on RIGHT curb [RAIN_X + 1.15, 0, -0.75] rotated +155 deg:
  // OPEN FRONT DOORS face straight toward camera (+Z/-X), cab interior recedes cleanly to +X/-Z (ZERO bars in front of Farida!)
  const rainCab = buildElevatorCab(THREE, K, 'rain_street', doorTex, { openBack: false });
  rainCab.cab.position.set(1.15, 0, -0.75);
  rainCab.cab.rotation.y = 155 * Math.PI / 180;
  rainG.add(rainCab.cab);

  // Raised Wet Stone Sidewalk on right (+X) & Mirror-Wet Asphalt Street stretching 68 D down -Z!
  const curbMat = K.surface('rain_street', '#1c2738', { gloss: 0.55, spec: 0.45 });
  const sidewalkR = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.24, 74), curbMat);
  sidewalkR.position.set(3.2, -0.14, -26);
  rainG.add(sidewalkR);
  const sidewalkL = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.24, 74), curbMat);
  sidewalkL.position.set(-12.6, -0.14, -26);
  rainG.add(sidewalkL);

  const asphaltMat = K.surface('rain_street', '#b8c8dc', { map: asphaltTex, gloss: 0.72, spec: 0.55 });
  const road = new THREE.Mesh(new THREE.PlaneGeometry(14.5, 76), asphaltMat);
  road.rotation.x = -Math.PI / 2;
  road.position.set(-4.6, -0.22, -26.0);
  rainG.add(road);

  // Warm amber spill pool pouring out of the open brass elevator doorway onto the wet right curb!
  const cabSpillMat = new THREE.MeshBasicMaterial({ color: 0xffa83c, transparent: true, opacity: 0.34, depthWrite: false });
  const cabSpill = new THREE.Mesh(new THREE.CircleGeometry(2.6, 20), cabSpillMat);
  cabSpill.rotation.x = -Math.PI / 2;
  cabSpill.position.set(0.65, -0.01, -0.85);
  rainG.add(cabSpill);

  // Receding Nocturnal City Buildings flanking BOTH sides of the 64 D rain street (x = -15.5 and x = +7.5)!
  const bldgMat = K.surface('rain_street', '#101828', { gloss: 0.20, spec: 0.14 });
  const ironMat = K.surface('rain_street', '#161f2e', { gloss: 0.38, spec: 0.28 });
  const rngCity = mkRng(8844);
  for (let bz = -6; bz >= -60; bz -= 8.5) {
    for (const [bx, faceDir] of [[-14.8, 1], [8.0, -1]]) {
      // Leave clear space right around the elevator cab at x = +2.45, z = -1.55!
      if (bx > 0 && bz > -8) continue;
      const h = 12 + rngCity() * 9;
      const b = new THREE.Mesh(new THREE.BoxGeometry(6.5, h, 7.6), bldgMat);
      b.position.set(bx, h / 2 - 0.2, bz);
      rainG.add(b);
      for (let wy = 2.6; wy < h - 1.5; wy += 2.2) {
        for (let wz = -2.2; wz <= 2.2; wz += 2.2) {
          if (rngCity() > 0.30) {
            const wCol = rngCity() > 0.35 ? 0xf6ba54 : 0x56ccf2;
            const wm = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.35), new THREE.MeshBasicMaterial({ color: wCol }));
            wm.position.set(bx + faceDir * 3.28, wy, bz + wz);
            wm.rotation.y = faceDir > 0 ? Math.PI / 2 : -Math.PI / 2;
            rainG.add(wm);
          }
        }
      }
    }

    // Arched Iron Streetlamps marching 56 D down BOTH curbs into the rainy vanishing point!
    for (const [px, armDir] of [[-10.2, 1], [1.6, -1]]) {
      if (px > 0 && bz > -9) continue;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 6.8, 8), ironMat);
      pole.position.set(px, 3.2, bz);
      rainG.add(pole);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.09, 0.09), ironMat);
      arm.position.set(px + armDir * 0.72, 6.5, bz);
      rainG.add(arm);
      const bulbCol = (Math.abs(Math.round(bz)) % 2 === 0) ? 0xffbf52 : 0x62dcff;
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), new THREE.MeshBasicMaterial({ color: bulbCol }));
      bulb.position.set(px + armDir * 1.42, 6.3, bz);
      rainG.add(bulb);
      const refStreak = new THREE.Mesh(
        new THREE.PlaneGeometry(1.2, 5.4),
        new THREE.MeshBasicMaterial({ color: bulbCol, transparent: true, opacity: 0.28, depthWrite: false })
      );
      refStreak.rotation.x = -Math.PI / 2;
      refStreak.position.set(px + armDir * 1.6, -0.19, bz);
      rainG.add(refStreak);
    }
  }

  // Iconic Glowing Arabic Neon Signs overhanging the Rain Street (crystal-clear in S13-S17 background!)
  const neonSpecs = [
    { text: 'ليالي',      fg: '#ff96c2', glow: '#ff2b78', x: -9.8, y: 5.2, z: -13.5, ry:  0.34 },
    { text: 'فندق النيل', fg: '#9ef4ff', glow: '#1cc8ff', x:  2.2, y: 6.2, z: -19.5, ry: -0.34 },
    { text: 'قهوة',       fg: '#ffe48a', glow: '#ff9b1c', x: -9.6, y: 4.8, z: -29.0, ry:  0.26 },
    { text: 'سينما',      fg: '#ff96c2', glow: '#ff2b78', x:  2.0, y: 5.6, z: -37.0, ry: -0.26 },
  ];
  for (const ns of neonSpecs) {
    const tex = neonSignTex(THREE, ns.text, ns.fg, ns.glow);
    const sign = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.55, 0.22), new THREE.MeshBasicMaterial({ map: tex }));
    sign.position.set(ns.x, ns.y, ns.z);
    sign.rotation.y = ns.ry;
    rainG.add(sign);
    const refP = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 5.6),
      new THREE.MeshBasicMaterial({ color: ns.glow, transparent: true, opacity: 0.24, depthWrite: false })
    );
    refP.rotation.x = -Math.PI / 2;
    refP.position.set(ns.x * 0.65 - 1.5, -0.18, ns.z);
    rainG.add(refP);
  }

  // Stylized Cartoon-Outlined Noir Sedans (moving along Z axis so they race cleanly down the street beside Farida!)
  function buildNoirCar(bodyHex, dirZ) {
    const cg = new THREE.Group();
    const carMat   = K.surface('rain_street', bodyHex, { gloss: 0.60, spec: 0.45 });
    const glassMat = new THREE.MeshBasicMaterial({ color: 0x203c5e });
    const wheelMat = new THREE.MeshBasicMaterial({ color: 0x10131a });
    const headMat  = new THREE.MeshBasicMaterial({ color: 0xfff4c8 });
    const tailMat  = new THREE.MeshBasicMaterial({ color: 0xff2626 });

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.92, 4.4), carMat);
    chassis.position.y = 0.76;
    outline(chassis, 0.030);
    cg.add(chassis);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.80, 2.3), carMat);
    cabin.position.set(0, 1.54, -0.2 * dirZ);
    outline(cabin, 0.026);
    cg.add(cabin);
    const win = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.52, 2.05), glassMat);
    win.position.set(0, 1.56, -0.2 * dirZ);
    cg.add(win);
    for (const wx of [-0.95, 0.95]) for (const wz of [-1.35, 1.35]) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.28, 12), wheelMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(wx, 0.42, wz);
      cg.add(w);
    }
    for (const lx of [-0.62, 0.62]) {
      const hl = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), headMat);
      hl.position.set(lx, 0.80, 2.22 * dirZ);
      cg.add(hl);
      const tl = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), tailMat);
      tl.position.set(lx, 0.80, -2.22 * dirZ);
      cg.add(tl);
    }
    const beam = new THREE.Mesh(
      new THREE.ConeGeometry(1.35, 7.2, 14, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xffe8a8, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false })
    );
    beam.rotation.x = dirZ > 0 ? -Math.PI / 2 : Math.PI / 2;
    beam.position.set(0, 0.72, 5.6 * dirZ);
    cg.add(beam);

    // Sculpted 3D Water Spray Fans bursting outward (+X toward sidewalk & up!) from under the tires!
    const sprayGrp = new THREE.Group();
    const sprayMatA = new THREE.MeshBasicMaterial({ color: 0x9ceeff, transparent: true, opacity: 0.74, side: THREE.DoubleSide, depthWrite: false });
    const sprayMatB = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.84, side: THREE.DoubleSide, depthWrite: false });
    for (let i = 0; i < 14; i++) {
      const ang = (i / 13 - 0.5) * 1.45;
      const fin = new THREE.Mesh(new THREE.ConeGeometry(0.24 + (i % 3) * 0.12, 1.75 + (i % 4) * 0.32, 5), i % 2 === 0 ? sprayMatA : sprayMatB);
      fin.position.set(1.15 + (i % 3) * 0.25, 0.82 + Math.cos(ang) * 0.52, -0.4 * dirZ + (i - 7) * 0.24);
      fin.rotation.set(-dirZ * (0.35 + ang * 0.25), 0, -0.52 - (i % 3) * 0.14);
      sprayGrp.add(fin);
    }
    cg.add(sprayGrp);
    return { grp: cg, spray: sprayGrp };
  }
  const car1 = buildNoirCar('#1a2b46',  1);
  const car2 = buildNoirCar('#381c2b', -1);
  const car3 = buildNoirCar('#1e3430',  1);
  rainG.add(car1.grp, car2.grp, car3.grp);

  // Door 2 Slam Spark Burst right at the open brass elevator doorway!
  const slamSparks = new THREE.Group();
  slamSparks.position.set(1.05, 2.25, -0.55);
  slamSparks.rotation.y = -25 * Math.PI / 180;
  const sparkM = new THREE.MeshBasicMaterial({ color: 0xffc84a });
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const sp = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.40, 0.055), sparkM);
    sp.position.set(Math.cos(a) * 0.52, Math.sin(a) * 0.82, 0);
    sp.rotation.z = a - Math.PI / 2;
    slamSparks.add(sp);
  }
  rainG.add(slamSparks);

  // 56 Crisp 3D Falling Diagonal Rain Strips + Pulsing Glowing Puddle Ripples across the street!
  const rainStrips = [];
  const rainStripMat = new THREE.MeshBasicMaterial({ color: 0xbce8ff, transparent: true, opacity: 0.44, depthWrite: false });
  const rngRain = mkRng(2390);
  for (let i = 0; i < 56; i++) {
    const h = 1.5 + rngRain() * 2.1;
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.024, h, 0.024), rainStripMat);
    const rx = -10.5 + rngRain() * 14.0;
    const rz = 4.0 - rngRain() * 26.0;
    const spd = 8.5 + rngRain() * 5.5;
    const y0 = rngRain() * 14;
    strip.rotation.z = 0.14;
    rainG.add(strip);
    rainStrips.push({ mesh: strip, x: rx, z: rz, spd, y0 });
  }
  const puddleRings = [];
  const puddleMat = new THREE.MeshBasicMaterial({ color: 0x72dcff, transparent: true, opacity: 0.36, side: THREE.DoubleSide, depthWrite: false });
  for (let i = 0; i < 12; i++) {
    const pr = new THREE.Mesh(new THREE.RingGeometry(0.32, 0.44, 20), puddleMat);
    pr.rotation.x = -Math.PI / 2;
    const px = -8.5 + (i % 4) * 2.4;
    const pz = -2.2 - Math.floor(i / 4) * 5.2;
    pr.position.set(px, -0.18, pz);
    rainG.add(pr);
    puddleRings.push({ mesh: pr, phase: i * 0.73 });
  }

  // =========================================================================
  // PLACE 3: `sideways_shaft` @ [800, 0] — Shaking Panoramic Cab + Horizontal Shaft + Roulette Dial!
  // =========================================================================
  const shaftG = new THREE.Group();
  shaftG.name = 'place_sideways_shaft';
  shaftG.position.set(SHAFT_X, 0, 0);
  group.add(shaftG);

  const shaftDome = new THREE.Mesh(
    new THREE.SphereGeometry(128, 24, 16),
    new THREE.MeshBasicMaterial({ color: 0x0b090e, side: THREE.BackSide, depthWrite: true })
  );
  shaftDome.renderOrder = -10;
  shaftG.add(shaftDome);

  const shaftCabWrap = new THREE.Group();
  shaftG.add(shaftCabWrap);
  const shaftCab = buildElevatorCab(THREE, K, 'sideways_shaft', doorTex, { panoramicBack: true });
  shaftCab.cab.rotation.y = Math.PI;
  shaftCab.cab.position.set(0, 0, 1.9);
  shaftCab.doorL.visible = false;
  shaftCab.doorR.visible = false;
  shaftCabWrap.add(shaftCab.cab);

  const swingLampGrp = new THREE.Group();
  swingLampGrp.position.set(0, 4.55, 0.15);
  const swingCord = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.05, 8), brassMat);
  swingCord.position.y = -0.52;
  swingLampGrp.add(swingCord);
  const swingShade = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.22, 14), brassMat);
  swingShade.position.y = -1.04;
  swingLampGrp.add(swingShade);
  const swingBulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffda78 }));
  swingBulb.position.y = -1.16;
  swingLampGrp.add(swingBulb);
  shaftCabWrap.add(swingLampGrp);

  // HERO ROULETTE FLOOR DIAL mounted above panoramic rear arch!
  const rouletteGrp = new THREE.Group();
  rouletteGrp.name = 'roulette_dial';
  rouletteGrp.position.set(0, 3.45, -1.78);
  const rouletteFace = new THREE.Mesh(new THREE.CircleGeometry(0.96, 36), new THREE.MeshBasicMaterial({ map: dialTex }));
  rouletteGrp.add(rouletteFace);
  const rouletteBezel = new THREE.Mesh(new THREE.TorusGeometry(0.99, 0.09, 10, 36), brassMat);
  rouletteGrp.add(rouletteBezel);
  const topPin = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.28, 3), new THREE.MeshBasicMaterial({ color: 0xff2b2b }));
  topPin.rotation.z = Math.PI;
  topPin.position.set(0, 0.86, 0.06);
  rouletteGrp.add(topPin);
  const rouletteNeedle = new THREE.Group();
  rouletteNeedle.position.z = 0.05;
  const rPtr = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.78, 0.04), new THREE.MeshBasicMaterial({ color: 0xff3636 }));
  rPtr.position.y = 0.24;
  rouletteNeedle.add(rPtr);
  rouletteGrp.add(rouletteNeedle);
  shaftCabWrap.add(rouletteGrp);

  // Stylized Glowing Heartbeat Pulse Rings over Farida's chest (Line 23!)
  const heartPulseGrp = new THREE.Group();
  heartPulseGrp.position.set(0, 1.55, 0.82);
  const heartRings = [];
  for (let i = 0; i < 3; i++) {
    const hm = new THREE.MeshBasicMaterial({ color: i === 0 ? 0xff4c65 : 0xffbd59, transparent: true, opacity: 0.0, depthWrite: false });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.24, 0.30, 28), hm);
    heartPulseGrp.add(ring);
    heartRings.push({ mesh: ring, mat: hm, idx: i });
  }
  shaftCabWrap.add(heartPulseGrp);

  // Colossal Horizontal Clockwork/Industrial Elevator Shaft
  const shaftTrackGrp = new THREE.Group();
  shaftG.add(shaftTrackGrp);
  const steelMat = K.surface('sideways_shaft', '#1d2432', { gloss: 0.42, spec: 0.32 });
  const rustMat  = K.surface('sideways_shaft', '#462a1d', { gloss: 0.26, spec: 0.18 });
  const shaftBays = [];
  const baySpan = 12.0;
  const plaqueNums = ['12', '07', '42', '∞', '19', '??', '03', '99'];
  for (let i = 0; i < 8; i++) {
    const bay = new THREE.Group();
    bay.position.x = (i - 3.5) * baySpan;
    const beamNear = new THREE.Mesh(new THREE.BoxGeometry(0.95, 18, 0.95), steelMat);
    beamNear.position.set(0, 4.0, -6.2);
    bay.add(beamNear);
    const crossNear = new THREE.Mesh(new THREE.BoxGeometry(baySpan, 0.72, 0.72), rustMat);
    crossNear.position.set(0, 5.8, -6.2);
    bay.add(crossNear);
    const crossLow = new THREE.Mesh(new THREE.BoxGeometry(baySpan, 0.65, 0.72), steelMat);
    crossLow.position.set(0, -1.2, -6.2);
    bay.add(crossLow);

    const plTex = shaftPlaqueTex(THREE, plaqueNums[i % plaqueNums.length]);
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.6, 0.25), new THREE.MeshBasicMaterial({ map: plTex }));
    plaque.position.set(3.2, 2.6, -7.8);
    bay.add(plaque);

    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.40, 12, 10), new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xffa62b : 0x4ac2ff }));
    beacon.position.set(-2.5, 4.2, -7.0);
    bay.add(beacon);

    const beamFar = new THREE.Mesh(new THREE.BoxGeometry(1.3, 22, 1.3), steelMat);
    beamFar.position.set(2.0, 5.0, -19.0);
    bay.add(beamFar);
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 22, 8), rustMat);
    cable.position.set(-4.0, 5.0, -14.0);
    bay.add(cable);

    const streak = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 0.075, 0.075),
      new THREE.MeshBasicMaterial({ color: 0xffb240, transparent: true, opacity: 0.72 })
    );
    streak.position.set(0, 1.2 + (i % 4) * 1.15, -4.6 - (i % 3) * 2.2);
    bay.add(streak);

    shaftTrackGrp.add(bay);
    shaftBays.push({ grp: bay, idx: i });
  }

  // =========================================================================
  // PLACE 4: `cosmos` @ [1200, 0] — Open Floating Brass Cab on RIGHT Third in Infinite Starry Space!
  // =========================================================================
  const cosmosG = new THREE.Group();
  cosmosG.name = 'place_cosmos';
  cosmosG.position.set(COSMOS_X, 0, 0);
  group.add(cosmosG);

  const cosmosDome = new THREE.Mesh(
    new THREE.SphereGeometry(148, 36, 24),
    new THREE.MeshBasicMaterial({ map: cosmosTex, side: THREE.BackSide, depthWrite: true })
  );
  cosmosDome.renderOrder = -10;
  cosmosG.add(cosmosDome);

  // Floating Open Brass Elevator Cab placed at [COSMOS_X + 1.15, 0, -0.75] rotated +155 deg:
  // OPEN FRONT DOORS face straight toward camera (+Z/-X), cab recedes cleanly to +X/-Z so ZERO bars block Farida & 80% of frame is DEEP COSMOS!
  const cosmosCab = buildElevatorCab(THREE, K, 'cosmos', doorTex, { openBack: false, undercarriage: true });
  cosmosCab.cab.name = 'cosmos_cab';
  cosmosCab.cab.position.set(1.15, 0, -0.75);
  cosmosCab.cab.rotation.y = 155 * Math.PI / 180;
  cosmosG.add(cosmosCab.cab);

  // Layered 3D Sculpted Glowing Nebula Clouds across -Z deep space!
  const nebulaSpecs = [
    { x: -16, y: 12,  z: -48, r: 16, col: 0x26b4dc, op: 0.14 },
    { x:  14, y:  9,  z: -56, r: 19, col: 0x9e3ce0, op: 0.14 },
    { x:  -4, y: -12, z: -36, r: 15, col: 0xf09c38, op: 0.12 },
    { x: -24, y: 18,  z: -34, r: 14, col: 0x42c8f0, op: 0.13 },
    { x:   8, y: -8,  z: -28, r: 13, col: 0xe64c98, op: 0.12 },
    { x: -10, y:  4,  z: -68, r: 22, col: 0x5274f0, op: 0.13 },
  ];
  for (const nb of nebulaSpecs) {
    const nm = new THREE.Mesh(
      new THREE.SphereGeometry(nb.r, 18, 14),
      new THREE.MeshBasicMaterial({ color: nb.col, transparent: true, opacity: nb.op, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    nm.scale.set(1.6, 0.72, 1.1);
    nm.position.set(nb.x, nb.y, nb.z);
    cosmosG.add(nm);
  }

  // Majestic Ringed Golden-Cyan Planet looming right behind Farida & the Floating Cab in -Z!
  function buildRingedPlanet(x, y, z, r, bodyCol, ringCol) {
    const pg = new THREE.Group();
    pg.position.set(x, y, z);
    const body = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), new THREE.MeshBasicMaterial({ color: bodyCol }));
    pg.add(body);
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(r * 1.14, 24, 18),
      new THREE.MeshBasicMaterial({ color: ringCol, transparent: true, opacity: 0.18, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    pg.add(halo);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(r * 1.38, r * 2.18, 48),
      new THREE.MeshBasicMaterial({ color: ringCol, transparent: true, opacity: 0.58, side: THREE.DoubleSide, depthWrite: false })
    );
    ring.rotation.set(Math.PI * 0.38, 0.24, -0.28);
    pg.add(ring);
    cosmosG.add(pg);
    return pg;
  }
  const planetHero = buildRingedPlanet(-15, 14, -56, 8.2, 0x325bd4, 0xf6c45a);
  const planetFar  = buildRingedPlanet( 22, 18, -74, 5.8, 0x7a3ed4, 0x56e4ff);

  // 340 Multi-Depth 3D Twinkling Crystal Star Gems (3 scale layers for huge flight parallax!)
  const starGeo = new THREE.OctahedronGeometry(0.18, 0);
  const starPalette = [0xffffff, 0xffe07a, 0x72ecff, 0xf2a6ff, 0xffbe66];
  const starGems = [];
  const rngStars = mkRng(20265);
  for (let i = 0; i < 340; i++) {
    const col = starPalette[i % starPalette.length];
    const sm = new THREE.Mesh(starGeo, new THREE.MeshBasicMaterial({ color: col }));
    let sx, sy, sz;
    do {
      sx = -42 + rngStars() * 78;
      sy = -20 + rngStars() * 54;
      sz = -78 + rngStars() * 94;
    } while (Math.abs(sx - 2.3) < 4.2 && sy > -2.0 && sy < 6.0 && sz > -4.5 && sz < 3.5);
    const sc = 0.35 + rngStars() * 1.40;
    sm.scale.setScalar(sc);
    sm.position.set(sx, sy, sz);
    cosmosG.add(sm);
    starGems.push({ mesh: sm, sc, phase: rngStars() * Math.PI * 2 });
  }

  // 5 Luminous Golden/Cyan Stardust Flight Rings aligned along Farida's Leap & Flight Path (x: +0.5 -> -10, y: 0 -> +11.4, z: -0.7 -> -15.3)!
  const flightRings = [];
  const ringPts = [
    [-1.4, 2.5,  -3.2],
    [-3.4, 5.0,  -6.0],
    [-5.4, 7.2,  -9.0],
    [-7.5, 9.2, -12.0],
    [-9.5, 10.8, -14.8],
  ];
  for (let i = 0; i < ringPts.length; i++) {
    const [rx, ry, rz] = ringPts[i];
    const rg = new THREE.Mesh(
      new THREE.TorusGeometry(2.3 + i * 0.22, 0.045, 10, 42),
      new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xffd86b : 0x62e6ff, transparent: true, opacity: 0.54, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    rg.position.set(rx, ry, rz);
    rg.rotation.set(0.18, 0.42, i * 0.5);
    cosmosG.add(rg);
    flightRings.push(rg);
  }

  // Dissolving Ghost Marble Threshold Floor right outside Farida's brink — crumbles into the starry abyss on L27 (47.82-49.40 s)!
  const vanishFloorGrp = new THREE.Group();
  const vanishTiles = [];
  for (let gx = -3; gx <= 0; gx++) {
    for (let gz = -2; gz <= 1; gz++) {
      const tm = new THREE.MeshBasicMaterial({
        color: (gx + gz) % 2 === 0 ? 0x52c8e0 : 0xf4ce6c,
        transparent: true, opacity: 0.44, depthWrite: false,
      });
      const tile = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.06, 1.12), tm);
      const x0 = -0.3 + gx * 1.22;
      const z0 = -0.6 + gz * 1.22;
      tile.position.set(x0, -0.05, z0);
      vanishFloorGrp.add(tile);
      vanishTiles.push({ mesh: tile, mat: tm, x0, z0, delay: Math.abs(gx) * 0.14 + Math.abs(gz) * 0.10 });
    }
  }
  cosmosG.add(vanishFloorGrp);

  // 22 Luminous Fading Starlight Trail Spheres + Soft Golden Rim Star Halo behind Flying Farida!
  const trailOrbs = [];
  for (let i = 0; i < 22; i++) {
    const u = i / 21;
    const om = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0xffe488 : 0x74e8ff,
      transparent: true, opacity: (1 - u) * 0.80, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.15 * (1 - u * 0.65), 10, 8), om);
    orb.visible = false;
    cosmosG.add(orb);
    trailOrbs.push({ mesh: orb, mat: om, lag: 0.08 + i * 0.075, side: (i % 2 === 0 ? 1 : -1) * (0.24 + u * 0.50) });
  }
  const rimStarHalo = new THREE.Mesh(
    new THREE.SphereGeometry(1.15, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0xffe088, transparent: true, opacity: 0.14, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  rimStarHalo.visible = false;
  cosmosG.add(rimStarHalo);

  // ---- BLENDER HERO GLBs via engine native world/look/glb.js (graceful fallback if missing!) ----
  const mountGlb = async (file, place, targetGrp, matOverrides = {}, withOutline = false) => {
    try {
      const url = new URL(`../assets/set/${file}`, import.meta.url).href;
      const glb = await readGlb(THREE, url);
      if (!glb || !glb.roots?.length) return false;
      const wrap = new THREE.Group();
      for (const root of glb.roots) {
        const rg = new THREE.Group();
        rg.applyMatrix4(root.matrix);
        for (const p of root.prims) {
          let mat = matOverrides[p.material];
          if (!mat) {
            const isEmit = p.emissive && (p.emissive[0] + p.emissive[1] + p.emissive[2]) > 0.25;
            if (isEmit) {
              mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(...(p.color || p.emissive)) });
            } else {
              const colHex = p.color ? ('#' + new THREE.Color(...p.color).getHexString()) : '#8a6220';
              mat = K.surface(place, colHex, { gloss: 0.48, spec: 0.36 });
            }
          }
          const mesh = new THREE.Mesh(p.geometry, mat);
          if (withOutline) outline(mesh, 0.022);
          rg.add(mesh);
        }
        wrap.add(rg);
      }
      targetGrp.add(wrap);
      return true;
    } catch {
      return false;
    }
  };

  const readyPromise = Promise.all([
    mountGlb('elevator_crest.glb', 'lobby', crestAnchor, {
      BrassMain: K.surface('lobby', '#8e6420', { gloss: 0.48, spec: 0.34 }),
      BrassDark: K.surface('lobby', '#48300f', { gloss: 0.34, spec: 0.22 }),
      GoldTrim:  K.surface('lobby', '#c49230', { gloss: 0.54, spec: 0.40 }),
    }),
    mountGlb('lobby_chandelier.glb', 'lobby', chandelierAnchor, {
      ChandBrass: K.surface('lobby', '#966b22', { gloss: 0.50, spec: 0.38 }),
      ChandDark:  K.surface('lobby', '#442c0d', { gloss: 0.32, spec: 0.22 }),
      ChandGlow:  new THREE.MeshBasicMaterial({ color: 0xf8ce62 }),
      ChandCryst: new THREE.MeshBasicMaterial({ color: 0xffeeb8, transparent: true, opacity: 0.88 }),
    }),
    mountGlb('noir_sedan.glb', 'rain_street', car1.grp, {
      NoirBody:   K.surface('rain_street', '#1a2c4a', { gloss: 0.65, spec: 0.52 }),
      ChromeTrim: K.surface('rain_street', '#b8c4d4', { gloss: 0.78, spec: 0.65 }),
      CarGlass:   new THREE.MeshBasicMaterial({ color: 0x2a5480 }),
      TireBlack:  new THREE.MeshBasicMaterial({ color: 0x0e1016 }),
      Whitewall:  new THREE.MeshBasicMaterial({ color: 0xdcd6c4 }),
    }, true).then(loaded => {
      if (loaded) {
        // Hide the primitive box hull on car1 while keeping its blazing headlights, beam cone & 3D water spray!
        for (let ci = 0; ci < 7; ci++) if (car1.grp.children[ci]) car1.grp.children[ci].visible = false;
      }
    }),
  ]);

  // =========================================================================
  // PURE-IN-t MASTER SET UPDATE
  // =========================================================================
  function update(t) {
    rig.update(t);

    // 1. THREE-DOOR METRONOME
    const dOpen = doorOpen(t);
    const slideX = lerp(0.81, 2.28, dOpen);
    lobbyCab.doorL.position.x  = -slideX;
    lobbyCab.doorR.position.x  =  slideX;
    rainCab.doorL.position.x   = -slideX;
    rainCab.doorR.position.x   =  slideX;
    cosmosCab.doorL.position.x = -slideX;
    cosmosCab.doorR.position.x =  slideX;

    // 2. LOBBY FLICKERING YELLOW GLOBES, BUTTON PANEL & DIAL TWITCH
    for (const gl of lobbyGlobes) {
      const f = lobbyFlicker(t, gl.phase);
      gl.mat.color.setRGB(clamp(0.96 * f, 0.24, 1.0), clamp(0.76 * f, 0.16, 0.86), clamp(0.32 * f, 0.06, 0.44));
      if (gl.poolMat) gl.poolMat.opacity = 0.24 * f;
    }
    lobbyDialNeedle.rotation.z = -0.9 + rouletteAngle(t) * 0.8;

    const breath = 0.52 + 0.18 * Math.sin(t * 2.8);
    for (let i = 0; i < lobbyButtons.length; i++) {
      const mashT = 16.25 + i * 0.15;
      if (t >= mashT && t < mashT + 0.28) {
        lobbyButtons[i].color.setHex(0xff3d3d);
      } else if ((i === 0 && t >= T_BTN_PRESS) || t >= mashT) {
        lobbyButtons[i].color.setHex(0xffda56);
      } else {
        lobbyButtons[i].color.setRGB(0.45 * breath, 0.34 * breath, 0.16 * breath);
      }
    }

    // 3. RAIN STREET CARS, 3D WATER SPRAY, RAIN STRIPS, PUDDLE RIPPLES & DOOR SLAM SPARKS
    const cars = rainCarStates(t);
    car1.grp.position.set(cars.car1.x - RAIN_X, -0.22, cars.car1.z);
    car1.spray.visible = cars.car1.splash > 0.02;
    car1.spray.scale.setScalar(0.35 + cars.car1.splash * 0.95);
    car2.grp.position.set(cars.car2.x - RAIN_X, -0.22, cars.car2.z);
    car2.spray.visible = cars.car2.splash > 0.02;
    car3.grp.position.set(cars.car3.x - RAIN_X, -0.22, cars.car3.z);

    for (const rs of rainStrips) {
      const y = ((rs.y0 - t * rs.spd) % 14 + 14) % 14;
      rs.mesh.position.set(rs.x - (14 - y) * 0.14, y, rs.z);
    }
    for (const pr of puddleRings) {
      const u = ((t * 1.45 + pr.phase) % 1.0);
      pr.mesh.scale.setScalar(0.55 + u * 1.15);
    }
    cabSpillMat.opacity = 0.34 * dOpen;

    const slamActive = (t >= T_DOOR2_SLAM + 0.18 && t <= T_DOOR2_SLAM + 0.65);
    slamSparks.visible = slamActive;
    if (slamActive) {
      const u = (t - (T_DOOR2_SLAM + 0.18)) / 0.47;
      slamSparks.scale.setScalar(0.4 + u * 1.45);
      slamSparks.rotation.z = u * 1.2;
    }

    // 4. SIDEWAYS SHAFT VELOCITY, CAB SHAKE/BANK, ROULETTE SPIN & HEARTBEAT PULSE
    const sh = cabShake(t);
    shaftCabWrap.position.set(sh.x, sh.y, 0);
    shaftCabWrap.rotation.z = sh.roll;

    const sk = shaftIntensity(t);
    swingLampGrp.rotation.z = Math.sin(t * 7.2) * 0.56 * sk;

    const rAng = rouletteAngle(t);
    rouletteFace.rotation.z   = -rAng * 0.85;
    rouletteNeedle.rotation.z =  rAng * 1.45;

    const totalSpan = baySpan * shaftBays.length;
    const offX = shaftOffsetX(t);
    for (const b of shaftBays) {
      let x = ((b.idx * baySpan - offX) % totalSpan + totalSpan) % totalSpan - totalSpan * 0.5;
      b.grp.position.x = x;
    }

    const hbOn = (t >= T_HEARTBEAT && t <= 42.50);
    heartPulseGrp.visible = hbOn;
    if (hbOn) {
      const beatPh = ((t - T_HEARTBEAT) * 2.4) % 1.0;
      for (const hr of heartRings) {
        const u = (beatPh + hr.idx * 0.33) % 1.0;
        hr.mesh.scale.setScalar(0.5 + u * 2.6);
        hr.mat.opacity = (1 - u) * 0.68;
      }
    }

    // 5. COSMOS CELESTIAL MOTION, VANISHING FLOOR & STARLIGHT FLIGHT TRAIL
    cosmosCab.cab.position.y = Math.sin(t * 0.9) * 0.12;
    cosmosCab.cab.rotation.z = Math.sin(t * 0.55) * 0.020;
    planetHero.rotation.y = t * 0.03;
    planetFar.rotation.y  = -t * 0.025;
    for (let i = 0; i < flightRings.length; i++) {
      flightRings[i].rotation.z = t * (0.35 + i * 0.08) * (i % 2 === 0 ? 1 : -1);
      flightRings[i].scale.setScalar(0.96 + 0.06 * Math.sin(t * 2.2 + i));
    }
    for (let i = 0; i < starGems.length; i++) {
      const sg = starGems[i];
      sg.mesh.scale.setScalar(sg.sc * (0.72 + 0.38 * Math.sin(t * 3.4 + sg.phase)));
    }

    const vanishVis = (t >= 42.93 && t < 50.10);
    vanishFloorGrp.visible = vanishVis;
    if (vanishVis) {
      for (const vt of vanishTiles) {
        const u = smooth(47.65 + vt.delay, 49.10 + vt.delay, t);
        vt.mesh.position.set(vt.x0, -0.05 - u * 5.8, vt.z0 - u * 1.2);
        vt.mesh.rotation.set(u * 1.6, u * 0.9, u * 1.2);
        vt.mat.opacity = 0.44 * (1 - u);
      }
    }

    const flyingNow = (t >= T_LEAP);
    rimStarHalo.visible = flyingNow;
    if (flyingNow) {
      const fs = faridaState(t);
      rimStarHalo.position.set(fs.x - COSMOS_X - 0.6, fs.y + 2.30, fs.z - 2.4);
      rimStarHalo.scale.setScalar(1.0 + 0.12 * Math.sin(t * 5.0));
      for (const to of trailOrbs) {
        const pt = Math.max(T_LEAP, t - to.lag);
        const ps = faridaState(pt);
        to.mesh.visible = (t - T_LEAP) > to.lag * 0.5;
        to.mesh.position.set(
          ps.x - COSMOS_X + to.side * Math.sin(t * 3.0 + to.lag * 5.0),
          ps.y + 1.35 + Math.cos(t * 2.5 + to.lag * 4.0) * 0.32,
          ps.z - 0.35
        );
      }
    } else {
      for (const to of trailOrbs) to.mesh.visible = false;
    }
  }

  return {
    ...base,
    ready: readyPromise,
    marks: {
      lobby_start: [LOBBY_X, -1.55],
      rain_cab:    [RAIN_X + 1.05, -1.15],
      shaft_cab:   [SHAFT_X, 0.35],
      cosmos_cab:  [COSMOS_X + 1.05, -1.10],
    },
    points: {
      roulette_dial: rouletteGrp,
      cosmos_cab: cosmosCab.cab,
    },
    rig,
    look,
    update,
  };
}
