# CODEX BRIEF — Fudai opening — FIX R1: frame-0 face framing (ONE change)

You are the code seat for this build (repo AGENTS.md authorship rule). This is a fresh,
bounded session. Read this brief fully, make the ONE edit it names, and report exactly
what you changed. Nothing else.

## The defect (see the two attached stills)

The film is `projects/fudai-wall` (cartoon-shorts, fps 30, 1080×1920). Its opening shot
SH01 is a push that starts tight on the Mayor's face at the seawall's base and tilts up
to the wall top. A fresh critic round failed the opening on ONE biggest gap:

> Frame 0 (t = 0) does not land on the Mayor's complete face: the head is CROPPED at the
> top edge of the frame (attached still frame_0000.png — the crown and the top of the
> eyes are cut off). The law (RULES §4): the film opens on a character's expressive face,
> faces are never cut by the edge, and the Build exit wants the frame-0 head ≥ 300 px.

The second attached still (frame_0003.png, t = 0.10 s) shows the SAME shot a moment
later: the complete face reads there (deadpan, grey hair, brow up). So the cast, the
acting and the look are right — only the t = 0 framing of SH01's `from` camera is wrong:
the camera starts too close / too low for the head to fit at fov 34.

## Current state (scenes/film.js — read it before editing)

- Mayor stands at `MAYOR = PLACES.COAST_WALL + [0,0,7]`; head centre
  `MAYOR_HEAD = [MAYOR.x, 1.55, MAYOR.z]` (the head is ≈ 1 D in diameter).
- SH01: `camera:{move:'push', from:{pos:CLOSE_POS, target:MAYOR_HEAD, fov:34},
  to:{pos:TILT_POS, target:WALLTOP, fov:38}}` with
  `CLOSE_POS = PLACES.COAST_WALL + [0.7, 0.9, 10.2]` — i.e. only ≈ 3.2 D in front of the
  mayor and BELOW his head centre, looking up: at fov 34 the head overflows the top.

## The ONE change

In `projects/fudai-wall/scenes/film.js` ONLY: reframe SH01's `from` camera — adjust
`CLOSE_POS` and/or the `from` entry's `fov`/`target` — so that at t = 0:

1. The Mayor's COMPLETE head is inside the frame with a visible margin above the crown
   (nothing of the head touches or crosses any frame edge).
2. The head still reads BIG and tight (head height ≥ 300 px on the 1080×1920 frame) and
   the angle stays a LOW angle at the wall's base (the bible's staging: camera below the
   face, looking slightly up — keep that character; just make the whole head fit).
3. The face at t = 0.10 s must still read as it does in frame_0003.png (the push eases
   from the new `from` toward the unchanged `to`).

Everything else stays byte-identical in intent: the `to` key of SH01, SH02, SH03, the
cast, the acts, the props array, the 24 voice lines, `set.js`, `post.js`, `shade.js`.

## Hard rules

- Edit ONLY `projects/fudai-wall/scenes/film.js`. Never touch `engine/`, `world/`,
  `lib/`, `specs/`, `audio/`, or any other file or project.
- Pure in t: no `Math.random`, no `Date`, no cross-frame state.
- Do NOT run any rendering, server, or preview command (no board.cjs, no bin/heart, no
  stills). Verification is done by the driver on the GitHub fleet, not by you.
- Keep the file's existing style (compact const-driven staging from the PLACES table —
  `CLOSE_POS` stays an offset from `PLACES.COAST_WALL`; no bare place coordinates).

## Report

End with a short report: the exact before/after values you changed (CLOSE_POS offset
and/or from-fov/target), and the geometric reasoning in one or two lines (distance,
angle, and why the whole ≈1 D head now fits at t = 0 with margin while staying ≥ 300 px).
