---
name: cartoon-shorts
description: Make a 3D cartoon film (9:16 1080x1920, or wide 16:9 1920x1080) in a Creatorize "3D Cartoon Shorts (New)" project from the member's voice - living 2.5D cartoon characters (round white heads, ink outlines, faces that snap) acting every line on the words, a camera that moves with intent, a set with real detail, post processing and character shading. Five passes, one button each (Build, Camera angles, Environment overhaul, Add post processing, Shading pass), each run from steps/<id>.md, each judged by a fresh critic against the bar. Covers the film bible for any topic, scenes/film.js, characters and casting, acting, the five camera instruction sets, sets, the environment crew (Blender, Google Flow textures, sprites, live light), post, shading, review by sheets and consecutive frames, the critic loop, and what to do when a tool fails.
---

# 3D Cartoon Shorts (New)

## Your role
You are the lead on one film. You build the pass you were started for, you run its checks, you run its critics, and you never
grade your own work: your own checks pass things a fresh critic rejects at first look. The order of importance, the owner's words:
characters first ("they are what makes the whole thing feel alive"), then the camera, the set, the post, the light.

## The bar
A stranger watching it on a phone would not guess a tool made it. The films that set it: S-4 (a sunken submarine, "borderline
insane"), the backrooms film (a yellow office maze, "Flawless, this is perfect") and The Town Built Around a Button (a bright
storybook town by day and night). S-4's and the backrooms film's full-size stills are in `references/bar/` (open the jpg files)
with captions; the Town's frames are on the guide pages and their bar tiles (below). `references/quality-bar.md` says what each
frame does right and the numbers per kind of place.
**The visual guide pages:** your quality standard is the guide pack in `references/guide/`. Read the pages for the stage you are
in before you start it, and check your frames against them before you finish it. Their "yes" frames are the bar pictures the
critics compare with; `references/guide/INDEX.md` names the page and the bar tiles of every stage. Pages 01 (the bar on one page)
and 10 (never, and honesty) are for every pass; each step file names its own pages.
The bar is the LOOK, never the subject: a film about a diner, a lighthouse or a hospital reaches the same depth, light, air and
acting with its own places (`references/topics.md`).

## Quality first
Quality is the only goal, whatever model or effort runs you. No step of this skill has a clock: a pass is done when its exit
list is true AND a fresh critic says YES. Never cut a beat, a character, a set piece or an effect to finish; never turn an
effect down until it is gone to make a problem disappear. Only the app's FASTER BUILDS block (at the end of the request, when
the member turned it on) speaks about time: then follow it.

## Every film is made new
The examples teach the method and set the bar; they are not material. Never copy an example's film, acting table, shots,
camera or set, even when this voice is the same as an example's. The examples' named sets (`s4`, `s4_env`, `backrooms`,
`backrooms2`) are not in a member's project. Everything is data a page renders at time t: you write files, the app previews,
renders and exports.

**The frame:** the project's format decides: Vertical 9:16 (1080x1920, what the references assume) or Wide 16:9 (1920x1080).
A wide project: read `references/wide.md` first, its numbers replace the tall ones.

## The project
| path | what |
|---|---|
| `scenes/BIBLE.md` | the film bible (Build writes it first): lines, beats, places with sizes in D, cast, story props, the colour script. `references/topics.md` |
| `scenes/film.js` | THE film: `export default { ... }` (cast, voice lines, acts, props, shots, captions, world). `references/film.md` |
| `scenes/set.js` | the film's own set (`world: { set: 'own' }`): `export async function buildSet(THREE, scene, opts, kit)`. `references/sets.md` |
| `scenes/props/<kind>.js`, `scenes/cast/<id>.json` | the film's own props and characters |
| `scenes/post.js`, `scenes/shade.js` | post and shading settings as data, imported by film.js |
| `assets/set/` | Blender output: `<place>.glb`, `kit.glb`, `scatter.json` (from `blender/build_set.py`) |
| `assets/tex/` | textures `*.jpg`, `decals.png`, `tex.json`, `recipes.json`, raw pictures in `raw/`, sprites in `sprites/` |
| `audio/clean.wav`, `audio/clean.json` | the voice, trimmed, and its word times. Made by the app: never edit |
| `lessons/<step>.md` | what each pass learned, ending with its HANDOVER block (read it first when any pass runs) |
| `.suite/critic/` | the critic rounds: the pictures each critic saw and its reports |
| `.claude/skills/cartoon-shorts/references/guide/` | the visual guide pack (pages as jpg, `INDEX.md`, the bar tiles): read-only, part of this skill |
| `engine.js`, `engine/`, `vendor/`, `specs/`, `src/`, `tracks/`, `world/`, `lib/` | the engine copy: read it, import from it, NEVER edit it |

## The stages (five buttons; each runs one step file, stands alone and keeps what the others made)
| stage | step file | its job | exit (the full list is in the step file) |
|---|---|---|---|
| Build | `steps/build.md` | the film bible, cast, acting on every word, a lit set with depth, a first camera | frame 0 an expressive face, every word in a line, PROP GUARD passes, critic YES |
| Camera angles | `steps/camera.md` | the same acting under a new camera from an instruction set | every fast move clean on a full-rate strip, `film_check same` passes, critic YES |
| Environment overhaul | `steps/environment.md` | a real set from a crew of three (Blender, pictures, integration) | the set bar passes, depth behind every face, critic YES |
| Add post processing | `steps/post.md` | per place: haze, depth of field, particles, bloom, a grade and vignette | numbers per place class, faces the sharpest thing, set bar still passes, critic YES |
| Shading pass | `steps/shading.md` | characters and props lit by the place: key and shadow as two colours, no flicker | `shade_jumps` / `calm` looked at, set bar still passes, critic YES |
"End to end" = the five in that order, with the director's whole-film review between them (Berserk, or the member).

## How every pass runs (the loop)
1. **Read:** the step file, the references it names, `lessons/*.md` (every earlier pass's HANDOVER), the bar stills, the guide
   pages for this pass (`references/guide/`: 01, 10 and the pages the step file names).
2. **Before:** `render_frames` at `scale: 1` on 4-6 key times and a whole-film `film_sheet`. Write the gap list: what the bar
   has that these frames lack, worst first.
3. **Work:** change something real, `check_preview`, LOOK (`film_sheet`, `strip` on fast moves, `render_frames` on faces). Fix
   the worst thing radically, at its cause. Again.
4. **Machine checks** of the pass (its step file): every FAIL fixed at its cause. Numbers point, eyes decide.
5. **Critic rounds** (`references/critic.md`): a fresh critic sees your frames shuffled with bar frames and answers in a fixed
   form; you fix the single biggest gap it names; a NEW critic verifies. Repeat until the exit list is true and a critic says
   YES with no blocking fault.
6. **Handover:** `lessons/<step>.md` as you go, ending with the HANDOVER block (`references/review.md`).
Helpers you start get the same standard: `references/critic.md` "Helper contract".

## Hard rules
- **Made new from this voice:** cast, acting, shots, camera and set are written for this film. Nothing taken over from an example.
- **Open on a character's face**, scared or expressive, in the first frame. Never an empty scene, never a back.
- **Pure in t:** every frame is a function of t alone. No `Math.random` (a seeded generator), no `Date`, no state between frames.
- **Never edit the engine copy** (`engine/`, `world/`, `lib/`, `specs/` ...). New looks, sets, props and characters go in `scenes/`.
  If something truly needs an engine change, work around it and write it in your lessons as a gap.
- **Never touch `audio/`.** Voice lines are written as heard.
- **Anything in a place is in every shot of it.** Nothing thin ending at a head. Faces read: within about 60 degrees of the camera, big, never cut by the edge.
- **PROP GUARD:** a prop that jumps on screen fails the film. `pick_up`, `put_down`, hand-overs, place changes on cuts, `snap` on real hits.
- **The set bar** (`film_check { kind: 'set' }`, measured by the app): a shot needs 22 %+ detailed set and at most 80 % flat; the
  film needs a median shot of 28 %+ detail and at most 78 % flat, with no more than 40 % of its shots under. Environment, Post and
  Shading cannot finish below it, and the app's export calls a film below it unfinished.
- **Later passes never change what earlier passes made** unless that is their job: the drawings, the acting, the voice, the shots.
- Stay inside the project. Pictures only through `make_picture` (the member's own setup); never a paid service they did not choose.

## Tools
`check_preview`, `render_frames` (files in `.suite/frames/<batch>/`), `film_sheet { from?, to?, every?, strip?: 'A-B', cuts? }`
(files in `.suite/review/`), `film_probe {}`, `film_check { kind: set|same|calm|flicker|shade_jumps, from?, to?, still?: 'A-B,C-D',
reset? }`, `list_shots`, `narration`, `blender_run { script, args?, timeout_s? }`, `make_picture { prompt, aspect, out, refs? }`,
`tex_job { kind: tiles|decals|sprites|check|sheet, names? }`, `prop_library { search|look|use|stats }`.
Every failure starts `TOOL PROBLEM [<code>]`: `references/tools-sop.md` says what each code means and what to do.
In Bash: `$CZ_PYTHON`, `$CZ_FFMPEG`, `$CZ_FFPROBE`, `$CZ_BLENDER`, `$CZ_NODE`. When one fails: `references/tools-sop.md` (fix or
fetch, retry, never give up on something fixable).

## References (read what the pass needs)
- `references/topics.md`: any script into a film at the bar: the film bible, places in D, numbers per kind of place, worked mini-examples.
- `references/critic.md`: the critic loop, the critic's brief and fixed answer, the helper contract.
- `references/quality-bar.md` + `references/bar/`: what the bar looks like, full-size stills with captions, numbers per kind of place. Every pass.
- `references/guide/` + its `INDEX.md`: the visual guide pages (no / yes frames and the rules per part of production) and the bar
  tiles the critics use. Every pass: 01 and 10, plus the pages of its step file.
- `references/film.md`: the film format, times tied to words, props, PROP GUARD, the tools in detail. Deep: `references/api/FILM_API.md`.
- `references/characters.md`: casting a new voice, specs from a sentence, faces, acting per line, the motion laws, staging for faces.
- `references/camera.md`: the grammar, framing numbers, the `path` camera, seams between places, review on strips.
- `references/cameras/`: the five instruction sets: `dread_cuts.md`, `one_take.md`, `found_footage.md`, `the_watcher.md`, `through_the_steel.md`.
- `references/sets.md`: `scenes/set.js`, kit sets, many places, lights as data, surfaces.
- `references/environment.md`: the crew, the contract, Blender, Flow pictures, textures, sprites, integration.
- `references/post.md`, `references/shading.md`: the two look passes.
- `references/voice-sound.md`: the app's voice and words, lines as heard, the app's sound design.
- `references/review.md`: sheets, strips, consecutive frames, checks, the lessons file and its HANDOVER block.
- `references/pitfalls.md`: every lesson that cost a re-render. Read it once per pass.
- `references/tools-sop.md`: what each tool failure means and how to fix it.
- When the project has them: `references/examples/*.md` (the bar films pass by pass with the key code, to learn how) and the
  full example files `examples/s4_shade/`, `examples/backrooms_shaded_one_take/` (to learn from, never to copy). Some projects
  leave one out; work from what is there. `examples/cameras/` is always there.
  Tools and Blender templates: `tools/`. Deep engine docs: `references/api/` (MOTION, FACE, BODY, WARDROBE, WORLD).
