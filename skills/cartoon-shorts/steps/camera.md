# Step: Camera angles

**Goal:** the same film, same acting, a vastly different viewing experience: write a new camera for THIS film from an instruction set.
If the member named one (Dread Cuts, One Take, Found Footage, The Watcher, Through the Steel), follow it. If not, pick the one that suits
this story best and say why in one line. Instruction sets are a feel and a logic, never stored paths: build the moves for this film's
staging and beats. Inventing your own logic from them is welcome ("the camera goes where the sound goes" was invented this way).

**Inputs:** the built film (`scenes/`), `scenes/BIBLE.md`, every earlier pass's HANDOVER in `lessons/`, the member's notes (the
camera set, a SHOT PLAN's camera lines when there is one).

**The bar:** "Through the Steel" on the S-4 short ("borderline insane ... clean") and One Take on the backrooms film ("Flawless").
Look at the stills in `references/bar/` (`references/quality-bar.md`): faces big, the camera looking along the depth of the set so
there is space and light behind every face, near things framing the shot. **The guide pages** (`references/guide/`): 01 the bar,
05 the camera, 02 story to shots (when the cuts move), 09 verify, 10 never. Read them before you start and check your frames against
them before you finish. When the project has `references/examples/`, its camera sections show how.

**Wide project (16:9):** read `references/wide.md` first. It says how each instruction set composes wide: same feel and logic, wider framing, and what to check at the frame edges.

## Read first
`SKILL.md` (the loop and the hard rules), `references/quality-bar.md` and the stills in `references/bar/`, `references/critic.md`, the chosen `references/cameras/<set>.md`,
`references/camera.md` (all), the Camera part of `references/pitfalls.md`, `lessons/*.md` (every HANDOVER). The worked example
`examples/cameras/<set>.json` shows one film's shots: learn from it, never copy its shots, coordinates or timings, even when the
voice is the same as an example's. This film's camera is written for its own staging.

## What must hold
Only `shots` (and camera-only helpers such as a `shots.js` module, `focus`, `seam`, `hard`) change. Characters, acting, props, voice,
captions and the set stay exactly as they are. The film still opens on a face.

## Method
1. Before you change anything: `film_probe` and `render_frames` on 4-6 key times (the "before"), and read where everyone stands and moves.
2. Plan the camera in a few lines: the logic of the set for this story, beat by beat on the words, where the flights or cuts go.
3. Write the shots. Keys on characters (`{ who, offset }`) keep moving people framed. Cuts and landings on words.
4. **Review loop:** `check_preview` -> `film_sheet` of the whole film -> `film_sheet { strip }` on EVERY fast move, whip and seam
   (a camera inside a head shows on one frame only) -> `render_frames` on each shot's first frame -> `film_probe` -> fix the worst -> again.
5. `film_check { kind: 'same' }`: characters, props and voice unchanged against the start of this step (the app saved it before you
   started; the shots changing is expected here).
6. **Critic rounds** (`references/critic.md`; put the strips of the fastest moves in the picture set; do-not-fault: the set's detail,
   the post, the shading) until the exit list is true and a critic says YES.
7. Write `lessons/camera.md`, ending with its HANDOVER. Note any sound tied to an old cut.

## Machine checks
`check_preview`, `film_probe` (PROP GUARD), `film_check { kind: 'same' }`, `film_check { kind: 'flicker' }` on the fast moves (a
solid dark frame is a camera inside or beside a body).

## Exit (every line true)
- The whole film reads as the chosen feel on a `film_sheet`, and it is clearly different from the previous camera.
- Every fast move, whip and seam checked on a full-rate strip: no frame inside a head or a wall, no solid dark frame, no blank wall
  on a flight, faces land on the word.
- In 3 of every 4 shots or more the camera looks along the set's depth (space behind the faces, not a wall a metre away); a lens or
  angle that shows only a strip of wall is changed. Looked at with `render_frames` at `scale: 1` next to the bar stills.
- `film_check same` passes, PROP GUARD passes, the first frame is a face.
- A critic answered YES with no BLOCKING fault. `lessons/camera.md` ends with its HANDOVER.

## Never
A camera beside a character's depth (a body level with the lens plane draws a solid ink frame: keep everyone clearly in front of or
behind the lens); a flight that looks ahead at blank wall; a change to acting, props, voice or the set.

## Report
Which instruction set you used, the one-line idea, and what is weakest.
