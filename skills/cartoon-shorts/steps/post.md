# Step: Add post processing

**Goal:** watch this film's places, work out what post processing makes each one look its best, and add it. Nothing is a fixed
recipe: haze and floating dust suited a backrooms hallway; a bright town wanted pollen by day, fireflies and snow at night and gold
dust on the walk home; another place may want rain, snow, embers, sea spray, god rays, heat shimmer. Characters stay sharp, untouched
and the first thing you see.

**Inputs:** the film with its set, `scenes/BIBLE.md` (the colour script: a look per place and light state), every earlier pass's
HANDOVER in `lessons/`.

**The bar:** `references/quality-bar.md` and the stills in `references/bar/` (open them first): haze that grows with distance so the
far end fades, light hanging in the air near lamps, depth of field with sharp characters on top and soft lights behind, particles
that suit the place and are clearly seen, bloom on the practicals, and a grade per place strong enough that you know where you are
from the colour alone, with a vignette. The numbers per kind of place are in quality-bar.md: start from the row that matches each
place. **The guide pages** (`references/guide/`): 01 the bar, 07 post and the grade, 09 verify, 10 never. Read them before you start
and check your frames against them before you finish. When the project has `examples/s4_shade/post.mjs`, it has a full worked file.

**Wide project (16:9):** read `references/wide.md` first. Check that particles and dust reach the sides of the frame, and judge the vignette on the far left and right.

## Read first
`SKILL.md` (the loop and the hard rules), `references/quality-bar.md` + the stills, `references/critic.md`, `references/post.md` (all), `references/sets.md` (the set module,
lights as data), the Post part of `references/pitfalls.md`, `lessons/*.md` (every HANDOVER).

## What must hold

## Runner-owned prop and probe contract
Write `props.json` as `{ "props": [{ "name": "…", "appearsAt": 0.1, "cropBox": { "x": 0, "y": 0, "w": 0.1, "h": 0.1 } }], "setDressing": ["…"] }`. Keep key props separate from set dressing. Seed `setDressing` with visible architectural basics and set pieces that actually occur (for example wall, floor, ceiling, counter, table); do not allow absent objects. If this pass changes camera/framing, re-aim every prop cropBox against the CURRENT probe composition. The program renders probes under `out/passes/post/probe-*.png`; inspect prior-round files when available. Never run `heart still`, start a local server, or invoke a command that starts a server. The pass runner owns still rendering; this builder seat cannot bind local ports.
It works on any set and never changes geometry, textures, acting, shots or sound. Pure in t (particles from a seed and t). Light on
the live preview (`quality: 'auto'`). Post needs `scenes/set.js` with a light rig: if the film still uses a kit set, wrap it in a
set.js first (post.md).

## Method
1. **Before:** `render_frames` at `scale: 1` on one or two key times per place (one on a hit) and a `film_sheet`. Put them next to
   the bar stills. Write down per place what it wants (the air, the particles, the colour mood of the bible, where the light hangs)
   and what the bar has that it lacks.
2. Write `scenes/post.js` (`makePost`) with settings PER PLACE (and per light state in a place), pass it as `world.setOpts.post`, hook
   `createPost` in `scenes/set.js`. Start from the place's row in quality-bar.md, then tune by eye.
3. **Review loop:** `check_preview` -> `render_frames` at `scale: 1` with and without each effect on the same frames -> next to the
   bar stills -> a whole-film `film_sheet` -> `render_frames` on the faces and `film_check { kind: 'flicker' }` -> fix the worst
   thing -> again. Judge on the sheet: a lovely effect that loses the subject is a step back, and so is an effect turned down until
   it is gone. When an effect causes a problem, fix the cause (limit it by height, distance, place or time; keep it off faces; move it)
   and keep the effect. Tune bursts one frame after the hit.
4. `film_check { kind: 'same' }` (characters, props and shots unchanged) and `film_check { kind: 'set' }` (haze must not wash the
   set below the bar).
5. **Critic rounds** (`references/critic.md`; one picture per place at least; do-not-fault: the set's geometry, the acting, the
   camera) until the exit list is true and a critic says YES.
6. Write `lessons/post.md`, ending with its HANDOVER.

## Machine checks
`check_preview`, `film_check { kind: 'flicker' }`, `film_check { kind: 'same' }`, `film_check { kind: 'set' }` (the app also measures
it when you try to finish).

## Exit (every line true)
- Each place has its own considered look (one look for the whole film only if it truly is one place and one moment), near its row
  in quality-bar.md, and next to the bar stills at full size: haze visible in the distance, depth of field behind the faces,
  particles you can see, bloom on the lights, a colour mood you notice, a vignette.
- The subject is always the sharpest, clearest thing; faces readable in every shot (looked at with `render_frames`).
- Every frame `film_check flicker` lists looked at in a strip (a flash the film means is fine, one the effect made is not).
- `film_check same` passes, the set bar still passes, the preview still smooth.
- A critic answered YES with no BLOCKING fault. `lessons/post.md` ends with its HANDOVER.

## Never
The dark-interior numbers on a bright exterior (they make a grey-white veil); haze `far` past the sky's distance (the sky goes
white); depth of field on the subject or the story prop; an effect turned off to make a problem go away.

## Report
What each place got and why, in a line each, and what is still below the bar.
