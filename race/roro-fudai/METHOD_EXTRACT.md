<!-- Seat attribution: extracted by the rebuild coordinator (Layla's office — production driver seat), 2026-11-23, read in full from ~/workspace/cartoon-style-copy/skill/cartoon-shorts/ (SKILL.md, steps/*.md, references/*.md incl. pitfalls.md). Every number below is the tree's own; nothing added from any other source. -->

# METHOD EXTRACT — cartoon-shorts, as the tree itself prescribes

## The shape
One film, five passes, one step file each, in fixed order. Each pass stands alone, keeps what the others
made, and is done only when its exit list is true AND a fresh critic answers `VERDICT: YES` with no
BLOCKING fault. "End to end" = the five in order, with the director's whole-film review between them.
Quality is the only goal; no step has a clock. The builder never grades its own work.

| # | pass (step file) | its job | headline exit |
|---|---|---|---|
| 1 | Build (`steps/build.md`) | film bible, cast, acting on every word, a lit set with depth, a first camera | frame 0 an expressive face; every word in a line; PROP GUARD passes; opening + whole-film critic YES |
| 2 | Camera angles (`steps/camera.md`) | the same acting under a new camera from one of the five instruction sets | every fast move clean on a full-rate strip; `film_check same` passes; critic YES |
| 3 | Environment overhaul (`steps/environment.md`) | a real set from a crew of three (Blender, pictures, integration) | the set bar passes; depth behind every face; critic YES per place and whole film |
| 4 | Add post processing (`steps/post.md`) | per place: haze, depth of field, particles, bloom, grade, vignette | numbers per place class; faces the sharpest thing; set bar still passes; critic YES |
| 5 | Shading pass (`steps/shading.md`) | characters and props lit by the place: key and shadow as two colours | `shade_jumps`/`calm` looked at; no flicker; set bar still passes; critic YES |

## How every pass runs (the loop)
1. **Read:** the step file, the references it names, every earlier `lessons/*.md` HANDOVER, the bar stills
   (`references/bar/`), the guide pages for the pass (`references/guide/` — 01 and 10 always).
2. **Before:** full-size frames at 4–6 key times + a whole-film sheet; write the gap list against the bar, worst first.
3. **Work:** change something real; check; LOOK (sheet, strips on fast moves, full-size frames on faces);
   fix the worst thing radically, at its cause. Again.
4. **Machine checks** of the pass: every FAIL fixed at its cause. Numbers point, eyes decide.
5. **Critic rounds** (below). 6. **Handover:** `lessons/<step>.md`, ending with the HANDOVER block.

## Format and framing numbers (9:16 — this film)
- `fps: 30`, `size: [1080, 1920]`. Film time = the voice's clock (t=0 = first sample of `clean.wav`);
  the ending is automatic, 0.5 s after the last word or action.
- Frame 0 = a readable, expressive face, head **300 px wide or more**. Talking shots: heads **300–430 px**.
  One establishing wide per place: **180–250 px**. Head px = `4160 / distance` at fov 26 (`3580 / d` at fov 30).
- Cuts every **1.5–3 s**, on a line start or an action; each shot a clearly different angle or size; no face
  key, clip start or turn within 3 frames of a cut.
- Camera low (between the subject's chest and eyes, looking slightly up, never from above), always moving:
  push 8–12 % closer over the shot, orbit 10–20°, Dutch roll 1–5°. Faces within ~60° of the camera; the face
  draws only within ~95°; speakers start turned to the camera side (|ry| ≤ 70).
- In 3 of every 4 shots or more: space behind the faces — no blank wall within a few D filling the background.

## Places and scale
- **D = real metres × 1.6** (one D is one head; a door 2.0 m = 3.2 D; an adult's head top 2.6–2.8 D).
  For this film: the gate/wall 15.5 m ≈ **24.8 D**; the wave 15 m ≈ **24 D**; the neighbours' walls 10 m = **16 D**.
- Every place: far end **25 D or more** behind the faces in most shots, looked along (a corridor, a street,
  a window, a doorway); **2+ visible practicals** (lamps, panels, windows) placed along that depth; its own
  colour mood and its own air, written in the bible before any code.
- Many places in one film: one `scenes/set.js`, places **400 D apart**, each in its own dome and fog;
  domes must write depth. A character moves between places with `acts.<id>.place` keys on cuts, never cast copies.

## The set bar (measured; the export refuses a film below it)
- Per shot: **≥22 % detailed set, ≤80 % flat**. Film: **median shot ≥28 % detail, ≤78 % flat**, and
  **no more than 40 % of shots under** the shot line. Build measures it; Environment, Post and Shading
  cannot finish below it. (Bar films for calibration: the Town 63 % detail / 42 % flat; S-4 38–56 % / 49–67 %.)

## Hard rules
- Made new from this voice: cast, acting, shots, camera, set written for this film; examples teach the
  method and set the bar, they are never material — never copy an example's film, acting, shots or set.
- Open on a character's face, expressive, in the first frame. Never an empty scene, never a back.
- **Pure in t:** every frame is a function of t alone. No `Math.random` (use a seeded generator), no `Date`,
  no state between frames.
- **Never edit the engine copy** (`engine/`, `world/`, `lib/`, `specs/` …). New sets, props, characters go
  in `scenes/`; a true engine need is worked around and written in the lessons as a gap.
- **Never touch `audio/`.** Voice lines are written as heard.
- Anything in a place is in every shot of it. Nothing thin ending at a head. Faces never cut by the edge.
- **PROP GUARD:** a prop that jumps on screen fails the film (a move over 40 px/frame is reported; a real
  jump fails). `pick_up`, `put_down`, hand-overs, place changes on cuts, `snap` only on real hits.
- Later passes never change what earlier passes made, unless that is their job.
- A binding SHOT PLAN in the member's notes fixes the cuts, places and cameras: follow it segment for segment.

## Acting (Build)
- For every line, the speaker AND the listeners: face key at `line:N.start-0.1`; one body action tied to a
  word, one frame after the face; a listener's reaction 1–3 frames after the trigger word; then a dead-still
  hold. Every arm move gets an end (`hold` + `out`, the next clip on that arm, or a hand-over).
- Faces snap, never tween. Motion: face snaps (0 in-betweens), gestures 2–4 frames then stop, body moves
  ~10 frames (most done by frame 4–5), impacts stop dead, holds DEAD still — no breathing, no idle sway.
- All times tie to words (`'line:N.start'`, `'line:N.word:K'`, ±offsets), never raw seconds. A clip's `at`
  is read only as a `line:` string; seconds go in `t0`.
- Characters from a sentence → a spec in `scenes/cast/<id>.json` (build, limbs, outfit layers, hair, facial
  hair, glasses, hat); one owned colour each; leads 3–6 torso details, extras 1–3. Two people talking:
  1.5–1.8 D apart, both cheated 45–70° toward the camera side.

## Voice and sound law
- `audio/clean.wav` + `audio/clean.json` are made once and **never edited, trimmed, re-timed or replaced**.
  Each line's `text` must give exactly the words of `clean.json`, in order, **as heard**; a mismatch stops
  the film and names the line. `!` at a word's end = a real shout only.
- **The sound design is automatic** (the app derives effects from the film's actions and cuts) and the mix
  is the app's; music is added by the member by hand. This style has **no separate sound step and no mix
  numbers of its own**: help the automatic design with clear actions on words and cuts on hits, and note any
  sound tied to a cut the camera pass later moves.
- Captions: `captions: 'words'` — one or two big bold words per beat (the style's designed caption layer).

## Post numbers per kind of place (start from the row, then tune by eye)
| kind of place | air (haze) | depth of field | bloom | particles | grade |
|---|---|---|---|---|---|
| dark interior | density ≈ .03, light in air .25–.3 | aperture 26–30 | ≈ .3 above .75 | 1,000+ slow dust | gamma .84, contrast 1.12, colour tilt, vignette |
| underwater | denser (.034), moving shafts | aperture 26–30 | on the lights | bubbles, marine dust | deep teal, vignette |
| bright exterior by day | density ≈ .0055 from 8 D out, `far` 70–90 | aperture 9, nearK .22 | light | pollen, seeds (size ≈ .010) | gamma 1.10, saturation 1.28, vignette |
| exterior at night | coloured haze, lamps' light hanging in it | aperture 9 | warm bloom on windows/lamps | fireflies, snow or petals | cooler than the day, vignette |
| macro close-up of a prop | none | none or very light | on its highlights | a little dust | crisp: gamma up, contrast up |
A pass ending far below its row has turned its effects off, not tuned them. When an effect causes a
problem, fix the cause (limit by height, distance, place or time; keep it off faces) and keep the effect.

## Shading checks
- Key and shadow as two colours per place is most of the pass; a floor per place (`floor`, `keyMin`) stops
  mud. `film_check shade_jumps`: over **.05** is visible — every such row looked at on a strip.
  `film_check calm`: over **4 levels** fails. No flicker, ever; hard light changes sit on cuts (`steps`).

## The critic loop (the judge — never the builder)
- A NEW critic each round, blind: 6–10 of our full-size frames shuffled with the same number of bar
  pictures (bar tiles from `references/guide/tiles/` + stills from `references/bar/`), all cropped to
  600×800 under neutral names in `.suite/critic/r<N>/`; the which-is-which key stays in
  `.suite/critic/r<N>.key.txt`, which the critic never reads. The critic sees no lessons, no notes, no reasoning.
- Fixed answer form: `VERDICT: YES | NO` / `BIGGEST GAP:` (one sentence) / `FAULTS` (≤5, ranked,
  BLOCKING | MINOR, with a number against the bar and one concrete FIX) / `LAST REPORT:` (fixed | not fixed
  | worse) / `WHICH ARE THE FILM'S:` (its blind picks — the blind score is recorded in the lessons).
- **Fix only the BIGGEST GAP**, at its cause, radically — one cause, one change. A BLOCKING one-line fix
  may ride along. **The same fault twice = change the method, not the amount.** Never answer a critic by
  turning an effect down until it is gone, cutting a beat/character/set piece, or loosening a number.
- Round timing: Build — the OPENING as soon as it is staged and lit, then the whole film; Camera — whole
  film (strips of the fast moves in the set); Environment — per place, then whole film; Post — whole film,
  ≥1 picture per place; Shading — whole film, faces of every place.

## Environment crew (pass 3)
Contract first (`scenes/ENV_CONTRACT.md` + `blender/keep_clear.json`: layout to the coordinate, keep-clear
zones, place-local glbs, agreed material names, decal cell ranges, pattern period/phase, picture priority
list), then three tracks at once, one writer per file: **env-blender** (`blender/`, `assets/set/` — ships
each piece as soon as it passes its clay check, in the contract's order), **env-textures** (`assets/tex/` —
the member's own picture setup only; a failed sheet is replaced at once by prop-library props, never a bare
set; never pink/lilac/purple/magenta on a sprite sheet), **env-three** (`scenes/set.js` — starts at once on
the previz fallback, picks files up as they land). The set is built in Blender, always; never another way.

## PITFALLS — the traps that cost re-renders (read in full before each pass; headline selection)
- A character **beside the camera's image plane** (depth ≈ 0 from the lens, anywhere sideways) draws a
  solid ink frame for 1–6 frames — keep everyone clearly in front of or behind the lens plane on every frame.
- Nothing thin may end at a head (a hose behind a man read as an aerial growing out of him).
- Every flight checked on a full-rate strip: a camera through a head showed on ONE frame that sheets hid.
- First-strike clips need `rise` 6–8 frames or the hand pops (the guard caught a 259 px pop); every `drop`
  key needs a `from`; a prop that hides itself — hide an inner group instead.
- The camera floor raises a low push/park/follow to the nearest chest; `path` shots are never raised.
- Dark-interior post numbers on a bright exterior make a grey-white veil (haze `far` past the sky whitens it).
- A painted pattern has a period and a phase: modelled detail must line up with painted detail.
- Textures load once at page start: render only after `assets/` has gone quiet.
- Before fixing something odd, check the earlier pass (a "shading bug" was once drawn hair).
- Say exactly what you did not check.

## Desk mapping (how the app's tools run in our house — standing constraints)
The skill's tools (`check_preview`, `render_frames`, `film_sheet`, `film_probe`, `film_check`,
`blender_run`, `make_picture`, `tex_job`, `prop_library`, `narration`, `list_shots`) are the app's; at this
desk they map onto our machinery with two hard limits: **no rendering on the local VM at all** — frame
rendering runs through the GitHub fleet; and the **final render is Colab-only, after the owner's board
approval**. The builder authors files; the desk runs the checks and the critic rounds from outside.
