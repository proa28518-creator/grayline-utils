# OPUS — CORRECTIVE RE-PROMPT · phase 11 · cause: F590 follow-up (SH07B TO pose)

Your first compute (P11_OPUS_F590_OUT.md) is REJECTED on a proven geometric
error — do not defend it, recompute. The error: your camera sits at
[2,18,−8], on the VILLAGE side of the wall, but your named detail carrier
is the gate region on the SEA face (z=−20, y 0..15). That face is occluded
from your camera by the wall body itself. Proof: the ray from [2,18,−8] to
the gate centre [0,7.5,−20] crosses z=−12 at [1.33,14.5,−12] — inside the
wall box (x −40..40, y 0..18, z −20..−12). Occluded. Your projection also
modelled no occlusion anywhere, and the "detail pixels" figures were
invented magnitudes, not projections. The gates judge renders, so the
pose must be geometrically sound first.

## Corrected composition space — compute inside it
Put the camera on the SEA side, looking back at the sea face:
- pos: z between −38 and −26, y between 20 and 30, x near 2
  (express as `add(PLACES.SEA,[x,y,z])` or `add(PLACES.COAST_WALL,[x,y,z])`
  offsets — either, but state world coordinates too).
- target: on the sea face / gate, world y between 9 and 13, z −20..−16.
- fov 24–50.

## Hard constraints (verify each with arithmetic, true 1080×1920 frame)
1. COINS: cluster occupies x 1..3.5, y 19.5..21.5, z −17.5 (above the wall
   top, seen from the sea side against the sky). Whole cluster in frame,
   ≥40 px margin from every edge, projected size ≥120 px.
2. WALL-TOP point [2,18,−15.42] in frame.
3. SEA band ≥15% of frame height — the water meets the wall base on the
   sea side (z ≤ −20) and fills the foreground below your camera; state
   the projected y-range of the water in the frame.
4. PUSH PATH: FROM pos is [5.5,2.2,4.2] (village side, low). The sampled
   path is a straight lerp FROM→TO. It must crest the wall: whenever the
   path's z is inside [−20,−12], its y must be ≥18.5. Verify with the lerp
   parameter: at z=−12, t = (4.2+12)/(4.2−z_pos); y(−12) = 2.2 + t·(y_pos−2.2)
   must be ≥18.5. (This bounds y_pos from below given z_pos — respect it.)
5. The gate region (x −3.8..3.8, y 0..15, at the sea face z=−20) must be
   VISIBLE from your camera (no wall-box intersection on the rays — the
   camera is seaward of z=−20, so show the rays stay at z ≤ −20 until the
   face) and project to a substantial frame share (state its bbox).

## Return (same form as before)
1. The pose (film.js syntax) + fov + world coordinates.
2. Projected bboxes: coin cluster, wall-top point, gate region, sea band
   share.
3. Region shares of the frame + the named detail sources ON THE SEA FACE
   (gate leaves, lantern posts at [±3.8,7.5,−14.6] — note these sit in the
   gate passage, mocksign board on the face, wall courses) and an honest
   detail-% direction argument (no invented pixel counts).
4. The path-crest verification numbers from constraint 4.

If the constraints cannot all hold, say which one fails, with the numbers.
