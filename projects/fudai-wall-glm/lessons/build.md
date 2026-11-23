# lessons/build.md — Fudai Wall, Build pass

## What this desk could and could not do
Authored at the builder's desk with no app renderer, no `check_preview`/`film_probe`/`film_sheet`
access, and no engine copy mounted. Everything below marked "authored" is decided and written; every
number marked "measured" must come from the desk's first run. Nothing here was graded by the builder:
the opening critic round and the whole-film rounds are the desk's to run.

## Tried / Saw / Fixed
- **Tried** to honour the shot plan's scene-1 tilt-up "from the ground beside the mayor" literally.
  **Saw** it opens on ground/wall, which breaks the frame-0 face law (head ≥ 300 px, expressive).
  **Fixed** at the cause: frame 0 is the mayor's face at d ≈ 12.5 (≈ 333 px), camera low at chest–eye
  height, and the tilt rises from that same shot (shot 1 path keys). The reconciliation is written in
  BIBLE §7.1, not done silently.
- **Tried** to hold the member's split-comparison aerial in one frame (his wall vs the neighbours').
  **Saw** places sit 400 D apart in their own domes/fog — both walls cannot share a frame honestly.
  **Fixed** as the member's own lateral pan realised as a cut juxtaposition: shot 6 (15.5M datum glowing
  on the full skeleton) → shot 7 (16 D walls with `10M` stickers). Named in BIBLE §7.2 as a deviation.
- **Tried** to make the construction wall "rise gradually" with a static set. **Saw** set geometry is
  static per the pure-in-t law. **Fixed** with a full-height scaffold skeleton + a `wallrise` concrete
  body that grows by opts keys (h: 3 → 24.8 D; the last metre poured at 56.5–57.0), so the member's
  54.88 pour happens at a real top edge with workers riding it (`height` keys matched to the body top).
- **Tried** a storm dome swap on the coast for scene 5. **Saw** a place's dome is fixed in Build and
  per-place fog hooks are not exposed to `scenes/` at this desk. **Fixed** with stormclouds props
  fetched on cuts (37.39 coast, 35.70 site) and a `part` key opening the sun shaft on the 64.19 cut.
  The true storm dome is Environment's job — carried in the HANDOVER as a gap, not hidden.
- **Saw** `.add(mesh).position.set(...)` chains in the first set draft silently moved whole place
  groups (`.add()` returns the group). **Fixed** at the cause: every mesh is positioned explicitly
  before `add` — a full sweep over set.js and props.
- **Tried** `drop` keys for the coins/leaf. **Saw** the whole-film motion could be expressed with the
  documented opts + fetch/stow pattern only. **Fixed** by using no `drop` keys anywhere: every prop
  motion is opts keys on words or fetch/stow on cuts, so PROP GUARD should see only continuous tweens
  plus sanctioned appears. (The one `snap: true` is the wave's real hit at خبطت, which the guard allows.)
- **Tried** to give the villagers' mock line a `!`-shout. **Saw** the transcript carries `؟`, and the
  text is law. **Fixed** with `loud: true` on line 9 — the shout is acting, the words stay as heard.
- **Mechanical validation round (local, no renderer):** built `scripts/parse_words.py` +
  `scripts/validate_film.mjs` against the member's own timestamp file. **Saw** five real faults:
  (1) `expr: 'sad'` is not a documented preset (`sad` is an eyes value) on 5 face keys — rewritten as
  explicit `eyes/brow/mouth`; (2) the sun-wheel stowed mid-shot (a visible pop) — its spin now completes
  0.2 s before the 27.72 cut and it stows on that cut; (3) v5's door placement was a mid-shot teleport —
  moved onto the 64.19 cut; (4) the leaf never visibly landed — its landing pulled to 34.97 with a
  visible rest before the 35.70 stow; (5) two talking heads measured over the bar (blueprint insert end
  451 px, young-mayor BCU 535 px at its push end) — both cameras re-set inside the 8–12 % push band
  (403 px / 420 px worst). Also caught and repaired: v2's quake/wave runs lost in an edit — restored
  with a place key on the 37.39 cut so the run starts where he stands. **Fixed** all at the cause;
  the suite now reports ALL CHECKS PASS (186/186 words, 284 time keys, 30 shots 1.55–2.91 s,
  no off-cut place changes, no raw seconds).

## Still weak (worst first — for the desk's eyes, not the builder's verdict)
1. **Set bar unmeasured.** No renderer here. Geometry is budgeted to the bar (modelled detail near the
   lens: houses with sill boxes/chimneys/doors, lantern bodies, gate rivets/ribs/wheel, scaffold planks,
   crane, concrete prints; far ends 25 D+ along every look; 2+ practicals per place), but the honest
   number must come from `film_check { kind: 'set' }` at the desk. Reported honestly either way.
2. **Mayor's ageing is carried by gait/staging/light only** — no grey/young hair delta, because the
   owner's instruction forbids character authoring and no wardrobe-merge mechanism is documented for
   built-in specs. Needs the owner's ruling (one-file follow-up) or stays as staged.
3. **Crowd density:** the plan asks "بضع عشرات من السكان" in the square; six staged villagers + depth
   carry it in Build. Sprites/crowd fill is Environment-pass work.
4. **Arabic canvas prints** (gravestone plate, mock sign, scrawl, wall plaque "م") depend on the render
   fleet's font coverage. Digits-only labels (3,000 / $30M / 15.5M / 10M / 15M) are font-safe by design.
   First frames must confirm; fallbacks are listed in the report.
5. **Per-place fog:** one global `FogExp2` is set; each place's own colour mood rides its dome. If the
   engine exposes per-place fog to `scenes/`, Environment should wire it; recorded as a gap.
6. **The match-cut dissolve (54.88)** is a hard cut with matched frame centre at Build; the dissolve is a
   later camera/post refinement. **The young-mayor face at rock is staged 3/4 (ry 145)** so no back is
   shown, but his gaze to the sea relies on `look` keys — check on frames.
7. **Shot 22 (rock track) keeps the young mayor's head out of frame right** (arm-only insert) so no face
   is cut by the edge; verify on the full-rate strip that the head stays fully out and the hand reads.

## Repair round 1 (desk render fleet — measured faults, fixed at the cause)
- **FAULT 1 — all 8 sampled frames died at boot: `Cannot read properties of null (reading
  'Group')`, zero frames rendered.** **Tried** a defensive `pickT(opts, THREE)` chain in all 18
  prop files (THREE as 2nd arg, via `opts`, or as a global) and `buildSet(THREE, scene, opts,
  kit)` trusting arg 1 — written at authoring time because no loader contract was available at
  this desk. **Saw** the host passes no THREE in at all: the documented prop contract is
  `export function build(opts) -> Object3D` (film.md), so every fallback path returned null and
  the first `new T.Group()` read `.Group` off null — the exact boot error, on every frame.
  **Fixed** at the cause with the lanes' working pattern: every `scenes/props/*.js` now begins
  with `import * as THREE from 'three';`, exports the one-argument `build(opts)`, and uses the
  module-scoped THREE (`const T = THREE`); `pickT` is deleted everywhere — no fallback chain
  that can return null remains (swept: zero `pickT` / `opts.Group` / `THREE.Group` /
  `typeof THREE` reads anywhere in scenes/). `scenes/set.js` likewise self-imports THREE and no
  longer trusts arg 1: `buildSet` locates the host's scene by shape — the documented
  `(THREE, scene, opts, kit)`, `(scene, opts, kit)`, or a `{ scene }` context, all probes
  null-guarded — and throws a named error if no scene arrives; the params were renamed
  (`a, b, c, d`) so no parameter can shadow the import. **Verified locally against a real
  `three` install** (`scripts/smoke/smoke_props.mjs`): all 18 kinds build under `{}` and under
  the film's own opts (46 build calls), `buildSet` boots under all four call shapes with a real
  Scene (6 places, points, root attached), and the word/timing suite still passes untouched.
- **FAULT 2 — `kind: 'box'` at film.js line 408, first reported as "no engine built-in 'box'".**
  **Saw** the owner addendum govern over the first fleet report: the current engine's built-in
  list (`lab/film/props.js`: cane, loaf, bread_loaf, half_loaf, bread_half, mug, newspaper,
  box) includes `box`, matching the mounted film.md list that also names `box` — so the beat
  resolves via the built-in and needs no change. This desk has no engine copy mounted (the
  authoring-time copy was lost with the recycled sandbox), so `lab/film/props.js` itself could
  not be opened here; the addendum's citation is the authority and was followed.
  **Fixed** by NOT delivering `scenes/props/box.js` — none was ever written (the stopped reply
  preceded it) — and leaving film.js line 408, the BIBLE registry row (`built-in \`box\``) and
  the HANDOVER's built-in list exactly as delivered. Fallback on record: if the fleet still
  reports `box` unresolved, the repair is one file — `scenes/props/box.js`, self-importing
  THREE, `export function build(opts) -> Object3D`, origin at the grip, worn cardboard with
  FUDAI stencil + municipal seal + label lines + tape, `open`/`worn` state — keeping the beat's
  timing and meaning unchanged.

## Pending verifications (first desk run)
- **Resolved in repair round 1 (above):** the prop-builder signature — the host passes no THREE
  in; every scenes file self-imports (`import * as THREE from 'three'`) and exports the
  documented one-argument contract `build(opts)`. Closed, not carried.
- Hand props (`box_b`, `pen_p`, `ruler_r`, `flowers_v1/v4`) appear via fetch keys with a static `in` —
  confirm the stage attaches them to the owner's hand at the fetch (fallback: attach on the cut).
- `endHold: 0.2` (the member's loop-cut wish) — confirm the key's semantics on the resolved film.
- `film_probe` PROP GUARD over the wave approach (61.56–62.6): the adv tween is continuous but fast;
  its neighbours move comparably, and the hit carries `snap: true`.

## HANDOVER — Build

**MADE (files, one writer each):**
`scenes/BIBLE.md` (topics §8 tables: 37 line rows, 6 place rows, cast, colour script, shot plan,
prop registry, reconciliations, sound/caption notes) · `scenes/film.js` (the film: 37 lines as heard,
10 cast from the ready set, 31 prop entries, 30 shots, `captions: 'words'`) · `scenes/set.js`
(6 places at 400 D spacing, own domes, depth along every look, lights as data) ·
`scenes/props/`: gate, wave, measure, calendar, blueprint, ruler, gravestone, sign, money, wallrise,
drybed, floodwater, oldflood, wallmark, sunmoon, stormclouds, swaypole, debris (18 kinds, all with
print and state; built-ins used: `box`, `pen`, `flowers`) · no `scenes/cast/*.json` (owner's
no-new-characters instruction; casting registry lives in BIBLE §1 + film.js) · no `post.js`/`shade.js`
(later passes).

**NUMBERS (authored; measured ones pending the desk):**
- Words: 186/186 in 37 lines as heard (mechanically checked against the member's timestamp file by
  `scripts/validate_film.mjs` — total, per-line join, and order all equal).
- Shots: 30; cut durations resolved to 1.55–2.91 s (mechanically checked); every t0/t1 a `line:` key.
- Frame 0: mayor's face, d 12.5 → ≈333 px (authored by construction; confirm on the rendered frame).
- Talking heads 300–430 px by design (d 9.7–13.9); establishing wides 180–250 px (shots 2, 5, 7, 15,
  21, 24, 26); BCUs to ≈429; inserts prop-first by design.
- Scale: wall/gate 24.8 D, wave 24 D, neighbours' walls 16 D, places 400 D apart.
- Set bar: **NOT MEASURED AT THIS DESK — no renderer.** Authored to pass; first desk action is
  `film_check { kind: 'set' }`; report the real numbers in the next round either way.

**GAPS FOR LATER PASSES (do not treat as Build faults):**
- Environment: true storm dome on the coast for S5 (Build used cloud props on cuts); per-place fog
  hooks; crowd-density sprites; the neighbours' flooded-state water as real set water (Build used the
  `floodwater` prop).
- Camera/post: the 54.88 match-dissolve refinement; the sun-shaft volumetric after 64.19 (Build used a
  translucent shaft plane); DOF `focus` anchors per shot.
- Post: per-place grade rows (BIBLE §6 has the moods); haze numbers per the quality-bar table.
- Shading: nothing owed from Build.

**DO NOT CHANGE in later passes:** line texts/times, acting keys (face/clip/look/walk/place/height),
prop ids and their cut/fetch/stow boundaries, place layout and origins, shot boundaries (Camera angles
rewrites `shots` cameras, not their t0/t1), the cast (built-in ids per the owner's instruction).

**FIRST FRAMES TO RENDER (desk):** 0.0, 0.5, 1.4, 2.6 (opening + tilt), 3.5 (pull-back wide), 10.0
(construction glide), 15.2 (neighbours aerial + stickers), 18.8 (mocker BCU face check), 19.3 (coins),
21.9 (deadpan push), 23.9 (blueprint hands), 33.8 (grave reveal + leaf), 38.3 (quake street),
40.2 (drybed), 43.8 (wave + measure15), 46.0 (sepia flashback), 50.0 (rock mark + hand), 52.6 (room
analogy), 55.5 (pour at the top edge), 58.8 (neighbours flooded), 62.3 (impact side profile),
64.9 (crane reveal + sun shaft), 67.4 (grave bow). Plus one full-rate strip on 61.5–62.8 (the wave hit)
and 37.3–38.8 (the quake) — the fast moves.
