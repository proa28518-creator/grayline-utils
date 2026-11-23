# QWEN SEAT — BRIEF · phase 23 · cause 4, CORRECTIVE round 2: SH13 camera — hold the near-miss lane, restore the hand tip

You are the Qwen build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). You authored the staging for shots SH13–SH19
of this film (chunk 3a), including SH13, and your candidate #1 for
this cause was applied verbatim and judged in phase 16 (below). This
is the corrective round. You AUTHOR the fix; the driver applies your
values verbatim and judges them with the project's measured audits.
RULES §3: one cause, one change. §4: faces within 60°, whole head in
frame, never cut by the edge; sampled fov ∈ [24,50]; camera never
inside a solid. **NO LOCAL RENDERS** — you propose numbers only; the
audits are the ground truth (the loader intervenes on authored
cameras — lowCams/autoMove plus an outCubic push ease over the
camera span — so only audit readings count; a hand projection the
audit does not reproduce is worth nothing — work from the measured
readings below).

## Previous verdict this brief cites (hard-gate requirement)
Commit `21451c4` — phase-22 VERDICT: CLOSED (SH25 camera, corrective
round); the tree stands at the last judged state, HEAD `21451c4`.
Phase-14 dispatcher ruling: SH13–SH19 camera causes belong to the
Qwen browser seat (SH20–SH26 to Hydrogen). The judgement this round
corrects: phase 16, commit `2cc52dc` — your candidate #1 judged and
PARKED (readings below). No judgement is pending on THIS cause; this
brief may fire.

## The camera model (exact semantics)
`chunk3Shot(id, t0, t1, place, [fromPos, fromTarget], [toPos, toTarget], fov)`:
pos/target are OFFSETS from the place anchor; the camera pushes
from→to across the shot (the audit samples the loader's eased
camera; moment fractions below are (t − t0)/(t1 − t0) on the shot
span); fov is a number or [from,to]. Anchor COAST_VILLAGE = world
[0,0,2]; world = offset + [0,0,2] for BOTH pos and target.
Current line (verbatim):
chunk3Shot('SH13','line:11.start','line:11.end','COAST_VILLAGE',[[-5.4,1.62,8.2],[-6,1.55,1.6]],[[-2,1.62,8.2],[-2.6,1.5,2.9]],40)
World: pos [-5.4,1.62,10.2] → [-2,1.62,10.2]; target [-6,1.55,3.6] → [-2.6,1.5,4.9].
Shot span: t 30.27–32.55. Frame: portrait 1080×1920; horizontal
half-angle = atan(tan(fov/2) × 1080/1920). The audit's size measure
is `height(size, p) = 2·atan(size/(2·depth)) / (fov in rad) × 1920`,
where depth is the point's forward-axis distance from the camera.
Check semantics: F933 is a point check (the hand-tip point must be
IN frustum). F942 is a prop check (centre in frustum AND
height(0.5, centre) ≥ 60px). F969 is a face check (PASS iff the
angle between mayor_old's face direction — from his look keys — and
the direction head→camera is ≤ 60°, the head sphere r 0.5 is FULLY
in frame, no solid occludes the segment, and height(1, head) ≥
120px).

## The D1/D2 hard constraints (every camera brief carries these since phase 21)
- Both ends' WORLD target y ∈ [0, 19.5] (the D2 target-sanity bound; the wall is 18 D).
- Both ends' WORLD targets inside at least one place's bounds (COAST_VILLAGE bounds: x ∈ [-30,30], z ∈ [-10,14]).
- The D1/D2 audit after your change must show NO new lines. For THIS cause the expected result is D1/D2 **FAIL (1)** — SH13's own D2-CLEAR line clears (that is the cause's purpose) and SH16's line remains; anything else is a regression.
- No D2-CLEAR hit on SH13: the sampled camera path must stay clear of every solid at every moment (the town hall box: x ∈ [-4.5,4.5], y ∈ [0,6.4], z ∈ [9.5,18.5]; plus the village houses and the seawall in the audit's solids list).

## Measured baseline (driver's own audit runs on HEAD 21451c4 — restate these in your reply before proposing)
Current line (lane A — the original):
- D2-CLEAR **FAIL**: the camera path intersects the town hall solid. The audit's sampled cameras sit at world z=10.2, y=1.62, x from -3.47 to -2.12 — inside the box's z-range, below its top, inside its x-range.
- F933 (t=31.10, fraction 0.364) **PASS**: mocker_b hand tip in frustum. (Invariant on this lane — and the point every southern lane has lost.)
- F942 (t=31.40, fraction 0.496) **FAIL**: box_sh13 195px out of frustum.
- F969 (t=32.30, fraction 0.890) **FAIL**: mayor_old face angle 61.5° (limit 60°), head out 343px.
- The audit's sampled cameras under the current line: F933 pos [-3.47,1.62,10.20] target [-4.07,1.52,4.34]; F942 pos [-2.99,1.62,10.20] target [-3.59,1.51,4.52]; F969 pos [-2.12,1.62,10.20] target [-2.72,1.50,4.85]; fov 40 throughout.
- No other moment may change (chunk 3 stands at 29/40; chunk 2 untouched).

## The three measured lanes (the whole evidence for this cause — your round starts from lane B, NOT from zero)
- **Lane A — the original (above):** D2-CLEAR FAIL · F933 PASS · F942 FAIL 195px out · F969 FAIL 61.5°, head out 343px. (Authored pos world z = 10.2.)
- **Lane B — the phase-12 near-miss (Codex seat, driver-verified before revert; the standing candidate state):** static pos offset [4.8,5,-8] (world [4.8,5,-6]); targets offsets [4,2,-3] → [-4.6,1.9,2.2] (world [4,2,-1] → [-4.6,1.9,4.2]); fov 50. Measured: D2-CLEAR **CLEARED** · F942 **PASS** (box 75px, in frustum) · F969 **PASS** (face 47.9°, head in, 165px) · F933 **FAIL** (hand tip out of frustum).
- **Lane C — your candidate #1 (phase 16, applied verbatim, judged, reverted):** static pos offset [4.8,5,-16] (world [4.8,5,-14]); targets and fov as lane B. Measured: D2-CLEAR **CLEARED** · F933 **FAIL**, hand tip out (you predicted PASS — hand–mayor separation 28.6° vs the 39.65° half-angle, both loader lanes checked; the audit's loader model did not reproduce your hand projection) · F942 **FAIL**, box 53px in frustum (in, but below the pass reading — lane B passed this check at 75px from world z −6; the deeper pullback shrank it under) · F969 **FAIL**, face **66.3°**, head IN 113px (your ≈41° two-point trend extrapolation was falsified; your head-margin prediction ≈117px was near-exact).
- **The measured law of this cause:** face angles across authored world pos z are 10.2 → 61.5°, −6 → 47.9°, −14 → 66.3° — **non-monotonic in pullback; the loader's re-lane is not a linear function of z.** Do not extrapolate the face from a trend. The binding unsolved point across every southern lane is F933's hand tip at [4,1.2,-1].

## Staging geometry (world coordinates; do NOT move any of it — camera only)
- mayor_old: starts at [-6,0,3]; walks from line:11.start at speed 1 along path [x,z]: [-6,3] → [-5.7,4.4] → [-2.6,4.8] → [6.5,5.2]. Head centre ≈ y 1.68. His look target (from line:11.start) is [-2,1.5,11] — he faces toward +x/+z. At F969 (t=32.30) he is ≈1.3 units along the path, near [-5.75,~4.3].
- box_sh13: at [-6,1.15,3.45] at line:11.start, moving linearly to [-2.6,1.15,5.25] at line:11.end. At F942 (t=31.40) it is ≈ [-5.4,1.15,3.8].
- mocker_b: stands at [4,0,-1] (ry 180); the checked point is his hand tip (raised hand, ≈ [4,1.2,-1]).
- The square's other cast stands around COAST_VILLAGE offsets x -8..10, z 0..6 (world z 2..8).
- Town hall solid: x ∈ [-4.5,4.5], y ∈ [0,6.4], z ∈ [9.5,18.5].

## Your task
Propose ONE new SH13 camera line (COAST_VILLAGE offsets, fov ∈ [24,50]) that holds lane B's three gains AND restores F933: D2-CLEAR clear; F933 hand tip IN frustum; F942 box in frustum with height ≥ 60px; F969 face ≤ 60° with the head sphere fully in and ≥ 120px; both D1/D2 target constraints above; no other moment changed. The natural shape (a suggestion, not a requirement): a MOVING camera whose FROM state sits closer to the hand side (east, toward mocker_b) so the hand tip is in frame early — F933 is at fraction 0.364 — drifting to lane B's TO state so F942 (0.496) and F969 (0.890) keep lane B's measured readings. Remember the push is eased (outCubic) and sampled by the audit: by F933 the camera is already well into its push, so design the FROM/TO pair against the eased sample, not the linear one. If you judge the four readings unsatisfiable together, say so with the measured conflict per reading — do not silently trade one against another.

## Reply format (exact)
1. BASELINE RESTATED: lane A's four readings + lane B's four + lane C's four, in your own numbers, including the non-monotonic face law.
2. CANDIDATE: the full replacement chunk3Shot line, verbatim, ready to paste.
3. PREDICTED READINGS: per check (D2-CLEAR / F933 / F942 / F969 + the two D1/D2 target constraints at both ends): the interpolated camera pos + target AT that fraction, the forward UNIT vector, each checked point's off-axis angle in degrees computed from NORMALIZED vectors (show the dot product), its projected size in px by the audit's height formula, and for F969 the face angle against his look direction and the head sphere's angular margin to the nearest frame edge.
Nothing else. Do not claim you ran anything.
