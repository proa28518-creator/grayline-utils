# CODEX SEAT — APPLY BRIEF · phase 10 · cause: F474 FLAT WALL + EDGE-CROPPED 10M SIGN (SH06)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md §3
(one cause, one change), §4, §5; `lessons/build.md`. This session applies
ONE cause: at F474 a flat dark wall dominates the frame (pixel gate: set
13.7% detail / 85.1% flat) and the right 10M sign is edge-cropped. The GLM
seat computed the correction (`P9_GLM_F474_OUT.txt`): reframe SH06 wider
and lower-fov so both 10M signs and the neighbour houses read.

Previous cause's verdict commit (hard-gate citation, filled by the driver
at firing): `ec01786` — F590 follow-up round-3 verdict NOT CLOSED
(measured conflict, escalated to Layla with priced options; cause parked
at its round-2 pose). No judgement is pending: this brief may fire.

ASTRA REVIEW INPUT (2026-11-23, batch 2) — GOVERNING: the root cause is
that the camera sits on the WRONG SIDE of the occluding surface for an
establishing beat. The single correction is an ELEVATED VILLAGE-SIDE
OBLIQUE ESTABLISHING VIEW: houses read IN FRONT of the wall, and the
complete "10M" sign sits inside the safe area. The GLM values below are
the mechanism (village-side, elevated, oblique); the verdict on the
re-probed stills must confirm that composition by eye — houses in front
of the wall, full "10M" inscription inside the safe area — and the SHOT
MEDIAN decides the set bar (this fix is not an automatic pass). If the
applied values do not achieve that composition, report it; do not
improvise different values in this session.

APPLY EXACTLY (`scenes/film.js`):
- `CAM_SH06_A=add(PLACES.NEIGHBOR_COAST,[-10,8.5,15])` → `add(PLACES.NEIGHBOR_COAST,[-12,9,18])`
- `CAM_SH06_B=add(PLACES.NEIGHBOR_COAST,[10,8.5,15])` → `add(PLACES.NEIGHBOR_COAST,[12,9,18])`
- `CAM_SH06_TA=add(PLACES.NEIGHBOR_COAST,[0,4,3])` → `add(PLACES.NEIGHBOR_COAST,[0,4,2])`
- `CAM_SH06_TB=add(PLACES.NEIGHBOR_COAST,[0,4,3])` → `add(PLACES.NEIGHBOR_COAST,[0,4,2])`
- SH06 shot entry (line ~116): `fov:50` → `fov:34` in BOTH the from and to poses.
(World result: from [588,9,18] → to [612,9,18], target [600,4,2], fov 34.)
Nothing else.

Then verify: `node --check scenes/film.js`, run
`node tools/audit_staging.mjs` (full) and `node tools/audit_d1_d2.mjs`, and
paste their complete outputs in your reply, plus a diff summary. Do NOT
commit (the driver commits). Do not touch any other file.
