# PHASE 32 · CAUSE 8 (camera component) — SH17 CAMERA RE-JUDGED ON FIXED DATA — APPLICATION RECORD

## Previous verdict this application cites (hard-gate requirement)
Commit `af84f83` — phase-31 VERDICT: CLOSED (SH17 DATA FIX,
GLM seat; application `74f86c1` stands). Tree stands at the
last judged state, HEAD `af84f83`. No judgement is pending
when this fires. Phase 30 re-scoped cause 8: data fix first
(phase 31, closed), THEN the camera round on fixed data —
this is that round. Phase 24 re-routed this cause to the
Hydrogen seat (RUN_RECORD phase 24 ruling).

## Delivery — the phase-29 candidate, re-judged on fixed data
Seat: **Hydrogen** (Gemini Neon, Task mode; gemini.google.com,
nooaar343@gmail.com), session run by Layla 2026-11-23
14:20–14:24 EET; conversation
https://gemini.google.com/app/46371250cedacfcb. Verbatim seat
output: `P27_HYD_SH17_OUT.txt` (same folder). The candidate
was applied and judged once in phase 29 (application
`4ff70dc`, verdict `bf8fef5` PARKED-ESCALATED): it passed
every coded gate (F1197 381px exact, F1215 449px centre IN,
D1/D2 zero lines) and failed the RENDER layer — boat_b was
invisible in the fleet F1215 still (0 hull pixels). Phase 30
established the mechanism: the engine's governing-key
wholesale placement sent both boats to the world origin at
their rot-only keys — a DATA fault, not a camera fault.
Phase 31 fixed the data (both rot keys now carry the settled
`at`; fleet track 45178732527 proves both boats hold position
through F1221; F1215 hull pixels 0 → 11,508 under the
BASELINE camera). The candidate is therefore LIVE EVIDENCE
for this round and is re-applied VERBATIM — no iteration, no
hand-authored correction. **NO LOCAL RENDERS. Colab LOCKED.
SH26's line is DO-NOT-TOUCH. F1188 stays parked — its coded
reading must stand byte-identical. F590 + SH11 closed by
decision — never reopen.**

## The cause (camera component, on fixed data)
SH17 (SEA anchor world [0,0,-44]): the sea pulls back and two
boats settle on the drained shore. At F1215 (t=40.50, fraction
0.878) boat_sh17_b's centre is OUT of frustum under the
baseline camera (its 3.2-unit height already reads 634px —
only the centre is out). F1197 (boat_a 509px + sea_sheet pull
rider) PASSes and is the invariant. F1188 is PARKED
(sea_sheet pull reading internally inconsistent with the
owner's word timings) — not this cause.

Measured baseline (driver's own audit runs on HEAD `af84f83`,
2026-11-23, reproducing phase 31 byte-identical):
- F1188 (t=39.60) FAIL — PARKED: sea_sheet_sh17 state FAIL
  pull 0 >= 6. Must stand byte-identical.
- F1197 (t=39.90) PASS: boat_sh17_a 509px in frustum;
  sea_sheet_sh17 state rider PASS pull 14 >= 12 (invariant).
- F1215 (t=40.50) FAIL: boat_sh17_b 634px out of frustum.
- D1/D2 PASS — ZERO lines.
- Chunk 3: FAIL (6/40 moments) → staging 34/40.

## Candidate (verbatim from P27_HYD_SH17_OUT.txt)
chunk3Shot('SH17','line:15.start','line:15.end','SEA',[[-6,13.5,19],[-2,0,2]],[[2,12.5,18],[0,0,2]],48)
World: pos [-6,13.5,-25] → [2,12.5,-26]; target [-2,0,-42] →
[0,0,-42]; fov 48. Design: camera path pulled ~4 units seaward
with the aim shallowed to world z −42 at both ends and fov
widened 44→48, so boat_b's centre enters the late frame while
boat_a holds at mid-shot.

Seat's predicted readings (on the audit model): F1197 boat_a
PASS 381px; F1215 boat_b centre IN 450px; F1188 unchanged FAIL
pull 0 >= 6; D1/D2 stays at ZERO lines; D2-CLEAR 0 hits.
Phase 29 measured the same candidate at F1197 381px EXACT and
F1215 449px — those coded readings are expected to reproduce;
the open question of THIS round is the render layer on fixed
data.

Judgement proceeds to staging audit + D1/D2 audit → fleet
re-probes of F1197/F1215 → pixel measurements + driver eye
(the eye is a real gate here — phase 29's lesson: the coded
PASS must be confirmed by boat_b actually visible in the
rendered F1215) → verdict committed.
