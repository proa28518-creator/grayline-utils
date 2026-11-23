# CODEX SEAT — APPLY BRIEF · phase 10 · cause: F590 COINS CROPPED / NO SEA (SH07B TO POSE)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md §3
(one cause, one change), §4, §5; `lessons/build.md`. This session applies
ONE cause: at F590 the rendered coin cluster is cropped at the frame's top
edge and ~60% of the frame is empty blue (pixel gate: set 14.5% detail /
84.4% flat). The Opus seat computed the correction
(`P9_OPUS_F590_OUT.md`): raise and re-aim SH07B's TO pose so the coin
cluster sits fully in frame and the sea band enters the lower frame.

APPLY EXACTLY — SH07B's `to` pose, INLINE in the SH07B shot entry
(`scenes/film.js`, line ~118):
- `to:{pos:add(PLACES.COAST_VILLAGE,[2,21.5,-15]),target:add(PLACES.COAST_WALL,[2,19.5,-19]),fov:24}`
  → `to:{pos:add(PLACES.COAST_VILLAGE,[2,24,-18]),target:add(PLACES.COAST_WALL,[2,16,-22]),fov:28}`
Nothing else: SH07B's from pose (= SH07's to pose) unchanged.

Then verify: `node --check scenes/film.js`, run
`node tools/audit_staging.mjs` (full) and `node tools/audit_d1_d2.mjs`, and
paste their complete outputs in your reply, plus a diff summary. Do NOT
commit (the driver commits). Do not touch any other file.
