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

## Known gaps

- SH13+ are not written.
- Digit-1 occlusion at F45/F60 is a Camera-pass item, not this chunk.
- The grey mayor is parked inside the town hall at t≈27; the next chunk must not double him when mayor_old exits.
- No renderer was run for this authoring pass.

## HANDOVER

Chunk 2 authoring is ready after syntax and source audit. The next pass should take SH13 onward, keep the grey mayor parked indoors when mayor_old exits, and handle digit-1 occlusion at F45/F60 in the Camera pass.
