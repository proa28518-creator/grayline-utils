# Example: the backrooms short (32.5 s), pass by pass

## The brief
- Six wanderers lost on Level 0 hear a woman down the hallway: "Over here, I found the way out." Five run. Maya grabs the nearest guy (Cal) by the collar: "Don't, that's Lena." Lena went missing on day two. The things down here copy voices. Everyone freezes; the voice calls again, closer, and sounds exactly like Maya, who hasn't blinked once.
- One narrator, two quoted lines on screen (Maya, Cal), one from down the hallway (nobody). Priorities, in gruss's order: characters and their animation, story staging, a lit textured previz, everything else.
- The bar for this whole style: `backrooms_shaded_one_take`, gruss: "Flawless, this is perfect".

## Where the full files are
- `.claude/skills/cartoon-shorts/examples/backrooms_shaded_one_take/`: `film.json` (the One Take camera applied, sprites, shading moods), `props/` (almond_water, backpack, figure, flashlight), `cameras/one_take.json`.
- The set: `examples/backrooms_shaded_one_take/set/backrooms2.js`.

**This is a lesson, not a kit.** A member's film is written new from its own words, with its own cast, acting, shots, camera and set,
even when its voice is the same as this one: take the method and the bar from here, never the film, its acting, its shots or its set.
The named sets `backrooms` and `backrooms2` are not in a member's project.

**What the example did that a member film does differently:**
- The set is a named shared set (`world: { set: 'backrooms2' }`, `world/backrooms2.js`). Its light and its shading (`world/look/charshade.js`) are hard-wired to this hallway's ceiling panel grid. A member film writes `scenes/set.js` with `world: { set: 'own' }` and uses the general route from the S-4 short: lights as data (`'../world/look/lights.js'`), post (`post.js`) and shading (`rigshade.js`) reading them. Take the backrooms' ideas and values, not its set code.
- The flashback grade (sepia, 16.92-18.58 s) was an ffmpeg filter in our encode. In the app the in-page post grades: give the flashback its own place in `scenes/post.js` and switch to it with `states` at its start and back at its end, then check both switches in a `film_sheet`. If that can't express it, report the gap.
- Sound (hum bed, footfalls, the dead-quiet drop, a low hit at the end) and the music mix were ours; in the app the sound design is automatic.
- The voice was trimmed by our tool; in a project it is `audio/clean.wav` + `audio/clean.json`, made by the app.
- The `grab_collar` clip was built for this film and is in the engine copy now.

## Pass 1: Build, about 77 min to the final cut (4 agents at once, then a fresh-eyes reviewer)
**How it ran:** one coordinator and four parallel agents with one writer per file: A engine fixes and the collar grab, B voice, C cast (7 new specs, expressions, a cast sheet and turnaround before any shot existed), D world (textures and a lit previz set with props). Voice and cast came first, before any shot existed; then the first cut with sound, then a fresh-eyes review by a different model given only the bar, the script and the film (the critic loop of `references/critic.md` grew from this), then fixes. gruss's verdict on this first version (Dread Cuts): "Flawless".
**What made it work:** characters first; the story's details staged exactly (Maya's eyes never blink from her first frame to her last; her hand stays on Cal's collar across every cut; five run, she stays); the hallway voice has nobody on screen; the cast checked as a sheet before staging.
**What the reviewer caught on the first cut, worst first** (each fixed before delivery): nobody really ran (they drifted toward the lens); the grab was a pose swap with no reach, contact or settle; the ending had no push-in and Cal didn't turn to her; the freeze shot was a black blob and five backs; 15 s of locked-off shots; bodies like posts; a police-lineup wide with a head cut at the edge; captions over the grab hand. These are the classic first-pass faults: check for them yourself.

The voice lines (who `null` = narrator or off screen, no lip sync):
```js
voice: { file: 'audio/clean.wav', words: 'audio/clean.json', lines: [
  { who: null, text: 'If you ever find yourself in the backrooms, never answer a voice you recognize.' },
  { who: null, text: 'Over here, I found the way out.' },          // from down the hallway: nobody on screen
  { who: 'maya', text: "Don't, that's Lena." },
  { who: null, text: 'And he goes,' },
  { who: 'cal', text: "great, so she's alive." },
  /* ... 13 lines in all; every time in the film is a line:N.word:K reference */ ] },
```
Maya: never blinks, and the grab on the word:
```js
maya: {
  blink: false, listen: [],
  walk: [ { t0: 0, path: [[-0.6, 0.8]], speed: 1.2, slow: true, face: 50 } ],
  clips: [ { clip: 'grab_collar', at: 'line:5.word:2', params: { side: 'R', target: 'cal', reach: 7 } } ],
  face: [ { t: 0, eyes: 'stare', brow: 'down', mouth: 'tight', react: false } ],
  look: [ { t: 'line:4.word:5', at: [1.2, 2.7, 2.6] } ] },
cal: {
  walk: [ { t0: 'line:4.word:3', path: [[1.6, 1.9], [0.45, 0.95]], gait: 'run', speed: 5.0, face: -65 } ],
  face: [ { t: 'line:8.start-0.1', eyes: 'arc', brow: 'worried', mouth: 'smile', hold: true, react: false },
          { t: 'line:10.word:7+0.07', eyes: 'pinpoint', brow: 'worried', mouth: 'flat', react: 'slump' } ] },
```
The thing that copies voices: a prop that appears far away, then closer (no animation needed to read):
```js
{ id: 'thing', kind: 'figure', in: 'hidden', at: [0.3, 0, -52],
  keys: [ { t: 'line:9.start', in: 'world', at: [0.3, 0, -52] }, { t: 'line:12.start', in: 'world', at: [0.2, 0, -36] } ] },
```

## Pass 2: Camera, four instruction sets on the same acting
Same composition, only the camera rewritten and the film re-rendered. Each set is a plain-English goal (`feel` + `recipe`); its `shots` are one worked example for this film, never a path to copy. All four were approved; One Take, later combined with the detail, sprites and shading, became the "Flawless, this is perfect" bar.
- **Dread Cuts:** "A hard cut on a line start or an action, every 1.2-3.5 s, never two near-identical angles in a row. Lens fov 26-32, camera at chest-to-head height. Every shot moves: a push of 10-15 % or an orbit of 10-15 deg. Roll 2-5 deg, changing side from shot to shot. Dead still only for the silence. The last shot pushes in on the character who knows."
- **One Take:** "A single path shot for the whole film. Lead the walkers backwards, slide to whoever the line is about, sweep round a group when they all turn. Beats far apart become flights (over heads, through a door, 30+ D in under a second) timed to land on the first word of the line. Whip away from a reveal and back so the thing can move while unseen."
- **Found Footage:** one of them is filming: fov 46 at 4-5 D, shake 1 at rest, 2 on a jolt, 3 in panic, whip pans of 5-7 frames instead of cuts, hard cuts only where the tape would jump.
- **The Watcher:** something is watching: fov 9-16 from 15-25 D, no roll, no shake, never faster than about 0.5 D/s, hide behind door frames, fewer cuts, a dead-still shot for the silence, end tight on the one who knows.

The One Take, a few keys of its single `path` (targets follow characters, so the acting can change under it):
```js
{ t0: 0, t1: 99, camera: { move: 'path', keys: [
  { t: 0,    pos: { whos: ['cal', 'maya'], offset: [0.3, 2.6, 8.5] }, target: { whos: ['cal', 'maya'], offset: [0, 2.6, 0] }, fov: 30, roll: 0 },
  { t: 2.3,  pos: { who: 'maya', offset: [-0.6, 2.65, 7.0] }, target: { who: 'maya', offset: [0, 2.75, 0] }, fov: 30, roll: 0 },
  { t: 8.1,  pos: [1.6, 3.9, 6.0],  target: [0.15, 2.4, -3],  fov: 38, roll: 0 },     // the flight over the runners' heads
  { t: 8.62, pos: [-1.0, 4.25, -1.1], target: [-0.6, 2.4, -12], fov: 38, roll: -2 },
  { t: 25.6, pos: [0.4, 1.9, -25.6], target: [0.2, 2.6, -36], fov: 26, roll: 0, stop: true },   // whip back to the thing, now closer
  { t: 30.0, pos: [4.2, 2.5, 6.5],  target: [-0.6, 2.68, 0.8], fov: 26, roll: 2 },
  { t: 32.48, pos: [2.3, 2.6, 4.25], target: [-0.6, 2.68, 0.8], fov: 26, roll: 3 } ] } }   // the slow push in on Maya
```

## Pass 3: Environment detail (Blender, Flow, Three.js at once), "INSANE Quality"
**How it ran:** a contract first (layout to the coordinate, keep-clear zones for walks and flights, file formats, decal cell ranges, the bar in words), then three parallel tracks: Blender about 22 min, Flow about 34, Three.js about 28, then one review pass from before/after sheets with the grade on. Same voice, acts, props and shots: a new film folder, never edits to the approved one.
**What made it look this good, biggest first:** real depth of field with sharp characters on top; haze with distance; live pools of light from the ceiling panels; organic placement (dirt at seams, corners and doorways, in clusters, with clean stretches between); real modelling where the eye goes (the ceiling grid: bevelled, sagging, missing tiles, a dark void above); quiet base textures with loud decals; the characters' own drawing untouched.
- Blender: one script, no hand work, about 4 s, the same bytes every run (`blender/build_set.py` via `blender_run`). Author in three.js axes, one mesh per material name, UVs in world units, kit assets low poly with bevels, scatter with geometry nodes built in code (density = base x falloff from seams and hot points x large noise x medium noise), exported from the evaluated instances into `assets/set/scatter.json`. Ceiling decals sit between the T-bar flange and the tile, so a stain never crosses the grid.
- Flow (`make_picture`, then `tex_job`): flat, low-contrast scans that tile; damage only as decals on white; 3 x 3 tilings looked at before accepting. All three regenerations were for features that repeated (wallpaper creases, carpet blotches, ceiling cracks).
- Values that gave this look (a starting point for a dim interior): panel light `[1.75, 1.82, .84]`, ambient `[.17, .17, .09]`, haze colour `#2c2911`, depth of field aperture 28 with max blur 26 px at 1920 tall, a dark silhouette kept clear of haze (`thingClear .9`).

## Pass 3b: Sprites, "NO WAY THIS IS ACTUALLY HUGE IMPROVEMENT"
gruss's idea: painted cut-outs from Flow that turn to face the camera, like trees in old games: rich detail in an inked style close to the characters'. 233 of them, no measurable slowdown. The subagent and the coordinator had judged it "moderate" from stills: judge sprites moving.
- Flow draws whole sheets on solid magenta (so gaps like chair legs key out) in thick dark ink with simple shading; `tex_job {kind: 'sprites'}` cuts them into `assets/tex/sprites/*.png` + `sprites.json`.
- Place big pieces by hand where wide shots see them, scatter the rest in side rooms, hang wires from ceiling holes, nothing right behind a face (a water cooler behind Lena had to go).

`assets/tex/sprites/sprites.json` (one entry per picture; a character is about 3.2 D tall):
```json
{ "name": "office_chair", "file": "office_chair.png", "height": 2.0, "kind": "floor", "anchor": "bottom", "aspect": 0.6352, "sheet": "sheet_furniture" }
```
Placement and keep-clear zones in the film's set options:
```js
sprites: {
  keepClean: [ { x: [3.0, 6.4], z: [-72, -56], maxTop: 1.4, hang: true } ],          // where runners and flights pass
  place: [ { name: 'filing_cabinet', x: -2.95, z: -3.3, s: 0.8 }, { name: 'water_cooler', x: 3.15, z: -3.35, s: 0.95 },
           { name: 'office_chair', x: 1.2, z: 17.45 }, { name: 'mop_bucket', x: 6.1, z: 14.8 } /* ... */ ],
  clearPath: { r: 3.2, rSmall: 1.5, rHang: 1.2, keys: [[0.4, 2.9, 10.5], [0.0, 3.0, 13.0], [1.6, 3.9, 6.0] /* the One Take's camera positions */] } }
```

## Pass 4/5: Shading with moods per scene, "It looks a whole lot better"
**What it did:** the 2.5D characters shaded from the drawing's own rule: the head as a sphere over the head disc, the body as a cylinder over its axis, in screen space, multiplying only what they drew (every line, colour and expression stays theirs), lit by the set's panels near each character, so walking under a panel, the flicker and the camera side all change it. Moods per stretch of time set the feel.
**The flicker gruss caught ("like if it's clipping"):** a flickering light steered the shadow's direction and characters crossing between lit regions switched light in one frame. Fix: direction ignores flicker, regions blend over distance, the light is read over a window around t along the character's own timeline (never the previous frame), and flicker reaches only the level, softly.
**One Take version:** no cuts to hide a change, so every mood eases in (the flashback's ease went from .02 to .3), sprites along the flight are cleared, and anything that comes very close to the lens is hidden (`hideNearPx: 8000`).

The moods (in a member film these go in `scenes/shade.js` as `moods`, with places and lights from the S-4 route):
```js
moods: [
  { t0: 16.92, t1: 18.58, ease: 0.3, shadow: 0.84, rim: 0.25, low: 0.68, key: 1,    tintS: [0.98, 0.93, 0.78] },   // flashback: soft, pale, a memory
  { t0: 23.0,  t1: 25.48, ease: 0.3, shadow: 0.62, rim: 0.95, low: 0.34, key: 0.9,  tintS: [0.8, 0.86, 0.6] },     // the freeze: harder top light, deep shade, edges
  { t0: 29.8,  t1: 40,    ease: 1.2, shadow: 0.64, rim: 0.85, low: 0.38, key: 0.92, tintS: [0.84, 0.88, 0.6] },    // the end: closes in on Maya
],
```

## Every version, in order (each adds one thing, each judged in motion by gruss)
| version | adds | gruss |
|---|---|---|
| base build, Dread Cuts | characters on the lit previz | "Flawless" |
| One Take, Found Footage, The Watcher | three other cameras on the same acting | approved |
| detail | Blender set, Flow textures, live light, haze, dust, focus | "INSANE Quality" |
| sprites | 233 camera-facing painted cut-outs | "HUGE IMPROVEMENT" |
| shaded | shading on characters and props, moods | "It looks a whole lot better" |
| shaded One Take | One Take on all of it | "Flawless, this is perfect" |

Still weak: a stain can stop in a straight line at a tile edge, fallen tiles have no texture, the carpet is flat. Lessons from every pass are in `../pitfalls.md`.
