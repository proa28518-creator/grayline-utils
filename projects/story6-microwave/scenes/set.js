// scenes/set.js — Story 6 «الشوكولاتة اللي ساحت» (The Microwave) — 4-World Custom Set
// LAB (x=0): 1945 radar lab with radar_device GLB, kettle, wave_box, animated radar screen, thermometer
// MICRO (x=400): night-blue void, glowing water molecules (shake-able), staging platforms
// SHOW (x=800): showroom stage, curtains, giant_oven + scale GLBs, spotlight
// GRID (x=1200): modern microwave on counter, dark kitchen grid backdrop

import { createLightRig } from '../world/look/lights.js';
import { createPost } from '../world/look/post.js';
import { createRigShade } from '../world/look/rigshade.js';
import { createKit } from '../world/look/rigkit.js';
import { readGlb } from '../world/look/glb.js';
import { outline } from '../engine/shade.js';
import {
FPS, LAB_X, MICRO_X, SHOW_X, GRID_X,
T_MELT, T_RADAR, T_COLD, T_NOHEAT, T_HOW, T_MOCK, T_MOCKLINE, T_SILENT,
T_DAY2, T_POP, T_LAUGH2, T_EGG, T_LEAN, T_BOOM, T_GOT, T_WAVES, T_RUB,
T_INOUT, T_BOX, T_COMPANY, T_TALL, T_340, T_5000, T_TODAY, T_START, END,
clamp, lerp, smooth, easeOutCubic, easeInOutCubic, easeOutExpo,
engineerState, mockerState, popcornState, kettleState, boxBuildState,
cornBagState, wavePhaseState, handRubState, scaleState, tagState,
} from './motion.js';

// PLACES & DRIVERS for light rig — object contract per world/look/lights.js:
// PLACES maps name -> { sky, ground, fog, ao, lights: [{id, kind, dir|pos, color, power, fall, range, wrap, drive}] }
// DRIVERS maps drive name -> function(t) returning a power multiplier (or a pos for move).
const PLACES = {
  lab: {
    // A7 P4: cold-room base (sky/ground/fog cooled, rim up) — the warm key and
    // lamp pools stay warm, reading as pools of warmth in the «أوضة تلج».
    sky: [0.15, 0.17, 0.27],
    ground: [0.10, 0.11, 0.16],
    fog: { color: '#10121c', density: 0.010 },
    ao: { floor: 0, h: 1.8, amt: 0.45 },
    lights: [
      { id: 'lab_key',   kind: 'sun',   dir: [0.40, 0.85, 0.35],  color: [0.95, 0.76, 0.46], power: 0.78, wrap: 0.30 },
      { id: 'lab_lamp1', kind: 'point', pos: [-3.5, 6.4, 1.0],    color: [1.00, 0.78, 0.36], power: 1.90, fall: 0.12, range: 24, wrap: 0.26 },
      // A7 P6: lamp2 dimmed and pulled forward so its pool lands on the
      // bench/foreground, not the cabinet face behind the S09 popcorn shot.
      { id: 'lab_lamp2', kind: 'point', pos: [3.5, 6.4, -1.5],    color: [1.00, 0.76, 0.34], power: 1.35, fall: 0.12, range: 24, wrap: 0.26 },
      { id: 'lab_fill',  kind: 'point', pos: [-5, 3.6, 2.6],      color: [1.00, 0.80, 0.45], power: 1.10, fall: 0.14, range: 15, wrap: 0.30 },
      // A7 P2: radar glow throttled and parked on the screen/cabinet.
      { id: 'lab_radar', kind: 'point', pos: [0.0, 3.4, -7.2],    color: [0.45, 0.95, 0.55], power: 0.55, fall: 0.16, range: 9, wrap: 0.24, drive: 'radarPulse' },
      { id: 'lab_rim',   kind: 'sun',   dir: [-0.70, 0.25, -0.55], color: [0.30, 0.38, 0.72], power: 0.50, wrap: 0.24 },
      // ROUND-3 (R3-10 "next day" cue): a warm morning shaft that exists ONLY
      // in the S08–S09 window (driver-gated) — day 2 reads as a different
      // morning against S04's cold blue room, without touching S04's grade.
      { id: 'lab_morning', kind: 'point', pos: [2.5, 5.5, 3.5],  color: [1.00, 0.85, 0.55], power: 1.00, fall: 0.12, range: 20, wrap: 0.30, drive: 'morning' },
    ],
  },
  micro: {
    sky: [0.03, 0.05, 0.14],
    ground: [0.02, 0.03, 0.08],
    fog: { color: '#060a1e', density: 0.016 },
    ao: { floor: 0, h: 1.8, amt: 0.35 },
    lights: [
      { id: 'mic_key',   kind: 'sun',   dir: [0.30, 0.80, 0.40],  color: [0.45, 0.62, 1.00], power: 0.50, wrap: 0.32 },
      { id: 'mic_glow',  kind: 'point', pos: [0.0, 3.0, 1.5],     color: [0.55, 0.80, 1.00], power: 1.30, fall: 0.10, range: 26, wrap: 0.28, drive: 'microPulse' },
      { id: 'mic_rim',   kind: 'sun',   dir: [-0.65, 0.30, -0.60], color: [0.30, 0.85, 0.90], power: 0.38, wrap: 0.26 },
    ],
  },
  show: {
    sky: [0.15, 0.11, 0.07],
    ground: [0.08, 0.06, 0.05],
    fog: { color: '#0c0805', density: 0.006 },   // R4-9: darker fog kills the translucent band
    ao: { floor: 0, h: 1.8, amt: 0.45 },
    lights: [
      { id: 'show_key',  kind: 'sun',   dir: [0.35, 0.85, 0.40],  color: [0.96, 0.78, 0.48], power: 0.52, wrap: 0.30 },
      { id: 'show_spot', kind: 'point', pos: [-2.0, 7.4, 3.5],    color: [1.00, 0.82, 0.42], power: 1.50, fall: 0.11, range: 26, wrap: 0.26 }, // R4-9: reduced spot power
      { id: 'show_rim',  kind: 'sun',   dir: [-0.70, 0.25, -0.55], color: [0.85, 0.45, 0.30], power: 0.30, wrap: 0.24 },
    ],
  },
  grid: {
    sky: [0.05, 0.07, 0.13],
    ground: [0.03, 0.04, 0.08],
    fog: { color: '#070a16', density: 0.013 },
    ao: { floor: 0, h: 1.8, amt: 0.40 },
    lights: [
      // ROUND-3 (B5, orchestrator-authorised phase-2 residual): grid ambient
      // warmed so the anchor kitchen's FURNITURE reads warm (phase-2 warmed
      // the windows/beacon only; the room still leaned blue-grey). The rim
      // cools down a step so the night-city depth survives in the wide shot.
      { id: 'grid_amb',  kind: 'sun',   dir: [0.30, 0.85, 0.35],  color: [0.62, 0.52, 0.38], power: 0.44, wrap: 0.32 },
      { id: 'grid_mw',   kind: 'point', pos: [0.0, 3.2, 1.0],     color: [1.00, 0.80, 0.45], power: 1.15, fall: 0.13, range: 22, wrap: 0.26, drive: 'mwGlow' },
      { id: 'grid_rim',  kind: 'sun',   dir: [-0.65, 0.25, -0.60], color: [0.36, 0.42, 0.62], power: 0.22, wrap: 0.24 },
    ],
  },
};
const DRIVERS = {
  // A7 P2: flattened, no max(0,·) kink (was 0.80→1.15, back wall swung ±18%).
  radarPulse: t => 0.95 + 0.07 * Math.sin(t * 2.2),
  // A7 P5: ±7% energy shimmer instead of the whole world breathing ±25%.
  microPulse: t => 0.93 + 0.07 * Math.sin(t * 1.7),
  // A7 P1: FROZEN — the microwave beacon holds constant brightness (spec:
  // "consistent brightness"); the old ±18% sine crossed the grid bloom
  // threshold twice per cycle and read as a pulsing halo (flicker F1).
  mwGlow:     t => 1.0,
  // ROUND-3 (R3-10): morning shaft exists only on day 2 (S08–S09 window).
  morning: t => {
    if (t < T_DAY2 || t >= T_EGG) return 0.0;
    if (t < T_POP) return 0.15;
    if (t < T_POP + 0.5) {
      const u = smooth(0, 0.5, t - T_POP);
      return 0.15 + u * 1.15;
    }
    return 0.7;
  },
};

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
  const g = c.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  return t;
}

// LAB TEXTURES
function metalFloorTex(THREE) {
  return makeTex(THREE, 512, 512, (g, W, H) => {
    g.fillStyle = '#5a6672';
    g.fillRect(0, 0, W, H);
    const n = 8, s = W / n;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        g.strokeStyle = '#4a5562';
        g.lineWidth = 2;
        g.strokeRect(c * s, r * s, s, s);
      }
    }
  });
}

function plasterWallTex(THREE) {
  return makeTex(THREE, 512, 512, (g, W, H) => {
    g.fillStyle = '#7d7668';
    g.fillRect(0, 0, W, H);
    const rnd = mkRng(42);
    for (let i = 0; i < 200; i++) {
      g.fillStyle = `rgba(100,95,85,${rnd() * 0.12})`;
      g.fillRect(rnd() * W, rnd() * H, 20 + rnd() * 30, 20 + rnd() * 30);
    }
    g.strokeStyle = '#65604e';
    g.lineWidth = 1.5;
    for (let i = 1; i < 4; i++) {
      g.beginPath();
      g.moveTo(i * W / 4, 0);
      g.lineTo(i * W / 4, H);
      g.stroke();
    }
    g.strokeStyle = '#5a5548';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(0, H * 0.35);
    g.lineTo(W, H * 0.35);
    g.stroke();
  });
}

function radarScreenTex(THREE) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#0a1a1a';
  g.fillRect(0, 0, 512, 512);
  g.strokeStyle = '#1a3a3a';
  g.lineWidth = 2;
  for (let i = 1; i <= 4; i++) {
    g.beginPath();
    g.arc(256, 256, i * 60, 0, Math.PI * 2);
    g.stroke();
  }
  g.beginPath();
  g.moveTo(256, 0); g.lineTo(256, 512);
  g.moveTo(0, 256); g.lineTo(512, 256);
  g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return { tex: t, canvas: c, g };
}

export async function buildSet(THREE, scene, opts = {}, kit) {
// ===== R11 shared helpers =====
const R11_UNIT = new THREE.BoxGeometry(1, 1, 1);
function r11Box(w, h, d, mat, x = 0, y = 0, z = 0) {
const m = new THREE.Mesh(R11_UNIT, mat); m.scale.set(w, h, d); m.position.set(x, y, z); return m;
}
function r11Sine(len, amp, cycles, r, mat, n = 48) {
const pts = [];
for (let i = 0; i <= n; i++) { const u = i / n;
pts.push(new THREE.Vector3(u * len, Math.sin(u * cycles * Math.PI * 2) * amp, 0)); }
return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n, r, 6), mat);
}
const R11_FONT = {
'3': ['11110','00001','00001','01110','00001','00001','11110'],
'4': ['00010','00110','01010','10010','11111','00010','00010'],
'0': ['01110','10001','10011','10101','11001','10001','01110'],
'5': ['11111','10000','11110','00001','00001','10001','01110'],
'K': ['10001','10010','10100','11000','10100','10010','10001'],
'G': ['01110','10001','10000','10111','10001','10001','01111'],
'$': ['00100','01111','10100','01110','00101','11110','00100'],
',': ['00000','00000','00000','00000','00110','00100','01000'],
' ': ['00000','00000','00000','00000','00000','00000','00000'],
};
function r11Text(str, px, mat, x = 0, y = 0, z = 0) {
const g = new THREE.Group(); let cx = 0;
for (const ch of str) { const rows = R11_FONT[ch] || R11_FONT[' '];
for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++)
if (rows[r][c] === '1') g.add(r11Box(px * 0.92, px * 0.92, px * 0.5, mat, cx + c * px, (6 - r) * px, 0));
cx += 6 * px; }
const w = new THREE.Group(); g.position.set(-(cx - px) / 2, -3.5 * px, 0);
w.add(g); w.position.set(x, y, z); return w;
}
// R11-9: engineer headSpace latch. Self-contained — findCastRoots / R6-2 untouched.
let r11HeadAnchor = null;
let r11HeadScanFrames = 0;
const _r11HeadV = new THREE.Vector3();
function r11FindHead() {
if (r11HeadAnchor || r11HeadScanFrames >= 900) return r11HeadAnchor;
r11HeadScanFrames++;
scene.traverse((o) => {
if (r11HeadAnchor) return;
if (/^character\.engineer$/i.test(o.name || '')) {
o.traverse((c) => { if (!r11HeadAnchor && /headspace/i.test(c.name || '')) r11HeadAnchor = c; });
}
});
if (r11HeadAnchor) console.log(`[R11-9] headSpace latched: '${r11HeadAnchor.name}' after ${r11HeadScanFrames} scan(s)`);
return r11HeadAnchor;
}

  const base = kit('plain', { ...opts, noGround: true });
  const group = base.group;
  const rig = createLightRig(THREE, PLACES, DRIVERS);
  const look = opts.post ? createPost(THREE, rig, opts.post) : undefined;
  if (look && opts.post.shade) {
    look.shading = createRigShade(THREE, rig, opts.post.shade);
  }
  const K = createKit(THREE, rig, { shadow: base.uniforms, group });

  // ========== LAB WORLD (x=0) ==========
  const labGrp = new THREE.Group();
  labGrp.name = 'place_lab';
  labGrp.position.x = LAB_X;
  group.add(labGrp);

  // Floor
  const floorMat = K.surface('lab', '#5a6672', { gloss: 0.32, spec: 0.24 });
  floorMat.map = metalFloorTex(THREE);
  floorMat.map.repeat.set(4, 4);
  const floor = new THREE.Mesh(new THREE.BoxGeometry(30, 0.2, 20), floorMat);
  floor.position.set(0, -0.1, 0);
  labGrp.add(floor);

  // Back wall with radar screen
  const wallMat = K.surface('lab', '#7d7668', { gloss: 0.18, spec: 0.12 });
  wallMat.map = plasterWallTex(THREE);
  wallMat.map.repeat.set(3, 2);
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(30, 10, 0.4), wallMat);
  backWall.position.set(0, 5, -8);
  labGrp.add(backWall);

  // Radar screen (animated) — position (-0.6, 6.1, -7.55), size 4.4 x 4.4
  // (A31-L7: comment corrected to the code's actual values)
  const screenData = radarScreenTex(THREE);
  const screenMat = new THREE.MeshBasicMaterial({ map: screenData.tex });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 4.4), screenMat);
  screen.position.set(-0.6, 6.1, -7.55);
  labGrp.add(screen);

  // Side walls
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 10, 20), wallMat.clone());
  leftWall.position.set(-15, 5, 0);
  labGrp.add(leftWall);
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 10, 20), wallMat.clone());
  rightWall.position.set(15, 5, 0);
  labGrp.add(rightWall);

  // UNIFIED device table: spanning x -8..-2 at z -4, under radarAnchor and kettleAnchor
  // ROUND-5: legs made VISIBLE (taller cylinders reaching floor, darker material)
  const tableMat = K.surface('lab', '#707880', { gloss: 0.4, spec: 0.3 });
  const table1 = new THREE.Mesh(new THREE.BoxGeometry(6, 0.1, 2), tableMat);
  table1.position.set(-5, 1.25, -4);
  labGrp.add(table1);
  
  const legMat = K.surface('lab', '#4a5058', { gloss: 0.35, spec: 0.25 });
  const tableLeg1a = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.25), legMat);
  tableLeg1a.position.set(-7.7, 0.625, -4.8);
  labGrp.add(tableLeg1a);
  const tableLeg1b = tableLeg1a.clone();
  tableLeg1b.position.set(-2.3, 0.625, -4.8);
  labGrp.add(tableLeg1b);
  const tableLeg1c = tableLeg1a.clone();
  tableLeg1c.position.set(-7.7, 0.625, -3.2);
  labGrp.add(tableLeg1c);
  const tableLeg1d = tableLeg1a.clone();
  tableLeg1d.position.set(-2.3, 0.625, -3.2);
  labGrp.add(tableLeg1d);

  // Brass edge strip on front top edge of device table
  const brassEdge = new THREE.Mesh(new THREE.BoxGeometry(6, 0.03, 0.02), K.surface('lab', '#d69e47', { gloss: 0.6, spec: 0.45 }));
  brassEdge.position.set(-5, 1.305, -3.0);
  labGrp.add(brassEdge);

  const table2 = new THREE.Mesh(new THREE.BoxGeometry(6, 0.1, 1.8), tableMat);
  table2.position.set(5, 1.25, -5);
  labGrp.add(table2);
  const tableLeg2a = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.25), tableMat);
  tableLeg2a.position.set(2.5, 0.625, -5.7);
  labGrp.add(tableLeg2a);
  const tableLeg2b = tableLeg2a.clone();
  tableLeg2b.position.set(7.5, 0.625, -5.7);
  labGrp.add(tableLeg2b);
  const tableLeg2c = tableLeg2a.clone();
  tableLeg2c.position.set(2.5, 0.625, -4.3);
  labGrp.add(tableLeg2c);
  const tableLeg2d = tableLeg2a.clone();
  tableLeg2d.position.set(7.5, 0.625, -4.3);
  labGrp.add(tableLeg2d);

// R6-6: bench CONTACT geometry + the day-2 morning cue. table1's legs already
// span 0..1.25 onto floor top y=0, but they sit at the corners (x -7.7 / -2.3)
// and were out of frame, so the slab read as floating. These pads sit exactly
// under the footprint and each leg; the hero pad follows engineerState.
const contactTex = makeTex(THREE, 128, 128, (g, W, H) => {
  const grad = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
  grad.addColorStop(0, 'rgba(0,0,0,0.85)');
  grad.addColorStop(0.55, 'rgba(0,0,0,0.45)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);
}, false);
const contactMat = new THREE.MeshBasicMaterial({ map: contactTex, color: 0x05060a, transparent: true, opacity: 0.7, depthWrite: false });
const benchContact = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 2.6), contactMat);
benchContact.rotation.x = -Math.PI * 0.5;
benchContact.position.set(-5, 0.012, -4);
benchContact.renderOrder = 1;
labGrp.add(benchContact);
for (const [lx, lz] of [[-7.7, -4.8], [-2.3, -4.8], [-7.7, -3.2], [-2.3, -3.2]]) {
  const pad = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), contactMat);
  pad.rotation.x = -Math.PI * 0.5;
  pad.position.set(lx, 0.016, lz);
  pad.renderOrder = 1;
  labGrp.add(pad);
}
const heroContact = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.7), contactMat);
heroContact.rotation.x = -Math.PI * 0.5;
heroContact.position.set(-5, 0.018, -1.55);
heroContact.renderOrder = 1;
labGrp.add(heroContact);
// Day-2 morning shaft: warm patch on the bench + wall wash, both inside the new
// S08 frame. The wall clock (3.6,5.4,-7.66) is 9.8 east of the engineer and cannot
// share a medium frame honestly — this is the visible "next morning" cue.
const morningGrp = new THREE.Group();
labGrp.add(morningGrp);
const morningMat = new THREE.MeshBasicMaterial({ color: 0xffcf8a, transparent: true, opacity: 0, depthWrite: false });
const morningBench = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.4), morningMat);
morningBench.rotation.x = -Math.PI * 0.5;
morningBench.position.set(-6.6, 1.315, -4.2);
morningGrp.add(morningBench);
const morningWall = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.8), morningMat);
morningWall.position.set(-6.6, 2.6, -7.74);
morningGrp.add(morningWall);
morningGrp.visible = false;
  // Radar device anchor (GLB or fallback) — UNIFIED STAGE
  const radarAnchor = new THREE.Group();
  radarAnchor.position.set(-5, 1.3, -4);
  radarAnchor.rotation.y = Math.PI * 0.5;
  labGrp.add(radarAnchor);

  // Kettle anchor — UNIFIED STAGE
  const kettleAnchor = new THREE.Group();
  kettleAnchor.position.set(-3, 1.3, -4);
  labGrp.add(kettleAnchor);

  // Wave box anchor (built in lab at T_BOX)
  const waveBoxAnchor = new THREE.Group();
  waveBoxAnchor.position.set(5, 1.3, -5);
  labGrp.add(waveBoxAnchor);

  // Wave box spec-scale mount — GOVERNING spec (gemini_task_output S16/S17):
  // ≈0.92 wide × 0.66 tall × 0.66 deep sitting ON the bench (spec S16:
  // 0.9 × 0.65 × 0.65; checklist cap ≤ 1.0 wide × 0.7 tall). GLB native bbox is
  // 1.608 × 1.270 × 1.290, so the mount carries the per-axis factors:
  // x 0.5721, y 0.5197, z 0.5116. The anchor itself stays unscaled:
  // update() drives anchor.scale with boxBuildState.
  const waveBoxMount = new THREE.Group();
  waveBoxMount.scale.set(0.92 / 1.608, 0.66 / 1.270, 0.66 / 1.290);
  waveBoxAnchor.add(waveBoxMount);

  // ========== LAB DRESSING ANCHORS (Blender GLBs — rebuild prep) ==========
  // Kettle bench = table1 (top y=1.30, x -8..-2, z -5..-3); wave bench = table2
  // (top y=1.30, x 2..8, z -5.9..-4.1); back wall front face z=-7.8.
  // All placements keep clear of: hero (-5,-1.55), kettle (-3,1.3,-4),
  // radar screen (-0.6,6.1,-7.55, spans x -2.8..1.6 / y 3.9..8.3), cabinet x -7.3..-2.7.
  const oscScopeAnchor = new THREE.Group();
  oscScopeAnchor.position.set(-7.3, 1.3, -4.4);
  oscScopeAnchor.rotation.y = 0.15;
  labGrp.add(oscScopeAnchor);

  const papersAnchor = new THREE.Group();
  // ROUND-3 (phase-2 collateral): was (-6.35, 1.3, -3.5) — INSIDE the radar
  // plinth footprint (world x -6.5..-4.3, z -6.6..-1.4, y 1.3..1.8), hence
  // invisible. Moved to the bench's west front corner, clear of the plinth
  // (x < -6.5) and beside the osc_scope.
  papersAnchor.position.set(-7.5, 1.3, -3.35);
  papersAnchor.rotation.y = 0.3;
  labGrp.add(papersAnchor);

  const mugAnchor = new THREE.Group();
  mugAnchor.position.set(-2.3, 1.3, -3.35);
  labGrp.add(mugAnchor);

  const popcornAnchor = new THREE.Group();
  popcornAnchor.position.set(-3.85, 1.3, -3.45);
  labGrp.add(popcornAnchor);
// R11-1 corn bag — primitives. Burlap sack + folded top + geometry corn-cob icon;
// kernels stay hidden pre-T_POP per R4-4. Placed spot (-6.75,0,-2.86): east edge
// -6.58 clears the plinth (x >= -6.5) by 0.08; z -2.86 south of the slab (-3.0).
const bagGrp = new THREE.Group(); bagGrp.name = 'r11_cornbag'; labGrp.add(bagGrp);
{
const burlap = K.surface('lab', '#c9a35a', { gloss: 0.15, spec: 0.1 });
const foldM  = K.surface('lab', '#b08a44', { gloss: 0.15, spec: 0.1 });
bagGrp.add(r11Box(0.34, 0.42, 0.22, burlap, 0, 0.21, 0));
const fold = r11Box(0.36, 0.09, 0.24, foldM, 0, 0.455, 0); fold.rotation.z = 0.06; bagGrp.add(fold);
const cob = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.12, 8),
new THREE.MeshBasicMaterial({ color: 0xf2c94c }));
cob.position.set(0, 0.24, 0.115); bagGrp.add(cob);
const husk = K.surface('lab', '#5d8f3e', { gloss: 0.2, spec: 0.1 });
const h1 = r11Box(0.03, 0.09, 0.02, husk, -0.05, 0.17, 0.118); h1.rotation.z = 0.5;
const h2 = r11Box(0.03, 0.09, 0.02, husk,  0.05, 0.17, 0.118); h2.rotation.z = -0.5;
bagGrp.add(h1, h2);
}
const bagShadow = new THREE.Mesh(new THREE.CircleGeometry(0.24, 20),
new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28 }));
bagShadow.rotation.x = -Math.PI / 2; bagShadow.position.set(LAB_X - 6.75, 0.005, -2.86);
labGrp.add(bagShadow);
bagGrp.visible = false; bagShadow.visible = false;


  // Popcorn eruption plume (S09) — cartoon kernels driven by popcornState(t).
  // Spec: kernels 0.12–0.18 units, dense vertical fountain 1.5–2.2 units tall
  // along the frame centerline above the bowl, 3–5 hero kernels arcing toward
  // the lens. Kernels rest in the bowl while heating (state <= 0.3) and erupt
  // as the burst drives the state 0.3 -> 1.
  const plumeGrp = new THREE.Group();
  plumeGrp.position.set(-3.85, 1.58, -3.45); // just inside the bowl's kernel heap
  labGrp.add(plumeGrp);
  const kernelMats = [
    // ROUND-3 (R3-3): MATTE warm-white — the old near-white glossy pair blew
    // out under the lamp pool + bloom and read as glowing orbs (A32 class C).
    K.surface('lab', '#f7e7bd', { gloss: 0.12, spec: 0.06 }),
    K.surface('lab', '#efd488', { gloss: 0.15, spec: 0.08 }),
  ];
  const kernelGeo = new THREE.IcosahedronGeometry(1, 1);
const plumeKernels = [];
{
const krnd = mkRng(7);
for (let i = 0; i < 26; i++) {
// D4 / Neon item 7: three-band cone rising FROM the bowl rim (world y 1.56;
// plumeGrp sits at 1.58, so local y 0 IS the rim). Base collar stays low and
// tight, mid fills the column, apex + hero kernels arc toward the lens — the
// eruption is continuous from the bowl instead of a detached hovering cloud.
const band = i < 10 ? 0 : i < 20 ? 1 : 2;
const rad = band === 0 ? 0.04 + krnd() * 0.18
: band === 1 ? 0.10 + krnd() * 0.24
: 0.12 + krnd() * 0.28;
const peak = band === 0 ? 0.18 + krnd() * 0.37
: band === 1 ? 0.55 + krnd() * 0.40
: 0.95 + krnd() * 0.30;
const dia = band === 0 ? 0.10 + krnd() * 0.04
: band === 1 ? 0.11 + krnd() * 0.04
: 0.12 + krnd() * 0.03;
const heroZ = band === 2 ? 0.35 + krnd() * 0.20 : krnd() * 0.15;
const m = new THREE.Mesh(kernelGeo, kernelMats[i % 2]);
m.userData = {
ang: krnd() * Math.PI * 2,
rad,
peak,
dia,
squash: 0.78 + krnd() * 0.2,
heroZ,
spin: 1.5 + krnd() * 2.5,
// Uniformly distributed bob phases desynchronise the kernels within the
// keep-listed R4-4 arc envelope (no per-kernel launch delay is introduced).
phase: (i / 26) * Math.PI * 2 + krnd() * 0.35,
};
m.visible = false;
plumeGrp.add(m);
plumeKernels.push(m);
}
}

  const eggAnchor = new THREE.Group();
  // ROUND-3: moved west behind the kettle ((-3.55, 1.3, -4.5)) — its old spot
  // (-2.5, -4.55) is inside the signal-generator/panel strip and inside the
  // charcoal panel's slab. This is the BENCH DRESSING egg: update() hides it
  // from T_EGG to the end of the film (R3-4 / F27).
  eggAnchor.position.set(-3.55, 1.3, -4.5);
  eggAnchor.rotation.y = -0.3;
  labGrp.add(eggAnchor);

  // ROUND-3 (R3-9): the food cross-section NO LONGER sits on this bench —
  // it is re-staged in the micro world's dark void (see foodVoidAnchor in
  // the MICRO section). The bench spot it vacated stays empty.

  // PHASE-2 Step 6b: magnetron feed — the GLB is authored in lab coordinates
  // (junction on the radar cabinet face -> waveguide run -> drop above the
  // wave box), so the anchor sits at the lab origin with no transform.
  const feedAnchor = new THREE.Group();
  labGrp.add(feedAnchor);

  const deskLampAnchor = new THREE.Group();
  deskLampAnchor.position.set(6.9, 1.3, -5.2);
  deskLampAnchor.rotation.y = -0.2;
  labGrp.add(deskLampAnchor);

  // A8 audit Z5: wall fixtures were sunk into the back wall face (z=-7.8) —
  // nudged +z so they sit proud of the wall (no coplanar/z-fighting backs).
  const toolRackAnchor = new THREE.Group();
  toolRackAnchor.position.set(7.6, 3.1, -7.68);
  labGrp.add(toolRackAnchor);

  const shelfAnchor = new THREE.Group();
  shelfAnchor.position.set(-11.6, 3.3, -7.52);
  labGrp.add(shelfAnchor);

  const clockAnchor = new THREE.Group();
  clockAnchor.position.set(3.6, 5.4, -7.66);
  labGrp.add(clockAnchor);

  const spoolAnchor = new THREE.Group();
  spoolAnchor.position.set(-12.4, 0, -6.4);
  spoolAnchor.rotation.y = 0.5;
  labGrp.add(spoolAnchor);

  const stoolAnchor = new THREE.Group();
  stoolAnchor.position.set(-8, 0, -2);
  stoolAnchor.rotation.y = 0.4;
  labGrp.add(stoolAnchor);

  // Pocket chocolate prop group — ROUND-4 (F5): TRACKS the engineer's chest
  // through the S01 dolly-out (and S21 mirror) instead of sitting at a fixed
  // world position. The mount follows engineerState(t) root + a chest-height
  // offset (y +1.97 from floor) + forward offset along his facing (z +0.37
  // from root, the pocket depth). Initial world position (-4.68, 1.97, -1.18)
  // stays the reference point at t=0.18 when hero is at (-5, 0, -1.55) face 17°.
const pocketChocolate = new THREE.Group();
labGrp.add(pocketChocolate);
pocketChocolate.rotation.order = 'YXZ'; // yaw outer, pocket tilt about the wearer's own X
// R8-1: seat TRIANGULATED from the two measured dash projections (A70 stills),
// not from a coat-axis model. S01 keys @0.80/@1.30 give the planes
//   n = r - k*d,  k = (2*nx-1)*tan(fov/2)*0.5625
//   0.80: n=(0.918119,0.000130,-0.396630)   1.30: n=(0.989064,0.002251,-0.154759)
// whose intersection is a VERTICAL line at (x,z)=(-4.7531,-1.3681) +-0.003 over
// y in [1.4,2.1]. r.y = 0 in both views, so the horizontal seat is independent of
// height. Relative to root (-5,-1.55), face 17: dash = f*0.2453 + l*0.1833.
// The bar's own triangulation (-5.0136,-1.5064) puts the 'torso' anchor at
// f*0.0678 + l*0.0342, so the seat FROM TORSO is f*0.1776 + l*0.1491.
//   -> POCKET_FORWARD 0.19 (0.1776 + 0.013 proud of the painted coat face)
//   -> POCKET_LATERAL 0.149 (wearer's LEFT; screen-right for the S01/S21 camera)
//   -> POCKET_DROP    0.693 — R10: re-derived from CROP-MEASURED inputs only
//      (A75 §3: mouth ny in A75 vs the dash band measured in the matched EMPTY
//      A73 crops; coat static, camera unchanged, so the two are comparable).
//      R9's METHOD was right but two inputs were eyeballed (mouth 0.245 vs the
//      crop-measured 0.271; dash centre 0.53 vs 0.539) — both errors pushed the
//      drop UP, which is the A75 overshoot.
//      Sensitivities dny/dY = -0.5*(V'H - VH')/H^2 from the R9 linear relations,
//      evaluated at each key's dash solution:
//        @0.80 : -0.93187  -> 0.010731 world per 0.01 ny
//        @1.30 : -0.45022  -> 0.022212 world per 0.01 ny   (A75 §3 quoted 0.0105
//                             here — that is the 0.80 value; corrected)
//        @54.80: -0.72791  -> 0.013738 world per 0.01 ny
//      Residual method, drop = 0.735 - (mouth - dash)*world-per-ny:
//        @0.80 : 0.580 - 0.539 = +0.041 -> 0.735 - 0.04400 = 0.69100
//        @1.30 : 0.546 - 0.530 = +0.016 -> 0.735 - 0.03554 = 0.69946
//        @54.80: 0.574 - 0.536 = +0.038 -> 0.735 - 0.05220 = 0.68280
//      Absolute cross-check: dash world Y = 1.90130 / 1.90212 / 1.89866 — three
//      cameras agree the static feature to 3.5 mm; the 17 mm spread is entirely
//      in the mouth reads, so the window is reconciled in NY space, not averaged
//      in world (that would over-weight the noisiest key).
//      Admissible window (mouth inside EVERY measured dash band):
//        @0.80  band 0.527-0.551 -> 0.67813..0.70388
//        @1.30  band 0.525-0.535 -> 0.68836..0.71057
//        @54.80 band 0.526-0.547 -> 0.66906..0.69791
//        INTERSECTION 0.68836..0.69791; midpoint 0.69313 -> 0.693.
//        (max-min-margin point 0.69426, least-squares-in-ny 0.69254 — both inside,
//         both within 0.002 of the chosen value.)
//      PREDICTED mouth ny 0.5409 / 0.5271 / 0.5434 vs dash centres 0.539 / 0.530 /
//      0.536: misses +0.0019 / -0.0029 / +0.0074, ALL INSIDE their bands.
//      Extents @0.80: stub top 0.425, mouth 0.541, drip bottom 0.727; chin 0.260,
//      bench top 1.10 (off-frame) -> stub rises from the dash, drip on the coat.
//      NOT used: the A73 mouth crop read 0.271. It predicts 0.5552 for A75 where
//      0.580 was measured (0.025 ny inconsistency); it was read while the strip
//      sat at the chin, partly collar-occluded. The same-crop A75 pair governs.
// Horizontal seat PROVEN (A75 cx: bar 0.51 vs dash 0.51 @0.80; 0.625 vs 0.645
// @1.30) — POCKET_FORWARD / POCKET_LATERAL unchanged from the R8 triangulation.
const POCKET_FORWARD = 0.19;
const POCKET_LATERAL = 0.149;
const POCKET_DROP = 0.693;
const POCKET_TILT = 0.18;     // rad (10.3deg) — bar leans out of the mouth
// The rig is a PAINTED 2.5-D coat: there is no pocket cavity, so nothing can
// occlude the buried part. The buried 58% is therefore NOT DRAWN — the mount is
// squashed to POCKET_VISIBLE and its bottom seated on the mouth line (calibrated
// from the GLB bbox after mount, see the chocolate mount block).
const POCKET_VISIBLE = 0.42;
const chocStub = new THREE.Group();
chocStub.scale.set(1, POCKET_VISIBLE, 1);
chocStub.position.set(0, 0.063, 0);
pocketChocolate.add(chocStub);
const chocMount = new THREE.Group();
chocMount.rotation.set(Math.PI * 0.5, -Math.PI * 0.5, 0);
chocMount.scale.setScalar(0.89);
chocStub.add(chocMount);
let dripTrail, smear;
{
// Pocket mouth: thin DARK strip at the tuck line (replaces R3's white lip block).
const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.014, 0.010), new THREE.MeshBasicMaterial({ color: 0x4a4640 }));
mouth.position.set(0, 0.0, 0.008);
pocketChocolate.add(mouth);
// D11: the bright 0xc9ced6 band at y 0.108 was the cross's crossbar. Replaced by a
// LOWER muted-tin tuck collar at the mouth line + a dark wrapper lip above it, so
// the bar reads as chocolate with a foil collar and no white plus-sign.
const foil = new THREE.Mesh(new THREE.BoxGeometry(0.152, 0.048, 0.054), new THREE.MeshBasicMaterial({ color: 0x8c94a0 }));
foil.position.set(0, 0.028, 0.004);
pocketChocolate.add(foil);
const foilLip = new THREE.Mesh(new THREE.BoxGeometry(0.154, 0.006, 0.056), new THREE.MeshBasicMaterial({ color: 0x2a1c12 }));
foilLip.position.set(0, 0.053, 0.004);
pocketChocolate.add(foilLip);
// Melt runs DOWN THE COAT below the mouth. z chosen so the tilt leaves it proud:
// 0.030*cos(.18) - 0.085*sin(.18) = +0.014 in front of the coat face.
dripTrail = new THREE.Mesh(new THREE.BoxGeometry(0.030, 0.13, 0.012), new THREE.MeshBasicMaterial({ color: 0x5a2c12 }));
dripTrail.position.set(0.030, -0.085, 0.030);
pocketChocolate.add(dripTrail);
smear = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), new THREE.MeshBasicMaterial({ color: 0x5a2c12 }));
smear.scale.set(1, 0.7, 0.4);
smear.position.set(-0.035, -0.150, 0.040);
pocketChocolate.add(smear);
}

  // ========== ROUND-3 LAB ANCHORS (Track A props, mounted below) ==========
  // Charcoal panel (R3-3): stands ON the kettle bench behind the kettle —
  // centre (-3.0, bench top 1.30, -4.75): west edge exactly at the radar
  // plinth's east face (-4.3), front face -4.72 clears the bench egg's new
  // spot and the kettle; serves S09 + the S10–S12 backgrounds (wall <= 0.3).
  const panelAnchor = new THREE.Group();
  panelAnchor.position.set(-3.0, 1.3, -4.75);
  labGrp.add(panelAnchor);

  // Horn mast extension (R3-2 / Track A manifest): standalone mast+horn on
  // the device table at the cabinet's far-left bay (-6.9, 1.3, -4.9); tip
  // lands at world y ≈ 3.39. West of the plinth (x < -6.5), clear of it.
  const mastAnchor = new THREE.Group();
  mastAnchor.position.set(-6.9, 1.3, -4.9);
  labGrp.add(mastAnchor);

  // Vacuum tube rack (R3-12): on the BOX bench (table2) at x >= 3.
  const tubeRackAnchor = new THREE.Group();
  tubeRackAnchor.position.set(3.4, 1.3, -5.35);
  tubeRackAnchor.rotation.y = 0.1;
  labGrp.add(tubeRackAnchor);

  // Signal generator: A23 said table1's east back edge — that strip is
  // physically occupied (mug / bench egg / kettle / charcoal panel, all
  // verified by coordinates), so it takes the wave bench's west end instead
  // (deviation logged in ROUND3_REPORT).
  const sigGenAnchor = new THREE.Group();
  sigGenAnchor.position.set(2.42, 1.3, -5.32);
  sigGenAnchor.rotation.y = 0.12;
  labGrp.add(sigGenAnchor);

  // Chalkboard (R3-12): BLACK slate, LAB east at (9.3, 0, -6.1), angled into
  // the S17 orbit background; x >= 2, out of S05's sightline.
  const chalkAnchor = new THREE.Group();
  chalkAnchor.position.set(9.3, 0, -6.1);
  chalkAnchor.rotation.y = -0.35;
  labGrp.add(chalkAnchor);

  // Ceiling beam (Track A manifest): origin at the beam's UNDERSIDE; placed
  // at y 9.7 so the centre lamp cable (x 0, top y 10.0) terminates on it.
  const beamAnchor = new THREE.Group();
  beamAnchor.position.set(0, 9.7, 0);
  labGrp.add(beamAnchor);

  // Wall calendar, LAB copy (R3-7): at x >= 2 on the back wall, inside the
  // S17 orbit background, out of S05's sightline; stays on the 1945 page.
  const labCalAnchor = new THREE.Group();
  labCalAnchor.position.set(5.6, 2.82, -7.72);
  labGrp.add(labCalAnchor);

  // R3-2 green radar screen: R3-2's wall spot (-4.2, 2.0–2.4) is OCCLUDED by
  // the radar cabinet body from S05's camera (ray passes (-4.52, 2.10) at
  // the cabinet's south face, inside its span) — so a small console screen
  // is mounted ON the cabinet's south face at his screen-right neck band,
  // sharing the big screen's animated canvas (dimmed via colour multiply).
  const miniScreenGrp = new THREE.Group();
  miniScreenGrp.position.set(-4.32, 2.25, -1.76);
  miniScreenGrp.rotation.set(-0.10, 0.15, 0);
  labGrp.add(miniScreenGrp);
  {
    const shell = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.52, 0.07), K.surface('lab', '#20262a', { gloss: 0.4, spec: 0.3 }));
    miniScreenGrp.add(shell);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 0.42), new THREE.MeshBasicMaterial({ map: screenData.tex, color: 0x8fae8f }));
    scr.position.z = 0.037;
    miniScreenGrp.add(scr);
  }

  // S17 viewport (R3-6): 0.20 x 0.15 glowing window with 3 bars + emissive
  // wave rings (amber / blue-white, never green) on the wave box's front
  // face. Child of waveBoxAnchor so it grows in with boxBuildState.
  const viewportGrp = new THREE.Group();
  viewportGrp.position.set(0, 0.36, 0.345);
  waveBoxAnchor.add(viewportGrp);
  const waveRings = [];
  {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.21, 0.03), K.surface('lab', '#14151a', { gloss: 0.45, spec: 0.3 }));
    viewportGrp.add(frame);
    const glowPane = new THREE.Mesh(new THREE.PlaneGeometry(0.20, 0.15), new THREE.MeshBasicMaterial({ color: 0xffa842 }));
    glowPane.position.z = 0.017;
    viewportGrp.add(glowPane);
    for (let i = -1; i <= 1; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.15, 0.008), new THREE.MeshBasicMaterial({ color: 0x0c0c0e }));
      bar.position.set(i * 0.06, 0, 0.022);
      viewportGrp.add(bar);
    }
    const ringCols = [0xffd27a, 0xbfe3ff];
    for (let i = 0; i < 2; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.042 - i * 0.016, 0.007, 8, 24), new THREE.MeshBasicMaterial({ color: ringCols[i] }));
      ring.position.z = 0.02;
      viewportGrp.add(ring);
      waveRings.push(ring);
    }
  }
  // Weld sparks (R3-6 micro-beat (b)): tiny points at the box's top seam,
  // jittered per frame in update(); NO welding mask anywhere.
  const sparkGrp = new THREE.Group();
  sparkGrp.position.set(-0.28, 0.60, 0.30);
  waveBoxAnchor.add(sparkGrp);
  const sparkMeshes = [];
  for (let i = 0; i < 5; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffcf7a }));
    sparkGrp.add(s);
    sparkMeshes.push(s);
  }
  sparkGrp.visible = false;
// R11-4 weld/door/glow FX — local to the spec-scale box (0.92 x 0.66 x 0.66, base
// at the anchor origin, front face z +0.33, top y 0.66). Depth re-registration:
// A90's door 0.33 / glow 0.24 / ribbons 0.10 are inside or co-planar with the
// shell; door 0.36, glow 0.372, ribbons 0.376 read through the 0.34x0.26 window
// gap, in front of the existing viewport pane (front 0.362).
const boxFX = new THREE.Group(); boxFX.name = 'r11_boxfx'; waveBoxAnchor.add(boxFX);
const fxAmber = () => new THREE.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0 });
const doorGrp = new THREE.Group(); doorGrp.position.set(-0.46, 0.36, 0.36); boxFX.add(doorGrp);
{ const iron = K.surface('lab', '#6f7a84', { gloss: 0.55, spec: 0.4 });
doorGrp.add(r11Box(0.86, 0.15, 0.04, iron, 0.43,  0.205, 0));
doorGrp.add(r11Box(0.86, 0.15, 0.04, iron, 0.43, -0.205, 0));
doorGrp.add(r11Box(0.26, 0.26, 0.04, iron, 0.13, 0, 0));
doorGrp.add(r11Box(0.26, 0.26, 0.04, iron, 0.73, 0, 0)); } // 0.34x0.26 window gap
const boxGlowPlane = r11Box(0.30, 0.22, 0.01, fxAmber(), 0, 0.36, 0.372); boxFX.add(boxGlowPlane);
const boxSeam = r11Box(0.9, 0.02, 0.01, fxAmber(), 0, 0.655, 0.335); boxFX.add(boxSeam);
const torch = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8),
new THREE.MeshBasicMaterial({ color: 0xfff3c0, transparent: true, opacity: 0 }));
torch.position.set(0, 0.66, 0.34); boxFX.add(torch);
const boxRibbons = [];
for (let i = 0; i < 2; i++) {
const r = r11Sine(0.24, 0.03, 2, 0.008, fxAmber());
r.position.set(-0.12, 0.30 + i * 0.12, 0.376); boxFX.add(r); boxRibbons.push(r);
}
// R11-4 sparks — deterministic, pure function of t. Hash replaces Math.random()
// so stills and film agree frame-for-frame. Materials are transparent:true so
// opacity writes actually take effect (A83 defect #6).
function r11MakeSparks(count, origin, spread, matColor) {
const grp = new THREE.Group();
const parts = [];
for (let i = 0; i < count; i++) {
const mat = new THREE.MeshBasicMaterial({
color: matColor === undefined ? 0xffd27a : matColor,
transparent: true,
opacity: 1,
});
const m = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 0.035), mat);
grp.add(m);
parts.push({ mesh: m, mat: mat, seed: i + 1 });
}
const hash = (n) => {
const s = Math.sin(n * 127.1) * 43758.5453123;
return s - Math.floor(s);
};
// weldBeat: 0..1 envelope supplied by the caller (from the EXISTING
// boxBuildState — never redefined). life offset per particle is fixed.
const update = (t, weldBeat) => {
grp.visible = weldBeat > 0.001;
if (!grp.visible) return;
for (const p of parts) {
const off = hash(p.seed * 3.7);
const life = ((t * 2.6 + off) % 1);
const ang = hash(p.seed * 11.3) * Math.PI * 2;
const spd = 0.5 + hash(p.seed * 5.1) * 0.9;
const r = life * spd * spread;
p.mesh.position.set(
origin[0] + Math.cos(ang) * r,
origin[1] + life * spd * spread * 0.7 - 1.6 * life * life,
origin[2] + Math.sin(ang) * r * 0.6
);
const s = (1 - life) * weldBeat;
p.mesh.scale.setScalar(Math.max(s, 0.0001));
p.mat.opacity = Math.max(0, (1 - life) * weldBeat);
}
};
return { group: grp, update: update };
}
const boxSparks = r11MakeSparks(12, [0, 0.70, 0.34], 0.22, 0xffe08a);
boxFX.add(boxSparks.group);


  // STORY egg + the hero's sleeve/hand (H1 / R3-8): a SEPARATE egg from the
  // bench dressing egg. The sleeve carries it in during S10, sets it half-IN
  // the kettle mouth, withdraws; the egg trembles with the kettle through
  // S11 and is gone at the boom. A spare lid leans beside the kettle (the
  // kettle GLB's own lid is baked into its mesh and cannot be detached).
  const storyEggGrp = new THREE.Group();
  labGrp.add(storyEggGrp);
  const storyEgg = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 14), K.surface('lab', '#f2ead8', { gloss: 0.35, spec: 0.2 }));
  storyEgg.scale.set(1, 1.25, 1);
  storyEggGrp.add(storyEgg);
  storyEggGrp.visible = false;
  const spareLid = new THREE.Group();
  spareLid.position.set(-2.42, 1.36, -3.55);
  spareLid.rotation.x = 1.15;
  labGrp.add(spareLid);
  {
    const lidDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.03, 20), K.surface('lab', '#c2c6c9', { gloss: 0.5, spec: 0.32 }));
    spareLid.add(lidDisc);
    const lidKnob = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), K.surface('lab', '#38322e', { gloss: 0.35, spec: 0.25 }));
    lidKnob.position.y = 0.04;
    spareLid.add(lidKnob);
  }
  spareLid.visible = false;
  const sleeveGrp = new THREE.Group();
  labGrp.add(sleeveGrp);
  {
    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.55, 12), K.surface('lab', '#f4f6f8', { gloss: 0.3, spec: 0.2 }));
    sleeve.rotation.z = Math.PI * 0.46;
    sleeve.position.set(-0.28, 0.02, 0);
    sleeveGrp.add(sleeve);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), K.surface('lab', '#caa07a', { gloss: 0.3, spec: 0.2 }));
    hand.position.set(-0.02, 0.05, 0.02);
    sleeveGrp.add(hand);
  }
  sleeveGrp.visible = false;

  // S12 SPLAT (F4 / R3-4 / ROUND-5 fix): yolk + white decal group, positioned
  // onto mocker's face plane. Coverage: >=25% with drip tails, EYES READABLE.
const splatGrp = new THREE.Group();
labGrp.add(splatGrp);
// R6-3: coverage 25-40% (A62 measured >=50%): the whole decal is scaled 0.76
// (area x0.578 -> ~29%) and seated 0.02 lower so BOTH eyes clear the white.
splatGrp.scale.setScalar(0.76);
// Yolk pin PRE-COMPENSATED for the lab post chain (gain 1.28, gamma 1.05,
// sat 1.12, contrast 1.06, gr 1.05 / gg 1.02 / gb 0.94). 0xffa028 measured
// #face23 (hue 48, lemon). 0xff7c22 lands ~#f7a419 (hue ~37, orange).
const YOLK_PIN = 0xff7c22;
{
  // White base: oval covering lower-mid face, eyes clear
  const white = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), new THREE.MeshBasicMaterial({ color: 0xf7f1de }));
  white.scale.set(1.05, 0.80, 0.30);
  white.position.set(-0.02, -0.10, 0.01);
  splatGrp.add(white);
  // Yolk: centered blob, smaller than white, eyes still visible above
  const yolk = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), new THREE.MeshBasicMaterial({ color: YOLK_PIN }));
  yolk.scale.set(0.95, 0.95, 0.32);
  yolk.position.set(0.03, -0.12, 0.03);
  splatGrp.add(yolk);
  // Drip tails: 3 drips running down from the main mass
  const dripCols = [YOLK_PIN, 0xf7f1de, YOLK_PIN];
  const dripSpec = [
    [0.08, -0.32, 0.032, 0.26], // right drip, yolk
    [-0.12, -0.28, 0.028, 0.20], // left drip, white
    [-0.01, -0.25, 0.024, 0.16], // center drip, yolk
  ];
  for (let i = 0; i < 3; i++) {
    const [dx, dy, r, len] = dripSpec[i];
    const drip = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.7, len, 8), new THREE.MeshBasicMaterial({ color: dripCols[i] }));
    drip.position.set(dx, dy, 0.03);
    splatGrp.add(drip);
  }
  // Shell shards: 3 small pieces at edges, NOT across eye line
  const shardPos = [[0.28, -0.18], [-0.26, -0.20], [0.14, -0.30]];
  for (const [dx, dy] of shardPos) {
    const shard = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 6), new THREE.MeshBasicMaterial({ color: 0xf7f1de }));
    shard.position.set(dx, dy, 0.02);
    shard.rotation.z = dx > 0 ? -0.7 : 0.8;
    splatGrp.add(shard);
  }
}
splatGrp.visible = false;
// Impact burst droplets (S12, first 0.4 s): fly kettle -> face.
const burstGrp = new THREE.Group();
labGrp.add(burstGrp);
const burstDrops = [];
{
  const brnd = mkRng(31);
  for (let i = 0; i < 6; i++) {
    const d = new THREE.Mesh(new THREE.SphereGeometry(0.03 + brnd() * 0.02, 8, 8), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xf7f1de : YOLK_PIN }));
    d.userData = { ox: (brnd() - 0.5) * 0.5, oy: (brnd() - 0.5) * 0.5, oz: (brnd() - 0.5) * 0.2 };
    burstGrp.add(d);
    burstDrops.push(d);
  }
}
burstGrp.visible = false;

// Breath fog (F18 / R11-9): three soft puffs at the engineer's mouth during S04's
// cold window — the cold must PHOTOGRAPH. Colour per Neon item 4 (0xd8ecff).
const breathGrp = new THREE.Group();
labGrp.add(breathGrp);
const breathPuffs = [];
for (let i = 0; i < 3; i++) {
const puff = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 12), new THREE.MeshBasicMaterial({ color: 0xd8ecff, transparent: true, opacity: 0 }));
breathGrp.add(puff);
breathPuffs.push(puff);
}
breathGrp.visible = false;

  // Wall thermometer — UNIFIED back wall position
  // (A31-L5: nudged +z so the body sits proud of the wall face at -7.8
  // instead of half-sunk in it)
  const thermBody = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 0.05), K.surface('lab', '#e8e8f0', { gloss: 0.6, spec: 0.4 }));
  thermBody.position.set(-9.5, 4.6, -7.72);
  labGrp.add(thermBody);
  const thermBulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshBasicMaterial({ color: 0x4a8aff }));
  thermBulb.position.set(-9.5, 4.1, -7.78);
  labGrp.add(thermBulb);
  const thermLine = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4), new THREE.MeshBasicMaterial({ color: 0x4a8aff }));
  thermLine.position.set(-9.5, 4.4, -7.78);
  labGrp.add(thermLine);

  // Hanging lamps
  for (let i = 0; i < 3; i++) {
    const lampX = -6 + i * 6;
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.5), K.surface('lab', '#2a2a2a', {}));
    cable.position.set(lampX, 8.75, 0);
    labGrp.add(cable);
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 0.6), K.surface('lab', '#6a5a3a', { gloss: 0.4, spec: 0.3 }));
    shade.position.set(lampX, 7.2, 0);
    labGrp.add(shade);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffd87a }));
    bulb.position.set(lampX, 7, 0);
    labGrp.add(bulb);
  }

  // Cable runs
  for (let i = 0; i < 4; i++) {
    const cableRun = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 20), K.surface('lab', '#3a3a42', {}));
    cableRun.rotation.z = Math.PI * 0.5;
    cableRun.position.set(0, 8.5 - i * 0.3, -7);
    labGrp.add(cableRun);
  }

  // Instrument cabinet — ROUND-3: shifted east/north (12.5, 1.5, -6.5) to
  // clear the chalkboard's easel footprint at (9.3, 0, -6.1).
  const cabinet = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 1), K.surface('lab', '#5a5a62', { gloss: 0.3, spec: 0.2 }));
  cabinet.position.set(12.5, 1.5, -6.5);
  outline(cabinet, { width: 0.022 });
  labGrp.add(cabinet);

  // Stool: Blender GLB at stoolAnchor (-8, 0, -2) replaces the old primitive stool.

  // Coat hooks (A31-L5: +z so they sit proud of the wall face)
  for (let i = 0; i < 3; i++) {
    const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.3), K.surface('lab', '#4a4a52', {}));
    hook.rotation.z = Math.PI * 0.5;
    hook.position.set(12 + i * 0.8, 4, -7.7);
    labGrp.add(hook);
  }

  // ========== MICRO WORLD (x=400) ==========
  const microGrp = new THREE.Group();
  microGrp.name = 'place_micro';
  microGrp.position.x = MICRO_X;
  group.add(microGrp);

  // Water molecule (1 red O + 2 white H, bondable group)
  const moleculeGrp = new THREE.Group();
  moleculeGrp.position.set(0, 3, 0);
  microGrp.add(moleculeGrp);

  const oxygenMat = new THREE.MeshBasicMaterial({ color: 0xff4a4a });
  const hydrogenMat = new THREE.MeshBasicMaterial({ color: 0xf0f0ff });
  const bondMat = new THREE.MeshBasicMaterial({ color: 0x8a8aaa });

  const oxygen = new THREE.Mesh(new THREE.SphereGeometry(0.8, 24, 24), oxygenMat);
  moleculeGrp.add(oxygen);

  const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 20), hydrogenMat);
  h1.position.set(-1.2, 0.6, 0);
  moleculeGrp.add(h1);

  const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 20), hydrogenMat);
  h2.position.set(1.2, 0.6, 0);
  moleculeGrp.add(h2);

  const bond1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.2), bondMat);
  bond1.rotation.z = -Math.PI * 0.3;
  bond1.position.set(-0.6, 0.3, 0);
  moleculeGrp.add(bond1);

  const bond2 = bond1.clone();
  bond2.rotation.z = Math.PI * 0.3;
  bond2.position.set(0.6, 0.3, 0);
  moleculeGrp.add(bond2);

  // Staging platforms
  const platformMat = new THREE.MeshBasicMaterial({ color: 0x3a4a6a, transparent: true, opacity: 0.3 });
  const popcornPlatform = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.1), platformMat);
  popcornPlatform.position.set(-3, 0, 2);
  microGrp.add(popcornPlatform);

  const eggPlatform = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.1), platformMat);
  eggPlatform.position.set(3, 0, 2);
  microGrp.add(eggPlatform);

// Soft particles (ambient glow) — R4-8: handles collected so update() can gate
// them OFF during S16 (blue dots were leaking into the neutral food void).
const particleMat = new THREE.MeshBasicMaterial({ color: 0x6a8aff, transparent: true, opacity: 0.2 });
const microParticles = [];
const rnd = mkRng(99);
for (let i = 0; i < 30; i++) {
  const p = new THREE.Mesh(new THREE.SphereGeometry(0.1 + rnd() * 0.2, 12, 12), particleMat);
  p.position.set((rnd() - 0.5) * 20, (rnd() - 0.5) * 10, (rnd() - 0.5) * 15);
  microGrp.add(p);
  microParticles.push(p);
}

  // Molecule environment (Blender GLB): satellite water molecules + droplets
  // clustered around the hero molecule (env population spans y ~2–6.2,
  // x ±4 local), BackDark backdrop disc at its local z=-4.2 -> world z=-4.7.
  const microEnvAnchor = new THREE.Group();
  microEnvAnchor.position.set(0, 0, -0.5);
  microGrp.add(microEnvAnchor);

  // ROUND-3 (R3-9): the S16 potato half is staged in a DARK NEUTRAL VOID of
  // its own — pedestal + backdrop disc at micro-local (0, ~1.0, -2.5), south
  // of the molecule cluster, away from the S15 platforms (y 0, z +2). The
  // cut face's heat gradient is pinned hot-core -> pale-mid -> skin (mount
  // overrides below); 3 blue-tinted wave arrows pulse on the cut face (blue
  // tint lives on wave graphics only, never the food).
  // R4-8 (S16): void anchors pinned neutral dark; wave ribbons scaled into a
  // glyph band that reads across the food cross-section.
// R11-2 S14 wave phase — horn stub + 3 sine ribbons + 4 traveling rings + impact
// glow. F3: the molecule sits at micro-local (0,3,0), so every child is +1.5 in y
// (horn 3.0; ribbons 2.7/3.0/3.3; rings travel at 3.0; impact at (0,3,0)).
const S14_MOL = new THREE.Vector3(0, 3, 0);
const waveGrp = new THREE.Group(); waveGrp.name = 'r11_s14waves'; microGrp.add(waveGrp);
const waveAmber = () => new THREE.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0 });
const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.06, 0.5, 12),
K.surface('micro', '#8b95a1', { gloss: 0.5, spec: 0.4 }));
horn.rotation.z = -Math.PI / 2; horn.position.set(-2.75, 3.0, 0); waveGrp.add(horn);
const s14Ribbons = [], s14Rings = [];
for (let i = 0; i < 3; i++) {
const r = r11Sine(2.2, 0.16, 3, 0.035, waveAmber());
r.position.set(-2.45, 3.0 + (i - 1) * 0.3, (i - 1) * 0.14);
waveGrp.add(r); s14Ribbons.push(r);
}
for (let i = 0; i < 4; i++) {
const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.022, 6, 40), waveAmber());
ring.rotation.y = Math.PI / 2; ring.position.set(-2.45, 3.0, 0);
waveGrp.add(ring); s14Rings.push(ring);
}
const s14Impact = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), waveAmber());
s14Impact.position.copy(S14_MOL); waveGrp.add(s14Impact);
waveGrp.visible = false;
// R11-3 hand-rub vignette — micro-local x 6 (world 406 = C1's S15 target).
const rubGrp = new THREE.Group(); rubGrp.name = 'r11_handrub';
rubGrp.position.set(6, 1.35, 0); microGrp.add(rubGrp);
const skin = K.surface('micro', '#e8b98a', { gloss: 0.25, spec: 0.15 });
function r11Hand(side) { // side -1 left, +1 right; palm faces inward
const h = new THREE.Group();
h.add(r11Box(0.10, 0.34, 0.30, skin, 0, 0, 0));
for (let f = 0; f < 4; f++) h.add(r11Box(0.09, 0.24, 0.065, skin, 0, 0.27, -0.105 + f * 0.07));
const th = r11Box(0.08, 0.16, 0.07, skin, side * -0.02, -0.02, 0.19); th.rotation.x = 0.5; h.add(th);
return h;
}
const rubL = r11Hand(-1), rubR = r11Hand(1);
rubL.position.x = -0.16; rubR.position.x = 0.16; rubGrp.add(rubL, rubR);
const rubGlow = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10),
new THREE.MeshBasicMaterial({ color: 0xff8c3a, transparent: true, opacity: 0 }));
rubGrp.add(rubGlow);
const rubHeat = [];
for (let i = 0; i < 3; i++) {
const s = r11Sine(0.55, 0.05, 2.5, 0.02,
new THREE.MeshBasicMaterial({ color: 0xff8c3a, transparent: true, opacity: 0 }));
s.rotation.z = Math.PI / 2; s.position.set((i - 1) * 0.22, 0.5, 0);
rubGrp.add(s); rubHeat.push(s);
}
rubGrp.visible = false;

const foodVoidAnchor = new THREE.Group();
foodVoidAnchor.position.set(0, 0.97, -2.5);
foodVoidAnchor.rotation.y = 0.4;
microGrp.add(foodVoidAnchor);
{
  // R4-8: neutral void anchors. Disc moved IN FRONT of molecule_env's BackDark
  // (world z -4.7) to z -3.85 so it actually wins the S16 frame; r 3.4 covers
  // both camera keys. Pedestal stays neutral dark.
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 0.10, 24), new THREE.MeshBasicMaterial({ color: 0x161616 }));
  pedestal.position.set(0, 0.92, -2.5);
  microGrp.add(pedestal);
  const backdropDisc = new THREE.Mesh(new THREE.CircleGeometry(3.4, 40), new THREE.MeshBasicMaterial({ color: 0x0b0b0e }));
  backdropDisc.position.set(0, 1.5, -3.85);
  microGrp.add(backdropDisc);
}
// R4-8: wave GLYPH BAND — three sine ribbons across the cut face (replaces the
// edge-on arrows). Span 0.60 wide (~88% frame width), amplitude 0.045, tube
// radius 0.014, rows y 0.16/0.30/0.44, z 0.30 proud of the face. Deep heat-orange.
const foodArrows = new THREE.Group();
foodVoidAnchor.add(foodArrows);
{
const ribbonMat = new THREE.MeshBasicMaterial({ color: 0xc85a14 });
const rows = [0.16, 0.30, 0.44];
for (const ry of rows) {
const pts = [];
for (let s = 0; s <= 24; s++) {
const x = -0.30 + (0.60 * s) / 24;
const y = ry + 0.045 * Math.sin((x / 0.30) * Math.PI * 2);
pts.push(new THREE.Vector3(x, y, 0.30));
}
const curve = new THREE.CatmullRomCurve3(pts);
const ribbon = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.014, 8, false), ribbonMat);
foodArrows.add(ribbon);
}
}
// D7: 7 code-built steam wisps (Neon contingency) — tapered sine tubes rising off
// the cut face, r 0.015..0.035, soft unlit 0xeef3f8, depthWrite false, opacity
// driven in r11Update (max 0.28). Smaller, softer and more numerous than the
// authored Steam0..6 blobs they replace.
const foodWisps = [];
for (let i = 0; i < 7; i++) {
const x0 = -0.21 + (i / 6) * 0.42;
const sway = 0.045 + (i % 3) * 0.020;
const r = 0.015 + (i % 4) * 0.0067;   // 0.015 .. 0.035
const pts = [];
for (let s = 0; s <= 14; s++) {
const u = s / 14;
pts.push(new THREE.Vector3(
x0 + Math.sin(u * Math.PI * 1.6 + i) * sway * u,
0.52 + u * 0.62,
0.10 + u * 0.04
));
}
const wisp = new THREE.Mesh(
new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 28, r, 6, false),
new THREE.MeshBasicMaterial({ color: 0xeef3f8, transparent: true, opacity: 0, depthWrite: false })
);
foodVoidAnchor.add(wisp);
foodWisps.push(wisp);
}
foodVoidAnchor.visible = false;

  // ========== SHOW WORLD (x=800) ==========
  const showGrp = new THREE.Group();
  showGrp.name = 'place_show';
  showGrp.position.x = SHOW_X;
  group.add(showGrp);

  // Stage floor
  const stageFloor = new THREE.Mesh(new THREE.BoxGeometry(20, 0.3, 15), K.surface('show', '#6a5a4a', { gloss: 0.5, spec: 0.4 }));
  stageFloor.position.set(0, -0.15, 0);
  showGrp.add(stageFloor);

  // Curtain backdrop — FULL CYLINDERS ONLY, taller (14 units) reaching floor to
  // ceiling band, no gap. NO backdrop disc (the disc caused the horizontal seam).
  const useLitCurtain = true;
  const curtainMat = useLitCurtain
    ? K.surface('show', '#c22424', { gloss: 0.2, spec: 0.15 })
    : new THREE.MeshBasicMaterial({ color: 0x8a2323 });
  for (let i = 0; i < 8; i++) {
    const curtain = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 14), curtainMat);
    curtain.position.set(-7 + i * 2, 7, -6); // centered at y=7, spans 0..14
    showGrp.add(curtain);
  }
  // Top band moved to exactly y=14 (top of cylinders) with no overlap
  const curtainTop = new THREE.Mesh(new THREE.BoxGeometry(16, 0.6, 1), K.surface('show', '#5a1a1a', {}));
  curtainTop.position.set(0, 14.3, -6);
  showGrp.add(curtainTop);

  // Giant oven plinth — ROUND-3: widened 4 -> 5.6 (centre unchanged) so the
  // height gauge stands ON the same deck at the oven's side (R3-7 staging):
  // deck now spans x -4.8..0.8; oven position and S19's on-deck y = 0.8
  // datum are unchanged.
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.8, 3), K.surface('show', '#9a8a7a', { gloss: 0.4, spec: 0.3 }));
  plinth.position.set(-2, 0.4, 0);
  showGrp.add(plinth);

  // Giant oven anchor (GLB or fallback)
  const ovenAnchor = new THREE.Group();
  ovenAnchor.position.set(-2, 0.8, 0);
  showGrp.add(ovenAnchor);

  // ROUND-3 SHOW anchors (Track A props):
  // Plaque (R3-7): on the plinth's front face (z = +1.5), centre y 0.4 —
  // anchor y = 0.4 - 0.275 (delivered height 0.55, manifest).
  const plaqueAnchor = new THREE.Group();
  plaqueAnchor.position.set(-2, 0.125, 1.53);
  showGrp.add(plaqueAnchor);
  // Height gauge (R3-7): base ON the plinth deck (y = 0.8) at the oven's
  // left (west) side, face parallel to the oven front; its red 2.9 line
  // lands at world y 3.7.
  const gaugeAnchor = new THREE.Group();
  gaugeAnchor.position.set(-4.3, 0.8, -0.6);
  showGrp.add(gaugeAnchor);
  // Rope barrier (R3-7): across the stage foreground.
  const ropeAnchor = new THREE.Group();
  ropeAnchor.position.set(-2, 0, 4.6);
  showGrp.add(ropeAnchor);
  // Wall calendar, SHOW copy (R3-7 time bridge): on the curtain line west of
  // the oven, in front of the curtain cylinders (z -5.45 vs their -6);
  // update() flips its page 1945 -> 1947 at T_COMPANY + 0.2.
  const showCalAnchor = new THREE.Group();
  showCalAnchor.position.set(-5.6, 2.42, -5.45);
  showGrp.add(showCalAnchor);
  // Oven nameplate (R3-7: a NUMBER, never a device name — "1947" / "No. 1"):
  // code-built canvas-texture brass plate on the oven's front face.
  {
    const cv = document.createElement('canvas');
    cv.width = 256; cv.height = 96;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#8a6f3a'; ctx.fillRect(0, 0, 256, 96);
    ctx.fillStyle = '#2a1f10';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('1947', 128, 46);
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('No. 1', 128, 82);
    const plateTex = new THREE.CanvasTexture(cv);
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.34), new THREE.MeshBasicMaterial({ map: plateTex }));
    plate.position.set(-2, 3.0, 1.04);
    showGrp.add(plate);
  }

  // Scale anchor (GLB or fallback)
  const scaleAnchor = new THREE.Group();
  scaleAnchor.position.set(3, 0, 1);
  showGrp.add(scaleAnchor);
// ===== R11-5/6 S19 NUMBER PROPS — built HIDDEN, gated to S19 in r11Update =====
// SCALE_DIAL_CENTER — ONE anchor-local constant, TWO documented branch values:
//   FALLBACK : dial centre (0.35,0.75,0), face front z 0.025 -> pivot z 0.045 (+0.02 proud)
//   GLB LIVE : DialFace centre (1.35,3.10), face front z -0.28 -> pivot z -0.28.
//              The baked needle keeps its own z under z-rotation; the code needle
//              gets +0.12 local z so it clears Hub front (-0.18).
const SCALE_DIAL_CENTER_FALLBACK = [0.35, 0.75, 0.045];
const SCALE_DIAL_CENTER_GLB      = [1.35, 3.10, -0.28];
const SCALE_DIAL_CENTER = SCALE_DIAL_CENTER_FALLBACK.slice();
let scaleNeedleRoute = 'code-fallback';
const scaleNeedlePivot = new THREE.Group();
scaleNeedlePivot.position.set(SCALE_DIAL_CENTER[0], SCALE_DIAL_CENTER[1], SCALE_DIAL_CENTER[2]);
scaleAnchor.add(scaleNeedlePivot);
const scaleNeedleBar = r11Box(0.018, 0.125, 0.010,
new THREE.MeshBasicMaterial({ color: 0xd8452e }), 0, 0.0625, 0);
scaleNeedlePivot.add(scaleNeedleBar);
const scaleNeedleHub = r11Box(0.032, 0.032, 0.012,
new THREE.MeshBasicMaterial({ color: 0x2a2320 }), 0, 0, 0.004);
scaleNeedlePivot.add(scaleNeedleHub);
// kgPlaque — geometry text, cap 7*0.05 = 0.35 (R3-7). Both branch layouts built;
// the mount picks one. GLB layout is two-line so the plate fits the 47.10 frame.
const kgPlaque = new THREE.Group(); showGrp.add(kgPlaque);
const kgPlate = r11Box(1.90, 0.52, 0.05, K.surface('show', '#f6e7c8', { gloss: 0.2, spec: 0.1 }), 0, 0, 0);
const kgLeg = r11Box(0.07, 0.16, 0.07, K.surface('show', '#5a5a62', {}), 0, -0.34, -0.01);
kgPlaque.add(kgPlate, kgLeg);
const kgInk = new THREE.MeshBasicMaterial({ color: 0x2a2320 });
const kgTextOne = r11Text('340 KG', 0.05, kgInk, 0, 0, 0.03);
const kgTextTwo = new THREE.Group();
kgTextTwo.add(r11Text('340', 0.05, kgInk, 0,  0.20, 0.03));
kgTextTwo.add(r11Text('KG',  0.05, kgInk, 0, -0.20, 0.03));
kgPlaque.add(kgTextOne, kgTextTwo);
kgTextTwo.visible = false;
// R11-6 tag — F7 pivots (show-local). Card hangs 0.25 PROUD of the pivot so the
// pendulum overshoot (+0.22 rad -> -0.185 z) never enters the oven front face.
const TAG_PIVOT_FALLBACK = [-0.5, 3.60, 1.00];
const TAG_PIVOT_GLB      = [-0.61, 3.80, 0.69];
const tagArm = r11Box(0.05, 0.05, 0.25, K.surface('show', '#5a5048', { gloss: 0.2, spec: 0.1 }),
TAG_PIVOT_FALLBACK[0], TAG_PIVOT_FALLBACK[1], TAG_PIVOT_FALLBACK[2] + 0.125);
showGrp.add(tagArm);
const tagPivot = new THREE.Group();
tagPivot.position.set(TAG_PIVOT_FALLBACK[0], TAG_PIVOT_FALLBACK[1], TAG_PIVOT_FALLBACK[2]);
showGrp.add(tagPivot);
const tagHang = new THREE.Group(); tagHang.position.set(0, 0, 0.25); tagPivot.add(tagHang);
{
const string = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.55, 6),
K.surface('show', '#5a5048', { gloss: 0.2, spec: 0.1 }));
string.position.y = -0.275; tagHang.add(string);
const card = new THREE.Group(); card.position.y = -0.85; tagHang.add(card);
card.add(r11Box(1.7, 0.6, 0.04, K.surface('show', '#f6e7c8', { gloss: 0.2, spec: 0.1 }), 0, 0, 0));
card.add(r11Text('$5,000', 0.042, new THREE.MeshBasicMaterial({ color: 0x2a2320 }), 0, 0, 0.025));
const ring = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.012, 6, 12),
K.surface('show', '#5a5048', { gloss: 0.2, spec: 0.1 }));
ring.position.y = 0.32; card.add(ring);
}
scaleNeedlePivot.visible = false; kgPlaque.visible = false;
tagPivot.visible = false; tagArm.visible = false;


// Spotlight cone — R4-9: this transparent cone WAS the S18 translucent band
// (bottom rim y5 crossed the curtain upper third, frame top ~8.68 at 44.60).
// Raised so its bottom (y9.5) sits above every S18/S19 frame top; dimmed.
// Curtain cylinders untouched (F25 kept).
const spotMat = new THREE.MeshBasicMaterial({ color: 0xffd87a, transparent: true, opacity: 0.10 });
const spotCone = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 3, 10), spotMat);
spotCone.position.set(-2, 14.5, 0);
showGrp.add(spotCone);

  // ========== GRID WORLD (x=1200) ==========
  const gridGrp = new THREE.Group();
  gridGrp.name = 'place_grid';
  gridGrp.position.x = GRID_X;
  group.add(gridGrp);

  // Anchor kitchen (Blender GLB hero_kitchen, 4.35w x 2.6h x 0.91d, front +z):
  // replaces the old primitive counter + microwave. Its microwave sits at
  // GLB-local (1.35, 1.24, ~0) with the glow door facing +z -> grid-local
  // (1.35, 1.24, -3) once mounted at (0, 0, -3). S20 opens inside this kitchen.
  const heroKitchenAnchor = new THREE.Group();
  heroKitchenAnchor.position.set(0, 0, -3);
  gridGrp.add(heroKitchenAnchor);

  // Continuous ground plane across ALL grid cells (bench refinement): one
  // shared floor/baseboard slab runs under the anchor kitchen and every
  // home_block (top at y=0), so the cells read as homes on one street —
  // dividers stay at facade/storey level, never full-height slicers between
  // cells, and nothing floats in a void.
  const gridFloor = new THREE.Mesh(new THREE.BoxGeometry(36, 0.12, 36), K.surface('grid', '#3a3630', { gloss: 0.3, spec: 0.2 }));
  gridFloor.position.set(0, -0.06, -13);
  gridGrp.add(gridFloor);

  // Apartment grid (Blender GLB home_block, 5.5w x 7.92h x 1.3d, front +z):
  // replaces the old abstract dark-box backdrop (owner complaint: read as
  // abstract blocks). Two staggered ranks behind the anchor kitchen with
  // slight scale variance; every block carries lit windows + kitchen hints
  // with glowing microwave dots (spec S20: dollhouse cutaway, beacon in
  // every cell).
  const homeBlockAnchors = [];
  {
    const spots = [
      { x: -6.2, z: -14, s: 1.00 },
      { x: 0.0,  z: -15.5, s: 1.08 },
      { x: 6.2,  z: -14, s: 0.95 },
      { x: -3.4, z: -24, s: 1.10 },
      { x: 3.6,  z: -25, s: 1.00 },
    ];
    for (const sp of spots) {
      const a = new THREE.Group();
      a.position.set(sp.x, 0, sp.z);
      a.scale.setScalar(sp.s);
      gridGrp.add(a);
      homeBlockAnchors.push(a);
    }
  }

  // ========== GLBS (graceful fallback with gamma-corrected fallback colors) ==========
  const toSRGB = (c) => Math.pow(c, 1.0 / 2.2);
  const mountGlb = async (file, targetGrp, matOverrides = {}, withOutline = false, place = 'lab') => {
    try {
      const url = new URL(`../assets/blender/${file}`, import.meta.url).href;
      const glb = await readGlb(THREE, url);
      if (!glb || !glb.roots?.length) {
        // ROUND-3 (A31-M5): a missing GLB must be LOUD in the board log —
        // silent blanks failed checks on this project before.
        console.warn(`[mountGlb] ${file}: no roots — mount FAILED`);
        return false;
      }
      const wrap = new THREE.Group();
      for (const root of glb.roots) {
        const rg = new THREE.Group();
        rg.applyMatrix4(root.matrix);
        for (const p of root.prims) {
          let mat = matOverrides[p.material];
          if (!mat) {
            const isEmit = p.emissive && (p.emissive[0] + p.emissive[1] + p.emissive[2]) > 0.25;
            if (isEmit) {
              const srgbEmit = p.emissive.map(toSRGB);
              mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(...srgbEmit) });
            } else {
              const srgbColor = (p.color || [0.4, 0.35, 0.29]).map(toSRGB);
              const colHex = '#' + new THREE.Color(...srgbColor).getHexString();
              mat = K.surface(place, colHex, { gloss: 0.4, spec: 0.3 });
            }
          }
          const mesh = new THREE.Mesh(p.geometry, mat);
          // ROUND-3 (F19 root fix): carry the Blender node name — the
          // calendar page flip (and per-part logging) keys off it.
          mesh.name = p.node || '';
          // ROUND-3 (F19 root fix): outline() takes an OPTIONS OBJECT
          // (engine/shade.js: outline(mesh, { width, color, zBias })). The
          // old number form was destructured to the 0.06 default — every
          // outlined mesh rendered a ~3x-thick black hull (the kettle's
          // jagged halo, S20's microwave bracket, the S10–S12 "wall
          // brackets" around glowing orbs). Object form restores 0.022.
          if (withOutline) outline(mesh, { width: 0.022 });
          rg.add(mesh);
        }
        wrap.add(rg);
      }
      targetGrp.add(wrap);
      return true;
    } catch (e) {
      console.warn(`[mountGlb] ${file}: ${e && e.message ? e.message : e} — mount FAILED`);
      return false;
    }
  };

  const glbPromises = [];

  // Radar device with EXPLICIT mat overrides
  const radarMats = {
    RadarSteel: K.surface('lab', '#7a8f99', { gloss: 0.55, spec: 0.4 }),
    RadarDark: K.surface('lab', '#2e3438', { gloss: 0.4, spec: 0.3 }),
    RadarOlive: K.surface('lab', '#8a8f72', { gloss: 0.35, spec: 0.25 }),
    RadarBrass: K.surface('lab', '#d69e47', { gloss: 0.6, spec: 0.45 }),
    DialFace: K.surface('lab', '#f2e3b0', { gloss: 0.3, spec: 0.2 }),
    NozzleGlow: new THREE.MeshBasicMaterial({ color: 0xffa040 }),
    WarnLamp: new THREE.MeshBasicMaterial({ color: 0xff5c1a }),
  };
  glbPromises.push(
    mountGlb('radar_device.glb', radarAnchor, radarMats, true, 'lab').then((loaded) => {
      if (!loaded) {
        const console = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 0.8), K.surface('lab', '#5a5a62', { gloss: 0.4, spec: 0.3 }));
        console.position.y = 0.6;
        outline(console, { width: 0.022 });
        radarAnchor.add(console);
        const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.6), new THREE.MeshBasicMaterial({ color: 0xff8a4a }));
        nozzle.rotation.z = Math.PI * 0.5;
        nozzle.position.set(0.8, 0.8, 0);
        radarAnchor.add(nozzle);
      }
    })
  );

// Kettle with EXPLICIT mat overrides
// R6-4: A49's unlit pin #c2c6c9 READS #d5d8d5 (post gain/gamma lift). Local slope
// from the two measured points (choc R 74->87, kettle R 194->213) is ~1.05 (B ~1.10);
// inverting gives body #b0b5be -> read ~#c2c6c9 mid-grey. Unlit => the S11 close
// key light cannot blow it out.
// A62 CRASH FIX: outline() does mesh.add(hull); mutating inside a live traverse
// recursed unboundedly. COLLECT FIRST, then pin, then outline over the ARRAY.
const kettleMats = {
  KettleMetal: new THREE.MeshBasicMaterial({ color: 0xb0b5be }),
  KettleDark: new THREE.MeshBasicMaterial({ color: 0x2e2a27 }),
  KettleBrass: new THREE.MeshBasicMaterial({ color: 0xd9a54d }),
};
glbPromises.push(
  mountGlb('kettle.glb', kettleAnchor, kettleMats, false, 'lab').then((loaded) => {
    if (!loaded) {
      const kettleBody = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.5), new THREE.MeshBasicMaterial({ color: 0xb0b5be }));
      kettleBody.position.y = 0.25;
      kettleAnchor.add(kettleBody);
      const kettleLid = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.26, 0.1), new THREE.MeshBasicMaterial({ color: 0xa4aab4 }));
      kettleLid.position.y = 0.55;
      kettleAnchor.add(kettleLid);
      const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.3), new THREE.MeshBasicMaterial({ color: 0xb0b5be }));
      spout.rotation.z = Math.PI * 0.5;
      spout.position.set(0.35, 0.3, 0);
      kettleAnchor.add(spout);
    }
    const kettleMeshes = [];
    kettleAnchor.traverse((o) => { if (o.isMesh && !o.userData.noOutline) kettleMeshes.push(o); });
    const orig = [];
    for (const o of kettleMeshes) {
      orig.push((o.material && o.material.name) || o.name || '?');
      const nm = ((o.material && o.material.name) || o.name || '').toLowerCase();
      let hex = 0xb0b5be;
      if (/dark|handle|knob|wood|grip/.test(nm)) hex = 0x2e2a27;
      else if (/brass|band|trim|ring/.test(nm)) hex = 0xd9a54d;
      else if (/lid|cap/.test(nm)) hex = 0xa4aab4;
      o.material = new THREE.MeshBasicMaterial({ color: hex });
    }
    for (const o of kettleMeshes) outline(o, { width: 0.016 });
    console.log(`[R6-4] kettle re-pin: ${kettleMeshes.length} mesh(es) unlit mid-grey; orig materials: ${orig.join(', ')}`);
  })
);

  // Wave box with EXPLICIT mat overrides
  const boxMats = {
    BoxIron: K.surface('lab', '#61666b', { gloss: 0.6, spec: 0.4 }),
    BoxDark: K.surface('lab', '#2b2b2e', { gloss: 0.45, spec: 0.3 }),
    BoxSeam: K.surface('lab', '#a8753d', { gloss: 0.5, spec: 0.35 }),
    BoxGlow: new THREE.MeshBasicMaterial({ color: 0xffa842 }),
  };
  glbPromises.push(
    mountGlb('wave_box.glb', waveBoxMount, boxMats, true, 'lab').then((loaded) => {
      if (!loaded) {
        const boxBody = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.6), K.surface('lab', '#4a4a52', { gloss: 0.3, spec: 0.2 }));
        boxBody.position.y = 0.35;
        outline(boxBody, { width: 0.022 });
        waveBoxMount.add(boxBody);
        const boxDoor = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.05), K.surface('lab', '#3a3a42', { gloss: 0.4, spec: 0.3 }));
        boxDoor.position.set(0, 0.35, 0.325);
        waveBoxMount.add(boxDoor);
      }
    })
  );

// Giant oven (place show) — gamma-corrected fallback. R11-6/F7: mount UNCHANGED;
// the tag pivot is seated on the branch's crown east-front corner after it resolves.
glbPromises.push(
mountGlb('giant_oven.glb', ovenAnchor, {}, true, 'show').then((loaded) => {
if (!loaded) {
const ovenBody = new THREE.Mesh(new THREE.BoxGeometry(3, 2.8, 2), K.surface('show', '#e8e8f0', { gloss: 0.5, spec: 0.4 }));
ovenBody.position.y = 1.4;
outline(ovenBody, { width: 0.022 });
ovenAnchor.add(ovenBody);
const ovenDoor = new THREE.Mesh(new THREE.BoxGeometry(2, 1.8, 0.1), K.surface('show', '#2a2a2a', { gloss: 0.6, spec: 0.5 }));
ovenDoor.position.set(0, 1, 1.05);
ovenAnchor.add(ovenDoor);
const ovenWindow = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 0.05), new THREE.MeshBasicMaterial({ color: 0x2a2a2a }));
ovenWindow.position.set(0, 1.2, 1.08);
ovenAnchor.add(ovenWindow);
}
const p = loaded ? TAG_PIVOT_GLB : TAG_PIVOT_FALLBACK;
tagPivot.position.set(p[0], p[1], p[2]);
tagArm.position.set(p[0], p[1], p[2] + 0.125);
console.log(`[R11-6] tag pivot branch=${loaded ? 'glb' : 'fallback'} show-local=[${p.join(',')}]`);
})
);

// Scale (place show) — gamma-corrected fallback. R11-5/F6: the mount is UNCHANGED;
// the needle + plaque are seated on the branch's REAL dial after it resolves.
glbPromises.push(
mountGlb('scale.glb', scaleAnchor, {}, true, 'show').then((loaded) => {
if (!loaded) {
const scaleBase = new THREE.Mesh(new THREE.BoxGeometry(1, 0.2, 0.8), K.surface('show', '#6a6a72', { gloss: 0.5, spec: 0.4 }));
scaleBase.position.y = 0.1;
outline(scaleBase, { width: 0.022 });
scaleAnchor.add(scaleBase);
const scalePlat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.6), K.surface('show', '#8a8a92', { gloss: 0.6, spec: 0.5 }));
scalePlat.position.y = 0.225;
scaleAnchor.add(scalePlat);
const scalePost = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6), K.surface('show', '#5a5a62', {}));
scalePost.position.set(0.35, 0.5, 0);
scaleAnchor.add(scalePost);
const scaleDial = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.05), new THREE.MeshBasicMaterial({ color: 0xf0f0ff }));
scaleDial.rotation.x = Math.PI * 0.5;
scaleDial.position.set(0.35, 0.75, 0);
scaleAnchor.add(scaleDial);
}
// --- R11-5 needle seat -------------------------------------------------------
const c = loaded ? SCALE_DIAL_CENTER_GLB : SCALE_DIAL_CENTER_FALLBACK;
SCALE_DIAL_CENTER[0] = c[0]; SCALE_DIAL_CENTER[1] = c[1]; SCALE_DIAL_CENTER[2] = c[2];
scaleNeedlePivot.position.set(c[0], c[1], c[2]);
let baked = null;
if (loaded) {
scaleAnchor.traverse((o) => { if (!baked && o.isMesh && /^scaleneedle$/i.test(o.name || '')) baked = o; });
}
if (baked) {
// GLB nodes carry NO transforms (§5.11) and the geometry is baked in anchor
// coords, so the mesh spins about the ANCHOR ORIGIN unless it is re-parented.
// Offset by (wrapper translation - centre) so pivot.rotation.z is a rotation
// about the dial centre and the needle's world placement is unchanged at rest.
scaleAnchor.updateWorldMatrix(true, true);
baked.updateWorldMatrix(true, false);
const wp = new THREE.Vector3().setFromMatrixPosition(baked.matrixWorld);
const ap = new THREE.Vector3().setFromMatrixPosition(scaleAnchor.matrixWorld);
if (baked.parent) baked.parent.remove(baked);
baked.position.set(wp.x - ap.x - c[0], wp.y - ap.y - c[1], wp.z - ap.z - c[2]);
scaleNeedlePivot.add(baked);
scaleNeedleBar.visible = false;
scaleNeedleHub.visible = false;
scaleNeedleRoute = 'baked';
} else {
const len = loaded ? 0.70 : 0.125;   // GLB: 0.80 * R_dial 0.88; fallback: dial r 0.15
const wid = loaded ? 0.055 : 0.018;
scaleNeedleBar.scale.set(wid, len, loaded ? 0.030 : 0.010);
scaleNeedleBar.position.set(0, len / 2, loaded ? 0.12 : 0);
scaleNeedleBar.visible = true;
scaleNeedleHub.scale.set(loaded ? 0.10 : 0.032, loaded ? 0.10 : 0.032, 0.012);
scaleNeedleHub.position.set(0, 0, loaded ? 0.13 : 0.004);
scaleNeedleHub.visible = true;
scaleNeedleRoute = loaded ? 'code-glb' : 'code-fallback';
}
// --- R11-5 plaque seat -------------------------------------------------------
if (loaded) {
// GLB: two-line plate west of the Column (x 1.175..1.525) and above Deck 0.27,
// dead-centre of C1's 47.10 key. anchor-local (-0.40,0.90,0) -> show (2.60,0.90,1.0).
kgPlaque.position.set(3 - 0.40, 0.90, 1 + 0.0);
kgPlate.scale.set(1.00, 0.95, 0.05);
kgLeg.scale.set(0.07, 0.425, 0.07);
kgLeg.position.set(0, -0.6875, -0.01);
kgTextOne.visible = false; kgTextTwo.visible = true;
} else {
// Fallback: Neon item 1 placement, single line.
kgPlaque.position.set(3 + 0.35, 0.42, 1 + 0.43);
kgPlate.scale.set(1.90, 0.52, 0.05);
kgLeg.scale.set(0.07, 0.16, 0.07);
kgLeg.position.set(0, -0.34, -0.01);
kgTextOne.visible = true; kgTextTwo.visible = false;
}
console.log(`[R11-5] scale branch=${loaded ? 'glb' : 'fallback'} needle=${scaleNeedleRoute} centre=[${c.join(',')}] plaque=[${kgPlaque.position.toArray().join(',')}]`);
})
);

// ===== R11 UPDATE — owns bag / waves / rub / box anchor+FX / S19 number props / steam =====
function r11Update(t) {
// --- R11-1 corn bag (state = C1 f1) ---
const b = cornBagState(t);
bagGrp.visible = b.vis;
bagShadow.visible = b.vis && b.placed;
if (b.vis) {
bagGrp.position.set(b.pos[0], b.pos[1], b.pos[2]);
bagGrp.rotation.set(0, b.rotY, b.tilt);
bagGrp.scale.set(1, b.squash, 1);
}
// --- R11-2 S14 waves. F3: rings travel at y 3.0. A94 adoption: the front keeps
// CROSSING the molecule through the macro (travel to +1.05, macro opacity term). ---
const w = wavePhaseState(t);
waveGrp.visible = w.on;
if (w.on) {
for (let i = 0; i < s14Ribbons.length; i++) {
const r = s14Ribbons[i];
r.material.opacity = 0.9 * w.emit + 0.4 * w.macro;
r.scale.x = 1 + 0.04 * Math.sin(t * 9 + i);
}
for (let i = 0; i < s14Rings.length; i++) {
const ring = s14Rings[i];
const p = (w.flow + i / 4) % 1;
ring.position.set(-2.45 + p * 3.5, 3.0, 0);
ring.scale.setScalar(0.4 + p * 1.9);
ring.material.opacity = (1 - p) * (0.85 * w.emit + 0.60 * w.macro);
}
s14Impact.material.opacity = w.macro * 0.5 * w.pulse;
s14Impact.scale.setScalar(1 + 0.25 * w.pulse);
}
// --- R11-3 hand rub (antiphase slide; y component makes it read head-on) ---
const h = handRubState(t);
rubGrp.visible = h.on;
if (h.on) {
rubL.position.z = h.slide; rubR.position.z = -h.slide;
rubL.position.y = h.slide * 0.22; rubR.position.y = -h.slide * 0.22;
rubL.rotation.z = h.wob; rubR.rotation.z = -h.wob;
rubGlow.material.opacity = 0.55 * h.energy;
rubGlow.scale.setScalar(0.6 + h.energy * (0.7 + 0.3 * Math.sin(t * 20)));
for (let i = 0; i < rubHeat.length; i++) {
const s = rubHeat[i];
s.material.opacity = h.heat * 0.8;
s.position.y = 0.5 + ((t * 0.5 + i * 0.07) % 0.2);
}
}
// --- R11-4 box: F5 anchor ownership + FX beats (state = C1 f2) ---
const bs = boxBuildState(t);
waveBoxAnchor.visible = bs.assemble > 0.001;
waveBoxAnchor.scale.setScalar(Math.max(bs.assemble, 0.0001));
doorGrp.rotation.y = -(1 - bs.door) * 1.75;
torch.position.set(bs.weldX, 0.66, 0.34);
torch.material.opacity = bs.weld;
boxSparks.group.position.x = bs.weldX;
boxSparks.update(t, bs.weld);
boxGlowPlane.material.opacity = bs.glow * (0.55 + 0.35 * bs.pulse);
boxSeam.material.opacity = bs.glow * 0.8 * bs.pulse;
for (let i = 0; i < boxRibbons.length; i++) {
const r = boxRibbons[i];
r.material.opacity = bs.glow * 0.9;
r.scale.x = 1 + 0.1 * Math.sin(t * 12 + i * 2);
}
// --- R11-5/6 S19 number props: HIDDEN outside S19 (anchors never gated) ---
const s19PropsOn = t >= T_TALL && t < T_TODAY;
const sc = scaleState(t);
scaleNeedlePivot.visible = s19PropsOn;
kgPlaque.visible = s19PropsOn;
scaleNeedlePivot.rotation.z = sc.needle;
kgPlaque.scale.setScalar(1 + 0.06 * sc.pulse);
const tg = tagState(t);
tagPivot.visible = s19PropsOn && tg.vis;
tagArm.visible = s19PropsOn && tg.vis;
tagPivot.rotation.x = tg.angle;
tagPivot.rotation.y = (1 - tg.faceOn) * Math.PI / 2 + tg.sway * tg.faceOn;
// --- D7 steam wisps (foodVoidAnchor.visible is still owned by the S16 lines) ---
const wispOn = t >= T_INOUT - 0.01 && t < T_BOX + 0.3;
for (let i = 0; i < foodWisps.length; i++) {
const wp = foodWisps[i];
const ph = ((t - T_INOUT) * 0.42 + i / foodWisps.length) % 1;
wp.material.opacity = wispOn ? 0.28 * Math.sin(ph * Math.PI) : 0;
wp.position.y = ph * 0.16;
wp.scale.setScalar(0.85 + ph * 0.35);
}
}

  // Pocket chocolate (Blender GLB) — gamma-corrected fallback materials
  // PHASE-2 colour fix: without overrides the mountGlb gamma fallback washes
  // the bar out to pale cream. First attempt used lit K.surface browns, but
  // under the lab rig's combined key+lamp power they still blow out to cream
  // (proof still S01, 2026-11-21). Unlit MeshBasic pins the exact browns —
  // the same treatment the old code-built bar used (#4a2410 / #5a2c12) and
  // the same pattern as the A12 F1 yolk fix.
  const chocMats = {
    ChocDark: new THREE.MeshBasicMaterial({ color: 0x4a2410 }),
    ChocMelt: new THREE.MeshBasicMaterial({ color: 0x5a2c12 })
  };
// R8-1: after the bar mounts, seat the VISIBLE stub's bottom exactly on the
// pocket mouth (seat-local y=0), measured from the GLB's own bounds — no
// assumed bar height. Seat transform is saved/restored around the measurement.
glbPromises.push(mountGlb('chocolate.glb', chocMount, chocMats, false, 'lab').then(() => {
  const saveP = pocketChocolate.position.clone();
  const saveQ = pocketChocolate.quaternion.clone();
  pocketChocolate.position.set(0, 0, 0);
  pocketChocolate.quaternion.identity();
  pocketChocolate.updateWorldMatrix(true, true);
  const b = new THREE.Box3().setFromObject(chocStub);
  if (!b.isEmpty()) {
    chocStub.position.y -= b.min.y; // labGrp sits at LAB_X=0 with no y offset
    console.log(`[R8-1] bar stub calibrated: bottom ${b.min.y.toFixed(3)} -> mouth 0.000; visible ${POCKET_VISIBLE} of the bar`);
  } else {
    console.warn('[R8-1] chocolate.glb produced no bounds — stub left at its authored seat');
  }
  pocketChocolate.position.copy(saveP);
  pocketChocolate.quaternion.copy(saveQ);
  pocketChocolate.updateWorldMatrix(true, true);
}));

  // Lab dressing (Blender GLBs) — gamma-corrected fallback materials;
  // emissive parts (ScopeGlow, LampGlow, YolkGlow) resolve to MeshBasic via mountGlb.
  // ROUND-3 (A31-M5): every dressing mount now carries a simple CODE FALLBACK
  // so a missing GLB degrades to a shape, never to a silent blank anchor.
  const withFb = (promise, build) => glbPromises.push(promise.then((loaded) => { if (!loaded) build(); }));
  const fbBox = (grp, w, h, d, color, y) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), K.surface('lab', color, { gloss: 0.35, spec: 0.25 }));
    m.position.y = y;
    grp.add(m);
  };
  withFb(mountGlb('osc_scope.glb', oscScopeAnchor, {}, false, 'lab'), () => fbBox(oscScopeAnchor, 0.7, 0.5, 0.5, '#3a4148', 0.25));
  withFb(mountGlb('papers.glb', papersAnchor, {}, false, 'lab'), () => fbBox(papersAnchor, 0.5, 0.06, 0.4, '#e8e2d0', 0.03));
  // ROUND-3 (F24): the mug's white enamel rendered detail-free — pinned to a
  // muted steel blue so it reads as a vessel on the bench. Hex PRE-DARKENED
  // (target^2.2, see the bowl note): a straight #4f6f7e pin rendered pale
  // #96afb9 in the S11/S12 proof stills; #132936 lands at ≈ #4f6f7e.
  withFb(mountGlb('mug.glb', mugAnchor, { MugEnamel: K.surface('lab', '#132936', { gloss: 0.35, spec: 0.25 }) }, false, 'lab'), () => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.22, 14), K.surface('lab', '#4f6f7e', { gloss: 0.35, spec: 0.25 }));
    m.position.y = 0.11;
    mugAnchor.add(m);
  });
  // ROUND-3 (F23): the bowl's salmon sliver. GLB materials (verified from
  // the file): BowlRed = base + wall (the visible exterior), BowlCream =
  // rim only, BowlInner = inner disc. NOTE the look pipeline gamma-LIFTS
  // K.surface colours (the same washout phase-2 documented for the
  // chocolate): a #8c1d12 pin rendered #f6b07d peach (pixel-sampled from
  // the S09 proof still). The hexes below are therefore PRE-DARKENED
  // (target^2.2) so the rendered bowl lands in the deep-red family:
  // exterior -> #8c1d12, rim -> #a52a18, interior -> #571209.
  withFb(mountGlb('popcorn_bowl.glb', popcornAnchor, {
    BowlRed: K.surface('lab', '#440201', { gloss: 0.35, spec: 0.25 }),
    BowlCream: K.surface('lab', '#590601', { gloss: 0.35, spec: 0.25 }),
    BowlInner: K.surface('lab', '#1c0100', { gloss: 0.3, spec: 0.2 }),
    BowlInnerDisc: K.surface('lab', '#1c0100', { gloss: 0.3, spec: 0.2 }),
  }, false, 'lab'), () => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.2, 0.26, 16), K.surface('lab', '#8c1d12', { gloss: 0.35, spec: 0.25 }));
    m.position.y = 0.13;
    popcornAnchor.add(m);
  });
  // A12 F1: YolkGlow's weak Blender emissive trips the mountGlb flat-fallback
  // and renders dull brown; pin it as a bright MeshBasic yolk.
  withFb(mountGlb('egg.glb', eggAnchor, { YolkGlow: new THREE.MeshBasicMaterial({ color: 0xffa028 }) }, false, 'lab'), () => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), K.surface('lab', '#f2ead8', { gloss: 0.35, spec: 0.2 }));
    m.scale.set(1, 1.25, 1);
    m.position.y = 0.16;
    eggAnchor.add(m);
  });
// D7: food pins changed MeshBasic -> K.surface MATTE (Neon item 10): skin dark
// #5c3c1a, flesh pale #d4b46a, core deepest-warm #e8c47a — the heat-gradient READ
// (skin dark / flesh pale / core warm) survives, the "lamp" specular does not.
// Steam route (§0): the GLB's Steam0..Steam6 (all mat SteamPale) are HIDDEN by
// name post-mount and replaced by the code-built TubeGeometry wisps in the void.
withFb(mountGlb('food_cutaway.glb', foodVoidAnchor, {
PotatoSkin: K.surface('micro', '#5c3c1a', { gloss: 0.15, spec: 0.08 }),
FleshPale:  K.surface('micro', '#d4b46a', { gloss: 0.12, spec: 0.06 }),
FleshDeep:  K.surface('micro', '#e8c47a', { gloss: 0.10, spec: 0.05 }),
}, false, 'micro').then((loaded) => {
if (loaded) {
let hidden = 0;
foodVoidAnchor.traverse((o) => {
if (!o.isMesh) return;
const nm = (o.name || '').toLowerCase();
const mn = ((o.material && o.material.name) || '').toLowerCase();
if (/^steam[0-6]$/.test(nm) || mn === 'steampale') { o.visible = false; hidden++; }
});
console.log(`[D7] food_cutaway: ${hidden} authored steam mesh(es) hidden; code wisps own the steam`);
}
return loaded;
}), () => {
const skin = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 16), K.surface('micro', '#5c3c1a', { gloss: 0.15, spec: 0.08 }));
skin.scale.set(1.15, 0.8, 0.7); skin.position.y = 0.3; foodVoidAnchor.add(skin);
const flesh = new THREE.Mesh(new THREE.SphereGeometry(0.30, 16, 16), K.surface('micro', '#d4b46a', { gloss: 0.12, spec: 0.06 }));
flesh.scale.set(1.12, 0.76, 0.62); flesh.position.set(0, 0.3, 0.05); foodVoidAnchor.add(flesh);
const core = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 14), K.surface('micro', '#e8c47a', { gloss: 0.10, spec: 0.05 }));
core.scale.set(1.2, 0.8, 0.5); core.position.set(0, 0.3, 0.16); foodVoidAnchor.add(core);
for (let i = 0; i < 5; i++) {
const eye = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), K.surface('micro', '#c9a86a', { gloss: 0.12, spec: 0.06 }));
eye.scale.set(1, 0.7, 0.4);
eye.position.set(-0.18 + i * 0.09, 0.22 + (i % 2) * 0.16, 0.20);
foodVoidAnchor.add(eye);
}
});
  // ROUND-3 (R3-6): the magnetron feed appears at S17's start (update()
  // gates it); its copper pinned so the drop reads over the box.
  withFb(mountGlb('magnetron_feed.glb', feedAnchor, { FeedCopper: new THREE.MeshBasicMaterial({ color: 0x9a5f2a }) }, false, 'lab'), () => fbBox(feedAnchor, 0.3, 0.5, 0.3, '#9a5f2a', 0));
  withFb(mountGlb('desk_lamp.glb', deskLampAnchor, {}, false, 'lab'), () => fbBox(deskLampAnchor, 0.3, 0.5, 0.3, '#4a4a52', 0.25));
  withFb(mountGlb('tool_rack.glb', toolRackAnchor, {}, false, 'lab'), () => fbBox(toolRackAnchor, 1.4, 0.9, 0.1, '#5a4a38', 0));
  withFb(mountGlb('shelf_jars.glb', shelfAnchor, {}, false, 'lab'), () => fbBox(shelfAnchor, 1.6, 0.08, 0.4, '#6a5a44', 0));
// R8-3: hands are scene geometry (kept), but they must sit on the GLB DIAL, not
// on clockAnchor's origin — the probe measured the dial centre ~0.37u above it.
// After the mount resolves: log every mesh name, measure the dial's WORLD bbox,
// re-centre pivots+pin onto its front-face centre (anchor-local), hide any
// separate baked hands by name AND by geometry, and COVER the dial with a
// code-built face (the baked ~10:10 pair is painted in, so hiding cannot remove
// it). Pivots stay DIRECT children of clockAnchor so update()'s lookup is intact.
const clockHourPivot = new THREE.Group();
clockHourPivot.userData = { kind: 'hour' };
clockHourPivot.position.set(0, 0, 0.12);
clockAnchor.add(clockHourPivot);
{
  const hourHand = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.24, 12), new THREE.MeshBasicMaterial({ color: 0x2a2a36 }));
  hourHand.position.y = 0.12;
  hourHand.userData = { r4hand: true };
  clockHourPivot.add(hourHand);
}
const clockMinPivot = new THREE.Group();
clockMinPivot.userData = { kind: 'minute' };
clockMinPivot.position.set(0, 0, 0.13);
clockAnchor.add(clockMinPivot);
{
  const minHand = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.36, 12), new THREE.MeshBasicMaterial({ color: 0x6a6a7a }));
  minHand.position.y = 0.18;
  minHand.userData = { r4hand: true };
  clockMinPivot.add(minHand);
}
const clockPin = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 10), new THREE.MeshBasicMaterial({ color: 0x1c1c24 }));
clockPin.position.set(0, 0, 0.14);
clockPin.userData = { r4hand: true };
clockAnchor.add(clockPin);
glbPromises.push(
  mountGlb('wall_clock.glb', clockAnchor, {}, false, 'lab').then((loaded) => {
    if (!loaded) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.06, 20), K.surface('lab', '#e8e8f0', { gloss: 0.4, spec: 0.3 }));
      m.rotation.x = Math.PI * 0.5;
      m.name = 'FallbackDial';
      clockAnchor.add(m);
    }
    // COLLECT FIRST — never mutate inside a live traverse (R4-5 / R6-4 lesson).
    clockAnchor.updateWorldMatrix(true, true);
    const clockMeshes = [];
    clockAnchor.traverse((o) => { if (o.isMesh && !o.userData.r4hand && !o.userData.r8face) clockMeshes.push(o); });
    const tb = new THREE.Box3();
    const names = [];
    let dial = null, bestScore = -1;
    for (const m of clockMeshes) {
      if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
      tb.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld);
      const s = tb.getSize(new THREE.Vector3());
      names.push(`${m.name || '(unnamed)'}[${(m.material && m.material.name) || '?'}] ${s.x.toFixed(3)}x${s.y.toFixed(3)}x${s.z.toFixed(3)}`);
      const nameHit = /dial|face|plate|disc|clock/i.test(m.name || '');
      const score = s.x * s.y * (nameHit ? 4 : 1);
      if (score > bestScore) { bestScore = score; dial = { mesh: m, box: tb.clone(), size: s.clone() }; }
    }
    console.log(`[R8-3] wall_clock meshes(${clockMeshes.length}): ${names.join(' | ')}`);
    if (!dial) { console.warn('[R8-3] no dial mesh found — hands stay at the anchor origin'); return; }
    const centre = dial.box.getCenter(new THREE.Vector3());
    const radius = Math.max(dial.size.x, dial.size.y) * 0.5;
    const frontWorld = new THREE.Vector3(centre.x, centre.y, dial.box.max.z);
    const lc = clockAnchor.worldToLocal(frontWorld.clone());
    let hidden = 0;
    for (const m of clockMeshes) {
      if (m === dial.mesh) continue;
      if (/hand|hour|minute|needle|pointer/i.test(m.name || '')) { m.visible = false; hidden++; continue; }
      tb.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld);
      const s = tb.getSize(new THREE.Vector3());
      const c = tb.getCenter(new THREE.Vector3());
      const onFace = Math.hypot(c.x - centre.x, c.y - centre.y) < radius * 0.95;
      const thin = s.z < radius * 0.35;
      const small = Math.max(s.x, s.y) < radius * 1.7 && Math.min(s.x, s.y) < radius * 0.5;
      const proud = tb.max.z > dial.box.max.z - 0.005;
      if (onFace && thin && small && proud) { m.visible = false; hidden++; }
    }
    // Code-built dial face (unlit map = the proven oven-nameplate pattern), proud of
    // the baked art, BEHIND the scene hands. Covers the painted ~10:10 pair.
    const dialTex = makeTex(THREE, 512, 512, (g, W, H) => {
      g.fillStyle = '#b8b2a4'; g.fillRect(0, 0, W, H);
      g.strokeStyle = '#8e887c'; g.lineWidth = 10;
      g.beginPath(); g.arc(W / 2, H / 2, W * 0.47, 0, Math.PI * 2); g.stroke();
      g.strokeStyle = '#2a2622';
      for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6;
        const r0 = W * 0.40, r1 = W * (i % 3 === 0 ? 0.33 : 0.365);
        g.lineWidth = i % 3 === 0 ? 12 : 6;
        g.beginPath();
        g.moveTo(W / 2 + Math.sin(a) * r0, H / 2 - Math.cos(a) * r0);
        g.lineTo(W / 2 + Math.sin(a) * r1, H / 2 - Math.cos(a) * r1);
        g.stroke();
      }
      g.fillStyle = '#2a2622';
      g.font = 'bold 62px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('12', W / 2, H * 0.20);
      g.fillText('3', W * 0.80, H / 2);
      g.fillText('6', W / 2, H * 0.80);
      g.fillText('9', W * 0.20, H / 2);
    }, false);
    const faceDisc = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.90, 48), new THREE.MeshBasicMaterial({ map: dialTex }));
    faceDisc.userData = { r8face: true };
    faceDisc.position.set(lc.x, lc.y, lc.z + 0.012);
    clockAnchor.add(faceDisc);
    const k = radius / 0.42; // authored hand lengths assume the 0.42 fallback dial
    clockHourPivot.position.set(lc.x, lc.y, lc.z + 0.026);
    clockMinPivot.position.set(lc.x, lc.y, lc.z + 0.034);
    clockPin.position.set(lc.x, lc.y, lc.z + 0.042);
    clockHourPivot.scale.setScalar(k);
    clockMinPivot.scale.setScalar(k);
    clockPin.scale.setScalar(k);
    console.log(`[R8-3] dial='${dial.mesh.name || '(unnamed)'}' r=${radius.toFixed(3)} centreLocal=(${lc.x.toFixed(3)}, ${lc.y.toFixed(3)}, ${lc.z.toFixed(3)}) scale=${k.toFixed(3)} hidden=${hidden} faceDisc r=${(radius * 0.90).toFixed(3)}`);
  })
);
  withFb(mountGlb('cable_spool.glb', spoolAnchor, {}, false, 'lab'), () => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.5, 16), K.surface('lab', '#7a5a38', { gloss: 0.3, spec: 0.2 }));
    m.position.y = 0.25;
    spoolAnchor.add(m);
  });
  withFb(mountGlb('stool.glb', stoolAnchor, {}, false, 'lab'), () => fbBox(stoolAnchor, 0.6, 0.08, 0.6, '#6a5a44', 0.55));

  // Molecule environment (Blender GLB) — satellite molecules + backdrop disc
  withFb(mountGlb('molecule_env.glb', microEnvAnchor, {}, false, 'micro'), () => {});

// Grid world (Blender GLBs): anchor kitchen + apartment blocks
// ROUND-3 (B5): KitchenDark pinned WARM. D12 (§0 code-side route): the broccoli
// plant is REMOVED by name post-mount (PlantPot / Leaf1..3), and the blown-out
// window pane (mesh WinPane, material WindowGlow) is pinned to a mid-tone unlit
// 0xc8d4dc so it drops below the bloom threshold. No Blender edit this round.
withFb(mountGlb('hero_kitchen.glb', heroKitchenAnchor, {
KitchenDark:  K.surface('grid', '#4a3d2f',  { gloss: 0.40, spec: 0.25 }),
KitchenCab:   K.surface('grid', '#b88c5d',  { gloss: 0.45, spec: 0.28 }),
KitchenCabUp: K.surface('grid', '#c79e6b',  { gloss: 0.45, spec: 0.28 }),
KitchenCounter: K.surface('grid', '#e0d9c7', { gloss: 0.35, spec: 0.20 }),
WindowGlow: new THREE.MeshBasicMaterial({ color: 0xc8d4dc }),
}, true, 'grid').then((loaded) => {
if (loaded) {
let hidden = 0;
heroKitchenAnchor.traverse((o) => {
if (!o.isMesh) return;
const nm = (o.name || '').toLowerCase();
if (nm === 'plantpot' || nm === 'leaf1' || nm === 'leaf2' || nm === 'leaf3') { o.visible = false; hidden++; }
});
console.log(`[D12] hero_kitchen: ${hidden} plant mesh(es) hidden; WindowGlow pinned 0xc8d4dc`);
}
return loaded;
}), () => fbBox(heroKitchenAnchor, 4.35, 2.6, 0.91, '#4a3d2f', 1.3));
for (const a of homeBlockAnchors) {
withFb(mountGlb('home_block.glb', a, {}, false, 'grid'), () => fbBox(a, 5.5, 7.92, 1.3, '#3a3630', 3.96));
}

  // ========== ROUND-3 TRACK A PROPS (manifest: out/board/ROUND3A_REPORT.md) ==========
  // Charcoal panel — dark slab behind the kettle (R3-3 backdrop).
  withFb(mountGlb('charcoal_panel.glb', panelAnchor, {}, false, 'lab'), () => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 0.06), K.surface('lab', '#17181c', { gloss: 0.2, spec: 0.1 }));
    m.position.y = 1.1;
    panelAnchor.add(m);
  });
  // Horn mast extension — HornGlow pinned to R3-2's dull-amber ceiling
  // (<= 0.35 value): a bright tip would steal S05's eye line.
  withFb(mountGlb('horn_mast_ext.glb', mastAnchor, { HornGlow: new THREE.MeshBasicMaterial({ color: 0x7a4d16 }) }, false, 'lab'), () => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.09, 10), K.surface('lab', '#3a4046', { gloss: 0.4, spec: 0.3 }));
    pole.position.y = 1.04;
    mastAnchor.add(pole);
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.48, 14), K.surface('lab', '#565e64', { gloss: 0.4, spec: 0.3 }));
    horn.rotation.x = Math.PI * 0.5;
    horn.position.set(0, 1.92, 0.21);
    mastAnchor.add(horn);
  });
  withFb(mountGlb('vacuum_tube_rack.glb', tubeRackAnchor, {}, false, 'lab'), () => fbBox(tubeRackAnchor, 1.15, 0.45, 0.39, '#4a4238', 0.22));
  withFb(mountGlb('signal_generator.glb', sigGenAnchor, {}, false, 'lab'), () => fbBox(sigGenAnchor, 0.85, 0.53, 0.61, '#3f4a42', 0.27));
  withFb(mountGlb('chalkboard.glb', chalkAnchor, {}, false, 'lab'), () => fbBox(chalkAnchor, 2.4, 1.5, 0.08, '#14161a', 1.2));
  withFb(mountGlb('ceiling_beam.glb', beamAnchor, {}, false, 'lab'), () => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.3, 0.34), K.surface('lab', '#4a4238', { gloss: 0.3, spec: 0.2 }));
    m.position.y = 0.15; // manifest: origin at the underside
    beamAnchor.add(m);
  });
  // Calendars: LAB copy stays on 1945; SHOW copy's 1945 meshes are collected
  // for the update() flip (names per the Track A manifest).
  const cal1945Re = /^(Page|Band|Year|Circle|GridV|GridH)1945/;
  const showCal1945Meshes = [];
  withFb(mountGlb('calendar_1945.glb', labCalAnchor, {}, false, 'lab'), () => fbBox(labCalAnchor, 0.94, 1.16, 0.1, '#e8e2d0', 0));
  glbPromises.push(mountGlb('calendar_1945.glb', showCalAnchor, {}, false, 'show').then((loaded) => {
    if (!loaded) { fbBox(showCalAnchor, 0.94, 1.16, 0.1, '#e8e2d0', 0); return; }
    showCalAnchor.traverse((o) => {
      if (o.isMesh && cal1945Re.test(o.name || '')) showCal1945Meshes.push(o);
    });
  }));
  // Plaque — brass plate fallback carries the numerals as a canvas texture.
  withFb(mountGlb('plaque_1947.glb', plaqueAnchor, {}, false, 'show'), () => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.55, 0.06), K.surface('show', '#8a6f3a', { gloss: 0.5, spec: 0.4 }));
    m.position.y = 0.275;
    plaqueAnchor.add(m);
  });
  withFb(mountGlb('height_gauge.glb', gaugeAnchor, {}, false, 'show'), () => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.9, 3.4, 0.08), K.surface('show', '#e8e2d0', { gloss: 0.3, spec: 0.2 }));
    m.position.y = 1.7;
    gaugeAnchor.add(m);
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.02), new THREE.MeshBasicMaterial({ color: 0xd43a2a }));
    line.position.set(0, 2.9, 0.05);
    gaugeAnchor.add(line);
  });
  withFb(mountGlb('rope_barrier.glb', ropeAnchor, {}, false, 'show'), () => {
    for (const px of [-1.8, -0.6, 0.6, 1.8]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.0, 10), K.surface('show', '#8a6f3a', { gloss: 0.5, spec: 0.4 }));
      post.position.set(px, 0.5, 0);
      ropeAnchor.add(post);
    }
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 3.6, 8), K.surface('show', '#a02323', { gloss: 0.25, spec: 0.15 }));
    rope.rotation.z = Math.PI * 0.5;
    rope.position.y = 0.78;
    ropeAnchor.add(rope);
  });

// ========== CAST MATERIAL OVERRIDES (ROUND-4) ==========
// R4-1 / R4-10: the cast rigs hang under the SCENE (film.js cast:{}), not under
// the set's base.group. buildSet receives `scene` — that is the handle to them.
// A62 telemetry: roots are 'character.engineer' / 'character.mocker'; the chest
// anchor is 'torso' (no pocket node exists).
const MOCKER_HAIR_COLOR = 0x1f1812; // locked near-black (F30)
let mockerHairLocked = false; // retained for splice safety (unused after R6-2)
let hairLockFrames = 0;       // retained for splice safety (unused after R6-2)
let mockerHairDone = false;   // R6-2: latches after the FIRST successful frame
let hairShell = null;         // R6-2: unlit near-black crown shell
let hairShellMode = '';       // 'head-parented' | 'state-driven'
let engineerRigRoot = null;
let mockerRigRoot = null;
let engineerChestAnchor = null;
let castScanDone = false;
let castScanFrames = 0;
let pocketAnchorLogged = false;
const _chestV = new THREE.Vector3();

// Locate the cast roots + the engineer's pocket/chest anchor by name. Retries
// each frame until found (cast may mount after set ready), then latches.
function findCastRoots() {
  if (castScanDone) return;
  if (!engineerRigRoot || !mockerRigRoot) {
    scene.traverse((o) => {
      const n = (o.name || '').toLowerCase();
      if (!engineerRigRoot && /engineer/.test(n)) engineerRigRoot = o;
      if (!mockerRigRoot && /mocker/.test(n)) mockerRigRoot = o;
    });
  }
  if (engineerRigRoot && !engineerChestAnchor) {
    engineerRigRoot.traverse((o) => {
      const n = (o.name || '').toLowerCase();
      if (!engineerChestAnchor && /pocket/.test(n)) engineerChestAnchor = o;
    });
    if (!engineerChestAnchor) {
      engineerRigRoot.traverse((o) => {
        const n = (o.name || '').toLowerCase();
        if (!engineerChestAnchor && /chest|breast|spine2|torso/.test(n)) engineerChestAnchor = o;
      });
    }
  }
  if (engineerRigRoot && mockerRigRoot && engineerChestAnchor) {
    castScanDone = true;
    console.log(`[R4] cast roots: engineer='${engineerRigRoot.name}' mocker='${mockerRigRoot.name}' chest='${engineerChestAnchor.name}'`);
  } else if (++castScanFrames === 900) {
    castScanDone = true;
    console.warn(`[R4] cast scan gave up after 900 frames (engineer=${!!engineerRigRoot} mocker=${!!mockerRigRoot} chest=${!!engineerChestAnchor}) — fallbacks active`);
  }
}

  const ready = Promise.all(glbPromises);

  // Grid palette variation (bench refinement): each home_block cell gets one
  // of 6 warm domestic palette tints, chosen by a SEEDED rng with NO identical
  // neighbours (a repeating cycle would read as wallpaper). Materials are
  // cloned per mesh before tinting so shared/cached surfaces can't leak a
  // tint into the next cell. The anchor kitchen is deliberately NOT tinted —
  // it stays the warm reference home.
  ready.then(() => {
    const palettes = [
      [1.06, 0.98, 0.86], // cream
      [0.92, 1.02, 0.88], // sage
      [1.08, 0.92, 0.78], // muted yellow
      [1.05, 0.88, 0.80], // terracotta
      [0.90, 0.96, 1.06], // soft blue
      [1.03, 1.00, 0.94], // warm white
    ];
    const prnd = mkRng(20261121);
    let prev = -1;
    for (const a of homeBlockAnchors) {
      let pi = Math.floor(prnd() * palettes.length);
      if (pi === prev) pi = (pi + 1 + Math.floor(prnd() * (palettes.length - 1))) % palettes.length;
      prev = pi;
      const t = palettes[pi];
      const tint = new THREE.Color(t[0], t[1], t[2]);
      a.traverse((o) => {
        if (o.isMesh && o.material && o.material.color) {
          o.material = o.material.clone();
          o.material.color.multiply(tint);
        }
      });
    }
  });

  // ========== UPDATE FUNCTION ==========
  function update(t) {
    rig.update(t);
    // Radar screen sweep
    const sweepAngle = (t * 1.2) % (Math.PI * 2);
    const g = screenData.g;
    g.fillStyle = '#0a1a1a';
    g.fillRect(0, 0, 512, 512);
    g.strokeStyle = '#1a3a3a';
    g.lineWidth = 2;
    for (let i = 1; i <= 4; i++) {
      g.beginPath();
      g.arc(256, 256, i * 60, 0, Math.PI * 2);
      g.stroke();
    }
    g.beginPath();
    g.moveTo(256, 0); g.lineTo(256, 512);
    g.moveTo(0, 256); g.lineTo(512, 256);
    g.stroke();
    g.strokeStyle = '#4aff8a';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(256, 256);
    g.lineTo(256 + Math.cos(sweepAngle - Math.PI * 0.5) * 240, 256 + Math.sin(sweepAngle - Math.PI * 0.5) * 240);
    g.stroke();
    const rnd = mkRng(Math.floor(t * 2));
    for (let i = 0; i < 5; i++) {
      const blipAngle = rnd() * Math.PI * 2;
      const blipDist = 60 + rnd() * 180;
      g.fillStyle = '#4aff8a';
      g.beginPath();
      g.arc(256 + Math.cos(blipAngle) * blipDist, 256 + Math.sin(blipAngle) * blipDist, 4, 0, Math.PI * 2);
      g.fill();
    }
    screenData.tex.needsUpdate = true;

    // Molecule shake (from T_WAVES onward)
    if (t >= T_WAVES) {
      const shakeAmt = smooth(T_WAVES, T_WAVES + 2, t) * 0.2;
      moleculeGrp.rotation.x = Math.sin(t * 8) * shakeAmt;
      moleculeGrp.rotation.z = Math.cos(t * 9) * shakeAmt;
    }

// Popcorn plume (S08 heating -> S09 eruption). R4-4: a DEDICATED laugh-beat
// flight envelope — kernels are fully AIRBORNE at 21.20, then settle to rest by
// 22.73. M1 kept: bowl/bench rest, one decaying bounce, spin freeze on landing.
{
  const launch = smooth(T_POP, T_POP + 0.5, t); // 0->1 fast burst
  const sU = smooth(T_POP + 1.75, T_POP + 2.95, t); // 21.53 -> 22.73 settle
  const air = launch * (1 - sU); // flight factor (1 at the laugh beat)
  const pop = clamp(launch * 3, 0, 1);
  const teff = t - sU * Math.max(0, t - (T_POP + 2.95)); // spin freezes once landed
  for (let i = 0; i < plumeKernels.length; i++) {
    const m = plumeKernels[i];
    const u = m.userData;
    m.visible = t >= T_POP; // hidden in the bag while heating; rest visible after
    if (!m.visible) continue;
    const arc = Math.sin(launch * Math.PI * 0.5);
    const bob = Math.sin(t * 3 + u.phase) * 0.05 * air;
    const airX = Math.cos(u.ang) * u.rad * (0.4 + 0.6 * launch);
    const airY = arc * u.peak + bob;
    const airZ = Math.sin(u.ang) * u.rad * (0.4 + 0.6 * launch) + u.heroZ * launch;
    let restX, restY, restZ;
    if (i % 5 < 3) {
      restX = Math.cos(u.ang) * u.rad * 0.6;
      restY = 0.05 + (i % 3) * 0.035;
      restZ = Math.sin(u.ang) * u.rad * 0.6;
    } else {
      const bounce = Math.abs(Math.sin((t - T_POP) * 9 + u.phase)) * 0.12 * (1 - sU) * launch;
      restX = Math.cos(u.ang) * (0.38 + (i % 4) * 0.07);
      restY = -0.21 + bounce;
      restZ = Math.sin(u.ang) * (0.38 + (i % 4) * 0.07);
    }
    m.position.set(
      lerp(airX, restX, sU),
      lerp(airY, restY, sU),
      lerp(airZ, restZ, sU)
    );
    const s = (u.dia / 2) * pop;
    m.scale.set(s, s * u.squash, s * 0.92);
    m.rotation.set(teff * u.spin + u.phase, u.phase * 1.7, teff * u.spin * 0.7);
  }
}

    // Kettle + eggs (H1 wiring + R3-4/R3-8): the kettle's state finally
    // drives its body — tremble in S11, a hop at the boom — and the story
    // egg rides the hero's sleeve in, trembles in phase, vanishes at T_BOOM.
    {
const ks = kettleState(t);
let kRot = 0, kY = 1.3;
if (ks === 'trembling') {
  // R4-11: amplitude ramps across the full T_LEAN->T_BOOM build (2.55 s).
  const build = smooth(T_LEAN, T_BOOM, t);
  const amp = 0.006 + 0.016 * build;
  kRot = Math.sin(t * 38) * amp;
  kY = 1.3 + Math.abs(Math.sin(t * 38)) * (0.004 + 0.010 * build);
} else if (ks === 'egg_in') {
  kRot = Math.sin(t * 30) * 0.005;
} else if (ks === 'exploded' && t < T_BOOM + 0.25) {
  const hu = (t - T_BOOM) / 0.25;
  kY = 1.3 + Math.sin(hu * Math.PI) * 0.04;
  kRot = Math.sin(hu * Math.PI) * 0.03;
}
kettleAnchor.rotation.z = kRot;
kettleAnchor.position.y = kY;

      // Bench dressing egg: present for the S09 walk-past, HIDDEN from the
      // egg-placement beat to the end (R3-4 / F27 — S16 included).
      eggAnchor.visible = t < T_EGG;

      // Story egg timeline: sleeve carries it in [T_EGG, +0.55], lowers it
      // half-IN the kettle mouth by +1.15, sleeve withdraws by +1.35.
      const inU = smooth(T_EGG, T_EGG + 0.55, t);
      const downU = smooth(T_EGG + 0.55, T_EGG + 1.15, t);
      const eggOn = t >= T_EGG && t < T_BOOM;
      storyEggGrp.visible = eggOn;
      spareLid.visible = eggOn;
      if (eggOn) {
        let ex = lerp(-4.35, -3.06, inU);
        let ey = lerp(2.30, 2.12, inU);
        let ez = lerp(-3.35, -3.90, inU);
        ey = lerp(ey, 1.92, downU);
        ex = lerp(ex, -2.86, downU);
        ez = lerp(ez, -3.94, downU);
        if (ks === 'trembling') {
          ex += Math.sin(t * 38) * 0.006;
          ey += Math.abs(Math.sin(t * 38)) * 0.006;
        }
        storyEggGrp.position.set(ex, ey, ez);
        if (t >= T_LEAN && t < T_LEAN + 0.35) {
          // S11 sleeve echo: the hero's sleeve withdraws frame-left as the
          // mocker's peer begins (R3-1 beat 1).
          const wu = smooth(T_LEAN, T_LEAN + 0.35, t);
          sleeveGrp.visible = true;
          sleeveGrp.position.set(lerp(-3.45, -4.30, wu), lerp(2.00, 1.95, wu), lerp(-3.80, -3.70, wu));
        } else if (t < T_EGG + 1.35) {
          sleeveGrp.visible = true;
          sleeveGrp.position.set(ex - 0.42, ey + 0.10, ez + 0.05);
        } else {
          sleeveGrp.visible = false;
        }
      } else {
        sleeveGrp.visible = false;
      }
    }

{
  // R4-3: changeover pivots exactly at T_DAY2 (17.34), with a 0.35 s eased sweep.
  const u = smooth(T_DAY2, T_DAY2 + 0.35, t);
  const hourVal = lerp(5 + 20 / 60, 7 + 10 / 60, u);
  const minVal = lerp(20, 70, u); // 20 -> 10 via a forward 300° sweep
  const hourRad = (hourVal % 12) * (Math.PI / 6);
  const minRad = minVal * (Math.PI / 30);
  const h = clockAnchor.children.find(c => c.userData && c.userData.kind === 'hour');
  const mn = clockAnchor.children.find(c => c.userData && c.userData.kind === 'minute');
  if (h) h.rotation.z = -hourRad;
  if (mn) mn.rotation.z = -minRad;
}

// Box build visibility — F5: boxBuildState returns the beat OBJECT; boxVis aliases
// assemble so every retained reader below stays a NUMBER. Anchor visible/scale is
// owned by r11Update (bs.assemble), not here.
const bs = boxBuildState(t);
const boxVis = bs.assemble;
// Magnetron feed (R3-6): the drop happens AT S17 — hidden before T_BOX.
feedAnchor.visible = t >= T_BOX;
// S17 viewport rings pulse on the wave cycle (0.85 s) once the box is
// substantially built; weld sparks jitter in their two windows.
if (boxVis > 0.6) {
const rp = 1 + 0.12 * Math.sin(t * Math.PI * 2 / 0.85);
for (const r of waveRings) r.scale.setScalar(rp);
}
{
const inSpark = (t >= T_BOX + 1.2 && t < T_BOX + 1.8) || (t >= T_BOX + 2.0 && t < T_BOX + 2.4);
// R11-4: the OLD sparkGrp is MUTED for the whole of S17 — the A92 deterministic
// module owns the weld sparks there. The reader keeps working outside S17.
sparkGrp.visible = inSpark && boxVis > 0.2 && !(t >= T_BOX && t < T_COMPANY);
if (sparkGrp.visible) {
const srnd = mkRng(Math.floor(t * 20) + 5);
for (const s of sparkMeshes) {
s.position.set((srnd() - 0.5) * 0.22, (srnd() - 0.5) * 0.10, (srnd() - 0.5) * 0.10);
}
}
}
// Pocket chocolate — R8-1 (F5): the seat is the TRIANGULATED dash point, carried
// on the live 'torso' anchor: +f*POCKET_FORWARD (out onto the painted coat face),
// +l*POCKET_LATERAL (wearer's LEFT = screen-right for S01/S21), -POCKET_DROP.
// The buried part of the bar is not drawn (painted coat = no cavity), so the
// stub + mouth strip + drip below read as a 60%-tucked bar in EVERY view.
// Drip phase mirrored across the S01<->S21 loop via shot-local u.
pocketChocolate.visible = t < T_COLD || (t >= T_HOW && t < T_MOCK) || t >= T_START;
if (pocketChocolate.visible) {
  findCastRoots();
  const es = engineerState(t);
  const faceR = es.face * Math.PI / 180;
  const fx = Math.sin(faceR), fz = Math.cos(faceR);  // facing (world)
  const lx = Math.cos(faceR), lz = -Math.sin(faceR); // wearer's left (world)
  if (engineerChestAnchor) {
    engineerChestAnchor.updateWorldMatrix(true, false);
    engineerChestAnchor.getWorldPosition(_chestV);
    const isPocket = /pocket/i.test(engineerChestAnchor.name || '');
    const fwd = isPocket ? 0 : POCKET_FORWARD;
    const lat = isPocket ? 0 : POCKET_LATERAL;
    const drop = isPocket ? 0 : POCKET_DROP;
    pocketChocolate.position.set(
      _chestV.x + fx * fwd + lx * lat,
      _chestV.y - drop,
      _chestV.z + fz * fwd + lz * lat
    );
    if (!pocketAnchorLogged) {
      pocketAnchorLogged = true;
      console.log(`[R8-1] dash seat: anchor='${engineerChestAnchor.name}' pocket=${isPocket} forward=${POCKET_FORWARD} lateral=${POCKET_LATERAL} drop=${POCKET_DROP} tilt=${POCKET_TILT} visible=${POCKET_VISIBLE}`);
    }
  } else {
    // Fallback: the same triangulated point expressed from the live root.
    pocketChocolate.position.set(
      es.x + fx * 0.258 + lx * 0.183,
      (es.y || 0) + 1.62,
      es.z + fz * 0.258 + lz * 0.183
    );
  }
  pocketChocolate.rotation.set(POCKET_TILT, faceR, 0.06);
  let u = 0.5;
  if (t < T_RADAR) u = clamp((t - T_MELT) / (1.35 - T_MELT), 0, 1);
  else if (t >= T_START) u = clamp((t - T_START) / (END - T_START), 0, 1);
  const drip = smooth(0, 1, u);
  dripTrail.scale.y = 1 + 0.35 * drip;
  dripTrail.position.y = -0.085 - 0.03 * drip;
  smear.position.y = -0.150 - 0.04 * drip;
}

// R6-2: the governing cap colour is engine/character.js's fitted-head hairTint
// default [85,54,34] — NOT cast/mocker.json (already #1f1812) and NOT any
// material .color (rigshade exposes none). That level is outside scenes/.
// Strongest scenes-level reach, on the RENDERED meshes:
//   (1) collect head-subtree meshes FIRST, union their WORLD bounds, and swap
//       materials only on meshes entirely ABOVE the eye line (a combined
//       head/skin mesh reaches the chin -> excluded);
//   (2) parent an unlit near-black crown shell to the head anchor so the cap
//       reads #1f1812 even if the rig re-shades its own materials.
// Face/eyes/yolk/chocolate are structurally out of scope (labGrp is never walked).
findCastRoots();
if (!mockerHairDone && mockerRigRoot) {
  mockerRigRoot.updateWorldMatrix(true, true);
  let headAnchor = null;
  mockerRigRoot.traverse((o) => { if (!headAnchor && /head/i.test(o.name || '')) headAnchor = o; });
  const scope = headAnchor || mockerRigRoot;
  const headMeshes = [];
  scope.traverse((o) => { if (o.isMesh && o.geometry && !o.userData.noOutline) headMeshes.push(o); });
  const union = new THREE.Box3();
  const tb = new THREE.Box3();
  for (const m of headMeshes) {
    if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
    tb.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld);
    union.union(tb);
  }
  const hasBox = !union.isEmpty();
  let swapped = 0;
  if (hasBox) {
    const h = union.max.y - union.min.y;
    const eyeY = union.min.y + 0.58 * h;
    for (const m of headMeshes) {
      const nm = (m.name || '').toLowerCase();
      if (/eye|brow|mouth|lip|teeth|tongue|face|skin|ear|nose|glass/.test(nm)) continue;
      tb.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld);
      const nameHit = /hair|cap|scalp|fringe/.test(nm);
      if (tb.min.y >= eyeY || (nameHit && tb.min.y >= union.min.y + 0.40 * h)) {
        m.material = new THREE.MeshBasicMaterial({ color: MOCKER_HAIR_COLOR });
        swapped++;
      }
    }
  }
  mockerHairDone = true;
  console.log(`[R6-2] hair: head='${headAnchor ? headAnchor.name : 'none'}' meshes=${headMeshes.length} crown-swaps=${swapped} shell=${hairShellMode} bounds=${hasBox ? union.min.y.toFixed(2) + '..' + union.max.y.toFixed(2) : 'none'}`);
}
if (hairShell && hairShellMode === 'state-driven') {
  const ms = mockerState(t);
  const bR = (ms.bend || 0) * Math.PI / 180, lR = (ms.lean || 0) * Math.PI / 180, fR = ms.face * Math.PI / 180;
  const ax = {
    x: Math.sin(fR) * Math.sin(bR) + Math.cos(fR) * Math.sin(lR) * Math.cos(bR),
    y: Math.cos(bR) * Math.cos(lR),
    z: Math.cos(fR) * Math.sin(bR) - Math.sin(fR) * Math.sin(lR) * Math.cos(bR),
  };
  hairShell.position.set(ms.x + ax.x * 2.42, (ms.y || 0) + ax.y * 2.42, ms.z + ax.z * 2.42);
  hairShell.rotation.set(0, fR, 0);
}

    // Splat (F4 / R3-4): from the boom through S13 the decal rides the
    // mocker's face plane — position derived from mockerState(t) each frame
    // (root + torso axis through bend/lean, head centre at axis length
    // HEAD_L, face point pushed out along his facing). HEAD_L is calibrated
    // against the S12 proof still.
    {
      const splatOn = t >= T_BOOM + 0.03 && t < T_WAVES;
      splatGrp.visible = splatOn;
      burstGrp.visible = t >= T_BOOM && t < T_BOOM + 0.4;
      if (splatOn || burstGrp.visible) {
        const ms = mockerState(t);
        // CALIBRATION (proof still S12 at 28.75, visual-grounding measured):
        // the rig's head/look chain does NOT put his face features on the
        // root-yaw facing (-40 in this window) — measured feature centre
        // sits where an effective facing of ≈ -5° (nearly due south, toward
        // the S12 camera) predicts: the analytic -40° point landed 0.63 NDC
        // (≈0.32 world) LEFT of his face, floating beside his head. The
        // splat therefore rides an effective facing of -5°, constant across
        // this window (his state is constant here); head POSITION still
        // comes from the bend/lean axis below.
        const axisRyR = ms.face * Math.PI / 180; // head POSITION uses the real yaw
        const ryR = -5 * Math.PI / 180;          // face OFFSET uses the measured effective facing
        const bendR = (ms.bend || 0) * Math.PI / 180;
        const leanR = (ms.lean || 0) * Math.PI / 180;
        // torso axis: up, tipped by bend toward facing, then by lean sideways
        const ax = {
          x: Math.sin(axisRyR) * Math.sin(bendR) + Math.cos(axisRyR) * Math.sin(leanR) * Math.cos(bendR),
          y: Math.cos(bendR) * Math.cos(leanR),
          z: Math.cos(axisRyR) * Math.sin(bendR) - Math.sin(axisRyR) * Math.sin(leanR) * Math.cos(bendR),
        };
        const HEAD_L = 2.42;
        const hx = ms.x + ax.x * HEAD_L, hy = (ms.y || 0) + ax.y * HEAD_L, hz = ms.z + ax.z * HEAD_L;
        const fx = Math.sin(ryR), fz = Math.cos(ryR);
        const px = hx + fx * 0.56, pz = hz + fz * 0.56;
        if (splatOn) {
          splatGrp.position.set(px, hy, pz);
          splatGrp.rotation.set(0, ryR, 0);
        }
        if (burstGrp.visible) {
          const bu = clamp((t - T_BOOM) / 0.4, 0, 1);
          for (const d of burstDrops) {
            d.position.set(
              lerp(-2.90, px + d.userData.ox * (1 - bu), bu),
              lerp(2.00, hy + d.userData.oy * (1 - bu), bu) + Math.sin(bu * Math.PI) * 0.15,
              lerp(-3.95, pz + d.userData.oz * (1 - bu), bu)
            );
          }
        }
      }
    }

// Breath fog (F18 / R11-9): mouth-anchored to the engineer's headSpace matrix.
// READ ORDER: rig.update(t) is the FIRST line of update() and character.js writes
// headSpace.matrix = headW at the END of its own per-frame update, so by this
// block the matrix is CURRENT-FRAME — Neon's 1-frame-lag risk does not apply.
// headSpace.matrixAutoUpdate = false and .matrix IS the head world matrix
// ("back to the world"); .matrixWorld would double-apply the character root.
// No mouth anchor exists (desk-verified): mouth = head + faceDir*0.55, y -0.12
// (the current proxy's own relationship: y 2.30 vs head centre 2.42).
{
const fogOn = t >= T_COLD && t < T_HOW;
breathGrp.visible = fogOn;
if (fogOn) {
const es = engineerState(t);
const fry = es.face * Math.PI / 180;
const fx = Math.sin(fry), fz = Math.cos(fry);
const head = r11FindHead();
let hx, hy, hz;
if (head) {
_r11HeadV.setFromMatrixPosition(head.matrix);
hx = _r11HeadV.x; hy = _r11HeadV.y; hz = _r11HeadV.z;
} else {
const bR = (es.bend || 0) * Math.PI / 180, lR = (es.lean || 0) * Math.PI / 180;
const axx = Math.sin(fry) * Math.sin(bR) + Math.cos(fry) * Math.sin(lR) * Math.cos(bR);
const axy = Math.cos(bR) * Math.cos(lR);
const axz = Math.cos(fry) * Math.sin(bR) - Math.sin(fry) * Math.sin(lR) * Math.cos(bR);
hx = es.x + axx * 2.42; hy = (es.y || 0) + axy * 2.42; hz = es.z + axz * 2.42;
}
const mx = hx + fx * 0.55, my = hy - 0.12, mz = hz + fz * 0.55;
for (let i = 0; i < breathPuffs.length; i++) {
const puff = breathPuffs[i];
const ph = (((t - T_COLD) / 0.9) + i / 3) % 1;   // 0.9 s cycle, 3 puffs staggered
puff.position.set(mx + fx * (0.04 + ph * 0.42), my + ph * 0.14, mz + fz * (0.04 + ph * 0.42));
const ps = 0.06 + ph * 0.09;                     // 0.06 -> 0.15
puff.scale.set(ps, ps, ps);
puff.material.opacity = 0.24 * (1 - ph) * smooth(0, 0.15, ph);
}
}
}

// R4-8: S16 neutral void — gate the blue molecule env + ambient particles OFF
// for the food window so the neutral disc reads; pulse the glyph band +-10%.
const inS16 = t >= T_INOUT - 0.01 && t < T_BOX + 0.3;
foodVoidAnchor.visible = inS16;
microEnvAnchor.visible = !inS16;
for (const p of microParticles) p.visible = !inS16;
if (inS16) {
  foodArrows.scale.setScalar(1 + 0.10 * Math.sin(t * Math.PI * 2 / 0.8));
}

// R6-6: grounded hero contact + the gated day-2 morning cue (S08's "next day").
{
  const es = engineerState(t);
  heroContact.visible = es.place === 'lab';
  if (heroContact.visible) {
    heroContact.position.set(es.x, 0.018, es.z);
    const crouch = es.pose === 'crouch' ? 1.25 : 1.0;
    heroContact.scale.set(crouch, 1, crouch);
  }
  const mOn = t >= T_DAY2 && t < T_EGG;
  morningGrp.visible = mOn;
  if (mOn) {
    const warm = t < T_POP ? 0.10 : 0.10 + 0.24 * smooth(T_POP, T_POP + 0.5, t);
    morningMat.opacity = warm * (1 - smooth(T_EGG - 0.35, T_EGG, t));
  }
}
// Show calendar flip (R3-7): page turns 1945 -> 1947 at T_COMPANY + 0.2,
// inside S18's opening beat (camera is on the calendar for the first
// ~0.5 s). The LAB calendar never flips.
if (showCal1945Meshes.length) {
const show45 = t < T_COMPANY + 0.2;
for (const m of showCal1945Meshes) m.visible = show45;
}
// R11/C2: bag, S14 waves, S15 rub, box anchor + FX, S19 needle/plaque/tag, steam.
r11Update(t);
// NOTE: look.shading.update(ctx, camera, t) is driven by world/look/post.js — never from here.
}

  return {
    ...base,
    ready,
    marks: {
      // A31-L2: marks must equal the t=0 state positions (engineer stands
      // at LAB_X-5, mocker enters from LAB_X+2) — the old values pointed at
      // empty floor / mid-room.
      engineer_start: [LAB_X - 5, -1.55],
      mocker_start: [LAB_X + 2, -1.55],
    },
    points: {
      radar_device: radarAnchor,
      kettle: kettleAnchor,
      wave_box: waveBoxAnchor,
      giant_oven: ovenAnchor,
      scale: scaleAnchor,
    },
    rig,
    look,
    update,
  };
}
