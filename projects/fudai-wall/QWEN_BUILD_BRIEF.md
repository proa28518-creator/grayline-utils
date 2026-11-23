# QWEN — BUILD BRIEF · fudai-wall · chunk 3a: SH13–SH19 (lines 11–17)
## STATUS: READY NOW (2026-11-23 ~02:58, owner's deadline order; split locked ~03:03) — runs IN PARALLEL with chunk 2's iteration; it does NOT wait for chunk 2 to close. The chunks share BIBLE/PLACES/cast but author independently; each chunk audits separately. **Split: you author SH13–SH19; Hydrogen authors SH20–SH26 in parallel** — prefix every const you introduce with its shot id (CAM_SH13_…) and declare any cast entries you need; the driver merges both chunks' data (duplicate declarations of the same cast entry are merged, not doubled).

You are Qwen, a build seat in Layla's production office. Your assignment:
AUTHOR shots SH13–SH19 of the film as staging data, under the same
computed-staging discipline that closed chunk 2. You return text only
(this brief reaches you in chat; your reply returns verbatim to the driver).
The driver applies your data to `scenes/film.js` through the Codex seat,
extends the staging audit with the moments you declare, and gates the chunk:
D1/D2 audit PASS + staging audit PASS on every declared moment, or the chunk
comes back to you with the measured failures.

## Standing method (you carry it — never re-derive it)
Standing files that govern this work: the studio `AGENTS.md`; `Production and
rules/RULES.md` §3 (critic discipline: one cause, one change; a pass ends only
on a fresh critic's VERDICT: YES), §4 (hard rules: frame 0 is a face; pure in
t; PROP GUARD — a prop in a place is in every shot of that place), §5 (set
bar); `.suite/critic/CRITIC_PROTOCOL.md` §7 (decoupled critic method);
`lessons/build.md` (the loader laws below are learned there — obey them);
`scenes/BIBLE.md` (the film's direction of record — its beats for lines
11–24 are quoted in this brief as data); `scenes/set.js` (the ONE PLACES
table). The heart method summary travels with the driver's brief pack.

## The chunk (BIBLE lines 11–24; shot ids continue the film's numbering)
Timings are the owner's word times (audio/clean.json) — shots key to them
exactly as chunk 1–2 shots do (`t0:'line:11.start'` form).
- SH13 = L11 · 30.27–32.55 · COAST_VILLAGE — slow lateral tracking:
  white-haired mayor_old leaves the town hall carrying his belongings box;
  blaming hands point from behind. Action word: المعاش (w4). Prop:
  belongings box — its entry MUST keep `fetch: true` (D1 fix of record).
- SH14 = L12 · 33.04–35.27 · HILL_GRAVE — gentle crane up: the quiet hill,
  one simple gravestone overlooking the distant silent wall; one leaf falls
  slowly. Word: ومات (w1). Props: gravestone, leaf.
- SH15 = L13 · 35.70–37.12 · COAST_VILLAGE — calendar pages fly (14 years);
  sky snaps to storm blue-grey. Word: 14 (w4). Prop: calendar (exists).
- SH16 = L14 · 37.39–38.71 · COAST_VILLAGE — heavy camera shake: streets
  shake, poles sway, birds burst up, villagers pour out wide-eyed.
  Word: اتهزت (w2).
- SH17 = L15 · 39.28–40.67 · SEA — high-angle coastline glide: the sea pulls
  back, boats stranded on exposed sand. Word: اتسحب (w2).
- SH18 = L16 · 41.06–44.81 · SEA — extreme low-angle tilt-up: a dark wall of
  water covers the horizon; a glowing measure line climbs to exactly 15M;
  people run to high ground. Words: بموجة (w2), 15 (w5). Props: the wave
  (17.5 D tall — it must read BELOW the seawall's 18 D top), measure line.
- SH19 = L17 · 45.45–47.79 · FLASHBACK_ROCK (SEPIA) — glide: young mayor
  (mayor_young, black hair) on the hill watches old waves swallow the old
  village. Word: شاف (w5).
(SH20–SH26 are Hydrogen's chunk, authored in parallel — not yours.)

## What already exists (build on it — do not re-invent)
- Cast specs (all in scenes/cast/): mayor, mayor_old, mayor_young,
  mocker_a, mocker_b, mocker_c, villagers, workers, child.
- Film prop kinds (scenes/props/): seawall, storeys, boat, sign (film-local —
  see the shadowing law below), crane, money, calendar, gateleaf, measure,
  coins, blueprint, orb.
- PLACES (scenes/set.js — the only anchors; every position you return is a
  PLACES anchor + offset, never a bare world literal): COAST_WALL [0,0,-16] ·
  COAST_VILLAGE [0,0,2] · SEA [0,0,-44] · NEIGHBOR_COAST [600,0,0] ·
  FLASHBACK_ROCK [1200,0,0] · ROOM [1800,0,0] · HILL_GRAVE [2400,0,0].
- The set (set.js) already builds all seven places; read its piece list from
  the driver's pack and stage against what is actually there.

## Loader laws (from lessons/build.md — violating one wastes a round)
1. PROP-OPTS: a key-driven numeric build opt renders ONLY if the field is
   also declared in the prop entry's top level. Declare every key-driven
   field (page, h, lift, lineY, pin, cx, cy, and any new kind's equivalents)
   in the entry, with its initial value.
2. HIDE KEYS: a prop `hidden` key must sit within ~1 frame of a shot cut or
   carry `stow: true`, or the loader rejects the staging.
3. SIGN SHADOWING: the engine's own `sign` kind shadows the film-local one —
   never rely on film-local sign behaviour; treat every sign as the engine
   kind (it prints a foreign subtitle — a known fault with its own future
   round; do not design a beat that depends on hiding it).
4. THE PARKED MAYOR: at t≈27 the grey mayor stands parked inside the town
   hall (an earlier beat's staging). At SH13 mayor_old exits that hall —
   your staging must not double the mayor: mayor_old is the same man; the
   grey entry must be hidden/stowed by then (name the key that does it).
5. Camera grammar (audit-enforced): sampled fov within [24, 50]; camera
   never inside a solid; no camera sub-windows; positions a director could
   place. Faces: within ~60° of camera, whole head in frame, never cut by
   an edge where the beat calls for a face.
6. Pure in t: no randomness, no state — keys and closed forms only.

## The gate your data must pass (audit criteria, exact)
For every key moment YOU declare (2–3 per shot: the action word's moment +
the shot's riskiest framing), the staging audit computes from scene data:
PROP (centre in frustum, unoccluded, projected height ≥ your named minPx,
≥4/8 corners in or frame-filling overflow), FACE (angle ≤60°, whole head
sphere in, ≥ named minPx), BODY, POINT, OCCUPANCY (a passing subject
≥230px), STATE (key-driven values at their thresholds), GRAMMAR (above).
Character body model: head centre height 1.9, radius 0.5, hip 1.35.
Choose moments and minPx a critic would choose — the chunk then faces a
fresh blind critic exactly as chunks 1–2 did; staging that merely passes
your own declared moments will not survive it.

## Deliverable (exact form)
1. `FILM DATA` — the film.js additions as code, in chunk 1–2 style: new
   consts (PLACES-derived), cast entries, acts (face/clips/look/walk),
   props entries (D1 array form: {id, kind, in:'world', at, keys} + the
   declarations law 1 requires), and the 7 shot entries SH13–SH19.
2. `MOMENTS` — your declared audit moments, one per line:
   `F<frame> t=<s> SH<nn> — <check>: <subject> >= <minPx> [state: <field> >= <v>]`
   (frame = round(t × 30)).
3. `NEW KINDS NEEDED` — every prop kind not in the existing list (wave,
   gravestone, leaf, belongings box, spray, flowers, pencil mark, carved
   line, birds…): one line each with its geometry (origin, size, what its
   keys must drive) — or "none". The Codex seat authors these from your spec.
4. `RATIONALE` — one line per shot: the camera move and what reads.
5. `CONFLICTS` — any beat that cannot be staged honestly inside the laws
   above, with the measured conflict — or "none". Do not game a conflict
   away; name it and the chunk returns with a ruling.
