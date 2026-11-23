# GLM SEAT — BRIEF · phase 19 · ruling 1: F1647 case amendment — tested point re-pointed to the declared subject (AUDIT CASE AMENDMENT)

You are the GLM build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). You AUTHOR the amendment; the driver
applies your text verbatim and judges it with the hard
acceptance test below. RULES §3: one cause, one change.
**NO LOCAL RENDERS** — you return text only. This is a measure
correction in the phase-11 F570 amendment form, NOT a bar
change: the 400px threshold and the declared subject stand;
only the tested point moves to the point the author declared.

## Previous verdict this brief cites (hard-gate requirement)
Commit `18aed3e` — phase 19 ruling 2 VERDICT: CLOSED
(match-cut raw-prop defect fixed). No judgement is pending;
this brief may fire. The amendment is authorized by the
dispatcher's Ruling 1 (2026-11-23, recorded verbatim in
RUN_RECORD phase 19).

## The declared moment vs what the audit measures (RUN_RECORD phase 18)
The author's DECLARED moment (verbatim,
`.suite/chunks/CHUNK3B_HYDROGEN_REPLY.md` line 476):
`F1647 t=54.90 SH22 — PROP: seawall_hero >= 400 [state: h >= 17.0]`.
The author's SH22 note (line 516): the shot "opens on a level
lock (NDC_y = +0.062) where the seawall's rising top edge
(17.0 -> 18.0 D) seamlessly receives SH21's pencil line".
`seawall_hero` is the merged film id `seawall` (merge note,
line 530).
What the audit measures instead: moment
`[1647,54.90,'SH22','prop','seawall',400]` runs the GENERIC
prop branch — `size = CHUNK3_SIZE['seawall'] || [1,1,1]`;
there is NO `seawall` entry in CHUNK3_SIZE, so it measures a
**1-unit height at the prop's base anchor [0,0,-16]** and
requires that base point in frustum at ≥ 400px. The base-anchor
point was never in the declared moment — it is the generic
fallback's artifact. The declared `[state: h >= 17.0]` rider
has no audit line at all. A measured impossibility proof
(Hydrogen seat, driver-verified, phase 18) shows the
base-centre proxy and the match-cut cannot both pass for any
above-ground camera; on the judged render the hero wall at
h=17 fills the opening frame exactly as the declared moment
intends.

## The current code (tools/audit_staging.mjs, verbatim — the generic prop branch's final else, the ONLY segment you replace)
```js
   else {const pass=!hidden&&inFrame&&px!=null&&px>=threshold;checks.push(`${id} ${pass?'PASS':'FAIL'} ${px?.toFixed(0)??'n/a'}px ${inFrame?'in frustum':'out of frustum'}${hidden?' hidden':''}${type==='occupancy'?' occupancy subject':''}`);}
```
Context you may rely on (already in scope in that branch):
`p` is the resolved prop; `s = propState(p,t)` (so `s.h` is the
keyed wall height at t — exactly 17 at F1647 — and `s.at` is
[0,0,-16]); `center = s.at`; `fr` is the frame (`fr.height(size, point)`,
`fr.point(point)`); `threshold` is 400 for this moment;
`hidden` is the moment's hidden flag.

## The replacement (an F1647 case branch inserted before the generic else; the generic else stays byte-identical after it)
Return this exact segment — the `else if` case plus the
unchanged generic `else`:
```js
   else if(frameNo===1647){ // F1647 case amended per dispatcher's ruling 2026-11-23 (RUN_RECORD phase 19): the declared moment (CHUNK3B_HYDROGEN_REPLY.md line 476) is `seawall_hero >= 400 [state: h >= 17.0]` — the hero wall's rising top; the base-anchor point the generic fallback measured was never in the declared moment. Tested point re-pointed to the wall top [at[0], h(t), at[2]], size = h(t), threshold unchanged (400px), h >= 17.0 rider explicit.
    const top=[center[0],s.h,center[2]],topPx=fr.height(s.h,top),topIn=fr.point(top),pass=!hidden&&topIn&&topPx!=null&&topPx>=threshold&&s.h>=17;checks.push(`${id} ${pass?'PASS':'FAIL'} ${topPx?.toFixed(0)??'n/a'}px wall-top [${top.map(v=>v.toFixed(2)).join(', ')}] ${topIn?'in frustum':'out of frustum'}; state rider h ${s.h.toFixed(2)} >= 17.0 ${s.h>=17?'PASS':'FAIL'}`);}
   else {const pass=!hidden&&inFrame&&px!=null&&px>=threshold;checks.push(`${id} ${pass?'PASS':'FAIL'} ${px?.toFixed(0)??'n/a'}px ${inFrame?'in frustum':'out of frustum'}${hidden?' hidden':''}${type==='occupancy'?' occupancy subject':''}`);}
```
Do not adapt it, rename its variables, or "improve" it. No
CHUNK3_SIZE entry is added (a size entry alone cannot cure the
case — the generic branch also tests the base anchor in
frustum); the case branch above is the whole amendment.

## The header line (seat attribution — author exactly this one comment line, inserted into the file's top comment block, after the Phase-19 match-cut line)
`// Phase-19 P19_GLM_F1647_BRIEF.md (GLM seat): F1647 case amended per dispatcher's ruling 2026-11-23 (RUN_RECORD phase 19) — tested point re-pointed to the declared subject (wall top [0, h(t), -16]); threshold 400px unchanged; h >= 17.0 rider explicit.`

## Hard acceptance test (the driver runs it; your reply predicts it)
Audit run: `node tools/audit_staging.mjs` on the current judged
tree (post-ruling-2 state).
Baseline (driver-measured — reproduce these lines in your reply):
- `CHUNK3 F1647 | 54.90 | SH22 | FAIL | seawall FAIL 315px out of frustum; SH21→SH22 match-cut NDC_y +0.062 PASS: 0.062 / 0.060 (target +0.062 on both)`
- `CHUNK 3: FAIL (19/40 moments)`
After your amendment, REQUIRED:
- The F1647 line reads PASS: the seawall check reports the wall-top point [0, 17.00, -16] in frustum with height(17, top) ≈ 5,900px (≥ 400) and the rider `state rider h 17.00 >= 17.0 PASS`; the match-cut substring on the same line is unchanged (`PASS: 0.062 / 0.060`); the frame verdict becomes PASS.
- Chunk 3 total becomes `FAIL (18/40 moments)`.
- EVERY other line of the audit output reproduces byte-identical (same readings, same verdicts, chunk 2 included).
Why only F1647 moves: the new branch is keyed on `frameNo===1647` alone; every other moment takes the unchanged generic path.

## Explicitly NOT in this cause
No other case, branch, threshold, CHUNK3_SIZE entry, or line
of the tool changes. The match-cut block is NOT touched (it
was fixed under ruling 2 and now reads PASS 0.060). No film
file is touched. F590 + SH11 are closed by decision and are
not reopened; F1188 stays parked.

## Reply format (exact)
1. BASELINE RESTATED: the F1647 baseline line and the chunk-3 total above, in your own words.
2. REPLACEMENT SEGMENT: the else-if + else segment, verbatim as specified.
3. HEADER LINE: the comment line, verbatim as specified.
4. PREDICTED LINES: the F1647 line and the chunk-3 total after the amendment, plus a statement that every other line reproduces unchanged.
Nothing else. Do not claim you ran anything.
