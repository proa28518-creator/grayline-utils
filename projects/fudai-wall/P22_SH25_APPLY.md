# PHASE 22 · SH25 CAMERA — CORRECTIVE ROUND — APPLICATION RECORD

## Previous verdict this application cites (hard-gate requirement)
Commit `1e829b1` — phase-21 VERDICT: SH25 camera PARKED, candidate 1
FAILED the D1/D2 gate (staging-perfect, gate-incomplete); the tree
stands at the last judged state (HEAD `1e829b1` = that verdict).
Layla took escalation option (A): a corrective re-brief to the
Hydrogen seat with the D2 target-y bound (≤ 19.5 at both ends,
world) stated as a hard constraint. No judgement is pending when
this fires.

## Delivery
Browser-seat candidate under phase-14 queue step 5 (SH20–SH26 camera
causes belong to the Hydrogen browser seat, phase-14 dispatcher
ruling). Seat: **Hydrogen** (Gemini Neon, Task mode;
gemini.google.com, nooaar343@gmail.com), corrective session run by
Layla 2026-11-23 11:18–11:22 EET. Verbatim seat output:
`P21_HYD_SH25_OUT2.txt` (same folder). The driver applies the
candidate VERBATIM — no iteration, no hand-authored correction.
**NO LOCAL RENDERS. Colab LOCKED. SH26's line is DO-NOT-TOUCH
(re-measured fully passing, phase 17).**

## The cause (unchanged from phase 21: SH25's camera looks steeply
## DOWN at the villagers from y ≈ 23 — the sunbeam centre rides far
## above the aim line and falls out of the top of the frame at
## fraction 0.42, while the villagers read small from ≈28 deep at
## fraction 0.84. Candidate 1 fixed the staging but aimed its FROM
## target at world y=22, over the D2 target-sanity bound 0..19.5 —
## a bound the phase-21 brief never stated.)

Measured baseline (driver's own audit runs on HEAD `1e829b1`,
reproducing the phase-21 baseline exactly):
- F1944 (t=64.80) FAIL: sunbeam_sh25 2522px but centre OUT of
  frustum (size ≥ 400px already; only the centre is out).
- F1953 (t=65.10) FAIL: villagers occupancy 170px, corners 8/8
  (centre in ✓, corners ✓; height(2) = 170px < 230px threshold —
  only the size is short; forward depth ≈28.2).
- D1/D2 FAIL (2): D2-CLEAR SH13 + SH16 only, no SH25 hit; no
  target-y line.
- Chunk 3 staging 27/40 PASS (FAIL 13/40); chunk 2 untouched.

Current line (film.js):
chunk3Shot('SH25','line:23.start','line:23.end','COAST_WALL',[[0,19.6,1],[0,3.5,22]],[[0,23.5,5],[0,2.5,24]],46)

## Candidate (Hydrogen seat, corrective round, verbatim)
chunk3Shot('SH25','line:23.start','line:23.end','COAST_WALL',[[0,19.6,2],[0,19,24]],[[0,19.6,6],[0,6,22]],[48,30])
World: pos [0,19.6,-14] → [0,19.6,-10]; target [0,19,8] → [0,6,6];
fov 48 → 30. Diff vs candidate 1: FROM target y 22 → 19; TO target
y 5 → 6. Nothing else changed. Design: a LEVEL camera at constant
y=19.6 (exactly the loader's lowCams floor on this shot, so no
unexpected lift); the aim swings from the sunbeam down to the
villagers while the fov narrows 48→30, buying the villagers' pixel
size — now with both target ends inside the D2 bound.

Seat's predicted readings (its own arithmetic):
- D2 target bound: FROM world target y=19.0 ∈ [0,19.5] (0.50
  margin); TO y=6.0 — both PASS; D1/D2 stays baseline FAIL (2).
- F1944 sunbeam: PASS — centre IN (off-axis +15.57° vs 18.26°
  vertical half-angle; 2.69° inside); 3153.8px ≥ 400px.
- F1953 villagers: PASS — centre in (off-axis −10.79°); 291.7px
  ≥ 230px; corners 8/8.
- D2-CLEAR / solids: clean (path y=19.6 constant, z∈[−14,−10]).

## Judgement plan (hard gate, in order)
1. Staging audit on the applied tree — F1944/F1953 must PASS;
   no other moment may change.
2. D1/D2 audit on the applied tree — output must be BYTE-IDENTICAL
   to the baseline FAIL (2).
3. Fleet re-probes of F1944/F1953 → pixel measurements + driver eye.
4. Verdict committed. A failed candidate parks per precedent —
   application reverted uncommitted, no self-iteration.
