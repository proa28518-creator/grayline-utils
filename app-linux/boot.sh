#!/bin/bash
# Boot attempt: the REAL Creatorize app (original app.asar, untouched) under the Linux
# Electron runtime, in the packaged layout (resources/app.asar + templates + resources).
# Usage: boot.sh <tag> <seconds-to-live>
set -u
TAG="${1:-boot1}"; LIVE="${2:-40}"
HERE="$(cd "$(dirname "$0")" && pwd)"
EV="$HERE/evidence"; mkdir -p "$EV"
export DISPLAY=:99
Xvfb :99 -ac -screen 0 1440x950x24 > "$EV/xvfb-$TAG.log" 2>&1 &
XVFB_PID=$!
sleep 2
cd "$HERE/run"
ELECTRON_ENABLE_LOGGING=1 ./electron --no-sandbox > "$EV/$TAG.log" 2>&1 &
APP_PID=$!
sleep 15
ffmpeg -y -f x11grab -video_size 1440x950 -i :99 -frames:v 1 "$EV/$TAG-15s.png" > /dev/null 2>&1
sleep $(( LIVE - 15 ))
ffmpeg -y -f x11grab -video_size 1440x950 -i :99 -frames:v 1 "$EV/$TAG-final.png" > /dev/null 2>&1
if kill -0 $APP_PID 2>/dev/null; then echo "APP STILL RUNNING after ${LIVE}s" >> "$EV/$TAG.log"; kill $APP_PID 2>/dev/null; sleep 2; kill -9 $APP_PID 2>/dev/null; else echo "APP EXITED on its own before ${LIVE}s" >> "$EV/$TAG.log"; fi
kill $XVFB_PID 2>/dev/null
echo "done: $EV/$TAG.log"
