// Nailed boot (Build previz, engine/props convention) — origin at the sole centre; the 8 clamp screws visible.
import { THREE, flat, part, finish } from './_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.boot_nailed';
  const leather = flat(o.leather ?? '#4a3a2c', '#332820');
  const steel = flat(o.steel ?? '#8f979f', '#666d75');
  const body = part(new THREE.BoxGeometry(0.13, 0.1, 0.3), leather, .014);
  body.position.y = 0.06; g.add(body);
  const sole = part(new THREE.BoxGeometry(0.14, 0.025, 0.31), leather, .014);
  sole.position.y = 0.012; g.add(sole);
  for (let i = 0; i < 4; i++) for (const x of [-0.045, 0.045]) {
    const screw = part(new THREE.CylinderGeometry(0.008, 0.008, 0.012, 6), steel, .008);
    screw.position.set(x, 0.026, -0.11 + i * 0.073); g.add(screw);
  }
  return finish(g, {});
}
