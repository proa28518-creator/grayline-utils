# CODEX BRIEF — fix #2 close-out 3: complete the SH07 split (binding + straddle)

Required in-session reading first (standing method): studio `AGENTS.md`, `.suite/critic/CRITIC_PROTOCOL.md` §3/§4/§7, `lessons/build.md`, `tools/audit_staging.mjs` (read the moments table at line ~123, `shotById` at ~81, the F570/F590 cases at ~150-151, and `pointCheck` at ~125). Task delta only below.

## State you inherit
- The line-6 split exists: SH07 (pull-back, ends pos [5.5,2.2,4.2], target [3.00,7.50,-16.00], fov 50) and SH07B (rise to [2,19.5,-16] target, fov 24, ease outCubic, roll [-2,-2]). SH11 solved — do not touch. F537 PASS (479px). Audit 17/19: F570 + F590 fail.
- The previous session stopped at a brief-scope wall, correctly: F590's audit moment is bound to shot id 'SH07' (moments table), and `shotById` returns the first match, so F590 samples the pull-back instead of SH07B.

## Authorized changes (exact scope)
1. `tools/audit_staging.mjs` — ONLY the moments-table binding for frame 590: 'SH07' -> 'SH07B'. No threshold, check, or other moment changes. (This is a binding correction: the audit must sample the shot the loader renders at that time.)
2. `scenes/film.js` — SH07/SH07B entries only (values, eases, targets). No other shot; SH01–SH03 byte-identical; no cast/prop edits in this session.
3. `lessons/build.md` — append.

## The two remaining failures (driver's reading of the audit code — verify, then iterate)
- F590: after the binding fix it will sample SH07B at t=19.67. Iterate SH07B until: coins PASS (>=24px — they read 43px even from the wide), wall-top point [2,18,-16] in + unoccluded, occupancy true (coins >=230px is the satisfier: camera within ~9.8 D of the coins at [2.10,19.73,-17.50] at 19.67, or the seawall passing as a required subject).
- F570: the head check is `fr.point(h) && fr.sphere(h,.5)` — the CENTRE is in (529px); the whole-sphere test fails HORIZONTALLY: from pos [5.5,2.2,4.2] the head's azimuth offset from the forward (target [3,7.5,-16], azimuth ~7°) is ~12.6°, plus the sphere's angular radius ~6.4° exceeds the horizontal half-angle ~14.3°. Move the end target's x down toward COAST_WALL+[0.5..1, 7.5, 0] (azimuth ~13-14°) to centre the head horizontally, while keeping the vertical straddle (forward elevation must stay ~13-15°: head sphere bottom edge and wall-top point both inside ±25°). NOTE: `pointCheck` also runs the occluder test — if the wall-top point's angles verify inside but the audit still fails it, the ray from the camera to [3,18,-16] is clipping a village house solid; raise or shift the end camera until the ray clears, keeping the head sphere inside and head px >= 265 (margin target, per the hunter's thin-margin finding — closer beats wider here).

## Acceptance check (exact)
1. `node tools/audit_staging.mjs` prints **19/19 PASS**; D1/D2 tools still PASS. 2. Diff scope: `scenes/film.js` (SH07/SH07B only), the one-token moments binding, `lessons/build.md`. 3. Summary: final SH07/SH07B entries, the F570/F590 CAM lines + check lines, the binding change. 4. Lessons appended (the audit-binding law: a split shot needs its moments re-bound by id).
