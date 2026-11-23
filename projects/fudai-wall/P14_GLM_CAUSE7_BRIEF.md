# GLM SEAT — BRIEF · phase 14 · cause 7: SH17 sea_sheet — restore Qwen's dropped numeric keys + the F1197 state rider (VERBATIM DATA RESTORATION)

You are the GLM build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). You AUTHOR the change; the driver applies
your lines verbatim and judges them with the project's measured
audits. This cause is a DATA RESTORATION, not a design task: every
value below comes verbatim from the original author's record
(Qwen, chunk 3a). Your job is to express that data exactly in the
film's current file formats. RULES §3: one cause, one change.
**NO LOCAL RENDERS** — you return text only; the driver runs the
audits. Do not invent values, do not add fields, do not "improve"
anything.

## Previous verdict this brief cites (hard-gate requirement)
Commit `78b6ea5` — phase 13 STOP (GLM geometry route closed by the
dispatcher); commit `f66717e` — phase 14 OPEN under Layla's
dispatcher ruling (data causes to the GLM seat; this cause is queue
item 1). No judgement is pending; this brief may fire.

## Source of truth (verbatim, from `.suite/chunks/CHUNK3A_QWEN_REPLY.md`)
sea_sheet pull keys:
`{t:'line:15.start', v:0} → {t:'line:15.w2', v:4} → {t:39.90, v:14} → {t:40.50, v:36} → {t:'line:15.end', v:36}`
Boat settle keys (positions only; the `at` y drops .15 → .02):
boat_sh17_a settles at t=39.90; boat_sh17_b settles at t=39.70.
Declared F1197 moment: "PROP boat_sh17_a >= 40 [state: pull >= 12]".

## Current lines in `scenes/film.js` (verbatim; these are the ONLY film.js lines you may touch)
```
 {id:'sea_sheet_sh17',kind:'sea_sheet',in:'world',at:p('SEA',[0,.02,0]),pull:0,keys:[{t:'line:15.start',pull:0},{t:'line:15.word:2',pull:4},{t:'line:15.end',pull:36}]},
 {id:'boat_sh17_a',kind:'boat',in:'world',at:p('SEA',[-3.5,.15,4]),keys:[{t:'line:15.start',at:p('SEA',[-3.5,.15,4])},{t:'line:15.end',at:p('SEA',[-3.5,.02,4])}]},
 {id:'boat_sh17_b',kind:'boat',in:'world',at:p('SEA',[2.5,.15,7]),keys:[{t:'line:15.start',at:p('SEA',[2.5,.15,7])},{t:'line:15.end',at:p('SEA',[2.5,.02,7])}]},
```
Format law for your replacement lines (the film's own conventions):
- The key field is spelled `pull:` (not `v:`); Qwen's `line:15.w2`
  is the film's `line:15.word:2`.
- NO `ease` fields: every PROP3 entry in this file stands without
  them; do not add any.
- Boat entries: replace ONLY the settle key's time — the
  `line:15.end` settle key becomes the numeric t (39.90 for a,
  39.70 for b); every position expression stays byte-identical.
- Nothing else in any line changes: ids, kinds, `at`, `pull:0`,
  spacing style of the surrounding entries.

## The audit rider (`tools/audit_staging.mjs`)
Qwen's F1197 declaration carries a state rider the merge dropped:
at F1197 (t=39.90), sea_sheet_sh17 pull >= 12 must ALSO hold. With
the restored keys this reads 14 (the 39.90 key is the last key
<= t). Author ONE frame-specific block in the chunk-3 moment loop,
in the same pattern as the existing SH21→SH22 match-cut block
(the `if(frameNo===1635||frameNo===1647){...}` block that appends
an extra check line to an existing moment): your block fires on
`frameNo===1197`, computes pull by the audit's existing state rule
(the last resolved key with t <= current t; field `pull`; fall
back to the prop's base `pull`, then 0), and pushes exactly one
check line of the form:
`sea_sheet_sh17 state rider PASS pull 14 >= 12` (FAIL form likewise).
Place it immediately BEFORE the line ` chunk3Results.push({frameNo,t,shotId,checks});`
Also author ONE header comment line for the top-of-file amendment
list, in the file's existing style, reading:
`// Phase-14 P14_GLM_CAUSE7_BRIEF.md (GLM seat): F1197 sea_sheet state rider restored per Qwen's declared moment.`

## Measured baseline (driver's own audit runs on HEAD 78b6ea5 — reproduce these in your reply)
- D1/D2: FAIL (2) — D2-CLEAR SH13 + SH16 only.
- CHUNK3 F1188: FAIL `sea_sheet_sh17 state FAIL pull 0 >= 6` — **PARKED; stays exactly this.**
- CHUNK3 F1197: PASS `boat_sh17_a PASS 512px in frustum` (no rider line yet).
- CHUNK3 F1215: FAIL `boat_sh17_b FAIL 638px out of frustum` (the next cause's business; report as measured after your change).
- Chunk 3 total: 19/40 PASS. Chunk 2 audit lines unchanged.

## Explicitly NOT in this cause
F1188's state moment stays exactly as it stands (FAIL, parked —
do not retime keys ahead of the word, do not move the moment, do
not touch its threshold). The boats' ROT keys in Qwen's record are
out of scope. No other prop, shot, cast entry or audit line moves.

## Expected readings after your change (the driver verifies)
- F1197 gains the rider line reading PASS with pull 14; F1197 stays PASS.
- F1188 unchanged FAIL. D1/D2 unchanged FAIL (2). Chunk 3 stays 19/40. Chunk 2 unchanged.

## Reply format (exact)
1. BASELINE RESTATED: the five baseline readings above, in your own words.
2. FILM LINES: the three replacement lines for scenes/film.js, verbatim, pasteable, in order.
3. AUDIT BLOCK: the header comment line + the frame-1197 rider block, verbatim, pasteable.
4. PREDICTED READINGS: F1197 (both lines), F1188, F1215, chunk-3 total, D1/D2.
Nothing else. Do not claim you ran anything.
