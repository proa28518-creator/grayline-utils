# GLM — COMPUTE BRIEF · phase 9 · cause: F474 (flat slab instead of a neighbouring coast)

You are GLM, a build seat in Layla's production office for the film
"fudai-wall" (chunk 2). Standing method — read and obey, do not re-derive:
studio `AGENTS.md`; `~/workspace/Production and rules/RULES.md` §3 (one cause,
one change), §4, §5 (set bar: shot ≥22% detail / ≤80% flat); `.suite/critic/
CRITIC_PROTOCOL.md` §7; `lessons/build.md`. ONE cause. Computed values only.
Plain text only, no tool calls, no simulated execution. A complete
correction block in the output form below is the only acceptable deliverable.

## The beat (owner's bible, S2 close)

Frame 474 (t=15.8 s, shot SH06): the coast pan across the NEIGHBOURING
villages — their low 10M walls, their houses, the two «10M» signs must read:
"everyone else settled for a 10-metre wall". Critic round 8 (BLOCKING):
"F474 shows a flat slab instead of a neighbouring coast", "no coastal
houses/low wall and clipped '10M' sign in F474"; F474 is among the board's
flattest frames.

## Scene data (verbatim from scenes/film.js + scenes/set.js + audit)

- SH06 camera: from pos CAM_SH06_A = NEIGHBOR_COAST+[-10,8.5,15] (world
  [590,8.5,15]), target CAM_SH06_TA = NEIGHBOR_COAST+[0,4,3] (world
  [600,4,3]), fov 50 → to pos CAM_SH06_B = NEIGHBOR_COAST+[10,8.5,15]
  (world [610,8.5,15]), target [600,4,3], fov 50.
- Audit sampled pose at F474: pos [605.81,8.50,15.00], target [600,4,3],
  fov 50. Audit PASSes: neighbour wall 1056px (corners 2/8), sticker_a 143px
  8/8, sticker_b 172px 4/8, neighbour houses 1/1.
- NEIGHBOR_COAST at [600,0,0], bounds x [560,660], z [-30,20]. The neighbour
  wall (audit model): box centre [600,6,-10], size [24,12,.8]. Neighbour
  houses (set dressing): three houses at x 580/600/620, z=8, ~4×4.2×3.5
  (audit solids model).
- sticker_a at [597,7,2], sticker_b at [603,7,2] (both '10M', w 1.7, h .95,
  post 0 — after the pending sign-kind fix they render as clean boards).
- Pixel/eye truth on the probed still: a flat dark-grey wall fills the
  frame; the right 10M sign is cropped by the frame's right edge; one house
  roof shows in the foreground; the coast/houses do not read as a place.

## Your computation

Propose ONE correction — SH06 camera values (from/to pos, target, fov
within [24,50]) — under which at F474 (u≈0.79 of the pan): the neighbour
wall reads as a LOW wall (its top edge well below the frame's top, sky
above it), BOTH 10M signs are fully in frame with margin, at least two
neighbour houses read as houses (roof + walls, not a roof sliver), and the
frame's §5 detail (measured on pixels by the new gate) has a credible path
to ≥22%: say which set elements your framing puts in frame to carry the
detail (houses, signs, shore, sky gradient does not count). The pan's other
moments (the shot spans t 14.4–16.77) must not be broken: the from pose
should still open on the same coast. Do not move the wall, houses, or signs
(story geography). Show projection arithmetic (1080×1920) at F474 for: wall
box screen extent, both sign screen boxes, two house screen boxes.

## Output form

`CORRECTION:` exact const-level changes · `ARITHMETIC:` the projections ·
`PREDICTED:` screen boxes + the detail carriers in frame · `RISKS:` the
pan's start/end moments. Plain text only.
