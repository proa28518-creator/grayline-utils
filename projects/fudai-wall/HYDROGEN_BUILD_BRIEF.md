# HYDROGEN — BUILD BRIEF · fudai-wall · chunk 3b: SH20–SH26 (lines 18–24)
## STATUS: READY NOW (2026-11-23 ~03:03, owner's parallel-split order) — runs IN PARALLEL with Qwen's SH13–SH19 and with chunk 2's iteration; it does NOT wait for either to close. The chunks share BIBLE/PLACES/cast but author independently; each chunk audits separately. **Split: Qwen authors SH13–SH19; you author SH20–SH26** — prefix every const you introduce with its shot id (CAM_SH20_…) and declare any cast entries you need; the driver merges both chunks' data (duplicate declarations of the same cast entry are merged, not doubled).

You are Hydrogen, a build seat in Layla's production office (Gemini seat,
Task mode). Your assignment: AUTHOR shots SH20–SH26 of the film as staging
data, under the same computed-staging discipline that closed chunk 2. You
return text only (this brief reaches you in your session; your reply returns
verbatim to the driver). The driver applies your data to `scenes/film.js`
through the Codex seat, extends the staging audit with the moments you
declare, and gates the chunk: D1/D2 audit PASS + staging audit PASS on every
declared moment, or the chunk comes back to you with the measured failures.

## Standing method (you carry it — never re-derive it)
Standing files that govern this work: the studio `AGENTS.md`; `Production and
rules/RULES.md` §3 (critic discipline: one cause, one change; a pass ends only
on a fresh critic's VERDICT: YES), §4 (hard rules: frame 0 is a face; pure in
t; PROP GUARD — a prop in a place is in every shot of that place), §5 (set
bar); `.suite/critic/CRITIC_PROTOCOL.md` §7 (decoupled critic method);
`lessons/build.md` (the loader laws below are learned there — obey them);
`scenes/BIBLE.md` (the film's direction of record — its beats for lines
18–24 are quoted in this brief as data); `scenes/set.js` (the ONE PLACES
table). The heart method summary travels with the driver's brief pack.

## The chunk (BIBLE lines 18–24; shot ids continue the film's numbering)
Timings are the owner's word times (audio/clean.json) — shots key to them
exactly as chunk 1–2 shots do (`t0:'line:18.start'` form).
- SH20 = L18 · 48.36–51.61 · FLASHBACK_ROCK (SEPIA) — close tracking along
  the rock: the carved horizontal high-water line; the young mayor's
  (mayor_young, black hair) hand touches the carving. Word: الصخر (w5).
  Props: carved rock line.
- SH21 = L19 · 52.11–54.57 · ROOM — clean cutaway: warm room wall; a hand
  draws a pencil line above the child's head, the measure written beside it.
  Word: شرطة (w4). Cast: child. Props: pencil line / wall mark.
- SH22 = L20 · 54.88–57.57 · COAST_WALL — MATCH-CUT: the pencil line becomes
  the wall's top edge; workers pour its last metre. Word: السور (w3).
  Cast: workers. (The match-cut lands on the same screen height as SH21's
  pencil line — stage SH22's first framing to receive it.)
- SH23 = L21 · 58.00–61.12 · NEIGHBOR_COAST — aerial pan: the 15 m wave
  overtops the 10M-sticker walls and wipes the neighbour villages in
  minutes. Word: اتمسحت (w8). Props: neighbour walls + stickers (exist),
  the wave (17.5 D — it OVERTOPS the 12 D neighbour walls; that contrast
  with SH24 is the story).
- SH24 = L22 · 61.56–63.69 · COAST_WALL — dramatic side profile + impact
  shake: the wave SLAMS the mayor's wall, white spray — the water rises to
  EXACTLY the top edge… and stops. THE THESIS FRAME: the wave (17.5 D) must
  read BELOW the wall's top edge (18 D) by its half-metre margin.
  Words: خبطت (w2), حافته (w7). Props: wall, wave, spray.
- SH25 = L23 · 64.49–65.22 · COAST_VILLAGE — crane reveal over the wall top:
  the village behind, intact and bone dry, warm sunbeam breaking the clouds.
  Word: نجت (w3).
- SH26 = L24 · 65.75–67.55 · HILL_GRAVE — slow emotional pull-back: the same
  mockers (mocker_a/b/c — S7's mourners ARE S3's mockers, same cast entries,
  hats, colours), silent, bow with flowers at the mayor's grave; the giant
  wall stands far behind. HARD CUT on the last word (the film loops).
  Word: قبره (w6). Props: gravestone, flowers, distant wall.
(SH13–SH19 are Qwen's chunk, authored in parallel — not yours.)

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
4. ONE MAYOR PER AGE: mayor / mayor_old / mayor_young are one man in three
   cast entries — never stage two of them in the same place at the same
   time. (At t≈27 the grey mayor stands parked inside the town hall; Qwen's
   SH13 handles his exit — your chunk uses mayor_young only, in flashback.)
5. Camera grammar (audit-enforced): sampled fov within [24, 50]; camera
   never inside a solid; no camera sub-windows; positions a director could
   place. Faces: within ~60° of camera, whole head in frame, never cut by
   an edge where the beat calls for a face.
6. Pure in t: no randomness, no state — keys and closed forms only.
7. SCALE LAW: the wave is 17.5 D, the hero wall 18 D, neighbour walls 12 D —
   one scale everywhere (PROP GUARD); SH23's overtop and SH24's stop-at-the-
   edge both read off these numbers, never off camera trickery.

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
   consts (PLACES-derived, shot-id-prefixed), cast entries, acts
   (face/clips/look/walk), props entries (D1 array form: {id, kind,
   in:'world', at, keys} + the declarations law 1 requires), and the 7 shot
   entries SH20–SH26.
2. `MOMENTS` — your declared audit moments, one per line:
   `F<frame> t=<s> SH<nn> — <check>: <subject> >= <minPx> [state: <field> >= <v>]`
   (frame = round(t × 30)).
3. `NEW KINDS NEEDED` — every prop kind not in the existing list (wave,
   gravestone, spray, flowers, pencil mark, carved line…): one line each
   with its geometry (origin, size, what its keys must drive) — or "none".
   The Codex seat authors these from your spec. (The wave kind is shared
   with Qwen's SH18 — spec it fully; the driver reconciles the two specs.)
4. `RATIONALE` — one line per shot: the camera move and what reads.
5. `CONFLICTS` — any beat that cannot be staged honestly inside the laws
   above, with the measured conflict — or "none". Do not game a conflict
   away; name it and the chunk returns with a ruling.
