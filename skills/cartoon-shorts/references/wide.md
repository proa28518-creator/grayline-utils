# Wide films (16:9, 1920x1080)

A project made as Wide 16:9 is 1920x1080 everywhere: preview, `render_frames`, `film_sheet`, every check, the export. The project's
format decides; write `size: [1920, 1080]` in `scenes/film.js` so the file says the same. Same five passes, same method, same bar.
Only the framing changes. Where another file gives px numbers for 1080x1920 or talks about a tall frame or a "slit", this file wins.

## What the frame does
fov is the VERTICAL lens, so the same camera at the same distance shows the same height of the world, and about three times the width.

| at fov 26 | tall (1080x1920) | wide (1920x1080) |
|---|---|---|
| head size | `4160 / distance` px | `2340 / distance` px (`2015 / distance` at fov 30) |
| head as a share of frame height | the same | the same |
| frame width at the subject | `0.26 x distance` D | `0.82 x distance` D |
| either side of a subject 14 D away | about 1.8 D | about 5.7 D |

Px numbers here are real pixels of the 1920x1080 frame: measure heads on `render_frames` at `scale: 1`.

## Framing numbers
- Talking shot: head 220-340 px (7-11 D away at fov 26). Close-up on a reaction: up to 450 px, the head off centre.
- A place's establishing shot: head 110-160 px (15-21 D).
- Solo: head centre at a third of the width (about 33 % or 67 %), 30-45 % down, looking INTO the empty side. Dead centre only when
  the shot is about being trapped or confronted.
- Two people: side by side now works. Heads at about 30 % and 70 %, 3-5 D apart, 10-13 D away, or staggered in depth when one matters
  more. No need to stack them as a tall frame must.
- Three or more: spread them across the width at different depths, heads 180+ px. Nobody's head cut by the frame edge: with this much
  width a half face at the edge is an accident, not a crop. Check the edges of every group shot.
- Captions sit low in a wide frame (words at 80 %, full lines at 86 % of the height, sized on the height). Keep every speaking face
  above about 72 %, and the feet can go under the words.

## Use the width (this is what wide is for)
- **Something in the empty side:** the thing they fear, the person they are talking about, a window, a door. An empty third with a
  reason is the strongest wide picture; an empty third with nothing in it is a shot framed too loosely.
- **Near things on one side:** a pipe, a door edge or a shoulder dark and soft on the left or right third, the subject on the other.
- **Sideways moves read now:** a track alongside a walker, a slide from one speaker to the next without a cut. Lead a walker with
  the room in front of him.
- **Depth still comes first.** Wide is not flat: the camera still looks along the set's depth, low, with space and light behind the
  faces. Do not line people up against a wall because they now fit.
- Long things (a ship, a train, a table of people) can be shown side-on from far enough away; a tall frame could not.

## The set must be wide too
A tall frame hid everything beyond about 1.5 D either side of the subject; here both sides of the set are on screen. So:
- Read `film_probe` shots and work out what each camera sees sideways, not only behind the face. Full width of a shot at distance
  `d` is `0.82 x d` D: a back wall 20 D behind a subject the camera is 10 D from shows about 25 D of wall.
- No edge of the world in frame: side walls or dressing on both sides of every place, floor and ceiling wide enough, the far end
  wider than you would build it for a tall film. A set that ends shows as a hard edge or a void; look at the frame edges.
- Practical lights and big shapes spread ACROSS the width as well as along the depth, so the sides are not dark and empty.
- Detail goes where the eye goes, and that is now the left and right thirds as well as the middle. Plan about three times the visible
  surface: model and dress what the cameras really see, leave what they never see.
- Backgrounds and full-frame pictures: `make_picture` with aspect 16:9. Wide plates for what is seen through windows and doors, since
  much more of them shows.
- Blender: `blender_run { script: 'blender/check_set.py', args: ['--wide', '--render', '2.1', '14'] }`: the camera samples and the clay
  pictures use the 16:9 frame (check_set_template.py).

## Each pass
- **Build:** stage for the width from the first shot (the thirds, the two-shots above). Frame 0 is still a face. Build a set with sides.
- **Camera angles:** the instruction set's feel and logic stay; only the composition changes. Below.
- **Environment overhaul:** the crew's contract says the frame is 16:9. Keep-clear zones and flight lines are the same; the sides of
  each place join the list of what each shot must show. Tell every agent in its brief: "wide film, read references/wide.md".
- **Add post processing:** haze, depth of field, bloom and grade work as they are (`maxBlur` scales with the frame height). Check
  particles and dust reach the sides: a dust `box` made for a tall frame is too narrow, so widen it across the camera and raise the
  count by the same factor. A vignette reads stronger on the far left and right: judge it on the sides.
- **Shading pass:** nothing changes in the method. Characters now often stand at the sides of the frame, so check faces at the edges.

## The five camera sets in a wide frame
| set | same as ever | wide |
|---|---|---|
| Dread Cuts | hard cuts on the words, low, tilted, a push on every shot | put the dread in the empty side: a figure on one third, the dark or the door on the other. Change the side on each cut, as the roll does. |
| One Take | one unbroken path, flights landing on words | long sideways slides between speakers read beautifully. On flights both sides of the path are seen: check strips for set edges and void, and clear sprites a wider lane. |
| Found Footage | a person with a phone, fov 46, shake, whips | held sideways it shows a lot: 4-5 D from a face now also shows who stands beside them. Whips travel further, so land them with a `stop`. Use a narrower fov (35-40) if the sides of the set run out. |
| The Watcher | a long lens from far away, level, creeping | fov 9-16 from 15-25 D. A door frame or corner can fill a whole third as the hiding place. Hold people small at one side when the silence wants it, end tight on a face. |
| Through the Steel | the camera travels with what crosses the walls, seams under 8 frames | seams must fill the WHOLE width: fly closer into the wall or hull than you would in a tall frame, or the edge of it shows at the sides. Close on faces between crossings. |

## Review
`film_sheet` tiles are wide (fewer columns, more rows); `strip` and `cuts` as ever. The bar stills in `references/bar/` are 9:16:
compare faces, light, richness and depth with them, not the shape. At `render_frames` `scale: 1`, look at the left and right edges of
every shot first: that is where a wide film goes wrong.
