# Heart Studio desktop app

Electron desktop shell for Heart Studio's local control server. It serves the app from `/app/` and uses the existing Stage 2 API.

Launch from the repository root with `node bin/heart app [project]` (when the CLI app command is available), or launch Electron directly with `app/` as its argument, for example `app-shell/node_modules/.bin/electron app/`. Set `HEART_PROJECT` to a project name or path under `projects/`; the default is `projects/story6-microwave`. `HEART_PORT` defaults to 8903 and falls back to an ephemeral port if occupied.
