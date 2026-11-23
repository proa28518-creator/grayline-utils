# HYDROGEN SEAT — BRIEF · phase 23 (re-addressed phase 25) · cause 6: SH14 camera — bring the distant wall into the closing frame

You are the Hydrogen build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). The staging for shots SH13–SH19 of this film
(chunk 3a), including SH14, was authored by the **Qwen** seat — that
authorship credit stands; this cause was re-routed to you (phase-24
dispatcher ruling; see the AMENDMENT section at the end of this
brief). SH14 is the hill grave: one stone,
one leaf, and the far silent wall as a silhouette on the horizon (a
staging Layla accepted as authored). You AUTHOR the fix; the driver
applies your values verbatim and judges them with the project's
measured audits. RULES §3: one cause, one change. §4: faces within
60°, whole head in frame, never cut by the edge; sampled fov ∈
[24,50]; camera never inside a solid. **NO LOCAL RENDERS** — you
propose numbers only; the audits are the ground truth (the loader
intervenes on authored cameras — lowCams/autoMove plus an outCubic
push ease — so only audit readings count; a hand projection the
audit does not reproduce is worth nothing — work from the measured
readings below).

## Previous verdict this brief cites (hard-gate requirement)
Commit `21451c4` — phase-22 VERDICT: CLOSED (SH25 camera, corrective
round); the tree stands at the last judged state, HEAD `21451c4`.
Phase-14 dispatcher ruling: SH13–SH19 camera causes belong to the
Qwen browser seat. No judgement is pending on THIS cause; this brief
may fire. (Queue note: this is phase-12 queue item 6 — SH14 F1056
framing.)

## The camera model (exact semantics)
`chunk3Shot(id, t0, t1, place, [fromPos, fromTarget], [toPos, toTarget], fov)`:
pos/target are OFFSETS from the place anchor; the camera pushes
from→to across the shot (the audit samples the loader's eased
camera; moment fractions below are (t − t0)/(t1 − t0) on the shot
span); fov is a number or [from,to]. Anchor HILL_GRAVE = world
[2400,0,0]; world = offset + [2400,0,0] for BOTH pos and target.
Current line (verbatim):
chunk3Shot('SH14','line:12.start','line:12.end','HILL_GRAVE',[[2.6,.9,5.2],[0,1,0]],[[2.2,3.4,6.4],[0,1.2,-2]],40)
World: pos [2402.6,0.9,5.2] → [2402.2,3.4,6.4]; target [2400,1,0] → [2400,1.2,-2].
Shot span: t 33.04–35.27. Frame: portrait 1080×1920; horizontal
half-angle = atan(tan(fov/2) × 1080/1920). The audit's size measure
is `height(size, p) = 2·atan(size/(2·depth)) / (fov in rad) × 1920`,
where depth is the point's forward-axis distance from the camera.
All three SH14 checks are prop checks: the prop's centre point must
be IN frustum AND `height(size[1], centre)` ≥ the moment's
threshold (sizes from the audit's table, below).

## The D1/D2 hard constraints (every camera brief carries these since phase 21)
- Both ends' WORLD target y ∈ [0, 19.5] (the D2 target-sanity bound; the wall is 18 D).
- Both ends' WORLD targets inside at least one place's bounds (HILL_GRAVE bounds: x ∈ [2360,2440], z ∈ [-150,20]).
- The D1/D2 audit after your change must return **exactly the baseline FAIL (2)** — the two D2-CLEAR lines (SH13 + SH16, other causes) and nothing else; no new D-line of any kind.
- No D2-CLEAR / camera-inside hit on SH14: the sampled camera path must stay clear of every solid at every moment (the audit's solids: town hall, village houses, neighbour houses, the seawall box centre [0,9,-16] size [90,18,1.15], the gateleaf when visible — none stands near this shot's hill, but the path is checked against all of them).

## Measured baseline (driver's own audit runs on HEAD 21451c4 — restate these in your reply before proposing)
- F993 (t=33.10, fraction 0.027) **PASS**: gravestone_sh14 692px in frustum. Invariant — must stay PASS.
- F1026 (t=34.20, fraction 0.520) **PASS**: leaf_sh14 75px in frustum. Invariant — must stay PASS.
- F1056 (t=35.20, fraction 0.969) **FAIL**: wall_distant_sh14 357px but centre OUT of frustum. (Prop check: centre [2400,0,-140] must be IN frustum AND height(18, centre) ≥ 40px — the size already reads 357px; only the centre is out.)
- D2-CLEAR: **no hit on SH14** (the audit's only D2-CLEAR hits are SH13 + SH16, other causes).
- The audit's sampled cameras under the current line: F993 pos [2402.58,1.36,5.26] target [2400.00,1.01,-0.10] fov 40; F1026 pos [2402.31,2.82,6.08] target [2400.00,1.15,-1.46] fov 40; F1056 pos [2402.20,3.38,6.39] target [2400.00,1.20,-1.98] fov 40.
- No other moment may change (chunk 3 stands at 29/40; chunk 2 untouched).

## Staging geometry (world; camera only — move nothing else)
- gravestone_sh14: at [2400,0,0] (the grave stone on the hill), size [0.9,1.5,0.25] → the check measures a 1.5-unit height at its centre, threshold 90px.
- leaf_sh14: falls across the shot — at keys [2400.55,3.3,0.25] @line:12.start → [2400.18,0.06,0.55] @line:12.end; size [0.28,0.16,0.03] → a 0.16-unit height at its centre, threshold 25px.
- wall_distant_sh14: at [2400,0,-140] — an 18 D seawall-kind silhouette standing on the hill's horizon, 140 units north of the grave; size [18,18,1.15] → an 18-unit height at its centre [2400,0,-140], threshold 40px. (Its distance is the accepted staging: the place's bounds were widened to z −150 for exactly this silhouette in phase 12.)
- The measured tension (driver's derivation from the sampled F1056 camera — check it in your arithmetic): the camera cranes up beside the stone and aims down its own diagonal — from pos [2402.20,3.38,6.39] toward target [2400,1.20,-1.98], the aim azimuth is ≈ −14.7° off the −z axis, while the wall centre [2400,0,-140] lies almost straight down −z (azimuth ≈ −0.9°). The centre therefore sits ≈ 13–14° off-axis horizontally, outside the fov-40 horizontal half-angle of 11.57°, even though it is ~146 units away and its 18-unit height reads 357px. The fix must swing the late-shot aim (or the camera's x) so the horizon wall enters the frame by fraction 0.969 — without losing the stone at 0.027 or the falling leaf at 0.520, whose readings hang on the early/mid aim at the grave.

## Your task
Propose ONE new SH14 camera line (HILL_GRAVE offsets, fov ∈ [24,50]) satisfying ALL of: F993 gravestone still PASS; F1026 leaf still PASS; F1056 wall centre IN frustum with height ≥ 40px; both D1/D2 target constraints above with D1/D2 returning exactly FAIL (2); no D2-CLEAR / camera-inside hit; no other moment changed. If you judge the three moments unsatisfiable together, say so with the measured conflict per reading — do not silently trade one against another.

## Reply format (exact)
1. BASELINE RESTATED: the readings above (F993, F1026, F1056, D2-CLEAR), in your own numbers.
2. CANDIDATE: the full replacement chunk3Shot line, verbatim, ready to paste.
3. PREDICTED READINGS: per check (F993 / F1026 / F1056 + the two D1/D2 target constraints at both ends + D2-CLEAR): the interpolated camera pos + target AT that fraction, the forward UNIT vector, each checked point's off-axis angle in degrees computed from NORMALIZED vectors (show the dot product), and its projected size in px by the audit's height formula.
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

**For THIS shot (SH14, HILL_GRAVE):** NONE of the 18 stands in this
shot's place (HILL_GRAVE, world x ≈ 2400) — the nearest solid is
~1,780 units away. The audit still tests the segment against all 18;
any sane hill camera clears them by distance alone. D2-CLEAR has never
hit on SH14 — do not let this section distract from the framing checks.
