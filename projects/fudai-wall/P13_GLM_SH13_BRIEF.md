# GLM SEAT — BRIEF · phase 13 · cause 4: SH13 camera — clear of the town hall, box + mayor_old framed, hand tip kept

You are the GLM build seat for the film "fudai-wall" (project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`). You AUTHOR the fix; the driver applies your
values verbatim and judges them with the project's measured audits.
RULES §3: one cause, one change. §4: faces within 60°, whole head in
frame, never cut by the edge; sampled fov ∈ [24,50]; camera never
inside a solid. **NO LOCAL RENDERS** — you propose numbers only; the
driver runs the audits and feeds you the actual readings. The audits
are the ground truth: the loader intervenes on authored cameras
(lowCams/autoMove), so a hand projection the audit does not reproduce
is worth nothing — work from the measured readings below and from
the readings the driver feeds back.

## Previous verdict this brief cites (hard-gate requirement)
Commit `5215713` — phase-12 cause 3 CLOSED; commit `a037020` —
phase 13 opened under Layla's authorship ruling (GLM authors, driver
operates). No judgement is pending; this brief may fire.

## The camera model (exact semantics)
SH13 is one line in `scenes/film.js`, written with the helper
`chunk3Shot(id, t0, t1, place, [fromPos, fromTarget], [toPos, toTarget], fov)`:
pos/target are OFFSETS from the place anchor; the camera pushes
linearly from→to across the shot; fov is a number or [from,to].
Place anchor COAST_VILLAGE = world [0,0,2], so world = offset + [0,0,2].
Current line (verbatim):
chunk3Shot('SH13','line:11.start','line:11.end','COAST_VILLAGE',[[-5.4,1.62,8.2],[-6,1.55,1.6]],[[-2,1.62,8.2],[-2.6,1.5,2.9]],40)

## Measured baseline (driver's own audit runs on HEAD 73d4b6e — reproduce these in your reply before proposing)
- D2-CLEAR **FAIL**: SH13's camera path intersects the town hall solid (world box: x ∈ [-4.5,4.5], y ∈ [0,6.4], z ∈ [9.5,18.5]). The current path runs at world z=10.2, y=1.62, x from -5.4 to -2 — inside the box's z-range, below its top.
- F933 (t=31.10) **PASS**: mocker_b hand tip in frustum. (Invariant — must stay PASS.)
- F942 (t=31.40) **FAIL**: box_sh13 195px out of frustum.
- F969 (t=32.30) **FAIL**: mayor_old face angle 61.5° (limit 60°), head out 343px.
- All other chunk-3 moments and chunk 2 must not change.

## Staging geometry (world coordinates; do NOT move any of it — camera only)
- mayor_old: starts at [-6,0,3]; walks from line:11.start at speed 1 along path [x,z]: [-6,3] → [-5.7,4.4] → [-2.6,4.8] → [6.5,5.2]. Head centre ≈ y 1.68. His look target (from line:11.start) is [-2,1.5,11] — he faces toward +x/+z. Shot spans ≈ t 30.9–33.9; at F969 (t=32.30) he is ≈1.3 units along the path, near [-5.75,~4.3].
- box_sh13: at [-6,1.15,3.45] at line:11.start, moving linearly to [-2.6,1.15,5.25] at line:11.end. At F942 (t=31.40) it is ≈ [-5.4,1.15,3.8].
- mocker_b: stands at [4,0,-1] (ry 180); the checked point is his hand tip (raised hand, ≈ [4,1.2,-1]).
- The square's other cast stands around COAST_VILLAGE offsets x -8..10, z 0..6 (world z 2..8).

## A measured near-miss (the previous seat's final candidate — refine it, do not restart from zero)
Static pos offset [4.8,5,-8] (world [4.8,5,-6]); targets offsets [4,2,-3] → [-4.6,1.9,2.2] (world [4,2,-1] → [-4.6,1.9,4.2]); fov 50.
Measured on that candidate: D2-CLEAR **CLEARED**; F942 **PASS** (box 75px, in frustum); F969 **PASS** (face 47.9°, head in, 165px); F933 **FAIL** (hand tip out of frustum).
So the open tension is one point: lanes that clear the hall and frame the box + the mayor's face lose mocker_b's hand tip at t=31.10. Note the loader's sampled camera differs from the authored one — treat the four readings as the only truth.

## Your task
Propose ONE new SH13 camera line (from/to pos + target as COAST_VILLAGE offsets, fov ∈ [24,50]) that satisfies ALL FOUR readings together: D2-CLEAR clear, F933 PASS, F942 PASS, F969 PASS, with no other moment changed. Show your arithmetic per reading (projected positions / angles from the geometry above). If you judge the four unsatisfiable together, say so with the measured conflict per reading — do not silently trade one against another.

## Reply format (exact)
1. BASELINE RESTATED: the four current readings + the near-miss readings, in your own numbers.
2. CANDIDATE: the full replacement chunk3Shot line, verbatim, ready to paste.
3. PREDICTED READINGS: per check (D2-CLEAR / F933 / F942 / F969), with the arithmetic.
Nothing else. Do not claim you ran anything.
