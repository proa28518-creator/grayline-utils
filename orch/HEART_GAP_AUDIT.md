# HEART GAP AUDIT — Creatorize app vs our heart-studio program

**Date:** 2026-11-22 · **Auditor:** Layla's desk (3 parallel research tracks + first-hand verification)
**App reference:** Suite 0.28.2 teardown at `~/workspace/creatorize-teardown/` (`unpacked/asar/` = app code + `pipeline-scripts/`, `unpacked/win/resources/templates/` = 29 template folders, 19 skills, `host/`), plus the 0.28.3 `rxhost.js` for the one protocol change that version made.
**Our side:** `~/workspace/heart-studio/` (repo grayline-utils): `server/server.js`, `bin/heart`, `fleet/render-chunk.ts`, `fleet/orchestrate.py`, `skills/cartoon-shorts/`, `projects/story{3,4,5,6}*`.

**Owner's diagnosis being tested:** "the heart doesn't work like his app — something is missing on our side," with output quality varying film to film.
**Verdict: the diagnosis is correct, and the missing part is not files.** A manifest diff already proved every skill/template file in 0.28.3 is byte-identical to our 0.28.2 copies. What we did not adopt is the machinery that *drives* those files: the step executor, the fixed Run/Mix pipeline spine, the measured tool/critic surface, per-project git state, and parts of the render-host protocol. We copied the skill prose, the step names and the panel UI — the enforcement underneath stayed behind.

**Standing rule recorded during this audit (owner's word 2026-11-22 ~05:56): 60 fps is CANCELLED — production returns to 24/30 fps as before.** Story 6 stays as delivered at 60 fps; the cancellation is forward-looking only. This matches the machinery on both sides: our fleet renderer is hard-coded `FPS = 30` (`fleet/render-chunk.ts:31`) and the app's host export defaults to `fps = 30` (`chost.js` `exportVideo({…, fps = 30, …})`, teardown L261). No 60 fps path exists in the heart program; Story 6's 60 was a one-off Colab pack.

---

## 0. What matches (honest baseline)

- **Same step spine, same names/order.** App `CARTOON_STEPS` (`asar/out/main/index.js:30612-30618`: build → camera → environment → post → shading over Write/Add/Run/Mix/Export) vs ours: `server/server.js:10-11` `STEPS = ['write','add','run','build','mix','export']`, `SUBSTEPS = ['camera','environment','post','shading']`; `skills/cartoon-shorts/steps/` holds the same five step files with the same "fresh critic YES before next pass" rule.
- **Host files are verbatim and undrifted (measured today).** `md5sum` of `__suite/chost.js` and `__suite/cartoon.html` is identical across all five projects (demo-ring, story3–story6) **and** identical to the teardown's 0.28.2 `templates/host/chost.js` (`479445f7…`). The render/host half of the app genuinely is running on our side.
- **Script-edit invalidation:** `server.js` `scriptSaved()` resets run/build/mix/export + approvals when the script changes — a real equivalent of the app's dirty-tracking.
- **Resumable render:** `fleet/orchestrate.py:13-16` skips chunks already in `run_map.tsv` — comparable resumability, for the render leg only.

---

## 1. Orchestration gaps

### G1 — HIGH — Our step buttons have no executor behind them; the app's do
- **App:** Steps are executable records. `index.js:20299` `runStep()` → `runStepInner()` → `runStepWith()` runs the Python pipeline per step with cancellation cleanup ("Cancelled. Nothing from this step was kept"); per-pass Claude invocation is constructed in code (`index.js:45279-45284`: *"Read ${S}/SKILL.md, then ${S}/${step.file}, and follow them"*). In-process Agent SDK, resumable sessions, `mcp__suite__*` tools (`run_step / stop_step / step_settings / video_state`).
- **We:** `server/server.js` `/api/step` only validates order and sets `state.steps[step] = 'requested'` + a log line — nothing spawns, polls or executes. `bin/heart` offers `new|serve|still|models|consult|critic` — no `run` command at all. A "requested" step sits until a human/external agent notices `panel_state.json` and hand-drives it.
- **Why it varies quality:** in the app, pressing a button guarantees the same machinery runs every film; for us, execution depends on who picks it up, so steps get skipped, reordered, or improvised per film.
- **Fix shape:** a worker watching `panel_state.json` for `requested`, dispatching the step (pipeline script or an agent session with the step file), writing back via `/api/setstep`.

### G2 — HIGH — Builder/critic tool surface: ~80 enforced tools vs 2 chat tools; our critic grades self-reported text, not frames
- **App:** ~80 `mcp__suite__*` tools (`film_check, film_passes, film_probe, film_sheet, critic_shot, render_frames, render_view, check_preview, match_shot, blender_run, make_image, sfx, set_music, add_issue/resolve_issue…`). The set bar is *measured by the app* (`film_check {kind:'set'}`: ≥22% detailed set per shot); export calls a below-bar film unfinished. Critics see actual frames shuffled with bar frames.
- **We:** `mcp/apinex_mcp.py` exposes exactly 2 tools (`apinex_chat`, `apinex_models`) — pure text chat. `bin/heart` `cmdCritic` sends a *text evidence file the builder wrote* to GLM (`CRITIC_MODEL = 'free/glm-5.3'`, "Judge ONLY the evidence below"). The only visual tool is `heart still` (one frame). None of the tools the copied skill tells the builder to call (`render_frames, film_sheet, film_check, check_preview, blender_run, make_picture, tex_job`) exist in our program.
- **Fix shape:** a minimal `mcp__heart__` set — `film_check` (set-bar measurement), `film_sheet`, `render_frames` (batch stills) — and make `heart critic` assemble frame evidence itself instead of accepting a builder-authored file.

### G3 — MEDIUM — Step gating is honor-system status strings, not artifact prerequisites
- **App:** Steps check the filesystem: `clean` throws *"Add a voiceover first (audio/source.*)"*; `timeline` throws if `clean.wav` is missing; `sound` auto-runs timeline first if words are untimed; mix prints hard pass criteria (see §2).
- **We:** `/api/step` checks only `state.steps[prev] === 'done'`, but `/api/setstep` and `/api/state` let any caller set any step to `done` with **no artifact existence check** — nothing verifies `clean.wav`, `timeline.json`, stills, or `final_mix.wav` exist.
- **Fix shape:** per-step artifact predicates in `/api/setstep` before accepting `done`.

### G4 — MEDIUM-HIGH — No per-project git undo; state is one overwritten JSON file
- **App:** The installer installs git explicitly as "project edit history = undo". `index.js:17568-17577` `ensureRepo()` (`git init` + "Project created" commit), `snapshotOnce()` commits every edit, `revertRange()`/`restoreTo()`/`reapplyRange()` give per-edit undo/redo, plus repo repair. `project.json` is deliberately kept git-revertible.
- **We:** `bin/heart` `cmdNew()` copies the demo-ring template — no `git init`, no snapshots anywhere in `bin/heart`/`server.js`/`fleet/orchestrate.py`. All panel state is one `panel_state.json`, atomically overwritten (`server.js` `persist()`: tmp+rename) — atomic but history-free; `scriptSaved()`'s reset is destructive with no restore path. (Story 6's 13 hand-made `scenes_backup_pre*` folders are the manual substitute — proof the need is real.)
- **Fix shape:** `git init` + initial commit in `cmdNew`; a `snapshot()` commit hook on step completion in `server.js`.

### G5 — MEDIUM — No standing driver, no session continuity, no update/integrity path
- **App:** Resumable in-process agent sessions (ids persisted, `maxTurns: 500`, `index.js:58`); hourly update checks (`electronUpdater`, L5795-5804) with launcher pause state; a separate Launcher watchdog (`ensureLauncher()` L1517, `retryLauncher()` L1583) for repair/rollback.
- **We:** The resident-driver design (`DRIVER.md`: Hydrogen in tmux, `driver/checkpoints.md`) was retired by the same file's final section ("ALL WORK ON THE FLEET… resident-driver seat is RETIRED"); checkpoints stop at 2026-11-19. Since then each film is sequenced by a fresh prose brief. Install is one-shot `bash install.sh` — no updater, no integrity manifest, so Kali/fleet copies can silently drift from the desk copy.
- **Fix shape:** a lightweight `heart drive` loop over `panel_state.json` + checkpoints, or fold the TASK.md/checkpoint discipline into `fleet/orchestrate.py` as a full-pipeline state machine; `heart update` = git pull + manifest verify.

---

## 2. Pipeline spine gaps (Run/Mix)

The app ships a fixed, tested spine in `asar/pipeline-scripts/` (11 files, 1,664 lines): `setup.py → init_project.py → audio_prep.py → transcribe.py → align.py → sound_design.py (+sfxlib.py) → lanes_mix.py → mix.py`, plus `sheet.py` and `fetch_images.py`. Step-by-step, ours is:

| Spine step | App guarantee | Ours |
|---|---|---|
| Setup | `setup.py` idempotent env gate (ffmpeg, Node ≥18, Chrome, python libs) | **Skipped** — no equivalent anywhere |
| Scaffold | `init_project.py --audio` vendors engine+three+fonts, writes `project.json`, `audio/source.*` | **Ad-hoc** — `heart new` copies demo-ring, blanks `script.txt`, no `--audio` handling at all |
| Audio prep | `clean.wav/raw.wav/cuts.json/prep_report.json`, pauses tightened to 110–200 ms, click test at every join | **Dropped after Story 3.** Stories 3 (and demo-ring/rooftop) have the full app-shaped set; **Story 4/5/6 `audio/` contains only `clean.json`** — no `clean.wav`, no cuts, no report; the raw owner WAV at project root is loaded directly by the mix script |
| Transcribe | whisper draft → human-corrected `transcript.txt` | **Skipped** — zero `transcript*.txt` in any project; Story 6 timings come from the owner's external `words_owner.txt` (56.20 s) with no in-repo tool to produce or validate them |
| Align | `timeline.json` + `align_report.json`; 6-stage verification (forced alignment → waveform snap → pause anchoring → phrase re-transcription check) | **Ad-hoc, unverified, different schema** — `audio/clean.json` is a flat `[{start,end,line,who,word}]` hand/agent-made per film; no align report, no verification. Yet the whole film is locked to it, and `skills/cartoon-shorts/SKILL.md:51` still falsely calls it "made by the app: never edit" |
| Sound design | Generic `sound_design.py`+`sfxlib.py` consume host `events.json` + authored `beds.json` → `audio/sfx_bed.wav` + stems + credits | **Bypassed.** The generic designer exists in our skill (`skills/cartoon-shorts/scripts/sound_design.py`) but **no project has `audio/events.json` or `audio/beds.json`** (find = 0), though every project's `chost.js events()` can produce them. Instead: per-film `out/build_bed.py` (220 lines), `build_bed4.py` (220), `build_bed5.py` (166), `build_bed6.py` (~370) — copy-paste lineage, hardcoded cue timestamps (Story 6: 22 cues, duplicated Cue-14/Cue-22 blocks) |
| Lanes mix | `lanes_mix.py`: per-lane EQ/glue/reverb/limiter buses; the editor's live mixer uses *the same numbers* (WYSIWYG) | **Skipped entirely** — no `layers_mix.json` anywhere; ducking re-implemented inline in each `mixN.py` |
| Final mix | One `mix.py`, CLI-parameterised, **enforced gate: voice-to-bed ≥16 dB while speaking, true peak ≤ −1.0/−1.5 dB, loudness within 0.5 LU of −16 LUFS**, stems option | **Per-film near-clones with a weaker gate.** `mix6.py:162` gates only on LUFS ±0.6 + TP; the voice-to-bed ratio (L126, bed only, music excluded) is computed and merely *printed* (L161), never gated |
| Sheet / images | `sheet.py` contact sheets; `fetch_images.py` with licence capture to `assets/credits.json` | **Skipped** — boards are ad-hoc report artefacts; music is pulled by raw path from the teardown template dir (`mix6.py:28-30`) with provenance recorded only as a string |

### G6 — HIGH — No shared sound code; every film forks it, and fixes land in one copy only
The `loop_to()` infinite loop is the proven cost: the buggy version (uncapped crossfade; growth = 0 when the source is shorter than the crossfade → hang) is **still live** in `story3-tram/out/build_bed.py:64-65`, `story4-market/out/build_bed4.py:63-64`, `story5-elevator/out/build_bed5.py:60-61`. It hung Story 6's bed build ~85 minutes; the guard fix exists **only** in `build_bed6.py:98-101` (`xf` capped at `len(x)//2`) and was never back-propagated — there is no shared module to propagate it through, and the next film that copies an older builder re-inherits the hang.
**Fix shape:** promote one parametrised `sound_design.py`/`mix.py` pair into a shared tools location, driven by per-film `beds.json`/`events.json` data; films keep data, never code; delete the per-film forks.

### G7 — HIGH — Word-timing spine has no tool and no verification
Everything downstream (acting on words, camera tokens, bed cues, ducking) is locked to `audio/clean.json`, which no shared tool produces and nothing verifies — vs the app's align pipeline with its snap/pause-anchor/re-hearing checks and `align_report.json`.
**Fix shape:** one shared `make_timings` step (owner timing file → validated `clean.json` + report: word count, monotonicity, overlaps, diff against the performed script), and correct the skill doc's provenance claim.

### G8 — MEDIUM — Mix pass gate weakened and inconsistent (see table)
**Fix shape:** restore the app's three-part gate in the shared mix tool, ratio measured against bed+music combined while speaking.

---

## 3. Render host protocol gaps

### G9 — FIXED IN THIS AUDIT — Flat boot deadlines (the 0.28.3 defect class, in our driver)
- **App:** 0.28.2 hosts have no step progress — only a 1 s `parentPost({type:'loading'})` heartbeat (`chost.js` L408-410, `rxhost.js` L562-564). 0.28.3's `rxhost.js` adds `window.loadProgress` load steps (film → library → engine → each part of the first shot's build), each step restarting a 3-minute clock, ~15 min ceiling, plus `window.__czBuilding` while a shot builds — because "a heavy first shot on a slower card took longer than the flat 3 minutes and the render page was killed as stuck." `dhost.js` (0.28.2) already had the same `loadProgress` pattern (L116-151).
- **We (before):** `fleet/render-chunk.ts` polled `window.ready` against a **flat 180,000 ms deadline** (old L206-212) and threw `boot timeout (window.ready never set)`; `page.goto` had a flat 60 s timeout (old L203). Our `chost.js` exposes **no** `window.loadProgress` (verified: grep = 0 hits; its heartbeat is parent-posted, invisible to a Node driver). `bin/heart`'s `still` command had the same defect at 240 s flat (old L140).
- **Fix applied:** see §5.

### G10 — MEDIUM — Settings pass-through to the render worker is wired at one end only
- **App:** The editor/render workers pass per-render settings via `?settings=`; the host merges them over `project.json` at boot. 0.28.3's `rxhost.js` fix exists precisely because this route broke for render workers (a vertical export with Captions unticked still rendered captions).
- **We:** Our `chost.js` boot *does* parse it (`boot()`: `over = qs.get('settings')…; settings = {...(P.settings||{}), ...(over||{})}`), but `fleet/render-chunk.ts` builds the URL as `__suite/cartoon.html?mode=render` — **no `?settings=` is ever passed**, and `bin/heart still` doesn't pass one either. Per-render overrides (captions off for film_check/flicker measurement, format, quality) are unreachable without editing `project.json`. Compounding it, `projects/story6-microwave/project.json` is `{"end": 56.2, "language": "ar", "settings": {}, …}` — settings literally empty, so Story 6 rendered entirely on host defaults (vertical frame; captions ON by the `captions?.on !== false` default at `chost.js` boot).
- **Fix shape:** add an optional `--settings <json>` to render-chunk (and `heart still`) appended as `?settings=`; record the effective settings into `run-info.json`.

### G11 — MEDIUM (latent HIGH) — Grade handoff is a dead end in our finish path
- **App:** `chost.js exportVideo()` returns `grade: null` when the look pipeline already graded in-frame (`gradedInFrames`), else the film's `grade` object **for the app to apply in ffmpeg**; render.ts consumes it.
- **We:** We never call `exportVideo` (fleet renders PNG stills via `suite.stills` in batches of 10 — a deliberate route: frames → fleet/Colab → desk finish). `render-chunk.ts` does surface `filmLook/filmGradedInFrames/filmGrade` into `run-info.json` (comment cites `chost.js exportVideo`), but **no downstream consumer exists** — grep across the finish/mux path finds `filmGrade` only in render-chunk itself and in the projects' engine copies that *produce* it. Production data says it has never fired: every sampled Story 6 fleet `run-info.json` (rounds 12/13) records `"filmGradedInFrames": true, "filmGrade": null`. The first film whose look does *not* grade in-frame will silently finish ungraded.
- **Fix shape:** in the finish/assemble step, read `filmGrade` from run-info and apply it in ffmpeg when `filmGradedInFrames !== true`; fail the gate if a grade is present and unapplied.

### G12 — LOW — Per-project vendored `__suite/` copies: zero drift today, structural risk tomorrow
All five projects carry their own `__suite/` copy; today they are byte-identical (§0), but nothing re-syncs them — the same failure mode as G6's per-film Python forks, one layer down. The app avoids it by construction (one installed templates tree, integrity-checked against `resources/files.json`).
**Fix shape:** a `heart sync-suite` (or scaffold-time copy from one canonical tree in the repo + a hash check in `fleet/orchestrate.py` before dispatch).

Also noted: we use only `stills/track/info/layout/errors` from the suite API; the app additionally drives `sweep` (whole-film error sweep), `shading` (per-frame shading-jump data), `resolved`, and `events` (the sound-design contract, §2) — all present in our verbatim `chost.js`, none wired into our tooling. Wiring `events` + `sweep` is the cheapest quality win in this section.

---

## 4. Settings & state plumbing (summary)

- **Project settings:** the app treats `project.json` settings as the base layer, keeps revert-sensitive settings *out* of it, and layers per-render `?settings=` overrides on top at the worker. We have only the base layer, it is empty in the latest film (G10), and there is no override route.
- **Step state:** the app derives step readiness from artifacts on disk; we store honor-system status strings in one history-free `panel_state.json` (G3, G4).
- **Frame rate (standing rule, owner 2026-11-22):** 24/30 fps going forward, 60 cancelled; both codebases default to 30 (see header). Nothing to change.

---

## 5. The approved fix, applied (boot deadlines)

**Commit:** `f65677b` — "Boot wait: progress-aware deadline (Creatorize 0.28.3 rxhost pattern)" (2 files, +74/−10).

**`fleet/render-chunk.ts`**
- Before: `page.goto(…, { timeout: 60000 })`; boot poll with `const deadline = Date.now() + 180000` → `throw new Error("boot timeout (window.ready never set)")`.
- After: `BOOT_STEP_MS = 180000` (per-step allowance) and `BOOT_CEILING_MS = 15 * 60 * 1000` constants beside `DEADLINE_MS`; `page.goto` timeout raised to `BOOT_STEP_MS`; the poll now evaluates a boot signature each second — `window.loadProgress` if a host ever exposes it, `window.E`/`window.F` presence, suite error count — plus Node-side console-log growth. Any signature change restarts the per-step clock; exceeding the 15-minute ceiling or 180 s without progress throws, with the last observed progress in the message. `runInfo.bootWaitMs` and `runInfo.bootProgress` are recorded. The 165-minute job `DEADLINE_MS` is unchanged (it is a job cap, not a boot deadline).

**`bin/heart`** (`still` command)
- Before: flat `Date.now() + 240000` boot deadline.
- After: same progress-aware pattern (boot-signature poll over CDP: loadProgress / `window.E` / `window.F` / suite error count; 180 s per-step, 15 min ceiling), keeping the existing boot-error throw.

**Verification:**
- `npx -p typescript@5.6 tsc --noEmit --skipLibCheck --target es2022 --module esnext --moduleResolution bundler` on the pre-fix (git HEAD) and post-fix `fleet/render-chunk.ts`: **identical error sets** — 12 errors, all pre-existing environment gaps on this VM (TS2307 `node:*`/`playwright` modules and TS2580 `process`/`Buffer` names, i.e. no `@types/node`/playwright installed here; CI installs them via `npm ci` before `npx tsx`). Only line numbers shifted (+55). **Zero new errors.**
- `node --check bin/heart` — OK.
- No scene/film content and no project files were touched (`git show --stat f65677b`: only `fleet/render-chunk.ts`, `bin/heart`).

---

## Priority order (recommended)

1. **G6/G7** — shared sound-design/mix/timings code (kills the fork-and-hang class and the unverified timing substrate).
2. **G1/G2** — a step executor + a minimal measured tool/critic surface (makes the gates real instead of reported).
3. **G3/G4** — artifact-checked step completion + per-project git snapshots.
4. **G10/G11 + `events`/`sweep` wiring** — small, concrete, closes the settings and grade dead-ends.
5. **G5/G12** — resident driver or pipeline state machine; suite sync check.
