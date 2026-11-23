# CODEX BRIEF — fix #2 close-out 6b (SINGLE CAUSE 2 of 3): SH07B fov for the coins margin

Required in-session reading first (standing method): studio `AGENTS.md`, `.suite/critic/CRITIC_PROTOCOL.md` §3/§4/§7, `lessons/build.md`, `tools/audit_staging.mjs` header. Task delta only below.

Context: guard flag 3 voided a bundled session; causes are now applied one at a time with driver re-judgement between them. Cause 1 (mocker_b depth) is committed and re-judged PASS. This session carries THIS CAUSE ONLY. The audit currently prints PASS (19/19 moments) + D1/D2 PASS.

## The one cause
Opus hunt #2 SERIOUS: at F590 the coins read 254px against the 230px occupancy floor — a ~10% margin, under the standing 20% thin-margin flag. Fix: narrow SH07B's fov so the coins project larger.

## Deliverable (exact)
`scenes/film.js` only: SH07B's END fov 28 -> **24**, so the F590 sampled fov lands ~27.76 and the coins read **>= 280px**. Keep every F590 check PASS (coins corners 8/8, wall-top point in frustum) and do not touch any other value, shot, or moment. If fov 24 breaks a check, step back in 1-unit increments (25, 26...) to the narrowest passing value and report it.

## Acceptance check (exact)
1. Audit still **19/19 PASS** + D1/D2 PASS. 2. Diff: the single fov value in `scenes/film.js`. 3. Summary: old -> new fov, the F590 line after (coins px + sampled fov).
