import * as THREE from 'three';

// scenes/props/debris.js — the small story debris, one kind, three variants:
//   coins : the mock's imagined money falling into the sea (staggered fall via { fall })
//   leaf  : the single leaf that falls by the gravestone (slow fall via { fall })
//   flock : the birds that burst up in the quake (arc via { fly })
// All motion opts-driven and deterministic. Origin at the variant's anchor.

export function build(opts) {
  const T = THREE; // imported by this file — the host passes no objects in (repair round 1)
  const o = opts || {};
  const variant = o.variant || 'coins';
  const p = (typeof o.fall === 'number') ? Math.max(0, Math.min(1, o.fall)) : (typeof o.fly === 'number') ? Math.max(0, Math.min(1, o.fly)) : 0;
  const g = new T.Group();

  if (variant === 'coins') {
    const coinM = new T.MeshStandardMaterial({ color: 0xd8a83a, roughness: 0.3, metalness: 0.8 });
    for (let i = 0; i < 4; i++) {
      const c = new T.Mesh(new T.CylinderGeometry(0.24, 0.24, 0.08, 12), coinM);
      const f = Math.min(1, Math.max(0, p * 1.25 - i * 0.16));
      const y = 3.6 * (1 - f) - 0.15 * f;
      c.position.set(i * 0.34 - 0.5, Math.max(-0.2, y), -i * 0.5);
      c.rotation.x = Math.PI / 2 + i * 0.8 + f * 3;
      c.visible = f < 0.999;
      g.add(c);
    }
    // splash rings where they meet the sea (grow with the fall's tail)
    const ringM = new T.MeshBasicMaterial({ color: 0xe8f4f6, transparent: true, opacity: 0.0, depthWrite: false, side: T.DoubleSide });
    for (let i = 0; i < 2; i++) {
      const r = new T.Mesh(new T.RingGeometry(0.2, 0.34, 14), ringM.clone());
      r.rotation.x = -Math.PI / 2;
      r.position.set(0.4 + i * 0.5, -0.1, -1.4 - i * 0.5);
      const rf = Math.min(1, Math.max(0, p * 1.6 - 0.7 - i * 0.2));
      r.scale.setScalar(0.3 + rf * 1.7);
      r.material.opacity = rf * 0.75 * (1 - rf * 0.4);
      g.add(r);
    }
    return g;
  }

  if (variant === 'leaf') {
    const leafM = new T.MeshStandardMaterial({ color: 0xc98a3a, roughness: 0.9, side: T.DoubleSide });
    const l = new T.Mesh(new T.CircleGeometry(0.16, 8), leafM);
    l.scale.set(1.6, 0.8, 1);
    const f = p;
    l.position.set(Math.sin(f * Math.PI * 3) * 0.7, 6.4 * (1 - f) + 0.3, Math.cos(f * Math.PI * 2) * 0.3);
    l.rotation.set(f * 4, f * 2.2, Math.sin(f * Math.PI * 4) * 0.8);
    g.add(l);
    return g;
  }

  // flock
  const birdM = new T.MeshStandardMaterial({ color: 0x2e343c, roughness: 0.85, side: T.DoubleSide });
  for (let i = 0; i < 5; i++) {
    const b = new T.Group();
    for (const s of [-1, 1]) {
      const wing = new T.Mesh(new T.PlaneGeometry(0.5, 0.2), birdM);
      wing.position.x = s * 0.24;
      wing.rotation.z = s * (0.5 + Math.sin(p * Math.PI * 6 + i) * 0.35);
      b.add(wing);
    }
    const fl = Math.min(1, Math.max(0, p * 1.15 - i * 0.09));
    b.position.set(-2 + i * 1.1 + fl * (2 + i), 1 + fl * (6 + i * 0.8), -fl * (14 + i * 2));
    b.rotation.y = -0.6;
    b.visible = fl > 0.02;
    g.add(b);
  }
  return g;
}
