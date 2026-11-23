# GLM SEAT — BRIEF · phase 19 · ruling 2: match-cut block reads the resolved prop array (TOOLING DEFECT FIX)

You are the GLM build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). You AUTHOR the change; the driver applies
your text verbatim and judges it with the hard acceptance test
below. RULES §3: one cause, one change. **NO LOCAL RENDERS** —
you return text only. This is a one-identifier defect fix, not a
redesign: the check's own documented definition is restored;
no bar, threshold, or requirement changes.

## Previous verdict this brief cites (hard-gate requirement)
Commit `867ae0d` — phase 18 cause 11 VERDICT: CLOSED on the
camera. No judgement is pending; this brief may fire. The fix is
authorized by the dispatcher's Ruling 2 (2026-11-23, recorded
verbatim in RUN_RECORD phase 19).

## The defect (traced and measured, RUN_RECORD phase 18)
The SH21→SH22 match-cut block in `tools/audit_staging.mjs` finds
the seawall in `film.props` — the RAW, unresolved prop array —
while every other check in the tool uses the resolved `props`
(`resolveTimes(film.props ...)`). On the raw entry, `propState`
never sees the resolved h keys and falls back to the entry's
top-level `h:18`, so the check projects the point [0,18,-16],
one unit ABOVE the documented cut point. The check's own
construction (`[wall.at[0], wallState.h, wall.at[2]]` with h
taken at SH22's t0) intends h(t0) = 17 (hero key
`{t:'line:20.start',h:17}`). Measured consequence on the current
judged tree: the coded check reads 0.501 (FAIL) where the
documented definition reads 0.060 (PASS); on the pre-candidate
baseline the coded check read 0.322 where the documented
definition reads 0.102. The coded check moves the wrong way
because the phantom +1-unit point rides higher as the camera
pulls back.

## The current code (tools/audit_staging.mjs, verbatim — the match-cut block, the ONLY block you touch)
```js
 if(frameNo===1635||frameNo===1647){const child=film.props.find(x=>x.id==='pencil_mark_sh21'),wall=film.props.find(x=>x.id==='seawall'),s21=shotById('SH21'),s22=shotById('SH22'),fr21=makeFrame(camAt(s21,s21.t1)),fr22=makeFrame(camAt(s22,s22.t0)),wallState=propState(wall,s22.t0),y1=fr21.screen([child.at[0],child.at[1],child.at[2]]),y2=fr22.screen([wall.at[0],wallState.h,wall.at[2]]),ndc=y=>y?1-y[1]/960:null,n1=ndc(y1),n2=ndc(y2),pass=Math.abs(n1-.062)<.02&&Math.abs(n2-.062)<.02;checks.push(`SH21→SH22 match-cut NDC_y +0.062 ${pass?'PASS':'FAIL'}: ${n1?.toFixed(3)??'n/a'} / ${n2?.toFixed(3)??'n/a'} (target +0.062 on both)`);}
```

## The replacement (exactly one identifier changes)
In that block only, the wall lookup changes from
`wall=film.props.find(x=>x.id==='seawall')` to
`wall=props.find(x=>x.id==='seawall')`.
Everything else in the block stays byte-identical, including
`child=film.props.find(x=>x.id==='pencil_mark_sh21')` (the pencil
point is a raw literal and reads 0.062 under both arrays).
Return the complete block line with the one identifier changed.

## The header line (seat attribution — author exactly this one comment line, inserted into the file's top comment block, after the Phase-15 line)
`// Phase-19 P19_GLM_MATCHCUT_BRIEF.md (GLM seat): match-cut block reads the seawall from the resolved prop array (props.find) — h(t0) from the hero keys, restoring the check's documented definition; dispatcher's ruling 2026-11-23 (RUN_RECORD phase 19).`

## Hard acceptance test (the driver runs it; your reply predicts it)
Audit run: `node tools/audit_staging.mjs` on the current judged
tree (HEAD 867ae0d scene state).
Baseline (driver-measured — reproduce these lines in your reply):
- `CHUNK3 F1635 | 54.50 | SH21 | FAIL | child face PASS angle 0.0° head in 854px; SH21→SH22 match-cut NDC_y +0.062 FAIL: 0.062 / 0.501 (target +0.062 on both)`
- `CHUNK3 F1647 | 54.90 | SH22 | FAIL | seawall FAIL 315px out of frustum; SH21→SH22 match-cut NDC_y +0.062 FAIL: 0.062 / 0.501 (target +0.062 on both)`
- `CHUNK 3: FAIL (20/40 moments)`
After your change, REQUIRED:
- The match-cut check on both lines reads `SH21→SH22 match-cut NDC_y +0.062 PASS: 0.062 / 0.060 (target +0.062 on both)` (n2 ≈ 0.060, the phase-18 instrumented reading under the documented definition).
- F1635's frame verdict becomes PASS (the match-cut rider was its only failing check); F1647's frame verdict stays FAIL on its untouched seawall prop line (`seawall FAIL 315px out of frustum` — a separate cause, ruling 1, NOT this brief).
- Chunk 3 total becomes `FAIL (19/40 moments)`.
- EVERY other line of the audit output reproduces byte-identical (same readings, same verdicts, chunk 2 included).
Why only these lines move: the resolved and raw seawall entries differ only in keyed fields read through `propState`; the match-cut block is the only consumer that reads the seawall through the raw array for a keyed value. `wall.at` is identical in both arrays ([0,0,-16]).

## Explicitly NOT in this cause
The OTHER `film.props.find(x=>x.id==='seawall')` — in the SH24
crest branch (`type==='crest'`) — does NOT change; it belongs to
a different check and a different cause. No other identifier,
function, threshold, or line of the tool changes. No film file
is touched. The F1647 prop case is NOT amended here (ruling 1
is a separate, later cause).

## Reply format (exact)
1. BASELINE RESTATED: the F1635 + F1647 baseline lines above, in your own words.
2. REPLACEMENT BLOCK: the complete match-cut block line, verbatim, with the one identifier changed.
3. HEADER LINE: the comment line, verbatim as specified.
4. PREDICTED LINES: the F1635 line, the F1647 line, and the chunk-3 total after the change, plus a statement that every other line reproduces unchanged.
Nothing else. Do not claim you ran anything.
