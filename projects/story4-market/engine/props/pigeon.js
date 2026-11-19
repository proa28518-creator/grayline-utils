// pigeon — a street pigeon built from primitives, facing +X. Origin at the
// ground under its feet. Non-speaking acting prop: it bumps elbows, threads
// chases and hops aside.
import { THREE, flat, basic, part, finish } from './_kit.js';

export const free = true;

export function build(o = {}) {
  const g = new THREE.Group();
  const bodyM = flat('#8f959c'), darkM = flat('#767c84'), headM = flat('#5f7a72');
  const body = part(new THREE.SphereGeometry(0.16, 18, 14), bodyM, 0.014);
  body.scale.set(1.25, 0.95, 0.9); body.position.set(0, 0.17, 0);
  g.add(body);
  const head = part(new THREE.SphereGeometry(0.095, 16, 12), headM, 0.012);
  head.position.set(0.17, 0.30, 0);
  g.add(head);
  const beak = part(new THREE.ConeGeometry(0.028, 0.075, 10), flat('#d88f2e'), 0.008);
  beak.rotation.z = -Math.PI / 2; beak.position.set(0.285, 0.29, 0);
  g.add(beak);
  for (const s of [-1, 1]) {
    const eye = part(new THREE.SphereGeometry(0.016, 8, 8), basic('#241d16'), 0);
    eye.position.set(0.20, 0.33, s * 0.082);
    g.add(eye);
    const wing = part(new THREE.BoxGeometry(0.22, 0.02, 0.11), darkM, 0.01);
    wing.position.set(-0.02, 0.235, s * 0.125); wing.rotation.y = s * 0.15;
    g.add(wing);
    const foot = part(new THREE.CylinderGeometry(0.008, 0.008, 0.07, 6), flat('#c96f4a'), 0);
    foot.position.set(0.03, 0.035, s * 0.05);
    g.add(foot);
  }
  const tail = part(new THREE.BoxGeometry(0.24, 0.025, 0.13), darkM, 0.01);
  tail.position.set(-0.24, 0.21, 0); tail.rotation.z = 0.38;
  g.add(tail);
  return finish(g, { centre: [0, 0.2, 0] });
}
