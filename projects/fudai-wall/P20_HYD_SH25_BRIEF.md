# HYDROGEN SEAT — BRIEF · phase 20 · SH25 camera (F1944 sunbeam centre / F1953 villagers occupancy)

You are the Hydrogen build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). You authored the staging for shots SH20–SH26
of this film (chunk 3b), including SH25 — the village saved: the
sunbeam breaks over the village while the villagers stand in it. You
AUTHOR the fix; the driver applies your values verbatim and judges
them with the project's measured audits. RULES §3: one cause, one
change — this brief is ONE shot's camera (SH25); its two failing
moments are one cause. §4: faces within 60°, whole head in frame,
never cut by the edge; sampled fov ∈ [24,50]; camera never inside a
solid. **NO LOCAL RENDERS** — you propose numbers only; the audits
are the ground truth (the loader intervenes on authored cameras —
lowCams/autoMove plus an outCubic push ease — so only audit readings
count; a hand projection the audit does not reproduce is worth
nothing — work from the measured readings below).

## Previous verdict this brief cites (hard-gate requirement)
Commit `d80e00f` — phase-20 cause 14 VERDICT: CLOSED (SH20 camera
residuals, Hydrogen seat); the tree stands at the last judged state.
Phase-14 dispatcher ruling: SH20–SH26 camera causes belong to the
Hydrogen browser seat. No judgement is pending on THIS cause; this
brief may fire.

## Scope — what is IN this cause and what is NOT
- **IN: SH25's two failing moments** — F1944, F1953 (below). They
  are SH25's ONLY moments in the audit table.
- **NOT IN: SH26 — re-measured fully passing (phase 17); do not
  touch its line.** SH24 (just closed, phase-20 cause 13) is the
  previous shot, not this cause. No other moment may change
  (chunk 3 stands at 27/40; chunk 2 untouched).

## The camera model (exact semantics)
`chunk3Shot(id, t0, t1, place, [fromPos, fromTarget], [toPos, toTarget], fov)`:
pos/target are OFFSETS from the place anchor; the camera pushes
from→to across the shot (moment fraction = (t − t0)/(t1 − t0),
linear fraction quoted below; the audit samples the loader's eased
camera); fov is a number or [from,to]. Anchor COAST_WALL = world
[0,0,-16]; world = offset + [0,0,-16] for BOTH pos and target.
Current line (verbatim):
chunk3Shot('SH25','line:23.start','line:23.end','COAST_WALL',[[0,19.6,1],[0,3.5,22]],[[0,23.5,5],[0,2.5,24]],46)
World: pos [0,19.6,-15] → [0,23.5,-11]; target [0,3.5,6] → [0,2.5,8].
Shot span: t 64.49–65.22 (line:23, the owner's word timings). Frame:
portrait 1080×1920; horizontal half-angle = atan(tan(fov/2) ×
1080/1920). The audit's size measure is `height(size, p) =
2·atan(size/(2·depth)) / (fov in rad) × 1920`, where depth is the
point's forward-axis distance from the camera. Prop check: the
prop's centre point must be IN frustum AND `height(size[1], centre)`
≥ threshold. Occupancy/body check: box centred at the member's
pos + [0,1,0], size [1,2,.6]; PASS iff centre in frame, no occluder,
height(2, centre) ≥ threshold, and ≥ 4/8 corners in frame.

## Measured baseline (driver's own audit runs on HEAD d80e00f — restate these in your reply before proposing)
- F1944 (t=64.80, fraction 0.42) **FAIL**: sunbeam_sh25 2522px but
  centre OUT of frustum. (Prop check: centre [0,16,8] must be IN
  frustum AND height(22, centre) ≥ 400px — the size already reads
  2522px; only the centre is out.)
- F1953 (t=65.10, fraction 0.84) **FAIL**: villagers occupancy
  170px, corners 8/8. (Occupancy check: body box centre [0,1,6] in
  frame ✓, corners 8/8 ✓, but height(2, centre) = 170px <
  threshold 230px — only the size is short.)
- D2-CLEAR: **no hit on SH25** (the audit's only D2-CLEAR hits are
  SH13 + SH16, other causes). The staging audit also flags any
  sampled camera inside a solid (solids include the seawall box:
  centre [0,9,-16], size [90,18,1.15]). Your new path must stay
  clear of every solid at every moment.
- The audit's OWN sampled cameras under the current line (driver's
  probe of the audit's sampler): t=64.80 → pos [0,22.09,-12.45],
  target [0,2.86,7.27], fov 46; t=65.10 → pos [0,23.27,-11.24],
  target [0,2.56,7.88], fov 46. Note how far the loader's lowCams
  floor lifts the authored y (19.6→23.5 authored samples at
  22.09→23.27 eased) — authored ≠ sampled on this shot.
- No other moment may change (chunk 3 stands at 27/40; chunk 2
  untouched).

## Staging geometry (world; camera only — move nothing else)
- sunbeam_sh25: at [0,16,8] (COAST_VILLAGE + [0,16,6]), size
  [18,22,18] → the check measures a 22-unit height at its centre
  [0,16,8]. Keys: hidden until line:23.start; opacity .45 at
  line:23.start → .85 at t=64.8 → hidden at line:24.start. The beam
  is the shot's light event; its centre hangs 16 above the village
  plane, over the shore at z=8.
- villagers: held at world [0,0,6] for the whole shot (their
  line:23 walk key is a held point); face from line:23.start: eyes
  open, brow up, mouth smile. Body box at F1953: centre [0,1,6],
  size [1,2,.6]. From the sampled F1953 camera the box centre's
  forward depth is ≈28.2, which is exactly the measured 170px;
  ≥ 230px at fov 46 needs forward depth ≲ 20.8 (a narrower sampled
  fov buys the same px at greater depth — height scales as 1/fov).
- seawall: at [0,0,-16], w 90, h 18 throughout this shot; its solid
  box (centre [0,9,-16], size [90,18,1.15]) sits directly under
  SH25's current path. Crossing the wall plane (z ≈ -16) is only
  legal above the wall top (y > 18 while |z + 16| ≤ 0.575); the
  current path stays village-side of it and above it.
- The two subjects are nearly vertically aligned: sunbeam centre
  [0,16,8] and villagers [0,0,6] — same x ≈ 0, z ≈ 6–8, 15 units
  apart in y. The current camera looks steeply DOWN at the
  villagers from y ≈ 23: the beam centre rides far above the aim
  line and falls out of the top of the frame at fraction 0.42,
  while the villagers read small from ≈28 deep at fraction 0.84.
  The fix must hold the beam centre inside the upper frame early
  in the shot AND close the villagers' depth (or narrow the fov)
  by fraction 0.84 — one continuous push, no solid entered.

## Your task
Propose ONE new SH25 camera line (COAST_WALL offsets, fov ∈
[24,50]) satisfying ALL of: F1944 sunbeam centre IN frustum with
height ≥ 400px; F1953 villagers body height ≥ 230px with centre in
frame and corners ≥ 4/8; no D2-CLEAR / camera-inside hit; no other
moment changed. If you judge the two moments unsatisfiable
together, say so with the measured conflict per reading — do not
silently trade one against another.

## Reply format (exact)
1. BASELINE RESTATED: the readings above (F1944, F1953, D2-CLEAR),
   in your own numbers.
2. CANDIDATE: the full replacement chunk3Shot line, verbatim,
   ready to paste.
3. PREDICTED READINGS: per check (F1944 / F1953 + D2-CLEAR): the
   interpolated camera pos + target AT that fraction, the forward
   UNIT vector, each checked point's off-axis angle in degrees
   computed from NORMALIZED vectors (show the dot product), its
   projected size in px by the audit's height formula, and for
   F1953 the body-box corner count your projection predicts.
Nothing else. Do not claim you ran anything.
