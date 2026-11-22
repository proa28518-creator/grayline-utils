// pocketsquare — the hero's white breast-pocket square. In his pocket for
// lines 1–6; at line 7 word 9 («وناسي») the film drops it behind him — the
// moment he stops caring about the suit, filmed.
import { THREE, flat, part, finish } from './_kit.js';

export const free = true;

export function build(o = {}) {
  const g = new THREE.Group();
  const sq = part(new THREE.BoxGeometry(0.15, 0.1, 0.015), flat('#f5f2ea'), 0.008);
  sq.position.set(0.2, 0.3, 0.01);
  g.add(sq);
  const peak = part(new THREE.BoxGeometry(0.05, 0.07, 0.015), flat('#f5f2ea'), 0.008);
  peak.position.set(0.16, 0.36, 0.01); peak.rotation.z = 0.4;
  g.add(peak);
  return finish(g, { centre: [0.2, 0.3, 0] });
}
