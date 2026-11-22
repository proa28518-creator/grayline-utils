# RUN 8 — THE WRITE STEP, AS THE APP SENDS IT (reconstructed verbatim from the app bundle)

Source: Creatorize Suite 0.28.2, `out/main/index.js`, `buildPrompt()` — for a
`kind: "script"` run on a non-documentary, non-Roblox style (the cartoon style
falls into this generic script branch), the app sends the text below. The
member's own scripting skill (Settings > AI engines) is OFF by default, so no
SCRIPT_SKILL_PROMPT block is inserted. Numbers filled from the app's own tables:
English `wpm: 150`; target length 52 s → ~130 words; their hard band ±10 % →
**117–143 spoken words**.

---

Write the narration script for an explainer video about: an original short
story whose engine is non-stop movement — a chase down a city street — that
escalates beat by beat and ends with a payoff worth sharing.

Target: about 0:52 of narration, roughly 130 words (voiceovers run ~150 words
per minute).

Visual style of the video: 3D Cartoon Shorts (9:16): a short film in the
charsys film format (scenes/film.js): characters with drawn faces act out the
story in rich 3D sets, with real camera work and a film finish. Vertical
1080×1920.

1. Research first with WebSearch / WebFetch. Prefer primary sources and check
   the key numbers, names and dates in at least two places. Write research.md:
   the facts you use, each with its source link.
2. Write script.txt: only what the narrator says, in plain spoken sentences,
   grouped into sections with "## Section title" lines (headings are not read
   aloud). Write numbers, units and symbols the way they are spoken ("four
   megabytes"). No stage directions, except as [short notes] on a line of
   their own.
3. Open with a hook in the first ten seconds, keep one clear line of argument,
   and use concrete examples that can be shown on screen in this style.
4. Length is a hard requirement: the spoken words (not the ## headings or
   [notes]) must be between 117 and 143. Count them before you finish (e.g. a
   one-line script) and cut or add until they fit.
If script.txt already exists, revise it following the notes instead of
starting over. Don't build scenes or touch audio.
Finish with 2-3 short sentences: the angle you chose, the word count and the
estimated length.
Notes from the user: MOVEMENT FIRST — the story's engine is continuous motion
(chase / ride / race / climb), traveling cameras, action in nearly every shot.
VIRAL SHAPE — hook inside the first line, visible escalation, a payoff ending
people would share (gag, twist, or heart-hit). Feasible in the cartoon kits
(park / city-street class sets), 1–2 characters, simple props. Fully original.

---

## Where the app window was assumed, and what was done instead (logged)

- **The app window / member UI:** in the app, a member types the topic into
  the Write node and reads script.txt in the editor. Here the topic and notes
  are the owner's standing creative brief (above), and script.txt was written
  to the project root directly — the same file the app's next steps read.
- **Point 1 (research):** the topic is an original fiction, not a factual
  subject; there are no facts, names or numbers to verify, so no research.md
  was produced. (Their Roblox-branch wording of the same step says it plainly:
  "Research only when the topic needs real facts.")
- **The agent:** the app runs this prompt on its in-process Claude agent
  inside the member's project, with the cartoon-shorts skill copied in. This
  run did the same with our agent stack: the skill sits at
  `.claude/skills/cartoon-shorts/` in this project, and the script was written
  to be decomposed by that skill's Build step (`references/topics.md`: every
  line carries an action word and a story prop; a film over 30 s has 3+
  beats — this script has 4).
- **No scripting skill:** the member-side "Your scripting skill" is off, so
  the default guidance above governed, exactly as shipped.
