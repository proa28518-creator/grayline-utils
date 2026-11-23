# CODEX BRIEF — fix #2 close-out 6a (SINGLE CAUSE 1 of 3): mocker_b depth separation

Required in-session reading first (standing method): studio `AGENTS.md`, `.suite/critic/CRITIC_PROTOCOL.md` §3/§4/§7, `lessons/build.md`, `tools/audit_staging.mjs` header. Task delta only below.

Context: this cause was previously bundled with two others into one session — a RULES §3 departure (guard flag 3); the bundled commit was voided and the branch reset. This session carries THIS CAUSE ONLY. The audit currently prints PASS (19/19 moments) + D1/D2 PASS.

## The one cause
Opus hunt #2 BLOCKING: mocker_a [4,0.5,0] and mocker_b [4,0,-0.5] heads (centres [4,1.9,0] / [4,1.9,-0.5], radius 0.5 each) intersect — from SH08's axial camera [4,3,-4] they render as overlapping disks. Fix: deepen mocker_b's separation on the z axis.

## Deliverable (exact)
`scenes/film.js` only: mocker_b placement [4,0,-0.5] -> **[4,0,-1.0]** (head volumes tangent, readable as two heads in depth). Constraint: SH08's whole-head sphere test at fov 34 (horizontal half ~9.75°) — at z=-1.0 the head is 3.0 D from SH08's camera, angular radius ~9.6°, a hair inside. If F621/F639 fail on the sphere test, fall back in 0.05 steps (-0.95, -0.90...) to the deepest value keeping faces 2/2 PASS, and report the value used. NO other change of any kind.

## Acceptance check (exact)
1. Audit still **19/19 PASS** + D1/D2 PASS, with F621/F639 faces 2/2. 2. Diff: the single placement value in `scenes/film.js`. 3. Summary: old -> new value + the F621/F639 lines after.
