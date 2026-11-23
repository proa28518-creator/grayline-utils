// scenes/props/wallrise.js — the growing concrete body of the gate wall inside the scaffold.
// State: { h } in D (3 → 24.8). Print: lift-line concrete, pour streaks, tie holes.
// Origin at the base centre; the body scales in height so the top edge is always exact.
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
  const o = opts || {};
  const h = Math.max(0.3, Math.min(24.8, (typeof o.h === 'number') ? o.h : 24.8));
  const g = new T.Group();
  const conc = new T.MeshStandardMaterial({
    map: cnv(T, 512, 512, (g2) => {
      g2.fillStyle = '#9aa2a6'; g2.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 8; i++) { g2.fillStyle = i % 2 ? '#949ca0' : '#a0a8ac'; g2.fillRect(0, i * 64, 512, 61); }
      g2.strokeStyle = '#7e868a'; g2.lineWidth = 3;
      for (let i = 0; i <= 8; i++) { g2.beginPath(); g2.moveTo(0, i * 64); g2.lineTo(512, i * 64); g2.stroke(); }
      g2.fillStyle = '#6e767a';
      for (let i = 0; i < 36; i++) { g2.beginPath(); g2.arc((i * 53) % 500 + 6, (i * 97) % 480 + 16, 4, 0, 7); g2.fill(); }
      g2.fillStyle = 'rgba(120,110,95,0.3)';
      for (let i = 0; i < 8; i++) g2.fillRect((i * 71) % 480, 0, 8, 512);
    }), roughness: 0.95,
  });
  const body = new T.Mesh(new T.BoxGeometry(26, 1, 3.4), conc);
  body.scale.y = h;
  body.position.set(0, h / 2, 0);
  // keep the UV density sane while scaling: texture repeats with height via a cloned look
  g.add(body);
  // pour lip at the working top edge (the last metre reads as fresh concrete)
  const lip = new T.Mesh(new T.BoxGeometry(26.2, 0.28, 3.6), new T.MeshStandardMaterial({ color: 0xb4bcc0, roughness: 0.8 }));
  lip.position.set(0, h - 0.14, 0); g.add(lip);
  // form-tie studs on the face
  for (let r = 0; r < Math.max(1, Math.floor(h / 3.2)); r++) {
    for (let cq = 0; cq < 6; cq++) {
      const s = new T.Mesh(new T.CylinderGeometry(0.09, 0.09, 0.12, 8), new T.MeshStandardMaterial({ color: 0x6e767a, roughness: 0.7, metalness: 0.4 }));
      s.rotation.x = Math.PI / 2; s.position.set(-11 + cq * 4.4, 1.6 + r * 3.2, 1.72);
      if (s.position.y < h - 0.3) g.add(s);
    }
  }
  return g;
}
