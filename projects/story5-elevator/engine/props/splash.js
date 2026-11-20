// splash — a ring of bright droplets + a foam ring, for the ring's
// splashdown and the hero's dive landing. Origin at the water point; the
// film keys snap it in on the hit frame and out again (a real hit is a
// legal snap).
import { THREE, basic, part, finish } from './_kit.js';

export const free = true;

export function build(o = {}) {
  const g = new THREE.Group();
  const drop = basic('#e8f6fc');
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const d = part(new THREE.SphereGeometry(0.045 + (i % 3) * 0.012, 8, 8), drop, 0);
    d.position.set(Math.cos(a) * (0.35 + (i % 2) * 0.18), 0.18 + (i % 4) * 0.13, Math.sin(a) * (0.35 + (i % 2) * 0.18));
    g.add(d);
  }
  const crown = part(new THREE.SphereGeometry(0.06, 8, 8), drop, 0);
  crown.position.set(0, 0.72, 0);
  g.add(crown);
  const ringFoam = part(new THREE.TorusGeometry(0.55, 0.03, 8, 28), basic('#cfeef8'), 0);
  ringFoam.rotation.x = Math.PI / 2; ringFoam.position.y = 0.03;
  g.add(ringFoam);
  return finish(g, { centre: [0, 0.3, 0] });
}
