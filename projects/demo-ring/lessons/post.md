# Post processing — RUN 13 (Stage 2)

## What each place got (one place, one day look)
- 'street' (the whole film): bright-exterior-by-day row of
  references/quality-bar.md — haze density 0.0055, far 80 (sky keeps its
  colour), DOF aperture 9 / nearK 0.22 (characters sharp on top, background
  softly out of focus), bloom k 0.25 / thr 0.85 (sunlit stone, the ring's
  glint, fountain water only), 900 drifting pollen motes (size 0.010,
  sunlit, slow), grade gamma 1.10 / saturation 1.28 / vignette π/6.
- NO grain (post.md: grain makes files huge). NO bursts: a spray burst at
  the ring's splashdown (32.49 s) would sit on the gate-locked S10 float
  tile (33.0 s) and could occlude the ring — deliberately omitted, logged
  in scenes/post.js. NO keys anywhere; every setting is constant film-wide.

## Verification
- Boot-probe clean; filmLook/gradedInFrames reported in the recap13b
  boot info (see RUN log). Verification stills frames_s2/s2_r13v_*.png
  vs the RUN 12 stills: faces stay the sharpest thing, ring tiles hold
  (see critic input for measured read-out).

## HANDOVER
- Post: scenes/post.js (makePost), wired as world.setOpts.post via
  scenes/set.js's look. Shading sits on it as post.shade.
- Below the bar, honestly: the day haze is a whisper by design (a
  stronger haze veiled the sky in the Watchman tuning round); the pollen
  is visible only when looked for at full size. The grade is the main
  visible change vs the previz.
- Next: Shading (scenes/shade.js, written in this run) → Mix → Export.
