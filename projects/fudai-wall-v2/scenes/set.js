// Fudai Wall — Custom multi-place 3D set (Build pass)
// Pure in t: deterministic seeded PRNG, zero Math.random(), zero Date, zero mutable cross-frame state.
// Five places spaced 400 D apart along X, each with an opaque depth-writing dome, 25 D+ depth, and 2+ practicals.

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

function makeSkyDome(THREE, xOffset, colorHex, radius = 180) {
  // Opaque dome with depthWrite: true so distant places never bleed through (pitfalls.md)
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
    new THREE.BoxGeometry(1.8, 0.72, 4.4),
    new THREE.MeshStandardMaterial({ color: hullColor, roughness: 0.72 })
  );
  hull.position.y = 0.36;
  g.add(hull);
  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(1.86, 0.16, 4.44),
    new THREE.MeshStandardMaterial({ color: 0xc94a38, roughness: 0.7 })
  );
  stripe.position.y = 0.56;
  g.add(stripe);
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.05, 1.45),
    new THREE.MeshStandardMaterial({ color: 0xf4f7fa, roughness: 0.65 })
  );
  cabin.position.set(0, 1.18, -0.35);
  g.add(cabin);
  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.06, 2.2, 6),
    new THREE.MeshStandardMaterial({ color: 0x5c4632, roughness: 0.85 })
  );
  mast.position.set(0, 2.1, -0.35);
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

export async function buildSet(THREE, scene, opts = {}, kit) {
  const rand = mulberry32(20110311);
  const WALL_H = opts.wallHeightD ?? 24.8;
  const WAVE_H = opts.waveHeightD ?? 24.0;
  const NEIGH_H = opts.neighborWallD ?? 16.0;

  const points = {};
  const lights = [];

  const hemi = new THREE.HemisphereLight(0xaad0f5, 0x4b5878, 0.85);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffcf87, 1.85);
  sun.position.set(35, 42, 28);
  scene.add(sun);
  lights.push({ kind: 'hemi', light: hemi }, { kind: 'sun', light: sun });

  // PLACE 1: COAST (X = 0)
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
    new THREE.BoxGeometry(7.6, 0.08, 48),
    new THREE.MeshStandardMaterial({ color: 0x93989e, roughness: 0.88 })
  );
  lane.position.set(0, 0.04, 0);
  coast.add(lane);

  const sand = new THREE.Mesh(
    new THREE.BoxGeometry(140, 0.6, 120),
    new THREE.MeshStandardMaterial({ color: 0x9b8c72, roughness: 0.9 })
  );
  sand.position.set(0, -0.8, -84);
  coast.add(sand);

  const oceanMat = new THREE.MeshStandardMaterial({
    color: 0x3b86b8,
    roughness: 0.12,
    metalness: 0.38,
  });
  const ocean = new THREE.Mesh(new THREE.BoxGeometry(160, 0.4, 120), oceanMat);
  ocean.position.set(0, -0.25, -85);
  coast.add(ocean);

  const boat1 = makeFishingBoat(THREE, 0xe8eff5);
  boat1.position.set(-4.5, -0.1, -36);
  boat1.rotation.y = 0.25;
  coast.add(boat1);
  const boat2 = makeFishingBoat(THREE, 0xdbe5cc);
  boat2.position.set(6.8, -0.1, -44);
  boat2.rotation.y = -0.35;
  coast.add(boat2);

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

  const cranes = new THREE.Group();
  for (const cx of [-11, 11]) {
    const tower = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 30, 1.2),
      new THREE.MeshStandardMaterial({ color: 0xe6a82e, roughness: 0.6 })
    );
    tower.position.set(cx, 15, -18);
    cranes.add(tower);
    const jib = new THREE.Mesh(
      new THREE.BoxGeometry(14, 0.9, 0.9),
      new THREE.MeshStandardMaterial({ color: 0xe6a82e, roughness: 0.6 })
    );
    jib.position.set(cx + (cx < 0 ? 5.5 : -5.5), 29.2, -18);
    cranes.add(jib);
  }
  coast.add(cranes);

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
    const x = side * (7.2 + (row % 2) * 2.2);
    const z = 14 - row * 5.2;
    c.position.set(x, 0, z);
    c.rotation.y = side < 0 ? Math.PI * 0.48 : -Math.PI * 0.48;
    coast.add(c);
  }

  const cityHall = makeCottage(THREE, 8.2, 5.2, 5.4, 0xdad5c9, 0x3b4958, true);
  cityHall.position.set(-10.5, 0, 5.0);
  cityHall.rotation.y = Math.PI * 0.5;
  coast.add(cityHall);

  const streetLamps = [];
  const lampCoords = [[-4.2, 2.0], [4.2, -5.0], [-4.2, -12.0], [4.2, -19.0]];
  for (const [lx, lz] of lampCoords) {
    const lp = makeLampPost(THREE, 4.8, 0xffd384);
    lp.position.set(lx, 0, lz);
    lp.rotation.y = lx < 0 ? 0 : Math.PI;
    coast.add(lp);
    streetLamps.push(lp);
    const pl = new THREE.PointLight(0xffcc77, 1.4, 16);
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
    color: 0xffe69c,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  for (let i = 0; i < 4; i++) {
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 4.8, 42, 10, 1, true), beamMat);
    beam.position.set(-9 + i * 6, 18, 2 - i * 3);
    beam.rotation.z = -0.28;
    sunbeams.add(beam);
  }
  coast.add(sunbeams);

  // PLACE 2: FLASHBACK (X = 400)
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

  // PLACE 3: ANALOGY_ROOM (X = 800)
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

  // PLACE 4: NEIGHBORS (X = 1200)
  const neigh = new THREE.Group();
  neigh.name = 'place_neighbors';
  scene.add(neigh);
  const neighDome = makeSkyDome(THREE, 1200, 0x9cc8e8);
  neigh.add(neighDome.mesh);

  const nLand = new THREE.Mesh(new THREE.BoxGeometry(120, 1, 70), new THREE.MeshStandardMaterial({ color: 0x778072, roughness: 0.92 }));
  nLand.position.set(1200, -0.5, 12);
  neigh.add(nLand);

  const nOcean = new THREE.Mesh(new THREE.BoxGeometry(150, 0.5, 110), new THREE.MeshStandardMaterial({ color: 0x357ca8, roughness: 0.18, metalness: 0.3 }));
  nOcean.position.set(1200, -0.3, -78);
  neigh.add(nOcean);

  const nWall = new THREE.Mesh(new THREE.BoxGeometry(72, NEIGH_H, 3.4), concMat);
  nWall.position.set(1200, NEIGH_H * 0.5, -24);
  neigh.add(nWall);

  for (let i = 0; i < 10; i++) {
    const c = makeCottage(THREE, 3.8, 2.8, 3.4, 0xd8cdb8, 0x52606e, true);
    c.position.set(1182 + (i % 5) * 9, 0, -10 + Math.floor(i / 5) * 9);
    neigh.add(c);
  }

  const lh = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.4, 14, 12), new THREE.MeshStandardMaterial({ color: 0xf4f4f0, roughness: 0.7 }));
  lh.position.set(1224, 7, -20);
  neigh.add(lh);
  const lhBeacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.75, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0xffe484, emissive: 0xffc844, emissiveIntensity: 2.2 })
  );
  lhBeacon.position.set(1224, 14.4, -20);
  neigh.add(lhBeacon);
  const lhLight = new THREE.PointLight(0xffd277, 2.0, 28);
  lhLight.position.set(1224, 14.4, -20);
  neigh.add(lhLight);
  lights.push({ kind: 'practical', place: 'neighbors', light: lhLight });

  for (const lx of [1192, 1208]) {
    const lp = makeLampPost(THREE, 4.6, 0xffd27d);
    lp.position.set(lx, 0, -16);
    neigh.add(lp);
  }

  const neighWave = makeWaveMesh(THREE, 92, WAVE_H, 0x163d5c);
  neighWave.position.set(1200, -WAVE_H, -70);
  neigh.add(neighWave);

  // PLACE 5: HILL_GRAVE (X = 1600)
  const grave = new THREE.Group();
  grave.name = 'place_hill_grave';
  scene.add(grave);
  const graveDome = makeSkyDome(THREE, 1600, 0x8ea8cc);
  grave.add(graveDome.mesh);

  const hillTop = new THREE.Mesh(new THREE.BoxGeometry(36, 2, 22), new THREE.MeshStandardMaterial({ color: 0x658554, roughness: 0.94 }));
  hillTop.position.set(1600, -1.0, 2);
  grave.add(hillTop);

  const valley = new THREE.Mesh(new THREE.BoxGeometry(130, 1, 90), new THREE.MeshStandardMaterial({ color: 0x5c7560, roughness: 0.94 }));
  valley.position.set(1600, -14, -55);
  grave.add(valley);
  const distantWall = new THREE.Mesh(new THREE.BoxGeometry(58, 11.5, 2.8), concMat);
  distantWall.position.set(1600, -8.2, -62);
  grave.add(distantWall);
  const distantSea = new THREE.Mesh(new THREE.BoxGeometry(150, 0.5, 60), new THREE.MeshStandardMaterial({ color: 0x4580a8, roughness: 0.25 }));
  distantSea.position.set(1600, -13.4, -92);
  grave.add(distantSea);

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.45, 5.2, 8), new THREE.MeshStandardMaterial({ color: 0x593d2b, roughness: 0.9 }));
  trunk.position.set(1595.5, 2.6, -2.2);
  grave.add(trunk);
  const canopy = new THREE.Mesh(new THREE.DodecahedronGeometry(2.6, 1), new THREE.MeshStandardMaterial({ color: 0xd98a4e, roughness: 0.88 }));
  canopy.position.set(1595.5, 5.6, -2.2);
  grave.add(canopy);

  const leaves = [];
  const leafMat = new THREE.MeshBasicMaterial({ color: 0xe68b42, side: THREE.DoubleSide });
  for (let i = 0; i < 8; i++) {
    const lf = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.14), leafMat);
    grave.add(lf);
    leaves.push({ mesh: lf, sx: 1597 + rand() * 5, phase: rand() * 6.28, speed: 0.65 + rand() * 0.45 });
  }

  for (const lx of [1597.2, 1602.8]) {
    const toro = makeStoneLantern(THREE);
    toro.position.set(lx, 0, -0.8);
    grave.add(toro);
    const gl = new THREE.PointLight(0xffbe6b, 1.8, 16);
    gl.position.set(lx, 2.1, -0.8);
    grave.add(gl);
    lights.push({ kind: 'practical', place: 'hill_grave', light: gl });
  }

  function update(t) {
    const buildActive = t >= 8.9 && t < 17.28;
    cranes.visible = buildActive;
    const gateProg = t < 9.04 ? 1.0 : t < 14.2 ? 0.25 + 0.75 * smoothstep(9.04, 14.1, t) : 1.0;
    steelGate.scale.y = gateProg;
    steelGate.position.y = (WALL_H * gateProg) * 0.5;

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
    ocean.position.z = -85 - retreat * 36;
    const boatY = retreat > 0.25 ? -0.45 : -0.1 + Math.sin(t * 1.4) * 0.04;
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