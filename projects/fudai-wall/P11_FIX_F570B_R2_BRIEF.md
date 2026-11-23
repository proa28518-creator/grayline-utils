# CODEX SEAT — BRIEF ADDENDUM · phase 11 · cause: F570 OPTION (b), ROUND 2 — CONSTRAINED SEARCH

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Execute `P11_FIX_F570B_BRIEF.md` (the owner's
option-(b) decision: audit amendment + face staging, look preserved)
with this correction to how its F537 clause is handled.

**HARD RULE (guard flag 6): NO LOCAL RENDERS.** Sampler + audits only.

## What round 1 established (output P11_FIX_F570B_OUT.txt)
The candidate TO (pos [4,8,-3], target [4,1.9,0], fov 32) made the
amended-audit F570 line PASS (face 6.5°, head 505px) — the staging
works. It was rejected ONLY because F537's sampled camera moved
0.47 D from baseline [4.08,2.48,-4.54], over the brief's 0.3 D
tolerance, and the seat stopped after that single candidate, applying
nothing (the audit amendment included).

## The correction
The F537 tolerance is a SEARCH CONSTRAINT, not a stop. Search the
SH07 TO space (pos/target/fov) for a pose satisfying ALL of:
- amended-audit F570 PASS: face ≤60°, whole head in frame, head
  ≥230px (round 1 reached 6.5° / 505px — stay in that family);
- F537 sampled camera within 0.3 D of [4.08,2.48,-4.54] AND its
  audit line still PASS (face 15.0°, head in);
- F537's sampled TARGET also reported (a target swing at F537
  reframes the close-up even if the position holds).
Levers you have: a TO between the current TO and the round-1
candidate; the TO TARGET (aim the late path without moving its
start); the TO fov. The path weight at F537 is small but nonzero —
a TO closer to the current one displaces F537 less; compensate the
F570 framing with target/fov.
If the search exhausts without satisfying both, apply NOTHING and
report the trade-off curve (best F570 face result at F537
displacement 0.3 / 0.47 / unconstrained) — do not silently widen the
tolerance.

## Then, as the parent brief requires
Apply the audit amendment (case 570: wall-top check removed, comment
citing the owner's decision) + the winning TO values; run
`node --check`, full `audit_staging.mjs`, `audit_d1_d2.mjs`; paste
the F570 projection table, F537 before/after (pos + target), the
complete audit outputs and a diff summary. Do NOT commit. Touch no
other files. mocker_a's cast keys stay untouched.
