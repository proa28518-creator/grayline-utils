# FIX #2a-3 — audit_staging.mjs: one framing-rule amendment + camera printout

Small surgical amendment to `tools/audit_staging.mjs` (that file ONLY; no scene /
engine / lib / set edits). Standing method files remain required reading as in
`CODEX_FIX2_AUDIT_BRIEF.md` / `CODEX_FIX2_AUDIT_FIX_BRIEF.md` — this brief is the
delta only.

## The defect
The corrected frustum math is right, but the box framing rule
(`centre in && corners >= 4/8`) false-FAILs subjects that FILL or OVERFLOW the
frame — their corners are outside precisely because they are big and on screen.
Rendered proof on the current film: the blueprint board at F711/F723 fills the
frame yet scores corners 0/8; the same artifact hits the neighbour wall (F474),
the seawall (F768/F798/F822) and crane_a (F288).

## The amendment — one uniform framing rule for every box subject
A box subject passes framing iff ALL of:
- its centre is inside the frustum,
- its centre is unoccluded (named-occluder rule unchanged),
- its projected height >= the check's minPx,
- AND (corners >= 4/8 inside) OR (projected height >= 1920 px) OR
  (projected width >= 1080 px) — the overflow cases.
Projected width is computed like projected height but with the subject's
horizontal size and the horizontal fov. Remove the sticker special case
(`n>=5`); every box subject uses this one rule.

## Printout
Add one line per moment, before its result row:
`CAM F474 pos [x, y, z] target [x, y, z] fov N` (the sampled, padded, floored
camera the checks used; 2-decimal values).

## Anchors after the amendment (current film)
- F711/F723: blueprint board PASS (overflow); F711 still FAILs on line + palm
  points; F723 still FAILs on ruler (effPin 0) and label.
- F474: neighbour wall PASS; stickers still FAIL (centres out); houses still
  FAIL; moment still FAIL.
- F768/F798/F822: seawall PASS; sea patch and orbs still FAIL; moments still FAIL.
- F288: crane verdict follows the rule (either way); money + moneysign still
  FAIL (occluded, named); moment still FAIL.
- All other moments keep their corrected verdicts from the previous run
  (F219 FAIL, F241 FAIL, F345 FAIL, F414 FAIL, F537 FAIL, F570 FAIL, F590 FAIL,
  F621 FAIL, F639 FAIL, F669 PASS, F687 FAIL, F870 FAIL).

## When done, print
1. The rule change in one paragraph.
2. The tool's full output on the current film (with CAM lines).
