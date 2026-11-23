# CODEX SEAT — BRIEF · phase 11 · chunks 3a/3b MERGE (SH13–SH26)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md` (you author
ALL code; seat-attribution headers on every new file); RULES.md §3, §4,
§5; `scenes/BIBLE.md`; `lessons/build.md`.

**HARD RULE (guard flag 6): NO LOCAL RENDERS.** Code + audits only;
the driver fleet-probes and judges.

## Previous verdict this brief cites (hard-gate requirement)
Commit `5c7e1f2` — F570 option (b) CLOSED. Chunk 2's causes are all
closed or formally parked; no judgement is pending: this brief may
fire.

## Inputs (read in full before writing anything)
- `.suite/chunks/CHUNK3A_QWEN_REPLY.md` — Qwen's SH13–SH19 package:
  CAM_SH13–19, CAST_3a, PROPS_3a (D1 array form), SHOTS_3a, 21 declared
  MOMENTS, 6 new kinds (belongings_box, gravestone, leaf, birds,
  sea_sheet, wave), 3 declared conflicts.
- `.suite/chunks/CHUNK3B_HYDROGEN_REPLY.md` — Hydrogen's SH20–SH26
  package: per-shot POS/CAM/TGT consts, CAST_SH20_SH26, ACTS,
  PROPS_SH20_SH26, SHOTS_SH20_SH26, 19 declared MOMENTS, 7 new kinds
  (carved_line, pencil_mark, concrete_pour, wave, spray, sunbeam,
  gravestone, flowers), 3 declared conflicts.
- The existing film pattern: `scenes/film.js` (SH01–SH12),
  `scenes/props/*.js` (blueprint, boardsign, boat, calendar, coins,
  crane, gateleaf, measure, money, orb, seawall, sign, storeys),
  `scenes/set.js` (ONE PLACES table — D2), `tools/audit_staging.mjs`.

## Rulings already on record (do not re-decide)
- Qwen conflict 2: the SH14 distant wall is staged as Qwen's 18 D
  seawall-kind silhouette at 140 D on the hill's horizon — ACCEPTED
  by Layla. (Use a film prop entry of the existing `seawall` kind; do
  not author a new kind for it.)
- Qwen conflict 1: word keys stay symbolic (`line:NN.wK`); states hold
  across the plausible word window.
- Qwen conflict 3: set-piece bindings (hall door, poles, calendar
  instance) — bind what exists in set.js/film.js; where a named piece
  does not exist, drop that sub-beat and SAY SO in your reply; the
  calendar merges by id, never doubled.
- Hydrogen conflict 1 (SH21 child rig): check `scenes/cast.js` for the
  child entry; if it is unscaled, apply Hydrogen's +0.88 raise to
  POS_SH21_MARK.y and the CAM/TGT y together (preserving the
  engineered NDC_y +0.062 match-cut); if scaled, do not raise. State
  which branch you took and the evidence.
- Hydrogen conflict 2 (seawall_hero): merge `seawall_hero_keys_ext`
  into the EXISTING hero seawall entry with `h` declared top-level
  (Law 1); check the h 17.0→18.0 rise against SH05's gate-rise
  staging (no double-driving of the same key).
- Hydrogen conflict 3 (NEIGHBOR_COAST z): read set.js; if neighbour
  walls sit at dz −16, shift all SH23 z offsets by −16 uniformly;
  if not, do not shift. State the evidence.

## The two reconciliations (the heart of this brief)
1. **ONE wave kind.** Qwen's SH18/SH19 wave keys use `h` + `advance`;
   Hydrogen's SH23/SH24 wave uses `crestY` + `curl`. Author ONE
   `scenes/props/wave.js` whose key set serves BOTH (a superset key
   schema is fine if each shot's declared keys drive it
   deterministically). Hard story facts: the wave crest caps at
   17.5 D — strictly below the seawall's 18 D top (the thesis frame
   SH24 keeps a 0.5 D dry-concrete margin). If the two key sets are
   irreconcilable in one kind, STOP on this item and report the
   measured conflict — do NOT silently fork the kind.
2. **ONE gravestone kind.** Qwen: 0.9×1.5×0.25 slab, 4° back lean, no
   keys. Hydrogen SH26 passes `h: 1.35`. Author ONE
   `scenes/props/gravestone.js` (default height 1.5; an `h` entry
   value overrides) serving both.

## Deliverables
1. New kind files under `scenes/props/`: belongings_box (its film
   entry keeps `fetch: true` — D1 arms on it), gravestone, leaf,
   birds, sea_sheet, wave, carved_line, pencil_mark, concrete_pour,
   spray, sunbeam, flowers. Each with a seat-attribution header
   (author seat, brief name, date). Follow the existing kinds'
   structure and the kit API (`../engine/props/_kit.js` patterns as
   used by the neighbouring files).
2. `scenes/film.js`: append the chunk-3 cast entries, prop entries
   (D1 array form: {id, kind, in:'world', at, keys}), and SHOTS
   SH13–SH26 with Qwen's/Hydrogen's cameras — translated into the
   film's established const style, PLACES-anchored (D2: no bare
   world coordinates where a PLACES offset expresses them; the
   chunks' world values convert to anchor+offset). Preserve every
   existing line for SH01–SH12 byte-for-byte except list punctuation.
3. `tools/audit_staging.mjs`: extend the moment table with the
   chunks' 21 + 19 declared moments (frame numbers from the shots'
   timeline at 30 fps), each with the checks the chunk records
   declare (named props in frustum + projected size, faces, the
   SH21→SH22 match-cut NDC_y +0.062 on both sides, the SH24 crest
   margin: wave crest ≤17.5 with the wall top at 18.0 in frame).
   Header note citing this brief.
4. Run: `node --check` on every file you touched,
   `node tools/audit_d1_d2.mjs` (must PASS — the belongings-box
   fetch:true check arms now), `node tools/audit_staging.mjs`
   (full; report the chunk-3 lines as they stand — PASS or FAIL
   with causes; do not tune cameras beyond the chunk packages to
   force a pass, except correcting your own translation errors).

## In your reply, paste
- the wave + gravestone reconciliation decisions (or the measured
  conflict, if irreconcilable);
- the disposition of all six declared conflicts (3 Qwen + 3
  Hydrogen), each with its evidence;
- a file-by-file change list;
- the complete D1/D2 output and the chunk-3 staging-audit lines;
- any sub-beat you dropped under Qwen conflict 3, named.
Do NOT commit. Touch nothing outside: scenes/props/ (new kinds),
scenes/film.js (append), tools/audit_staging.mjs (extension).
