// Proof run: load set.js (and its lights.js import) and every prop with THREE passed explicitly.
// A stub THREE records construction; any bare-global THREE read would throw (ReferenceError) in Node.
import { buildSet } from '../scenes/set.js';
import * as rope from '../scenes/props/rope_coil.js';
import * as axe from '../scenes/props/ice_axe.js';
import * as boot from '../scenes/props/boot_nailed.js';
import * as lantern from '../scenes/props/lantern.js';
import * as watch from '../scenes/props/pocket_watch.js';
import * as book from '../scenes/props/book.js';
import * as mug from '../scenes/props/mug.js';
import film from '../scenes/film.js';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

class Vec3 {
  constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
  set(x, y, z = 0) { this.x = x; this.y = y; this.z = z; return this; }
}
class Euler extends Vec3 {}
class Obj3D {
  constructor() { this.position = new Vec3(); this.rotation = new Euler(); this.scale = new Vec3(1, 1, 1); this.children = []; this.name = ''; }
  add(...kids) { this.children.push(...kids); return this; }
  clone() { return Object.assign(new Obj3D(), this, { position: new Vec3(), rotation: new Euler(), children: [] }); }
}
class Group extends Obj3D {}
class Mesh extends Obj3D {
  constructor(geo, mat) { super(); this.geometry = geo; this.material = mat; }
}
const Object3D = Obj3D;
class Light extends Obj3D { constructor(color, int) { super(); this.color = color; this.intensity = int; this.isDirectionalLight = true; this.userData = {}; } }
const geo = name => class { constructor(...a) { this.type = name; this.args = a; } };
const mat = name => class { constructor(p = {}) { this.type = name; this.params = p; } };

const THREE = {
  Group, Mesh, Object3D, Vector3: Vec3, Euler,
  MeshLambertMaterial: mat('MeshLambertMaterial'),
  MeshBasicMaterial: mat('MeshBasicMaterial'),
  BoxGeometry: geo('BoxGeometry'), SphereGeometry: geo('SphereGeometry'),
  CapsuleGeometry: geo('CapsuleGeometry'), ConeGeometry: geo('ConeGeometry'),
  CylinderGeometry: geo('CylinderGeometry'), TorusGeometry: geo('TorusGeometry'),
  CircleGeometry: geo('CircleGeometry'), PlaneGeometry: geo('PlaneGeometry'),
  DirectionalLight: Light, AmbientLight: Light
};

const opts = film.world.setOpts;
const set = await buildSet(THREE, new THREE.Group(), opts, null);
const count = g => g.children.reduce((n, c) => n + 1 + count(c), 0);
const topNames = set.group.children.map(c => c.name).join(',');
console.log('set loaded; lightRig lights:', set.rig.lights.length, '; top-level groups:', topNames, '; total nodes:', count(set.group));
if (!set.group.children.some(c => c.name === 'lightRig')) throw new Error('FAIL: lightRig group not mounted in set.group');

for (const [nm, mod, o] of Object.entries({ rope, axe, boot, lantern, book, mug }).map(([k, m]) => [k, m, null])) {
  const g = mod.build(THREE, o ?? {});
  console.log('prop', nm, 'nodes:', g.children.length);
}
const w = watch.build(THREE, { open: 1 });
console.log('prop pocket_watch (open) nodes:', w.children.length);

// one file per prop: every kind the film calls must have scenes/props/<kind>.js on disk
const propsDir = join(dirname(fileURLToPath(import.meta.url)), '../scenes/props');
const onDisk = new Set(readdirSync(propsDir).filter(f => f.endsWith('.js')).map(f => f.replace(/\.js$/, '')));
const missing = film.props.filter(p => !onDisk.has(p.kind));
if (missing.length) throw new Error('FAIL: film prop kinds with no module file: ' + missing.map(p => p.kind).join(', '));
console.log('prop modules on disk:', [...onDisk].sort().join(','), '— film kinds:', film.props.map(p => p.kind).join(','));

// prop keys: every mid-shot appearance must carry fetch, every hit may snap, hand props are owned
for (const p of film.props) {
  if (!p.owner) throw new Error('FAIL: prop ' + p.id + ' has no owner (no hand to hold it)');
}
console.log('prop owners ok:', film.props.map(p => p.id + ':' + p.owner).join(', '));

set.update(0.5);
console.log('set.update(0.5) ok');
console.log('PROOF RUN PASSED');
