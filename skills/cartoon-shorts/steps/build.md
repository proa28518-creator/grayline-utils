# Step: Build

**Goal:** turn the member's voice into a film where cartoon characters act every line so well they feel alive, in a lit set with
DEPTH, opening on a character's scared or expressive face. Characters and acting are the heart of it: "perfect character
animation" from a blank script or any character. The set is the previz (the rich set is the Environment overhaul) but it has
depth from the start: the later passes can only add detail and air to the space you give them, and a set that is a wall right
behind the faces stays flat forever.

**Inputs:** `audio/clean.wav` + `audio/clean.json` (the voice and its word times, made by the app), the member's notes, the engine
copy. A SHOT PLAN (binding) in the notes, when there is one, fixes the cuts, places and cameras: follow it segment for segment.

**The bar:** `references/quality-bar.md` and the stills in `references/bar/` (open them first): the space behind the faces, the
practical lights, the faces big. **The guide pages** (`references/guide/`, open the jpg files): 01 the bar, 02 story to shots
(before any scene), 03 the set, 04 characters, 05 the camera grammar, 09 verify, 10 never. Read them before you start and check
your frames against them before you finish. When the project has `references/examples/`, its Build sections show how the bar films
started.

**Made new:** the examples show the method; this film is written from this voice's own words. Never copy an example's film,
acting table, shots, camera or set, even when the voice is the same as an example's: its own cast, its own set in `scenes/set.js`
(or a kit set), its own acting.

**Wide project (16:9):** read `references/wide.md` first. Stage for the width from the first shot and give the set its sides; the rest of this step holds as written.

## Read first
`SKILL.md`, `references/topics.md`, `references/critic.md`, `references/quality-bar.md` (and open the stills in

`references/bar/`), `references/voice-sound.md`, `references/characters.md`, `references/film.md`, `references/camera.md` (the
grammar section), `references/sets.md`, the Build part of `references/pitfalls.md`, and `lessons/build.md` if it exists. Deep
names: `references/api/`.

## Method
1. **Words and the film bible:** read `narration` (or `audio/clean.json`) from 0 to the end. Write the lines as heard (note
   anything that differs from the member's script). Then `scenes/BIBLE.md` by `references/topics.md`: a row per line (speaker,
   place, beat, action word, story prop) and a row per place (the real thing, size in D, far end in D, practicals, colour mood,
   air). Decide everything here first.
2. **Cast:** who says each line, who is the narrator, who else is in the scene. A spec per character in `scenes/cast/<id>.json`
   from a sentence each (or a built-in spec by id). Check each new one on a `render_frames` frame facing the camera and at 3/4.
3. **Set with depth:** the places of the bible in `scenes/set.js` (several places 400 D apart, lights as data, the later passes
   build on it). Each place: the far end 25 D or more from the camera with the camera looking along it, so most shots have space
   behind the characters (a vanishing point helps); 2 or more practicals you can see (lamps, panels, a window) placed along that
   depth. Stage the characters in the space, not against its wall. Keep walking lanes and the camera side clear.
4. **Prove the opening first:** stage, act and light the first shot (the face, the place behind it, its practicals), then run
   the opening critic round (`references/critic.md`) and fix what it names before you act the rest.
5. **Acting:** for every line, the speaker AND the listeners: face first, one body action tied to a word, dead-still holds,
   looks, reactions. Props with owners and hand-overs. Walks that end before the line that needs them.
6. **Camera:** the grammar (camera.md): on the speaker, a cut every 1.5-3 s on a word, low, always moving, faces big. Frame 0 = a face.
7. **Review loop:** `check_preview` -> `film_probe` (shots, PROP GUARD) -> `film_sheet` of the whole film -> `render_frames` on
   faces, actions, feet on the floor and hands on props -> fix the worst thing -> again. Strips on anything fast.
8. **Critic rounds** on the whole film (`references/critic.md`) until the exit list below is true and a critic says YES.
9. **Lessons:** `lessons/build.md` as you go (tried, saw, fixed, still weak), ending with the HANDOVER block (`references/review.md`).

Helper agents for clearly separate jobs (one character's spec, one group's acting, the set) are welcome: each gets the helper
contract of `references/critic.md`, owns its own files, runs in the foreground; `scenes/film.js` stays yours.

## Machine checks
`check_preview` (no load, runtime or film error), `film_probe` (every line and word, PROP GUARD over every frame),
`film_check { kind: 'set' }` (measured and written into the HANDOVER: the Environment overhaul must pass it, Build may not).

## Exit (every line true)
- `scenes/BIBLE.md` is complete (`references/topics.md` section 8).
- The first frame shows a readable, expressive face (head 300 px wide or more on 9:16; `references/wide.md` on 16:9). Talking
  shots: heads 300-430 px; one establishing wide per place: 180-250 px.
- Every word in `audio/clean.json` is in a line, as heard. `check_preview` clean, `film_probe` PROP GUARD passes.
- Every line has its speaker's face key and one tied action; listeners react 1-3 frames after the trigger word.
- Cuts every 1.5-3 s on a line start or an action; each shot a clearly different angle or size; no face key, clip start or
  turn within 3 frames of a cut.
- No face cut by the frame edge, nothing growing out of a head, no back on a speaker, feet on the floor.
- In 3 of every 4 shots or more, space behind the faces (no blank wall within a few D filling the background); every place has
  2+ visible light sources. Looked at with `render_frames` at `scale: 1` next to the bar stills.
- The opening critic round and the final critic round answered YES with no BLOCKING fault.
- `lessons/build.md` ends with its HANDOVER, including the set bar numbers.

## Never
A back or an empty set in the first frame; a wall a metre behind the faces "for now"; a beat, a line or a character left out
to finish; anything copied from an example.

## Report
Two or three lines: what you made, what differs from the script, what is weakest (the HANDOVER's first open item).

## Runner-owned prop and probe contract
Write `props.json` as `{ "props": [{ "name": "…", "appearsAt": 0.1, "cropBox": { "x": 0, "y": 0, "w": 0.1, "h": 0.1 } }], "setDressing": ["…"] }`. Keep key props separate from set dressing. Seed `setDressing` with the visible architectural basics and set pieces that actually occur (for example wall, floor, ceiling, counter, table); do not allow objects that are absent. Every declared prop needs a normalized cropBox aimed at the current probe composition. If you change camera/framing, re-aim every prop cropBox before the runner's next gate. The program renders probes under `out/passes/build/probe-*.png`; inspect prior-round files when available. Never run `heart still`, start a local server, or invoke a command that starts a server. The pass runner owns still rendering; this builder seat cannot bind local ports.
