# PHASE 20 · CAUSE 14 (SH20 camera residuals: F1497 / F1518 / F1542) — APPLICATION RECORD

## Previous verdict this application cites (hard-gate requirement)
Commit `b70c918` — phase-20 cause 13 VERDICT: CLOSED (SH24 camera +
crest); the tree stands at the last judged state. No judgement is
pending when this fires.

## Delivery
Browser-seat candidate under phase-14 queue step 5 (SH20–SH26 camera
causes belong to the Hydrogen browser seat, phase-14 dispatcher
ruling). Seat: **Hydrogen** (Gemini Neon, Task mode;
gemini.google.com, nooaar343@gmail.com), session run by Layla
2026-11-23 10:47–10:53 EET. Brief: `P17_HYD_RESIDUALS_BRIEF.md`.
Verbatim seat output: `P17_HYD_SH20_OUT.txt` (same folder). The
driver applies the candidate VERBATIM — no iteration, no
hand-authored correction. **NO LOCAL RENDERS. Colab LOCKED. SH26's
line is DO-NOT-TOUCH (re-measured fully passing, phase 17).**

## The cause (ONE mechanism: SH20's camera sits south-west of
## mayor_young — behind the face he turns down toward the carved
## line — so the line leaves the frame, the face reads 86.4°, and
## the body box is edge-cut at the near-TO pose)
Measured baseline (driver's own audit runs on HEAD `b70c918`,
reproducing the brief's baseline exactly):
- F1497 (t=49.90) FAIL: carved_line_sh20 151px but centre OUT of
  frustum (size ≥ 120px already; only the centre is out).
- F1518 (t=50.60) FAIL: mayor_young face angle 86.4° (limit 60°),
  head OUT, 634px (threshold 350px; size alone passes).
- F1542 (t=51.40) FAIL: mayor_young body 1255px (threshold 600px ✓)
  but corners 3/8 (needs ≥ 4/8).
- D2-CLEAR: no hit on SH20 (FAIL (2) = SH13 + SH16 only).
- Chunk 3 staging 24/40 PASS (FAIL 16/40); chunk 2 untouched.

Current line (film.js):
chunk3Shot('SH20','line:18.start','line:18.end','FLASHBACK_ROCK',[[-2.8,1.75,2.4],[-.4,1.68,-1.6]],[[-1.6,1.82,3],[.65,1.78,-1.2]],36)

## Candidate (Hydrogen seat, verbatim)
chunk3Shot('SH20','line:18.start','line:18.end','FLASHBACK_ROCK',[[-4.2,1.6,-1.55],[.25,1.55,-1.55]],[[-4.7,1.55,-1.65],[.65,1.4,-1.25]],40)
World: pos [1195.8,1.60,-1.55] → [1195.3,1.55,-1.65]; target
[1200.25,1.55,-1.55] → [1200.65,1.40,-1.25]; fov 40. Design: the
camera moves to the north-west of mayor_young — the side his face
turns toward as he carves — low, looking east along the rock face.

## Seat's predicted readings (to be judged against the audit, line by line)
- F1497 carved line: PASS — centre IN frustum (off-axis 7.19°);
  157px ≥ 120px.
- F1518 face: PASS — face angle 24.93° ≤ 60°; head sphere fully in
  (margins 5.02° horiz / 9.75° vert); 490px ≥ 350px.
- F1542 body: PASS — centre in; 966px ≥ 600px; corners 8/8 ≥ 4/8.
- D2-CLEAR / solids: PASS — path stays north-west of the mayor, in
  front of the rock plane.
- No other moment changes; SH26 untouched.

## Judgement chain (hard gate)
Apply verbatim → `node --check` → staging audit (F1497/F1518/F1542 +
full-output diff vs baseline: no other moment may change) → D1/D2
audit → if the audit's readings match the seat's predictions (all
three moments PASS, D2-CLEAR clean): fleet re-probe of frames 1497,
1518, 1542 → pixel measurement + driver eye on the stills → verdict
committed. If readings disagree, park per precedent and report —
the driver does NOT iterate the camera.
