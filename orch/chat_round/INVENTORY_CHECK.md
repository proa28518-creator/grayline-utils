# Inventory check — 2026-11-22

Compared `orch/PARTS_INVENTORY.md` with the checked-in renderer/server, the bundle and video maps, and `orch/HEART_GAP_AUDIT.md`. Evidence below describes repository reality before this chat build.

## Discrepancies

- **A1 Desktop shell — inventory says PROVEN; this checkout proves the Electron shell exists, but not its current boot/quit behavior.** Evidence: `app/main.js`, `app/preload.js`, and `app/package.json` exist; no execution evidence is part of the code inventory. `orch/renderer-boot/tour-report.json` is prior session evidence, not an independent current run.
- **A3 Berserk run control — inventory says PROVEN acceptance run; the checkout contains real run/stop/steer controls, but the current evidence is historical and not independently repeated in this round.** Evidence: `app/renderer/app.js` (`berserkPage`, `/api/run`, `/api/stop`, `/api/steer`) and `server/server.js` (`/api/run`, `/api/stop`).
- **A5 project creation — form route is present, but inventory's PROVEN label is stronger than code evidence alone.** Evidence: `app/renderer/app.js` (`newPage`, `/api/projects/new`) and `server/server.js:286-310` invoke `bin/heart new`, attach audio, write brief/script, and snapshot.
- **A6 frame annotation — PARTIAL accurately captures storage without a fix loop.** Evidence: `server/server.js` `/api/annotations` records `captured_unwired`; UI reports the response note. `orch/HEART_GAP_AUDIT.md` G2 further says critics grade self-reported text rather than frames.
- **A7 placeholder list is incomplete: Thumbnails also exists as an unwired section.** Evidence: `app/renderer/app.js` nav includes only listed names today, while `orch/renderer-boot/page-thumbnails.txt` records a Thumbnails screen in the shell tour and the bundle structure map describes thumbnails as an honest unwired section. The inventory should account for it in a later doc update.
- **A8 seats panel — the UI and probes exist, but no general seat-call API exists.** Evidence: `server/server.js:80-109` probes Codex login, Gemini session, LLMsRelay, and APInex; `app/renderer/app.js` calls `/api/connections`. Model calls currently appear in the pass runner (`server/server.js` bounded Codex builder + GLM/Opus critics) and `bin/heart consult` (APInex), not a director/chat route.
- **B1 API — present, but “PROVEN” does not mean the full inventory's implied chat API; none existed before this change.** Evidence: `server/server.js` route table contains project, run, pass, dispatch, seat, annotation, and job routes; no conversation routes before this round.
- **B2 seven-leg executor — label overstates completed behavior.** The run path executes timing, checks existing board artifacts or dispatches stills on request, and sound/mix; it can block on missing artifacts. Evidence: `server/server.js` `/api/run` and `bin/heart` timing/sound/mix verbs. Export requires existing master or dispatched frames; the Colab render leg remains undispatchable. This is not a universal end-to-end export guarantee.
- **B3 pass runner — PARTIAL is accurate; only Build was previously exercised per the inventory.** Evidence: `server/passes.js`, `/api/passes/run`, and audit G1/G2. Remaining pass states are code, not evidence of live success.
- **B4 critics — “PROVEN on Build” needs qualification.** Evidence: `server/server.js` runs GLM and then a fresh Opus critic in the pass path, but `orch/HEART_GAP_AUDIT.md` G2 identifies that the critic evidence is still change text/checks rather than direct frame critique. Thus the critic call path is exercised while the visual critic capability is partial.
- **B5 prop-truth gate — MISSING is accurate.** Evidence: `server/server.js:129-168` measured artifact gates cover script, voice, timing, board, mix, master; no zoom-crop/key-prop/leftover checks. `orch/CHAT_ROUND_BRIEF.md` §C records the uncovered ring/chocolate failures.
- **B6 dispatch — wording “GitHub Actions (stills + assembly)” is accurate, but does not include a working Colab render path.** Evidence: `server/dispatch.js`, `/api/dispatch/stills`, `/api/dispatch/assembly`; UI labels the film queue not dispatchable.
- **C2 timings — partial label accurate; “in-program ASR missing” confirmed.** Evidence: `bin/heart` implements timing from owner timings, no transcription verb; audit G7 documents no shared ASR/align pipeline.
- **C3 sound spine — inventory understates remaining code divergence.** Evidence: audit G6 lists separate per-film `build_bed*.py` and a known old `loop_to()` hang in Stories 3/4/5; a fix exists only in Story 6's copy.
- **D2 lessons memory / D3 retention analysis / D4 shared asset library — MISSING is accurate for production-backed capabilities; the screens themselves are placeholders.** Evidence: renderer page fallback in `app/renderer/app.js`, plus audit and capability map.

## Pieces found outside or not represented by the inventory

- **Thumbnails shell section** — shown in `orch/renderer-boot/page-thumbnails.txt` and named by the bundle map, but absent from A7's screen list and current `navItems`.
- **The audited pipeline gaps are not individually represented as inventory pieces:** audio preparation, transcription/ASR, verified alignment report, shared sound-design/event contract, lane mixer, and shared mix gate. Evidence: `orch/HEART_GAP_AUDIT.md` §2 (G6–G8), `bin/heart`, and project audio layouts.
- **Whole-film sweep/shading/event host capabilities** exist in vendored `chost.js` but are not wired into the program's tooling. Evidence: `orch/HEART_GAP_AUDIT.md` G12 final paragraph.

No inventory rows were silently edited. The discrepancies above are reported for a later inventory revision.
