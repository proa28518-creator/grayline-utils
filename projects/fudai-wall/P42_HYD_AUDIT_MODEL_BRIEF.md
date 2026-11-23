# BRIEF — Phase 42: correct the staging audit's model (Hydrogen seat, full-file round)

Route history: GLM rounds 1–4 (phases 39–41) established the seat-side substance but
failed on patch fidelity, stateless re-briefs, and the API gateway's output window.
This round: the Hydrogen browser seat (Gemini Neon, Task mode) authors; the driver
verifies with the same mechanical scope check + acceptance anchors as phase 41.

## Task for the seat
The file `tools/audit_staging.mjs` (233 lines) is uploaded into the conversation as
`audit_staging_for_hydrogen.txt`. Return the ENTIRE corrected file, complete, in ONE
code block — not a diff, not fragments, not excerpts, no prose outside the block.
Reproduce every line byte-for-byte except the six anchored changes below. Do NOT join,
split, reflow, or reformat any existing line (a joined line failed the previous round's
scope check). Any change outside the six anchored regions makes the output unusable.

## Why (measured, RUN_RECORD phase 38)
1. Rests seam: the engine feeds lowCams stage-measured rests; the audit reconstructs
   rests from the cast spec JSON (hipY 1.256 / headY 1.956). Engine rests are a uniform
   +0.354 offset: hipY 1.610 / headY 2.310 (span 0.700 identical). With engine rests,
   lowCams reproduces the engine's measured camera floors EXACTLY: SH18 1.617, SH19 1.960.
2. Wave built geometry: the wave kind builds a box of size (w, h, 24) at
   (0, h/2, -12+advance) relative to the entry origin; built centre =
   at + (0, h/2, -12+advance); h = min(17.5, crestY ?? h); w = w ?? width ?? 70;
   h/crestY/advance resolved from the entry's keys at the sampled time. The audit models
   waves centred at the entry point with a fixed declared size, never tests
   camera-inside-a-body, and waves are absent from its face-occluder list.
3. Baseline verdicts that must NOT flip: SH19 F1367 face PASS, F1410 FAIL, F1428 FAIL;
   SH18 F1302 FAIL.

## Forbidden defects (from the GLM rounds)
(i) No new hipY/headY declaration — modify the existing hipY line in place; headY is
    computed from hipY and needs no edit.
(ii) No code at module level, nothing after any `return`; the wave-occluder addition
    goes INSIDE the one-line `occs(t)` function, before its own `return out;}`.
(iii) The containment test goes in the CHUNK-3 moments loop ONLY, and identifies the
    body by the wave entry's own id from the prop record (`p.id`) — never a field of
    the object `box()` returns (it has no name field).
(3) `hidden` is governed by the LAST key at-or-before t carrying a `hidden` field; the
    entry-level `hidden ?? false` applies ONLY when no key carries `hidden`. Never
    OR entry-level hidden over a governing key.
(4) The wave case must compute from the BUILT body (center = body.center,
    size = body.size) — never from CHUNK3_SIZE at the entry centre.
(5) The containment block goes BEFORE the `if(type==='occupancy'&&film.cast[id]){`
    line, immediately after the `if(!shot){...}` line, so it rides every branch.

## The six anchored changes (the ONLY regions that may differ)
A1 — header (original lines 6–7): replace
```
// Named assumptions: stage-dependent lowCams rests are unavailable, so the
// documented calibrated rest rule below is used. Camera roll is ignored (SH07
```
with
```
// Named assumptions: lowCams rests are the engine's stage-measured constants
// (RUN_RECORD phase 38: hipY 1.610 / headY 2.310 = spec reconstruction + 0.354,
// two-point exact fit on the SH18 / SH19 floors). Camera roll is ignored (SH07
```
Attribution — insert ONE line immediately after the existing line beginning
`// Phase-19 P19_GLM_F1647_BRIEF.md (GLM seat):` (original line 16) and before the line
beginning `// D2-CLEAR solids are copied` (original line 17):
```
// Phase-42 P42_HYD_AUDIT_MODEL_BRIEF.md (Hydrogen seat): audit model corrected to the engine's measured model per RUN_RECORD phase 38 — engine rests (+0.354), wave built-geometry bodies, camera-inside-wave FAIL test, waves as face occluders.
```
A2 — rests (original line 49, in place): replace
```
  const hipY = legLen * .93;
```
with
```
  // Engine rests (RUN_RECORD phase 38): stage-measured hipY 1.610 / headY 2.310 =
  // this spec reconstruction + 0.354; headY below derives from hipY, span stays 0.700.
  const hipY = legLen * .93 + .354;
```
Do NOT touch the `const rest = { hipY, headY: hipY + ... }` line that follows.
A4 — occluders (inside original line 117, the one-line `occs(t)`, immediately BEFORE
its final `return out;}`): insert
```
for(const p of props){const b=waveBody(p,t);if(b)out.push({name:p.id,...b});}
```
Nothing after the line; nothing at module level. occs (line 117) is defined BEFORE
waveBody (A3) — that is fine; do NOT move either function.
A3 — helper (insertion between original lines 120 and 121): a new function
`waveBody(p, t)` immediately AFTER `propState` (begins line 118, ends line 120) and
BEFORE the line beginning `function dropState(p,t){`. Spec: returns null unless
p.kind === 'wave'; visibility per the hidden rule above (hidden => null); keyed numeric
fields resolve with the SAME step semantics as propState's inner `val()` (last key
at-or-before t carrying the field wins; entry top-level is the default; an `ease` on
the governing key ramps smoothstep from the previous keyed value over `ease` seconds);
fields h, crestY (may be absent => null), advance (default 0);
buildH = Math.min(17.5, crestY ?? h ?? 17.5); w = p.w ?? p.width ?? 70; position `at`
from propState(p, t).at; return box([at[0], at[1] + buildH/2, at[2] - 12 + advance],
[w, buildH, 24]).
A5 — containment (insertion between original lines 200 and 201, CHUNK-3 moments loop):
immediately AFTER
```
 if(!shot){checks.push('missing shot');chunk3Results.push({frameNo,t,shotId,checks});continue;}
```
and BEFORE the line beginning ` if(type==='occupancy'&&film.cast[id]){`. The sampled
camera position is `fr.cam.pos`. Block: for every prop p with p.kind === 'wave',
compute waveBody(p, t); if non-null and fr.cam.pos lies strictly inside the body on
all three axes (pos[i] > min[i] && pos[i] < max[i], NO margin), push exactly one check
line `camera inside ${p.id} built body FAIL` into this moment's `checks`.
A6 — wave case (insertion between original lines 207 and 208): a new
`else if (p.kind === 'wave')` case immediately AFTER the line beginning
`   else if(type==='crest'){` and immediately BEFORE the line beginning
`   else if(frameNo===1647){`. The case: if waveBody(p, t) is null, push
`${id} FAIL absent`; otherwise compute from the BUILT body (center = body.center,
size = body.size) with the same pass rule and message shape as the generic else branch
(`!hidden && inFrame && px != null && px >= threshold`, px from fr.height(size[1],
center), inFrame from fr.point(center)). Do not alter the state/crest/F1647/generic
branches.

## Acceptance (driver verifies on the baseline tree)
- LOWCAMS log: villagers_shore shot raised to y 1.62; mayor_young shot to y 1.96.
- Baseline verdicts unchanged: F1367 face PASS; F1410 FAIL; F1428 FAIL; F1302 FAIL.
- Baseline containment: F1367 gains `camera inside wave_old_sh19 built body FAIL`;
  F1410 and F1428 gain NO containment line.
- On the phase-37 candidate tree: F1367, F1410, F1428 EACH gain the containment FAIL
  line for wave_old_sh19.
- Mechanical scope check: every differing line falls inside the six anchored regions.
