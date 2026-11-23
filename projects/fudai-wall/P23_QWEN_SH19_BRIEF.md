# HYDROGEN SEAT — BRIEF · phase 23 (re-addressed phase 25) · cause 10: SH19 camera — the mayor's whole head, then the old wave

You are the Hydrogen build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). The staging for shots SH13–SH19 of this film
(chunk 3a), including SH19, was authored by the **Qwen** seat — that
authorship credit stands; this cause was re-routed to you (phase-24
dispatcher ruling; see the AMENDMENT section at the end of this
brief). SH19 is the flashback: the young
mayor on the rock, the old wave behind him. You AUTHOR the fix; the
driver applies your values verbatim and judges them with the
project's measured audits. RULES §3: one cause, one change. §4:
faces within 60°, whole head in frame, never cut by the edge;
sampled fov ∈ [24,50]; camera never inside a solid. **NO LOCAL
RENDERS** — you propose numbers only; the audits are the ground
truth (the loader intervenes on authored cameras — lowCams/autoMove
plus an outCubic push ease — so only audit readings count; a hand
projection the audit does not reproduce is worth nothing — work from
the measured readings below).

## Previous verdict this brief cites (hard-gate requirement)
Commit `21451c4` — phase-22 VERDICT: CLOSED (SH25 camera, corrective
round); the tree stands at the last judged state, HEAD `21451c4`.
Phase-14 dispatcher ruling: SH13–SH19 camera causes belong to the
Qwen browser seat. No judgement is pending on THIS cause; this brief
may fire. (Queue note: this is phase-12 queue item 10 — SH19 camera.
Verified against the driver's own audit run on HEAD `21451c4`: SH19's
failing moments are F1410 + F1428; F1518 belongs to SH20, which is
CLOSED — it is not part of this cause.)

## The camera model (exact semantics)
`chunk3Shot(id, t0, t1, place, [fromPos, fromTarget], [toPos, toTarget], fov)`:
pos/target are OFFSETS from the place anchor; the camera pushes
from→to across the shot (the audit samples the loader's eased
camera; moment fractions below are (t − t0)/(t1 − t0) on the shot
span); fov is a number or [from,to]. Anchor FLASHBACK_ROCK = world
[1200,0,0]; world = offset + [1200,0,0] for BOTH pos and target.
Current line (verbatim):
chunk3Shot('SH19','line:17.start','line:17.end','FLASHBACK_ROCK',[[-2.5,.9,-21],[-2,1,-4]],[[-1,1.3,-16],[-4,1.2,-4]],46)
World: pos [1197.5,0.9,-21] → [1199,1.3,-16]; target [1198,1,-4] → [1196,1.2,-4].
Shot span: t 45.45–47.79. Frame: portrait 1080×1920; horizontal
half-angle = atan(tan(fov/2) × 1080/1920). The audit's size measure
is `height(size, p) = 2·atan(size/(2·depth)) / (fov in rad) × 1920`,
where depth is the point's forward-axis distance from the camera.
Check semantics: F1367/F1410 are face checks (PASS iff the angle
between mayor_young's face direction — from his look keys — and the
direction head→camera is ≤ 60°, the head sphere r 0.5 is FULLY in
frame, no solid occludes the segment, and height(1, head) ≥ the
moment's threshold: 45px at F1367, 55px at F1410). F1428 is a prop
check (centre in frustum AND height(8, centre) ≥ 120px).

## The D1/D2 hard constraints (every camera brief carries these since phase 21)
- Both ends' WORLD target y ∈ [0, 19.5] (the D2 target-sanity bound; the wall is 18 D).
- Both ends' WORLD targets inside at least one place's bounds (FLASHBACK_ROCK bounds: x ∈ [1160,1240], z ∈ [-30,20]).
- The D1/D2 audit after your change must return **exactly the baseline FAIL (2)** — the two D2-CLEAR lines (SH13 + SH16, other causes) and nothing else; no new D-line of any kind.
- No D2-CLEAR / camera-inside hit on SH19: the sampled camera path must stay clear of every solid at every moment (the audit's solids: town hall, village houses, neighbour houses, the seawall box centre [0,9,-16] size [90,18,1.15], the gateleaf when visible — none stands in the flashback place, but the path is checked against all of them).

## Measured baseline (driver's own audit runs on HEAD 21451c4 — restate these in your reply before proposing)
- F1367 (t=45.57, fraction 0.051) **PASS**: mayor_young face angle 8.1°, head in, 106px. Invariant — must stay PASS.
- F1410 (t=47.00, fraction 0.662) **FAIL**: mayor_young face angle 10.3° (fine), head **OUT**, 131px. (The angle and the size both pass; the head sphere is not FULLY in frame — §4's whole-head rule is the failing half.)
- F1428 (t=47.60, fraction 0.919) **FAIL**: wave_old_sh19 6216px out of frustum. (Prop check: centre [1191,-1.5,-17] must be IN frustum AND height(8, centre) ≥ 120px — the size already reads 6216px; only the centre is out. At the sampled F1428 camera (pos z −16.13) the wave centre (z −17) is BEHIND the camera.)
- D2-CLEAR: **no hit on SH19** (the audit's only D2-CLEAR hits are SH13 + SH16, other causes).
- The audit's sampled cameras under the current line: F1367 pos [1197.65,1.61,-20.51] target [1197.80,1.02,-4.00] fov 46; F1410 pos [1198.76,1.61,-16.78] target [1196.31,1.17,-4.00] fov 46; F1428 pos [1198.96,1.61,-16.13] target [1196.05,1.19,-4.00] fov 46. (Note: authored pos y 0.9→1.3 samples at 1.61 — lowCams lifts this shot's camera; authored ≠ sampled.)
- No other moment may change (chunk 3 stands at 29/40; chunk 2 untouched).

## Staging geometry (world; camera only — move nothing else; his keys are yours verbatim and stay)
- mayor_young: during line 17 he stands at his base [1200, 2] (x,z) — his place key lands at line:18.start (SH20), not in this shot. Head centre: [1200,1.9,2].
- His look keys: @line:17.start → [1196.5,-1,-12] (he looks west-north, down toward the shore); the next look key is @line:18.start — so at both F1367 and F1410 his face direction runs from his head toward [1196.5,-1,-12]. The face angle reads 8.1°/10.3° — the direction is NOT the problem; the head sphere's frame position is.
- wave_old_sh19: at FLASHBACK_ROCK+[-9,-1.5,-17] = [1191,-1.5,-17]; size [14,8,24] → the check measures an 8-unit height at its centre [1191,-1.5,-17], threshold 120px. Its h keys: 5 @line:17.start → 8 @line:17.end (advance 0 → 4.5); the checked centre does not move.
- The measured tension: the two subjects sit ~21 units apart across the camera's ground — the mayor's head at [1200,1.9,2] (south-east) and the wave centre at [1191,-1.5,-17] (north-west). The current push closes from z −21 toward z −16 while the target drifts west (x 1198 → 1196): the mayor's head slides out of the frame's edge by fraction 0.662, and by 0.919 the camera has pushed PAST the wave centre's z-plane, leaving it behind. The fix must hold the mayor's whole head sphere in frame at 0.662 AND finish with the wave centre in front of the camera and in frame at 0.919 — one continuous push, no solid entered.

## Your task
Propose ONE new SH19 camera line (FLASHBACK_ROCK offsets, fov ∈ [24,50]) satisfying ALL of: F1367 face still PASS; F1410 face angle ≤ 60° with the head sphere FULLY in frame and height ≥ 55px; F1428 wave centre IN frustum with height ≥ 120px; both D1/D2 target constraints above with D1/D2 returning exactly FAIL (2); no D2-CLEAR / camera-inside hit; no other moment changed. If you judge the three moments unsatisfiable together, say so with the measured conflict per reading — do not silently trade one against another.

## Reply format (exact)
1. BASELINE RESTATED: the readings above (F1367, F1410, F1428, D2-CLEAR), in your own numbers.
2. CANDIDATE: the full replacement chunk3Shot line, verbatim, ready to paste.
3. PREDICTED READINGS: per check (F1367 / F1410 / F1428 + the two D1/D2 target constraints at both ends + D2-CLEAR): the interpolated camera pos + target AT that fraction, the forward UNIT vector, each checked point's off-axis angle in degrees computed from NORMALIZED vectors (show the dot product), its projected size in px by the audit's height formula, and for F1367/F1410 the face angle against his look direction and the head sphere's angular margin to the nearest frame edge.
Nothing else. Do not claim you ran anything.

## AMENDMENT — phase 25 (2026-11-23): re-route to Hydrogen + COMPLETE D2-CLEAR SOLID SET + D1/D2 constraints in current form

**Seat (supersedes the phase-14 seat lines in the body):** this brief is
addressed to the **Hydrogen** browser seat (Gemini Neon, Task mode) per
Layla's phase-24 dispatcher ruling (recorded verbatim in RUN_RECORD
phase 24 — the Qwen seat stalled measurably on cause 5, ~90 minutes
with zero output; the remaining chunk-3 camera causes and item 17
moved to Hydrogen). The underlying staging (chunk 3a, SH13–SH19) was
authored by the Qwen seat; that credit stands — only the repair seat
changes.

**D1/D2 hard constraints — current form (binding; restates and
confirms the body's section):**
- Both ends' WORLD target y ∈ [0, 19.5] (the D2 target-sanity bound;
  the wall is 18 D).
- Both ends' WORLD targets inside at least one place's bounds.
- The D1/D2 audit after the change must return **exactly the baseline
  stated in the body, with NO new lines** of any kind. (The body's
  baseline is stated on HEAD `21451c4`; causes judged after this brief
  was written may have moved it — the driver re-states the live
  baseline in the session when this brief fires; the no-new-lines rule
  is what binds.)

**COMPLETE D2-CLEAR SOLID SET (the desk fix — read this before
proposing any camera):** extracted verbatim from
`tools/audit_d1_d2.mjs`, the audit that runs the D2-CLEAR check. The
audit tests **every shot from SH04 on** against **all 18 solids**, as
the straight world segment from the camera's FROM pos to its TO pos
(segment-vs-box; a segment touching a box fails). These 18 boxes are
the COMPLETE set — the seawall and the storeys are **not** D2-CLEAR
solids (they appear only as occluders in the staging audit, a
different check), and there is no gateleaf in this list. Where the
body above names a partial solids list, THIS section governs.

| # | solid | min [x, y, z] | max [x, y, z] |
|---|-------|---------------|----------------|
| 1 | town hall | [-4.5, 0, 9.5] | [4.5, 6.4, 18.5] |
| 2 | village house @-16,-3 | [-18.45, 0, -5.05] | [-13.55, 6, -0.95] |
| 3 | village house @-10,-4 | [-12.45, 0, -6.05] | [-7.55, 6, -1.95] |
| 4 | village house @-20,3 | [-22.45, 0, 0.95] | [-17.55, 6, 5.05] |
| 5 | village house @-14,7 | [-16.45, 0, 4.95] | [-11.55, 6, 9.05] |
| 6 | village house @-8,11 | [-10.45, 0, 8.95] | [-5.55, 6, 13.05] |
| 7 | village house @8,-4 | [5.55, 0, -6.05] | [10.45, 6, -1.95] |
| 8 | village house @14,-2 | [11.55, 0, -4.05] | [16.45, 6, 0.05] |
| 9 | village house @20,3 | [17.55, 0, 0.95] | [22.45, 6, 5.05] |
| 10 | village house @14,10 | [11.55, 0, 7.95] | [16.45, 6, 12.05] |
| 11 | village house @6,12 | [3.55, 0, 9.95] | [8.45, 6, 14.05] |
| 12 | neighbour house @585 | [582.55, 0, -4.05] | [587.45, 5.6, 0.05] |
| 13 | neighbour house @590 | [587.55, 0, -4.05] | [592.45, 5.6, 0.05] |
| 14 | neighbour house @595 | [592.55, 0, -4.05] | [597.45, 5.6, 0.05] |
| 15 | neighbour house @600 | [597.55, 0, -4.05] | [602.45, 5.6, 0.05] |
| 16 | neighbour house @605 | [602.55, 0, -4.05] | [607.45, 5.6, 0.05] |
| 17 | neighbour house @610 | [607.55, 0, -4.05] | [612.45, 5.6, 0.05] |
| 18 | neighbour house @615 | [612.55, 0, -4.05] | [617.45, 5.6, 0.05] |

(Generating rule in the source, for verification: the town hall is
fixed as above; each village house centre [hx, hz] → min
[hx−2.45, 0, hz−2.05], max [hx+2.45, 6.0, hz+2.05]; each neighbour
house at x=hx, z centre −2 → min [hx−2.45, 0, −4.05], max
[hx+2.45, 5.6, 0.05]. The boxes are the audit's conservative
maximum-dimension solids from set.js buildWorld.)

**For THIS shot (SH19, FLASHBACK_ROCK):** NONE of the 18 stands in
this shot's place (FLASHBACK_ROCK, world x ≈ 1200) — the nearest
solids are ~580+ units away in either direction. The audit still tests
the segment against all 18; any sane flashback camera clears them by
distance alone. D2-CLEAR has never hit on SH19.
