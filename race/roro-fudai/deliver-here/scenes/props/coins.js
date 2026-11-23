// Seat: Roro / Muse (lane 4) — Fudai Wall Build pass, 2026-11-23.
// Method source: cartoon-shorts tree only. «Production and rules» not touched.
// Assumption (film.md does not say how THREE reaches build): the engine passes
// THREE via opts.THREE, or exposes it as globalThis.THREE. build(opts) is a pure
// function of opts; state is re-built by the engine from opts over time.
// Units: D (1 D = 1 head; D = metres x 1.6). Origin: centre of the handful
// (the grip — the coins are held, then dropped).
// Cartoon coins that fall into the water (line 6: "إنت بترمي فلوسنا في البحر؟").
// opts: { count: 5, open: 0..1 } — 0 = stacked handful, 1 = fanned out.
// Each coin is its own child group (coin_1..coin_N) so film.js can drop them
// one by one with `drop` keys.

function coinFace(THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffd34d';
  ctx.beginPath();
  ctx.arc(128, 128, 126, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#8a6d1a';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(128, 128, 104, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = 'bold 150px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#8a6d1a';
  ctx.fillText('$', 128, 134);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function build(opts = {}) {
  const THREE = opts.THREE || globalThis.THREE;
  const count = opts.count ?? 5;
  const open = opts.open ?? 0; // 0 = stacked handful, 1 = fanned out

  const root = new THREE.Group();
  const inner = new THREE.Group();
  root.add(inner);

  const faceTex = coinFace(THREE);
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.35, metalness: 0.7 });
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xd9a441, roughness: 0.35, metalness: 0.8 });

  for (let i = 0; i < count; i++) {
    const coin = new THREE.Group();
    coin.name = `coin_${i + 1}`;
    const geo = new THREE.CylinderGeometry(0.25, 0.25, 0.06, 24);
    const mesh = new THREE.Mesh(geo, [rimMat, faceMat, faceMat]);
    mesh.rotation.x = Math.PI / 2; // face toward the camera
    coin.add(mesh);
    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.25, 0.25, 0.06, 24), 30),
      new THREE.LineBasicMaterial({ color: 0x111111 })
    );
    edge.rotation.x = Math.PI / 2;
    coin.add(edge);
    // stacked when closed, fanned apart when open
    const spread = open * 0.9;
    coin.position.set(
      (i - (count - 1) / 2) * spread * 0.7,
      (i - (count - 1) / 2) * spread * 0.45,
      (i - (count - 1) / 2) * 0.08
    );
    coin.rotation.z = open * (i - (count - 1) / 2) * 0.35;
    inner.add(coin);
  }

  root.userData = {
    title: 'Coins — the village money',
    headline: '$',
    open,
    count,
    inner,
  };
  return root;
}
