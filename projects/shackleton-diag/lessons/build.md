# Lessons — Build Pass (`«The Fourth Man on South Georgia»`)

## Full-Method Revision Log (Changes Forced by Complete Method + API Docs + Bar Stills)

1. **Clip registry compliance (`api/MOTION_API.md` `clips.js`):** Replaced all 9 non-existent clip names from the initial draft with real engine clips (all using `params: { ... }`, `hold`, and `out`).

2. **Voice schema (`references/film.md`, `api/FILM_API.md`, `references/voice-sound.md`):** Replaced top-level `audio`/`lines` with `voice: { file: 'audio/clean.wav', words: 'audio/clean.json', lines: [{ who: null, text }] }` (20/20 segments verbatim as heard; `who: null` narrator = no lip sync, captions active).

3. **Face enums & ENG5 rhythm (`api/FACE_API.md`, `api/MOTION_API.md`, `s4_01.jpg`, `02-story-to-shots.jpg`):** Replaced non-registry states with exact `FACE_API` enums; upgraded Frame 0 (`SH01`) to `eyes: 'wide', brow: 'knit', mouth: 'tight', react: false`, and added `hold: true, react: false` on sleeping faces.

4. **Carry release (`api/MOTION_API.md` ENG7):** Added `keep: false` to Shackleton's `carry` clips.

5. **Camera schema (`references/film.md`, `references/camera.md`):** Added explicit `move: 'push'`, `t0`/`t1`, and `roll: [r0, r1]` on every shot's `camera` object.

6. **Multi-place `set.js` contract (`references/sets.md`, `api/WORLD_API.md`, `references/examples/s4.md`):** Built clean `THREE.Group` directly on `scene`, enforced `depthWrite: true, renderOrder = -10` on all sky domes, called `update(0)` before return, exposed `lightDir` and `lights` (`<= 8` lights/place), and authored `scenes/props/adze.js` and `scenes/props/pocket_watch.js`.

## Build Repair 1 — Root Cause & Fix (`THE WORLD DOES NOT RENDER`, Fleet Critic 14/90)

* **Found root causes:** (1) Zero live `THREE.Light` instances in `scene`; (2) oversized (`175–210 D`) canvas-textured sky domes with `fog: true` and no `scene.background`; (3) unlit/misaligned Frame 801 (`SH11`) macro boot-screws stage.

* **Fixes in `scenes/set.js`:** Added live `HemisphereLight`, `AmbientLight`, dynamic per-place `DirectionalLight`, and local `PointLight`s; rebuilt `makeSkyDome` with `vertexColors: true`, `radius = 85 D`, `depthWrite: true`, `renderOrder = -10`, `fog: false`, and live `scene.background` sync; staged `macro_boot_screws` at `GLACIER_CROSSING + (+22, 0, -6)`.

## Build Repair 2 — Shot Staging & Prop Rigging (Fleet Critic 32/90, Commit `038a6bd`)

* **Fixes in `scenes/film.js` & `scenes/set.js`:** Re-framed all group shots and separated solo CUs (`0` edge-clipped figures); removed rigid `12.0 D` `marchRope` cylinder at `(0, 1.35, z)` and replaced it with snow-level (`y = 0.04`) trailing ground rope alongside the 4th footprints; rebuilt `SH12` (`macro_adze`) and `SH13` (`macro_rope_shoulder`) macro stages; added `carry` clip at `line:10.start+0.16`.

## Build Repair 3 — Engine-Math Macro Staging, Contact Arithmetic, Curled Grip, Footprints & Adze Orientation

* **Fixes in `scenes/film.js` & `scenes/set.js`:** Applied engine-math `SH12` and `SH11` cameras with `lowCam: true`; updated `SH11` boot descent (`26.05→26.60`), rest pose (`y = 1.831`, `rz = 0.04`, `rx = -0.05`), flush steel screws (`0.012–0.082` frost penetration); rebuilt `SH13` curled-grip capsule hands seated on `ropeCurve` via `getPointAt` with `+z` along tangent; flattened footprints (`0.26 × 0.012 × 0.46`, `y = 0.002`, deterministic jitter); set `props[adze_shackleton].rot = [0, 0, 180]`.

## Build Repair 4 — SH12 Bite Cluster Rebuild (`scenes/set.js` only; `scenes/film.js` untouched)

* bite cluster rebuilt static in boot-stage pattern per desk isolation SH12_ISOLATION.md

* **Exact changes in `scenes/set.js`:**

  * **A. New static `adzeBiteGroup` (direct child of `adzeStage`):**

    * `blade`: `BoxGeometry(0.46, 0.09, 0.34)`, `steelMat`, `pos (-0.102, 1.378, 0.52)`, `rotation.z = +0.52`.

    * `bladeEdge`: `BoxGeometry(0.14, 0.04, 0.35)`, `edgeMat`, `pos (-0.259, 1.292, 0.52)`, `rotation.z = +0.52`.

    * `headSocket`: `BoxGeometry(0.24, 0.26, 0.24)`, `steelMat`, `pos (0.071, 1.545, 0.52)`, `rotation.z = -0.48`.

    * `poll`: `BoxGeometry(0.22, 0.16, 0.20)`, `steelMat`, `pos (0.213, 1.491, 0.52)`, `rotation.z = -0.48`.

    * `adzeHandLow`: rebuilt via `makeGrippingHand(0.85, 0.08, 0.12)`, `pos (0.276, 1.934, 0.58)`, `rotation.z = -0.48`.

  * **B. `adzePivot` cleanup:** Deleted `blade`, `bladeEdge`, `headSocket`, `poll`, and `adzeHandLow` from `adzePivot`; kept `handle`, `adzeHandHigh`, and the unchanged `update(t)` swing formula (`rotation.z = -0.38 * (1 - adzeStrike) + 0.04 * adzeStrike`).

  * **C. Static 18 ice chips:** Removed per-frame chip position writes and `visible` toggle from `update(t)`. Placed all 18 `OctahedronGeometry(0.085, 0)` `chipMat` meshes once at build as direct children of `adzeStage` (visible by default) at the exact `t = 28.0` burst coordinates (`00` `(-0.315, 1.354, 0.635)` through `17` `(-0.007, 1.556, 0.664)`).

  * **D. `carvedNotch`:** Replaced with `BoxGeometry(0.80, 0.19, 0.60)` at `(-0.06, 1.285, 0.52)` (`color: 0x2e5e88, roughness: 0.35` — top face at `y = 1.38`, `0.05` above crust).

## HANDOVER (build — post Build Repair 4, 2026-11-24)

AT THE BAR: `scenes/set.js` updated with static `adzeBiteGroup`, cleaned `adzePivot` (handle + `adzeHandHigh` + unchanged swing), static 18 chips at `t = 28.0` positions, and raised `carvedNotch` (`y_top = 1.38`); `scenes/film.js` untouched. Syntax clean (`node --check`). Acceptance pending desk fleet probes at frames `825 / 840 / 852`.
STILL BELOW THE BAR (for downstream passes):

1. Sparse, flat-shaded procedural set geometry — job: `environment`.

2. Ending warm-light shift, DoF, haze, bloom, and face shading — job: `post` and `shading`.
   DO NOT TOUCH: `audio/clean.wav`, `audio/clean.json`, `scenes/film.js`, 20 lines, 21 cast specs, shot order/timing, FOURTH MAN RULE, Repair 1 lighting/dome rig, Repair 2 group framing / SH12 shelf / SH13 torso & rope curve, Repair 3 SH11/SH13/footprints/adze carry rot, and `adzePivot` swing.