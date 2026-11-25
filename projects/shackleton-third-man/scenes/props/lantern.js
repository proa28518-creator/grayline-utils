// Storm lantern (Build previz, engine/props convention) — origin at its base; the visible warm pool practical in the boat.
import { THREE, flat, basic, part, finish } from './_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.lantern';
  const brass = flat(o.brass ?? '#9a7c3c', '#6e5828');
  const glass = basic(o.glass ?? '#ffcf8a', { opacity: 0.9, transparent: true });
  const base = part(new THREE.CylinderGeometry(0.075, 0.09, 0.03, 10), brass, .012);
  base.position.y = 0.015; g.add(base);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.14, 10), glass);
  body.position.y = 0.1; g.add(body);
  const top = part(new THREE.ConeGeometry(0.065, 0.05, 10), brass, .012);
  top.position.y = 0.195; g.add(top);
  return finish(g, {});
}
