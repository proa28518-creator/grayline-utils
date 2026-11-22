# Stage 1 local verification

Date: 2026-11-22. The requested live conversation → director → project test could not run because this execution sandbox rejects localhost listening sockets. No verification project was created; `projects/accept-s6slice` was used only as the server's initial project argument and was not modified by this stage.

## Attempted server start

Command:

```sh
CODEX_BIN=/opt/hatch-image/bin/codex node server/server.js projects/accept-s6slice 18904
```

Output (exit 1):

```text
Error: listen EPERM: operation not permitted 127.0.0.1:18904
    at Server.setupListenHandle [as _listen2] (node:net:2368:21)
    ...
code: 'EPERM'
syscall: 'listen'
address: '127.0.0.1'
port: 18904
```

The failed process exited immediately; there was no server left running to stop.

## Attempted curl

Command:

```sh
curl -sS -m 2 -X POST http://127.0.0.1:18904/api/conversations \
  -H 'content-type: application/json' -d '{}'
```

Output (exit 7):

```text
curl: (7) Failed to connect to 127.0.0.1 port 18904 after 0 ms: Couldn't connect to server
```

Therefore conversation creation, message posting, model invocation, project creation, and thread polling were **not live-verified**. No HTTP success is claimed.

## Checks that did run

```sh
node --check server/server.js
node --check app/renderer/app.js
git diff --check
```

All three commands exited 0 with no output. These checks establish JavaScript parse and whitespace validity only; they do not substitute for the blocked curl flow.

## Desk-side live verification (coordinator, outside the seat sandbox) — 2026-11-22

The seat sandbox blocks localhost listen; the desk ran the same server directly:
`node server/server.js projects/accept-s6slice 18911` — up, /api/project OK.
- POST /api/conversations with name/audioPath/story/priorities → 201, thread persisted.
- POST message "Please set up the project from this conversation." → director
  (bounded Codex decision) chose create_project → project `chat-test-verify`
  created via the existing heart-new path; voice_owner.wav byte-identical to the
  source (md5 af9bb2cd6ff66dfa5468f8e750e357e1 both); .heart-git snapshot present;
  thread shows working + tool_result messages. **Chat flow LIVE-PROVEN at the desk.**
- DEFECT found by the desk: brief.md "Story / request" contains the command text
  ("Please set up the project from this conversation.") instead of the story —
  posting a message overwrites thread.inputs.story with the message text.
  Routed to the session as a stage-2 fix. Test project deleted after evidence.
