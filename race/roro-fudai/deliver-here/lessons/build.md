<!-- Seat attribution: authored by the builder seat (Roro / Muse, lane 4 of the construction-chair race), 2026-11-23, for the Fudai Wall Build pass. Method source: the cartoon-shorts tree only. The «Production and rules» package was not opened, read, copied or referenced. No local renders. -->

# lessons/build.md — Fudai Wall, Build pass

## Tried
- Read the brief, the method (SKILL.md, steps/build.md, topics.md, film.md, characters.md, camera.md, sets.md, review.md, critic.md, pitfalls.md Build part) and the desk's METHOD_EXTRACT.md in full before writing anything.
- Verified the 24 spoken lines 1:1 against `audio/clean.json` (186 words, 0.10–67.55 s): every line's words match the visualization bible exactly, all 186 words covered, zero mismatch. The lines are the film's lines.
- Wrote the Bible first (`scenes/BIBLE.md`): a row per line (speaker, listeners, place, beat, action word, story prop) and a row per place (real thing, size in D, far end in D, practicals, colour mood, air), plus the colour script and the cast.
- Cast and props were drafted by helpers under the critic's helper contract (one writer per file); film.js and set.js were authored by the builder seat. The Bible, the cast specs and the props were verified (JSON parses, `node --check` passes on all JS).
- CORRECTION (2026-11-23 ~21:00, verified by araby's question): the cast specs are NOT the tree's ready-made characters. The race/roro-fudai/ package contains only `method/references/characters.md` (the character-system reference); the actual ready-made spec files (`specs/` — engineer, boss, mara, etc.) were NOT in the package, are NOT in the grayline-utils repo (code search found nothing), and are NOT on this seat's machine (`~/workspace/cartoon-style-copy/` does not exist). The 5 cast specs were newly authored following the reference doc's rules, not copied from ready-made files. To cast from the tree's ready-made characters, this seat needs the `specs/` files themselves — from Layla/the desk or from the tree.
- Authored `scenes/film.js` (30 shots, 24 lines, 15 props, 5 cast) and `scenes/set.js` (5 places, 400 D apart, lights as data, storm/sunrise states on place A).

## Saw
- The opening reconciliation holds in the authoring: frame 0 is the mayor's face, big (13.5 D at fov 26 ≈ 308 px), looking up, and the tilt-up rises from his face to the wall in the same shot — the shot plan's tilt-up and the hard face rule both satisfied.
- The binding shot plan forces several shots under the 1.5 s cut minimum: shots 8 (1.16 s, deadpan), 9 (1.34 s, blueprint), 14 (1.42 s, calendar flip), 15 (1.32 s, quake), 16 (1.39 s, sea pulls back), 22b (1.0 s, wave erasing). These are the member's beats, not a rhythm choice; the critic must judge whether the rhythm holds.
- The young mayor is the same person as the mayor (via `acts.mayor.place`, not a cast copy), but the cast spec carries grey hair while the flashback needs black hair. The sepia grade softens the difference; it is a real gap, not a solved one.
- The wave is driven by the wave PROP's `open` keys (0 before line 15, 1 by line 16 end, 0 at line 23); the set.js wave group is a hidden anchor for camera keys, not the visual. If the desk's engine drives `setOpts.wave` instead, the two must be reconciled — the prop is the visual, the group is the anchor.
- The prop files assume THREE reaches `build(opts)` via `opts.THREE` or `globalThis.THREE` (film.md does not specify). Untested against the engine.
- The bar stills (`references/bar/`) and guide pages (`references/guide/`) were not in this lane's method folder, so no side-by-side against the bar stills was done at this seat. The desk's critic rounds compare against the bar.

## Fixed
- `film.js` and `set.js` were first written with an HTML comment header (`<!-- ... -->`); `node --check` failed (HTML comments are not allowed in modules). Converted both headers to JS block comments (`/* ... */`). Both files now pass `node --check`.
- All 203 `line:N` / `line:N.word:K` references in film.js were validated against clean.json: no out-of-range line (1–24) and no out-of-range word (per-line counts). All valid.
- The wave's `open` keys were set so the wave is flat sea before line 15, full by line 16 end, and gone at line 23 (the crane reveal shows the dry village from behind the wall).

## Still weak
- The set bar was NOT measured: no `film_check { kind: 'set' }` run (no local renders at this seat). The desk must measure it; the Environment pass must pass it.
- No critic round has run: neither the opening round nor the whole-film round. The opening staging and the whole film are authored but unverified on frames.
- No frames were rendered at this seat, so no face, hand-on-prop, or feet-on-floor moment was looked at; no strip was opened on any fast move or seam.
- The short shots (above) and the young mayor's hair (above) are open for the critic.
- The `follow` shot on the retiring mayor (shot 12) uses `camOffset` in world axes; the cheat sheet warns a follow can end inside a hull — a `path` may be needed if the desk's frames show it.

## Re-cast (2026-11-23 ~21:15, one round, after Layla sent the tree specs)
- Layla admitted the lane package carried only the characters description; the 52 ready-made spec files were a packaging mistake. She sent them in the repo (`race/roro-fudai/tree-specs/`, commit ab3630d, README confirms byte-identical copies of `cartoon/specs/`).
- The 5 authored cast specs were deleted. The 5 roles are now cast from the tree files, byte-identical, copied into `scenes/cast/`: mayor = `inspector` (navy official coat, white hair, gold buttons — the municipal official), villager_1 = `farmer` (red check shirt, strawhat, grey goatee), villager_2 = `postman` (slim, tall, grey flatcap), villager_3 = `ruby` (teal jumper, curly red hair), villagers = `townsperson` (grey bowler, brown jacket). `film.js` cast paths updated to the tree files; the BIBLE cast table updated.
- The young mayor is now the inspector's white hair in the flashback — the sepia grade + context carry the youth; a known limitation (was: grey spec hair vs black hair; now: white spec hair vs black hair).
- The ready-made specs carry their own small props (inspector's marble, townsperson's newspaper) — part of the characters as they are, used as-is.
- No other file changed: the 24 lines, the 30 shots, the 5 places, the 10 props and the acting are untouched by the re-cast.

## HANDOVER (build, 2026-11-23)
AT THE BAR: the complete Build file set is authored and syntactically valid — BIBLE.md (24 lines verified 1:1, 5 places, cast, colour script), film.js (30 shots covering all 24 lines, 15 props, 5 cast, captions 'words'), set.js (5 places, 400 D apart, lights as data, storm/sunrise states), 5 cast specs, 10 prop files. All JS passes `node --check`; all 203 line/word refs valid. No critic verdict yet — the desk runs the critic rounds; the blind score is not recorded here.
STILL BELOW THE BAR (worst first): (1) Set bar not measured — `film_check set` not run; the desk must measure it, Environment must pass it. (2) Opening not proven — no opening critic round run; the frame-0 face + tilt-up is authored but unverified on frames. (3) Short shots (8, 9, 14, 15, 16, 22b under 1.5 s) — the binding shot plan's beats; the critic judges the rhythm. (4) Young mayor's hair — spec grey, flashback needs black; sepia softens it; Shading may need a per-place hair tint. (5) Wave driven by the prop's `open` keys, not by `setOpts.wave` — reconcile if the engine drives the set group instead. (6) The `follow` on the retiring mayor (shot 12) may need a `path` if frames show it inside a hull.
DO NOT TOUCH: the 24 lines as heard (verified 1:1, no line added or cut); the opening frame-0 face + tilt-up reconciliation; the 5 places and their D numbers (wall 24.8 D, wave 24 D, neighbours 16 D); the cast — ready-made tree characters only, no new characters; the loop cut on the last word (line 24); the mayor's deadpan (react: false) on lines 6, 7, 8, 10.
NOT CHECKED: no frames rendered at this seat (no local renders); no `film_sheet`, `film_probe`, or `film_check` run; no critic rounds (opening or whole-film); no side-by-side against the bar stills (not in the lane's method folder); the prop files' THREE assumption (`opts.THREE` or `globalThis.THREE`) untested against the engine; the `follow` shot's clearance untested on frames.
