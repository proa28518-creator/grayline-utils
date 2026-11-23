# GLM — COMPUTE BRIEF · phase 9 · cause: F768–F822 (SH11 flatness; daytime-blue moon sky)

You are GLM, a build seat in Layla's production office for the film
"fudai-wall" (chunk 2). Standing method — read and obey, do not re-derive:
studio `AGENTS.md`; `~/workspace/Production and rules/RULES.md` §3 (one cause,
one change), §4, §5 (set bar: shot ≥22% detail / ≤80% flat; film median ≥28%);
`.suite/critic/CRITIC_PROTOCOL.md` §7; `lessons/build.md`. ONE cause.
Computed values only. Plain text only, no tool calls, no simulated
execution. A complete correction block in the output form below is the only
acceptable deliverable.

## The beat (owner's bible, S4)

Frames 768 (t=25.6), 798 (t=26.6), 822 (t=27.4), shot SH11: the completed
wall + calm sea under a cycling sky — sun low → sun high → MOON — "the wall
finished, the sea stayed calm for years". Critic round 8 (BLOCKING):
"F768–F822 stay flat with a daytime-blue moon sky"; all three are among the
board's flattest frames (SET BAR below bar).

## Scene data (verbatim)

- SH11 camera is a PARK: pos CAM_SH11 = COAST_VILLAGE+[-5,40,0] (world
  [-5,40,2]), target CAM_SH11_T = SEA+[-5.5,9,14] (world [-5.5,9,-30]),
  fov 50. Audit sampled poses ≈ pos [-5,39.7,1.7] / [-5,39.05,1.02] /
  [-5,38.54,0.49], target [-5.5,9,-30]. Audit PASSes: seawall 1138–1194px,
  sea patch vertical span 674–702px, sunorb 112/125px, moonorb 86px.
- Sky cycle (scenes/set.js `states`, COAST_WALL and SEA both carry them):
  from 25.09 sky [.52,.60,.74] sun power .85 low warm → 25.75 sky
  [.42,.58,.80] sun 1.20 high → 26.40 sky [.78,.52,.38] dusk, sun .65 →
  27.05 sky [.07,.10,.22] (dark night blue), ground dark, sun power .14
  colour [.65,.75,1.00] → 27.45 restore toward base → 27.72 base
  [.48,.59,.76]. The states merge CUMULATIVELY over the rig.
- Orbs: sunorb at SEA+[0,0,-16] (world [0,0,-60]) r 1.7, cx/cy keys: 25.75
  cx 0 cy 18 → 26.40 cx 15 cy 8 → 27.05 cx 15 cy -5 (below horizon);
  moonorb r 1.3: 27.05 cx -8 cy 14 → 27.45 cx 6 cy -5.
- F822 is at t=27.4 — inside the 27.05 night state (moon at cx -8→6,
  cy 14→-5 in flight). The critic still reads its sky as DAYTIME blue.
- Pixel truth on the probed stills: all three frames are dominated by the
  flat wall face and flat sky/sea bands; the light cycle READS (round-8
  driver eye: sun-low → sun-high → moon is visible) but the frames are
  compositionally flat — huge uniform regions, little set detail.

## Your computation

Propose ONE correction. Two coupled symptoms — name the lever for each:
(a) FLATNESS: the park's composition (40 D altitude looking down the wall)
fills the frame with uniform wall/sky/sea. A new park (pos/target/fov
within [24,50]) must put detail carriers in frame — the gate + lanterns on
the wall, the village houses/shore at the wall's base, the boat, the orb —
while keeping: seawall in frame, the sea patch visible, the active orb in
frame at each of the three moments, and the wall reading LARGE (it is the
subject). (b) MOON SKY: at F822 the sky must read NIGHT. If the night state
values are right but the render still reads blue, name the mechanism you
suspect from the data (cumulative state merge? the SEA place's sky vs the
COAST_WALL place's sky — which place's sky does a camera at [-5,40,2]
looking at [-5.5,9,-30] actually show?) and propose the value change that
fixes it (state values are set.js data — in scope for this cause if your
arithmetic shows the camera change cannot fix the sky). Show projection
arithmetic (1080×1920) at all three moments for: wall screen extent, orb
screen position/size, sea span, and the detail carriers you add.

## Output form

`CORRECTION:` exact const/state-level changes · `ARITHMETIC:` the
projections per moment · `PREDICTED:` composition + sky read per moment ·
`RISKS:` SH11's other moments (the shot spans t 25.09–29.68; F870 is SH12,
not yours). Plain text only.
