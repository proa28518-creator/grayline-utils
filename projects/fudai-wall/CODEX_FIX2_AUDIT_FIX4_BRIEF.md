# FIX #2a-5 — audit_staging.mjs: two measure corrections (tool only)

Two surgical corrections to `tools/audit_staging.mjs` (that file ONLY; no
threshold changes, no other logic). Standing method files remain required
reading as in the earlier fix-#2 briefs; this is the delta.

## Correction 1 — case 621/639 never registers occupancy (tool bug)
The multi-face branch calls `faceCheck` directly and never feeds the
occupancy flag, so F621/F639 FAIL on occupancy no matter the staging.
Fix: in that branch, for each candidate face use its `faceCheck` result —
a face that passes AND has px >= 230 sets occupancy (the same rule the
single-face helper uses). Also print each face's px in the detail lines
(`<id> PASS angle N° head in NNNpx`), as the single-face lines do.

## Correction 2 — the sea patch is measured by its thickness (wrong measure)
Case 768/798/822 checks the sea patch (a flat ground plane, size [30, 0.1, 20])
with the generic box height — its 0.1 D thickness — so it prints ~6px and can
never reach its 40px minimum, whatever the staging. The check's intent is
"the sea reads in frame": measure the patch's ON-SCREEN VERTICAL SPAN.
Fix: add a projection helper to the frame object — `screen(p)` returning
[px, py] (1080×1920 screen coordinates) or null when the point is behind the
camera. The sea check becomes: take the patch's four top corners
([±15, 0, -40] and [±15, 0, -20]); span = max py − min py over the corners
that project in front of the camera; PASS iff span >= 40 AND at least 2 of
the 4 corners are inside the frustum. Print `sea patch PASS|FAIL <span>px
corners <n>/4`. No other case changes.

## Anchors (current film, after the corrections)
- F621/F639: occupancy clears if the passing faces' px >= 230 (print the px —
  the driver verifies); the moments then PASS outright if nothing else fails.
- F768/F798/F822: the sea line prints a real span; the moments may still FAIL
  on seawall/orb/occupancy — that is staging, reported as-is.
- Every other moment keeps its current verdict and numbers.

## When done, print
1. The two corrections in one paragraph each.
2. The tool's full output on the current film.
