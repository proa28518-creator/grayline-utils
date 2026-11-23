import * as THREE from 'three';

// scenes/props/sunmoon.js — the time-lapse wheel: sun on one end, moon on the other,
// spinning around a pivot. State: { spin: 0..2.4 } turns. Origin at the pivot.

export function build(opts) {
  const T = THREE; // imported by this file — the host passes no objects in (repair round 1)
  const o = opts || {};
  const spin = (typeof o.spin === 'number') ? o.spin : 0;
  const g = new T.Group();
  const wheel = new T.Group();
  const R = 18;
  // sun disc
  const sun = new T.Mesh(new T.CircleGeometry(2.6, 20), new T.MeshBasicMaterial({ color: 0xffdf9e, fog: false }));
  sun.position.set(0, R, 0); wheel.add(sun);
  const halo = new T.Mesh(new T.RingGeometry(3.0, 4.4, 20), new T.MeshBasicMaterial({ color: 0xffcf8a, transparent: true, opacity: 0.35, fog: false, depthWrite: false, side: T.DoubleSide }));
  halo.position.set(0, R, -0.1); wheel.add(halo);
  // moon disc with craters
  const moonG = new T.Group();
  moonG.add(new T.Mesh(new T.CircleGeometry(2.0, 18), new T.MeshBasicMaterial({ color: 0xe8e4da, fog: false })));
  const craterM = new T.MeshBasicMaterial({ color: 0xc8c4ba, fog: false });
  for (const [cx, cy, r] of [[-0.6, 0.5, 0.4], [0.5, -0.3, 0.3], [0.1, 0.7, 0.24]]) {
    const cr = new T.Mesh(new T.CircleGeometry(r, 10), craterM);
    cr.position.set(cx, cy, 0.02); moonG.add(cr);
  }
  moonG.position.set(0, -R, 0);
  wheel.add(moonG);
  // thin arm connecting them
  const arm = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, R * 2, 6), new T.MeshBasicMaterial({ color: 0xfff2d0, transparent: true, opacity: 0.16, fog: false, depthWrite: false }));
  wheel.add(arm);
  // two season swatches riding the wheel (spring green / winter pale) — the member's "seasons"
  const season = new T.Mesh(new T.RingGeometry(R - 0.5, R + 0.1, 24, 1, 0.4, 1.1), new T.MeshBasicMaterial({ color: 0x9ac27a, transparent: true, opacity: 0.4, fog: false, depthWrite: false, side: T.DoubleSide }));
  wheel.add(season);
  const season2 = new T.Mesh(new T.RingGeometry(R - 0.5, R + 0.1, 24, 1, 3.6, 1.1), new T.MeshBasicMaterial({ color: 0xdce4ea, transparent: true, opacity: 0.4, fog: false, depthWrite: false, side: T.DoubleSide }));
  wheel.add(season2);
  wheel.rotation.z = -spin * Math.PI;
  g.add(wheel);
  return g;
}
