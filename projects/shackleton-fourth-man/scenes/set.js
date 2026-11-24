// scenes/set.js — «The Fourth Man on South Georgia» (Build Repair 1)
// Pure in t: deterministic PRNG only, zero mutable cross-frame state.
// Scale: D = real metres * 1.6 (lifeboat = 10.7 D, rope = 24 D, places 400 D apart).
// BUILD REPAIR 1 ROOT-CAUSE FIXES:
//   1. Real THREE.Light rig added to scene (HemisphereLight + AmbientLight + moving DirectionalLight
//      + per-place PointLight practicals + macro stage key/rim PointLights) so MeshStandardMaterial
//      terrain, snow, sea, shelter, and macro props render brightly lit instead of pure black.
//   2. Vertex-coloured sky domes (vertexColors: true, fog: false, depthWrite: true, renderOrder: -10,
//      radius 85 D centred on every place/bay) + live scene.background sync in update(t), eliminating
//      canvas-texture silent failures and camera.far clipping.
//   3. Macro stage alignment: SH11 (t=26.0-27.35 s, Frame 801 @ 26.7 s) frames the hero leather boot
//      with 10 gleaming brass/steel screws biting into bright blue glacier ice; SH12 (27.35-28.65 s)
//      frames the swinging adze biting ice + chips; SH13 (28.65-30.0 s) frames taut rope + hands.
// THE FOURTH MAN RULE: traces only (4th footprints, ownerless shadow, unlit off-centre mist silhouette,
// taut ghost rope) — zero visible 4th character anywhere.

export const PLACES = {
  GLACIER_MARCH:      [0,    0, 0],
  LIFEBOAT_SEA:       [400,  0, 0],
  ELEPHANT_ISLAND:    [800,  0, 0],
  GLACIER_CROSSING:   [1200, 0, 0],
  SNOW_SLEEP:         [1600, 0, 0],
  SHELTER_CONFESSION: [2000, 0, 0],
  LANDING_VIGNETTES:  [2400, 0, 0],
};

// Lights as data per place (world/look/lights.js schema, <= 8 lights per place)
export const lights = {
  GLACIER_MARCH: {
    sky: [0.46, 0.56, 0.66],
    ground: [0.30, 0.36, 0.44],
    bgHex: '#7d92a8',
    fog: { color: '#8398ad', density: 0.008 },
    lights: [
      { id: 'march_sun', kind: 'sun',   color: '#cfe0f0', power: 1.45, dir: [-0.45, 0.72, 0.52] },
      { id: 'cairn_1',   kind: 'point', color: '#ffcc70', power: 2.20, pos: [-4.2, 2.2, -10], range: 26 },
      { id: 'cairn_2',   kind: 'point', color: '#ffcc70', power: 2.20, pos: [4.8, 2.4, -28],  range: 28 },
    ],
  },
  LIFEBOAT_SEA: {
    sky: [0.16, 0.28, 0.36],
    ground: [0.08, 0.16, 0.22],
    bgHex: '#2d4b5e',
    fog: { color: '#284252', density: 0.011 },
    lights: [
      { id: 'sea_key',   kind: 'sun',   color: '#b8d0dc', power: 1.35, dir: [0.35, 0.65, 0.65] },
      { id: 'bow_lamp',  kind: 'point', color: '#ffc668', power: 2.60, pos: [400, 1.8, 4.35],     range: 18 },
      { id: 'helm_lamp', kind: 'point', color: '#ffaa44', power: 2.40, pos: [400.75, 1.6, -3.35], range: 16 },
    ],
  },
  ELEPHANT_ISLAND: {
    sky: [0.32, 0.44, 0.55],
    ground: [0.22, 0.28, 0.36],
    bgHex: '#5c758c',
    fog: { color: '#5b7287', density: 0.007 },
    lights: [
      { id: 'isl_key',   kind: 'sun',   color: '#bfd2e4', power: 1.30, dir: [-0.3, 0.7, 0.6] },
      { id: 'campfire',  kind: 'point', color: '#ffa834', power: 3.40, pos: [800.2, 1.0, -4.5], range: 22 },
      { id: 'camp_l1',   kind: 'point', color: '#ffbe5c', power: 2.00, pos: [795.4, 2.4, -6.2], range: 20 },
    ],
  },
  GLACIER_CROSSING: {
    sky: [0.54, 0.68, 0.80],
    ground: [0.34, 0.46, 0.58],
    bgHex: '#90b2cf',
    fog: { color: '#9bb8cf', density: 0.009 },
    lights: [
      { id: 'cross_sun', kind: 'sun',   color: '#e0f0fc', power: 1.55, dir: [-0.35, 0.78, 0.5] },
      { id: 'ice_l1',    kind: 'point', color: '#ffd278', power: 2.20, pos: [1196.2, 2.1, -8],  range: 24 },
      { id: 'ice_l2',    kind: 'point', color: '#ffd278', power: 2.20, pos: [1204.2, 2.2, -24], range: 26 },
    ],
  },
  SNOW_SLEEP: {
    sky: [0.10, 0.20, 0.36],
    ground: [0.08, 0.14, 0.26],
    bgHex: '#1d365c',
    fog: { color: '#223859', density: 0.012 },
    lights: [
      { id: 'moon_key',  kind: 'sun',   color: '#6d95cc', power: 1.15, dir: [-0.4, 0.65, 0.55] },
      { id: 'sleep_l1',  kind: 'point', color: '#ffaa44', power: 3.00, pos: [1602.1, 1.4, 0.4], range: 18 },
      { id: 'sleep_l2',  kind: 'point', color: '#8ec8ff', power: 1.80, pos: [1595.5, 2.6, -24], range: 24 },
    ],
  },
  SHELTER_CONFESSION: {
    sky: [0.22, 0.14, 0.09],
    ground: [0.14, 0.09, 0.06],
    bgHex: '#274060',
    fog: { color: '#2e2018', density: 0.014 },
    lights: [
      { id: 'stove_key', kind: 'point', color: '#ff9c3c', power: 3.80, pos: [2000, 1.1, -2.2],  range: 22 },
      { id: 'hall_l1',   kind: 'point', color: '#ffbd58', power: 2.80, pos: [2000, 6.0, -3.5],  range: 24 },
      { id: 'hall_l2',   kind: 'point', color: '#ffbd58', power: 2.40, pos: [2000, 6.0, -14.5], range: 24 },
      { id: 'win_rim',   kind: 'spot',  color: '#5d84b8', power: 1.80, pos: [2000, 4.8, -33.0], dir: [0, -0.1, 1], range: 36 },
    ],
  },
  LANDING_VIGNETTES: {
    sky: [0.42, 0.44, 0.56],
    ground: [0.24, 0.26, 0.34],
    bgHex: '#726a7a',
    fog: { color: '#4c6282', density: 0.007 },
    lights: [
      { id: 'dawn_sun',  kind: 'sun',   color: '#f5be78', power: 1.48, dir: [-0.25, 0.58, 0.76] },
      { id: 'vig_l1',    kind: 'point', color: '#ffd078', power: 2.40, pos: [2396.8, 2.1, -9],  range: 24 },
      { id: 'vig_l2',    kind: 'point', color: '#ffb848', power: 2.60, pos: [2445.0, 1.8, 0.95], range: 20 },
      { id: 'vig_flare', kind: 'point', color: '#ff6b38', power: 3.00, pos: [2487.8, 0.6, -2.0], range: 22 },
    ],
  },
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function smoothstep(a, b, x) {
  const u = clamp((x - a) / (b - a || 1), 0, 1);
  return u * u * (3 - 2 * u);
}

function hexToRgb01(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function makeCanvasTex(THREE, w, h, drawFn) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  drawFn(ctx, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

// Vertex-coloured sky dome: NEVER fails on missing canvas, NEVER clips camera.far (r = 85 D),
// writes depth (depthWrite: true, renderOrder: -10), ignores scene fog (fog: false).
function makeSkyDome(THREE, radius, topHex, midHex, botHex, name = 'sky_dome') {
  const geo = new THREE.SphereGeometry(radius, 24, 16);
  const pos = geo.attributes.position;
  const top = hexToRgb01(topHex);
  const mid = hexToRgb01(midHex);
  const bot = hexToRgb01(botHex);
  const colors = new Float32Array(pos.count * 3);

  for (let i = 0; i < pos.count; i++) {
    const yNorm = clamp(pos.getY(i) / radius, -1, 1); // -1 bottom .. 0 horizon .. +1 zenith
    let r, g, b;
    if (yNorm >= 0) {
      const u = Math.pow(yNorm, 0.72);
      r = mid[0] + (top[0] - mid[0]) * u;
      g = mid[1] + (top[1] - mid[1]) * u;
      b = mid[2] + (top[2] - mid[2]) * u;
    } else {
      const u = Math.pow(-yNorm, 0.75);
      r = mid[0] + (bot[0] - mid[0]) * u;
      g = mid[1] + (bot[1] - mid[1]) * u;
      b = mid[2] + (bot[2] - mid[2]) * u;
    }
    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    side: THREE.BackSide,
    depthWrite: true,
    fog: false,
  });
  const dome = new THREE.Mesh(geo, mat);
  dome.name = name;
  dome.renderOrder = -10;
  dome.userData = { topHex, midHex, botHex, radius };
  return dome;
}

function makeSnowTex(THREE, base = '#dce8f4', streak = '#b8cde0', seed = 11) {
  return makeCanvasTex(THREE, 256, 256, (ctx, w, h) => {
    const rnd = mulberry32(seed);
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 42; i++) {
      ctx.fillStyle = streak;
      ctx.globalAlpha = 0.22 + rnd() * 0.25;
      const y = rnd() * h;
      ctx.fillRect(0, y, w, 2 + rnd() * 6);
    }
    ctx.globalAlpha = 1;
  });
}

function makeIceRockTex(THREE, c1 = '#5a7894', c2 = '#8ab0ce', c3 = '#dcecf7', seed = 23) {
  return makeCanvasTex(THREE, 256, 256, (ctx, w, h) => {
    const rnd = mulberry32(seed);
    ctx.fillStyle = c1;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 65; i++) {
      ctx.fillStyle = i % 3 === 0 ? c3 : c2;
      ctx.globalAlpha = 0.28 + rnd() * 0.35;
      ctx.beginPath();
      const x = rnd() * w, y = rnd() * h, rw = 18 + rnd() * 52, rh = 8 + rnd() * 28;
      ctx.moveTo(x, y);
      ctx.lineTo(x + rw, y - rh * 0.4);
      ctx.lineTo(x + rw * 0.7, y + rh);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  });
}

function makeTimberTex(THREE, base = '#5c3c24', grain = '#3d2514', seam = '#24140a') {
  return makeCanvasTex(THREE, 256, 256, (ctx, w, h) => {
    const rnd = mulberry32(71);
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);
    for (let p = 0; p < 6; p++) {
      const y = (p * h) / 6;
      ctx.fillStyle = seam;
      ctx.fillRect(0, y, w, 3);
      for (let g = 0; g < 14; g++) {
        ctx.fillStyle = grain;
        ctx.globalAlpha = 0.18 + rnd() * 0.25;
        ctx.fillRect(0, y + 4 + rnd() * (h / 6 - 6), w, 2);
      }
    }
    ctx.globalAlpha = 1;
  });
}

function makeLantern(THREE, glowHex = 0xffc668, poleH = 2.2, lightIntensity = 0) {
  const g = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0x2b2d34, roughness: 0.6, metalness: 0.35 });
  const glass = new THREE.MeshBasicMaterial({ color: glowHex });
  if (poleH > 0) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, poleH, 8), metal);
    pole.position.y = poleH * 0.5;
    g.add(pole);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.05, 0.05), metal);
    arm.position.set(0.2, poleH - 0.08, 0);
    g.add(arm);
  }
  const lx = poleH > 0 ? 0.38 : 0;
  const ly = poleH > 0 ? poleH - 0.35 : 0.28;
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.16, 8), metal);
  cap.position.set(lx, ly + 0.22, 0);
  g.add(cap);
  const bulb = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.12, 0.32, 10), glass);
  bulb.position.set(lx, ly, 0);
  g.add(bulb);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.20, 0.10, 8), metal);
  base.position.set(lx, ly - 0.20, 0);
  g.add(base);
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.36, 12, 10),
    new THREE.MeshBasicMaterial({ color: glowHex, transparent: true, opacity: 0.28, depthWrite: false })
  );
  halo.position.set(lx, ly, 0);
  g.add(halo);
  if (lightIntensity > 0) {
    const pt = new THREE.PointLight(glowHex, lightIntensity, 28, 1);
    pt.position.set(lx, ly, 0);
    g.add(pt);
  }
  return g;
}

// Keep peaks inside r = 34..68 D so they sit cleanly inside the r = 85 D sky dome
function makePeakRing(THREE, matRock, matSnow, seed, count, minR, maxR, minH, maxH) {
  const g = new THREE.Group();
  const rnd = mulberry32(seed);
  for (let i = 0; i < count; i++) {
    const ang = (i / count) * Math.PI * 2 + (rnd() - 0.5) * 0.22;
    const dist = minR + rnd() * (maxR - minR);
    const h = minH + rnd() * (maxH - minH);
    const r = h * (0.45 + rnd() * 0.35);
    const peak = new THREE.Group();
    const body = new THREE.Mesh(new THREE.ConeGeometry(r, h, 6 + Math.floor(rnd() * 3)), matRock);
    body.position.y = h * 0.5 - 2.0;
    body.rotation.y = rnd() * Math.PI;
    peak.add(body);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(r * 0.44, h * 0.44, 6), matSnow);
    cap.position.y = h * 0.78 - 2.0;
    cap.rotation.y = body.rotation.y;
    peak.add(cap);
    peak.position.set(Math.cos(ang) * dist, 0, Math.sin(ang) * dist);
    g.add(peak);
  }
  return g;
}

function makeFootprintTrail(THREE, countPerLane, zStart, zStep, includeFourth = true) {
  const g = new THREE.Group();
  const printMat = new THREE.MeshStandardMaterial({ color: 0x4c6b8c, roughness: 0.92 });
  const fourthMat = new THREE.MeshStandardMaterial({ color: 0x38587a, roughness: 0.90 });
  const lanes = includeFourth ? [-1.55, -0.52, 0.52, 1.58] : [-1.1, 0.0, 1.1];
  for (let l = 0; l < lanes.length; l++) {
    const isFourth = includeFourth && l === 3;
    for (let i = 0; i < countPerLane; i++) {
      const side = (i % 2 === 0 ? -1 : 1) * 0.14;
      const fp = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.06, 0.44),
        isFourth ? fourthMat : printMat
      );
      fp.position.set(lanes[l] + side, 0.03, zStart + i * zStep);
      fp.rotation.y = (i % 2 === 0 ? 0.07 : -0.07);
      fp.userData = { lane: l, stepIdx: i, isFourth };
      g.add(fp);
    }
  }
  return g;
}

function makeOwnerlessShadow(THREE, len = 4.2, w = 0.75) {
  const mat = new THREE.MeshBasicMaterial({
    color: 0x1a2c44,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
  });
  const g = new THREE.Group();
  const torso = new THREE.Mesh(new THREE.PlaneGeometry(w, len), mat);
  torso.rotation.x = -Math.PI / 2;
  torso.position.y = 0.04;
  g.add(torso);
  const head = new THREE.Mesh(new THREE.CircleGeometry(w * 0.46, 14), mat);
  head.rotation.x = -Math.PI / 2;
  head.position.set(0, 0.045, len * 0.56);
  g.add(head);
  return g;
}

function makeMistSilhouette(THREE) {
  const mat = new THREE.MeshBasicMaterial({
    color: 0x5c7288,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
  });
  const g = new THREE.Group();
  const cloak = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.55, 2.2, 8), mat);
  cloak.position.y = 1.1;
  g.add(cloak);
  const hood = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8), mat);
  hood.position.y = 2.38;
  g.add(hood);
  return g;
}

function makeSnowField(THREE, count, spanX, spanY, spanZ, seed) {
  const rnd = mulberry32(seed);
  const g = new THREE.Group();
  const geo = new THREE.SphereGeometry(0.06, 5, 4);
  const mat = new THREE.MeshBasicMaterial({ color: 0xf4f9ff, transparent: true, opacity: 0.85 });
  const flakes = [];
  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(geo, mat);
    const base = {
      x: (rnd() - 0.5) * spanX,
      y: rnd() * spanY,
      z: (rnd() - 0.5) * spanZ,
      vx: 3.5 + rnd() * 4.5,
      vy: -(1.2 + rnd() * 2.0),
      phase: rnd() * 6.283,
    };
    m.position.set(base.x, base.y, base.z);
    g.add(m);
    flakes.push({ m, base });
  }
  return { group: g, flakes, spanX, spanY };
}

function updateSnowField(sf, t) {
  const halfX = sf.spanX * 0.5;
  for (let i = 0; i < sf.flakes.length; i++) {
    const { m, base } = sf.flakes[i];
    const x = ((base.x + t * base.vx + halfX) % sf.spanX + sf.spanX) % sf.spanX - halfX;
    const y = ((base.y + t * base.vy) % sf.spanY + sf.spanY) % sf.spanY;
    m.position.set(x, y, base.z + Math.sin(t * 2.2 + base.phase) * 0.25);
  }
}

function makeJamesCaird(THREE, woodMat, darkWoodMat, brassMat) {
  const boat = new THREE.Group();
  boat.name = 'james_caird';
  const shape = new THREE.Shape();
  shape.moveTo(0, 5.35);
  shape.quadraticCurveTo(1.85, 3.0, 1.80, 0);
  shape.quadraticCurveTo(1.70, -3.2, 0, -5.35);
  shape.quadraticCurveTo(-1.70, -3.2, -1.80, 0);
  shape.quadraticCurveTo(-1.85, 3.0, 0, 5.35);

  const outer = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, { depth: 1.45, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.10, bevelSegments: 2 }),
    woodMat
  );
  outer.rotation.x = Math.PI / 2;
  outer.position.y = 1.45;
  boat.add(outer);

  const deck = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.14, 7.8), darkWoodMat);
  deck.position.set(0, 0.35, 0);
  boat.add(deck);

  for (const tz of [-2.8, -0.9, 1.0, 2.9]) {
    const thwart = new THREE.Mesh(new THREE.BoxGeometry(3.15, 0.14, 0.52), darkWoodMat);
    thwart.position.set(0, 1.08, tz);
    boat.add(thwart);
  }

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 4.6, 10), darkWoodMat);
  mast.position.set(0, 2.5, 2.2);
  boat.add(mast);

  const tiller = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 1.8), darkWoodMat);
  tiller.position.set(0, 1.55, -4.3);
  boat.add(tiller);

  const oars = [];
  for (const side of [-1, 1]) {
    const oarPivot = new THREE.Group();
    oarPivot.position.set(side * 1.72, 1.45, 0.3);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 4.6, 8), woodMat);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.x = side * 1.4;
    oarPivot.add(shaft);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.06, 0.28), darkWoodMat);
    blade.position.x = side * 3.45;
    oarPivot.add(blade);
    boat.add(oarPivot);
    oars.push({ pivot: oarPivot, side });
  }

  const bowLamp = makeLantern(THREE, 0xffc668, 0.0, 5.5);
  bowLamp.position.set(0, 1.65, 4.35);
  boat.add(bowLamp);

  const helmLamp = makeLantern(THREE, 0xffaa44, 0.0, 4.5);
  helmLamp.position.set(0.75, 1.48, -3.35);
  boat.add(helmLamp);

  for (const side of [-1, 1]) {
    const cleat = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.10, 0.38), brassMat);
    cleat.position.set(side * 1.65, 1.52, -1.8);
    boat.add(cleat);
  }

  return { group: boat, oars };
}

// §7 MANDATORY CLOSE-UP RIGS (GLACIER_CROSSING macro zone)
// Aligned with film.js SH11/SH12/SH13 cameras:
//   - x = +22 (SH11, 26.00-27.35 s, Frame 801 @ t=26.7 s): BOOT SOLE WITH 10 GLEAMING SCREWS BITING ICE
//   - x = +36 (SH12, 27.35-28.65 s, Frame 840 @ t=28.0 s): ADZE (فأس) BITING GLACIER ICE + CHIPS
//   - x = +50 (SH13, 28.65-30.00 s): TAUT BRAIDED ROPE OVER COAT SHOULDER + GRIPPING HANDS
function makeMacroZone(THREE, iceMat, snowMat) {
  const macro = new THREE.Group();
  macro.name = 'macro_zone';

  // Dedicated local sky dome centred on the macro zone so sky & depth always read crisp
  const macroDome = makeSkyDome(THREE, 85, '#4e79a3', '#88b0d1', '#d6e6f5', 'sky_dome_macro');
  macroDome.position.set(36, 0, -6);
  macro.add(macroDome);

  // 1. x = +22 (SH11, Frame 801 @ t=26.7 s): Heavy Leather Boot Sole studded with 10 gleaming Screws biting ice
  const bootStage = new THREE.Group();
  bootStage.name = 'macro_boot_screws';
  bootStage.position.set(22, 0, -6);

  const iceSlab = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.6, 4.8), iceMat);
  iceSlab.position.set(0, 0.55, 0);
  bootStage.add(iceSlab);
  const snowFrost = new THREE.Mesh(new THREE.BoxGeometry(7.3, 0.18, 4.9), snowMat);
  snowFrost.position.set(0, 1.38, 0);
  bootStage.add(snowFrost);
  // Ice ridge backdrop behind boot for crisp depth
  const bootIceBackdrop = new THREE.Mesh(new THREE.BoxGeometry(16, 10, 2.2), iceMat);
  bootIceBackdrop.position.set(0, 3.8, -5.8);
  bootStage.add(bootIceBackdrop);

  const bootPivot = new THREE.Group();
  bootPivot.position.set(0.08, 2.15, 0.20);
  const leatherMat = new THREE.MeshStandardMaterial({ color: 0x4d311f, roughness: 0.72 });
  const soleMat = new THREE.MeshStandardMaterial({ color: 0x261810, roughness: 0.85 });
  const screwMat = new THREE.MeshStandardMaterial({ color: 0xf4d26e, emissive: 0x3b2c08, roughness: 0.22, metalness: 0.65 });

  const ankle = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.50, 1.35, 12), leatherMat);
  ankle.position.set(-0.32, 0.85, 0);
  bootPivot.add(ankle);
  const vamp = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.62, 0.94), leatherMat);
  vamp.position.set(0.18, 0.26, 0);
  bootPivot.add(vamp);
  const sole = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.22, 1.00), soleMat);
  sole.position.set(0.18, -0.14, 0);
  bootPivot.add(sole);
  const heel = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.28, 0.96), soleMat);
  heel.position.set(-0.36, -0.26, 0);
  bootPivot.add(heel);

  // 10 gleaming threaded screws (مسامير قلاووظ) clearly visible on underside & biting ice
  const screwCoords = [
    [0.80, -0.32, -0.28], [0.80, -0.32, 0.28],
    [0.44, -0.32, -0.34], [0.44, -0.32, 0.00], [0.44, -0.32, 0.34],
    [0.08, -0.32, -0.28], [0.08, -0.32, 0.28],
    [-0.28, -0.45, -0.26], [-0.28, -0.45, 0.26], [-0.54, -0.45, 0.00],
  ];
  for (const [sx, sy, sz] of screwCoords) {
    const screw = new THREE.Group();
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.06, 10), screwMat);
    head.position.y = 0.04;
    screw.add(head);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.062, 0.28, 8), screwMat);
    tip.rotation.x = Math.PI;
    tip.position.y = -0.10;
    screw.add(tip);
    screw.position.set(sx, sy, sz);
    bootPivot.add(screw);
  }
  bootStage.add(bootPivot);

  // Dedicated front key light for the boot-screws macro shot (Frame 801)
  const bootKeyLight = new THREE.PointLight(0xfff4e0, 8.0, 22, 1);
  bootKeyLight.position.set(1.2, 2.8, 3.6);
  bootStage.add(bootKeyLight);
  const bootRimLight = new THREE.PointLight(0x9ad4ff, 5.0, 20, 1);
  bootRimLight.position.set(-2.2, 2.2, 2.2);
  bootStage.add(bootRimLight);
  macro.add(bootStage);

  // 2. x = +36 (SH12, Frame 840 @ t=28.0 s): Carpenter's Adze (فأس) biting glacier ice + chips
  const adzeStage = new THREE.Group();
  adzeStage.name = 'macro_adze';
  adzeStage.position.set(36, 0, -6);

  const iceBlock = new THREE.Mesh(new THREE.BoxGeometry(6.5, 2.2, 4.2), iceMat);
  iceBlock.position.set(0, 0.7, 0);
  adzeStage.add(iceBlock);
  const carvedNotch = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.42, 1.0),
    new THREE.MeshStandardMaterial({ color: 0x4a7ea8, roughness: 0.4 })
  );
  carvedNotch.position.set(0, 1.72, 0.45);
  adzeStage.add(carvedNotch);
  const adzeBackdrop = new THREE.Mesh(new THREE.BoxGeometry(16, 10, 2.2), iceMat);
  adzeBackdrop.position.set(0, 3.8, -5.8);
  adzeStage.add(adzeBackdrop);

  const adzePivot = new THREE.Group();
  adzePivot.position.set(0.95, 2.85, 0.35);
  const handleMat = new THREE.MeshStandardMaterial({ color: 0x8b5a30, roughness: 0.78 });
  const steelMat = new THREE.MeshStandardMaterial({ color: 0xb6c4d4, emissive: 0x1c242e, roughness: 0.32, metalness: 0.65 });
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.095, 2.1, 10), handleMat);
  handle.rotation.z = 0.75;
  handle.position.set(-0.45, -0.35, 0);
  adzePivot.add(handle);
  const headSocket = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.30, 0.28), steelMat);
  headSocket.position.set(-1.12, -1.02, 0);
  adzePivot.add(headSocket);
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.12, 0.44), steelMat);
  blade.position.set(-1.26, -1.16, 0);
  blade.rotation.z = 0.42;
  adzePivot.add(blade);
  const poll = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.18, 0.24), steelMat);
  poll.position.set(-0.96, -0.94, 0);
  adzePivot.add(poll);
  adzeStage.add(adzePivot);

  const chips = [];
  const chipGeo = new THREE.OctahedronGeometry(0.11, 0);
  const chipMat = new THREE.MeshStandardMaterial({ color: 0xeaf7ff, emissive: 0x243848, roughness: 0.25 });
  for (let i = 0; i < 12; i++) {
    const ch = new THREE.Mesh(chipGeo, chipMat);
    const ang = (i / 12) * Math.PI * 2;
    ch.userData = { vx: Math.cos(ang) * (1.2 + (i % 3) * 0.5), vy: 1.6 + (i % 4) * 0.45, vz: Math.sin(ang) * 0.9 };
    adzeStage.add(ch);
    chips.push(ch);
  }
  const adzeKeyLight = new THREE.PointLight(0xfff4e0, 8.0, 22, 1);
  adzeKeyLight.position.set(1.2, 3.0, 3.4);
  adzeStage.add(adzeKeyLight);
  macro.add(adzeStage);

  // 3. x = +50 (SH13, 28.65-30.00 s): Taut braided rope over coat shoulder + gripping hands
  const ropeGroup = new THREE.Group();
  ropeGroup.name = 'macro_rope_shoulder';
  ropeGroup.position.set(50, 0, -6);

  const shoulderCoat = new THREE.Mesh(
    new THREE.SphereGeometry(0.92, 14, 12),
    new THREE.MeshStandardMaterial({ color: 0x2b3c60, roughness: 0.82 })
  );
  shoulderCoat.scale.set(1.15, 0.85, 0.95);
  shoulderCoat.position.set(0, 1.05, 0);
  ropeGroup.add(shoulderCoat);

  const ropeMat = new THREE.MeshStandardMaterial({ color: 0xd4ae76, roughness: 0.88 });
  const ropeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.6, 0.25, -1.4),
    new THREE.Vector3(-0.35, 1.68, 0.25),
    new THREE.Vector3(0.45, 1.58, 0.38),
    new THREE.Vector3(2.8, 0.35, 1.6),
  ]);
  ropeGroup.add(new THREE.Mesh(new THREE.TubeGeometry(ropeCurve, 32, 0.11, 10, false), ropeMat));
  for (let i = 0; i < 18; i++) {
    const pt = ropeCurve.getPoint(i / 17);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.025, 6, 10), new THREE.MeshStandardMaterial({ color: 0x9c7848, roughness: 0.92 }));
    ring.position.copy(pt);
    ring.rotation.y = 0.6;
    ropeGroup.add(ring);
  }
  const gloveMat = new THREE.MeshStandardMaterial({ color: 0x5c422e, roughness: 0.84 });
  const handL = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 10), gloveMat);
  handL.scale.set(1.1, 0.85, 1.25);
  handL.position.set(-0.22, 1.65, 0.34);
  ropeGroup.add(handL);
  const handR = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 10), gloveMat);
  handR.scale.set(1.1, 0.85, 1.25);
  handR.position.set(0.52, 1.52, 0.44);
  ropeGroup.add(handR);
  const iceWall = new THREE.Mesh(new THREE.BoxGeometry(16, 10, 2.2), iceMat);
  iceWall.position.set(0, 3.2, -5.5);
  ropeGroup.add(iceWall);

  const ropeKeyLight = new THREE.PointLight(0xfff4e0, 8.0, 22, 1);
  ropeKeyLight.position.set(1.0, 2.6, 3.4);
  ropeGroup.add(ropeKeyLight);
  macro.add(ropeGroup);

  return { group: macro, ropeGroup, adzePivot, chips, bootPivot };
}

function makeTitleCard(THREE) {
  const tex = makeCanvasTex(THREE, 1024, 384, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(18, 28, 46, 0.78)';
    ctx.fillRect(48, 56, w - 96, h - 112);
    ctx.strokeStyle = '#f2c46d';
    ctx.lineWidth = 6;
    ctx.strokeRect(54, 62, w - 108, h - 124);

    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff6e4';
    ctx.font = 'bold 92px "Noto Sans Arabic", "Cairo", sans-serif';
    ctx.fillText('ظاهرة الرجل الثالث', w / 2, h / 2 - 14);
    ctx.fillStyle = '#f2c46d';
    ctx.font = '600 34px "Noto Sans Arabic", sans-serif';
    ctx.fillText('THE THIRD MAN FACTOR · 1916', w / 2, h / 2 + 78);
  });
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    color: tex ? 0xffffff : 0xfff6e4,
    transparent: true,
    depthWrite: false,
    fog: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(9.6, 3.6), mat);
  mesh.name = 'title_card_third_man';
  return mesh;
}

// Active place lookup by film time t (matches film.js shot timeline)
function activePlaceAt(t) {
  if (t < 13.0) return 'GLACIER_MARCH';
  if (t < 18.0) return 'LIFEBOAT_SEA';
  if (t < 23.0) return 'ELEPHANT_ISLAND';
  if (t < 30.0) return 'GLACIER_CROSSING';
  if (t < 39.0) return 'SNOW_SLEEP';
  if (t < 51.0) return 'SHELTER_CONFESSION';
  if (t < 53.0) return 'GLACIER_MARCH';
  if (t < 59.0) return 'LANDING_VIGNETTES';
  if (t < 60.8) return 'GLACIER_MARCH';
  return 'LANDING_VIGNETTES';
}

export async function buildSet(THREE, scene, opts = {}, _kit) {
  const root = new THREE.Group();
  root.name = 'fourth_man_set';
  if (scene && root.parent !== scene) scene.add(root);

  // ============================================================================
  // LIVE THREE.JS LIGHT RIG (Root-Cause Fix #1: lights actually in scene graph!)
  // ============================================================================
  const hemiLight = new THREE.HemisphereLight(0xdceeff, 0x485c74, 1.35);
  hemiLight.name = 'global_hemi_light';
  root.add(hemiLight);

  const ambLight = new THREE.AmbientLight(0x90a4bc, 0.55);
  ambLight.name = 'global_ambient_light';
  root.add(ambLight);

  const keyLight = new THREE.DirectionalLight(0xfff4e4, 1.65);
  keyLight.name = 'active_place_key_light';
  keyLight.position.set(-22, 36, 26);
  root.add(keyLight);
  root.add(keyLight.target);

  const snowTex = makeSnowTex(THREE);
  const iceRockTex = makeIceRockTex(THREE);
  const timberTex = makeTimberTex(THREE);

  const snowMat = new THREE.MeshStandardMaterial({ color: 0xe4eef8, map: snowTex, roughness: 0.88 });
  const blueSnowMat = new THREE.MeshStandardMaterial({ color: 0x9cb9d9, map: snowTex, roughness: 0.86 });
  const iceMat = new THREE.MeshStandardMaterial({ color: 0x7da7ca, map: iceRockTex, roughness: 0.52 });
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x4d6076, map: iceRockTex, roughness: 0.88 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x7a5032, map: timberTex, roughness: 0.84 });
  const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x452b1b, map: timberTex, roughness: 0.88 });
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xd8b24c, roughness: 0.35, metalness: 0.65 });

  // ============================================================================
  // PLACE 1 — GLACIER_MARCH ([0, 0, 0])
  // ============================================================================
  const pMarch = new THREE.Group();
  pMarch.name = 'place_GLACIER_MARCH';
  pMarch.position.set(...PLACES.GLACIER_MARCH);
  const domeMarch = makeSkyDome(THREE, 85, '#4c6078', '#7d92a8', '#b5c6d6', 'sky_dome_march');
  pMarch.add(domeMarch);

  const marchFloor = new THREE.Mesh(new THREE.BoxGeometry(120, 1.0, 150), snowMat);
  marchFloor.position.set(0, -0.5, -25);
  pMarch.add(marchFloor);

  const rndM = mulberry32(101);
  for (let i = 0; i < 24; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const z = 14 - i * 3.8;
    const h = 2.4 + rndM() * 6.5;
    const w = 3.2 + rndM() * 4.8;
    const bank = new THREE.Mesh(new THREE.ConeGeometry(w, h, 5), i % 3 === 0 ? iceMat : snowMat);
    bank.position.set(side * (6.5 + rndM() * 14), h * 0.45, z);
    bank.rotation.y = rndM() * Math.PI;
    pMarch.add(bank);
  }
  pMarch.add(makePeakRing(THREE, rockMat, snowMat, 102, 18, 36, 68, 22, 54));

  const cairn1 = makeLantern(THREE, 0xffcc70, 2.4, 4.5);
  cairn1.position.set(-4.2, 0, -10);
  pMarch.add(cairn1);
  const cairn2 = makeLantern(THREE, 0xffcc70, 2.6, 4.5);
  cairn2.position.set(4.8, 0, -28);
  pMarch.add(cairn2);
  const cairn3 = makeLantern(THREE, 0xffcc70, 2.8, 3.5);
  cairn3.position.set(-5.6, 0, -48);
  pMarch.add(cairn3);

  const marchPrints = makeFootprintTrail(THREE, 28, -14, 1.15, true);
  pMarch.add(marchPrints);
  const marchGhostShadow = makeOwnerlessShadow(THREE, 4.4, 0.78);
  marchGhostShadow.position.set(2.35, 0.02, 4.5);
  pMarch.add(marchGhostShadow);
  const marchMistSil = makeMistSilhouette(THREE);
  marchMistSil.position.set(-9.5, 0, -14.0);
  pMarch.add(marchMistSil);

  const marchRopeMat = new THREE.MeshStandardMaterial({ color: 0xc4a06a, roughness: 0.9 });
  const marchRope = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 12.0, 8), marchRopeMat);
  marchRope.rotation.x = Math.PI / 2;
  marchRope.position.set(0, 1.35, 0);
  pMarch.add(marchRope);

  const snowMarch = makeSnowField(THREE, 120, 28, 14, 34, 105);
  snowMarch.group.position.set(0, 0, -4);
  pMarch.add(snowMarch.group);
  root.add(pMarch);

  // ============================================================================
  // PLACE 2 — LIFEBOAT_SEA ([400, 0, 0])
  // ============================================================================
  const pSea = new THREE.Group();
  pSea.name = 'place_LIFEBOAT_SEA';
  pSea.position.set(...PLACES.LIFEBOAT_SEA);
  pSea.add(makeSkyDome(THREE, 85, '#192a38', '#2d4b5e', '#4f6e80', 'sky_dome_sea'));

  const seaMat = new THREE.MeshStandardMaterial({ color: 0x1e4a62, roughness: 0.34, metalness: 0.15 });
  const foamMat = new THREE.MeshStandardMaterial({ color: 0xdcebf4, roughness: 0.65 });
  const oceanBase = new THREE.Mesh(new THREE.BoxGeometry(160, 2.0, 160), seaMat);
  oceanBase.position.set(0, -1.2, 0);
  pSea.add(oceanBase);

  const waveRidges = [];
  for (let i = 0; i < 12; i++) {
    const ridge = new THREE.Group();
    const swell = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.2, 95, 8), seaMat);
    swell.rotation.z = Math.PI / 2;
    ridge.add(swell);
    const crest = new THREE.Mesh(new THREE.BoxGeometry(92, 0.35, 0.75), foamMat);
    crest.position.y = 1.55;
    ridge.add(crest);
    const baseZ = 24 - i * 8.5;
    ridge.position.set(0, -0.5, baseZ);
    pSea.add(ridge);
    waveRidges.push({ ridge, baseZ, phase: i * 0.7 });
  }

  const caird = makeJamesCaird(THREE, woodMat, darkWoodMat, brassMat);
  caird.group.position.set(0, -0.15, 0);
  pSea.add(caird.group);

  const seaSpray = makeSnowField(THREE, 90, 24, 10, 24, 205);
  pSea.add(seaSpray.group);
  root.add(pSea);

  // ============================================================================
  // PLACE 3 — ELEPHANT_ISLAND ([800, 0, 0])
  // ============================================================================
  const pIsland = new THREE.Group();
  pIsland.name = 'place_ELEPHANT_ISLAND';
  pIsland.position.set(...PLACES.ELEPHANT_ISLAND);
  pIsland.add(makeSkyDome(THREE, 85, '#374c63', '#5c758c', '#98aec2', 'sky_dome_island'));

  const beach = new THREE.Mesh(new THREE.BoxGeometry(120, 1.0, 120), snowMat);
  beach.position.set(0, -0.5, -20);
  pIsland.add(beach);
  const surfWater = new THREE.Mesh(new THREE.BoxGeometry(140, 0.5, 70), seaMat);
  surfWater.position.set(0, -0.35, 44);
  pIsland.add(surfWater);

  for (const [hx, hz, ry] of [[-7.2, -9.5, 0.28], [7.8, -11.0, -0.35]]) {
    const hull = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.3, 10.2, 10, 1, false, 0, Math.PI), darkWoodMat);
    hull.rotation.z = Math.PI / 2;
    hull.rotation.y = ry;
    hull.position.set(hx, 0.1, hz);
    pIsland.add(hull);
    const snowCap = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.35, 2.8), snowMat);
    snowCap.rotation.y = ry;
    snowCap.position.set(hx, 2.15, hz);
    pIsland.add(snowCap);
  }

  const fireGroup = new THREE.Group();
  fireGroup.position.set(0.2, 0, -4.5);
  const logMat = new THREE.MeshStandardMaterial({ color: 0x3a2314, roughness: 0.95 });
  for (let i = 0; i < 4; i++) {
    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 1.6, 6), logMat);
    log.rotation.z = Math.PI / 2;
    log.rotation.y = (i * Math.PI) / 4;
    log.position.y = 0.16;
    fireGroup.add(log);
  }
  const flameCore = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.45, 7), new THREE.MeshBasicMaterial({ color: 0xffa834 }));
  flameCore.position.y = 0.85;
  fireGroup.add(flameCore);
  const flameInner = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.95, 7), new THREE.MeshBasicMaterial({ color: 0xfff099 }));
  flameInner.position.y = 0.65;
  fireGroup.add(flameInner);
  const fireLight = new THREE.PointLight(0xffa030, 8.5, 26, 1);
  fireLight.position.set(0, 1.3, 0);
  fireGroup.add(fireLight);
  pIsland.add(fireGroup);

  const campLamp1 = makeLantern(THREE, 0xffbe5c, 2.6, 4.0);
  campLamp1.position.set(-4.6, 0, -6.2);
  pIsland.add(campLamp1);
  const campLamp2 = makeLantern(THREE, 0xffbe5c, 2.6, 4.0);
  campLamp2.position.set(5.2, 0, -7.8);
  pIsland.add(campLamp2);

  const parkaMat = new THREE.MeshStandardMaterial({ color: 0x364458, roughness: 0.88 });
  for (const [mx, mz] of [[-8.5, -13], [-4.8, -14.5], [5.8, -14], [9.5, -12.5]]) {
    const fig = new THREE.Group();
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.45, 1.6, 8), parkaMat);
    b.position.y = 0.9;
    fig.add(b);
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8), parkaMat);
    h.position.y = 1.95;
    fig.add(h);
    fig.position.set(mx, 0, mz);
    pIsland.add(fig);
  }

  pIsland.add(makePeakRing(THREE, rockMat, snowMat, 303, 14, 36, 66, 20, 48));
  root.add(pIsland);

  // ============================================================================
  // PLACE 4 — GLACIER_CROSSING ([1200, 0, 0])
  // ============================================================================
  const pCross = new THREE.Group();
  pCross.name = 'place_GLACIER_CROSSING';
  pCross.position.set(...PLACES.GLACIER_CROSSING);
  pCross.add(makeSkyDome(THREE, 85, '#5d84a8', '#90b2cf', '#d0e2f0', 'sky_dome_crossing'));

  const crossFloorL = new THREE.Mesh(new THREE.BoxGeometry(60, 2.0, 120), snowMat);
  crossFloorL.position.set(-32, -1.0, -20);
  pCross.add(crossFloorL);
  const crossFloorR = new THREE.Mesh(new THREE.BoxGeometry(90, 2.0, 120), snowMat);
  crossFloorR.position.set(46, -1.0, -20);
  pCross.add(crossFloorR);
  const iceBridge = new THREE.Mesh(new THREE.BoxGeometry(10, 1.6, 38), iceMat);
  iceBridge.position.set(0, -0.8, 0);
  pCross.add(iceBridge);

  for (let i = 0; i < 16; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const serac = new THREE.Mesh(new THREE.BoxGeometry(4.5, 6 + (i % 4) * 3.5, 5.2), iceMat);
    serac.position.set(side * (7.5 + (i % 3) * 3.5), 3 + (i % 4) * 1.5, 8 - i * 4.5);
    serac.rotation.y = (i * 0.4) % 1.2;
    pCross.add(serac);
  }
  pCross.add(makePeakRing(THREE, iceMat, snowMat, 404, 16, 38, 68, 24, 56));

  const xLamp1 = makeLantern(THREE, 0xffd278, 2.2, 4.5);
  xLamp1.position.set(-3.8, 0, -8);
  pCross.add(xLamp1);
  const xLamp2 = makeLantern(THREE, 0xffd278, 2.4, 4.5);
  xLamp2.position.set(4.2, 0, -24);
  pCross.add(xLamp2);

  const macroRigs = makeMacroZone(THREE, iceMat, snowMat);
  pCross.add(macroRigs.group);

  const snowCross = makeSnowField(THREE, 140, 70, 14, 34, 408);
  snowCross.group.position.set(18, 0, -4);
  pCross.add(snowCross.group);
  root.add(pCross);

  // ============================================================================
  // PLACE 5 — SNOW_SLEEP ([1600, 0, 0])
  // ============================================================================
  const pSleep = new THREE.Group();
  pSleep.name = 'place_SNOW_SLEEP';
  pSleep.position.set(...PLACES.SNOW_SLEEP);
  pSleep.add(makeSkyDome(THREE, 85, '#0e1b33', '#1d365c', '#3b5d8a', 'sky_dome_sleep'));

  const sleepFloor = new THREE.Mesh(new THREE.BoxGeometry(120, 1.0, 120), blueSnowMat);
  sleepFloor.position.set(0, -0.5, -20);
  pSleep.add(sleepFloor);

  const corniceL = new THREE.Mesh(new THREE.BoxGeometry(9, 7.5, 16), iceMat);
  corniceL.position.set(-8.5, 3.2, -6);
  corniceL.rotation.z = -0.18;
  pSleep.add(corniceL);
  const corniceR = new THREE.Mesh(new THREE.BoxGeometry(9, 6.2, 14), iceMat);
  corniceR.position.set(9.0, 2.6, -9);
  corniceR.rotation.z = 0.16;
  pSleep.add(corniceR);

  const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(0.95, 0), blueSnowMat);
  boulder.position.set(2.1, 0.45, 0.4);
  pSleep.add(boulder);
  const sleepLamp1 = makeLantern(THREE, 0xffaa44, 0.0, 6.5);
  sleepLamp1.position.set(2.1, 1.25, 0.4);
  pSleep.add(sleepLamp1);
  const sleepLamp2 = makeLantern(THREE, 0x8ec8ff, 2.8, 3.5);
  sleepLamp2.position.set(-4.5, 0, -24);
  pSleep.add(sleepLamp2);

  const moon = new THREE.Mesh(new THREE.CircleGeometry(3.4, 20), new THREE.MeshBasicMaterial({ color: 0xdceeff, fog: false }));
  moon.position.set(-12, 20, -64);
  pSleep.add(moon);

  pSleep.add(makePeakRing(THREE, rockMat, blueSnowMat, 505, 14, 36, 66, 20, 50));
  const snowSleep = makeSnowField(THREE, 80, 24, 12, 24, 509);
  pSleep.add(snowSleep.group);
  root.add(pSleep);

  // ============================================================================
  // PLACE 6 — SHELTER_CONFESSION ([2000, 0, 0])
  // ============================================================================
  const pShelter = new THREE.Group();
  pShelter.name = 'place_SHELTER_CONFESSION';
  pShelter.position.set(...PLACES.SHELTER_CONFESSION);
  pShelter.add(makeSkyDome(THREE, 85, '#16253b', '#274060', '#3d5a7c', 'sky_dome_shelter'));

  const hallFloor = new THREE.Mesh(new THREE.BoxGeometry(16, 0.6, 44), darkWoodMat);
  hallFloor.position.set(0, -0.3, -12);
  pShelter.add(hallFloor);

  const hallWallL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 9.5, 44), woodMat);
  hallWallL.position.set(-8.0, 4.75, -12);
  pShelter.add(hallWallL);
  const hallWallR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 9.5, 44), woodMat);
  hallWallR.position.set(8.0, 4.75, -12);
  pShelter.add(hallWallR);
  const hallRoof = new THREE.Mesh(new THREE.BoxGeometry(16.8, 0.8, 44), darkWoodMat);
  hallRoof.position.set(0, 9.6, -12);
  pShelter.add(hallRoof);

  const backWallL = new THREE.Mesh(new THREE.BoxGeometry(5.2, 9.5, 0.8), woodMat);
  backWallL.position.set(-5.4, 4.75, -34);
  pShelter.add(backWallL);
  const backWallR = new THREE.Mesh(new THREE.BoxGeometry(5.2, 9.5, 0.8), woodMat);
  backWallR.position.set(5.4, 4.75, -34);
  pShelter.add(backWallR);
  const backWallBot = new THREE.Mesh(new THREE.BoxGeometry(5.6, 2.2, 0.8), woodMat);
  backWallBot.position.set(0, 1.1, -34);
  pShelter.add(backWallBot);
  const backWallTop = new THREE.Mesh(new THREE.BoxGeometry(5.6, 2.6, 0.8), woodMat);
  backWallTop.position.set(0, 8.2, -34);
  pShelter.add(backWallTop);
  const stormPane = new THREE.Mesh(
    new THREE.PlaneGeometry(5.6, 4.7),
    new THREE.MeshBasicMaterial({ color: 0x4b749e, transparent: true, opacity: 0.48 })
  );
  stormPane.position.set(0, 4.55, -33.5);
  pShelter.add(stormPane);

  const windowGhost = makeMistSilhouette(THREE);
  windowGhost.position.set(-1.6, 2.2, -37.5);
  pShelter.add(windowGhost);

  for (let z = 4; z >= -30; z -= 6.5) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(15.6, 0.45, 0.45), darkWoodMat);
    beam.position.set(0, 8.8, z);
    pShelter.add(beam);
    for (const sx of [-7.3, 7.3]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.45, 9.0, 0.45), darkWoodMat);
      post.position.set(sx, 4.5, z);
      pShelter.add(post);
    }
  }

  const ironMat = new THREE.MeshStandardMaterial({ color: 0x242428, roughness: 0.65, metalness: 0.6 });
  const stove = new THREE.Group();
  stove.position.set(0, 0, -2.8);
  const stoveBody = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.82, 1.9, 12), ironMat);
  stoveBody.position.y = 0.95;
  stove.add(stoveBody);
  const stoveGlow = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.48, 0.14), new THREE.MeshBasicMaterial({ color: 0xff8c28 }));
  stoveGlow.position.set(0, 0.85, 0.72);
  stove.add(stoveGlow);
  const stoveLight = new THREE.PointLight(0xff9838, 9.5, 24, 1);
  stoveLight.position.set(0, 1.2, 1.2);
  stove.add(stoveLight);
  const flue = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 7.5, 10), ironMat);
  flue.position.y = 5.6;
  stove.add(flue);
  pShelter.add(stove);

  for (const lz of [-3.5, -14.5, -25.5]) {
    const hl = makeLantern(THREE, 0xffbd58, 0.0, 6.0);
    hl.position.set(0, 6.2, lz);
    pShelter.add(hl);
  }
  const table = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.18, 2.0), woodMat);
  table.position.set(0, 1.15, -0.4);
  pShelter.add(table);
  for (const [tx, tz] of [[-1.8, -1.2], [1.8, -1.2], [-1.8, 0.4], [1.8, 0.4]]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.15, 0.16), darkWoodMat);
    leg.position.set(tx, 0.57, tz);
    pShelter.add(leg);
  }
  root.add(pShelter);

  // ============================================================================
  // PLACE 7 — LANDING_VIGNETTES ([2400, 0, 0]) — each bay has its own r=85 dome!
  // ============================================================================
  const pLand = new THREE.Group();
  pLand.name = 'place_LANDING_VIGNETTES';
  pLand.position.set(...PLACES.LANDING_VIGNETTES);

  const bayA = new THREE.Group();
  bayA.add(makeSkyDome(THREE, 85, '#223654', '#4a5c78', '#8ba0b8', 'sky_dome_vigA'));
  const ridgeFloor = new THREE.Mesh(new THREE.BoxGeometry(24, 1.0, 90), snowMat);
  ridgeFloor.position.set(0, -0.5, -20);
  bayA.add(ridgeFloor);
  bayA.add(makeFootprintTrail(THREE, 14, -8, 1.1, true));
  const climbShadow = makeOwnerlessShadow(THREE, 3.8, 0.72);
  climbShadow.position.set(1.85, 0.02, 1.2);
  bayA.add(climbShadow);
  const climbLamp1 = makeLantern(THREE, 0xffd078, 2.2, 4.5);
  climbLamp1.position.set(-3.2, 0, -9);
  bayA.add(climbLamp1);
  const climbLamp2 = makeLantern(THREE, 0xffd078, 2.4, 4.5);
  climbLamp2.position.set(3.5, 0, -25);
  bayA.add(climbLamp2);
  pLand.add(bayA);

  const bayB = new THREE.Group();
  bayB.position.set(45, 0, 0);
  bayB.add(makeSkyDome(THREE, 85, '#132036', '#253c5c', '#4c6482', 'sky_dome_vigB'));
  const shipDeck = new THREE.Mesh(new THREE.BoxGeometry(16, 1.0, 32), darkWoodMat);
  shipDeck.position.set(0, -0.5, -8);
  bayB.add(shipDeck);
  const shipSea = new THREE.Mesh(new THREE.BoxGeometry(90, 0.6, 110), seaMat);
  shipSea.position.set(0, -1.6, -40);
  bayB.add(shipSea);
  const helmPost = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.55, 0.65), woodMat);
  helmPost.position.set(0, 0.78, 0.85);
  bayB.add(helmPost);
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.08, 8, 16), woodMat);
  wheel.position.set(0, 1.48, 0.45);
  bayB.add(wheel);
  const binnacleLamp = makeLantern(THREE, 0xffb848, 0.0, 5.5);
  binnacleLamp.position.set(0, 1.65, 0.95);
  bayB.add(binnacleLamp);
  const deckLamp = makeLantern(THREE, 0xffc864, 2.8, 4.5);
  deckLamp.position.set(-4.2, 0, -10);
  bayB.add(deckLamp);
  const railGhost = makeMistSilhouette(THREE);
  railGhost.position.set(-5.8, 0, -12.0);
  bayB.add(railGhost);
  pLand.add(bayB);

  const bayC = new THREE.Group();
  bayC.position.set(90, 0, 0);
  bayC.add(makeSkyDome(THREE, 85, '#1e2c44', '#40485e', '#76605c', 'sky_dome_vigC'));
  const wreckFloor = new THREE.Mesh(new THREE.BoxGeometry(28, 1.0, 90), rockMat);
  wreckFloor.position.set(0, -0.5, -20);
  bayC.add(wreckFloor);
  for (const [wx, wy, wz, rz] of [[-4.2, 1.2, -5, 0.35], [4.5, 1.4, -7, -0.42], [-2.5, 0.9, -15, 0.22], [3.8, 1.6, -22, -0.28]]) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.65, 4.2, 0.85), darkWoodMat);
    beam.position.set(wx, wy, wz);
    beam.rotation.z = rz;
    bayC.add(beam);
  }
  const flareLamp = makeLantern(THREE, 0xff6b38, 0.0, 6.5);
  flareLamp.position.set(-2.2, 0.15, -2.0);
  bayC.add(flareLamp);
  const beaconLamp = makeLantern(THREE, 0xffd278, 3.2, 5.0);
  beaconLamp.position.set(3.8, 0, -24);
  bayC.add(beaconLamp);
  const wreckShadow = makeOwnerlessShadow(THREE, 4.0, 0.74);
  wreckShadow.position.set(1.9, 0.02, 0.8);
  bayC.add(wreckShadow);
  pLand.add(bayC);

  // Bay D (x = +135, Frame 1860 @ t = 62.0 s): Golden Dawn Ridge + 4 footprints + Arabic Title Card
  const bayD = new THREE.Group();
  bayD.position.set(135, 0, 0);
  bayD.add(makeSkyDome(THREE, 85, '#2b446e', '#9a7a78', '#f5b86e', 'sky_dome_dawn'));
  const dawnFloor = new THREE.Mesh(new THREE.BoxGeometry(44, 1.0, 110), snowMat);
  dawnFloor.position.set(0, -0.5, -30);
  bayD.add(dawnFloor);
  bayD.add(makeFootprintTrail(THREE, 24, -18, 1.15, true));
  const dawnSun = new THREE.Mesh(new THREE.CircleGeometry(8.5, 24), new THREE.MeshBasicMaterial({ color: 0xffd688, fog: false }));
  dawnSun.position.set(0, 12, -62);
  bayD.add(dawnSun);
  const titleCard = makeTitleCard(THREE);
  titleCard.position.set(0, 5.2, -12.5);
  bayD.add(titleCard);
  const dawnLamp1 = makeLantern(THREE, 0xffd078, 2.2, 5.5);
  dawnLamp1.position.set(-4.8, 0, -14);
  bayD.add(dawnLamp1);
  const dawnLamp2 = makeLantern(THREE, 0xffd078, 2.2, 5.5);
  dawnLamp2.position.set(4.8, 0, -14);
  bayD.add(dawnLamp2);
  bayD.add(makePeakRing(THREE, rockMat, snowMat, 707, 14, 34, 62, 18, 44));
  pLand.add(bayD);

  root.add(pLand);

  function update(t) {
    // 1. Keep directional keyLight & scene.background locked to the active place
    const placeName = activePlaceAt(t);
    const anchor = PLACES[placeName];
    const pl = lights[placeName];
    keyLight.position.set(anchor[0] - 20, 34, anchor[2] + 24);
    keyLight.target.position.set(anchor[0], 1.5, anchor[2]);
    keyLight.target.updateMatrixWorld?.();
    if (scene && pl?.bgHex) {
      if (scene.background && typeof scene.background.set === 'function') {
        scene.background.set(pl.bgHex);
      } else {
        scene.background = new THREE.Color(pl.bgHex);
      }
    }

    // 2. Blowing snow & spray
    updateSnowField(snowMarch, t);
    updateSnowField(seaSpray, t * 1.35);
    updateSnowField(snowCross, t * 1.45);
    updateSnowField(snowSleep, t * 0.65);

    // 3. March rope & fourth-man shadow travel forward with the 3 men during Beat 1
    const marchZ = clamp(t, 0, 13) * 0.55;
    marchRope.position.z = marchZ - 1.4;
    marchGhostShadow.position.z = marchZ + 0.6;
    marchMistSil.position.x = -9.5 + Math.sin(t * 0.45) * 0.45;
    marchMistSil.position.z = marchZ - 13.5;

    // 4. Lifeboat pitching, rolling, and rowing oars
    caird.group.rotation.x = Math.sin(t * 2.4) * 0.14;
    caird.group.rotation.z = Math.cos(t * 1.9) * 0.11;
    caird.group.position.y = -0.15 + Math.sin(t * 2.4 + 0.6) * 0.35;
    for (const o of caird.oars) {
      o.pivot.rotation.y = o.side * Math.sin(t * 3.8) * 0.42;
      o.pivot.rotation.z = o.side * (Math.cos(t * 3.8) * 0.18 - 0.12);
    }
    for (const w of waveRidges) {
      w.ridge.position.y = -0.6 + Math.sin(t * 2.4 + w.phase) * 0.65;
      w.ridge.position.z = w.baseZ + ((t * 3.2) % 8.5);
    }

    // 5. Campfire flicker
    const fPulse = 0.92 + Math.sin(t * 14.0) * 0.12 + Math.cos(t * 9.3) * 0.08;
    flameCore.scale.set(1.0, fPulse, 1.0);
    flameInner.scale.set(1.0, 0.85 + Math.sin(t * 17.5) * 0.16, 1.0);

    // 6. §7 Macro Close-Ups (Beat 3: 26.0-30.0 s)
    // SH11 (26.0-27.35 s, Frame 801 @ t=26.7 s): Boot sole with gleaming screws tilted to show underside, biting ice
    const bootU = smoothstep(26.15, 27.15, t);
    macroRigs.bootPivot.position.y = 2.38 - bootU * 0.56;
    macroRigs.bootPivot.rotation.z = 0.62 * (1 - bootU) + 0.24 * bootU;
    macroRigs.bootPivot.rotation.x = -0.52 * (1 - bootU) - 0.28 * bootU;

    // SH12 (27.35-28.65 s, Frame 840 @ t=28.0 s): Adze swings down & bites into glacier ice + flying chips
    const adzeU = smoothstep(27.35, 27.85, t);
    const adzeStrike = Math.sin(adzeU * Math.PI * 0.5);
    macroRigs.adzePivot.rotation.z = -0.68 * (1 - adzeStrike) + 0.06 * adzeStrike;
    const chipDt = Math.max(0, t - 27.82);
    for (let i = 0; i < macroRigs.chips.length; i++) {
      const ch = macroRigs.chips[i];
      ch.visible = t >= 27.80 && t <= 28.70;
      ch.position.set(
        ch.userData.vx * chipDt,
        1.78 + ch.userData.vy * chipDt - 4.8 * chipDt * chipDt,
        0.45 + ch.userData.vz * chipDt
      );
      ch.rotation.set(t * 6 + i, t * 5, 0);
    }

    // SH13 (28.65-30.00 s): Taut braided rope vibration under strain
    macroRigs.ropeGroup.rotation.z = Math.sin(t * 18.0) * 0.015;

    // 7. Shelter stove glow & window mist drift
    stoveGlow.scale.set(1, 0.94 + Math.sin(t * 11.0) * 0.08, 1);
    windowGhost.position.x = -1.6 + Math.sin(t * 0.6) * 0.35;

    // 8. Beat 6 vignettes & title card
    wheel.rotation.z = Math.sin(t * 1.4) * 0.28;
    titleCard.visible = t >= 60.75;
    titleCard.position.y = 4.9 + smoothstep(60.8, 61.6, t) * 0.35;
  }

  update(0);

  return {
    group: root,
    lightDir: opts.lightDir || [-0.45, 0.72, 0.52],
    marks: {
      march_lead: [0, 1.2],
      sleep_hollow: [1600, 0.4],
      shelter_stove: [2000, -2.8],
    },
    points: {
      james_caird: caird.group,
    },
    PLACES,
    lights,
    update,
  };
}

export default { PLACES, lights, build: buildSet, buildSet };