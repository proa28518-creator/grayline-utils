# HYDROGEN SEAT — BRIEF · phase 17 · cause 11: SH22 camera + the SH21→SH22 match-cut

You are the Hydrogen build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). You authored the staging for shots SH20–SH26
of this film (chunk 3b), including SH22's camera and the engineered
SH21→SH22 match-cut. You AUTHOR the fix; the driver applies your
values verbatim and judges them with the project's measured audits.
RULES §3: one cause, one change. §4: faces within 60°, whole head in
frame, never cut by the edge; sampled fov ∈ [24,50]; camera never
inside a solid. **NO LOCAL RENDERS** — you propose numbers only; the
audits are the ground truth (the loader intervenes on authored
cameras — lowCams/autoMove plus an outCubic push ease — so only
audit readings count; a hand projection the audit does not reproduce
is worth nothing — work from the measured readings below).

## Previous verdict this brief cites (hard-gate requirement)
Commit `2cc52dc` — phase-16 cause 4 (SH13, Qwen seat) judged and
parked; the tree stands at the last judged state (`0b5b45d` scene
state). Phase-14 dispatcher ruling: SH20–SH26 camera causes belong
to the Hydrogen browser seat. No judgement is pending on THIS cause;
this brief may fire. (Numbering note: the phase-13 queue listed this
cause as item 11 — SH22 + match-cut — unchanged.)

## The camera model (exact semantics)
`chunk3Shot(id, t0, t1, place, [fromPos, fromTarget], [toPos, toTarget], fov)`:
pos/target are OFFSETS from the place anchor; the camera pushes
from→to across the shot (moment fraction = (t − t0)/(t1 − t0),
linear fraction quoted below; the audit samples the loader's eased
camera); fov is a number or [from,to]. Anchor COAST_WALL = world
[0,0,-16]; world = offset + [0,0,-16] for BOTH pos and target.
Current line (verbatim):
chunk3Shot('SH22','line:20.start','line:20.end','COAST_WALL',[[0,16.75,14],[0,16.75,1.5]],[[6,19.2,20],[0,17.5,0]],[36,42])
World: pos [0,16.75,-2] → [6,19.2,4]; target [0,16.75,-14.5] → [0,17.5,-16].
Shot span: t 54.88–57.57. Frame: portrait 1080×1920; horizontal
half-angle = atan(tan(fov/2) × 1080/1920). The audit's size measure
is `height(size, p) = 2·atan(size/(2·depth)) / (fov in rad) × 1920`,
where depth is the point's forward-axis distance from the camera.

## Measured baseline (driver's own audit runs on HEAD 2cc52dc — restate these in your reply before proposing)
- F1647 (t=54.90, fraction 0.01) **FAIL**: seawall 183px, centre OUT of frustum. (The chunk-3 prop check: the prop's centre point must be in frustum AND `height(size[1], centre)` ≥ threshold. For id `seawall` the audit's size table has no entry, so size = [1,1,1] — it measures a **1-unit height at the seawall's base centre [0,0,-16]**, threshold **400px**.)
- F1647 rider — the match-cut **FAIL** on the SH22 side (exact definition below): readings **0.062 / 0.322** (target +0.062 on both). The SH21 side already reads exactly 0.062.
- F1677 (t=55.90, fraction 0.38) **FAIL**: pour_sh22 155px in frustum. (Prop check on centre [0,17,-16], size [12,1,3.2] → 1-unit height, threshold **180px**.)
- F1716 (t=57.20, fraction 0.86) **PASS**: workers body 260px, corners 8/8 (threshold 240px). Invariant — must stay PASS.
- D2-CLEAR: **no hit on SH22** (the audit's only D2-CLEAR hits are SH13 + SH16, other causes). The staging audit also flags any sampled camera inside a solid (solids include the seawall box: centre [0,9,-16], size [90,18,1.15]). Your new path must stay clear of every solid at every moment.
- No other moment may change (chunk 3 stands at 19/40; chunk 2 untouched).

## The match-cut check — exact definition (from tools/audit_staging.mjs; it is printed on both the F1635 and F1647 lines)
- SH21 side: the frame is built from **SH21's camera at SH21's t1** (its TO pose); the point is `pencil_mark_sh21.at` = world [1800,1.62,-1.55]. NDC_y = 1 − (screen y)/960. This side currently reads **0.062 exactly** — SH21's line is NOT part of this cause and must not change.
- SH22 side: the frame is built from **SH22's camera at SH22's t0** (its FROM pose, before any push); the point is the seawall top at SH22's start: `[seawall.at[0], h(t0), seawall.at[2]]` = **[0,17,-16]** (your own hero keys set h = 17 at line:20.start, rising 17.5 @55.9 → 18 @57.1). This side currently reads **0.322**.
- **PASS iff |n1 − 0.062| < 0.02 AND |n2 − 0.062| < 0.02.** So the whole match-cut half of this cause is one constraint on SH22's FROM pose alone: from that pose, the wall-top point [0,17,-16] must project to NDC_y +0.062 ± 0.02 (just above frame centre).

## Staging geometry (world; camera only — move nothing else)
- seawall: at [0,0,-16], w 90, h keys: 17 @line:20.start → 17.5 @55.9 → 18 @57.1 → 18 @line:23.end. Base centre (F1647's point): [0,0,-16]. Top point at SH22 start (match-cut): [0,17,-16].
- pour_sh22 (concrete_pour): at [0,17,-16], size [12,1,3.2], progress 0→1 across the shot. Its centre is the same point as the wall top at shot start.
- workers: on the wall top — place keys [0,·,-15.8] with y 17 @line:20.start → y 18 @57.10; look [0,17.5,-4] (COAST_WALL+[0,17.5,12]). Body box at F1716: centre [0,19,-15.8], size [1,2,.6].
- pencil_mark_sh21 (context only): at [1800,1.62,-1.55] in ROOM; SH21's TO pose already satisfies its side of the cut.

## The measured tension (state it back in your reply; do not silently trade)
F1647 and the match-cut rider are BOTH evaluated at SH22's start pose (F1647 at fraction 0.01, the cut at t0 exactly), and they pull against each other through the audit's 1-unit proxy: the 400px reading forces the wall-base point's forward depth ≲ 11.5 (at fov 24; ≲ 7.6 at fov 36; ≲ 5.5 at fov 50), while the cut pins the wall-top point — 17 units directly above the base point — at NDC_y +0.062 ± 0.02 from the same pose. Your arithmetic must show both readings from ONE from-pose, together with F1677's mid-shot pour reading and F1716's invariant. If you judge the four unsatisfiable together, say so with the measured conflict per reading — do not silently trade one against another.

## Your task
Propose ONE new SH22 camera line (COAST_WALL offsets, fov ∈ [24,50]) satisfying ALL of: F1647 seawall centre in frustum with the 1-unit height ≥ 400px; the match-cut SH22 side at NDC_y +0.062 ± 0.02 (SH21 side untouched); F1677 pour ≥ 180px in frustum; F1716 workers body still PASS; no D2-CLEAR / camera-inside hit; no other moment changed.

## Reply format (exact)
1. BASELINE RESTATED: the readings above (F1647 + the cut's two numbers, F1677, F1716, D2-CLEAR), in your own numbers.
2. CANDIDATE: the full replacement chunk3Shot line, verbatim, ready to paste.
3. PREDICTED READINGS: per check (F1647 / match-cut SH22 side / F1677 / F1716 + D2-CLEAR): the interpolated camera pos + target AT that moment (for the cut: the FROM pose itself), the forward UNIT vector, each checked point's off-axis angle in degrees computed from NORMALIZED vectors (show the dot product), its projected size in px by the audit's height formula, and for the cut the point's NDC_y computed as 1 − (screen y)/960 with the screen projection shown.
Nothing else. Do not claim you ran anything.
