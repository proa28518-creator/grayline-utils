# LUNA — COMPUTE BRIEF · phase 9 · cause: F345/F414 (calendar occluded by the crane; 12-year count illegible)

You are Luna, an independent compute/verification seat in Layla's production
office for the film "fudai-wall" (chunk 2). Standing method — read and obey,
do not re-derive: studio `AGENTS.md`; `~/workspace/Production and rules/
RULES.md` §3 (one cause, one change), §4 (PROP GUARD; story numbers must read
exactly — a missing/illegible number is BLOCKING), §5; `.suite/critic/
CRITIC_PROTOCOL.md` §7; `lessons/build.md`. ONE cause. Computed values only.
Show all arithmetic; if the data is insufficient, say CANNOT COMPUTE and
name what is missing.

## The beat (owner's bible, S2)

Frames 345 (t=11.5) and 414 (t=13.8), shot SH05 (the construction
time-lapse): the calendar flips fast through 12 years while cranes build.
The calendar's page state is correct in the data (audit: effPage 7.0 at F345,
11.0 at F414 — the flip advances), but critic round 8 (BLOCKING): "calendar
blocked by crane with no legible 12-year count in F345–F414". The page digit
does not READ in the render.

## Scene data (verbatim from scenes/film.js + tools/audit_staging.mjs)

- calendar prop: at COAST_WALL+[13,0,2] (world [13,0,-14]); audit box:
  centre at+[0,1.9,0], size [2.2, 3.5, .2], yaw 0.
- crane_b prop: at COAST_WALL+[13,0,3] (world [13,0,-13]), rot [0,-20,0];
  audit box: centre at + ry([2,8,0], yaw) with size [11.5, 16.8, 1.2] (a
  bounding box of the whole crane: jib + tower).
- crane_a prop: at COAST_WALL+[2,0,2] (world [2,0,-14]), rot [0,15,0].
- SH05 camera: from pos CAM_SH05_A = COAST_VILLAGE+[-5,16.5,16] (world
  [-5,16.5,18]), target CAM_SH05_TA = COAST_WALL+[4,10.5,2] (world
  [4,10.5,-14]), fov 50 → to pos CAM_SH05_B = COAST_VILLAGE+[20,16.5,16]
  (world [20,16.5,18]), target CAM_SH05_TB = COAST_WALL+[12.6,10.5,2]
  (world [12.6,10.5,-14]), fov 34; ease inQuad.
- Staging audit sampled poses: F345 pos [4.22,16.50,18.00] target
  [7.17,10.50,-14.00] fov 44.10 — calendar PASS 251px corners 8/8; F414 pos
  [17.63,16.50,18.00] target [11.78,10.50,-14.00] fov 35.52 — calendar PASS
  315px corners 8/8. NOTE: the audit's occluder set is buildings + seawall +
  gateleaf only — props never occlude props in its model, so the crane's
  overlap of the calendar is invisible to it.
- Driver eye notes (phase 7/8): at F345 the calendar is small, partly behind
  the crane; at F414 it reads bottom-centre but small; the gate leaf fills
  much of both frames.
- Work-site geography (story-pinned): the construction props stand on the
  COAST_WALL apron at ground level: money [0,0,-13], crane_a [2,0,-14],
  calendar [13,0,-14], crane_b [13,0,-13], measure [16,0,-14]. The calendar
  and crane_b stand at nearly the same spot — that co-location is the
  suspected cause.

## Your computation

Determine the occlusion geometry at F345 and F414 (project the calendar box
and the crane_b box — and, because a crane's RENDERED silhouette is its tower
+ jib, not its bounding box, also model the tower as a 1.2-wide vertical at
the prop origin and the jib as a line from the tower top toward its yaw
direction at height ~16) and propose ONE correction that makes the calendar
board (and its page digit) fully legible at both frames. Levers: (1) move
crane_b along the apron (x) and/or rotate it so its tower/jib clear the
calendar's screen box from the SH05 lane; (2) move the calendar along the
apron; (3) adjust the SH05 target line. Keep both cranes, the calendar, the
money and the measure on the apron in a plausible work-site row; keep every
other audit check at F288/F345/F414 in reach (crane ≥120px at F288 — crane_a
or crane_b; money + moneysign at F288; measure plate at F414; gateleaf lift;
seawall gate ≥200px at F345). Show the screen-space projections (1080×1920)
before/after for the calendar box vs the crane tower/jib at both frames.

## Output form

`CORRECTION:` exact const/prop-level changes (which expressions, to what) ·
`ARITHMETIC:` the projections · `PREDICTED:` calendar screen box + clearance
from the crane silhouette at F345/F414 · `RISKS:` other moments touched.
Plain text only, no tool calls, no simulated execution.
