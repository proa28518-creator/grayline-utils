# One Take

**Feel:** you never leave. One unbroken camera floats with them, swings round the group, flies over their heads, shoots through a
doorway into another place and back. No cuts at all.

**Recipe:** a single `path` shot for the whole film. Lead walkers backwards, slide to whoever the line is about, sweep round a group
when they all turn. Beats far apart become flights (over heads, through a door, 30+ D in under a second) timed to land on the first
word of the line. Whip away from a reveal and back so the thing can move while unseen.

**What makes it work:** the flights land on the words, so the move feels motivated. Keys on characters (`{ who, offset }`) keep them
framed while they move. With no cuts there is nothing to hide a change: ease any lighting mood in and out, keep sprites and props out
of the flight lines, and take the path higher over heads.

**Check:** `film_sheet` strips at full frame rate on every flight. Watch for frames inside a head or a wall.
**Suits:** stories in one connected space, chases, a group in trouble. The approved "Flawless" film used it.
Build it for THIS video's staging and beats; never copy coordinates.

**Tools:** the moves and the `path` camera in `../camera.md`, `film_probe` for the shots and PROP GUARD, `film_sheet { cuts: true }` for framing at the cuts, `render_frames` on the first frame of each shot,
`film_sheet` of the whole film plus `strip` on every fast move. Worked example (one film's shots, never a path to copy):
`.claude/skills/cartoon-shorts/examples/cameras/one_take.json`.
