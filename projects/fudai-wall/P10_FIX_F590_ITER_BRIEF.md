# CODEX SEAT — ITERATION BRIEF · phase 10 · cause: F590 (SH07B TO POSE) — restore the wall-top check

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md §3
(one cause, one change), §4, §5; `lessons/build.md`. ONE cause only:
SH07B's TO pose.

STATE: the Opus correction is applied — SH07B `to` is now
`{pos:add(PLACES.COAST_VILLAGE,[2,24,-18]),target:add(PLACES.COAST_WALL,[2,16,-22]),fov:28}`.
The staging audit on it reads: `F590 | SH07B | FAIL | coins PASS 385px
corners 8/8; wall top FAIL point out frustum` (sampled pose pos
[2.51, 20.84, -13.08], target [1.86, 14.77, -34.81], fov 31.19 — the
loader's lowCams/autoMove rest adjusts the authored pose; judge ONLY by
the audit's sampled rows). Before this change, the old TO pose
(`[2,21.5,-15]` / `[2,19.5,-19]` / fov 24) passed BOTH coins (333px) and
wall top — but on the RENDER the coin cluster was cropped at the top edge
and the frame was ~60% empty blue, which is why the pose changed.

YOUR TASK: adjust ONLY the SH07B `to` pose (its pos offsets, target
offsets, fov — in `scenes/film.js`, the SH07B shot entry) until the
staging audit's F590 moment reads FULL PASS (coins ≥230px with corners,
wall top point in frustum, occupancy PASS) while keeping the frame's
intent: the coin cluster (drop point [2.10,19.73,-17.50], rendered cluster
~1 D above it) high in frame and sea visible low in frame. Iterate
candidate values against `node tools/audit_staging.mjs` inside this
session (expect the sampled pose to differ from the authored one — aim
with the sampled rows). Known background, NOT yours to fix: F669/F687
(SH09) fail in the audit by a recorded model gap; everything else passes.

Constraints: fov grammar [24,50]; SH07B's `from` pose and every other shot
untouched; the final diff must be the SH07B `to` pose only. When the audit
reads F590 FULL PASS, stop, paste the F590 audit rows (before/after) and
the final diff in your reply. Do NOT commit (the driver commits). If no
value in the grammar satisfies coins + wall top together, say so with the
closest candidate's measured rows.
