import { createLightRig } from '../world/look/lights.js';
import { createKit } from '../world/look/rigkit.js';

const D = 1.6;
const PLACES = [
  { name: 'coast', at: [0, 0], far: 26, sky: [0.92, 0.88, 0.78], ground: [0.55, 0.5, 0.45], fog: { color: '#e8e0d0', density: 0.006 }, practicals: [['lantern1', [6, 0, -10]], ['lantern2', [-6, 0, -14]]] },
  { name: 'square', at: [400, 0], far: 28, sky: [0.94, 0.9, 0.82], ground: [0.5, 0.46, 0.4], fog: { color: '#e8e0d0', density: 0.0055 }, practicals: [['stringLamp', [4, 0, -12]], ['hallWindow', [-4, 2, -16]]] },
  { name: 'construction', at: [400, -400], far: 30, sky: [0.95, 0.91, 0.84], ground: [0.58, 0.54, 0.48], fog: { color: '#e8e0d0', density: 0.005 }, practicals: [['rigLamp', [3, 2, -14]], ['screenLight', [-3, 1.5, -18]]] },
  { name: 'coastComparison', at: [-400, 0], far: 32, sky: [0.93, 0.89, 0.8], ground: [0.53, 0.49, 0.43], fog: { color: '#e8e0d0', density: 0.0058 }, practicals: [['wallLamp', [5, 0.5, -14]], ['houseLight', [-5, 1.2, -18]]] },
  { name: 'squareLater', at: [800, 0], far: 28, sky: [0.86, 0.82, 0.72], ground: [0.46, 0.42, 0.38], fog: { color: '#d8d0c0', density: 0.0065 }, practicals: [['signBacklight', [4, 1.8, -12]], ['hallWindow2', [-4, 2, -16]]] },
  { name: 'finishedWall', at: [800, -400], far: 30, sky: [0.9, 0.86, 0.76], ground: [0.56, 0.52, 0.46], fog: { color: '#e8e0d0', density: 0.0055 }, practicals: [['gateLantern1', [2, 0.8, -12]], ['gateLantern2', [-2, 0.8, -12]]] },
  { name: 'townHallExit', at: [-400, -400], far: 25, sky: [0.84, 0.8, 0.72], ground: [0.48, 0.44, 0.4], fog: { color: '#d8d0c0', density: 0.006 }, practicals: [['deskLamp', [0, 1.6, -10]], ['streetPanel', [3, 1.2, -14]]] },
  { name: 'graveHill', at: [-800, 0], far: 35, sky: [0.78, 0.72, 0.66], ground: [0.44, 0.4, 0.36], fog: { color: '#c8c0b8', density: 0.007 }, practicals: [['graveLantern', [-2, 0.6, -18]], ['villageLight', [2, 0.4, -30]]] },
  { name: 'villageStreet', at: [-800, -400], far: 28, sky: [0.6, 0.62, 0.7], ground: [0.42, 0.44, 0.46], fog: { color: '#a8b0c0', density: 0.02 }, practicals: [['houseLamp', [1, 1.4, -10]], ['streetFlicker', [-3, 1.2, -14]]] },
  { name: 'coastline', at: [-400, 400], far: 40, sky: [0.58, 0.6, 0.68], ground: [0.4, 0.42, 0.44], fog: { color: '#98a0b0', density: 0.022 }, practicals: [['pierLantern', [4, 0.6, -22]], ['boatLight', [-4, 0.5, -26]]] },
  { name: 'flashbackHill', at: [0, 400], far: 35, sky: [0.96, 0.88, 0.7], ground: [0.6, 0.52, 0.42], fog: { color: '#f0e0c0', density: 0.005 }, practicals: [['hillLantern', [0, 1, -16]], ['windowLight', [-3, 1.4, -20]]] },
  { name: 'rock', at: [400, 400], far: 14, sky: [0.94, 0.86, 0.68], ground: [0.58, 0.5, 0.42], fog: { color: '#e8d8b8', density: 0.006 }, practicals: [['rockLamp', [1, 0.8, -8]]] },
  { name: 'room', at: [800, 400], far: 14, sky: [0.92, 0.86, 0.78], ground: [0.55, 0.5, 0.44], fog: { color: '#e8e0d0', density: 0.004 }, practicals: [['deskLamp2', [0, 1.6, -8]], ['roomWindow', [-2, 2, -12]]] },
  { name: 'wallTop', at: [1200, 0], far: 28, sky: [0.9, 0.86, 0.76], ground: [0.56, 0.52, 0.46], fog: { color: '#e8e0d0', density: 0.0055 }, practicals: [['workLamp1', [2, 1, -12]], ['workLamp2', [-2, 1, -12]]] },
  { name: 'neighbouringTowns', at: [1200, -400], far: 45, sky: [0.56, 0.58, 0.66], ground: [0.4, 0.42, 0.44], fog: { color: '#98a0b0', density: 0.024 }, practicals: [['lowWallLamp', [3, 0.6, -22]], ['townLight', [-3, 0.5, -26]]] },
  { name: 'wallImpact', at: [1600, 0], far: 30, sky: [0.5, 0.52, 0.6], ground: [0.44, 0.46, 0.48], fog: { color: '#8890a0', density: 0.026 }, practicals: [['impactLamp1', [2, 0.8, -12]], ['impactLamp2', [-2, 0.8, -12]]] }
];

const LIGHTS = {
  coast: [
    { id: 'lantern1', kind: 'point', color: '#ffd699', power: 45, pos: [6, 2.6, -10], fall: 0.06, range: 14, wrap: 0.2 },
    { id: 'lantern2', kind: 'point', color: '#ffd699', power: 40, pos: [-6, 2.4, -14], fall: 0.06, range: 14, wrap: 0.2 },
    { id: 'sunCoast', kind: 'sun', color: '#ffe2a8', power: 85, dir: [0.4, -0.6, 0.8], fall: 0.04, range: 60, cone: [0, 0], wrap: 0.1 }
  ],
  square: [
    { id: 'stringLamp', kind: 'point', color: '#ffe2a8', power: 50, pos: [4, 3.2, -12], fall: 0.06, range: 16, wrap: 0.2 },
    { id: 'hallWindow', kind: 'spot', color: '#ffd699', power: 60, pos: [-4, 2.6, -16], dir: [0, -0.3, 1], fall: 0.05, range: 20, cone: [30, 60], wrap: 0.15 }
  ],
  construction: [
    { id: 'rigLamp', kind: 'spot', color: '#ffe2a8', power: 70, pos: [3, 4, -14], dir: [0, -0.5, 1], fall: 0.05, range: 24, cone: [35, 65], wrap: 0.15 },
    { id: 'screenLight', kind: 'point', color: '#ffd699', power: 55, pos: [-3, 2.2, -18], fall: 0.06, range: 18, wrap: 0.2 }
  ],
  coastComparison: [
    { id: 'wallLamp', kind: 'point', color: '#ffd699', power: 45, pos: [5, 2.2, -14], fall: 0.06, range: 14, wrap: 0.2 },
    { id: 'houseLight', kind: 'point', color: '#ffe2a8', power: 50, pos: [-5, 2, -18], fall: 0.06, range: 16, wrap: 0.2 }
  ],
  squareLater: [
    { id: 'signBacklight', kind: 'spot', color: '#ffb347', power: 65, pos: [4, 2.6, -12], dir: [0, -0.3, 1], fall: 0.05, range: 20, cone: [30, 60], wrap: 0.15 },
    { id: 'hallWindow2', kind: 'point', color: '#ffd699', power: 55, pos: [-4, 2.6, -16], fall: 0.06, range: 18, wrap: 0.2 }
  ],
  finishedWall: [
    { id: 'gateLantern1', kind: 'point', color: '#ffd699', power: 50, pos: [2, 2.6, -12], fall: 0.06, range: 16, wrap: 0.2 },
    { id: 'gateLantern2', kind: 'point', color: '#ffd699', power: 50, pos: [-2, 2.6, -12], fall: 0.06, range: 16, wrap: 0.2 }
  ],
  townHallExit: [
    { id: 'deskLamp', kind: 'spot', color: '#ffe2a8', power: 55, pos: [0, 2, -10], dir: [0, -0.4, 1], fall: 0.05, range: 18, cone: [30, 60], wrap: 0.15 },
    { id: 'streetPanel', kind: 'point', color: '#e8e0d0', power: 40, pos: [3, 1.4, -14], fall: 0.06, range: 14, wrap: 0.2 }
  ],
  graveHill: [
    { id: 'graveLantern', kind: 'point', color: '#ffd699', power: 45, pos: [-2, 1.4, -18], fall: .06, range: 16, wrap: 0.2 },
    { id: 'villageLight', kind: 'point', color: '#ffe2a8', power: 35, pos: [2, 1.2, -30], fall: .06, range: 22, wrap: 0.2 }
  ],
  villageStreet: [
    { id: 'houseLamp', kind: 'point', color: '#c8d0e8', power: 40, pos: [1, 2, -10], fall: 0.06, range: 14, wrap: 0.2 },
    { id: 'streetFlicker', kind: 'point', color: '#c8d0e8', power: 35, pos: [-3, 1.6, -14], fall: 0.06, range: 12, wrap: 0.2, drive: 'flicker' }
  ],
  coastline: [
    { id: 'pierLantern', kind: 'point', color: '#c8d0e8', power: 45, pos: [4, 1.6, -22], fall: 0.06, range: 20, wrap: 0.2 },
    { id: 'boatLight', kind: 'point', color: '#c8d0e8', power: 40, pos: [-4, 1.4, -26], fall: 0.06, range: 18, wrap: 0.2 }
  ],
  flashbackHill: [
    { id: 'hillLantern', kind: 'point', color: '#ffe2a8', power: 50, pos: [0, 1.8, -16], fall: 0.06, range: 20, wrap: 0.2 },
    { id: 'windowLight', kind: 'point', color: '#ffd699', power: 45, pos: [-3, 2.2, -20], fall: 0.06, range: 16, wrap: 0.2 }
  ],
  rock: [
    { id: 'rockLamp', kind: 'point', color: '#ffe2a8', power: 55, pos: [1, 1.6, -8], fall: 0.06, range: 14, wrap: 0.2 }
  ],
  room: [
    { id: 'deskLamp2', kind: 'spot', color: '#ffe2a8', power: 50, pos: [0, 2, -8], dir: [0, -0.4, 1], fall: 0.05, range: 16, cone: [30, 60], wrap: 0.15 },
    { id: 'roomWindow', kind: 'point', color: '#ffd699', power: 50, pos: [-2, 2.6, -12], fall: 0.06, range: 16, wrap: 0.2 }
  ],
  wallTop: [
    { id: 'workLamp1', kind: 'point', color: '#ffe2a8', power: 60, pos: [2, 2, -12], fall: 0.06, range: 18, wrap: 0.2 },
    { id: 'workLamp2', kind: 'point', color: '#ffe2a8', power: 60, pos: [-2, 2, -12], fall: 0.06, range: 18, wrap: 0.2 }
  ],
  neighbouringTowns: [
    { id: 'lowWallLamp', kind: 'point', color: '#c8d0e8', power: 40, pos: [3, 1.6, -22], fall: 0.06, range: 18, wrap: 0.2 },
    { id: 'townLight', kind: 'point', color: '#c8d0e8', power: 35, pos: [-3, 1.4, -26], fall: 0.06, range: 16, wrap: 0.2 }
  ],
  wallImpact: [
    { id: 'impactLamp1', kind: 'point', color: '#c8d0e8', power: 55, pos: [2, 2.4, -12], fall: 0.06, range: 18, wrap: 0.2 },
    { id: 'impactLamp2', kind: 'point', color: '#c8d0e8', power: 55, pos: [-2, 2.4, -12], fall: 0.06, range: 18, wrap: 0.2 }
  ]
};

const DRIVERS = {
  flicker: (t) => { const s = Math.sin(t * 14) * 0.12 + Math.sin(t * 37) * 0.05; return 1 + s; }
};

export async function buildSet(THREE, scene, opts, kit) {
  const base = kit('plain', opts);
  const placesGroup = new THREE.Group();
  placesGroup.name = 'places';
  base.group.add(placesGroup);

  const placeMeshes = {};
  const placeFogs = {};
  const placeDomes = {};

  PLACES.forEach((place) => {
    const [px, pz] = place.at;
    const placeGroup = new THREE.Group();
    placeGroup.name = place.name;
    placesGroup.add(placeGroup);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({ color: 0x4a443a, roughness: 0.9 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(px, 0, pz);
    floor.name = place.name + '_floor';
    placeGroup.add(floor);

    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(60, 20, 1),
      new THREE.MeshStandardMaterial({ color: 0x6a6258, roughness: 0.85 })
    );
    backWall.position.set(px, 10, pz - place.far - 0.5);
    backWall.name = place.name + '_backWall';
    placeGroup.add(backWall);

    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({ color: 0x5a544a, roughness: 0.9 })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(px, 10, pz);
    ceiling.name = place.name + '_ceiling';
    placeGroup.add(ceiling);

    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(24.8, 24.8, 2),
      new THREE.MeshStandardMaterial({ color: 0x7a7268, roughness: 0.8 })
    );
    wall.position.set(px, 12.4, pz - 14);
    wall.name = place.name + '_wall';
    placeGroup.add(wall);

    const gate = new THREE.Mesh(
      new THREE.BoxGeometry(6, 12, 1),
      new THREE.MeshStandardMaterial({ color: 0x4a443a, roughness: 0.7 })
    );
    gate.position.set(px, 6, pz - 14);
    gate.name = place.name + '_gate';
    placeGroup.add(gate);

    placePracticals(placeGroup, THREE, place.practicals, px, pz);

    placeMeshes[place.name] = placeGroup;
  });

  const rig = createLightRig(THREE, PLACES.map((p) => ({ name: p.name, sky: p.sky, ground: p.ground, fog: p.fog, lights: LIGHTS[p.name] || [], states: [] })), DRIVERS);

  const kitSet = createKit(THREE, rig, { shadow: null, group: base.group });

  return {
    ...base,
    group: base.group,
    places: placeMeshes,
    rig,
    lightDir: [0.4, -0.6, 0.8],
    casters: [],
    bounds: { x: [-2000, 2000], z: [-2000, 2000] },
    update(t) { base.update?.(t); rig.update(t); },
    ready: Promise.resolve()
  };
}

function placePracticals(group, THREE, practicals, px, pz) {
  practicals.forEach((practical, i) => {
    const [id, [ox, oy, oz]] = practical;
    const lamp = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.5, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xffd699, emissive: 0xffd699, emissiveIntensity: 2, roughness: 0.3 })
    );
    lamp.position.set(px + ox, oy, pz + oz);
    lamp.name = id;
    group.add(lamp);

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffd699, transparent: true, opacity: 0.35 })
    );
    glow.position.set(px + ox, oy + 0.5, pz + oz);
    glow.name = id + '_glow';
    group.add(glow);
  });
}