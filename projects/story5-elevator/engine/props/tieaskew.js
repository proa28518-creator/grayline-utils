// tieaskew — the same tie after the chase has wrecked the suit: knot shoved
// sideways, blade swung diagonally across the chest. Appears on the line-7
// cut (a place change on a cut is legal) and stays on for the rest of the
// film, including the dive.
import { THREE, flat, part, finish } from './_kit.js';

export const free = true;

export function build(o = {}) {
  const g = new THREE.Group();
  const m = flat('#8e2f35');
  const knot = part(new THREE.BoxGeometry(0.11, 0.09, 0.05), m, 0.012);
  knot.position.set(0.10, 0.66, 0.02); knot.rotation.z = -0.5;
  g.add(knot);
  const swing = new THREE.Group();
  swing.position.set(0.10, 0.64, 0.02); swing.rotation.z = -0.95;
  const blade = part(new THREE.BoxGeometry(0.085, 0.44, 0.02), m, 0.012);
  blade.position.set(0, -0.24, 0);
  swing.add(blade);
  g.add(swing);
  return finish(g, { centre: [0, 0.42, 0] });
}
