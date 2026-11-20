# Build Lessons — Story 5 «المصعد المفتوح» (`projects/story5-elevator/`)

## Iteration log (tried → saw → fixed)
- **Pass 1 (initial 14-anchor visual check):**
  - *Tried:* 4-world layout (`lobby`, `rain_street`, `sideways_shaft`, `cosmos` spaced 400 D apart), custom heroine `farida.json`, custom hero prop `leather_bag.js`, 3-door metronome, 31 shots.
  - *Saw:* Farida's character design, `leather_bag`, and the spinning Roulette Floor Dial read brilliantly, BUT (1) point light powers `4.5–8.0` blew out brass/cab walls to pure white with bloom washout; (2) `leather_bag` at `in: 'body', at: [0, 1.38, 0.44]` sat over Farida's face in `S19`–`S20` (because `body` origin is at hips `y ≈ 1.30`); (3) `rain_street` and `cosmos` camera looking into rear cab wall hid the 64 D rain street and starry cosmos.
  - *Fixed:* Calibrated all 4 `PLACES` light powers to `1.1–2.4` with deep antique bronze/mahogany/emerald materials and bloom threshold `0.84–0.88`; lowered `leather_bag` chest mount to `at: [0, 0.44, 0.46]` cleanly below her chin; rotated `rain_street` and `cosmos` cabs to the right third (`+155°`) so open brass doors face the camera while 64 D neon rain street & 110 D cosmic space fill the left/deep frame.
- **Pass 2 (Blender 4.0.2 hero GLBs + Qwen kinetic polish + full 31-shot board):**
  - *Tried:* Installed headless `Blender 4.0.2`, exported 3 sculpted hero GLBs (`elevator_crest.glb`, `lobby_chandelier.glb`, `noir_sedan.glb`) via `blender/build_hero_assets.py` and mounted them through native `world/look/glb.js`; folded Qwen's 5 door curves (`easeOutExpo` rain open, 9-frame `easeInQuart` slam) and chandelier pendulum sway; rendered complete 31-shot stills board `board/S01.png`–`S31.png` (`errors=0`).
  - *Saw:* Massive jump in spectacle across all 4 worlds (`S02` sculpted Art-Deco sunburst crown + chandelier, `S13`/`S14`/`S16`/`S17` warm/cool neon rain street split, `S19`/`S20`/`S22` roulette dial + heartbeat pulse rings, `S24`–`S31` floating open cab + ringed planet + starry flight); spotted `S15` clipping Farida's right ear at frame edge.
  - *Fixed:* Adjusted `S15` camera target `+0.75 D` right and distance `+1.4 D` so Farida's full face AND the speeding sculpted sedan + 3D water spray sit cleanly inside frame; verified re-rendered `S15.png`.

## HANDOVER
- **AT THE BAR:**
  - `BIBLE.md` + `scenes/BIBLE.md` + `shots.md` complete and reconciled verbatim to owner's `voice_owner.wav` (`60.76 s` / `1,823` frames @ 30 fps) and `words_owner.txt` (145 Arabic words across 34 lines, zero script rewrites).
  - Frame 0 (`S01.png`) opens on Farida's expressive face (~385 px), vintage cognac suitcase in hand, glowing shuddering Art-Deco brass elevator & receding 50 D hotel atrium behind.
  - Complete 31-shot stills board (`board/S01.png`–`board/S31.png`, 31 files at `540×960`) rendered cleanly in headless Chromium with `errors=0`, ready for owner & Layla board-scale review.
  - 3 sculpted Blender `4.0.2` hero GLBs integrated cleanly via native `world/look/glb.js`: `assets/set/elevator_crest.glb`, `assets/set/lobby_chandelier.glb`, `assets/set/noir_sedan.glb`.
  - Continuous PROP GUARD lifecycle for `leather_bag` (held in `hand:L`, clutched to chest in `sideways_shaft`, set cleanly onto cab floor in `S27`, left inside receding elevator during cosmic flight `S29`–`S31`).
  - Expressive facial acting on every line & action word + direct lip-sync on Farida's Line 30 (`ما أنا كده كده مش عارفة أوصل`).
- **STILL BELOW THE BAR (honest open items for later passes):**
  - `S04`, `S06`, `S08`, `S10`, `S11`, `S21` were rendered into `board/` with `errors=0` and verified clean by the engine, though manual eye-inspection focused on the 21 hero/anchor/transition frames (`S01–S03, S05, S07, S09, S12–S20, S22–S31`); Layla's full 31-tile board pass should verify those remaining 10 intermediate shots at `360×640`.
  - `S18` door-slam sparks sit right over Farida's eyes on frame `33.82 s` — dramatic, but if owner prefers sparks offset slightly to the brass jamb edges, shift `slamSparks.position.x` by `-0.35 D` in `scenes/set.js`.
  - Automated `film_check { kind: 'set' | 'flicker' | 'shade_jumps' }` metrics and full-rate motion strips on fast cuts (`S18` slam, `S19`–`S22` sideways shaft) remain to be run before Colab L4 video render.
  - Sound design & music cues (specified in `BIBLE.md` §4) are not mixed yet — stills board gate first.
- **DO NOT TOUCH:**
  - `voice_owner.wav`, `words_owner.txt`, `script_performed_ar.md`, `audio/clean.json` (source of record).
  - Read-only engine copy (`__suite/`, `engine/`, `world/`, `lib/`, `specs/`, `vendor/`, `src/`, `tracks/`).
  - `scenes/cast/farida.json`, `scenes/props/leather_bag.js`, and the 3-door metronome timing anchors in `scenes/motion.js`.
- **NOT CHECKED:**
  - No audio playback / sound mix check; no video render (explicitly gated on owner review of the complete stills board).
