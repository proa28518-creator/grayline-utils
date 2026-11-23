// Seat: Roro / Muse (lane 4) — Fudai Wall Build pass, 2026-11-23.
// Method source: cartoon-shorts tree only. «Production and rules» not touched.
// Assumption (film.md does not say how THREE reaches build): the engine passes
// THREE via opts.THREE, or exposes it as globalThis.THREE. build(opts) is a pure
// function of opts; state is re-built by the engine from opts over time.
// Units: D (1 D = 1 head; D = metres x 1.6). Origin: base centre at the waterline.
// The wave machinery the set needs: the 15 m water wall (24 D tall, ~40 D wide)
// with its foam crest and spray. Bible lines 15, 16, 21, 22.
// opts: { open: 0..1 } — 0 = flat sea (a low swell), 1 = the full 24 D wall.
// The glowing "15M" measure line is a separate measure.js prop placed alongside.

export function build(opts = {}) {
  const THREE = opts.THREE || globalThis.THREE;
  const open = opts.open ?? 1; // 0 = flat sea, 1 = full wave wall

  const root = new THREE.Group();
  const inner = new THREE.Group();
  root.add(inner);

  const H = 24; // 15 m
  const W = 40;
  const rise = 0.08 + 0.92 * open; // the wall grows with `open`

  const wallGroup = new THREE.Group();
  wallGroup.scale.y = rise;
  inner.add(wallGroup);

  const water = new THREE.MeshStandardMaterial({
    color: 0x123a5c, roughness: 0.35, metalness: 0.1,
    transparent: true, opacity: 0.92,
  });
  const waterDeep = new THREE.MeshStandardMaterial({
    color: 0x0d2c48, roughness: 0.4, metalness: 0.1,
    transparent: true, opacity: 0.95,
  });
  const foamMat = new THREE.MeshStandardMaterial({ color: 0xf4fbff, roughness: 0.9 });

  // the wall itself: stacked slabs, narrower toward the top — a stylised
  // cartoon water wall with a curling crest
  const slabs = 6;
  for (let i = 0; i < slabs; i++) {
    const f = i / slabs;
    const w = W * (1 - f * 0.28);
    const slab = new THREE.Mesh(new THREE.BoxGeometry(w, H / slabs + 0.4, 5 - f * 1.5), i % 2 ? water : waterDeep);
    slab.position.set(0, (H * (i + 0.5)) / slabs, -f * 1.2);
    wallGroup.add(slab);
    wallGroup.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(slab.geometry, 30),
      new THREE.LineBasicMaterial({ color: 0x0a2233 })
    ));
  }

  // the foam crest: a row of white puffs along the top edge + a curl
  const crest = new THREE.Group();
  crest.position.y = H;
  for (let i = 0; i < 11; i++) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(1.1 + (i % 3) * 0.35, 10, 8), foamMat);
    puff.position.set(-W / 2 + 1.5 + i * (W - 3) / 10, (i % 2) * 0.5, 0.4);
    puff.scale.y = 0.75;
    crest.add(puff);
  }
  // the curling lip at the front
  const lip = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.9, 10, 18, Math.PI), foamMat);
  lip.position.set(W / 2 - 3, 0.4, 1.2);
  lip.rotation.z = Math.PI;
  crest.add(lip);
  crest.scale.y = rise;
  inner.add(crest);

  // spray at the base — small white puffs, denser as the wave rises
  const sprayCount = Math.round(4 + 10 * open);
  for (let i = 0; i < sprayCount; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.35 + (i % 3) * 0.2, 8, 6), foamMat);
    s.position.set(-W / 2 + 2 + ((i * 37) % 36), 0.4 + (i % 4) * 0.5, 2.5 + (i % 3));
    s.scale.y = 0.7;
    inner.add(s);
  }

  root.userData = {
    title: 'Wave — 15 m',
    headline: '15M',
    open,
    inner,
  };
  return root;
}
