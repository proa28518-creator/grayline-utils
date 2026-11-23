// Seat: Roro / Muse (lane 4) — Fudai Wall Build pass, 2026-11-23.
// Method source: cartoon-shorts tree only. «Production and rules» not touched.
// THREE is imported by this file (repair round 2026-11-23, office): the host does
// not pass THREE to props, so the file imports it itself, like Neon's props.
// function of opts; state is re-built by the engine from opts over time.
// Units: D (1 D = 1 head; D = metres x 1.6). Origin: the tied stems' base
// (the grip — the bouquet is held, then laid on the grave).
// The flowers laid on the grave (line 24: "راحوا قبره يشكروه").
// opts: { count: 4, open: 0..1 } — 0 = buds, 1 = open blooms.
// Note: a built-in `flowers` kind exists in the engine; this is the film's own
// bouquet (white blossoms + red ribbon) so the grave flowers read as one prop.

import * as THREE from 'three';

export function build(opts = {}) {
  const count = opts.count ?? 4;
  const open = opts.open ?? 1; // 0 = buds, 1 = open blooms

  const root = new THREE.Group();
  const inner = new THREE.Group();
  root.add(inner);

  const stemMat = new THREE.MeshStandardMaterial({ color: 0x3e7a2e, roughness: 0.8 });
  const petalMat = new THREE.MeshStandardMaterial({ color: 0xfdf6ec, roughness: 0.7 });
  const petalPink = new THREE.MeshStandardMaterial({ color: 0xf2b8c6, roughness: 0.7 });
  const centreMat = new THREE.MeshStandardMaterial({ color: 0xf2c200, roughness: 0.6 });
  const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xc23b2e, roughness: 0.6 });

  const H = 1.2; // ~0.75 m tall bouquet

  for (let i = 0; i < count; i++) {
    const flower = new THREE.Group();
    const spread = (i - (count - 1) / 2) * 0.22;
    // stem, fanned slightly outward
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, H, 6), stemMat);
    stem.position.y = H / 2;
    stem.rotation.z = -spread * 0.5;
    flower.add(stem);
    // blossom: 5 petals around a yellow centre, opening with `open`
    const bloom = new THREE.Group();
    bloom.position.set(spread, H + 0.1, 0);
    const bloomScale = 0.45 + 0.55 * open;
    bloom.scale.setScalar(bloomScale);
    const centre = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), centreMat);
    bloom.add(centre);
    for (let p = 0; p < 5; p++) {
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6), p % 2 ? petalPink : petalMat);
      petal.scale.set(1, 0.45, 1);
      const a = (p / 5) * Math.PI * 2;
      petal.position.set(Math.cos(a) * 0.16, 0, Math.sin(a) * 0.16);
      petal.rotation.y = -a;
      bloom.add(petal);
    }
    // a small leaf on the stem
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), stemMat);
    leaf.scale.set(1.6, 0.4, 0.8);
    leaf.position.set(spread * 0.5, H * 0.55, 0.06);
    leaf.rotation.z = 0.6;
    flower.add(leaf);
    flower.add(bloom);
    inner.add(flower);
  }

  // red ribbon tying the stems at the grip
  const ribbon = new THREE.Mesh(
    new THREE.TorusGeometry(0.16, 0.05, 8, 16),
    ribbonMat
  );
  ribbon.rotation.x = Math.PI / 2;
  ribbon.position.y = 0.12;
  inner.add(ribbon);
  const bowA = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.3, 4), ribbonMat);
  bowA.position.set(0.2, 0.12, 0);
  bowA.rotation.z = -Math.PI / 2;
  inner.add(bowA);
  const bowB = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.3, 4), ribbonMat);
  bowB.position.set(-0.2, 0.12, 0);
  bowB.rotation.z = Math.PI / 2;
  inner.add(bowB);

  root.userData = {
    title: 'Flowers — thanks',
    headline: 'شكراً',
    open,
    count,
    inner,
  };
  return root;
}
