import * as THREE from 'three';

// scenes/set.js — Fudai Wall, Build pass. The film's own set: six places, 400 D apart,
// each in its own dome, each with depth along the look (far end 25 D+) and 2+ visible practicals.
// Pure and static: geometry is a function of nothing; no Math.random, no Date, no state.
// The engine copy is never edited; everything here lives in scenes/ per the style law.

export const points = {
  coastSquare: [0, 0, 0],
  coastWallTop: [0, 24.8, -28],
  coastGate: [0, 4, -28],
  coastSea: [0, 0, -60],
  buildSkeleton: [400, 12, -30],
  buildTopEdge: [400.5, 24.4, -29.5],
  neighWallA: [795, 8, -26],
  rockMark: [1198.8, 2.25, -0.3],
  roomMarks: [1600.8, 2.7, -5.9],
  graveStone: [2000, 1.1, -2],
  graveView: [2000, 6, -72],
};

export async function buildSet(a, b, c, d) {
  // Repair round 1: this file imports THREE itself and never assumes the host passes it in.
  // The host's scene is located by shape across the call shapes the loader may use:
  // (THREE, scene, opts, kit) as documented in SKILL.md, (scene, opts, kit), or
  // ({ THREE, scene, opts, kit }) — construction always uses the module-scoped THREE.
  const args = [a, b, c, d].filter((v) => v !== undefined && v !== null);
  const scene = args.reduce((found, v) => {
    if (found) return found;
    if (v && v.isObject3D && typeof v.add === 'function') return v;
    if (v && v.scene && v.scene.isObject3D && typeof v.scene.add === 'function') return v.scene;
    return found;
  }, null);
  if (!scene) throw new Error('scenes/set.js: the host provided no scene to build into');
  const T = THREE; // imported by this file — the host passes no objects in (repair round 1)
  const G = (o) => { const g = new T.Group(); return g; };
  const std = (c, r = 0.85, m = 0.0, e = null, ei = 0) => new T.MeshStandardMaterial({ color: c, roughness: r, metalness: m, emissive: e || 0x000000, emissiveIntensity: ei });
  const basic = (c, fog = true) => new T.MeshBasicMaterial({ color: c, fog: fog });
  const box = (w, h, d, mat, x, y, z, ry = 0) => { const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.rotation.y = ry; return m; };
  const cyl = (rt, rb, h, mat, x, y, z, seg = 14) => { const m = new T.Mesh(new T.CylinderGeometry(rt, rb, h, seg), mat); m.position.set(x, y, z); return m; };

  function tex(w, h, draw) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); draw(g, w, h);
    const t = new T.CanvasTexture(c); t.anisotropy = 4; return t;
  }

  function dome(cx, cz, topC, midC, botC, name) {
    const t = tex(16, 256, (g) => {
      const gr = g.createLinearGradient(0, 0, 0, 256);
      gr.addColorStop(0, topC); gr.addColorStop(0.55, midC); gr.addColorStop(1, botC);
      g.fillStyle = gr; g.fillRect(0, 0, 16, 256);
    });
    const m = new T.MeshBasicMaterial({ map: t, side: T.BackSide, fog: false, depthWrite: false });
    const d = new T.Mesh(new T.SphereGeometry(300, 24, 18), m);
    d.position.set(cx, 0, cz); d.name = name; return d;
  }

  function ground(cx, cz, r, mat, y = 0) {
    const m = new T.Mesh(new T.CircleGeometry(r, 36), mat);
    m.rotation.x = -Math.PI / 2; m.position.set(cx, y, cz); m.receiveShadow = true; return m;
  }

  function house(x, z, w, d, h, wallC, roofC, ry, lit) {
    const g = new T.Group();
    const wall = std(wallC, 0.92);
    g.add(box(w, h, d, wall, 0, h / 2, 0));
    const roofM = new T.Mesh(new T.ConeGeometry(w * 0.62, h * 0.5, 4), std(roofC, 0.95));
    roofM.rotation.y = Math.PI / 4; roofM.position.y = h + h * 0.24; roofM.scale.z = d / w;
    g.add(roofM);
    g.add(box(0.2, h * 0.42, 0.16, std(0x8a6a52, 0.9), 0, h * 1.18, -d * 0.28)); // chimney
    // door + windows on the +z face (street side)
    g.add(box(w * 0.2, h * 0.52, 0.08, std(0x5a3d2a, 0.9), -w * 0.22, h * 0.26, d / 2 + 0.04));
    const winMat = lit ? basic(0xffd9a0) : std(0x2e3d4e, 0.7);
    for (const wx of [-w * 0.02, w * 0.26]) {
      g.add(box(w * 0.16, h * 0.2, 0.06, winMat, wx, h * 0.62, d / 2 + 0.035));
      g.add(box(w * 0.19, h * 0.05, 0.1, std(0x6b5138, 0.9), wx, h * 0.5, d / 2 + 0.05)); // sill box
    }
    g.position.set(x, 0, z); g.rotation.y = ry; return g;
  }

  function lampPost(x, z, headC = 0xffd9a0, h = 5.6) {
    const g = new T.Group();
    g.add(cyl(0.09, 0.14, h, std(0x37414d, 0.6, 0.3), 0, h / 2, 0));
    g.add(cyl(0.3, 0.42, 0.1, std(0x37414d, 0.6, 0.3), 0, 0.05, 0));
    g.add(new T.Mesh(new T.SphereGeometry(0.34, 12, 10), basic(headC)));
    const lamp = new T.Mesh(new T.SphereGeometry(0.36, 12, 10), basic(headC)); lamp.position.y = h; g.add(lamp);
    g.children[g.children.length - 2].position.y = h;
    g.position.set(x, 0, z); return g;
  }

  function lantern(x, y, z, c = 0xffb066) {
    const g = new T.Group();
    g.add(box(0.06, 0.06, 0.06, std(0x2b2b2b, 0.6), 0, 0.5, 0));
    g.add(new T.Mesh(new T.SphereGeometry(0.22, 10, 8), basic(c)));
    g.children[1].position.y = 0.18;
    g.add(cyl(0.16, 0.2, 0.1, std(0x2b2b2b, 0.6), 0, 0.34, 0));
    g.add(cyl(0.18, 0.14, 0.08, std(0x2b2b2b, 0.6), 0, 0.02, 0));
    g.position.set(x, y, z); return g;
  }

  function glowWin(x, y, z, w, h, ry, c = 0xffd9a0) {
    const m = new T.Mesh(new T.PlaneGeometry(w, h), basic(c));
    m.position.set(x, y, z); m.rotation.y = ry; return m;
  }

  function boat(x, y, z, ry, tilt = 0, c = 0x9a4f2e) {
    const g = new T.Group();
    const hull = new T.Mesh(new T.SphereGeometry(2.2, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), std(c, 0.85));
    hull.scale.set(1, 0.55, 0.42); hull.rotation.x = Math.PI; hull.position.y = 0.55;
    g.add(hull);
    g.add(box(3.6, 0.14, 1.5, std(0xc08a5a, 0.9), 0, 0.62, 0));
    g.add(box(0.14, 1.5, 0.14, std(0x6b5138, 0.9), -1.1, 1.4, 0));
    g.add(box(2.4, 0.05, 0.05, std(0x6b5138, 0.9), 0.1, 2.1, 0));
    const bl = new T.Mesh(new T.SphereGeometry(0.17, 8, 8), basic(0xffe2b0)); bl.position.set(1.1, 2.15, 0); g.add(bl);
    g.position.set(x, y, z); g.rotation.y = ry; g.rotation.z = tilt; return g;
  }

  function crateStack(x, z, n, ry = 0) {
    const g = new T.Group();
    for (let i = 0; i < n; i++) {
      const s = 0.7 - (i % 3) * 0.08;
      g.add(box(s, s, s, std([0xa87848, 0x8f6238, 0xb98a55][i % 3], 0.95), (i % 2) * 0.2 - 0.1, s / 2 + Math.floor(i / 2) * s, (i % 3) * 0.12, i * 0.4));
    }
    g.position.set(x, 0, z); g.rotation.y = ry; return g;
  }

  function palm(x, z, h = 6) {
    const g = new T.Group();
    g.add(cyl(0.12, 0.2, h, std(0x7a5a3a, 0.95), 0, h / 2, 0));
    for (let i = 0; i < 6; i++) {
      const fr = new T.Mesh(new T.ConeGeometry(0.28, 2.6, 4), std(0x4a7a3a, 0.95));
      fr.position.set(Math.cos(i) * 0.9, h + 0.2, Math.sin(i) * 0.9);
      fr.rotation.set(Math.sin(i) * 0.9 + Math.PI / 2, i * 1.05, 0.4);
      g.add(fr);
    }
    g.position.set(x, 0, z); return g;
  }

  function sunDisc(x, y, z, r, c = 0xffdf9e) {
    const m = new T.Mesh(new T.CircleGeometry(r, 20), basic(c, false));
    m.position.set(x, y, z); m.lookAt(0, y, 400); return m;
  }

  // light rig helper: hemi + dir (+ optional shadow) per place
  function rig(g, skyC, gndC, hi, sunC, si, sx, sy, sz, tx, tz, shadow) {
    const hemi = new T.HemisphereLight(skyC, gndC, hi);
    const sun = new T.DirectionalLight(sunC, si);
    sun.position.set(sx, sy, sz);
    sun.target.position.set(tx, 0, tz);
    if (shadow) { sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
      sun.shadow.camera.left = -40; sun.shadow.camera.right = 40; sun.shadow.camera.top = 40; sun.shadow.camera.bottom = -40; sun.shadow.camera.far = 160; }
    g.add(hemi); g.add(sun); g.add(sun.target);
    return { hemi, sun };
  }

  function pointLight(g, c, i, d, x, y, z) {
    const p = new T.PointLight(c, i, d, 1.6); p.position.set(x, y, z); g.add(p); return p;
  }

  const root = new T.Group(); root.name = 'fudai_set_root';
  const places = [];

  // ---------------------------------------------------------------- COAST (0,0)
  {
    const g = new T.Group(); g.name = 'place_coast';
    g.add(dome(0, 0, '#7fb2d9', '#cfe3ea', '#f2d9a8', 'dome_coast'));
    g.add(ground(0, 6, 78, std(0xd8c290, 0.96)));
    // streets: plaza planks near square
    g.add(box(26, 0.06, 3.2, std(0xb5906a, 0.95), 0, 0.03, -8));
    g.add(box(3.2, 0.06, 30, std(0xb5906a, 0.95), -5, 0.04, 12));
    // THE WALL: two segments + lintel, gate opening 5 wide x 8 tall at x=0, face at z=-28
    const conc = new T.MeshStandardMaterial({ map: tex(512, 512, (g2) => {
      g2.fillStyle = '#9aa2a6'; g2.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 8; i++) { g2.fillStyle = i % 2 ? '#949ca0' : '#a0a8ac'; g2.fillRect(0, i * 64, 512, 62); }
      g2.strokeStyle = '#7e868a'; g2.lineWidth = 3;
      for (let i = 0; i <= 8; i++) { g2.beginPath(); g2.moveTo(0, i * 64); g2.lineTo(512, i * 64); g2.stroke(); }
      for (let i = 0; i < 6; i++) { g2.beginPath(); g2.moveTo(i * 85, 0); g2.lineTo(i * 85, 512); g2.stroke(); }
      g2.fillStyle = '#6e767a';
      for (let i = 0; i < 40; i++) { const x = (i * 53) % 500 + 6, y = (i * 97) % 480 + 16; g2.beginPath(); g2.arc(x, y, 4, 0, 7); g2.fill(); }
      g2.fillStyle = 'rgba(110,120,110,0.25)'; g2.fillRect(0, 430, 512, 82);
    }), roughness: 0.94 });
    g.add(box(17.5, 24.8, 4, conc, -11.25, 12.4, -30));
    g.add(box(17.5, 24.8, 4, conc, 11.25, 12.4, -30));
    g.add(box(5, 16.8, 4, conc, 0, 8 + 8.4, -30));
    g.add(box(45, 0.7, 4.8, std(0xc2c8ca, 0.9), 0, 25.15, -30)); // coping
    for (let i = 0; i < 9; i++) g.add(box(0.5, 0.8, 0.5, std(0x8d959a, 0.9), -20 + i * 5, 25.9, -30)); // edge posts
    // jetty + boats on the sea side
    g.add(box(3, 0.3, 10, std(0x8f6f4e, 0.95), -10, 0.4, -33));
    for (let i = 0; i < 4; i++) g.add(cyl(0.09, 0.09, 1.4, std(0x5f4630, 0.9), -11.2 + i * 0.8, 0.2, -37.2 - (i % 2) * 3));
    g.add(boat(-14, 0.05, -40, 0.5));
    g.add(boat(-19, 0.05, -44, 2.2, 0, 0x4f7a8a));
    g.add(lantern(-10, 1.15, -33));
    // houses: two rows along street A (z=-3 and z=-13), lane at x=-5 to the municipal building
    const rowA = [[-16, -3, 0.2], [-9.5, -3.1, -0.15], [4.5, -3, 0.1], [11.5, -3.2, -0.2], [17, -3, 0.15]];
    const rowB = [[-15, -13, Math.PI + 0.1], [-8, -13.2, Math.PI - 0.15], [-0.5, -13, Math.PI], [6.5, -13.1, Math.PI + 0.12], [13, -13, Math.PI - 0.1]];
    rowA.forEach((p, i) => g.add(house(p[0], p[1], 4.6 + (i % 2), 4.2, 3.6 + (i % 3) * 0.5, [0xd9b98a, 0xcfae86, 0xe0c39a][i % 3], [0x8a5a3a, 0x7a4f34][i % 2], p[2], true)));
    rowB.forEach((p, i) => g.add(house(p[0], p[1], 4.4 + (i % 2), 4.0, 3.4 + (i % 3) * 0.6, [0xd4b48c, 0xc9a87e, 0xdcbf98][i % 3], [0x845536, 0x93643f][i % 2], p[2], i % 2 === 0)));
    // municipal building at the lane end (depth 26 D behind the square)
    g.add(box(9, 8.5, 6, std(0xd9d2c4, 0.9), -5, 4.25, 28));
    g.add(box(10, 0.8, 7, std(0xb9b2a4, 0.9), -5, 8.9, 28));
    for (let i = 0; i < 4; i++) g.add(cyl(0.28, 0.28, 5.4, std(0xe4ded2, 0.85), -8 + i * 2, 2.7, 31.2));
    g.add(glowWin(-6.5, 5.6, 31.05, 1.1, 1.5, 0));
    g.add(glowWin(-3.5, 5.6, 31.05, 1.1, 1.5, 0));
    // practicals along the depth: 3 lanterns on street A, jetty lamp, windows glow, boat lamp
    g.add(lantern(-6.5, 4.4, -8)); g.add(lantern(2.5, 4.4, -8.2)); g.add(lantern(10.5, 4.4, -7.8));
    g.add(lampPost(-7.6, 4.5)); g.add(lampPost(9.4, -11.6));
    g.add(pointLight(g, 0xffb066, 1.1, 16, 2.5, 4.6, -8));
    g.add(pointLight(g, 0xffb066, 0.9, 14, -6.5, 4.6, -8));
    g.add(pointLight(g, 0xffe2b0, 0.8, 12, -14, 2.2, -40));
    rig(g, 0xffe4c0, 0x51617a, 0.85, 0xffd9a0, 1.15, 34, 42, 26, 0, -6, true);
    root.add(g); places.push({ name: 'coast', origin: [0, 0, 0], group: g });
  }

  // ---------------------------------------------------------------- CONSTRUCTION (400,0)
  {
    const g = new T.Group(); g.name = 'place_construction';
    g.add(dome(400, 0, '#a8b8c4', '#d9cdb2', '#e8cfa0', 'dome_construction'));
    g.add(ground(400, 4, 80, std(0xb59a72, 0.97)));
    g.add(box(6, 0.05, 34, std(0x9c8462, 0.96), 400, 0.03, 14)); // site road
    // skeleton: 5 columns full height + formwork + lintel band
    const colM = std(0xa9b0b4, 0.94);
    for (let i = 0; i < 5; i++) g.add(box(2.6, 24.8, 2.6, colM, 388 + i * 6, 12.4, -30));
    g.add(box(28, 2.2, 2.8, colM, 400, 18.6, -30));
    // scaffolds around columns 2-4
    const pole = std(0x8a6a3a, 0.8, 0.2);
    for (let i = 0; i < 3; i++) {
      const bx = 394 + i * 6;
      for (const [dx, dz] of [[-2.2, -2.2], [2.2, -2.2], [-2.2, 2.2], [2.2, 2.2]]) {
        g.add(box(0.14, 21, 0.14, pole, bx + dx, 10.5, -30 + dz));
      }
      for (const yy of [5, 10, 15, 19.5]) g.add(box(4.8, 0.12, 0.12, pole, bx, yy, -32.2));
      g.add(box(4.6, 0.16, 1.4, std(0xa88a5a, 0.95), bx, 10.1, -32.6));
      g.add(box(4.6, 0.16, 1.4, std(0xa88a5a, 0.95), bx, 15.1, -27.4));
    }
    // crane: mast + jib + cable + weight
    g.add(box(1.6, 27, 1.6, std(0xd2a23c, 0.7, 0.4), 418, 13.5, -36));
    g.add(box(20, 1.1, 1.3, std(0xd2a23c, 0.7, 0.4), 410, 27.2, -36));
    g.add(box(2.4, 2.2, 2.4, std(0x777d82, 0.8), 419.4, 26.4, -36));
    g.add(cyl(0.03, 0.03, 8, std(0x333a40, 0.6), 404, 23, -36));
    g.add(box(1.6, 1.6, 1.6, std(0x9aa2a6, 0.9), 404, 18.4, -36));
    // mixer + pallets + rebar racks + crates
    g.add(cyl(1.1, 1.4, 2.2, std(0x9aa2a6, 0.7, 0.3), 410.5, 1.1, -14));
    g.add(box(0.3, 1.4, 0.3, pole, 410.5, 2.6, -14));
    for (let i = 0; i < 3; i++) g.add(box(2.6, 0.3, 1.8, std(0x8f6f4e, 0.95), 404.5 + i * 0.4, 0.35 + i * 1.1, -11));
    for (let i = 0; i < 8; i++) g.add(cyl(0.05, 0.05, 5, std(0x5f6a72, 0.6, 0.5), 391.5 + (i % 4) * 0.3, 2.5, -12 - Math.floor(i / 4) * 0.5));
    g.add(crateStack(414, -8, 5)); g.add(crateStack(387, -6, 4, 0.6));
    // barrier fence + gate frame down the road (depth 30 D)
    for (let i = 0; i < 10; i++) g.add(box(0.12, 1.3, 0.12, pole, 386 + i * 3, 0.65, 30));
    g.add(box(28, 0.1, 0.1, std(0xd2a23c, 0.8), 400.5, 1.1, 30));
    g.add(box(28, 0.1, 0.1, std(0xd2a23c, 0.8), 400.5, 0.55, 30));
    // practicals: 2 tripod work lamps near base, 2 floodlight masts along the road, crane beacon
    for (const [x, z, ry] of [[396, -22, 0.4], [405, -20, -0.5]]) {
      g.add(box(0.12, 2.6, 0.12, pole, x, 1.3, z));
      g.add(box(0.9, 0.5, 0.4, basic(0xffc887), x, 2.75, z));
      g.add(box(0.5, 0.1, 0.5, pole, x, 0.05, z));
      pointLight(g, 0xffc887, 1.25, 20, x, 2.8, z);
    }
    g.add(lampPost(392, 12, 0xfff1c8, 7)); g.add(lampPost(408, 20, 0xfff1c8, 7));
    const beacon = new T.Mesh(new T.SphereGeometry(0.24, 8, 8), basic(0xff6a55)); beacon.position.set(418, 28.5, -36); g.add(beacon);
    pointLight(g, 0xfff1c8, 0.7, 18, 392, 7, 12);
    rig(g, 0xe8d8b8, 0x6a5a44, 0.8, 0xffd9a0, 1.0, -30, 46, 30, 400, -20, false);
    root.add(g); places.push({ name: 'construction', origin: [400, 0, 0], group: g });
  }

  // ---------------------------------------------------------------- NEIGHBOURS (800,0)
  {
    const g = new T.Group(); g.name = 'place_neighbours';
    g.add(dome(800, 0, '#5a6f84', '#8fa3b2', '#b8c2c4', 'dome_neighbours'));
    g.add(ground(800, 4, 84, std(0xa8b49c, 0.96)));
    // sea
    const seaT = tex(256, 256, (g2) => { g2.fillStyle = '#4a6a80'; g2.fillRect(0, 0, 256, 256);
      g2.strokeStyle = '#5d7d93'; for (let i = 0; i < 14; i++) { g2.beginPath(); g2.moveTo(0, i * 19 + 4); g2.bezierCurveTo(60, i * 19, 180, i * 19 + 9, 256, i * 19 + 2); g2.stroke(); } });
    const sea = new T.Mesh(new T.PlaneGeometry(320, 120), new T.MeshStandardMaterial({ map: seaT, roughness: 0.5, metalness: 0.1 }));
    sea.rotation.x = -Math.PI / 2; sea.position.set(800, -0.12, -86); g.add(sea);
    // three clusters, each: low 16 D wall (z=-26), houses behind, street inland (depth 28 D)
    const wallM = new T.MeshStandardMaterial({ map: tex(256, 256, (g2) => {
      g2.fillStyle = '#8f9296'; g2.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 5; i++) { g2.fillStyle = i % 2 ? '#878a8e' : '#979a9e'; g2.fillRect(0, i * 52, 256, 50); }
      g2.strokeStyle = '#74777b'; g2.lineWidth = 3; for (let i = 0; i <= 5; i++) { g2.beginPath(); g2.moveTo(0, i * 52); g2.lineTo(256, i * 52); g2.stroke(); }
    }), roughness: 0.95 });
    const clusters = [786, 800, 815];
    clusters.forEach((cx, k) => {
      g.add(box(17, 16, 3.2, wallM, cx, 8, -26));
      g.add(box(17.6, 0.5, 3.8, std(0xa4a7ab, 0.9), cx, 16.2, -26));
      const rows = [[cx - 5, -14, 0.15], [cx + 5.5, -14.2, -0.1], [cx - 4.5, -5, 0.1], [cx + 5, -5.2, -0.12], [cx, -21, 0.05]];
      rows.forEach((p, i) => g.add(house(p[0], p[1], 4 + (i % 2), 3.8, 3.2 + (i % 3) * 0.5, [0xc9b18e, 0xbda87e, 0xd2bc98][(i + k) % 3], 0x6f5a3c, p[2], (i + k) % 2 === 0)));
      // street inland from the wall: planks + lamps (practicals along depth)
      g.add(box(2.6, 0.05, 26, std(0x9c8a68, 0.96), cx + 2, 0.03, -12));
      g.add(lampPost(cx - 3.4, -10, 0xffdfae, 5.2)); g.add(lampPost(cx + 5.8, -2, 0xffdfae, 5.2));
      pointLight(g, 0xffdfae, 0.85, 14, cx - 3.4, 5.4, -10);
    });
    g.add(palm(790, 6, 5.4)); g.add(palm(809, 9, 6.2)); g.add(palm(820, 2, 5));
    rig(g, 0x9fb2c2, 0x4c565e, 0.75, 0xcfd8dd, 0.75, -40, 50, 30, 800, -14, false);
    root.add(g); places.push({ name: 'neighbours', origin: [800, 0, 0], group: g });
  }

  // ---------------------------------------------------------------- ROCK (1200,0)
  {
    const g = new T.Group(); g.name = 'place_rock';
    g.add(dome(1200, 0, '#c9a878', '#e2c290', '#f0d8a8', 'dome_rock'));
    // hilltop platform + lower plateau far below (the remembered village)
    g.add(ground(1200, 4, 70, std(0xc2a26a, 0.96)));
    g.add(ground(1200, -52, 46, std(0x9a8a5e, 0.96), -9));
    // path winding off the hill (depth 25 D+)
    g.add(box(2.4, 0.05, 9, std(0xa8905e, 0.95), 1200.5, 0.02, 6.5));
    g.add(box(2.2, 0.05, 9, std(0xa8905e, 0.95), 1201.5, 0.02, 15));
    g.add(box(2.2, 0.05, 8, std(0xa8905e, 0.95), 1202.5, 0.02, 23.5));
    // THE ROCK with the carved tsunami mark (mark at eye height, lighter chisel band)
    const rockM = std(0x8f8474, 0.97);
    const rk = new T.Mesh(new T.DodecahedronGeometry(2.6, 0), rockM); rk.position.set(1200.4, 1.5, -0.6); rk.scale.set(1.25, 1.0, 0.9); g.add(rk);
    const rk2 = new T.Mesh(new T.DodecahedronGeometry(1.7, 0), rockM); rk2.position.set(1202.2, 0.9, 0.4); g.add(rk2);
    g.add(box(2.6, 0.09, 0.14, std(0x4a4438, 0.9), 1199.6, 2.25, 0.72));      // the carved groove
    g.add(box(2.6, 0.03, 0.06, std(0xd8c8a0, 0.7), 1199.6, 2.32, 0.78));      // chisel highlight
    g.add(box(1.8, 0.06, 0.1, std(0x4a4438, 0.9), 1199.9, 1.5, 0.78));        // older mark below
    g.add(box(1.6, 0.05, 0.1, std(0x4a4438, 0.9), 1200.1, 1.05, 0.8));        // older still
    // torch by the path (practical)
    g.add(cyl(0.07, 0.09, 2.4, std(0x5f4630, 0.9), 1197.6, 1.2, 2.6));
    const flame = new T.Mesh(new T.SphereGeometry(0.28, 8, 8), basic(0xffb050)); flame.position.set(1197.6, 2.62, 2.6); g.add(flame);
    pointLight(g, 0xffa040, 1.1, 12, 1197.6, 2.8, 2.6);
    // distant mini village on the lower plateau, windows lit (practicals along the depth)
    for (let i = 0; i < 9; i++) {
      const hx = 1191 + (i % 5) * 4.4, hz = -44 - Math.floor(i / 5) * 8 - (i % 3) * 2;
      const hh = 2.2 + (i % 3) * 0.5;
      g.add(box(2.4, hh, 2.2, std([0xb9a075, 0xa89468, 0xc4ad80][i % 3], 0.95), hx, -9 + hh / 2, hz));
      const mr = new T.Mesh(new T.ConeGeometry(1.7, 1.1, 4), std(0x6f5138, 0.95)); mr.position.set(hx, -9 + hh + 0.55, hz); g.add(mr);
      if (i % 2 === 0) g.add(glowWin(hx + 0.7, -9 + hh * 0.6, hz + 1.12, 0.5, 0.5, 0, 0xffcf8a));
    }
    // remembered sea beyond
    const seaR = new T.Mesh(new T.PlaneGeometry(200, 60), std(0x6a7a78, 0.6));
    seaR.rotation.x = -Math.PI / 2; seaR.position.set(1200, -9.1, -95); g.add(seaR);
    g.add(sunDisc(1200, 13, -150, 7, 0xffd08a));
    pointLight(g, 0xffcf8a, 0.8, 30, 1196, 3, -30);
    rig(g, 0xf0d8a8, 0x8a7450, 0.9, 0xffc078, 1.05, 60, 26, -80, 1200, -10, true);
    root.add(g); places.push({ name: 'rock', origin: [1200, 0, 0], group: g });
  }

  // ---------------------------------------------------------------- ROOM (1600,0)
  {
    const g = new T.Group(); g.name = 'place_room';
    g.add(dome(1600, 0, '#3a2f22', '#5a4630', '#7a5c3c', 'dome_room'));
    g.add(ground(1600, 0, 40, std(0xa8825a, 0.9)));
    g.add(box(20, 0.14, 26, std(0xb5906a, 0.88), 1600, 0.08, -6));
    // marks wall (z=-6, inner face -5.9) with the pencil height column baked in
    const wallT = tex(512, 512, (g2) => {
      g2.fillStyle = '#e2cf9e'; g2.fillRect(0, 0, 512, 512);
      g2.fillStyle = '#d8c48f'; for (let i = 0; i < 30; i++) g2.fillRect((i * 71) % 500, (i * 37) % 480, 40, 26);
      g2.strokeStyle = 'rgba(90,70,50,0.55)'; g2.lineWidth = 3;
      for (let i = 0; i < 6; i++) { const y = 400 - i * 42; g2.beginPath(); g2.moveTo(120, y); g2.lineTo(190, y); g2.stroke();
        g2.beginPath(); g2.arc(150 + i * 6, y - 12, 3, 0, 7); g2.stroke(); }
      g2.strokeStyle = 'rgba(90,70,50,0.35)'; g2.lineWidth = 2;
      g2.strokeRect(8, 8, 496, 496);
    });
    g.add(box(14, 8, 0.24, new T.MeshStandardMaterial({ map: wallT, roughness: 0.92 }), 1600, 4, -6.12));
    // doorway to the deep hall (depth 26 D) in the +x wall
    g.add(box(0.24, 8, 22, std(0xd8c8a4, 0.92), 1611.9, 4, -4));
    g.add(box(6.5, 2.6, 0.24, std(0xd8c8a4, 0.92), 1608.4, 6.7, -5.9)); // lintel over the opening
    g.add(box(26, 0.12, 12, std(0xa8825a, 0.9), 1625, 0.06, -4)); // hall floor
    g.add(box(0.24, 6.5, 11, std(0xd0bf98, 0.92), 1637.9, 3.25, -4)); // hall end wall
    for (let i = 0; i < 2; i++) {
      g.add(box(0.1, 2.1, 1.1, std(0x6b5138, 0.9), 1622 + i * 9, 1.05, 1.9));
      g.add(glowWin(1622 + i * 9, 2.2, 2.2, 0.9, 1.1, 0, 0xffcf8a));
    }
    g.add(lampPost(1636.4, -4, 0xffe2b0, 4.2)); // hall far lamp (practical at depth)
    pointLight(g, 0xffe2b0, 0.9, 16, 1636.4, 4.4, -4);
    // window with warm shaft + hanging lamp (practicals)
    g.add(box(2.6, 3.2, 0.16, std(0x8f7a52, 0.9), 1595.6, 4.4, -6.05));
    const shaft = new T.Mesh(new T.PlaneGeometry(2.2, 9.5), new T.MeshBasicMaterial({ color: 0xffdfae, transparent: true, opacity: 0.13, depthWrite: false, side: T.DoubleSide }));
    shaft.position.set(1596.4, 3.4, -1.6); shaft.rotation.y = 0.5; shaft.rotation.z = -0.18; g.add(shaft);
    g.add(cyl(0.02, 0.02, 1.6, std(0x3a3328, 0.7), 1601.5, 6.9, 0.5));
    const shade = new T.Mesh(new T.ConeGeometry(0.55, 0.6, 12, 1, true), std(0xd8b878, 0.7, 0.1, 0xffcf8a, 0.55));
    shade.position.set(1601.5, 6.0, 0.5); g.add(shade);
    const bulb = new T.Mesh(new T.SphereGeometry(0.16, 8, 8), basic(0xffe8b8)); bulb.position.set(1601.5, 5.85, 0.5); g.add(bulb);
    pointLight(g, 0xffd9a0, 1.25, 24, 1601.5, 5.7, 0.5);
    pointLight(g, 0xffcf8a, 0.6, 14, 1596.4, 4.0, -3.4);
    // table + stool + wall shelf (modelled detail near the lens)
    g.add(box(2.6, 0.14, 1.6, std(0x8f6f4e, 0.9), 1603.6, 1.5, -1.2));
    for (const [dx, dz] of [[-1.1, -0.6], [1.1, -0.6], [-1.1, 0.6], [1.1, 0.6]]) g.add(box(0.14, 1.5, 0.14, std(0x7a5c3c, 0.9), 1603.6 + dx, 0.75, -1.2 + dz));
    g.add(box(0.8, 0.1, 0.8, std(0x9a7a50, 0.9), 1600.8, 0.85, -4.4));
    for (const [dx, dz] of [[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]]) g.add(box(0.1, 0.8, 0.1, std(0x7a5c3c, 0.9), 1600.8 + dx, 0.4, -4.4 + dz));
    g.add(box(2.2, 0.08, 0.5, std(0x8f6f4e, 0.9), 1604.5, 4.4, -5.82));
    g.add(box(0.3, 0.4, 0.3, std(0x7a5c3c, 0.9), 1604.2, 4.65, -5.82));
    rig(g, 0xffe2b8, 0x6a5138, 0.85, 0xffd9a0, 0.55, 1596, 7, 4, 1601, -4, false);
    root.add(g); places.push({ name: 'room', origin: [1600, 0, 0], group: g });
  }

  // ---------------------------------------------------------------- GRAVE (2000,0)
  {
    const g = new T.Group(); g.name = 'place_grave';
    g.add(dome(2000, 0, '#7a8fb8', '#e8b88a', '#f2d9a8', 'dome_grave'));
    g.add(ground(2000, 0, 60, std(0x8fa06a, 0.95)));
    // balustrade at the view edge + path down (depth)
    g.add(ground(2000, -55, 42, std(0x7a8a58, 0.96), -11));
    for (let i = 0; i < 11; i++) g.add(box(0.8, 0.9, 0.4, std(0xb8b2a4, 0.9), 1995 + i * 1.1, 0.45, -9.4));
    g.add(box(11.5, 0.16, 0.5, std(0xc4bfae, 0.9), 2000.5, 0.95, -9.4));
    g.add(box(2.2, 0.05, 10, std(0x9a8a5e, 0.95), 2000.5, 0.02, 2.5));
    g.add(box(2.2, 0.05, 12, std(0x9a8a5e, 0.95), 2001.5, 0.02, 12));
    // three neighbour stones (engraved lines, no invented names)
    for (const [sx, sz, h] of [[1995.5, -1.5, 1.7], [2005, -2, 1.9], [1997.5, -4, 1.5]]) {
      g.add(box(1.0, 0.24, 0.7, std(0xa8a294, 0.92), sx, 0.12, sz));
      g.add(box(0.72, h, 0.2, std(0xbdb7a8, 0.9), sx, 0.24 + h / 2, sz));
      const cap = new T.Mesh(new T.CylinderGeometry(0.36, 0.36, 0.2, 12, 1, false, 0, Math.PI), std(0xbdb7a8, 0.9)); cap.position.set(sx, 0.24 + h, sz); g.add(cap);
      g.add(box(0.4, 0.03, 0.03, std(0x6a6458, 0.9), sx, 0.24 + h * 0.62, sz + 0.11));
    }
    // THE village far below: mini houses + THE WALL (24.8 D) with its gate (depth 70 D+)
    for (let i = 0; i < 12; i++) {
      const hx = 1988 + (i % 6) * 4.2, hz = -52 - Math.floor(i / 6) * 9 - (i % 3) * 2.4;
      const hh = 2.6 + (i % 3) * 0.6;
      g.add(box(2.6, hh, 2.4, std([0xc9b18e, 0xbda87e, 0xd2bc98][i % 3], 0.95), hx, -11 + hh / 2, hz));
      const mr = new T.Mesh(new T.ConeGeometry(1.8, 1.2, 4), std([0x8a5a3a, 0x7a4f34][i % 2], 0.95)); mr.position.set(hx, -11 + hh + 0.6, hz); g.add(mr);
      if (i % 2 === 0) g.add(glowWin(hx + 0.8, -11 + hh * 0.6, hz + 1.22, 0.55, 0.55, 0, 0xffcf8a));
    }
    const wallMiniM = std(0x9aa2a6, 0.94);
    g.add(box(30, 24.8, 3.4, wallMiniM, 2004, 1.4, -74));
    g.add(box(31, 0.6, 4, std(0xc2c8ca, 0.9), 2004, 26.5, -74));
    g.add(box(3.4, 8, 3.6, std(0x5f6a72, 0.7, 0.35), 2004, 4, -72)); // gate read at distance
    pointLight(g, 0xffcf8a, 0.7, 26, 2004, 8, -70);
    // grave lanterns flanking the path (practicals)
    for (const [lx, lz] of [[1998.4, 4.5], [2002.6, 6.5]]) {
      g.add(cyl(0.08, 0.12, 2.2, std(0x4f4638, 0.9), lx, 1.1, lz));
      g.add(box(0.42, 0.5, 0.42, std(0x4f4638, 0.85), lx, 2.45, lz));
      const gl = new T.Mesh(new T.SphereGeometry(0.18, 8, 8), basic(0xffd9a0)); gl.position.set(lx, 2.45, lz); g.add(gl);
      pointLight(g, 0xffd9a0, 0.95, 12, lx, 2.5, lz);
    }
    g.add(sunDisc(2000, 9, -160, 8, 0xffe0a8));
    rig(g, 0xf2d9a8, 0x5a6a52, 0.9, 0xffd9a0, 1.1, 60, 30, -60, 2000, -8, true);
    root.add(g); places.push({ name: 'grave', origin: [2000, 0, 0], group: g });
  }

  scene.add(root);
  // Working global haze: places sit 400 D apart, so neighbours are fully fogged out;
  // each dome's own colour mood carries the sky. Per-place fog hooks are an engine gap (lessons).
  scene.fog = new T.FogExp2(0xc4c2b4, 0.0105);
  if (T && T.Color && scene.background === null) { /* domes carry the sky; nothing to set */ }
  return { places: places.map((p) => ({ name: p.name, origin: p.origin })), points, rootName: root.name };
}
