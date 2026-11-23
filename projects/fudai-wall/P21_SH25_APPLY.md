# PHASE 21 · SH25 CAMERA (F1944 sunbeam centre / F1953 villagers occupancy) — APPLICATION RECORD

## Previous verdict this application cites (hard-gate requirement)
Commit `d80e00f` — phase-20 cause 14 VERDICT: CLOSED (SH20 camera
residuals); the tree stands at the last judged state (HEAD `d4bf291`
= that verdict + the phase-20 SH25 brief-prep commit). No judgement
is pending when this fires.

## Delivery
Browser-seat candidate under phase-14 queue step 5 (SH20–SH26 camera
causes belong to the Hydrogen browser seat, phase-14 dispatcher
ruling). Seat: **Hydrogen** (Gemini Neon, Task mode;
gemini.google.com, nooaar343@gmail.com), session run by Layla
2026-11-23 11:05–11:14 EET. Brief: `P20_HYD_SH25_BRIEF.md`.
Verbatim seat output: `P20_HYD_SH25_OUT.txt` (same folder). The
driver applies the candidate VERBATIM — no iteration, no
hand-authored correction. **NO LOCAL RENDERS. Colab LOCKED. SH26's
line is DO-NOT-TOUCH (re-measured fully passing, phase 17).**

## The cause (ONE mechanism: SH25's camera looks steeply DOWN at the
## villagers from y ≈ 23 — the sunbeam centre rides far above the aim
## line and falls out of the top of the frame at fraction 0.42, while
## the villagers read small from ≈28 deep at fraction 0.84)
Measured baseline (driver's own audit runs on HEAD `d4bf291`,
reproducing the brief's baseline exactly):
- F1944 (t=64.80) FAIL: sunbeam_sh25 2522px but centre OUT of
  frustum (size ≥ 400px already; only the centre is out).
- F1953 (t=65.10) FAIL: villagers occupancy 170px, corners 8/8
  (centre in ✓, corners ✓; height(2) = 170px < 230px threshold —
  only the size is short; forward depth ≈28.2).
- D2-CLEAR: no hit on SH25 (FAIL (2) = SH13 + SH16 only).
- Chunk 3 staging 27/40 PASS (FAIL 13/40); chunk 2 untouched.

Current line (film.js):
chunk3Shot('SH25','line:23.start','line:23.end','COAST_WALL',[[0,19.6,1],[0,3.5,22]],[[0,23.5,5],[0,2.5,24]],46)

## Candidate (Hydrogen seat, verbatim)
chunk3Shot('SH25','line:23.start','line:23.end','COAST_WALL',[[0,19.6,2],[0,22,24]],[[0,19.6,6],[0,5,22]],[48,30])
World: pos [0,19.6,-14] → [0,19.6,-10]; target [0,22,8] → [0,5,6];
fov 48 → 30. Design: a LEVEL camera at constant y=19.6 (exactly the
loader's lowCams floor on this shot, so no unexpected lift); the aim
swings from the sunbeam down to the villagers while the fov narrows
48→30, buying the villagers' pixel size.

## Seat's predicted readings (to be judged against the audit, line by line)
- F1944 sunbeam: PASS — centre IN frustum (off-axis 14.42° within
  ±18.26° vertical at the eased fraction); 3140px ≥ 400px.
- F1953 villagers: PASS — centre in (off-axis 9.18°); 290px ≥ 230px;
  corners 8/8.
- D2-CLEAR / solids: PASS — path stays y=19.6 (>18) and
  z∈[−14,−10], clearing the seawall solid by ≥1.6 in y and ≥1.425
  in z.
- No other moment changes; SH26 untouched.

## Judgement chain (hard gate)
Apply verbatim → `node --check` → staging audit (F1944/F1953 +
full-output diff vs baseline: no other moment may change) → D1/D2
audit → if the audit's readings match the seat's predictions (both
moments PASS, D2-CLEAR clean): fleet re-probe of frames 1944, 1953
→ pixel measurement + driver eye on the stills → verdict committed.
If readings disagree, park per precedent and report — the driver
does NOT iterate the camera.
