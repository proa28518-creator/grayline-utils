# GLM — BUILD SEAT BRIEF · fudai-wall · chunk 2 (SH04–SH12) Build pass
## Staging corrections, round 1 (GLM authors · driver operates · Codex seat applies · audit judges)

You are GLM, a build seat in Layla's production office, seated beside the Codex
seat for the continuation of this Build pass. Your job in this round: COMPUTE
staging corrections for the failing key moments listed below. You do not touch
files. The driver applies your numbers to `scenes/film.js` through the Codex
seat, re-runs the staging audit, and returns the new failure list to you.
Iterate until the audit passes 19/19 and the D1/D2 audit passes.

## Standing method (you carry it — never re-derive it)
Standing files that govern this work (their operative content is summarised in
the method text at the end of this brief): the studio `AGENTS.md` (authorship
and verification law), `.suite/critic/CRITIC_PROTOCOL.md` §3–§4 (critic
discipline + hard rules) and §7/§7.1/§7.2, `lessons/build.md` (accumulated
lessons — the loader laws below come from it), and the heart method summary
(full text at the end). RULES discipline that binds your output: fix at the
cause; one coherent staging change per shot; never game a checker — a
correction the audit passes but a film critic would reject is a failure, and
round 7's critic has already named this fault family twice.

## The judge: tools/audit_staging.mjs — pass criteria (exact)
For each key moment the audit samples the RESOLVED camera (loader pipeline:
resolveTimes → lowCams floors → autoMove pads push intervals and converts
parks to drifts; sampling follows engine/camera_moves push/park semantics with
the shot's ease, default outCubic) and checks, from scene data alone:
- PROP: centre in frustum, centre unoccluded (occluders: village/neighbour
  building solids + seawall + gateleaf boxes; the occluder is named), projected
  height ≥ the check's minPx, and (≥4/8 box corners in frustum OR projected
  height ≥1920px OR projected width ≥1080px).
- FACE: facing angle ≤60° from the camera axis, whole head sphere (centre =
  character position + head centre height 1.9, radius 0.5) inside the frustum,
  centre unoccluded, projected head height ≥ the check's minPx where named.
- BODY: centre in frustum + ≥4/8 corners in (same overflow rule).
- POINT: point in frustum + unoccluded.
- OCCUPANCY: at least one required subject passing its own check with
  projected height ≥230px (12% of 1920).
- GRAMMAR: sampled fov within [24, 50]; camera position never inside a solid
  (expanded 0.3 D).
- STATE: key-driven prop values at the moment (calendar page, measure h,
  gateleaf lift, blueprint pin) must meet the named thresholds — these are
  driven by prop keys ONCE the field is declared in the prop entry's top level
  (loader law: an undeclared key-driven opt never renders).
Facing model: character facing vector = [sin(ry°), 0, cos(ry°)]; at a moment,
facing = walk heading while walking, else the active acts `look` key's
direction, else cast ry. Head centre height 1.9, hip 1.35, head top 2.4 for
all chunk-2 cast. Frame: 1080×1920, fov is VERTICAL; horizontal half-angle =
atan(tan(fov/2) · 1080/1920).

## Hard constraints (a correction violating one is rejected unread)
- SH01–SH03 are frozen (critic-passed). Only SH04–SH12 staging may change.
- All positions are PLACES-derived: return every position as a PLACES anchor +
  offset (e.g. `COAST_VILLAGE + [x, y, z]`), never bare world numbers.
  PLACES: COAST_WALL [0,0,-16] · COAST_VILLAGE [0,0,2] · SEA [0,0,-44] ·
  NEIGHBOR_COAST [600,0,0] · FLASHBACK_ROCK [1200,0,0] · ROOM [1800,0,0] ·
  HILL_GRAVE [2400,0,0].
- fov within [24, 50] at every from/to. No camera sub-windows (a shot's camera
  spans its own window). Cameras are places a director could put a camera:
  no fisheye, no sky-hooks for close-ups.
- Story geography pins — do NOT move: coins drop from [2,19.5,-17.5] (into
  the sea at the wall); calendar/measure/gateleaf/cranes/money/moneysign stay
  grounded (at y=0) at the wall work site on the village-side apron;
  stickers stay on the neighbour low wall; mocksign stays high on the seawall
  face; orbs stay anchored at SEA + [0,0,-16] (motion via cx/cy keys).
- SH07's face beat is a human-scale close-up: camera within ~8 D of mocker_a,
  near his height. SH11 is one composition: seawall + sea + orb together,
  orb not hidden behind the wall slab.

## Current failures (audit output, <<FILLED_AT_SEND_TIME>>)
<<FAILURES>>

## Scene data for the failing shots (from scenes/film.js as it stands)
<<SCENE_DATA>>

## Prop geometry cheat-sheet (origin at the prop entry's `at`)
- sign (engine kind — what renders): board centre at + [0, 1.25 + h/2, 0],
  size [w, h, 0.1]. calendar: centre [0,1.9,0], size [2.2,3.5,0.2].
- measure: glow column centre [0, effH/2, 0]; label plate centre
  [0.32, full, 0], size [1.35,0.42,0.1]. crane: box centre Ry(rot)·[2,8,0],
  size [11.5,16.8,1.2]. money: centre [0,0.55,0], size [3.7,1.15,2.1].
- gateleaf: centre [0, 17.88·(effLift−0.5), 0], size [7,17.88,0.36].
  seawall: centre [0,9,0] rel. COAST_WALL, size [90,18,1.15]; its gate panel
  centre [0,8.94,0.62], size [7,17.88,0.55].
- blueprint: board centre [0,1.7,0], size [3.4,3.4,0.2]; dragged-line point
  [0.15, 0.75+effLineY·1.9, 0.12]; palm point [1.42, same y, 0.13]; ruler
  exists only when effPin ≥ 1, centre [1.28,1.7,0.14]; label plate
  [1.3,2.82,0.14]. orb: disc centre = at + [effCx, effCy, 0], radius = entry r.
- sea patch: centre [0,0,-30], size [30,0.1,20]. neighbour low wall: centre
  [600,6,-10], size [24,12,0.8]. neighbour houses at [580|600|620, 2.1, 8],
  size [4,4.2,3.5].

## Required output (exact form, per failing moment)
For each failing moment, in frame order:
```
F<frame> (SH<nn>): <the failing checks, one line>
CORRECTION: <const/prop/cast name> := <new value as PLACES anchor + offset, or new scalar>
  ... (one line per changed value; say KEEP for values you rely on unchanged)
MATH: <sampled camera at the moment after correction (pos/target/fov), subject
  positions, angles and projected px proving every check at this moment passes>
```
End with:
```
CONFLICTS: <any moment that cannot pass within the pins/grammar, with the
  measured conflict — or "none">
```
Show the arithmetic; do not assert. If two moments in one shot pull against
each other, solve the shot as one system and say so.

## Method summary — the heart (standing text, carried by every seat)
<<HEART_SKILL_TEXT>>
