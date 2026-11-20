// ring — the hero prop: a gold proposal ring with a bright stone. Origin at the
// band's centre; the band stands in the XY plane (axis Z) so rot z rolls it
// along the street. Small on purpose — the cameras punch in at the near-misses.
import { THREE, flat, basic, part, finish } from './_kit.js';

export const free = true;

export function build(o = {}) {
  const g = new THREE.Group();
  g.add(part(new THREE.TorusGeometry(0.055, 0.017, 10, 28), flat('#d9a92c'), 0.012));
  const gem = part(new THREE.OctahedronGeometry(0.021), basic('#eaf6ff'), 0);
  gem.position.set(0, 0.074, 0);
  g.add(gem);
  return finish(g, { centre: [0, 0, 0] });
}
