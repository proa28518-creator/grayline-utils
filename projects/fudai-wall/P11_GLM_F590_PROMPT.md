# GLM — COMPUTE · phase 11 · cause: F590 follow-up (SH07B TO pose — set bar)

You are the GLM compute seat for the film "fudai-wall". Compute ONLY —
touch no files. ALL coordinates in this brief are WORLD coordinates.
Return the pose in WORLD coordinates too (no anchor offsets).

## The frame and the fault
Frame 590 (t=19.667 s) is the end pose (TO) of shot SH07B, portrait
1080 px wide × 1920 px tall, 30 fps. Its measured pixel set bar
(driver-harness gate): **12.1% detail / 85.9% flat** — FAIL (shot bar:
≥22% detail / ≤78% flat). On the render, the coin cluster IS fully in
frame at the top and the sea reads as a wide band (~35%), but the frame
is otherwise flat bands (sky / sea / sand / dark foreground). ONE cause:
reframe the TO pose so a detail carrier (the seawall's face / gate /
wall-top) reads in frame, while keeping the coins fully in frame and
the sea as a band.

## Fixed world geometry
- Seawall box: x −40..40, y 0..18 (top y=18), z −20..−12. Sea face at
  z=−20, village face at z=−12. Gate passage through the wall around
  x −3.8..3.8; lantern posts at [±3.8, 7.5, −14.6] (inside the passage);
  mocksign board at [−6, 12.8, −14.2].
- Wall-top audit point: [2, 18, −15.42] — must project in frame.
- Coins (pinned, do not move): visible cluster occupies x 1..3.5,
  y 19.5..21.5, z −17.5 (above the wall top). Whole cluster in frame,
  ≥40 px margin every edge, projected size ≥120 px.
- Sea: surface y=0, z from −20 seaward (to −70). Must remain a visible
  band ≥15% of frame height.
- FROM pose (untouched): pos [5.5, 2.2, 4.2], target [1, 7.5, −16],
  fov 50. The sampled camera path is the straight lerp FROM→TO.
- CURRENT TO pose (the failing one): pos [2, 24, −16], target
  [2, 5, −38], fov 50.

## Path constraint (hard)
The lerp must crest the wall: whenever path z ∈ [−20,−12], path y ≥ 18.5.
Equivalently, if the TO pos crosses to the sea side, its y must satisfy
y_pos ≥ 2.2 + 16.3·(4.2 − z_pos)/16.2 (z=−30 → ≥36.6; z=−36 → ≥42.7).
A TO pos that stays village-side (z > −12) or above the wall satisfies
this trivially — verify and state which case yours is.

## Two composition families — pick ONE and compute it fully
(A) CRANE-OVER (sea side, high): pos z −36..−30 at/above the crest
bound, target on the wall-top/gate area [2, 10..14, −18..−14],
fov 34–44. Carriers: wall top + gate from above, lantern glow, coins
against sky, water foreground.
(B) OVER-THE-TOP (village side, above the wall): pos z −10..0,
y 25..30, target [2, 10..13, −17..−14], fov 30–38. The sightline over
the village-face top edge (y=18 at z=−12) shows the wall top, the coins
above it, the upper sea face / gate top, and the sea beyond; the
village face fills the lower frame (gate opening at its centre).
For (B) verify: the ray from your camera to the coin cluster clears
y=18 at z=−12, and state how much of the sea face (z=−20, y 0..18) is
visible over the top edge (the grazing ray's y at z=−20).

## Return
1. Family chosen + the pose: pos / target (world) + fov.
2. Projections (1080×1920, vertical fov, centre (540,960)): bboxes for
   the coin cluster, the wall-top point, the gate/wall-top region;
   the sea band's projected y-range and % of frame height.
3. Path-crest verification (numbers).
4. Region shares + the named detail sources your composition actually
   shows (only what is geometrically visible from your camera — check
   occlusion against the wall box for every named source).
If neither family satisfies all constraints, say which constraint
fails in each, with numbers.
