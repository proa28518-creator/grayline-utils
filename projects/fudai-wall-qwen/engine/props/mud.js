// mud — a street-mud splat: overlapping flat circles facing +Z. Placed
// in:'body' from the line-7 cut on: the suit's visible wreckage. The film
// uses two instances with different baked offsets via opts { dx, dy }.
import { THREE, flat, part, finish } from './_kit.js';

export const free = true;

export function build(o = {}) {
  const dx = o.dx || 0, dy = o.dy || 0;
  const g = new THREE.Group();
  const spots = [
    [0, 0, 0.13, '#6b4a2c'], [-0.12, 0.07, 0.08, '#54381f'], [0.11, -0.06, 0.09, '#6b4a2c'],
    [0.05, 0.12, 0.06, '#54381f'], [-0.04, -0.13, 0.07, '#77552f'],
  ];
  for (const [x, y, r, c] of spots) {
    const s = part(new THREE.CircleGeometry(r, 14), flat(c), 0.008);
    s.position.set(dx + x, dy + y, 0.012);
    g.add(s);
  }
  return finish(g, { centre: [dx, dy, 0] });
}
