import * as THREE from 'three';

// scenes/props/stormclouds.js — the storm arriving (and parting): three dark cloud layers
// over the village plus faint rain streaks. State: { fade: 0..1 } arrival, { part: 0..1 } opening.

export function build(opts) {
  const T = THREE; // imported by this file — the host passes no objects in (repair round 1)
  const o = opts || {};
  const inn = (typeof o.fade === 'number') ? Math.max(0, Math.min(1, o.fade)) : 1;
  const part = (typeof o.part === 'number') ? Math.max(0, Math.min(1, o.part)) : 0;
  const g = new T.Group();
  const cloudM = (op) => new T.MeshStandardMaterial({ color: 0x3a4450, roughness: 1, transparent: true, opacity: op, depthWrite: false });
  const layers = [
    { y: 27, r: 15, n: 7, op: 0.92, x: 0, z: -12 },
    { y: 31, r: 19, n: 9, op: 0.85, x: 2, z: -16 },
    { y: 35, r: 24, n: 11, op: 0.7, x: -3, z: -20 },
  ];
  layers.forEach((L, li) => {
    const grp = new T.Group();
    for (let i = 0; i < L.n; i++) {
      const p = new T.Mesh(new T.SphereGeometry(L.r * (0.5 + (i % 3) * 0.18), 9, 8), cloudM(L.op * inn));
      const a = (i / L.n) * Math.PI * 2 + li;
      p.position.set(Math.cos(a) * L.r * 0.8 + (part * (li % 2 === 0 ? 1 : -1) * (4 + i)), L.y + (i % 3) * 1.2, Math.sin(a) * L.r * 0.55);
      p.scale.y = 0.42; grp.add(p);
    }
    g.add(grp);
  });
  // rain streaks (thin, limited to the sky region, never near faces)
  const rainM = new T.MeshBasicMaterial({ color: 0xaebfca, transparent: true, opacity: 0.3 * inn * (1 - part), depthWrite: false, side: T.DoubleSide });
  for (let i = 0; i < 14; i++) {
    const s = new T.Mesh(new T.PlaneGeometry(0.07, 2.6), rainM);
    s.position.set(-16 + ((i * 3.7) % 32) - part * (i % 3) * 5, 20 + ((i * 1.9) % 8), -8 - ((i * 1.3) % 12));
    s.rotation.z = 0.16; g.add(s);
  }
  // the warm gap when parting (the sun shaft's hole in the clouds)
  if (part > 0.05) {
    const glowM = new T.MeshBasicMaterial({ color: 0xffdf9e, transparent: true, opacity: 0.34 * part, depthWrite: false, side: T.DoubleSide, fog: false });
    const gap = new T.Mesh(new T.CircleGeometry(9, 20), glowM);
    gap.position.set(part * 2, 33, -14); gap.rotation.x = Math.PI / 2.6; g.add(gap);
    const shaft = new T.Mesh(new T.PlaneGeometry(7, 26), new T.MeshBasicMaterial({ color: 0xffe6b0, transparent: true, opacity: 0.16 * part, depthWrite: false, side: T.DoubleSide, fog: false }));
    shaft.position.set(part * 1.5, 16, -9); shaft.rotation.z = 0.12; g.add(shaft);
  }
  return g;
}
