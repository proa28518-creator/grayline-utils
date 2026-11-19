# Shading pass

The goal, his words: "character and prop specific shading. To make lighting more cinematic/dramatic/cleaner whatever the given scene
wants." Make the characters and props feel lit by this scene instead of pasted over it. Work out what each scene wants (dramatic, soft,
clean, a hard top light for a tense beat) and shade for that. Judge in motion: stills mislead.

## What must hold
- Still our characters: every ink line, colour and expression stays theirs. Shading works only on top of what they draw.
- Faces stay the first thing you see, expressions readable.
- Acting and timelines never change.
- **No flicker.** He caught shades "flickering too much, like if it's clipping". Shading moves smoothly inside a shot. Look at
  consecutive frames at full size (`film_sheet` strips) on every move and every light change.
- Pure in t, and light on the live preview.

## The tool (`world/look/rigshade.js`, knows no set)
Needs the post pipeline (post.md): `look.shading = createRigShade(THREE, rig, opts.post.shade)` in set.js, settings in `scenes/shade.js`
passed as `world.setOpts.post.shade`. It reads the set's lights as data (`rig.sample(place, t)`). The characters are 2.5D, so form comes
from the drawing: the head shaded as a sphere over the head disc, the body as a cylinder, a clean drawn shadow shape, a thin edge of
light, darker legs, the head's shadow on the chest.
```js
export const makeShade = A => ({
  zones: { room: [0, 0], deck: [400, 0] }, states: [{ from: A.calm, zone: 'deck', use: 'dawn' }],
  steps: [A.calm],                                  // hard changes of light (on cuts): the smoothing never reads across them
  places: {
    room: { exposure: .95, sat: .95, keyTint: [1, .93, .8], hard: .62, rim: .75, low: .46, floor: [.24, .27, .35], keyMin: [.64, .6, .56],
            extra: [{ id: 'cold', kind: 'sun', dir: [-.9, .2, .42], color: [.3, .44, .72], power: .3 }],
            metal: { spec: 1.2, env: .3, keep: .62 } },
    deck: { exposure: 2, sat: .75, hard: .32, rim: .4, low: .66, floor: [.76, .8, .86], keyMin: [.94, .96, .98] } } });
```
Read the header of `world/look/rigshade.js` for every option.

## What makes it work
- **Key and shadow as two colours** per place is most of the pass: a warm key from the lamp's side, a cold shadow from the far side.
  A constant cold light means the room gets colder by itself as the lamp dies.
- **A floor per place** (`floor`, `keyMin`) stops faces going to mud; set it with the grade after it in mind.
- A dying light loses its colour; it does not stay orange. Metal keeps its own colour: desaturate the light on it (`metal.keep`).
- Backlit = the face is all shadow side, so the shadow side carries the warmth.
- Hats shade with the head, no rim. Rings and flashes are light: never shade them. Cap the fill under the key, or the drawn shadow turns inside out.
- Props keep only a sharp highlight (a flat disc facing the camera sits in the broad highlight and looks like a lollipop).

## Flicker, and how it was fixed
A flickering light steered the shadow's direction, so hard edges flipped at its rhythm, and characters crossing between lit regions
switched light in one frame. The fix, built in: direction ignores flicker, regions blend over distance, the light is read over a window
around t along the character's own timeline, flicker reaches only the level, softly. Your part: put `steps` on hard light changes,
ease moods in and out on a camera with no cuts, and check strips.

## Check
`film_check { kind: 'shade_jumps' }` (the shader's own numbers at face, forehead, chin, cheek, chest per frame: the biggest jump per shot
and character, no pictures), `{ kind: 'calm', still: 'A-B' }` (light jumps while the camera is still, in the frame ranges you give), `{ kind: 'same' }`
(drawings, acting, props and shots unchanged). Then consecutive frames at full size on the worst places it names: a flicker only shows in motion. When the project has them, the full S-4 settings:
`examples/s4_shade/shade.mjs`; backrooms moods per scene: `examples/backrooms_shaded_one_take/film.json` (`setOpts.look.shade`).

## Before fixing something odd
Check the earlier pass: a "shading bug" on one character was his drawn hair. A full render is short, so review the whole film per round
on a `film_sheet` rather than picking frames.
