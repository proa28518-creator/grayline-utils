# PHASE 18 · CAUSE 11 (SH22 camera + SH21→SH22 match-cut) — APPLICATION RECORD

## Previous verdict this application cites (hard-gate requirement)
Commit `2cc52dc` — phase-16 cause 4 (SH13, Qwen seat) judged and
parked; the tree stands at the last judged state (`0b5b45d` scene
state; HEAD `cb424ba` adds phase-17 prep briefs only). No judgement
is pending when this fires.

## Delivery
Browser-seat candidate under phase-14 queue step 5 (SH20–SH26 camera
causes belong to the Hydrogen browser seat, phase-14 dispatcher
ruling). Seat: **Hydrogen** (Gemini Neon, Task mode;
gemini.google.com, nooaar343@gmail.com), session run by Layla
2026-11-23 10:20–10:30 EET. Brief: `P17_HYD_SH22_BRIEF.md`. Verbatim
seat output: `P17_HYD_SH22_OUT.txt` (same folder). The driver applies
the candidate VERBATIM — no iteration, no hand-authored correction.
**NO LOCAL RENDERS. Colab LOCKED.**

## The cause (ONE mechanism: SH22's camera misses the pour, and its
## FROM pose breaks the engineered SH21→SH22 match-cut)
Measured baseline (driver's own audit runs on HEAD `cb424ba`):
- F1647 (t=54.90) FAIL: seawall 183px, centre OUT of frustum (audit
  proxy: no `seawall` entry in CHUNK3_SIZE → 1-unit height at the
  base centre [0,0,-16], threshold 400px).
- Match-cut rider (printed on F1635 + F1647) FAIL: SH21 side 0.062
  (exact) / SH22 side 0.322 (target +0.062 ± 0.02 on both).
- F1677 (t=55.90) FAIL: pour_sh22 155px in frustum (threshold 180px).
- F1716 (t=57.20) PASS: workers body 260px, corners 8/8 — INVARIANT.
- D2-CLEAR: no hit on SH22 (FAIL (2) = SH13 + SH16 only).
- Chunk 3 staging 19/40 PASS (21 FAIL); chunk 2 untouched.

Current line (film.js):
chunk3Shot('SH22','line:20.start','line:20.end','COAST_WALL',[[0,16.75,14],[0,16.75,1.5]],[[6,19.2,20],[0,17.5,0]],[36,42])

## Seat's headline: UNSATISFIABILITY PROOF for all four checks together
The seat proved (arithmetic in `P17_HYD_SH22_OUT.txt`) that no
above-ground camera (fov ∈ [24,50]) satisfies F1647's base-centre
proxy AND the match-cut together: pinning the wall TOP [0,17,-16] at
NDC_y +0.062 ± 0.02 while the base centre [0,0,-16] (17 units below)
sits in frustum at ≥400px on the 1-unit proxy forces either a 5.45×
size deficit (≤73.35px max) or a ≥56° B-P-T separation pushing the
base out of frustum; the only intersection is underground
(y ≤ −1.1), which violates ground clearance / triggers lowCams.
The candidate therefore passes every staging-true check and exposes
the F1647 proxy conflict explicitly. The F1647 audit-proxy question
is split off as its own item for Layla's decision (phase-18 report);
the audit is NOT amended by this application.

## Candidate (Hydrogen seat, verbatim)
chunk3Shot('SH22','line:20.start','line:20.end','COAST_WALL',[[0,16.86,9],[0,16.86,0]],[[4,18.8,16],[0,18.2,0]],[28,36])
World: fromPos [0,16.86,-7], fromTarget [0,16.86,-16],
toPos [4,18.8,0], toTarget [0,18.2,-16], fov 28→36.

## Seat's predicted readings (to be judged against the audit, line by line)
- Match-cut SH22 side: PASS — NDC_y +0.0624 (SH21 side untouched 0.062).
- F1647: CONFLICT — size 421.1px ≥ 400px PASS; centre OUT of frustum
  (off-axis 61.33° vs 14.12° vertical half-FOV at the sampled pose).
- F1677: PASS — pour 219.6px ≥ 180px, in frustum, off-axis 3.43°.
- F1716: PASS — workers 375.6px ≥ 240px, corners 8/8, face 15.57°.
- D2-CLEAR / solids: PASS — path x∈[0,4], y∈[16.86,18.8], z∈[-7,0];
  ≥8.425 units clear of the seawall front face.
- No other moment changes.

## Judgement chain (hard gate)
Apply verbatim → `node --check` → staging audit (match-cut +
F1647/F1677/F1716 + full-output diff vs baseline: no other moment
may change) → D1/D2 audit → if the audit's readings match the seat's
predictions (all PASS except F1647 centre-out): fleet re-probe of
frames 1647, 1677, 1716 → pixel measurement + driver eye on the
stills → verdict committed. If other readings disagree, park per
precedent and report — the driver does NOT iterate the camera.
SH21's line is NOT part of this cause and stays untouched.
