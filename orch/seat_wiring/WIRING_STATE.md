# WIRING STATE — seat-wiring round (2026-11-22)

Branch `ui/seat-wiring` · worktree `~/workspace/heart-studio-wiring` · base `ui/unified-interface` @ d183bba.
The round stopped early on the desk's stop-condition: the GPT/Codex seat hit its free-plan usage
limit mid-round (the seat's own error: try again Dec 21, 2026 22:06). No seat calls were made after
that. Every step that still needs the seat is marked **BLOCKED-BY-SEAT-LIMIT** by name below.

## 1. Gemini seat — PARTIALLY WIRED (code complete; live proof blocked)

Authored by the Codex seat (session 01a203e1, two turns: build + one desk-review fix that replaced
invalid `page.querySelectorAll` calls in `ask` with evaluate-based find/click helpers):

- `server/gemini_seat.mjs` — Playwright driver over a program-owned persistent profile
  (`~/.config/heart-studio/gemini-profile`), commands `probe|connect|ask`, one JSON line on stdout.
  `ask` refuses to send unless the verified mode is Task (`gemini_task_mode_unavailable`) and refuses
  when signed out (`gemini_seat_not_signed_in`). Route stated plainly: there is no API for this seat —
  the program drives the signed-in Gemini **web app**.
- `server/server.js` — the Gemini branch of `probeConnections()` now runs the helper (the old
  gemini-desktop Cookies probe is removed); proof store `~/.config/heart-studio/gemini-proof.json`
  merged into `GET /api/connections`; `POST /api/connections/gemini/connect` (detached sign-in
  window, already-open guard); `POST /api/connections/gemini/ask` (2000-char cap, default proof
  prompt, writes the proof record on success); `GET /api/colab-leg`.
- `app/renderer/app.js` — Gemini seat row shows the account when present; Home Gemini panel carries
  **Connect Gemini** + **Run Gemini proof** buttons and a proof output line; Berserk queue badge text
  updated (see §2).

Desk verification (worktree server on port 18912; the 18911 real-test server was never touched):

- `GET /api/colab-leg` → recorded facts + `queueEntries: 0` ✓
- `POST /api/connections/probe` → GPT connected · Opus connected · GLM connected · Gemini `unknown`
  with reason "Gemini seat probe failed: gemini_driver_unavailable" (the helper's named failure,
  mapped truthfully) ✓ behavior / ✗ not connected
- `POST /api/connections/gemini/ask` → `{ok:false, error:"gemini_ask_failed"}` in-band ✓ behavior
- `POST /api/connections/gemini/connect` → `{started:true}` ✓ (the child then exits on B-EGRESS)
- Screenshots: [ui-home-gemini-panel.png](ui-home-gemini-panel.png) ·
  [ui-renders-colab-leg.png](ui-renders-colab-leg.png) · raw probe output:
  [probe_result.json](probe_result.json)

Blockers for the live CONNECTED proof, by name:

- **B-EGRESS — RESOLVED IN CODE** — when an environment proxy is configured, the driver now starts
  an ephemeral `127.0.0.1` CONNECT relay. Chromium uses that relay; Node connects to the upstream
  proxy and forwards CONNECT with `Proxy-Authorization: Basic` from URL credentials when present.
  The relayed Chromium context enables `ignoreHTTPSErrors` because the proxy's MITM CA is trusted by
  the system store but not Chromium's bundled root store. Direct no-proxy launch behavior is unchanged.
  Live probe in this restricted workspace could not validate the route: Node returned
  `listen EPERM: operation not permitted 127.0.0.1` before Chromium launch. Re-run `node
  server/gemini_seat.mjs probe` in the desk execution context to confirm `ok:true`.
- **B-SIGNIN** — the program profile has never been signed in. Sign-in is the owner's own step in
  the Connect Gemini window (or a browser-capable agent's); this driver cannot perform it.
- **B-SELECTORS** — the helper's Gemini UI selectors (account button, Chat/Task mode control,
  composer, `model-response`) are best-effort and unverified against the live signed-in UI;
  verification needs B-EGRESS + B-SIGNIN resolved and any fix needs the seat —
  **BLOCKED-BY-SEAT-LIMIT**.
- Minor wart recorded for the seat: `connect`'s catch labels every failure `gemini_no_display`
  (including navigation failures), and the ask endpoint surfaces a helper navigation failure as
  generic `gemini_ask_failed`.

Environment note: Playwright 1.49's Chromium (build 1148) was installed into
`~/.cache/ms-playwright` during this round; the cache previously held only build 1255, which the
repo's declared Playwright cannot launch.

## 2. Colab leg — WIRED as far as honestly possible

- `fleet/colab_leg.json` — the recorded leg: account `araby0401@gmail.com`, Google AI Pro
  (desk-verified 2026-11-22), GPU options T4/L4/A100/G4, H100 unavailable, runner
  `proa28518-creator/grayline-utils` · labels `colab-gpu` · name `colab-t4`, state
  `awaiting_manual_wake`.
- `GET /api/colab-leg` serves it plus the live queue count ✓ verified.
- Renders screen shows the leg card with a **manual wake required** badge, the wake steps and the
  notebook path ✓ (screenshot above).
- `fleet/colab-runner.ipynb` — the wake notebook (11 cells): config (repo / token / labels / name),
  `nvidia-smi` GPU check, latest actions-runner install from the GitHub API, register-if-needed,
  blocking `run.sh` cell; token hygiene warnings (fresh token at wake time, never commit one).
- **Remaining manual step (by design — no official Colab API can start a session):** a human signs
  in to Colab as `araby0401@gmail.com`, opens `fleet/colab-runner.ipynb`, sets an L4 (or T4) GPU
  runtime, pastes a fresh GitHub runner registration token into the config cell, Run all. Until
  then the leg's state stays `awaiting_manual_wake`.
- Named as NOT built: render dispatch targeting the `colab-gpu` label (`fleet-render.yml` still
  runs on GitHub-hosted runners). Do not mistake the recorded leg for a dispatchable one.

## 3. BLOCKED-BY-SEAT-LIMIT — deferred to the seat's return, by name

- Opus + GLM hunts over this round's delta (AGENTS.md delivery discipline) — not run: any finding
  would have no author to loop back to while the seat is down.
- B-SELECTORS and the connect error-label wart.
- The live Gemini proof artifact (one bounded Task-mode session started from inside the program) —
  depends on B-EGRESS + B-SIGNIN, then on the seat for any selector fix.

## Desk server for this round

Worktree server left running on port 18912 (Xvfb :99). Relaunch: `orch/seat_wiring/run_server.sh`.
Stop: kill the node process listening on 18912.

## 4. Egress fix verification + connect window (2026-11-22, later session)

- Codex seat (session 01a203e1, one batched turn) implemented the loopback CONNECT relay in
  `server/gemini_seat.mjs`; desk committed it as `a400342` (the seat sandbox has .git read-only)
  and pushed `ui/seat-wiring`.
- Desk verification, all through the program's own doors (wiring server on port 18912, restarted
  on the fixed code; the 18911 real-test server was never touched):
  - `node server/gemini_seat.mjs probe` → `{"ok":true,"signedIn":false,...}` — the driver reaches
    gemini.google.com (was `gemini_driver_unavailable` / ERR_TUNNEL_CONNECTION_FAILED).
  - `POST /api/connections/probe` → GPT connected · Opus connected · GLM connected · Gemini
    `dead` with the truthful reason "Sign in through Connect Gemini in this program (seat account
    araby0401@gmail.com)".
  - `POST /api/connections/gemini/connect` → `{started:true, state:"awaiting_owner_signin"}`;
    the program's own window renders the real signed-out Gemini app at gemini.google.com/app
    (screenshot: connect-window.png). The egress path is proven end-to-end inside the program.
- **The one remaining step, by name: the Google sign-in itself inside that Connect Gemini
  window** — email + password (and any Google verification) for araby0401@gmail.com, typed into
  the program's own Chromium profile (`~/.config/heart-studio/gemini-profile`). Per AGENTS.md
  the owner does all sign-ins himself; no agent at this desk holds a route to type into that
  window. The window waits up to 10 minutes per Connect press, then closes itself.
- After that sign-in lands: `POST /api/connections/gemini/ask` runs the bounded Task-mode proof
  and writes `~/.config/heart-studio/gemini-proof.json`; B-SELECTORS verification happens on
  that first live ask. Neither has run yet — the proof is NOT claimed.
- Still owed from §3: Opus + GLM hunts over the seat-wiring delta (now including the egress fix).
- Branch state: `ui/seat-wiring` left unmerged per this round's discipline; `ui/unified-interface`
  has advanced past the base (real-test commits), so the eventual merge is a real merge, not a
  fast-forward.

## 5. Owner-approved sign-in attempt (2026-11-22 ~16:00 UTC) — credential entry is the named stop

The owner explicitly approved the desk completing the sign-in for him with his saved login
(«موافق تديني الـconnect اعملولك حالًا»). This session drove everything reachable through the
program's own doors and stopped exactly at the credential entry:

- `GET /api/connections` (wiring server, port 18912; the 18911 real-test server untouched) →
  Gemini `dead`, state `awaiting_owner_signin`, reason naming `araby0401@gmail.com`
  (checked 15:57 UTC). GPT · Opus · GLM all `connected`.
- A `gemini_seat.mjs connect` child is running (started ~15:57 UTC; self-closes after 10 min)
  and the program's own Chromium window on Xvfb :99 renders the real **signed-out** Gemini app —
  Sign in buttons present, Chat/Task toggle visible (screenshot:
  [connect-signin-state.png](connect-signin-state.png), grabbed from the :99 display at
  16:02 UTC). The window re-opens at any time via `POST /api/connections/gemini/connect`.
- **Mechanism audit — why the saved-login fill could not reach this window from this session:**
  - `/opt/hatch/bin/hatch-vault` is the Hatch platform's CVM/LUKS disk-encryption daemon
    (hatch-engine: SEV-SNP, LUKS keyslots, migration) — not a website-login vault; it exposes no
    credential-fill function (verified from the binary itself; it hangs as a daemon on `--help`).
  - The 1Password connector fills saved logins only **in the Muse browser**, with the owner's
    approval from their own device; the `[credential:]` reference flow likewise targets the Muse
    browser's sign-in steps. Neither can type into the program's Playwright Chromium on
    Xvfb :99, and this agent session holds no browser-control tools.
  - No raw credential was retrieved, seen, or handled at any point in this session.
- **The exact remaining step, by name: B-SIGNIN-ENTRY** — Google credential entry (email +
  password for `araby0401@gmail.com`, plus any Google checkpoint such as a phone prompt or an
  authenticator code) typed into the program's Connect Gemini window (profile
  `~/.config/heart-studio/gemini-profile`). It needs the owner typing into a window he can
  reach, or a browser-capable agent with a vault-fill route into this Xvfb window, arranged by
  the desk. It was NOT worked around and NOT retry-looped.
- Ready the moment that entry lands (not run in this session — `ask` refuses signed-out by
  design, and a POST probe was deliberately not run while the connect window holds the
  profile, to avoid a profile-lock failure overwriting the truthful cached state):
  `POST /api/connections/probe` → expect `connected` for `araby0401@gmail.com`, then
  `POST /api/connections/gemini/ask` → the bounded Task-mode proof writes
  `~/.config/heart-studio/gemini-proof.json`. **The Task-mode proof is still NOT claimed.**
