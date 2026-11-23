# CODEX SEAT — APPLY BRIEF · phase 10 · cause: CALENDAR OCCLUDED BY CRANE_B (F345/F414)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md §3
(one cause, one change), §4, §5; `lessons/build.md`. This session applies
ONE cause: crane_b's box covers the calendar's legibility rect 100% at
F345/F414 (pixel gate). The Luna seat's iterated correction
(`P10_LUNA_CALENDAR_OUT.txt`): relocate crane_b east and turn its jib away.

APPLY EXACTLY (the crane_b entry in `scenes/film.js`, line ~95 — the base
entry AND its `line:4.start` key both carry the same at/rot; change BOTH
occurrences, they are the one placement):
- `at:add(PLACES.COAST_WALL,[13,0,3]),rot:[0,-20,0]` →
  `at:add(PLACES.COAST_WALL,[17.5,0,4]),rot:[0,-90,0]`
Nothing else: crane_a, calendar, measure, money, cameras unchanged.

Then verify: `node --check scenes/film.js`, run
`node tools/audit_staging.mjs` (full) and `node tools/audit_d1_d2.mjs`, and
paste their complete outputs in your reply, plus a diff summary. Do NOT
commit (the driver commits). Do not touch any other file.
