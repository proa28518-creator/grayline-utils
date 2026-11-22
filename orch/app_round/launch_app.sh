#!/bin/bash
# Launch the Heart Studio desktop app under Xvfb with CDP for screenshots.
cd ~/workspace/heart-studio
export HEART_PROJECT="${HEART_PROJECT:-projects/story6-microwave}"
export GITHUB_REF=ui/unified-interface
exec xvfb-run -a -s "-screen 0 1440x950x24" \
  app-shell/node_modules/.bin/electron \
  --no-sandbox --remote-debugging-port=9223 \
  app/
