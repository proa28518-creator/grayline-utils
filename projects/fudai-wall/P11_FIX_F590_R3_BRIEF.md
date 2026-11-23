# CODEX SEAT — ITERATION BRIEF · phase 11 · cause: F590 follow-up, ROUND 3 — METHOD CHANGE (SH07B TO POSE — SET BAR)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md §3
(one cause, one change — and: the same fault twice means CHANGE THE
METHOD, not the amount), §4, §5; `lessons/build.md`.

## Previous verdicts this brief cites (hard-gate requirement)
- Round 1 verdict NOT CLOSED: commit `7e14d22` (17.2% detail / 80.3% flat).
- Round 2 verdict NOT CLOSED: commit `8e267aa` (18.6% detail / 77.4% flat).
Trajectory of this cause: 12.1/85.9 → 17.2/80.3 → 18.6/77.4. Two
high-crane compositions improved the numbers and plateaued below the
≥22% detail bar. This round is a METHOD CHANGE: leave the crane family.

## What the two renders proved (read both stills: the current
## probes/chunk2e/stills/frame_0590.png is round 2; round 1's reading is
## in RUN_RECORD phase 11)
- Round 1 (village-side high crane, target over the wall): the wall's
  TOP surface filled the lower ~55% as a near-featureless dark plane.
- Round 2 (sea-side high crane, pos [2,44,-36.5] → target [0,14,-16]):
  the sea FACE foreshortened into one flat dark slab (~45% of frame);
  the projected gate-slot share (55.2%) did NOT survive occlusion and
  foreshortening; the village + figures at the top carried most of the
  measured detail but were small; visible sea was a ~7% bottom strip,
  not the projected 23.8% (projected plane shares ignore occlusion —
  treat them as upper bounds only).
- What HAS carried detail in this film at block scale: faces at
  300–500px (F537/F621), the coin cluster at 300–450px, village figures
  + houses + shadows, the gate/measure/calendar cluster (F345/F414 pass
  the set bar), lantern glow.

## Round-3 families (iterate BOTH with your pipeline sampler; pick the
## winner by the constraints below)
- **Family C1 — through the gate:** camera on/near the gate-passage axis
  from the VILLAGE side at mid height (y ≈ 7–12, z ≈ +4..+10, x ≈ 0–3),
  aimed through the passage (slot x −3.8..3.8, y 0..15, z −20..−12):
  the sea reads THROUGH the slot, gate leaves + both lanterns
  ([±3.8,7.5,−14.6]) frame it, the wall-top edge + coins sit high in
  frame, the village-side face surrounds the slot.
- **Family C2 — along-wall oblique:** village-side mid height
  (y ≈ 6–12), x offset 6–10, aimed diagonally at the wall-top edge where
  the coins spill: mocker_a (at [4,~1.9,0], he just dropped them) large
  at a frame edge, coins mid-frame at the top edge, wall top diagonal,
  village figures/houses behind the camera-side of the wall in frame.
For either family: report the sea's projected share AND where it
appears (through the slot counts); if a family's sea share is <15% of
frame height, say so plainly and let the numbers argue.

## Constraints (unchanged from rounds 1–2 unless stated)
- Coins fully in frame: cluster (aggregate bounds, sampled eased camera
  + drop state at t — Astra batch-2 measurement rule) ≥120px, ≥40px
  margins, and the bounds must hold the actual discs, not empty spacing.
- Wall-top point [2,18,−15.42] in frame.
- Sea visibly present as a band or through the passage (see above).
- fov 24–50. Crest: the FROM pose is village-side low ([5.5,2.2,4.2]);
  if your TO path enters z∈[−20,−12], y ≥18.5 there.
- ONLY the SH07B `to` pose changes.

## Apply + verify
Apply ONLY the final `to` pose to `scenes/film.js`. Run `node --check`,
`node tools/audit_staging.mjs` (full), `node tools/audit_d1_d2.mjs`.
Paste in your reply: the winning pose + family, its projection table
(bboxes + region shares from the SAMPLED camera at t=19.667, cluster
bounds per the measurement rule), the crest check, the complete audit
outputs, and a diff summary. The staging audit's F590 occupancy line
measures the 0.5 D drop box (documented gap) — if it FAILs while your
cluster projection holds, say so explicitly. Do NOT commit. Touch no
other file. If NEITHER family satisfies the constraints, apply NOTHING
and report the measured conflict per family — the cause then escalates
with priced options; a forced pose is worse than an honest conflict.
