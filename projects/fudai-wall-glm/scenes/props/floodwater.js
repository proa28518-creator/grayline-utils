import * as THREE from 'three';

// scenes/props/floodwater.js — the flood slab that swallows the neighbours' streets.
// State: { fade: 0..1 } — rises 0.2 → 2 D and turns translucent-possible; appears via fetch on a cut.
function cnv(T, w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c); t.anisotropy = 4; return t;
}

export function build(opts) {
  const T = THREE; // imported by this file — the host passes no objects in (repair round 1)
  const o = opts || {};
  const inn = (typeof o.fade === 'number') ? Math.max(0, Math.min(1, o.fade)) : 1;
  const g = new T.Group();
  const h = 0.2 + inn * 1.8;
  const waterM = new T.MeshStandardMaterial({
    map: cnv(T, 256, 256, (g2) => {
      g2.fillStyle = '#3f5a68'; g2.fillRect(0, 0, 256, 256);
      g2.strokeStyle = 'rgba(180,210,220,0.35)'; g2.lineWidth = 3;
      for (let i = 0; i < 10; i++) { g2.beginPath(); g2.moveTo(0, i * 26 + 6); g2.bezierCurveTo(70, i * 26 - 4, 180, i * 26 + 12, 256, i * 26 + 2); g2.stroke(); }
      g2.fillStyle = 'rgba(140,170,180,0.12)'; g2.fillRect(0, 0, 256, 256);
    }),
    transparent: true, opacity: 0.88, roughness: 0.3, metalness: 0.15,
  });
  const slab = new T.Mesh(new T.BoxGeometry(64, 1, 34), waterM);
  slab.scale.y = h; slab.position.set(0, h / 2, 0); g.add(slab);
  // foam edge strips along the street sides (fixed offsets)
  const foamM = new T.MeshStandardMaterial({ color: 0xe8f2f4, roughness: 0.5, transparent: true, opacity: 0.85 });
  for (let i = 0; i < 9; i++) {
    const s = new T.Mesh(new T.SphereGeometry(0.5 + (i % 3) * 0.2, 8, 8), foamM);
    s.position.set(-28 + i * 6.5, h * 0.92, -15 + (i % 2) * 30);
    s.scale.y = 0.4; g.add(s);
    const s2 = new T.Mesh(new T.SphereGeometry(0.45 + (i % 2) * 0.22, 8, 8), foamM);
    s2.position.set(-24 + i * 6.2, h * 0.92, 16 - (i % 3) * 2);
    s2.scale.y = 0.4; g.add(s2);
  }
  // floating debris (a crate, a plank) — deterministic placement
  const crate = new T.Mesh(new T.BoxGeometry(0.7, 0.7, 0.7), new T.MeshStandardMaterial({ color: 0xa87848, roughness: 0.95 }));
  crate.position.set(6, h + 0.1, 2); crate.rotation.y = 0.7; g.add(crate);
  const plank = new T.Mesh(new T.BoxGeometry(2.2, 0.12, 0.4), new T.MeshStandardMaterial({ color: 0x9a7a4e, roughness: 0.95 }));
  plank.position.set(-8, h + 0.08, -4); plank.rotation.y = -0.4; g.add(plank);
  return g;
}
