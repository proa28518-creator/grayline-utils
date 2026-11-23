# PHASE 45 · CAUSE 10 — SH19/SH20 STAND-POINT REPAIR, FIX SHAPE (A) — APPLICATION RECORD
<!-- Seat attribution: production driver (seat 1), phase 45, 2026-11-23. Driver-operated
     application of the dispatcher's recorded ruling; no driver-authored film design. -->

## Previous verdict this application cites (hard-gate requirement)
Commit `1d110c0` — phase-44 verdict: cause 10 CONVICTED (the FLASHBACK_ROCK
dodecahedron, set.js:58, `THREE.DodecahedronGeometry(9,0)` at [1200,5,−5],
circumradius 9.000 / inradius 7.152, embeds mayor_young's head [1200,1.9,2]
1.012 inside the built solid); fix priced at the staging layer in shapes
(A)/(B), dispatcher's call. The dispatcher ruled shape (A). Tree stands at
the last judged state, HEAD `1d110c0`; chunk 3 staging 34/40; D1/D2 PASS
zero lines; film.js baseline md5 `ddf21428…`. No judgement pending.

## The change (fix shape A, stands only — nothing else)
Method basis: the new tree, `cartoon-style-copy/skill/cartoon-shorts`
(pitfalls: "Read every camera key against the geometry before placing
anything"; keep each character in one place). Both of mayor_young's
FLASHBACK_ROCK stands move landward to z-offset 4.5, so the character
stands at ONE place for the whole flashback (lines 17–18):
- `scenes/film.js:50` (CAST3 base stand, SH19 basis): offset [0,0,2] → [0,0,4.5]
  → root [1200,0,4.5].
- `scenes/film.js:58` (ACTS3 place key at line:18.start, SH20/SH21 basis):
  offset [.9,0,−1.10] → [.9,0,4.5] → root [1200.9,0,4.5].
No camera, prop, look, face, set or audio data touched. film.js md5 after
application: `9ed45cb0…`.

## Driver recompute against the actual built geometry (NOT the pricing)
Transient script on the project's own vendored THREE (phase-38/44 pattern:
created/run/deleted), exact Möller–Trumbore segment–triangle tests +
ray-parity classification on the 36-triangle built solid. Sanity anchor
reproduces phase 44 exactly (old head: dist 7.656, boundary 8.667, inside
by 1.012).
- Stand A [1200,·,4.5]: root/head/top parity-OUT; 15-point body grid 0/15
  inside; head-sphere (±0.5 axis points) 0/6 inside; head along-ray
  clearance **+1.149** (phase-44 pricing ≈1.2 ✓); root clearance **+2.433**
  (pricing ≈2.8 — the measured value stands).
- Stand B [1200.9,·,4.5]: root/head/top parity-OUT; grid 0/15; head sphere
  0/6; head clearance **+1.645**; root clearance **+2.442**.
- The stand repair itself is therefore verified at the geometry layer:
  the mayor is out of the solid at both stands, with margin.
- Sightline evidence recorded for the judgement (same mesh tests):
  segments from BOTH standing SH19 stations (baseline F1367/F1410 and the
  phase-43 R2 candidate stations) to the new head cross the solid twice
  (enter ≈ t 0.66–0.70, exit ≈ t 0.95–0.97); a 13-point head-sphere fan
  from each of the four stations reads **13/13 blocked** — at z 4.5 the
  mayor stands in the rock's seaward shadow. The SH20 camera is inside the
  solid (FrontSide culling: the rock draws nothing from inside), so SH20's
  question on the new basis is framing, which the audit + eye decide.

## Judgement plan (serial, per the phase-45 tasking)
(1) corrected staging audit + D1/D2 on the applied tree; (2) fleet stills
F1367/F1410/F1428 (`render:N:N+1`); (3) pixel gate + eye — the mayor must
be visibly PRESENT; a coded PASS with the subject absent is a FAIL;
(4) SH20/SH21 re-judgement on the new basis (audit + fleet F1518/F1542/
F1635 + eye); (5) verdict commit. If verification fails, this application
reverts byte-identical to baseline (film.js md5 `ddf21428…`); no other
fix shape is improvised — that needs a dispatcher ruling.
