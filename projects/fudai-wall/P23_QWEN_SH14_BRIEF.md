# QWEN SEAT — BRIEF · phase 23 · cause 6: SH14 camera — bring the distant wall into the closing frame

You are the Qwen build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). You authored the staging for shots SH13–SH19
of this film (chunk 3a), including SH14 — the hill grave: one stone,
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
