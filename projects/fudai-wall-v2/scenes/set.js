// Fudai Wall — Custom multi-place 3D set (Build pass — Repair Round 3)
// Pure in t: deterministic seeded PRNG, zero Math.random(), zero Date, zero mutable cross-frame state.
// Bounding-box staged per shot: non-overlapping 3-tier S5 cost tableau with glowing 15.5M arrowhead & cranes,
// short 10M neighbour walls + higher 15.5M comparison datum + clear foreground quay,
// harbour canal + seawall + falling coins behind S8 mockers, portrait-proportioned S11 blueprint with graduated ruler & hand.

function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function smoothstep(a, b, x) {
  const u = clamp01((x - a) / (b - a));
  return u * u * (3 - 2 * u);
}

function makeLabelTexture(THREE, title, subtitle, bg, fg, accent) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 256);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, 492, 236);
  ctx.fillStyle = fg;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 92px sans-serif';
  ctx.fillText(title, 256, subtitle ? 105 : 128);
  if (subtitle) {
    ctx.font = 'bold 42px sans-serif';
    ctx.fillStyle = accent;
    ctx.fillText(subtitle, 256, 190);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeBlueprintTexture(THREE) {
  if (typeof document === 'undefined') return null;
  // Portrait-proportioned blueprint (512x640) with generous horizontal margins so "15.5M LOCKED" is never cropped
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 640;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#154375';
  ctx.fillRect(0, 0, 512, 640);
  ctx.strokeStyle = 'rgba(180,220,255,0.22)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 512; i += 32) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 640); ctx.stroke();
  }
  for (let j = 0; j <= 640; j += 32) {
    ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(512, j); ctx.stroke();
  }
  ctx.strokeStyle = '#e2f1ff';
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, 472, 600);

  // Header banner well inside horizontal margins
  ctx.fillStyle = '#0d2b4d';
  ctx.fillRect(42, 42, 428, 92);
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 4;
  ctx.strokeRect(42, 42, 428, 92);
  ctx.fillStyle = '#ffd166';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText('15.5M LOCKED', 256, 88);

  // Floodgate elevation schematic
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.strokeRect(96, 190, 320, 320);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(96, 190); ctx.lineTo(416, 510);
  ctx.moveTo(416, 190); ctx.lineTo(96, 510);
  ctx.stroke();

  // 15.5M bold gold datum line
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(42, 190); ctx.lineTo(470, 190); ctx.stroke();

  // 10M dashed comparison line
  ctx.strokeStyle = '#ff9f68';
  ctx.setLineDash([12, 10]);
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(42, 340); ctx.lineTo(470, 340); ctx.stroke();
  ctx.setLineDash([]);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#ff9f68';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('10M', 48, 324);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('FUDAI FLOODGATE PLAN', 256, 574);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeRulerTexture(THREE) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 96;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#f2c14e';
  ctx.fillRect(0, 0, 512, 96);
  ctx.strokeStyle = '#6b4c10';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, 508, 92);
  ctx.fillStyle = '#1f1809';
  for (let i = 0; i <= 32; i++) {
    const x = 16 + i * 15;
    const h = i % 4 === 0 ? 44 : i % 2 === 0 ? 28 : 16;
    ctx.fillRect(x, 0, 3, h);
  }
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('10      12      14      15.5M', 256, 76);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeBillTexture(THREE) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#5ca36c';
  ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = '#2d5c38';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 240, 112);
  ctx.fillStyle = '#f2d379';
  ctx.fillRect(102, 0, 52, 128);
  ctx.fillStyle = '#1f3d26';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 54px sans-serif';
  ctx.fillText('$', 128, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeCalendarTexture(THREE, label, sub) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 320;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#f8f5ec';
  ctx.fillRect(0, 0, 256, 320);
  ctx.fillStyle = '#c83e3b';
  ctx.fillRect(0, 0, 256, 78);
  ctx.fillStyle = '#2b2b2b';
  ctx.beginPath(); ctx.arc(64, 34, 12, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(192, 34, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(sub, 128, 60);
  ctx.fillStyle = '#1d2430';
  ctx.font = 'bold 110px sans-serif';
  ctx.fillText(label, 128, 205);
  ctx.fillStyle = '#6c7a89';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('YEARS', 128, 278);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeSkyDome(THREE, xOffset, colorHex, radius = 180) {
  const mat = new THREE.MeshBasicMaterial({
    color: colorHex,
    side: THREE.BackSide,
    depthWrite: true,
    fog: false,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 16), mat);
  mesh.position.set(xOffset, 0, 0);
  mesh.name = `dome_${xOffset}`;
  return { mesh, mat };
}

function makeCottage(THREE, w, h, d, wallColor, roofColor, litWindow = true) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.85 })
  );
  body.position.y = h * 0.5;
  g.add(body);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(Math.max(w, d) * 0.78, h * 0.55, 4),
    new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.82 })
  );
  roof.position.y = h + h * 0.27;
  roof.rotation.y = Math.PI * 0.25;
  g.add(roof);

  const winMat = new THREE.MeshStandardMaterial({
    color: litWindow ? 0xffe4a0 : 0x3b4d63,
    emissive: litWindow ? 0xffb84d : 0x000000,
    emissiveIntensity: litWindow ? 0.9 : 0,
    roughness: 0.4,
  });
  for (const sx of [-w * 0.22, w * 0.22]) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(w * 0.22, h * 0.28, 0.12), winMat);
    win.position.set(sx, h * 0.55, d * 0.5 + 0.04);
    g.add(win);
  }
  return g;
}

function makeLampPost(THREE, height = 4.6, bulbColor = 0xffd27d) {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.12, height, 8),
    new THREE.MeshStandardMaterial({ color: 0x313842, roughness: 0.65, metalness: 0.4 })
  );
  pole.position.y = height * 0.5;
  g.add(pole);

  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.08, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x313842, roughness: 0.65 })
  );
  arm.position.set(0.38, height - 0.12, 0);
  g.add(arm);

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 12, 10),
    new THREE.MeshStandardMaterial({
      color: bulbColor,
      emissive: bulbColor,
      emissiveIntensity: 1.8,
      roughness: 0.2,
    })
  );
  bulb.position.set(0.75, height - 0.24, 0);
  g.add(bulb);
  return g;
}

function makeStoneLantern(THREE) {
  const g = new THREE.Group();
  const stone = new THREE.MeshStandardMaterial({ color: 0x7c838a, roughness: 0.92 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 0.35, 6), stone);
  base.position.y = 0.18;
  g.add(base);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 1.25, 6), stone);
  shaft.position.y = 0.95;
  g.add(shaft);
  const glow = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.42, 0.38),
    new THREE.MeshStandardMaterial({
      color: 0xffe099,
      emissive: 0xffb347,
      emissiveIntensity: 1.9,
      roughness: 0.3,
    })
  );
  glow.position.y = 1.78;
  g.add(glow);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.54, 0.38, 6), stone);
  cap.position.y = 2.18;
  g.add(cap);
  return g;
}

function makeFishingBoat(THREE, hullColor = 0xd9e4ec) {
  const g = new THREE.Group();
  const hull = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 0.78, 4.8),
    new THREE.MeshStandardMaterial({ color: hullColor, roughness: 0.72 })
  );
  hull.position.y = 0.39;
  g.add(hull);
  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(2.06, 0.18, 4.84),
    new THREE.MeshStandardMaterial({ color: 0xc94a38, roughness: 0.7 })
  );
  stripe.position.y = 0.60;
  g.add(stripe);
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 1.15, 1.6),
    new THREE.MeshStandardMaterial({ color: 0xf4f7fa, roughness: 0.65 })
  );
  cabin.position.set(0, 1.25, -0.35);
  g.add(cabin);
  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.06, 2.5, 6),
    new THREE.MeshStandardMaterial({ color: 0x5c4632, roughness: 0.85 })
  );
  mast.position.set(0, 2.3, -0.35);
  g.add(mast);
  return g;
}

function makeWaveMesh(THREE, width, height, colorHex = 0x163c5c) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, 10),
    new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.35, metalness: 0.1 })
  );
  body.position.y = height * 0.5;
  g.add(body);
  const crest = new THREE.Mesh(
    new THREE.CylinderGeometry(1.9, 2.2, width, 14),
    new THREE.MeshStandardMaterial({ color: 0xe6f4ff, roughness: 0.45 })
  );
  crest.rotation.z = Math.PI * 0.5;
  crest.position.set(0, height - 0.6, 4.2);
  g.add(crest);
  return g;
}

function makeMeasureGauge(THREE, height, title, sub, accentHex, accentCss, plaqueW = 4.0) {
  const g = new THREE.Group();
  const rodMat = new THREE.MeshBasicMaterial({ color: accentHex });
  const rod = new THREE.Mesh(new THREE.BoxGeometry(0.28, height, 0.28), rodMat);
  rod.position.y = height * 0.5;
  g.add(rod);
  // Glowing triangular arrowhead at top of measure shaft
  const head = new THREE.Mesh(
    new THREE.ConeGeometry(0.85, 1.5, 4),
    new THREE.MeshBasicMaterial({ color: accentHex })
  );
  head.position.y = height + 0.65;
  g.add(head);
  const bottomTick = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.24, 0.28), rodMat);
  bottomTick.position.y = 0.15;
  g.add(bottomTick);
  const tex = makeLabelTexture(THREE, title, sub, '#121c29', '#ffffff', accentCss);
  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(plaqueW, plaqueW * 0.5),
    new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })
  );
  plaque.position.set(0, height + 2.35, 0.25);
  g.add(plaque);
  return g;
}

function makeFlowerBouquet(THREE) {
  const g = new THREE.Group();
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x3b7a3c, roughness: 0.85 });
  const wrapMat = new THREE.MeshStandardMaterial({ color: 0xf0e4c8, roughness: 0.8 });
  const wrap = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.55, 8), wrapMat);
  wrap.rotation.x = Math.PI;
  wrap.position.y = 0.28;
  g.add(wrap);
  const colors = [0xff6b8b, 0xffd166, 0xffffff, 0xff9f68, 0xc77dff];
  for (let i = 0; i < 7; i++) {
    const ang = (i / 7) * Math.PI * 2;
    const r = i === 0 ? 0 : 0.16;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.45, 6), stemMat);
    stem.position.set(Math.cos(ang) * r * 0.6, 0.42, Math.sin(ang) * r * 0.6);
    g.add(stem);
    const bloom = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 8, 8),
      new THREE.MeshStandardMaterial({ color: colors[i % colors.length], roughness: 0.5 })
    );
    bloom.position.set(Math.cos(ang) * r, 0.66 + (i % 2) * 0.06, Math.sin(ang) * r);
    g.add(bloom);
  }
  return g;
}

export async function buildSet(THREE, scene, opts = {}, kit) {
  const rand = mulberry32(20110311);
  const WALL_H = opts.wallHeightD ?? 24.8;
  const WAVE_H = opts.waveHeightD ?? 24.0;
  // Neighbours' 10 m wall visibly shorter than Fudai's 24.8 D wall
  const NEIGH_H = opts.neighborWallD ?? 10.5;

  const points = {};
  const lights = [];

  const hemi = new THREE.HemisphereLight(0xaad0f5, 0x4b5878, 0.88);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffcf87, 1.85);
  sun.position.set(35, 42, 28);
  scene.add(sun);
  lights.push({ kind: 'hemi', light: hemi }, { kind: 'sun', light: sun });

  // =========================================================================
  // PLACE 1: COAST (X = 0)
  // =========================================================================
  const coast = new THREE.Group();
  coast.name = 'place_coast';
  scene.add(coast);
  const coastDome = makeSkyDome(THREE, 0, 0x8cc2eb);
  coast.add(coastDome.mesh);

  const land = new THREE.Mesh(
    new THREE.BoxGeometry(120, 1.0, 76),
    new THREE.MeshStandardMaterial({ color: 0x7c8675, roughness: 0.92 })
  );
  land.position.set(0, -0.5, 14);
  coast.add(land);

  const lane = new THREE.Mesh(
    new THREE.BoxGeometry(9.6, 0.08, 48),
    new THREE.MeshStandardMaterial({ color: 0x93989e, roughness: 0.88 })
  );
  lane.position.set(0, 0.04, 0);
  coast.add(lane);

  // Harbour water canal along village side of seawall (visible behind S8 mockers with falling coins!)
  const harbourCanal = new THREE.Mesh(
    new THREE.BoxGeometry(26, 0.14, 10.5),
    new THREE.MeshStandardMaterial({ color: 0x2f85ba, roughness: 0.12, metalness: 0.38 })
  );
  harbourCanal.position.set(0, 0.03, -15.5);
  coast.add(harbourCanal);

  const sand = new THREE.Mesh(
    new THREE.BoxGeometry(160, 0.6, 130),
    new THREE.MeshStandardMaterial({ color: 0x9b8c72, roughness: 0.9 })
  );
  sand.position.set(0, -0.8, -88);
  coast.add(sand);

  const oceanMat = new THREE.MeshStandardMaterial({
    color: 0x3b8ec4,
    roughness: 0.06,
    metalness: 0.42,
  });
  const ocean = new THREE.Mesh(new THREE.BoxGeometry(180, 0.4, 140), oceanMat);
  ocean.position.set(0, -0.25, -95);
  coast.add(ocean);

  // S3 fishing boat centered cleanly on the calm mirror sea in front of the 24.8 D seawall
  const boat1 = makeFishingBoat(THREE, 0xe8eff5);
  boat1.position.set(-1.5, -0.08, -44.0);
  boat1.rotation.y = 0.45;
  coast.add(boat1);

  const boat2 = makeFishingBoat(THREE, 0xdbe5cc);
  boat2.position.set(8.5, -0.08, -50.0);
  boat2.rotation.y = -0.35;
  coast.add(boat2);

  // Glassy mirror shimmer reflections across calm sea
  const mirrorGroup = new THREE.Group();
  const reflectMat = new THREE.MeshBasicMaterial({
    color: 0xd6efff,
    transparent: true,
    opacity: 0.36,
    depthWrite: false,
  });
  for (let i = 0; i < 8; i++) {
    const shimmer = new THREE.Mesh(new THREE.PlaneGeometry(18 - i * 1.2, 1.1), reflectMat);
    shimmer.rotation.x = -Math.PI * 0.5;
    shimmer.position.set(-0.5 + (i % 3) * 1.5, -0.01, -32 - i * 4.5);
    mirrorGroup.add(shimmer);
  }
  coast.add(mirrorGroup);

  // Monumental 15.5 m (24.8 D) Concrete Seawall + Steel Floodgate at z = -24
  const wallGroup = new THREE.Group();
  wallGroup.position.set(0, 0, -24);
  coast.add(wallGroup);

  const concMat = new THREE.MeshStandardMaterial({ color: 0x8d9399, roughness: 0.88 });
  const concDark = new THREE.MeshStandardMaterial({ color: 0x6f757c, roughness: 0.9 });
  const steelMat = new THREE.MeshStandardMaterial({ color: 0x45586b, roughness: 0.45, metalness: 0.55 });

  for (const sx of [-19, 19]) {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(24, WALL_H, 4.4), concMat);
    wing.position.set(sx, WALL_H * 0.5, 0);
    wallGroup.add(wing);
    for (let bx = -9; bx <= 9; bx += 4.5) {
      const butt = new THREE.Mesh(new THREE.BoxGeometry(1.1, WALL_H * 0.96, 1.4), concDark);
      butt.position.set(sx + bx, WALL_H * 0.48, 2.5);
      wallGroup.add(butt);
    }
  }

  for (const px of [-6.8, 6.8]) {
    const pier = new THREE.Mesh(new THREE.BoxGeometry(2.6, WALL_H + 3.2, 5.4), concDark);
    pier.position.set(px, (WALL_H + 3.2) * 0.5, 0);
    wallGroup.add(pier);
  }
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(16.2, 2.2, 5.0), concDark);
  bridge.position.set(0, WALL_H + 1.4, 0);
  wallGroup.add(bridge);

  const walkway = new THREE.Mesh(new THREE.BoxGeometry(62, 0.5, 5.2), concDark);
  walkway.position.set(0, WALL_H, 0);
  wallGroup.add(walkway);

  const steelGate = new THREE.Mesh(new THREE.BoxGeometry(11.4, WALL_H, 1.4), steelMat);
  steelGate.position.set(0, WALL_H * 0.5, 0);
  for (let ry = 3; ry < WALL_H - 1; ry += 3.5) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.42, 1.85), concDark);
    rib.position.set(0, ry - WALL_H * 0.5, 0);
    steelGate.add(rib);
  }
  wallGroup.add(steelGate);

  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0xff6b4a,
    emissive: 0xff4522,
    emissiveIntensity: 2.0,
  });
  for (const bx of [-6.8, 6.8]) {
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.48, 12, 10), beaconMat);
    beacon.position.set(bx, WALL_H + 3.6, 0);
    wallGroup.add(beacon);
    const bLight = new THREE.PointLight(0xff6b4a, 2.0, 18);
    bLight.position.set(bx, WALL_H + 3.8, -23.5);
    coast.add(bLight);
    lights.push({ kind: 'practical', place: 'coast', light: bLight });
  }

  // --- SET-MOUNTED STORY GRAPHICS (pure-in-t visibility) ---

  // (A) S1-S2: Complete 5-storey numbered (1-2-3-4-5) overlay
  const storey5Group = new THREE.Group();
  storey5Group.position.set(1.6, 0, -20.5);
  {
    const floorH = WALL_H / 5;
    const frameMat = new THREE.MeshBasicMaterial({ color: 0xffe49e, transparent: true, opacity: 0.88 });
    const glassMat = new THREE.MeshBasicMaterial({ color: 0x8ec8ff, transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(5.2, WALL_H, 0.25), glassMat);
    slab.position.y = WALL_H * 0.5;
    storey5Group.add(slab);
    for (const sx of [-2.6, 2.6]) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.22, WALL_H, 0.3), frameMat);
      col.position.set(sx, WALL_H * 0.5, 0);
      storey5Group.add(col);
    }
    for (let i = 1; i <= 5; i++) {
      const y = i * floorH;
      const bar = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.18, 0.3), frameMat);
      bar.position.y = y;
      storey5Group.add(bar);
      const tex = makeLabelTexture(THREE, `${i}`, 'FLOOR', '#1a2738', '#ffffff', '#ffd166');
      const badge = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.15), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
      badge.position.set(0, y - floorH * 0.5, 0.24);
      storey5Group.add(badge);
    }
  }
  coast.add(storey5Group);

  // (B) S4: "3,000 VILLAGERS" sign
  const pop3000Group = new THREE.Group();
  pop3000Group.position.set(0.0, 4.4, 3.8);
  {
    const tex = makeLabelTexture(THREE, '3,000', 'VILLAGERS', '#1b2a3d', '#ffffff', '#ffd166');
    pop3000Group.add(new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.6, 0.18), new THREE.MeshBasicMaterial({ map: tex })));
  }
  coast.add(pop3000Group);

  // (C) S5: Non-overlapping 3-tier cost tableau (cranes + glowing 15.5M arrow top; $30M + 12yr mid; raised $30M cash piles above captions)
  const s5CostGroup = new THREE.Group();
  {
    // Two bold yellow construction cranes flanking the rising gate (clearly visible in top tier)
    const craneMat = new THREE.MeshStandardMaterial({ color: 0xffb71b, emissive: 0x5c3e00, emissiveIntensity: 0.25, roughness: 0.45 });
    const cableMat = new THREE.MeshBasicMaterial({ color: 0x1e2329 });
    for (const [cx, h] of [[-2.7, 7.6], [2.7, 8.2]]) {
      const tower = new THREE.Mesh(new THREE.BoxGeometry(0.65, h, 0.65), craneMat);
      tower.position.set(cx, h * 0.5, -14.5);
      s5CostGroup.add(tower);
      const jib = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.52, 0.52), craneMat);
      jib.position.set(cx + (cx < 0 ? 1.5 : -1.5), h - 0.35, -14.5);
      s5CostGroup.add(jib);
      const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.8, 6), cableMat);
      cable.position.set(cx + (cx < 0 ? 2.5 : -2.5), h - 1.8, -14.5);
      s5CostGroup.add(cable);
      const hook = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.35), craneMat);
      hook.position.set(cx + (cx < 0 ? 2.5 : -2.5), h - 3.3, -14.5);
      s5CostGroup.add(hook);
    }

    // $30M cash piles raised on a tall cargo table (y=1.6..2.6 D) so they sit strictly ABOVE the caption band
    const billMat = new THREE.MeshStandardMaterial({ map: makeBillTexture(THREE), roughness: 0.72 });
    const sideMat = new THREE.MeshStandardMaterial({ color: 0xdbe8d8, roughness: 0.85 });
    const billMats = [sideMat, sideMat, billMat, billMat, sideMat, sideMat];
    const crate = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.55, 1.3), new THREE.MeshStandardMaterial({ color: 0x7c5334, roughness: 0.85 }));
    crate.position.set(0.0, 0.78, -8.8);
    s5CostGroup.add(crate);
    const offsets = [[-0.48, 1.70, 0.22], [0.48, 1.70, 0.20], [0.0, 1.70, -0.25], [-0.24, 2.00, 0.02], [0.26, 2.00, -0.02], [0.0, 2.30, 0.0]];
    for (const [x, y, z] of offsets) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.28, 0.46), billMats);
      b.position.set(x, y, -8.8 + z);
      s5CostGroup.add(b);
    }

    // Middle tier left: "$30M" plaque (zero overlap with center 15.5M arrow above)
    const costTex = makeLabelTexture(THREE, '$30M', 'COST', '#1b2a3d', '#ffffff', '#6ee7b7');
    const costSign = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.1, 0.16), new THREE.MeshBasicMaterial({ map: costTex }));
    costSign.position.set(-1.95, 4.7, -9.6);
    s5CostGroup.add(costSign);

    // Middle tier right: flipping "12 YEARS" calendar (zero overlap with center 15.5M arrow above)
    const calGroup = new THREE.Group();
    calGroup.position.set(1.95, 4.8, -9.6);
    calGroup.add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.75, 0.12), new THREE.MeshStandardMaterial({ color: 0x2e3540, roughness: 0.7 })));
    const calFront = new THREE.Mesh(
      new THREE.BoxGeometry(1.28, 1.62, 0.04),
      new THREE.MeshStandardMaterial({ map: makeCalendarTexture(THREE, '12', 'BUILD'), roughness: 0.6 })
    );
    calFront.position.z = 0.08;
    calGroup.add(calFront);
    const calPagePivot = new THREE.Group();
    calPagePivot.name = 'cal12_pivot';
    calPagePivot.position.set(0, 0.72, 0.11);
    const calLeaf = new THREE.Mesh(new THREE.BoxGeometry(1.22, 1.5, 0.02), new THREE.MeshStandardMaterial({ color: 0xfaf7ee, roughness: 0.7 }));
    calLeaf.position.y = -0.75;
    calPagePivot.add(calLeaf);
    calGroup.add(calPagePivot);
    s5CostGroup.add(calGroup);
    points.cal12_pivot = calPagePivot;

    // Top tier center: glowing 15.5M measure arrow with bold triangular arrowhead (strictly ABOVE $30M & 12yr)
    const s5Arrow = makeMeasureGauge(THREE, 4.2, '15.5M', 'GATE', 0xffe066, '#ffe066', 2.8);
    s5Arrow.position.set(0.0, 2.7, -12.0);
    s5CostGroup.add(s5Arrow);
  }
  coast.add(s5CostGroup);

  // (D) Full-height 15.5M measure arrow for S6, S24, S26
  const gauge155 = makeMeasureGauge(THREE, WALL_H, '15.5M', 'FUDAI WALL', 0xffd166, '#ffd166', 4.6);
  gauge155.position.set(2.4, 0, -18.5);
  coast.add(gauge155);

  // (E) S11: Portrait-proportioned Blueprint Table + Graduated Ruler + Cartoon Mayor Hand holding it locked at 15.5M
  const blueprintGroup = new THREE.Group();
  blueprintGroup.position.set(0.0, 1.35, 5.2);
  let blueprintRulerGroup;
  {
    const desk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.14, 2.6), new THREE.MeshStandardMaterial({ color: 0x7c5334, roughness: 0.78 }));
    blueprintGroup.add(desk);
    const sheet = new THREE.Mesh(
      new THREE.BoxGeometry(1.75, 0.03, 2.18),
      new THREE.MeshStandardMaterial({ map: makeBlueprintTexture(THREE), roughness: 0.58 })
    );
    sheet.position.y = 0.085;
    blueprintGroup.add(sheet);

    // Graduated brass ruler + Mayor's cartoon white hand & dark municipal suit sleeve locking it at 15.5M
    blueprintRulerGroup = new THREE.Group();
    blueprintRulerGroup.position.set(0, 0.13, -0.32);

    const rulerMatTop = new THREE.MeshStandardMaterial({ map: makeRulerTexture(THREE), roughness: 0.4 });
    const rulerSide = new THREE.MeshStandardMaterial({ color: 0xc9962c, roughness: 0.45 });
    const ruler = new THREE.Mesh(
      new THREE.BoxGeometry(1.62, 0.05, 0.24),
      [rulerSide, rulerSide, rulerMatTop, rulerSide, rulerSide, rulerSide]
    );
    blueprintRulerGroup.add(ruler);

    // Cartoon Mayor hand + ink outline cuff + dark suit forearm resting firmly on the right side of the ruler
    const handMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 });
    const inkMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const sleeveMat = new THREE.MeshStandardMaterial({ color: 0x263242, roughness: 0.8 });

    const palm = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), handMat);
    palm.scale.set(1.15, 0.55, 1.0);
    palm.position.set(0.32, 0.10, 0.05);
    blueprintRulerGroup.add(palm);

    const palmRim = new THREE.Mesh(new THREE.SphereGeometry(0.195, 12, 10), inkMat);
    palmRim.scale.set(1.15, 0.55, 1.0);
    palmRim.position.set(0.32, 0.095, 0.05);
    blueprintRulerGroup.add(palmRim);

    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.15, 0.14, 10), handMat);
    cuff.rotation.x = Math.PI * 0.5;
    cuff.rotation.z = -0.35;
    cuff.position.set(0.50, 0.12, 0.26);
    blueprintRulerGroup.add(cuff);

    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.20, 0.72, 10), sleeveMat);
    sleeve.rotation.x = Math.PI * 0.5;
    sleeve.rotation.z = -0.35;
    sleeve.position.set(0.66, 0.14, 0.62);
    blueprintRulerGroup.add(sleeve);

    blueprintGroup.add(blueprintRulerGroup);
  }
  coast.add(blueprintGroup);

  // (F) S13: Hanging wooden mocking sign
  const dumbSignGroup = new THREE.Group();
  dumbSignGroup.position.set(0.0, 4.6, 1.2);
  {
    const plankTex = makeLabelTexture(THREE, 'أغبى مشروع', 'FOOLISH WALL', '#6b4226', '#fff5dc', '#e8b954');
    const board = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.8, 0.24), new THREE.MeshStandardMaterial({ map: plankTex, roughness: 0.85 }));
    board.rotation.z = -0.06;
    dumbSignGroup.add(board);
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xc2a06b, roughness: 0.9 });
    for (const rx of [-1.7, 1.7]) {
      const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 8), ropeMat);
      rope.position.set(rx, 1.9, 0);
      dumbSignGroup.add(rope);
    }
  }
  coast.add(dumbSignGroup);

  // (G) S16: 14-year flipping calendar
  const cal14Group = new THREE.Group();
  cal14Group.position.set(0.0, 3.2, 2.0);
  let cal14Pivot;
  {
    cal14Group.add(new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.0, 0.12), new THREE.MeshStandardMaterial({ color: 0x2e3540, roughness: 0.7 })));
    const front = new THREE.Mesh(
      new THREE.BoxGeometry(1.46, 1.84, 0.04),
      new THREE.MeshStandardMaterial({ map: makeCalendarTexture(THREE, '14', 'AFTER'), roughness: 0.6 })
    );
    front.position.z = 0.08;
    cal14Group.add(front);
    cal14Pivot = new THREE.Group();
    cal14Pivot.position.set(0, 0.82, 0.11);
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.72, 0.02), new THREE.MeshStandardMaterial({ color: 0xfaf7ee, roughness: 0.7 }));
    leaf.position.y = -0.86;
    cal14Pivot.add(leaf);
    cal14Group.add(cal14Pivot);
  }
  coast.add(cal14Group);

  // (H) S20: 15M Tsunami wave measure gauge
  const gaugeWave15 = makeMeasureGauge(THREE, WAVE_H, '15M', 'TSUNAMI', 0x6ce5ff, '#6ce5ff', 4.6);
  gaugeWave15.position.set(4.5, 0, -50.0);
  coast.add(gaugeWave15);

  // (I) S8: Falling gold coins arcing into the harbour canal behind villager1 & villager2 (visible ONLY 17.28 <= t < 20.34)
  const fallingCoins = new THREE.Group();
  const coinMat = new THREE.MeshStandardMaterial({
    color: 0xffd24c, emissive: 0x8a6400, emissiveIntensity: 0.4, metalness: 0.6, roughness: 0.25,
  });
  const coinItems = [];
  for (let i = 0; i < 16; i++) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.06, 14), coinMat);
    fallingCoins.add(c);
    coinItems.push({ mesh: c, phase: i / 16, driftX: (rand() - 0.5) * 0.8 });
  }
  coast.add(fallingCoins);

  // 14 Wooden fishing village cottages lining both sides of harbour lane
  const cottagePalette = [0xd8c8b0, 0xc9d4d9, 0xe2cfb4, 0xc7bfb2];
  const roofPalette = [0x4c5e70, 0x6b4b3e, 0x3f4e5c, 0x7c5543];
  for (let i = 0; i < 14; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const row = Math.floor(i / 2);
    const cw = 3.8 + rand() * 1.4;
    const ch = 2.8 + rand() * 1.1;
    const cd = 3.4 + rand() * 1.2;
    const c = makeCottage(
      THREE, cw, ch, cd,
      cottagePalette[i % cottagePalette.length],
      roofPalette[i % roofPalette.length],
      true
    );
    c.position.set(side * (8.6 + (row % 2) * 2.0), 0, 14 - row * 5.2);
    c.rotation.y = side < 0 ? Math.PI * 0.48 : -Math.PI * 0.48;
    coast.add(c);
  }

  const cityHall = makeCottage(THREE, 8.2, 5.2, 5.4, 0xdad5c9, 0x3b4958, true);
  cityHall.position.set(-10.8, 0, 5.0);
  cityHall.rotation.y = Math.PI * 0.5;
  coast.add(cityHall);

  const streetLamps = [];
  const lampCoords = [[-5.8, 2.0], [5.8, -5.0], [-5.8, -12.0], [5.8, -19.0]];
  for (const [lx, lz] of lampCoords) {
    const lp = makeLampPost(THREE, 4.8, 0xffd384);
    lp.position.set(lx, 0, lz);
    lp.rotation.y = lx < 0 ? 0 : Math.PI;
    coast.add(lp);
    streetLamps.push(lp);
    const pl = new THREE.PointLight(0xffcc77, 1.4, 18);
    pl.position.set(lx + (lx < 0 ? 0.7 : -0.7), 4.5, lz);
    coast.add(pl);
    lights.push({ kind: 'practical', place: 'coast', light: pl });
  }

  const birds = new THREE.Group();
  const birdMat = new THREE.MeshBasicMaterial({ color: 0x1e252e });
  for (let i = 0; i < 12; i++) {
    const b = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.5, 4), birdMat);
    b.position.set(-6 + i * 1.1, 4.5 + (i % 3) * 1.1, -6 - (i % 4) * 3.5);
    b.rotation.z = Math.PI * 0.5;
    birds.add(b);
  }
  coast.add(birds);

  const timelapseSky = new THREE.Group();
  const sunOrb = new THREE.Mesh(new THREE.SphereGeometry(2.4, 14, 12), new THREE.MeshBasicMaterial({ color: 0xffe484 }));
  const moonOrb = new THREE.Mesh(new THREE.SphereGeometry(1.7, 14, 12), new THREE.MeshBasicMaterial({ color: 0xdce8ff }));
  timelapseSky.add(sunOrb, moonOrb);
  coast.add(timelapseSky);

  const coastWave = makeWaveMesh(THREE, 92, WAVE_H, 0x133857);
  coastWave.position.set(0, -WAVE_H, -80);
  coast.add(coastWave);
  points.coast_wave = coastWave;

  const sprayGroup = new THREE.Group();
  const sprayMat = new THREE.MeshBasicMaterial({ color: 0xf0f8ff, transparent: true, opacity: 0.85 });
  const sprayData = [];
  for (let i = 0; i < 28; i++) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.9 + rand() * 0.8, 8, 8), sprayMat);
    const sx = -20 + rand() * 40;
    const speed = 6 + rand() * 8;
    const phase = rand();
    sprayGroup.add(puff);
    sprayData.push({ puff, sx, speed, phase });
  }
  coast.add(sprayGroup);

  const sunbeams = new THREE.Group();
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xffe69c, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide,
  });
  for (let i = 0; i < 4; i++) {
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 4.8, 42, 10, 1, true), beamMat);
    beam.position.set(-9 + i * 6, 18, 2 - i * 3);
    beam.rotation.z = -0.28;
    sunbeams.add(beam);
  }
  coast.add(sunbeams);

  // =========================================================================
  // PLACE 2: FLASHBACK (X = 400)
  // =========================================================================
  const fb = new THREE.Group();
  fb.name = 'place_flashback';
  scene.add(fb);
  const fbDome = makeSkyDome(THREE, 400, 0xdcb37b);
  fb.add(fbDome.mesh);

  const fbHill = new THREE.Mesh(new THREE.BoxGeometry(60, 2, 24), new THREE.MeshStandardMaterial({ color: 0x7d6b4d, roughness: 0.94 }));
  fbHill.position.set(400, -1, 4);
  fb.add(fbHill);

  const fbBay = new THREE.Mesh(new THREE.BoxGeometry(110, 0.5, 70), new THREE.MeshStandardMaterial({ color: 0x5c686e, roughness: 0.4 }));
  fbBay.position.set(400, -5.5, -40);
  fb.add(fbBay);

  for (let i = 0; i < 6; i++) {
    const oldH = makeCottage(THREE, 3.2, 2.4, 3.0, 0x9c8262, 0x594433, true);
    oldH.position.set(390 + i * 4.2, -5.2, -26 - (i % 2) * 5);
    fb.add(oldH);
  }
  const fbWave = makeWaveMesh(THREE, 65, 9.5, 0x4b5c63);
  fbWave.position.set(400, -5.5, -34);
  fb.add(fbWave);

  const tsunamiRock = new THREE.Group();
  tsunamiRock.position.set(400.9, 0, 2.2);
  const rockBody = new THREE.Mesh(new THREE.DodecahedronGeometry(1.7, 1), new THREE.MeshStandardMaterial({ color: 0x6e665c, roughness: 0.95 }));
  rockBody.scale.set(1.0, 1.6, 0.72);
  rockBody.position.y = 1.8;
  tsunamiRock.add(rockBody);
  const chiselLine = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 0.12, 0.18),
    new THREE.MeshStandardMaterial({ color: 0xffe0a3, emissive: 0xd49b4b, emissiveIntensity: 0.7 })
  );
  chiselLine.position.set(0, 2.05, 1.05);
  tsunamiRock.add(chiselLine);
  fb.add(tsunamiRock);
  points.tsunami_rock = tsunamiRock;

  for (const lx of [396.2, 404.5]) {
    const toro = makeStoneLantern(THREE);
    toro.position.set(lx, 0, -2.5);
    fb.add(toro);
    const fl = new THREE.PointLight(0xffb866, 1.6, 16);
    fl.position.set(lx, 2.1, -2.5);
    fb.add(fl);
    lights.push({ kind: 'practical', place: 'flashback', light: fl });
  }

  // =========================================================================
  // PLACE 3: ANALOGY_ROOM (X = 800)
  // =========================================================================
  const room = new THREE.Group();
  room.name = 'place_analogy_room';
  scene.add(room);
  const roomDome = makeSkyDome(THREE, 800, 0xa8d2f2);
  room.add(roomDome.mesh);

  const floorMat = new THREE.MeshStandardMaterial({ color: 0x9c6e46, roughness: 0.78 });
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf3e4cc, roughness: 0.85 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x704c2e, roughness: 0.75 });

  const rFloor = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 16), floorMat);
  rFloor.position.set(800, -0.2, 0);
  room.add(rFloor);

  const chartWall = new THREE.Mesh(new THREE.BoxGeometry(4.6, 6.2, 0.5), wallMat);
  chartWall.position.set(800.6, 3.1, 1.1);
  room.add(chartWall);
  const baseboard = new THREE.Mesh(new THREE.BoxGeometry(4.65, 0.45, 0.56), trimMat);
  baseboard.position.set(800.6, 0.22, 1.1);
  room.add(baseboard);

  const tickMat = new THREE.MeshBasicMaterial({ color: 0x5c4a3a });
  for (let ty = 1.0; ty <= 2.6; ty += 0.25) {
    const tk = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.04), tickMat);
    tk.position.set(800.4, ty, 1.38);
    room.add(tk);
  }
  const pencilMark = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.06, 0.05), new THREE.MeshBasicMaterial({ color: 0x1c1c1c }));
  pencilMark.position.set(800.4, 1.98, 1.39);
  room.add(pencilMark);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6.2, 16), wallMat);
  leftWall.position.set(794, 3.1, 0);
  room.add(leftWall);

  const garden = new THREE.Mesh(new THREE.BoxGeometry(60, 0.5, 45), new THREE.MeshStandardMaterial({ color: 0x6f9e5a, roughness: 0.92 }));
  garden.position.set(800, -0.5, -24);
  room.add(garden);
  for (let i = 0; i < 5; i++) {
    const hill = new THREE.Mesh(new THREE.ConeGeometry(8 + i * 1.5, 7 + (i % 2) * 3, 7), new THREE.MeshStandardMaterial({ color: 0x5a8560, roughness: 0.92 }));
    hill.position.set(784 + i * 8, 3.0, -32 - (i % 2) * 5);
    room.add(hill);
  }

  const floorLamp = makeLampPost(THREE, 3.4, 0xffd996);
  floorLamp.position.set(796.6, 0, -0.6);
  room.add(floorLamp);
  const pendant = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0xfff0c4, emissive: 0xffd27d, emissiveIntensity: 1.6 })
  );
  pendant.position.set(799.2, 4.9, 1.8);
  room.add(pendant);
  const rLight1 = new THREE.PointLight(0xffd28a, 1.8, 16);
  rLight1.position.set(799.2, 4.5, 2.2);
  room.add(rLight1);
  const rLight2 = new THREE.PointLight(0xffe0a8, 1.3, 14);
  rLight2.position.set(797.0, 3.2, -0.2);
  room.add(rLight2);
  lights.push({ kind: 'practical', place: 'analogy_room', light: rLight1 }, { kind: 'practical', place: 'analogy_room', light: rLight2 });

  // =========================================================================
  // PLACE 4: NEIGHBORS (X = 1200) — Visibly SHORTER 10M Seawall + Clear Foreground Quay
  // =========================================================================
  const neigh = new THREE.Group();
  neigh.name = 'place_neighbors';
  scene.add(neigh);
  const neighDome = makeSkyDome(THREE, 1200, 0x9cc8e8);
  neigh.add(neighDome.mesh);

  const nLand = new THREE.Mesh(new THREE.BoxGeometry(120, 1, 70), new THREE.MeshStandardMaterial({ color: 0x778072, roughness: 0.92 }));
  nLand.position.set(1200, -0.5, 12);
  neigh.add(nLand);

  const nOcean = new THREE.Mesh(new THREE.BoxGeometry(160, 0.5, 110), new THREE.MeshStandardMaterial({ color: 0x357ca8, roughness: 0.18, metalness: 0.3 }));
  nOcean.position.set(1200, -0.3, -78);
  neigh.add(nOcean);

  // Visibly SHORT 10M neighbouring seawall (NEIGH_H = 10.5 D — leaves generous open sky & ocean above!)
  const nWall = new THREE.Mesh(new THREE.BoxGeometry(72, NEIGH_H, 3.0), concMat);
  nWall.position.set(1200, NEIGH_H * 0.5, -24);
  neigh.add(nWall);
  const nWallCap = new THREE.Mesh(new THREE.BoxGeometry(72.4, 0.6, 3.5), concDark);
  nWallCap.position.set(1200, NEIGH_H + 0.2, -24);
  neigh.add(nWallCap);
  for (let bx = -24; bx <= 24; bx += 6) {
    const butt = new THREE.Mesh(new THREE.BoxGeometry(0.8, NEIGH_H * 0.92, 1.0), concDark);
    butt.position.set(1200 + bx, NEIGH_H * 0.46, -22.2);
    neigh.add(butt);
  }

  // Two crisp "10M" measure gauges + a higher golden dashed "15.5M FUDAI" comparison bar above them so shortness reads instantly
  const neighLabelsGroup = new THREE.Group();
  const g10A = makeMeasureGauge(THREE, NEIGH_H - 1.2, '10M', 'NEIGHBORS', 0xff9f68, '#ff9f68', 3.4);
  g10A.position.set(1197.2, 0, -21.5);
  const g10B = makeMeasureGauge(THREE, NEIGH_H - 1.2, '10M', 'SHORT WALL', 0xff9f68, '#ff9f68', 3.4);
  g10B.position.set(1204.2, 0, -21.5);
  neighLabelsGroup.add(g10A, g10B);

  // Dashed golden 15.5M reference line hovering clearly ABOVE the low 10M wall
  const refBarMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });
  for (let rx = -8; rx <= 8; rx += 2.2) {
    const dash = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.22, 0.22), refBarMat);
    dash.position.set(1200.5 + rx, NEIGH_H + 5.2, -21.5);
    neighLabelsGroup.add(dash);
  }
  neigh.add(neighLabelsGroup);

  // Cottages placed strictly LEFT and RIGHT of the central harbour channel (x <= 1193 and x >= 1208, z = -14..-6)
  // so NO roof ever intersects the camera ray to villager3 standing cleanly at [1200.5, +2.5]!
  const neighCottagePos = [
    [1190, -14], [1190, -7], [1192, -1],
    [1210, -14], [1210, -7], [1209, -1],
  ];
  for (let i = 0; i < neighCottagePos.length; i++) {
    const [cx, cz] = neighCottagePos[i];
    const c = makeCottage(
      THREE, 3.8, 2.8, 3.4,
      cottagePalette[i % cottagePalette.length],
      roofPalette[i % roofPalette.length],
      true
    );
    c.position.set(cx, 0, cz);
    c.rotation.y = cx < 1200 ? Math.PI * 0.45 : -Math.PI * 0.45;
    neigh.add(c);
  }

  const lh = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.3, 15, 12), new THREE.MeshStandardMaterial({ color: 0xf4f4f0, roughness: 0.7 }));
  lh.position.set(1213, 7.5, -20);
  neigh.add(lh);
  const lhBand = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.15, 2.8, 12), new THREE.MeshStandardMaterial({ color: 0xc94a38, roughness: 0.7 }));
  lhBand.position.set(1213, 10.5, -20);
  neigh.add(lhBand);
  const lhBeacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.75, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0xffe484, emissive: 0xffc844, emissiveIntensity: 2.2 })
  );
  lhBeacon.position.set(1213, 15.5, -20);
  neigh.add(lhBeacon);
  const lhLight = new THREE.PointLight(0xffd277, 2.0, 30);
  lhLight.position.set(1213, 15.5, -20);
  neigh.add(lhLight);
  lights.push({ kind: 'practical', place: 'neighbors', light: lhLight });

  for (const lx of [1194.5, 1206.5]) {
    const lp = makeLampPost(THREE, 4.6, 0xffd27d);
    lp.position.set(lx, 0, -16);
    neigh.add(lp);
  }

  const neighWave = makeWaveMesh(THREE, 92, WAVE_H, 0x163d5c);
  neighWave.position.set(1200, -WAVE_H, -70);
  neigh.add(neighWave);

  // =========================================================================
  // PLACE 5: HILL_GRAVE (X = 1600) — PRESERVED UNCHANGED (approved at t=67.00)
  // =========================================================================
  const grave = new THREE.Group();
  grave.name = 'place_hill_grave';
  scene.add(grave);
  const graveDome = makeSkyDome(THREE, 1600, 0x8ea8cc);
  grave.add(graveDome.mesh);

  const hillTop = new THREE.Mesh(new THREE.BoxGeometry(36, 2, 22), new THREE.MeshStandardMaterial({ color: 0x658554, roughness: 0.94 }));
  hillTop.position.set(1600, -1.0, 2);
  grave.add(hillTop);

  const gravePad = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.1, 7.0), new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: 0.9 }));
  gravePad.position.set(1600, 0.05, 2.4);
  grave.add(gravePad);

  const graveFlowersGroup = new THREE.Group();
  for (const [fx, fy, fz, rz] of [
    [1599.28, 0.72, 1.65, 0.15],
    [1600.72, 0.72, 1.65, -0.15],
    [1599.65, 0.35, 2.05, 0.55],
    [1600.35, 0.35, 2.05, -0.55],
  ]) {
    const bq = makeFlowerBouquet(THREE);
    bq.position.set(fx, fy, fz);
    bq.rotation.z = rz;
    graveFlowersGroup.add(bq);
  }
  grave.add(graveFlowersGroup);

  const valley = new THREE.Mesh(new THREE.BoxGeometry(130, 1, 90), new THREE.MeshStandardMaterial({ color: 0x5c7560, roughness: 0.94 }));
  valley.position.set(1600, -6.5, -50);
  grave.add(valley);

  const distantWallGroup = new THREE.Group();
  distantWallGroup.position.set(1600, -5.5, -46);
  const distantWall = new THREE.Mesh(new THREE.BoxGeometry(58, 12.5, 2.8), concMat);
  distantWall.position.y = 6.25;
  distantWallGroup.add(distantWall);
  const distantGate = new THREE.Mesh(new THREE.BoxGeometry(11, 13.8, 3.2), steelMat);
  distantGate.position.y = 6.9;
  distantWallGroup.add(distantGate);
  const distantBridge = new THREE.Mesh(new THREE.BoxGeometry(14, 1.6, 3.6), concDark);
  distantBridge.position.y = 14.2;
  distantWallGroup.add(distantBridge);
  grave.add(distantWallGroup);

  const distantSea = new THREE.Mesh(new THREE.BoxGeometry(150, 0.5, 60), new THREE.MeshStandardMaterial({ color: 0x4580a8, roughness: 0.25 }));
  distantSea.position.set(1600, -6.0, -82);
  grave.add(distantSea);

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.45, 5.2, 8), new THREE.MeshStandardMaterial({ color: 0x593d2b, roughness: 0.9 }));
  trunk.position.set(1595.0, 2.6, -2.2);
  grave.add(trunk);
  const canopy = new THREE.Mesh(new THREE.DodecahedronGeometry(2.6, 1), new THREE.MeshStandardMaterial({ color: 0xd98a4e, roughness: 0.88 }));
  canopy.position.set(1595.0, 5.6, -2.2);
  grave.add(canopy);

  const leaves = [];
  const leafMat = new THREE.MeshBasicMaterial({ color: 0xe68b42, side: THREE.DoubleSide });
  for (let i = 0; i < 8; i++) {
    const lf = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.14), leafMat);
    grave.add(lf);
    leaves.push({ mesh: lf, sx: 1597 + rand() * 5, phase: rand() * 6.28, speed: 0.65 + rand() * 0.45 });
  }

  for (const lx of [1596.6, 1603.4]) {
    const toro = makeStoneLantern(THREE);
    toro.position.set(lx, 0, -0.8);
    grave.add(toro);
    const gl = new THREE.PointLight(0xffbe6b, 1.8, 16);
    gl.position.set(lx, 2.1, -0.8);
    grave.add(gl);
    lights.push({ kind: 'practical', place: 'hill_grave', light: gl });
  }

  // =========================================================================
  // PURE-IN-t UPDATE FUNCTION
  // =========================================================================
  function update(t) {
    storey5Group.visible = t < 4.56;
    if (storey5Group.visible) storey5Group.scale.y = 0.38 + 0.62 * smoothstep(0.4, 2.5, t);

    pop3000Group.visible = t >= 7.06 && t < 9.04;
    s5CostGroup.visible = t >= 9.04 && t < 12.21;
    if (points.cal12_pivot) {
      const f12 = clamp01((t - 9.04) / 3.01);
      points.cal12_pivot.rotation.x = -Math.abs(Math.sin(f12 * Math.PI * 8)) * 1.45;
    }

    const show155 = (t >= 12.21 && t < 14.40) || (t >= 54.88 && t < 58.00) || (t >= 61.56 && t < 64.49);
    gauge155.visible = show155;
    if (show155) {
      const prog155 = t < 14.40 ? 0.35 + 0.65 * smoothstep(12.21, 13.9, t) : 1.0;
      gauge155.scale.y = prog155;
    }

    const gateProg = t < 9.04 ? 1.0 : t < 14.2 ? 0.30 + 0.70 * smoothstep(9.04, 14.1, t) : 1.0;
    steelGate.scale.y = gateProg;
    steelGate.position.y = (WALL_H * gateProg) * 0.5;

    blueprintGroup.visible = t >= 23.18 && t < 25.09;
    if (blueprintGroup.visible) {
      const lockU = smoothstep(23.18, 23.60, t);
      blueprintRulerGroup.position.z = THREE.MathUtils.lerp(0.24, -0.32, lockU);
    }

    dumbSignGroup.visible = t >= 28.13 && t < 30.27;
    cal14Group.visible = t >= 35.70 && t < 37.39;
    if (cal14Group.visible) {
      const f14 = clamp01((t - 35.70) / 1.42);
      cal14Pivot.rotation.x = -Math.abs(Math.sin(f14 * Math.PI * 6)) * 1.45;
    }
    gaugeWave15.visible = t >= 42.86 && t < 45.45;
    neighLabelsGroup.visible = (t >= 14.40 && t < 17.28) || (t >= 58.00 && t < 61.56);
    graveFlowersGroup.visible = t >= 65.75;

    mirrorGroup.visible = t < 39.28;

    // Falling gold coins into harbour water behind S8 mockers (z = -10..-14, visible ONLY 17.28..20.34 s)
    const coinsActive = t >= 17.28 && t < 20.34;
    fallingCoins.visible = coinsActive;
    if (coinsActive) {
      const dt = t - 17.28;
      for (const item of coinItems) {
        const u = (dt * 0.85 + item.phase) % 1;
        item.mesh.position.set(
          0.1 + item.driftX * 0.8,
          2.9 + Math.sin(u * Math.PI) * 0.9 - u * 3.0,
          -9.5 - u * 4.0
        );
        item.mesh.rotation.set(dt * 8 + item.phase * 6, dt * 6, item.phase * 4);
      }
    }

    const tlActive = t >= 25.09 && t < 28.13;
    timelapseSky.visible = tlActive;
    if (tlActive) {
      const ang = (t - 25.09) * 3.8;
      sunOrb.position.set(Math.cos(ang) * 28, Math.max(-5, Math.sin(ang) * 26 + 14), -55);
      moonOrb.position.set(Math.cos(ang + Math.PI) * 28, Math.max(-5, Math.sin(ang + Math.PI) * 26 + 14), -55);
    }

    const quakeAmt = t >= 37.39 && t < 39.28 ? Math.sin((t - 37.39) * 26) * 0.14 : 0;
    for (let i = 0; i < streetLamps.length; i++) {
      streetLamps[i].rotation.z = quakeAmt * (i % 2 === 0 ? 1 : -1);
    }
    birds.visible = t >= 37.39 && t < 39.4;
    if (birds.visible) {
      const dt = t - 37.39;
      birds.position.set(dt * 4.5, dt * 3.2, -dt * 2.0);
    }

    const retreat = t >= 39.28 && t < 45.45 ? smoothstep(39.28, 41.0, t) : 0;
    ocean.position.z = -95 - retreat * 36;
    const boatY = retreat > 0.25 ? -0.45 : -0.08 + Math.sin(t * 1.4) * 0.03;
    boat1.position.y = boatY;
    boat1.rotation.z = retreat > 0.25 ? 0.28 : Math.sin(t * 1.2) * 0.02;
    boat2.position.y = boatY;
    boat2.rotation.z = retreat > 0.25 ? -0.24 : Math.cos(t * 1.1) * 0.02;

    let waveVisible = false;
    let waveZ = -90;
    let waveY = -WAVE_H;
    if (t >= 41.06 && t < 45.45) {
      waveVisible = true;
      const u = smoothstep(41.06, 44.5, t);
      waveY = -WAVE_H * (1 - u);
      waveZ = -78 + u * 26;
    } else if (t >= 61.56 && t < 64.49) {
      waveVisible = true;
      const u = smoothstep(61.56, 62.15, t);
      waveY = 0;
      waveZ = -48 + u * 16.5;
    }
    coastWave.visible = waveVisible;
    coastWave.position.set(0, waveY, waveZ);

    const impactActive = t >= 61.95 && t < 64.49;
    sprayGroup.visible = impactActive;
    if (impactActive) {
      const dt = t - 61.95;
      for (const s of sprayData) {
        const cyc = (dt * 0.95 + s.phase) % 1;
        s.puff.position.set(s.sx, WALL_H - 1.5 + Math.sin(cyc * Math.PI) * 5.8, -24.5 - cyc * 3.0);
        s.puff.scale.setScalar(0.5 + Math.sin(cyc * Math.PI) * 1.1);
      }
    }

    sunbeams.visible = t >= 64.49;

    const pencilProg = smoothstep(52.53, 53.6, t);
    pencilMark.scale.x = Math.max(0.02, pencilProg);
    pencilMark.visible = t >= 52.4;

    const neighFlood = t >= 58.0 && t < 61.56;
    neighWave.visible = neighFlood;
    if (neighFlood) {
      const u = smoothstep(58.0, 61.0, t);
      neighWave.position.set(1200, 0, -44 + u * 48);
    }

    for (const lf of leaves) {
      const u = ((t * lf.speed * 0.25 + lf.phase) % 1 + 1) % 1;
      lf.mesh.position.set(
        lf.sx + Math.sin(t * 1.8 + lf.phase) * 0.7,
        4.8 * (1 - u),
        -0.5 + Math.cos(t * 1.3 + lf.phase) * 0.5
      );
      lf.mesh.rotation.set(t * 1.5 + lf.phase, t * 1.1, lf.phase);
    }

    const isStorm = (t >= 35.7 && t < 45.45) || (t >= 58.0 && t < 64.49);
    const isDawn = t >= 64.49;
    const isTwilight = t >= 33.04 && t < 35.7;
    if (isStorm) {
      coastDome.mat.color.setHex(0x4b5f75);
      neighDome.mat.color.setHex(0x45586b);
      sun.color.setHex(0x8ba6c2);
      sun.intensity = 1.15;
      hemi.color.setHex(0x6b829c);
    } else if (isDawn) {
      coastDome.mat.color.setHex(0xf2be7e);
      graveDome.mat.color.setHex(0xf5c88a);
      sun.color.setHex(0xffd48a);
      sun.intensity = 2.05;
      hemi.color.setHex(0xffdfb0);
    } else if (isTwilight) {
      graveDome.mat.color.setHex(0x7c96bd);
      sun.color.setHex(0xe8b878);
      sun.intensity = 1.35;
      hemi.color.setHex(0x9bb2d4);
    } else {
      coastDome.mat.color.setHex(0x8cc2eb);
      neighDome.mat.color.setHex(0x9cc8e8);
      sun.color.setHex(0xffcf87);
      sun.intensity = 1.85;
      hemi.color.setHex(0xaad0f5);
    }
  }

  update(0);
  return { update, points, lights };
}