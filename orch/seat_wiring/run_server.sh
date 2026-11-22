#!/bin/bash
# Seat-wiring round desk server (worktree, port 18912). Kill via kill_server.sh.
cd ~/workspace/heart-studio-wiring || exit 1
export CODEX_BIN=~/workspace/tools/chatgpt-app/extracted/usr/lib/chatgpt/resources/codex
export PATH="/opt/hatch-image/bin/codex-resources:$PATH"
export DISPLAY=:99
exec node server/server.js projects/accept-s6slice 18912 >> orch/seat_wiring/desk_server.log 2>&1
