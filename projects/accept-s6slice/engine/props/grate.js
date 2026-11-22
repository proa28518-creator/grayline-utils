// grate — a flat drain grate lying on the paving. Origin at its centre on
// the ground. The ring hops it by a hair at line 5.
import { THREE, flat, part, finish } from './_kit.js';

export const free = true;

export function build(o = {}) {
  const g = new THREE.Group();
  const base = part(new THREE.BoxGeometry(1.3, 0.05, 0.95), flat('#43484f'), 0.012);
  base.position.y = 0.025;
  g.add(base);
  for (let i = 0; i < 5; i++) {
    const slat = part(new THREE.BoxGeometry(1.14, 0.02, 0.1), flat('#2b2f36'), 0);
    slat.position.set(0, 0.055, -0.32 + i * 0.16);
    g.add(slat);
  }
  return finish(g, { centre: [0, 0.03, 0] });
}
