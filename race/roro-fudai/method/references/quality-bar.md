# The quality bar: what "at the bar" looks like

Films set the bar for this style. The owner called S-4 "borderline insane" and the backrooms film "Flawless, this is perfect";
The Town Built Around a Button (65 s, 35 shots, 19 characters, a walled town by day and night and a field) is the bright,
exterior proof that the same bar holds far from a submarine or an office maze. Full-size stills are in `references/bar/`
(`s4_*.jpg`: a sunken submarine, `backrooms_*.jpg`: a yellow office maze), each set with a caption file (`s4.md`,
`backrooms.md`) that says what makes each frame good. Some projects carry only one of the sets: use what is there. The guide pages
in `references/guide/` show no / yes frames per part of production, many of them from the Town film (`references/guide/INDEX.md`).

**Open the stills at the start of every pass, before your "before" frames.** At the end, put your own frames next to them at
full size (`render_frames` with `scale: 1`) and run the critic rounds (`references/critic.md`). A pass is done when, frame for
frame, nothing big the bar has is missing from yours AND a fresh critic says YES. The checks passing is NOT done: checks only
say nothing broke. They never say it looks good.

The stills are the bar for the LOOK, never material: this film's set, cast, shots and colours come from its own story
(`references/topics.md`).

## What the bar has that a first try lacks
A first try usually "works": every check passes and the picture is flat. These are the gaps the owner sees at once.

| | the bar | a first try |
|---|---|---|
| depth | the set goes on behind the characters: a corridor, a room, a street, a horizon with a far end 25 D+ away, often a vanishing point near the middle of the frame | characters lined up against a wall a metre behind them |
| near detail | modelled things close to the camera and at frame edges (pipes, door frames, crates, rails, ceiling grid, a hedge, a lamp post) that frame the faces | empty floor and blank wall |
| ceiling and floor (or ground and sky) | ceilings with tiles, panels, pipes, chains; floors with stains, rugs, debris; outside: cobbles, kerbs, grass clumps, a painted sky with clouds | flat planes, a gradient sky |
| lights | practicals you can see (panels, lamps, a lantern, lit windows) that light the set and the faces around them, pools of light and dark | even light everywhere, no visible source |
| air | haze that grows with distance so far things fade, light hanging in the air near lamps, dust, pollen or bubbles that drift | a clear, sharp picture to the far wall |
| focus | sharp characters, background softly out of focus (depth of field), bokeh on far lights | everything equally sharp |
| faces | lit by the scene: a warm (or cold) key from the lamp or sun side, a darker coloured shadow side, a rim in the backlight | flat white or flat grey discs |
| grade | one strong colour mood per place and light state (warm yellow, rusty amber, deep sea teal, cold dawn, cobalt night), a vignette | neutral colours, no vignette |
| places | each place has its own light and grade; the change on a cut tells you where you are | one look for the whole film |

## The measured floor (the app's set bar, `film_check { kind: 'set' }`)
Per shot: 22 %+ of the frame is detailed set and at most 80 % is flat (fog, void, a bare wall, a gradient sky). The film: a median
shot of 28 %+ detail and at most 78 % flat, and no more than 40 % of the shots under the shot line. The Town film measures 63 %
detail / 42 % flat; S-4 38-56 % / 49-67 % across its passes; a member film of grey fog and plain boxes measured 16 % / 86 %. Passing it is the floor,
not the bar.

## Numbers per kind of place (to calibrate, never to copy)
Start from the row that matches the place, then tune by eye next to the stills. The same numbers on another kind of place are a
mistake: the dark-interior haze and aperture turned the bright Town into a grey-white veil and blurred the button in the
foreground, until the haze was halved, `far` came down to 70-90 and the aperture to 9.
| kind of place | air (haze) | depth of field | bloom | particles | grade |
|---|---|---|---|---|---|
| dark interior (S-4 torpedo room, backrooms) | density about .03 (haze clearly visible at 10 m), light in the air .25-.3 | aperture 26-30 | about .3 above .75 | 1,000+ slow dust motes | gamma .84, contrast 1.12, a colour tilt, vignette |
| underwater | denser (.034), moving light shafts | aperture 26-30 | on the lights | bubbles, marine dust | deep teal, vignette |
| bright exterior by day (the Town) | density about .0055 from 8 D out, `far` 70-90 so the sky keeps its colour | aperture 9, nearK .22 | light | pollen, seeds (size about .010) | gamma 1.10, saturation 1.28, vignette |
| exterior at night (the Town's night years) | coloured haze (cobalt), the lamps' light hanging in it | aperture 9 | warm bloom on every window and lamp | fireflies, snow or petals as the story's season wants | cooler than the day (the Town: gb 1.06-1.15), vignette |
| a macro close-up of a prop | no haze | none or very light: the prop is the subject | on its highlights | a little dust | crisp: gamma up, contrast up |
| a big bright hall by day (a gym, a market hall; no film measured yet) | between the closed interior and the bright exterior: about half the interior density, `far` set to the hall's length | aperture 12-20 | on the windows and lamps | dust in the sun shafts | warm or neutral, vignette |
A pass that ends far below its row (haze .002 in a dark interior, bloom .14, 200 specks, no vignette) has turned its effects off,
not tuned them.

## Fixing without losing the effect
When an effect causes a problem (haze washes out the sky, rays make blotches, a grade turns faces muddy), fix the cause (limit it by
height, distance or place, keep it off the faces, move the light) and keep the effect. Turning an effect down to nothing is not a fix.

## How you know a pass skipped something
Its lessons show no "before" frames, no critic round, no frames next to the bar stills, or a HANDOVER with nothing below the bar.
Every real pass has all of them.
