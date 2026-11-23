// scenes/props/money.js — the cartoon money stacks with the floating "$30M" tag.
// Print: banded note stacks, coin piles, glowing tag. Origin at the pallet centre.
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
  const noteM = new T.MeshStandardMaterial({
    map: cnv(T, 128, 64, (g2) => {
      g2.fillStyle = '#4f7a4a'; g2.fillRect(0, 0, 128, 64);
      g2.strokeStyle = '#3a5f38'; g2.lineWidth = 4; g2.strokeRect(4, 4, 120, 56);
      g2.fillStyle = '#dcead2'; g2.font = 'bold 26px sans-serif'; g2.textAlign = 'center'; g2.textBaseline = 'middle';
      g2.fillText('100', 64, 32);
      g2.fillStyle = '#3a5f38'; g2.beginPath(); g2.arc(24, 32, 10, 0, 7); g2.fill();
      g2.beginPath(); g2.arc(104, 32, 10, 0, 7); g2.fill();
    }), roughness: 0.9,
  });
  const bandM = new T.MeshStandardMaterial({ color: 0xd8c89a, roughness: 0.9 });
  const stackAt = (x, z, n, ry) => {
    for (let i = 0; i < n; i++) {
      const s = new T.Mesh(new T.BoxGeometry(1.25, 0.2, 0.75), noteM);
      s.position.set(x, 0.3 + i * 0.21, z); s.rotation.y = ry + (i % 3) * 0.06; g.add(s);
      const b = new T.Mesh(new T.BoxGeometry(1.29, 0.22, 0.22), bandM);
      b.position.set(x, 0.3 + i * 0.21, z); b.rotation.y = ry + (i % 3) * 0.06; g.add(b);
    }
    const top = new T.Mesh(new T.BoxGeometry(1.28, 0.06, 0.78), bandM);
    top.position.set(x, 0.3 + n * 0.21 + 0.03, z); top.rotation.y = ry; g.add(top);
  };
  stackAt(-1.1, 0.2, 6, 0.1); stackAt(0.9, -0.3, 8, -0.12); stackAt(0.1, 1.0, 5, 0.2);
  // coin pile
  const coinM = new T.MeshStandardMaterial({ color: 0xd8a83a, roughness: 0.35, metalness: 0.75 });
  for (let i = 0; i < 7; i++) {
    const c = new T.Mesh(new T.CylinderGeometry(0.22, 0.22, 0.07, 12), coinM);
    c.position.set(-2.0 + (i % 3) * 0.4, 0.62 + Math.floor(i / 3) * 0.08, -0.8 + (i % 2) * 0.3);
    c.rotation.y = i * 0.5; g.add(c);
  }
  // pallet
  const pal = new T.Mesh(new T.BoxGeometry(3.4, 0.24, 2.2), new T.MeshStandardMaterial({ color: 0x8f6f4e, roughness: 0.95 }));
  pal.position.y = 0.12; g.add(pal);
  // floating tag "$30M"
  const tag = new T.Mesh(new T.PlaneGeometry(2.3, 1.05), new T.MeshBasicMaterial({
    map: cnv(T, 256, 112, (g2) => {
      g2.fillStyle = 'rgba(40,30,10,0.82)'; g2.fillRect(0, 0, 256, 112);
      g2.strokeStyle = '#ffd97a'; g2.lineWidth = 5; g2.strokeRect(5, 5, 246, 102);
      g2.fillStyle = '#ffe9a8'; g2.font = 'bold 62px sans-serif'; g2.textAlign = 'center'; g2.textBaseline = 'middle';
      g2.fillText('$30M', 128, 60);
    }), transparent: true, depthWrite: false, side: T.DoubleSide,
  }));
  tag.position.set(0.4, 2.9, 0.2); tag.rotation.y = 0.18; g.add(tag);
  const tagBack = new T.Mesh(new T.PlaneGeometry(2.3, 1.05), new T.MeshBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0.16, side: T.DoubleSide, depthWrite: false }));
  tagBack.position.copy(tag.position); tagBack.rotation.copy(tag.rotation); g.add(tagBack);
  return g;
}
