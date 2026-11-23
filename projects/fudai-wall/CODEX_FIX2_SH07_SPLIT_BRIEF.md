# CODEX BRIEF — fix #2 close-out 2: the SH07 two-shot split (line 6)

Required in-session reading first (standing method): studio `AGENTS.md`, `.suite/critic/CRITIC_PROTOCOL.md` §3/§4/§7, `lessons/build.md`, `tools/audit_staging.mjs` header. Task delta only below.

## State you inherit
- SH11 is SOLVED (park pos COAST_VILLAGE+[-5,40,0], target [-5.5,9,-30], fov 50 — all three moments PASS). **Do not touch SH11.**
- SH07 currently carries a failed experiment (to-pos COAST_VILLAGE+[4,0.5,4], to-target [3,18,-16]) that regressed F537/F590. First RESTORE SH07's baseline: from pos CAM_SH07_A = COAST_VILLAGE+[4,2.5,-7], target CAM_SH07_TA = COAST_VILLAGE+[4,1.9,-2], fov 50; to pos CAM_SH07_B = COAST_VILLAGE+[2,20,-14], target CAM_SH07_TB = COAST_WALL+[2,19.5,0], fov 24; ease 'cubic'; roll [-5,-2].
- Audit now: 16/19 (SH07's three moments fail). D1/D2 PASS.

## Why a split (the measured cause)
F570 (t=19.00) requires, in ONE frame: mocker_a's whole head sphere in frustum + head ≥230px (occupancy) + wall-top point [3,18,-16] in frustum. The head H=[4,1.9,0] and wall-top W=[3,18,-16] are ~22.7 D apart; both fit a fov-50 frame only from a LOW camera ~4.2 D on the VILLAGE side of the mocker (z ≈ +4), pitched ~13–15° up (vertical straddle: H ≈ −4°, W ≈ +38° elevation from there). F537 needs a sea-side close-up; F590 needs the camera within ~9.8 D of the coins [2.10,19.73,-17.50] (occupancy satisfier = coins ≥230px; coins Ø≈1.0 D) with wall-top [2,18,-16] in frame. A single straight-lerp push visits only one side — proven impossible, not a tuning gap. The film already splits a line by word timing (SH09/SH10 split line 8 at 'line:8.word:5') — use the same mechanism.

## Deliverable (exact)
Split line 6 into two shots (ids SH07 and SH07B, or SH07A/SH07B — keep the audit's moment mapping working: its cases key on time, verify they still bind):
- SH07 (line:6.start → a word boundary between word:8 and word:10): the mocker close-up that pulls back to the village-side wide. End state ≈ pos COAST_VILLAGE+[5.5,2.2,2.2] (= [5.5,2.2,4.2]), target chosen so the F570 sample pitches ~13–15° up with H and W straddling the frame, fov 50 at the end. F537 (t=17.90) must keep FACE ≥200px, angle ≤60°, whole head in. F570 (t=19.00) must pass all three checks. Choose the ease so both samples land (the audit is the judge; expect a gentle ease — the padded-interval fraction at 19.00 inside the shortened window differs from the old shot; compute from the audit's CAM lines, not by hand-waving).
- SH07B (the word boundary → line:6.end): starts at SH07's end state, rises to the baseline end (pos CAM_SH07_B, target CAM_SH07_TB, fov 24) with a fast-completing ease (outCubic-class) so at F590 (t=19.67) the camera is within ~9.8 D of the coins with wall-top [2,18,-16] in frame and coins ≥230px.
- The camera path passes ~0.8 D beside the mocker's head at the pull-back — that is accepted for this pass (the fleet still + critic judge it); do not widen the end position if it costs the F570 occupancy (head ≥230px needs dist ≤ ~4.5 D at fov 50).

## Acceptance check (exact)
1. `node tools/audit_staging.mjs` prints **19/19 PASS**; D1/D2 tools still PASS. 2. `git diff --stat`: only `scenes/film.js` + `lessons/build.md` (SH11's solved values unchanged; SH01–SH03 byte-identical; no other shot changed). 3. Summary: the split word boundary chosen, both shots' full entries, the audit CAM lines at F537/F570/F590. 4. Lessons appended to `lessons/build.md` (the single-lerp impossibility + the split resolution).
If the audit still fails a moment, iterate values/eases/split point against it; report a conflict ONLY with the audit lines that prove it.
