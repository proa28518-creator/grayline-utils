# Lessons — Build Pass (`«The Fourth Man on South Georgia»`)

## Full-Method Revision Log (Changes Forced by Complete Method + API Docs + Bar Stills)
1. **Clip registry compliance (`api/MOTION_API.md` `clips.js`):** Replaced all 9 non-existent clip names from the initial draft with real engine clips (all using `params: { ... }`, `hold`, and `out`):
   - `march_brace` → `carry` (`adze_shackleton`, `keep: false`) + `lean_over`
   - `rope_pull` → `lean_over` + `point`
   - `halt_glance` → `shock_pop` + `head_turn`
   - `helm_grip` → `brace`
   - `row_oar` → `lean_over` + `wince`
   - `bail_water` → `lean_over`
   - `collapse_snow` / `sit_up_blink` → `sit_down` (`seat: 0.45`) + `stand_up` (`from: 'sit'`)
   - `check_watch` → `carry` (`pocket_watch`, `keep: false`)
   - `gentle_wake` → `point` (`dir` sideways `z <= 0.3`)
   - `hold_mug` → `sip` (`tin_mug_shackleton`)
   - `lean_confess` → `lean_over` + `talk_hands`
   - `solemn_nod` → `point`
   - `look_around` / `turn_mist` → `head_turn`
   - `wave_shore` / `shield_eyes` / `huddle_cold` → `wave`, `hand_to_temple`, `brace`
   - `ice_climb` → `lean_over`
2. **Voice schema (`references/film.md`, `api/FILM_API.md`, `references/voice-sound.md`):** Replaced top-level `audio`/`lines` with `voice: { file: 'audio/clean.wav', words: 'audio/clean.json', lines: [{ who: null, text }] }` (20/20 segments verbatim as heard; `who: null` narrator = no lip sync, captions active).
3. **Face enums & ENG5 rhythm (`api/FACE_API.md`, `api/MOTION_API.md`, `s4_01.jpg`, `02-story-to-shots.jpg`):** Replaced non-registry states (`narrow`, `firm`, `tired`, `scan`, `furrow`, `grit`, `soft`, `guarded`, `side`, `awe`, `shut`, `blink`-as-eye-default, `open`-mouth) with exact `FACE_API` enums (`wide`, `open`, `half`, `wince`, `angry`, `sad`, `look_l`, `look_r`, `pinpoint`, `blink`; brow `on`, `up`, `down`, `knit`, `worried`; mouth `rest`, `smile`, `D`, `grid`, `o`, `flat`, `tight`, `gulp`). Upgraded Frame 0 (`SH01`) from `wince` to `eyes: 'wide', brow: 'knit', mouth: 'tight', react: false` to match the wide-eyed opening bar (`s4_01.jpg`, `02-story-to-shots.jpg`), and added `hold: true, react: false` on sleeping faces.
4. **Carry release (`api/MOTION_API.md` ENG7):** Added `keep: false` to Shackleton's `carry` clips so his right arm does not stay locked in chest-carry after place cuts.
5. **Camera schema (`references/film.md`, `references/camera.md`):** Added explicit `move: 'push'`, `t0`/`t1`, and `roll: [r0, r1]` on every shot's `camera` object (instead of roll nested inside `from`/`to`).
6. **Multi-place `set.js` contract (`references/sets.md`, `api/WORLD_API.md`, `references/examples/s4.md`):** Updated `buildSet(THREE, scene, opts, kit)` to build a clean `THREE.Group` directly on `scene` (removing `kit('plain')` whose default sand ground plane at `y = 0` would Z-fight with snow, timber, and depressed ocean water), enforced `depthWrite: true, renderOrder = -10` on all 7 sky domes, called `update(0)` before return, exposed `lightDir` and `lights` in `world/look/lights.js` format (`<= 8` lights/place), and authored custom props `scenes/props/adze.js` and `scenes/props/pocket_watch.js` with grip origins and keyable `open` state.
7. **Set-bar & PROP GUARD contracts confirmed:**
   - **Set bar (`references/quality-bar.md`, `03-set.jpg`):** Per shot `>= 22%` detail / `<= 80%` flat; film median `>= 28%` detail / `<= 78%` flat; `<= 40%` shots under. Build measures it on the desk fleet; Environment, Post, and Shading must pass it.
   - **PROP GUARD (`references/film.md`, `api/FILM_API.md`):** Over `40 px/frame` reported; real world jump `> 0.04 D` and `> 2.5x` neighbours fails. All 3 props (`adze_shackleton`, `pocket_watch`, `tin_mug_shackleton`) change `in: 'hand:R'` / `'hidden'` strictly on exact shot cuts, declare top-level keyed opts (`open: 1`), and have zero mid-shot hides or unkeyed drops.

## Pre-Desk Audit Results
- `node --check` passed clean on `set.js`, `film.js`, `adze.js`, `pocket_watch.js`.
- Automated engine-API & 3D 9:16 frustum audit: **28 shots, 20/20 lines, 21 cast specs, 3 props, 0 errors, 0 warnings**.
- Frame 0 (`SH01`, `t = 0.0 s`): Shackleton head `384 px` at `(540, 866)` (strictly above lower-third caption band); talking heads `319–411 px`; establishing wides `194–216 px`; cuts `1.30–3.00 s` (`SH05` holds `12–13 s` pause unbroken); 0 `Math.random`/`Date` calls; 0 keys within 3 frames of cuts; 0 fourth-person cast entries.

## Frames Requested Next from the Desk Fleet
1. **Opening critic round (§13.4):** `t = 0.00 s` (`frame 0`) and `t = 1.50 s` (`frame 45`).
2. **Standard 13 sampled frames (§12):** `t = 0, 3, 8, 11, 15, 21, 28, 33, 38, 45, 52, 58, 62 s` (`frames 0, 90, 240, 330, 450, 630, 840, 990, 1140, 1350, 1560, 1740, 1860`).
3. **§7 close-up & pause verification frames:** `t = 12.50 s` (`frame 375`), `t = 26.70 s` (`frame 801`), `t = 27.95 s` (`frame 839`), `t = 29.00 s` (`frame 870`), `t = 29.40 s` (`frame 882`).

---

## HANDOVER (build, 2026-11-24)
AT THE BAR: `scenes/BIBLE.md` complete (20 segments + 1 pause, 7 places `400 D` apart, 21 ready cast specs, 0 new characters); `scenes/film.js`, `scenes/set.js`, `scenes/props/adze.js`, `scenes/props/pocket_watch.js` revised against the full method and verified syntax-clean (`0 errors, 0 warnings`); Frame 0 Shackleton head `384 px` (`wide`/`knit`/`tight`), talking heads `319–411 px`, establishing wides `194–216 px`, 28 moving shots, all clips verified in `clips.js`, all face keys verified in `FACE_API.md`, all §7 mandatory close-ups staged, FOURTH MAN RULE and MOVEMENT LAW enforced. Set-bar detail/flat %, critic rounds, and blind score: pending desk fleet render and blind critic rounds.
STILL BELOW THE BAR (worst first):
1. `SH01–SH07, SH10, SH14–SH17` (open snow & ocean shots): procedural previz planes may measure below `28%` median detail / `78%` flat bar vs. bar stills' rich modelled near-ground detail — job: `environment` (Blender `.glb` glacier ridges, crevasses, sculpted waves, textures).
2. `SH11–SH13` (`26.0–30.0 s`, §7 macro close-ups): primitive Three.js boot screws, adze blade, and rope twist rings need full-size inspection to verify instant phone readability — job: `this pass again` (if unreadable on `scale: 1`) / `environment` (hero Blender models).
3. `SH06–SH07` (`13.0–18.0 s`, *James Caird* lifeboat): character feet/legs at fixed `y = 0.42–0.45 D` while hull pitches in `set.js` may clip thwarts/gunwales at peak roll — job: `this pass again` after viewing frame `450`.
4. `SH26B` (`60.8–62.92 s`, Arabic title card): `Noto Sans Arabic` / `Cairo` font shaping on fleet headless Chromium unverified — job: `this pass again` after viewing frame `1860`.
5. Unshaded faces & no per-place DoF/haze/bloom/snow-grade yet — job: `post` and `shading`.
DO NOT TOUCH: `audio/clean.wav` and `audio/clean.json` (verbatim 20 segments + `12–13 s` pause); 21 ready-made cast specs (zero new characters); 7 `PLACES` `400 D` anchors; `SH01` Frame 0 face framing; `SH05` unbroken `12–13 s` pause hold; FOURTH MAN RULE trace-only staging.
NOT CHECKED: No local renders run — `check_preview`, `film_probe` (PROP GUARD), `film_sheet`, full-rate strips on fast moves, `render_frames` at `scale: 1`, `film_check { kind: 'set' }`, Opening critic round, and Build whole-film blind critic round are all pending the desk fleet.
