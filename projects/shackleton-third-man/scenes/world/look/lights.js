// Light rig for the film's places. Receives THREE explicitly (no globals).
// Lights come as data from film.js world.setOpts.places:
//   { name, at: [x, z], key: { color, int }, fill: { color, int }, rim: { color, int } }
// drivers may hold intensity multipliers: { key: 1, fill: 1, rim: 1 }.
// The rig's group is mounted INTO the set's group by set.js, so every light
// (and each key light's real Object3D target) is in the scene graph and lights frames.
export function createLightRig(THREE, places = [], drivers = {}) {
  const group = new THREE.Group();
  group.name = 'lightRig';
  const made = [];

  for (const p of places) {
    if (!p || !Array.isArray(p.at)) continue;
    if (p.key && THREE.DirectionalLight) {
      const key = new THREE.DirectionalLight(p.key.color, (p.key.int ?? 1) * (drivers.key ?? 1));
      key.position.set(p.at[0] + 6, 12, p.at[1] + 8);
      // a real Object3D target, in the graph, so the direction resolves
      const target = new THREE.Object3D();
      target.name = 'keyTarget_' + p.name;
      target.position.set(p.at[0], 0, p.at[1]);
      group.add(target);
      key.target = target;
      key.userData.base = key.intensity;
      group.add(key);
      made.push(key);
    }
    if (p.fill && THREE.DirectionalLight) {
      const fill = new THREE.DirectionalLight(p.fill.color, (p.fill.int ?? 0.5) * (drivers.fill ?? 1));
      fill.position.set(p.at[0] - 8, 5, p.at[1] - 6);
      const ftarget = new THREE.Object3D();
      ftarget.name = 'fillTarget_' + p.name;
      ftarget.position.set(p.at[0], 0, p.at[1]);
      group.add(ftarget);
      fill.target = ftarget;
      fill.userData.base = fill.intensity;
      group.add(fill);
      made.push(fill);
    }
    if (p.rim && THREE.DirectionalLight) {
      const rim = new THREE.DirectionalLight(p.rim.color, (p.rim.int ?? 0.6) * (drivers.rim ?? 1));
      rim.position.set(p.at[0], 14, p.at[1] - 18); // from behind, over the far end: rim on the ice
      const rtarget = new THREE.Object3D();
      rtarget.name = 'rimTarget_' + p.name;
      rtarget.position.set(p.at[0], 0, p.at[1]);
      group.add(rtarget);
      rim.target = rtarget;
      rim.userData.base = rim.intensity;
      group.add(rim);
      made.push(rim);
    }
    if (THREE.AmbientLight) {
      const amb = new THREE.AmbientLight('#ffffff', 0.18);
      amb.position.set(p.at[0], 2, p.at[1]);
      group.add(amb);
      made.push(amb);
    }
  }

  return {
    group,
    lights: made,
    update(t) {
      // pure function of t: a driver may pulse a light's intensity over time
      for (const l of made) if (l.isDirectionalLight && drivers.pulse) l.intensity = l.userData.base;
    }
  };
}
