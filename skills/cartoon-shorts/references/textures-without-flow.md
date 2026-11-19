# Textures without Flow

Goal: the set still looks rich and lived in when the member has no picture service. Quiet base surfaces that tile with no visible
repeat, loud damage in decals, and characters that stay the first thing you see. Free sources only: never a paid picture service the
member did not choose.

**Sprites never need a picture service:** the app's prop library (`prop_library` search / look / use) has 656 cut-out props in this
style. Without a picture service every prop comes from it (the tool check's PROPS line says so).

## 1. Google Flow first
Flow gives the best result, and it is free on the member's own Google account. If `make_picture` answers `picture-none` or
`picture-signin`, keep working with the free sources below, and at the end tell the member in plain words:
"Your set used free photos and textures drawn in code. For the best textures, set up Google Flow (free): Settings > Media > Image
generation > Google Flow > Open Flow, sign in with your Google account, then press Environment overhaul again."

## 2. Else: free photos, made seamless
`web_image { query, name, skip? }` on this project saves one free photo (CC0, public domain or CC BY only) to
`assets/tex/raw/<name>.jpg` and its credit to `assets/tex/CREDITS.md`.
- Search `"<surface> texture"`: "carpet texture", "rust texture", "plaster wall texture", "wood planks texture", "grass texture",
  "concrete floor texture". Plain nouns, English.
- Look at what came back. A usable photo is **straight on, evenly lit, the same all over**: no perspective, no shadow across it, no
  object, no single big feature. Anything distinctive repeats on every tile. Not usable: `skip: 1`, `skip: 2` ... or other words.
  (Tested: a side view of bark tiled as an obvious repeating shape; "rusted steel plate" found a penknife.)
- Give it a `bases` entry in `assets/tex/recipes.json` and run `tex_job { kind: 'tiles', names: ['<base>'] }`. Photo recipe that
  worked: `{ "raw": "<name>", "trim": 0, "flat": [4, 0.15], "calm": [14, 0.35], "paint": 5, "periodic": false, "mean": [r, g, b],
  "detail": 0.05, "chroma": 0.6, "tile": [u, v], "source": "photo" }`. The job crops the middle square, flattens large light and
  blotches (`flat`, `calm`), paints it a little (`paint` = px of median: 3 for fine weave, 5 for coarse surfaces; photo-sharp
  detail fights flat characters), and cuts the seam along the picture's own detail (min-error cut). `mean` / `detail` set the final
  colour and contrast so it matches the film's palette.
- Worked example of every field: `tools/tex/recipes.free.json` in this skill.
- **Credits:** copy the lines of `assets/tex/CREDITS.md` into the video description (DESCRIPTION.txt) at the end. CC BY needs it.

## 3. Else (or as well): drawn in code
`tex_job { kind: 'procedural', names? }` draws raw pictures from a `"procedural"` section in `recipes.json` into
`assets/tex/raw/<name>.png`. Surfaces are drawn already tiling (the tiles job skips its cut by itself); give each a `bases` entry
like any raw picture (`"flat": [3, 0.6], "calm": null`), then `tex_job tiles`.
- Surfaces (`kind`): `plaster`, `concrete`, `carpet`, `wallpaper` (`pattern`: damask, stripes, pinstripe, diamonds, dots),
  `tiles` (ceiling tiles; `pattern`: perforated, fissured, plain), `floor_tiles`, `panels` (riveted plates), `planks`, `brick`,
  `metal`, `rust`, `ground`, `grass`, `bark`, `noise`. Knobs: `count` (tiles, planks, bricks, plates or pattern repeats per side),
  `dirt` 0..1 (grime that gathers at seams, in stretches), `scale`, `seed`, `colors` `[[base], [accent]]`.
- Best in code: anything with a regular structure (ceiling grids, panels, planks, brick, wallpaper patterns): code draws it exact
  and it tiles perfectly. Best from a photo: organic surfaces (rust, bark, grass, worn carpet). Weakest in code: bark and grass.
- Match the period of the pattern to the modelled detail: if Blender models a ceiling grid of 0.6 D, the texture's `count` and the
  `tile` size must put one tile per cell, not a grid inside a grid.

## 4. Judge a tile
- Look at `assets/tex/preview/<base>_3x3.jpg` (`tex_job { kind: 'sheet', names: ['assets/tex/preview'] }` shows them all at once)
  and `<base>_seam.jpg` (the seam cross at full size). No visible line, no shape you can spot three times, no light-to-dark drift
  across the tile. The printed "wrap seam ratio" near 1 means the edge is as smooth as the inside; a real feature at the edge (a
  plank gap, a grout line) raises it on purpose.
- Then judge it in the film (`film_sheet`, with the grade): quiet and low contrast under the characters. Retry a bad source rather
  than fixing it later.

## 5. Decals
- Marks drawn in code: procedural `kind` `stains` (water stains with tide lines), `grime`, `scuffs`, `damp` (streaks heaviest at
  the top: decals kind with `"streak": true`), `cracks`, `splatter`. Each draws six marks on white; a `decals.groups` entry with
  `"raw": "<name>"` puts them in six cells, then `tex_job { kind: 'decals' }`. The cell ranges of the contract still hold.
- Photos rarely make good decals (a stain photo has a background that is not white). Use code marks, or a photo only where the mark
  sits on a plain light surface.

## 6. Sprites
- Sprites need a clean cut-out. Wikimedia photos almost never have a solid background, so do not cut sprites from them.
- Without Flow: draw sprite-like set dressing in code in `scenes/set.js` (simple meshes with flat colours and the ink outline the
  kit uses), or leave sprites out and spend the effort on modelled props and decals. Say which in your summary.
