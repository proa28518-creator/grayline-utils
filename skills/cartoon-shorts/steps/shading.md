# Step: Shading pass

**Goal:** character and prop specific shading, his words: "to make lighting more cinematic/dramatic/cleaner, whatever the given scene
wants." Make the characters and props feel lit by this scene instead of pasted over it, place by place. No flicker, ever.

**Inputs:** the film with its set and post, `scenes/BIBLE.md` (the places and their light), `scenes/post.js` (the zones and light
states the shading reads), every earlier pass's HANDOVER in `lessons/`.

**The bar:** `references/quality-bar.md` and the stills in `references/bar/` (open them first; the faces are what to study): a warm
or cold key from the side the lamp or sun is on, a darker shadow side in its own colour, a thin edge of light against a dark
background, light shaped by the set falling across faces, a face that still reads in the dark. Biggest gain: key and shadow as two
colours on the faces. A flat white or flat grey face is below the bar. **The guide pages** (`references/guide/`): 01 the bar,
08 shading, 09 verify, 10 never. Read them before you start and check your frames against them before you finish. When the project
has `examples/s4_shade/shade.mjs`, it has a full worked file.

**Wide project (16:9):** read `references/wide.md` first. The method is the same; characters often stand at the sides now, so check faces at the frame edges too.

## Read first
`SKILL.md` (the loop and the hard rules), `references/quality-bar.md` + the stills, `references/critic.md`, `references/shading.md` (all), the Shading part of
`references/pitfalls.md`, `lessons/*.md` (every HANDOVER).

## What must hold
Still our characters: every ink line, colour and expression stays theirs; shading works only on top. Faces stay the first thing you see.
Acting, shots, set and post do not change. **No flicker:** he caught shades "flickering too much, like if it's clipping". Pure in t,
light on the live preview. Shading needs the post pipeline (post.md); if the film has none yet, add a minimal one first.

## Method
1. **Before:** `render_frames` at `scale: 1` on faces in every place (and a backlit or moving-light moment), a whole-film
   `film_sheet`. Put the faces next to the bar stills. Per place, write what the light wants (warm key from the lamp side, cold
   shadow, a rim against the dark, a hard top light for a tense beat ...).
2. Write `scenes/shade.js` (`makeShade`) with settings per place and per light state (the same zone and state names as
   `scenes/post.js`), pass it as `world.setOpts.post.shade`, hook `createRigShade` in `scenes/set.js`. Put `steps` on hard light
   changes; ease moods in and out on a camera with no cuts. A floor per place keeps faces out of the mud; a backlit face is all
   shadow side, so the shadow colour carries the warmth.
3. **Review loop:** `check_preview` -> `film_check { kind: 'shade_jumps' }` and `{ kind: 'calm' }` -> consecutive frames at full size
   (`film_sheet { strip }`) on every move and light change they name -> `render_frames` at `scale: 1` on faces next to the bar
   stills -> a whole-film `film_sheet` -> fix the worst -> again. Judge in motion: stills mislead. Before fixing something odd,
   check the earlier pass (a "shading bug" was once drawn hair).
4. `film_check { kind: 'same' }` (characters, props and shots unchanged) and `film_check { kind: 'set' }`.
5. **Critic rounds** (`references/critic.md`; faces of every place in the picture set; do-not-fault: the set's geometry, the camera,
   the acting) until the exit list is true and a critic says YES.
6. Write `lessons/shading.md`, ending with its HANDOVER.

## Machine checks
`check_preview`, `film_check { kind: 'shade_jumps' }` (over .05 is visible), `film_check { kind: 'calm' }` (over 4 levels fails),
`film_check { kind: 'same' }`, `film_check { kind: 'set' }`.

## Exit (every line true)
- Next to the bar stills at full size, faces and props look lit by their place: each place has its own key and shadow colour, the
  key comes from where the set's light is, faces never go to mud and never stay flat white.
- Every `shade_jumps` row over .05 and every `calm` jump looked at on a strip and accepted or fixed; strips show no flicker.
- `film_check same` passes, the set bar still passes, `check_preview` clean.
- A critic answered YES with no BLOCKING fault. `lessons/shading.md` ends with its HANDOVER.

## Never
Redrawing a character's lines or colours; a flat white or flat grey face left as it is; a light change inside a shot with no step
or ease.

## Report
What each place got, in a line each, and what is still below the bar.
