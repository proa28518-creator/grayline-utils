// tie — the hero's neat tie as a PROP (not an outfit layer) so the film can
// retire it on the line-7 cut and replace it with tieaskew. Placed in:'body';
// the geometry carries the collar offset baked in (knot at +0.68 above the
// body-centre anchor, blade hanging to the chest).
import { THREE, flat, part, finish } from './_kit.js';

export const free = true;

export function build(o = {}) {
  const g = new THREE.Group();
  const m = flat('#8e2f35');
  const knot = part(new THREE.BoxGeometry(0.11, 0.09, 0.05), m, 0.012);
  knot.position.set(0, 0.68, 0.02);
  g.add(knot);
  const blade = part(new THREE.BoxGeometry(0.085, 0.46, 0.02), m, 0.012);
  blade.position.set(0, 0.42, 0.02);
  g.add(blade);
  const tip = part(new THREE.BoxGeometry(0.06, 0.06, 0.02), m, 0.01);
  tip.position.set(0, 0.16, 0.02); tip.rotation.z = Math.PI / 4;
  g.add(tip);
  return finish(g, { centre: [0, 0.42, 0] });
}
