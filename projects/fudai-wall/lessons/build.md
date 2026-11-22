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
