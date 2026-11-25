# lessons/build.md — Stage 1 (Build) draft, Shackleton rebuild

## State
- Project: projects/shackleton-third-man/. Voice as-is (clean.wav 62.99 s, 24 kHz mono pcm_s16le; never edited).
- audio/clean.json built from the member's word timings (169 words, 8 sentence-lines, 0.22→62.49 s). Word count verified: 169 = script length. No word trimmed, cleaned or reordered.
- BIBLE.md: line rows ×8 + place rows ×5 + colour script. film.js: 19 shots on word times, acts (face/look/clips), 7 props with word keys and per-prop module files. set.js previz: 4 places 400 D apart, practicals as data + real visible practicals in A (moon disc, headlamps, hand lantern) and the light rig mounted in the set group with real Object3D targets. Cast specs ×3 written to scenes/cast/<id>.json and validated against references/characters.md (W ranges, legLen/armLen, layers innermost first, distinct tells, no forbidden features).
- Engine copy untouched; nothing rendered; no frames.

## Facts learned
- Source repo (grayline-utils @ ui/unified-interface, head 4585631) is Heart Studio's; it contains prior projects (shackleton-fourth-man, fudai-*) — DO NOT read or reuse; build stays in repo/projects/ from the member's voice alone.
- The repo's skills/cartoon-shorts carries the step files (steps/build.md …) and references (film.md, sets.md, characters.md, topics.md) — these match the law and are the working reference set.
- Repo AGENTS.md = Heart Studio standing direction; does not govern this project.
- Word-index note: narration groups some spoken words onto one timestamp line (e.g. ماشي بقاله share a span); clean.json expands them to 169 word entries, spans shared. Any caption timing uses the shared span, not a false precision.

## Open risks for the critic
1. Cast spec key names validated against references/characters.md's table (torso.body W, limbs.legLen/armLen, layers innermost first, hair/facialHair/hat kinds in the preset lists); visual confirmation (silhouette, face, beard inside the outline) waits for the first render_frames in the Camera stage.
2. Prop kinds rope_coil/ice_axe/boot_nailed/pocket_watch/lantern are project-local modules (scenes/props/*), each build(THREE) with THREE passed explicitly — proven by tools/smoke_set.mjs; engine wiring to the real renderer still unverified (nothing rendered yet).
3. lights.js written (scenes/world/look/lights.js, createLightRig(THREE, places, drivers)); proven by the same smoke run (12 lights built).
4. buildSet signature aligned to the engine contract `buildSet(THREE, scene, opts, kit)` (grayline-utils @ ui/unified-interface, verified at /tmp/grayline-utils/projects/demo-ring/lib/stage.js:133 and /tmp/grayline-utils/projects/accept-s6slice/world/sets.js:179 contract comment, :185 throw guard, :186 call site); smoke run updated to pass a scene group.
5. expr cues all validated against characters.md presets (fear terror dread gulp confused relief hope dawning horror stare blank) — programmatic check passes, 0 non-preset exprs.

## HANDOVER
- What this stage made: see "State" above. All work in repo/projects/shackleton-third-man/ (BIBLE.md, film.js, set.js, cast/*, props/*, audio/clean.{wav,json}).
- Facts a later stage must know: voice clock = clean.json clock; last word ends 62.49 s, film ends 62.99 s (0.43 s end hold past the last word). Places: A [0,0] ice slopes, B [400,0] boat, C [400,-400] shelf (fire state for lines 4+), D [-400,0] Stromness room. Fourth man never cast — staged as space/shadow/door only.
- What was hard: none blocking; see "Open risks".
- Violations noticed and fixed: none. Violations noticed, not fixed: none.
- Numbers: 8 lines, 169 words, 19 shots, 7 props, 4 places, 3 cast specs; every shot has line refs; every place sized in D; every line has place, beat, mood, action word, story prop.
