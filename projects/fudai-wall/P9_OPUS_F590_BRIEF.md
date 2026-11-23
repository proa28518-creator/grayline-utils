# OPUS — COMPUTE BRIEF · phase 9 · cause: F590 (coins cropped, no sea)

You are Opus, a build seat in Layla's production office for the film
"fudai-wall" (chunk 2). Standing method — read and obey, do not re-derive:
studio `AGENTS.md`; `~/workspace/Production and rules/RULES.md` §3 (one cause,
one change), §4, §5; `.suite/critic/CRITIC_PROTOCOL.md` §7; `lessons/build.md`.
This is ONE cause. Return computed values only — you touch no files.

## The beat (owner's bible, S3)

Frame 590 (t = 19.67 s, shot SH07B): the imagined coins fall toward the sea —
the frame must show the falling gold coins, the seawall top, AND the sea below.
Critic round 8 (BLOCKING): "no sea under coins in F590"; the frame is ~60%
empty blue and the flattest of the board.

## Scene data (verbatim from scenes/film.js)

- coins prop: `at` COAST_WALL+[2,19.5,-1.5]; key at line:6.word:10:
  `drop:{from:[2,19.5,-17.5], v0:[.6,2.2,0], g:9.8, ground:17.55, hide:true}`.
  At t=19.67 the drop position computes to [2.10, 19.73, -17.50].
- SH07B camera: from pos COAST_VILLAGE+[5.5,2.2,2.2], target
  COAST_WALL+[1,7.5,0], fov 50 → to pos COAST_VILLAGE+[2,21.5,-15], target
  COAST_WALL+[2,19.5,-19], fov 24 (ease outCubic, roll -2).
- Places: COAST_WALL at [0,0,-16] (wall top y=18, wall face z=-16, thickness
  ~1.15); SEA at [0,0,-44], sea surface y=0 spanning z -70..-18; COAST_VILLAGE
  at [0,0,2].
- Staging audit at F590 (sampled camera pos [2.51,18.71,-10.51], target
  [1.86,17.76,-32.25], fov 27.76): coins PASS 285px (audit box 0.5 D at the
  drop origin), wall-top point [2,18,-15.42] PASS.

## Pixel truth (measured on the fleet-probed still — the audit does NOT see this)

- The RENDERED coin cluster rides ~1 D ABOVE the audit's 0.5 D drop box: the
  coins render at the frame's TOP edge, cropped (measured y 0–12.4% of frame).
- No sea is visible anywhere in the frame; ~60% of the frame is empty blue.
- The new pixel gate will judge the re-probe: coin cluster fully in frame,
  sea visibly present below the coins, §5 detail ≥22% / flat ≤80% on the frame.

## Your computation

Propose ONE correction — SH07B camera values only (from/to pos, target, fov;
the from pose is shared with SH07's end pose and F570 is judged separately, so
prefer changing the TO pose and/or the shot's target line; if the FROM must
move, say so and price the F570 risk). Constraints: fov within [24,50]; the
coins' drop is story-pinned — do not move the drop, the wall, or the sea;
the wall-top point [2,18,-15.42] must stay in frame; the coin cluster
(drop position + ~1 D upward render offset, cluster radius ~0.75 D) must sit
fully in frame with margin; the sea surface (y=0, z ≤ -18) must occupy a
visible band in the lower frame. Show your projection arithmetic (frame
1080×1920, vertical fov) for the to-pose at t=19.67.

## Output form

`CORRECTION:` the exact new values (const-level: which expressions in film.js
change, to what) · `ARITHMETIC:` the projections · `PREDICTED:` coin cluster
screen box, sea band screen extent, wall-top position · `RISKS:` what else
this touches. Plain text only, no tool calls, no simulated execution.
