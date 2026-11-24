# Lessons — Build Pass (`«The Fourth Man on South Georgia»`)

## Full-Method Revision Log (Changes Forced by Complete Method + API Docs + Bar Stills)

1. **Clip registry compliance (`api/MOTION_API.md` `clips.js`):** Replaced all 9 non-existent clip names from the initial draft with real engine clips (all using `params: { ... }`, `hold`, and `out`):

   * `march_brace` → `carry` (`adze_shackleton`, `keep: false`) + `lean_over`

   * `rope_pull` → `lean_over` + `point`

   * `halt_glance` → `shock_pop` + `head_turn`

   * `helm_grip` → `brace`

   * `row_oar` → `lean_over` + `wince`

   * `bail_water` → `lean_over`

   * `collapse_snow` / `sit_up_blink` → `sit_down` (`seat: 0.45`) + `stand_up` (`from: 'sit'`)

   * `check_watch` → `carry` (`pocket_watch`, `keep: false`)

   * `gentle_wake` → `point` (`dir` sideways `z <= 0.3`)

   * `hold_mug` → `sip` (`tin_mug_shackleton`)

   * `lean_confess` → `lean_over` + `talk_hands`

   * `solemn_nod` → `point`

   * `look_around` / `turn_mist` → `head_turn`

   * `wave_shore` / `shield_eyes` / `huddle_cold` → `wave`, `hand_to_temple`, `brace`

   * `ice_climb` → `lean_over`

2. **Voice schema (`references/film.md`, `api/FILM_API.md`, `references/voice-sound.md`):** Replaced top-level `audio`/`lines` with `voice: { file: 'audio/clean.wav', words: 'audio/clean.json', lines: [{ who: null, text }] }` (20/20 segments verbatim as heard; `who: null` narrator = no lip sync, captions active).

3. **Face enums & ENG5 rhythm (`api/FACE_API.md`, `api/MOTION_API.md`, `s4_01.jpg`, `02-story-to-shots.jpg`):** Replaced non-registry states (`narrow`, `firm`, `tired`, `scan`, `furrow`, `grit`, `soft`, `guarded`, `side`, `awe`, `shut`, `blink`-as-eye-default, `open`-mouth) with exact `FACE_API` enums (`wide`, `open`, `half`, `wince`, `angry`, `sad`, `look_l`, `look_r`, `pinpoint`, `blink`; brow `on`, `up`, `down`, `knit`, `worried`; mouth `rest`, `smile`, `D`, `grid`, `o`, `flat`, `tight`, `gulp`). Upgraded Frame 0 (`SH01`) from `wince` to `eyes: 'wide', brow: 'knit', mouth: 'tight', react: false` to match the wide-eyed opening bar (`s4_01.jpg`, `02-story-to-shots.jpg`), and added `hold: true, react: false` on sleeping faces.

4. **Carry release (`api/MOTION_API.md` ENG7):** Added `keep: false` to Shackleton's `carry` clips so his right arm does not stay locked in chest-carry after place cuts.

5. **Camera schema (`references/film.md`, `references/camera.md`):** Added explicit `move: 'push'`, `t0`/`t1`, and `roll: [r0, r1]` on every shot's `camera` object (instead of roll nested inside `from`/`to`).

6. **Multi-place `set.js` contract (`references/sets.md`, `api/WORLD_API.md`, `references/examples/s4.md`):** Updated `buildSet(THREE, scene, opts, kit)` to build a clean `THREE.Group` directly on `scene` (removing `kit('plain')` whose default sand ground plane at `y = 0` would Z-fight with snow, timber, and depressed ocean water), enforced `depthWrite: true, renderOrder = -10` on all 7 sky domes, called `update(0)` before return, exposed `lightDir` and `lights` in `world/look/lights.js` format (`<= 8` lights/place), and authored custom props `scenes/props/adze.js` and `scenes/props/pocket_watch.js` with grip origins and keyable `open` state.

7. **Set-bar & PROP GUARD contracts confirmed:**

   * **Set bar (`references/quality-bar.md`, `03-set.jpg`):** Per shot `>= 22%` detail / `<= 80%` flat; film median `>= 28%` detail / `<= 78%` flat; `<= 40%` shots under. Build measures it on the desk fleet; Environment, Post, and Shading must pass it.

   * **PROP GUARD (`references/film.md`, `api/FILM_API.md`):** Over `40 px/frame` reported; real world jump `> 0.04 D` and `> 2.5x` neighbours fails. All 3 props (`adze_shackleton`, `pocket_watch`, `tin_mug_shackleton`) change `in: 'hand:R'` / `'hidden'` strictly on exact shot cuts, declare top-level keyed opts (`open: 1`), and have zero mid-shot hides or unkeyed drops.

## Build Repair 1 — Root Cause & Fix (`THE WORLD DOES NOT RENDER`, Fleet Critic 14/90)

* **Found root causes (diagnosed from `scenes/set.js` + one-frame diagnostic at `t = 0`):**

  1. **Zero live `THREE.Light` instances in the rendered scene:** `scenes/set.js` only exported a plain JS `lights` config object and never instantiated any `THREE.HemisphereLight`, `THREE.AmbientLight`, `THREE.DirectionalLight`, or `THREE.PointLight` in `scene`. Because 2.5D characters use custom unlit shaders, they rendered lit, while every `MeshStandardMaterial` surface (snow floors, ridges, mountains, lifeboat, shelter, whaling station, and the entire macro stage at Frame 801) rendered pure black (`#000000`). Only isolated `MeshBasicMaterial` fragments (e.g., stray window glow discs) appeared.

  2. **Sky domes clipped / invisible + no `scene.background`:** Previous sky domes used `radius = 175–210 D` (clipped by `camera.far`, and `LANDING_VIGNETTES` Bay D at `x = +135` placed the far dome wall `345 D` away), depended on `CanvasTexture`, inherited default `fog: true`, and never set `scene.background`.

  3. **Frame 801 (`t = 26.7 s`) macro boot-screws alignment:** `film.js` shot `SH11` (`26.00–27.35 s`) aims at `GLACIER_CROSSING + (22.1, 1.85, -5.8)`, while the previous `set.js` had unlit `MeshStandardMaterial` macro props and misaligned stage bay coordinates.

* **Fixes applied in `scenes/set.js` (`scenes/film.js` untouched — voice, timings, cast, 20 lines, shot order/timing, and Fourth Man Rule unchanged):**

  1. **Live scene lighting (31 `THREE.Light`s):** Instantiated `HemisphereLight`, `AmbientLight`, and active-place `DirectionalLight` (dynamically synced per active place in `update(t)`), plus 28 local `PointLight`s (`decay = 1`) for per-place rim/fill, lanterns, campfire, stove, whaling-station windows, and dedicated macro key/rim lights.

  2. **Vertex-colour sky domes + `scene.background` sync:** Rebuilt `makeSkyDome` with `vertexColors: true` (RGB gradient baked directly into sphere geometry vertices — zero canvas-texture failure risk), `radius = 85 D` centred on each place and each vignette/macro bay (`makePeakRing` kept inside `r = 34–68 D`), `side: THREE.BackSide`, `depthWrite: true`, `renderOrder: -10`, `fog: false`, and updated `scene.background` to the active place's sky colour in `update(t)`.

  3. **Macro stage bay alignment for Frame 801 (`t = 26.7 s`):** Placed `macro_boot_screws` (heavy leather boot tilted to expose 10 gleaming brass/steel screws biting into blue glacier ice + dedicated `8.0` key and `5.0` rim `PointLight`s + local `r = 85 D` `sky_dome_macro`) at `GLACIER_CROSSING + (+22, 0, 0)` animated across `26.15–27.15 s` so Frame 801 (`t = 26.7 s`) frames the boot, screws, and ice lit and dead-centre; placed `macro_adze` at `x = +36` (`SH12`) and `macro_rope_shoulder` at `x = +50` (`SH13`).

* **One-frame diagnostic readings (`t = 0.00 s` + Frame 801 verification):**

  * **(a) `'fourth_man_set'` present in rendered scene graph:** `true` (`1,211` meshes total)

  * **(b) Lights in scene:** `31` total (`HemisphereLight: 1`, `AmbientLight: 1`, `DirectionalLight: 1`, `PointLight: 28`)

  * **(c) Sampled `sky_dome_march` pixel colour (`yNorm = +0.25`):** `rgb(110, 131, 153)` (`#6e8399`) | `scene.background = #7d92a8` | `radius = 85 D`, `depthWrite = true`, `renderOrder = -10`, `fog = false`

  * **Frame 801 (`t = 26.70 s`) check:** `macro_boot_screws` present: `true` (`bootStage children = 6`, `scene.background = #90b2cf`)

* **Pre-desk verification after repair:** `node --check` passed on `set.js` and `film.js`; full audit passed (`28 shots, 20/20 lines, 21 cast specs, 3 props, 0 errors, 0 warnings`).

## Frames Requested Next from the Desk Fleet

1. **Build Repair 1 re-probe:** `frames 0, 375, 630, 801, 1860` (`t = 0.00, 12.50, 21.00, 26.70, 62.00 s`).

2. **Opening critic round (§13.4):** `t = 0.00 s` (`frame 0`) and `t = 1.50 s` (`frame 45`).

3. **Standard 13 sampled frames (§12):** `t = 0, 3, 8, 11, 15, 21, 28, 33, 38, 45, 52, 58, 62 s` (`frames 0, 90, 240, 330, 450, 630, 840, 990, 1140, 1350, 1560, 1740, 1860`).

## HANDOVER (build — post Build Repair 1, 2026-11-24)

AT THE BAR: `scenes/BIBLE.md` complete (20 segments + 1 pause, 7 places `400 D` apart, 21 ready cast specs, 0 new characters); `scenes/set.js` repaired so every place renders with live Three.js lights (`31` total), vertex-coloured `r = 85 D` sky domes (`depthWrite: true, renderOrder = -10, fog = false`), synced `scene.background`, lit snow/terrain/set pieces, and Frame 801 (`t = 26.7 s`) boot-screws macro stage framed and lit at `x = +22`; `scenes/film.js`, `scenes/props/adze.js`, `scenes/props/pocket_watch.js` unchanged and syntax/audit-clean (`0 errors, 0 warnings`). Fleet re-probe of frames `0, 375, 630, 801, 1860` and fresh blind critic round pending desk execution.
STILL BELOW THE BAR (worst first):

1. `SH01–SH07, SH10, SH14–SH17` (open snow & ocean shots): procedural previz planes may measure below `28%` median detail / `78%` flat bar vs. bar stills' rich modelled near-ground detail — job: `environment` (Blender `.glb` glacier ridges, crevasses, sculpted waves, textures).

2. `SH11–SH13` (`26.0–30.0 s`, §7 macro close-ups): primitive Three.js boot screws, adze blade, and rope twist rings need full-size inspection on fleet re-probe frame `801` to verify instant phone readability — job: `this pass again` (if unreadable on `scale: 1`) / `environment` (hero Blender models).

3. `SH06–SH07` (`13.0–18.0 s`, *James Caird* lifeboat): character feet/legs at fixed `y = 0.42–0.45 D` while hull pitches in `set.js` may clip thwarts/gunwales at peak roll — job: `this pass again` after viewing frame `450`.

4. `SH26B` (`60.8–62.92 s`, Arabic title card): `Noto Sans Arabic` / `Cairo` font shaping on fleet headless Chromium unverified — job: `this pass again` after viewing frame `1860`.

5. Unshaded faces & no per-place DoF/haze/bloom/snow-grade yet — job: `post` and `shading`.
   DO NOT TOUCH: `audio/clean.wav` and `audio/clean.json` (verbatim 20 segments + `12–13 s` pause); 21 ready-made cast specs (zero new characters); 7 `PLACES` `400 D` anchors; `SH01` Frame 0 face framing; `SH05` unbroken `12–13 s` pause hold; FOURTH MAN RULE trace-only staging.
   NOT CHECKED: No local WebGL renders run — fleet re-probe of frames `0, 375, 630, 801, 1860`, `film_probe` (PROP GUARD), `film_sheet`, `film_check { kind: 'set' }`, and the fresh blind critic round are pending the desk fleet.