// Pocket watch (Build previz, engine/props convention) — origin at the grip (stem side); opens on the key `open`.
import { THREE, flat, basic, part, finish } from './_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.pocket_watch';
  const gold = flat(o.gold ?? '#c9a44a', '#96762f');
  const faceM = basic(o.face ?? '#f4efe2');
  const case_ = part(new THREE.CylinderGeometry(0.055, 0.055, 0.014, 16), gold, .01);
  case_.rotation.x = Math.PI / 2; g.add(case_);
  const dial = new THREE.Mesh(new THREE.CircleGeometry(0.046, 16), faceM);
  dial.position.z = 0.008; g.add(dial);
  const hand = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.036, 0.002), basic('#2a2620'));
  hand.position.set(0, 0.012, 0.01); g.add(hand);
  if (o.open) {
    const lid = case_.clone();
    lid.rotation.x = Math.PI / 2 - 1.4; lid.position.x = -0.1; g.add(lid);
  }
  return finish(g, {});
}
