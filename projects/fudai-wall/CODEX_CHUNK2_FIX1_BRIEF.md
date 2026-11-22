# CODEX BRIEF — fudai-wall chunk 2 FIX #1 (phase 7): camera lines clear of buildings

You are the code seat for the `fudai-wall` film (30 fps, 1080×1920). ONE cause, ONE change.

## The cause
Round 6's critic found empty probe frames 241 / 570 / 590 / 639 / 798. Their deepest
cause: the chunk-2 camera lines pass THROUGH village buildings (the town hall and the
house row) — the camera flies inside solid geometry, so those frames render black.
This fix moves ONLY the offending camera lines out of the buildings. Nothing else.

## Files you may touch
- `scenes/film.js` (the 7 const edits below, nothing else)

Nothing else: no engine/, no lib/, no set.js, no props, no tools/, no other consts.

## The edits — 7 camera-position consts only

| const | old | new (PLACES expression) | world |
|---|---|---|---|
| CAM_SH04_A | `add(PLACES.COAST_VILLAGE,[-11,4.2,10])` | `add(PLACES.COAST_VILLAGE,[-8,2.8,6.5])` | (-8, 2.8, 8.5) |
| CAM_SH04_B | `add(PLACES.COAST_VILLAGE,[11,4.2,10])` | `add(PLACES.COAST_VILLAGE,[8,2.8,6.5])` | (8, 2.8, 8.5) |
| CAM_SH05_A | `add(PLACES.COAST_WALL,[-21,5.5,22])` | `add(PLACES.COAST_VILLAGE,[-23,9.5,3])` | (-23, 9.5, 5) |
| CAM_SH05_B | `add(PLACES.COAST_WALL,[19,5.5,22])` | `add(PLACES.COAST_VILLAGE,[23,9.5,3])` | (23, 9.5, 5) |
| CAM_SH07_B | `add(PLACES.COAST_VILLAGE,[2,5.2,11.5])` | `add(PLACES.COAST_VILLAGE,[2,5.2,7.2])` | (2, 5.2, 9.2) |
| CAM_SH08_A | `add(PLACES.COAST_VILLAGE,[-6,3.2,9])` | `add(PLACES.COAST_VILLAGE,[-7,3,6])` | (-7, 3, 8) |
| CAM_SH08_B | `add(PLACES.COAST_VILLAGE,[7,3.6,9.5])` | `add(PLACES.COAST_VILLAGE,[8,3,6])` | (8, 3, 8) |

Why these clear the buildings (building solids are in `tools/audit_d1_d2.mjs`, D2-CLEAR):
SH04's new line runs at z=8.5, south of the town hall (z≥9.5) and the house row
(z≥8.95); SH05's new line flies at y=9.5, above every roof (max 6.4); SH07's new
to-position (2, 5.2, 9.2) stops 0.3 short of the town hall's z=9.5 face; SH08's new
line runs at z=8, south of the town hall and the house row.

## Hard limits
- NO target, fov, cast, prop, or shot-entry changes. NO new consts. SH06, SH09, SH10,
  SH11, SH12: untouched. SH01–SH03 shot entries: byte-identical. Every changed point
  stays an `add(...)` PLACES expression exactly as tabled.
- This fix does NOT promise any framing outcome beyond "the camera no longer flies
  through a building" — the critic judges the frames afterwards.

## Verify before you report
Run from the project directory:
- `node --check scenes/film.js`
- `node tools/audit_d1_d2.mjs` — must print PASS, including the D2-CLEAR section
  (14 building solids; chunk-2 camera paths must intersect none).
Report: the list of edits applied, and both commands' output verbatim.
