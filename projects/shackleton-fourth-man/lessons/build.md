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

* **Exact changes in `scenes/set.js`:** Rebuilt `blade`, `bladeEdge`, `headSocket`, `poll`, and `adzeHandLow` inside static `adzeBiteGroup` (direct child of `adzeStage`); deleted those 5 from `adzePivot` (keeping `handle`, `adzeHandHigh`, and swing); placed all 18 chips statically at `t = 28.0` burst positions; raised `carvedNotch` to `BoxGeometry(0.80, 0.19, 0.60)` at `(-0.06, 1.285, 0.52)` (`y_top = 1.38`).

## Build Repair 5 — SH12 relocated to the proven-clear volume

* **Three changes applied (`scenes/set.js` and `scenes/film.js` only):**

  1. Moved `adzeStage` (`macro_adze`) from `(36, 0, -6)` to `(50, 0, -6)` with all internal contents unchanged.

  2. Added `update(t)` visibility gating (`adzeStage.visible = !(t >= 28.65 && t < 30.00)`; `ropeGroup.visible = !(t >= 27.35 && t < 28.65)`).

  3. Shifted `SH12` camera `x` constants by `+14` (`target`: `[49.94, 1.65, -5.48]`; `pos`: `[50.17, 2.08, 1.75]` → `[50.16, 2.06, 1.40]`; `fov 27→26`, `lowCam: true` unchanged).

## Build Repair 6 — the lead's face: frame-0 and ending keys

* **Two face-key edits for `shackleton` (`scenes/film.js` only; `scenes/set.js` untouched):**

  1. Frame-0 key: `{ t: 'line:1.start', eyes: 'wide', brow: 'knit', mouth: 'tight', react: false }` → `{ t: 0, eyes: 'wide', brow: 'knit', mouth: 'grid', react: false }`.

  2. Line-20 ending key: `{ t: 'line:20.start+0.14', eyes: 'open', brow: 'up', mouth: 'rest' }` → `{ t: 'line:20.start+0.14', eyes: 'wide', brow: 'up', mouth: 'o' }`.

## Build Repair 7 — SH13 rope clears the torso

* **Measured cause:** `ropeCurve` middle control points `P1` (`z = 0.44`) and `P2` (`z = 0.52`) sat behind `heroTorso`'s front surface (`z ≈ 0.65–0.68`), burying 236 of 1,093 rope-tube vertices and the lower grip inside the torso/shoulder/collar.

* **Two `z` changes in `scenes/set.js` (`ropeCurve` only; `scenes/film.js`, hands, and seat constants untouched):**

  1. `P1`: `(-0.22, 2.16, 0.44)` → `(-0.22, 2.16, 0.84)`

  2. `P2`: `(0.16, 1.48, 0.52)` → `(0.16, 1.48, 0.76)`

## HANDOVER (build — post Build Repair 7, 2026-11-24)

AT THE BAR: `scenes/set.js` updated so `SH13` `ropeCurve` clears `heroTorso`, `heroShoulder`, and `heroCollar` (`P1.z = 0.84`, `P2.z = 0.76`; tube, braid strands, and both `getPointAt`-seated hands follow automatically); `scenes/film.js` untouched. Syntax clean (`node --check`). Acceptance pending desk fleet probe at frame `882` (with frames `840` and `801` as controls) and fresh blind critic round.
STILL BELOW THE BAR (for downstream passes):

1. Sparse, flat-shaded procedural set geometry — job: `environment`.

2. Ending warm-light shift, DoF, haze, bloom, and face shading — job: `post` and `shading`.
   DO NOT TOUCH: `audio/clean.wav`, `audio/clean.json`, `scenes/film.js`, 20 lines, 21 cast specs, shot order/timing, FOURTH MAN RULE, Repairs 1–6.