// Ice axe (Build previz, engine/props convention) — origin at the grip (mid shaft).
import { THREE, flat, part, finish } from './_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.ice_axe';
  const wood = flat(o.wood ?? '#7a5c3e', '#5c4530');
  const steel = flat(o.steel ?? '#9aa2ab', '#6e757d');
  const shaft = part(new THREE.CylinderGeometry(0.03, 0.035, 0.75, 8), wood, .012);
  shaft.position.y = 0.1; g.add(shaft);
  const head = part(new THREE.BoxGeometry(0.26, 0.045, 0.05), steel, .012);
  head.position.set(0.08, 0.48, 0); g.add(head);
  const spike = part(new THREE.ConeGeometry(0.025, 0.12, 6), steel, .012);
  spike.position.set(-0.09, 0.48, 0); spike.rotation.z = Math.PI; g.add(spike);
  return finish(g, {});
}
