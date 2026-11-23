# Build Pass Lessons — Fudai Wall (`fudai-rebuild-v2`)

## Initial Build Pass (archived)
- Authored `scenes/BIBLE.md`, `scenes/film.js`, `scenes/set.js`, 5 custom `scenes/props/*.js`, and `lessons/build.md`.
- Fresh blind critic verdict on opening sample: `VERDICT: NO`.

## Repair Round 1 — Biggest Gap Fix (Per-Shot Prop Culling, Staging & 9:16 Frustum Framing)
- **Root cause found:**
  1. Custom props in `scenes/film.js` wrapped parameters inside a nested `opts: { kind, shown }` object instead of top-level keys (`signType`, `years`, `bundles`, `locked`) and native `in: 'hidden'` ↔ `in: 'world'` cut transitions. Because `kind: 'measure_sign'` collided with `opts.kind`, every `measure_sign` fell through to the default `'3,000 VILLAGERS'` branch and stayed visible across unrelated shots (including `blueprint_board` bisecting `mayor` at `t=0` and `villager1` at `t=19.96`).
  2. Several cameras (`S2`, `S3`, `S5`, `S7`, `S8`, `S11`) ignored the narrow 9:16 portrait frustum (`width ≈ 0.26 × d`), aiming into flat walls (`S5`, `S7`), empty sea (`S3`), or slicing off-beat cast members at frame edges (`S1`, `S5`, `S8`, `S11`).
  3. On `blueprint_ruler.js`, the sliding brass ruler crossed over `'15.5M LOCKED'`.
  4. Streetlamps at `x = ±4.2` crossed foreground faces in `S2`.
- **Changes made (single cause family: per-shot staging & camera verification):**
  - `scenes/film.js`: Moved all custom prop options to top-level keys (`signType`, `progress`, `years`, `flip`, `bundles`, `locked`) and culled every world prop cleanly via native `in: 'hidden'` ↔ `in: 'world'` on hard cuts; parked non-acting cast off-camera (`[40, 40]`) on cuts so zero stray faces enter or clip edges; re-framed `S1`, `S2`, `S3`, `S5`, `S6`, `S7`, `S8`, `S9`, `S11`, and `S28` (locked `mayor_gravestone`, `hill_grave`, cast, and cameras together at `X = 1600.0`).
  - `scenes/set.js`: Widened harbour lamp posts to `x = ±5.8`; centered `boat1` at `[0, -0.08, -38.5]` with translucent mirror-water reflections for `S3`; positioned `S5` yellow construction cranes inside the 9:16 frustum (`x = ±4.2`, `z = -16.5`); added pure-in-`t` falling gold coins into the ocean for `S8` (`17.28–20.34 s`); enriched `neighbors` (`X = 1200`) with buttressed `10M` wall, 12 cottages, and red-banded lighthouse.
  - `scenes/props/measure_sign.js`, `blueprint_ruler.js`, `calendar_flip.js`, `money_stack.js`, `gravestone.js`: Switched to top-level option reads (`signType` instead of `kind`); moved `'15.5M LOCKED'` into a dedicated top banner above the `15.5M` datum so the brass ruler never overlaps the text.
- **Automated pre-desk checks run after Repair Round 1:**
  - `node --check` (ESM): PASS on all 7 `.js` files.
  - 186/186 words matched across 28 lines; zero face/clip keys within 3 frames of any cut; zero `Math.random` or `Date` calls.
  - 3D 9:16 perspective frustum projection check at all 9 acceptance times (`0.00, 2.73, 6.73, 10.73, 14.78, 16.36, 19.96, 23.56, 67.00`): every on-screen character head projects inside `[243..839, 888..1426]` (zero edge risk), and every shot's named story prop projects strictly inside frame with zero body-prop intersections.

## HANDOVER
- **Pass:** Build — Repair Round 1 authored; awaiting desk re-render at `t = 0.00, 2.73, 6.73, 10.73, 14.78, 16.36, 19.96, 23.56, 67.00`, `film_probe`, `film_check { kind: 'set' }`, and fresh blind critic round.
- **Files updated:** `scenes/film.js`, `scenes/set.js`, `scenes/props/measure_sign.js`, `scenes/props/blueprint_ruler.js`, `scenes/props/calendar_flip.js`, `scenes/props/money_stack.js`, `scenes/props/gravestone.js`, `lessons/build.md`.
- **Set bar (`film_check { kind: 'set' }`):** Not yet measured (desk to measure on re-render).
- **Not checked:** Rendered pixels on desk fleet, PROP GUARD runtime trace, set-bar percentages, built-in `specs/` visual wardrobes, Arabic RTL captions.