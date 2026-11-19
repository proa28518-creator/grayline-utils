# The Watcher

**Feel:** something is watching them. A very long lens from far away, dead level, creeping closer slowly, peeking through a doorway
and from down a hallway. Fewer cuts, long holds, and it ends tight on a face.

**Recipe:** lens fov 9-16 from 15-25 D, so depth flattens and people look trapped against the walls. No roll, no shake, never faster
than a creep (about .5 D/s). Hide behind a door frame or a corner when one is there. Cut less than the script's beats, and hold
through the talk. A dead-still shot for the silence. The last shot closes on the character who knows.

**What makes it work:** the viewer becomes the threat. The long lens and the stillness are the opposite of the characters' panic.
Long lens through a doorway: aim from the subject through a point just inside the door, camera on that line, or the door edge fills
the frame.

**Suits:** dread, stalking, secrets, anything where the audience knows more than the characters.
Build it for THIS video's staging and beats; never copy coordinates.

**Tools:** the moves and the `path` camera in `../camera.md`, `film_probe` for the shots and PROP GUARD, `film_sheet { cuts: true }` for framing at the cuts, `render_frames` on the first frame of each shot,
`film_sheet` of the whole film plus `strip` on every fast move. Worked example (one film's shots, never a path to copy):
`.claude/skills/cartoon-shorts/examples/cameras/the_watcher.json`.
