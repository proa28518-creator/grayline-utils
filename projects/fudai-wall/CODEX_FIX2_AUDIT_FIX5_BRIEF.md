# FIX #2a-6 — audit_staging.mjs: verdict semantics for candidate lines + sea rule (tool only)

Two last measure corrections to `tools/audit_staging.mjs` (that file ONLY; no
threshold changes). Standing method files remain required reading; delta only.

## Correction 1 — case 621/639: candidate detail lines trip the moment verdict
The moment verdict counts any check line containing "FAIL". In the multi-face
branch the per-candidate detail lines print PASS|FAIL for all five candidates,
so the moment fails even when its actual requirement — `faces PASS 2/2` —
passes (a candidate the requirement does not need, e.g. a villager facing
away by design, vetoes the moment). Fix: candidate detail lines in this
branch print WITHOUT the PASS/FAIL word — `<id> angle N° head in|out NNNpx`
(occlusion still named if present). The PASS/FAIL word lives on the
requirement line (`faces PASS|FAIL n/2`) and on the single-subject face
lines, as elsewhere. All measured values stay printed; nothing is hidden.

## Correction 2 — sea patch: centre + span, not corners
The sea is a place surface, not an object: in a wide composition its corners
legitimately leave the frame while the sea itself reads broadly (current
film: span 1278–1400px, corners 1/4). Fix the sea check to: PASS iff the
patch's CENTRE is inside the frustum AND its on-screen vertical span
(the helper from fix #2a-5) is >= 40px. Print
`sea patch PASS|FAIL <span>px centre in|out`.

## Anchors (current film, after the corrections)
- F621/F639 PASS outright (faces 2/2 at 776px + occupancy registered).
- F768/F798/F822: sea patch PASS (span >= 40, centre in); the moments still
  FAIL on their seawall/orb sub-checks — staging, reported as-is.
- Every other moment keeps its current verdict and numbers.

## When done, print
1. The two corrections in one paragraph each.
2. The tool's full output on the current film.
