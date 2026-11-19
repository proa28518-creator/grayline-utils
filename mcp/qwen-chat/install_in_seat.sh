#!/usr/bin/env bash
# install_in_seat.sh — install the qwen-chat MCP inside the Codespace seat.
#
# Idempotent: safe to re-run. pip skips packages that are already present,
# and `playwright install` skips a Chromium build that is already downloaded.
# It does NOT sign in and stores no login state — the owner signs in by hand
# afterwards (printed as the next manual steps at the end).
#
# Usage (from anywhere inside the seat):
#   bash mcp/qwen-chat/install_in_seat.sh
set -euo pipefail

# Resolve the workspace (repo root) at runtime: honour $WORKSPACE if the
# caller set it, otherwise derive it from this script's location
# (<workspace>/mcp/qwen-chat/install_in_seat.sh).
WORKSPACE="${WORKSPACE:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
SERVER_PATH="$WORKSPACE/mcp/qwen-chat/server.py"
DRIVER_PATH="$WORKSPACE/mcp/qwen-chat/driver.py"

echo "==> qwen-chat seat install"
echo "    WORKSPACE = $WORKSPACE"
echo "    server    = $SERVER_PATH"

command -v python3 >/dev/null 2>&1 || {
    echo "ERROR: python3 not found in this seat." >&2
    exit 1
}

echo "==> [1/2] Python packages (user site): mcp + playwright"
python3 -m pip install --user mcp playwright

echo "==> [2/2] Playwright Chromium build"
python3 -m playwright install chromium

cat <<EOF

==> Done. Next steps are MANUAL (owner only, sacrificial account):

  1) Sign in to Qwen Chat by hand — the browser profile lives OUTSIDE the
     repo (default ~/qwen-profile) and must never be committed:

       xvfb-run python3 "$DRIVER_PATH" login

     Sign in in the opened browser, then press Enter in the terminal.

  2) Verify the login and calibrate the page selectors:

       python3 "$DRIVER_PATH" probe

  3) Smoke test — expect {"ok": true, "answer": "QWEN MCP OK"}:

       python3 "$DRIVER_PATH" ask "Reply with exactly: QWEN MCP OK"

==> Register the server with agy — add this snippet to agy's MCP config:

  {
    "mcpServers": {
      "qwen-chat": {
        "command": "python3",
        "args": ["$SERVER_PATH"]
      }
    }
  }

EOF
