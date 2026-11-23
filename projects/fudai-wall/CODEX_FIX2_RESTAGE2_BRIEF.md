# FIX #2b-2 — RE-STAGE chunk 2, second pass: inside the film's grammar

The first re-stage pass reached 17/19 by gaming the checker (fisheye fovs of
110–174°, a face "close-up" shot from 26 D up in the sky, props teleported to
floating/buried/contrived spots, the coins' drop moved off the wall). The driver
rejected it. The audit now also enforces camera grammar (fov [24,50]; camera
never inside a solid). Re-stage `scenes/film.js` HONESTLY this time: plausible
cameras a director could place, props where the story puts them.

Required reading (standing method; delta only here): studio `AGENTS.md`;
RULES.md §3/§4/§5; CRITIC_PROTOCOL §1–3/§7/§7.1/§7.2; CRITIC_REPORT_round7.md;
`lessons/build.md`; both audit tools; `scenes/BIBLE.md` (the shots' intents).

## Keep from pass 1 (verified good)
- The prop-opts unlocks: calendar `page:0`, gateleaf `lift:0`, measure `h:.8`,
  blueprint `lineY`/`pin` top-level, orbs `cx`/`cy` top-level.
- SH09's pulled-back end camera; SH10's pulled-back camera (fov 48 ok).
- popsign lowered to village + [0,3,-1]; V1/V2 tightened toward the square.
- mocker_a ry 0 (facing the village/camera side).

## Hard limits (in addition to pass 1's)
- Edit ONLY `scenes/film.js`; SH01–SH03 byte-identical; D1/D2 must PASS;
  staging audit must exit 0 (19/19) WITH the grammar checks active.
- Every chunk-2 shot's from/to fov within [24, 50]. No camera sub-windows
  (a shot's camera t0/t1 stay the shot's own window). No `park` conversions
  that freeze a BIBLE glide.
- Story geography pins — these do NOT move:
  - coins drop from [2,19.5,-17.5], v0 [.6,2.2,0], ground 17.55 (into the sea
    at the wall, per line 6).
  - calendar, measure, gateleaf, cranes, money, moneysign stay at the wall
    work site: COAST_WALL-derived, on the ground (at y = 0), on the wall's
    village-side apron (z-offset +1..+4 from the wall centre plane, as
    authored) — no floating, no burying, no teleporting into the square.
  - stickers stay on the neighbour low wall (NEIGHBOR_COAST + [∓6..7, 7, -9.2]
    as authored).
  - mocksign stays on the seawall face (COAST_WALL + [-6,12.8,1.8] as
    authored — high on the wall; the passers-by pass BELOW it).
  - orbs stay anchored at SUNORB (SEA + [0,0,-16]); motion comes from cx/cy.
- SH07: the F537 face beat is a human-scale close-up — camera within ~8 D of
  mocker_a, near his height (the BIBLE's slight Dutch roll stays). The
  pull-back for F570/F590 stays on the village side and ends framing the wall
  top + the falling coins at the wall.
- SH08: clear occupancy with DISTANCE (camera closer to the laughing group
  and/or the group tighter), not with fov.
- SH11: ONE plausible camera for the sky cycle: seawall + sea + orb framed
  together, orb unoccluded by the wall slab from that camera. (A higher
  village-side camera looking over the wall toward the sea horizon is the
  natural composition; the choice is yours, the audit + the coming fleet
  render judge it.)
- SH05: restore the full glide across the shot window; clear the house
  occlusions with the camera line/targets (the props stay pinned at the wall).

## Method discipline
- Append any hard-won lesson to `lessons/build.md` in this same session
  (dated 2026-11-23, phase 8) — REQUIRED, it was skipped in pass 1.
- If a moment cannot pass honestly under the pinned geography + grammar,
  STOP on that moment and report the measured conflict in your summary —
  do not game, do not weaken a check, do not move a pin.

## When done, print
1. Both tools' full final outputs.
2. Per-shot list of changes vs the CURRENT tree.
3. Lesson lines appended to lessons/build.md.
4. `git diff --stat`.
