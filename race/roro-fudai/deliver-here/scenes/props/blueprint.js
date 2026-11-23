// Seat: Roro / Muse (lane 4) — Fudai Wall Build pass, 2026-11-23.
// Method source: cartoon-shorts tree only. «Production and rules» not touched.
// Assumption (film.md does not say how THREE reaches build): the engine passes
// THREE via opts.THREE, or exposes it as globalThis.THREE. build(opts) is a pure
// function of opts; state is re-built by the engine from opts over time.
// Units: D (1 D = 1 head; D = metres x 1.6). Origin: centre of the sheet.
// The gate blueprint + the ruler the mayor fixes at 15.5M (line 8).
// opts: { open: 0..1 } — 0 = ruler slid down and loose, 1 = ruler pinned straight
// across the sheet at the 15.5M line.

function sheetTexture(THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');
  // blueprint blue
  ctx.fillStyle = '#1c4d8f';
  ctx.fillRect(0, 0, 1024, 720);
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.lineWidth = 4;
  // gate elevation: two leaves + arch top
  ctx.strokeRect(300, 140, 424, 420);
  ctx.beginPath();
  ctx.moveTo(300, 140);
  ctx.lineTo(512, 80);
  ctx.lineTo(724, 140);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(512, 140);
  ctx.lineTo(512, 560);
  ctx.stroke();
  // ribs
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(300 + i * 106, 140);
    ctx.lineTo(300 + i * 106, 560);
    ctx.stroke();
  }
  // dimension line with the height — the print that says the words
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(820, 140);
  ctx.lineTo(820, 560);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(800, 160);
  ctx.lineTo(820, 140);
  ctx.lineTo(840, 160);
  ctx.moveTo(800, 540);
  ctx.lineTo(820, 560);
  ctx.lineTo(840, 540);
  ctx.stroke();
  ctx.font = 'bold 64px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('15.5M', 850, 350);
  // title block, bottom right
  ctx.lineWidth = 3;
  ctx.strokeRect(640, 600, 340, 80);
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText('بوابة السور — 15.5M', 660, 640);
  // scale note, bottom left
  ctx.font = '28px sans-serif';
  ctx.fillText('مقياس 1:100', 40, 650);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function rulerTexture(THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#d9a441';
  ctx.fillRect(0, 0, 1024, 96);
  ctx.strokeStyle = '#3a2a12';
  ctx.lineWidth = 4;
  for (let i = 0; i <= 32; i++) {
    const x = 16 + i * 30;
    const len = i % 4 === 0 ? 56 : 30;
    ctx.beginPath();
    ctx.moveTo(x, 96);
    ctx.lineTo(x, 96 - len);
    ctx.stroke();
  }
  // the red line at the 15.5M mark — near the far end
  ctx.strokeStyle = '#c23b2e';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(940, 0);
  ctx.lineTo(940, 96);
  ctx.stroke();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function build(opts = {}) {
  const THREE = opts.THREE || globalThis.THREE;
  const open = opts.open ?? 1; // 0 = ruler loose, 1 = ruler pinned at 15.5M

  const root = new THREE.Group();
  const inner = new THREE.Group();
  root.add(inner);

  const W = 3.4;
  const H = 2.4;

  // the sheet
  const sheet = new THREE.Mesh(
    new THREE.PlaneGeometry(W, H),
    new THREE.MeshBasicMaterial({ map: sheetTexture(THREE) })
  );
  inner.add(sheet);
  const sheetEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(W, H)),
    new THREE.LineBasicMaterial({ color: 0x111111 })
  );
  inner.add(sheetEdge);

  // the ruler — pinned straight across at the 15.5M line when open = 1,
  // slid down and crooked when open = 0
  const ruler = new THREE.Group();
  const rulerMesh = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.3, 0.06),
    new THREE.MeshStandardMaterial({ map: rulerTexture(THREE), roughness: 0.7 })
  );
  ruler.add(rulerMesh);
  const rulerEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(rulerMesh.geometry, 30),
    new THREE.LineBasicMaterial({ color: 0x111111 })
  );
  ruler.add(rulerEdge);
  ruler.position.set(
    0.15 * (1 - open), // slides right when loose
    0.55 * open - 0.55 * (1 - open), // pinned high at the mark, low when loose
    0.06
  );
  ruler.rotation.z = 0.22 * (1 - open); // crooked when loose, straight when pinned
  inner.add(ruler);

  // a pencil resting on the sheet corner
  const pencil = new THREE.Group();
  const pencilBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.9, 6),
    new THREE.MeshStandardMaterial({ color: 0xf2c200, roughness: 0.6 })
  );
  pencilBody.rotation.z = Math.PI / 2;
  pencil.add(pencilBody);
  const tip = new THREE.Mesh(
    new THREE.ConeGeometry(0.05, 0.18, 6),
    new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.5 })
  );
  tip.rotation.z = -Math.PI / 2;
  tip.position.x = 0.54;
  pencil.add(tip);
  pencil.position.set(-1.3, -0.95, 0.06);
  pencil.rotation.z = 0.5;
  inner.add(pencil);

  root.userData = {
    title: 'Blueprint — gate 15.5M',
    headline: '15.5M',
    open,
    inner,
  };
  return root;
}
