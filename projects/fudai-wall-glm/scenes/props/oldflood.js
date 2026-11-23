// scenes/props/oldflood.js — the remembered flood: grey old-wave slabs over the distant
// mini village in the sepia flashback. State: { in: 0..1 } opacity/height. Fetch on a cut.
function pickT(opts, THREE) {
  if (opts && opts.Group) return opts;
  if (THREE && THREE.Group) return THREE;
  if (typeof THREE !== 'undefined') return THREE;
  return null;
}

export function build(opts, THREE) {
  const T = pickT(opts, THREE);
  const o = opts || {};
  const inn = (typeof o.in === 'number') ? Math.max(0, Math.min(1, o.in)) : 1;
  const g = new T.Group();
  const waterM = new T.MeshStandardMaterial({ color: 0x5a6a62, roughness: 0.45, transparent: true, opacity: 0.85 * inn });
  // two surge slabs climbing the distant houses
  const s1 = new T.Mesh(new T.BoxGeometry(26, 1, 10), waterM);
  s1.scale.y = 1.6 + inn * 0.6; s1.position.set(0, (1.6 + inn * 0.6) / 2, 0); g.add(s1);
  const s2 = new T.Mesh(new T.BoxGeometry(20, 1, 8), waterM);
  s2.scale.y = 2.4 + inn * 0.8; s2.position.set(-9, (2.4 + inn * 0.8) / 2, -7); g.add(s2);
  // white foam flecks on the surge (deterministic)
  const foamM = new T.MeshStandardMaterial({ color: 0xdfe8e2, roughness: 0.5, transparent: true, opacity: 0.8 * inn });
  for (let i = 0; i < 8; i++) {
    const f = new T.Mesh(new T.SphereGeometry(0.34 + (i % 3) * 0.12, 7, 7), foamM);
    f.position.set(-11 + (i * 3.1) % 22, (1.6 + inn * 0.6) * (0.85 + (i % 2) * 0.18), -2 + (i % 3) * 2.4);
    f.scale.y = 0.4; g.add(f);
  }
  // streaks running down from windows (the swallow read)
  const streakM = new T.MeshBasicMaterial({ color: 0x4a5a52, transparent: true, opacity: 0.35 * inn, depthWrite: false });
  for (let i = 0; i < 5; i++) {
    const st = new T.Mesh(new T.PlaneGeometry(0.28, 2.6), streakM);
    st.position.set(-8 + i * 4.4, 3.4, 5.1); g.add(st);
  }
  return g;
}
