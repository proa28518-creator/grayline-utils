# Build Pass Lessons — Fudai Wall (`fudai-rebuild-v2`)

## Initial Build Pass (archived)
- Authored `scenes/BIBLE.md`, `scenes/film.js`, `scenes/set.js`, 5 custom `scenes/props/*.js`, and `lessons/build.md`.
- Fresh blind critic verdict: `VERDICT: NO`.

## Repair Round 1 (archived)
- Attempted per-shot prop culling via `in: 'hidden'` ↔ `in: 'world'` in `scenes/film.js` and moved S8 to the seaside of the seawall.
- Fresh blind critic verdict: `VERDICT: NO` (scores: `t=0.00: 31`, `t=2.73: 20`, `t=6.73: 8`, `t=10.73: 19`, `t=14.78: 20`, `t=16.36: 17`, `t=19.96: 2`, `t=23.56: 0`, `t=67.00: 33`).

## Repair Round 2 — Per-Shot Staging Verification (Method Change, Not Amount)
- **Root causes identified from Round 1 fleet renders:**
  1. **Engine `in: 'hidden'` world-prop behavior:** Any prop starting `in: 'hidden'` in `film.js` did not unhide on `{ t, in: 'world' }` / `{ t, in: 'hand:R' }` keys, emptying `t=23.56` (`blueprint_board`), `t=10.73` (`cost30m`, `cash_stacks`, `cal_12yr`, `height155_gauge`), `t=14.78/16.36` (`height10_gauge`), and `t=67.00` (`grave_flowers`).
  2. **Wall occlusion in S8 (`t=19.96`):** The S8 camera (`z=-16.8`) sat on the village side of the solid `24.8 D` seawall (`z=-24`) while `villager1` stood on the seaside (`z=-28`), leaving a 100% blank concrete wall frame.
  3. **Mayor head-twist hair clip (`t=10.73`):** A Line 1 `look` target behind Mayor (`z=-24, y=14`) remained active into S5, twisting his head past 95° so his grey back-of-head hair clipped across his face/glasses.
  4. **Caption-band overlap (`t=2.73`, `14.78`, `16.36`):** Character heads projected into `pxY = 1266..1426` (inside the lower-third `captions: 'words'` band).
  5. **S1 Frame 0 framing & 1–5 overlay, S3 mirror sea, S28 semicircle:** Frame 0 was full-body with a flat stare and floors 3–5 cropped; S3 showed dark wall stripes behind a boat cabin instead of open mirror sea; S28 foreground villager overlapped the suited villager behind him and `distantWall` sat too low below the horizon.
- **Changes made (changed the method):**
  - `scenes/set.js`: Moved all shot-gated story graphics & animated machinery (`storey5Group` floors `1–5`, `pop3000Group`, `s5CostGroup` cranes + `$30M` cash stacks on pallet + `$30M` sign + flipping `12 YEARS` calendar, `gauge155`, `blueprintGroup` with unobstructed `'15.5M LOCKED'` banner & pure-in-`t` locking brass ruler, `dumbSignGroup`, `cal14Group`, `gaugeWave15`, `neighLabelsGroup` with two bold `10M` gauges on the neighbouring walls, `graveFlowersGroup`, and raised sunlit `distantWallGroup` behind `hill_grave`) directly into `scenes/set.js` with strict pure-in-`t` `.visible` windows in `update(t)`. Repositioned S3 calm sea & peaceful boat (`[6, -0.08, -58]`) with sky shimmer reflections; extended wooden seaside pier to `z = -34..-43` with S8 falling gold coins centered at `x = 0.15`.
  - `scenes/film.js`: Push Frame 0 (`t=0.00`) to a true big close-up on Mayor (`d = 5.4 D`, `fov = 26`, expressive `eyes: 'wide', brow: 'knit', mouth: 'tight'`); reset `mayor.look` to forward `+Z` camera-side targets on S4/S5/S10/S21; moved S8 camera (`z = -26.8..-27.8`) onto the seaside of the seawall facing `villager1` & `villager2` (`z = -37.2..-37.9`, open ocean + falling coins behind); aimed S2 and S7 cameras so all faces project strictly above `pxY = 1144` (clear of the caption band); arranged S28's 4 villagers in a non-overlapping semicircle (`pxX = 188, 370, 710, 892`) around `mayor_gravestone`.
- **Automated pre-desk checks run after Repair Round 2:**
  - `node --check` (ESM): PASS on 7/7 `.js` files.
  - 186/186 words exact across 28 lines (line splits unchanged); zero face/clip keys within 3 frames of any cut; zero `Math.random` or `Date` calls.
  - 3D 9:16 perspective frustum + caption-band (`pxY <= 1180`) + character-overlap (`sep >= 140 px`) audit across all 9 acceptance times (`0.00, 2.73, 6.73, 10.73, 14.78, 16.36, 19.96, 23.56, 67.00`): **`TOTAL ISSUES: 0`**.

## HANDOVER
- **Pass:** Build — Repair Round 2 authored; awaiting desk fleet re-render at `t = 0.00, 2.73, 6.73, 10.73, 14.78, 16.36, 19.96, 23.56, 67.00`, `film_probe`, `film_check { kind: 'set' }`, and fresh blind critic round.
- **Files delivered:** `scenes/film.js`, `scenes/set.js`, `scenes/props/measure_sign.js`, `scenes/props/blueprint_ruler.js`, `scenes/props/calendar_flip.js`, `scenes/props/money_stack.js`, `scenes/props/gravestone.js`, `lessons/build.md`.
- **Set bar (`film_check { kind: 'set' }`):** Not yet measured (desk to measure on re-render).
- **Not checked:** Rendered pixels on desk fleet, PROP GUARD runtime trace, set-bar percentages, Arabic RTL caption box bounds at runtime.
