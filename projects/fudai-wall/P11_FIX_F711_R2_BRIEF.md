# CODEX SEAT — ITERATION BRIEF · phase 11 · cause: F711/F723, ROUND 2 — CLEAR THE LABEL PLATE (SH10)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md §3
(one cause, one change), §4, §5; `lessons/build.md`.

**HARD RULE (guard flag 6): NO LOCAL RENDERS.** No render, board script,
screenshot tool, or suite page on this machine. Sampler + audits only;
the driver fleet-probes and judges.

## Previous verdict this brief cites (hard-gate requirement)
Commit `4fca63b` (RUN_RECORD phase 11): F711/F723 round 1 verdict
NOT CLOSED. The +1.8 x shift (applied `16de58d`) FIXED villager_4's
occlusion: board centred, set bar PASS (SH10 median 37.6% detail),
line/ruler read, the mayor's palm visible at the ruler's right edge.
What remains: the ruler's LABEL PLATE at the board's top-right still
reads "5M" — "15." is hidden behind **mocker_c's** head (he stands
behind the board, head above its top edge). The pixel gate's
measured-disc test reads 0% on this because its blueprint legibility
rect excludes the plate — a recorded blind spot; the EYE is the judge
for the plate. This session is round 2 of the SAME cause.

## Your task — iterate with the pipeline sampler
Find SH10 camera values (CAM_SH10_A/B, CAM_SH10_T; fov may move within
24–50) such that at BOTH F711 (t=23.70) and F723 (t=24.10):
- the label plate's projected bbox (extract its world geometry from
  `scenes/props/blueprint.js` — the plate rides at the ruler's top)
  is FREE of every cast member's projected head disc (use the
  calibrated disc model: centre + the 1.35× occlusion disc the pixel
  gate uses, and report the plate-vs-disc clearance in px);
- the full inscription "15.5M" would read: plate fully in frame with
  ≥20px margins;
- the board stays large (projected ≥700px) and centred-ish; the
  blueprint line point, ruler point and PALM point stay in frustum
  (the staging audit's F711/F723 checks must PASS);
- villager_4 does not return over the board (his disc stays off the
  board's legibility rect, overlap <10%).
SH10's camera is STATIC (A and B sample the same park) — one park must
satisfy both frames; the cast moves between them, so check the discs
at both t values.

## Apply + verify
Apply ONLY the final SH10 camera values to `scenes/film.js`. Run
`node --check`, `node tools/audit_staging.mjs` (full),
`node tools/audit_d1_d2.mjs`. Paste in your reply: the winning values,
the sampled projection table (board, plate bbox, every cast disc near
the board, clearances at both t), the complete audit outputs, and a
diff summary. Do NOT commit. Touch no other file. If no park clears
the plate at both frames, apply NOTHING and report the measured
conflict (which disc, at which t, by how much).
