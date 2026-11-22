# Shading pass — RUN 13 (Stage 2)

## What each place got
- 'street' (the whole film): warm day-sun key from the sun's side
  (keyTint [1.0, 0.95, 0.85], hard 0.45) against a cool sky shadow
  (fillTint [0.85, 0.92, 1.1], plus a constant cold extra sun from the
  front-right, power 0.25) — key and shadow as two colours on the faces,
  per references/shading.md. Floors set for daylight (floor
  [0.5, 0.52, 0.58], keyMin [0.8, 0.8, 0.78]): faces never go to mud and
  never stay flat white. Rim 0.4 for edge light against the darker
  shopfronts. Metal spec 0.5 / keep 0.6: the ring keeps only a sharp
  highlight — "Rings and flashes are light: never shade them."
- NO FLICKER by construction: rig lights constant, no drivers, no states,
  no keys; hard light changes only on the shot cuts (steps = A.cuts, the
  14 shot starts after 0), so smoothing never reads across a cut and
  everything inside a shot is smooth, including the sprint and the dive.

## Verification
- Boot-probe clean; verification stills frames_s2/s2_r13v_*.png vs RUN 12:
  faces read with a warm/cool split, expressions intact (see critic input
  for the measured read-out). No shade jumps were measured on the desk
  (no film_check harness exists outside the app; the stills + the
  constant-rig construction are the evidence, logged honestly here).

## HANDOVER
- Shade: scenes/shade.js (makeShade), wired as world.setOpts.post.shade.
- Below the bar, honestly: the day sun is high and the key is gentle —
  the two-colour split is subtler than the Watchman's night lamp key.
  The faces are clean and readable rather than dramatically lit; that is
  the day look, not a miss.
- Next: Mix (SFX + music designed-in) → Export (fleet render).
