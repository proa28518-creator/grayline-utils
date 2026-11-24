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

3. **Face enums & ENG5 rhythm (`api/FACE_API.md`, `api/MOTION_API.md`, `s4_01.jpg`, `02-story-to-shots.jpg`):** Replaced non-registry states with exact `FACE_API` enums (`wide`, `open`, `half`, `wince`, `angry`, `sad`, `look_l`, `look_r`, `pinpoint`, `blink`; brow `on`, `up`, `down`, `knit`, `worried`; mouth `rest`, `smile`, `D`, `grid`, `o`, `flat`, `tight`, `gulp`). Upgraded Frame 0 (`SH01`) to `eyes: 'wide', brow: 'knit', mouth: 'tight', react: false`, and added `hold: true, react: false` on sleeping faces.

4. **Carry release (`api/MOTION_API.md` ENG7):** Added `keep: false` to Shackleton's `carry` clips so his right arm does not stay locked after place cuts.

5. **Camera schema (`references/film.md`, `references/camera.md`):** Added explicit `move: 'push'`, `t0`/`t1`, and `roll: [r0, r1]` on every shot's `camera` object.

6. **Multi-place `set.js` contract (`references/sets.md`, `api/WORLD_API.md`, `references/examples/s4.md`):** Built clean `THREE.Group` directly on `scene`, enforced `depthWrite: true, renderOrder = -10` on all sky domes, called `update(0)` before return, exposed `lightDir` and `lights` (`<= 8` lights/place), and authored `scenes/props/adze.js` and `scenes/props/pocket_watch.js`.

## Build Repair 1 — Root Cause & Fix (`THE WORLD DOES NOT RENDER`, Fleet Critic 14/90)

* **Found root causes:** (1) Zero live `THREE.Light` instances in `scene` (only a plain `lights` data object was exported), causing all `MeshStandardMaterial` terrain/props to render black while unlit 2.5D characters rendered lit; (2) oversized (`175–210 D`) canvas-textured sky domes with `fog: true` and no `scene.background`; (3) unlit/misaligned Frame 801 (`SH11`) macro boot-screws stage.

* **Fixes in `scenes/set.js`:** Added live `HemisphereLight`, `AmbientLight`, dynamic per-place `DirectionalLight`, and local `PointLight`s; rebuilt `makeSkyDome` with `vertexColors: true`, `radius = 85 D`, `depthWrite: true`, `renderOrder = -10`, `fog: false`, and live `scene.background` sync; staged `macro_boot_screws` at `GLACIER_CROSSING + (+22, 0, -6)` (confirmed landed on fleet Frame 801).

## Build Repair 2 — Shot Staging & Prop Rigging (Fleet Critic 32/90, Commit `038a6bd`)

* **Found root causes:**

  1. **SH12 (Frame 840) empty:** `adzePivot` blade (`y = 1.69`) was buried inside `iceBlock` (`y <= 1.80`) and `carvedNotch` (`y <= 1.93`) while the handle extended outside the narrow `0.88 D` wide 9:16 frustum (`dist = 3.5 D, fov = 25.5°`), and no gripping hands/forearms existed.

  2. **SH13 (Frame 882) empty lower two-thirds & no hands:** `shoulderCoat` was a dark unfeatured sphere filling the bottom two-thirds while the horizontal tan ribbon sat in the top third and tiny `0.24` hand spheres were clipped outside the `0.80 D` frustum.

  3. **Edge-clipped side figures (Frames 0, 630, 1860 + group shots):** 9:16 portrait horizontal half-width (`aspect = 0.5625`) clipped side cast members (`worsley`, `crean`, `s4_kid`, `blind_gus`, and wide beach huddle) in 17 shots.

  4. **Rigid pole piercing lead's torso / diagonal pole across legs in Frame 1860:** `marchRope` in `set.js` was a rigid `12.0 D` tan `CylinderGeometry(0.055, 0.055, 12.0, 8)` sitting at `(x = 0, y = 1.35, z = 5.75)` straight through Shackleton's torso/legs in `GLACIER_MARCH` (`SH01–SH05`, `SH26A`/Frame 1860). Additionally, `adze_shackleton` had `rot: [0, 0, -18]` and lacked a `carry` clip during `GLACIER_CROSSING` (`SH10`).

* **Staging values changed per shot (`scenes/film.js` & `scenes/set.js` — Repair 1 world/lighting rig & SH11 Frame 801 untouched):**

  * **SH12 (`macro_adze`, Frame 840 @ `t = 28.0 s`):** Lowered `iceBlock` top to `y = 1.25` with dark-blue V-notch at `(-0.06, 1.27, 0.52)`; anchored `adzePivot` at the blade bite point `(-0.06, 1.32, 0.52)` with forged steel blade/edge, socket/poll, diagonal ash handle, two sculpted leather-gloved hands (4 curled fingers + thumb + cuff) + navy coat forearms, 18 sustained flying ice chips, and `10.0` key + `6.0` rim lights. Camera updated to `from: (36.65, 2.02, -0.80) -> (36.22, 1.72, -5.48) fov 28`, `to: (36.22, 1.92, -1.30) -> (36.20, 1.68, -5.48) fov 26`.

  * **SH13 (`macro_rope_shoulder`, Frame 882 @ `t = 29.4 s`):** Built hero parka torso/shoulder with lighter yoke, tan shearling collar, and brass buttons against bright snow backdrop; built 3-strand helical braided rope running diagonally top-left `(-0.82, 2.95, 0.20)` across shoulder to bottom-right `(0.76, 0.55, 0.64)` with high-frequency tension tremor; clamped two sculpted leather-gloved hands + coat forearms onto the rope at `(-0.14, 2.04, 0.46)` and `(0.18, 1.44, 0.54)` lit by `10.0` key + `6.0` rim lights. Camera updated to `from: (50.45, 1.90, -1.15) -> (50.00, 1.74, -5.50) fov 28`, `to: (49.85, 1.82, -1.65) -> (50.00, 1.70, -5.50) fov 26`.

  * **Group shots & solo CU separation (ALL 28 shots verified `0` edge clips at `t0`, `tm`, `t1`):**

    * `GLACIER_MARCH` echelon tightened to `worsley (-1.10)`, `crean (+1.05)`: `SH01` `z 14.8→14.5, fov 30→29`; `SH02` `x 2.4→1.8, z 17.6→18.2, fov 31→30`; `SH03` `z 20.4→19.6, fov 36→35`; `SH04` `z 19.4→18.4, fov 30→29`; `SH05` `z 18.6→21.8, fov 31`; `SH22B` `z 20.8→19.6, fov 32→31`; `SH26A` (Frame 1860) `z 20.6→19.8, fov 32→31`.

    * `LIFEBOAT_SEA`: `SH06` `pos (3.0, 2.55, 14.4)→(2.0, 2.65, 13.6), fov 33→32`; `SH07` `pos (-2.0, 2.35, 15.0)→(-1.0, 2.45, 14.2), fov 33→32`.

    * `ELEPHANT_ISLAND`: 18 stranded men compacted into 9:16 beach huddle (`x ∈ [-2.45, +2.45]`, foreground trio `s4_kid -1.05, s4_chief 0.0, blind_gus +1.05`): `SH08` `z 24.8→23.0, fov 36→35`; `SH09` (Frame 630) `z 19.6→18.6, fov 34→33`.

    * `GLACIER_CROSSING`: `worsley (-1.10)`, `crean (+1.05)`; `SH10` `z 18.6→17.6, fov 33→32` (`SH11` Frame 801 untouched).

    * `SNOW_SLEEP`: `worsley (-1.65)`, `crean (+1.65)`; group shots `SH14` `z 19.6→18.6, fov 34→33`, `SH15` `z 19.2→18.2, fov 33→32`, `SH17` `z 19.4→18.4, fov 33→32`; solo watch CU `SH16` `z 9.2→8.6, fov 25` (neighbours 100% off-screen).

    * `SHELTER_CONFESSION`: `worsley (-2.15)`, `crean (+2.15)`; group shots `SH18` `z 21.8→20.6, fov 34→33`, `SH22A` `z 21.4→20.6, fov 34→33`; solo CUs `SH19` `z 10.4→9.8, fov 26→25`, `SH20` `z 10.2→9.6, fov 26→25`, `SH21` `z 10.2→9.6, fov 26→25` (neighbours 100% off-screen).

  * **Prop rigging & torso-piercing pole removal (PROP GUARD):**

    * Removed rigid `12.0 D` `marchRope` cylinder at `(0, 1.35, z)` from `GLACIER_MARCH` in `set.js` and replaced it with a snow-level (`y = 0.04`) trailing ground rope curve alongside the 4th footprints at `x = +1.75` (zero torso/leg piercing in Frame 0 and Frame 1860).

    * Set `adze_shackleton` `at: [0, 0, 0], rot: [0, 0, 0], scale: 0.92`, kept `in: 'hand:R'` strictly on `line:1.start` (`0–13 s`) and `line:10.start` (`23–30 s`) and `in: 'hidden'` on `line:7.start` and `line:12.start` onward, and added `{ clip: 'carry', at: 'line:10.start+0.16', params: { prop: 'adze_shackleton', side: 'R' }, hold: 2.6, out: 6, keep: false }`.

* **One-frame diagnostics after Build Repair 2:**

  * **All 28 shots (`t0`, `tm`, `t1`):** `0` edge-clipped figures across all 21 cast members (`SH01`: Shackleton `x:389..690`, Worsley `x:176..427`, Crean `x:632..859`; `SH09` Frame 630: all 18 stranded men inside frame, foreground trio `x:238..830`; `SH26A` Frame 1860: Shackleton `x:410..724`, Worsley `x:175..433`, Crean `x:631..860`).

  * **SH12 (Frame 840 @ `t = 28.0 s`):** camera target `[1236.21, 1.70, -5.48]`, `fov = 27.0°`; fills frame with ice shelf & carved notch in bottom third, forged steel blade biting ice at `(298, 1297)`, steel socket at `(423, 1102)`, ash handle rising diagonally through centre, lower gloved hand + coat forearm at `(620, 763)`, upper gloved hand + coat forearm at `(806, 448)`, and 18 bright ice chips spraying around the bite.

  * **SH13 (Frame 882 @ `t = 29.4 s`):** camera target `[1250.00, 1.72, -5.50]`, `fov = 26.9°`; fills entire 9:16 frame from top-left `(23, 167)` to bottom-right `(1092, 1836)` with 3-strand braided diagonal rope under strain, hero's parka shoulder/collar/brass buttons at `(390, 803)`, upper gloved hand + forearm gripping rope at `(404, 644)`, and lower gloved hand + forearm gripping rope at `(718, 1237)` against sunlit glacier snow backdrop.

  * **Repair 1 rig integrity (`t = 0.00 s`):** `'fourth_man_set'` present `true` (`1,234` meshes), `33` live lights (`1` HemisphereLight, `1` AmbientLight, `1` DirectionalLight, `30` PointLights), `sky_dome_march` `#6e8399`, `scene.background = #7d92a8`, Frame 801 `macro_boot_screws` untouched (`true`, `6` children, `#90b2cf`).

## HANDOVER (build — post Build Repair 2, 2026-11-24)

AT THE BAR: `scenes/BIBLE.md`, `scenes/film.js`, `scenes/set.js`, `scenes/props/adze.js`, `scenes/props/pocket_watch.js` syntax-clean (`node --check`), `0` edge-clipped figures across all 28 shots, SH12 (adze + hands + ice chips) and SH13 (diagonal braided rope + 2 gripping hands + parka shoulder) re-staged and verified in 1080×1920 pixel space, rigid torso-piercing `marchRope` removed, `adze_shackleton` cleanly rigged in `hand:R` with `carry` clips and hidden on non-march beats, and Repair 1's 33-light + vertex-dome + Frame 801 rig preserved intact. Pending desk fleet re-probe and fresh blind critic round.
STILL BELOW THE BAR (for downstream passes):

1. Sparse, flat-shaded procedural set geometry — job: `environment` (Blender `.glb` glacier ridges, crevasses, waves, shelter timbers, hero macro models).

2. Ending warm-light shift, DoF, haze, bloom, and face shading — job: `post` and `shading`.
   DO NOT TOUCH: `audio/clean.wav`, `audio/clean.json`, 20 lines, 21 cast specs, shot order/timing, FOURTH MAN RULE, Repair 1 lighting/dome rig, and SH11 Frame 801 boot-screws staging.