# Round-2 hunt findings — merged, desk-triaged

Hunters: Opus 5.5 via LLMsRelay (`orch/ui_hunt_round2_opus.md`) and GLM
free/glm-5.3-flashx via APInex #2 (`orch/ui_hunt_round2_glm.txt`), both on
the full round-2 diff + new files. Plus one desk-found defect from live
verification. Fix instructions: `orch/UI_FIX_ROUND2.md`.

## Confirmed → fixed in the fix round
- **DF-1 (HIGH, desk)** — GPT connection probe read only stdout; `codex
  login status` prints "Logged in using ChatGPT" to stderr → a healthy seat
  probed `dead` live. → FIX 1 (combined stdout+stderr).
- **Opus F5 (MED)** — Gemini Cookies DB copied to /tmp under a predictable
  name during the names-only probe. → FIX 2 (immutable read-only open of
  the original; private mkdtemp fallback removed in `finally`).
- **Opus F8 (MED)** — artifact-verified jobs accepted a stale pre-existing
  artifact. → FIX 3 (mtime freshness vs job start).
- **Opus F13 (MED)** — no guard against concurrent RUNs on one project.
  → FIX 4 (409 while a run is active for the project).
- **Opus F2/F15 + GLM F6 (LOW-MED)** — dispatch cancel checked only at the
  poll-loop top; a stop during download still applied artifacts. → FIX 5
  (cancel checks before download and before applying artifacts).
- **GLM F9 (MED)** — assemble.sh pts_audit accepted mixed 0/1-based
  sequences (0,2,3 passed despite a gap). → FIX 6 (single consistent base).
- **Opus F6 (LOW)** — raw gh stderr/stdout could reach errors/logs
  unsanitized. → FIX 7 (token-shape scrubber in dispatch.js).

## Rejected — with evidence
- **Opus F1** (RUN IIFE unhandled rejection): the IIFE ends in `.catch`
  that sets failed+ended+waitingOn; both dispatch endpoints wrap
  dispatch+monitor in try/catch identically. Self-contradicted by the code
  it quoted.
- **Opus F3** (monitor throw leaves job in limbo): both call sites catch
  (see F1). 
- **Opus F7** (settings "wired" claim unproven): the project host
  `__suite/chost.js` parses `?settings=` via URLSearchParams (grep-verified
  in both demo-ring and story6 copies; matches gap-audit G10's desk
  finding). Closed empirically by the desk's dispatch proof (run-info.json
  recorded the sent settings).
- **Opus F4/F10/F11/F12, F9, F14**: self-retracted by the hunter on its own
  re-read ("reconsidered, this is clean") or wording nuances, not defects.
- **GLM F1** (authMetadata = leakage): brief-mandated metadata only —
  auth_mode, last_refresh, token presence; no values; server binds
  127.0.0.1.
- **GLM F2/F3** (traversal/injection via dispatch): gh is spawned with argv
  arrays, no shell anywhere; the runs filter is a name-prefix comparison
  against artifacts in the owner's own repo.
- **GLM F4** (Gemini status faked): contradicted by the live probe —
  Gemini returned `awaiting_owner_signin` — and by GLM's own CLEAN line
  ("code reads cookies only and never attempts authentication").
- **GLM F5** (close-handler suspicion): `node --check` clean and the close
  handler's behavior verified live (sound job failed on exit code; timing
  job verified via report parse).
- **GLM F7** (monitor awaited in request handler): dispatch endpoints
  return 202 immediately; monitor runs inside the job's async task.
- **GLM F8** (raw settings into URL): value is encodeURIComponent'd and
  originates from the server's own validated settings.
- **GLM F10** (SSIM samples 3 frames): exactly the brief's spec
  (first/middle/last sample, mean ≥ 0.95 gate).

## Live desk verification (pre-fix)
- Server: `/` 200 (27,756 B); `/api/connections` honest unprobed state.
- Probe: Opus connected, GLM connected (free/glm-5.3-flashx), Gemini
  awaiting_owner_signin — all real. GPT false-dead → DF-1 above.
- Executor on a scratch project (heart new ui-exec-proof, template
  fixtures): RUN 1 — script verified, voice verified, timing EXECUTED
  (117 entries, report ok, provenance run-produced), board honestly
  blocked. Sound action — failed with all three missing inputs named.
  RUN 2 (board/mix/master fixtures copied in) — all 7 legs passed,
  status done, waitingOn «لا شيء».
- Assembly dispatch without a frames source → HTTP 400 naming the missing
  input. `/api/colab-queue` → empty entries. Story 6 tree untouched.
