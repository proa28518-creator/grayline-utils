# Add post processing

The goal, his words: "it figures out the best things for that specific scene". Watch this film's scenes, work out what post
processing makes each one look its best, add it. Nothing is a fixed recipe: haze, fog and floating dust were right for a backrooms
hallway; another scene may want rain, snow, embers, sea spray, heat shimmer, god rays, or almost nothing.

## What must hold
- Characters stay sharp, untouched, and the first thing you see.
- It works on any set. It never changes geometry, textures, acting, shots or sound.
- Pure in t: positions from a seed and t, never accumulated.
- Light on the live preview (`quality: 'auto'` does it: full at 1200 px on the long side, a lighter setting below).

## The pipeline (`world/look/post.js`, knows no set)
The set hands back `look: createPost(THREE, rig, opts.post)` (sets.md), so post needs your `scenes/set.js` with a light rig. If the film
still uses a kit set, wrap it in a set.js first (`kit('park', opts)` + a rig with one place for it). Put the settings in `scenes/post.js`
and pass them as `world.setOpts.post`. One frame: world (no characters) -> air -> haze -> depth of field -> bloom -> screen ->
characters on top, untouched -> particles -> grade.
```js
export const makePost = A => ({
  quality: 'auto', maxBlur: 26, blend: .14,
  zones: { room: [0, 0], deck: [400, 0] },               // where each place stands (its rig place has the same name)
  states: [{ from: A.calm, zone: 'deck', use: 'dawn' }],  // from a time on, a zone wears another place's settings
  moves: [2.9, [30.8, .06]],                              // camera flights: settings cross-fade there; any other change of place is a cut
  focus: [[0, 2.15, 'kid']],                              // where the story looks, when the automatic pick is not it
  places: { room: {
    air: { density: .03, start: [.4, 6], far: 40, color: [.011, .0085, .0055], lights: .28, g: .22, keys: [[0, .8], [29, 1.35]] },
    dof: { aperture: 30, nearK: .55, dead: .4 }, bloom: { k: .3, thr: .75 },
    grade: { gamma: .84, contrast: 1.12, saturation: 1, gr: .98, gb: 1.05, vignette: Math.PI / 4.6 },
    particles: [ { mode: 'box', count: 1300, box: [15, 6.4, 24], vel: [.03, -.012, .02], size: .0052, color: [1, .9, .74], lit: 1.9 },
                 { mode: 'burst', t0: A.jolt, life: 1.5, count: 420, at: [0, 5.1, 3], spread: [11, .6, 15], gravity: -4.2 } ] } } });
```
Read the header of `world/look/post.js` and `particles.js` for every option (air `heightK`, `noise`, `shafts` for god rays, `warp` for
water, particle `shutter`, `nearFade`, `sway` ...).

## What gave the biggest gains
1. **Depth of field with sharp characters on top:** the set blurs by true depth, the characters never enter the filter. This is what
   makes flat characters stand in a real place. `focus` keys where the story looks.
2. **Haze with distance:** far things melt away, depth reads at a glance. Key haze per shot: the story's subject wins over the effect.
3. **Light hanging in the air** near lamps; bloom on bright sources.
4. **Particles** that suit the place, and bursts on hits (tune a burst one frame after the hit).
5. **The grade** ties characters to the set.

## Lessons
- Compare sheets catch what single frames hide: a lovely milky water lost the main subject entirely. Judge on a `film_sheet`.
- Reuse what worked, then tune: proven settings got a new room to the bar on the first render.
- Particles are quads and capsules, not points. Keep a streak's width out of the blur size or sleet turns to confetti. Bubbles
  have no shutter. Near the lens they read as rings: fade them near.
- A sun in haze: phase `g` about .55, not .72, or a dawn goes white.
- Spray or dust must sit between the camera and what it should cover; the depth test keeps it off faces behind it.
- Grain makes files huge: leave it out unless the film asks.

## Check
`render_frames` with and without each effect on the same frames, then the whole film on a `film_sheet`. Faces first, every time.
Numbers next to the eyes: `film_check { kind: 'flicker' }` (brightness jumps off the cuts: look at each one it lists), `{ kind: 'same' }`
(characters, props and shots unchanged). Faces still readable: `render_frames` on them, with and without the effect. The full S-4 post settings (when the project has them): `examples/s4_shade/post.mjs`; the bar's numbers are always in `references/quality-bar.md`.
