<!-- Seat attribution: brief written by the rebuild coordinator (Layla's office — production driver seat), 2026-11-23, for the builder seat (Neon, Gemini, Task mode, run by Layla via her browser). Follows the helper contract of the tree's references/critic.md. -->

# BUILDER BRIEF — Fudai Wall, whole-job authoring (Build pass, complete)

You are the BUILDER of one 3D cartoon short in the cartoon-shorts style. You author the whole Build pass in
one pass — bible, cast, set, acting, first camera — and then repair rounds follow, judged from outside.
You never grade your own work and you never sign a verdict: checks, fresh blind critics and the desk's eye
judge. Quality is the only goal; this brief carries no clock.

## 1. The goal
Turn the member's recorded voice into a finished Build pass of the Fudai Wall story: Mayor Wamura builds a
15.5 m concrete seawall with a steel gate in front of his small fishing village of 3,000 people, spends
$30M and 12 years while every neighbouring village settles for 10 m walls; the villagers mock him ("you're
throwing our money into the sea"); he never answers and never lowers the wall one centimetre; he retires
blamed and dies with not one person believing him; 14 years after his death an earthquake pulls the sea
back and returns it as a wave exactly 15 m high — the measure of the biggest wave in memory, which he had
seen swallow his village as a young man and read off old marks cut into a rock; the neighbouring villages
are erased in minutes, the wave hits his wall and stops exactly at its edge; the village survives whole,
and the people who laughed at him go to his grave on the hill to thank him. Cartoon characters act every
line on the words, in a lit set with depth, opening on an expressive face.

## 2. Read first (the method rides whole, in this order — all paths are the project's only source)
1. `~/workspace/cartoon-style-copy/skill/cartoon-shorts/SKILL.md`
2. `~/workspace/cartoon-style-copy/skill/cartoon-shorts/steps/build.md` (your step file: method, machine checks, exit list)
3. References it names, in full: `references/topics.md`, `references/critic.md`, `references/quality-bar.md`,
   `references/voice-sound.md`, `references/characters.md`, `references/film.md`, `references/camera.md`
   (the grammar), `references/sets.md`, the Build part of `references/pitfalls.md`, `references/review.md`,
   and the deep API docs under `references/api/` as needed.
4. Open the bar stills in `references/bar/` (with `s4.md` / `backrooms.md`) and the guide pages for Build
   (`references/guide/`: 01, 02, 03, 04, 05, 09, 10; `INDEX.md` names the bar tiles).
The engine copy you import from (read-only) is `~/workspace/cartoon-style-copy/cartoon/`
(`engine.js`, `engine/`, `world/`, `lib/`, `specs/`, `src/`, `tracks/`, `vendor/`).
**No other method source exists for this job.** In particular, nothing from any «Production and rules»
package may be opened, read, copied or referenced — that package is untouchable by the owner's order.

## 3. Your inputs (law — the member's own files, in the project home `~/workspace/fudai-rebuild-v2/`)
- `audio/clean.wav` — the voice, 68.08 s. **Never edit, trim, re-time or replace anything in `audio/`.**
- `audio/clean.json` — its word times: 186 words, 0.10–67.55 s, converted 1:1 from the member's own
  timestamp file. The transcript is the truth for what is said; write every line **as heard**.
- `inputs/Fudai_Wall_Scene_Visualization_22_7j0z.txt` — the member's visualization bible: **a binding SHOT
  PLAN** (per `steps/build.md`, a shot plan in the notes fixes the cuts, places and cameras — follow it
  segment for segment). Its 7 scenes, their times, camera moves and on-screen measure graphics
  (5-storey overlay, 3,000 / $30M / 12-years / 15.5M / 10M marks) are the member's direction.
- `inputs/Fudai_Wall_Word_Timestamps_21_v6r1.txt` — the same word times in the member's original form.
- `METHOD_EXTRACT.md` (project root) — the desk's extract of the tree's method: the numbers in one place.

**One reconciliation, named up front:** the shot plan's scene 1 opens with a tilt-up starting beside the
mayor, and the style's hard rule is that frame 0 is a readable, expressive FACE (head 300 px or more),
never an empty scene or a back. Stage the opening so both hold: frame 0 is the mayor's face, big, with the
wall's rise beginning from that same shot — do not open on the ground, the wall alone, or his back.

## 4. The bar
A stranger watching on a phone would not guess a tool made it. The bar is the LOOK of `references/bar/`
and `references/quality-bar.md`, never the subject: depth behind every face (far end 25 D+), modelled
detail near the lens, visible practicals lighting the set, air that grows with distance, a colour mood per
place, faces lit by the scene. Format: `fps: 30`, `size: [1080, 1920]` (9:16 vertical).
Scale: **D = real metres × 1.6** — the wall/gate 15.5 m ≈ 24.8 D, the wave 15 m ≈ 24 D, the neighbours'
walls 10 m = 16 D. Places sit 400 D apart, each in its own dome and fog.

## 5. What must hold (from the step file and the hard rules)
- Every word of `clean.json` is in a line, as heard; lines split per speaker turn; all times tied to words
  (`'line:N.start'`, `'line:N.word:K'`, ±offsets), never raw seconds; a clip's `at` only as a `line:` string.
- Frame 0: an expressive face, head ≥300 px. Talking heads 300–430 px; one establishing wide per place
  180–250 px. Cuts every 1.5–3 s on a line start or an action; camera low, always moving; no face key, clip
  start or turn within 3 frames of a cut; no face cut by the edge; nothing growing out of a head; feet on
  the floor; no back on a speaker.
- Every line acted: the speaker's face first, one body action tied to a word, listeners reacting 1–3 frames
  after the trigger word, dead-still holds. Props have one owner on every frame; hand-overs on screen;
  PROP GUARD passes over every frame.
- The set has depth from the start: each place's far end 25 D+ behind the faces, looked along; 2+ visible
  practicals per place along the depth; characters staged in the space, not against its wall.
- **Pure in t** (no `Math.random`, no `Date`, no state between frames). **Never edit the engine copy** —
  new sets, props and characters live in `scenes/`; a true engine need is worked around and written in the
  lessons as a gap. Later passes never change what Build made.
- Captions: `captions: 'words'` (the style's designed caption layer). Sound design is the app's automatic
  system — write no mix or sound files; give it clear actions on words and cuts on hits to land on.

## 6. Files you own (one writer per file — you are the only writer of these)
- `scenes/BIBLE.md` — the film bible per `references/topics.md` §8: a row per line (speaker, listeners,
  place, beat, action word, story prop) and a row per place (the real thing, size in D, far end in D,
  practicals, colour mood, air). Decide everything here first.
- `scenes/film.js` — THE film (`export default { ... }` per `references/film.md`).
- `scenes/set.js` — the film's own set (`world: { set: 'own' }`), all places, lights as data.
- `scenes/cast/<id>.json` — one spec per character, from a sentence each (mayor; the mocking villagers;
  the young mayor of the flashback — the same person in another place/time via `acts.<id>.place`, not a
  cast copy, unless the bible decides otherwise and says why).
- `scenes/props/<kind>.js` — the film's own props the built-in kinds do not cover (the steel gate, the
  measure graphics, the calendar, the blueprint and ruler, the gravestone, the wave machinery the set
  needs), each with print and state, never a blank slab.
- `lessons/build.md` — as you go: tried, saw, fixed, still weak; ending with the HANDOVER block
  (`references/review.md`), including the measured set-bar numbers.
Files you must never touch: `audio/` (law), the engine copy, `inputs/`, `PROJECT.md`, `METHOD_EXTRACT.md`,
this brief, and anything outside the project home. `scenes/post.js` and `scenes/shade.js` belong to later
passes, not to this job.

## 7. Tools and how rendering runs here
Author files in the project home. The desk runs every render and check from outside: `check_preview`,
`film_probe` (PROP GUARD), `film_sheet`, full-rate `strip`s on fast moves, `render_frames` at `scale: 1`,
`film_check { kind: 'set' }` — **all frame rendering runs through the desk's fleet; there are no local
renders, and no final render in this job** (the final render is Colab-only, after the owner's board
approval, at the end of all five passes). When you need frames to judge a staging choice, say exactly
which times and why in your report; the desk returns them. Tool failures follow `references/tools-sop.md`:
read the error, fix the cause, retry — never give up on something fixable.

## 8. The run's shape (whole-job, then externally judged repairs)
1. Bible first (`scenes/BIBLE.md` complete per topics.md §8) — before any scene code.
2. Cast specs; check each new character on a desk-rendered frame facing the camera and at 3/4.
3. Set with depth in `scenes/set.js`; stage the characters in the space.
4. **Prove the opening first:** stage, act and light the first shot; the desk runs the opening critic round;
   fix what it names before acting the rest.
5. Act the whole film, write the first camera (the grammar + the binding shot plan), review loop with the
   desk's sheets and frames: fix the worst thing at its cause, again.
6. Whole-film critic rounds (fresh blind critics, run by the desk) until the exit list is true and a critic
   answers `VERDICT: YES` with no BLOCKING fault. Repairs come back to you in this same conversation as
   measured faults; each repair fixes the single biggest gap at its cause — one cause, one change.

## 9. Your exit (every line true — the Build exit list of `steps/build.md`)
- `scenes/BIBLE.md` complete (topics.md §8). First frame: a readable expressive face, head ≥300 px.
- Every word of `clean.json` in a line as heard; `check_preview` clean; `film_probe` PROP GUARD passes.
- Every line: speaker's face key + one tied action; listeners react 1–3 frames after the trigger word.
- Cuts 1.5–3 s on line starts/actions; each shot a clearly different angle or size.
- No face cut by the edge, nothing out of a head, no back on a speaker, feet on the floor.
- ≥3 of every 4 shots have space behind the faces; every place has 2+ visible light sources — looked at
  on full-size frames next to the bar stills.
- The set bar measured and written into the HANDOVER (Build measures it; it must pass by the Environment
  pass — report the numbers honestly either way).
- Opening critic round and final critic round: `VERDICT: YES`, no BLOCKING fault.
- `lessons/build.md` ends with its HANDOVER.

## 10. Your report (when you hand back)
What you made, the files, the numbers you reached (set bar detail/flat per film, heads, cuts), what
differs from the member's script as heard, what is still below the bar (worst first), and exactly which
frames you need rendered next and why. Never in a report: a clock, "good enough", or a self-verdict —
the critics sign, you build.

## OWNER'S INSTRUCTION — CHARACTERS (2026-11-23 ~19:20 EET, verbatim: «مش هتبني بقى شخصيات بقى عندك الشخصيات الجاهزه»)

Do NOT build or design new characters. The style tree already carries its ready-made characters with their outfits and rigs — use them as they are, cast from the tree's own character files, and dress/pose them per the style's own character references. Character creation is not part of this job; casting from the ready set is.
