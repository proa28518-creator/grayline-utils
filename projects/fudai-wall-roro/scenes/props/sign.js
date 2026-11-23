// Seat: Roro / Muse (lane 4) — Fudai Wall Build pass, 2026-11-23.
// Method source: cartoon-shorts tree only. «Production and rules» not touched.
// THREE is imported by this file (repair round 2026-11-23, office): the host does
// not pass THREE to props, so the file imports it itself, like Neon's props.
// function of opts; state is re-built by the engine from opts over time.
// Units: D (1 D = 1 head; D = metres x 1.6). Origin: the hanging point at the
// top centre (where the ropes meet the nail) — the sign swings from it.
// The wooden mock sign "أغبى مشروع" (line 10: "والناس سموه أغبى مشروع في البلد").
// opts: { open: 0..1 } — drives the hang angle: 0.5 = hanging straight,
// 0 / 1 = swung to either side (key `open` over time to sway it).

import * as THREE from 'three';

function plankTexture(THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 340;
  const ctx = canvas.getContext('2d');
  // wood planks
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(0, 0, 1024, 340);
  ctx.strokeStyle = '#5e3a17';
  ctx.lineWidth = 6;
  for (let i = 1; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 113);
    ctx.lineTo(1024, i * 113);
    ctx.stroke();
  }
  // grain
  ctx.strokeStyle = '#6e451f';
  ctx.lineWidth = 3;
  for (let i = 0; i < 12; i++) {
    const y = 20 + i * 28;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(300, y + 8, 700, y - 8, 1024, y + 4);
    ctx.stroke();
  }
  // the painted words — the print that says the line
  ctx.font = 'bold 120px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#111111';
  ctx.strokeText('أغبى مشروع', 512, 175);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('أغبى مشروع', 512, 175);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function build(opts = {}) {
  const open = opts.open ?? 0.5; // 0.5 = hanging straight

  const root = new THREE.Group();
  const inner = new THREE.Group();
  root.add(inner);

  // the swing: the whole sign hangs from the origin point
  const swing = new THREE.Group();
  swing.rotation.z = (open - 0.5) * 0.2;
  inner.add(swing);

  // ropes from the hanging point to the plank corners
  const ropeMat = new THREE.MeshStandardMaterial({ color: 0x6b4a1f, roughness: 0.95 });
  [-1, 1].forEach((side) => {
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.1, 6), ropeMat);
    rope.position.set(side * 1.05, -1.05, 0);
    rope.rotation.z = side * 0.45;
    swing.add(rope);
  });

  // the plank — 3 m wide, 1 m tall, hung slightly crooked
  const W = 4.8;
  const H = 1.6;
  const plank = new THREE.Mesh(
    new THREE.BoxGeometry(W, H, 0.15),
    new THREE.MeshStandardMaterial({ map: plankTexture(THREE), roughness: 0.85 })
  );
  plank.position.set(0, -2.1 - H / 2, 0);
  plank.rotation.z = -0.05; // hung a little crooked, as a mock sign would be
  swing.add(plank);
  const plankEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(plank.geometry, 30),
    new THREE.LineBasicMaterial({ color: 0x111111 })
  );
  plankEdge.position.copy(plank.position);
  plankEdge.rotation.z = plank.rotation.z;
  swing.add(plankEdge);

  // the nail the ropes hang from
  const nail = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 8, 6),
    new THREE.MeshStandardMaterial({ color: 0x3a3f42, roughness: 0.4, metalness: 0.8 })
  );
  inner.add(nail);

  root.userData = {
    title: 'Sign — أغبى مشروع',
    headline: 'أغبى مشروع',
    open,
    inner,
  };
  return root;
}
