# Stage 2 static verification and desk exercise

Date: 2026-11-22. This seat cannot bind localhost and does not have write access to `.git`; no server was started and no commit was attempted. The desk should perform the live HTTP checks below.

## D1 regression fix

The message handler in `server/server.js` now records a plain message as conversation history only. It updates `thread.inputs.story` and `thread.inputs.priorities` only when explicit `storyUpdate` or `prioritiesUpdate` fields are supplied. The chat UI posts only `{text,audioPath}` for ordinary messages. Initial story/priorities remain conversation creation inputs. `write_brief` reads those saved inputs, so the setup command cannot replace the story.

Regression scenario for the desk: create a conversation with `story` set to `An office worker is moved into a tiny empty room beside a man who has sat there for three years.`, priorities `Keep the room empty; preserve the slow lonely turn.`, and `name` `chat-test-d1-check`; post `Please set up the project from this conversation.`; then inspect the created project's `brief.md`. Its Story / request section must contain the original story, its priorities must remain intact, and the command sentence must not appear as the story. The user's Stage 1 report established the prior failing result; this code path fix is statically inspected here and awaits the desk rerun.

## B2 annotation path

New annotations are stored as `open`; old `captured_unwired` rows remain readable and are treated as open. Before a pass builder starts, the runner snapshots open annotations for the selected project and injects each cited frame and exact requested change into its builder contract and both critic evidence packs. Only after measured checks, critics, and the pass checkpoint commit succeed are those rows marked `addressed`, with `addressedBy`, `checkpointCommit`, and `addressedAt`. The renderer displays the state and checkpoint hash and no longer labels the loop not wired.

Static evidence: `server/server.js` pass-run setup filters statuses other than `addressed` / `closed`, embeds `frame` and `JSON.stringify(change)`, and marks rows addressed after `git rev-parse HEAD`; `/api/annotations` creates open rows. `app/renderer/app.js` maps legacy rows to open and renders addressed metadata.

## Prop-truth gate

Pass builders receive the `props.json` contract and may update it within their allowed paths. The director seeds names supplied by its bounded tool decision. After each pass renders three measured probe stills, the program validates normalized boxes, uses ffmpeg to crop each declared prop, sends each crop and each full frame to the bounded Codex vision seat via `codex exec ... -i <image>`, and writes `out/passes/<pass>/prop_gate.json`. Invalid props, mismatches, leftovers, malformed verdicts, or missing probes are named measured failures and feed the next builder fix round; vision seat failure is `not_run_seat_unavailable` and blocks checkpoint. `/api/passes` returns the measured gate and crop evidence; Berserk supervision and Editor pass rows render status, failures, and crops.

Set dressing allowances are read from a `Set dressing allowance:` line in `brief.md`, as comma/semicolon/pipe-separated names. With no allowance, visible objects outside `props.json` fail the leftover scan. The vision result is a model judgment, not a deterministic image classifier; it is bounded, image-attached, recorded, and never silently treated as passing when unavailable.

## B3 pass readiness audit

All five definitions in `server/passes.js` now include `props.json` in allowed outputs and required pass-specific contracts:

| Pass | Instruction set | Required measured source contracts |
| --- | --- | --- |
| Build | `skills/cartoon-shorts/steps/build.md` | nonempty `scenes/BIBLE.md`; `shots:` in `scenes/film.js` |
| Camera angles | `skills/cartoon-shorts/steps/camera.md` | `shots:` and `camera:` in `scenes/film.js` |
| Environment overhaul | `skills/cartoon-shorts/steps/environment.md` | nonempty `scenes/set.js` |
| Post-processing | `skills/cartoon-shorts/steps/post.md` | `makePost` in `scenes/post.js`; `post` in `scenes/set.js` |
| Shading | `skills/cartoon-shorts/steps/shading.md` | `makeShade` in `scenes/shade.js`; `shade` in `scenes/set.js` |

The runner loads the corresponding full instruction file and gives every pass the same probe renderer, source contracts, annotation pack, measured prop gate, GLM critic, and fresh Opus critic path as Build. Source-marker checks prove structural presence; they do not prove visual quality. The desk must exercise the four remaining passes against the real project.

## B1 ASR result

`heart transcribe <project>` uses the configured local faster-whisper / OpenAI Whisper Python environment and requests Arabic word timestamps. It writes word objects in `audio/clean.json` (`start`, `end`, `line`, `who`, `word`), `transcript.txt`, and `out/transcribe_report.json`, the JSON shape consumed by `heart timing`. It byte-copies the selected original narration to `audio/clean.wav` for the existing renderer contract; the source narration is not transformed.

The configured venv contains `faster-whisper`, but the `small` model weights are not cached and the sandbox cannot download them. Probe output:

```text
{"available": false, "engine": "faster-whisper", "model": "small", "error": "asr_model_unavailable: model weights are not cached locally"}
```

The attempted CLI transcription of a temporary copy of `projects/accept-s6slice/voice_owner.wav` failed with:

```text
asr_model_unavailable: model weights are not cached and cannot be downloaded in this environment
```

No transcript or timing was fabricated, and `projects/accept-s6slice` was not used as the output target. Word-level accuracy against its `words_owner.txt` is **not measurable in this sandbox** because inference never ran. The UI reports local ASR as not wired until both engine and weights are available. Desk should install/cache the model under `~/workspace/tools/whisper-models` (or set `HEART_ASR_MODEL_DIR`) and rerun before exercising a full run.

## Static checks

Commands and outputs after the Stage 2 edits:

```text
node --check server/server.js                 exit 0, no output
node --check app/renderer/app.js               exit 0, no output
node --check bin/heart                         exit 0, no output
python3 -m py_compile tools/transcribe.py      exit 0, no output
git diff --check                              exit 0, no output
configured whisper venv probe                 exit 0, available=false, faster-whisper, model weights not cached
```

These checks establish parse and whitespace validity; they do not replace desk live verification or pass execution.

## Desk live calls

Use the running desk server, for example `BASE=http://127.0.0.1:18911`. Commands below are JSON requests; capture returned `id` values and poll until `ended:true`.

### D1 create → command → inspect thread and brief

```sh
BASE=http://127.0.0.1:18911
THREAD=$(curl -sS -X POST "$BASE/api/conversations" -H 'content-type: application/json' -d '{"name":"chat-test-d1-check","audioPath":"/home/hatch/workspace/heart-studio/projects/accept-s6slice/voice_owner.wav","story":"An office worker is moved into a tiny empty room beside a man who has sat there for three years.","priorities":"Keep the room empty; preserve the slow lonely turn.","fps":24}')
printf '%s\n' "$THREAD"
CHAT_ID=$(printf '%s' "$THREAD" | jq -r .id)
curl -sS -X POST "$BASE/api/conversations/$CHAT_ID/messages" -H 'content-type: application/json' -d '{"text":"Please set up the project from this conversation."}'
curl -sS "$BASE/api/conversations/$CHAT_ID"
cat projects/chat-test-d1-check/brief.md
```

Expect the project and thread working/tool-result messages, the story and priorities above in `brief.md`, and no replacement of Story / request with the command sentence. Remove `projects/chat-test-d1-check` after recording the result.

### B2 + prop gate + remaining passes

```sh
BASE=http://127.0.0.1:18911
poll_job() { JOB_ID=$1; while :; do JOB=$(curl -sS "$BASE/api/job?id=$JOB_ID"); printf '%s\n' "$JOB"; [ "$(printf '%s' "$JOB" | jq -r .ended)" = true ] && break; sleep 5; done; }
curl -sS -X POST "$BASE/api/select" -H 'content-type: application/json' -d '{"name":"accept-s6slice"}'
curl -sS -X POST "$BASE/api/annotations" -H 'content-type: application/json' -d '{"frame":"probe-1.png","change":"Make the worker's gaze land on the empty chair; keep the chair visibly empty."}'
curl -sS "$BASE/api/annotations"
CAMERA=$(curl -sS -X POST "$BASE/api/passes/run" -H 'content-type: application/json' -d '{"pass":"camera","mode":"quality"}')
printf '%s\n' "$CAMERA"
poll_job "$(printf '%s' "$CAMERA" | jq -r .id)"
curl -sS "$BASE/api/passes"
curl -sS "$BASE/api/annotations"
```

For each pass, wait for its job to end before starting the next. Check `/api/passes` and `projects/accept-s6slice/out/passes/<pass>/prop_gate.json`; inspect the crops and failures. If the gate blocks, inspect its named builder fix instructions and run that pass again. Once Camera is checkpointed, repeat in strict order:

```sh
for PASS in environment post shading; do
  RUN=$(curl -sS -X POST "$BASE/api/passes/run" -H 'content-type: application/json' -d "{\"pass\":\"$PASS\",\"mode\":\"quality\"}")
  printf '%s\n' "$RUN"
  poll_job "$(printf '%s' "$RUN" | jq -r .id)"
done
```

Poll each returned job at `GET /api/job?id=<id>` before issuing the next request. Verify the annotation row becomes `addressed` with `addressedBy` and a checkpoint hash only when Camera checkpoints. Verify `prop_gate.json` includes crop rows and frame scans; an unavailable vision seat must leave the pass failed and gate status `not_run_seat_unavailable`.

### ASR and full run

```sh
curl -sS "$BASE/api/asr-status"
```

After caching the local model, run `bin/heart transcribe projects/accept-s6slice`; record the CLI report's `accuracy.word_accuracy`, `accuracy.wer`, and reference count. Run API via `POST /api/run` with the desired model, effort, mode, spec and `dispatchStills`; poll `GET /api/job?id=<id>`. Confirm the timing leg uses generated `audio/clean.json`. The current sandbox cannot provide that accuracy result.

## Changed files for this stage

Implemented files to take forward: `server/server.js`, `server/passes.js`, `app/renderer/app.js`, `app/renderer/app.css`, `bin/heart`, `tools/transcribe.py`, and this verification note. No commits were made from this sandbox.
