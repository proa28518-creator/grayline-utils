# CODEX BRIEF — Fudai «السور اللي وقف الموجة» — OPENING build (SH01–SH03)

You are the code seat for this build (repo AGENTS.md authorship rule). Author ONLY the
files listed under DELIVERABLES, all inside `projects/fudai-wall/scenes/`. Read the
precedents first; match their format exactly. This is the OPENING of the film only —
shots SH01–SH03 — but the place table and cast are the film's full foundation.

## Read first (precedents — format law)
- `projects/demo-ring/scenes/film.js` — THE film contract (default export shape).
- `projects/demo-ring/scenes/set.js`, `projects/demo-ring/scenes/post.js`,
  `projects/demo-ring/scenes/shade.js` — own-set + post/shade wrapper pattern.
- `projects/demo-ring/scenes/cast/groom.json`, `projects/story6-microwave/scenes/cast/mocker.json`
  — cast JSON schema.
- `projects/story6-microwave/scenes/set.js` (first ~120 lines only) — multi-place world:
  PLACES rig table + `createLightRig` / `createPost` / `createRigShade` usage.
- `projects/fudai-wall/scenes/BIBLE.md` — the film bible: PLACES anchors, cast, scale, lines.
- `projects/fudai-wall/STYLE_SHEET.md` — locked look (2.5D flat cast, CALM state for S1).
- `projects/fudai-wall/BUILD_CALL.md` — the contract section (non-negotiable format points).
- `projects/fudai-wall/engine/props/_kit.js` + `engine/props/_template.js` — prop module kit
  (`build(o)` → Object3D, origin at grip, `finish(g, sockets)`); film-local kinds resolve
  from `scenes/props/<kind>.js` (import the kit as `../../engine/props/_kit.js`).
- `projects/fudai-wall/audio/clean.json` — word timings (line 1: 0.10–4.18, line 2: 4.56–6.56,
  line 3: 7.06–8.89). Voice lines in film.js = ALL 24 lines of
  `projects/fudai-wall/script_owner_ar.md`, verbatim, `who: null`.

## Hard rules (violations = rejected delivery)
- NEVER edit anything under `engine/`, `world/`, `lib/`, `specs/`, `audio/`, or any other
  project. Write only the deliverables below.
- Pure in t: no `Math.random`, no `Date`, no cross-frame state. Seeded `rng(seed)` from the
  kit only.
- `film.props` is an ARRAY of `{ id, kind, in: 'world', at: [x,y,z], keys: [{ t, at }] }`.
- ONE PLACES table: declared once in `scenes/set.js` and EXPORTED as `PLACES`; `film.js`
  imports it (`import { PLACES } from './set.js'`) and derives EVERY cast position, prop
  `at`, and camera pos/target from its anchors + named local offsets. No bare coordinate
  literals for place geometry anywhere in film.js (small local offsets from an anchor are
  the named-offset pattern: write them as `PLACES.X.at[0] + dx` style expressions or as
  consts computed from PLACES at module top — never as unexplained world literals).
- Frame 0 = the Mayor's expressive face, tight, low angle (head ≥300 px on the 1920-tall
  frame — camera close enough: roughly ≤4 D from his head, fov ≈ 34).
- Scale law (BIBLE): 1 D ≈ 0.86 m; adult ≈ 2 D tall. Wall = 18 D tall at z = −16, steel
  gate leaf in its centre. Wave (later) 17.5 D. Houses 4–5 D.

## PLACES (anchors from BIBLE — set.js exports this table; each entry carries
`at` [x,y,z] anchor, `bounds` {x:[min,max], z:[min,max]}, plus the rig fields
`sky, ground, fog, ao, lights` in the story6/demo-ring rig format)
- COAST_WALL: anchor [0, 0, −16] (the wall line); bounds x [−40, 40], z [−20, −12].
  CALM: warm low sun key + 2 gate-lantern points at the gate.
- COAST_VILLAGE: anchor [0, 0, 2]; bounds x [−30, 30], z [−10, 14]. CALM; practicals:
  house windows / harbour lamps (2+ point lights).
- SEA: anchor [0, 0, −44]; bounds x [−60, 60], z [−70, −18]. CALM; sun glitter path feel
  via a cool point over the water.
- NEIGHBOR_COAST: anchor [600, 0, 0]; bounds x [560, 660], z [−30, 20]. CALM rig fields.
- FLASHBACK_ROCK: anchor [1200, 0, 0]; bounds x [1160, 1240], z [−30, 20]. SEPIA rig fields.
- ROOM: anchor [1800, 0, 0]; bounds x [1796, 1804], z [−4, 4]. Warm interior rig fields.
- HILL_GRAVE: anchor [2400, 0, 0]; bounds x [2360, 2440], z [−20, 20]. MELANCHOLY rig fields.
Post/shade `zones` map every place name → [anchorX, anchorZ].

## DELIVERABLES
1. `scenes/cast/*.json` — NINE specs, groom/mocker schema (`_doc, face, hair, hat, limbs,
   torso{body, outfit{layers, trousers}}`):
   - `mayor.json` — hero, prime state: short GREY hair, dark municipal suit (shirt + dark
     jacket layers), upright; calm deadpan face defaults.
   - `mayor_old.json` — same man, WHITE hair (only hair colour/state differs + _doc note).
   - `mayor_young.json` — same man, BLACK hair.
   - `mocker_a/b/c.json` — fisher clothes, warm contrasting colours, one owned colour each,
     hats from `engine/hats/` (strawhat / flatcap / beanie — check each hat module's opts
     for colour), expressive faces (eyeSize/browThick up).
   - `villagers.json` — crowd extra spec, 1–3 torso details, muted fisher colours.
   - `child.json` — kid build: limbs shortened (armLen/legLen scaled ~0.72), head NOT
     scaled (no head-size fields), 1–3 torso details.
   - `workers.json` — construction extras: work clothes + ballcap/flatcap.
2. `scenes/props/seawall.js` — kind `seawall`: the giant concrete wall + steel gate.
   Origin at the wall's base centre. Opts: `w` (length, default 90 D), `h` (default 18),
   `gateW` (default 7). Grey concrete flat tones, panel seams, a darker steel gate leaf in
   the centre with cross-bracing, gate lanterns as small emissive-ish boxes at both gate
   posts. Pure, seeded detail only.
3. `scenes/props/storeys.js` — kind `storeys`: the transparent 5-storey height diagram
   that stands beside the wall in SH01/SH02: 5 stacked translucent floor slabs (basic
   material, transparent, opacity ~0.35) with floor numbers 1-2-3-4-5 drawn via
   `canvasTex` on a side plate; total height = wall height × (5 storeys ≈ 15 m ≈ 17.4 D —
   use opts `h` default 17.4, `floors` default 5). Ink edges via `part`.
4. `scenes/props/boat.js` — kind `boat`: a small fishing boat (hull, mast, furled sail,
   lantern), origin at waterline centre. Muted warm wood colours.
5. `scenes/set.js` — `export const PLACES` (above) + `export async function buildSet(THREE,
   scene, opts, kit)` following demo-ring/story6: light rig from PLACES, post/shade look
   from `opts.post`, and IN-ENGINE geometry (kit `flat/part` via `engine/props/_kit.js`
   imports as in demo-ring set.js) building:
   - COAST_WALL place: shore strip + the ground plane running under village→wall→sea;
     NOTE the wall itself is the `seawall` PROP (film.js places it) — the set builds the
     shore, a low stone apron at the wall line, and 2 lantern posts (practicals matching
     the rig points).
   - COAST_VILLAGE place: ground, a square, 8–10 simple wooden houses (4–5 D tall,
     seeded variation via rng), town hall (bigger, at the square's south edge), harbour
     edge with posts + lamps toward the wall. Density matters (set bar): scatter crates,
     barrels, nets, carts — seeded.
   - SEA place: the water plane (big, calm blue) from z −18 to −70 with a subtle glitter
     strip; distant horizon backing.
   - The other four places: their ground pads + ONE anchor silhouette each (neighbour
     coast: a low 12 D wall run + 3 houses; rock: a big rock slab; room: an interior wall
     panel; hill: a grassy mound) — full dressing comes with their shots; anchors and
     bounds must be real so the D2 audit passes.
   - `marks`/`points`: at least { wall_base, gate, square, townhall, harbour, boat_anchor }
     as [x, z] pairs derived from PLACES.
   - `update(t)`: rig update + water shimmer only if pure-in-t (a sin(t) offset is fine).
6. `scenes/post.js` + `scenes/shade.js` — demo-ring/story6 pattern, `makePost()` /
   `makeShade()` (no required args), zones for all 7 places, one CALM day look for the
   three opening places (COAST_WALL, COAST_VILLAGE, SEA) in `places`, other places may
   reuse the CALM entry values. Shade `steps` = the opening shot cuts [2.6, 4.56].
7. `scenes/film.js` — the film, OPENING ONLY:
   - `fps: 30`, `size: [1080, 1920]`, `world: { set: 'own', setOpts: { post: { ...makePost(),
     shade: makeShade() } } }` (story6 pattern).
   - `voice: { file: 'voice_owner.wav', words: 'audio/clean.json', lines: [all 24 lines
     verbatim from script_owner_ar.md, who: null] }`.
   - `cast: { mayor: { spec: 'cast/mayor.json', at: <COAST_WALL shore, in front of the
     gate>, ry: <facing camera/sea-side south, toward +z and slightly up> } }` — opening
     cast is the mayor alone (other entries join with their shots).
   - `acts.mayor`: face keys — t=0 expressive determined calm (eyes open, brow up slight,
     mouth tight); at `line:1.word:2` (سور) eyes look_up; hold deadpan. look keys: t=0 at
     his own face-forward point (toward camera), then at the wall top (PLACES-derived) from
     `line:1.word:2`. One subtle clip is enough (e.g. `stand` if the clip exists — check
     demo-ring clips vocabulary; if unsure, omit clips entirely rather than inventing one).
   - `props` ARRAY:
     - seawall: at PLACES.COAST_WALL anchor, keys [{ t: 0, at: same }].
     - storeys: beside the wall (anchor + x offset ~ +14), keys [{ t: 0, ... }].
     - boat: on the SEA (anchor + offset), keys [{ t: 0, ... }] — it must read in SH03's
       glide; give it a second key at 'line:2.end' with a tiny seeded drift offset (pure
       keyed motion, no jump).
   - `handovers: []`.
   - `shots` (times: line 1 = 0.10–4.18, line 2 = 4.56–6.56):
     - SH01 t0 0 → t1 2.6: TILT-UP. from: pos close on the mayor's face, low angle
       (pos ≈ mayor + [0.7, 0.9, +3.2] in PLACES-derived terms, target = his head
       [x, 1.55, z]); to: pos pulled back/up (mayor + [3.5, 9.0, +10]), target = wall top
       centre (COAST_WALL anchor + [0, 17, 0]). move: 'push'.
     - SH02 t0 2.6 → t1 'line:1.end': CRANE PULL-BACK. from = SH01's to; to: high wide
       (pos ≈ [12, 26, +30] relative to COAST_VILLAGE anchor), target = the wall/village
       midpoint (COAST_WALL anchor + [0, 6, +6]). move: 'push'.
     - SH03 t0 'line:2.start' → t1 'line:2.end': SEA GLIDE. from pos over the water
       (SEA anchor + [−16, 3.5, +6]), target the boat; to pos (SEA anchor + [+16, 3.5, −2]),
       target still the boat (PLACES-derived). move: 'push'.
     All camera pos/target values computed from PLACES at module top into named consts.
   - `captions: 'words'`.
8. `lessons/build.md` — start it: what was authored, the PLACES table summary, known
   gaps (later places' dressing, SH04+ not yet written), ending with a HANDOVER block.

## Self-check before you finish (run these, fix what fails, report outputs)
- `node --check` on every .js file you wrote.
- A grep of your own film.js proving: `props` is an array literal; no `Math.random`;
  no `Date`; every camera/props/cast coordinate traces to PLACES.
- Do NOT run the renderer, do NOT commit, do NOT touch git. Authoring + syntax check only.

Report at the end: files written, node --check results, and anything in the precedents
that contradicted this brief (name it, say what you did).
