# Stage 4 verification

## Static checks

Run from the repository root:

```sh
node --check server/server.js
node --check app/renderer/app.js
python3 -m py_compile tools/transcribe.py
git diff --check
```

Results in this seat: all four commands exited 0. These are syntax/whitespace checks only; no server was bound and no production pass was run here.

## Changes covered

- Conversation storage has a named `MAX_CONVERSATION_MESSAGES = 300` cap. The oldest `job_feed` rows are discarded first; protected user, director, and tool-result messages remain. If protected rows alone exceed the cap, the add fails with `conversation_message_limit_reached`.
- Conversation saves merge rows from disk and memory by thread ID. The newer `updatedAt` row supplies thread fields; message IDs are unioned and sorted, and `jobCursor` uses the larger value before the cap is applied.
- `create_project` probes an attached narration using `ffprobe` and requires an audio stream before project scaffolding/copy. Failure is named `create_project_audio_invalid`.
- Annotation input rejects frames over 200 characters (`annotation_frame_too_long`) and changes over 2000 (`annotation_change_too_long`). The builder contract JSON-stringifies both frame and requested change.
- ASR availability checks only the selected model's cache: faster-whisper's `models--Systran--faster-whisper-<model>/snapshots/*/model.bin`, or openai-whisper's `<model>.pt`. `audio/clean.wav` is copied to a same-directory temporary file and atomically renamed.
- Full-frame prop scans omit the film's own captions, subtitles, and on-screen text overlays. Numeric prop fractions must match `[0.1, 0.5, 0.9]` within `0.005`; invalid values return `prop_truth: <name> invalid_declaration`. Time and clock values continue to snap to the nearest probe, and the builder contract states both rules.
- The chat composer now has an attach button/path, connected model selector, explicitly unwired effort and exact-shot-plan controls, wired style picker, 24/30 FPS, build mode, and send control. FPS remains limited to 24/30.
- `GET /api/styles` reads actual directories in `skills/` and checks all five pass step files. `cartoon-shorts` is wired and labeled “3D Cartoon Shorts”; `pixel-explainer-video` is not wired because it has only an SFX script and no production step files; “Cinematic” is listed as not wired because Heart Studio holds no such pack. Unwired entries are disabled in the composer and shown with reasons on Styles.
- Style is stored in conversation inputs, copied to new projects as `project.json.settings.style`, and included in the director's `create_project` result. Existing projects without a style resolve to `cartoon-shorts`, and pass/run start persists that default. Pass step files load only from the selected `skills/<style>/steps/` directory. A missing file fails as `style_step_missing`; there is no fallback. Pass state records `style`; run settings and `out/runs/<run-id>.json` record it too.
- Styles and the chat picker read/write the same project setting. `/api/settings` rejects unregistered or unwired styles with a named error.

## Desk live exercise

These calls assume the desk server is already running at port `18911`, and `projects/accept-s6slice/voice_owner.wav` exists. Use a fresh `chat-test-` name for every run. The two project names below are examples; confirm they do not already exist before use.

### A. Registry and composer payload

```sh
BASE=http://127.0.0.1:18911
curl -sS "$BASE/api/styles"
```

Expected registry: `defaultStyle` is `cartoon-shorts`; exactly that production pack is `wired:true`; pixel explainer and cinematic are `wired:false` with their reasons. The renderer sends `style` on both `POST /api/conversations` and `POST /api/conversations/<id>/messages`. In the UI, attach the narration using the paperclip, leave Style at the wired pack, and send a setup request. Confirm the create response has `inputs.style`, then fetch the thread and confirm its `create_project` tool result includes `style:"cartoon-shorts"` and `styleLabel:"3D Cartoon Shorts"`. The resulting project's `project.json` must contain `settings.style:"cartoon-shorts"`.

```sh
curl -sS -X POST "$BASE/api/conversations" -H 'content-type: application/json' \
  -d '{"title":"Stage 4 default style","name":"chat-test-style-default","audioPath":"projects/accept-s6slice/voice_owner.wav","story":"A small test: a baker finds a blue key and opens a window to let a bird fly out.","priorities":"Keep the key and bird visible; use the attached voice exactly.","fps":30,"style":"cartoon-shorts"}'
# Copy the id from the response into CHAT_ID.
CHAT_ID='<conversation id>'
curl -sS -X POST "$BASE/api/conversations/$CHAT_ID/messages" -H 'content-type: application/json' \
  -d '{"text":"Please set up this small test project from the conversation.","audioPath":"projects/accept-s6slice/voice_owner.wav","style":"cartoon-shorts"}'
curl -sS "$BASE/api/conversations/$CHAT_ID"
curl -sS -X POST "$BASE/api/select" -H 'content-type: application/json' -d '{"name":"chat-test-style-default"}'
curl -sS "$BASE/api/project"
```

The selected style in `/api/styles`, the chat transcript's setup result, and the new project's `settings.style` must agree.

### B. Default pass record

Run Build on the scratch project. A pass can be recorded as failed by measured checks; verify the style metadata separately from checkpoint success:

```sh
curl -sS -X POST "$BASE/api/passes/run" -H 'content-type: application/json' -d '{"pass":"build","mode":"quality"}'
# Copy the returned id into PASS_ID, then poll until ended.
PASS_ID='<job id>'
curl -sS "$BASE/api/job?id=$PASS_ID"
curl -sS "$BASE/api/passes"
cat projects/chat-test-style-default/out/passes/build/state.json
```

`runSettings.style` from `/api/job`, and `style` from `/api/passes` and the pass `state.json`, must say `cartoon-shorts` even if a separate measured gate fails.

### C. Non-default unwired-style failure

Only one style has pass files today, so no non-default style can honestly complete a pass. Use a second scratch project to verify it records the requested non-default ID and fails by name rather than silently falling back. Create it through the chat setup sequence above with name `chat-test-style-unwired`, then set only that scratch project's `project.json` to the unwired ID (the UI correctly disables this choice):

```sh
node -e 'const fs=require("fs"),p="projects/chat-test-style-unwired/project.json",j=JSON.parse(fs.readFileSync(p,"utf8"));j.settings={...(j.settings||{}),style:"pixel-explainer-video"};fs.writeFileSync(p,JSON.stringify(j,null,2)+"\n")'
curl -sS -X POST "$BASE/api/select" -H 'content-type: application/json' -d '{"name":"chat-test-style-unwired"}'
curl -sS -X POST "$BASE/api/passes/run" -H 'content-type: application/json' -d '{"pass":"build","mode":"quality"}'
# Poll returned job id via /api/job?id=<job-id>.
curl -sS "$BASE/api/passes"
cat projects/chat-test-style-unwired/out/passes/build/state.json
```

Expected: `state.json.style` and `/api/passes[].style` equal `pixel-explainer-video`; job/state failure names `style_step_missing` and `skills/pixel-explainer-video/steps/build.md`. No builder dispatch occurs and no cartoon fallback is loaded. A UI/API attempt to select this pack should show its NOT WIRED badge or return `style_not_wired`.

## Endpoints to exercise

- `GET /api/styles`
- `POST /api/conversations`
- `POST /api/conversations/:id/messages`
- `GET /api/conversations/:id`
- `POST /api/select`
- `GET /api/project`
- `POST /api/passes/run`
- `GET /api/job?id=:id`
- `GET /api/passes`

No server bind, live pass, desk project creation, or commit was performed from this seat.
