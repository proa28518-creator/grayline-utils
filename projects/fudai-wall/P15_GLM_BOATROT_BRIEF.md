# GLM SEAT — BRIEF · phase 15 · boat ROT restoration: restore Qwen's dropped boat rotation keys (VERBATIM DATA RESTORATION)

You are the GLM build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). You AUTHOR the change; the driver applies
your lines verbatim and judges them with the project's measured
audits. This cause is a DATA RESTORATION, not a design task: every
value below comes verbatim from the original author's record
(Qwen, chunk 3a). Your job is to express that data exactly in the
film's current file format. RULES §3: one cause, one change.
**NO LOCAL RENDERS** — you return text only; the driver runs the
audits. Do not invent values, do not add fields beyond what is
specified, do not "improve" anything.

## Previous verdict this brief cites (hard-gate requirement)
Commit `4f5b499` — phase 14 item 16 CLOSED (the last judged
application); commit `99b37c5` — phase 15 OPEN under Layla's
dispatcher ruling 2 (boat ROT keys restored as their own small
data cause, GLM-authored, same class as cause 7). No judgement is
pending; this brief may fire.

## Source of truth (verbatim, from `.suite/chunks/CHUNK3A_QWEN_REPLY.md`)
Both boats carry a base `rot:[0,0,0]` and rotation keys:
- boat_sh17_a: rot keys `{t:'line:15.start', v:[0,0,0]}` → `{t:40.10, v:[0,0,14]}` (settles onto sand, lists).
- boat_sh17_b: rot keys `{t:'line:15.start', v:[0,0,0]}` → `{t:39.95, v:[0,0,-11]}`.
The chunk-3 merge dropped the base rot field and every rot key.
Cause 7 (phase 14) already restored the position settle keys; the
rot data is what this cause restores — nothing else.

## Current lines in `scenes/film.js` (verbatim; these are the ONLY lines you may touch)
```
 {id:'boat_sh17_a',kind:'boat',in:'world',at:p('SEA',[-3.5,.15,4]),keys:[{t:'line:15.start',at:p('SEA',[-3.5,.15,4])},{t:39.90,at:p('SEA',[-3.5,.02,4])}]},
 {id:'boat_sh17_b',kind:'boat',in:'world',at:p('SEA',[2.5,.15,7]),keys:[{t:'line:15.start',at:p('SEA',[2.5,.15,7])},{t:39.70,at:p('SEA',[2.5,.02,7])}]},
```
Format law for your replacement lines (the film's own conventions):
- The entry gains a base field `rot:[0,0,0]` immediately after the
  `at:p(...)` field (the film's crane entries carry base rot in
  exactly this position).
- Rotation rides in the SAME keys array as its own key entries
  (the audit and the loader resolve each field from the last key
  that carries it): the start key gains `rot:[0,0,0]`, and ONE new
  key is appended carrying only the rot field — boat_a:
  `{t:40.10,rot:[0,0,14]}`; boat_b: `{t:39.95,rot:[0,0,-11]}`.
  Keys stay in ascending t order (a: start, 39.90, 40.10;
  b: start, 39.70, 39.95).
- NO `ease` fields: Qwen's record carries ease:'out' on these
  keys, but every PROP3 entry in this file stands without ease
  fields (cause 7's format law); do not add any.
- Every existing field stays byte-identical: ids, kinds, `at`
  expressions, the position settle keys and their times.

## Measured baseline (driver's own audit runs on HEAD c11b8ce — reproduce these in your reply)
- D1/D2: FAIL (2) — D2-CLEAR SH13 + SH16 only.
- CHUNK3 F1197: PASS `boat_sh17_a PASS 509px in frustum` + `sea_sheet_sh17 state rider PASS pull 14 >= 12`.
- CHUNK3 F1215: FAIL `boat_sh17_b FAIL 634px out of frustum` (a browser-seat camera cause's business; report as measured after your change).
- CHUNK3 F1188: FAIL `sea_sheet_sh17 state FAIL pull 0 >= 6` — **PARKED; stays exactly this.**
- Chunk 3 total: 19/40 PASS. Chunk 2 audit lines unchanged.

## Explicitly NOT in this cause
F1188 stays exactly as it stands. No other prop, shot, cast entry
or audit line moves. No audit file is touched by this cause.

## Expected readings after your change (the driver verifies)
- F1197 both lines PASS unchanged; F1215 FAIL unchanged (verdict and px class); F1188 unchanged FAIL. D1/D2 unchanged FAIL (2). Chunk 3 stays 19/40. Chunk 2 unchanged.

## Reply format (exact)
1. BASELINE RESTATED: the five baseline readings above, in your own words.
2. FILM LINES: the two replacement lines for scenes/film.js, verbatim, pasteable, in order.
3. PREDICTED READINGS: F1197 (both lines), F1215, F1188, chunk-3 total, D1/D2.
Nothing else. Do not claim you ran anything.
