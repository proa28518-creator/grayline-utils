// scenes/props/gate.js — the steel floodgate in the seawall opening.
// Print: rivet fields, cross ribs, wheel, plaque "15.5 م". State: closed (opts.rust wear).
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
  const g = new T.Group();
  const steel = new T.MeshStandardMaterial({
    map: cnv(T, 256, 512, (g2) => {
      g2.fillStyle = '#5f6a72'; g2.fillRect(0, 0, 256, 512);
      g2.fillStyle = '#55606a'; for (let i = 0; i < 8; i++) g2.fillRect(0, i * 64, 256, 58);
      g2.strokeStyle = '#47525a'; g2.lineWidth = 5;
      for (let i = 0; i <= 8; i++) { g2.beginPath(); g2.moveTo(0, i * 64); g2.lineTo(256, i * 64); g2.stroke(); }
      // rivet field
      g2.fillStyle = '#78838c';
      for (let r = 0; r < 9; r++) for (let cq = 0; cq < 4; cq++) {
        const x = 22 + cq * 70 + (r % 2) * 14, y = 26 + r * 56;
        g2.beginPath(); g2.arc(x, y, 5, 0, 7); g2.fill();
        g2.fillStyle = '#8a95a0'; g2.beginPath(); g2.arc(x - 1, y - 1, 2.4, 0, 7); g2.fill(); g2.fillStyle = '#78838c';
      }
      // streaks of weather
      g2.fillStyle = 'rgba(70,60,45,0.16)';
      for (let i = 0; i < 10; i++) g2.fillRect((i * 47) % 240, 340, 6, 170);
      g2.fillStyle = 'rgba(88,104,96,0.2)'; g2.fillRect(0, 440, 256, 72);
    }),
    roughness: 0.62, metalness: 0.55,
  });
  // leaf
  const leaf = new T.Mesh(new T.BoxGeometry(4.8, 7.6, 0.3), steel);
  leaf.position.y = 4.0; g.add(leaf);
  // cross ribs
  const rib = new T.MeshStandardMaterial({ color: 0x4a545c, roughness: 0.55, metalness: 0.6 });
  for (let i = 0; i < 4; i++) {
    const r = new T.Mesh(new T.BoxGeometry(4.6, 0.34, 0.36), rib);
    r.position.set(0, 1.2 + i * 1.9, 0.2); g.add(r);
  }
  const spine = new T.Mesh(new T.BoxGeometry(0.4, 7.6, 0.4), rib);
  spine.position.set(0, 4.0, 0.24); g.add(spine);
  // frame
  const frameM = new T.MeshStandardMaterial({ color: 0x3c444c, roughness: 0.5, metalness: 0.65 });
  const jL = new T.Mesh(new T.BoxGeometry(0.7, 8.6, 0.9), frameM); jL.position.set(-2.75, 4.3, 0); g.add(jL);
  const jR = new T.Mesh(new T.BoxGeometry(0.7, 8.6, 0.9), frameM); jR.position.set(2.75, 4.3, 0); g.add(jR);
  const lintel = new T.Mesh(new T.BoxGeometry(6.2, 0.7, 0.9), frameM); lintel.position.set(0, 8.25, 0); g.add(lintel);
  // wheel + axle on the right jamb
  const wheel = new T.Mesh(new T.TorusGeometry(0.62, 0.11, 8, 18), rib);
  wheel.position.set(3.3, 5.6, 0.55); g.add(wheel);
  for (let i = 0; i < 4; i++) {
    const sp = new T.Mesh(new T.BoxGeometry(0.09, 1.16, 0.09), rib);
    sp.position.set(3.3, 5.6, 0.55); sp.rotation.z = i * Math.PI / 4; g.add(sp);
  }
  const axle = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 0.7, 10), rib);
  axle.rotation.x = Math.PI / 2; axle.position.set(3.3, 5.6, 0.2); g.add(axle);
  // plaque "15.5 م" (digits safe for any fleet font; one Arabic word carried by the relief too)
  const plq = new T.Mesh(new T.PlaneGeometry(1.7, 0.85), new T.MeshBasicMaterial({
    map: cnv(T, 256, 128, (g2) => {
      g2.fillStyle = '#3c444c'; g2.fillRect(0, 0, 256, 128);
      g2.strokeStyle = '#9aa6b2'; g2.lineWidth = 6; g2.strokeRect(8, 8, 240, 112);
      g2.fillStyle = '#d8e2ea'; g2.font = 'bold 58px sans-serif'; g2.textAlign = 'center'; g2.textBaseline = 'middle';
      g2.fillText('15.5', 118, 58); g2.font = 'bold 34px sans-serif'; g2.fillText('م', 200, 60);
      g2.fillStyle = '#9aa6b2'; g2.font = 'bold 22px sans-serif'; g2.fillText('FUDAI', 128, 100);
    }),
  }));
  plq.position.set(-1.4, 6.9, 0.42); g.add(plq);
  // threshold sill
  const sill = new T.Mesh(new T.BoxGeometry(5.6, 0.18, 1.4), frameM);
  sill.position.set(0, 0.09, 0.2); g.add(sill);
  if (o.rust) { steel.roughness = 0.75; steel.metalness = 0.4; }
  return g;
}
