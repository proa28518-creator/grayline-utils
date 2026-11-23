# QWEN SEAT — BRIEF · phase 23 · cause 8: SH17 camera — bring boat_b into the frame

You are the Qwen build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). You authored the staging for shots SH13–SH19
of this film (chunk 3a), including SH17 — the sea pulling back, two
boats settling on the drained shore. You AUTHOR the fix; the driver
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
may fire. (Queue note: this is phase-12 queue item 8 — SH17 camera,
boat_b.)

## Scope — what is IN this cause and what is NOT
- **IN: F1215 only** — boat_sh17_b out of frame (below).
- **NOT IN: F1188 — PARKED, do not brief it, do not touch it.** Its moment (sea_sheet_sh17 state, pull ≥ 6 at t=39.60) is internally inconsistent with the owner's word timings (phase-12 record: at 39.60 the recession word has not been spoken; the declared state cannot truthfully hold at that frame under any sampling). It stands parked for a dispatcher decision (options A/B on record). Your camera must leave its reading exactly as it stands — FAIL `pull 0 >= 6` — and must not move the sea_sheet, the boats' keys, or any prop. Camera only.
- F1197 (boat_a + the sea_sheet state rider) is PASS and is this cause's invariant.

## The camera model (exact semantics)
`chunk3Shot(id, t0, t1, place, [fromPos, fromTarget], [toPos, toTarget], fov)`:
pos/target are OFFSETS from the place anchor; the camera pushes
from→to across the shot (the audit samples the loader's eased
camera; moment fractions below are (t − t0)/(t1 − t0) on the shot
span); fov is a number or [from,to]. Anchor SEA = world [0,0,-44];
world = offset + [0,0,-44] for BOTH pos and target.
Current line (verbatim):
chunk3Shot('SH17','line:15.start','line:15.end','SEA',[[-6,13.5,15],[0,0,-2]],[[2,12.5,14],[0,0,-6]],44)
World: pos [-6,13.5,-29] → [2,12.5,-30]; target [0,0,-46] → [0,0,-50].
Shot span: t 39.28–40.67. Frame: portrait 1080×1920; horizontal
half-angle = atan(tan(fov/2) × 1080/1920). The audit's size measure
is `height(size, p) = 2·atan(size/(2·depth)) / (fov in rad) × 1920`,
where depth is the point's forward-axis distance from the camera.
Both SH17 prop checks: the prop's centre point must be IN frustum
AND `height(size[1], centre)` ≥ 40px (boat size [3.1,3.2,1.2] → a
3.2-unit height at the centre).

## The D1/D2 hard constraints (every camera brief carries these since phase 21)
- Both ends' WORLD target y ∈ [0, 19.5] (the D2 target-sanity bound; the wall is 18 D).
- Both ends' WORLD targets inside at least one place's bounds (SEA bounds: x ∈ [-60,60], z ∈ [-70,-18]).
- The D1/D2 audit after your change must return **exactly the baseline FAIL (2)** — the two D2-CLEAR lines (SH13 + SH16, other causes) and nothing else; no new D-line of any kind.
- No D2-CLEAR / camera-inside hit on SH17: the sampled camera path must stay clear of every solid at every moment (the audit's solids: town hall, village houses, neighbour houses, the seawall box centre [0,9,-16] size [90,18,1.15], the gateleaf when visible).

## Measured baseline (driver's own audit runs on HEAD 21451c4 — restate these in your reply before proposing)
- F1188 (t=39.60, fraction 0.230) **FAIL — PARKED, not this cause**: sea_sheet_sh17 state FAIL pull 0 >= 6. Expected to remain exactly this line after your change.
- F1197 (t=39.90, fraction 0.446) **PASS**: boat_sh17_a 509px in frustum; sea_sheet_sh17 state rider PASS pull 14 >= 12. Invariant — must stay PASS, rider included.
- F1215 (t=40.50, fraction 0.878) **FAIL**: boat_sh17_b 634px out of frustum. (Prop check: centre [2.5,0.02,-37] must be IN frustum AND height(3.2, centre) ≥ 40px — the size already reads 634px; only the centre is out.)
- D2-CLEAR: **no hit on SH17** (the audit's only D2-CLEAR hits are SH13 + SH16, other causes).
- The audit's sampled cameras under the current line: F1197 pos [-0.72,12.84,-29.66] target [0.00,0.00,-48.64] fov 44; F1215 pos [1.67,12.54,-29.96] target [0.00,0.00,-49.83] fov 44.
- No other moment may change (chunk 3 stands at 29/40; chunk 2 untouched).

## Staging geometry (world; camera only — move nothing else)
- boat_sh17_a: at SEA+[-3.5,0.15,4] = [-3.5,0.15,-37]; settle key at t=39.90 lowers it to [-3.5,0.02,-37]; rot key [0,0,14] @40.10. Centre at F1197: [-3.5,0.02,-37].
- boat_sh17_b: at SEA+[2.5,0.15,7] = [2.5,0.15,-37]; settle key at t=39.70 lowers it to [2.5,0.02,-37]; rot key [0,0,-11] @39.95. Centre at F1215: [2.5,0.02,-37].
- sea_sheet_sh17: at [0,0.02,-44], size [120,0.04,80]; pull keys 0 @line:15.start → 4 @line:15.word:2 → 14 @39.90 → 36 @40.50 → 36 @line:15.end (restored verbatim from your record in phase 14 — do not touch).
- The two boats sit 6 units apart in x at the same z (-37), ~7 units seaward of the camera path and ~12.5 below it. The current camera drifts east and aims deep (target z −46 → −50 at y 0): boat_a (west) stays in at fraction 0.446, but by fraction 0.878 boat_b (east, [2.5,0.02,-37]) has fallen out of the frustum — the aim line passes well beyond and below it. The fix must widen or swing the late-shot framing to hold boat_b's centre while boat_a and the pull rider stay PASS at 0.446.

## Your task
Propose ONE new SH17 camera line (SEA offsets, fov ∈ [24,50]) satisfying ALL of: F1215 boat_b centre IN frustum with height ≥ 40px; F1197 boat_a still PASS with the sea_sheet rider still PASS; F1188's line unchanged (parked — still FAIL pull 0 >= 6, no other sea_sheet reading moved); both D1/D2 target constraints above with D1/D2 returning exactly FAIL (2); no D2-CLEAR / camera-inside hit; no other moment changed. If you judge the readings unsatisfiable together, say so with the measured conflict per reading — do not silently trade one against another.

## Reply format (exact)
1. BASELINE RESTATED: the readings above (F1188 parked, F1197, F1215, D2-CLEAR), in your own numbers.
2. CANDIDATE: the full replacement chunk3Shot line, verbatim, ready to paste.
3. PREDICTED READINGS: per check (F1197 / F1215 + the two D1/D2 target constraints at both ends + D2-CLEAR): the interpolated camera pos + target AT that fraction, the forward UNIT vector, each checked point's off-axis angle in degrees computed from NORMALIZED vectors (show the dot product), and its projected size in px by the audit's height formula.
Nothing else. Do not claim you ran anything.
