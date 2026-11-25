// Crean's mug (Build previz, engine/props convention) — a tin mug; origin at the grip (the handle).
import { THREE, flat, basic, part, finish } from './_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.mug';
  const tin = flat(o.tin ?? '#8d949c', '#676d75');
  const cup = part(new THREE.CylinderGeometry(0.045, 0.038, 0.09, 12), tin, .012);
  cup.position.set(0, 0.045, 0.06); g.add(cup);
  const handle = part(new THREE.TorusGeometry(0.028, 0.007, 6, 12, Math.PI), tin, .008);
  handle.position.set(0, 0.05, 0.012); g.add(handle);
  const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.04, 12), basic('#2a1d12'));
  coffee.rotation.x = -Math.PI / 2; coffee.position.set(0, 0.088, 0.06); g.add(coffee);
  return finish(g, {});
}
