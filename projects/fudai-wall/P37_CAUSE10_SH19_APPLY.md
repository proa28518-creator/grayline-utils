# PHASE 37 · CAUSE 10 — SH19 CAMERA — APPLICATION RECORD

## Previous verdict this application cites (hard-gate requirement)
Commit `db40365` — phase-36 record: SH18 render-layer DIAGNOSIS
COMPLETE (no application; film.js == `3d0aaa6`; chunk 3 staging
35/40; D1/D2 PASS zero lines). Tree stands at the last judged
state, HEAD `db40365`. No judgement is pending when this fires.
Phase 24 re-routed this cause to the Hydrogen seat (RUN_RECORD
phase 24 ruling); the chunk-3a staging (SH13–SH19) was authored
by the Qwen seat — that credit stands; only the repair seat
changed.

## Delivery
Seat: **Hydrogen** (Gemini Neon, Task mode; gemini.google.com,
nooaar343@gmail.com), session run by Layla 2026-11-23
14:29–14:36 EET; conversation
https://gemini.google.com/app/69e073e8ff4cf719. Verbatim seat
output: `P27_HYD_SH19_OUT.txt` (same folder). Brief:
`P23_QWEN_SH19_BRIEF.md` as amended in phase 25 (Hydrogen
re-address + complete 18-solid D2-CLEAR set) + Layla's
live-baseline update (D1/D2 at ZERO lines, must stay zero).
**NO LOCAL RENDERS. Colab LOCKED. SH26's line is DO-NOT-TOUCH.
F1188 stays parked — its coded reading must stand
byte-identical. F590 + SH11 closed by decision — never reopen.
Cause 9 (SH18) stays PARKED-ESCALATED — its data and camera are
NOT touched in this phase.**

## The cause
SH19 (FLASHBACK_ROCK anchor world [1200,0,0]): the young mayor
on the rock, the old wave behind him. Under the baseline camera
the push carries the mayor's head OUT of frame at F1410 (face
angle fine at 10.3°, head out 131px) and the wave's centre
finishes BEHIND the camera at F1428 (6216px out). F1367
(t=45.57, face PASS 8.1°, head in 106px) PASSes and is the
invariant.

Measured baseline (driver's own audit runs on HEAD `db40365`,
2026-11-23, reproducing phase 36 byte-identical):
- F1188 (t=39.60) FAIL — PARKED: sea_sheet_sh17 state FAIL
  pull 0 >= 6. Must stand byte-identical.
- F1302 (t=43.40) FAIL: measure_wave 2082px out of frustum (SH18 — untouched this phase).
- F1335 (t=44.50) FAIL: wave_sh18 2094px out of frustum (SH18 — untouched this phase).
- F1367 (t=45.57) PASS: mayor_young face PASS angle 8.1° head in 106px (invariant).
- F1410 (t=47.00) FAIL: mayor_young face FAIL angle 10.3° head out 131px.
- F1428 (t=47.60) FAIL: wave_old_sh19 FAIL 6216px out of frustum.
- D1/D2 PASS — ZERO lines.
- Chunk 3: FAIL (5/40 moments) → staging 35/40.

## Candidate (verbatim from P27_HYD_SH19_OUT.txt)
chunk3Shot('SH19','line:17.start','line:17.end','FLASHBACK_ROCK',[[-12,2.8,-29.5],[-2,1.4,-2]],[[-13,2.8,-28],[-7,0.2,-12]],46)
World: pos [1188,2.8,-29.5] → [1198,1.4,-2]; target
[1187,2.8,-28] → [1193,0.2,-12]; fov 46. Design: the camera is
repositioned entirely — far west, looking diagonally north-east
across BOTH subjects, so the mayor's head stays whole through
the shot and the wave centre finishes in front of the camera
instead of behind it. Composition consequence (seat's own note
for the chunk-3 critic round): the flashback reads as a wide
diagonal two-subject framing (mayor small, ~73px head) rather
than Qwen's close push — the coded gate is the judge at this
stage.

Seat's predicted readings (empirical ease; audit governs):
- F1367 face: PASS — 71.2px, face 14.7° (3D), margins +11.5°.
- F1410 face: PASS — head FULLY in, 73.3px, face 15.8° (3D),
  nearest margin +9.9°.
- F1428 wave: PASS — centre IN front, 1512.6px ≥ 120px.
- D1/D2: ZERO lines; D2-CLEAR 0 hits (~580 units clear).

## Part 2 — phase-36 micro-probe control (option A, dispatcher's adoption)
Phase 36 established that SH18's window renders an EMPTY world
pass (background + caption only) while SH17/SH24 windows render
fully on the same tree. In this phase EVERY still — the three
SH19 stills (F1367/F1410/F1428) plus one extra control dispatch
of F1231 (SH17's last frame, t=41.03) on the applied tree — is
also read as evidence on the window question: for each still,
report explicitly whether the world geometry renders (set
pieces / props / characters present) or the frame is
background+caption only. F1231 tests whether the measure_wave
init build renders inside SH17's frustum. These world-pass
readings are recorded in the phase-37 record as phase 36's
option-(A) evidence, separate from the SH19 verdict itself.

Judgement proceeds: staging audit + D1/D2 audit → fleet
re-probes of F1367/F1410/F1428 + control F1231 → pixel
measurements + driver eye (the eye is a real gate — phases
29/32/33's lesson: the coded PASS must be confirmed in the
rendered stills) → verdict committed.
