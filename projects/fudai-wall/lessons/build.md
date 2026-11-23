# Build pass — opening foundation

Authored the film-local cast foundation (Mayor aging states, three mockers, villagers, child and workers), three opening props (seawall/gate, 5-storey diagram, fishing boat), the own set, CALM post/shade wrappers, and the opening-only film contract for SH01–SH03. The Mayor is alone in this opening; later acts and cast join with later shots.

## PLACES table

`scenes/set.js` exports the sole `PLACES` table. The continuous coast uses `COAST_WALL` `[0,0,-16]`, `COAST_VILLAGE` `[0,0,2]`, and `SEA` `[0,0,-44]`. Foundation pads are `NEIGHBOR_COAST` `[600,0,0]`, `FLASHBACK_ROCK` `[1200,0,0]`, `ROOM` `[1800,0,0]`, and `HILL_GRAVE` `[2400,0,0]`. Each entry includes bounds and light-rig fields; post and shade zones cover all seven names. Film staging derives cast, prop and camera positions from these anchors.

The opening set includes a continuous shore/ground, apron and gate practicals, ten varied houses with yard dressing, a town hall, harbour posts and clutter, calm sea and glitter strip, plus a recognizable foundation silhouette in each later place. Those later places need their shot-specific dressing.

## Known gaps

- Only SH01–SH03 are authored. SH04–SH26 and their acting, graphics and story props are not yet written.
- Later places have anchor silhouettes only; full dressing is outstanding.
- The opening has not been rendered or visually reviewed. No renderer was run for this authoring pass.

## Chunk 2 — SH04–SH12

Extended `scenes/film.js` with the mayor's later walks and face/look beats, three mockers, six villagers, the construction/sign/measurement props, and shots SH04–SH12. The nine new film-local prop kinds were already present in `scenes/props/` and were not changed. Added timed `states` to COAST_WALL and SEA for SH11; their final state explicitly restores base sky, ground, fog, and sun values under the rig's cumulative merge semantics. The storeys diagram hides at L3 start.

Loader law (lib/film/resolve.js propOwners): a prop in:'hidden' key must sit within ~1 frame of a shot t0 (on a cut) or carry stow:true — end-of-line hides must be retimed to the NEXT shot's start.
Round-5 fix: film.js carries endFrame:false — the loader's endFraming otherwise truncates the shot list of a partially-authored film to the last shot whose end frame holds a framed head (it deleted SH11/SH12, extending SH10 to t=99). Revisit when the film's true ending is authored.

## Known gaps

- SH13+ are not written.
- Digit-1 occlusion at F45/F60 is a Camera-pass item, not this chunk.
- The grey mayor is parked inside the town hall at t≈27; the next chunk must not double him when mayor_old exits.
- No renderer was run for this authoring pass.

## HANDOVER

Chunk 2 authoring is ready after syntax and source audit. The next pass should take SH13 onward, keep the grey mayor parked indoors when mayor_old exits, and handle digit-1 occlusion at F45/F60 in the Camera pass.

## Phase-7 lessons
- D2-CLEAR (tools/audit_d1_d2.mjs): camera paths are audited against building solids — town hall + 10 village houses + 3 neighbour houses at MAXIMUM dims. SH01–SH03 are exempt (frozen/critic-passed; their paths were fleet-probe-verified, and the max-dim box overstates the town-hall cone). A path clearing the conservative boxes clears the real buildings.
- RULES §3, guard-enforced: one cause, one change, one re-judgement per round. Bundling the whole BLOCKING list into one fix is itself a departure, however correct its items — the guard caught it at 01:03 and the bundle was reverted the same minute (commits a427e74 → 9616ab6 → e88a113).
- Calendar page observation (eye-verdict, phase 7): at F345/F414 the calendar board's big digit reads "1" while the page keys should be ~7/~12 — the page flip is not advancing visually. A prop-behaviour fault, not a camera fault; for the critic to judge / a later round.

## Phase-8 lessons — 2026-11-23 (FIX #2b-2 restage)
- Keep the authored story coordinates literal when restoring staging: the construction props remain on the COAST_WALL apron at ground level, the coin drop remains `[2,19.5,-17.5]` with `v0 [.6,2.2,0]` and ground `17.55`, the mocksign remains on the seawall face, and both sky orbs use `SUNORB` as their fixed anchor with movement in `cx`/`cy` only. A framing failure is not evidence to relocate a story object.
- Full-window SH05 can clear the conservative house boxes with a high village-side camera lane and still frame its wall-site props; preserve the glide over the entire shot window, with endpoint FOVs inside 24–50.
- The staging audit's SH08 branch reports face results but never sets its shared `occupancy` flag (`case 621/639` calls `faceCheck` directly, unlike the `face()` helper). Its final `FAIL subjects do not occupy the frame` therefore remains even when both required faces pass; do not edit the audit to conceal this.
- Measured restage limit: SH07 F537 close-up passes, but the full-window move reaches F570 at camera `[2.51,15.55,-10.22]`, with the mocker behind the camera and the wall-top point out of frame; F590's fixed coin drop passes at 390 px. Do not trade away either story beat or the pinned drop to force one camera interpolation through both.
- Measured SH11 limit under the village-side-over-wall composition: the sea patch is only 6 px at the audit probes (minimum 40 px), and the seawall's corners leave frame. A closer sea-side view previously raised the patch only to 21–22 px while still not framing the wall; keep the geography and report the conflict rather than moving the orb, wall, or sea patch.

## Phase-8 lessons — 2026-11-23 (FIX #2 final four camera iteration)
- A camera-only SH11 park can satisfy the wall, sea patch, and moving-orb checks together. The tested park `[-5,40,0]` aimed at `[-5.5,9,-30]` gives PASS at F768/F798/F822, with sea spans 674/690/702 px and every orb passing. Preserve the audit's reported CAM values as the ground truth because lowCams adjusts sampled camera positions.
- SH07's F570 and F590 requirements pull the camera to opposite sides of a depth constraint. The mocker head `[4,1.9,0]` and wall-top `[3,18,-16]` need a village-side low camera near `[4.1,0.2,1.6]` for a shared narrow frustum. From that region, the pinned coin at about `[2.1,19.73,-17.5]` is roughly 19 depth units away; at fov 24 the audit's 230px occupancy threshold requires depth about 11 or less (the 0.5m coin box projects only about 75–81px in the tested F590 village-side samples). The F590 passing reference camera had z=-11.74, on the seawall/coin side; a straight camera interpolation cannot move from z≈+1.6 at F570 to that near coin-side position by F590 while also keeping F537's face close-up. Do not move the coin drop or alter audit occupancy to conceal this conflict.
- Verified result for this iteration: SH11 passes all three probes; SH07 fails F537, F570 and F590 in the final camera attempt. `audit_d1_d2.mjs` remains PASS. The constrained SH07 camera requirements need an authorized change to the one-move camera model or one of the pinned checks before this audit can reach 19/19.

## Phase-8 lessons — 2026-11-23 (SH07 line-6 split attempt)
- Restore the SH07 baseline endpoints before splitting: close-up from `CAM_SH07_A` / `CAM_SH07_TA`, and the coin-side finish at `CAM_SH07_B` / `CAM_SH07_TB`, with fov 50→24 and roll -5→-2. SH11 stays at its passing park.
- A split on `line:6.word:9` (19.17 s, between words 8 and 10) can separate the mockery close-up from the coin-side move. The padded camera interval changes the sample fraction: inspect the audit's printed CAM rows after every ease change. `inExpo` kept F537's face in frame in this attempt.
- The current audit hard-codes F537, F570 and F590 to `shotById('SH07')`, and `shotById` returns the first matching shot by id. After adding SH07B, F590 is still measured on SH07 at its end pose; it never samples SH07B. The resulting F590 CAM row `[5.50, 1.80, 4.20]`, fov 50 and 43 px coins is evidence that the split's second shot is not bound. Correct time-to-shot lookup is needed before the audit can judge the split as intended.
- This attempt did not reach 19/19: F537 passed, while F570's head sphere and wall-top point remained outside the frustum and F590 remained bound to SH07. Do not report a passing split from a run where the sampled shot id does not match the moment's active interval.

## Phase-8 lesson — SH07 split binding and F570 occlusion limit (2026-11-23)
- A split shot needs every sampled audit moment rebound to the shot ID active at that time. `shotById` returns the first matching ID, so leaving F590 bound to `SH07` silently audits the pull-back instead of `SH07B`; rebind the F590 moment to `SH07B` when the split is introduced.
- With that binding, SH07B can pass F590 by lifting its camera above the seawall and aiming between the wall-top point and coin drop. The measured passing F590 camera is `[2.51,18.71,-10.51]`, target `[1.86,17.76,-32.25]`, fov `31.19`; coins are 254px and the wall-top point is in-frame.
- F570's fixed head and wall-top checks conflict under the current seawall occluder model: from the village side the ray to `[3,18,-16]` intersects the seawall; from the sea side the mocker head cannot meet the 230px occupancy threshold. Do not claim 19/19 or change audit checks under a camera-only split brief; this requires an owner-authorized audit/geometry decision.

## Phase-8 lesson — visible wall-top test point (2026-11-23)
- A test point must be a point the render can show. A point inside the tested mesh's own box is self-occluded; test the visible edge. This is the same family as the sea-span measure correction.

## Phase-8 lesson — spread stacked cast (2026-11-23)
- Stacked cast at one point is a render fault the staging audit cannot see: a character can merge with another or occlude a face while all audit moments still pass. Check cast spreads with the hunter and fleet stills, alongside the staging audit.
