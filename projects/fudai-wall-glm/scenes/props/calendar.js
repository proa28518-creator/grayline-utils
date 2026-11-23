import * as THREE from 'three';

// scenes/props/calendar.js — the site calendar that flips the years.
// Print: big year digits, month grid, red circle. State: { flip: pages turned }, { year: '12'|'14' }.
// Motion purely via opts; origin at the stand base.
function cnv(T, w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c); t.anisotropy = 4; return t;
}

export function build(opts) {
  const T = THREE; // imported by this file — the host passes no objects in (repair round 1)
  const o = opts || {};
  const flip = (typeof o.flip === 'number') ? o.flip : 0;
  const year = o.year || '12';
  const g = new T.Group();
  const wood = new T.MeshStandardMaterial({ color: 0x8a6a44, roughness: 0.9 });
  // stand
  for (const [dx, dz] of [[-0.5, 0.3], [0.5, 0.3], [-0.5, -0.3], [0.5, -0.3]]) {
    const leg = new T.Mesh(new T.BoxGeometry(0.1, 1.7, 0.1), wood);
    leg.position.set(dx, 0.85, dz); leg.rotation.x = dz > 0 ? -0.12 : 0.12; g.add(leg);
  }
  const tray = new T.Mesh(new T.BoxGeometry(1.9, 0.1, 1.0), wood); tray.position.set(0, 1.72, 0); g.add(tray);
  // body
  const faceT = cnv(T, 256, 320, (g2) => {
    g2.fillStyle = '#efe8d8'; g2.fillRect(0, 0, 256, 320);
    g2.fillStyle = '#c8442e'; g2.fillRect(0, 0, 256, 84);
    g2.fillStyle = '#fff4e0'; g2.font = 'bold 64px sans-serif'; g2.textAlign = 'center'; g2.textBaseline = 'middle';
    g2.fillText(year, 128, 46);
    g2.strokeStyle = '#8a7a5c'; g2.lineWidth = 2;
    for (let r = 0; r < 5; r++) { g2.beginPath(); g2.moveTo(18, 108 + r * 42); g2.lineTo(238, 108 + r * 42); g2.stroke(); }
    for (let cq = 0; cq < 6; cq++) { g2.beginPath(); g2.moveTo(18 + cq * 44, 108); g2.lineTo(18 + cq * 44, 276); g2.stroke(); }
    g2.fillStyle = 'rgba(70,60,44,0.8)';
    for (let i = 0; i < 24; i++) g2.fillRect(30 + (i % 6) * 44, 116 + Math.floor(i / 6) * 42, 4, 4);
    g2.strokeStyle = '#c8442e'; g2.lineWidth = 5;
    g2.beginPath(); g2.arc(118, 156, 17, 0, 7); g2.stroke();
  });
  const bodyM = [new T.MeshStandardMaterial({ color: 0x8a7a5c, roughness: 0.9 }),
    new T.MeshStandardMaterial({ color: 0x8a7a5c, roughness: 0.9 }),
    new T.MeshStandardMaterial({ map: faceT, roughness: 0.85 }),
    new T.MeshStandardMaterial({ color: 0x7a6c50, roughness: 0.9 }),
    new T.MeshStandardMaterial({ color: 0x8a7a5c, roughness: 0.9 }),
    new T.MeshStandardMaterial({ color: 0x8a7a5c, roughness: 0.9 })];
  const body = new T.Mesh(new T.BoxGeometry(1.7, 2.3, 0.2), bodyM);
  body.position.set(0, 2.95, 0); g.add(body);
  // spiral
  const spiral = new T.Mesh(new T.TorusGeometry(0.12, 0.035, 6, 12), new T.MeshStandardMaterial({ color: 0x444a52, roughness: 0.4, metalness: 0.6 }));
  spiral.position.set(0, 4.18, 0); g.add(spiral);
  // fanned sheets — rotation deterministic in flip
  const sheetM = new T.MeshStandardMaterial({ color: 0xefe8d8, roughness: 0.92, side: T.DoubleSide, transparent: true, opacity: 0.95 });
  for (let i = 0; i < 6; i++) {
    const s = new T.Mesh(new T.PlaneGeometry(1.6, 2.2), sheetM);
    s.position.set(0, 3.0, -0.16 - i * 0.035);
    const ph = Math.min(1, Math.max(0, flip - i * 0.16));
    s.rotation.x = -ph * 1.35 - 0.08;
    s.rotation.y = Math.sin(i * 2.1 + ph * 2.6) * 0.05 * ph;
    g.add(s);
  }
  return g;
}
