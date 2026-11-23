# GLM SEAT — CORRECTED RE-BRIEF · phase 14 · item 16 round 2: F474 option (D) — the neighbour row moves to the wall's foot (z −2), widened

Your round-1 output was CLEAN against the brief you were given —
the defect was the DRIVER's: the brief's frame geometry used the
TOTAL horizontal FOV (29.4°) as the half-angle. The true
half-angle is 14.7° (audit model); the render's empirical
horizontal FOV is ≈35° (sticker centres at ±3 D / 18 D render
±330px from centre). At the houses' z=8 (~12 D from camera) the
visible window is only ~6 D wide, so the ±5 houses of round 1
never enter the frame: the staging audit read houses 1/1 on the
round-1 application, unchanged. **The driver reverted that
application uncommitted.** This re-brief corrects the geometry;
the cause, the closure (option D) and your authorship stand.

## Previous verdict this brief cites (hard-gate requirement)
Commit `c870e24` — phase 14 item 15 CLOSED (unchanged). Round 1
of this item produced no verdict (application reverted before
any probe, on the driver's measured geometry error, recorded in
RUN_RECORD). **NO LOCAL RENDERS** — text only.

## Corrected design (driver-measured, both models agree)
Move the neighbour row to the WALL'S FOOT: z = nc[2]−2 (in front
of the wall at z −10, behind the signs at z 2; inside
NEIGHBOR_COAST bounds z [−30,20]). Distance from camera
[600,14,20] ≈ 22 D → visible half-width ≈ 5.8 D (audit model)
to ≈ 6.9 D (render calibration). Houses at offsets
**[-15,-10,-5,0,5,10,15]** (absolute [585,590,595,600,605,610,
615]), same construction (plaster box 4×4.2×3.5 at y 2.1; cone
roof 2.8 at y 4.7), replacing the current three-house row at
z +8 entirely. Predictions: audit houses count **3/1** (centres
0/±5 at 12.8° off-axis < 14.7°, flanks 4/8 corners); the render
shows three houses across the frame's bottom in front of the
wall (centre full, flanks partial at the edges), the village
continuing out of frame. Signs (y 7, z 2) stay clear above the
roofs (top 5.6). SH23's camera (y 24–26 over NEIGHBOR_COAST)
clears the row; D1/D2 must stay FAIL (2).

## Current code (verbatim; the ONLY lines you may touch)
`scenes/set.js`:
```
for(const x of [nc[0]-20,nc[0],nc[0]+20]){box(F.plaster,x,2.1,nc[2]+8,4,4.2,3.5);add(new THREE.ConeGeometry(2.8,1,4),F.roof,x,4.7,nc[2]+8);}
```
`tools/audit_staging.mjs`:
```
for(const x of [580,600,620])solids.push({name:`neighbour house @${x}`,min:[x-2.45,0,8-2.05],max:[x+2.45,5.6,8+2.05]});
const houseBoxes=[580,600,620].map(x=>box([x,2.1,8],[4,4.2,3.5]));
```
`tools/audit_d1_d2.mjs`:
```
for (const hx of [580, 600, 620])
  SOLIDS.push({ name: `neighbour house @${hx}`, min: [hx - 2.45, 0, 8 - 2.05], max: [hx + 2.45, 5.6, 8 + 2.05] });
```

## Your task
Author: (1) the replacement set.js loop line — offsets in the
file's `nc[0]±k` style, z expression `nc[2]-2` in both the box
and the cone calls; (2) the audit_staging.mjs header comment
(same text as round 1: `// Phase-14 P14_GLM_ITEM16_BRIEF.md (GLM seat): neighbour village widened to nine houses (set.js + mirrors).` — CORRECTED by you to say seven houses at the wall's foot: write it as `// Phase-14 P14_GLM_ITEM16_REBRIEF.md (GLM seat): neighbour village widened — seven houses at the wall's foot (set.js + mirrors).`) + its two mirror lines with the absolute list [585,590,595,600,605,610,615] and z −2 (solids z arithmetic in the file's style: `-2-2.05` / `-2+2.05`; houseBoxes centre z −2); (3) the audit_d1_d2.mjs mirror lines (the for line + the SOLIDS.push line) with the same list and z arithmetic in that file's style (`-2 - 2.05` / `-2 + 2.05` — check the file's spacing: it writes `8 - 2.05` with spaces).

## Reply format (exact)
1. ERROR RESTATED: one line naming the round-1 geometry error (driver's, not yours).
2. SET LINE / MIRROR LINES: verbatim, pasteable, as above.
3. PREDICTED READINGS: F474 audit line (houses count), D1/D2, chunk totals, and the pixel-gate direction (improve on 12.9%/86.6%).
Nothing else. Do not claim you ran anything.
