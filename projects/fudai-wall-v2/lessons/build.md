# Build Pass Lessons — Fudai Wall (`fudai-rebuild-v2`)

## Initial Build Pass & Repair Rounds 1–3 (archived)
- Round 3 verdict: `VERDICT: NO` (fresh blind critic score `61/90`). Bounding-box staging method fixed faces, crops, and occlusions; six environment and prop-identity faults remained.

## Repair Round 4 — Environments & Prop Identities (Bounding-Box Method Preserved)
- **Root cause addressed:** Completed the visual identity and in-frame presence of every named environment and prop across the six measured faults while preserving the Round 3 3D bounding-box staging method, all 186 words, ready-made cast, Frame 0 close-up, and S28 foreground grave composition.
- **Six measured faults resolved:**
  1. **`t=6.73` (S3 open mirror sea):** Aimed S3 out across open glassy ocean to a sunlit horizon and bright sky (`[-8.0, 5.4, -36.0]` → `[-3.0, 5.2, -38.0]`, zero seawall blocking the frame); rebuilt `makeFishingBoat` with a tapered pointed prow, red waterline stripe, wooden deck, wheelhouse windows, mast, boom, and pennant flag, plus an inverted water reflection and sky shimmer bands; positioned boat (`x=[450..980]`, mast top `y=762`) well above the caption band.
  2. **`t=10.73` (S5 cost props):** Added front/side/top green `$100` banknote textures (`makeBillTexture` + `makeBillEdgeTexture` with stacked bill edges and golden `$` strap) plus a front angled hero bill on the crate; rebuilt both cranes (`makeTowerCrane`) with lattice X-truss masts, operator cabs with glass, counterweights, A-frame stay cables, trolleys, hoist lines, and hanging concrete wall slabs.
  3. **`t=14.78` & `t=16.36` (S7 neighbours' settlement & `15.5M` label):** Placed 6 neighbouring coastal cottages inside the S7 9:16 frustum (`z = -8.5..-17.5`, strictly behind `villager3` at `z = +2.5` so no roof crosses his face) right beside the shorter `10M` seawall; mounted a bold `"15.5M / FUDAI WALL"` plaque (`x=[406..657]`, `y=[65..197]`) directly on the upper dashed golden reference line.
  4. **`t=19.96` (S8 mockery overlook):** Elevated `villager1` and `villager2` onto a wooden coastal overlook balcony (`y = 7.6 D, z = 2.5`) with camera at `z = 16.8..17.6` (`d_wall = 40.8 D`, `fov = 40`) so BOTH the `24.8 D` seawall top crest (`y=[118..203]`) AND the wide bright blue harbour water (`y=[1638..1800]`) appear cleanly in frame; aimed `villager1`'s pointing arm upward and inward (`dir: [0.22, 0.65, -0.2]`) toward the wall/sea; arced falling gold coins (`x=[483..607]`) toward the blue water clear of captions.
  5. **`t=23.56` (S11 blueprint ruler & hand):** Removed the oversized black rim sphere and moved the clean white cartoon hand + suit sleeve to grip the left (near) end of the graduated ruler (`x = -0.68`, strictly left of `"10"`), leaving `10 — 12 — 14 — 15.5M` (`x=[306..1013]`) 100% uncovered.
  6. **`t=67.00` (S28 grave finale distant wall):** Rebuilt `distantWallGroup` in `hill_grave` as a true-scale 5-storey Fudai seawall replica (`height = 19.5 D`, `width = 84 D` buttressed concrete wings, central floodgate piers, top bridge, twin beacons, ribbed steel floodgate leaf, and intact valley cottages below) without changing the four villagers, headstone, flowers, dawn sky, or S28 camera.
- **Automated pre-desk checks:** ESM syntax PASS (7/7), 186/186 words exact, pure in `t`, and `TOTAL ISSUES: 0` on the 3D bounding-box audit.

## HANDOVER
- **Pass:** Build — Repair Round 4 authored; awaiting desk fleet re-render and fresh blind critic round.
- **Files delivered:** `scenes/film.js`, `scenes/set.js`, `lessons/build.md`.
- **Set bar (`film_check { kind: 'set' }`):** Not yet measured (desk to measure on re-render).
- **Not checked:** Rendered pixels on desk fleet, PROP GUARD runtime trace, set-bar percentages.
