# GLM SEAT — BRIEF · phase 14 · item 16: F474 option (D) — widen the neighbour village in set.js (+ its audit mirrors)

You are the GLM build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). You AUTHOR the change; the driver applies
your text verbatim and judges it by audits → fleet re-probe →
pixel gate → the driver's eye. RULES §3: one cause, one change.
**NO LOCAL RENDERS** — you return text only. This is Layla's
closure of the parked F474 cause: option (D), a SET change —
NOT a camera change (three camera rounds are exhausted on this
frame), NOT Environment dressing (that is a later pass).

## Previous verdict this brief cites (hard-gate requirement)
Commit `c870e24` — phase 14 item 15 CLOSED. No judgement is
pending; this brief may fire.

## The fault (measured)
SH06's camera is the round-2 park: pos [600,14,20], target
[600,5,5], fov 50, static. On the current fleet still the frame
reads as three giant flat regions — dark wall (top ~40%), sand
band, and ONE neighbour house as a huge flat solid at bottom
centre; pixel gate **12.9% detail / 86.6% flat**. Both "10M"
signs are complete (that part is already fixed — do not touch
the stickers). The staging audit reads F474 PASS (its houses
check is a projected-point count, 1/1).
**Why one house reads (driver-measured frame geometry):** the
houses stand at z=8, ~12 D from the camera; the frame's
horizontal half-angle is 29.4°, so the visible window at house
depth is only ~15 D wide. The three houses at x 580/600/620 sit
at 0° / ±59° off-axis — the ±20 pair is ENTIRELY outside the
frame. A house enters the frame only within ~±7 D of x=600.

## Current code (verbatim; these are the ONLY lines you may touch)
`scenes/set.js` (the neighbour build; `nc` = NEIGHBOR_COAST.at = [600,0,0]):
```
for(const x of [nc[0]-20,nc[0],nc[0]+20]){box(F.plaster,x,2.1,nc[2]+8,4,4.2,3.5);add(new THREE.ConeGeometry(2.8,1,4),F.roof,x,4.7,nc[2]+8);}
```
`tools/audit_staging.mjs` (two mirror lines):
```
for(const x of [580,600,620])solids.push({name:`neighbour house @${x}`,min:[x-2.45,0,8-2.05],max:[x+2.45,5.6,8+2.05]});
const houseBoxes=[580,600,620].map(x=>box([x,2.1,8],[4,4.2,3.5]));
```
`tools/audit_d1_d2.mjs` (one mirror line):
```
for (const hx of [580, 600, 620])
```

## The authored change (form fixed by the driver; you write the lines)
Densify + widen the row: houses at x offsets
**[-20,-15,-10,-5,0,5,10,15,20]** from nc[0] (absolute
[580,585,590,595,600,605,610,615,620]) — same construction
(plaster box 4×4.2×3.5 at y 2.1, z nc[2]+8; cone roof 2.8 at
y 4.7), same z, no size change, no other set element touched.
At 5 D spacing the houses at 0/±5 stand 22.6° off-axis — INSIDE
the frame — so the frame's bottom reads a row of three houses
with the wider village continuing out of frame on both sides.
Author: (1) the replacement set.js loop line (offsets written
in the file's `nc[0]±k` style); (2) the two audit_staging.mjs
mirror lines with the absolute list; (3) the audit_d1_d2.mjs
mirror line with the absolute list. The three lists must be
IDENTICAL in content. Also author ONE header comment line for
audit_staging.mjs's amendment list, in its style:
`// Phase-14 P14_GLM_ITEM16_BRIEF.md (GLM seat): neighbour village widened to nine houses (set.js + mirrors).`

## Measured baseline (driver's own runs on HEAD c870e24 — reproduce in your reply)
- F474 audit: PASS — neighbour wall 873px corners 0/8; sticker_a 111px 8/8; sticker_b 111px 8/8; neighbour houses PASS 1/1.
- Pixel gate on the current still: 12.9% detail / 86.6% flat.
- D1/D2: FAIL (2) — D2-CLEAR SH13 + SH16 only. Chunk 3: 19/40. Chunk 2 audit: 17/19 (the two documented model gaps).

## Acceptance (the driver verifies, in order)
D1/D2 unchanged FAIL (2) — the new solids must not create a new
D2-CLEAR hit on ANY shot (SH23 works at NEIGHBOR_COAST; its
camera stays above/away — the audit decides). Staging audit:
F474 stays PASS with the houses count risen (expect 3/1);
every other line in both chunks unchanged. Fleet re-probe F474
SUCCESS. Pixel gate: detail/flat reported as measured (must
improve on 12.9/86.6). Eye: plural houses read in front of the
wall across the frame's bottom; both "10M" signs still complete.

## Reply format (exact)
1. BASELINE RESTATED: the baseline readings above.
2. SET LINE: the replacement set.js loop line, verbatim, pasteable.
3. MIRROR LINES: the audit_staging.mjs header comment + its two lines, and the audit_d1_d2.mjs line, verbatim, pasteable.
4. PREDICTED READINGS: F474 audit line (incl. houses count), D1/D2, chunk totals.
Nothing else. Do not claim you ran anything.
