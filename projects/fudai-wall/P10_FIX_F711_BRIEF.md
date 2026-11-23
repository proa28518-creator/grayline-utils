# CODEX SEAT — APPLY BRIEF · phase 10 · cause: F711/F723 BLUEPRINT OCCLUDED BY VILLAGER_4 (SH10)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md §3
(one cause, one change), §4, §5; `lessons/build.md`. This session applies
ONE cause: at F711/F723 villager_4's foreground head covers the blueprint
and the ruler label reads "5M" (critic round 8 BLOCKING; pixel gate:
blueprint occluded 46% geometric / 74% measured-disc). The Opus seat
computed the correction (`P10_OPUS_F711_OUT.md`): shift the SH10 camera
+1.8 D in x so villager_4's disc leaves the frame and the board centres.
(The driver independently re-derived the projections in the true
1080×1920 portrait frame: board x ≈ [149,931], label in frame, villager_4
disc fully out of frame.)

APPLY EXACTLY (`scenes/film.js`, line ~39):
- `CAM_SH10_A=add(BLUEPRINT,[0,3,9])` → `CAM_SH10_A=add(BLUEPRINT,[1.8,3,9])`
- `CAM_SH10_B=add(BLUEPRINT,[0,3,9])` → `CAM_SH10_B=add(BLUEPRINT,[1.8,3,9])`
CAM_SH10_T and fov 48 unchanged. Nothing else.

Then verify: `node --check scenes/film.js`, run
`node tools/audit_staging.mjs` (full) and `node tools/audit_d1_d2.mjs`, and
paste their complete outputs in your reply, plus a diff summary. Do NOT
commit (the driver commits). Do not touch any other file.
