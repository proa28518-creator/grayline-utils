# PHASE 43 · CAUSE 10 — SH19 CAMERA, CORRECTIVE ROUND 2 — APPLICATION RECORD

## Previous verdict this application cites (hard-gate requirement)
Commit `3c5eced` — phase-43 record: SH18 measure_wave resolved-state
seam FALSIFIED (diagnosis only; no application; chunk 3 staging
34/40; D1/D2 PASS zero lines). Tree stands at the last judged
state, HEAD `3c5eced`. No judgement is pending when this fires.
The brief for this round: `P43_HYD_SH19R2_BRIEF.md` (commit
`c517a3d`, citing verdict `ce1c8d2` — phase-42 audit-model
correction APPLIED + CLOSED). Phase 24 re-routed this cause to
the Hydrogen seat (RUN_RECORD phase 24 ruling); the chunk-3a
staging (SH13–SH19) was authored by the Qwen seat — that credit
stands; only the repair seat changed.

## Delivery
Seat: **Hydrogen** (Gemini Neon, Task mode; gemini.google.com,
nooaar343@gmail.com), session run by Layla 2026-11-23
18:14–18:25 EET; conversation
https://gemini.google.com/app/10b8325c3183081f. Verbatim seat
output: `P43_HYD_SH19R2_OUT.txt` (same folder). **NO LOCAL
RENDERS. Colab LOCKED. SH26's line is DO-NOT-TOUCH. F1188 stays
parked — its coded reading must stand byte-identical. F590 +
SH11 closed by decision — never reopen. Cause 9 (SH18) stays
PARKED-ESCALATED — its data and camera are NOT touched in this
phase (its phase-43 diagnosis stands; H1 desk pv pass is a
separate phase).**

## The cause
SH19 (FLASHBACK_ROCK anchor world [1200,0,0]): the young mayor
on the rock, the old wave behind him. Round 1 (phase 37) passed
every coded gate with exact arithmetic and failed the EYE — the
mayor absent from all three renders. Phase 38 re-diagnosed: the
cameras sat inside wave_old_sh19's BUILT body (centre
[1191,1.0,−29], size [14,5,24], min [1184,−1.5,−41], max
[1198,3.5,−17] at all three judged frames). Phase 42 landed the
audit-model correction: the standing audit now floors on engine
rests, measures waves on built bodies, FAILs camera containment,
and counts waves as face occluders. On the corrected audit the
baseline reads F1367 face PASS + containment FAIL, F1410 FAIL
(head out 131px), F1428 FAIL (built centre out of frustum).

Measured baseline (driver's own audit runs on HEAD `3c5eced`,
2026-11-23, reproducing phases 42/43 byte-identical):
- F1188 (t=39.60) FAIL — PARKED: sea_sheet_sh17 state FAIL
  pull 0 >= 6. Must stand byte-identical.
- F1302 (t=43.40) FAIL: measure_wave 2088px out of frustum (SH18 — untouched this phase).
- F1335 (t=44.50) FAIL: wave_sh18 461px out of frustum (SH18 — untouched this phase).
- F1367 (t=45.57) FAIL: camera inside wave_old_sh19 built body FAIL; mayor_young face PASS angle 8.1° head in 106px (the face reading is the invariant — it must stay PASS; the containment line must GO).
- F1410 (t=47.00) FAIL: mayor_young face FAIL angle 10.3° head out 131px.
- F1428 (t=47.60) FAIL: wave_old_sh19 FAIL n/a px out of frustum.
- D1/D2 PASS — ZERO lines.
- Chunk 3: FAIL (6/40 moments) → staging 34/40.

## Candidate (verbatim from P43_HYD_SH19R2_OUT.txt)
chunk3Shot('SH19','line:17.start','line:17.end','FLASHBACK_ROCK',[[-10,7.5,-43.5],[-2,0.5,-6]],[[-10,7.5,-41.5],[-6,0.2,-20]],38)
World: pos [1190,7.5,-43.5] → [1190,7.5,-41.5]; target
[1198,0.5,-6] → [1194,0.2,-20]; fov 38. Design: a high seaward
station south of and above the built wave body, looking north
across it to the mayor; authored y 7.5 clears the body's y_max
3.5 by +4.0 and the z stations clear z_min −41 — dual-axis
containment clearance at every judged frame; the 1.96 floor
does not intervene.

Seat's predicted readings (corrected audit governs):
- F1367 face: PASS — 62.1px, containment CLEAR (y +4.0, z −2.303).
- F1410 face: PASS — 64.8px, containment CLEAR (y +4.0, z −0.812).
- F1428 wave (built body): PASS — 1028.8px centre IN, containment CLEAR (y +4.0, z −0.552).
- D1/D2: ZERO lines; D2-CLEAR 0 hits.

## Judgement plan
Apply verbatim → corrected staging audit + D1/D2 (full-audit
diff must be exactly the three SH19 lines + the chunk-3 total;
F1188 byte-identical; F1302/F1335 unchanged; D1/D2 PASS zero
lines) → fleet re-probes of F1367/F1410/F1428 → pixel
measurements + driver eye (the eye is decisive: the mayor must
be PRESENT and whole in F1367/F1410; the wave body present at
F1428) → verdict committed. If the coded layer passes but the
eye fails, revert and park-escalate with the evidence.
