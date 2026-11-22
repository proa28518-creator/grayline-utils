# Stage 4 pass-style fix verification

## Root cause and change

The pass route declared `styleId` once when creating the job, then declared another `const styleId` inside the async pass callback. That inner binding shadowed the route binding across the callback, so the earlier style validation read it in its temporal dead zone and failed with `Cannot access 'styleId' before initialization`. The inner redeclaration is removed; the validated style and selected step path are now shared with the pass callback. Validation runs before a pass is marked started: unregistered styles, missing selected pass steps, and other unwired styles fail with their named errors; the pass state records `validation_failed`, and no history text claims a builder was dispatched. The `/api/run` path was audited: it has no inner `styleId` redeclaration, and its validation precedes the run's production legs and remote dispatch.

## Static checks

```text
$ node --check server/server.js
(exit 0)
$ git diff --check
(exit 0)
```

No server was bound and no live pass was run from this seat.

## Desk re-check: sequence C

Use the desk server on port 18911 and the existing scratch fixture `chat-test-style-unwired` whose `project.json` has `settings.style` set to `pixel-explainer-video`.

```sh
BASE=http://127.0.0.1:18911
curl -sS -X POST "$BASE/api/select" -H 'content-type: application/json' \
  -d '{"name":"chat-test-style-unwired"}'
curl -sS -X POST "$BASE/api/passes/run" -H 'content-type: application/json' \
  -d '{"pass":"build","mode":"quality"}'
# Copy the returned job id below.
PASS_ID='<returned job id>'
curl -sS "$BASE/api/job?id=$PASS_ID"
curl -sS "$BASE/api/passes"
cat projects/chat-test-style-unwired/out/passes/build/state.json
```

Expected response/job state:

- The start response has `status:"failed"` and `waitingOn` beginning `style_step_missing: style pixel-explainer-video has no required pass file skills/pixel-explainer-video/steps/build.md`.
- `/api/job` reports `status:"failed"`, that same `waitingOn`, and a failure log containing the named error. No builder process or builder log is present.
- `state.json` has `state:"failed"`, `style:"pixel-explainer-video"`, and a `history` entry with `event:"validation_failed"` and the named missing-step detail. It must not claim “Builder dispatched”.
- `/api/passes` reports the Build row as failed and retains `style:"pixel-explainer-video"`.

The wired-path first validation step is the registry lookup `styleById(styleId)`; for `cartoon-shorts`, validation then confirms `skills/cartoon-shorts/steps/build.md` exists before the pass is marked started or any builder is dispatched.
