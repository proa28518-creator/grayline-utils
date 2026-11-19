# BUILD REPORT — Heart Studio v1 (2026-11-18)

## What was built
One installable Linux program packaging what already works: the adopted
cartoon heart (engine, unmodified) + a standalone Arabic RTL control page
(served by the program's own zero-dependency Node server, state in each
project's `panel_state.json`) + the pipeline tooling (`heart` CLI:
new / serve / still) + the cartoon-shorts skill + the complete Story 2
project as the bundled demo (`projects/demo-ring/`).

Design input came from parallel bench consults via the APInex MCP —
DeepSeek V4 Pro (installer/packaging), Kimi K3 (server + CLI), Qwen 3.8 Max
(control UI) — merged by the desk; the code was written for this repo.
Merged decisions: wrapper-script launcher (not a symlink) embedding the
clone path; serialized atomic state writes (tmp + rename); targeted DOM
updates in the UI so polling never clobbers typing; `heart still` drives
Chromium over CDP with Node's built-in WebSocket (no npm packages anywhere).

## Engine integrity (byte-identical, verified by md5)
- engine.js: `316f277544566d8de208c8b1c38e248a` — source = repo `engine/` = `projects/demo-ring/`
- models.js: `2957eba4afb66b263762e78f3fec3b90` — source = repo `engine/` = `projects/demo-ring/`
- The `engine/` directory tree diffed identical to the source project.

## Install test (this VM, scratch prefix + scratch HOME)
- `bash install.sh` → Node v24.22.1 ✓ · Chromium located in the Playwright
  cache ✓ · launcher written to the scratch `~/.local/bin/heart` ✓ · PATH
  warning printed ✓ · next steps printed ✓.
- From the installed launcher: `heart serve demo-ring` served the UI (HTTP
  200), the project host page (HTTP 200) and `/api/state` (demo title and
  script loaded from the project). API rules exercised live: requesting
  step `write` → 200 and status `requested`; requesting `run` out of order
  → refused, `run` stayed `idle`; both actions logged.

## Proofs (eye-checked by the desk)
- `heart_studio_ui.png` — full-page screenshot of the control UI served by
  the scratch install: every SPEC section present in order (title, idea,
  script + version 1 + invalidation warning, voice card, six steps with
  badges/timestamps and Build's four sub-pass chips, approvals, final film,
  event log); step gating correct.
- `heart_studio_frame.png` — one still from `heart still demo-ring 33`:
  the gold ring floating over the fountain basin with the caption
  «فضل متعلق», matching the delivered film's verified 33.0 s frame.

## GLM verification (APInex MCP, free/glm-5.3)
Checklist: engine unmodified (md5s) · installer steps sane · server API
covers the SPEC state · UI sections match SPEC · demo project complete.
All five items PASS.
**VERDICT: YES**
GLM's noted caveats: Chromium is a runtime environment dependency (the
installer warns with install instructions rather than failing — the panel
and server run without it, only `heart still` needs it), and UI
interactivity was proven via the live API tests plus the screenshot rather
than a click-through log.

## Notes / trims
- Demo copy excluded only `out/` (render outputs, 36 KB). No other trims —
  the project is 152 MB, the whole repo ≈ 178 MB, far below the trim
  threshold.
- `heart still` requires Node >= 22 for its built-in WebSocket client;
  the installer says so when Node is 20/21. Serve/UI work on Node >= 20.
- Full-film renders stay on the fleet route, as always; this program is
  for control, preview and single stills.
