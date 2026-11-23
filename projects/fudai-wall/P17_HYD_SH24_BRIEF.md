# HYDROGEN SEAT — BRIEF · phase 17 · cause 13: SH24 camera + wave crest (thesis frame)

You are the Hydrogen build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). You authored the staging for shots SH20–SH26
of this film (chunk 3b), including SH24 — the thesis frame, where the
wave's crest stops below the wall top. You AUTHOR the fix; the driver
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
Commit `2cc52dc` — phase-16 cause 4 (SH13, Qwen seat) judged and
parked; the tree stands at the last judged state (`0b5b45d` scene
state). Phase-14 dispatcher ruling: SH20–SH26 camera causes belong
to the Hydrogen browser seat. No judgement is pending on THIS cause;
this brief may fire. (Numbering note: Layla's phase-17 tasking calls
this cause 13; the phase-13 queue listed SH24 + crest as item 12 and
SH25 as item 13 — SH25 is a separate cause, not this brief.)

## The camera model (exact semantics)
`chunk3Shot(id, t0, t1, place, [fromPos, fromTarget], [toPos, toTarget], fov)`:
pos/target are OFFSETS from the place anchor; the camera pushes
from→to across the shot (moment fraction = (t − t0)/(t1 − t0),
linear fraction quoted below; the audit samples the loader's eased
camera); fov is a number or [from,to]. Anchor COAST_WALL = world
[0,0,-16]; world = offset + [0,0,-16] for BOTH pos and target.
Current line (verbatim):
chunk3Shot('SH24','line:22.start','line:22.end','COAST_WALL',[[24,19.5,-26],[0,14.5,-16.8]],[[15,18.8,-22.5],[0,17.2,-16.8]],[40,28])
World: pos [24,19.5,-42] → [15,18.8,-38.5]; target [0,14.5,-32.8] → [0,17.2,-32.8].
Shot span: t 61.56–63.69. Frame: portrait 1080×1920; horizontal
half-angle = atan(tan(fov/2) × 1080/1920). The audit's size measure
is `height(size, p) = 2·atan(size/(2·depth)) / (fov in rad) × 1920`,
where depth is the point's forward-axis distance from the camera.

## Measured baseline (driver's own audit runs on HEAD 2cc52dc — restate these in your reply before proposing)
- F1863 (t=62.10, fraction 0.25) **PASS**: spray_hero_sh24 662px in frustum (prop check: centre in frustum + height ≥ 260px; spray centre [0,17.5,-33.5], size [26,4.5,3] → 4.5-unit height). Invariant — must stay PASS.
- F1896 (t=63.20, fraction 0.77) **FAIL**: wave_hero_sh24 3187px but centre OUT of frustum. (Prop check: centre [0,0,-33.5] at this t must be IN frustum AND height(17.5, centre) ≥ 500px — the size already reads 3187px; only the centre is out.)
- F1908 (t=63.60, fraction 0.96) **FAIL** — the crest check (exact definition below): crest 17.50 ≤ 17.50 ✓; wall top 18.00 ✓; **wall-top in frame: NO** ✗. The failure is framing only.
- D2-CLEAR: **no hit on SH24** (the audit's only D2-CLEAR hits are SH13 + SH16, other causes). The staging audit also flags any sampled camera inside a solid (solids include the seawall box: centre [0,9,-16], size [90,18,1.15]). Your new path must stay clear of every solid at every moment.
- No other moment may change (chunk 3 stands at 19/40; chunk 2 untouched).

## The crest check — exact definition (from tools/audit_staging.mjs, frame 1908)
- crest = wave_hero_sh24's last key at or before t carrying `crestY` (fallback `h`): at t=63.60 that is the t=63.2 key → **crestY 17.5**.
- top = the seawall's state `h` at t: **18** (hero keys: 17 @line:20.start → 17.5 @55.9 → 18 @57.1, held through SH24).
- topIn = the audit frame's point test on **[0, top, seawall.at[2]] = [0,18,-16]** — the wall-top point at x=0.
- **PASS iff crest ≤ 17.5 AND top === 18 AND topIn.** The first two already hold on the current tree and are prop-state facts, not camera facts — do not touch the wave or seawall keys. The camera half is one constraint: at t=63.60 (fraction 0.96, effectively the TO pose), the point [0,18,-16] must be inside the frustum.

## Staging geometry (world; camera only — move nothing else)
- wave_hero_sh24: size [70,17.5,24], h 17.5; `at` keys: [0,0,-50] @line:22.start → [0,0,-33.5] @62.1 (held @63.2); crestY keys: 15.5 @start → 16.8 @62.1 → **17.5 @63.2** → 16.5 @line:23.start. Centre at F1896/F1908: [0,0,-33.5]. The thesis margin is in the keys: crest 17.5 vs wall top 18.0 — a 0.5 D dry-concrete margin.
- spray_hero_sh24: at [0,17.5,-33.5] (from @62.1 on), size [26,4.5,3]; intensity/lift keys peak @62.1.
- seawall: at [0,0,-16], w 90, h 18 throughout this shot. Wall-top check point: [0,18,-16] — 17.5 units seaward of the wave centre and 18 above the sea plane.
- The current TO pose (world pos [15,18.8,-38.5], target [0,17.2,-32.8], fov ≈28.5 at fraction 0.96) aims along the wave face; the wall-top point sits ≈40°+ off that axis — outside the ≈14° vertical half-angle. The fix must swing the late-shot aim back toward the wall while F1896 (fraction 0.77) keeps the wave centre in frame and F1863's spray reading (fraction 0.25) is not lost.

## Your task
Propose ONE new SH24 camera line (COAST_WALL offsets, fov ∈ [24,50]) satisfying ALL of: F1863 spray still PASS; F1896 wave centre IN frustum with height ≥ 500px; F1908 crest check PASS (i.e. [0,18,-16] in frame at fraction 0.96, with the crest/top facts unchanged); no D2-CLEAR / camera-inside hit; no other moment changed. If you judge the three moments unsatisfiable together, say so with the measured conflict per reading — do not silently trade one against another.

## Reply format (exact)
1. BASELINE RESTATED: the readings above (F1863, F1896, F1908 with the crest check's three sub-readings, D2-CLEAR), in your own numbers.
2. CANDIDATE: the full replacement chunk3Shot line, verbatim, ready to paste.
3. PREDICTED READINGS: per check (F1863 / F1896 / F1908 + D2-CLEAR): the interpolated camera pos + target AT that fraction, the forward UNIT vector, each checked point's off-axis angle in degrees computed from NORMALIZED vectors (show the dot product), and its projected size in px by the audit's height formula.
Nothing else. Do not claim you ran anything.
