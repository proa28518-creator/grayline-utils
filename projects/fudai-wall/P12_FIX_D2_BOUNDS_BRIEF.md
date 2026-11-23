# CODEX SEAT — BRIEF · phase 12 · cause 2 (set data): HILL_GRAVE bounds vs the distant-wall silhouettes

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md` (you author
ALL code; seat-attribution headers), RULES.md §3 (one cause, one
change), §4 (ONE PLACES table in `scenes/set.js`; no bare coordinates).
**NO LOCAL RENDERS. No fleet dispatch. Audits only.**

## Previous verdict this brief cites (hard-gate requirement)
Commit `b55442e` — phase-12 cause 1 CLOSED (D1 fetch matcher armed
and PASS on the belongings_box entry; recorded in RUN_RECORD
phase 12). No judgement is pending; this brief may fire.

## The cause (one cause, one value)
D1/D2 audit FAILs:
- `D2: prop wall_distant_sh14 at [2400,0,-140] is outside every place's bounds`
- `D2: prop wall_distant_sh26 at [2400,-6,-58] is outside every place's bounds`

Both props ARE PLACES-anchored (`p('HILL_GRAVE',[0,0,-140])` and
`p('HILL_GRAVE',[0,-6,-58])` in `scenes/film.js`) — the D2
no-bare-coordinates law is satisfied. What is stale is the place's
declared bounds: `HILL_GRAVE` in `scenes/set.js` carries
`bounds:{x:[2360,2440],z:[-20,20]}` — written for the hilltop pad
before the horizon-silhouette staging existed. That staging is
SETTLED and may not move: Qwen's SH14 design places an 18 D seawall
silhouette 140 D seaward on the hill's horizon, and Layla ruled
ACCEPT (the literal 2400 D sightline is geometrically impossible;
the beat needs a wall on the horizon). SH26's silhouette sits 58 D
seaward on the same horizon line.

Driver verification (evidence for the disposition): `bounds` is
consumed ONLY by `tools/audit_d1_d2.mjs`'s zone audit — no renderer,
post, shade, or set-build code reads it (grep `.bounds` across
`scenes/` and `lib/`: no consumer). Extending the bounds therefore
changes NO rendered pixel; it makes the bookkeeping honest.

## The change (exactly this, nothing else)
In `scenes/set.js`, HILL_GRAVE only: `bounds.z` from `[-20,20]` to
`[-150,20]` (covers both silhouettes: −140 and −58; x already inside
[2360,2440]). Add a one-line comment at the entry recording why
(horizon silhouettes at z −140/−58, Layla's accepted staging,
2026-11-23). Refresh the seat-attribution note if the file carries
one. Do NOT move the props, do NOT touch any other place, any other
value, or any other file.

## Verify + reply
Run `node --check scenes/set.js`, `node tools/audit_d1_d2.mjs`, and
`node tools/audit_staging.mjs` (full). In your reply paste: the diff
and the complete D1/D2 output. Expected: both D2 bounds FAILs gone;
the remaining FAILs are exactly the two D2-CLEAR town-hall items
(SH13/SH16); the staging audit's chunk-2 section still reads 19/19
and chunk 3 still reads 17/40 (this change must not alter any moment
reading). If anything else moves, STOP and report it — do not tune.
Do NOT commit.
