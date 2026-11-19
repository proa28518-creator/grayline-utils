// fountain — the plaza fountain: two entry steps, a round basin (rim at
// y 0.95, water at y 0.80, basin floor at y 0.32), a centre column with a top
// bowl. Origin at the ground centre. The ring's flight must clear the bowl;
// the hero lands standing on the basin floor inside it.
import { THREE, flat, part, finish } from './_kit.js';

export const free = true;

export function build(o = {}) {
  const g = new THREE.Group();
  const stone = flat('#b7ad9c'), trim = flat('#978c76');
  const add = (geo, mat, y, w = 0.02) => { const m = part(geo, mat, w); m.position.y = y; g.add(m); return m; };
  add(new THREE.CylinderGeometry(3.05, 3.15, 0.16, 36), trim, 0.08);
  add(new THREE.CylinderGeometry(2.65, 2.72, 0.16, 36), stone, 0.24);
  add(new THREE.CylinderGeometry(2.3, 2.38, 0.63, 36), stone, 0.635);
  const rim = add(new THREE.TorusGeometry(2.3, 0.09, 10, 40), trim, 0.95);
  rim.rotation.x = Math.PI / 2;
  add(new THREE.CylinderGeometry(2.08, 2.08, 0.04, 36), flat('#79b8cc'), 0.79, 0);
  add(new THREE.CylinderGeometry(0.26, 0.34, 1.68, 16), stone, 1.16);
  add(new THREE.CylinderGeometry(0.8, 0.55, 0.16, 20), trim, 2.02);
  add(new THREE.ConeGeometry(0.17, 0.55, 12), trim, 2.38); // spire, not a ball: must never read as a second ring
  return finish(g, { centre: [0, 1.0, 0] });
}
