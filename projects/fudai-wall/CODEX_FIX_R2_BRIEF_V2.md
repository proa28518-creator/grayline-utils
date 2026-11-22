# CODEX FIX BRIEF v2 — round 2: the 5-storey overlay in SH01's tilt-up
(supersedes CODEX_FIX_R2_BRIEF.md; read that one for the fault and the bible spec)

## What v1 got wrong (your own verified math, accepted)

At SH01's current `to` framing (camera ≈17 D from the wall, target WALLTOP
(0,17,−16), fov ≈38), the visible vertical span at the wall plane is only
≈11.7 D — the 17.4 D tower cannot fit at t=1.5 s / t=2.0 s by placement
alone, and with the target at the wall top its lower floors sit below the
frame. Placement-only is impossible. This v2 brief therefore authorizes the
camera reframe as part of the same single cause: **the tilt-up's framing
never brings the overlay into the picture.**

## Authorized change — TWO linked edits, one cause (SH01 framing)

1. **Storeys placement** (as in v1): move the `storeys` entry in
   `scenes/film.js` (its `at` AND its `keys[0].at`, kept identical) from
   COAST_WALL + [14, 0, 0] to beside the gate in front of the wall face —
   zone x ≈ +4.5…+5.5, z ≈ −13…−14 world (COAST_WALL bounds x [−40,40],
   z [−20,−12] — stay inside). Numbered strip keeps facing +z (camera side).
   Do not rewrite `scenes/props/storeys.js`.

2. **SH01 `to` reframe** (now authorized): change `TILT_POS` and/or the `to`
   target so the tilt-up ENDS on a framing where the wall reads giant AND
   the full numbered tower stands beside it. Design targets:
   - At t=2.0 s: the FULL tower (all five numbered floors, y 0…17.4, incl.
     the digit strip) AND the wall's top edge are inside the 1080×1920
     frame with margin on every side; digits 1-2-3-4-5 legible.
   - At t=1.5 s: the tower is substantially in frame — at minimum its
     numbered strip legible with ≥4 of 5 digits visible.
   - The natural way: pull `TILT_POS` further back (+z) and aim the `to`
     target near the wall's mid-height between the gate and the tower
     (y ≈ 8.5–9.5) instead of WALLTOP. Verify with explicit frustum math
     at the INTERPOLATED camera states for t=1.5 s and t=2.0 s (SH01 spans
     t 0→2.6 s, move 'push' from CLOSE_POS/MAYOR_HEAD/fov 34 to the new
     `to`), not just at the end key.
   - The move must still READ as a vertical tilt-up hero reveal starting
     from the mayor's face at ground level: do not change the `from` key
     at all (CLOSE_POS, MAYOR_HEAD target, fov 34 stay byte-identical).

## Knock-on you must respect

- `TILT_POS` is also SH02's `from` pos. SH02's destination is unchanged
  (WIDE_POS / WIDE_TARGET / fov 48) — the pull-back must still land on the
  proven wide composition at line:1.end. Changing SH02's start point is
  accepted; changing its end is NOT.
- SH03, cast, acts, lines, other props, set.js: untouched.
- Pure in t (no Math.random/Date); props stays an ARRAY; all coordinates
  via the PLACES table + `add()` helper; storeys `at` == `keys[0].at`.

## Deliverable

Apply the edits, then print: old/new storeys offset, old/new TILT_POS and
`to` target, and your frustum numbers at t=1.5 s and t=2.0 s (camera pos,
target, tower corner projections vs frame edges, digit-strip angular size).
