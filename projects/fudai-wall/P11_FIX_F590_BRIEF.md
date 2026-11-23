# CODEX SEAT — ITERATION BRIEF · phase 11 · cause: F590 follow-up (SH07B TO POSE — SET BAR)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md §3
(one cause, one change), §4, §5; `lessons/build.md`.

## Previous verdict this brief cites (hard-gate requirement)
Commit `9b7bd6d` (verdict recorded in RUN_RECORD phase 10): SH09B CLOSED.
The cause before it, F590, stands NOT CLOSED (verdict commit `d98654d`):
its goals are met on the render (coins fully in frame, sea a wide band)
but the frame fails §5's set bar — pixel gate (driver-harness) measures
**12.1% detail / 85.9% flat**; the SH07B shot bar needs ≥22% / ≤78%.
This session is that follow-up cause, and nothing else.

## The cause
ONE change: SH07B's `to` pose in `scenes/film.js` (line ~118). Current:
`to:{pos:add(PLACES.COAST_VILLAGE,[2,24,-18]),target:add(PLACES.COAST_WALL,[2,5,-22]),fov:50}`
(world pos [2,24,-16], target [2,5,-38]). The `from` pose, SH07, and
everything else stay untouched. On the current render (frame_0590.png in
probes/chunk2e/stills/) the frame is sky + coins at the top, a sea band,
a tan strip, a dark foreground — the seawall itself never appears.

## Your method — iterate against the pipeline's own projection
Seat computes for this cause failed three times on hand arithmetic
(occlusion-blindness, transposed frames, wrong bases). Do NOT hand-derive
projections. Use the project's own pipeline: the geometry preamble of
`tools/audit_staging.mjs` / `tools/audit_pixels.mjs` (resolver, lowCams,
autoMove, and their screen-projection) samples poses exactly as the
render does. Write a THROWAWAY analysis script (in /tmp, never in the
repo) that, for a candidate TO pose, samples SH07B at t=19.667 s and
projects: the coin cluster bounds, the wall-top point, the seawall box
faces, the gate region, and the sea plane — and prints each one's
frame bbox + the frame's region shares.

## Constraints for the final pose (all must hold in your projection)
- Coins: cluster occupies x 1..3.5, y 19.5..21.5, z −17.5. Whole cluster
  in frame, ≥40 px margin from every edge, projected size ≥120 px.
- Wall-top point [2,18,−15.42] in frame.
- Sea: a visible band ≥15% of frame height.
- DETAIL CARRIER: the seawall (its top surface and/or sea face and/or
  the gate area x −3.8..3.8) must occupy ≥25% of the frame, centrally —
  this is the point of the cause.
- fov within 24–50. pos/target expressed in film.js as
  `add(PLACES.<anchor>,[x,y,z])` like the current entry.
- Path: the FROM→TO lerp (FROM pos [5.5,2.2,4.2]) must keep y ≥ 18.5
  whenever its z is inside [−20,−12], or never enter that z-range.

## Apply + verify
Apply ONLY the final `to` pose values to `scenes/film.js`. Then run
`node --check scenes/film.js`, `node tools/audit_staging.mjs` (full) and
`node tools/audit_d1_d2.mjs`, and paste in your reply: the winning pose,
its projection table (bboxes + region shares), the crest check, and the
complete audit outputs, plus a diff summary. Do NOT commit (the driver
commits). Do not touch any other file. If no candidate satisfies all
constraints, apply NOTHING and report the measured conflict instead.
