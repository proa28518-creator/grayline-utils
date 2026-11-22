# UI BRIEF — Unified Heart Interface (واجهة القلب الموحدة)

You (Codex) are the author of this build. Work in this repo: `~/workspace/heart-studio`
(the "Heart Studio" program — our own Linux implementation of the Creatorize heart).
Commit your work on a NEW branch named **`ui/unified-interface`**.

## What you are building

ONE unified web interface for the heart — the single surface that controls the heart
and all its files/projects, succeeding our current control page (صفحة تحكم القلب).
Model the *flow* on how Russell's Creatorize app drives its core — reference material
is on disk, read it before designing:

- `~/workspace/creatorize-teardown/TEARDOWN.md`
- `~/workspace/creatorize-teardown/COMPLETENESS.md`
- `~/workspace/creatorize-teardown/unpacked/asar/` — the app's UI structure & step flow
  (his main actions: Build · Camera angles · Environment overhaul · Post processing ·
  Shading, plus project list, settings, update/health status)

## Read first (this repo)

- `README.md` — what the program is; the `heart` CLI (`heart serve`, `heart new`,
  `heart still`, `heart models`, `heart consult`, `heart critic`, …)
- `bin/heart` — the CLI implementation; your UI's actions must call THIS (or repo
  scripts), never re-implement its logic in the page
- `ui/index.html` + `server/server.js` — the existing Arabic control UI and its
  zero-dependency Node server (port 8903, per-project `panel_state.json`). Follow the
  repo's existing conventions: extend/replace inside `ui/` + `server/` unless you find
  a strong repo reason to do otherwise — if you do, say so in your summary.
- `projects/` — real project folders: `demo-ring`, `rooftop-kite`, `story3-tram`,
  `story4-market`, `story5-elevator`, `story6-microwave`, `story6-oven`
- `fleet/` — render dispatch (`orchestrate.py`, `render-chunk.ts`, `seat-consult.py`)
- `orch/` — desk-level gates/audits

## GAP AUDIT FINDINGS — design consequences (read before designing)

A full audit of the app vs our program has landed: `orch/HEART_GAP_AUDIT.md`
(commit cc054d2). Read it. Four findings directly govern this interface's design:

- **G1 (the headline) — this must be a step-EXECUTING surface, not a status panel.**
  In Russell's app, buttons *execute*: `runStep()` → `runStepWith()` runs the real
  pipeline per step, with cancellation cleanup and per-pass agent invocation
  constructed in code. Our old panel's `/api/step` only wrote
  `steps[step] = 'requested'` into `panel_state.json` and waited for a human to
  notice — that is the core defect this interface exists to kill. Design every
  station as: **Run control → the server dispatches the real program action**
  (a `heart` command, a repo/fleet script, or a step-worker dispatch) **→ live
  output/log for the running step → the resulting artifact is verified → only then
  does the station read as done.** Include a working **cancel/stop** for a running
  step. Where the backend executor for a step does not exist yet in the program,
  build the surface for execution anyway (run control, log pane, status states:
  idle / running / verifying / done / failed) and mark that step's run control
  «غير موصول بعد» — never fall back to a button that merely flips a status string.
- **G3 — gates verify artifacts, not honor-system strings — and the gate itself is
  PROGRAMMATIC, never a model's opinion.** Russell's mechanism, in his words:
  *"the app's own checks measure every shot and they don't care what Claude
  thinks — anything that fails goes back to the builder with what's wrong and how
  to fix it."* So the gates station is built on **measured checks owned by the
  program** (the suite's `film_check` / prop-guard class: set-bar percentages,
  per-shot measurements, artifact predicates), each returning a **named failure +
  a fix instruction** that routes back to the builder leg. Model critics (our
  GLM critic included) are a **second layer** shown alongside — their verdicts
  inform, they never open or close a gate. A gate that displays a critic's
  opinion as its pass/fail is a design defect. Our current
  `/api/setstep` lets any caller set any step to `done` with no check. In this
  interface, a station may show «done» **only when its artifact predicate passes**
  (e.g. voice station: the audio file exists; timing: the timings file exists and
  parses; board: stills count > 0; mix: the final mix file exists; master: the
  master mp4 exists). The QC-gates station must display the actual artifact checks
  (pass/fail per check, from the files) — not a status someone typed. If you add or
  extend server endpoints, enforce the predicate server-side before accepting
  `done`, following the audit's fix shape.
- **G10 — the interface must actually send project settings to the renderer.**
  Our host parses `?settings=` overrides at boot, but nothing ever sends any:
  Story 6's `project.json` has `"settings": {}` and it rendered entirely on host
  defaults (captions ON by default). The project view must include a **settings
  station/panel** that (a) shows the project's *effective* settings — base
  `project.json` settings merged with what will be passed to the renderer,
  (b) lets the operator edit the settings the program supports (at minimum:
  captions on/off, and frame rate fixed to the 24/30 standing rule), persisting
  them to `project.json`, and (c) when a render/still action is triggered from
  the UI, passes them through as the `?settings=` override (and the effective
  settings are recorded with the run). If the render-dispatch side cannot accept
  settings yet, wire what exists and mark the remainder «غير موصول بعد» — but the
  effective-settings display must be real from day one.
- **G4 — per-project git undo is part of the app's model; design for it.** The app
  installs git as "project edit history = undo": `ensureRepo()` inits a repo per
  project, every edit is snapshot-committed, and undo/redo restores ranges. Our
  `heart new` does not `git init` yet and panel state is one history-free JSON.
  The project view must include a **history (السجل) surface**: the project's git
  log/snapshots where a repo exists, with restore/undo actions wired to git where
  possible; for projects without a repo, show that honestly («لا يوجد سجل Git بعد»)
  rather than hiding the surface. Do not silently invent a parallel history store.

Also noted in the audit and relevant to the QC station (G2/G11): our critic
currently grades builder-written text, not frames — so the gates station should
surface *frame evidence* (board stills / contact sheet) alongside any critic
verdict, and the finish station should surface the render's grade status
(`filmGradedInFrames` / `filmGrade` from `run-info.json`) when present instead of
assuming grading happened.

## THE RUN IS THE CORE OBJECT — owner's framing (2026-11-22)

The owner defines this interface himself: **the interface is the controller — it
runs the heart, it moves the passes together, it assembles the machine; it is the
ignition button.** Design consequence, above everything else in this brief:

- The central object of the UI is **the RUN** (تشغيل): one operator action — press
  start — that **executes the whole sequence through the real program** (`heart`
  CLI / repo & fleet scripts): stations in order, gates verified by artifacts
  between them, render and export *inside* the same run — never a status-only
  panel with a start-shaped decoration on it.
- The run has a live supervision view while it executes (see the capability map
  below): what is running now, hand-off states, progress/ETA where the program
  honestly knows them, and a **«بانتظارك» (WAITING ON YOU)** line that says what
  needs the operator — or «لا شيء» (nothing).
- Where the backend cannot yet execute a leg of the run end-to-end, the run must
  stop honestly at that leg and say so (waiting-on-you: backend not wired), with
  that leg's control marked «غير موصول بعد». A run that silently skips a leg, or
  pretends to complete it, is a failed build.
- **The RUN executes in Russell's own sequence — adopt it verbatim as the station
  order** (from his closing workflow summary and the Send mechanism, transcript
  03:37–04:23 and 11:22):
  1. Create the project (from the one brief + narration/assets)
  2. Check the tools the style needs
  3. Read transcript + style guide (the run's own transcribe/align produces the
     word timings — see the Addendum below)
  4. The director picks the builder (model/effort routing made visible here)
  5. Exact shot plan (the whole short planned second by second, every shot
     landing on its word — before anything is built)
  6. The five passes, in order, **each a checkpoint** (builder → programmatic
     checks → critic → fixes → fresh critic → hand-over)
  7. Whole-film checks (the full-film error hunt)
  8. Sound mix under the voice (the app mixes its sound under the narration)
  9. Export — the finished film lands in the conversation/run view
  10. Human step: click any moment in the editor + a one-line fix instruction
  The project view's station spine (script/voice → timing → board → gates →
  render → finish → master) remains the project's anatomy; the RUN's execution
  order is this sequence. Where they differ in naming, the run view follows this
  list.

## CAPABILITY MAP — from Russell's own autopilot video (owner-supplied)

Read `orch/APP_CAPABILITY_MAP_FROM_VIDEO.md` in full before designing. Owner's
rule: **same capabilities, NOT the same look** — the interface is our own design.
The capability shapes to build in:

1. **Conversation-first creation.** A new project starts from one natural-language
   brief (+ narration/assets): the brief carries the law — format (vertical 9:16,
   1080×1920), "end to end, all passes, export, don't ask me, decide and keep
   going", and a budget spent on quality, not speed. The new-project surface is a
   brief form (brief text + voice file + assets), not a bare folder-name prompt.
   **Voice is law:** the narration file is used exactly as-is — no trimming, no
   cleaning, no re-timing; the film is exactly as long as the file.
2. **Five passes, five buttons, strict order** — Build → Camera angles →
   Environment → Post processing → Shading (over the station spine you already
   have). Each pass, as a unit: **builder → critic verdict → builder's fixes →
   a FRESH second critic on the fixed frames → hand-over.** Each pass's checks
   verify its own layer *and* the invariants of the earlier layers ("acting,
   props and voice unchanged"). Passes cannot be started out of order.
3. **Quality mode vs Faster builds toggle.** Quality = work until the checks
   pass, no time limit (stall guard only); Faster = sooner video, visibly a
   trade-down. The toggle is part of the run controls and is recorded with the run.
4. **Model / effort routing.** The run controls carry the model + effort selection
   the program actually supports (our `heart models` / consult seats) — wire to
   what exists, mark the rest «غير موصول بعد». No decorative model pickers.
5. **Supervision view.** Named work spaces with hand-off states (who holds the
   film now: build / critic / fix / second critic / render / finish), progress %
   and ETA where honestly derivable, and the «بانتظارك» line. This is the run's
   home screen while it executes.
6. **Click-to-change fixes.** On the artifact itself (board still / frame), the
   operator can click and state the change — an annotation-driven correction that
   attaches to that shot/frame and re-enters the run as a fix task, not a new
   chat brief. (Surface + data model this round; execution wiring where the
   program supports it, else «غير موصول بعد».)
7. **Cost/time transparency.** Per film and per run: wall-clock per pass and
   token/model usage where the program records it, shown in the run view —
   measured numbers only, never estimates dressed as measurements.
8. **Export inside the same run.** After the last pass closes, export/render is
   the run's final leg (with the gates verified before it, per G3) — not a
   separate tool the operator must go and find.

## STRUCTURAL BLUEPRINT — his app's screens, from the bundle we hold

Alongside the capability map, read `orch/APP_UI_STRUCTURE_FROM_BUNDLE.md` — the
full screen inventory extracted from the app's own renderer chunks
(`creatorize-teardown/unpacked/asar/out/renderer/assets/`) plus where the
executor lives (main process + `@anthropic-ai/claude-agent-sdk` in the bundle).
Owner's direction: build ours **on that blueprint** — mirror the *composition*,
our own look:

- **Run screen** (his "Berserk" chunk): conversation-first creation — brief +
  law + attachments (audio/music/pictures, drop-them-here) → RUN; a mid-run
  steering input ("tell it something while it works"); model + effort picker;
  "Exact shot plan" toggle; Style selection (incl. Automatic); Faster builds vs
  Quality mode; the live feed = step timeline with plain-language narration,
  contact-sheet filmstrips as evidence, per-step progress, critic verdicts and
  fixes as they happen; run outputs lead to "Open in editor".
- **Editor** (his largest screen): the five ordered passes as five buttons,
  frames, click-to-change on the artifact.
- **First-class sections** in one shell: Projects · Editor · Styles · Library ·
  Memory · Renders · Videos, with search/run and New project as shell-level
  actions and a live connection status ("Claude connected" equivalent — for us:
  the model-seat status).
- The lesson the blueprint teaches: renderer screens + step executor + tool
  surface are **one machine**. Sections that our program cannot back yet
  (Routines/autopilot spaces, Thumbnails, YouTube) appear only if they can be
  honest — as visibly marked «غير موصول بعد» sections, never as fake screens.

If you already have a structure underway when you read this, align it to this
composition (run screen → editor with five ordered passes → library / memory /
renders sections) rather than restarting: same capabilities and working
structure, our own visual identity.

## CONTROL LAW — the program calls the models; models never roam (owner's rule, 2026-11-22)

The control law behind the whole design, in the owner's terms: **Layla is the
controller of the program; the interface is the ONLY door that deals with the
program.** External models have no rules of their own when left outside — so in
our program:

- Models are called **only from inside the program, through the API** — each
  call with a **bounded task**, a **defined tool surface**, and the program's
  **measured checks waiting for its output**. This is exactly how Russell embeds
  Claude via the Agent SDK: the program goes to the model with what IT wants;
  the model never roams free and never invents process.
- The only allowed shape of a model step is:
  **program → API → model (bounded) → measured checks → next step.**
- **No free-roaming external model session may be a step of a run.** A run leg
  that consists of "an agent somewhere goes and does the step" is forbidden by
  design; if a leg cannot yet be expressed as a bounded in-program API call with
  checks, it is marked not-yet-wired / not-yet-dispatchable (see the marks
  below) — never improvised around.
- **Layla supervises the program itself** (through this interface), not a crowd
  of external sessions: the interface is her one door, and everything she is
  shown — states, gates, checkpoints, feed — is the program's own record.

UI consequences: model invocations appear in the run feed as program-issued
calls (task, model/effort, tool surface, checks result), not as links out to
external chats; the model/effort routing controls configure the program's own
API calls; and no UI element may deep-link a run step to an external model
session.

## HARD ARCHITECTURE — one closed system, dispatch only through the program (owner-approved 2026-11-22)

The owner has clarified and APPROVED the API architecture. This is a hard
requirement, in his terms — if the system comes apart into scattered manual
steps, it breaks:

1. **ONE CLOSED SYSTEM.** Everything happens inside the program (on this VM).
   No step of a RUN may require a manual action outside it — no hand-pushes to
   GitHub, no browser-driven Colab sessions as part of a run, no operator
   carrying files between tools. If a human has to leave the program to move a
   run forward, the design is wrong.
2. **Heavy work leaves the machine ONLY through the program's own dispatch
   layer ("the API"):**
   - Storyboard/still frames and pass jobs → **GitHub via the official Actions
     API** (`workflow_dispatch` with inputs, run-status polling, artifact/log
     retrieval).
   - The film render → **Colab via a queue worker** (job file in → status /
     results out).
3. **Colab is ON-DEMAND.** It starts when a render job exists and is not kept
   running otherwise. No standing sessions.
4. **All state lives in the program itself** — files, measured gates,
   checkpoints, and the run feed are the program's own, on this machine.

**UI consequences (binding for this build):**
- The RUN button's backend contract **is this dispatch layer**: pressing start
  dispatches through the program (fleet/orchestrate + the Actions API / Colab
  queue worker), polls status through it, and retrieves artifacts/logs through
  it. The run feed is fed by the dispatch layer's states, not by an operator
  reporting back.
- Any step that **cannot yet be dispatched from inside the program** must be
  visibly marked as such in the UI — «غير قابل للإرسال من داخل البرنامج بعد»
  (not yet dispatchable from inside the program) — a distinct mark from a merely
  unwired executor. A step that is silently manual (works only if a human does
  something outside) presented as a normal run leg is a failed build.
- The fleet/Colab legs' status surfaces (queued / dispatched / running /
  artifacts back) come from the dispatch layer's polling, with the job's
  identity (Actions run id / queue job id) visible in the run feed.

## ADDENDUM — transcript findings (owner-supplied, 2026-11-22)

Source: Russell's own spoken transcript (`orch/video-ref/russell_video_transcript_ar.md`;
summary in the capability map's Addendum 2). Three binding consequences:

1. **Do NOT mirror today's layout — it is about to be replaced.** Russell announced
   **v0.3 "in the next few days"**: a completely redesigned UI, Routines with
   multi-agent coordination, and retention analysis. Build strictly on
   **capabilities and working structure** (the sections above); invest nothing in
   imitating the current screens' arrangement or look. Our interface is our own —
   and now his is about to stop being his, too.
2. **Every pass is a CHECKPOINT.** In his words, each pass is a save point: the run
   can **resume or roll back at pass boundaries**. The RUN model in this interface
   must therefore carry explicit per-pass boundary states — *not started / running /
   checkpointed (passed its gates) / rolled back* — and, once the executor exists,
   resume-from-checkpoint and roll-back-to-checkpoint actions at those boundaries
   (this pairs with G4's per-project git snapshots: a checkpoint = the pass's gate
   pass + a snapshot). Design the states and the surface now; wire the actions to
   the executor/snapshot backend where it exists, else «غير موصول بعد». A single
   undifferentiated progress bar for the whole run is the wrong model.
3. **The interface's agent is the DIRECTOR; align lives inside the run.** Berserk,
   in Russell's definition, "is not the one who draws the shots; he is the
   DIRECTOR" — the surface's agent manages the build (routes work, runs critics,
   enforces gates) rather than generating shots itself. Frame the run's narration
   and hand-off language accordingly. And: **the app transcribes the narration
   itself** to give every word its timing — so the timing station (محطة التوقيت)
   is the run's own **transcribe/align step**, producing and verifying the word
   timings inside the run (cf. audit G7), not a passive display of an externally
   made file. Where our align tooling does not exist yet, the station shows the
   timings file's provenance honestly (owner-supplied vs run-produced).

Also from the transcript, for the gates station's checklist language: his final
pass plays the whole film hunting errors (characters through chairs, props inside
heads, anything cropped or too dark), fixes until clean, THEN exports — the
«بوابات الجودة» station's whole-film hunt belongs immediately before export.

## The interface (this round's deliverable)

Arabic RTL, dark studio console, visually consistent with the existing صفحة تحكم القلب.
One screen flow:

1. **Projects list** — every folder under `projects/`, with real status derived from
   the project's own files (script present? voice present? board stills count? master
   present?), not mock data.
2. **Project view** — the pipeline as explicit stations, in order:
   1. النص والصوت (script / voice)
   2. التوقيت (timing)
   3. لوحة اللقطات (storyboard board with stills)
   4. بوابات الجودة (QC gates)
   5. الريندر (render — fleet / Colab)
   6. التشطيب (finish)
   7. الماستر ورابط Drive (master + Drive link)
   Each station shows **real status read from the project files** (existence, counts,
   timestamps — whatever the files honestly support). No invented progress numbers.
   Per G1/G3 above, each station is an execution surface: a run control that
   dispatches the real action through the server, a live log/output pane while it
   runs, a stop control, and a done state that is only reached after the station's
   artifact check passes.
   The project view also carries two cross-cutting surfaces from the audit:
   **إعدادات المشروع** (effective project settings — G10) and **السجل** (per-project
   git history / undo — G4).
3. **Controls call the real program** — buttons/actions must invoke the `heart` CLI or
   existing repo scripts through the server. **No fake buttons**: where a backend
   action does not exist yet, render the control visibly marked **«غير موصول بعد»**
   (not yet wired).

### Fully wire ONE project end-to-end: `projects/story6-microwave`

Its real layout (verify against disk, do not assume):
`project.json`, `script_owner_ar.md` (script of record), `voice_owner.wav`,
`words_owner.txt` (timing), `shots.md`, `scenes/`, `orch/` (gate/hunt reports A100+),
`out/board/` (board stills), `out/story6_full.mp4` (the delivered master),
`out/story6_picture.mp4`. Station statuses for this project must reflect these files.

## Standing rules — bake them into the UI

- **Frame rate is 24/30 fps.** 60 fps was CANCELLED by the owner on 2026-11-22.
  Anywhere the UI shows or offers a render frame rate, it is 24/30 — never 60.
  (Note: Story 6's delivered master happens to be a 60 fps file; display its real
  metadata honestly, but do not offer 60 as a going-forward option.)
- **Stills before renders** — the board station precedes the render station; the flow
  must make that order visible/enforced in the UI.
- **Gates before export** — QC gates station precedes finish/master; a project whose
  gates have not passed must not present export as a normal next step.

## Constraints

- Zero-dependency spirit of the existing server (plain Node, no npm installs) unless
  the repo already carries a dependency for it.
- Do not modify: `engine/`, any project's content files, `fleet/` render logic.
  Your surface reads state and invokes actions; it does not rewrite the pipeline.
- The working tree has unrelated uncommitted changes (e.g. `fleet/render-chunk.ts`,
  `bin/heart`, `DRIVER.md`) and untracked folders — **do not stage, commit, revert or
  otherwise touch them**. Commit ONLY your UI files, on `ui/unified-interface`.
- The gap audit (`orch/HEART_GAP_AUDIT.md`, commit cc054d2) has landed and its
  design consequences are folded into this brief above (G1/G3/G10/G4). In your
  final summary, state explicitly how each of G1, G3, G10 and G4 is reflected in
  what you built, what remains backend-dependent (executor worker, artifact
  predicates in the API, `git init` in `heart new`, settings support in
  render dispatch), and which UI parts you still expect to change as the audit's
  fix shapes land in the program.
- The capability map (`orch/APP_CAPABILITY_MAP_FROM_VIDEO.md`) and the owner's
  RUN framing are likewise folded in above. In your final summary, also state:
  how the RUN works in what you built (what pressing start actually executes,
  where it honestly stops if a leg is unwired), and how each capability shape —
  conversation-first creation, five ordered passes with fresh-critic hand-over,
  Quality/Faster toggle, model/effort routing, supervision view with
  «بانتظارك», click-to-change, cost/time transparency, export-in-run — is
  reflected, wired, or marked «غير موصول بعد».

## Definition of done (this round)

- [ ] Branch `ui/unified-interface` created; your UI work committed on it
- [ ] Server starts locally and serves: projects list + the Story 6 project view,
      with station statuses read from real files
- [ ] Every control either calls a real `heart`/repo action or is visibly marked
      «غير موصول بعد»
- [ ] Stations are execution surfaces per G1 (run + live log + stop + verified
      done), and no station can show «done» without its artifact check passing (G3)
- [ ] Project view shows effective settings (G10) and the git history surface (G4),
      honestly reporting projects that have no repo yet
- [ ] A RUN can be started from the interface: it executes the station sequence
      through the real program in order (Russell's verbatim sequence: create →
      tool check → transcript + style guide → director picks builder → exact
      shot plan → five checkpointed passes → whole-film checks → mix under the
      voice → export into the run view → human one-line fix), verifies gate
      artifacts between legs, shows the supervision view (hand-off state,
      «بانتظارك» line), and stops honestly at any leg whose backend is not
      yet wired
- [ ] Gates are programmatic measured checks returning named failures + fix
      instructions; model-critic verdicts are displayed as a second layer and
      never act as the gate itself
- [ ] Closed-system dispatch: every RUN leg either dispatches from inside the
      program (Actions API for stills/passes, Colab queue worker for the render,
      on-demand only) or is visibly marked «غير قابل للإرسال من داخل البرنامج
      بعد»; no leg silently depends on a manual action outside the program
- [ ] The five passes exist as ordered pass controls (Build → Camera →
      Environment → Post → Shading) with the builder → critic → fixes → fresh
      critic → hand-over shape represented in the run flow
- [ ] New-project surface is conversation-first (brief + voice + assets);
      run controls carry the Quality/Faster toggle and the model/effort
      selection the program actually supports
- [ ] You state the **exact run command** in your final summary
- [ ] Final summary: what you built, where it lives, what is wired vs marked unwired,
      and which parts await the gap-audit findings

## Owner decision 2026-11-22 ~06:45 — Connect Gemini (mirrors Creatorize's Connect Claude)
- The program carries a **Connect Gemini** action inside the interface (Home/Settings), exactly mirroring how Creatorize connects Claude: one sign-in with the owner's Gmail/Google account (the subscription account), performed by the owner himself; the program then detects the stored session, shows a "Gemini connected" status, and drives Gemini sessions ONLY from inside the program (bounded tasks, the program's tool surface, measured checks as the gate).
- Antigravity is NOT the Gemini route anymore (owner's word 2026-11-22 ~06:43: «مش هنستخدم بقى انتي جرافيتي — هنستخدم جيميناي على طول»). Gemini is used directly, Task mode for model work.
- Seat pattern for every model in the program: a signed-in subscription (Gemini ↔ Gmail sign-in; Claude ↔ Claude sign-in; GPT ↔ ChatGPT sign-in, already live via the Codex seat).

## Owner addition 2026-11-22 ~06:48 — Connect GPT joins Connect Gemini
- The interface's connections row carries **Connect GPT** beside Connect Gemini, same pattern: sign-in with the owner's ChatGPT account from inside the program, connected-status shown, sessions driven only from inside with bounded tasks and measured checks.
- Note: this seat is already live on the desk VM (the Codex seat, signed in as araby0401@gmail.com, which built this interface) — the UI work is surfacing and governing that existing connection, not creating it. Russell's bundle embeds the Codex SDK the same way, so the pattern is proven on both sides.

## Owner decision 2026-11-22 ~06:50 — assembly/finishing happens on GitHub
- «عشان الشغل يكون أدق وأنضف، التجميع يحصل على GitHub»: the final assembly (frames + mix + encode + finish gates) runs as a GitHub Actions workflow on a clean machine every run — NOT on the desk VM. The desk VM is controller/director + QC eyes only.
- Pipeline shape is now: program dispatches → stills & passes on GitHub → render on Colab (on-demand queue worker) → frames to GitHub → assembly/finishing on GitHub → master out (artifact/Drive). The fleet finish discipline (pts audit, setpts re-encode, SSIM verify, never stream-copy) becomes part of that Actions workflow.

## Layla's proposals — owner approved ALL, 2026-11-22 ~06:54 («ضيفيهم كلهم في المواصفات»)
Drawn from the Creatorize capability map + our own gap audit; they join the spec for the rounds after round 2:
1. **New-film conversation entry:** a «فيلم جديد» flow where the owner writes the idea and drops his voice recording; the program creates the project and runs transcribe + align inside the run (no manual file prep to start a film).
2. **Quality / Faster toggle on every run:** Quality = no step passes until the program's measured checks pass, no time pressure; Faster = draft mode, checks advisory. (Mirrors his Quality mode vs Faster builds.)
3. **Shared asset library inside the program:** reusable props/scenes/characters with search + propose/get tools (the mcp__suite__library_* pattern), so films stop rebuilding every element from scratch.
4. **Retention analysis feeding the Write step:** analyze published shorts' audience-retention drop points and feed the findings into story writing (his announced v0.3 direction; serves the owner's viral goal).
5. **In-program lessons memory:** every film leaves a written lessons record (what failed checks and why); the builder/director sessions read it at the start of the next run — lessons stop living only in Layla's own memory.

## Owner priority note 2026-11-22 ~07:46 — production over looks
«مش مهم الشكل، أهم حاجه الانتاج»: the interface is a tool, not a product. In every remaining round, weight the production machinery (step executors, measured checks, dispatch, assembly) over visual polish. A plain surface that produces films at the bar beats a beautiful one that does not.

## Owner correction 2026-11-22 ~08:09 — the interface FORM is a desktop app, not a browser page
«الواجهه اللي انا طلبتها واجهه زي ما هو عاملها مش واجهه في متصفح»: the deliverable form is a real desktop application with its own window, like Creatorize (an Electron app), NOT a page opened in a browser tab at 127.0.0.1. The current browser-served page is an interim scaffold for building the machinery. The machinery (server, executor, dispatch, checks) is unchanged by this — it gets packaged into the app shell (Electron wrapper around the same local server, the same way Creatorize itself is built). Shell packaging is part of the professional-interface phase, but the FORM requirement is standing from now: no future round may present the browser page as the finished interface.

## Owner direction 2026-11-22 ~08:11 — the interface mirrors Russell's; only the skin is ours
«هو سايب الواجهه بتاعته فاحنا مش هنغير غير الستايل، اما بالنسبه الاكواد الواجهه زي ما هي»: the owner's intent is that the interface keeps Creatorize's own structure, screens, buttons and flows (per orch/APP_UI_STRUCTURE_FROM_BUNDLE.md) and only the skin changes — our name, colors, Arabic RTL. Implementation note recorded with his word: the bundle's UI code itself is compiled/minified and welded to Russell's own main process and tool surface, so the durable route to his intent is rebuilding our shell as its structural twin from the bundle map (same screens/order/controls), not patching his compiled assets, which would break on every one of his updates and cannot answer our machinery without a translator layer. Either way, the acceptance bar is his: from the user's seat it must look and flow like his interface, in our skin.

## Owner architectural rule 2026-11-22 ~08:11 — the interface mounts on the heart's own sockets
«لو عملنا وجهه تاني من جديد مش هتركب على القلب وباظت البرنامج»: Russell built the interface code against the heart's own contracts — the mcp__suite__* tool surface, the project-folder layout, the step/state conventions in the bundle. A from-scratch invented interface drifts off those sockets and breaks the fit (this already happened in part in rounds 1–2: our own panel_state and invented run legs — the root of several gap-audit findings). RULE for all coming rounds: the suite's contracts from the bundle are the specification; our interface and executor speak them (same tool names/shapes, same project layout, same step semantics), and only the skin is ours. Any existing invention that parallels a suite contract gets re-aligned to the contract, not extended.

## Owner decision 2026-11-22 ~08:19, desk-verified — the interface IS his renderer files
«الواجهه موجوده عندك في الملف»: verified on disk — ~/workspace/creatorize-teardown/unpacked/asar/out/renderer/ holds the COMPLETE interface: index.html ("Creatorize Suite"), a standalone CSS bundle, and per-screen modules by name (Berserk, ClaudePanel, Editor, Layouts, Library, Memory, NewVideo, PersonalEditor, Presets, Renders, Routines, Studio, StyleImport, Videos) + media assets, 15 MB total. INTERFACE TRACK CHANGES: the interface is THESE files (reskinned via their CSS/name strings), not a rebuilt twin and not our custom page. Our engineering work is the ADAPTER behind them: their renderer expects an Electron main process + the suite tool surface + a local 127.0.0.1 server (per its CSP); our machinery must answer their calls on their contracts. Our rounds 1–2 custom UI is superseded as the interface (its executor/dispatch machinery remains, re-pointed to serve the real interface's contracts).

## Owner scope 2026-11-22 ~08:20 — the mounted-renderer version is a STUDY build
«اعتبر النسخه اللي هتثبتيها وهتعمليها بالواجهه بتاعته مجرد بس دراسه»: the version mounted with Russell's own interface is a STUDY build — its purpose is to learn, by running his interface on our side, exactly what it asks, expects and does on its contracts. It is not the production product and does not replace the production line; its findings feed the production program, which is built informed by the study.

## Owner sequence 2026-11-22 ~08:21 — mount, map, add, then skin
The order is fixed by the owner: (1) mount his interface as-is (study build, pristine backup kept); (2) learn the code map from the running study — where the style code is, where each feature's code is; (3) add OUR features onto the mounted interface; (4) change the style at leisure, once the map is known. Building from zero while holding the original is rejected («شايلين دماغنا وحاطين جزمه»). Additions come BEFORE skinning.

## Owner acceptance bar 2026-11-22 ~08:34 — the integrated program must be COMPLETE on the desk
«بعد ما تخلصي الدمج الكامل يبقى البرنامج بالكامل على جهازك وماشي، يبقى في مستودعات خارجيه بس لازم يكون البرنامج ده كامل»: the integration is done only when the desk holds the COMPLETE program — his interface files, the heart, the executor/dispatch machinery, and every library/body part it needs to run — working end to end on this machine. External repositories are dispatch targets (stills/render/assembly), never storage for missing organs. A copy that arrives somewhere else missing pieces (the 546 MB skeleton symptom) fails this bar.

## Owner quick solution 2026-11-22 ~09:03 — convert the same program as-is to Linux first
«هنحول نفس البرنامج زي ما هو لينكس الاول»: alongside the current work, the direct route is a Linux conversion of Russell's actual app as-is — the app is Electron (its body is JS), so run the whole unpacked app (main + renderer + resources) under a Linux Electron runtime. The study's job is to surface every Windows-specific dependency by name (win32 native modules, bundled .exe/.dll helpers, path/shell assumptions). This conversion study precedes additions and skinning, per the mount → map → add → skin sequence.

## Owner step 2026-11-22 ~09:04 — after the Linux install, remove the registration face
«بعد التثبيت نطلب ازاله وجه التسجيل عشان نعرف نجري تعديلاتنا»: after the converted app boots on Linux, the app's registration/member gate screen is removed in our study copy so it stops blocking our modifications. Distinction recorded: the member/registration gate is Russell's door; the SEAT sign-ins (Connect Claude/Gemini/GPT) are operating wiring the machinery runs on — removing those would disable the seats, so they stay.
