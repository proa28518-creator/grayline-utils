# PHASE 28 · CAUSE 6 — SH14 CAMERA — APPLICATION RECORD

## Previous verdict this application cites (hard-gate requirement)
Commit `d7f873f` — phase-27 VERDICT: CLOSED (SH13 camera,
corrective round 3; application `5fe4fea` stands). Tree stands at
the last judged state, HEAD `d7f873f`. No judgement is pending
when this fires. Phase 24 re-routed this cause to the Hydrogen
seat (RUN_RECORD phase 24 ruling). The brief is
`P23_QWEN_SH14_BRIEF.md` as amended in phase 25 (Hydrogen
re-address + complete 18-solid D2-CLEAR set) + Layla's
live-baseline update (D1/D2 must stay at ZERO lines).

## Delivery
Seat: **Hydrogen** (Gemini Neon, Task mode; gemini.google.com,
nooaar343@gmail.com), session run by Layla 2026-11-23 14:15–14:19
EET; conversation
https://gemini.google.com/app/dde0b80276121702. Verbatim seat
output: `P27_HYD_SH14_OUT.txt` (same folder). The driver applies
the candidate VERBATIM — no iteration, no hand-authored
correction. **NO LOCAL RENDERS. Colab LOCKED. SH26's line is
DO-NOT-TOUCH. F1188 stays parked — its reading must stand
untouched. F590 + SH11 closed by decision — never reopen.**

## The cause (standing)
SH14 (hill grave, HILL_GRAVE anchor world [2400,0,0]): the camera
cranes up beside the gravestone and aims down its own diagonal;
at the closing moment F1056 (t=35.20, fraction 0.969) the distant
wall silhouette's centre [2400,0,-140] sits ≈13–14° off-axis
horizontally — outside the fov-40 horizontal half-angle of
11.57° — even though its 18-unit height reads 357px. The two
earlier moments (gravestone F993, falling leaf F1026) PASS and
are invariants.

Measured baseline (driver's own audit runs on HEAD `d7f873f`,
2026-11-23):
- F993 (t=33.10) PASS: gravestone_sh14 692px in frustum
  (invariant).
- F1026 (t=34.20) PASS: leaf_sh14 75px in frustum (invariant).
- F1056 (t=35.20) FAIL: wall_distant_sh14 357px out of frustum
  (centre out; the size reading already clears the 40px bar).
- F1188 (SH17) FAIL sea_sheet pull 0 >= 6 — PARKED, untouched.
- D1/D2 PASS — ZERO lines (fully clean since phase 27); closing
  this cause must keep it at ZERO lines.
- Chunk 3 staging 33/40 PASS (FAIL 7/40); chunk 2 untouched.

Current line (film.js):
chunk3Shot('SH14','line:12.start','line:12.end','HILL_GRAVE',[[2.6,.9,5.2],[0,1,0]],[[2.2,3.4,6.4],[0,1.2,-2]],40)

## Candidate (Hydrogen seat, verbatim)
chunk3Shot('SH14','line:12.start','line:12.end','HILL_GRAVE',[[2.6,.9,5.2],[0,1,0]],[[0,3.4,6.4],[0,1.5,-5]],40)
World: FROM pos [2402.6,0.9,5.2] target [2400,1,0]; TO pos
[2400,3.4,6.4] target [2400,1.5,-5]; fov 40. Design: FROM
untouched; the TO state swings the late aim onto the −z axis
(pos x 2.2→0, target [0,1.5,-5]) so the horizon wall's centre
enters the frame at fraction 0.969, while the early/mid aim at
the grave is preserved.

Seat's predicted readings (its own arithmetic, both eases):
- F993 gravestone: PASS — 698.3px (697.2 under outCubic).
- F1026 leaf: PASS — 75.7px (73.0 under outCubic; also PASS on
  eased leaf timing).
- F1056 wall: PASS — centre IN (hx 0.02°), 341.0px ≥ 40px.
- D1/D2: ZERO lines; D2-CLEAR 0 hits (nearest solid ~1,780
  units away).

## Judgement plan (hard gate, in order)
1. Staging audit on the applied tree — F993 + F1026 must stay
   PASS, F1056 must PASS, F1188's line must stand
   byte-identical; no other moment may change.
2. D1/D2 audit on the applied tree — must read ZERO lines
   (PASS), no new line of any kind.
3. Fleet re-probes of F993/F1026/F1056 → pixel measurements +
   driver eye.
4. Verdict committed. A failed candidate parks per precedent —
   application reverted in the verdict commit, no
   self-iteration.
