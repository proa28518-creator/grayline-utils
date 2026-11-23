// scenes/props/gravestone.js — the mayor's stone: rounded top, engraved name plate,
// a carved wave-and-wall relief, flowers cup, moss. Origin at the base centre.
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
  const stone = new T.MeshStandardMaterial({ map: cnv(T, 256, 256, (g2) => {
    g2.fillStyle = '#a8a49a'; g2.fillRect(0, 0, 256, 256);
    g2.fillStyle = '#9e9a90'; for (let i = 0; i < 26; i++) g2.fillRect((i * 61) % 240, (i * 37) % 240, 34, 22);
    g2.fillStyle = 'rgba(96,108,84,0.28)'; g2.fillRect(0, 190, 256, 66);
    g2.fillStyle = 'rgba(120,116,108,0.35)';
    for (let i = 0; i < 14; i++) g2.fillRect((i * 43) % 230, 20 + (i * 71) % 210, 18, 10);
  }), roughness: 0.96 });
  const base = new T.Mesh(new T.BoxGeometry(1.7, 0.3, 0.95), stone);
  base.position.y = 0.15; g.add(base);
  const slab = new T.Mesh(new T.BoxGeometry(1.35, 0.16, 0.8), new T.MeshStandardMaterial({ color: 0x8f8b82, roughness: 0.95 }));
  slab.position.y = 0.38; g.add(slab);
  const stoneBody = new T.Mesh(new T.BoxGeometry(1.15, 1.7, 0.34), stone);
  stoneBody.position.y = 1.32; g.add(stoneBody);
  const cap = new T.Mesh(new T.CylinderGeometry(0.575, 0.575, 0.34, 14, 1, false, 0, Math.PI), stone);
  cap.rotation.set(Math.PI / 2, 0, Math.PI / 2); cap.rotation.order = 'ZYX';
  cap.position.set(0, 2.17, 0); g.add(cap);
  // engraved plate: name + line (Arabic name from the story; fleet-font check flagged in lessons)
  const plate = new T.Mesh(new T.PlaneGeometry(1.5, 0.62), new T.MeshBasicMaterial({
    map: cnv(T, 384, 160, (g2) => {
      g2.clearRect(0, 0, 384, 160);
      g2.fillStyle = '#3a3a34'; g2.font = 'bold 54px sans-serif'; g2.textAlign = 'center'; g2.textBaseline = 'middle';
      g2.fillText('العمدة وامورا', 192, 56);
      g2.strokeStyle = '#3a3a34'; g2.lineWidth = 4;
      g2.beginPath(); g2.moveTo(96, 104); g2.lineTo(288, 104); g2.stroke();
      g2.font = '26px sans-serif'; g2.fillStyle = 'rgba(58,58,52,0.75)';
      g2.fillText('15.5', 192, 132);
    }), transparent: true, depthWrite: false,
  }));
  plate.position.set(0, 1.62, 0.18); g.add(plate);
  // carved relief: a small wave meeting a wall (grooves)
  const gro = new T.MeshStandardMaterial({ color: 0x6a665e, roughness: 0.95 });
  const relief = new T.Mesh(new T.BoxGeometry(0.7, 0.34, 0.06), gro); relief.position.set(0, 0.98, 0.18); g.add(relief);
  const wl = new T.Mesh(new T.BoxGeometry(0.5, 0.06, 0.04), new T.MeshStandardMaterial({ color: 0x565e62, roughness: 0.9 }));
  wl.position.set(-0.06, 1.08, 0.2); wl.rotation.z = 0.3; g.add(wl);
  const wl2 = new T.Mesh(new T.BoxGeometry(0.4, 0.05, 0.04), new T.MeshStandardMaterial({ color: 0x565e62, roughness: 0.9 }));
  wl2.position.set(0.05, 1.0, 0.2); wl2.rotation.z = -0.25; g.add(wl2);
  // flowers cup at the base
  const cup = new T.Mesh(new T.CylinderGeometry(0.17, 0.13, 0.26, 10), new T.MeshStandardMaterial({ color: 0x7a5c44, roughness: 0.85 }));
  cup.position.set(0, 0.56, 0.5); g.add(cup);
  return g;
}
