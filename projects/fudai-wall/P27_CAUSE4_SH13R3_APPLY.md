# PHASE 27 · CAUSE 4 CORRECTIVE ROUND 3 — SH13 CAMERA — APPLICATION RECORD

## Previous verdict this application cites (hard-gate requirement)
Commit `6b0018b` — phase-26 VERDICT: cause 4 (SH13 camera,
corrective round 2) PARKED (application `d609e86` reverted in that
commit; film.js restored to the last judged state). Tree stands at
the last judged state, HEAD `6b0018b`. No judgement is pending when
this fires. Phase 24 re-routed this cause to the Hydrogen seat
(RUN_RECORD phase 24 ruling). Phase 26 escalated with priced option
(A) — corrective re-brief carrying the TRUE F933 measurement;
Layla took option (A) and ran the session. The judgement this round
corrects: phase 26, commit `6b0018b`.

## Delivery
Seat: **Hydrogen** (Gemini Neon, Task mode; gemini.google.com,
nooaar343@gmail.com), session run by Layla 2026-11-23 13:52–14:05
EET. Verbatim seat output: `P26_HYD_SH13R3_OUT.txt` (same folder).
The brief carried the corrected F933 fact (phase-26 probe: the
audit measures mocker_b's hand tip as `[posAt(mocker_b,t).x, 2.5,
posAt(mocker_b,t).z]`; his line-9 walk puts him at [-5,-8], so the
audited tip at F933 is **[-5, 2.5, -8]** — not the phantom
[4,1.2,-1] every brief since phase 12 carried) plus the measured
loader facts (the empirical-ease sample governs F933; autoMove
re-lanes the TO state). The driver applies the candidate VERBATIM
— no iteration, no hand-authored correction. **NO LOCAL RENDERS.
Colab LOCKED. SH26's line is DO-NOT-TOUCH. F1188 stays parked —
its reading must stand untouched. F590 + SH11 closed by decision —
never reopen.**

## The cause (standing)
SH13's original camera (lane A) sits inside the town hall solid
(D2-CLEAR hit) and fails F942 (box out) + F969 (face 61.5°, head
out); it passes F933 only because its north-looking camera happens
to frame the REAL tip at [-5,2.5,-8] nearly on-axis. Lane B
(phase-12 near-miss) cleared D2-CLEAR and passed F942/F969 but was
aimed at the phantom tip; lane C (Qwen #1) likewise; lane D
(phase-26 candidate) held D2-CLEAR (ZERO lines) + F942 (66px) +
F969 (47.9°/161px) and failed F933 on the phantom-point brief
error alone. Measured law: face angles across authored world pos
z are 10.2 → 61.5°, −6 → 47.9°, −14 → 66.3° — non-monotonic in
pullback; the loader's re-lane is not a linear function of z.

Measured baseline (driver's own audit runs on HEAD `6b0018b`,
reproducing phase 26):
- F933 (t=31.10) PASS: mocker_b hand tip in frustum (lane-A
  invariant, on the REAL tip [-5,2.5,-8]).
- F942 (t=31.40) FAIL: box_sh13 195px out of frustum.
- F969 (t=32.30) FAIL: mayor_old face angle 61.5°, head out 343px.
- F1188 (SH17) FAIL sea_sheet pull 0 >= 6 — PARKED, untouched.
- D1/D2 FAIL (1): D2-CLEAR shot 14 (SH13) "camera path intersects
  town hall" — the ONLY line; closing this cause clears it
  entirely (ZERO lines required).
- Chunk 3 staging 31/40 PASS (FAIL 9/40); chunk 2 untouched.

Current line (film.js):
chunk3Shot('SH13','line:11.start','line:11.end','COAST_VILLAGE',[[-5.4,1.62,8.2],[-6,1.55,1.6]],[[-2,1.62,8.2],[-2.6,1.5,2.9]],40)

## Candidate (Hydrogen seat, verbatim)
chunk3Shot('SH13','line:11.start','line:11.end','COAST_VILLAGE',[[-15.8,2.4,-28],[-4.8,2.8,-10]],[[3.6,4.6,-6.8],[-5.6,1.7,2.3]],44)
World: FROM pos [-15.8,2.4,-26.0] target [-4.8,2.8,-8.0]; TO pos
[3.6,4.6,-4.8] target [-5.6,1.7,4.3]; fov 44. Design: a long
southern sweep — the camera starts far south, looking north with
the real tip nearly on-axis at the empirical-eased F933 sample,
then drifts north-east to land on lane B's mayor ray for F969.

Seat's predicted readings (its own arithmetic, empirical ease
primary):
- D2-CLEAR: PASS, 0 intersections on all 18 solids (min clearance
  1.950m to house @8,-4); D1/D2 → ZERO lines; target bounds PASS
  both ends (FROM target y 2.8, TO target y 1.7, both inside
  COAST_VILLAGE bounds).
- F933 real tip [-5,2.5,-8]: PASS under the empirical ease —
  off-axis 4.40°, screen (538.8, 1143.0), unoccluded (min
  sightline clearance 3.210m). NOTE: under pure outCubic the same
  point reads OUT of frame (38.63°) — the design bets on phase
  26's measured fact that the empirical ease governs this
  fraction; the audit decides.
- F942 box: PASS — 82.1px ≥ 60px (93.2px under outCubic).
- F969: PASS — head 186.7px ≥ 120px, sphere margin 442.2px;
  face ~49.9° anchored to lane B's ray (48.0° under outCubic).

## Judgement plan (hard gate, in order)
1. Staging audit on the applied tree — F933 must stay PASS (on
   the real tip), F942 + F969 must PASS, F1188's line must stand
   byte-identical; no other moment may change.
2. D1/D2 audit on the applied tree — must read ZERO lines (PASS):
   SH13's town-hall line gone, no new line of any kind.
3. Fleet re-probes of F933/F942/F969 → pixel measurements +
   driver eye.
4. Verdict committed. A failed candidate parks per precedent —
   application reverted in the verdict commit, no self-iteration.
