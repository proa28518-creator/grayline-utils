# The film format (`scenes/film.js`)

One file: `export default { ... }`. It may import its own modules (`./shots.js`, `./post.js`, `./shade.js`) and compute tables:
one table of hits can drive the hands, the props and the camera together. The page resolves it the way the engine's film maker
does, then draws frame t. Film time = the voice's clock. The full reference is `api/FILM_API.md`
(written for our own tools: its `films/<film>/` is your `scenes/`, its `make_film` is the app's preview and render). If a name here is
wrong, the deep docs in `api/` (FILM, MOTION, FACE, BODY, WARDROBE, WORLD) win.

## Skeleton
```js
export default {
  fps: 30, size: [1080, 1920],
  world: { set: 'own', setOpts: { } },                 // or a kit set name: 'park', 'kitchen', 'plain' ... (sets.md)
  cast: { maya: { spec: 'cast/maya.json', at: [-1.2, 0.8], ry: 30 } },
  voice: { file: 'audio/clean.wav', words: 'audio/clean.json',
           lines: [ { who: null, text: 'If you ever find yourself here' }, { who: 'maya', text: "Don't, that's Lena" } ] },
  acts: { maya: { face: [ { t: 0, expr: 'fear' } ], clips: [ ], look: [ ], walk: [ ] } },
  props: [ ], handovers: [ ],
  shots: [ { t0: 0, t1: 'line:2.start', camera: { move: 'push', from: { pos: [0.5, 2.3, 9], target: [-1.2, 2.5, 0.8] },
                                                   to: { pos: [0.3, 2.3, 7.5], target: [-1.2, 2.5, 0.8] } } } ],
  captions: 'words',
};
```

## Keys
| key | what |
|---|---|
| `fps`, `size` | 30, `[1080, 1920]` (9:16) or `[1920, 1080]` in a wide project (`wide.md`). The project's format decides |
| `world` | `{ set, setOpts }`. `set`: `'own'` = `scenes/set.js`; a kit set name; or a description object (sets.md). `setOpts` = the set's knobs and the post / shading settings |
| `cast.<id>` | `{ spec, at: [x, z], ry, y, face }`. `spec` = a built-in id in `specs/`, `'cast/<id>.json'` (your file), or an inline object. `ry` 0 faces +Z (the camera side), 90 faces +X. `y` = stands on a deck that high |
| `voice` | `{ file, words, lines: [{ who, text, loud }] }`. `who: null` or not in the cast = narrator (no lip sync; captions still show it) |
| `acts.<id>` | the character's timeline: `face look clips walk sit_on height place blink plants base` (characters.md) |
| `props` | `[{ id, kind, owner, in, at, rot, keys, ...opts }]`. `in`: `'hand:R'`, `'hand:L'`, `'body'`, `'world'`, `'hidden'` |
| `handovers` | `[{ prop, from, to, t, fromSide, toSide }]`: both hands meet, the prop changes hands on screen |
| `shots` | `[{ t0, t1, camera, seam, hard, focus, still }]`, hard cut at each `t0` (camera.md) |
| `captions` | `'words'` = one or two big bold words per beat (his style); `true` = the spoken line in the lower third |
| `endHold`, `endFrame`, `drift`, `lowCams` | the ending is automatic (.5 s after the last word or action); `drift: false` = authored cameras only |

## Voice lines and times tied to words
- The words in `audio/clean.json` are split across `lines` in order by matching each line's words (case and punctuation ignored).
  A mismatch or leftover words stops the film and names the line. So write each line exactly as it was spoken: `narration` shows it.
- Any time key takes a word time: `'line:N.start'`, `'line:N.end'`, `'line:N.word:K'` (word start), `'line:N.word:K.end'`, each with
  `+0.2` / `-0.3`. N and K count from 1. Works in `acts`, `props`, `handovers`, `shots` (incl. `parkAt`, push `t0`/`t1`, `sit_on.t0`).
- A clip's `at` is read only when it is a `line:` string. Seconds go in `t0`: `{ clip: 'wave', t0: 2.2 }`.
- **Loud words:** talk is a small mouth. A word ending in `!` in `text` gets the big open mouth; `loud: true` on a line = every word.
  Put `!` only on real shouts.

## Props
- Built-in kinds: `mug cane loaf half_loaf newspaper box pen camera umbrella phone book bag ball cup bottle broom fishing_rod flowers
  letter` (+ more in `engine/props/`). Anything else: `scenes/props/<kind>.js`, `export function build(opts) -> Object3D`, origin at
  the grip. Give props print and state (a title, a headline, `open`), never a blank slab.
- One owner on every frame. Owner changes move the prop on a short path, never a pop: `pick_up`, `put_down`, `handovers`.
- Opts over time: `{ t: 'line:3.end+0.5', open: 1, ease: 0.2 }` changes the prop's build opts from `t`.
- Falling: `{ t, drop: { from: [x, y, z], v0: [vx, vy, vz], ground: 0, hide: true } }`. Always give `from`.
- A prop that hides itself: hide an inner group (the stage sets the prop's own `visible` every frame).
- Hiding a prop inside a shot, or making it appear in a hand inside a shot, stops the film: do it on a cut, or with `stow: true` /
  `fetch: true` on the key.

## Shots in short (camera.md has the rest)
`move`: `park { pos, target, fov }`, `push { from, to, t0, t1, ease }`, `orbit { who, az0, az1, el, dist, height, fov }`,
`follow { who, camOffset, look, parkAt }`, `path { keys: [{ t, pos, target, fov, roll, shake, walk, stop }] }`. Any camera takes
`roll` (degrees, or `[r0, r1]`). `pos` / `target` on a path key also take `{ who, offset }`, `{ whos: [a, b], offset }`,
`{ object: 'name', offset }` (a set object by `.name` or `set.points`) and `{ prop: 'id', offset }`.
A shot's `focus` names what depth of field keeps sharp (a character or prop id). `seam: true` = a hidden cut (judged by the guard);
`hard: true` = a real cut the guard should not judge.

## PROP GUARD
Run `film_probe` to get its verdict (it also prints the framing of every shot). Each frame it asks how far each prop moved as this frame's camera
sees it. Over 40 px is reported; a move fails the film when it is a real jump (much bigger than its neighbours). Allowed: an impact
(a clip with a hit frame, like `knock`; a clip entry `snap: 6` or `[6, 14]`; a prop key `snap: true`), a placement key's travel,
anything across a hard cut. Camera flights do not count.

## Grade
With the post pipeline on (post.md), the grade is part of the post settings per place and the page draws it, so the preview shows it.
Without it, a top-level `grade: { vignette, places: [{ name, windows, gamma, contrast, saturation, gr, gg, gb }] }` is the film's one
grade. Never both.

## Tool details
- `check_preview`: run after every edit of film.js, set.js, props or settings. A film error names the key path, for example
  `"line:9.end" at shots[3].camera.parkAt: no line 9`.
- `render_frames`: frames at given times, full size. Use them for faces, contact, framing, a set detail.
- `film_sheet`: every 3rd frame tiled with frame numbers, a yellow bar on each shot's first tile. `strip` = a range at full frame
  rate (check every fast move: a camera can pass through a head between sampled frames). `from` / `to` for a range.
- `film_probe`: the resolved film (`.suite/resolved.json`), one line per shot (times, camera move, the words in it), the cast, lines
  and words, and the PROP GUARD verdict over every frame. Run it after every change to props, hands or shots.
- `film_check { kind }`: numbers, no pictures. `same` (characters, props, shots and voice against the start of this step), `calm`
  (light jumps while the camera is still, `still: 'A-B'`), `flicker` (brightness jumps off the cuts), `shade_jumps` (the shading
  formula per face per frame). Faces, feet and hands have no number: look. See review.md.
- Hot reload: the preview reloads on any change under `scenes/` or `assets/`. A page loads textures once at its start: render
  only after the asset folders have gone quiet.
