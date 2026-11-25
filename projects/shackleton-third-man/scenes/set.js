// Build-stage previz set: four real places, 400 D apart, real depth + practicals.
// Simple geometry at true D so depth, marks and camera choices are honest from shot 1.
// Hero detail (Blender data in assets/set/) arrives in the Environment overhaul.
// THREE is received explicitly — no bare globals anywhere in this file.
import { createLightRig } from './world/look/lights.js';

const SNOW = '#dfe9f2';
const SEA = '#0c2028';
const WOOD = '#6b5640';

function p(THREE, name, build) {
  const g = new THREE.Group();
  g.name = name;
  build(THREE, g);
  return g;
}

// A: unmapped ice slopes, white night (origin [0,0])
// Practicals the Bible promises: the moon disc + its rim-light (rig), the men's
// headlamps and the hand lantern — visible geometry, lit from the rig.
function placeA(THREE, g) {
  const mat = new THREE.MeshLambertMaterial({ color: SNOW });
  const ridge = new THREE.Mesh(new THREE.BoxGeometry(90, 3, 14), mat);
  ridge.position.set(0, -1.5, 0); ridge.rotation.set(0.06, 0.35, 0.12); g.add(ridge);
  for (let i = 0; i < 7; i++) {
    const hump = new THREE.Mesh(new THREE.SphereGeometry(3 + (i % 3), 12, 8), mat);
    hump.position.set(-30 + i * 9, 1.2 + (i % 2), -8 - (i % 3) * 6);
    hump.scale.y = 0.5; g.add(hump);
  }
  const far = new THREE.Mesh(new THREE.BoxGeometry(120, 8, 8), mat);
  far.position.set(25, 3, -60); far.rotation.y = 0.2; g.add(far); // the far saddle at 60 D, inside shot 0's frustum
  // the moon disc: a small bright sphere high over the far end, placed inside shot 0's frustum
  // (camera [-2.6,2.05,6.6] -> [0.15,2.28,0.5], fov 42: elevation <= ~18 deg, |az| <= ~12 deg)
  const moon = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 12),
    new THREE.MeshBasicMaterial({ color: '#f3f7ff' }));
  moon.name = 'moon'; moon.position.set(14, 12, -30); g.add(moon);
  // the men's headlamps: two warm points on the trek line, with stub beams
  for (const [x, z] of [[-0.5, 3.2], [7, -1]]) {
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6),
      new THREE.MeshBasicMaterial({ color: '#ffe9b0' }));
    lamp.name = 'headlamp_' + x; lamp.position.set(x, 2.5, z); g.add(lamp);
    const beam = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2.6, 8, 1, true),
      new THREE.MeshBasicMaterial({ color: '#fff3cf', transparent: true, opacity: 0.22, side: THREE.DoubleSide }));
    beam.name = 'beam_' + x; beam.position.set(x + 0.5, 2.3, z + 1.2);
    beam.rotation.x = Math.PI / 2 - 0.1; g.add(beam);
  }
  // the hand lantern of the man behind: a warm pool low on the snow, inside shot 0's frustum
  // (left of the figure, between camera and face — a visible warm practical in the opening frame)
  const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8),
    new THREE.MeshBasicMaterial({ color: '#ffcf8a' }));
  lantern.name = 'handLantern'; lantern.position.set(0.6, 0.9, 1.6); g.add(lantern);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(1.6, 16),
    new THREE.MeshBasicMaterial({ color: '#c98f4a', transparent: true, opacity: 0.28 }));
  pool.name = 'lanternPool'; pool.rotation.x = -Math.PI / 2; pool.position.set(0.6, 0.02, 1.6); g.add(pool);
}

// B: the James Caird on the South Ocean (origin [400,0])
function placeB(THREE, g) {
  const sea = new THREE.Mesh(new THREE.BoxGeometry(400, 1, 400),
    new THREE.MeshLambertMaterial({ color: SEA }));
  sea.position.y = -0.5; g.add(sea);
  const hull = new THREE.Mesh(new THREE.BoxGeometry(11, 1.6, 3.4),
    new THREE.MeshLambertMaterial({ color: WOOD }));
  hull.name = 'boat'; hull.position.y = 1.1; g.add(hull);
  for (let i = 0; i < 5; i++) { // swells running toward the camera
    const sw = new THREE.Mesh(new THREE.CapsuleGeometry(1.2, 40, 4, 8),
      new THREE.MeshLambertMaterial({ color: '#16323d' }));
    sw.rotation.z = Math.PI / 2; sw.position.set(0, -0.1, 12 + i * 14);
    sw.name = 'swell' + i; g.add(sw);
  }
}

// C: snow shelf on the crossing, storm light (origin [400,-400]); fire state for lines 4+
function placeC(THREE, g) {
  const mat = new THREE.MeshLambertMaterial({ color: '#cdd6e2' });
  const slope = new THREE.Mesh(new THREE.BoxGeometry(80, 2, 60), mat);
  slope.position.set(0, -2, -20); slope.rotation.x = -0.35; g.add(slope);
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(16, 1, 8), mat);
  shelf.position.set(0, 0.4, 0); g.add(shelf);
  for (let i = 0; i < 4; i++) { // rock ribs breaking the snow
    const rib = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 1.4),
      new THREE.MeshLambertMaterial({ color: '#5a5f68' }));
    rib.position.set(-14 + i * 9, 1, -10 - i * 4); rib.rotation.z = 0.15 * (i % 2 ? -1 : 1); g.add(rib);
  }
  const fire = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.1, 8), // the visible practical
    new THREE.MeshBasicMaterial({ color: '#ff9a3c' }));
  fire.name = 'fire'; fire.position.set(2.5, 0.95, 1); g.add(fire);
}

// D: Stromness whalers' quarters, lamplit (origin [-400,0])
function placeD(THREE, g) {
  const wallMat = new THREE.MeshLambertMaterial({ color: '#4a4038' });
  const floor = new THREE.Mesh(new THREE.BoxGeometry(20, 0.4, 10),
    new THREE.MeshLambertMaterial({ color: '#5c4a36' }));
  g.add(floor);
  const back = new THREE.Mesh(new THREE.BoxGeometry(20, 4.4, 0.4), wallMat);
  back.position.set(0, 2.2, -5); g.add(back);
  for (const x of [-6, 6]) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.4, 10), wallMat);
    wall.position.set(x, 2.2, 0); g.add(wall);
  }
  const table = new THREE.Mesh(new THREE.BoxGeometry(12, 0.3, 2.2),
    new THREE.MeshLambertMaterial({ color: WOOD }));
  table.position.set(0, 1.1, -1); g.add(table);
  for (const x of [-3.5, 3.5]) { // pendant lamps over the table
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 8),
      new THREE.MeshBasicMaterial({ color: '#ffcf8a' }));
    lamp.name = 'lamp' + x; lamp.position.set(x, 3.1, -1); g.add(lamp);
    const cord = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.2, 0.06),
      new THREE.MeshLambertMaterial({ color: '#221d18' }));
    cord.position.set(x, 3.8, -1); g.add(cord);
  }
  const win = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.6), // cold dawn window at the far end
    new THREE.MeshBasicMaterial({ color: '#9fc2d8' }));
  win.name = 'farWindow'; win.position.set(0, 2.2, -4.78); g.add(win);
}

// Places 400 D apart: [0,0] A, [400,0] B, [400,-400] C, [-400,0] D
const OFFSETS = { A: [0, 0], B: [400, 0], C: [400, -400], D: [-400, 0] };
const PLACES = { A: placeA, B: placeB, C: placeC, D: placeD };

export async function buildSet(THREE, scene, opts, kit) {
  const base = kit ? kit('plain', opts) : { group: new THREE.Group(), update() {} };
  const rig = createLightRig(THREE, (opts && opts.places) || [], (opts && opts.drivers) || {});
  for (const [name, [x, z]] of Object.entries(OFFSETS)) {
    const grp = p(THREE, name, PLACES[name]);
    grp.position.set(x, 0, z);
    base.group.add(grp);
  }
  // the rig lives IN the set's group: buildFilmSet adds set.group to the scene,
  // so the lights and their Object3D targets are in the graph and light frames
  base.group.add(rig.group);
  return { ...base, rig, points: {}, update(t) { base.update?.(t); rig.update(t); } };
}
