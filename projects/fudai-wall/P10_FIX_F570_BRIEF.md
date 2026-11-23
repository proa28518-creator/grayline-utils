# CODEX SEAT — APPLY BRIEF · phase 10 · cause: F570 MOCKER ILLEGIBLE (SH07 TO POSE)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md §3
(one cause, one change), §4, §5; `lessons/build.md`. This session applies
ONE cause: at F570 mocker_a renders as an illegible back-of-head against
the blueprint grid (critic rounds 7+8; pixel gate: no skin disc segments).
The GLM seat computed the correction (`P9_GLM_F570_OUT.txt`): move SH07's
TO camera pose village-side/east so the camera stands south-east of
mocker_a and his face turns to it; the wall-top point stays in frame.

APPLY EXACTLY — the SH07 `to` pose is written INLINE in the SH07 shot entry
(`scenes/film.js`, line ~117) and duplicated as SH07B's `from` pose
(line ~118); the two copies are ONE shared pose and change together:
- `to:{pos:add(PLACES.COAST_VILLAGE,[5.5,2.2,2.2]),target:add(PLACES.COAST_WALL,[1,7.5,0]),fov:50}` (SH07)
  → `to:{pos:add(PLACES.COAST_VILLAGE,[3.6,2.6,-4.6]),target:add(PLACES.COAST_WALL,[1,7.5,0]),fov:50}`
- `from:{pos:add(PLACES.COAST_VILLAGE,[5.5,2.2,2.2]),target:add(PLACES.COAST_WALL,[1,7.5,0]),fov:50}` (SH07B)
  → `from:{pos:add(PLACES.COAST_VILLAGE,[3.6,2.6,-4.6]),target:add(PLACES.COAST_WALL,[1,7.5,0]),fov:50}`
(World result: pos [3.6,2.6,-2.6], target [1,7.5,-16] — the target const is
unchanged in value; only the pos offset changes.) Nothing else: SH07's
from pose (F537), mocker_a's look keys, SH07B's to pose (F590) unchanged.

Then verify: `node --check scenes/film.js`, run
`node tools/audit_staging.mjs` (full) and `node tools/audit_d1_d2.mjs`, and
paste their complete outputs in your reply, plus a diff summary. Do NOT
commit (the driver commits). Do not touch any other file.
