# CODEX SEAT — CORRECTIVE BRIEF · phase 11 · MERGE BOOT FAILURE (renderer will not boot)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md
§3 (one cause, one change); `lessons/build.md`.

**HARD RULE (guard flag 6): NO LOCAL RENDERS.** Diagnosis by code
reading and Node data-loading only (the audits' import path is
allowed — it does not render). The driver verifies on the fleet.

## The failure (measured, fleet)
Since the chunk-3 merge (commit `db405c0`), EVERY fleet render fails
at BOOT, before any frame:
```
BOOT_ERROR: "Cannot read properties of undefined (reading 'count')"
SUITE_ERRORS: [{"level":"error","text":"boot failed: Cannot read properties of undefined (reading 'count')"}]
frames=0/1 incomplete=true
```
Runs 45121367192 (F711) and 45121371000 (F723) both failed this way.
Before the merge, the same workflow rendered every chunk-2 frame.
`node --check` passes on all touched files; `audit_staging.mjs` and
`audit_d1_d2.mjs` run (they import the scene data) — so the film DATA
loads; the renderer's BOOT path (suite keys: info/stills/sweep/
exportVideo/resolved/layout/errors…) evaluates something more and
breaks on a `.count` read of undefined. No `.count` exists in the new
kind files or film.js — the read is inside engine/suite code,
triggered by a shape the merge supplies.

## Suspect areas (bisect in this order)
1. The 12 new kind files' build/registration signatures vs the
   established kinds (compare `scenes/props/wave.js` etc. against
   `coins.js`/`calendar.js`/`seawall.js`): a kind whose exported
   shape the engine enumerates (e.g. expects an array/count field).
2. The appended film.js entries: cast entries (chunk ACTS shapes),
   prop entries with unusual fields — one key list begins `{t:0`
   (numeric) where every established key time is a symbolic string;
   the merged `seawall_hero` keys extension and the calendar merge
   (same id driven twice?).
3. The SH13–SH26 shot entries' fields vs SH01–SH12 (any extra field
   the loader counts, e.g. a `sway` descriptor bound to `set:poles`).

## Method
Bisect by shape, not by rendering: load progressively larger slices
of the merged data through the same Node import path the audits use,
plus any Node-side boot/smoke entry the repo provides (search the
studio tree for one — do not invent a renderer run). When you find
the offending shape, fix it AT THE SHAPE (in the kind file or the
film entry — wherever the incompatibility lives), keeping every
declared chunk behaviour. If the fix requires changing a chunk
package's declared value, say so and name it.

## Verify + report
Run `node --check` on touched files, full `audit_staging.mjs`,
`audit_d1_d2.mjs`. Paste in your reply: the root cause (file + shape
+ the engine read it breaks), the fix diff, and the audit outputs.
Do NOT commit. Touch no file outside the root cause.
