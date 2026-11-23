# Review: how to look at the film

Every pass is judged by LOOKING at pictures, not by reading code or trusting numbers. Numbers point you at the frames to look at.

## The tools
| tool | gives | use it for |
|---|---|---|
| `film_sheet {}` | the whole film, every 3rd frame tiled, frame numbers, a yellow bar on each shot's first tile | the rhythm of cuts, a face in every shot, nothing growing out of heads, the whole look at once. The best review tool there is |
| `film_sheet { from, to }` | a range of the film | one scene, one place |
| `film_sheet { strip: 'A-B' }` | every frame from A to B, at full rate | every fast move, every seam, every light change. A camera through a head showed on ONE frame that every-3rd-frame sheets hid |
| `render_frames { times, scale }` | up to 8 real frames, full size | faces, hands on props, contact with the floor, a set detail, before/after of one change |
| `film_probe {}` | the shots (times, moves, the words in them), the cast, lines and words, the PROP GUARD verdict over every frame; writes `.suite/resolved.json` | after any change to props, hands or shots |
| `film_check { kind: 'set' }` | the SET BAR per shot: how much of the frame is detailed set versus flat background, fog or void (about 3 frames a shot, no captions); the film's median | Build (measure it), Environment, Post, Shading (must pass: shot 22 %+ detail, at most 80 % flat; film median 28 %+ / at most 78 %; at most 40 % of shots under) |
| `film_check { kind: 'same' }` | characters (drawings, acting), props, shots and voice against the start of this step (the app saves the start before every step; `reset: true` makes now the start) | every pass after Build: what must not change, did not |
| `film_check { kind: 'calm', still: 'A-B,C-D' }` | light jumps in parts of the frame while the camera is still (give the still frame ranges; frames drawn without captions) | shading, lights that move |
| `film_check { kind: 'flicker' }` | whole-frame brightness jumps that are not on a cut (no captions). A flash the film means is listed too: look before you fix | post, shading, dying lamps |
| `film_check { kind: 'shade_jumps' }` | the shading formula at face, forehead, chin, cheek, chest per frame | shading |
| `tex_job { kind: 'sheet', names: [...] }` | a labelled contact sheet of pictures or folders in the project (clay renders, texture previews; default `assets/tex/preview`), shown to you | environment |

Not measured by any tool (look instead): faces readable and not swallowed by an effect, feet on the floor, hands on props, limbs
through bodies. `render_frames` on those moments, strips on the moves.
| `check_preview` | load errors, runtime errors, film errors | after every edit |

Each run has a frame budget (a guard against sweeping the same frames again and again, never a reason to look less): one sheet
is one picture, so a sheet shows more of the film per picture than eight single frames. Look at what changed.

## The loop (every pass)
1. Change something real. Fix radically, not by nudges.
2. `check_preview`. A film error names the key: fix it before anything else.
3. Look: a `film_sheet` of the part you changed, strips on the moves, `render_frames` on the faces.
4. Put your frames at `scale: 1` next to the bar stills (`references/bar/`, `references/quality-bar.md`) and write down what the bar
   has that yours lacks, worst first. Fix that. Again.
5. When, next to the bar stills, nothing big is missing (not when the checks pass: checks only say nothing broke), run the critic
   rounds (`references/critic.md`). The pass ends when its exit list is true and a fresh critic says YES. Finish with a `film_sheet`
   of the WHOLE film and the pass's `film_check`s. If the app stopped the pass (only with Faster builds and its time limit), say
   plainly what is still below the bar.

## What to ask of a sheet, in this order
1. Is there a readable face in the first frame, and in every shot?
2. Does every shot change angle or size from the one before? Is anyone cut by the frame edge?
3. Does anything grow out of a head (a pole, a wire, a lamp behind it)?
4. Does a prop pop, jump or vanish inside a shot?
5. Is the light the same story as before (same place, same colour character), and is the subject the brightest, sharpest thing?
6. Does anything repeat like a pattern (tiles, sprinkles, blotches)?

## Before and after, at full size, against the bar
A pass changes one thing. Render the same frames before your first edit (`render_frames` at `scale: 1` on 4-6 key times, kept in
your notes) and after. Compare them side by side AND with the bar stills: small sheets hide flat light, missing haze and a wall right
behind the heads. A lovely effect that loses the subject is a step back: judge on the whole film, not one frame. An effect turned
down until it is gone is a step back too.

## The look questions (ask them of your full-size frames next to the bar stills)
1. Is there space behind the faces (a far end, a vanishing point), or a wall a metre away?
2. Is there modelled detail near the camera and at the frame edges, a ceiling, a floor that tells a story?
3. Can you see where the light comes from, and does it light the faces from that side?
4. Does the far end fade into haze? Is the background softer than the faces?
5. Does each place have its own colour mood you would notice with the sound off?
6. Do the faces have a key colour and a shadow colour, or are they flat?

## Lessons file and the HANDOVER
Each step keeps `lessons/<step>.md` in the project: what you tried, what you saw, what fixed it, what is still weak. Read every
lessons file first when any step runs (a Post pass reads the Build, Camera and Environment HANDOVERs; a second Camera pass reads
`lessons/camera.md`). Short lines, newest at the bottom. The file ENDS with this block, the next pass's starting point:
```
## HANDOVER (<step>, <date>)
AT THE BAR: <what this pass brought to the bar, with the numbers: set bar detail / flat, critic rounds and the last verdict, the blind score>
STILL BELOW THE BAR (worst first): <film time or shot, the fault, what the bar has instead, whose job it is: this pass again | camera | environment | post | shading>
DO NOT TOUCH: <what this pass settled that later passes must keep: a reframed shot, a light state, a fixed dark-frame camera>
NOT CHECKED: <what nobody looked at: a strip not opened, a sheet that did not come back>
```
A HANDOVER with nothing under STILL BELOW THE BAR and NOT CHECKED is a pass that did not look hard enough.
