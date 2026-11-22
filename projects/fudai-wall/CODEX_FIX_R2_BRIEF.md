# CODEX FIX BRIEF — round 2: the missing 5-storey overlay in SH01's tilt-up

You are the Codex seat, authoring ONE fix in this project (fudai-wall opening,
SH01–SH03). Work only in `scenes/film.js` unless a change elsewhere is strictly
required; if it is, say so in your summary instead of doing it.

## The fault (critic round 1, BLOCKING — missing named prop)

The owner's visualization bible, scene 1 (00:00.10–00:02.60), specifies:
"Vertical Tilt-Up (Low-Angle Hero Shot): the camera starts at the ground beside
the small mayor, then rises vertically to reveal a giant concrete wall, BESIDE
WHICH appears a transparent diagram of a 5-storey building (numbers 1-2-3-4-5)
showing the insane height."

The `storeys` prop exists and builds correctly (transparent glass floors +
numbered 1-2-3-4-5 strip, `scenes/props/storeys.js` — do NOT rewrite it), but
in the rendered tilt-up frames at t=1.5 s (frame 45) and t=2.0 s (frame 60) it
never appears: the frames show wall + gate braces + caption only.

## The cause (verified from the current code — fix THIS)

In `scenes/film.js` the storeys entry sits at
`add(PLACES.COAST_WALL, [14, 0, 0])` = world (14, 0, −16):

- 14 D off the camera axis. SH01's tilt-up ends at `TILT_POS` =
  COAST_WALL + [3.5, 9, 17] = (3.5, 9, 1), target `WALLTOP` = (0, 17, −16),
  fov 38 (vertical) on a 1080×1920 frame — the horizontal half-angle is only
  ≈11°, so at the wall's distance the frame is only ≈±3.5 D wide around the
  axis. x=14 is hopelessly outside it.
- z=−16 is the wall's own plane, so the glass tower is also swallowed by the
  wall face itself.

## The fix (one cause, one change — placement)

Reposition the `storeys` entry (both its `at` and its `keys[0].at` — they must
stay identical, PROP GUARD) so the tower stands BESIDE the wall, in front of
the wall face on the shore side, inside the tilt-up's frustum for the whole
second half of SH01 (t=1.5 s and t=2.0 s must both show it):

- Suggested zone (verify with your own frustum math before committing):
  x ≈ +4.5…+5.5 (right of the gate, clear of the mayor at x=0 and of the
  frame's right edge), z ≈ −13…−14 (in front of the wall face; COAST_WALL
  bounds are x [−40,40], z [−20,−12] — stay inside them, the D2 audit checks).
- The tower is 17.4 D tall, 5.2 D wide, base at y=0. Its numbered strip faces
  +z (toward the camera) — keep that orientation; do not rotate the prop.
- The digits 1-2-3-4-5 must be LEGIBLE in a 1080×1920 still at t=2.0 s: the
  full tower (all five numbered floors) should be inside the frame at t=2.0 s,
  and substantially inside at t=1.5 s, standing against the wall so the
  height comparison reads (tower top ≈ wall top).

## Hard constraints

- Do NOT change `CLOSE_POS` or anything about frame 0 / the `from` key — the
  frame-0 face was fixed last round and must not regress.
- Do NOT touch SH02, SH03, the cast, the acts, the other props, the lines, or
  `scenes/set.js` / `scenes/props/*`.
- Prefer placement-only. A small adjustment to `TILT_POS` or the `to` target
  is permitted ONLY if placement alone cannot put the full numbered tower in
  frame at both t=1.5 s and t=2.0 s — and if you make one, state it and your
  frustum numbers in the summary.
- Pure in t: no Math.random, no Date. `props` stays an ARRAY of
  {id, kind, in, at, keys}. All coordinates derive from the PLACES table via
  the existing `add()` helper — no bare world literals.
- Keep the change minimal and at the cause. In your final summary, state:
  the old offset, the new offset, and your frustum math (camera pos/target at
  t=1.5 s and t=2.0 s, tower corners vs frame edges).
