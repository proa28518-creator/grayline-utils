// scenes/drybed.js lives in scenes/props/drybed.js — the pulled-back sea: wet sand flat,
// stranded tilted boat, exposed rocks, ripple ridges. Appears whole (fetch on a cut).
function pickT(opts, THREE) {
  if (opts && opts.Group) return opts;
  if (THREE && THREE.Group) return THREE;
  if (typeof THREE !== 'undefined') return THREE;
  return null;
}
function cnv(T, w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c); t.anisotropy = 4; return t;
}

export function build(opts, THREE) {
  const T = pickT(opts, THREE);
  const g = new T.Group();
  const sand = new T.MeshStandardMaterial({
    map: cnv(T, 512, 512, (g2) => {
      g2.fillStyle = '#c8b088'; g2.fillRect(0, 0, 512, 512);
      g2.strokeStyle = 'rgba(150,124,88,0.6)'; g2.lineWidth = 4;
      for (let i = 0; i < 16; i++) { g2.beginPath(); g2.moveTo(0, i * 32 + 8); g2.bezierCurveTo(120, i * 32 - 4, 300, i * 32 + 18, 512, i * 32 + 2); g2.stroke(); }
      g2.fillStyle = 'rgba(110,92,62,0.5)';
      for (let i = 0; i < 40; i++) g2.fillRect((i * 67) % 500, (i * 91) % 490, 10, 6);
      g2.fillStyle = 'rgba(70,110,110,0.18)'; // wet patches
      for (let i = 0; i < 7; i++) { g2.beginPath(); g2.ellipse((i * 83) % 460 + 26, (i * 121) % 460 + 26, 60, 34, i, 0, 7); g2.fill(); }
    }), roughness: 0.98,
  });
  const flat = new T.Mesh(new T.PlaneGeometry(52, 24), sand);
  flat.rotation.x = -Math.PI / 2; flat.position.y = 0.1; g.add(flat);
  // stranded boat, tilted, hull half-buried
  const hull = new T.Mesh(new T.SphereGeometry(2.4, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshStandardMaterial({ color: 0x8a5a38, roughness: 0.9 }));
  hull.scale.set(1, 0.55, 0.42); hull.rotation.x = Math.PI; hull.rotation.z = 0.28;
  hull.position.set(-9, 0.75, 2); g.add(hull);
  const deck = new T.Mesh(new T.BoxGeometry(3.8, 0.14, 1.6), new T.MeshStandardMaterial({ color: 0xb98a55, roughness: 0.92 }));
  deck.position.set(-9, 1.1, 2); deck.rotation.z = 0.28; g.add(deck);
  const mast = new T.Mesh(new T.BoxGeometry(0.14, 1.6, 0.14), new T.MeshStandardMaterial({ color: 0x6b5138, roughness: 0.9 }));
  mast.position.set(-10.2, 1.9, 2); mast.rotation.z = 0.5; g.add(mast);
  // exposed rocks + tidal pools
  const rockM = new T.MeshStandardMaterial({ color: 0x7e7668, roughness: 0.97 });
  for (const [rx, rz, s] of [[4, -3, 1.3], [7, 4, 0.9], [-3, -6, 1.1], [12, -1, 0.7], [-14, -2, 1.0]]) {
    const r = new T.Mesh(new T.DodecahedronGeometry(s, 0), rockM);
    r.position.set(rx, s * 0.5, rz); g.add(r);
  }
  const poolM = new T.MeshStandardMaterial({ color: 0x5a7a80, roughness: 0.25, metalness: 0.2, transparent: true, opacity: 0.75 });
  for (const [px, pz, w, d] of [[2, 6, 3.4, 2.0], [-6, 7, 2.6, 1.6], [9, -6, 3.0, 1.8]]) {
    const p = new T.Mesh(new T.CircleGeometry(1, 16), poolM);
    p.rotation.x = -Math.PI / 2; p.scale.set(w / 2, d / 2, 1); p.position.set(px, 0.12, pz); g.add(p);
  }
  // seaweed tangles
  const weedM = new T.MeshStandardMaterial({ color: 0x4f6a44, roughness: 0.95 });
  for (let i = 0; i < 8; i++) {
    const w = new T.Mesh(new T.TorusGeometry(0.4 + (i % 3) * 0.14, 0.06, 5, 10), weedM);
    w.rotation.x = Math.PI / 2 + Math.sin(i * 2.4) * 0.4;
    w.position.set(-12 + (i * 3.4) % 26, 0.16, -8 + (i * 2.3) % 16);
    g.add(w);
  }
  return g;
}
