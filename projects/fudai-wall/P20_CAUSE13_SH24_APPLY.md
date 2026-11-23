# PHASE 20 · CAUSE 13 (SH24 camera + wave crest, thesis frame) — APPLICATION RECORD

## Previous verdict this application cites (hard-gate requirement)
Commit `a322dfb` — phase-19 ruling 1 VERDICT: CLOSED (F1647 case
amended); the tree stands at the last judged state. No judgement is
pending when this fires.

## Delivery
Browser-seat candidate under phase-14 queue step 5 (SH20–SH26 camera
causes belong to the Hydrogen browser seat, phase-14 dispatcher
ruling). Seat: **Hydrogen** (Gemini Neon, Task mode;
gemini.google.com, nooaar343@gmail.com), session run by Layla
2026-11-23 10:41–10:47 EET. Brief: `P17_HYD_SH24_BRIEF.md`. Verbatim
seat output: `P17_HYD_SH24_OUT.txt` (same folder). The driver applies
the candidate VERBATIM — no iteration, no hand-authored correction.
**NO LOCAL RENDERS. Colab LOCKED.**

## The cause (ONE mechanism: SH24's camera aims along the wave face,
## so the wave centre leaves the frame and the wall top — the thesis
## frame's second subject — is never in frame)
Measured baseline (driver's own audit runs on HEAD `a322dfb`):
- F1863 (t=62.10) PASS: spray_hero_sh24 662px in frustum (threshold
  260px) — INVARIANT.
- F1896 (t=63.20) FAIL: wave_hero_sh24 3187px but centre OUT of
  frustum (size ≥ 500px already; only the centre is out).
- F1908 (t=63.60) FAIL: crest check — crest 17.50 ≤ 17.50 ✓; wall
  top 18.00 ✓; wall-top [0,18,-16] in frame: NO ✗ (framing only).
- D2-CLEAR: no hit on SH24 (FAIL (2) = SH13 + SH16 only).
- Chunk 3 staging 22/40 PASS (FAIL 18/40); chunk 2 untouched.

Current line (film.js):
chunk3Shot('SH24','line:22.start','line:22.end','COAST_WALL',[[24,19.5,-26],[0,14.5,-16.8]],[[15,18.8,-22.5],[0,17.2,-16.8]],[40,28])

## Candidate (Hydrogen seat, verbatim)
chunk3Shot('SH24','line:22.start','line:22.end','COAST_WALL',[[10,20.5,-50],[0,11,-14]],[[6,19.5,-44],[0,8,-10]],[42,48])
World: pos [10,20.5,-66] → [6,19.5,-60]; target [0,11,-30] →
[0,8,-26]; fov [42,48]. Design: a high, far-seaward camera looking
back at the coast — wave centre, spray, and the wall-top point all
inside one wide frustum.

## Seat's predicted readings (to be judged against the audit, line by line)
Checked under BOTH outCubic and linear sampling — both pass:
- F1863 spray: PASS — 386px (outCubic) / 357px (linear) ≥ 260px;
  off-axis 12.24°; NDC (+0.190, +0.533).
- F1896 wave: PASS — centre IN frustum; 1260px / 1213px ≥ 500px;
  off-axis 17.40°; NDC (+0.168, −0.721).
- F1908 crest: PASS — crest 17.50 ≤ 17.50 ✓; wall top 18.00 ✓;
  topIn YES (off-axis 16.63°; NDC (−0.164, +0.668)).
- D2-CLEAR / solids: PASS — path x∈[6,10], y∈[19.5,20.5],
  z∈[−66,−60]; ≥1.5 units above the seawall top plane, ≥43 units
  seaward of its face, clear of the wave solid by ≥2.0 units above.
- No other moment changes.

## Judgement chain (hard gate)
Apply verbatim → `node --check` → staging audit (F1863/F1896/F1908 +
full-output diff vs baseline: no other moment may change) → D1/D2
audit → if the audit's readings match the seat's predictions (all
three moments PASS, D2-CLEAR clean): fleet re-probe of frames 1863,
1896, 1908 → pixel measurement + driver eye on the stills (thesis
frame F1908: is the dry margin between crest and wall top VISIBLE?)
→ verdict committed. If readings disagree, park per precedent and
report — the driver does NOT iterate the camera.
