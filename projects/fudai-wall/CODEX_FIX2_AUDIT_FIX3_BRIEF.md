# FIX #2a-4 — audit_staging.mjs: camera-grammar bounds (tool only)

Small amendment to `tools/audit_staging.mjs` (that file ONLY). Standing method
files remain required reading as in the earlier fix-#2 briefs; this is the delta.

## Why
The first re-stage pass satisfied several checks with cameras no film in this
production could use — sampled fovs of 110°, 170° and 174° (fisheye), a camera
hovering 21 D in the air for a face close-up. The checks measured framing but not
whether the camera obeys the film's grammar. Encode the grammar:

## Add two per-moment checks (a failure of either fails the moment)
1. **FOV grammar:** the sampled fov at the moment must lie within **[24, 50]**
   (the production's range: opening 34–48, engine default 26, BIBLE grammar).
   Outside → FAIL line `fov <N> out of grammar [24, 50]`.
2. **Camera in solid:** the sampled camera position must not lie inside any
   occluder box (the D2 building solids + seawall + gateleaf boxes the tool
   already models), expanded by 0.3 D on all sides. Inside → FAIL line
   `camera inside <name>`.

## Anchors (current film — the gamed re-stage still in the tree)
- F345/F414 FAIL on fov (110), F590 FAIL on fov (174), F768/F798/F822 FAIL on
  fov (170), F474 FAIL on fov (66), F219/F241 FAIL on fov (56).
- F669 keeps PASS (fov 31.18, camera clear).
- All other sub-checks keep printing exactly as now.

## When done, print
1. The two checks in one paragraph.
2. The tool's full output on the current film.
