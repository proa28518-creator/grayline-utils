// scenes/props/guard_cap.js — Security Guard's Peaked Officer Cap (rolls edge-on right under red_cart's front wheel!)
import { THREE, flat, part, finish } from '../../engine/props/_kit.js';

export const free = true;

export function build() {
  const g = new THREE.Group();
  g.name = 'prop.guard_cap';

  const navy = flat('#253957', '#162338');
  const darkBand = flat('#1a1f29', '#0e1117');
  const visorMat = flat('#141820', '#0a0c10');
  const gold = flat('#f2c94c', '#b88a1e');

  // Lower band cylinder
  const band = part(new THREE.CylinderGeometry(0.22, 0.21, 0.11, 20), darkBand, 0.020);
  band.position.y = 0.055;
  g.add(band);

  // Flared peaked crown
  const crown = part(new THREE.CylinderGeometry(0.27, 0.22, 0.13, 20), navy, 0.022);
  crown.position.y = 0.165;
  g.add(crown);

  // Gold piping cord around the front
  const cord = part(new THREE.TorusGeometry(0.218, 0.014, 8, 22), gold, 0.010);
  cord.rotation.x = Math.PI / 2;
  cord.position.y = 0.105;
  g.add(cord);

  // Glossy black front visor (+Z)
  const visor = part(new THREE.CylinderGeometry(0.23, 0.25, 0.03, 16, 1, false, -Math.PI * 0.45, Math.PI * 0.9), visorMat, 0.018);
  visor.position.set(0, 0.03, 0.08);
  visor.rotation.x = 0.18;
  g.add(visor);

  // Bright gold winged badge on front crown
  const badge = part(new THREE.OctahedronGeometry(0.065, 0), gold, 0.015);
  badge.scale.set(1.2, 1.3, 0.4);
  badge.position.set(0, 0.17, 0.245);
  g.add(badge);

  return finish(g, { centre: [0, 0.11, 0] });
}
