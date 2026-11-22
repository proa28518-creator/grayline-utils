# CODEX BRIEF — fudai-wall chunk 2 REPAIR (phase 7): SH04–SH12 camera/facing/prop fixes

You are the code seat for the `fudai-wall` film (30 fps, 1080×1920). Chunk 2 (SH04–SH12)
failed its critic round twice. The causes are systematic and are fixed by THIS brief:
camera paths that pass through village buildings, cast facing away from cameras, one
cropped head, several props never entering frame, and a prop kind shadowed by an engine
namesake. Apply the edits below EXACTLY — every new value is given both as a PLACES
expression and as its world coordinates; the two must agree. Do not improvise other
changes. Loader laws D1 (props are an ARRAY of {id,kind,in,at,keys[]}; every point is
derived from the one PLACES table via `add(...)`; no bare world-coordinate arrays) and
D2 (targets inside a place's bounds) bind everything below.

## Files you may touch
- `scenes/film.js` (the edits below, nothing else)
- `scenes/props/sign.js` → renamed to `scenes/props/boardsign.js` (content byte-identical)

Nothing else: no engine/, no lib/, no set.js, no other props, no tools/.

## 1. Camera constants (scenes/film.js const block)

| const | old | new (PLACES expression) | world |
|---|---|---|---|
| CAM_SH04_A | `add(PLACES.COAST_VILLAGE,[-11,4.2,10])` | `add(PLACES.COAST_VILLAGE,[-8,2.8,6.5])` | (-8, 2.8, 8.5) |
| CAM_SH04_B | `add(PLACES.COAST_VILLAGE,[11,4.2,10])` | `add(PLACES.COAST_VILLAGE,[8,2.8,6.5])` | (8, 2.8, 8.5) |
| CAM_SH05_A | `add(PLACES.COAST_WALL,[-21,5.5,22])` | `add(PLACES.COAST_VILLAGE,[-23,9.5,3])` | (-23, 9.5, 5) |
| CAM_SH05_B | `add(PLACES.COAST_WALL,[19,5.5,22])` | `add(PLACES.COAST_VILLAGE,[23,9.5,3])` | (23, 9.5, 5) |
| CAM_SH05_TA | `add(PLACES.COAST_WALL,[-4,7,2])` | `add(PLACES.COAST_WALL,[-12,8,2.5])` | (-12, 8, -13.5) |
| CAM_SH05_TB | `add(PLACES.COAST_WALL,[4,7,2])` | `add(PLACES.COAST_WALL,[10,9,2.5])` | (10, 9, -13.5) |
| CAM_SH06_A | `add(PLACES.NEIGHBOR_COAST,[-19,8.5,15])` | `add(PLACES.NEIGHBOR_COAST,[-18,7,10])` | (582, 7, 10) |
| CAM_SH06_B | `add(PLACES.NEIGHBOR_COAST,[19,8.5,15])` | `add(PLACES.NEIGHBOR_COAST,[18,7,10])` | (618, 7, 10) |
| CAM_SH06_TA | `add(PLACES.NEIGHBOR_COAST,[-4,5.5,-6])` | `add(PLACES.NEIGHBOR_COAST,[-10,4.5,-9.8])` | (590, 4.5, -9.8) |
| CAM_SH06_TB | `add(PLACES.NEIGHBOR_COAST,[4,5.5,-6])` | `add(PLACES.NEIGHBOR_COAST,[6,4.5,-9.8])` | (606, 4.5, -9.8) |
| CAM_SH07_A | `add(MOCK_A_HEAD,[.6,.25,3.1])` | `add(MOCK_A_HEAD,[.6,.25,4.3])` | (3.6, 1.8, 4.8) |
| CAM_SH07_B | `add(PLACES.COAST_VILLAGE,[2,5.2,11.5])` | `add(PLACES.COAST_VILLAGE,[2,5.2,7.2])` | (2, 5.2, 9.2) |
| CAM_SH07_TB | `add(PLACES.COAST_WALL,[2.2,7.5,4])` | `add(PLACES.COAST_WALL,[2.2,8.8,4])` | (2.2, 8.8, -12) |
| CAM_SH08_A | `add(PLACES.COAST_VILLAGE,[-6,3.2,9])` | `add(PLACES.COAST_VILLAGE,[-7,3,6])` | (-7, 3, 8) |
| CAM_SH08_B | `add(PLACES.COAST_VILLAGE,[7,3.6,9.5])` | `add(PLACES.COAST_VILLAGE,[8,3,6])` | (8, 3, 8) |
| CAM_SH08_TA | `add(PLACES.COAST_VILLAGE,[2,1.6,-1])` | `add(PLACES.COAST_VILLAGE,[2.6,1.55,-0.8])` | (2.6, 1.55, 1.2) |
| CAM_SH09_A | `add(PLACES.COAST_VILLAGE,[.5,1.7,4.4])` | `add(PLACES.COAST_VILLAGE,[.5,1.75,4.6])` | (0.5, 1.75, 6.6) |
| CAM_SH09_B | `add(PLACES.COAST_VILLAGE,[.3,1.65,2.9])` | `add(PLACES.COAST_VILLAGE,[.3,1.8,3.1])` | (0.3, 1.8, 5.1) |
| CAM_SH09_T | `add(PLACES.COAST_VILLAGE,[0,1.55,0])` | `add(PLACES.COAST_VILLAGE,[0,1.9,0])` | (0, 1.9, 2) |
| CAM_SH10_A | `add(BLUEPRINT,[0,1.9,3.1])` | `add(BLUEPRINT,[0,2.0,5.4])` | (5.2, 2.0, 5.9) |
| CAM_SH10_B | `add(BLUEPRINT,[0,1.8,2.6])` | `add(BLUEPRINT,[0,1.9,4.9])` | (5.2, 1.9, 5.4) |
| CAM_SH10_T | `add(BLUEPRINT,[0,1.55,0])` | `add(BLUEPRINT,[0,1.62,0])` | (5.2, 1.62, 0.5) |
| CAM_SH11 | `add(PLACES.COAST_WALL,[-13,7.5,-18])` | `add(PLACES.COAST_WALL,[-20,10,-30])` | (-20, 10, -46) |
| SUNORB | `add(PLACES.SEA,[0,0,-16])` | `add(PLACES.COAST_WALL,[0,6,6])` | (0, 6, -10) |
| CAM_SH12_A | `add(PLACES.COAST_VILLAGE,[-6,6.5,4])` | `add(PLACES.COAST_VILLAGE,[-6,7,14])` | (-6, 7, 16) |
| CAM_SH12_B | `add(PLACES.COAST_VILLAGE,[-6,9.5,-5])` | `add(PLACES.COAST_VILLAGE,[-6,7.5,4])` | (-6, 7.5, 6) |
| CAM_SH12_TA | `add(MOCKSIGN,[0,-1.3,-.3])` | `add(PLACES.COAST_WALL,[-6,6.8,4])` | (-6, 6.8, -12) |
| CAM_SH12_TB | `add(PLACES.COAST_WALL,[-6,12.6,1.6])` | `add(PLACES.COAST_WALL,[-6,8.2,1.7])` | (-6, 8.2, -14.3) |

Add two NEW consts (place them next to their shot's other consts):
- `CAM_SH04_TA=add(PLACES.COAST_VILLAGE,[0,2.2,-0.5])` → world (0, 2.2, 1.5)
- `CAM_SH04_TB=add(PLACES.COAST_VILLAGE,[0,5.6,-3.5])` → world (0, 5.6, -1.5)
- `CAM_SH08_TB=add(PLACES.COAST_VILLAGE,[-3.4,1.55,1.4])` → world (-3.4, 1.55, 3.4)

## 2. Cast facing (agenda: never a back to camera)

In the `cast:{...}` block: `mocker_a`, `mocker_b`, `mocker_c` — change `ry:180` to `ry:0`.
Nothing else in cast changes. (Facing convention, proven by the passed opening: ry 0
faces +z/south, toward the southern cameras; ry 180 showed their backs.)

## 3. Props

- **calendar**: change its `at` from `add(PLACES.COAST_WALL,[5.5,0,3.4])` to
  `add(PLACES.COAST_WALL,[1.8,0,3.4])` — BOTH occurrences (the prop def and its
  `line:4.start` key). No other calendar change (page keys untouched).
- **sign kind rename**: the film-local `sign` kind is shadowed by an engine namesake.
  Rename the film-local kind to `boardsign`:
  - file `scenes/props/sign.js` → `scenes/props/boardsign.js` (content byte-identical;
    delete the old file);
  - in film.js, `kind:'sign'` → `kind:'boardsign'` in exactly these 5 props:
    popsign, moneysign, sticker_a, sticker_b, mocksign. No other prop field changes.

## 4. Shots

- **SH04**: from target `CAM_SQUARE` → `CAM_SH04_TA`; to target `CAM_SQUARE` → `CAM_SH04_TB`;
  fov 44 → 48 (both ends).
- **SH05**: fov 42 → 50 (both ends). (Positions/targets change via §1 consts.)
- **SH06**: fov 44 → 52 (both ends).
- **SH07**: to fov 40 → 44. (From end, roll, target consts otherwise as-is; §1 changes
  CAM_SH07_A / CAM_SH07_B / CAM_SH07_TB.)
- **SH08**: to target `CAM_SH08_TA` → `CAM_SH08_TB`. (From target stays CAM_SH08_TA; fov 42.)
- **SH09**: add `lowCam:true` to the SH09 shot object (shot level, alongside id/t0/t1 —
  the loader's lowCams pass honours `s.lowCam === true` and then keeps the camera as
  authored instead of raising it to the chest floor).
- **SH10**: fov 34 → 36 (both ends).
- **SH11**: fov 40 → 42. (Park position changes via the CAM_SH11 const in §1; the orbs
  reposition via the SUNORB const in §1 — do not touch the orb props or their keys.)
- **SH12**: from fov 40 → 44; to fov 36 → 44.

## 5. Hard limits

- SH01, SH02, SH03 shot entries: byte-identical. MAYOR_HEAD, CAM_SQUARE, MOCKSIGN,
  BLUEPRINT, COINS consts: unchanged. All other props/acts/keys: unchanged.
- No bare coordinate arrays anywhere: every changed point stays an `add(...)` PLACES
  expression exactly as tabled in §1.

## 6. Verify before you report

Run from the project directory:
- `node --check scenes/film.js`
- `node tools/audit_d1_d2.mjs` — must print PASS, including the D2-CLEAR building-
  clearance section (14 solids; chunk-2 camera paths must intersect none).
Report: the list of edits applied, and both commands' output verbatim.
