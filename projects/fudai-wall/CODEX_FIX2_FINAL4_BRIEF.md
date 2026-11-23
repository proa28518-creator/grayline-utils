# CODEX BRIEF — fix #2 close-out: the last 4 staging moments (SH07 F570; SH11 F768/F798/F822)

Required in-session reading first (standing method — do not skip): studio `AGENTS.md`, `.suite/critic/CRITIC_PROTOCOL.md` §3/§4/§7, `lessons/build.md`, and `tools/audit_staging.mjs`'s own header. This brief is the task delta only.

## Deliverable (exact)
`node tools/audit_staging.mjs` prints **19/19 PASS**, and the D1/D2 audit tools still print PASS, achieved by changing ONLY the SH07 and SH11 shot entries in `scenes/film.js` (camera consts / ease / fov / move type). Nothing else changes: SH01–SH03 byte-identical, all other shots byte-identical, no cast/prop/scene/set edits, no audit-tool edits. Append the lessons you learn to `lessons/build.md` in this same session.

## Acceptance check (exact)
1. Final audit output: 19/19 PASS. 2. `git diff --stat` touches only `scenes/film.js` (+ `lessons/build.md`). 3. Your summary lists every changed value (old → new) for SH07/SH11 and the audit CAM lines at F537/F570/F590/F768/F798/F822 after the change.

## Current failures (audit, 15/19)
- F570 (SH07): mocker_a head centre behind camera; wall-top point [3,18,-16] out; occupancy fail. Sampled cam pos [2.51,15.55,-10.22] tgt [2.51,15.02,-11.93] fov 30.61.
- F768/F798/F822 (SH11): seawall centre out at all three (corners 0/8); sunorb fail at F768; moonorb fail at F822; occupancy fail at all three. Sea patch PASSES at all three (span 1278/1344/1400). Sunorb PASSES at F798 (142px). Park now: pos [0,30,-5], target [8,2,-50], fov 50; drifted samples ≈ [0.07,29.75,-5.41] / [0.24,29.14,-6.38] / [0.38,28.68,-7.12].

## Keep passing (hard constraints)
SH07: F537 mocker_a FACE ≥200px, angle ≤60°, whole head in (now 371px, 11.4°). F590 coins ≥24px (now 390px; coins Ø≈0.37 D, drop PINNED from [2,19.5,-17.5] at t=19.500 — do not touch) + wall-top [2,18,-16] in + occupancy. SH11: sea centre in + span ≥40 at all three moments. Grammar at every moment: sampled fov ∈ [24,50]; camera never inside a solid.

## Starting intelligence (data from the GLM seat's analysis — verify against the audit, do not trust)
- SH07: head H=[4,1.9,0] and wall-top W=[3,18,-16] are ~22.7 D apart. Both fit one frustum only from near the W→H line: a camera just village-side of the head (≈[4.1, 0.2, 1.6]) sees both within ~1.5°. A push is a straight lerp of pos/target — shape ease + endpoints so the t=19.00 sample sits in that collinear zone, the t=17.90 sample keeps the face pass, and by t=19.67 the camera is positioned for the coins (visible to ~34 D at fov 24) + wall-top [2,18,-16]. A slow-start ease keeps the camera low early. Watch lowCams: it may raise a pos y to its floor — the audit's CAM line is the only truth. Keep camera y ≥ ~0.5 unless the audit proves a lower value legal.
- SH11: this is an AIM problem, not an occlusion problem. From y≈30 the orb rays cross the wall plane at y≈25 (above the 18 top — they clear); F798's sunorb already passes from the current park. The wall centre fails because the aim puts it below the frustum bottom. Search a single park (or a near-park slow push) around pos [0, 30–34, -5..6] with the target chosen so the wall centre [0,9,-16], the sea centre [0,0,-30], and all three orb centres (sun [-15,8,-60] @F768; sun [3.6,15.6,-60] @F798; moon [-11.1,5.5,-60] @F822) sit inside the fov-50 rectangle (vertical half 25°, horizontal half ≈14.3°) with margin for the orbs' whole-disc test (r 1.7 / 1.3). One composition must serve all three moments — per-moment values are not available in a park.

## Method
Iterate directly against the audit: change values → run the audit → read the CAM lines and check lines → adjust. No rendering. If after real iteration a moment proves impossible under the pins, STOP and write the conflict with numbers (which checks exclude each other, by how much) instead of gaming a check.
