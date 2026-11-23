# PHASE 33 · CAUSE 9 — SH18 CAMERA — APPLICATION RECORD

## Previous verdict this application cites (hard-gate requirement)
Commit `3004343` — phase-32 VERDICT: CLOSED (SH17 CAMERA
component on fixed data; application `6f3a00a` stands). Tree
stands at the last judged state, HEAD `3004343`. No judgement
is pending when this fires. Phase 24 re-routed this cause to
the Hydrogen seat (RUN_RECORD phase 24 ruling); the chunk-3a
staging (SH13–SH19) was authored by the Qwen seat — that
credit stands; only the repair seat changed.

## Delivery
Seat: **Hydrogen** (Gemini Neon, Task mode; gemini.google.com,
nooaar343@gmail.com), session run by Layla 2026-11-23
14:24–14:29 EET; conversation
https://gemini.google.com/app/ff1218aabf423533. Verbatim seat
output: `P27_HYD_SH18_OUT.txt` (same folder). Brief:
`P23_QWEN_SH18_BRIEF.md` as amended in phase 25 + Layla's
live-baseline update (D1/D2 at ZERO lines, must stay zero).
**NO LOCAL RENDERS. Colab LOCKED. SH26's line is DO-NOT-TOUCH.
F1188 stays parked — its coded reading must stand
byte-identical. F590 + SH11 closed by decision — never reopen.**

## The cause
SH18 (SEA anchor world [0,0,-44]): extreme low angle on the
drained sand, tilt-up to the crest — the 17.5 D water wall
spans the horizon; the glowing measure climbs to exactly 15
before the word. Under the baseline camera the tilt-up carries
both checked base centres out of the BOTTOM of the frame:
F1302 (t=43.40) measure_wave centre [5,0,-60] OUT (size already
2082px ≥ 200px — only the centre is out) and F1335 (t=44.50)
wave_sh18 base centre [0,0,-64] OUT (size already 2094px ≥
500px — only the centre is out). F1257 (t=41.90, wave 1833px
in frustum) PASSes and is the invariant.

Measured baseline (driver's own audit runs on HEAD `3004343`,
2026-11-23, reproducing phase 32's state):
- F1188 (t=39.60) FAIL — PARKED: sea_sheet_sh17 state FAIL
  pull 0 >= 6. Must stand byte-identical.
- F1257 (t=41.90) PASS: wave_sh18 1833px in frustum (invariant).
- F1302 (t=43.40) FAIL: measure_wave 2082px out of frustum.
- F1335 (t=44.50) FAIL: wave_sh18 2094px out of frustum.
- D1/D2 PASS — ZERO lines.
- Chunk 3: FAIL (5/40 moments) → staging 35/40.

## Candidate (verbatim from P27_HYD_SH18_OUT.txt)
chunk3Shot('SH18','line:16.start','line:16.end','SEA',[[1,.65,5],[1.5,2.2,-20]],[[1.5,.9,4],[1.8,8.8,-20]],[46,50])
World: pos [1,0.65,-39] → [1.5,0.9,-40]; target [1.5,2.2,-64]
→ [1.8,8.8,-64]; fov [46,50] (ramp unchanged). Design: the
tilt-up is moderated (TO target y 16.5 → 8.8, target x centred
1.5→1.8) so both base centres stay inside the frame through
fraction 0.917; composition consequence (seat's own note for
the chunk-3 critic round): the crest-overflow drama is
reduced — the wave still towers from a low camera, but the
tilt-up is gentler than Qwen's original design.

Seat's predicted readings (empirical ease; audit governs):
F1257 wave PASS 1607.3px; F1302 measure_wave centre IN
1660.4px ≥ 200px; F1335 wave centre IN 1631.3px ≥ 500px;
D1/D2 stays at ZERO lines; D2-CLEAR 0 hits.

Judgement proceeds to staging audit + D1/D2 audit → fleet
re-probes of F1257/F1302/F1335 → pixel measurements + driver
eye (the eye is a real gate — phases 29/32's lesson: the coded
PASS must be confirmed in the rendered stills) → verdict
committed.
