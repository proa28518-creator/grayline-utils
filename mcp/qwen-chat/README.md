# qwen-chat MCP — Qwen 4.0 Max without an API

Owner-approved 2026-11-19. Wraps the Qwen Chat web UI in an MCP tool
(`ask_qwen`) so the desk and the seat can consult Qwen 4.0 Max, which proved
its thinking on the Creatorize consults, as a callable agent.

## How it works
- `server.py` — stdio MCP server exposing `ask_qwen(prompt)`.
- `driver.py` — Playwright drives chat.qwen.ai in a persistent Chromium
  profile, picks the 4.0 model (best effort), sends the prompt, waits for
  the streamed answer to stabilise, returns the text.
- Modes: `probe` (dump page structure to recalibrate selectors), `ask`,
  `login` (headed, manual sign-in).

## Rules (standing)
- **Sacrificial account only.** Chat-UI automation can violate the site's
  terms and get the account closed; never the owner's main accounts.
- **The profile (`~/qwen-profile`, outside this repo) is login state: never
  commit it, never copy it into any secret store.** The owner signs in by
  hand, in the seat, once — the profile persists in the Codespace storage
  across stops.
- Fragile by nature: if the UI changes, run `driver.py probe`, fix the
  selector lists in `driver.py`, and note the change here.
- One question at a time; it is a consultant, not a batch engine.

## Setup (in the seat)
```bash
pip install mcp playwright
playwright install chromium
xvfb-run python3 mcp/qwen-chat/driver.py login   # owner signs in by hand
python3 mcp/qwen-chat/driver.py probe            # verify + calibrate
python3 mcp/qwen-chat/driver.py ask "Reply with exactly: QWEN MCP OK"
```
