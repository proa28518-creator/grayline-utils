# Environment overhaul — RUN 13 (Stage 2)

## Adaptation (logged honestly)
Their Environment step as written is a three-track Blender crew
(env-blender / env-textures / env-three) building a GLB set through the
app's Flow pipeline. That crew route is not available here — no app, no
Flow — so the overhaul is done IN-ENGINE, the adaptation the desk has
used for every earlier run: the kit set stays, and the added depth/detail
is modelled with the engine's own prop kit (engine/props/_kit.js flat
fills + ink outline, the film's own house style) as a dressing group in
scenes/set.js, plus a light rig (lights as data). Blender 4.0.2 exists on
this VM, but their crew scripts target the app's pipeline and Blender 5.2;
rebuilding the street as a GLB on a gate-locked film would risk the
keep-clear contract (walk lanes, camera flight lines) for no measured
gain over the in-engine dressing. The kit's geometry, marks, sky and sun
are untouched.

## What was built (scenes/set.js, kit('city_street') wrapped)
- Light rig, one place 'street': day sun (warm-white, power 1.0, from the
  kit sun's own side [-0.5, 0.74, 0.45]); the kit street lamp at
  [8.2, 6.8, 5.2] as a visible practical, low power (daytime fill, not a
  key); a cool fountain glint point over the basin [11.6, 2.2, 2.6].
- Dressing, all at z <= -2.2 against the back wall, clear of every walk
  lane (z 1.2–2.6) and camera flight line (z 5–15), all under 1.2 D tall
  except two far-end trees (crowns above head height): crates + barrel by
  the cafe wall, a wooden bench between the shops, three planters with
  green crowns along the wall base, one street tree at each far end
  (x -12.5, 15.2). Nothing tall right behind where a head will be; nothing
  thin ends at a head.
- The kit's own depth is kept: CAFE + BOOKS shopfronts, awning, kerb,
  road, far wall at z -14, the lamp post. Marks embedded literally
  (resolver text-parses them): door1/door2/window1/window2/center/a/b/
  kerb/lamp/enter_l/enter_r, unchanged from the kit.

## Verification
- Boot-probe clean after the set.js + film.js (world.set 'own') change;
  engine.js md5 unchanged (316f277544566d8de208c8b1c38e248a).
- Verification stills (harness/recap13b.mjs, frames_s2/s2_r13v_*.png):
  opening face, S6 ring, S9 gate tile, S10 float, S12, S13 two-shot, S15
  finale — checked against the RUN 12 stills for dressing visibility,
  ring readability, and face readability (see the critic input file for
  the measured read-out; the critic verdict is recorded in the RUN log).

## HANDOVER
- Set: scenes/set.js (kit wrap + rig + dressing). Post reads the rig;
  Shading reads the rig. Neither moves a camera or a prop.
- Below the bar, honestly: the dressing is flat-style modelled detail,
  not textured Blender geometry; the back wall is still the kit's flat
  plaster behind the faces in the widest shots. The street already had
  real depth (shopfronts, kerb, road, far wall); this pass dresses it, it
  does not rebuild it.
- Next pass: Post-processing (scenes/post.js), then Shading
  (scenes/shade.js) — both already written in this run; the critic rounds
  for all three passes are in the RUN log.
