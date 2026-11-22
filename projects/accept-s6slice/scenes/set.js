// scenes/set.js — "The Ring That Rolled Away" (Foundation Run 13, Stage 2):
// ENVIRONMENT-OVERHAUL + Post/Shading foundation, per references/sets.md.
// The kit city_street set, wrapped — never replaced — with a light rig
// (lights as data) so Post (scenes/post.js) and Shading (scenes/shade.js)
// can run, exactly as Run 6 wrapped the park kit for the Watchman.
//
// ADAPTATION, logged honestly: their Environment step as written is a
// three-track Blender crew (env-blender / env-textures / env-three) building
// a GLB set in the app's Flow pipeline. That crew route is not available
// here — no app, no Flow — so the overhaul is done IN-ENGINE, the same
// adaptation the desk used for every earlier run: the kit set stays, and
// the added depth/detail is modelled with the engine's own prop kit
// (engine/props/_kit.js flat fills + ink outline, the film's own house
// style) as a dressing group against the back wall, plus a light rig.
// Nothing in the kit geometry, its marks, or its sky is touched.
//
// What the dressing adds (all at z <= -2.2, against the back wall, clear of
// every walk lane z 1.2-2.6 and every camera flight line z 5-15, and all
// under 1.2 D tall except two far-end trees whose crowns sit above head
// height): crates + a barrel by the cafe wall, a wooden bench, planters
// with green crowns along the wall base, and a street tree at each far end
// — so the shots that look along the street now have modelled depth behind
// the faces instead of a bare plaster wall. The kit's own depth (CAFE and
// BOOKS shopfronts, awning, kerb, road, far wall at z -14, the lamp post
// at [8.2, 5.2]) is untouched.
import { createLightRig } from '../world/look/lights.js';
import { createPost } from '../world/look/post.js';
import { createRigShade } from '../world/look/rigshade.js';
import { THREE, flat, part } from '../engine/props/_kit.js';

const PLACES = {
  street: {
    // bright day: a high blue sky over warm paving
    sky: [0.45, 0.55, 0.78],
    ground: [0.38, 0.34, 0.29],
    fog: { color: '#bcd4e6', density: 0.004 },
    ao: { floor: 0, h: 1.6, amt: 0.25 },
    lights: [
      // the day sun: warm-white, from the kit sun's own side
      // ([-0.5, 0.74, 0.45] in world/sets.js) — the rig agrees with the
      // shadows the kit already draws. The key light everywhere.
      { id: 'sun', kind: 'sun', dir: [-0.5, 0.74, 0.45], color: [1.0, 0.95, 0.85], power: 1.0, wrap: 0.3 },
      // the kit street lamp at [8.2, 5.2, h 6.8]: a visible practical. By
      // day it is a gentle warm fill at the plaza end, NOT the key — its
      // power stays low so the post air never blooms it.
      { id: 'lamp', kind: 'point', pos: [8.2, 6.8, 5.2], color: [1.0, 0.85, 0.6], power: 1.2, fall: 0.05, range: 20, wrap: 0.25 },
      // cool water glint over the fountain basin at the plaza end.
      { id: 'fountain', kind: 'point', pos: [11.6, 2.2, 2.6], color: [0.75, 0.9, 1.0], power: 0.6, fall: 0.08, range: 12, wrap: 0.25 },
    ],
  },
};

function buildDressing() {
  const g = new THREE.Group();
  const wood = flat('#a8784c'), woodDark = flat('#7a5a38');
  const crate = flat('#b08d5a'), leaf = flat('#5a8a4a'), leafDark = flat('#3f6a38');
  const stone = flat('#9a938a'), iron = flat('#3a4a5a');
  const add = (geo, mat, x, y, z, ry = 0, w = 0.02) => {
    const m = part(geo, mat, w);
    m.position.set(x, y, z); m.rotation.y = ry; g.add(m); return m;
  };
  // crates + barrel against the cafe wall (left of the CAFE shopfront)
  add(new THREE.BoxGeometry(0.7, 0.7, 0.7), crate, -5.6, 0.35, -2.55, 0.2);
  add(new THREE.BoxGeometry(0.55, 0.55, 0.55), crate, -4.85, 0.28, -2.6, -0.15);
  add(new THREE.BoxGeometry(0.5, 0.5, 0.5), woodDark, -5.25, 0.95, -2.55, 0.4);
  add(new THREE.CylinderGeometry(0.32, 0.36, 0.85, 14), iron, -3.4, 0.43, -2.6);
  // wooden bench against the wall between the shops
  add(new THREE.BoxGeometry(2.2, 0.12, 0.6), wood, 0.2, 0.55, -2.55);
  add(new THREE.BoxGeometry(0.12, 0.55, 0.55), woodDark, -0.8, 0.28, -2.55);
  add(new THREE.BoxGeometry(0.12, 0.55, 0.55), woodDark, 1.2, 0.28, -2.55);
  add(new THREE.BoxGeometry(2.2, 0.5, 0.1), wood, 0.2, 0.85, -2.8);
  // planters with green crowns along the wall base (right of the bench)
  for (const [x, s] of [[3.6, 1.0], [5.2, 0.8], [-9.5, 0.9]]) {
    add(new THREE.BoxGeometry(0.7 * s, 0.45, 0.5), stone, x, 0.23, -2.6);
    const c = add(new THREE.SphereGeometry(0.42 * s, 12, 10), leaf, x, 0.62, -2.6);
    c.scale.y = 0.75;
    add(new THREE.SphereGeometry(0.3 * s, 10, 8), leafDark, x + 0.25 * s, 0.55, -2.55);
  }
  // street trees at the far ends, crowns above head height
  for (const x of [-12.5, 15.2]) {
    add(new THREE.CylinderGeometry(0.14, 0.2, 2.6, 10), woodDark, x, 1.3, -2.5);
    const c1 = add(new THREE.SphereGeometry(1.1, 12, 10), leaf, x, 3.1, -2.5);
    c1.scale.y = 0.85;
    add(new THREE.SphereGeometry(0.75, 10, 8), leafDark, x + 0.7, 2.7, -2.5);
  }
  g.traverse(m => { m.frustumCulled = false; });
  return g;
}

export async function buildSet(THREE, scene, opts, kit) {
  const base = kit('city_street', opts);
  const rig = createLightRig(THREE, PLACES);
  const look = opts.post ? createPost(THREE, rig, opts.post) : undefined;
  if (look && opts.post.shade) look.shading = createRigShade(THREE, rig, opts.post.shade);
  base.group.add(buildDressing());
  return {
    ...base,
    // the city_street kit's own marks, written out in full (they are
    // base.marks, unchanged): the film resolver reads this literal from
    // the file text for staging marks.
    marks: { door1: [-9.8, -2.2], door2: [9.8, -2.2], window1: [-4.6, -1.4], window2: [4.6, -1.4], center: [0, 1.2], a: [-1.4, 1.2], b: [1.4, 1.2], kerb: [0, 5.4], lamp: [7.4, 4.4], enter_l: [-14, 2], enter_r: [14, 2] },
    points: { ...base.points },
    rig,
    look,
    update(t) { base.update?.(t); rig.update(t); },
  };
}
