# Film API: one file from a script -> an mp4 (tools/make_film.mjs, agent F, 2026-11-04)

A film is ONE file a Claude writes from a script: `films/<name>/film.json` (or `film.mjs` with `export default {...}`).
`node tools/make_film.mjs films/<name>` = voice (tools/voice.py, cached by the script's hash) -> word times resolved into the acts ->
every frame through the stage (lab/stage.mjs + stage.html: set, sun shadows, all characters, props, shots, captions) -> ffmpeg
(libx264 yuv420p crf 18, 30 fps, voice as aac) -> `films/<name>/out/<name>.mp4`. Clock: film time = the voice's clock.

## Keys
| key | what |
|---|---|
| `fps`, `size` | 30, `[1080, 1920]` (9:16) or `[1920, 1080]` (16:9, same vertical framing, about three times the width to fill: in the app the project's format decides, whatever the film says) |
| `duration` / `tail` | seconds; default = last line's end + `tail` (1.6) |
| `world` | `{ set, setOpts }`: a named set from world/sets.js (`bread_corner`, `workshop_yard`, `plain`) gets the world agent's sky, sun shadows and `marks`; or `set: { boxes:[{size:[w,h,d], at:[x,y,z], color, dark, shape:'cyl'}], stripes:[{at:[x,z], size:[w,d], color}] }` + `sky ground shadow` (flat ground, blob shadows; an object set also goes through world/sets.js with `ground` as its floor colour, so a sea-blue ground survives); `set:'path'` = a plain ground stripe. `setOpts.lightDir: [x,y,z]` = direction TO the sun: the default (behind-left of a front camera) throws thin characters' shadows straight back behind their own bodies, so from the front they seem to have none; a side sun (last_loaf `[-0.75, .6, .25]`) lays them out on the ground beside them |
| `cast.<id>` | `{ spec, at:[x,z], ry, face, voice }`. `spec` = an id in specs/ (`"engineer"`), a path (`"specs/mara.json"`) or an inline spec object. Spec keys: the parts (`head face hat torso limbs hide`, BODY_API.md for `torso.body/outfit`) + wardrobe `hair` (`"bun"` or `{style, colour, seed}`), `facialHair` (`"walrus"` or `{kind, colour}`), `glasses` (`"round"` or `{kind, colour}`) (WARDROBE_API.md). `face` = FACE_API per-character params. `voice` = `{voice, speed, pitch}` (VOICE.md; engineer/boss have defaults). `ry` 0 faces +Z (the usual camera side), 90 faces +X |
| `voice` | `{ start: s (silence before line 1), lines: [{ who, text, gap, loud }] }` (`gap` = silence after the line, default .35: room for action; `loud: true` = the whole line is shouted: every word gets the big mouth. A word ending in `!` in `text` is loud on its own: "Loud words" below). **Own voice file (no TTS):** `{ "file": "voice/vo.wav", "words": "voice/words.json", "lines": [{ "who": "maya", "text": "..." }, { "who": null, "text": "..." }] }` (paths relative to the film folder; words.json = voice.py's format `[{ word, start, end }]`, `who`/`line` optional, or `{ words: [...] }`). The words are split across the lines in order by matching each line's text words (case/punctuation ignored, so `line:N.word:K` work as before); a mismatch or leftover words stop the film naming the line. The audio is muxed as is (no lead silence, film clock = file clock). `who` null or not in the cast = narrator: no lip sync, nobody `listen`s or looks at it; captions still show it. Lab: `lab/br_voice` |
| `acts.<id>` | that character's MOTION_API timeline: `walk clips face look say blink plants base`. `root` defaults to cast `at`/`ry`; `say` is added from the voice (lip sync, eyes still while speaking); `blink` defaults on; `listen` (the other speakers' line spans, so the listener's face answers after each line, engine/facetime.js) is filled from the voice automatically. Walks (engine/walk.js, MOTION_API.md): `walk: [{ t0, path, speed, gait: 'run', cane: 'R', face }]`: real steps + bob; `gait:'run'` leans and pumps the arms; `cane` puts that hand on the cane top and the tip plants with the opposite foot (caneLen = the film's cane prop `length`, set automatically); the cane hand stays on the planted cane before and after the walk. Gestures go to the OTHER hand |
| `props` | `[{ id, kind, owner, in, at, rot, length, keys }]`: kinds: see engine/props/PROPS_API.md (auto-loaded from `engine/props/<kind>.js` and `films/<film>/props/<kind>.js`; built in: `cane loaf half_loaf bread_loaf bread_half mug newspaper box`; new: `camera umbrella phone book bag ball cup bottle broom fishing_rod flowers letter`), origin = the grip. `in`: `'hand:R'|'hand:L'` (follows the owner's DRAWN hand + facing; `rot` deg, `at` offset), `'world'` (`at` world), `'hidden'`. A clip's `props.<id>` (carry, flick_toss, ...) wins; `keys:[{t, in, owner, rot, at}]` override from t on (hand-overs, swaps) |
| `handovers` | `[{ prop, from, to, t, fromSide:'L', toSide:'R', at, lead:.4, hold:.2, back:.35, pass:.1, rot, offset }]` (agent Q): a prop goes from one character's hand to another's. Both hands travel to the meeting point `at` (world; default = between the two handing shoulders, a little under shoulder height) over `lead` s before `t`, stay `hold` s, go back over `back` s (they blend over whatever clip the arm plays). The prop switches owner at `t` and slides between the two DRAWN hands over `pass` s each side of it, so it never jumps (raise `pass` to ~.17 for a short toss when the two can't quite reach). Put `t` at least .3 s after a cut so the hand-over is on screen. Replaces the old `keys` owner switch |
| `shots` | `[{ t0, t1, camera }]`, hard cut at each t0. camera `move`: `park {pos, target, fov}`, `push {from:{pos,target,fov}, to, t0, t1, ease}`, `orbit {who|whos|center, facing, az0, az1, el, dist, height, fov, ease}` (az deg from the subject's facing, or `facing:0` = world +Z), `follow {who, camOffset:[x,y,z], look:[x,y,z], lag, parkAt}` (trails a walker, parks at `parkAt`, then drifts slowly unless `still:true`: ENG6 below), `path {keys}` (one continuous camera through any number of keys: "Camera versions" below). Any camera takes `roll`: a Dutch tilt in degrees (+ = clockwise), a number or `[r0, r1]` eased over the shot |
| `captions` | `"words"` (his style) = one or two big bold words (upper case, heavy ink stroke) popping in mid-lower frame per beat, timed to words.json (two words when the first is short and they run together); `true` / `"line"` = the spoken line burned in (lower third, wraps at 84 % width) |

**Times tied to words:** EVERY key that takes a time takes a word time (FX1): shot `t0`/`t1`, camera `parkAt`, push / orbit `t0`/`t1`,
prop and hand-over `t`, `look` / `face` keys, clip `t0` (and `at: "line:..."` = its `t0`), `base` track keys `[["line:2.start", 5]]`,
`sit_on.t0`: any string starting `line:` in `acts`, `props`, `handovers` or `shots` is resolved (never in `text` / `_n` / `_doc`).
`line:N.start`, `line:N.end`, `line:N.word:K` (word start), `line:N.word:K.end`, each with an optional `+0.2` / `-0.3`. N, K from 1.
A time that can't be resolved (no such line / word, or not a time at all) stops make_film with ONE message naming the film key path,
e.g. `MAKE_FILM FAILED: "line:9.end" at shots[3].camera.parkAt: no line 9 (the film has 6 lines)`, before anything renders.
`clip` is an alias of `name`. The resolved film (all numbers) is written to `films/<name>/resolved.json`.

**Loud words (ENG9, 2026-11-04):** talk is a SMALL mouth (engine/FACE_API.md "Talk small, shout big"); only loud words get the kit's
big drawings (`v_A! v_E! v_O! ...`, and the big O `o`). `voice/words.json` carries no punctuation, so make_film matches each spoken
word in order to the line's `text` (same letters, lower case; up to 3 tokens ahead when the speech engine dropped a word; by position when
nothing matches and the counts are equal) and marks it `loud: true` when its script word ends in `!` ("Wait!", `"Run!"`). A voice line with
`loud: true` makes every word of it loud (passed as `loud: true` on that `tl.say` line). Both reach engine/facetime.js `say()`; check
in `resolved.json` (`characters[].timeline.say[].words[].loud`). So: write `!` only on the words that are really shouted ("Wait! Mum
says..." = only "Wait" opens big); a calm sentence ending in `!` ("Since breakfast!") makes its last word big too. `tools/make_film.mjs`
exports `loudWords(words, text)`. Test `node lab/eng9/test.mjs`; strip `python lab/eng9/strip.py` after
`node tools/make_film.mjs films/last_loaf --out lab/eng9/run --frames 345-376,788-800` -> `lab/eng9/loud_strip.png`.
**Eating:** the `eat` / `bite` clip opens the BIG mouth (`open: 'v_A!'` default, was the now-small `v_A`) and snaps shut on the bite;
`params.open` still picks any mouth.

**Sitting down on a seat (FX1):** `acts.<id>.sit_on: { seat: "sit" | [x, z], t0, face: 0, path: [[x, z], ...], speed }` = walk to just
in front of the seat, a short turn that swings through the camera side of the shot covering it, then sit back with the feet planted (no
slide, no `base` root tricks). `seat` = a set mark (`park`: `sit`, `sit2`; the set's `seatY` is used) or a point; `face` = the seated
facing (deg, 0 = +Z, the park bench). Give a `path` via point that arrives from the SIDE (along the path, not from behind the bench) so
the walk itself doesn't show the back. Stand up later with `stand_up` (`params.from: "sit"`); he stays at the seat. MOTION_API.md FX1.
**Waves / raised points** never cross the face (the hand goes beside the head outline as the camera sees it), whichever arm.
**Brimmed hats** (cap, flat cap, hickory, top hat, straw hat, officer, bowler) nod at most 12 deg toward a low `look` target; the eyes
look the rest, so a look at the ground no longer shows the cap's top. `checks.mjs hands_on_props` now skips hidden props and no longer
mixes up props rebuilt by opts keys (crumbs `n`).

## Off the ground, and one person in two places (`acts.<id>.height`, `.place`, 2026-11-04)
Any height is fine: feet, walks, shadows, props in hands, grabs, looks, `orbit` / `follow` / `path` subjects, focus and shading all follow. Times take `line:N...`.
Lab films to copy: `lab/fixes/sink`, `fall`, `deck`, `place`, `shaded`. Full rules: MOTION_API.md "Height and place".
```json
"cast": { "ray": { "spec": "proof_ray", "at": [-2, 0], "y": 3, "ry": 80 } },
"acts": { "diver": { "height": [ { "t": 0, "y": 6 }, { "t": "line:1.word:3", "y": 0, "over": 2.2 }, { "t": 4.6, "y": 5.5, "over": 1.8, "legs": "tread" } ] } }
```
| you want | write |
|---|---|
| floats high up from the start | `"height": [{ "t": 0, "y": 6 }]`: legs hang and flutter, arms drift |
| sinks on a word, stands on the bottom | `{ "t": "line:1.word:3", "y": 0, "over": 2.2 }`: arriving on the floor ends standing |
| floats up, working his legs | `{ "t": 4.6, "y": 5.5, "over": 1.8, "legs": "tread" }` (`float`, `tread`, `hang`) |
| stands on a raised deck | cast `"y": 3` (or `at: [x, z, 3]`): a body on a deck walks, turns and sits as usual, up there |
| a lift carries him | `{ "t": 2, "y": 4, "over": 2, "legs": "stand" }` |
| falls and lands | `{ "t": 1, "fall": 0 }` from wherever he is. Time = sqrt(2 x height / 20): 3 D = .55 s. Add `"land": false` for no knee bend |
| jumps off something | `{ "t": 1, "fall": 0, "up": 0.7, "to": [1, 0.4] }`: crouches 5 f BEFORE `t`, rises .7 D, lands at [x, z] |
| jumps up onto something | `{ "t": 1, "fall": 2, "up": 0.3, "to": [4, 0] }` |
| climbs a ladder | `{ "t": 1, "y": 4, "over": 3, "legs": "climb" }`, stand him at the ladder facing it, ends standing at y 4 |
| walks up a step onto a deck | a third number on path points: `"path": [[-1, 0.3], [-0.4, 0.3, 0], [-0.36, 0.3, 0.6], [4.4, 0.3, 0.6]]` = ground 0 up to x -.4, .6 from x -.36 on. Two close points = a step, far apart = a ramp. Keep one step under ~.7 D; stairs = several. The set's deck is yours to build at that height |
| walks off a deck | a walk to its edge, then `{ "t": ..., "fall": 0, "to": [x, z] }` |
| reappears elsewhere after a cut | `"place": [{ "t": "line:5.start", "at": [59.8, 1], "ry": 70 }]` + a shot starting at the same time. No copy in the cast. Nothing slides, the prop stays in his hand, a `walk` from `t` starts there, a held `look` comes along. `y` default 0: give `"y": 1.5` for a deck, `"legs": "float"` for mid-air |
| both of two people move | a `place` key on each, same `t`: a collar grab holds |

**Pick the shot for it.** A parked wide shows the height; a `follow` / `orbit` `who` keeps him in frame while the ground rushes by: `follow.camOffset` / `look` and `orbit.height` are relative to his height now. A follow with a `place` key arrives with him.
**The world doesn't know about any of this:** a floor under him is a number, nothing collides. Build the deck in the set at the height you write, `floor` on a key if the ground under a float isn't 0 (blobs lie there, they fade by 3 D above it). Below the ground plane (`y` < 0) needs a set without one there.
**A character in many places:** place keys beat cast copies for one person. A copy is still right when two of him must be on screen at once.
**A key mid-shot (no cut)** is a teleport on screen: PROP GUARD reports a held prop's jump. Put it on a cut.

## Example (films/test_walk/film.json): walks in, waves, one line, shrugs
```json
{ "fps": 30, "size": [1080, 1920],
  "world": { "sky": "#b7d3ea", "ground": "#cdb98f", "set": "path" },
  "cast": { "engineer": { "spec": "engineer", "at": [-6, 0.4], "ry": 90 } },
  "voice": { "start": 3.0, "lines": [ { "who": "engineer", "text": "Morning! The track is clear all the way to town." } ] },
  "acts": { "engineer": {
      "walk": [ { "t0": 0.2, "path": [[-3, 0.2], [0, 0]], "face": 0 } ],
      "clips": [ { "clip": "wave", "t0": 2.2, "params": { "side": "R", "eyes": "arc" } },
                 { "clip": "talk_hands", "at": "line:1.start", "params": { "dur": 2.0, "side": "L" } },
                 { "clip": "shrug", "at": "line:1.end+0.15" } ],
      "face": [ { "t": 2.2, "eyes": "arc", "mouth": "smile" }, { "t": "line:1.end+0.15", "eyes": "smug", "mouth": "smirk" } ] } },
  "shots": [
    { "t0": 0, "t1": "line:1.start", "camera": { "move": "follow", "who": "engineer", "camOffset": [0, 2.4, 11], "look": [0, 1.5, 0], "parkAt": 2.0 } },
    { "t0": "line:1.start", "t1": 99, "camera": { "move": "push", "from": { "pos": [0.6, 2.4, 9], "target": [0, 1.7, 0] },
      "to": { "pos": [0.3, 2.2, 6.4], "target": [0, 1.8, 0] }, "t0": "line:1.start", "t1": "line:1.end" } } ],
  "captions": true }
```
A three-person film with a named set, props, hand-overs and six shots: `films/last_loaf/film.json`.

## Directing (agent F2, 2026-11-04, from the coordinator's review of cut 1 and MOTION_BIBLE 8): what makes it read like his
**Framing.** Characters BIG. Head 200-400 px wide in the 1080x1920 frame on every medium / close shot (his median ~300); a full-body
wide (head ~170-230 px) only to establish, once. Lens fov 26 (30 for the one wide). Camera LOW: at chest-to-head height of the subject
(y 1.5-2.6 for adults, 1.7-1.9 for a kid), never looking down from 4 D up. Head centre X 30-70 %, Y 35-60 %; no big empty wall above
or pavement below. At fov 26 one D (a head) is `4158 / distance` px tall: 300 px = 14 D away, 400 px = 10.4 D. The frame is only
`0.26 * distance` D wide (3.6 D at 14), so a TWO-SHOT must STACK DEPTH: put one character nearer the camera and the camera roughly on
the line through both (heads 30 % and 70 % across, the nearer one lower/bigger), or move the people closer (x gap <= 1.9 D at 12-13 D).
Measure before rendering: `--probe` prints one line per shot and what to look at (20-30 s on a 39 s film of 14 people, no pictures).
**Camera moves.** Something moves on almost every shot: slow `push` (10-15 % closer over the line), `orbit` 10-15 deg, `follow` a walker.
Park only while a big body action plays (a jump, a lean): `push` with its own `t0` later than the shot start = parked first, then moves.
**Cuts.** Hard cuts on a line start (`t0: "line:N.start"`) or on an action; never two near-identical angles back to back (jump cut).
Poses are continuous across cuts automatically (one timeline per character); give each shot a clearly different angle or size.
**Facing rule.** The face draws only while the head's az to the camera is under 95 deg. Stage people in cheated 3/4: a listener faces
+-60 deg toward the camera side, never square to the other person. `look.at` targets go IN FRONT of the person looked at (their head
x/y, z + 3 D toward the camera), never at their real head if that is behind the looker: a look at the baker behind her stand from the
customer at ry 60 put his az at -97 (face gone). Check the `az` column of `--probe`: keep every speaking/reacting face under ~75.
**Looks and reactions.** Everyone looks at whoever talks: a `look` key 2-3 f (+0.067-0.1 s) after the line start that triggers it;
face first (`face` key at +0.067), body one frame later (clip at +0.1). A `{ eyes: "blink" }` key one frame before an expression change.
**Holds.** Gestures go, then hold DEAD still, then go back: clip entry `hold` (seconds the end pose stays) + `out` (frames to blend back),
e.g. `{ clip: "point", at: "line:2.word:1", params: { side: "R", dir: [.35, .1, 1] }, hold: 1.2, out: 6 }` keeps Walter's point for
his whole line. A clip with no `out` holds forever (carry, akimbo: wanted); a jump without `out` leaves the hips up and the feet off
the ground (shock_jump needs `hold: .1, out: 5`). `point` with `dir` (body frame: +X = the character's LEFT, +Z = forward) is the
general "hand out there" gesture: offer / take / reach. Keep `dir` mostly sideways (z <= .3): forward reaches stretch the 2.5D arm.
Talking characters: `talk_hands` on the free hand, small, `dur` = the line.
**Props.** A prop in `hand:R/L` follows the drawn hand; hand-overs = a `handovers` entry (above): both hands meet, the prop changes
hands on screen. **Frame 0:** a clip at `t0: 0` (or `at` resolving to <= 0) starts SETTLED: a `sit` / `carry` / `akimbo` is already in
place on the first frame (no `t0: -0.2` trick; `settled: false` on the clip plays its move from frame 0). **Reach:** hands are keyed
against the shoulder that is DRAWN, and any target past the arm's reach eases into ~1.06 x the arm length (no over-stretch); a
planted foot the leg can't reach lowers the hips. Arms reaching in front of the body draw over it. Kids: arms out sideways, not up (short arms go behind the head).

## Engine rules a film can rely on (Q3, overnight 2; evidence + tests in `lab/q3/`, `node lab/q3/test.mjs`)
- **Seats end by themselves.** A `sit` / `sit_down` / `kneel` holds until a later `stand_up` has finished (then the feet are standing
  feet and the hips standing height) or a later `walk` starts. No `hold`/`out` workaround on the sit needed (it still works). Put a
  `stand_up` before a walk off a seat: a walk alone ends the sit with a jump to standing height.
- **A seated / kneeling body keeps its seat.** Clips on a seated character (wince, shock_pop, lean_back...) never sink the hips into
  the bench (the planted-feet pelvis drop is off while `body.sit` / `body.kneel` is on).
- **The face is the timeline's.** A `face` key AFTER a clip's start beats that clip's face channels from that key on, and a clip that puts
  the face back (`'@'`) puts back whatever the face is doing then (talking, a later key), never a stale copy. `sip` writes eyes only when
  asked: `params.eyes: "half"` (or `face: true` = half). Any clip entry takes `"face": false` to drop all its face channels.
- **hop_bounce hops at its defaults** (crouch .1 D in 3 f, ~.36 D up over 4 f, down 3, twice; legs stretch, feet planted; a short-legged
  kid's toes leave the ground at the top). `params.height` / `count` as before. Park the camera.
- **hand_to_temple** puts the hand BESIDE the drawn head on that hand's side as the camera sees it, at temple height, touching the
  outline (it used to land on the mouth when that side faced the camera). Either hand, any angle.
- **Dutch roll:** `roll` (degrees, + = clockwise) works on every shot camera (number or `[r0, r1]`), on `lab/stage.mjs` camera `keys`
  (`{ t, pos, target, fov, roll }`, eased between keys) and on its `orbit` (`roll: n | [r0, r1]`).
- **Camera fields, exactly:** `orbit.height` (default 1.4) = the WORLD height (D above the ground) of the point the camera circles and
  aims at, over the subject's ground position (`who`/`whos`/`center`); `el` = the camera's elevation angle above that point, `dist` its
  distance from it, `az0 -> az1` degrees from the subject's facing (or `facing: 0` = world +Z). `follow.camOffset` = the camera's offset
  from the walker's (lagged, `lag` s box-averaged) GROUND point in WORLD axes (it doesn't turn with the walker); `follow.look` = the aim
  point, also a world-axes offset from the walker's ground point (`[0, 1.5, 0]` = chest height on the walker, whichever way he faces).
- **Prop opts over time:** a prop key with numeric fields that aren't placement (`{ "t": 2.1, "open": 1 }`, `"ease": 0.15` = blend from
  the previous value over that many seconds, else a snap) changes the prop's build opts from `t`; the prop's top-level opts are the
  start (`"open": 0`). A key with only opts (no `in`/`owner`/`at`/`rot`/`drop`) doesn't move the prop. Props whose object has
  `userData.set(k, v)` or `userData.update(obj, opts)` update in place; any other is rebuilt with the new opts (cached), so one umbrella
  opens instead of two props swapped. Example and frames: `lab/q3/propkeys/` (`lab/q3/propkeys.png`).
- **Prop drop:** a key `{ "t": 1.0, "drop": { "from": [x, y, z], "v0": [vx, vy, vz], "g": 9.8, "ground": 0, "spin": 0, "hide": true } }`
  = from `t` the prop falls under gravity (closed form, pure in t: D, D/s, D/s^2) from `from` (default: where it was), lands on `ground`
  (the prop origin's height) and hides (`hide: false` = it lies there). Drips, tossed things, a dropped tool.
- **Word captions** (`captions: "words"`) never put two words of different sentences in one beat: a '.', '?' or '!' in the line's
  text ends the beat ("NICE / UMBRELLA. / IS IT / RAINING?" never "UMBRELLA IS").
- **`--probe`**: see "Measure a film" under Command. `--probe-rows`: `EDGE-L/R/T/B` = cut by that frame edge; `hy` = head centre
  height above the ground (D); `BEHIND <name>` = something narrow (post, lamp, prop) right behind the head (side rays pass it: a wall never counts).

## Command
```
node tools/make_film.mjs films/<name>                      # everything -> out/<name>.mp4
node tools/make_film.mjs films/<name> --preview            # every 3rd frame at half size -> out/<name>_preview.mp4 (10 fps, voice on)
node tools/make_film.mjs films/<name> --frames 120-240     # only those frames (JPEG in out/frames/), no encode; chunks add up
                                                           #   also 335-400,640-695 or 1,5,9 (ENG7)
node tools/make_film.mjs films/<name> --encode             # encode once all frames exist
node tools/make_film.mjs films/<name> --probe              # one line per shot + TO LOOK AT + the PROP GUARD, nothing drawn (below); --no-guard skips the guard
node tools/film_review.mjs films/<name>                    # the whole film on sheets, about 3 s (below); --strips 750-790 = full frame rate; --cuts
node tools/film_encode.mjs films/<name>                    # the final mp4: frames + grade once + the mix (below)
node tools/make_film.mjs films/<name> --frames 130-150 --out lab/x/after   # frames + resolved.json + views.json into a lab folder
node tools/make_film.mjs films/<name> --cameras films/<name>/cameras/<id>.json --out films/<name>/out/cam_<id>   # the same film under another camera
  --no-drift  authored cameras only   --no-facelimit  the raw face (before/after comparisons)
node lab/checks/checks.mjs films/<name>                    # K's automated checks on the film (lab/checks/CHECKS.md)
  --copy <path.mp4>  also copy the result   --silent  no TTS (timed silence)   --no-asr  word times spread by length (fast)
```
Look at frames: `python lab/film/sheet.py films/<name>/out/frames sheet.png 0,30,60 [--w 300 --cols 6 --crop x0,y0,x1,y1]`;
`python lab/q2/sheet.py films/<name> out.png shots [--preview]` = the middle frame of every shot (`shots0` = each shot's 2nd frame).
**Python** (voice.py): env `CZ_PYTHON`, else blender-lab's `.venv` (Windows `Scripts/python.exe` or Mac `bin/python3`), else
`python3` / `python` on PATH; the log says which. Other tools reuse it: `import { findPython } from './make_film.mjs'` (main only runs
when make_film is the command, so importing it is safe; `wordChunks(words)` = the caption beats, also exported).

**Measure a film: `--probe`.** One pass with nothing drawn: the prop guard on every frame, the framing on every 6th. A head counts only when it is in front of the camera, within
100 D (`--probe-far D`; other places of a many-place film sit further than that) and partly in frame. It prints `S3 3.62-6.12 path: skipper 190..240px x48..52 y38..44 az-10..12 | ...`
per shot, then `TO LOOK AT`: heads cut by an edge (over 90 px), something narrow behind a head, a face gone, two heads overlapping, then the guard's line. `--probe-rows` adds the old per-frame rows.
S-4 (14 characters, 1174 frames): 18-33 s for guard + probe together, was 65 + 110 s.

**PROP GUARD.** On every full render and `--probe`. Each frame it asks: how far did this prop move, as this frame's camera sees it? (the last spot and this spot through the same camera). So camera
flights, whips and hidden cuts count for nothing and a real jump counts wherever the camera is. Over 40 px (1080-wide frame) on screen is reported. A move **fails the film** when its world move is
over .04 D and over 2.5 x both neighbouring world moves, unless it is allowed. A failure comes after the encode, so you still get the frames and the mp4; the exit code says failed. `--no-guard` only saves time, on films already known clean.
- **Allowed: an impact.** A clip that returns `hitFrame` (`knock` does, nothing to write), a clip entry `"snap": 6` or `[6, 14]` (clip frames; its `params.prop`, else all that character's props), a prop key `{ "t": 2.1, "snap": true }`. Any size, one frame either side. The rest of a `hitFrame` clip may move up to .3 D a frame (the hand between quick blows), so a hand that leaves its side for the ready pose in one frame still fails: give the first knock of a run `rise` 6-8.
- **Allowed: a placement key's travel,** up to 1 D a frame over its `pass` window. `pass: 0` means a jump, judged like anything else.
- **Cuts:** a hard cut isn't judged. A hidden seam is: a shot with `"seam": true`, or any cut where the camera moves fast on both sides (over .15 D or 2 deg a frame). A real hard cut caught by that: `"hard": true` on the shot.
- **Not judged:** a prop in a hand or on a body on a frame where the camera jumps (over 1 D or 8 deg): the drawn body turns with the camera, and the prop with it. A prop whose owner is over 100 D from the camera in `--probe`: on nobody's screen.
Proof: `node lab/toolsfix/test.mjs` (`lab/toolsfix/s4/film.mjs` plants three real pops in S-4).

**Review: `node tools/film_review.mjs films/<name>`.** Only needs ffmpeg, Windows and Mac. Into `out/review/`: `sheet_001.jpg ...` (every 3rd frame, 72 px wide, 27 x 5 tiles, the frame number on each, a yellow bar on the first tile of a shot) and with `--strips 120-150,300-330` one image per range at full frame rate, `--cuts` a strip of 8 frames around every cut. Source: `out/frames` when complete, else `out/<name>_preview.mp4`; `--src file.mp4` for any encode (to see the grade). Knobs: `--w --cols --rows --step`, `--sw --scols`, `--no-sheet`. Look at the images: it judges nothing.

**Grade + final encode: `node tools/film_encode.mjs films/<name>`** -> `out/<name>_final.mp4` (libx264 slow crf 16, aac 256k; `out/mix.wav`, else the voice; `--to P --frames-dir D --audio F --no-grade`). A missing frame stops it. The grade has one place, the film file:
```js
grade: { vignette: 'PI/4.6', places: [ { name: 'torpedo', windows: SEAMS.T, gamma: .84, contrast: 1.12, saturation: 1, gr: .98, gb: 1.05 }, ... ] }
```
ffmpeg `eq` numbers (`gr gg gb` = `gamma_r _g _b`), applied in order. A `film.mjs` builds `windows` from its own shots table, so they exist once. `--preview` and make_film's own mp4 show the grade too.
**It can't apply twice.** make_film writes `render.json` beside the frames: `gradedInFrames` is true when the set has a post pipeline (`set.look`, e.g. `world/look/post.js`), and then the encode adds nothing and says so. Such a film gives its post settings the same table (`grade: GRADE.torpedo`: same field names, but then `gr` etc. are read by post.js, and `windows` by nobody). A film with a `grade.py` and no `grade` key is refused: older films keep their own command, so their results stay what they were (`lab/toolsfix/s4grade` = `films/s4/grade.py` as a table, same picture frame for frame).

**A film's own set: `films/<film>/set.js`.** Used when `world.set` is `"own"`, or there is no `world.set` and the file exists. Nothing goes in `world/sets.js`.
```js
export function buildSet(THREE, scene, opts, kit) {            // opts = world.setOpts; may be async
  const set = kit({ name: 'ride', boxes: [ ... ] }, opts);      // optional: start from a shared set or a boxes list (kit = world/sets.js buildSet)
  const sub = new THREE.Group(); sub.name = 'sub'; set.group.add(sub);   // the name is what a path key follows
  return { ...set, marks: { ...set.marks, door: [2, 1] }, update(t) { set.update?.(t); sub.position.y = 44 - t; } };   // update: pure in t
}
```
It may return as little as `{ group }`: the rest is filled in, though only a set using `world/sets.js`'s materials shows the sun shadow. Everything else from the set contract in `world/WORLD_API.md` works (`points`, `ready`, `look`, `lightDir`, `casters`), and it can import by relative path (`'../../world/look/lights.js'`). For `sit_on.seat` by name, write `marks: { bench: [1, 2] }` as plain text in the file. Example: `lab/toolsfix/ride/`.

**Rendering a frame alone** (for parallel renders later). Not bit-exact, and not because of render order: see `docs/NEW_FILM_RUNBOOK.md` "Known gaps". The same frame in one open stage, with identical geometry, matrices and numeric uniforms, can differ in a few pixels each time on `s4_shade`. Compare frames with the tolerance in `lab/regress.py` (8 levels, .05 % of the frame), not by hash.

## Cut 3 of The Last Loaf (Q2, overnight 2): direction that worked
17 shots in 30.2 s (a cut every 1.2-2.6 s, on line starts, mid-line word starts and actions). Every shot moves (push 7-12 %, or a
follow on a walker/runner) and most carry a 1-5 deg Dutch roll that drifts by a degree over the shot; the characters hold still
under it. Camera y 1.0-1.5 for adults (under the chin, looking up), 1.2 for the kid. Depth: an over-the-shoulder shot (camera on the
far side of the listener, the speaker 8-9 deg off the listener's head so both read), the stand's loaves as a low foreground, the kid's
head as a foreground edge. Hand-overs: a two-shot from the front where both hands and the meeting point are in frame, starting .45 s
before the hand-over line (for a tall + short pair seen side by side: camera ~12 D back on the far side, fov 28). Arrivals: time the
walk/run so it ENDS before the line that needs the character (a run of 7 D took 2.4 s; check with `--probe`, the character must be
listed in the shot before its line).

## Speed (RTX 5080 PC, 1080x1920)
Voice: ~25-30 s the first time (Parakeet model load), cached after. Stage boot ~1 s. Frames: 17 ms/frame for one character,
~34 ms/frame for three characters with sun shadows (~14 ms in page, the rest JPEG + transfer). The Last Loaf cut 2 (29.0 s, 870 frames,
3 characters, 10 shots): 36 s total with the voice cached, ~60 s from scratch. Preview: about a third of that.

## ENG5 (2026-11-04, FABLE_REVIEW3 items 1, 4): never a frozen frame, prop pop guard
- **Camera auto move** (`autoMove` in make_film; the film file is untouched, `resolved.json` shows the result with `camera._auto`):
  a `park` shot becomes a slow dolly toward its target, `drift` of the distance per second (shot or camera key, default `.02` = 2 %/s,
  capped 15 % per shot), eased (inOutSine on a window padded half a shot past both cuts) so it never stops inside the shot; its first
  frame is the authored framing. A `push` whose window touches a cut with an ease that stops dead there (inOutSine, outCubic, ...) is
  padded past the cut and rescaled: still exactly `from` / `to` on its first / last frame, but moving there.
  **Law 9 stays possible:** `still: true` (or `park: true`, `drift: false`) on the shot or its camera = no auto move; a push's own
  `t0` later than the shot start / `t1` before its end = parked before / after it on purpose. `orbit` and a `follow` without `parkAt`
  are left as authored. **ENG6: a `follow` with `parkAt` keeps drifting after it parks:** make_film splits the shot at `parkAt` into
  the follow + a `park` on exactly the follow's parked framing (computed in node with the same `follow()` and the walkers' timelines;
  rests read from a tiny 64 px stage, only when such a shot exists), which then gets the park drift above (moving from its first
  frame; `roll` a number is kept, `[r0, r1]` is split at parkAt). resolved.json shows two shots (the second has `_parkOf` = the
  follow's index). `still: true` / `drift: false` on the follow = parked dead still after parkAt as before. Film `drift: false` or
  `--no-drift` = authored cameras only. Measured on `lab/eng5/hold` (a parked shot, two still characters, bread_corner): frame n vs
  n+9 = 99 dB (identical) before, 21.4 dB after (the authored push in shot 3: 16-20 dB at full size).
- **Prop pop guard:** rewritten, see "PROP GUARD" under Command.

## ENG7 (2026-11-04, blind4 stuck points 1, 2, 3, 5): eating, picking up, putting down, holds that end, head overlap, frame lists
Tests `node lab/eng7/test.mjs`; lab film `lab/eng7/blind4/film.json` (pick up, eat L, eat R, second bite, put down; the folder is named
blind4 only so the stage finds `films/blind4/props/cookie.js`); strips `lab/eng7/strip_*.png`.
- **Eating: clip `eat` (alias `bite`)** `{ side: 'R'|'L', prop, up: 5, hold: 3, down: 5, chew: 1, to: 'chest', nod: 3 }`. The held prop goes to
  the mouth on an arc, the mouth opens ahead and SNAPS shut on it (bite = clip frame 6 by default), back down to the chest and holds
  there, chewing. Either hand; the hand + prop draw IN FRONT of the drawn mouth (no more `armL.drink` / `armL.over` base tracks, no
  `raise_prop to: "mouth"`). The prop needs to be in that hand already (`carry`, `pick_up`, a hand-over or `in: 'hand:L'`).
  **Bitten state:** make_film adds an opts key on the bite frame: `bite: 1` on the first eat of that prop, `2` on the second ... (a prop
  module that reads `bite`, e.g. `films/blind4/props/cookie.js`, swaps to its bitten shape on that frame). `biteKey: 'name'` = another opt,
  `biteTo: v` = a fixed value, `biteKey: false` = none. Recipe (cookie on a plate -> mouth):
  ```json
  { "clip": "pick_up", "at": "line:4.end+0.3", "params": { "prop": "cookie1", "side": "L" } },
  { "clip": "eat",     "at": "line:5.start-0.2", "params": { "prop": "cookie1", "side": "L" } }
  ```
- **Grabbing a collar: `grab_collar`** `{ "clip": "grab_collar", "t0": 0.5, "params": { "side": "L", "target": "june", "reach": 5 } }`
  (+ `release: N` frames to let go, `jerk: false` = no pull on the target): the fist goes to the target's collar and stays on it every
  frame while the target turns / leans / steps, until a later clip moves that arm. Stand them ~1-1.2 D apart (MOTION_API "Agent A").
- **Picking up / putting down: `pick_up` / `put_down`** `{ prop, side, at: [x, y, z] world, reach: 5, grab: 2, lift: 5, to: 'chest' }` /
  `{ prop, side, at, reach: 5, release: 2, back: 5, after: 'hang'|'chest'|'@' }`. The hand reaches the WORLD spot on screen (the body bends
  forward by itself when the spot is low / far: `bend` deg overrides), the prop switches between `{ in: 'world', at: spot }` and the hand
  on the contact frame (the hand is on the spot then: no pop, the PROP GUARD stays quiet), lifts / lets go. The film's prop: `in: 'world'`
  + `at` (pick_up without `params.at` takes it, and its `rot` for the yaw on the spot); make_film gives the prop `owner` = that character
  when it has none (only these clips; it warns when another character owns it). Stand him within ~.8 armLen (~.75 D) of the spot
  (`COMPOSE WARNING: ... can't reach the spot` otherwise: the prop would jump). After `put_down` the prop stays on the spot.
- **Holds end on the same arm:** a clip with no `out` (held forever) that moves an arm stops on that arm when a LATER clip moves the same
  hand (`point` then `wave` + out: the arm goes back to rest after the wave, the point does not come back). `carry` and `akimbo` are lasting
  states and still come back (`keep: false` on the entry ends them too, `keep: true` keeps any clip). Seats end only by stand_up / a walk.
  Old films, every frame compared with the old rule (`node lab/eng7/same.mjs`): last_loaf (mara f804-905, walter f675-905: armL.bend only),
  coffee_break boss (f469-935: after raise_prop's out his hand rests instead of going back to the sip pose; he stands up at f483 anyway),
  blind3 nora (f283-695: her flicked arm no longer comes back out level), blind4 rosa (f332-734: the stirring arm no longer returns);
  everything else identical.
- **`--probe` flags overlapping heads:** a probe row ends `OVERLAP a/b` when two head discs on screen are closer than .9 x (d1 + d2) / 2,
  and the summary prints `S<n> OVERLAP a/b: ... on N probes` (or `OVERLAP: no two heads overlap on the probes`).
- **`--frames`** takes `120`, `120-240`, `335-400,640-695`, `1,5,9-12` (sorted, no repeats, clipped to the film); a bad token is a clear
  `MAKE_FILM FAILED: --frames ...` (was a TypeError in track.js).

## ENG8 (2026-11-04, blind5 stuck points 1-5): glasses off, hand-overs end holds, shake, sign, partial-range guard, spec check
Tests `node lab/eng8/test.mjs`; lab film `lab/eng8/blind5/film.json` (Lena with SPEC sunglasses lowers them, Mo offers the parcel with a
held point, hand-over, she signs with a pen, shakes it, takes the glasses off and puts them back on); strips `lab/eng8/strip_lower.png`,
`strip_handover.png`, `strip_sign_shake.png`, `strip_off.png`.
- **Glasses come off: use SPEC glasses** (`"glasses": { "kind": "sun" }`), never a film prop held at the eyes. Clips (MOTION_API ENG8):
  ```json
  { "clip": "glasses_lower", "at": "line:2.start", "params": { "side": "L" } },
  { "clip": "glasses_off",   "at": "line:4.end+0.3", "params": { "side": "R" } },
  { "clip": "glasses_on",    "at": "line:5.end", "params": { "side": "R" } }
  ```
  or snap with a face key: `{ "t": "line:3.start", "glasses": "lowered" }` (`on | lowered | off | hand:R | hand:L`). Lowered = slid down
  the nose, the eyes show above the frames; in a hand = the pair drawn front-on beside the fist (never like an eye patch). Use the hand
  nearer the camera. A lead may wear `sun` now: lower or remove them for the beats where the eyes act.
- **Hand-overs end the handing arms' holds:** after the prop leaves, the giver's held `point` / offer / `carry` comes DOWN with the
  hand-over's `back` (and the taker's reach likewise); no `hold` + `out` tricks. A taker's clip starting at the hand-over `t` (a `carry`
  of the new prop) is kept. Hand-over `endHolds: false` = the old behaviour, `"from"` / `"to"` = only that side.
- **Shake a held prop:** `{ "clip": "shake", "at": "line:4.end+0.2", "params": { "side": "R" } }` (`"both"` for a two-handed box; `count`,
  `amp` .1 D). It rides on whatever the hand does, so no `raise_prop` chains.
- **Sign:** `{ "clip": "sign", "at": "line:3.end", "params": { "side": "R", "board": "parcel", "pen": "pen" } }` + a prop
  `{ "id": "pen", "kind": "pen", "owner": "lena", "in": "hand:R" }` (engine/props/pen.js; hide it after with a key `{ "t": ..., "in": "hidden" }`).
  The board hand (the other one) holds the parcel in front of the chest; the pen hand scribbles 8 f. Sound effects are still out of scope.
- **PROP GUARD on `--frames` chunks:** a move is called a teleport only when both neighbouring frames were rendered; a big move at the
  edge of a chunk is counted as a fast move and the guard says `N of them at the edge of a --frames range ... not judged` (render a
  wider range or the whole film to judge). The first frame of a range is never a jump. (Still true after the rewrite.)
- **`node lab/fx2/validate_specs.mjs [specs/x.json ...]`** prints `OK   <spec>` / `WARN <spec>: ...` per spec, then
  `VERDICT: all specs clean, unchanged (N specs)`; the validator's own wrong-outfit self-test prints only with `--selftest`.
- **Runs:** head level (smaller bob, the noodle legs stretch instead of the hips dipping): nothing to author.

## ENG10 (2026-11-04, blind6 stuck points 1, 2, 4, 6)
Tests `node lab/eng10/test.mjs`; lab film `lab/eng10/blind6/film.json` (a copy of blind6: Bea walks ONTO the stool mark, `sit_on` with
`from: "here"` + face 60, `pick_up` with NO `at`, cat-eye glasses from `lab/eng10/bea_cateye.json`); strips `lab/eng10/strip_sit.png`,
`strip_pickup.png`, `strip_glasses.png`; old-vs-new poses of every film `node lab/eng10/same.mjs`.
- **`pick_up` without `params.at` works** (it threw in the gaze pass): make_film fills prop clips BEFORE anything evaluates a pose. The
  spot = the prop's CURRENT world spot: where the latest earlier `put_down` of that prop (anyone's) left it, else the prop's own `at`
  (`in: 'world'`). A prop last seen in a hand with no put_down -> its film `at` (give `at` yourself then).
- **`sit_on.seat` is where the hips land, in every mode** (with `from: "here"` they landed .59 D behind it). Standing on the front point
  (seat + ~.59 D along `face`) keeps the feet planted; standing anywhere else (even on the seat mark) the hips slide onto the seat while
  sitting and the feet end in front. Best still: stand him on the front point, or use `from: "walk"`.
- **Reaching while seated** is measured from the seated hips: a table spot within ~.75 D of the seat on the ground plane, near table
  height, no longer warns. The warning, when it comes, says "from where he sits".
- **Glasses kinds `cateye` and `oval`** (WARDROBE_API.md table): "cat-eye / winged / upswept" -> `cateye` (a coloured frame reads best),
  "oval" -> `oval`.

## Camera versions (2026-11-04, gruss: the same composition under different cameras, presets in Creatorize later)
One film, any number of cameras: `films/<name>/cameras/<id>.json` = `{ name, id, feel, recipe, shots }`. `shots` replaces the film's shots
(film.json is not touched, `endFrame` is off, the camera file decides the end); acts, props, voice and captions stay the same, so a camera
version can share the film's mix and final encode. `feel` = what it is like to watch, `recipe` = the rules that make it work on any other
script (a preset later is the recipe, not these coordinates). Check: `characters` and `props` in `out/cam_<id>/resolved.json` equal the
film's. Worked example: `films/backrooms/cameras/` (dread_cuts, one_take, found_footage, the_watcher).
**`move: "path"`** (`engine/camera_moves.js path`): `keys: [{ t, pos, target, fov, roll, shake, walk, stop }]`, monotone cubic per channel:
passes every key, no overshoot, keeps moving through keys. `pos` / `target` = `[x, y, z]` or `{ who | whos, offset: [x, y, z] }` (read every frame: a
key on a walker stays on him; `whos` = their average). `stop: true` = the speed is zero at that key (an aim that lands, after a whip).
`shake` = handheld strength (1 calm, 2 a jolt, 3 panic, .5 holding their breath), `walk` = the bob of the steps of whoever holds it (0-1).
**A key on a thing, not a person:** `pos` / `target` also take `{ object: "sub", offset: [x, y, z] }` (a set object: its `.name`, or `set.points.sub` = an Object3D, a point, or a function of t; read after `set.update(t)`; `local: true` = the offset turns with the object) and `{ prop: "id", offset }` (where that prop is on this frame, in a hand or falling). A name the set or the film doesn't have stops the film before anything renders. Riding a sinking sub is one line, on the first and last key:
`{ "t": 10, "pos": { "object": "sub", "offset": [22, 6, -9] }, "target": { "object": "sub", "offset": [0, 3, 0] }, "fov": 46 }`. Example: `lab/toolsfix/ride`. A shot following a prop places the props twice per frame; the others cost nothing.
What the Backrooms versions taught:
- **Whip:** two keys 5-7 frames apart, the target far away, and a key half way aimed sideways: a target passing through the camera has no direction.
- **Foreground heads:** at the same distance a head grows fast (`px = 1920 / (2 tan(fov/2) d)`). Pass a group over their heads (y 4.1+ with `CEIL` 5, at least 1 D from any head: closer and the frame goes solid dark for a few frames) or stay 4+ D out.
- **Don't look ahead on a flight:** the frame goes to blank wall. Keep the next subject in frame even from behind, and swing to the face on landing.
- **Long lens + doorway:** the door edge fills the frame unless the ray passes just beside it: aim from the subject through a point just inside the door, and put the camera on that line (+X is on the LEFT of a view along +Z).
- **Faces:** after everyone turns, a camera on the old side sees backs. Move the peek to the beat when they face it.
- A camera version goes through the same PROP GUARD as the film: camera moves don't count in it any more.

## Conventions and limits
- Stage the cast for the camera: a character facing away from the camera has no face (face off past az 95). Cheat 3/4: two people
  talking face each other at ry about +-70 toward the camera side, and point `look` targets in front of the listener, not behind.
- 9:16 at fov 26 is narrow (6.5 D tall at 14 D): three people in a wide need ~20 D and fov 30.
- No dissolves yet (hard cuts only); props dropped with `release` lie where they fell only in forward renders.
