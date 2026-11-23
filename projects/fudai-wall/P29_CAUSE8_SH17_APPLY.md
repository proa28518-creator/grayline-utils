# PHASE 29 · CAUSE 8 — SH17 CAMERA — APPLICATION RECORD

## Previous verdict this application cites (hard-gate requirement)
Commit `d316366` — phase-28 VERDICT: CLOSED (SH14 camera,
Hydrogen seat; application `2f43072` stands). Tree stands at
the last judged state, HEAD `d316366`. No judgement is pending
when this fires. Phase 24 re-routed this cause to the Hydrogen
seat (RUN_RECORD phase 24 ruling). The brief is
`P23_QWEN_SH17_BRIEF.md` as amended in phase 25 (Hydrogen
re-address + complete 18-solid D2-CLEAR set) + Layla's
live-baseline update (D1/D2 at ZERO lines, must stay zero).

## Delivery
Seat: **Hydrogen** (Gemini Neon, Task mode; gemini.google.com,
nooaar343@gmail.com), session run by Layla 2026-11-23 14:20–14:24
EET; conversation
https://gemini.google.com/app/46371250cedacfcb. Verbatim seat
output: `P27_HYD_SH17_OUT.txt` (same folder). The driver applies
the candidate VERBATIM — no iteration, no hand-authored
correction. **NO LOCAL RENDERS. Colab LOCKED. SH26's line is
DO-NOT-TOUCH. F1188 stays parked — its coded reading must stand
byte-identical. F590 + SH11 closed by decision — never reopen.**

## The cause (standing)
SH17 (SEA anchor world [0,0,-44]): the sea pulls back and two
boats settle on the drained shore. At F1215 (t=40.50, fraction
0.878) boat_sh17_b's centre is OUT of frustum (its 3.2-unit
height already reads 634px — only the centre is out). F1197
(boat_a 509px + sea_sheet pull rider) PASSes and is the
invariant. F1188 is PARKED (sea_sheet pull reading internally
inconsistent with the owner's word timings) — not this cause.

Measured baseline (driver's own audit runs on HEAD `d316366`,
2026-11-23):
- F1188 (t=39.60) FAIL — PARKED: sea_sheet_sh17 state FAIL
  pull 0 >= 6. Must stand byte-identical.
- F1197 (t=39.90) PASS: boat_sh17_a 509px in frustum;
  sea_sheet_sh17 state rider PASS pull 14 >= 12 (invariant).
- F1215 (t=40.50) FAIL: boat_sh17_b 634px out of frustum.
- D1/D2 PASS — ZERO lines (fully clean since phase 27).
- Chunk 3: FAIL (6/40 moments).

## Candidate (verbatim from P27_HYD_SH17_OUT.txt)
chunk3Shot('SH17','line:15.start','line:15.end','SEA',[[-6,13.5,19],[-2,0,2]],[[2,12.5,18],[0,0,2]],48)
World: pos [-6,13.5,-25] → [2,12.5,-26]; target [-2,0,-42] →
[0,0,-42]; fov 48. Design: camera path pulled ~4 units seaward
with the aim shallowed to world z −42 at both ends and fov
widened 44→48, so boat_b's centre enters the late frame while
boat_a holds at mid-shot.

Seat's predicted readings: F1197 boat_a PASS 381px (seat
computed boat_a at world z −40; it also checked the brief's
stated −37 position: PASS 435px — the audit reads the film's
own data; any seat/brief position discrepancy is noted in the
record); F1215 boat_b centre IN 450px; F1188 unchanged FAIL
pull 0 >= 6; D1/D2 stays at ZERO lines; D2-CLEAR 0 hits.

Judgement proceeds to staging audit + D1/D2 audit → fleet
re-probes of F1197/F1215 → pixel measurements + driver eye →
verdict committed.
