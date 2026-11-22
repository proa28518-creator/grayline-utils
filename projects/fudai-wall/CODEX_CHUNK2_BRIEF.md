# CODEX BRIEF — Fudai «السور اللي وقف الموجة» — CHUNK 2 build (SH04–SH12)

You are the code seat for this build (repo AGENTS.md authorship rule). The OPENING
(SH01–SH03) is authored, fleet-probed and critic-PASSED — do not change its shots,
its camera keys, its cast root, or its three props' builds. This chunk EXTENDS
`scenes/film.js` with shots SH04–SH12, adds the cast/acts/props they need, adds nine
new film-local prop kinds, and adds time `states` to two PLACES entries in
`scenes/set.js`. Nothing else.

## Read first (precedents — format law)
- `projects/fudai-wall/scenes/film.js` — the current film (your base; extend it, keep
  every existing line's behaviour for t < 7.06 identical).
- `projects/fudai-wall/scenes/BIBLE.md` — lines, PLACES, cast, colour script, rulings.
- `projects/fudai-wall/scenes/props/storeys.js` + `seawall.js` + `boat.js` — the
  film-local prop format (`build(o)` → group, `finish(g)`, kit imports from
  `../../engine/props/_kit.js`, `canvasTex` for printed graphics).
- `projects/fudai-wall/engine/props/PROPS_API.md` — prop contract (origin = grip;
  for `in:'world'` props the origin is the placement point; keep origins at the
  prop's base centre like seawall/storeys).
- `lib/film/props.js` (the loader + `placeProp`) and `lib/stage.js` — how keys work:
  * placement keys: the LAST key with `t <= now` rules; a key with `in:'hidden'`
    hides the prop from that time; position changes blend only ±0.1 s around a key.
  * **opts-over-time:** a key's extra NUMERIC fields (not t/in/owner/rot/at/ease/
    drop/optsOnly) become the prop's build opts, interpolated: at a key, the value
    eases from the previous value over `ease` seconds (smoothstep); with no `ease`
    it snaps. The prop is rebuilt per value (cached) — so animated opts must be
    cheap to rebuild and the build must place its moving part from the opt.
  * **drop keys:** `{ t, drop: { from:[x,y,z], v0:[x,y,z], g:9.8, ground:<y>,
    hide:true } }` — closed-form fall from `from`, hides when it reaches `ground`.
- `projects/demo-ring/scenes/film.js` — acts vocabulary in use: `face` keys
  (eyes/brow/mouth values), `look` keys, `walk: [{ t0, path: [[x,z],…], speed,
  gait, face }]`, `clips: [{ clip:'point', at, params:{ side, dir } }]`
  (clip names from `engine/clips.js` CLIPS: point, wave, react, hop_bounce, …).
  Use ONLY face values and clip names that exist in `engine/face.js` /
  `engine/clips.js` / demo-ring precedents — never invent one.
- `projects/fudai-wall/world/look/lights.js` — the header documents place `states`:
  `states: [{ from:<t>, sky, ground, fog, lights: { <id>: { power, color, dir } } }]`
  — hard steps: from time `from` on, those fields replace the base values. This is
  the SH11 sky-cycle mechanism (below).
- `projects/fudai-wall/audio/clean.json` — word timings. The ones this chunk keys
  on (seconds): L3 7.06–8.89 (3000 = word 5 @8.03) · L4 9.04–14.14 (30 @9.32,
  و12 word 5 @10.47, بوابة word 9 @11.70, ارتفاعها word 10 @12.21, 15 word 11
  @12.93) · L5 14.40–16.77 (10 = word 9 @16.41) · L6 17.28–19.90 (ضحكوا word 3
  @17.78, بترمي word 8 @18.89, في word 10 @19.50, البحر؟ word 11 @19.62) ·
  L7 20.34–21.62 (هيوصل word 4 @21.05) · L8 22.02–24.52 (ردش word 4 @22.63,
  ولا word 5 @23.18, نزل word 6 @23.39, السور word 7 @23.60, سنتي word 8 @23.96) ·
  L9 25.09–27.72 · L10 28.13–29.68 (أغبى word 3 @28.93).
  In film.js, key times are written as `'line:N.start'`, `'line:N.end'`,
  `'line:N.word:M'` strings (the resolver turns them into seconds) or plain
  numbers where noted.

## Hard rules (violations = rejected delivery)
- NEVER edit anything under `engine/`, `world/`, `lib/`, `specs/`, `audio/`, or any
  other project. Deliverables are listed below; `scenes/set.js` may be edited ONLY
  to add the `states` arrays specified (no geometry, rig, or marks changes).
- Pure in t: no `Math.random`, no `Date`, no cross-frame state. Seeded `rng(seed)`
  from the kit only.
- `film.props` stays an ARRAY of `{ id, kind, in:'world', at:[x,y,z], keys:[…] }`;
  ids unique. Keys inside one prop stay in chronological order (placement keys and
  opts keys may interleave; both mechanisms read the same array).
- EVERY cast position, prop `at`, and camera pos/target derives from the PLACES
  anchors in `scenes/set.js` via named consts at module top (the existing pattern:
  `add(PLACES.X, [dx,dy,dz])`). No bare world-coordinate literals for place
  geometry. (Local offsets from an anchor are the pattern; z for village/wall
  props below already accounts for the D2 zone audit: COAST_WALL bounds are
  z −20..−12 and COAST_VILLAGE bounds z −10..+14 — the shore strip between them
  (z −12..−10) is OUTSIDE both, so construction props sit at z ≤ −12.5.)
- The opening must not regress: SH01–SH03 shot entries byte-identical; the mayor's
  existing face/look keys kept; seawall + boat entries unchanged. The ONE
  permitted change to an existing prop entry: `storeys` gains a third key
  `{ t:'line:3.start', in:'hidden' }` (the diagram is an S1 graphic; it must not
  stand in later shots).
- Numerals are story: `3,000` · `$30M` · `10M` · `15.5M` and the sign «أغبى مشروع»
  must render as legible printed graphics (canvasTex). Latin digits for numerals
  (STYLE_SHEET lock). A wrong or missing number is a blocking fault.
- Colour: this whole chunk is CALM (S2/S3/S4-beats-1–2 per the colour script) —
  no post/shade changes except the SH11 light `states` (which are set data).

## Cast & acts (extend `cast` and `acts` in film.js)

Existing entry `mayor` (root at COAST_WALL base (0,0,−9) via MAYOR) stays. Add:

- **mayor — walks + face/look additions** (append to his existing acts; keep his
  opening face/look keys untouched):
  - walk `{ t0:'line:2.start', path:[[0,-9],[0,-2],[0,2]], speed:5.5, gait:'walk' }`
    — during the sea glide (he is off-screen) he walks from the wall base to the
    village square centre (0,2). Path points are world [x,z]; start the path at
    his root.
  - walk `{ t0:'line:8.end', path:[[0,2],[0,8],[0,10.8]], speed:5, gait:'walk' }`
    — after the blueprint insert he walks south to the town hall's north face
    (town hall box spans z 11.6..16.4 at x 0; he stops at its steps, z 10.8).
  - walk `{ t0:25.3, path:[[0,10.8],[0,13.8]], speed:1.5, gait:'walk' }` — during
    SH11 (wall-only shot, he is off-screen) he steps INSIDE the town hall box
    (occluded by its geometry from any outside camera). This parks the grey
    mayor indoors before SH13 (next chunk) brings out mayor_old.
  - face: at `'line:3.start'` calm presentation (eyes open, brow up slight,
    mouth tight); at `'line:8.start'` the deadpan hardens (eyes open, brow flat
    or down per face.js vocabulary, mouth tight) and holds to `'line:8.end'`.
  - look: at `'line:3.start'` toward the square/camera (a point ~[0,1.5,10]);
    at `'line:8.start'` straight at the camera (a point just south of his head).
- **mocker_a** — spec `cast/mocker_a.json`, at [3, 0.5] (square north-east),
  ry facing south (toward the village/camera; the wall is behind him).
  - face: `'line:3.start'` smile; `'line:6.start'` full laugh (eyes happy,
    mouth wide-open laugh value from face.js, brow up), hold through L7;
    `'line:7.end'` back to smile.
  - clips: `point` at `'line:6.word:3'` (ضحكوا) — arm up toward the wall top
    (dir toward [3,18,-16] from his shoulder); `point` at `'line:6.word:8'`
    (بترمي) — arm toward the sea over the wall (dir toward [3,19,-40]).
  - look: `'line:6.word:3'` at the wall top [3,17.5,-16]; `'line:6.word:8'`
    at [3,18,-40] (over the wall, the sea).
- **mocker_b** — spec `cast/mocker_b.json`, at [-3.5, 3.5], ry south.
  **mocker_c** — spec `cast/mocker_c.json`, at [6.5, 4.5], ry south.
  - faces: smile at `'line:3.start'`; laugh (same values as mocker_a) at
    `'line:7.start'`; for SH12 they laugh again at `'line:10.start'`.
  - walks (during SH11, off-screen): b `{ t0:'line:9.start', path:[[-3.5,3.5],
    [-6,-2],[-8,-8]], speed:5 }`; c `{ t0:'line:9.start', path:[[6.5,4.5],
    [2,-2],[-3,-8.5]], speed:5 }` — they end at the wall base, south side, as
    SH12's laughing passers-by.
- **villager_1…villager_6** — all spec `cast/villagers.json`, roots:
  v1 [-6,1], v2 [8,2], v3 [-2,6], v4 [5,7], v5 [-8,5], v6 [10,6]; ry varied
  (facing the square centre / camera-ish; pick per-entry values ±40°).
  - faces: v2 and v4 laugh at `'line:7.start'` (same laugh values), smile back
    at `'line:7.end'`; others need no face keys (spec defaults).
  - walks (during SH11): v1 `{ t0:'line:9.start', path:[[-6,1],[-8,-3],
    [-10,-7]], speed:5 }`; v3 `{ t0:'line:9.start', path:[[-2,6],[-1,-2],
    [0,-8]], speed:5 }` — two more passers-by at the wall base for SH12.

## New prop kinds (nine files in `scenes/props/`, kit format like storeys.js)

1. **`sign.js`** — a printed board. Opts: `text` (string), `w` (2.6), `h` (1.1),
   `bg` ('#e8dcc0'), `fg` ('#302d2b'), `post` (1 = two wooden legs down to y −? —
   the origin is the board's base centre: with post, legs extend BELOW the
   origin by `leg` (1.2) so placing `at` at the board's base height works;
   with post:0 the board's bottom edge is at the origin). Board = thin box with
   ink outline + a canvasTex plate on the +Z face carrying the text, centred,
   bold, filling the plate. Also draw the same text plate on the −Z face
   (readable from behind is not required; a plain back is fine — put the plate
   only on +Z, back = plain bg box face).
2. **`crane.js`** — construction crane. Opts: `h` (15.5), `jib` (9), `ry`
   handled by film rot. Mast: a vertical lattice suggested by 4 corner posts +
   cross braces (thin boxes), a horizontal jib at the top reaching +X, a short
   counter-jib −X with a counterweight block, a cable (thin cylinder) hanging
   from the jib tip with a hook block. Flat steel/wood tones, ink outlines.
   Origin at the mast base centre.
3. **`money.js`** — cartoon money piles. Opts: `seed`. Three piles of stacked
   bill bundles (green-cream boxes with a darker band) at small offsets + two
   coin sacks (squashed spheres, canvas-less, with a tie neck). Footprint
   ≈ 3.4 × 2.2 D. Origin at ground centre.
4. **`calendar.js`** — a standing calendar board whose page flips. Opts:
   `page` (0), `years` (12). A board ≈ 2.2 wide × 2.8 tall on two legs (origin
   at ground centre, board centre ≈ y 1.9), a page plate whose canvas draws:
   a top band, a HUGE year number = page+1 (Latin digits), the word «سنة» small
   under it, and a mini month-grid of dots/lines below. The page value comes
   from the opts-over-time keys — the build must draw page+1 from `o.page`.
5. **`gateleaf.js`** — the steel gate leaf, matching seawall's gate (7 wide,
   17.88 tall, cross-braced steel, same tones as seawall.js gate). Opt `lift`
   (0..1): the leaf's geometry is offset DOWN by (1−lift)×17.88 inside the
   group, so lift 0 = fully sunk below ground, lift 1 = fully risen into the
   gate opening. Origin at the gate base centre (ground level).
6. **`measure.js`** — a glowing measure against the wall. Opts: `h` (current
   height, 0.8), `full` (18), `label` ('15.5M'). A thin vertical track line
   (pale, full height), a GLOWING line (basic material, warm yellow) that
   reaches height `h`, an arrowhead at its top, and at the very top a small
   plate with the label text (canvasTex) — the label sits at `full` height
   from the start (it is the target). Origin at ground centre.
7. **`coins.js`** — a loose cluster of ~14 gold coins (short cylinders, gold
   basic/flat, ink edge) scattered in a rough 1.6 × 0.8 × 1.6 cloud (seeded
   offsets), origin at the cluster centre. Built for the `drop` key.
8. **`blueprint.js`** — the blueprint insert board. Opts: `lineY` (1), `pin`
   (0), `label` ('15.5M'). A board ≈ 3.4 wide × 2.6 tall on a stand (origin at
   ground centre, board centre ≈ y 1.7), deep-blue face with a pale grid +
   a drawn wall elevation (rectangle wall outline + gate) on its canvas. On
   top of the canvas, as geometry: a glowing horizontal height line (thin
   basic-material box) whose height = lineY × (board's wall-top line), a
   simple flat HAND silhouette at the line's right end (the dragging hand,
   skin-tone flat shape from boxes/circle — keep it simple and readable), and
   when pin ≥ 1: a ruler strip (pale box with tick marks via canvas or thin
   boxes) standing vertically at the wall's right edge reaching the full
   height + the label plate '15.5M' at the top. The canvas itself is static
   (grid + elevation); lineY/pin move geometry only (cheap rebuilds).
9. **`orb.js`** — a glowing sky disc. Opts: `color` ('#ffd27a'), `r` (1.6),
   `cx` (0), `cy` (12): a flat circle (CircleGeometry, basic material) with a
   larger faint halo disc behind it, offset inside the group by (cx, cy).
   Origin at the prop's `at` point; the disc rides at +cy.

## film.js props additions (all `in:'world'`; placement/opt keys as specified)

Site window pattern for construction props: `[{t:0, in:'hidden'},
{t:'line:4.start', in:'world', at:<site>}, {t:'line:5.start', in:'hidden'}]`
— with opts keys interleaved in chronological order where a prop has them.

- `popsign` (sign): text '3,000', w 3.4, h 1.5, post 0. at = COAST_VILLAGE +
  [0, 8.5, -4] (floats above the village). keys: `[{t:0, in:'hidden'},
  {t:'line:3.word:4', in:'world', at:<same>}, {t:'line:3.end', in:'hidden'}]`.
- `crane_a` (crane): at = COAST_WALL + [-14, 0, 3.5] (world z −12.5), rot
  [0, 15, 0] in the def (jib toward the wall/gate). Site window keys.
- `crane_b` (crane): at = COAST_WALL + [13, 0, 3.5], rot [0, -20, 0]. Site
  window keys.
- `money` (money): at = COAST_WALL + [-6.5, 0, 3.2] (z −12.8). Site window.
- `moneysign` (sign): text '$30M', w 2.6, h 1.1, post 1, leg 2.2 — at =
  COAST_WALL + [-6.5, 0, 2.6] (z −13.4, just behind the piles from camera;
  the board's base at ground, legs raise it: with post and leg 2.2 the board
  bottom sits at origin y + … — define in sign.js: board centre y =
  leg + h/2 when post=1, so `at` y=0 puts the board above the piles). Site
  window keys.
- `calendar` (calendar): at = COAST_WALL + [5.5, 0, 3.4] (z −12.6). Keys:
  placement site-window + opts keys `{t:'line:4.word:k', page:k-1}` for
  k = 1..12 interleaved chronologically (page 0 at word 1 … page 11 at
  word 12, snap, no ease).
- `gateleaf` (gateleaf): at = COAST_WALL + [0, 0, 1.1] (z −14.9, just in
  front of the seawall's baked gate leaf). Keys: placement site-window +
  opts `{t:'line:4.start', lift:0}`, `{t:'line:4.word:7', lift:1, ease:2.6}`.
- `measure` (measure): at = COAST_WALL + [4.3, 0, 1.2] (z −14.8, right of
  the gate against the wall face), full 18, label '15.5M'. Keys: placement
  site-window + opts `{t:'line:4.word:8', h:0.8}`,
  `{t:'line:4.word:10', h:18, ease:1.2}`.
- `sticker_a` / `sticker_b` (sign): text '10M', w 1.7, h 0.95, post 0, at =
  NEIGHBOR_COAST + [-6, 7, -9.2] and NEIGHBOR_COAST + [7, 7, -9.2] (on the
  neighbour wall's south face; the set's stone run face is at z −9.6, so
  −9.2 sits just proud of it). keys: `[{t:0, at:<same>}]` (always there —
  the place is 600 D away and in no other shot).
- `coins` (coins): at [2, 19.5, -17.5] derived as COAST_WALL + [2, 19.5,
  -1.5]. keys: `[{t:0, in:'hidden'}, {t:'line:6.word:10', drop:{from:
  [2, 19.5, -17.5], v0:[0.6, 2.2, 0], g:9.8, ground:17.55, hide:true}}]`
  (world literals inside the drop's `from` must equal the derived const —
  compute the const at module top and reference it if the format allows;
  if the drop object needs literals, write the same numbers the const
  computes to and say so in your report).
- `blueprint` (blueprint): at = COAST_VILLAGE + [5.2, 0, -1.5] (world
  (5.2, 0, 0.5)), facing south (+Z). keys: `[{t:0, at:<same>, lineY:1,
  pin:0}, {t:'line:8.word:6', lineY:0.62, ease:0.5},
  {t:'line:8.word:8', lineY:1, ease:0.3}, {t:'line:8.word:8', pin:1}]`.
- `mocksign` (sign): text 'أغبى مشروع', w 4.2, h 1.3, bg wood '#9a7047',
  fg '#f5e9d0', post 0. at = COAST_WALL + [-6, 12.8, 1.8] (z −14.2, hung on
  the wall's south face left of the gate), def rot [4, 0, -2]. keys:
  `[{t:0, in:'hidden'}, {t:'line:10.start', in:'world', at:<same>}]` (it
  stays hung after its line — later shots are other chunks' problem).
- `sunorb` (orb): color '#ffd27a', r 1.7. at = SEA + [0, 0, -16] (world
  (0,0,-60), near the horizon). keys: placement `[{t:0, in:'hidden'},
  {t:'line:9.start', in:'world', at:<same>}, {t:'line:9.end',
  in:'hidden'}]` + opts `{t:'line:9.start', cx:-15, cy:8},
  {t:25.75, cx:0, cy:18, ease:0.66}, {t:26.40, cx:15, cy:8, ease:0.65},
  {t:27.05, cx:15, cy:-5, ease:0.65}, {t:27.45, cx:-15, cy:9, ease:0.27}`.
- `moonorb` (orb): color '#dfe8ff', r 1.3. at = SEA + [0, 0, -16]. keys:
  placement same window + opts `{t:'line:9.start', cx:-15, cy:-5},
  {t:27.05, cx:-8, cy:14, ease:0.65}, {t:27.45, cx:6, cy:-5, ease:0.27}`.

## set.js — SH11 sky-cycle `states` (the ONLY set.js change)

Add a `states` array to the COAST_WALL and SEA entries of PLACES (shape per
the lights.js header). Phases inside L9 (25.09–27.72): morning → midday →
dusk → night → dawn → RESTORE (at 27.72, the exact base values, so SH12 and
everything later is untouched). Values (sky/ground are [r,g,b] linear):

COAST_WALL states:
- {from:25.09, sky:[.52,.60,.74], lights:{sun:{power:.85, dir:[-.85,.28,.45], color:[1,.80,.55]}}}
- {from:25.75, sky:[.42,.58,.80], lights:{sun:{power:1.20, dir:[-.20,.85,.40], color:[1,.90,.70]}}}
- {from:26.40, sky:[.78,.52,.38], ground:[.45,.36,.28], lights:{sun:{power:.65, dir:[.80,.18,.40], color:[1,.55,.30]}}}
- {from:27.05, sky:[.07,.10,.22], ground:[.10,.12,.18], fog:{color:'#1c2733', density:.0040}, lights:{sun:{power:.14, dir:[.30,.60,.30], color:[.65,.75,1.00]}}}
- {from:27.45, sky:[.55,.58,.70], lights:{sun:{power:.80, dir:[-.85,.25,.45], color:[1,.75,.50]}}}
- {from:27.72, sky:[.48,.59,.76], ground:[.42,.38,.31], fog:{color:'#c9d8df', density:.0035}, lights:{sun:{power:1.05, dir:[-.48,.35,.82], color:[1,.78,.52]}}}

SEA states (same phase times; SEA base: sky [.40,.56,.72], ground
[.16,.39,.53], sun power 1.0, dir [-.48,.35,.82], color [1,.78,.52]):
- {from:25.09, sky:[.46,.58,.72], lights:{sun:{power:.85, dir:[-.85,.28,.45], color:[1,.80,.55]}}}
- {from:25.75, sky:[.36,.56,.78], lights:{sun:{power:1.15, dir:[-.20,.85,.40], color:[1,.90,.70]}}}
- {from:26.40, sky:[.62,.44,.34], ground:[.20,.30,.40], lights:{sun:{power:.60, dir:[.80,.18,.40], color:[1,.55,.30]}}}
- {from:27.05, sky:[.05,.08,.18], ground:[.04,.08,.16], fog:{color:'#16202c', density:.0030}, lights:{sun:{power:.12, dir:[.30,.60,.30], color:[.65,.75,1.00]}}}
- {from:27.45, sky:[.48,.56,.68], lights:{sun:{power:.80, dir:[-.85,.25,.45], color:[1,.75,.50]}}}
- {from:27.72, sky:[.40,.56,.72], ground:[.16,.39,.53], fog:{color:'#aac8d4', density:.0025}, lights:{sun:{power:1.00, dir:[-.48,.35,.82], color:[1,.78,.52]}}}

If the rig's state merge needs `ao` or other fields repeated, follow
lights.js's own merge code — read it before writing.

## Shots SH04–SH12 (append to `shots`; all camera pos/target are PLACES-derived
named consts; move 'push' except SH11 'park'; roll only on SH07)

- **SH04** t0 'line:3.start', t1 'line:3.end' — SQUARE PAN. from: pos
  COAST_VILLAGE + [-11, 4.2, 10], target square centre [0, 1.6, 2] (=
  COAST_VILLAGE + [0, 1.6, 0]), fov 44. to: pos COAST_VILLAGE + [11, 4.2, 10],
  target same, fov 44.
- **SH05** t0 'line:4.start', t1 'line:4.end' — CONSTRUCTION GLIDE. from:
  pos COAST_WALL + [-21, 5.5, 22], target COAST_WALL + [-4, 7, 2], fov 42.
  to: pos COAST_WALL + [19, 5.5, 22], target COAST_WALL + [4, 7, 2], fov 42.
  (World: camera z +6 south of the site, targets on the wall face z −14.)
- **SH06** t0 'line:5.start', t1 'line:5.end' — NEIGHBOUR PAN. from: pos
  NEIGHBOR_COAST + [-19, 8.5, 15], target NEIGHBOR_COAST + [-4, 5.5, -6],
  fov 44. to: pos NEIGHBOR_COAST + [19, 8.5, 15], target NEIGHBOR_COAST +
  [4, 5.5, -6], fov 44.
- **SH07** t0 'line:6.start', t1 'line:6.end' — BIG CLOSE-UP, Dutch. camera
  roll: [-5, -2]. from: pos = mocker_a head + [0.6, 0.25, 3.1] (world
  ≈ (3.6, 1.8, 3.6)), target = mocker_a head [3, 1.55, 0.5], fov 30. to:
  pos COAST_VILLAGE + [2.0, 5.2, 11.5], target COAST_WALL + [2.2, 7.5, 4]
  (world (2.2, 7.5, -12) — over the mocker's shoulder to the wall top),
  fov 40.
- **SH08** t0 'line:7.start', t1 'line:7.end' — LAUGHTER. from: pos
  COAST_VILLAGE + [-6, 3.2, 9], target COAST_VILLAGE + [2, 1.6, -1], fov 42.
  to: pos COAST_VILLAGE + [7, 3.6, 9.5], target same, fov 42.
- **SH09** t0 'line:8.start', t1 'line:8.word:5' — DEADPAN PUSH-IN. from:
  pos COAST_VILLAGE + [0.5, 1.7, 4.4] (world (0.5,1.7,6.4)), target mayor
  head [0, 1.55, 2], fov 32. to: pos COAST_VILLAGE + [0.3, 1.65, 2.9],
  target same, fov 30.
- **SH10** t0 'line:8.word:5', t1 'line:8.end' — BLUEPRINT INSERT. from:
  pos = blueprint + [0, 1.9, 3.1] (world (5.2, 1.9, 3.6)), target =
  blueprint board centre [5.2, 1.55, 0.5], fov 34. to: pos blueprint +
  [0, 1.8, 2.6], target same, fov 34.
- **SH11** t0 'line:9.start', t1 'line:9.end' — SKY CYCLE, parked. camera:
  { move:'park', pos: COAST_WALL + [-13, 7.5, -18] (world (-13, 7.5, -34),
  over the water), target: COAST_WALL + [0, 8, 0] (the wall's sea face),
  fov: 40 }.
- **SH12** t0 'line:10.start', t1 'line:10.end' — SIGN PUSH-IN. from: pos
  COAST_VILLAGE + [-6, 6.5, 4], target = mocksign + [0, -1.3, -0.3]
  (world (-6, 11.5, -14.5)), fov 40. to: pos COAST_VILLAGE + [-6, 9.5, -5],
  target = mocksign centre [−6, 12.6, −14.4] (COAST_WALL + [-6, 12.6, 1.6]),
  fov 36.

## lessons/build.md — append a CHUNK 2 section
What was authored (kinds, cast, shots), the states mechanism, known gaps
(SH13+ not written; digit-1 occlusion at F45/F60 is a Camera-pass item, NOT
this chunk's; the grey mayor is parked inside the town hall at t≈27 — the
next chunk must not double him when mayor_old exits), ending with the
HANDOVER block updated.

## Self-check before you finish (run these, fix what fails, report outputs)
- `node --check` on every .js file you wrote or touched.
- `node tools/audit_d1_d2.mjs` from the project folder — must print PASS.
  (It zone-checks every prop `at`, cast `at`, and camera target against the
  PLACES bounds, checks the props ARRAY schema + `fetch:true` arm, purity,
  and the format locks.)
- A grep of your own film.js proving: props is an array literal; no
  `Math.random`; no `Date`; SH01–SH03 entries unchanged.
- Do NOT run the renderer, do NOT commit, do NOT touch git. Authoring +
  syntax/audit checks only.

Report at the end: files written, node --check + audit outputs, and anything
in the precedents that contradicted this brief (name it, say what you did).
