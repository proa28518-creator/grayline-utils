# TASK — Story 4 Build step + stills board (seat job 2)

- Driver model: **Gemini 4 Neon (High)** — Argon is delisted from the
  owner's accounts; Neon holds its seat by the owner's word (2026-11-19).
- THE BAR — «شغل إبهار» (owner's word 2026-11-19 ~14:31): this film must
  DAZZLE, not merely work. Before committing each board still, check it
  against these spectacle tests and fix until it passes:
  1. Frame 0: the clerk's face fills its measure and EXPLODES with the
     «طفح الكيل!» expression — readable at board scale (360x640).
  2. Frozen-vs-moving contrast reads instantly in every aisle shot: the
     statues are statues, the clerk is the only life in the frame.
  3. The slow-motion soup-can collapse (S09/S10) shows cans suspended
     mid-air, readable one by one — no blur of clutter.
  4. The snow-globe payoff (final shots) reads in ONE glance: glass curve,
     desk, the market inside — no explanation needed.
  5. The red cart is the visual anchor of every shot it appears in:
     biggest saturated shape, never lost against the shelves.
  A still that merely matches the shot list but fails its spectacle test
  is NOT done — restage it and note the fix in the checkpoints.
- Project folder: projects/story4-market/
- Job: Build step ONLY — implement the film in the heart engine and produce
  the FULL STILLS BOARD. No render, no mix in this job.
- Inputs (all in projects/story4-market/):
  - BIBLE.md — beats, hero prop red_cart with D-unit sizes, set, colour script.
  - shots.md — the 24-shot camera list.
  - script_ar.md — the written script (reference).
  - voice_words.txt — the OWNER'S OWN word-timing file from his recorded
    performance (58.64 s total). HIS PERFORMED WORDING AND TIMING GOVERN the
    cut: where his performed lines differ from script_ar.md, the picture
    follows the performed beats in voice_words.txt. Film length = 58.64 s
    (1,759 frames at 30 fps) unless the timing file says otherwise.
- Method: read skills/cartoon-shorts/SKILL.md and follow the Build step
  exactly (project module under the engine, cast/kit characters only, sets
  from the kit or primitives per the BIBLE). Prove Frame 0 first.
- Products to commit:
  1. The project build (code) under projects/story4-market/.
  2. board/ — one still per shot (24 JPGs, shot-numbered), rendered through
     the engine host page at full 1080x1920.
  3. Append progress to seat/checkpoints.md at every step.
- Gates: the complete board goes to the owner (via Layla) BEFORE any render.
  No publishing, ever. The supervising hand does the git push (print mode
  cannot push — see SEAT.md protocol note).
- On 429/503: checkpoint and stop; never switch models on your own.
