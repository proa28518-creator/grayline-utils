# Step: Environment overhaul

**Goal:** the same film "but a more detailed environment": real modelling where the eye goes, organic dirt and detail, textures from
the member's own picture setup, painted sprites, cinematic live light, and DEPTH: every shot shows a space that goes on behind the
characters. Blender builds the set once, three.js lights and renders it live. The characters stay the same drawings and the first
thing you see; the preview stays smooth.

**Inputs:** the built film, `scenes/BIBLE.md` (the places: the real thing, sizes, far ends, practicals, colour moods), every earlier
pass's HANDOVER in `lessons/`, the set bar numbers Build measured, the tool check's PROPS line.

**The bar:** `references/quality-bar.md` and the stills in `references/bar/` (open them before you start and again at the end). The
owner called the jump from a previz to this "HUGE IMPROVEMENT": aim for that jump, not for "a bit more detail". **The guide pages**
(`references/guide/`): 01 the bar, 03 the set, 06 the environment pass, 09 verify, 10 never. Read them before you start and check
your frames against them before you finish; every crew track gets the same pages in its brief. When the project has
`references/examples/`, the environment sections of the example films show how.

**Wide project (16:9):** read `references/wide.md` first. Both sides of every place are on screen, so the set needs its sides and about three times the visible surface. Say "wide film, read references/wide.md" in every agent's brief and write the 16:9 frame in the contract.

## Read first
`SKILL.md` (the loop and the hard rules), `references/quality-bar.md` + the stills in `references/bar/`, `references/critic.md`, `references/topics.md`,
`references/environment.md` (all: the crew, the contract, every track), `references/sets.md`, the Environment part of
`references/pitfalls.md`, `references/tools-sop.md` (Flow and Blender failures), `references/textures-without-flow.md` (when Flow is
not set up), `lessons/*.md` (every HANDOVER). When the project has them, the worked files (to learn the method from, never to copy):
`examples/s4_shade/set/s4_env.js`, `examples/s4_shade/blender/`, `examples/s4_shade/tex/recipes.json`.

## What must hold
Characters, acting, shots, voice and captions do not change. The layout is a contract: walls, doors, lanes and camera flight lines stay
where the cameras need them. Haze, fog, particles, depth of field and grade are NOT this step (they are Add post processing).
Pure in t. Everything falls back to the previz while files are missing, so the film always renders.

## What each place must become (write it per place in the contract)
- **Depth in every shot.** For each shot, look at what is behind the faces. Where the camera sees a flat wall close behind the
  characters, open the set THERE, behind them and in the camera's view: a doorway into a lit room, a corridor going on, a window, an
  alcove, shelves with depth, a ceiling that recedes (inside the contract: flight lines and keep-clear zones still hold; a wall a
  camera flies through stays). The background is this step's job; never hand it on as "a camera problem".
  "Calm behind the heads" means low contrast detail at a lower value, never a blank wall.
- **Modelled detail near the camera** and at the frame edges: frames, pipes, rails, furniture, ceiling grid, things hanging. Real
  geometry where the eye goes (bevels, insets, panels), the truth of the place (its era, its wear, what people left there).
- **Lights as practicals:** visible fixtures (panels, lamps, lanterns, windows) that light the set and the faces near them, pools of
  light and dark along the depth, one that fails or flickers if the story wants it.
- **Surfaces that tell a story:** flat low-contrast base textures, decals that darken (stains, rust streaks, grime, damp) gathered
  where they would gather (seams, corners, under lights, along the floor edge), clear stretches and bad stretches. Nothing repeats
  like a pattern.
- **Sprites:** cut-outs in the characters' thick ink style (clutter, tools, debris, plants, tree crowns), no people or faces. Used
  big (2-3 x), they turn a bare wall rich: ivy, moss, cracks, nests.
- **Every camera's own frame dressed:** work out where each camera looks before you dress (a camera looking up sees no town: put roofs,
  a lamp and branches in its frame).
- **The sky and the far outside**, when a place has them: a painted sky with cloud detail, a far layer (hills, a skyline) so no
  shot shows a bare gradient.

## Method (you are the lead of a crew)
1. **Before:** `film_probe` (the shots and their moves; `.suite/resolved.json` has every camera key), `render_frames` at `scale: 1` on
   4-6 key times, `film_check { kind: 'set' }`, read `scenes/set.js` and every camera key. Put the frames next to the bar stills and
   write down, per shot, what is behind the faces and what the bar has that this lacks.
2. **Contract:** write `scenes/ENV_CONTRACT.md` and `blender/keep_clear.json` (environment.md "The contract must fix"), starting from
   the places of `scenes/BIBLE.md`: per place what it must become (the list above, for THIS story), where the set opens up behind the
   faces, the picture priority list, and the ORDER the Blender pieces ship in (the pieces most shots see first).
3. **Crew, all three at once, in the foreground:** `env-blender` (owns `blender/`, `assets/set/`), `env-textures` (owns `assets/tex/`),
   `env-three` (owns `scenes/set.js`). Each brief follows the helper contract (`references/critic.md`): the contract, the feel in two
   sentences, the bar, what must hold, its files, its tools, its exit numbers, its report, and "write lessons into
   `lessons/environment.md` under your track's heading". env-blender ships each piece as soon as it passes its clay check, in the
   contract's order, never all at the end; env-three starts at once with the previz as a fallback and picks files up as they land;
   names stable, files written whole. One writer per file.
4. **Review** each place as its tracks land: the same frames before and after at `scale: 1` next to the bar stills, a `film_sheet`,
   the four review questions (environment.md), a critic round per place (the crew's `critic` agent, a new one every round,
   `references/critic.md`; do-not-fault: haze, depth of
   field, grade, character shading). Send each track a ranked list of what is still below the bar. Review again after their fixes:
   as many rounds as the bar needs.
5. **Final:** wait until `assets/` has gone quiet (textures still landing change the picture), then `check_preview`, a `film_sheet`
   of the whole film, strips on flights through the new geometry, `film_check { kind: 'set' }`, `film_check { kind: 'same' }`
   (characters, props and shots unchanged), `render_frames` on the faces before and after, `tex_job { kind: 'check' }`, and the
   whole-film critic rounds until YES.
6. Fold the tracks' lessons into `lessons/environment.md` and end it with the HANDOVER.

Where the props come from (new sprite pictures or the app's prop library, `prop_library`) is the PROPS line of the tool check: follow
it and pass it on to env-textures word for word (references/environment.md). A sprite sheet that fails is replaced by library props.
If Flow is not set up or a picture fails, do not stop and do not settle for plain code colours: replace it at once (`prop_library`,
`references/textures-without-flow.md`) and finish the set at the bar with what you have. The app counts every picture (from Flow,
from the ready-made props, failed) and tells the member itself, with the Flow fix.
The set is built in Blender: this step never starts without it (the app gets Blender first), so never build it some other way.

## Machine checks
`film_check { kind: 'set' }` (the app also measures it when you try to finish and sends you back with the empty shots),
`blender_run` check (keep-clear zones, height limit), `tex_job { kind: 'check' }`, `film_check { kind: 'same' }`, `check_preview`.

## Exit (every line true)
- The set bar passes: every shot 22 %+ detail and at most 80 % flat; the film's median shot 28 %+ detail, at most 78 % flat; no
  more than 40 % of shots under.
- Next to the bar stills at full size, the set reads rich, deep and lived in: space behind the faces in 3 of every 4 shots or more,
  modelled detail near the camera, practicals lighting the set, a dressed frame for every camera. The faces are still the first
  thing you see.
- `blender_run` check passes, `tex_job check` passes, every tiling texture looked at in a 3 x 3 repeat.
- Nothing repeats like a pattern, nothing thin ends at a head, no camera flight hits new geometry.
- `film_check same` passes, `check_preview` clean, the preview still plays smoothly.
- A critic answered YES with no BLOCKING fault on every place and on the whole film. `lessons/environment.md` ends with its HANDOVER.

## Never
A bare or previz place left in the film; plain code colours where a picture failed (replace it with props and code textures);
geometry in a keep-clear zone; a change to characters, acting, shots or voice.

## Report
What was built and what is still below the bar (the app adds where the pictures came from).
