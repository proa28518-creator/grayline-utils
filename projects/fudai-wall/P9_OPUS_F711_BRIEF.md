# OPUS — COMPUTE BRIEF · phase 9 · cause: F711/F723 (blueprint + ruler occluded by a foreground villager)

You are Opus, a build seat in Layla's production office for the film
"fudai-wall" (chunk 2). Standing method — read and obey, do not re-derive:
studio `AGENTS.md`; `~/workspace/Production and rules/RULES.md` §3 (one cause,
one change), §4 (PROP GUARD: a prop/character in a place is in every shot of
that place — nothing is deleted or teleported), §5; `.suite/critic/
CRITIC_PROTOCOL.md` §7; `lessons/build.md`. ONE cause. Computed values only.

## The beat (owner's bible, S3 close)

Frames 711 (t=23.7) and 723 (t=24.1), shot SH10: the blueprint insert — the
glowing height line, the mayor's hand pinning the ruler at the "15.5M" label.
Critic round 8 (BLOCKING): the blueprint and ruler are "blurred and occluded
to '5M' by a foreground villager" in both frames.

## Scene data (verbatim from scenes/film.js)

- SH10 camera (static push, from == to): pos CAM_SH10_A = BLUEPRINT+[0,3,9],
  target CAM_SH10_T = BLUEPRINT+[0,1.55,0], fov 48.
- BLUEPRINT = COAST_VILLAGE+[5.2,0,-1.5] = world [5.2, 0, 0.5]. So the camera
  sits at world [5.2, 3, 9.5], target [5.2, 1.55, 0.5]. Blueprint board:
  3.4×3.4, centre at at+[0,1.7,0]; ruler box at at+[1.28,1.7,.14] (0.18×2.05);
  label box at at+[1.3,2.82,.14] (0.9×0.28); line point at at+[.15,.75+
  lineY*1.9,.12] (lineY=1 at F711/F723); palm point at at+[1.42,.75+1.9,.13].
- Cast in COAST_VILLAGE (all stand in the place; PROP GUARD): villager_4 at
  world [5, 0, 7] (V4 = COAST_VILLAGE+[5,0,5]); villager_1 [-1,0,4];
  villager_2 [1,0,4]; villager_3 [-2,0,6]; villager_5 [-8,0,5]; villager_6
  [10,0,6]; mocker_a [4,0,0]; mocker_b [4,0,-1]; mocker_c [6,0,0.5].
  Character head centre y=1.9, head sphere r=0.5 (rendered silhouette radius
  up to ~1.35× the model for hat-wearing villagers — pixel calibration).
- Staging audit at F711/F723: blueprint PASS 847px corners 8/8, ruler PASS
  522px, label PASS 73px — the audit's occluder set is buildings + seawall +
  gateleaf only; it does not model characters or props as occluders.

## Pixel truth (measured on the fleet-probed still of F723)

- The foreground villager's head (villager_4, 2.5 D from the camera on the
  blueprint sightline) measures bbox x 0–801px, y 538–1413px — it fills the
  left ~2/3 of the frame AND is itself cropped by the left edge.
- The blueprint board's visible region measures only x 718–974px,
  y 605–1233px; the head overlaps its left portion; the ruler label reads
  only "5M" — the "15." is behind the head.

## Your computation

Propose ONE correction. The occluder is villager_4 standing between the
camera and the board. Levers, in order of preference: (1) SH10 camera
position/target (a lateral/vertical shift that takes villager_4's head off
the board's legibility region while keeping board + line + palm + ruler +
label framed and the mayor's hand beat readable); (2) a small camera
reframe + fov change within [24,50]. You may NOT move villager_4 or the
blueprint (story geography; the mayor works at this board in the village
square) and may NOT shrink the board. The mayor himself stands at [0,0,2]
(walk end) — check he does not enter the new sightline. Show projection
arithmetic (1080×1920) for F723: board screen box, ruler/label screen
positions, villager_4's head disc (centre + calibrated radius 1.35 × model)
in the new framing — the disc must clear the board's legibility region
(board box inset 10%) entirely, and the label must be fully inside the frame.

## Output form

`CORRECTION:` exact new values (which film.js expressions change, to what) ·
`ARITHMETIC:` the projections · `PREDICTED:` board/ruler/label screen boxes +
villager_4 disc position vs the legibility region · `RISKS:`. Plain text
only, no tool calls, no simulated execution.
