# REAL TEST — stage 1 record (desk drive, subagent session) — 2026-11-22 ~17:22–17:40 EET

**Outcome: STOPPED at the GPT seat's usage limit, exactly the failure the owner
forecast at 16:38. No board exists. No render was started. Remaining work is
named below; resume requires a live builder (Codex) seat.**

Note: a parallel drive of the same test ran from the main chat (conversation
`chat-mwrzndmp-6cqnw`, records in `orch/chat_round/test_run/`, committed at
`78c6038`). This record covers the drive run from conversation
`chat-mwrzjxe5-zjitp`; both drives converged on the same project and the same
seat death.

## What completed
- **Conversation** `chat-mwrzjxe5-zjitp` created with the owner's materials:
  script of record (narration text), `owner_voice_fudai.wav` attached,
  style `cartoon-shorts` chosen via the chat's style field, priorities =
  the owner's approved 7-scene visualization (numbers as objects, 3 zones,
  key props, grave ending + loop cut).
- **Project `fudai-wall`** set up (see anomaly below): voice byte-identical
  (md5 `2d651a4d03c386b9b6736cb388395ab7`), `project.json` settings
  fps 30 / captions on / style cartoon-shorts, `.heart-git` snapshot
  "brief + voice attached".
- **Brief + props via the director chat** (`write_brief` tool_result):
  4 key props seeded — giant concrete seawall with steel flood gate @0.1,
  mayor's gravestone @0.5, neighbor village low seawall @0.9,
  giant tsunami wave @0.9.
- **Program extraction** (`heart transcribe`, the program's own verb):
  report ok; **186 script words aligned, aligned_fraction 0.957**
  (matched 94, substituted 84, interpolated 8, 1 ASR word dropped);
  `audio/clean.wav` byte-identical to the owner's recording.
  Captured to `orch/chat_round/test_assets/program_extraction.json`.
- **Build pass started through the chat** (job `pass-1795361170483`) after one
  failed start (below). The builder worked ~14 minutes and produced real
  scene code: new `scenes/BIBLE.md` ("Fudai Wall — Build Bible"), 7 cast
  specs (mayor, young_mayor, retired, villager, fisher, child, …),
  `scenes/film.js` with **37 shots** (node --check OK), `scenes/set.js`
  (syntax OK).

## Where it stopped — BY NAME
- **GPT/Codex seat usage limit hit mid-Build-round**: builder exec ended with
  "ERROR: You've hit your usage limit" (159,417 tokens used in the session).
  Build pass state: **failed** (builder failed), rounds completed 0.
  No probes, no prop-truth gate run, no GLM/Opus pass critics, no checkpoint.
- **The round-1 scene does not render yet**: the program's Editor preview
  action (`/api/action` preview, t=3.4) and one desk diagnostic
  `heart still` both returned the named engine error «المحرك لم يُرجع لقطة»
  (engine returned no frame). The builder died before its own review loop
  could find/fix the runtime fault. Local agents do not author scene code;
  the fix belongs to the builder seat.
- **Not done, by name:** Build pass completion · Camera pass · Environment
  pass · Post pass · Shading pass · prop-truth gate verdicts + gate crops ·
  board stills (Editor shows Board: no artifact; QC gates: script/voice/
  timing PASS, board/mix/master FAIL) · zoom crops for the rock measurement
  line and the pencil mark (their moments, ~50 s / ~53 s, are also outside
  the gate's 3-probe design — a gate limitation recorded in the round brief).

## Deviations from "chat only" — BY NAME
1. **Standalone transcription via `node bin/heart transcribe`** (the program's
   own CLI verb; READY_STATE gap #1: no chat door exists for it). Same verb
   the run's timing leg invokes.
2. **One diagnostic `heart still` CLI run** (t=3.4) to name the render
   failure; produced no still, changed nothing.
3. **Setup anomaly:** the first `create_project` returned "Project already
   exists: fudai-wall" while the project stood fully created with correct
   artifacts (the parallel main-chat drive created it first; the two drives
   raced). The saved thread `chat-mwrzjxe5-zjitp` therefore has
   `project: null`; all later steps worked because the server's active
   project is fudai-wall and the director's tools address it by name/active
   dir. Recorded, not papered over.
4. **First Build-pass start failed** ("Unknown pass" — the director seat's
   start_pass argument); the retry, spelling the pass id exactly, started
   the pass through the chat.

## Screenshots (owner's request)
- `orch/chat_round/shots/test-berserk-live.png` — Berserk with the Fudai
  conversation selected while the Build pass was underway (job feed
  streaming; the known double-heading cosmetic defect is visible, as-is).
- `orch/chat_round/shots/test-board-view.png` — Editor view after the stop:
  Script & voice ✓, Timing ✓, Board "No matching artifact on disk",
  QC gates script/voice/timing PASS · board/mix/master FAIL.

## Resume condition
A live Codex builder seat (owner is switching the GPT seat to a new account;
sign-in is his step). Then, in the existing conversation: re-run the Build
pass (its fix loop should catch the scene runtime fault), continue the
passes in order, produce the board, stop for the owner's eye before any
render.
