# HYDROGEN SEAT — BRIEF · phase 17 · cause 14: residuals — SH20 camera (F1497 / F1518 / F1542)

You are the Hydrogen build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). You authored the staging for shots SH20–SH26
of this film (chunk 3b). You AUTHOR the fix; the driver applies your
values verbatim and judges them with the project's measured audits.
RULES §3: one cause, one change — this brief is ONE shot's camera
(SH20); its three failing moments are one cause. §4: faces within
60°, whole head in frame, never cut by the edge; sampled fov ∈
[24,50]; camera never inside a solid. **NO LOCAL RENDERS** — you
propose numbers only; the audits are the ground truth (the loader
intervenes on authored cameras — lowCams/autoMove plus an outCubic
push ease — so only audit readings count; a hand projection the
audit does not reproduce is worth nothing — work from the measured
readings below).

## Previous verdict this brief cites (hard-gate requirement)
Commit `2cc52dc` — phase-16 cause 4 (SH13, Qwen seat) judged and
parked; the tree stands at the last judged state (`0b5b45d` scene
state). Phase-14 dispatcher ruling: SH20–SH26 camera causes belong
to the Hydrogen browser seat. No judgement is pending on THIS cause;
this brief may fire.

## Scope — what is IN this cause and what is NOT
- **IN: SH20's three failing moments** — F1497, F1518, F1542 (below).
  F1518/F1542 were forwarded here by phase-12 cause 3 (cast place
  keys), which restored your verbatim place/look keys and correctly
  did not retime them; the remaining fault is the camera.
- **NOT IN: SH26 — re-measured on the current tree, it FULLY PASSES**
  and is excluded: F1980 mocker_a face PASS (angle 24.4°, head in,
  298px ≥ 240); F2001 gravestone_sh26 PASS (408px ≥ 300, in
  frustum); F2022 wall_distant_sh26 PASS (644px ≥ 450, in frustum).
  Do not touch SH26's line.
- SH25's failing moments (F1944, F1953) are a separate camera cause,
  not this brief. No other moment may change (chunk 3 stands at
  19/40; chunk 2 untouched).

## The camera model (exact semantics)
`chunk3Shot(id, t0, t1, place, [fromPos, fromTarget], [toPos, toTarget], fov)`:
pos/target are OFFSETS from the place anchor; the camera pushes
from→to across the shot (moment fraction = (t − t0)/(t1 − t0),
linear fraction quoted below; the audit samples the loader's eased
camera); fov is a number or [from,to]. Anchor FLASHBACK_ROCK =
world [1200,0,0]; world = offset + [1200,0,0] for BOTH pos and target.
Current line (verbatim):
chunk3Shot('SH20','line:18.start','line:18.end','FLASHBACK_ROCK',[[-2.8,1.75,2.4],[-.4,1.68,-1.6]],[[-1.6,1.82,3],[.65,1.78,-1.2]],36)
World: pos [1197.2,1.75,2.4] → [1198.4,1.82,3]; target [1199.6,1.68,-1.6] → [1200.65,1.78,-1.2].
Shot span: t 48.36–51.61. Frame: portrait 1080×1920; horizontal
half-angle = atan(tan(fov/2) × 1080/1920). The audit's size measure
is `height(size, p) = 2·atan(size/(2·depth)) / (fov in rad) × 1920`,
where depth is the point's forward-axis distance from the camera.
Face check (audit): head = cast pos + [0,1.9,0]; PASS iff the angle
between the member's face direction (from his look keys) and the
direction head→camera is ≤ 60°, the head sphere (r 0.5) is FULLY in
frame, no solid occludes the camera→head segment, and
height(1, head) ≥ the moment's threshold. Body check: box centred
at pos + [0,1,0], size [1,2,.6]; PASS iff centre in frame, no
occluder, height ≥ threshold, and ≥ 4/8 corners in frame.

## Measured baseline (driver's own audit runs on HEAD 2cc52dc — restate these in your reply before proposing)
- F1497 (t=49.90, fraction 0.47) **FAIL**: carved_line_sh20 151px but centre OUT of frustum. (Prop check: centre [1199.6,1.65,-1.85] must be IN frustum AND height(0.24, centre) ≥ 120px — the size already reads 151px; only the centre is out.)
- F1518 (t=50.60, fraction 0.69) **FAIL**: mayor_young face — angle **86.4°** (limit 60°), head OUT, 634px (threshold 350px; the size alone passes).
- F1542 (t=51.40, fraction 0.94) **FAIL**: mayor_young body 1255px (threshold 600px ✓) but corners **3/8** (needs ≥ 4/8, centre in, unoccluded).
- D2-CLEAR: **no hit on SH20** (the audit's only D2-CLEAR hits are SH13 + SH16, other causes). Your new path must stay clear of every solid at every moment.

## Staging geometry (world; camera only — move nothing else; his keys are yours verbatim and stay)
- mayor_young: base [1200,0,2]; place key @line:18.start → **[1200.9,0,-1.10]** (held all shot). Head centre: **[1200.9,1.9,-1.10]**.
- His look keys: @line:17.start → [1196.5,-1,-12]; @line:18.start → [1198.6,1.68,-0.60]; **@t=50.60 → the carved-line point [1199.6,1.65,-1.85]**. So at F1518 his face turns DOWN toward the line he is carving: face direction ≈ from head [1200.9,1.9,-1.10] toward [1199.6,1.65,-1.85] (west, slightly down, north). The current camera sits SOUTH-west of him (z ≈ +2.4…+3 against his head z −1.10) — behind his turned face; that is the measured 86.4°. The camera must be on the side he looks toward (north-west of the head, z < −1.10) and low enough to meet the down-look, while keeping the whole head sphere in frame at ≥ 350px (forward depth ≲ 8.7 at fov 36).
- carved_line_sh20: at [1199.6,1.65,-1.85], size [3.6,.24,.08]; reveal keys 0.35 @line:18.start → 1 @line:18.end. It is 1.3 west / 0.75 north of his head, at his hand height.
- Body box at F1542: centre [1200.9,1,-1.10], size [1,2,.6] — corners 3/8 means the frame edge cuts the box at the near-TO pose; the fix must hold the whole body box wider in frame at fraction 0.94 without losing F1518's face geometry at 0.69 or the carved line at 0.47.

## Your task
Propose ONE new SH20 camera line (FLASHBACK_ROCK offsets, fov ∈ [24,50]) satisfying ALL of: F1497 carved-line centre IN frustum with height ≥ 120px; F1518 face angle ≤ 60° with the head sphere fully in frame and height ≥ 350px; F1542 body corners ≥ 4/8 with centre in and height ≥ 600px; no D2-CLEAR / camera-inside hit; no other moment changed. If you judge the three unsatisfiable together, say so with the measured conflict per reading — do not silently trade one against another.

## Reply format (exact)
1. BASELINE RESTATED: the readings above (F1497, F1518, F1542, D2-CLEAR), in your own numbers.
2. CANDIDATE: the full replacement chunk3Shot line, verbatim, ready to paste.
3. PREDICTED READINGS: per check (F1497 / F1518 / F1542 + D2-CLEAR): the interpolated camera pos + target AT that fraction, the forward UNIT vector, each checked point's off-axis angle in degrees computed from NORMALIZED vectors (show the dot product), its projected size in px by the audit's height formula, for F1518 the face angle against his t=50.60 look direction and the head sphere's angular margin to the nearest frame edge, and for F1542 the body-box corner count your projection predicts.
Nothing else. Do not claim you ran anything.
