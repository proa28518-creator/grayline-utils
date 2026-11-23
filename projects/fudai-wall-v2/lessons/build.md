# Build Pass Lessons — Fudai Wall (`fudai-rebuild-v2`)

## Initial Build Pass & Repair Rounds 1–4 (archived)
- Round 4 verdict: `VERDICT: NO` (fresh blind critic score `60/90`). Environment and prop identities landed, but an un-gated elevated water mesh bled across village/gate shots (`t=0.00`, `2.73`, `10.73`) and a rotated cone bow clipped the boat at `t=6.73`.

## Repair Round 5 — Isolated Elevated Sea-Plane Fix + Clean Boat Bow Rider
- **Root cause found:**
  1. `harbourCanal` in `scenes/set.js` was raised to `y = 2.2 D` in Round 4 for the elevated S8–S9 mockery overlook (`y = 7.6 D`), without gating `harbourCanal.visible` in `update(t)`. As a result, the `64 × 0.16 × 22 D` teal water slab floated at `y = 2.2 D` across `frame_0000` (`t=0.00`), `frame_0082` (`t=2.73`, cutting across the street and `"1 FLOOR"`), and `frame_0322` (`t=10.73`, bisecting the `$30M` money piles, mayor's neck, and worker's face).
  2. In `makeFishingBoat`, rotating `ConeGeometry` by `rotation.x = Math.PI * 0.5` followed by `rotation.y = Math.PI * 0.25` in default `'XYZ'` Euler order tilted the bow cone 45° sideways into a diagonal wedge clipping the front-right of the hull at `t=6.73`.
- **Changes made (`scenes/set.js` only; `scenes/film.js` preserved unchanged):**
  - Gated `harbourCanal.visible = t >= 17.28 && t < 22.02` in `update(t)` alongside `overlookDeck.visible` so no elevated water plane exists in any village, gate, or open-sea shot (`t = 0.00, 2.73, 6.73, 10.73`, etc.).
  - Replaced the rotated-cone bow in `makeFishingBoat` with a single-piece `THREE.ExtrudeGeometry` tapered boat hull (`hullShape` with flat stern, parallel gunwales, and smooth quadratic pointed prow), matching red waterline keel band, and recessed wooden deck — zero stray wedge/pyramid geometry.
- **Preserved unchanged:** All 186 words & 28 lines, built-in `specs/` cast, Frame 0 close-up, Round 3 bounding-box staging, and all Round 4 environment/prop upgrades (open mirror sea, lattice tower cranes, all-face `$100` bill bundles, neighbouring village cottages, labeled `15.5M` line, clean left-grip blueprint hand, true-scale 5-storey seawall behind `hill_grave`).
- **Automated pre-desk checks:** ESM syntax PASS (7/7), pure in `t`, 186/186 words exact, and verified `harbourCanal.visible === false` at `t = 0.00, 2.73, 6.73, 10.73` and `true` only during S8–S9 (`17.28 <= t < 22.02`).

## HANDOVER
- **Pass:** Build — Repair Round 5 authored; awaiting desk fleet re-render and fresh blind critic round.
- **Files delivered:** `scenes/film.js`, `scenes/set.js`, `lessons/build.md`.
- **Set bar (`film_check { kind: 'set' }`):** Not yet measured (desk to measure on re-render).
- **Not checked:** Rendered pixels on desk fleet, PROP GUARD runtime trace, set-bar percentages.
