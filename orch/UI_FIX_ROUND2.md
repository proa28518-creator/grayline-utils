# FIX ROUND — Round 2 (from Opus 5.5 + GLM hunts, desk-triaged, + 1 desk-found defect)

Repo `~/workspace/heart-studio`, branch `ui/unified-interface`. Apply ONLY the
seven fixes below to the round-2 files (`server/server.js`,
`server/dispatch.js`, `fleet/assemble.sh`). Do not change anything else. Do
not commit (the desk commits). Every fix must keep all round-1/round-2
behavior that the desk verified live: connections probe shape, RUN legs,
dispatch endpoints, 24/30 fps rule, Arabic UI strings.

## FIX 1 (HIGH, desk-found, proven live) — GPT probe reads the wrong stream
`codex login status` prints "Logged in using ChatGPT" to **stderr** (stdout
is empty, exit code 0). The probe in `probeConnections` only inspects the
captured stdout, so a healthy ChatGPT seat reports `dead`. Fix: test the
login regex against stdout + stderr combined. Keep returning metadata only.

## FIX 2 (MED, Opus F5) — Gemini cookie DB copy hygiene
The probe copies the Gemini desktop `Cookies` DB into /tmp under a
predictable name. Fix: first try reading cookie NAMES directly from the
original DB read-only (e.g. `sqlite3 "file:<path>?immutable=1"` via
spawnSync, names-only SELECT). If that fails, fall back to copying into a
fresh `fs.mkdtempSync(os.tmpdir() + '/heart-gem-')` directory (unpredictable
name) and remove the whole directory in a `finally`. Never read or return
cookie values. Any read failure → status `unknown` with the reason, never
`connected`.

## FIX 3 (MED, Opus F8) — artifact freshness for verified jobs
In `runCommand`'s close handler, an `outputArtifact` that merely exists and
is non-empty passes — including a STALE file from an earlier run when the
command exits 0 without rewriting it. Fix: also require the artifact's
mtime to be >= the job's `startedAt` minus 2000 ms. Keep the timing-report
JSON `ok` parse on top. Verification strings must say when freshness failed.

## FIX 4 (MED, Opus F13) — concurrent RUN guard
`POST /api/run` has no guard: two runs on the same project interleave writes
(timing report, panel state). Fix: mark run jobs with `kind: 'run'`; if any
un-ended run job exists for the same `projectDir`, return HTTP 409 with an
Arabic error naming the running run's id. (Station jobs and dispatch jobs
are unaffected.)

## FIX 5 (LOW-MED, Opus F2/F15 + GLM F6) — cancel during dispatch download
`monitor()` in `server/dispatch.js` checks `cancelRequested` only at the top
of the poll loop: a stop requested during artifact download still unpacks,
copies stills into the project board, and verifies. Fix: check
`job.cancelRequested` (a) right after a poll returns `completed`, before
downloading, and (b) after download, before unpack/board-copy/verification.
If set: end as `stopped`, log that the stop was honored and artifacts were
NOT applied. The GitHub-side cancel call in `/api/stop` stays as is.

## FIX 6 (MED, GLM F9) — assemble.sh pts_audit must use ONE consistent base
The audit accepts `actual == i || actual == i+1` per index, so a mixed
sequence like frames 0,2,3 passes despite a gap. Fix: derive the base from
the FIRST frame (its number must be 0 or 1, else fail), then require every
frame's number to equal base + index. Keep the PASS/FAIL log lines and gate
name `pts_audit`.

## FIX 7 (LOW, Opus F6) — scrub token-shaped strings from gh output
`server/dispatch.js` throws/logs raw `gh` stderr/stdout (up to 1000 chars)
into errors and job logs. Fix: one scrub helper applied to every gh-derived
string before it is thrown, logged, or returned: replace
`ghp_[A-Za-z0-9_]+`, `gho_[A-Za-z0-9_]+`, `github_pat_[A-Za-z0-9_]+`, and
`Bearer <non-space>` with `[redacted]`. Apply it in `json()`, the dispatch
error paths, and monitor's log pushes of gh output.

## Rejected findings (do NOT "fix" these — desk-verified non-defects)
- Opus F1/F3: the RUN IIFE and both dispatch endpoints already terminate in
  try/catch that sets `failed` + `ended`. No change.
- Opus F7: the project host (`__suite/chost.js`) DOES parse `?settings=`
  (URLSearchParams) — settings pass-through is real. No change.
- GLM F1: `authMetadata` is brief-mandated metadata (mode/refresh/presence),
  no values. GLM F2/F3: gh is spawned with argv arrays (no shell); project
  filter is a name-prefix comparison in the owner's own repo. GLM F4:
  contradicted by the live probe (awaiting_owner_signin) and its own CLEAN
  line. GLM F5: close handler verified live. GLM F7/F8/F10: by design/per
  spec (202 responses; encodeURIComponent; SSIM sample = brief's spec).
