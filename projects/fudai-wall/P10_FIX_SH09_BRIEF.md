# CODEX SEAT — APPLY BRIEF · phase 10 · cause: SH09 HEAD CROP (F669/F687)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md §3
(one cause, one change), §4, §5; `lessons/build.md`. This session applies
ONE cause: on SH09's close push-in the mayor's rendered head disc sits
~590 px above the audit projection and is cropped by the top edge at
F669/F687 (pixel-measured). The Luna seat computed the correction
(`P10_LUNA_HEADS_OUT.txt`, sub-cause A): a single const change.

APPLY EXACTLY:
- `scenes/film.js`: `CAM_SH09_T=add(PLACES.COAST_VILLAGE,[0,1.55,0])` →
  `CAM_SH09_T=add(PLACES.COAST_VILLAGE,[0,0.635,0])`. Nothing else —
  CAM_SH09_A / CAM_SH09_B / fovs unchanged; MAYOR_HEAD is a different const
  and is NOT touched.

Then verify: `node --check scenes/film.js`, run
`node tools/audit_staging.mjs` (full) and `node tools/audit_d1_d2.mjs`, and
paste their complete outputs in your reply, plus a diff summary. Do NOT
commit (the driver commits). Do not touch any other file.
