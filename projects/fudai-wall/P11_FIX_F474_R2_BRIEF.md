# CODEX SEAT — ITERATION BRIEF · phase 11 · cause: F474 (SH06 NEIGHBOUR ESTABLISHING VIEW), ROUND 2

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md §3
(one cause, one change), §4, §5; `lessons/build.md`.

## Previous verdict this brief cites (hard-gate requirement)
Commit `7472ecf` (RUN_RECORD phase 11): F474 round 1 verdict NOT CLOSED.
The GLM-computed values (applied in `e614f0a`: CAM_SH06_A/B =
NEIGHBOR_COAST+[∓12,9,18], targets [0,4,2], fov 34) REGRESSED the frame:
pixel gate (seat-authored) **12.0% detail / 87.2% flat** (old pose:
13.7% / 85.1%). This session is round 2 of the SAME cause. Nothing else
is in flight.

## What the round-1 render shows (read probes/chunk2e/stills/frame_0474.png)
The flat dark neighbour wall still dominates (~55% of frame). The left
"10M" sign is complete but sits ON the left frame edge; the right sign
is cropped to "10". No houses read in front of the wall — one roof
corner at the bottom edge. The staging audit on the applied tree agrees:
F474 neighbour houses FAIL 0/1 (was PASS 1/1 on the old park), wall
1357px, stickers 167/191px at corners 4/8.

## Governing spec (Astra review batch 2 — the correction for this cause)
Root cause: the camera sits on the WRONG SIDE of the occluding surface
for an establishing beat. The single correction is an ELEVATED
VILLAGE-SIDE OBLIQUE ESTABLISHING VIEW:
- the neighbour HOUSES read IN FRONT of the wall (mid-ground, readable
  as houses — the audit's `neighbour houses` check must PASS, and the
  composition must show them, not a roof corner);
- the COMPLETE "10M" sign(s) inside the safe area (≥40px margins; the
  audit's sticker checks at corners 8/8);
- the wall present as the beat's subject but NOT a flat dominant slab —
  §5 shot bar is the floor: SH06 median ≥22% detail / ≤78% flat on the
  pixel gate, judged on the render.
Geography (from set.js / the audit): NEIGHBOR_COAST anchor [600,0,0];
the neighbour wall stands at the anchor's seaward side (its face toward
the village), houses on the village side. SH06 is a push from
CAM_SH06_A to CAM_SH06_B with shared targets TA/TB; F474 (t=15.80) is
the audit's key frame — your sampled pose AT t must satisfy the spec,
and the push's endpoints must not swing the composition out of it.

## Your method — iterate against the pipeline's own projection
Reuse the sampler pattern from the F590 iterations (the audits' own
preamble: resolver/lowCams/autoMove/screen) in /tmp. Check occlusion
against the actual set solids (the audits' D2-CLEAR list + the wall
box) — projected shares are upper bounds only (lessons). You may change
CAM_SH06_A, CAM_SH06_B, CAM_SH06_TA, CAM_SH06_TB and the SH06 fov
(24–50) — nothing else in the film.

## Apply + verify
Apply ONLY the final SH06 camera values to `scenes/film.js`. Run
`node --check`, `node tools/audit_staging.mjs` (full),
`node tools/audit_d1_d2.mjs`. Paste in your reply: the winning values,
the sampled-at-t projection table (wall, both stickers, houses — with
occlusion notes), the complete audit outputs, and a diff summary.
Do NOT commit. Touch no other file. If no candidate satisfies the spec,
apply NOTHING and report the measured conflict.
