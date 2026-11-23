# CODEX SEAT — BRIEF · phase 12 · cause 3: chunk-3 cast placement — restore the packages' dropped `place` keys (+ the staging audit's place semantics)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md` (you author
ALL code; seat-attribution headers), RULES.md §3 (one cause, one
change), §4 (pure in t; PLACES-anchored staging). **NO LOCAL RENDERS.
No fleet dispatch. Audits only.**

## Previous verdict this brief cites (hard-gate requirement)
Commit `76f035b` — phase-12 cause 2 CLOSED (HILL_GRAVE bounds).
D1/D2 stands at FAIL (2) — the two D2-CLEAR town-hall items, which
are later causes. No judgement is pending; this brief may fire.

## The cause (ONE mechanism, two files)
The chunk-3 merge translated the Qwen/Hydrogen packages' cameras and
audit moments but DROPPED their cast `place` keys — the engine's
native placement mechanism (`engine/compose.js`: a timeline may carry
`place: [{t, at:[x,z], ry?, y?}]`; `engine/height.js` addPlace: at the
key's t the root SNAPS to the place — "a place key: a snap, nothing
slides" — ry = key's ry ?? previous ry, y = key's y ?? 0). Characters
the packages placed per-shot therefore stand at their cast bases in
the merged film, and four audit moments judge staging that was never
applied: F1518/F1542 (mayor_young, SH20), F1716 (workers, SH22 —
in the merged film they stand at the wall's base on the ground; the
packages place them ON the wall top, y 17→18), F1980 (mocker_a,
SH26). The staging audit's `posAt`/`faceAt` also omit place keys
entirely, so the gate cannot see the mechanism even when present —
this cause restores BOTH sides of the same gap: the film's keys
(faithful to the chunk records) and the audit's reconstruction of
the loader semantics (a measure completion, documented as such —
the phase-8/10 precedent: the tool must measure what the loader does).

## Part 1 — `scenes/film.js`: restore the place/look keys, values verbatim from `.suite/chunks/CHUNK3B_HYDROGEN_REPLY.md`
Express every point PLACES-anchored in the film's established style
(the CAST3 `p('PLACE',[dx,dy,dz])` pattern; a place key's `at` is the
[x,z] pair, `y` separate — mirror `engine/height.js` addPlace).
- **mayor_young** (his ACTS3 entry): add
  `place:[{t:'line:18.start', at: FLASHBACK_ROCK+[0.9,·,-1.10] (x,z)}]`;
  append look keys `{t:'line:18.start', at: FLASHBACK_ROCK+[-1.4,1.68,-0.60]}`
  and `{t:50.60, at: FLASHBACK_ROCK+[-0.4,1.65,-1.85]}` (POS_SH20_LINE).
  His existing line:17 look/face keys stay untouched (SH19 is Qwen's
  staging and reads PASS at F1367).
- **workers** (his ACTS3 entry): add
  `place:[{t:'line:20.start', at: COAST_WALL+[0,·,0.20] (x,z), y:17},
          {t:57.10, at: COAST_WALL+[0,·,0.20] (x,z), y:18}]`;
  correct his look key to Hydrogen's value
  `COAST_WALL+[0,17.5,12]` (the merge wrote [0,.5,12] — a translation
  error; restore the record).
- **mocker_a / mocker_b / mocker_c** (their inline acts in the film
  object): add `place:[{t:'line:24.start', at: HILL_GRAVE+[-0.95,·,-0.60]}]`
  for a, `[+0.95,·,-0.60]` for b, `[0,·,-1.30]` for c (x,z pairs);
  add/append look key `{t:'line:24.start', at: HILL_GRAVE+[0,1.00,1.00]}`
  (LOOK_SH26_GRAVE) for each. Their chunk-2 acts (faces, walks, clips,
  looks) stay byte-identical apart from these additions.
- NOT changed, verified equal already (state this in your reply):
  child (CAST3 base = POS_SH21_CHILD, ACTS3 look = LOOK_SH21_CHILD);
  villagers (the merge already pins POS_SH25_VILLAGERS via a
  degenerate walk at (0,6); no place key needed).

## Part 2 — `tools/audit_staging.mjs`: teach `posAt`/`faceAt` the loader's place semantics
- Resolve a character's governing root event at t from base / walks /
  places in time order (renderer order at equal t: place, then walk —
  a walk starting exactly on a place key starts from the new place;
  the audit's walks carry absolute paths, so on a tie the walk's path
  governs position, as today).
- If the governing event is a place key: position = [at[0], y ?? 0,
  at[1]] (snap, no travel). `posAt` returns [x, y, z] with y = 0 for
  base/walk governance (today's behaviour); `faceCheck`'s head centre
  becomes [p[0], p[1] + 1.9, p[2]] and the body/occupancy boxes centre
  at p[1] + 1 — identical numbers for every ground character (y = 0).
- `faceAt`: if the governing event is a place (or no event), use the
  existing look branch (last look key ≤ t, else cast ry). If a walk
  governs, keep today's walk-direction branch EXACTLY (chunk 2's
  calibrated readings depend on it).
- Header note: cite this brief + the engine sources
  (compose.js place layer, height.js addPlace) as the semantics'
  origin. This is a measure completion, NOT a threshold change: no
  moment, threshold, or check formula changes.

## Validation (all required in your reply)
1. `node --check` on both files; `node tools/audit_d1_d2.mjs` —
   must still read FAIL (2), the same two D2-CLEAR items.
2. `node tools/audit_staging.mjs` full: chunk 2 must read **19/19
   PASS, every line unchanged**; chunk 3 changes confined to
   F1518/F1542/F1716/F1980 (F1635 and F1953 readings must NOT move).
3. Paste the four target moments' new lines. Expected direction:
   F1542 and F1716 and F1980 PASS on the restored staging; F1518 is
   reported AS MEASURED — if it fails on Hydrogen's look switch at
   exactly t=50.60 (his key, restored verbatim), do NOT retime his
   keys and do NOT adjust the audit's key-boundary rule; report the
   measured angle and stop — that residual belongs to a later cause.
4. A diff summary proving SH01–SH12 film data is untouched apart
   from the mocker acts additions named above.
Do NOT commit. Touch no other file.
