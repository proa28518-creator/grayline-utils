# Build Pass Lessons — Fudai Wall (`fudai-rebuild-v2`)

## Initial Build Pass & Repair Rounds 1–2 (archived)
- Round 1 verdict: `VERDICT: NO`.
- Round 2 verdict: `VERDICT: NO` — Frame 0 (`t=0.00`) big expressive Mayor close-up and Finale (`t=67.00`) grave composition passed; six blocking framing/occlusion faults remained across `t=6.73`, `10.73`, `14.78`, `16.36`, `19.96`, and `23.56`.

## Repair Round 3 — Method Change (3D Bounding-Box Camera & Occlusion Staging)
- **Method change applied:** Replaced point-center camera estimates with full 3D bounding-box projection + 2D screen-box non-overlap + camera-to-face ray clearance across every shot's speaking subject and named story elements, enforcing caption-band clearance (`maxY <= 1160`) for all faces and hero foreground props.
- **Six blocking faults resolved at root:**
  1. **`t=6.73` (S3 sea line):** Repositioned `boat1` (`[-1.5, -0.08, -44.0]`) and framed S3 from `[-7.5, 4.4, -68.0]` → `[-2.8, 4.6, -66.0]` looking across the glassy mirror sea toward BOTH the unclipped boat (`x=[315..666]`) and the towering `24.8 D` seawall (`x=[120..930]`).
  2. **`t=10.73` (S5 cost line):** Built a non-overlapping 3-tier tableau in `scenes/set.js` (`s5CostGroup`): top tier = two yellow cranes (`craneL_jib`, `craneR_jib`) + glowing triangular `15.5M` arrowhead & plaque (`y=[28..392]`); middle tier = `$30M` plaque (`x=[130..418]`) and flipping `12 YEARS` calendar (`x=[709..903]`, zero overlap with `15.5M`); lower-mid tier = `mayor`, `worker`, and `$30M` cash piles raised on a tall cargo crate (`y=[927..1077]`, strictly above the caption band).
  3. **`t=14.78` & `t=16.36` (S7 neighbours lines):** Placed `villager3` in the open foreground quay (`[1200.5, 2.5]`, `y=[1014..1134]`) with cottages strictly left/right (`x <= 1192`, `x >= 1209`, zero roof-to-face occlusion); reduced neighbours' seawall to visibly shorter `10.5 D` (`neighborWallD: 10.5`) with two `10M` labels (`y=[267..391]`) and a higher dashed golden `15.5M` comparison datum (`y=[47..78]`) hovering above it.
  4. **`t=19.96` (S8 mockery line):** Staged `villager1` (`[-0.72, -6.0]`) and `villager2` (`[0.78, -6.5]`) on the village-side harbour quay facing `+Z` with the harbour water canal, falling gold coins (`x=[441..657]`), and `24.8 D` seawall behind them; full outstretched arms project inside `x=[116..948]` (zero edge crop); updated both mockers' expressions on L8 to open-mouth laughing (`eyes: 'arc', brow: 'up', mouth: 'D', hold: true`) + `hop_bounce`.
  5. **`t=23.56` (S11 blueprint line):** Rebuilt S11 blueprint as portrait-proportioned (`1.75 × 2.18 D`, `512×640` canvas) so `"15.5M LOCKED"` sits inside `x=[131..949]` with zero cropping, added a graduated `10 — 12 — 14 — 15.5M` ruler texture, and added Mayor's cartoon white hand + dark suit sleeve holding the ruler locked on `15.5M`.
- **Preserved unchanged:** All 186 words & 28 lines, built-in `specs/` cast only, Frame 0 (`t=0.00`) Mayor close-up, and S28 (`t=67.00`) grave finale.
- **Automated pre-desk checks:** ESM syntax PASS (7/7), 186/186 words exact, pure in `t`, and `TOTAL BOUNDING-BOX ISSUES: 0` across all 3D bounding-box, 2D overlap, and caption-band checks.

## HANDOVER
- **Pass:** Build — Repair Round 3 authored; awaiting desk fleet re-render and fresh blind critic round.
- **Files delivered:** `scenes/film.js`, `scenes/set.js`, `lessons/build.md`.
- **Set bar (`film_check { kind: 'set' }`):** Not yet measured (desk to measure on re-render).
- **Not checked:** Rendered pixels on desk fleet, PROP GUARD runtime trace, set-bar percentages.
