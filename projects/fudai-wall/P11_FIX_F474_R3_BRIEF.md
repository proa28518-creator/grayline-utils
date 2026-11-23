# CODEX SEAT — ITERATION BRIEF · phase 11 · cause: F474 (SH06), ROUND 3 — METHOD CHANGE: LOW OBLIQUE LAYERED COMPOSITION

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md §3
(one cause, one change; the same fault twice changes the METHOD), §4,
§5; `lessons/build.md`.

**HARD RULE FOR THIS SESSION: NO LOCAL RENDERS.** Do not run any render,
board script, screenshot tool, or suite page on this machine — a prior
session was killed for exactly that (standing condition: heavy work
runs on the fleet only; this VM is controller + QC). Your evidence is
the pipeline sampler + the audits. The driver fleet-probes and judges.

## Previous verdicts this brief cites (hard-gate requirement)
- Round 1 NOT CLOSED: commit `7472ecf` (GLM reframe regressed to
  12.0%/87.2%).
- Round 2 NOT CLOSED: commit `c3cfc9f` (static centred park
  [0,14,20]/[0,5,5]/fov 50: staging PASS incl. houses 1/1 and both
  stickers 8/8, but the render measures **12.9% detail / 86.6% flat**).
Trajectory: 13.7 → 12.0 → 12.9. Elevated/centred framings cannot fix
this frame. This round changes the METHOD.

## What the round-2 render proves (read probes/chunk2e/stills/frame_0474.png)
Three giant flat regions: dark wall (top ~40%), sand band, and ONE
neighbour house as a huge flat solid with a diamond roof (bottom
centre). Both "10M" signs ARE complete with margins — keep that. The
audit's houses check is a projected-point test; the houses do not READ
as a village. The neighbour set's solids are flat-shaded: detail can
only come from LAYERING — overlapping edges, rooflines at different
depths, shadows, the wall + signs behind.

## Round-3 method (iterate with your sampler; sampled pose at t=15.80 governs)
- LOW OBLIQUE: camera height y ≤ 6.5, on a DIAGONAL axis — the camera's
  x offset from the target axis ≥ 8 D, so the street/houses run
  diagonally through the frame instead of front-on.
- LAYERS in frame at F474: (i) a foreground house edge/roofline crossing
  the lower frame; (ii) at least one more house at mid depth, offset
  from the first; (iii) the neighbour wall behind/above them with BOTH
  "10M" stickers complete (≥40px margins, audit corners 8/8) and the
  audit's neighbour-houses check PASS.
- The wall must not exceed ~45% of the frame's flat area by projection;
  sand/apron must not form a single band > ~25% of frame height.
- SH06 is a push A→B: both endpoints must keep the layering (no swing
  into a front-on flat view at either end). fov 24–50.
- You may change CAM_SH06_A, CAM_SH06_B, CAM_SH06_TA, CAM_SH06_TB and
  the SH06 fov — nothing else.

## Apply + verify
Apply ONLY the final SH06 values to `scenes/film.js`. Run
`node --check`, `node tools/audit_staging.mjs` (full),
`node tools/audit_d1_d2.mjs` — audits only, NO renders. Paste in your
reply: the winning values, the sampled-at-t projection table (wall,
both stickers, each house layer, with occlusion notes), the complete
audit outputs, and a diff summary. Do NOT commit. Touch no other file.
If no candidate satisfies the spec, apply NOTHING and report the
measured conflict — the cause then escalates with priced options.
