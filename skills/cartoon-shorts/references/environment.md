# Environment overhaul: a crew of three

The goal, his words: the same short "but a more detailed environment": real modelling where the eye goes, organic dirt and detail,
cinematic light. The bar: the set looks rich, deep and lived in, while the characters stay the same drawings and the first thing you see.
What the bar looks like: `references/quality-bar.md`, the stills in `references/bar/` and the guide pages 01, 03, 06, 09 and 10
in `references/guide/` (open them; every track gets them in its brief). When the project has them, the
bar films pass by pass: `references/examples/s4.md` pass 3 (a submarine, a deck, the sea) and `references/examples/backrooms.md`
(detail + sprites passes); the worked files named below are in `examples/` only then. No Flow: `references/textures-without-flow.md`.

## The architecture (do not change it)
- **Blender builds the set once**, from a script, in the app's hidden Blender (`blender_run`). The result is data files in `assets/set/`.
- **Pictures come from the member's own picture setup** (`make_picture`, Google Flow by default), unless a pattern is better in code.
  Never a paid image service unless the member chose one in Settings.
- **Three.js does all light and all rendering, live.** No Cycles, no baked light. Performance comes first: the preview must stay usable.
- **The environment never touches characters, acting, shots, voice or captions.** Haze, fog, particles, depth of field and grade are
  the post pass, not this one.

## The order
1. **Contract** (you, the lead): write `scenes/ENV_CONTRACT.md` (below) from the places of `scenes/BIBLE.md`. Every track works from it.
2. **Three tracks at once, one agent each, one writer per file** (the app runs this step as a crew: `env-blender`, `env-textures`,
   `env-three`; brief each short and goal-led by the helper contract of `references/critic.md`: the contract, the feel, the bar, what
   must hold, its files, its tools, its exit numbers, its report; agents run in the foreground):
   | agent | owns (only these) | makes |
   |---|---|---|
   | env-blender | `blender/build_set.py`, `blender/check_set.py`, `blender/keep_clear.json`, `assets/set/` | `<place>.glb` per place, `kit.glb`, `scatter.json`, clay checks |
   | env-textures | `assets/tex/` (incl. `recipes.json`, `raw/`, `sprites/`) | `make_picture` raw pictures, then `tex_job` -> tiles `*.jpg`, `decals.png`, `tex.json`, `sprites/*.png` + `sprites/sprites.json` |
   | env-three | `scenes/set.js` (+ small modules it imports from `scenes/`) | loads glbs, scatter, textures, decals, sprites; lights as data; falls back to the previz until files land |
3. **Review** (you): the same frames before and after (`render_frames`), a `film_sheet`, a critic round per place (`references/critic.md`),
   send each track a short ranked list; again after their fixes, as many rounds as the bar needs.
4. **Final** (you): wait until `assets/` has gone quiet (no file newer than a minute), then `check_preview`, `film_sheet` of the whole
   film, `film_check same` (characters, props and shots unchanged) and `render_frames` on the faces.

## The contract must fix, up front
- **The layout, to the coordinate,** per place: walls, floors, ceilings, doors. Cameras and walks depend on it. Read the current
  `scenes/set.js` previz and every camera key in `shots` (`film_probe` writes them to `.suite/resolved.json`) before you write a number.
- **Keep-clear zones:** walking lanes, doorways, camera flight lines. Nothing tall there, nothing hanging low. Write them as
  `blender/keep_clear.json` (boxes, capsules, `hang_limit`, `heads`) so the build and the check read the same zones.
- **glbs are place-local,** in three.js axes (y up), UV 1 = 1 D. Name what moves: each moving thing is its own glb, placed inside its animated group.
- **Material names** agreed (one mesh per material name), with the texture each one gets: an unknown name means nothing to the loader.
- **Decal cell ranges** in the 6 x 6 `decals.png` (e.g. 0-11 floor dirt, 12-17 scuffs, 18-23 wall damp). Blender's scatter and the
  textures' recipes must number them the same.
- **A painted pattern's period and phase,** so modelled detail (rivets, planks, tiles) lines up with painted detail.
- **Nothing thin ending at a head.** **A frame budget** and the bar in words. **The picture priority list** (below).

## Blender (env-blender)
- Start from the template: copy `.claude/skills/cartoon-shorts/tools/blender/build_set_template.py` to `blender/build_set.py` and
  `check_set_template.py` to `blender/check_set.py`. Change only the sections marked "CHANGE THIS FOR YOUR FILM". Real examples:
  `examples/s4_shade/blender/build_s4.py`, `examples/backrooms_shaded_one_take/blender/build_backrooms2.py`.
- Run: `blender_run { script: 'blender/build_set.py' }` (the app passes `assets/set` as the first argument after `--`; extra `args`
  follow it, e.g. a place name). About 2-5 s. Then `blender_run { script: 'blender/check_set.py', args: ['--render', '2.1', '14'] }`:
  PASS/FAIL lines plus clay pictures in `.suite/clay/`. Tile them with `tex_job { kind: 'sheet' }` and look.
- One script, no hand work, same bytes each run (seeded). Export with the bundled glTF exporter to a temp name, then rename.
- Read what the camera sees first: portrait at fov 26 is a slit, so the near wall, floor and overhead ARE the set (a wide project
  also sees both sides: `wide.md`). Model those first:
  bevels, sag, seams, frames, skirting.
- Kit assets: low poly with bevels, one named root per asset at the origin, local +y out of the surface. They get instanced.
- Scatter with geometry nodes built in code; export the evaluated instances to `scatter.json` per place, never realize them.
- **Organic:** density = base x falloff from seams x falloff from hot points (corners, doorways, under stains) x large noise x medium
  noise. Clear stretches and bad stretches, clusters, never an even sprinkle.
- Decals on curves: keep them under about 1.4 D along the curve.
- Check from real shot times in clay with capsules for people: numbers cannot see "behind a face".

## Textures and pictures (env-textures)
- **The prop library** (`prop_library`): 656 ready cut-out props already in this look (thick dark ink, simple cel shading):
  foliage, trees, rocks, flowers, street, interiors, industrial, farm, sea, historic, fantasy, sci-fi, food, clutter, wall pieces
  (`kind: wall`) and hanging things (`kind: hang`). `search` by words, `look` at the candidates, `use` copies them into
  `assets/tex/sprites/` and adds them to `sprites.json` with a real-world height in D. It needs no picture service.
  **When to use it: the PROPS line of the tool check says** (the member's setting in Settings > Media > Image generation):
  - `PROPS: ... ONLY from prop_library`: every prop from the library, no sprite sheets with `make_picture` (no picture service,
    Flow signed out or resting, or the member picked "Ready-made props only"). Textures and decals as the line says.
  - `PROPS: ... prop_library first`: dress the set from the library, `make_picture` only for what it lacks (a story-specific object).
  - `PROPS: make sprites for this film as usual`: sprite sheets with `make_picture` as below; any sheet that fails
    (`picture-later`, `picture-failed`, `picture-signin`) is replaced at once by library props, never a bare set.
  Library props: several variants of each kind so nothing repeats; only props that suit the place (sprites scatter by kind: no
  street lamp in a kitchen); `tex_job sprites` keeps them in `sprites.json`. Pass the PROPS line on to env-textures.
- **No picture service set up (make_picture says `picture-none`)?** Free photos and textures drawn in code: `references/textures-without-flow.md`.
- `make_picture { prompt, aspect, out: 'assets/tex/raw/<name>.png' }` runs on the member's own setup: about **1 picture per 2 minutes**
  with misses, one at a time for the whole crew. Write a priority list and go in order: the base surfaces the camera sees most, then
  decals, then sprites, then anything that ends the film (a dawn sky). A policy block: retry once, then change the words.
- **Try a new prompt on one picture first** before a batch.
- **Base textures:** "straight top-down scan, very low contrast, evenly lit, slightly painted", and forbid stains, creases, shadows,
  perspective, text, logos. Any feature in a tiling texture repeats and gives the tile away. All damage goes in decals.
- **Decals:** blobs on plain white, then the decals recipe makes them multiply-only (alpha reaching zero inside the cell).
- **Sprites** (painted cut-outs that turn to face the camera, like trees in old games; a huge gain in detail, best used big): whole sheets on
  solid magenta #FF00FF, thick dark ink, simple shading. **Look at each raw sheet**: an extra object shifts every name after it with no error.
- The recipes live in `assets/tex/recipes.json` (worked example: `examples/s4_shade/tex/recipes.json`; every field is explained in
  the header of `tools/tex/make_tex.py` and `make_sprites.py`): `bases` (tiles), `skies`, `decals` (grid, kinds, groups of cells),
  `sprites` (sheets, each sprite's name, height in D, `floor` or `hanging`).
- Then `tex_job { kind: 'tiles' }` (or `names: [<bases or skies>]`), `{ kind: 'decals' }`, `{ kind: 'sprites' }` (or `names: [<sheets>]`),
  `{ kind: 'check' }`, and `{ kind: 'sheet', names: ['assets/tex/preview'] }` to look at the previews on one picture. Tiles and
  previews land in `assets/tex/` and `assets/tex/preview/`. **Look at every 3 x 3 repeat**: numbers do not prove a wrap on soft pictures.

## Integration (env-three, `scenes/set.js`, sets.md)
- `assets/set/scatter.json` is keyed per place, as `blender/build_set.py` writes it: `{ meta, <place>: { instances: { <kit asset>:
  [[px,py,pz, qx,qy,qz,qw, sx,sy,sz], ...] }, decals: [{ cell, pos, normal, spin, size, surface, alpha }] } }`. Read
  `scatter[place].instances` / `.decals` for the place you build (never a flat list); `meta` holds the shared data (e.g. `decalCells`).
  Worked example: `fromScatter` in `examples/s4_shade/set/s4_env.js`.
- Load with `readGlb` (`../world/look/glb.js`), scatter as instanced meshes, decals as instanced multiply quads, sprites from
  `assets/tex/sprites/sprites.json` (`world/look/sprites.js`, `world/look/rigkit.js`). Worked example: `examples/s4_shade/set/s4_env.js`.
- Fall back to the previz when a file is missing, and pick up new files as they land (the preview reloads on any change in `assets/`).
- Lights as data (sets.md): one-line changes, 10 s to see. Pools of light with falloff to dark between them, textures catching light
  at a grazing angle. A gobo (a lamp cage's shadow) sells a light without showing it.
- Pictures that arrive late (a sky) are often brighter than the grade wants: check them in place and scale them down.
- Sprites: big ones placed by hand for wide shots, the rest scattered with a seed; nothing right behind a face; keep them off camera
  flight lines (`keepClean`, `clearPath`).
- Characters must not change: `film_check { kind: 'same' }`, and a face crop by eye (`render_frames`) on the same frame before and after.

## Review, in this order
1. Are the faces still the first thing you see?
2. Is it still the same place, with the same colour character?
3. Does anything read as a pattern (a patchwork of tiles, an even sprinkle, repeating blotches)?
4. Did an important silhouette lose its contrast?
Fix with radical changes, not micro adjustments. Render early for a safe result, and again when late files land.
