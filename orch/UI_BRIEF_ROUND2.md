# UI BRIEF — ROUND 2 (appendix to orch/UI_BRIEF.md, which remains the master spec)

You (Codex) are the author. Repo: `~/workspace/heart-studio`, branch
`ui/unified-interface` (already checked out; round 1 = commits 778a011 + ae9f6ea).
Read `orch/UI_BRIEF.md` in full first if you have not — every rule in it still
binds (control law, closed-system dispatch, G1/G3/G10/G4, 24/30 fps only,
«غير موصول بعد» honesty, no fake buttons, gates are programmatic).
Round 2 adds four workstreams. Commit ONLY the files this round touches, on the
same branch. Do NOT touch: `engine/`, any file inside `projects/story3-*`,
`projects/story4-*`, `projects/story5-*`, `projects/story6-*` (content is
delivered; read-only), `DRIVER.md`, or unrelated working-tree changes.
Zero new npm dependencies. Arabic RTL dark console, our look.

## A. Connections row (new)

New server endpoints + a shell-level connections row in `ui/index.html`
(GPT · Gemini · Opus · GLM chips, last-probe time, a «فحص الاتصالات» probe
button). Statuses must come from REAL checks — never hardcode "connected".

- `GET /api/connections` → the last probe result (cached in memory; before any
  probe, each entry reports `probed: false` honestly).
- `POST /api/connections/probe` → runs all four probes, caches + returns them:
  1. **GPT (Codex seat)** — spawn the codex binary (`login status`). Resolve
     the binary from env `CODEX_BIN`, else the first existing of
     `/usr/lib/chatgpt/resources/codex`,
     `$HOME/workspace/tools/chatgpt-app/extracted/usr/lib/chatgpt/resources/codex`.
     Connected iff the command succeeds and its output indicates a ChatGPT
     login. Also read `$HOME/.codex/auth.json` METADATA ONLY (`auth_mode`,
     `last_refresh`, whether `tokens` exists) — never return or log any token
     value, account id, or email.
  2. **Gemini** — check for a Google SESSION cookie by NAME ONLY in
     `$HOME/.config/gemini-desktop/Cookies` (sqlite). Session names:
     `__Secure-1PSID`, `__Secure-3PSID`, `SID` on a google host. Read names
     only — never cookie values. Implementation must not lock/fail if the app
     is running: copy the DB to a temp file first (or open immutable), and
     treat any read error as `unknown` with the reason, not as connected.
     If no session cookie: status = not connected, state
     `awaiting_owner_signin`, with UI copy: sign-in is the owner's step in the
     Gemini desktop app on this machine. Do NOT attempt any sign-in, do NOT
     launch the Gemini app.
  3. **Opus (LLMsRelay)** — real probe via the desk helper
     `$HOME/workspace/tools/opus_call.py`: spawn `python3 opus_call.py
     <promptfile> <outfile> 32` with a one-line ping prompt, env `LLMS_KEY`
     mapped at spawn time from `LLMSRELAY_API_KEY` in
     `$HOME/workspace/user/files/llmsrelay.env` (parse the file in the server;
     NEVER print, return, or log the key value; do not put it in any response
     or job log). Alive iff output starts with `OK`. Report alive/dead +
     probe timestamp only.
  4. **GLM (APInex)** — real catalog probe through the existing heart bridge
     (`heart-cjs-runner.cjs models`): alive iff it returns data with
     `has_glm_free` true; report the model id `free/glm-5.3-flashx` family as
     the program names it. No key handling (the helper owns it).
- UI chips show: name, status (متصل / غير متصل / بانتظار تسجيل المالك / لم
  يُفحص بعد), and probe time. A failed probe shows the failure plainly.

## B. Step executor — RUN v2 + two new heart verbs

### B1. New thin CLI verbs in `bin/heart` (wrappers over repo assets only)

- `heart timing <project>` — validate the project's timing artifact and write
  `<project>/out/timing_report.json`:
  - Source: `audio/clean.json` (array; entries with numeric start/end) if
    present, else `words_owner.txt` (rows `[MM:SS.ss - MM:SS.ss] word`).
  - Checks (each a named failure when violated): file exists; parses; at
    least 1 entry; every end ≥ start; entries monotonic non-overlapping;
    last end ≤ voice duration + 0.5s (voice = first existing of
    `voice_owner.wav`, `voice_ar.wav`, `audio/source.wav`, `audio/clean.wav`;
    duration via `ffprobe`; if no voice file, that check is `skipped` with
    the reason, not failed).
  - Report JSON: `{source, provenance: "owner-supplied"|"run-produced",
    entries, firstStart, lastEnd, voiceDurationSec, ok, failures: [...]}`.
    (Provenance: clean.json/words_owner.txt are owner-supplied today; keep
    the field data-driven.)
  - Exit 0 iff ok, else exit 1 printing the named failures.
- `heart sound <project>` — the program's sound-design leg:
  - Required inputs: `audio/events.json`, `audio/beds.json`,
    `audio/timeline.json`. If any missing: exit 1 printing each missing
    input by name (named failure, no partial run).
  - Else run `python3 skills/cartoon-shorts/scripts/sound_design.py
    <project>` (cwd = repo root), stream its output, exit with its code.
    Its artifact is `audio/sfx_bed.wav`.
- Add both to the CLI usage text. Keep the CJS-runner bridge working
  (the server reaches the CLI through `server/heart-cjs-runner.cjs`).

### B2. Station execution actions (server)

Extend `POST /api/action` with:
- `action: "timing"` → job running `heart timing <activeDir>` through the
  runner; `outputArtifact = <activeDir>/out/timing_report.json`; job done
  requires exit 0 AND artifact exists non-empty AND its `ok` is true (extend
  the verification step for this action to parse the report).
- `action: "sound"` → job running `heart sound <activeDir>`;
  `outputArtifact = <activeDir>/audio/sfx_bed.wav`.
Timing and sound stations in the UI get real run controls + log + stop
(the existing job plumbing), replacing any status-only display.

### B3. RUN v2 (`POST /api/run`)

Replace the round-1 stub sequence with real leg execution, in order. Each leg
ends in exactly one state: `executed` (ran now, artifact verified),
`verified` (artifact already existed and passes its predicate — log wording
must say it was verified, NOT re-executed), `failed` (named failures), or the
run stops: `blocked` with `waitingOn` naming the leg and why. Legs:
1. **script** — verify predicate (script file exists).
2. **voice** — verify predicate (voice file exists; used as-is).
3. **timing** — EXECUTE `heart timing` (fresh report every run); gate =
   report ok.
4. **board** — verify predicate (board stills count > 0). If count = 0: if
   the run request carries `dispatchStills: true`, hand over to the GitHub
   stills dispatch (workstream C) as this leg's executor and await its
   artifact verification; else stop here (waitingOn: board empty and stills
   dispatch not requested).
5. **sound** — if `heart sound` inputs all exist: EXECUTE it, gate =
   sfx_bed.wav artifact. Else if a known final-mix artifact exists (the
   existing mix candidates in `artifactChecks`): `verified`. Else stop,
   waitingOn naming the missing sound inputs.
6. **gates** — whole-film programmatic checks (`artifactChecks`); log each
   check PASS/FAIL with evidence; if any fail, the run ends `failed` at
   this leg with the named failures (export must not present as next step).
7. **export** — verify predicate (master exists). (Actual GitHub assembly
   dispatch is a separate control in workstream C, not silently folded in.)
`runSettings` keeps `{mode: quality|faster, model, effort, settings:
<effective project settings>}` and gains `legs: [{id, state, detail}]` so the
supervision view renders per-leg states. Keep the «بانتظارك» line accurate at
every stop. A run must never mark a leg done on a state write — only via the
artifact/report checks above (G3).

## C. GitHub dispatch layer (official API via the repo's established `gh` route)

`fleet/orchestrate.py` already dispatches through the `gh` CLI (the official
API client) — follow that pattern from the server (spawn `gh`, repo
`proa28518-creator/grayline-utils`). New server module `server/dispatch.js`
(zero-dep) + endpoints:

- `POST /api/dispatch/stills` `{project, spec, settings?}` — dispatch
  `fleet-render.yml` with inputs project + spec + settings (the project's
  EFFECTIVE settings JSON — from `inventory().settings` — unless an explicit
  settings object is given; validate fps ∈ {24,30}). Find the run id with
  orchestrate.py's before/after list pattern. Create a job that: polls
  `gh run view <id> --json status,conclusion` every ~15s into the job log
  (with the run id visible), on success downloads the artifact
  (`gh run download <id> -D <project>/out/fleet/<run-id>/`), unpacks the
  tar.gz, and verifies: unpacked `run-info.json` exists → job done; the
  job's `verification` string reports the settings the run recorded (from
  run-info) vs the settings sent. On failure/cancel: job failed with the
  run's conclusion in the log. Reuse the existing jobs map + `/api/job` +
  `/api/stop` (stop = stop polling; also attempt `gh run cancel <id>`).
- `POST /api/dispatch/assembly` `{project, framesRunId | framesArtifact,
  fps}` — dispatch the NEW `fleet-assembly.yml` (below) in `assemble` mode;
  same poll/download pattern; download lands in
  `<project>/out/github-master/<run-id>/`; verification = master mp4 exists
  and `ffprobe` parses it (streams present). If neither framesRunId nor
  framesArtifact is supplied, return 400 naming what is missing — never
  invent a frames source.
- `GET /api/dispatch/runs?project=<name>` — list recent workflow runs for
  both workflows (`gh run list --json databaseId,workflowName,status,
  conclusion,createdAt`), so the UI can offer real frames sources for
  assembly (run ids of completed fleet-render runs for that project).

### C1. Settings pass-through — close G10 (surgical changes only)

- `.github/workflows/fleet-render.yml`: add input `settings` (string,
  default `'{}'`), pass as env `FLEET_SETTINGS` to the Render chunk step.
- `fleet/render-chunk.ts`: when `FLEET_SETTINGS` is set and not `'{}'`,
  append `&settings=<encodeURIComponent(FLEET_SETTINGS)>` to the
  cartoon.html URL, and record the parsed settings into run-info.json as
  `settings`. NO other render-logic changes.
- `bin/heart` `cmdStill`: append the project's effective settings
  (project.json `settings`, fps normalized: 24 stays 24, anything else → 30)
  as `&settings=<encoded>` to the page URL. Server `/api/action` `preview`
  then reports `settingsStatus: 'موصول'` + the effective settings used
  (replace the round-1 unwired note).

### C2. NEW workflow `.github/workflows/fleet-assembly.yml` + `fleet/assemble.sh`

Owner's decision: final assembly/finishing runs on GitHub (clean machine),
never on the desk VM. Inputs: `project` (string), `frames_artifact` (string,
artifact name from a fleet-render run; empty in selftest), `frames_run_id`
(string, alternative source), `fps` (choice 24|30, default 30), `mix_rel`
(string, repo-relative path to a mix wav inside the project, optional),
`mode` (choice assemble|selftest, default assemble).
Steps: checkout → install ffmpeg (apt) → obtain frames (assemble:
`actions/download-artifact` by name, or `gh run download <frames_run_id>`;
selftest: generate 12 synthetic frames 1080×1920 with ffmpeg + a 2s sine
tone as the audio) → run `fleet/assemble.sh` (the SAME script for both
modes) → upload artifact `fleet-master-<project>-<run_id>` (master +
run-info.json + gate log) in assemble mode, `fleet-assembly-selftest-
<run_id>` (report + gate log) in selftest mode.
`fleet/assemble.sh <frames_dir> <fps> <audio_or_empty> <out_dir>` performs
the fleet finish discipline, failing loudly (non-zero + named gate) on any
violation:
  1. **pts audit** — frame files sorted; count ≥ 1; sequential names.
  2. **encode** — image2 → H.264 mp4 at the given fps with
     `setpts=N/(fps*TB)` re-encode (NEVER stream-copy), 1080×1920 pad/scale
     as needed, yuv420p.
  3. **audio** — if an audio file is given, mix/encode it as AAC under the
     video (shortest-off handling explicit); else silent AAC track.
  4. **SSIM verify** — decode the master back to frames, SSIM-compare a
     sample (first/middle/last) against the source frames; log the scores;
     fail if mean SSIM < 0.95.
  5. **run-info.json** — `{project, fps, frames, durationSec, settings:
     {fps}, filmGradedInFrames: false, filmGrade: null, gates: {...}}`
     (grading is a later layer; record honestly).
In selftest mode the workflow runs assemble.sh on the synthetic inputs and
uploads its gate log — proving the gates execute on GitHub without
assembling a real film.

### C3. UI dispatch surfaces

Render station: «إرسال لقطات إلى GitHub» control (spec input with a sane
default, shows the effective settings that will be sent) wired to
`/api/dispatch/stills`, with the job's run id + polling states in the log
pane. Finish station: «تجميع على GitHub» control wired to
`/api/dispatch/assembly`, its frames source chosen from
`/api/dispatch/runs` (real completed render runs) — if none exist, the
control explains that honestly. Both controls show queued / dispatched /
running / artifacts-back states from the job, never from local state writes.

## D. Colab render leg — queue surface only

Render station gains a «طابور Colab» panel: read
`<project>/out/colab_queue.json` if it exists and list its entries as-is;
otherwise show an empty queue. The dispatch control is marked
«غير قابل للإرسال من داخل البرنامج بعد» with the reason in one line: no
official API exists to start a Colab session; the on-demand queue worker is
not built yet. Do NOT create queue entries, do NOT fake a worker.

## E. Forward-compatibility (owner-approved future rounds — do NOT build)

Five additions are approved for LATER rounds: a «فيلم جديد» conversation
entry, the Quality/Faster toggle (already in run controls — keep it), a
shared asset library section, retention analysis feeding the Write step,
and an in-program lessons memory. Do not build them now; do not design
anything that blocks them: keep the shell's section list simple to extend,
keep run controls carrying mode/model/effort, keep connections/dispatch
surfaces generic (status entries / dispatch kinds as data, not hardwired
one-offs).

## Definition of done (round 2)

- [ ] `/api/connections` + probe: all four checks real; Gemini honestly
      awaiting owner sign-in; no secret value anywhere in responses/logs.
- [ ] `heart timing` + `heart sound` work from the CLI; timing/sound
      stations execute through the server with artifact-verified done.
- [ ] RUN v2 executes legs in order with executed/verified/failed/blocked
      states and an accurate «بانتظارك»; no honor-system dones.
- [ ] Stills dispatch end-to-end via gh (dispatch → poll → download →
      unpack → verify), settings recorded by the run (G10 closed on the
      dispatch path AND on `heart still`).
- [ ] `fleet-assembly.yml` + `fleet/assemble.sh` committed; selftest mode
      exercises the real gate script.
- [ ] Colab queue surface present, honestly marked not-yet-dispatchable.
- [ ] Everything committed on `ui/unified-interface` (only round-2 files);
      final summary states: run command, what is wired vs marked, and how
      each of A–D is verified.
