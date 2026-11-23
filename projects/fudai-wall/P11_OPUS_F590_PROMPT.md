# OPUS — COMPUTE · phase 11 · cause: F590 follow-up (SH07B TO pose — set bar)

You are the Opus compute seat for the film "fudai-wall" (1080×1920 portrait,
30 fps). Compute ONLY — touch no files. One cause: reframe SH07B's TO pose.

## Verdict this follows (commit 9b7bd6d / d98654d)
F590 (frame 590, t=19.667 s, SH07B end pose): verdict NOT CLOSED. The cause's
own goals are MET on the render — the coin cluster is fully in frame at the
top (large gold coins, no crop) and the sea reads as a wide blue band
(~35% of frame) — but the frame fails RULES §5's set bar: pixel gate
(driver-harness) measures **12.1% detail / 85.9% flat**; the SH07B shot bar
needs ≥22% detail / ≤78% flat (median of the shot's key frames; F590 is
SH07B's key frame). The frame is mostly flat bands (sky / sea / sand / dark
foreground); the seawall's face does not read as a detail carrier.

## Current TO pose (in scenes/film.js)
- pos: `add(PLACES.COAST_VILLAGE,[2,24,-18])` = world [2,24,-16]
- target: `add(PLACES.COAST_WALL,[2,5,-22])` = world [2,5,-38]
- fov: 50
The FROM pose stays untouched (the push must remain continuous):
pos `add(PLACES.COAST_VILLAGE,[5.5,2.2,2.2])`, target
`add(PLACES.COAST_WALL,[1,7.5,0])`, fov 50.

## Fixed geometry (do not move any of it)
- PLACES: COAST_VILLAGE [0,0,2]; COAST_WALL [0,0,-16]; SEA [0,0,-44].
- Seawall: spans x −40..40, z −20..−12 (sea face at z=−20, village face at
  z=−12), top at y=18. The gate sits in the wall around x −3.8..3.8 with
  lantern posts at [±3.8,7.5,−14.6]; the mocksign board is on the seawall
  face. Staging-audit wall-top test point: [2,18,−15.42] — must stay in frame.
- Coins: pinned drop at [2,19.5,−17.5]; the RENDERED cluster rides ~1 D above
  the 0.5 D audit box — treat the visible cluster as occupying roughly
  x 1..3.5, y 19.5..21.5, z −17.5. The whole cluster must stay in frame with
  ≥40 px margin from every frame edge (the staging audit's coins check needs
  ≥24 px projected size and its corners in; the previous pose measured
  coins 258 px, 7/8 corners — do not regress below that).
- Sea surface: the SEA zone around z −44; it must remain a visible band
  (≥15% of frame height).

## Your task
Compute ONE new TO pose (pos + target as `add(PLACES.<anchor>,[x,y,z])`
offsets in film.js style, plus fov within 24–50) that brings a DETAIL
CARRIER — the seawall's sea-side face with the gate — into the frame while
keeping the coins fully in frame at the top and the sea as a band.
Do all arithmetic in the true 1080×1920 portrait frame (vertical fov;
half-height at depth d = d·tan(fov/2); half-width = half-height × 9/16).

Return, in this order:
1. The pose (three lines, film.js syntax) + fov.
2. Projected bboxes (px, 1080×1920) for: the coin cluster, the wall-top
   point, the gate region (x −3.8..3.8, y 0..15 at the wall face), and the
   sea band's share of frame height.
3. A region-by-region estimate of the frame (sky / wall face / gate /
   sea / other) with % shares, and why the detail % should rise above 22%
   (name the detail sources on the wall face: gate leaves, lantern posts,
   sign, wall joints/texture).
4. The push-path check: FROM→TO is a straight lerp sampled by the audits;
   state the mid-path camera position and confirm it does not pass through
   the wall box (x −40..40, y 0..18, z −20..−12) or below y=0.

If you judge the composition impossible under these constraints, say so
plainly with the measured conflict instead of forcing numbers.
