// scenes/set.js — Story 4 ("الناجي الوحيد من الطابور") Custom Set:
// Place 1 (`market`, [0, 0]): 108 D x 30 D x 10 D Mega-Supermarket Hall (z = -72 .. +36)
//   - Glossy checkered tile floor, acoustic ceiling grid, hanging double-tube fluorescent light bars (alternating pools),
//   - Illuminated hanging Arabic aisle signs (ممر ١, ممر ٢, عروض, خروج), glowing back dairy cooler wall,
//   - Tall stocked supermarket shelving gondolas (cool/muted goods so red_cart & red soup cans pop as anchors),
//   - 4 slow-motion collapsing domino shelf towers (z = -18..-6),
//   - Towering 7-tier soup pyramid -> 42 individually readable cartoon-inked slow-motion mid-air tomato soup cans,
//   - Glowing amber-orange soup-sale neon + swinging industrial pendant lamp,
//   - Frozen stasis props (3.2 D curling floating receipt, floating detergent jug),
//   - 18 wooden/cardboard display crates swept outward at t = 37.65s,
//   - 4 checkout lanes with numbered lanterns + glowing sliding glass storefront doors + spinning red beacon!
// Place 2 (`outer`, [400, 0]): 52 D x 26 D x 10 D Warm Golden Real-World Superstore
//   - Warm terrazzo floor, honey-oak checkout desk/counter (y = 1.35 D) with POS register, green barcode laser & warm brass desk lamp,
//   - THE HERO SNOW GLOBE (snow_globe_dome): tiered mahogany+brass pedestal, Fresnel/specular curved glass sphere,
//     jagged crack + 28 flying glass shards, swirling snow, miniature cyan-lit supermarket diorama inside + miniature clerk +
//     miniature saturated red shopping cart poking straight out of the crack!
//   - 38 D deep warm outer checkout queue receding to golden high-bay ceiling lamps!

import { createLightRig } from '../world/look/lights.js';
import { createPost } from '../world/look/post.js';
import { createRigShade } from '../world/look/rigshade.js';
import { createKit } from '../world/look/rigkit.js';
import { outline } from '../engine/shade.js';
import {
  OUTER_X, T_SOUP_HIT, T_CRATES, T_SHATTER, T_THAW,
  clamp, lerp, smooth, cartState,
} from './motion.js';

// ---- Procedural Canvas Textures (pure, crisp, zero external assets needed) ----
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

function tileFloorTex(THREE) {
  return makeTex(THREE, 512, 512, (g, W, H) => {
    const n = 4, s = W / n;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const alt = (r + c) % 2 === 0;
        g.fillStyle = alt ? '#dce9ee' : '#c6d8e0';
        g.fillRect(c * s, r * s, s, s);
        // Subtle speckled tile sheen
        g.fillStyle = alt ? 'rgba(255,255,255,0.16)' : 'rgba(130,165,180,0.12)';
        g.fillRect(c * s + 6, r * s + 6, s - 12, s - 12);
      }
    }
    g.strokeStyle = 'rgba(72,96,110,0.42)';
    g.lineWidth = 5;
    for (let i = 0; i <= n; i++) {
      g.beginPath(); g.moveTo(0, i * s); g.lineTo(W, i * s); g.stroke();
      g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, H); g.stroke();
    }
  });
}

function ceilingGridTex(THREE) {
  return makeTex(THREE, 512, 512, (g, W, H) => {
    g.fillStyle = '#cad8df';
    g.fillRect(0, 0, W, H);
    g.strokeStyle = '#7e939e';
    g.lineWidth = 8;
    const n = 4, s = W / n;
    for (let i = 0; i <= n; i++) {
      g.beginPath(); g.moveTo(0, i * s); g.lineTo(W, i * s); g.stroke();
      g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, H); g.stroke();
    }
  });
}

function woodCounterTex(THREE) {
  return makeTex(THREE, 512, 512, (g, W, H) => {
    g.fillStyle = '#9c6838';
    g.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 6) {
      const k = Math.sin(y * 0.08) * 14 + Math.cos(y * 0.21) * 7;
      g.fillStyle = `rgba(${115 + k | 0}, ${72 + k * 0.6 | 0}, ${34 + k * 0.3 | 0}, 0.5)`;
      g.fillRect(0, y, W, 4);
    }
    g.strokeStyle = 'rgba(65,36,16,0.35)';
    g.lineWidth = 3;
    for (let i = 1; i < 4; i++) {
      g.beginPath(); g.moveTo(0, i * H / 4); g.lineTo(W, i * H / 4); g.stroke();
    }
  });
}

function outerFloorTex(THREE) {
  return makeTex(THREE, 512, 512, (g, W, H) => {
    g.fillStyle = '#d4bd98';
    g.fillRect(0, 0, W, H);
    const n = 4, s = W / n;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      g.fillStyle = (r + c) % 2 === 0 ? '#dcc6a2' : '#cbb289';
      g.fillRect(c * s + 3, r * s + 3, s - 6, s - 6);
    }
    g.strokeStyle = 'rgba(110,82,52,0.35)';
    g.lineWidth = 5;
    for (let i = 0; i <= n; i++) {
      g.beginPath(); g.moveTo(0, i * s); g.lineTo(W, i * s); g.stroke();
      g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, H); g.stroke();
    }
  });
}

function signTex(THREE, title, bg, fg, accent, fontPx = 92) {
  return makeTex(THREE, 512, 220, (g, W, H) => {
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);
    g.strokeStyle = accent;
    g.lineWidth = 14;
    g.strokeRect(10, 10, W - 20, H - 20);
    g.fillStyle = fg;
    g.font = `900 ${fontPx}px "Segoe UI", Arial, sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(title, W / 2, H / 2 + 4);
  }, false);
}

function soupLabelTex(THREE) {
  return makeTex(THREE, 512, 256, (g, W, H) => {
    // Classic bold crimson-top / crisp-white-bottom tomato soup can label!
    g.fillStyle = '#e6221c';
    g.fillRect(0, 0, W, H * 0.52);
    g.fillStyle = '#faf6ee';
    g.fillRect(0, H * 0.52, W, H * 0.48);
    // Gold dividing belt
    g.fillStyle = '#f2be35';
    g.fillRect(0, H * 0.48, W, H * 0.08);
    // Bold dark cartoon dividing ink lines
    g.fillStyle = '#2b1920';
    g.fillRect(0, H * 0.47, W, 4);
    g.fillRect(0, H * 0.56, W, 4);
    // Two front/back medallions so can reads clearly from ANY rotation angle!
    for (const cx of [W * 0.25, W * 0.75]) {
      g.fillStyle = '#f2be35';
      g.beginPath(); g.arc(cx, H * 0.52, 42, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#2b1920'; g.lineWidth = 5; g.stroke();
      g.fillStyle = '#e6221c';
      g.beginPath(); g.arc(cx, H * 0.52, 28, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#3c8c3a';
      g.fillRect(cx - 5, H * 0.52 - 34, 10, 12);
      g.fillStyle = '#fffaf0';
      g.font = '900 38px Arial Black, sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('SOUP', cx, H * 0.24);
      g.fillStyle = '#c81c18';
      g.font = '900 32px Arial Black, sans-serif';
      g.fillText('TOMATO', cx, H * 0.79);
    }
  }, false);
}

function crateTex(THREE) {
  return makeTex(THREE, 256, 256, (g, W, H) => {
    g.fillStyle = '#c9975a';
    g.fillRect(0, 0, W, H);
    g.strokeStyle = '#754d25';
    g.lineWidth = 14;
    g.strokeRect(8, 8, W - 16, H - 16);
    g.lineWidth = 8;
    for (let y = 64; y < H; y += 64) {
      g.beginPath(); g.moveTo(14, y); g.lineTo(W - 14, y); g.stroke();
    }
    g.fillStyle = '#3d6e47';
    g.fillRect(48, 82, W - 96, 86);
    g.fillStyle = '#fff5d8';
    g.font = '900 38px Arial Black, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('FRESH', W / 2, 126);
  }, false);
}

function receiptTex(THREE) {
  return makeTex(THREE, 128, 512, (g, W, H) => {
    g.fillStyle = '#f8f8f5';
    g.fillRect(0, 0, W, H);
    g.fillStyle = '#333a44';
    g.font = 'bold 18px monospace';
    g.fillText('SUPERMARKET', 8, 28);
    for (let y = 52; y < H - 24; y += 22) {
      g.fillStyle = y % 44 === 0 ? '#2b323c' : '#65707d';
      g.fillRect(10, y, 56 + ((y * 13) % 34), 7);
      g.fillRect(W - 32, y, 22, 7);
    }
  }, false);
}

// ---- Deterministic PRNG ----
const mkRng = seed => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

// ---- Light Rig Data (4-State Colour Script, pure in t) ----
const PLACES = {
  market: {
    sky: [0.36, 0.50, 0.56],
    ground: [0.22, 0.30, 0.35],
    fog: { color: '#1b3540', density: 0.011 },
    ao: { floor: 0, h: 1.5, amt: 0.36 },
    lights: [
      // Overhead cool fluorescent directional fill
      { id: 'fluo_sun', kind: 'sun', dir: [-0.25, 0.92, 0.28], color: [0.82, 0.95, 1.0], power: 0.88, wrap: 0.32 },
      // Travelling ceiling light pool ahead of clerk
      { id: 'pool_a', kind: 'point', pos: [0, 8.2, -24], move: 'poolA', color: [0.82, 0.96, 1.0], power: 4.5, fall: 0.03, range: 34, wrap: 0.28 },
      // Second ceiling light pool behind clerk for rim & depth
      { id: 'pool_b', kind: 'point', pos: [0, 8.2, -38], move: 'poolB', color: [0.76, 0.94, 1.0], power: 4.0, fall: 0.03, range: 34, wrap: 0.28 },
      // Back dairy cooler glow (depth anchor!)
      { id: 'dairy', kind: 'point', pos: [0, 4.5, -62], color: [0.65, 0.95, 1.0], power: 5.5, fall: 0.02, range: 45, wrap: 0.35 },
      // Warm amber soup-sale neon + swinging pendant over cross-aisle (z = -8)
      { id: 'soup_neon', kind: 'point', pos: [0, 6.2, -8.5], move: 'soupLamp', color: [1.0, 0.52, 0.18], power: 2.2, fall: 0.035, range: 28, wrap: 0.3, drive: 'soupDrive' },
      // Wheel spark under-glow during screeching chase & swerve
      { id: 'sparks', kind: 'point', pos: [0, 0.4, 0], move: 'sparkPos', color: [1.0, 0.55, 0.12], power: 3.4, fall: 0.18, range: 14, wrap: 0.35, drive: 'sparkDrive' },
      // Front foyer bright caustic glow through glass doors (z = +32)
      { id: 'foyer_glare', kind: 'point', pos: [0, 4.2, 31.5], color: [0.85, 0.98, 1.0], power: 3.2, fall: 0.025, range: 36, wrap: 0.35, drive: 'foyerDrive' },
      // Red warning beacon over glass doors
      { id: 'beacon', kind: 'point', pos: [0, 5.2, 30.8], color: [1.0, 0.18, 0.14], power: 3.0, fall: 0.06, range: 22, wrap: 0.3, drive: 'beaconDrive' },
    ],
    states: [
      // State 2 (15.80s): Amber-Tomato Avalanche
      { from: 15.80, sky: [0.42, 0.44, 0.46], ground: [0.30, 0.24, 0.22], fog: { color: '#332420', density: 0.014 },
        lights: { fluo_sun: { power: 0.72, color: [0.86, 0.92, 0.98] }, soup_neon: { power: 7.2, color: [1.0, 0.48, 0.16] } } },
      // State 3 (28.24s): High-Contrast Hazard Sparks
      { from: 28.24, sky: [0.28, 0.36, 0.48], ground: [0.20, 0.22, 0.28], fog: { color: '#162133', density: 0.013 },
        lights: { fluo_sun: { power: 0.65, color: [0.78, 0.88, 1.0] }, pool_a: { power: 5.0 }, soup_neon: { power: 3.5 } } },
      // State 4a (40.12s): Thawing Glare (warm 4200K flicker + blinding glass door bloom)
      { from: 40.12, sky: [0.48, 0.56, 0.60], ground: [0.30, 0.34, 0.38], fog: { color: '#2b4048', density: 0.011 },
        lights: { fluo_sun: { power: 0.95, color: [1.0, 0.95, 0.86] }, foyer_glare: { power: 8.5, color: [0.95, 0.99, 1.0] } } },
    ],
  },
  outer: {
    sky: [0.56, 0.44, 0.30],
    ground: [0.36, 0.28, 0.22],
    fog: { color: '#3a2b1e', density: 0.010 },
    ao: { floor: 0, h: 1.4, amt: 0.32 },
    lights: [
      // Warm golden tungsten real-world store sun/ceiling wash
      { id: 'outer_sun', kind: 'sun', dir: [0.35, 0.82, 0.45], color: [1.0, 0.88, 0.66], power: 0.95, wrap: 0.32 },
      // Brass tungsten desk lamp right above the snow globe & wooden counter!
      { id: 'desk_lamp', kind: 'point', pos: [OUTER_X + 1.65, 3.05, 0.55], color: [1.0, 0.80, 0.48], power: 4.8, fall: 0.08, range: 18, wrap: 0.3 },
      // Cold cyan counter-glow shining FROM inside the broken snow globe!
      { id: 'globe_cyan', kind: 'point', pos: [OUTER_X, 2.45, 0.35], color: [0.42, 0.92, 1.0], power: 0.55, fall: 0.30, range: 5.5, wrap: 0.30 },
      // Warm high-bay lamps receding down the 38 D outer queue!
      { id: 'bay1', kind: 'point', pos: [OUTER_X, 8.2, -10], color: [1.0, 0.84, 0.54], power: 5.0, fall: 0.025, range: 32, wrap: 0.3 },
      { id: 'bay2', kind: 'point', pos: [OUTER_X, 8.2, -26], color: [1.0, 0.82, 0.50], power: 5.5, fall: 0.022, range: 36, wrap: 0.3 },
      // Green barcode scanner accent light on the desk
      { id: 'scanner', kind: 'point', pos: [OUTER_X - 1.35, 1.55, 0.20], color: [0.22, 1.0, 0.45], power: 0.85, fall: 0.4, range: 4, wrap: 0.25 },
    ],
  },
};

const DRIVERS = {
  poolA: t => { const c = cartState(t); return [0, 8.2, clamp(c.z + 5.5, -60, 28)]; },
  poolB: t => { const c = cartState(t); return [0, 8.2, clamp(c.z - 9.0, -64, 24)]; },
  soupLamp: t => {
    const sw = t >= T_SOUP_HIT ? Math.sin((t - T_SOUP_HIT) * 3.8) * Math.exp(-(t - T_SOUP_HIT) * 0.14) * 1.4 : 0;
    return [sw, 6.2, -8.5];
  },
  soupDrive: t => t >= 15.80 ? 1.0 : 0.45,
  sparkPos: t => { const c = cartState(t); return [c.x + 0.35, 0.35, c.z + 0.55]; },
  sparkDrive: t => { const c = cartState(t); return c.sparks > 0.1 ? (0.8 + 0.4 * Math.sin(t * 47)) : 0; },
  foyerDrive: t => t >= 40.12 ? (1.0 + 0.16 * Math.sin(t * 18)) : 0.45,
  beaconDrive: t => t >= 40.12 ? (0.3 + 0.7 * Math.max(0, Math.sin(t * 9))) : 0,
};

// ---- Custom Fresnel + Specular Rim Curved Glass Shader for the Hero Snow Globe ----
function createSnowGlobeGlassMat(THREE) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    uniforms: {},
    vertexShader: /* glsl */`
      varying vec3 vN;
      varying vec3 vV;
      varying vec3 vLocal;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vN = normalize(mat3(modelMatrix) * normal);
        vV = normalize(cameraPosition - w.xyz);
        vLocal = normalize(position);
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: /* glsl */`
      varying vec3 vN;
      varying vec3 vV;
      varying vec3 vLocal;
      void main() {
        vec3 n = normalize(vN);
        vec3 v = normalize(vV);
        float ndv = clamp(dot(n, v), 0.0, 1.0);
        // Strong glassy Fresnel edge glow (crystal clear center so miniature market reads effortlessly!)
        float fres = pow(1.0 - ndv, 2.35);
        // Crisp curved window reflection crescent on upper-left & warm tungsten glint on upper-right!
        vec3 l1 = normalize(vec3(-0.55, 0.72, 0.58));
        vec3 l2 = normalize(vec3(0.62, 0.55, 0.56));
        float sp1 = pow(max(dot(n, normalize(l1 + v)), 0.0), 42.0);
        float sp2 = pow(max(dot(n, normalize(l2 + v)), 0.0), 64.0);
        // Subtle curved arc reflection stripe along upper-left contour
        float arc = smoothstep(0.68, 0.88, -vLocal.x * 0.65 + vLocal.y * 0.76) * smoothstep(0.30, 0.60, 1.0 - ndv);
        vec3 col = mix(vec3(0.72, 0.94, 1.0), vec3(1.0, 0.97, 0.88), sp2 * 0.8 + 0.25);
        col += vec3(1.0, 0.99, 0.95) * (sp1 * 1.4 + sp2 * 1.1 + arc * 0.55);
        float alpha = clamp(0.06 + fres * 0.78 + sp1 * 0.85 + sp2 * 0.70 + arc * 0.34, 0.0, 0.92);
        gl_FragColor = vec4(col, alpha);
      }
    `,
  });
}

// ---- Precompute 42 Clean, Well-Spaced Slow-Motion Soup Can Trajectories ----
function buildSoupCanSpecs() {
  const rng = mkRng(4042);
  const specs = [];
  // 42 cans arranged into 3 crisp readable layers (foreground hero arcs, mid dome, upper cascade)
  // Guaranteed visual clarity at t = 19.8s (S09) and t = 22.0s (S10) — zero muddy overlap!
  const grid = [
    // Foreground / mid-left & right hero cans (read huge and razor sharp in S09 & S10!)
    [-2.5, 1.9, -4.6, -0.45, 2.2,  0.42],
    [ 2.4, 2.1, -4.4,  0.42, 2.4,  0.45],
    [-1.6, 3.2, -5.2, -0.32, 2.8,  0.35],
    [ 1.7, 3.3, -5.1,  0.34, 2.9,  0.38],
    [ 0.1, 3.9, -5.8,  0.04, 3.1,  0.22],
    [-2.9, 3.1, -6.2, -0.52, 2.7,  0.18],
    [ 2.8, 3.0, -6.0,  0.48, 2.6,  0.20],
    [-1.1, 2.2, -6.5, -0.22, 2.3,  0.12],
    [ 1.3, 2.3, -6.4,  0.25, 2.3,  0.14],
    [-2.2, 4.3, -6.8, -0.40, 3.3,  0.08],
    [ 2.1, 4.4, -6.9,  0.38, 3.3,  0.06],
    [ 0.0, 4.8, -7.2, -0.05, 3.6,  0.02],
  ];
  for (let i = 0; i < 42; i++) {
    // Pyramid starting grid slot at z = -7.2, x = +1.35 (clear of S05/S06 sightlines, hit cleanly at S08!)
    const tier = Math.floor(i / 6); // 0..6
    const col  = (i % 6) - 2.5;
    const x0 = 1.35 + col * 0.38 * (1 - tier * 0.08);
    const y0 = 0.22 + tier * 0.42;
    const z0 = -7.2 + ((i % 3) - 1) * 0.30;

    if (i < grid.length) {
      const [tx, ty, tz, vx, vy, vz] = grid[i];
      specs.push({
        x0, y0, z0,
        // Target mid-air coordinates at dt = 3.5s (midway between S09 & S10)
        tx, ty, tz, vx, vy, vz,
        spinX: (rng() - 0.5) * 2.4,
        spinY: (rng() - 0.5) * 2.8,
        spinZ: (rng() - 0.5) * 2.2,
        hero: true,
      });
    } else {
      const k = i - grid.length;
      const ring = k % 6;
      const depthIdx = Math.floor(k / 6); // 0..4
      const angle = (ring / 6) * Math.PI * 2 + depthIdx * 0.52;
      const rad = 1.15 + (ring % 3) * 0.85 + (rng() - 0.5) * 0.25;
      const tx = Math.cos(angle) * rad * 1.15;
      const ty = 1.45 + depthIdx * 0.72 + (ring % 2) * 0.45 + rng() * 0.3;
      const tz = -5.6 - depthIdx * 1.75 + (rng() - 0.5) * 0.5;
      specs.push({
        x0, y0, z0, tx, ty, tz,
        vx: (rng() - 0.5) * 0.4,
        vy: 1.8 + rng() * 1.4,
        vz: -0.25 - depthIdx * 0.15,
        spinX: (rng() - 0.5) * 3.0,
        spinY: (rng() - 0.5) * 3.2,
        spinZ: (rng() - 0.5) * 2.8,
        hero: false,
      });
    }
  }
  return specs;
}

// ---- Main Set Builder ----
export async function buildSet(THREE, scene, opts, kit) {
  const base = kit('plain', opts);
  // Clear default plain ground/sky so our two 400 D-separated places own their floors & depth-writing domes cleanly
  base.group.clear();

  const rig = createLightRig(THREE, PLACES, DRIVERS);
  const K = createKit(THREE, rig, { shadow: base.uniforms, group: base.group });
  const look = opts.post ? createPost(THREE, rig, opts.post) : undefined;
  if (look && opts.post.shade) look.shading = createRigShade(THREE, rig, opts.post.shade);

  // Depth-writing sky domes for both places (sets.md: domes must write depth, renderOrder -10)
  const skyM = K.sky(0, -15, 160, { top: '#132630', hor: '#213f4d', low: '#102028' });
  skyM.mesh.material.depthWrite = true;
  const skyO = K.sky(OUTER_X, -10, 140, { top: '#3c2918', hor: '#5c4026', low: '#2a1d12' });
  skyO.mesh.material.depthWrite = true;

  const texFloor   = tileFloorTex(THREE);
  const texCeil    = ceilingGridTex(THREE);
  const texSoup    = soupLabelTex(THREE);
  const texCrate   = crateTex(THREE);
  const texReceipt = receiptTex(THREE);
  const texWood    = woodCounterTex(THREE);
  const texOFloor  = outerFloorTex(THREE);

  // Helper for inked cartoon set props inside the set
  const inkMesh = (geo, mat, w = 0.022) => {
    const m = new THREE.Mesh(geo, mat);
    if (w > 0) outline(m, { width: w, color: 0x261a22 });
    return m;
  };

  // =========================================================================
  // PLACE 1: MEGA-SUPERMARKET HALL (`market`, x: -15..+15, z: -72..+36, y: 0..10)
  // =========================================================================
  const marketG = new THREE.Group();
  marketG.name = 'place_market';
  base.group.add(marketG);

  const mFloor = K.surface('market', '#e8f3f7', { map: texFloor, uv: 1, tile: [4.2, 4.2], gloss: 52, spec: 0.48, wet: 0.28, grime: 0.08, ao: 0.4 });
  const mCeil  = K.surface('market', '#c4d5de', { map: texCeil, uv: 1, tile: [5.5, 5.5], grime: 0.14, ao: 0.25 });
  const mWall  = K.surface('market', '#9db3bf', { grime: 0.18, ao: 0.55 });
  const mTrim  = K.surface('market', '#2d6c7a', { grime: 0.12, ao: 0.45 });
  const mSteel = K.surface('market', '#556573', { gloss: 36, spec: 0.35, grime: 0.15, ao: 0.5 });
  const mShelf = K.surface('market', '#d0dce3', { grime: 0.12, ao: 0.45 });
  const mFluoOn  = K.surface('market', '#e6fbff', { emit: 2.6, ao: 0 });
  const mFluoDim = K.surface('market', '#80a8b8', { emit: 0.45, ao: 0 });
  const mLampBody = K.surface('market', '#40505c', { ao: 0.3 });

  // Floor (108 D long x 32 D wide)
  const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(32, 114).rotateX(-Math.PI / 2), mFloor);
  floorMesh.position.set(0, 0, -18);
  marketG.add(floorMesh);

  // Subtle cyan-teal lane guide strips painted on the floor leading to vanishing point
  const mLane = K.surface('market', '#6599a8', { gloss: 40, spec: 0.3, ao: 0.2 });
  for (const sx of [-3.35, 3.35]) {
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 102).rotateX(-Math.PI / 2), mLane);
    strip.position.set(sx, 0.006, -18);
    marketG.add(strip);
  }

  // Ceiling (y = 9.6)
  const ceilMesh = new THREE.Mesh(new THREE.PlaneGeometry(32, 114).rotateX(Math.PI / 2), mCeil);
  ceilMesh.position.set(0, 9.6, -18);
  marketG.add(ceilMesh);

  // Side walls (x = +-15) with teal supermarket dado stripe
  for (const s of [-1, 1]) {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(114, 10), mWall);
    w.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2;
    w.position.set(s * 15, 5, -18);
    marketG.add(w);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.1, 112), mTrim);
    stripe.position.set(s * 14.85, 7.2, -18);
    marketG.add(stripe);
  }

  // Back Dairy Cooler Wall (z = -72 D): glowing illuminated glass cooler doors! (48 D behind clerk on Frame 0!)
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(30, 10), mWall);
  backWall.position.set(0, 5, -72);
  marketG.add(backWall);
  const mCoolerGlow = K.surface('market', '#ccf6ff', { emit: 2.1, ao: 0 });
  const mCoolerFrame = K.surface('market', '#2e4c5c', { ao: 0.4 });
  for (let cx = -11; cx <= 11; cx += 2.75) {
    const bay = new THREE.Mesh(new THREE.BoxGeometry(2.3, 5.2, 0.3), mCoolerGlow);
    bay.position.set(cx, 2.8, -71.4);
    marketG.add(bay);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(2.55, 5.6, 0.25), mCoolerFrame);
    frame.position.set(cx, 2.8, -71.6);
    marketG.add(frame);
  }
  // Glowing back-wall header banner "ألبان ومبردات"
  const backSignMat = new THREE.MeshBasicMaterial({ map: signTex(THREE, 'ألبان ومبردات', '#195a6e', '#e8fcff', '#62d4e8') });
  const backSign = new THREE.Mesh(new THREE.BoxGeometry(10.5, 2.1, 0.2), backSignMat);
  backSign.position.set(0, 7.1, -71.2);
  marketG.add(backSign);

  // Hanging Double-Tube Fluorescent Ceiling Fixtures every 6 D (Practical #1 — receding vanishing point!)
  const fluoFixtures = [];
  for (let z = -66; z <= 30; z += 6) {
    const idx = Math.round((z + 66) / 6);
    const dimmed = (idx % 3 === 1); // alternating bright & dimmed for dramatic light-and-shadow rhythm!
    for (const lx of [0, -7.8, 7.8]) {
      const fGrp = new THREE.Group();
      fGrp.position.set(lx, 8.35, z);
      const housing = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.16, 0.55), mLampBody);
      housing.position.y = 0.10;
      fGrp.add(housing);
      const tubeMat = dimmed && lx === 0 ? mFluoDim : mFluoOn;
      const tube = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.10, 0.42), tubeMat);
      fGrp.add(tube);
      // Suspension rods to ceiling
      for (const rx of [-1.05, 1.05]) {
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.25, 6), mSteel);
        rod.position.set(rx, 0.68, 0);
        fGrp.add(rod);
      }
      marketG.add(fGrp);
      if (lx === 0 && z >= 12) fluoFixtures.push({ tube, baseMat: tubeMat });
    }
  }

  // Hanging Illuminated Arabic Aisle Signs (Practical #2 — high contrast, readable in depth!)
  const aisleSigns = [
    { z: -46, text: 'ممر ٣',  bg: '#1b5064', fg: '#ffffff', acc: '#6be0f0' },
    { z: -34, text: 'ممر ٢',  bg: '#1b5064', fg: '#ffffff', acc: '#6be0f0' },
    { z: -19, text: 'ممر ١',  bg: '#b8252a', fg: '#fffaf0', acc: '#ffd24d' },
    { z:  -8.5, text: 'عرض الشوربة!', bg: '#d95b16', fg: '#fff8e6', acc: '#ffcf40' },
    { z:  10, text: 'الكاشير', bg: '#1e5b4e', fg: '#ffffff', acc: '#7af0c4' },
  ];
  for (const as of aisleSigns) {
    const smat = new THREE.MeshBasicMaterial({ map: signTex(THREE, as.text, as.bg, as.fg, as.acc) });
    const board = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.15, 0.16), [mLampBody, mLampBody, mLampBody, mLampBody, smat, smat]);
    board.position.set(0, 6.75, as.z);
    marketG.add(board);
    for (const sx of [-1.3, 1.3]) {
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.3, 6), mSteel);
      chain.position.set(sx, 8.4, as.z);
      marketG.add(chain);
    }
  }

  // Swinging Industrial Pendant Lamp above Soup Cross-Aisle (z = -8.5)
  const soupLampGrp = new THREE.Group();
  soupLampGrp.position.set(0, 9.6, -8.5);
  marketG.add(soupLampGrp);
  const slCord = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.2, 6), mSteel);
  slCord.position.y = -1.6;
  soupLampGrp.add(slCord);
  const slShade = new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.55, 16, 1, true), K.surface('market', '#d95b16', { gloss: 40, spec: 0.4 }));
  slShade.position.y = -3.35;
  soupLampGrp.add(slShade);
  const slBulb = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), K.surface('market', '#ffcb70', { emit: 3.0, ao: 0 }));
  slBulb.position.y = -3.55;
  soupLampGrp.add(slBulb);

  // ---- STOCKED SUPERMARKET SHELVING GONDOLAS (Cool/Muted goods so RED CART & RED SOUP CANS POP!) ----
  const boxColors = ['#5b8fa8', '#689c78', '#d6b65c', '#7682a6', '#e0d6c2', '#4c7b8c', '#8ea878', '#c7a46b', '#879cb0', '#a6b8a0'];
  const boxMats = boxColors.map(hex => K.surface('market', hex, { grime: 0.08, ao: 0.42 }));
  const rngShelf = mkRng(1337);

  function buildGondolaUnit(x, z, len = 3.8, h = 5.8, depth = 1.4, tiltable = false) {
    const unit = new THREE.Group();
    unit.position.set(x, 0, z);
    // Solid metallic back spine + 2 end uprights
    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.12, h, len), mSteel);
    spine.position.set(0, h / 2, 0);
    unit.add(spine);
    for (const sz of [-len / 2 + 0.08, len / 2 - 0.08]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(depth, h, 0.12), mSteel);
      post.position.set(0, h / 2, sz);
      unit.add(post);
    }
    // 5 shelf decks + stocked supermarket packages on BOTH faces
    const tiers = [0.32, 1.42, 2.52, 3.62, 4.72];
    for (const ty of tiers) {
      const deck = new THREE.Mesh(new THREE.BoxGeometry(depth, 0.09, len - 0.05), mShelf);
      deck.position.set(0, ty, 0);
      unit.add(deck);
      // Price-tag rail along aisle face
      const faceSign = x < 0 ? 1 : -1;
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.11, len - 0.06), mTrim);
      rail.position.set(faceSign * (depth / 2 + 0.01), ty, 0);
      unit.add(rail);

      // Stock colorful packages along the aisle-facing half of the shelf
      let cz = -len / 2 + 0.34;
      while (cz < len / 2 - 0.30) {
        const bw = 0.28 + rngShelf() * 0.26;
        const bh = 0.42 + rngShelf() * 0.44;
        const bd = 0.38 + rngShelf() * 0.20;
        const mat = boxMats[Math.floor(rngShelf() * boxMats.length)];
        const pkg = new THREE.Mesh(new THREE.BoxGeometry(bd, bh, bw), mat);
        pkg.position.set(faceSign * (depth * 0.24), ty + 0.045 + bh / 2, cz);
        unit.add(pkg);
        cz += bw + 0.08;
      }
    }
    // Top cap
    const cap = new THREE.Mesh(new THREE.BoxGeometry(depth + 0.12, 0.16, len + 0.05), mTrim);
    cap.position.set(0, h, 0);
    unit.add(cap);
    marketG.add(unit);
    return unit;
  }

  // Main central aisle flanking gondolas (x = +-4.55 D -> clean 7.6 D center aisle between shelf faces!)
  // Leave cross-aisle openings at z = -10..-5 and checkout foyer z > +16!
  const collapsingShelves = [];
  const shelfZSlots = [-62, -56, -50, -44, -38, -32, -26, -20, -14, -10, -2, 4, 10, 15];
  for (const sz of shelfZSlots) {
    // Skip right-side at z = -10..-2? Keep right side intact; left side (-X) at z = -20, -14, -10, -2 collapses in domino wave!
    const isDomino = (sz === -20 || sz === -14 || sz === -10 || sz === -2);
    // Note: crate_row sits at x = -2.35, z = +7.8..+15.6, so shift left shelves at z >= 10 outward to x = -5.6 for clear lane!
    const lx = sz >= 4 ? -5.6 : -4.55;
    const leftG = buildGondolaUnit(lx, sz, 3.8, 5.8, 1.4, isDomino);
    if (isDomino) {
      collapsingShelves.push({ grp: leftG, z: sz, delay: (sz === -10 ? 0.2 : sz === -14 ? 0.65 : sz === -20 ? 1.15 : 0.45) });
    }
    buildGondolaUnit(4.55, sz, 3.8, 5.8, 1.4, false);
  }
  // Outer background aisles at x = +-11.2 D (fills side parallax & cross-aisle depth!)
  for (let sz = -60; sz <= 14; sz += 8) {
    buildGondolaUnit(-11.4, sz, 5.2, 6.2, 1.5, false);
    buildGondolaUnit( 11.4, sz, 5.2, 6.2, 1.5, false);
  }

  // ---- FROZEN STASIS PROPS (Curling 3.2 D Receipt + Floating Detergent Jug) ----
  const receiptGrp = new THREE.Group();
  receiptGrp.position.set(2.35, 1.55, -18.8);
  const recMat = new THREE.MeshBasicMaterial({ map: texReceipt, side: THREE.DoubleSide });
  for (let i = 0; i < 10; i++) {
    const seg = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.36), recMat);
    const a = i * 0.42;
    seg.position.set(Math.sin(a) * 0.26, 0.9 - i * 0.22, Math.cos(a) * 0.22);
    seg.rotation.set(0.25 * Math.cos(a), a * 0.6, 0.2 * Math.sin(a));
    receiptGrp.add(seg);
  }
  marketG.add(receiptGrp);

  // Floating bright teal detergent jug between frozen tuggers at [2.55, 1.65, -13.5]
  const detGrp = new THREE.Group();
  detGrp.position.set(2.55, 1.68, -13.5);
  detGrp.rotation.z = 0.22;
  const detMat = K.surface('market', '#28b8c9', { gloss: 55, spec: 0.5, ao: 0.2 });
  const detCap = K.surface('market', '#ffd233', { ao: 0.2 });
  detGrp.add(inkMesh(new THREE.BoxGeometry(0.36, 0.52, 0.24), detMat, 0.02));
  const dc = inkMesh(new THREE.CylinderGeometry(0.08, 0.08, 0.14, 10), detCap, 0.016);
  dc.position.y = 0.32;
  detGrp.add(dc);
  marketG.add(detGrp);

  // ---- SOUP PYRAMID (Intact t < 16.41s) & 42 READABLE SLOW-MOTION SOUP CANS (t >= 16.41s) ----
  const canGeo = new THREE.CylinderGeometry(0.145, 0.145, 0.36, 16);
  const canSideMat = new THREE.MeshBasicMaterial({ map: texSoup });
  const canLidMat  = K.surface('market', '#d8e0e6', { gloss: 70, spec: 0.75, ao: 0.2 });
  const canMats = [canSideMat, canLidMat, canLidMat];

  // Intact towering 6-tier soup pyramid offset right-of-center at [1.35, 0, -7.2] so S05/S06 stay unobstructed!
  const pyramidGrp = new THREE.Group();
  pyramidGrp.name = 'soup_pyramid';
  pyramidGrp.position.set(1.35, 0, -7.2);
  // Wooden display pallet under the pyramid
  const pallet = inkMesh(new THREE.BoxGeometry(2.45, 0.28, 1.45), K.surface('market', '#9e7244', { ao: 0.4 }), 0.022);
  pallet.position.y = 0.14;
  pyramidGrp.add(pallet);
  for (let tier = 0; tier < 6; tier++) {
    const cols = 6 - tier;
    for (let c = 0; c < cols; c++) {
      for (const rz of [-0.32, 0.0, 0.32]) {
        if (tier >= 4 && rz !== 0) continue;
        const can = inkMesh(canGeo, canMats, 0.018);
        can.position.set((c - (cols - 1) / 2) * 0.34, 0.46 + tier * 0.37, rz);
        pyramidGrp.add(can);
      }
    }
  }
  marketG.add(pyramidGrp);

  // 42 Crisp Individually Readable Slow-Motion Mid-Air Soup Cans (t >= 16.41s)
  const soupScatterGrp = new THREE.Group();
  soupScatterGrp.name = 'soup_cans_scatter';
  const soupCanSpecs = buildSoupCanSpecs();
  const soupCanMeshes = [];
  // Hero cans slightly bolder (1.28x scale) so every label, tomato emblem & silver lid pops one by one in S09 & S10!
  for (const sp of soupCanSpecs) {
    const can = inkMesh(canGeo, canMats, 0.024);
    const sc = sp.hero ? 1.32 : 1.15;
    can.scale.set(sc, sc, sc);
    soupScatterGrp.add(can);
    soupCanMeshes.push({ mesh: can, sp });
  }
  marketG.add(soupScatterGrp);

  // ---- DISPLAY CRATE ROW (18 Crates at x = -2.35, z = +10.6..+17.6; clear of S16/S17, explodes left & right in S18!) ----
  const crateMat = new THREE.MeshBasicMaterial({ map: texCrate });
  const crateGeo = new THREE.BoxGeometry(0.84, 0.62, 0.68);
  const crateList = [];
  const rngCrate = mkRng(7718);
  for (let col = 0; col < 6; col++) {
    const cz = 10.6 + col * 1.35;
    for (let row = 0; row < 3; row++) {
      const cy = 0.31 + row * 0.63;
      const m = inkMesh(crateGeo, crateMat, 0.022);
      m.position.set(-2.35 + (row === 1 ? 0.05 : -0.04), cy, cz);
      marketG.add(m);
      // Launch crates strongly outward left (-X) and behind-right so ZERO crate ever flies into the S18 lens!
      const side = (col % 2 === 0) ? -1 : 1;
      crateList.push({
        mesh: m,
        x0: m.position.x, y0: cy, z0: cz,
        hitT: T_CRATES - 0.45 + col * 0.20,
        vx: side < 0 ? -(4.6 + rngCrate() * 2.4) : (3.6 + rngCrate() * 1.8),
        vy: 0.55 + row * 0.38 + rngCrate() * 0.35,
        vz: side < 0 ? (0.8 + rngCrate() * 1.2) : -(1.6 + rngCrate() * 1.4),
        rx: (rngCrate() - 0.5) * 6, ry: (rngCrate() - 0.5) * 6, rz: (rngCrate() - 0.5) * 6,
      });
    }
  }

  // ---- CHECKOUT FOYER LANES (z = +21..+27) & SLIDING GLASS DOORS (z = +32.0) ----
  const mCounterDark = K.surface('market', '#324856', { ao: 0.5 });
  const mBelt = K.surface('market', '#1f252c', { gloss: 30, spec: 0.25 });
  const mLantern = K.surface('market', '#ffe794', { emit: 2.2, ao: 0 });
  for (const [cx, num] of [[-5.6, '١'], [-9.8, '٢'], [5.6, '٣'], [9.8, '٤']]) {
    const cnt = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.35, 5.2), mCounterDark);
    cnt.position.set(cx, 0.675, 22.8);
    marketG.add(cnt);
    const belt = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.06, 4.6), mBelt);
    belt.position.set(cx, 1.38, 22.8);
    marketG.add(belt);
    // Glowing checkout lane number lantern pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.0, 8), mSteel);
    pole.position.set(cx, 2.8, 20.8);
    marketG.add(pole);
    const lMat = new THREE.MeshBasicMaterial({ map: signTex(THREE, num, '#d95b16', '#ffffff', '#ffe580') });
    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), [lMat, lMat, mLantern, mLantern, lMat, lMat]);
    cube.position.set(cx, 4.45, 20.8);
    marketG.add(cube);
  }

  // Front Storefront Wall & Sliding Glass Doors (z = +32.0 D)
  const mAlum = K.surface('market', '#bcc8d2', { gloss: 65, spec: 0.7, ao: 0.3 });
  const mGlassPortal = K.surface('market', '#e8fcff', { emit: 3.4, ao: 0 });
  // Side framing walls flanking the 8.2 D glass doorway
  for (const s of [-1, 1]) {
    const fw = new THREE.Mesh(new THREE.BoxGeometry(11.0, 10.0, 0.5), mWall);
    fw.position.set(s * 9.6, 5.0, 32.2);
    marketG.add(fw);
  }
  // Upper transom header above doors
  const transom = new THREE.Mesh(new THREE.BoxGeometry(8.6, 5.4, 0.5), mWall);
  transom.position.set(0, 7.1, 32.2);
  marketG.add(transom);
  // Bright caustic glow portal right behind the glass doors
  const portal = new THREE.Mesh(new THREE.PlaneGeometry(8.4, 4.6), mGlassPortal);
  portal.position.set(0, 2.25, 33.4);
  portal.rotation.y = Math.PI;
  marketG.add(portal);

  // Two aluminum-framed translucent sliding glass door leaves
  const glassDoorsGrp = new THREE.Group();
  glassDoorsGrp.name = 'glass_doors';
  const glassPaneMat = new THREE.MeshBasicMaterial({ color: 0xbef2ff, transparent: true, opacity: 0.36, side: THREE.DoubleSide });
  const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });
  for (const s of [-1, 1]) {
    const leaf = new THREE.Group();
    leaf.position.set(s * 1.95, 2.15, 32.0);
    leaf.add(new THREE.Mesh(new THREE.BoxGeometry(3.85, 0.14, 0.14), mAlum));
    const topF = new THREE.Mesh(new THREE.BoxGeometry(3.85, 0.16, 0.14), mAlum); topF.position.y = 2.08; leaf.add(topF);
    const botF = new THREE.Mesh(new THREE.BoxGeometry(3.85, 0.22, 0.14), mAlum); botF.position.y = -2.04; leaf.add(botF);
    for (const ex of [-1.88, 1.88]) {
      const st = new THREE.Mesh(new THREE.BoxGeometry(0.14, 4.28, 0.14), mAlum); st.position.x = ex; leaf.add(st);
    }
    leaf.add(new THREE.Mesh(new THREE.PlaneGeometry(3.65, 4.05), glassPaneMat));
    // White caution band across middle of glass so the glass plane reads unmistakably!
    const band = new THREE.Mesh(new THREE.PlaneGeometry(3.65, 0.24), stripeMat);
    band.position.set(0, -0.25, -0.02);
    leaf.add(band);
    glassDoorsGrp.add(leaf);
  }
  marketG.add(glassDoorsGrp);

  // Glowing green EXIT / خروج sign & Red Emergency Beacon above glass doors!
  const exitMat = new THREE.MeshBasicMaterial({ map: signTex(THREE, 'EXIT  خروج', '#15803d', '#ffffff', '#86efac') });
  const exitSign = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.95, 0.2), [mLampBody, mLampBody, mLampBody, mLampBody, exitMat, exitMat]);
  exitSign.position.set(0, 5.05, 31.7);
  marketG.add(exitSign);
  const beaconBulb = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 10), K.surface('market', '#ff2a2a', { emit: 3.2, ao: 0 }));
  beaconBulb.position.set(2.3, 5.05, 31.6);
  marketG.add(beaconBulb);

  // =========================================================================
  // PLACE 2: WARM GOLDEN OUTER STORE COUNTER & HERO SNOW GLOBE (`outer`, x = +400 D)
  // =========================================================================
  const outerG = new THREE.Group();
  outerG.name = 'place_outer';
  outerG.position.set(OUTER_X, 0, 0);
  base.group.add(outerG);

  const oFloor = K.surface('outer', '#ead5b0', { map: texOFloor, uv: 1, tile: [4.0, 4.0], gloss: 36, spec: 0.35, grime: 0.08, ao: 0.35 });
  const oWall  = K.surface('outer', '#c9a67c', { grime: 0.14, ao: 0.45 });
  const oCeil  = K.surface('outer', '#a88964', { grime: 0.16, ao: 0.3 });
  const oWood  = K.surface('outer', '#b57b42', { map: texWood, uv: 0, tile: [2, 1], gloss: 42, spec: 0.42, ao: 0.4 });
  const oWoodDark = K.surface('outer', '#5c381c', { gloss: 32, spec: 0.3, ao: 0.5 });
  const oBrass = K.surface('outer', '#e8b948', { gloss: 85, spec: 0.85, ao: 0.2 });
  const oLampGlow = K.surface('outer', '#ffe8a8', { emit: 3.0, ao: 0 });
  const oShelfMat = K.surface('outer', '#8a5d36', { grime: 0.12, ao: 0.45 });

  // Outer store floor (54 D long x 28 D wide: z = -40 .. +14)
  const oFloorM = new THREE.Mesh(new THREE.PlaneGeometry(28, 56).rotateX(-Math.PI / 2), oFloor);
  oFloorM.position.set(0, 0, -13);
  outerG.add(oFloorM);
  const oCeilM = new THREE.Mesh(new THREE.PlaneGeometry(28, 56).rotateX(Math.PI / 2), oCeil);
  oCeilM.position.set(0, 10.0, -13);
  outerG.add(oCeilM);
  for (const s of [-1, 1]) {
    const sw = new THREE.Mesh(new THREE.PlaneGeometry(56, 10), oWall);
    sw.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2;
    sw.position.set(s * 13.5, 5, -13);
    outerG.add(sw);
  }
  const oBackW = new THREE.Mesh(new THREE.PlaneGeometry(28, 10), oWall);
  oBackW.position.set(0, 5, -40);
  outerG.add(oBackW);

  // Warm Golden High-Bay Pendant Lamps receding 38 D back down the outer queue!
  for (let z = -34; z <= 6; z += 7.5) {
    for (const lx of [0, -6.2, 6.2]) {
      const lg = new THREE.Group();
      lg.position.set(lx, 8.2, z);
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 6), oWoodDark);
      cord.position.y = 0.9;
      lg.add(cord);
      const shade = new THREE.Mesh(new THREE.ConeGeometry(0.95, 0.65, 16), oWoodDark);
      lg.add(shade);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), oLampGlow);
      bulb.position.y = -0.25;
      lg.add(bulb);
      outerG.add(lg);
    }
  }

  // Outer Store Wooden Checkout Aisles & Distant Shelves receding behind the counter (z = -6 .. -36)
  for (let z = -7; z >= -34; z -= 6.5) {
    for (const sx of [-6.8, 6.8]) {
      const sh = new THREE.Mesh(new THREE.BoxGeometry(2.0, 5.2, 4.4), oShelfMat);
      sh.position.set(sx, 2.6, z);
      outerG.add(sh);
    }
    // Warm queue stanchions guiding the long outer checkout line!
    for (const px of [-2.4, 2.4]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.4, 10), oBrass);
      post.position.set(px, 0.7, z);
      outerG.add(post);
    }
  }
  // Distant stylized silhouettes of extra outer shoppers stretching all the way down the 38 D queue!
  const qHeadMat = K.surface('outer', '#f0e2cc', { ao: 0.25 });
  const qCoatColors = ['#8c5a32', '#5c6b42', '#7d3e38', '#a37b36', '#4c576b'];
  for (let i = 0; i < 8; i++) {
    const qz = -11.5 - i * 3.1;
    const qx = ((i % 2) * 2 - 1) * 0.55 + Math.sin(i * 1.7) * 0.25;
    const cm = K.surface('outer', qCoatColors[i % qCoatColors.length], { ao: 0.35 });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.75, 6, 12), cm);
    body.position.set(qx, 1.38, qz);
    outerG.add(body);
    const hd = new THREE.Mesh(new THREE.SphereGeometry(0.46, 14, 12), qHeadMat);
    hd.position.set(qx, 2.38, qz);
    outerG.add(hd);
  }

  // ---- WARM WOODEN CHECKOUT DESK / COUNTER (x = 0, z = 0, top surface y = 1.35 D!) ----
  const deskGrp = new THREE.Group();
  deskGrp.name = 'outer_desk';
  // Solid walnut cabinet base
  const deskBase = inkMesh(new THREE.BoxGeometry(5.6, 1.24, 1.85), oWoodDark, 0.022);
  deskBase.position.set(0, 0.62, 0);
  deskGrp.add(deskBase);
  // Wide gleaming honey-oak desktop overhanging slightly (y = 1.24 .. 1.38)
  const deskTop = inkMesh(new THREE.BoxGeometry(6.0, 0.14, 2.15), oWood, 0.022);
  deskTop.position.set(0, 1.31, 0.05);
  deskGrp.add(deskTop);
  // Black conveyor mat on left side of desk
  const beltPad = inkMesh(new THREE.BoxGeometry(2.1, 0.04, 1.35), K.surface('outer', '#262930', { gloss: 25, spec: 0.2 }), 0.014);
  beltPad.position.set(-1.75, 1.39, 0.0);
  deskGrp.add(beltPad);
  // POS Cash Register Monitor on far left of desk
  const posStand = inkMesh(new THREE.BoxGeometry(0.32, 0.46, 0.30), K.surface('outer', '#2e333b'), 0.016);
  posStand.position.set(-2.35, 1.60, -0.35);
  deskGrp.add(posStand);
  const posScreen = inkMesh(new THREE.BoxGeometry(0.86, 0.60, 0.10), K.surface('outer', '#262c33'), 0.018);
  posScreen.position.set(-2.35, 2.02, -0.35);
  posScreen.rotation.y = 0.35;
  deskGrp.add(posScreen);
  const posGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.74, 0.48), K.surface('outer', '#7ef0b0', { emit: 1.6, ao: 0 }));
  posGlow.position.set(-2.32, 2.02, -0.29);
  posGlow.rotation.y = 0.35;
  deskGrp.add(posGlow);
  // Glowing green barcode scanner beam on desk
  const laserMat = new THREE.MeshBasicMaterial({ color: 0x38ff7a, transparent: true, opacity: 0.72 });
  const laser = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.025, 0.025), laserMat);
  laser.position.set(-1.35, 1.44, 0.18);
  deskGrp.add(laser);

  // Warm Brass Gooseneck Desk Lamp on RIGHT side of desk (x = +1.95) framing the snow globe!
  const lampGrp = new THREE.Group();
  lampGrp.position.set(1.98, 1.38, -0.15);
  lampGrp.add(inkMesh(new THREE.CylinderGeometry(0.28, 0.34, 0.12, 16), oBrass, 0.016));
  const stem = inkMesh(new THREE.CylinderGeometry(0.045, 0.055, 1.65, 10), oBrass, 0.014);
  stem.position.set(0.05, 0.84, 0);
  stem.rotation.z = 0.12;
  lampGrp.add(stem);
  const arm = inkMesh(new THREE.CylinderGeometry(0.04, 0.04, 0.78, 10), oBrass, 0.014);
  arm.position.set(-0.26, 1.68, 0.12);
  arm.rotation.z = 1.25;
  lampGrp.add(arm);
  const hood = inkMesh(new THREE.ConeGeometry(0.36, 0.42, 16), K.surface('outer', '#265c42', { gloss: 55, spec: 0.6 }), 0.018);
  hood.position.set(-0.56, 1.56, 0.18);
  hood.rotation.z = 0.38;
  lampGrp.add(hood);
  const dBulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), oLampGlow);
  dBulb.position.set(-0.62, 1.44, 0.20);
  lampGrp.add(dBulb);
  deskGrp.add(lampGrp);

  outerG.add(deskGrp);

  // =========================================================================
  // THE HERO SNOW GLOBE (`snow_globe_dome` at [400.0, 1.38, 0.22] on the wooden desk!)
  // Designed to PASS Spectacle Test #4 in ONE GLANCE: glass curve, desk, market inside!
  // =========================================================================
  const globeGrp = new THREE.Group();
  globeGrp.name = 'snow_globe_dome';
  globeGrp.position.set(0.05, 1.38, 0.22);
  outerG.add(globeGrp);

  // 1. Heavy Tiered Mahogany & Brushed Brass Pedestal Base (y = 0 .. 0.40)
  const pedBot = inkMesh(new THREE.CylinderGeometry(0.86, 0.96, 0.22, 28), oWoodDark, 0.022);
  pedBot.position.y = 0.11;
  globeGrp.add(pedBot);
  const pedTop = inkMesh(new THREE.CylinderGeometry(0.76, 0.86, 0.18, 28), oWood, 0.020);
  pedTop.position.y = 0.30;
  globeGrp.add(pedTop);
  const brassRing = inkMesh(new THREE.TorusGeometry(0.82, 0.036, 10, 28), oBrass, 0.014);
  brassRing.rotation.x = Math.PI / 2;
  brassRing.position.y = 0.22;
  globeGrp.add(brassRing);
  // Engraved Brass Front Plaque on pedestal (56px font so "SUPERMARKET" fits cleanly with brass margins!)
  const plaqueMat = new THREE.MeshBasicMaterial({ map: signTex(THREE, 'SUPERMARKET', '#d4a135', '#2a1a0e', '#fff0b3', 56) });
  const pedPlaque = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.17, 0.05), [oBrass, oBrass, oBrass, oBrass, plaqueMat, oBrass]);
  pedPlaque.position.set(0, 0.16, 0.91);
  globeGrp.add(pedPlaque);

  // 2. Miniature Supermarket Diorama INSIDE the Glass Sphere (center y = 1.18, radius = 1.06 D)
  const miniG = new THREE.Group();
  miniG.position.set(0, 0.42, 0);
  globeGrp.add(miniG);
  // Checkered mini supermarket floor disc + snowy rim (floor map unchanged)
  const miniFloor = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.84, 0.06, 28),
    new THREE.MeshBasicMaterial({ map: texFloor }));
  miniFloor.position.y = 0.03;
  miniG.add(miniFloor);
  // Snow drift ring: was 0xf4fbff (bloom blob). Now cool mid snow (Qwen round 3).
  const snowMat = new THREE.MeshBasicMaterial({ color: 0xb6c7d4 });
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.11 + (i % 3) * 0.03, 10, 8), snowMat);
    puff.scale.y = 0.45;
    puff.position.set(Math.cos(a) * 0.72, 0.06, Math.sin(a) * 0.72);
    miniG.add(puff);
  }
  // Fluorescent strips: was 0x9cf3ff (blob). Now a readable cyan tube (Qwen round 3).
  const miniCyanGlow = new THREE.MeshBasicMaterial({ color: 0x57a8bd });
  for (const mz of [-0.42, -0.10, 0.22]) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.04, 0.10), miniCyanGlow);
    strip.position.set(0, 1.24, mz);
    miniG.add(strip);
  }
  // Shelving aisles (already mid-tone — unchanged)
  const miniShelfMat = new THREE.MeshBasicMaterial({ color: 0x457d8f });
  const miniBoxColors = [0x6fa8be, 0xd9b85b, 0x6ba67c, 0x7e8fb0];
  for (const [sx, tilt] of [[-0.46, 0.28], [0.46, 0.0]]) {
    const shG = new THREE.Group();
    shG.position.set(sx, 0.06, -0.14);
    shG.rotation.z = -tilt;
    const rack = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.86, 1.05), miniShelfMat);
    rack.position.y = 0.43;
    shG.add(rack);
    for (let k = 0; k < 4; k++) {
      const pk = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.14, 0.96), new THREE.MeshBasicMaterial({ color: miniBoxColors[k] }));
      pk.position.y = 0.16 + k * 0.20;
      shG.add(pk);
    }
    miniG.add(shG);
  }
  // Tiny red soup cans — saturated red kept (anchor)
  const miniCanMat = new THREE.MeshBasicMaterial({ color: 0xeb241c });
  for (const [cx, cz] of [[-0.22, -0.35], [-0.14, -0.18], [-0.28, -0.05], [-0.08, -0.44], [0.16, -0.32]]) {
    const mc = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.075, 8), miniCanMat);
    mc.position.set(cx, 0.09, cz);
    mc.rotation.z = 0.8;
    miniG.add(mc);
  }
  // Miniature clerk: head was 0xfffaf4 (blob). Now warm paper so the ink face reads (Qwen round 3).
  const miniClerk = new THREE.Group();
  miniClerk.position.set(-0.12, 0.06, 0.14);
  miniClerk.scale.setScalar(1.12);
  const mcTorso = inkMesh(new THREE.CapsuleGeometry(0.085, 0.14, 6, 10), new THREE.MeshBasicMaterial({ color: 0xd92222 }), 0.012);
  mcTorso.position.y = 0.24;
  miniClerk.add(mcTorso);
  const mcHead = inkMesh(new THREE.SphereGeometry(0.14, 14, 12), new THREE.MeshBasicMaterial({ color: 0xdccfb8 }), 0.016);
  mcHead.position.y = 0.48;
  miniClerk.add(mcHead);
  const inkB = new THREE.MeshBasicMaterial({ color: 0x1e151a });
  for (const ex of [-0.045, 0.045]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.034, 8, 8), inkB);
    eye.position.set(ex, 0.49, 0.132);
    miniClerk.add(eye);
  }
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.033, 8, 8), inkB);
  mouth.position.set(0, 0.43, 0.134);
  miniClerk.add(mouth);
  miniG.add(miniClerk);

  // Miniature Saturated Red Shopping Cart (`red_cart_mini`) bursting OUT of the front crack of the glass dome!
  const miniCart = new THREE.Group();
  miniCart.name = 'red_cart_mini';
  miniCart.position.set(0.18, 0.36, 0.88);
  miniCart.rotation.set(-0.18, 0.28, 0.12);
  const mcRed = new THREE.MeshBasicMaterial({ color: 0xf51c1c });
  const mcChrome = new THREE.MeshBasicMaterial({ color: 0xd8e0e8 });
  const mcBasket = inkMesh(new THREE.BoxGeometry(0.28, 0.24, 0.46), mcRed, 0.016);
  mcBasket.position.y = 0.18;
  miniCart.add(mcBasket);
  const mcHandle = inkMesh(new THREE.BoxGeometry(0.32, 0.04, 0.04), mcRed, 0.012);
  mcHandle.position.set(0, 0.34, -0.22);
  miniCart.add(mcHandle);
  const mcFrame = inkMesh(new THREE.BoxGeometry(0.26, 0.04, 0.42), mcChrome, 0.012);
  mcFrame.position.y = 0.04;
  miniCart.add(mcFrame);
  for (const [wx, wz] of [[-0.12, 0.16], [0.12, 0.16], [-0.12, -0.16], [0.12, -0.16]]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.03, 10), inkB);
    w.rotation.z = Math.PI / 2;
    w.position.set(wx, 0.0, wz);
    miniCart.add(w);
  }
  miniG.add(miniCart);

  // 36 Swirling White Snowflakes INSIDE the Snow Globe
  const globeSnowflakes = [];
  const rngSnow = mkRng(9024);
  for (let i = 0; i < 36; i++) {
    const fl = new THREE.Mesh(new THREE.SphereGeometry(0.022 + rngSnow() * 0.018, 6, 6), snowMat);
    const a = rngSnow() * Math.PI * 2;
    const r = 0.18 + rngSnow() * 0.72;
    const y0 = 0.20 + rngSnow() * 1.45;
    fl.position.set(Math.cos(a) * r, y0, Math.sin(a) * r);
    miniG.add(fl);
    globeSnowflakes.push({ mesh: fl, a, r, y0, spd: 0.45 + rngSnow() * 0.6 });
  }

  // 3. Outer Curved Glass Sphere (Fresnel rim + specular crescent highlight + bold dark outline ring!)
  const glassCenterY = 1.18;
  const glassR = 1.06;
  const glassSphere = new THREE.Mesh(new THREE.SphereGeometry(glassR, 36, 26), createSnowGlobeGlassMat(THREE));
  glassSphere.position.y = glassCenterY;
  glassSphere.renderOrder = 6;
  globeGrp.add(glassSphere);

  // Subtle icy cartoon glass rim contour ring (back-face expanded shell) so the circular glass globe silhouette pops even at 360x640!
  const rimShell = new THREE.Mesh(
    new THREE.SphereGeometry(glassR * 1.018, 36, 26),
    new THREE.MeshBasicMaterial({ color: 0xeafaff, side: THREE.BackSide, transparent: true, opacity: 0.55, depthWrite: false })
  );
  rimShell.position.y = glassCenterY;
  rimShell.renderOrder = 5;
  globeGrp.add(rimShell);

  // Spiderweb jagged white glass crack radiating around the front impact hole where red_cart_mini pokes out!
  const crackGrp = new THREE.Group();
  crackGrp.position.set(0.18, 0.90, 0.96);
  const crackMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 });
  for (let i = 0; i < 9; i++) {
    const ang = (i / 9) * Math.PI * 2 + 0.15;
    const len = 0.28 + (i % 3) * 0.14;
    const ray = new THREE.Mesh(new THREE.BoxGeometry(0.018, len, 0.014), crackMat);
    ray.position.set(Math.cos(ang) * len * 0.45, Math.sin(ang) * len * 0.45, -len * 0.12);
    ray.rotation.z = ang - Math.PI / 2;
    crackGrp.add(ray);
  }
  globeGrp.add(crackGrp);

  // 28 Shimmering Triangular Glass Shards bursting outward from the cracked snow globe in S22 (t = 48.49..50.52)!
  const shardGeo = new THREE.ConeGeometry(0.11, 0.24, 3);
  const shardMat = new THREE.MeshBasicMaterial({ color: 0xdff9ff, transparent: true, opacity: 0.86, side: THREE.DoubleSide });
  const shards = [];
  const rngSh = mkRng(4849);
  for (let i = 0; i < 28; i++) {
    const sm = new THREE.Mesh(shardGeo, shardMat);
    const ang = (i / 28) * Math.PI * 2 + (rngSh() - 0.5) * 0.25;
    const spd = 1.2 + rngSh() * 2.2;
    const sc = 0.55 + rngSh() * 0.85;
    sm.scale.set(sc, sc, 0.18);
    globeGrp.add(sm);
    shards.push({
      mesh: sm,
      vx: Math.cos(ang) * spd * 0.85,
      vy: Math.sin(ang) * spd * 0.72 + 0.65,
      vz: 1.4 + rngSh() * 2.2,
      rx: (rngSh() - 0.5) * 8, ry: (rngSh() - 0.5) * 8, rz: (rngSh() - 0.5) * 8,
    });
  }

  // ---- PURE-IN-t UPDATE FUNCTION ----
  function update(t) {
    rig.update(t);

    // 1. Swinging industrial pendant lamp over soup cross-aisle
    if (t >= T_SOUP_HIT) {
      const dt = t - T_SOUP_HIT;
      soupLampGrp.rotation.z = Math.sin(dt * 3.8) * Math.exp(-dt * 0.12) * 0.36;
    } else {
      soupLampGrp.rotation.z = 0;
    }

    // 2. Intact soup pyramid vs 42 slow-motion mid-air soup cans
    const hit = t >= T_SOUP_HIT;
    pyramidGrp.visible = !hit;
    soupScatterGrp.visible = hit;
    if (hit) {
      const dt = t - T_SOUP_HIT;
      // Fast initial blast (0..0.7s) then dreamy 0.22x slow-motion suspension during S09 (18.98-20.84) & S10 (20.84-23.72)!
      const blast = smooth(dt / 0.55);
      // Gentle slow drift after t = 16.96s so cans fan cleanly out from clerk's face in S08 and hang suspended in S09 & S10!
      const slowT = Math.max(0, dt - 0.55);
      const driftK = slowT * 0.20;
      const gSlow = 0.085; // ultra-cinematic slow-motion gravity!
      for (const { mesh, sp } of soupCanMeshes) {
        const bx = lerp(sp.x0, sp.tx, blast) + sp.vx * driftK;
        const by = Math.max(0.20, lerp(sp.y0, sp.ty, blast) + (sp.vy * 0.14) * driftK - gSlow * slowT * slowT);
        const bz = lerp(sp.z0, sp.tz, blast) + sp.vz * driftK;
        mesh.position.set(bx, by, bz);
        mesh.rotation.set(sp.spinX * (0.6 + slowT * 0.35), sp.spinY * (0.6 + slowT * 0.35), sp.spinZ * (0.6 + slowT * 0.35));
      }
    }

    // 3. Domino collapse of 4 left-side shelving towers after soup impact
    for (const sh of collapsingShelves) {
      const dt = t - (T_SOUP_HIT + sh.delay);
      const u = dt > 0 ? smooth(dt / 4.2) : 0;
      // Tilt inward (+X = negative Z rotation around bottom edge) up to 34 deg in slow motion!
      sh.grp.rotation.z = -u * (34 * Math.PI / 180);
    }

    // 4. Display crates explode outward when red_cart sweeps through (S18)
    for (const cr of crateList) {
      const dt = t - cr.hitT;
      if (dt <= 0) {
        cr.mesh.position.set(cr.x0, cr.y0, cr.z0);
        cr.mesh.rotation.set(0, 0, 0);
      } else {
        const u = Math.min(dt, 2.2);
        const y = Math.max(0.31, cr.y0 + cr.vy * u - 4.4 * u * u);
        cr.mesh.position.set(cr.x0 + cr.vx * u, y, cr.z0 + cr.vz * u);
        cr.mesh.rotation.set(cr.rx * u, cr.ry * u, cr.rz * u);
      }
    }

    // 5. Foyer ceiling flicker & rotating red warning beacon as time thaws (S19-S21)
    if (t >= 40.12 && t < T_SHATTER) {
      const pulse = Math.sin(t * 21) > -0.35;
      for (const f of fluoFixtures) f.tube.material = pulse ? mFluoOn : mFluoDim;
      beaconBulb.scale.setScalar(0.85 + 0.35 * Math.max(0, Math.sin(t * 10)));
    } else {
      for (const f of fluoFixtures) f.tube.material = f.baseMat;
      beaconBulb.scale.setScalar(0.8);
    }

    // 6. Sliding glass doors stay intact until shatter at 48.49s
    glassDoorsGrp.visible = t < T_SHATTER;

    // 7. Outer snow globe: swirling snowflakes & glass shard burst (S22 -> settles on desk in S23/S24!)
    const gdt = Math.max(0, t - T_SHATTER);
    for (const fl of globeSnowflakes) {
      const ang = fl.a + t * fl.spd;
      const y = 0.16 + ((fl.y0 - t * 0.18) % 1.45 + 1.45) % 1.45;
      fl.mesh.position.set(Math.cos(ang) * fl.r, y, Math.sin(ang) * fl.r);
    }
    for (const sh of shards) {
      if (t < T_SHATTER) {
        sh.mesh.visible = false;
      } else {
        sh.mesh.visible = true;
        // Dramatic airborne shard explosion in S22 (gdt = 0..2.0s), then settled twinkling shards around base on desk in S23-S24!
        const airU = Math.min(gdt, 1.55);
        const settled = gdt > 2.2;
        if (!settled) {
          const sx = 0.18 + sh.vx * airU * 0.65;
          const sy = Math.max(0.04, 0.90 + sh.vy * airU * 0.55 - 1.35 * airU * airU);
          const sz = 0.96 + sh.vz * airU * 0.55;
          sh.mesh.position.set(sx, sy, sz);
          sh.mesh.rotation.set(sh.rx * airU, sh.ry * airU, sh.rz * airU);
        } else {
          // Rest cleanly scattered on the wooden desk surface around the snow globe pedestal!
          const sx = 0.18 + clamp(sh.vx * 0.42, -1.3, 1.3);
          const sz = clamp(0.85 + sh.vz * 0.18, 0.35, 1.05);
          sh.mesh.position.set(sx, 0.03, sz);
          sh.mesh.rotation.set(Math.PI / 2, sh.ry, 0);
        }
      }
    }
  }

  // Expose named points for cameras & probing
  const points = {
    snow_globe: globeGrp,
    soup_pyramid: pyramidGrp,
    glass_doors: glassDoorsGrp,
  };

  return {
    ...base,
    marks: {
      start: [0, -23.65],
      soup: [0.35, -7.6],
      guard: [0.15, 5.1],
      foyer: [0, 24.0],
      outer_desk: [OUTER_X, 0],
    },
    points,
    rig,
    look,
    update,
  };
}
