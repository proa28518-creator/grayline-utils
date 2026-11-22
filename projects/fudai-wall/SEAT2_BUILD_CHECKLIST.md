# SEAT 2 — SCENE BUILD CHECKLIST — Fudai «السور اللي وقف الموجة» (rebuild, 2026-11-22)

**My pass:** the scene build (Build pass) — sets, props, cameras for all 7 scenes of the owner's
bible. **Law:** RULES.md via the run record's citations; criteria below cite it. **Coordination:**
Seat 1 (driver) owns pass order and the run record; Seat 4 owns the looked-at zoom verdicts;
Seat 3 owns the critic verdict. I author scene material only — `scenes/` is mine, the engine
copy is never edited (RULES §4/§9).

## 0. Inputs — locked before I touch anything
- [x] Voice: `voice_owner.wav` = owner's WAV byte-identical, 68.08 s; film end = 68.08 s (run record, Pass 0).
- [x] Script of record: `script_owner_ar.md` — 186 words verbatim from the owner's timestamps, 24 lines in the bible's 7-scene windows.
- [x] Timing: `audio/clean.json` — 186/186 words, span 0.10–67.55 s, owner's own timings.
- [x] Bible: owner's `Fudai_Wall_Scene_Visualization_22_7j0z.txt` — 3 worlds, cast look, lighting script, 7 scenes with named camera moves.
- [x] Prior prop spec: `~/workspace/fudai-rebuild/recovered/props_after_build_round1.json` — 15 story props with zoom crop boxes (spec only; scenes are authored NEW, RULES §4).
- [ ] `scenes/BIBLE.md` from Seat 1 (drafting) — lines, beats, places with sizes, cast, colour script. **Gate: no scene authoring before it lands.**
- [ ] Style sheet from Seat 6 — character look (2D flat: big round head, dot eyes, bean body, thick black outline) and lighting per scene.

## 1. D1 — props schema gate (prior boot crash, must be impossible)
Prior failure: `(film.props || []).find is not a function` — props written as an object map.
- [ ] `film.props` is an **ARRAY**. Every entry: `{id, kind, in:'world', at:[x,y,z], keys:[{t, at}]}` — the proven demo-ring/story6 format (run record, Defect register D1).
- [ ] The retirement belongings box entry keeps **`fetch: true`** (prior fix, annotation fix-1795371591203) — it is the one carried prop (Scene 4).
- [ ] Static audit before any render: `Array.isArray(props)`; every entry has id/kind/in/at/keys; every `at` is a 3-vector; every `keys` list is non-empty and sorted by `t`; ids unique.
- [ ] Boot smoke: engine loads the film with **zero** prop errors before the first probe is even requested.

## 2. D2 — ONE coordinate source of truth (prior empty probes, must be impossible)
Prior failure: set zones at x=800/1200/1600, cameras aimed at the old positions → probes of
empty sky/sand, prop-truth 16/16 FAIL.
- [ ] A single **PLACES table** is declared once (in `scenes/set.js`, imported by film.js, props and cameras alike): one named constant per place — `COAST_WALL`, `COAST_VILLAGE`, `SEA`, `FLASHBACK_ROCK`, `ROOM`, `NEIGHBOR_COAST`, `HILL_GRAVE` — each with origin + bounds.
- [ ] **No bare coordinate literals** in any prop `at` or any camera target: every position is `PLACES.<name>` + a named offset. A literal found in review = build rejected, fix at the cause.
- [ ] Zone audit before probes: for every scene, each hero prop's place constant == the place constant of that scene's camera targets. Mismatch = stop, no probe renders.
- [ ] Frustum audit before probes: for every shot in the verification sheet, the camera target at the probe time falls inside the target place's bounds, and the shot's hero prop sits inside the frame's central region (its crop box, §4 of the verification sheet).
- [ ] Only after both audits pass does Seat 4 get probe stills to look at.

## 3. Build order (bible order; characters first — RULES §1 priority)
For each scene: cast placement → set pieces → props (schema §1, places §2) → cameras (bible moves) → probe times entered in the verification sheet.
- [ ] **S1 (0.10–6.56) COAST** — wall + steel gate, 5-storey transparent diagram, mayor at wall base, village behind, mirror sea + boat. **Frame 0 = the mayor's expressive face** (RULES §4; Build exit: head ≥ 300 px on the 1080-wide frame) — the bible's tilt-up starts at his face and rises; frame 0 is never the empty set.
- [ ] **S2 (7.06–16.77) VILLAGE + construction + NEIGHBOR_COAST** — 3,000 sign; $30M piles, flipping calendar, rising gate, measuring arrow to 15.5M; neighbour 10M walls.
- [ ] **S3 (17.28–24.52) VILLAGE** — laughing villager big close-up (Dutch 5°), mayor deadpan MCU push-in, blueprint + ruler insert (hand pins the 15.5M line).
- [ ] **S4 (25.09–35.27) COAST + town hall + HILL_GRAVE** — finished wall time-lapse, mocking wooden sign, mayor (white hair) carrying the **box** out of town hall, gravestone on the hill.
- [ ] **S5 (35.70–44.81) COAST storm** — calendar flip (14 years), quake-shaken street, sea retreat (boats on sand), 15M wave wall with measuring line.
- [ ] **S6 (45.45–57.57) FLASHBACK_ROCK + ROOM** — young mayor in sepia flood memory, engraved rock mark close-up, pencil mark on room wall over the child's head, match-cut: pencil line → wall top.
- [ ] **S7 (58.00–67.55) NEIGHBOR_COAST + COAST + HILL_GRAVE** — neighbours flooded over 10M walls, wave hits the 15.5M wall and stops at its rim, crane reveal: village dry, mourners with flowers at the grave; hard loop cut on the last word (67.55).

## 4. Hard rules carried into every scene (RULES §4)
- [ ] Pure in t: no `Math.random`, no `Date`, no cross-frame state — seeded generator only.
- [ ] Anything in a place is in **every** shot of that place (set dressing persists: boats, wooden houses, harbour lamps, lit windows — the recovered dressing list).
- [ ] Faces within ~60° of camera, big, never cut by the frame edge — checked on the close-up rows of the verification sheet.
- [ ] **PROP GUARD:** no prop jumps on screen. The box is picked up, carried, put down via its `keys` (pick_up / carry / put_down, §1 `fetch: true`); place changes happen on cuts only; wave and wall move by keyed motion, never by teleport.
- [ ] Later passes (Camera/Environment/Post/Shading) inherit my geometry untouched — I build it right the first time.

## 5. Set-bar readiness (RULES §5 — Environment pass owns the verdict, I own reachability)
- [ ] Every place dressed to the bible's density (harbour, houses, lamps, windows, road, rock outcrop, hillside) so ≥22% detail per shot / ≥28% film median is reachable without later set surgery.
- [ ] Depth behind every face: no face is framed against flat nothing (Build priority: characters → camera → set → post → light).

## 6. Probe + handover protocol
- [ ] Probes rendered at `scale: 1` at the verification sheet's probe times (4–6 key times per the pass loop, RULES §2) + a whole-film `film_sheet` for Seat 1/Seat 3.
- [ ] Every probe goes to Seat 4 for the zoom-crop look; a prop is present only when its crop has been **looked at** — never from code (run record, D2).
- [ ] My exit package to Seat 1: `scenes/film.js`, `scenes/set.js`, `scenes/props/<kind>.js`, `scenes/cast/<id>.json`, the filled verification sheet, and `lessons/build.md` ending with the HANDOVER block (RULES §2.6) — Build exit still requires PROP GUARD pass + critic `VERDICT: YES` (Seat 3), which are not mine to declare.

**Status:** prep complete; authoring starts when Seat 1 calls the pass (BIBLE.md landed).
