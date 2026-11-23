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

Previous cause's verdict commit (hard-gate citation, filled by the driver
at firing): <PENDING — driver fills before this brief fires>.

ASTRA REVIEW INPUT (2026-11-23, batch 2) — the x-offset 1.8 correction is
ADOPTED, with two pre-approval checks that bind this session's verdict:
(i) A head disc out of frame does NOT prove body/arm/palm coverage <10% —
the blueprint's PALM point must be verified uncovered on the re-probed
stills specifically, not inferred from the head.
(ii) ASTRA'S CATCH: hiding only the "1" of "15.5M" would leave "5.5M",
not "5M" — the recorded explanation of the fault is incomplete. On the
re-probed stills, confirm the FULL rendered inscription reads "15.5M".
Camera moves cannot repair wrong underlying text: if the board's rendered
text is itself wrong, STOP and report — do not improvise a fix.

APPLY EXACTLY (`scenes/film.js`, line ~39):
- `CAM_SH10_A=add(BLUEPRINT,[0,3,9])` → `CAM_SH10_A=add(BLUEPRINT,[1.8,3,9])`
- `CAM_SH10_B=add(BLUEPRINT,[0,3,9])` → `CAM_SH10_B=add(BLUEPRINT,[1.8,3,9])`
CAM_SH10_T and fov 48 unchanged. Nothing else.

Then verify: `node --check scenes/film.js`, run
`node tools/audit_staging.mjs` (full) and `node tools/audit_d1_d2.mjs`, and
paste their complete outputs in your reply, plus a diff summary. Do NOT
commit (the driver commits). Do not touch any other file.
