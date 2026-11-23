// scenes/props/swaypole.js — the street lamp that sways in the quake.
// State: { sway: 0..1 } wobble envelope; origin at the base so the top swings.
function pickT(opts, THREE) {
  if (opts && opts.Group) return opts;
  if (THREE && THREE.Group) return THREE;
  if (typeof THREE !== 'undefined') return THREE;
  return null;
}

export function build(opts, THREE) {
  const T = pickT(opts, THREE);
  const o = opts || {};
  const sway = (typeof o.sway === 'number') ? Math.max(0, Math.min(1, o.sway)) : 0;
  const g = new T.Group();
  const metalM = new T.MeshStandardMaterial({ color: 0x37414d, roughness: 0.6, metalness: 0.3 });
  const pole = new T.Mesh(new T.CylinderGeometry(0.09, 0.14, 6, 10), metalM);
  pole.position.y = 3; g.add(pole);
  const base = new T.Mesh(new T.CylinderGeometry(0.34, 0.44, 0.12, 10), metalM);
  base.position.y = 0.06; g.add(base);
  const arm = new T.Mesh(new T.BoxGeometry(1.3, 0.12, 0.12), metalM);
  arm.position.set(0.6, 5.9, 0); g.add(arm);
  const head = new T.Mesh(new T.SphereGeometry(0.34, 12, 10), new T.MeshBasicMaterial({ color: 0xffd9a0 }));
  head.position.set(1.2, 5.72, 0); g.add(head);
  const collar = new T.Mesh(new T.CylinderGeometry(0.16, 0.12, 0.2, 8), metalM);
  collar.position.set(1.2, 5.95, 0); g.add(collar);
  // deterministic wobble: two decaying lobes
  const a = Math.sin(sway * Math.PI * 6) * 0.16 * (1 - sway * 0.35);
  const b = Math.sin(sway * Math.PI * 10 + 1.2) * 0.05 * (1 - sway * 0.5);
  g.rotation.z = a;
  g.rotation.x = b;
  return g;
}
