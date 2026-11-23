# Camera

The camera is where the film gets its feel. The Build pass shoots it plainly and well (the grammar below); the Camera angles pass
rewrites only `shots` from an instruction set (`cameras/`). Acting, props, voice and captions stay identical between camera versions.

## The grammar (Build pass default)
1. The camera is on the SPEAKER while a line is spoken. Cut to a listener only for a reaction beat, then come back.
2. Cut every 1.5-3 s, on a line start (`t0: 'line:N.start'`) or an action. Each next shot a clearly different angle or size.
3. Characters fully in or fully out of the frame, never half a face at the edge.
4. Actions the story needs happen ON screen, never inside a cut: hand-overs, sitting, a prop opening, an arrival. Start the shot
   at least .3 s before the action.
5. Continuity: no face key, clip start or turn within 3 frames of a cut.
6. Characters big: head 300-430 px wide on talking shots, one establishing wide (180-250 px) per place.
7. Low: camera between the subject's chest and eyes, looking slightly up. Never from above.
8. The camera always moves: a `push` 8-12 % closer over the shot, an `orbit` 10-20 degrees, a `follow` on a walker. A `park` drifts
   slowly by itself; `still: true` on a shot for a real dead-still beat.
9. Dutch roll 1-5 degrees on most shots, drifting a degree over the shot.
10. Foreground depth: a set piece low in the near third, or two people staggered in depth, or over the shoulder.

## Framing numbers (1080x1920; a wide project: `wide.md`)
Head px = `4160 / distance` at fov 26 (`3580 / distance` at fov 30): 300 px = 14 D away. The frame is only `0.26 x distance` D wide at
fov 26, so a two-shot must stack depth (one nearer, heads at 30 % and 70 %) or keep the pair within ~1.9 D. Three in one shot: heads
250+, staggered, ~14-16 D at fov 26-28. Solo: head centre 35-65 % across, 34-50 % down.

## The `path` camera (one continuous move through keys)
```js
{ t0: 0, t1: 99, camera: { move: 'path', keys: [
  { t: 0,   pos: { whos: ['cal', 'maya'], offset: [0.3, 2.6, 8.5] }, target: { whos: ['cal', 'maya'], offset: [0, 2.6, 0] }, fov: 30 },
  { t: 2.3, pos: { who: 'maya', offset: [-0.6, 2.65, 7.0] }, target: { who: 'maya', offset: [0, 2.75, 0] }, fov: 30 },
  { t: 'line:3.start', pos: [1.3, 4.25, 1.2], target: [0.15, 2.4, -10], fov: 38, stop: true } ] } }
```
Monotone cubic per channel: passes every key, no overshoot. `stop: true` = speed zero at that key (an aim that lands after a whip).
`shake` 1 calm, 2 a jolt, 3 panic, .5 holding breath; `walk` 0-1 = the bob of whoever holds the camera.
Keys on a moving thing: `{ object: 'sub', offset: [22, 6, -9] }` (a set object by `.name` or `set.points`; `local: true` turns the
offset with it), `{ prop: 'id', offset }`. A name that does not exist stops the film before anything renders.
- **Whip:** two keys 5-7 frames apart, a key half way aimed sideways (a target passing through the camera has no direction).
- **Over heads:** pass at least 1 D from any head, or the frame goes solid for a few frames. Or stay 4+ D out.
- **Flights:** never look ahead at blank wall; keep the next subject in frame, swing to the face on landing.
- **Long lens + doorway:** aim from the subject through a point just inside the door and put the camera on that line.
- **After everyone turns,** a camera on the old side sees backs: move the peek to the beat when they face it.

## Seams: crossing between places without a visible cut
Places sit 400 D apart (sets.md). A hidden cut is two `path` shots whose last and first frames look alike (`seam: true` on the second):
- **Forward into a surface:** fly at a wall or hull until it fills the frame, cut, come out of another wall still moving. Keep the
  camera outside the shell on the last frame.
- **Backward through a wall:** one frame pops from the room to the outside; at speed it reads as passing through.
- **Water surface:** backward out through it looking down reads well; forward through a bright plane is a flash.
- **Swish:** the same sky in both places, turning the same way on both sides of the cut.
- **Ride a moving thing:** keys on `{ object }` carry the camera with it.
- Keep each crossing under 8 frames (5 dark frames read as passing through, 8 is too long). Land on the next face on the word.
- Hard cut where the hit is stronger than a glide: a jolt, a scream, a reveal.

## Shapes that need care in 9:16 (a wide project: `wide.md`)
A long thing (a ship, a train) reads only from near its axis (within ~10 degrees); from the side it is a wall. Two heads closer than a
helmet cannot be separated by any camera: move the character and say so. Lead a walker from the side he walks towards.

## Review on strips
- `film_sheet` of the whole film: the cut rhythm, faces in every shot, nothing growing out of heads.
- `film_sheet` with `strip` on every fast move and every seam: full frame rate. A camera through a head showed on one frame that
  every-3rd-frame sheets nearly hid.
- `render_frames` on the first frame of each shot and on actions: framing and faces at full size.
- Move the sound cues tied to cuts if the new camera moved the cuts (a whoosh belongs on the whip, not where the old cut was).
