import * as THREE from 'three';

// scenes/props/ruler.js — the mayor's straightedge: pale wood, printed graduations,
// a brass end cap. Origin at the grip (middle of the stick).
function cnv(T, w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c); t.anisotropy = 4; return t;
}

export function build(opts) {
  const T = THREE; // imported by this file — the host passes no objects in (repair round 1)
  const g = new T.Group();
  const faceT = cnv(T, 512, 64, (g2) => {
    g2.fillStyle = '#e2c98c'; g2.fillRect(0, 0, 512, 64);
    g2.strokeStyle = '#7a5c34'; g2.lineWidth = 3;
    for (let i = 0; i <= 20; i++) {
      const x = 16 + i * 24, tall = i % 5 === 0;
      g2.beginPath(); g2.moveTo(x, 6); g2.lineTo(x, tall ? 34 : 20); g2.stroke();
      if (tall && i > 0 && i < 20) { g2.fillStyle = '#7a5c34'; g2.font = 'bold 14px sans-serif'; g2.textAlign = 'center'; g2.fillText(String(i), x, 52); g2.strokeStyle = '#7a5c34'; }
    }
    g2.strokeStyle = '#a88a50'; g2.lineWidth = 6; g2.strokeRect(3, 3, 506, 58);
  });
  const stick = new T.Mesh(new T.BoxGeometry(2.8, 0.16, 0.05), [
    new T.MeshStandardMaterial({ color: 0xc9a860, roughness: 0.85 }),
    new T.MeshStandardMaterial({ color: 0xc9a860, roughness: 0.85 }),
    new T.MeshStandardMaterial({ color: 0xc9a860, roughness: 0.85 }),
    new T.MeshStandardMaterial({ color: 0xc9a860, roughness: 0.85 }),
    new T.MeshStandardMaterial({ map: faceT, roughness: 0.85 }),
    new T.MeshStandardMaterial({ color: 0xb8944e, roughness: 0.85 }),
  ]);
  stick.position.set(1.4, 0, 0); g.add(stick); // origin stays at the grip: mesh offset +X by half
  const cap = new T.Mesh(new T.BoxGeometry(0.12, 0.2, 0.07), new T.MeshStandardMaterial({ color: 0xb8862e, roughness: 0.4, metalness: 0.7 }));
  cap.position.set(2.82, 0, 0); g.add(cap);
  const cap2 = new T.Mesh(new T.BoxGeometry(0.12, 0.2, 0.07), new T.MeshStandardMaterial({ color: 0xb8862e, roughness: 0.4, metalness: 0.7 }));
  cap2.position.set(-0.02, 0, 0); g.add(cap2);
  return g;
}
