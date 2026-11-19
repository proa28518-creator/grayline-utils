# Pitfalls: every trap that cost our runs a re-render, and the fix

From the S-4 short (39 s, five passes) and the backrooms short (base build, four cameras, detail, sprites, shading). One line each: the trap, then the fix.
Paths are the project's: `scenes/film.js`, `scenes/set.js`, `scenes/props/`, `scenes/cast/`, `scenes/post.js`, `scenes/shade.js`, `assets/`, `blender/build_set.py`.
The engine copy (`engine/`, `world/`, `lib/`, `specs/` ...) is read-only: anything below that needs an engine change is a gap to report, not a file to edit.

## Build (characters, acting, basic scene)
- `audio/clean.wav` + `audio/clean.json` are the app's: never trim or edit them. The transcript is the truth for what is said; if it differs from the script ("fights its way"), say so in the report, never fix it silently.
- A film driven by a schedule (knocks, hits, signals): write `scenes/film.js` with ONE table that makes the hands, the visible effects and the timing agree. Hand-written JSON drifts.
- A clip's `at` is read only as a `line:` string. A number in `at` is dropped silently and the clip starts SETTLED on frame 0. Seconds go in `t0`.
- Never open on an empty scene or on a face from behind: open on a face. gruss calls anything else "a bad hook".
- Start everyone turned toward the camera side (|ry| <= 70). Past about 95 deg from the camera the face, beard and glasses vanish and the head is only hair.
- Narrator films: mouths move only on quoted lines, for the person on screen. A voice from off screen is a line with `who: null`.
- A character who must never blink (the backrooms twist): `blink: false` and `listen: []` on her acts, then check her eyes frame by frame in a strip.
- First pass failures the fresh-eyes review found: bodies standing like posts, arms hanging, nobody really running, a grab that is a pose swap. Fix: one body pose change per shot tied to a word, anticipation and settle on every action, runners lean 20-30 deg with a real stride.
- Every arm move needs an end: `hold` + `out`, a later clip on that hand, or a hand-over. An open `point` stays up for good.
- The first strike of a run needs `rise` 6-8 frames, or the hand jumps from hang to ready in one frame (the PROP GUARD caught a 259 px pop).
- An impact is not a teleport: a `knock` marks its own blow, a clip entry takes `snap`, a prop key `snap: true`, a seam shot `hard: true`. Never just switch the guard off: it hides real pops too.
- Give every `drop` key a `from`. Without it the prop starts from where it was, which depends on earlier frames and breaks out-of-order renders.
- A prop that hides itself shows again: the stage sets the prop's own `visible` every frame. Hide an inner group instead (`knockfx.js` does this).
- Many places in one film: one `scenes/set.js` with places 400 D apart, each in its own dome and fog. Domes must write depth, or the other places' domes show through the sky as faint arcs.
- Anything in a place is in every shot of that place: waiting characters, landing dust, a second copy of a diver. Limit effects in time (dust 1.25 s) and keep people out of each other's shots.
- One person in two places: `acts.<id>.place`, not cast copies. Floating, sinking, standing on a deck: `acts.<id>.height`. Nothing collides: a deck is the height you write.
- A follow camera's `camOffset` is in world axes: it ended inside the hull. Use a `path` with the clearance worked out.
- Sand went mint: light power and a bright texture clipped. Lower the light, never fix it in the grade.
- A walker faces his walk direction until the walk ends (`face` lands only at the end): lead him from the side he walks toward.
- Two heads closer than a helmet (about 1.1 D) can't be separated by any camera: move one character and say so.
- Captions sat on the grab hand and the collar at the key moments: check the caption band against the action in the sheet.
- The sound library had no struck steel, sonar or sea. The app does the sound design: make a story sound VISIBLE (impact rings on every knock) so the beat reads either way, and name the missing sound in the report.

## Camera
- Camera styles are instruction sets, not presets: take the logic of Dread Cuts / One Take / Found Footage / The Watcher / Through the Steel, never their coordinates.
- Find what crosses the walls in the story (a sound, a signal) and let the camera travel with it. That one idea made Through the Steel.
- A hidden seam = two `path` shots whose last and first frames look alike: forward into steel until it fills the frame, out of another wall still moving; keep the camera outside the shell on the last frame (inside it you see the far wall).
- Backward through a wall: one frame pops from room to plate and reads as passing through at speed. Forward through a bright water plane = a white flash; backward out through it looking down reads well.
- Swish: same sky and water in both places, turning the same way on both sides of the cut.
- Keep each crossing under 8 frames: 8 dark steel frames read as a stall, 5 read as passing through.
- Riding a falling thing: a `path` key `pos: { object: "sub", offset: [...] }` (the set names the object or lists it in `points`), or keys computed every 0.1 s from the set's own motion formula.
- 9:16 and anything long (a ship): only a frame within about 10 deg of its axis says "ship". From the side it is a grey wall at any distance.
- Aim wides at where a moving thing really is at that time (the cutter was 14 D back until 6.69 s, so the first wide framed water).
- A camera flew through a head and the every-3rd-frame preview nearly hid it: check every flight with `film_sheet {strip: 'A-B'}` at full frame rate.
- Frame 0 must be clean: moving closer wasn't enough (an edge head appeared); parallax fixed it (camera to the side, aim kept on the subject).
- The camera floor raises a low `push`/`park`/`follow` to the nearest chest, which ruins a wide of a ship (`lowCam: true`). `path` shots are never raised.
- Locked-off shots read dead: every shot moves, even 2-4 % of scale or 30-60 px of travel.
- One Take: with no cuts nothing hides a change, so ease moods in and out, clear sprites along the flight (`sprites.clearPath`), raise the path over heads it would pass through, and hide what comes too near the lens (`look.hideNearPx`).
- The automatic sound design ties cues to cuts: after a new camera, tell the member to re-run it in the app.
- **A solid ink-coloured frame for 1-6 frames = a character BESIDE the camera's image plane** (depth about zero from the lens,
  anywhere sideways, even far outside the frame): a camera inside a ring of people, a push that crosses someone's depth, a macro
  inside a crowd. Keep every character clearly in front of or behind the lens plane on every frame (a long lens from outside the
  ring). The Town film lost two passes to guessing other causes.
- A camera looking UP sees none of the place (its frame bottom above the horizon): dress that camera's frame by screen position
  (roofs, a lamp post, branches placed where its frame is), or move it.

## Environment (Blender set, Flow textures, live light)
- Read what the camera sees FIRST: portrait at fov 26 is a slit (about 1.4 D either side of the subject; a wide project sees about 4 times that, `wide.md`). The back wall and the overhead are the set; model those first.
- Read every camera key against the geometry before placing anything: flights end inside walls, climb through ceilings, look straight down. Leave their slots open.
- Take character positions and walks from `scenes/film.js`, not from the old set: a walk found late had a torn sheet sitting on it.
- Write down the handedness per place: looking along +z, +x is frame LEFT. Gear went on the wrong side once.
- Fix the contract up front: decal cell ranges (Blender and Flow numbered them differently), glbs are place-local, one glb per moving thing placed inside its animated group, agreed material names (an unknown name means nothing to the loader).
- A painted pattern has a period and a phase: modelled rivets fought painted ones. Six strakes, each exactly one texture plate wide, with the modelled lap on the painted seam.
- Nothing thin may end at a head: a hose behind the Navy man read as an aerial growing out of him. Cut those triangles in `scenes/set.js` if the glb has them.
- Check in clay at the real shot times, on a tiled sheet with capsules for people (`blender_run` + `tex_job {kind: 'sheet'}`). Numbers can't see "behind a face"; the clay found the davit wire, the boom, the ladder and foreground rocks.
- Growth along plate laps lined up as lumps: noise patches only. Sand ripples looked like corduroy: warp them and let them come and go. Flat-shaded boulders looked like gems: smooth them.
- Decals on curves: keep them under about 1.4 D along the curve (sagitta = s^2 / (8 r)), or the ends sink or float.
- A Blender error can hide in a long log: look for `Traceback`, `Error`, `File "` in what `blender_run` returns.
- Flow makes about 1 picture per 2 min with misses. Ask for few pictures, priority order first, and anything that ends the film (the dawn) near the top.
- A Flow policy block is not always the words: retry once; after two blocks, change the words ("diamond tread" blocked six times, "raised ridges" passed).
- Prompts for tiling textures: "straight top-down scan, very low contrast, evenly lit" plus a list of no's (stains, creases, shadows, perspective, text). Any feature repeats and gives the tile away; damage goes in decals.
- Decals darken, never tint, and their alpha reaches zero well inside the cell, or a square edge shows.
- Look at every raw sprite sheet: an extra object drawn shifted every name after it, with no error. Mark the extra `"skip": true`; a grid fallback means the sheet is wrong.
- Numbers don't prove a wrap on large soft pictures (a sky passed the seam number and still showed an edge): look at 3 x 3 tilings in the `tex_job` previews.
- A bad picture went live for 50 s while the preview was loading: write new recipes to a preview name first.
- Textures rewritten while the preview loads them: the page loads them once at its start. Wait for `assets/tex/` to go quiet before the final render.
- Anything that lands after the lights are tuned (the storm sky) can be far too bright in this grade: re-check it.
- Never tint a whole ceiling tile: it reads as a patchwork. Mask stains inside the tile.
- An important silhouette went brown in the haze: keep a clear column around it (`thingClear`).
- Modelled rivets near the lens became dark hexagons: dissolve small kit near the camera; hide what grows outside a hull while the camera is inside it.
- A caustic gobo projected on walls smears into streaks: limit it to surfaces that face up.
- A label in murk needs emit well over 1 to survive fog at 30 D.
- The place lights cast no real shadows on the set (a known gap): a gobo (cage shadow, swinging from the film's jolt times) sells the lamp instead.
- Sprites looked modest on stills and were "HUGE IMPROVEMENT" in motion: judge them moving, place them where the camera sees them, never right behind a face.
- Render the whole film early for a safe result, and again when late files land.
- **Never pink, lilac or purple on a magenta sprite sheet:** the key reads them as half background, they come out muddy and
  see-through, and `tex_job check` still says OK. Say "nothing pink, nothing purple, nothing magenta on any object" and name the
  colours instead (peach-orange, white, mint, teal, sky blue). "A pair of shutters" came as TWO objects: ask for "one single shutter".
- Colours set with `color.setRGB()` are linear, hex strings are sRGB: a night tint of .5 comes out pale (.73 on screen).
- A transparent overlay drawn with `depthTest: false` veils the characters (transparent things draw after everything opaque): only
  opaque domes may skip the depth test.
- Ring pieces around a centre: local x is the tangent at `ry = t`, not `t + 90 deg`, or every kerb stone turns into a spoke. The clay
  picture showed it at once; the numbers did not.
- The Blender track ships the pieces most shots see first (houses, walls), each as soon as it passes its clay check: pieces that land
  after the integration's first round stay previz boxes in that round.

## Post processing
- Start from the last approved settings, then tune: the backrooms values got the torpedo room to the bar on the first render.
- Compare sheets catch what single frames hide: the milky water looked lovely alone and lost the submarine. The story's subject wins: haze density keys per shot.
- Water: light that fades from the real surface height (`top`), shafts with a period around 15 D. Shafts of 6 D average out to nothing along the ray.
- Particles are quads and capsules, not points (points clip whole at the frame edge and can't streak).
- Keep a streak's width out of the blur size (`cocK`), or sleet turns to confetti.
- Bubbles have no shutter (a streaked bubble is a pill) and need `nearFade` 1.6..4, or they read as wire rings near the lens.
- Burst `size` and `grow` are per-second numbers: a soft puff at the ram whited out the frame. Tune a burst one frame after the hit, by eye.
- Spray behind a wall is invisible: put `at` between the people and the wall; the depth test keeps it off faces.
- Sun in haze: phase `g` .55, not .72, or the dawn goes pure white.
- A material in `scenes/set.js` that writes display colour (bulb, halo, water surface) can go dark with post on: check them on a before/after sheet.
- Grain tripled the file size: leave it out unless asked.
- **The dark-interior numbers on a bright exterior make a grey-white veil** (the Town film): haze `far` 220 put full haze over the
  sky and turned it white, aperture 26 blurred the story prop in the foreground, glow lights at power 60-120 whited out the night.
  It ended at about half the haze, `far` 70-90, aperture 9, glow power .85-4. Start from the matching row of quality-bar.md.
- `air: { density: 0 }` without its other keys is not "off": leave `air` out of a place to switch it off.
- Every settings place in `scenes/post.js` needs a rig place of the same name (the particles read its lights), or the film throws
  "Cannot read properties of undefined".

## Shading
- Key and shadow as two colours (warm on the lamp side, cold on the far side) is most of the pass.
- A constant cold film light makes the room colder by itself as the lamp dies: let the light's physics carry the story.
- A floor per place (`floor`, `keyMin`) stops mud, and must allow for the grade after it (a dark place with gamma .62 needs numbers that look far too high).
- A dying light loses its colour; it doesn't stay orange: a warm `keyMin` turned the kid brown. Near neutral (about .66 .6 .52).
- Metal keeps its own colour: brass in teal light went acid green. `metal.keep` .62 desaturates the light on metal only.
- Faces went saturated cyan underwater: `sat` .62, a higher floor.
- A dim key with a stronger fill turned the drawn shadow inside out: cap the fill under the key.
- Hats shade with the head, with no rim (the rim drew arcs across caps).
- Rings, flashes and impact stars are light: never shade them.
- Props keep only the sharp highlight: flat wrench heads became cream lollipops.
- Backlit (dawn): the face is all shadow side, so the shadow side carries the warmth.
- Before fixing something odd, check the earlier pass: a "shading bug" on the skipper was his drawn hair.
- Flicker ("like if it's clipping"): light direction ignores flicker (`noSteer`), power read over about +-.4 s, position over +-.24 s along the character's own timeline, level over +-.1 s, and `steps` at every hard change of light, which sits on a cut.
- Keep each character in one place: then a hidden cut has nothing to pop.
- Run `film_check {kind: 'shade_jumps'}` after tuning, not during: it takes as long as a render. Camera whips move the shade; that is accepted.

## Review and tools
- Look at moving footage: `film_sheet` (the whole film tiled) after every change, `strip: 'A-B'` at full rate on fast moves and actions, `cuts` around every cut. Stills undersell and hide flicker.
- Judge new looks on before/after sheets of the same frames, with the final grade on: the grade changes everything.
- Send back a short ranked list of radical fixes, never many micro notes.
- After each pass, `film_check {kind: 'same'}`: characters, props and shots unchanged (the shots only change in Camera angles).
- `film_probe` after changes to props, hands or shots: read the PROP GUARD line. Framing (a head at the edge, behind the camera, two
  heads overlapping) has no number in the app: look at each shot's first frame with `render_frames` and the cuts with `film_sheet { cuts: true }`.
- A frame is not bit-exact between renders (a few pixels differ): compare to a tolerance, never byte for byte.
- A failed render prints a stack trace whose real line is far above the tail: read the whole error.
- Small flaws next to the bar (pale frames at a water surface, a weak spray): fix them when your step touches that moment; report each one you leave in one line.
- Say exactly what you did not check (sound is the app's, nobody listened).

## Performance
- A 39 s film renders in about 2 minutes (70-90 ms a frame): a whole-film `film_sheet` per round beats choosing frames.
- Character CPU work is most of a frame, not the set: many places, sprites, post and shading cost close to nothing measurable.
- A character outside both the camera and the sun's shadow camera is skipped. A huge character or one carrying a big prop may pop at the frame edge: report it (the cull radius is in the engine).
- `quality: 'auto'` gives the preview setting below 1200 px on the long side, so the live preview stays smooth; never force `full` in the preview.
- ms per frame on a sparse spread of frames is misleading (page load spread over few frames): compare consecutive ranges or full renders.
