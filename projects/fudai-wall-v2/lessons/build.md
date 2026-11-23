# Build Pass Lessons — Fudai Wall (`fudai-rebuild-v2`)

## What was authored
- `scenes/BIBLE.md` — Complete Film Bible (28 lines covering all 186 words of `audio/clean.json`, 5 places spaced 400 D apart, built-in `specs/` cast table, story props, colour script, and Frame 0 reconciliation).
- `scenes/film.js` — Full 68.08 s film data (`fps: 30`, `size: [1080, 1920]`, `captions: 'words'`, `endHold: 0.53`), 8 ready-made built-in `specs/` characters (zero custom `scenes/cast/*.json` per owner instruction), 28 word-matched voice lines (quoted speech on `villager1` for lines 8–9), word-tied acting on every line with >=4-frame cut clearance, PROP GUARD-safe prop timelines, and 28 shots following the binding 7-scene visualization bible.
- `scenes/set.js` — Pure-in-`t` multi-place 3D set (`coast`, `flashback`, `analogy_room`, `neighbors`, `hill_grave` at X = 0, 400, 800, 1200, 1600 D), each with an opaque depth-writing sky dome, 25 D+ depth behind faces, 2+ visible practicals, deterministic `mulberry32` scatter, and pure-in-`t` animation for construction cranes, rising floodgate, time-lapse sun/moon, earthquake sway, ocean retreat, 15 m (`24 D`) tsunami wave impact & spray, growing pencil mark, and falling leaves.
- `scenes/props/*.js` — Five custom printed/stateful props (`measure_sign.js`, `blueprint_ruler.js`, `calendar_flip.js`, `money_stack.js`, `gravestone.js`), all using inner-group visibility (`opts.shown`) so the stage never overrides hidden state.

## Automated pre-desk checks run (local syntax & timeline audit)
- `node --check` (ESM): PASS on all 7 `.js` files (`scenes/film.js`, `scenes/set.js`, `scenes/props/*.js`).
- 186-word exact match against `Fudai_Wall_Word_Timestamps_21_v6r1.txt`: PASS (186/186 words in exact order across 28 lines; zero mismatches, zero leftovers).
- Word-reference bounds (`line:N.start`, `line:N.end`, `line:N.word:K`): PASS across all shots, acts, and props.
- 3-frame cut clearance (`> 0.105 s`): PASS (zero face, clip, or walk keys within 3 frames of any cut; all `place` keys sit strictly on cuts).
- Pure-in-`t` static check: PASS (zero `Math.random` or `Date` calls in code).
- Frame 0 framing math: distance `10.52 D` at `fov: 26` → Mayor Wamura head width ≈ `395 px` (bar `>= 300 px`), with the `24.8 D` seawall `30 D` behind him.

## What is still unverified / below the bar (worst first — requires desk renders)
1. Unrendered visual verification & set-bar measurement (`check_preview`, `film_probe`, `film_check { kind: 'set' }`, `film_sheet`, `render_frames`).
2. Built-in `specs/` visual fit (`walter`, `bouncer`, `mara`, `postman`, `dotty`, `engineer`, `pip`, `ruby`) on front & 3/4 renders.
3. Engine prop `opts` / `THREE` import convention inside `scenes/props/*.js` on first `check_preview`.
4. Build-pass procedural set geometry detail (to be upgraded in Environment overhaul).
5. Automatic sound design & Arabic RTL caption shaping (`captions: 'words'`).

## HANDOVER
- **Pass:** Build (initial whole-job authoring complete; awaiting desk `check_preview`, `film_probe`, `film_check { kind: 'set' }`, opening critic round, and whole-film critic round).
- **Files written:** `scenes/BIBLE.md`, `scenes/film.js`, `scenes/set.js`, `scenes/props/measure_sign.js`, `scenes/props/blueprint_ruler.js`, `scenes/props/calendar_flip.js`, `scenes/props/money_stack.js`, `scenes/props/gravestone.js`, `lessons/build.md`.
- **Cast:** Built-in `specs/` only (`walter`, `bouncer`, `mara`, `postman`, `dotty`, `engineer`, `pip`, `ruby`). Zero custom `scenes/cast/*.json`.
- **Numbers:** 186/186 words matched across 28 lines; 28 shots (dur `1.16–3.75 s`); Frame 0 head ≈ `395 px` (`fov 26`, `d = 10.52 D`); 5 places at 400 D spacing; wall `24.8 D`, wave `24.0 D`, neighbour wall `16.0 D`.
- **Set bar (`film_check { kind: 'set' }`):** Not yet measured (no local render; desk to measure on first run).
- **Not checked:** Visual renders, PROP GUARD runtime trace, set-bar numbers, built-in `specs/` wardrobe appearance, Arabic RTL caption layout, automatic sound mix.