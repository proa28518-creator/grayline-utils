# GLM — COMPUTE BRIEF · phase 9 · cause: F570 (mocker illegible behind the blueprint)

You are GLM, a build seat in Layla's production office for the film
"fudai-wall" (chunk 2). Standing method — read and obey, do not re-derive:
studio `AGENTS.md`; `~/workspace/Production and rules/RULES.md` §3 (one cause,
one change), §4, §5; `.suite/critic/CRITIC_PROTOCOL.md` §7; `lessons/build.md`.
ONE cause. Return computed values only — you touch no files. Plain text only,
no tool calls, no simulated execution. A complete correction block in the
output form below is the only acceptable deliverable (a diagnosis alone was
round 1's outcome and does not close this task).

## The beat (owner's bible, S3)

Frame 570 (t=19.0 s, shot SH07): the mocker, mid-laugh, points at the wall
top — the frame must read: mocker_a's laughing FACE, big, with the wall top
in frame. Critic rounds 7–8 (BLOCKING): the mocker is hidden/illegible —
round 8: "mocker hidden behind blueprint in F570".

## Scene data (verbatim from scenes/film.js)

- SH07 (after the line-6 split): t0 line:6.start → t1 line:6.word:9, camera
  t1 19.0, ease inExpo, roll [-5,-2]; from pos CAM_SH07_A =
  COAST_VILLAGE+[4,2.5,-7] (world [4,2.5,-5]), target CAM_SH07_TA =
  COAST_VILLAGE+[4,1.9,-2] (world [4,1.9,0]), fov 50 → to pos
  COAST_VILLAGE+[5.5,2.2,2.2] (world [5.5,2.2,4.2]), target
  COAST_WALL+[1,7.5,0] (world [1,7.5,-16]), fov 50.
- Audit sampled pose at F570: pos [5.50,2.20,4.20], target [1.00,7.50,-16.00],
  fov 50. Audit checks PASS: mocker_a head centre in frustum, 520px; wall-top
  point [3,18,-15.42] in frustum. The audit does NOT test facing/legibility
  at this moment and does NOT model the blueprint as an occluder/backdrop.
- mocker_a stands at world [4,0,0]; head centre [4,1.9,0]. His look keys:
  line:6.word:3 → WALLTOP [0,17,-16]; line:6.word:8 → [2,19.5,-17.5]. At
  t=19.0 the active look target is [2,19.5,-17.5] (north, toward the wall) —
  his face turns AWAY from a village-side camera.
- blueprint prop: at BLUEPRINT = COAST_VILLAGE+[5.2,0,-1.5] = world
  [5.2,0,0.5]; board 3.4×3.4, centre [5.2,1.7,0.5]. It stands 1.2 D east and
  0.5 D north of mocker_a — directly behind him from the F570 camera.
- Cast spread near him: mocker_b [4,0,-1], mocker_c [6,0,0.5] (world).
- Pixel truth on the probed still: only an edge-cropped head renders at
  x 916–1000 (the frame's right edge); the blueprint grid fills the frame's
  lower half; the mocker does not read as a laughing face. (Phase-8 driver
  eye-verdict: FAIL.)

## Your computation

Propose ONE correction. The cause has two coupled parts — name which lever
solves which part: (a) BACKDROP: from the F570 camera, the blueprint board
sits behind mocker_a's head; (b) FACING: his active look target turns his
face north, away from the camera, at this moment. Levers: SH07's TO pose
(pos/target/fov — the pose F570 samples, u≈1 under inExpo at t=19.0 against
the camera t1 of 19.0); mocker_a's look key at line:6.word:8 (its target is
shared with the F590 coin beat's story point [2,19.5,-17.5] — if you move
it, price that); the blueprint may NOT move (story geography: the mayor's
board stands in the square; SH10 is built around it) and mocker_a may NOT
move (SH08's face pair is staged on his position). Constraints: wall-top
point [3,18,-15.42] stays in frame; head ≥ 265px target (230px floor + the
20% margin rule from Opus hunt #1); face angle to camera ≤ 60° (aim ≤ 35°);
fov within [24,50]; F537 (the from-pose close-up, currently PASS at 480px /
15°) must not regress — the from pose is not yours to change. Show the
projection arithmetic (1080×1920): head screen centre + size, face angle,
blueprint board screen box vs the head disc, wall-top screen position.

## Output form

`CORRECTION:` exact const/key-level changes (which expressions, to what) ·
`ARITHMETIC:` the projections · `PREDICTED:` F570 head disc, face angle,
backdrop behind the head, wall-top position · `RISKS:` F537/F590/SH08
effects. Plain text only.
