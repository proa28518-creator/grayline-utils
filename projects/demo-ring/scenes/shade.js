// scenes/shade.js — "The Ring That Rolled Away" Shading pass (Foundation Run
// 13, Stage 2), per references/shading.md: settings for
// world/look/rigshade.js, passed as world.setOpts.post.shade. One place,
// 'street', one day look.
// The scene's own two colours, as shading.md prescribes: a WARM KEY from the
// day sun's side (the rig's sun, behind-left and high, steers the key
// wherever he runs) and a COOL SKY SHADOW from the far side (the `cold`
// extra sun from the front-right). The floor and keyMin are set with the
// post grade after them in mind (gamma 1.10 / saturation 1.28): faces sit
// well above mud on both sides in daylight — the shadow side floors at a
// bright cool [.50, .52, .58], the lit side never under [.80, .80, .78].
// NO FLICKER, by construction: the rig's lights are constant (no drivers,
// no states), so there is nothing for a level to jump with; these settings
// add no keys, no moods and no states. The only hard changes allowed are
// the shot cuts themselves: `steps` = every shot start (A.cuts, the shot
// starts from the film), so the smoothing windows never read across a cut,
// and inside a shot everything is smooth — including the L4-L7 sprint and
// the L10 dive.
// The ring keeps only a sharp highlight (metal.spec modest): shading.md
// "Rings and flashes are light: never shade them" — the gold torus keeps
// its own flat gold, the rig adds at most a glint.
export const makeShade = A => ({
  zones: { street: [0, 0] },
  steps: A.cuts,
  places: {
    street: {
      exposure: 1.0, sat: 0.98,
      keyTint: [1.0, 0.95, 0.85],               // the day sun's warmth on the lit side
      fillTint: [0.85, 0.92, 1.1],             // the fill cools toward sky blue
      hard: 0.45, rim: 0.4, rimFill: 0.35,
      low: 0.55, chest: 0.3, front: -0.2,
      floor: [0.5, 0.52, 0.58], keyMin: [0.8, 0.8, 0.78],
      extra: [
        // cool sky light from the far (front-right) side: the shadow side's
        // colour, constant all film, so the street gets cooler by itself
        // away from the sun.
        { id: 'cold', kind: 'sun', dir: [0.85, 0.3, 0.45], color: [0.3, 0.44, 0.75], power: 0.25 },
      ],
      aerial: { color: [0.08, 0.1, 0.14], density: 0.005, max: 0.12 },
      metal: { spec: 0.5, env: 0.25, keep: 0.6 },
    },
  },
});
