# Sets: writing `scenes/set.js`

Units are D (one head). Ground y = 0, the camera side is +Z. An adult's head top is ~2.6-2.8 D, the waist ~1.2, a seat .55, a counter
1.25, a door 3.2 x 1.6. Keep the action in x -6..6, z -2..3 for a single place.

## Three ways to get a set
1. **A kit set by name** (`world: { set: 'park' }`): `bread_corner`, `workshop_yard`, `harbour_pier`, `park`, `kitchen`,
   `city_street`, `plain`. Lit, sun shadows, marks (park `sit` `sit2` `bench_front` `a` `b` `tree` ...; kitchen `counter` `stove`
   `fridge` `stool_l` `stool_r` ...). Marks are only read by name in `sit_on.seat`: write their numbers into `at` and walk paths.
   Details and marks: `world/WORLD_API.md` in the engine copy.
2. **A description object** (`world: { set: { sky, sun, ground, walls, boxes, counters, tables, lamps, trees, marks, ... } }`), built
   by the same kit. Good for a simple place in Build (it still needs its depth and practicals: `references/topics.md`).
3. **Your own `scenes/set.js`** (`world: { set: 'own' }`). Needed for many places, a Blender set, lights as data, post and shading.

## The set module
```js
import { createLightRig } from '../world/look/lights.js';
import { createPost } from '../world/look/post.js';
import { createRigShade } from '../world/look/rigshade.js';
export async function buildSet(THREE, scene, opts, kit) {     // opts = world.setOpts
  const base = kit('plain', opts);                             // optional: start from a kit set name or a description object
  const sub = new THREE.Group(); sub.name = 'sub'; base.group.add(sub);   // .name = what a camera key { object: 'sub' } follows
  const rig = createLightRig(THREE, PLACES, drivers);          // lights as data (below)
  const look = opts.post ? createPost(THREE, rig, opts.post) : undefined;              // the post pass
  if (look && opts.post.shade) look.shading = createRigShade(THREE, rig, opts.post.shade); // the shading pass
  return { ...base, marks: { ...base.marks, door: [2, 1] }, points: { sub }, rig, look,
           update(t) { base.update?.(t); rig.update(t); sub.position.y = 44 - t; } };    // update: pure in t
}
```
It may return as little as `{ group }`. Also: `ready` (a promise: loading done), `lightDir` (direction TO the sun), `casters`
(meshes that cast the sun shadow), `bounds`. Import from the engine copy by relative path (`'../world/look/...'`); load project
files with `new URL('../assets/set/', import.meta.url)`. Everything must fall back to a plain previz when a file is missing, so the
film always renders while the environment crew works.

## Many places in one film
- Each place sits 400 D from the others (`[0, 0]`, `[400, 0]`, `[400, -400]`, `[-400, 0]` ...), inside its own sky dome and its own
  fog, so a cut or a seam between them is free and no place sees another.
- **Domes must write depth** (`depthWrite: true`, `renderOrder: -10`), or other places' domes show through the sky as faint arcs.
- A character goes between places with `acts.<id>.place` keys on cuts, not cast copies.
- Characters in another place cost nothing per frame; extra places do not slow the film, so give every beat the place it needs.
- Moving things (a ship, a sub, a lift) are their own named groups, animated in `update(t)` from numbers the film passes in
  `setOpts` (one table of times in film.js drives the set, the acting and the camera).

## Lights as data (`world/look/lights.js`)
A place: `{ sky: [r,g,b], ground: [r,g,b], fog: { color: '#hex', density: .03 }, ao: { floor: 0, h: 1.6, amt: .45 }, lights: [...],
states: [{ from: 34.06, sky, fog, lights: { id: { power, color } } }] }` (linear colours; `states` = later values from a time on,
put them on a cut). A light: `{ id, kind: 'point' | 'spot' | 'sun', color, power, pos, dir, fall: .05, range: 30, cone: [in, out],
wrap: .2, gobo: { kind: 'cage' | 'caustic', ... }, drive: 'name', move: 'name' }`. `drive` / `move` read functions of t from the set's
`drivers` (a dying lamp, a swinging bulb), so the light stays pure in t. At most 8 lights per place.
`rig.uniforms(place)` = the uniform block for that place's materials; `rig.update(t)` sets the frame; `rig.at(place)` and
`rig.sample(place, t)` are what post and shading read. A one-line light change and a re-render is the fastest look tweak there is.
A gobo (a lamp cage's shadow, a swing from the film's jolt times) sells a light without showing it.

## Surfaces (`world/look/rigkit.js`)
`const K = createKit(THREE, rig, { shadow: base.uniforms, group })` gives `K.surface(place, colour, { map, tile, uv, bump, gloss,
spec, wet, grime, emit, ao, near })`, `K.water(place, ...)`, `K.sky(x, z, r, { top, hor, low })`, `K.decals(place, list, tex)`,
`K.sprites(...)`, and `loadSpriteDefs(THREE, dir)`. `near` dissolves small kit right at the lens (rivets as dark blobs on a flight).
Read the module's header comments for the exact options.

## Rules that cost time before
- Nothing tall right behind where a head will be; nothing thin ending at a head.
- Keep walking lanes, doorways and camera flight lines clear (the layout is a contract once cameras exist).
- A detail pass never moves a wall.
- `update(t)` never keeps state from the previous frame.
