# OPUS — COMPUTE RE-FIRE · phase 10 · cause: F711/F723 (blueprint + ruler occluded by a foreground villager)

You are Opus, a build seat in Layla's production office for the film "fudai-wall" (chunk 2). This is a RE-FIRE: your first reply asked for files to be attached. Everything you need is INLINED below — work from it, do not ask for attachments. ONE cause. Computed values only — you touch no files.

Standing law (inlined, obey): RULES §3 — fix only the biggest gap at its cause, one cause one change; a pass ends only on a fresh critic's VERDICT: YES; the same fault twice means change the method, not the amount. §4 — open on a face; pure in t; never edit the engine copy; anything in a place is in every shot of it (PROP GUARD: nothing is deleted or teleported); faces read within ~60° of camera, big, never cut by the edge. §5 set bar: shot ≥22% detail / ≤80% flat; film median shot ≥28% / ≤78%; ≤40% of shots under. Lessons that bind this cause: the staging audit's occluder set is buildings + seawall + gateleaf only — it does not model characters or props as occluders, which is why this fault passed the audit and failed on pixels; rendered villager silhouette radius calibrates to ~1.35× the model sphere (hat-inclusive).

## The beat (owner's bible, S3 close)

Frames 711 (t=23.7) and 723 (t=24.1), shot SH10: the blueprint insert — the glowing height line, the mayor's hand pinning the ruler at the "15.5M" label. Critic round 8 (BLOCKING): the blueprint and ruler are "blurred and occluded to '5M' by a foreground villager" in both frames.

## Scene data (verbatim from scenes/film.js)

- Line 39: `const CAM_SH10_A=add(BLUEPRINT,[0,3,9]), CAM_SH10_T=add(BLUEPRINT,[0,1.55,0]), CAM_SH10_B=add(BLUEPRINT,[0,3,9]);`
- Line 121: `{id:'SH10',t0:'line:8.word:5',t1:'line:8.end',camera:{move:'push',from:{pos:CAM_SH10_A,target:CAM_SH10_T,fov:48},to:{pos:CAM_SH10_B,target:CAM_SH10_T,fov:48}}}`
- Line 104: `{id:'blueprint',kind:'blueprint',in:'world',at:BLUEPRINT,lineY:1,pin:0,keys:[...]}` with BLUEPRINT = COAST_VILLAGE+[5.2,0,-1.5] = world [5.2, 0, 0.5].
- So the camera sits at world [5.2, 3, 9.5], target [5.2, 1.55, 0.5]. Blueprint board: 3.4×3.4, centre at at+[0,1.7,0]; ruler box at at+[1.28,1.7,.14] (0.18×2.05); label box at at+[1.3,2.82,.14] (0.9×0.28); line point at at+[.15,.75+lineY*1.9,.12] (lineY=1 at F711/F723); palm point at at+[1.42,.75+1.9,.13].
- Cast in COAST_VILLAGE (all stand in the place; PROP GUARD): villager_4 at world [5, 0, 7] (V4 = COAST_VILLAGE+[5,0,5], ry −20); villager_1 [-1,0,4]; villager_2 [1,0,4]; villager_3 [-2,0,6]; villager_5 [-8,0,5]; villager_6 [10,0,6]; mocker_a [4,0,0]; mocker_b [4,0,-1]; mocker_c [6,0,0.5]. Character head centre y=1.9, head sphere r=0.5 (rendered silhouette radius up to ~1.35× the model for hat-wearing villagers — pixel calibration).
- The mayor himself stands at [0,0,2] (walk end).
- Staging audit at F711/F723: blueprint PASS 847px corners 8/8, ruler PASS 522px, label PASS 73px — the audit does not model characters as occluders (see lessons above).

## Pixel truth (measured on the fleet-probed still of F723)

- The foreground villager's head (villager_4, 2.5 D from the camera on the blueprint sightline) measures bbox x 0–801px, y 538–1413px — it fills the left ~2/3 of the frame AND is itself cropped by the left edge.
- The blueprint board's visible region measures only x 718–974px, y 605–1233px; the head overlaps its left portion; the ruler label reads only "5M" — the "15." is behind the head.

## Your computation

Propose ONE correction. The occluder is villager_4 standing between the camera and the board. Levers, in order of preference: (1) SH10 camera position/target (a lateral/vertical shift that takes villager_4's head off the board's legibility region while keeping board + line + palm + ruler + label framed and the mayor's hand beat readable); (2) a small camera reframe + fov change within [24,50]. You may NOT move villager_4 or the blueprint (story geography; the mayor works at this board in the village square) and may NOT shrink the board. Check the mayor at [0,0,2] does not enter the new sightline. Show projection arithmetic (1080×1920) for F723: board screen box, ruler/label screen positions, villager_4's head disc (centre + calibrated radius 1.35 × model) in the new framing — the disc must clear the board's legibility region (board box inset 10%) entirely, and the label must be fully inside the frame.

## Output form

`CORRECTION:` exact new values (which film.js expressions change, to what) · `ARITHMETIC:` the projections · `PREDICTED:` board/ruler/label screen boxes + villager_4 disc position vs the legibility region · `RISKS:`. Plain text only, no tool calls, no simulated execution.
