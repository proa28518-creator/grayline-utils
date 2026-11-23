# CODEX SEAT — APPLY BRIEF · phase 10 · cause: SH11 FLAT FRAMES (F768/F798/F822) — LEVER 1 OF 2 (THE PARK)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md §3
(one cause, one change), §4, §5; `lessons/build.md`. This session applies
ONE cause: SH11's sky-cycle frames measure ~14% detail / ~81% flat on
pixels (pixel gate) — the current park (camera 40 D up) reads as near-empty
sky/wall. The GLM seat computed the correction (`P9_GLM_SH11_OUT.txt`): a
lower, closer park so the wall face, gate/lantern carriers and sea patch
break the flatness while the sun/moon orbs stay in frame. (Lever 2 of
GLM's proposal — set.js night-sky values — was checked by the driver
against the current set.js and is already in place there; it is NOT part
of this session.)

APPLY EXACTLY (`scenes/film.js`):
- `CAM_SH11=add(PLACES.COAST_VILLAGE,[-5,40,0])` → `CAM_SH11=add(PLACES.COAST_VILLAGE,[-5,14,16])`
- `CAM_SH11_T=add(PLACES.SEA,[-5.5,9,14])` → `CAM_SH11_T=add(PLACES.SEA,[-5,0,18])`
- SH11 shot entry (line ~122): `fov:50` → `fov:34`.
(World result: pos [-5,14,18], target [-5,0,-26], fov 34.) Nothing else —
set.js is NOT touched in this session.

Then verify: `node --check scenes/film.js`, run
`node tools/audit_staging.mjs` (full) and `node tools/audit_d1_d2.mjs`, and
paste their complete outputs in your reply, plus a diff summary. Do NOT
commit (the driver commits). Do not touch any other file.
