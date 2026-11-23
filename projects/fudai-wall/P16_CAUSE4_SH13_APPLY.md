# PHASE 16 · CAUSE 4 (SH13 camera) — APPLICATION RECORD

## Previous verdict this application cites (hard-gate requirement)
Commit `0b5b45d` — phase-15 pixel-gate place-key fix CLOSED (the last
verdict in the serial chain). No judgement is pending when this fires.

## Delivery
Browser-seat candidate #1 under phase-14 queue step 5, delivered by
Layla. Seat: **Qwen4-Max** (chat.qwen.ai, Araby Soft), session run by
Layla 2026-11-23 09:23–10:07 EET. Full verbatim seat output with
arithmetic: `P14_QWEN_SH13_OUT.txt` (same folder). The driver applies
the candidate VERBATIM — no iteration, no hand-authored correction.
**NO LOCAL RENDERS. Colab LOCKED.**

## The cause (ONE mechanism: SH13's camera sits inside the town hall
## and mis-frames the box + the mayor's face)
Measured baseline (driver's own audit runs on HEAD `0b5b45d`):
- D2-CLEAR FAIL: shot 14 (SH13) camera path intersects town hall
  (D1/D2 total FAIL (2): SH13 + SH16).
- F933 (t=31.10) PASS: mocker_b hand tip in frustum — INVARIANT.
- F942 (t=31.40) FAIL: box_sh13 195px out of frustum.
- F969 (t=32.30) FAIL: mayor_old face 61.5° (limit 60°), head out 343px.
- Chunk 3 staging 19/40 PASS (21 FAIL).

Current line (film.js):
chunk3Shot('SH13','line:11.start','line:11.end','COAST_VILLAGE',[[-5.4,1.62,8.2],[-6,1.55,1.6]],[[-2,1.62,8.2],[-2.6,1.5,2.9]],40)

## Candidate (Qwen seat, verbatim — ONE change vs the phase-12 Codex
## near-miss: static pos offset z −8 → −16)
chunk3Shot('SH13','line:11.start','line:11.end','COAST_VILLAGE',[[4.8,5,-16],[4,2,-3]],[[4.8,5,-16],[-4.6,1.9,2.2]],50)

## Seat's predicted readings (to be judged against the audit, line by line)
- D2-CLEAR: PASS (static world pos [4.8,5,-14]; outside the hall box).
- F933: PASS (hand–mayor separation 28.6° < 39.65° horizontal half-angle;
  holds under the lowCams lane and under the authored-target lane).
- F942: PASS (box on the mayor axis, 2.0° separation; margin ≈51px —
  SMALLER than the near-miss's 75px).
- F969: PASS (face ≈41° by trend extrapolation from the two measured
  lanes — the seat flags this as extrapolation, not a run; head margin
  ≈117px).

## Judgement chain (hard gate)
Apply verbatim → `node --check` → staging audit (D2-CLEAR + F933/F942/
F969 + full-output diff vs baseline: no other moment may change) →
D1/D2 audit → fleet re-probe of frames 933, 942, 969 → pixel gate on
the probed stills → driver eye → verdict committed. If the audit
disagrees with any predicted reading, the audit alone judges; a failed
candidate returns to Layla for a corrective browser-seat round — the
driver does NOT iterate the camera.
