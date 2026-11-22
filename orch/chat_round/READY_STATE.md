# Chat round — READY STATE for the owner's real test (2026-11-22 ~17:15 EET)

**Status: READY — awaiting the owner's recorded WAV of the script of record.**
Script of record on file: `orch/chat_round/test_assets/script_owner_test_ar.md`
(the Fudai seawall story, 183 words, 60 s, six beat-timed sections).
When the WAV arrives, it + this script go through the director chat as the
real test (brief §D): chat → passes with the prop-truth gate → board stills
to the owner BEFORE any full render → run → master. The owner's eye is the
final gate.

## What this session finished (all Codex-seat work, one continuous conversation 01a20343-…)
- **Stage 4** (`b6e7927`): adjudicated hunt fixes A1–A8 + composer control
  row with REAL style wiring (registry from skills/, chat → project.json →
  pass/run records; unwired styles fail by name). Desk-verified live,
  including a TDZ defect the desk caught in check C and the seat fixed in
  the same session (validation before dispatch record).
- **Director decision-extraction fix** (`b41b765`): the greedy regex over
  raw codex stdout silently killed every non-shortcut director decision;
  replaced with a balanced scan. Desk-verified live (write_brief executed,
  props seeded).
- **Transcribe→align step** (`39bd1d9`): the pipeline's missing organ.
  ASR timings are aligned onto the script of record; clean.json carries
  script words on ASR timings; <80% alignment = named
  `asr_alignment_failed`. Desk-verified: fixture project aligned 83/83
  words (fraction 1.0) and `heart still` renders a frame — before this fix
  the engine aborted with MAKE_FILM word-mismatch on ASR mis-hearings.
- **Hunts**: one Opus + one GLM over the delta; no critical/major defect
  survived desk adjudication (`HUNTS_ADJUDICATION.md`). No fix turn spent.

## The watchmaker project — FIXTURE, not the real test
`projects/real-test-watchmaker` was created through the chat with a
desk-prepared story + prepared narration to exercise the path before the
owner's decision arrived. Per the owner's 17:00 decision it is NOT the
real test and was not driven further: no passes were completed on it, no
master exists. It remains in place as the wiring-verification fixture
(aligned clean.json + rendered still:
`shots/fixture-aligned-still-t4.1.png`).

## Named gaps the real test will still meet (honest list)
1. **No chat door for standalone transcription.** Timings are produced
   inside the full run's timing leg (after the passes) or by the desk CLI
   verb `heart transcribe`. A chat-created project cannot be pass-built
   until timings exist. (The run path itself is unaffected.)
2. **Composer Effort + Exact-shot-plan controls are badged "not wired
   yet"** in the UI — honest badges, not fake wiring.
3. **Berserk heading renders twice** (cosmetic; screenshot in shots/).
4. **Not wired (unchanged from the interface round):** Channels, Library,
   Memory, Routines, YouTube backends; Colab render leg; Gemini seat
   (awaits the owner's own sign-in).
5. **Hunt minors recorded, not fixed:** style registry rescanned per call,
   pass history unbounded, zero-duration interpolated words edge,
   transcript.txt retained on alignment failure (raw ASR, report-marked).

## App state
- Server running: `node server/server.js projects/accept-s6slice 18911`
  (desk instance, current HEAD code). Relaunch command if it dies:
  use `orch/chat_round/run_server.sh` env (CODEX_BIN + PATH) then the line
  above. Screenshots: `shots/home-screen.png`,
  `shots/berserk-chat-fixture-conversation.png`.
- Branch `ui/unified-interface`, HEAD `39bd1d9` (pushed).
- Pre-existing uncommitted changes NOT from this round (left untouched):
  `projects/accept-s6slice/{audio/clean.json, scenes/BIBLE.md,
  scenes/film.js, scenes/set.js}` and untracked older project dirs.
