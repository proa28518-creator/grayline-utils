// The unmarked map (Build previz, engine/props convention) — a folded chart with no drawn routes; origin at the grip.
// `print` opts come from the film: { title, blank } — never a blank slab.
import { THREE, flat, basic, part, finish } from './_kit.js';
export const free = true;

export function build(o = {}) {
  const g = new THREE.Group(); g.name = 'prop.book';
  const paper = flat(o.paper ?? '#d8cdb4', '#b0a68a');
  const ink = basic('#3a352c');
  const sheet = part(new THREE.BoxGeometry(0.24, 0.012, 0.3), paper, .012);
  sheet.position.y = 0.006; g.add(sheet);
  const fold = part(new THREE.BoxGeometry(0.24, 0.014, 0.008), ink, .008);
  fold.position.set(0, 0.008, 0); g.add(fold);
  if (o.print && o.print.title && !o.print.blank) {
    const label = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.03), ink);
    label.rotation.x = -Math.PI / 2; label.position.set(0, 0.013, -0.1); g.add(label);
  }
  // blank: the point of the story — no drawn map. Leave the sheet clean.
  return finish(g, {});
}
