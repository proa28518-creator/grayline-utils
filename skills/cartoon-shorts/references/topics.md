# Any script, any topic, at the bar: the film bible

The bar films are a submarine, an office maze and a storybook town. A member's voice can be about anything: a diner, a hospital,
a forest, a rocket, a classroom. The bar is the same for all of them: depth behind every face, detail near the lens, light you
can see the source of, air that grows with distance, a colour mood per place, and characters acting every word. This file is
how any script becomes places that can reach that bar. The examples below show the METHOD on unrelated topics; they are never
material to copy.

## 1. Decompose the voice (Build, before any code)
Read `narration` (all of it). For every line write one row in `scenes/BIBLE.md`:
| line | words (as heard) | speaker, listeners | place | beat (what changes) | mood | the action word | the story prop that shows the words |
- A line that names a new place, a new time or a new danger starts a new BEAT. A film over 30 s has 3 or more beats.
- The STORY PROP is the thing that makes the picture say the words: the letter she reads, the 47 scratches, the burnt pie, the
  red button. Without one, a line is two people talking in a room.
- A sound or action word ("BANG", "she slammed", "he pressed") is a one-frame face snap plus a body action on that word.

## 2. Find the real thing, turn it into numbers (one PLACE row each)
For every place, name the real thing it is (a 1950s roadside diner, a hospital corridor at 3 a.m., a lighthouse lamp room in a
storm) and write its numbers before you build:
| place | the real thing | size in D | far end from the main camera (D) | where its depth comes from | practicals you can see | colour mood | air and particles |
- **D = real metres x 1.6** (one D is one head; a door 2.0 m = 3.2 D, an adult's head top 2.6-2.8 D, a seat .55, a counter 1.25).
- **Far end:** at least 25 D (about 15 m) behind the faces in most shots, looked along (a corridor, a street, a window onto the
  outside, a doorway into a lit room, a stair going down). A small real place (a lamp room, a lift, a car) gets its depth from
  a window, a doorway or a stair, never from moving its walls apart until it stops being that place.
- **Practicals:** 2 or more light sources you can see in every place (lamps, a window, a screen, a fire, neon), placed along
  the depth so it falls into pools of light and dark.
- **Colour mood per place** (warm yellow, rusty amber, deep sea teal, cold dawn, cobalt night): you should know where you are
  with the sound off. A place changes its light state when the beat changes the time or the danger.
- **Air per place:** which particles belong there (dust in a closed room, pollen and seeds outside by day, rain, snow, embers,
  steam, fireflies, bubbles) and how much haze (the numbers per kind of place: `references/quality-bar.md`).

## 3. Pick how each thing is made
| what | Build (the previz with depth) | Environment overhaul (the real set) |
|---|---|---|
| the place's shell (walls, floor, ceiling, ground) | a kit set by name or a description object; your own `scenes/set.js` for several places | Blender `build_set.py`: modelled walls with frames, bevels, skirting, sag, seams |
| the hero thing the words name (the diner counter, the lighthouse lamp, the button) | a simple prop in `scenes/props/` at its real size in D | modelled in Blender at hero detail, textured, lit by the place |
| dressing (clutter, plants, signs, tools) | a few kit pieces where the eye goes | Blender scatter + Flow sprites in the ink style + `prop_library` props, organic density (clusters, clear and bad stretches) |
| surfaces | kit colours | Flow tiles at low contrast + decals where dirt gathers |
| sky and the far outside | a kit sky | a painted sky picture (`make_picture`, bottom edge = horizon) with cloud detail |
| light | lights as data, practicals visible | the same rig, the practicals modelled as fixtures |

## 4. The colour script
One look per place and per light state, written in BIBLE.md before any post: "diner noon: bleached warm yellow, hard sun, heat
shimmer; diner night: neon pink and teal, warm counter light, a cold window". One look for the whole film only when the film is
truly one place at one moment.

## 5. Prove one piece first
Before acting the whole film, stage and light the OPENING (the first shot: the face, the place behind it, its practicals) and
run a critic round on it (`references/critic.md`). Every later shot is built from what that proof taught.

## 6. Topic traps (found by walking unrelated briefs through this skill)
- **A big sky** (a desert, a beach, a field, the sea): sky over 40 % of the frame measures as flat set and reads as empty. Paint the
  sky with cloud detail (`make_picture`, bottom edge = horizon), frame the horizon in the upper third, let wires, a sign, birds or
  branches cross it.
- **A night exterior** (a storm, a street, a shore): a black sky and a black sea are a void, not a mood. Clouds lit by the moon or
  the town, waves with foam, wet ground catching the lamps, rain between the lens and the set.
- **A small room whose depth is a window** (a lamp room, a cockpit, a cabin): keep the room's haze low enough that the view through
  the glass keeps its shapes; limit the air by distance or height, and check the window on a with / without pair.
- **A crowd of listeners** (a classroom, a jury, a team): the nearest three or four listeners react 1-3 frames after the trigger
  word; the rest hold dead still. Turn tables and benches so faces look across the lens, never a row of backs.
- **A non-human in a speaking part** (a robot, an animal, a monster): the cast system makes people (`references/characters.md`).
  Build the non-human as a prop in `scenes/props/<kind>.js` that acts as a function of t (a head that turns, eyes or lights that
  snap on the word), give its voice lines to the narrator or a person on screen, and write the choice in `lessons/build.md`.
- **A big bright hall by day** (a gym, a market hall, a station): neither the closed-interior nor the bright-exterior post numbers;
  start between them (quality-bar.md) and write what you ended at in `lessons/post.md`.

## 7. Worked mini-examples (the method on unrelated topics; never copy them)
**A lighthouse keeper's last night (storm, 45 s).** Places: lamp room (real 4 m across = 6.5 D: too small for depth, so the depth
is the storm seen through the glass, 200+ D of sea with the beam sweeping it, and the stair well going down), spiral stair (depth
straight down, 30 D), rocky shore (exterior night, 60 D to the horizon). Practicals: the great lamp, a paraffin lantern, the beam
itself. Story prop: the logbook with its last entry. Colour: lamp room warm amber against cold blue-black glass; shore cold teal,
white foam. Air: rain streaks outside the glass, spray on the shore, dust in the lamp light. Trap: rain particles across a face;
keep them behind the glass or between lens and set, never on the faces.
**The robot at the science fair (bright interior, 60 s).** Places: a school gym (30 x 18 m = 48 x 29 D), the stage end with a
banner, the hallway outside. Depth: look down the length of the gym past the rows of tables, 40 D+. Practicals: high-bay lamps
in a grid, the stage lights, a projector screen. Story props: the robot, the trophy, the volcano model that fails. Colour: high
key, warm gym wood, saturated posters. Air: light haze only (the bright exterior numbers, not the dark interior ones), paper
confetti on the win. Trap: twelve kids at tables read as a crowd of backs; turn the tables so faces look across the lens, and
give every listener a reaction 1-3 frames after the trigger word.
**Grandma's desert diner (noon exterior and a neon night, 50 s).** Places: the road and the diner front (exterior, 80 D to the
mesas), the counter inside (12 m = 20 D, depth through the window onto the road). Practicals: the neon sign, pendant lamps, the
pie case. Story prop: the last slice of pie under its glass dome. Colour: noon bleached warm yellow; night pink and teal neon with
a warm counter. Air: heat shimmer and dust by day, moths round the sign at night. Trap: a sky over 40 % of the frame measures as
flat set; paint the sky with cloud detail and frame the horizon in the upper third with the sign and wires crossing it.
**The night nurse (dark interior, 40 s).** Places: a hospital corridor at 3 a.m. (40 m = 64 D), the nurse station, one ward.
Depth: the corridor itself, looked along. Practicals: ceiling panels every 5 D, the station's desk lamp, monitor glow, an exit
sign. Story prop: the call light above bed 7. Colour: cold green-white corridor, warm station. Air: the dark interior numbers,
fine dust. Trap: even ceiling light everywhere reads flat; break it into pools (every second panel dimmed, one that flickers on
a beat) so the faces move through light and dark.

## 8. Before you hand the bible on
- Every line has a place, a beat, an action word and a story prop.
- Every place has its real thing, size in D, far end in D, 2+ practicals, a colour mood and its air.
- The opening's place is staged, lit and proven by a critic round.
The Environment overhaul's contract (`scenes/ENV_CONTRACT.md`) starts from this bible: per place what it must become.
