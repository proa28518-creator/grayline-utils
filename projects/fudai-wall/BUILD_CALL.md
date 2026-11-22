# BUILD CALL — Seat 1 → Seat 2 (scene builder) · Fudai Build pass · issued 22:17 EET

**Goal:** Build the Fudai film in our engine, in Build-pass order (RULES §1/§2, steps/build.md):
BIBLE (done) → cast → set → OPENING proven first (probe + opening critic round) → full acting +
camera → probes per scene → prop-truth zooms (Seat 4) → critic rounds (Seat 3 protocol).
Code authorship: the Codex seat, bounded sessions (repo AGENTS.md authorship rule). You drive
it, apply its code, run the checks. Report into this folder; Seat 1 collects.

**The bar:** read `references/quality-bar.md` + open `references/bar/` stills + guide pages
01, 02, 03, 04, 05, 09, 10 (in the extracted skill) before writing; compare your frames at
full size before reporting. Format references in OUR tree: `projects/demo-ring/scenes/film.js`
+ `set.js` + `cast/groom.json` (the proven contract), `engine/props/PROPS_API.md`.

## Inputs (locked)
- `scenes/BIBLE.md` — lines, PLACES anchors, cast, colour script, staging rulings. FOLLOW IT.
- `script_owner_ar.md` (186 words verbatim) + `audio/clean.json` (his words, his times) +
  `voice_owner.wav` (byte-identical; film.js voice.file points at it, Story-6 precedent).
- `STYLE_SHEET.md` (Seat 6 locks) · `PROP_CHECKLIST.md` (Seat 4: 51 props) ·
  `~/workspace/fudai-rebuild/recovered/props_after_build_round1.json` (prior 15-prop spec +
  crop boxes — a starting spec, not gospel) · owner's bible (camera beats per line).

## The contract (non-negotiable format points)
- film.js default export exactly as demo-ring: `fps: 30`, `size: [1080, 1920]`, `world: { set: 'own', setOpts: { post } }`,
  cast `{ spec: 'cast/<id>.json', at: [x, z], ry }`, voice lines = the 24 BIBLE lines verbatim,
  acts (face/clips/walk/height/look keyed to `line:N.word:M`), **`props` as an ARRAY** of
  `{ id, kind, in: 'world', at: [x,y,z], keys: [{ t, at }] }`, `handovers: []`, shots with
  `{ t0, t1, camera: { move, from/to { pos, target, fov } } }`, `captions: 'words'`.
- **D1 GATE:** props array schema + a static audit script output + `node --check` on every
  scene file + a boot smoke (project loads, `suite.info()` answers, no console exception)
  BEFORE any probe is rendered. The belongings box entry keeps `fetch: true` (fix of record).
- **D2 GATE:** ONE PLACES table in set.js (COAST_WALL, COAST_VILLAGE, SEA, NEIGHBOR_COAST,
  FLASHBACK_ROCK, ROOM, HILL_GRAVE at the BIBLE's anchors); film.js imports the same constants
  for cast positions, prop `at`s and every camera pos/target — NO bare coordinate literals for
  place geometry. Zone audit (every prop/cast/camera target falls inside its place's bounds)
  + frustum audit (each shot's target inside its place) must pass BEFORE probes.
- Pure in t: seeded randomness only, no Math.random/Date (RULES §4). Engine copy untouched.
- Numerals are story: labels 3,000 · $30M · 12 · 15.5M · 10M · 15M · 14 and the sign
  «أغبى مشروع» must render as legible on-screen graphics (engine `sign` kind or film-local
  kinds) — Seat 3 treats a wrong/missing number as BLOCKING.

## Shot plan (26 shots; bible camera beats; cuts on line starts/action words)
S1: SH01 L1a face→tilt-up · SH02 L1b crane pull-back · SH03 L2 sea glide.
S2: SH04 L3 square pan · SH05 L4 construction glide · SH06 L5 neighbour pan.
S3: SH07 L6 big close-up (Dutch 5°) · SH08 L7 laughter · SH09 L8a deadpan push-in · SH10 L8b blueprint insert.
S4: SH11 L9 sky cycle (parked) · SH12 L10 sign push-in · SH13 L11 lateral tracking · SH14 L12 grave crane-up.
S5: SH15 L13 calendar flip · SH16 L14 shake · SH17 L15 recede glide · SH18 L16 wave tilt-up.
S6: SH19 L17 sepia glide · SH20 L18 rock tracking · SH21 L19 room cutaway · SH22 L20 match-cut pour.
S7: SH23 L21 aerial flood · SH24 L22 impact side profile · SH25 L23 crane reveal · SH26 L24 grave pull-back (hard cut at line end).
Frame 0 (SH01 first frame) = the Mayor's expressive face, head ≥300 px (Seat 1 ruling).

## Sequence & exits
1. Cast JSONs (mayor, mayor_old, mayor_young, mocker_a/b/c, villagers, child, workers) —
   each new face checked on a render facing camera + 3/4 before acting (build.md step 2).
2. scenes/props/ kinds for the story props (seawall+gate, wave, rock, calendar, money,
   blueprint, grave, boat, labels…) + set.js (places, depth ≥25 D behind faces, 2+ practicals
   per place, wide-scale density for SH02/SH17/SH23 per the §5 risk note).
3. film.js OPENING ONLY (SH01–SH03) → D1+D2 gates → probes → **opening critic round**
   (Seat 3 protocol; blind mix; Opus + GLM hunts on the code in parallel) → fix named gap.
4. Rest of film.js (SH04–SH26) → full probe set (one still per shot + per major beat) →
   Seat 4 zoom verification of all 51 props → `film_check {kind:'set'}` numbers →
   critic rounds until VERDICT: YES, no BLOCKING (Seat 3 owns the verdict).
5. `lessons/build.md` as you go, ending with the HANDOVER block incl. set-bar numbers.

**Report form:** what you made · files · gate outputs (verbatim) · probe paths · what is
still below the bar, worst first · any file you need changed that is not yours.
Never in this work: a clock, "good enough", an effect turned down until it is gone,
a beat/character/prop cut to finish (RULES §6).
