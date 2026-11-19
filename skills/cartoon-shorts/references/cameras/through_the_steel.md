# Through the Steel

**The idea, one line:** the camera goes where the sound goes.

**Feel (from the film it was invented for, a sunken submarine):** you pull back from a face through steel and up through the water
into daylight, ride the sub down until the seabed slams into her, follow a knock through the hull from the diver to the men inside
and back out to his face. The question climbs to the surface, the answer drops back onto their upturned faces. It feels like one
breath, broken only by hits.

**Recipe:** find the thing that crosses the walls in this story (a sound, a signal, a rumour, a smell, a phone call) and make the
camera travel with it, so places far apart become one move. Join places on a frame that looks the same on both sides: fly into a wall
until it fills the frame and come out of another, pass a water surface, or swish over the same sky in both places (camera.md
"Seams"). Keep each crossing under 8 frames, and land on the next face on the beat of the word. Between crossings stay close on faces,
lens 26, with a slow push. Hard cut only where the hit is stronger than the glide. Open tight enough that no second face touches the
frame edge. Anything very long in 9:16 (a ship): stay within 10 degrees of its axis. Lead a walker from the side he walks towards.

**What makes it work:** one sentence decided every move. It came from a fresh Claude given a two-sentence brief and the other four
sets, which took their logic (One Take's flights, Dread Cuts' hard cuts on hits) and invented seams. That is the point of these
instruction sets: take the logic, invent for your story.

**Check:** every flight frame by frame (`film_sheet` strips) for neighbours' heads in the camera's way.
**Suits:** stories in several places joined by one thread. Needs a set with places (sets.md).

**Tools:** the moves and the `path` camera in `../camera.md`, `film_probe` for the shots and PROP GUARD, `film_sheet { cuts: true }` for framing at the cuts, `render_frames` on the first frame of each shot,
`film_sheet` of the whole film plus `strip` on every fast move. Worked example (one film's shots, never a path to copy):
`.claude/skills/cartoon-shorts/examples/cameras/through_the_steel.json`.
