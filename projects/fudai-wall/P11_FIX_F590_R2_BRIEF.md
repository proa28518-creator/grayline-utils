# CODEX SEAT — ITERATION BRIEF · phase 11 · cause: F590 follow-up, ROUND 2 (SH07B TO POSE — SET BAR)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md §3
(one cause, one change), §4, §5; `lessons/build.md`.

## Previous verdict this brief cites (hard-gate requirement)
Commit `7e14d22` (RUN_RECORD phase 11): F590 follow-up ROUND 1 verdict
**NOT CLOSED** — pixel gate (driver-harness) on the fleet still from
run 45107419329 measures **17.2% detail / 80.3% flat** (improved from
12.1% / 85.9%; the bar is ≥22% detail / ≤78% flat). This session is
round 2 of the SAME cause. Nothing else is in flight.

## Where round 1 landed (applied in commit `b023171`)
SH07B `to` = pos COAST_VILLAGE+[2,27.5,-8] (world [2,27.5,-6]), target
COAST_WALL+[0,14,-10] (world [0,14,-26]), fov 46. Sampled pipeline pose
at t=19.667: pos [2.51,23.84,-4.52], target [0.14,13.06,-24.55].

## What the render actually shows (driver eye on frame_0590.png — read it)
- Coins: fully in frame with margins, mid-top, complete cluster — the
  coin goal HOLDS. Do not regress it (cluster ≥120px, ≥40px margins).
- Sea: a ~12% band — can grow or shrink within ≥15% of frame height in
  projection terms (the gate's shot bar is detail/flat; keep the sea
  visibly a band).
- The wall fills the lower ~55% as its TOP surface: a dark paved plane
  with a few diagonal joint lines and ONE glowing lantern at the right
  edge. It reads FLAT — the top surface's features are too large-scale
  for the 32×32 detail blocks. The gate passage and the sea face never
  read. That is the remaining gap: ~4.8 detail points.

## Round-2 direction (iterate with your projection sampler, as round 1)
Change the carrier from the top surface to the gate + face:
- Centre the frame on the GATE SLOT where it crosses the wall
  (x −3.8..3.8, the passage through z −20..−12) with BOTH lantern posts
  ([±3.8,7.5,−14.6], glowing) in frame — lantern glow + passage edges +
  gate leaves are high-frequency content.
- Tighten the fov (try 34–40) and/or lower the aim so the sea face's
  upper portion enters the lower frame over the top edge (grazing
  view), shrinking the flat top-surface share.
- The caption element («البحر؟») is the film's caption layer, not
  staging — ignore it.
Constraints from round 1 stand unchanged: coins whole (≥40px margins,
≥120px), wall-top point [2,18,−15.42] in frame, sea band ≥15% of frame
height in projection, fov 24–50, crest (path y ≥18.5 while z∈[−20,−12],
or the path never enters that z-range), ONLY the SH07B `to` pose changes.

## Apply + verify
Apply ONLY the final `to` pose to `scenes/film.js`. Run `node --check`,
`node tools/audit_staging.mjs` (full), `node tools/audit_d1_d2.mjs`.
Paste in your reply: the winning pose, its projection table (bboxes +
region shares, incl. the gate slot + both lanterns), the crest check,
the complete audit outputs, and a diff summary. Note: the staging
audit's F590 occupancy line measures the 0.5 D drop box — if it FAILs
while your cluster projection holds ≥120px with margins, say so
explicitly (documented cluster-box gap; the pixel gate judges).
Do NOT commit. Touch no other file. If no candidate satisfies the
constraints, apply NOTHING and report the measured conflict.
