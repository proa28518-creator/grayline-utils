// scenes/props/wave.js — the wave machinery: a curved wall of water with a foam lip.
// All motion is opts-driven (pure in t): { rise: 0..1 } height, { adv: 0..n } approach along +z,
// { mark: 0|1 } the glowing 15M measure line on its face. Origin at the base centre.
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
  const rise = (typeof o.rise === 'number') ? Math.max(0, Math.min(1, o.rise)) : 1;
  const adv = (typeof o.adv === 'number') ? o.adv : 0;
  const mark = o.mark ? true : false;
  const g = new T.Group();
  const H = 24 * rise;               // 15 m ≈ 24 D
  const R = 26;                      // crest radius
  const face = new T.MeshStandardMaterial({
    map: cnv(T, 128, 512, (g2) => {
      const gr = g2.createLinearGradient(0, 512, 0, 0);
      gr.addColorStop(0, '#173a4e'); gr.addColorStop(0.55, '#2a6a86'); gr.addColorStop(0.85, '#5fa8bc'); gr.addColorStop(1, '#cfe8ee');
      g2.fillStyle = gr; g2.fillRect(0, 0, 128, 512);
      g2.strokeStyle = 'rgba(230,245,250,0.5)'; g2.lineWidth = 3;
      for (let i = 0; i < 9; i++) { g2.beginPath(); g2.moveTo(0, 60 + i * 50); g2.bezierCurveTo(40, 40 + i * 50, 90, 80 + i * 50, 128, 55 + i * 50); g2.stroke(); }
    }),
    transparent: true, opacity: 0.94, roughness: 0.35, metalness: 0.1, side: T.DoubleSide,
  });
  const body = new T.Mesh(new T.CylinderGeometry(R, R, Math.max(0.1, H), 26, 1, true, Math.PI * 0.44, Math.PI * 0.24), face);
  body.rotation.y = -Math.PI / 2; body.scale.y = 1;
  body.position.set(0, H / 2, 0);
  g.add(body);
  // foam lip
  const lip = new T.Mesh(new T.TorusGeometry(R, 1.15, 8, 26, Math.PI * 0.24), new T.MeshStandardMaterial({ color: 0xeef8fa, roughness: 0.4, transparent: true, opacity: 0.92 }));
  lip.rotation.x = Math.PI / 2; lip.rotation.z = Math.PI / 2; lip.rotation.order = 'ZYX';
  lip.position.set(0, Math.max(0.2, H), 0);
  lip.rotation.set(Math.PI / 2, 0, -Math.PI * 0.44);
  g.add(lip);
  // spray puffs along the crest (fixed offsets — deterministic)
  const puffM = new T.MeshStandardMaterial({ color: 0xf2fbfd, roughness: 0.5, transparent: true, opacity: 0.85 });
  for (let i = 0; i < 6; i++) {
    const a = Math.PI * (0.46 + i * 0.035);
    const p = new T.Mesh(new T.SphereGeometry(0.9 + (i % 3) * 0.35, 8, 8), puffM);
    p.position.set(Math.sin(a) * R * -1, H + 0.6 + (i % 2) * 0.7, -Math.cos(a) * R + R * Math.cos(Math.PI * 0.44) - 2);
    g.add(p);
  }
  // base sheet
  const base = new T.Mesh(new T.CircleGeometry(R * 0.96, 24), new T.MeshStandardMaterial({ color: 0x2a5a70, roughness: 0.4, transparent: true, opacity: 0.5 }));
  base.rotation.x = -Math.PI / 2; base.position.y = 0.06; g.add(base);
  // measure line: glow band at exactly 15 m ≈ 24 D with the label plate
  if (mark) {
    const my = 24;
    const band = new T.Mesh(new T.PlaneGeometry(R * 0.42, 0.5), new T.MeshBasicMaterial({ color: 0xffe07a, transparent: true, opacity: 0.95, side: T.DoubleSide, depthWrite: false }));
    band.position.set(-R * 0.4, my, R * Math.sin(Math.PI * 0.56) * -1 + R * 0.99 * Math.sin(Math.PI * 0.44));
    band.rotation.x = -0.12; g.add(band);
    const plate = new T.Mesh(new T.PlaneGeometry(2.6, 1.0), new T.MeshBasicMaterial({
      map: cnv(T, 256, 96, (g2) => {
        g2.fillStyle = 'rgba(20,30,40,0.75)'; g2.fillRect(0, 0, 256, 96);
        g2.fillStyle = '#ffe07a'; g2.font = 'bold 54px sans-serif'; g2.textAlign = 'center'; g2.textBaseline = 'middle';
        g2.fillText('15M', 108, 50); g2.font = 'bold 34px sans-serif'; g2.fillText('بالظبط', 202, 52);
      }), transparent: true, side: T.DoubleSide, depthWrite: false,
    }));
    plate.position.set(-R * 0.62, my + 1.5, R * Math.sin(Math.PI * 0.58) * -1 + R * 0.99 * Math.sin(Math.PI * 0.44) + 0.4);
    plate.rotation.y = -0.35; g.add(plate);
  }
  g.position.set(0, 0, adv);
  return g;
}
