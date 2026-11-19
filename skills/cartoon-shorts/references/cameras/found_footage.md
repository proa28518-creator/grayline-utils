# Found Footage

**Feel:** one of them is filming. Wide phone lens, eye level, right up in their faces, shaky hands, whip pans instead of cuts. The
shake grows when the danger comes closer. Cuts only where the tape would jump.

**Recipe:** lens fov 46 at 4-5 D from the face. `shake` 1 at rest, 2 on a jolt, 3 in panic, .5 holding their breath; `walk` 1 while
the person filming moves. Between speakers in one place: whip the aim in 5-7 frames with a `stop` on the new face. Hard cut only when
the action is somewhere the operator could not walk to. Zoom (fov 46 to 18) to read something far away.

**What makes it work:** the camera has a body and a fear. Everything it does is something a scared person with a phone would do.
The operator's own character is never in frame (or only a hand).

**Suits:** horror, mysteries, "I was there" stories, anything that wants to feel real.
Build it for THIS video's staging and beats; never copy coordinates.

**Tools:** the moves and the `path` camera in `../camera.md`, `film_probe` for the shots and PROP GUARD, `film_sheet { cuts: true }` for framing at the cuts, `render_frames` on the first frame of each shot,
`film_sheet` of the whole film plus `strip` on every fast move. Worked example (one film's shots, never a path to copy):
`.claude/skills/cartoon-shorts/examples/cameras/found_footage.json`.
