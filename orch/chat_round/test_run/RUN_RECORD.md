# REAL TEST RUN RECORD — Fudai, «the wall that saved the village» (2026-11-22)

**Outcome: STOPPED at the Build pass — the GPT seat hit its usage limit mid-round.
The board is NOT complete; nothing was rendered; the owner's eye gate was not reached.**
Everything below is exactly as far as the program got, with every deviation named.

## Identity
- Project: **fudai-wall** (`projects/fudai-wall/`)
- Conversations: setup thread `chat-mwrzisgb-mriy2` (created the project via the
  director's `create_project`); project thread `chat-mwrzndmp-6cqnw` (drove the
  passes — see Deviation 2). Full transcripts: `conversation_1_setup.json`,
  `conversation_2_project.json` in this folder.
- Inputs: script of record `test_assets/script_owner_test_ar.md` (186 script
  words as tokenized by the aligner; owner's count 183), owner's WAV
  `test_assets/owner_voice_fudai.wav` (68.08 s, PCM 24k mono), owner's word
  timestamps + 7-scene visualization bible (both placed in the conversation as
  his "what matters most"). Style **cartoon-shorts** chosen at conversation
  creation (the composer's style field); fps **30**.

## What completed through the program
1. **Setup (director chat)** — `create_project` executed server-side: project
   scaffolded, `voice_owner.wav` **byte-identical** to the owner's file
   (verified with `cmp`), `script.txt` = the 11 spoken lines, `brief.md` =
   story + his visualization bible as direction, `props.json` seeded with his
   6 key props, `project.json` settings {fps 30, style cartoon-shorts,
   captions on}. (The director's reply prose oddly claimed its tools were
   unavailable while its own tool_result succeeded — narration mismatch,
   recorded here; the tool result is the true state.)
2. **Timing (transcribe + align)** — see Deviation 1 for the door used.
   ASR = faster-whisper small/ar (the program's own engine + pins).
   **aligned_fraction 0.957** (gate ≥ 0.80): 186 script words — 94 matched,
   84 substituted, 8 interpolated, 1 ASR word dropped. `audio/clean.json`
   carries the script's exact words on ASR timings, lines 1–11, span
   0.0–67.86 s. `heart timing` report ok (186 entries; voice check pass,
   68.08 s). Files: `clean.json`, `transcribe_report.json`, `timing_report.json`.
3. **Extraction check (owner's requested comparison)** — `extraction_check.json`:
   the program's raw ASR heard 178 words with heavy Egyptian-dialect
   mis-hearings (سور→صور, عمدة→عمضة, الموج→المج, بالقلم→بالألم, …; full block
   list in the file). The owner's own extraction = 186 words, matching the
   script of record. The align step is what makes the film buildable despite
   the raw ASR errors: clean.json words are the script's, timings are the
   ASR's. Numbers were heard as digits (3000, 30) — same form as the owner's
   own extraction.

## Build pass — started through the chat, seat died mid-round
- Started from conversation 2: "Go, start the Build pass now." → job
  `pass-1795361113671`, style validation passed (cartoon-shorts), baseline
  snapshots committed in the project's `.heart-git`.
- Builder round 1 ran ~13 minutes and produced real work (all still on disk,
  syntax-verified by the desk with `node --check`): `scenes/film.js`,
  `scenes/set.js`, `scenes/BIBLE.md`, cast mayor / young_mayor / retired /
  villager / fisher / child, and a full `props.json` rewrite — 15 props with
  appearsAt + cropBoxes covering all 6 owner key props (giant concrete
  seawall with steel flood gate; 15.5M gate measuring line; neighbor 10M
  seawall; 15M tsunami wave; engraved high-water rock mark @49.36 s;
  childhood pencil height mark) + 20 set-dressing allowances.
  Copy: `props_after_build_round1.json`.
- **Failure (named, verbatim from the seat):** `ERROR: You've hit your usage
  limit… try again at Dec 21st, 2026 10:06 PM.` — 159,417 tokens consumed by
  the round. The builder exited non-zero → pass state **failed** at the
  builder step, BEFORE probes, BEFORE the prop-truth gate, BEFORE critics.
  No checkpoint. Pass state copy: `build_pass_state.json`.
- Note: template cast files `bride.json` / `groom.json` still exist in
  `scenes/cast/` (template residue on disk; whether they appear in any frame
  is a question for the prop gate's leftover scan, which never ran).

## Deviations (by name)
1. **Timing door** — no chat door exists for standalone transcription
   (READY_STATE named gap #1). Timing was produced with the program's own
   CLI verbs `heart transcribe` + `heart timing` — the exact commands the
   run's timing leg spawns — invoked from the desk, not from the chat.
2. **Two conversations instead of one** — after `create_project`, the setup
   thread's persisted `project` binding was lost (merge-on-save race: a
   concurrent read's `touchThread` bump won the updatedAt comparison, and
   the merge kept the older scalar fields while union-preserving messages —
   all 8 messages survived; the project field did not). The pass-start
   shortcut therefore never fired in thread 1 (the director was consulted
   instead and returned an invalid pass argument → "Unknown pass").
   Recovery used the program's own conversation-create door with the
   `project` field set — no state files were hand-edited.
3. **First setup attempt cut off** — the desk server restarted mid-director-
   call (process replaced; cause outside the program). The retry in the same
   thread completed setup. Recorded here as an infrastructure incident, not
   a program step.

## Remaining (blocked on the GPT seat — builder, director and prop-gate
vision all ride the same Codex seat; quota resets Dec 21, 2026 22:06
per the seat's own error)
- Build pass: re-start through the chat → probes → **prop-truth gate**
  (zoom crops of the 15 declared props incl. the owner's 6) → GLM critic →
  fixes → fresh Opus critic → checkpoint.
- Camera → Environment → Post → Shading passes, in order, same discipline.
- Board stills for the owner's eye (STOP point — no render was started,
  no master exists).
- Style note for the desk: the owner's bible asks for 2D flat characters on
  3D toon sets; the program's cartoon-shorts style builds its own 3D
  characters. The bible went in as direction verbatim; how far the builder
  followed it can only be judged from frames — and no frames exist yet.
