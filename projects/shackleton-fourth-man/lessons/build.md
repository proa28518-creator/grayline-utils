# Lessons — Build Pass (`«The Fourth Man on South Georgia»`)

## Full-Method Revision Log (Changes Forced by Complete Method + API Docs + Bar Stills)
1. **Clip registry compliance (`api/MOTION_API.md` `clips.js`):** Replaced all 9 non-existent clip names from the initial draft with real engine clips (all using `params: { ... }`, `hold`, and `out`).
2. **Voice schema (`references/film.md`, `api/FILM_API.md`, `references/voice-sound.md`):** Replaced top-level `audio`/`lines` with `voice: { file: 'audio/clean.wav', words: 'audio/clean.json', lines: [{ who: null, text }] }` (20/20 segments verbatim as heard; `who: null` narrator = no lip sync, captions active).
3. **Face enums & ENG5 rhythm (`api/FACE_API.md`, `api/MOTION_API.md`, `s4_01.jpg`, `02-story-to-shots.jpg`):** Replaced non-registry states with exact `FACE_API` enums; upgraded Frame 0 (`SH01`) to `eyes: 'wide', brow: 'knit', mouth: 'tight', react: false`, and added `hold: true, react: false` on sleeping faces.
4. **Carry release (`api/MOTION_API.md` ENG7):** Added `keep: false` to Shackleton's `carry` clips.
5. **Camera schema (`references/film.md`, `references/camera.md`):** Added explicit `move: 'push'`, `t0`/`t1`, and `roll: [r0, r1]` on every shot's `camera` object.
6. **Multi-place `set.js` contract (`references/sets.md`, `api/WORLD_API.md`, `references/examples/s4.md`):** Built clean `THREE.Group` directly on `scene`, enforced `depthWrite: true, renderOrder = -10` on all sky domes, called `update(0)` before return, exposed `lightDir` and `lights` (`<= 8` lights/place), and authored `scenes/props/adze.js` and `scenes/props/pocket_watch.js`.

## Build Repair 1 — Root Cause & Fix (`THE WORLD DOES NOT RENDER`, Fleet Critic 14/90)
- **Found root causes:** (1) Zero live `THREE.Light` instances in `scene`; (2) oversized (`175–210 D`) canvas-textured sky domes with `fog: true` and no `scene.background`; (3) unlit/misaligned Frame 801 (`SH11`) macro boot-screws stage.
- **Fixes in `scenes/set.js`:** Added live `HemisphereLight`, `AmbientLight`, dynamic per-place `DirectionalLight`, and local `PointLight`s; rebuilt `makeSkyDome` with `vertexColors: true`, `radius = 85 D`, `depthWrite: true`, `renderOrder = -10`, `fog: false`, and live `scene.background` sync; staged `macro_boot_screws` at `GLACIER_CROSSING + (+22, 0, -6)`.

## Build Repair 2 — Shot Staging & Prop Rigging (Fleet Critic 32/90, Commit `038a6bd`)
- **Fixes in `scenes/film.js` & `scenes/set.js`:** Re-framed all group shots and separated solo CUs (`0` edge-clipped figures); removed rigid `12.0 D` `marchRope` cylinder at `(0, 1.35, z)` and replaced it with snow-level (`y = 0.04`) trailing ground rope alongside the 4th footprints; rebuilt `SH12` (`macro_adze`) and `SH13` (`macro_rope_shoulder`) macro stages; added `carry` clip at `line:10.start+0.16`.

## Build Repair 3 — Engine-Math Macro Staging, Contact Arithmetic, Curled Grip, Footprints & Adze Orientation
- **Root cause:** Macro cameras and set contact geometry were previously authored blind using linear interpolation rather than the engine's actual `autoMove` padded resolve and `lowCams` height lift, and without explicit frost-penetration/curve-seating contact arithmetic.
- **Exact values changed:**
  - **A. `SH12` camera (`scenes/film.js`, place-relative `GLACIER_CROSSING`):**
    - Added `lowCam: true` to `SH12`.
    - `target`: `from = to = [35.94, 1.65, -5.48]` (was `[36.22, 1.72, -5.48] → [36.20, 1.68, -5.48]`).
    - `pos`: `from [36.17, 2.08, 1.75] → to [36.16, 2.06, 1.40]` (was `[36.65, 2.02, -0.80] → [36.22, 1.92, -1.30]`).
    - `fov`: `27 → 26` (was `28 → 26`).
  - **B. `SH11` boot screws & camera (`scenes/set.js` + `scenes/film.js`):**
    - `set.js` descent window: `smoothstep(26.15, 27.15, t)` → `smoothstep(26.05, 26.60, t)`.
    - `set.js` rest pose: `bootPivot.position.y` `2.38 - bootU * 0.56` (rest `1.82`) → `2.38 - bootU * 0.549` (rest `1.831`); `rotation.z` `0.62 → 0.24` → `0.30 → 0.04`; `rotation.x` `-0.52 → -0.28` → `-0.34 → -0.05`.
    - `set.js` heel mounts: all 3 heel screw local `y` values `-0.45` → `-0.32` (all 10 screws flush with sole bottom).
    - `set.js` screw geometry & material: `head` `CylinderGeometry(0.095, 0.095, 0.06)` → `CylinderGeometry(0.07, 0.07, 0.05)`; `tip` `ConeGeometry(0.062, 0.28)` at `y = -0.10` → `ConeGeometry(0.045, 0.10)` at `y = -0.05` (penetration into frost `y = 1.47` at rest: `0.0122–0.0823`, all 10 bite); `screwMat` gold (`0xf4d26e`) → steel (`color: 0xa8b2ba, metalness: 0.85, roughness: 0.35, emissive: 0x000000`).
    - `film.js` `SH11` camera (place-relative `GLACIER_CROSSING`): added `lowCam: true`; `target`: `from = to = [22.26, 1.52, -5.78]`; `pos`: `from [23.22, 1.86, -0.02] → to [23.16, 1.84, -0.36]`; `fov`: `28 → 27`.
  - **C. `SH13` hands (`scenes/set.js`, camera unchanged):**
    - Rebuilt `makeGrippingHand` with spherical palm (`SphereGeometry(0.13)` scaled `(1.0, 0.85, 0.95)`), 4 × 2 capsule finger segments (`r = 0.030`, base angled `55°` toward rope axis, tip angled a further `65°`, wrapping `≈ 200°` around the `r = 0.085` rope onto the far side), and opposing thumb capsule (`r = 0.032`) on the near side; cuff and forearm unchanged.
    - Seated `ropeHandUpper` (nearest `(-0.14, 2.04, 0.46)`) and `ropeHandLower` (nearest `(0.18, 1.44, 0.54)`) directly on `ropeCurve` via `getPointAt(u)` and oriented each hand's local `+z` along the curve tangent (`lookAt` with `up = (0, 0, 1)` facing camera; `scale.x = -1` on upper hand to mirror forearm to left while keeping curled fingers camera-facing).
  - **D. Footprints (`scenes/set.js`, `makeFootprintTrail`):**
    - Geometry `BoxGeometry(0.24, 0.06, 0.44)` → `BoxGeometry(0.26, 0.012, 0.46)`; centre `y = 0.03` → `y = 0.002`.
    - Material colour `0x4c6b8c` → `0x39526e`, `roughness: 1.0` (`fourthMat` `0x2e4660`, `roughness: 1.0`).
    - Added per-lane `z` phase offset `+0.37 * l`, deterministic `mulberry32` per-print `z` jitter `±0.09` and `rotation.y` jitter `±0.06 rad`, and side alternation `±0.14` → `±0.16`; preserved 4 lanes, lane `x` positions, counts, and `zStep = 1.15`.
  - **E. Carried adze (`scenes/film.js` `props`):**
    - `props[adze_shackleton].rot`: `[0, 0, 0]` → `[0, 0, 180]` (`Rz(π)` hangs the head below the grip while keeping the blade pointing forward; `SH12` macro adze in `set.js` untouched).
- **Open question check (SH12 blade assembly absence in R3):**
  - Inspected `adzeStage`, `adzePivot`, `blade`, `bladeEdge`, `headSocket`, `poll`, `carvedNotch`, `chips`, and `update(t)` in `set.js`: there is **no visibility-window bug** (`chips` are `visible = true` for `27.60 <= t <= 28.70`, active at Frame 840 `t = 28.0 s`), **no separate/misplaced parent transform** (`blade`, `bladeEdge`, `headSocket`, `poll` are direct siblings of `handle` and hands under `adzePivot` at `(-0.06, 1.32, 0.52)`), and **no render-order/depth override** hiding the assembly. The only code-side cause found was the R2 camera offset (`no lowCam: true`, `autoMove` pad factor `0.7126`, target right of bite), which Item A fixes; if anything still hides the assembly on the fleet re-probe, it is not in `set.js` visibility/transform/depth flags.

## HANDOVER (build — post Build Repair 3, 2026-11-24)
AT THE BAR: `scenes/film.js` and `scenes/set.js` updated with all five Build Repair 3 fixes (A: SH12 camera + `lowCam: true`; B: SH11 settled boot pose, steel flush screws penetrating frost `0.012–0.082`, camera + `lowCam: true`; C: SH13 curled capsule grip hands seated on `ropeCurve` via `getPointAt` with `+z` along tangent; D: low-profile jittered footprint impressions; E: `adze_shackleton` `rot: [0, 0, 180]`). Syntax clean (`node --check`), Repair 1 lighting/dome rig intact. Acceptance pending desk fleet re-probe (frames `0, 801, 840, 882, 1860`) and fresh blind critic round.
STILL BELOW THE BAR (for downstream passes):
1. Sparse, flat-shaded procedural set geometry — job: `environment`.
2. Ending warm-light shift, DoF, haze, bloom, and face shading — job: `post` and `shading`.
DO NOT TOUCH: `audio/clean.wav`, `audio/clean.json`, 20 lines, 21 cast specs, shot order/timing, FOURTH MAN RULE, Repair 1 lighting/dome rig, Repair 2 group framing / SH12 shelf height & notch / SH13 torso & rope curve.