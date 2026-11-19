# TASK — Story 4 Build step + stills board (seat job 2)

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
