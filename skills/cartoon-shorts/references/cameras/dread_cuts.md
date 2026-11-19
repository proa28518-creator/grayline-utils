# Dread Cuts

**Feel:** hard cuts on the words, a low camera looking up at them, a tilted horizon that drifts, and a slow push or a small orbit on
every shot, so the place feels wrong without the camera ever showing off.

**Recipe:** a hard cut on a line start or an action, every 1.2-3.5 s, never two near-identical angles in a row. Lens fov 26-32,
camera at chest-to-head height. Every shot moves: a push of 10-15 % or an orbit of 10-15 degrees. Roll 2-5 degrees, changing side
from shot to shot. Dead still only for a silence. The last shot pushes in on the character who knows.

**What makes it work:** the cuts carry the rhythm of the voice, so the viewer never waits. The roll changing sides makes each cut a
small jolt. Holding still only once makes that silence land.

**Suits:** dialogue, tension, horror, anything driven by lines. The safe default for a first cut.
Build it for THIS video's staging and beats; never copy coordinates.

**Tools:** the moves and the `path` camera in `../camera.md`, `film_probe` for the shots and PROP GUARD, `film_sheet { cuts: true }` for framing at the cuts, `render_frames` on the first frame of each shot,
`film_sheet` of the whole film plus `strip` on every fast move. Worked example (one film's shots, never a path to copy):
`.claude/skills/cartoon-shorts/examples/cameras/dread_cuts.json`.
