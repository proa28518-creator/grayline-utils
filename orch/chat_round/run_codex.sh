#!/bin/bash
# Drives the round's ONE continuous Codex conversation.
# usage: run_codex.sh <prompt-file> <log-file> [resume-session-id]
export PATH="/opt/hatch-image/bin/codex-resources:$PATH"
CODEX=~/workspace/tools/chatgpt-app/extracted/usr/lib/chatgpt/resources/codex
cd ~/workspace/heart-studio || exit 1
if [ -n "$3" ]; then
  exec $CODEX exec resume "$3" -c sandbox_mode="workspace-write" - < "$1" >> "$2" 2>&1
else
  exec $CODEX exec --sandbox workspace-write -i orch/app_round/steering_original_chat.jpg - < "$1" >> "$2" 2>&1
fi
