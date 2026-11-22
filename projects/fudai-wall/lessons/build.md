# Build pass — opening foundation

Authored the film-local cast foundation (Mayor aging states, three mockers, villagers, child and workers), three opening props (seawall/gate, 5-storey diagram, fishing boat), the own set, CALM post/shade wrappers, and the opening-only film contract for SH01–SH03. The Mayor is alone in this opening; later acts and cast join with later shots.

## PLACES table

`scenes/set.js` exports the sole `PLACES` table. The continuous coast uses `COAST_WALL` `[0,0,-16]`, `COAST_VILLAGE` `[0,0,2]`, and `SEA` `[0,0,-44]`. Foundation pads are `NEIGHBOR_COAST` `[600,0,0]`, `FLASHBACK_ROCK` `[1200,0,0]`, `ROOM` `[1800,0,0]`, and `HILL_GRAVE` `[2400,0,0]`. Each entry includes bounds and light-rig fields; post and shade zones cover all seven names. Film staging derives cast, prop and camera positions from these anchors.

The opening set includes a continuous shore/ground, apron and gate practicals, ten varied houses with yard dressing, a town hall, harbour posts and clutter, calm sea and glitter strip, plus a recognizable foundation silhouette in each later place. Those later places need their shot-specific dressing.

## Known gaps

- Only SH01–SH03 are authored. SH04–SH26 and their acting, graphics and story props are not yet written.
- Later places have anchor silhouettes only; full dressing is outstanding.
- The opening has not been rendered or visually reviewed. No renderer was run for this authoring pass.

## HANDOVER

Build pass opening files are ready for the requested syntax and source audit. The next pass should verify loading and measured placement bounds, then review SH01 frame 0 and the SH02/SH03 framing before extending the film.
