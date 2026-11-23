# GLM SEAT — CORRECTIVE RE-PROMPT · phase 13 · cause 5 (SH16 camera)

Your candidate was NOT applied: its verification arithmetic is falsified in four named places. Correct them and propose again.

1. **Baseline misquoted.** F1131 reads corners **2/8**, not 6/8. A reply that restates the baseline wrong fails validation before its candidate is read.
2. **Anchor arithmetic wrong on your own candidate.** Your pos offsets [-0.6,1.6,5.4] → [-0.2,1.6,4.9] are world z **7.4 → 6.9** (offset + [0,0,2]), not 12.2753 → 11.9812. You interpolated to z 5.2753 and then added ≈7. Every distance and angle in your table inherits this error.
3. **Your D2-CLEAR argument is inverted.** You argued "z world 12.27 (> 9.0)… never inside z ∈ [9.5,18.5]" — 12.27 IS inside [9.5,18.5]; with |x| < 4.5 and y < 6.4 that path would be INSIDE the hall. (Your candidate's true world path, z 7.4 → 6.9, is legal — but for the opposite reason: it never reaches 9.5.)
4. **Your own birds numbers refute your PASS.** With correct geometry, at F1137 (fraction 0.39) your line gives: pos world ≈ [-0.44,1.6,7.2], target world [-3,1.8,4.8], forward unit ≈ [-0.729,0.057,-0.684]. Birds point [1.5,4.6,3]: view unit ≈ [0.355,0.548,-0.768], dot ≈ 0.297 → **72.7° off-axis** — hopelessly outside a fov ≈ 33° frustum. Your table's 29.3° came from the wrong camera position, and even it exceeds the half-angles you quoted; you waved it through anyway. The birds invariant FAILS on your line.
   The same defect hits F1131: at fraction 0.23 your fov has only ramped to ≈29.5°, the body box (1.9 tall) at ≈5.2 distance subtends ≈22.6° to its farthest corner against a vertical half-angle of ≈14.75° — corners out. A 24→48 fov ramp starves the early moments; this shot's binding checks are at fractions 0.23 and 0.39, not at the end.

## What a working line must do (measured constraints)
- Stay legal: world z ≤ 9.0 for the whole path (or y ≥ 6.9, or |x| ≥ 5.0 in the hall's z-range).
- At fraction 0.23: the WHOLE villagers body box (x [-3.4,-2.6], y [0,1.9], z [2.4,3.2]) inside the frame — this wants a WIDE fov early and/or more distance, aimed near the body centre [-3,0.95,2.8], not at the head.
- At fraction 0.39: the birds point [1.5,4.6,3] — high and east — inside the SAME frustum that holds the villagers (west, low). The two points span ≈ 4.5 laterally and ≈ 3.7 vertically from any southern camera; the target must sit between them and the fov must cover both, OR the push must travel so the frustum sweeps from one to the other between fractions 0.23 and 0.39 (0.16 of the shot ≈ 0.21 s — a fast sweep; judge honestly whether the readings allow it).
- At fraction 0.84: head sphere (centre [-3,1.9,2.8], r 0.5) fully in frame, face angle ≤ 60° (he faces +z; stay south of z 2.8), head ≥ 80px.

## Reply again in the same exact format
Baseline restated CORRECTLY (corners 2/8); ONE pasteable chunk3Shot line; predicted readings with correct world arithmetic (anchor +2 on z for pos AND target), normalized vectors, and per-point screen decomposition (horizontal and vertical off-axis angles separately, against the portrait half-angles at the moment's interpolated fov).
