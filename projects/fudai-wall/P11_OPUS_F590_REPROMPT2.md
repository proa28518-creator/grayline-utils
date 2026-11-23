# OPUS — COMPUTE ROUND 3 · phase 11 · cause: F590 follow-up (SH07B TO pose)

Your round-2 conclusion stands and is accepted: a FRONTAL sea-face view is
geometrically incompatible with the crest-respecting straight push from
FROM [5.5,2.2,4.2]. Your crest algebra was right. (Your frame was
transposed again, though: the film is **1080 px WIDE × 1920 px TALL**,
portrait. All projections this round in 1080×1920, centre (540,960).)

New composition — a steep CRANE-OVER reveal, inside the original cause
(TO pose only; FROM untouched): the camera crests the wall and looks down
at the wall top + gate area from the sea side, coins against the sky at
the top of frame, water in the foreground at the bottom.

## Pose space (compute inside it)
- pos: z between −36 and −30, x near 2, and y AT OR ABOVE the crest bound
  y ≥ 2.2 + 16.3·(4.2 − z_pos)/16.2  (z=−30 → y≥36.6; z=−33 → y≥39.6;
  z=−36 → y≥42.7). Express as `add(PLACES.SEA,[x,y,z])` offsets AND world
  coordinates (PLACES.SEA = [0,0,−44], COAST_WALL = [0,0,−16],
  COAST_VILLAGE = [0,0,2]).
- target: the wall-top / gate area, world [2, 10..14, −18..−14], as
  `add(PLACES.COAST_WALL,[x,y,z])` offsets + world.
- fov 34–44.

## Verify with arithmetic (portrait 1080×1920, vertical fov)
1. Crest: y at z=−12 on the FROM→TO lerp ≥ 18.5 (show t and y).
2. COINS: cluster x 1..3.5, y 19.5..21.5, z −17.5 — whole cluster in
   frame, ≥40 px margins, projected size ≥120 px. (From a high sea-side
   camera the coins sit BELOW the sightline over the wall top — check the
   sightline from your camera to the cluster clears the wall-top edge
   y=18 at z=−20: state the ray's y at z=−20.)
3. WALL-TOP point [2,18,−15.42] in frame.
4. SEA band ≥15% of frame height: water at the wall base (z ≤ −20) and
   the foreground below the camera; state the projected y-range.
5. GATE / WALL-TOP region: state the projected bbox of the wall's top
   surface + gate area (x −3.8..3.8, y 7.5..18, z −20..−12) and its share
   of the frame; name the detail sources visible from above (gate leaves
   from above, lantern posts/glow at [±3.8,7.5,−14.6] in the passage,
   wall-top joints, the mocksign board at [−6,12.8,−14.2] if it projects
   in frame).
6. State the view down-angle honestly and the sea face's projected
   height (it will be foreshortened — that is accepted for this
   composition; the wall TOP + gate are the carriers now).

Return: pose (film.js syntax + world), the five verifications with
numbers, region shares, and a detail-% direction argument with no
invented pixel counts. If even this composition fails a constraint,
name the failing one with its numbers.
