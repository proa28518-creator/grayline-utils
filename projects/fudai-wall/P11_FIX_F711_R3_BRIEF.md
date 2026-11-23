# CODEX SEAT — ITERATION BRIEF · phase 11 · cause: F711/F723, ROUND 3 — CLEAR THE PLATE, VALIDATED SAMPLER ONLY (SH10)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md §3,
§4, §5; `lessons/build.md` (read the sampler-validation lesson first).

**HARD RULE (guard flag 6): NO LOCAL RENDERS.** Sampler + audits only;
the driver fleet-probes and judges.

## Previous verdicts this brief cites (hard-gate requirement)
- Round 1 NOT CLOSED: commit `4fca63b` (villager_4 fixed; plate still
  occluded by mocker_c's head; set bar PASS; palm visible).
- Round 2 NOT CLOSED — REGRESSION, REVERTED: commit `d9d01f5`. The
  round-2 seat's sampler placed cast discs from BASE positions instead
  of the keyed posAt(t); it certified a park (z 8.5) whose render puts
  villager_4's face over ~85% of the frame. film.js stands REVERTED to
  the round-1 park: CAM_SH10_A/B = BLUEPRINT+[1.8,3,9],
  CAM_SH10_T = BLUEPRINT+[0,1.55,0], fov 48.

## VALIDATION FIRST (your sampler earns trust before it searches)
Cast positions MUST come from the audit's own posAt(id, t) (keyed),
discs from the pixel gate's model (1.35× the cast sphere, projected
with the audit's screen()). Before presenting ANY candidate, reproduce
these two known readings for the CURRENT (round-1) park and paste them:
(a) the staging audit's CAM lines for F711/F723;
(b) the pixel gate's geometric occlusion reading for F711/F723 at the
current park: blueprint overlap 17% by mocker_c (villager_4 ~0%).
If your sampler cannot reproduce (b) within a few points, STOP and
report that — do not search with an unvalidated sampler.

## The search (only after validation reproduces)
Vary the SH10 park around the round-1 values (CAM_SH10_A/B offsets,
CAM_SH10_T, fov 24–50). A winner must satisfy, at BOTH t=23.70 and
t=24.10, computed with the VALIDATED model:
- the label plate's projected bbox (geometry from
  `scenes/props/blueprint.js`) is clear of mocker_c's disc by ≥30px
  and fully in frame (≥20px margins) — the full "15.5M" must read;
- villager_4's disc overlap with the board's legibility rect <10%
  (the gate's formula), and his disc does not cover the plate either;
- board projected ≥700px; staging audit F711/F723 checks PASS
  (blueprint, line, palm, ruler, label points in frustum).

## Apply + verify
Apply ONLY the winning SH10 values to `scenes/film.js`. Run
`node --check`, `node tools/audit_staging.mjs` (full),
`node tools/audit_d1_d2.mjs`. Paste in your reply: the validation
reproduction (a)+(b), the winning values, the projection table (board,
plate, both discs' clearances at both t), the complete audit outputs,
and a diff summary. Do NOT commit. Touch no other file. If no park
satisfies all conditions, apply NOTHING and report the measured
conflict per disc.
