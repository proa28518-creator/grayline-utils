# CODEX FIX BRIEF v3 — round 2, corrective iteration: the digit strip is still out of frame
(supersedes v2; the v2 edit is IN the tree — this brief corrects it)

## Measured truth from the fleet renders of the v2 edit (driver's eyes, not theory)

- F105 (SH02 pull-back): the storeys tower + its cream digit strip read
  PERFECTLY — digits 5-4-3-2-1 legible beside the gate. The prop and its
  placement zone are right.
- F45 (t=1.5 s) and F60 (t=2.0 s): the glass tower now fills the right half
  of the frame and overflows it — its top is cut, and the digit strip is
  ENTIRELY outside the right edge. No digit is visible in either frame.
  The round's requirement is still unmet at the tilt-up moments themselves.

## The error in the v2 session's math (fix your method, not just the numbers)

Your projections used camera z ≈ 27.6 at t=2.0 s. That is the TILT_POS
**offset** (28) interpolated raw. The WORLD camera z is
COAST_WALL.z + offset = −16 + 28 = **+12**, so the real interpolated camera
at t=2.0 s is ≈ (7.91, 8.90, 11.80) — about 16 D closer than your model,
which is why the tower rendered far larger than your projected bounds.

WORLD coordinates of record (verify against scenes/film.js + scenes/set.js):
- COAST_WALL anchor (0,0,−16); MAYOR (0,0,−9); MAYOR_HEAD (0,1.55,−9)
- CLOSE_POS (0.7, 0.9, −4) — the `from` key; NEVER changes
- Current TILT_POS (8, 9, 12); current TILT_TARGET (5, 9, −16)
- Storeys tower: base centre (6.5, 0, −13.5), width 5.2 (x 3.9…9.1),
  depth 2.4, height 17.4; digit strip on its +x side: strip box centre
  x ≈ 9.62, width 0.9 (x ≈ 9.17…10.07), digit plane facing +z at z ≈ −13.44

## What to change (same single cause — SH01 framing; both levers authorized)

Adjust the storeys offset and/or TILT_POS / TILT_TARGET so that, computed
in TRUE WORLD coordinates at the interpolated (outCubic) camera states:

- t=2.0 s AND t=1.5 s: the digit strip's projected bounds sit INSIDE the
  1080×1920 frame with ≥ 40 px margin from the right edge and ≥ 40 px from
  the top/bottom; all five digits legible (each digit ≥ ~90 px tall on
  screen); the tower's full height and the wall's top edge also in frame.
- Print, for both times: camera pos/target (world), the strip's projected
  pixel bounds, and the tower's projected pixel bounds. Numbers computed
  from offset values instead of world values will be rejected.

Natural directions (your call, prove it numerically): shift the tower left
(storeys offset x 6.5 → ~4–5, strip then at world x ≈ 7.1–8.1) and/or pull
TILT_POS further back (+z) and ease TILT_TARGET.x toward the gate–tower
pair. Keep the tower clear of the mayor's sightline at frame 0 (the `from`
key is untouched, so this is automatic) and keep its base on the ground in
front of the wall face (z between −14.5 and −12.5 world).

## Untouched, again

`from` key byte-identical · SH02 destination (WIDE_POS/WIDE_TARGET/fov 48)
· SH03 · cast · acts · lines · other props · set.js · props/storeys.js ·
pure in t · props ARRAY · storeys `at` == `keys[0].at` · D2 bounds
(COAST_WALL x [−40,40], z [−20,−12] for the prop's `at`).
