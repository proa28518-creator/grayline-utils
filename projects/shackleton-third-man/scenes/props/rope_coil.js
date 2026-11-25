// Rope coil (Build previz, engine/props convention) — origin at the grip.
import { THREE, flat, part, finish } from './_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.rope_coil';
  const mat = flat(o.color ?? '#b8a888', '#8f8068');
  for (let i = 0; i < 4; i++) {
    const ring = part(new THREE.TorusGeometry(0.16 - i * 0.012, 0.03, 8, 20), mat, .012);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = i * 0.045 - 0.07;
    g.add(ring);
  }
  return finish(g, {});
}
