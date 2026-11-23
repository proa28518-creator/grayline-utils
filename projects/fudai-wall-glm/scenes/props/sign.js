import * as THREE from 'three';

// scenes/props/sign.js — two printed hangings, one kind:
//   banner : cloth banner "3,000" floating over the village (scene 2 pan)
//   plank  : burned wooden plank "أغبى مشروع في البلد" hanging from the wall top (scene 4)
// State: { sway } rot, { kind }. Origin at the top rope anchor.
function cnv(T, w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c); t.anisotropy = 4; return t;
}

export function build(opts) {
  const T = THREE; // imported by this file — the host passes no objects in (repair round 1)
  const o = opts || {};
  const kind = o.style || 'plank';
  const sway = (typeof o.sway === 'number') ? o.sway : 0;
  const g = new T.Group();
  const ropeM = new T.MeshStandardMaterial({ color: 0x9a7a4e, roughness: 0.95 });
  if (kind === 'banner') {
    const t = cnv(T, 512, 160, (g2) => {
      g2.fillStyle = '#e8ddc0'; g2.fillRect(0, 0, 512, 160);
      g2.strokeStyle = '#a8543a'; g2.lineWidth = 10; g2.strokeRect(10, 10, 492, 140);
      g2.fillStyle = '#a8543a'; g2.font = 'bold 92px sans-serif'; g2.textAlign = 'center'; g2.textBaseline = 'middle';
      g2.fillText('3,000', 256, 84);
      g2.fillStyle = 'rgba(0,0,0,0.08)';
      for (let i = 0; i < 5; i++) g2.fillRect(0, i * 34, 512, 12);
    });
    const cloth = new T.Mesh(new T.PlaneGeometry(4.4, 1.35), new T.MeshStandardMaterial({ map: t, roughness: 0.95, side: T.DoubleSide, transparent: true, opacity: 0.97 }));
    cloth.position.y = -1.4; g.add(cloth);
    for (const dx of [-1.9, 1.9]) {
      const r = new T.Mesh(new T.CylinderGeometry(0.025, 0.025, 1.5, 6), ropeM);
      r.position.set(dx, -0.4, 0); g.add(r);
    }
  } else {
    const t = cnv(T, 512, 128, (g2) => {
      g2.fillStyle = '#7a5c38'; g2.fillRect(0, 0, 512, 128);
      g2.fillStyle = '#6a4e2e'; for (let i = 0; i < 6; i++) g2.fillRect(0, i * 22, 512, 14);
      g2.strokeStyle = '#5a4028'; g2.lineWidth = 6; g2.strokeRect(4, 4, 504, 120);
      g2.fillStyle = '#2e2214'; g2.font = 'bold 52px sans-serif'; g2.textAlign = 'center'; g2.textBaseline = 'middle';
      g2.fillText('أغبى مشروع في البلد', 256, 66);
      g2.fillStyle = 'rgba(46,34,20,0.35)';
      for (let i = 0; i < 10; i++) g2.fillRect((i * 71) % 470, (i * 31) % 90, 20, 8);
    });
    const plank = new T.Mesh(new T.BoxGeometry(3.4, 0.7, 0.09), [
      new T.MeshStandardMaterial({ color: 0x5a4028, roughness: 0.95 }),
      new T.MeshStandardMaterial({ color: 0x5a4028, roughness: 0.95 }),
      new T.MeshStandardMaterial({ color: 0x5a4028, roughness: 0.95 }),
      new T.MeshStandardMaterial({ color: 0x5a4028, roughness: 0.95 }),
      new T.MeshStandardMaterial({ map: t, roughness: 0.95 }),
      new T.MeshStandardMaterial({ color: 0x4a3620, roughness: 0.95 }),
    ]);
    plank.position.y = -1.35; g.add(plank);
    for (const dx of [-1.5, 1.5]) {
      const r = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 1.0, 6), ropeM);
      r.position.set(dx, -0.5, 0); g.add(r);
    }
    const nail = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 0.14, 8), new T.MeshStandardMaterial({ color: 0x777d82, roughness: 0.5, metalness: 0.5 }));
    nail.rotation.x = Math.PI / 2; nail.position.set(0, 0, 0); g.add(nail);
  }
  const swayA = (kind === 'banner' ? 0.5 : 0.3) * Math.sin(sway * Math.PI * 2);
  g.rotation.z = swayA;
  g.rotation.x = swayA * 0.35;
  return g;
}
