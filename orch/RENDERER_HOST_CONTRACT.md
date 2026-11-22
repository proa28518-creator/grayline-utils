# Renderer Host Contract — STUDY NOTES

**What this is:** a study build. Russell's original Creatorize Suite interface (the
renderer from the 0.28.2 teardown) was mounted **untouched** — no edits, no skinning —
inside a minimal shell built only to answer its host calls with honest neutral stubs.
The purpose is learning what his interface asks, expects, and does on its contracts, to
inform our production program. Nothing here is the product.

- Study shell: `app-shell/` (Electron 45.4.1, `main.js` + `preload.js` + generated `stub-table.js`)
- Working copy it loads: `app-shell/renderer/` (byte-identical to the pristine backup)
- Pristine backup: `vendor/renderer-original/` + `CHECKSUMS.sha256` (see §1 — read it, it matters)
- Boot evidence: `orch/renderer-boot/` (screenshots, DOM text, `tour-report.json`, `invoke-log.jsonl`)
- Method: static extraction from the renderer bundles (they ship readable, comment-bearing
  code) + a live boot under the shell with every bridge call logged.

---

## 1. Source integrity finding — the teardown extraction was damaged; the backup is now byte-true

The first pristine backup (commit `ffaef6c`) faithfully copied
`creatorize-teardown/unpacked/asar/out/renderer/`. At first boot the page rendered its own
source as text and the main bundle threw `Unexpected identifier '__vite__mapDeps'`.
Byte inspection showed why: **every file in the teardown's unpacked tree is shifted +4
bytes** — each file is missing its own first 4 bytes and carries 4 foreign bytes at the
tail (`index.html` began `ctype html>`, the PNG lacked its magic, the woff2 its `wOF2`).

Recovery: the original `app.asar` survives at
`creatorize-teardown/unpacked/win/resources/app.asar`. The renderer was re-extracted
from it using the asar header's own offsets/sizes. Proof, for all 149 files:
`damaged[:-4] == true[4:]`, file heads are correct (`<!doctype html>`, `const __vite__ma…`,
`\x89PNG`, `wOF2`), and the channel inventory extracted from the true files is identical
to the one from the damaged files (501 + 61, no diff).

**The pristine backup and the working copy were both replaced with the byte-true files**
(commit `a978a3e`): 149 files, 15,108,323 content bytes, `sha256sum -c` 149/149 OK against
`vendor/renderer-original/CHECKSUMS.sha256`. The damaged copy remains in git history.
⚠️ The same +4 shift presumably affects the whole `unpacked/asar/` tree (main bundle,
node_modules) — **any file taken from that tree must be re-verified against the asar
before use.** Files under `unpacked/win/resources/templates/` came by a different path
and were not checked here.

## 2. The bridge contract — `window.suite`

The renderer talks to its host through exactly one object, exposed by the Electron
preload. It reads four members and nothing else (verified by exhaustive grep):

| Member | Type | Renderer usage |
|---|---|---|
| `suite.invoke(ch, ...args)` | async | All host calls. The renderer's API layer is `const inv = (ch, ...a) => window.suite.invoke(ch, ...a).catch(humanize)` — a generic invoke passthrough: **the channel names in Appendix A are the raw host channel names**, not renderer-side aliases. |
| `suite.on(ch, cb)` | sync → returns unsubscribe fn | Event subscriptions: `const on = (ch, cb) => window.suite.on(ch, cb)`; components call the returned `off()` on unmount. Callback receives the payload directly (no event object). |
| `suite.pathForFile(file)` | sync → string | Drag-and-drop: converts a dropped `File` to its absolute path (Electron `webUtils.getPathForFile`). 14 call sites; every caller tolerates `""`. |
| `suite.platform` | string property | Read once (via `window.suite?.platform ?? navigator.platform`) for ⌘/Ctrl labels. Values seen in code: `"darwin"`, `"win32"`, `"linux"`. |

Error contract: when `invoke` rejects, the renderer's `humanize(e, ch)` turns the error
into a user-facing toast with an optional `detail`. **A rejection is a first-class,
expected answer** — the UI is built to survive and report host failures. There is no
"bridge missing" fallback screen; without `window.suite` the first calls throw inside
`.catch(() => {})` guards and the app degrades silently.

Test hooks (a gift for automation): when `app:info` returns `testHooks: true`, the app
sets `window.__czApi = api` (the full API layer) and `window.__czToast = toast`. The
production program should keep this door in mind — it is the app's own scripted-driving
surface. The study shell returns `testHooks: false`.

## 3. Transport — there is no HTTP/WebSocket API in the renderer

- `fetch(` appears exactly twice in all bundles, both in the Editor's audio engine,
  fetching **URLs supplied by project data** (audio buffers, impulse responses) — never a
  hardcoded endpoint.
- `new WebSocket` / `EventSource`: zero occurrences. (The `io(` grep hits were the inside
  of `function(`.) The CSP's `ws://localhost:*` allowance is not exercised by this code.
- No literal `127.0.0.1` or `localhost` anywhere in the assets. **All media/frame URLs
  come from the host**: `app:info` returns a `server` base string, and the renderer
  builds e.g. `${server}/fv/charview.html?theme=…&fig=…` iframes from it. So the host
  must run a local media server and hand its base URL over in `app:info` — the renderer
  never discovers it. (The `/fv/` host pages themselves live in
  `templates/host/`, outside the renderer.)
- The CSP in `index.html` confirms the shape: `script-src 'self'`, images/media/frames
  from `'self' data: blob: http://127.0.0.1:*`, `connect-src 'self' http://127.0.0.1:* ws://localhost:*`.

## 4. Boot sequence — what fires, in order, and what each answer must look like

One cold load fired **25 invokes** (the tour's 15 loads fired 22 unique channels on
*every* load; order below is the first recorded boot). Response shapes are taken from
the consumer code, not guessed:

| # | Channel | Expected response (from consumer code) |
|---|---|---|
| 1 | `plan:get` | `{ kind, custom, hide, detected }` — `kind: null` renders "Not set". Also subscribes `plan:changed`. |
| 2 | `update:beta` | notice object or `null` (`if (!n) return null`). Subscribes `update:beta`. |
| 3 | `update:status` | `{ state, version, notes, download, viaLauncher }`; states seen: `none`, `off`, `checking`, `downloading`, `testing`, `ready`. Subscribes `update:status`. |
| 4 | `graphics:state` | graphics mode object; the app may answer itself with `graphics:failed` (see §7). |
| 5 | `graphics:failed` | renderer→host *notification* (fire-and-forget report). |
| 6, 8 | `engines:state` | engines/Codex state; read as `codex?.ready`. Subscribes `engines:changed`. |
| 7, 15 | `channels:board` | **`{ cards: {id: card}, ideas: [...] }`** — Home does `Object.values(board.cards)` and `data.ideas.filter(...)`. Cards carry `id, name, due, stage, channelId, kind, missing`. |
| 9 | `usage:summary` | **`{ today: "YYYY-MM-DD", rows: [...], firstDay, projects: {id: {name}} }`** — the usage view does `data.rows.filter(r => r.d >= start && …)` and `data.projects[id]?.name`. Rows carry `d, runs, input, cacheRead, cacheWrite, model, label, family, estimated, projectId`. |
| 10 | `stats` | home stats; read via optional chaining (`stats?.edits`). |
| 11 | `render:list` | array (exports list; Renders page empty state when `[]`). |
| 12 | `health` | rich object — see §5. |
| 13, 20 | `projects:list` | **array** of project objects: `id, name, kind, stage, channelId, lab, exists, opened_at, updated_at, path`. |
| 14 | `speech:state` | speech state; read as `sp?.status / sp?.ready / sp.mode / sp.language`. Subscribes `speech:state`. |
| 16 | `launcher:state` | `{ stopped, acked }` (LauncherGoneHost shows only when `stopped && !acked`). |
| 17 | `app:info` | **`{ server, preview, platform, testHooks, version }`** — `server` is the media base URL (§3); Settings renders "You have Creatorize Suite {version} · {platform}". |
| 18 | `claude:status` | `{ loggedIn, method, providerHost, … }` — `method`: `"claude.ai"` (subscription) or `"api_key"`. Drives the rail's "Claude not signed in" card and the Home checklist. |
| 19 | `channels:list` | array of `{ id, … }`. |
| 21 | `config:get` | the full config object — see §5. |
| 22 | `rules:list` | array. |
| 23 | `claude:running` | **ARRAY** of `{ projectId }` (consumer does `r.length`, `r.map(x => x.projectId)`) — not an object. |
| 24 | `voice:interrupted` | renderer→host notification. |
| 25 | `library:proposed` | array-ish, fed to state after a 2.5 s delay (`setLibProposed`). |

Navigation is **internal state, not URLs** (`page === "home" | "projects" | "channels" |
"youtube" | "routines" | "studio" | "editor" | "settings" | "styleimport"`, switched via
`setPage`). There are two brands (`faceless` / `personal`, from `config.ui.brand`) with
partly different page sets and home screens (FacelessHome / PersonalHome); the Editor and
Studio pages open from a project, not from the rail.

## 5. Response-shape catalogue (extracted from consumer code)

**`config:get`** — Settings and App read these paths (counts = read sites in the main bundle):
`cfg.claude.model` (×7), `cfg.claude.effort`, `cfg.claude.permissions`, `cfg.claude.autoVerify`,
`cfg.claude.executable`, `cfg.claude.maxTurns`, `cfg.claude.userMcp`, `cfg.claude.faster`,
`cfg.claudePlan` (+`.detected`), `cfg.bridge.enabled`, `cfg.engines`, `cfg.library`,
`cfg.skool`, `cfg.sound`, `cfg.tools`, `cfg.ui` (+`.brand`), `cfg.updates`, `cfg.video`,
plus `lastProjectId` / `lastPersonalProjectId`. ⚠️ Several reads are **not** optional-chained
(`cfg.claude.model ?? ""` throws if `claude` itself is missing) — the real main must return
the complete default config, never a partial object.

**`health`** — `{ git, ffmpeg, python, pyMissing: [], server, db: { ok, version, counts, error },
claude: { loggedIn }, executable, runtime: { <tool>: { state, source } }, pinned: { <tool> },
install: { <tool>: cmd, shell } }`. Home's checklist computes
`missing = [!health.git && "git", !health.ffmpeg && "ffmpeg", !health.python && "Python", ...health.pyMissing]`.
Settings renders the DB line as `OK · schema v{version} · {counts}` or the error string.

**`images:status`** — `{ flow: { chrome, opened, resting }, higgsfield: { hasKey, hint },
fal: { hasKey, hint }, active, setting, custom, paidFallback, paidPrice: { higgsfield, fal },
models, higgsfieldModels, defaultModel }`. Settings reads `img.flow.chrome`,
`img.higgsfield.hasKey`, `img.fal.hasKey` **without** optional chaining.
Key-state objects across the app share one shape: `{ hasKey, hint, unreadable }`
(`keyLine()` renders "Saved, ends in …{hint}" / "Not added yet").

**`youtube:status`** (via `useYtStatus`) — `{ key: { hasKey, hint }, client: { has, builtin, own },
channels: [{ id, signedIn }] }`; consumers do `status.key.hasKey` and `status.channels.some(...)`.

**`claude:provider`** — provider object for the ClaudeProviderPicker (host/billing display).
**`voice:status`** — `{ elevenlabs: { hasKey, hint }, fish: { hasKey, hint },
kokoro: { installed, install }, config: { provider }, … }` (the voice sections chain
`vs.elevenlabs.hasKey` etc. without optional chaining).
**`higgsfield:status`** — `{ hasKey, hint, models: [] }` (has a built-in `.catch` fallback
`{ hasKey: false, hint: null, models: [] }` in the Thumbnails code — a model of how the
renderer expects status objects to look).

## 6. The study shell — what answers, and the honesty rules

- **Real answers (shell-native, true):** `app:copy` (clipboard), `app:copyImage`
  (clipboard image from a real file), `app:zoom` (real window zoom), `app:info`
  (`platform` = the real OS, `version` = "0.28.2" — this renderer's actual version,
  `server` = the shell's own static server, which really serves the files),
  `health.git` (probed live), `images:status.flow.chrome: false` (literally true here —
  no Chrome is installed on this machine).
- **Shaped neutral stubs (empty states the UI renders truthfully):** the 12 specials in
  `main.js` (`app:info`, `config:get`, `health`, `stats`, `claude:status` →
  `{ loggedIn: false }`, `plan:get` → `{ kind: null }`, `update:status` → `{ state: "none" }`,
  `update:beta` → `null`, `channels:board` → `{ cards: {}, ideas: [] }`,
  `usage:summary` → empty rows, `images:status`), generated from the shapes in §4–§5.
- **Generated table (`stub-table.js`):** of the 501 channels — 20 list-like resolve `[]`,
  55 object-reads resolve `{}`, 11 are specials, and **415 action channels reject** with
  `study shell: "<ch>" is not wired — no backend behind this build`. A write must never
  fake success; the renderer's own `humanize` turns the rejection into a toast.
- **Events:** the preload registers real listeners; the shell simply never emits.
  An un-emitted `…:changed` is the truth (nothing changed).
- Every invoke is logged (`invoke-log.jsonl`) — the log is the study data.

## 7. Boot findings (live, this machine)

- **The original interface runs.** Home renders pixel-complete with **zero console
  errors**: rail (brand switch, search, Home/Berserk/Projects/Channels/Editor/Workspace/
  Styles/Library/Memory/Thumbnails/Routines/Renders/YouTube, New project, Help, Settings,
  "Premium — all unlocked", "Claude not signed in"), the "Getting started — 0 of 6"
  checklist (honestly reporting `Missing: ffmpeg, Python` from the health stub), and the
  "Claude usage — Nothing in the last 30 days" panel.
- **Tour: 14 of 15 targets render clean** — Home, Projects ("No projects yet"), Channels,
  YouTube, Routines, Berserk (the full director console: brief box, Faster builds /
  Quality mode explainer, model + effort + style pickers), Library, Styles, Memory,
  Thumbnails, Workspace, Renders ("No exports yet"), Help, and the **New project dialog**
  (Video / Style / Length / Look). Screenshots + DOM text in `orch/renderer-boot/`.
- **Settings is the one view that still trips its error boundary**:
  `Cannot read properties of undefined (reading 'undefined')` — one nested field of one
  Settings section stub is still the wrong shape. En route, three of its shapes were
  found from code and fixed (`images:status.flow`, `images:status.higgsfield/.fal`, and
  the boot-level `channels:board` / `usage:summary` shapes). Channels the Settings visit
  fires: `claude:provider`, `experimental:state`, `scriptskill:state`, `youtube:status`,
  `higgsfield:status`, `projects:choiceDefaults`, `fix:has`. (A CDP pause-on-exceptions
  run to pinpoint it was blocked by this environment's Hatch WebGL domain policy.)
  The view boundary contains the failure — the rest of the app is unaffected.
- **The app reports its own graphics failure**: at boot it called `graphics:failed`
  (its preview/graphics stack found no usable WebGL under Xvfb) — a useful reminder that
  the preview engine expects a real GPU/graphics path and tells the host when it lacks one.
- **New project dialog**: "Loading styles…" / "Loading looks…" persist because
  `styles:list` truthfully returns `[]` — with no style packages behind the shell there
  is nothing to pick. Not a crash; an empty-catalog state.
- **Rejected during the tour (by design):** `fix:has` (Settings troubleshooter probe),
  `styles:kitInfo`, `edits:recent`, `library:browse`, `library:harvestState`,
  `library:lastHarvest`, `library:trash`, `routines:context` — all read-probes whose
  callers are `.catch`-guarded; the screens still rendered.
- **Not reachable in this build:** Studio and Editor (they open from inside a project;
  with an honestly empty project list there is nothing to open), the "Videos" label
  (in the faceless brand the rail item is "Projects"; "New video" is the personal brand's
  wording for the same button).

## 8. What the interface demanded that this shell could not answer honestly

- **All 415 action channels** (create/send/run/install/login/import/export/…) — there is
  no backend behind a study shell; they reject rather than pretend. This includes
  `dialog:*` (native file dialogs), `shell:*` (open-in-OS actions), `claude:login`
  (starts a real OAuth flow), `projects:create`, `berserk:send`, `render:*` actions.
- **The media server's content**: `app:info.server` points at the shell's static server,
  which serves only the renderer files. The `/fv/…` host pages (charview/preview) and any
  project media the real main serves are **not** behind it — nothing in an empty-state
  boot requests them, but the first real project would.
- **Events**: 61 channels the main is expected to *emit* (`project:changed`,
  `claude:event`, `render:progress`, …). A study shell has nothing truthful to emit.

## 9. Notes for the production build

1. **Implement the boot 22 first** (§4) with the exact shapes in §5 — the app is
   unforgiving about nested fields it reads unchained (`config.claude.*`,
   `board.cards/ideas`, `usage.rows/projects`, `images.flow/higgsfield/fal`,
   `youtube.key/channels`, `voice.elevenlabs/fish/kokoro`).
2. **The adapter is an IPC host, not an HTTP API.** One preload bridge
   (`invoke`/`on`/`pathForFile`/`platform`), 501 named channels, 61 event channels.
   Our existing executor/dispatch machinery must present *this* surface.
3. **Run a media server** and return its base in `app:info.server`; the host pages in
   `templates/host/` are served from it (`/fv/…`).
4. **Keep `testHooks`** — `window.__czApi` is the app's own automation door for our
   measured checks.
5. **Re-extract, never trust `unpacked/asar/`** (§1) — verify any teardown file against
   the original `app.asar` (or the backup's `CHECKSUMS.sha256` for the renderer).
6. The renderer's error boundaries + `humanize` toasts are the failure UX: a correct
   adapter answers with real data or a rejection with a human-readable message.

---

## Appendix A — full channel inventory (extracted from the true renderer files)

Extraction: every `inv("…")` / `on("…")` call site in `assets/*.js`. 501 invoke channels
in 60 families (largest: `projects` 37, `studio` 35, `voice` 32, `claude` 30, `youtube` 28,
`routines` 28, `personal` 24, `styles` 21, `library` 20, `channels` 19), 61 event channels.
The two bare channels are `health` and `stats`.
### A.1 Invoke channels (501)

| Channel | Renderer call site (API method, file) |
|---|---|
| `anims:folder` | animsFolder(open)  [index-wX7YC2th.js] |
| `anims:import` | animsImport(files)  [index-wX7YC2th.js] |
| `anims:list` | animsList()  [index-wX7YC2th.js] |
| `anims:remove` | animsRemove(id)  [index-wX7YC2th.js] |
| `app:copy` | copy(text)  [index-wX7YC2th.js] |
| `app:copyImage` | copyImage(file)  [index-wX7YC2th.js] |
| `app:diagnostics` | diagnostics()  [index-wX7YC2th.js] |
| `app:info` | info()  [index-wX7YC2th.js] |
| `app:zoom` | zoom(z)  [index-wX7YC2th.js] |
| `berserk:attach` | berserkAttach(name, bytes)  [index-wX7YC2th.js] |
| `berserk:clipboard` | berserkClipboard()  [index-wX7YC2th.js] |
| `berserk:continue` | berserkContinue(id)  [index-wX7YC2th.js] |
| `berserk:delete` | berserkDelete(id)  [index-wX7YC2th.js] |
| `berserk:get` | berserkGet(id)  [index-wX7YC2th.js] |
| `berserk:list` | berserkList()  [index-wX7YC2th.js] |
| `berserk:new` | berserkNew(who)  [index-wX7YC2th.js] |
| `berserk:send` | berserkSend(id, text, files)  [index-wX7YC2th.js] |
| `berserk:set` | berserkSet(id, patch)  [index-wX7YC2th.js] |
| `berserk:stop` | berserkStop(id)  [index-wX7YC2th.js] |
| `berserk:thumb` | berserkThumb(path)  [index-wX7YC2th.js] |
| `blender:gpu` | blenderGpu(fresh = false)  [index-wX7YC2th.js] |
| `blender:install` | blenderInstall()  [index-wX7YC2th.js] |
| `blender:installCancel` | blenderInstallCancel()  [index-wX7YC2th.js] |
| `blender:installState` | blenderInstallState()  [index-wX7YC2th.js] |
| `blender:renderSettings` | blenderRenderSettings(projectId, patch)  [index-wX7YC2th.js] |
| `blender:status` | blenderStatus(fresh = false)  [index-wX7YC2th.js] |
| `boards:addImage` | boardAddImage(id, src)  [index-wX7YC2th.js] |
| `boards:create` | boardCreate(brand, name)  [index-wX7YC2th.js] |
| `boards:delete` | boardDelete(id)  [index-wX7YC2th.js] |
| `boards:dims` | boardDims(id, file)  [index-wX7YC2th.js] |
| `boards:forProject` | boardForProject(projectId)  [index-wX7YC2th.js] |
| `boards:get` | board(id)  [index-wX7YC2th.js] |
| `boards:list` | boards(brand)  [index-wX7YC2th.js] |
| `boards:rename` | boardRename(id, name)  [index-wX7YC2th.js] |
| `boards:reveal` | boardReveal(id, file)  [index-wX7YC2th.js] |
| `boards:save` | boardSave(id, data)  [index-wX7YC2th.js] |
| `boards:saveAs` | boardSaveAs(id, file)  [index-wX7YC2th.js] |
| `boards:startDrag` | boardStartDrag(id, file)  [index-wX7YC2th.js] |
| `boards:useAsThumbnail` | boardUseAsThumbnail(id, file, projectId)  [index-wX7YC2th.js] |
| `cartoon:ensure` | cartoonEnsure(projectId)  [index-wX7YC2th.js] |
| `cartoon:stepsDone` | cartoonStepsDone(projectId)  [index-wX7YC2th.js] |
| `cartoon:tools` | cartoonTools(projectId, fresh)  [index-wX7YC2th.js] |
| `channels:assign` | assignChannel(projectIds, channelId)  [index-wX7YC2th.js] |
| `channels:board` | channelBoard()  [index-wX7YC2th.js] |
| `channels:create` | channelCreate(o)  [index-wX7YC2th.js] |
| `channels:delete` | channelDelete(id)  [index-wX7YC2th.js] |
| `channels:dueMany` | dueMany(ids, dueAt)  [index-wX7YC2th.js] |
| `channels:ideaCreate` | ideaCreate(o)  [index-wX7YC2th.js] |
| `channels:ideaCreateMany` | ideaCreateMany(titles, channelId)  [index-wX7YC2th.js] |
| `channels:ideaDelete` | ideaDelete(id)  [index-wX7YC2th.js] |
| `channels:ideaDeleteMany` | ideaDeleteMany(ids)  [index-wX7YC2th.js] |
| `channels:ideaRestore` | ideaRestore(row2)  [index-wX7YC2th.js] |
| `channels:ideaUpdate` | ideaUpdate(id, patch)  [index-wX7YC2th.js] |
| `channels:ideas` | channelIdeas()  [index-wX7YC2th.js] |
| `channels:list` | channels()  [index-wX7YC2th.js] |
| `channels:move` | moveCard(o)  [index-wX7YC2th.js] |
| `channels:plan` | setPlan(projectId, patch)  [index-wX7YC2th.js] |
| `channels:reorder` | channelReorder(ids)  [index-wX7YC2th.js] |
| `channels:setAvatar` | channelAvatar(id, file)  [index-wX7YC2th.js] |
| `channels:update` | channelUpdate(id, patch)  [index-wX7YC2th.js] |
| `characters:create` | createCharacter(description)  [index-wX7YC2th.js] |
| `characters:delete` | deleteCharacter(id)  [index-wX7YC2th.js] |
| `characters:list` | characters()  [index-wX7YC2th.js] |
| `characters:random` | randomCharacter()  [index-wX7YC2th.js] |
| `characters:refine` | refineCharacter(id, instruction)  [index-wX7YC2th.js] |
| `characters:rename` | renameCharacter(id, name)  [index-wX7YC2th.js] |
| `characters:setDefault` | setDefaultCharacter(id)  [index-wX7YC2th.js] |
| `chars:bones` | charsBones(id)  [index-wX7YC2th.js] |
| `chars:list` | charsList()  [index-wX7YC2th.js] |
| `chars:remove` | charsRemove(id)  [index-wX7YC2th.js] |
| `chars:rename` | charsRename(id, o)  [index-wX7YC2th.js] |
| `chars:setMapping` | charsSetMapping(id, map)  [index-wX7YC2th.js] |
| `chars:sheet` | charsSheet(id)  [index-wX7YC2th.js] |
| `chars:upload` | charsUpload(file, o)  [index-wX7YC2th.js] |
| `claude:autoContinueOff` | autoContinueOff(projectId)  [index-wX7YC2th.js] |
| `claude:buildProgress` | buildProgress(projectId)  [index-wX7YC2th.js] |
| `claude:buildState` | buildState(projectId)  [index-wX7YC2th.js] |
| `claude:contextUsage` | contextUsage(projectId)  [index-wX7YC2th.js] |
| `claude:deleteThread` | deleteThread(threadId)  [index-wX7YC2th.js] |
| `claude:dismissBuild` | dismissBuild(projectId)  [index-wX7YC2th.js] |
| `claude:login` | claudeLogin()  [index-wX7YC2th.js] |
| `claude:loginCode` | claudeLoginCode(code)  [index-wX7YC2th.js] |
| `claude:logout` | claudeLogout()  [index-wX7YC2th.js] |
| `claude:messages` | messages(threadId)  [index-wX7YC2th.js] |
| `claude:permission` | permission(taskId, requestId, allow)  [index-wX7YC2th.js] |
| `claude:projectModel` | projectModel(projectId)  [index-wX7YC2th.js] |
| `claude:projectThread` | projectThread(projectId)  [index-wX7YC2th.js] |
| `claude:provider` | claudeProvider()  [index-wX7YC2th.js] |
| `claude:queue` | queue(projectId)  [index-wX7YC2th.js] |
| `claude:queueClear` | queueClear(projectId)  [index-wX7YC2th.js] |
| `claude:queueRemove` | queueRemove(projectId, id)  [index-wX7YC2th.js] |
| `claude:queueRun` | queueRun(projectId)  [index-wX7YC2th.js] |
| `claude:run` | run(req)  [index-wX7YC2th.js] (+1 more) |
| `claude:running` | running()  [index-wX7YC2th.js] |
| `claude:setProjectModel` | setProjectModel(projectId, v)  [index-wX7YC2th.js] |
| `claude:setProvider` | claudeSetProvider(patch)  [index-wX7YC2th.js] |
| `claude:status` | claudeStatus()  [index-wX7YC2th.js] |
| `claude:stop` | stop(taskId)  [index-wX7YC2th.js] |
| `claude:testProvider` | claudeTestProvider()  [index-wX7YC2th.js] |
| `claude:threadEdits` | threadEdits(threadId)  [index-wX7YC2th.js] |
| `claude:threads` | threads(projectId)  [index-wX7YC2th.js] |
| `config:get` | config()  [index-wX7YC2th.js] |
| `config:set` | setConfig(patch)  [index-wX7YC2th.js] |
| `customapi:cancel` | customApiCancel(kind)  [index-wX7YC2th.js] |
| `customapi:remove` | customApiRemove(kind)  [index-wX7YC2th.js] |
| `customapi:setup` | customApiSetup(kind, brief2, key)  [index-wX7YC2th.js] |
| `customapi:state` | customApiState(kind)  [index-wX7YC2th.js] |
| `dialog:file` | pickFile(title, filters)  [index-wX7YC2th.js] (+1 more) |
| `dialog:folder` | pickFolder(title)  [index-wX7YC2th.js] |
| `dictate:access` | dictateAccess()  [index-wX7YC2th.js] |
| `dictate:ready` | dictateReady(projectId)  [index-wX7YC2th.js] |
| `dictate:transcribe` | dictate(projectId, bytes)  [index-wX7YC2th.js] |
| `doc:castEstimate` | docCastEstimate(projectId)  [index-wX7YC2th.js] |
| `doc:ensure` | docEnsure(projectId, ids)  [index-wX7YC2th.js] |
| `doc:meshyKey` | docMeshyKey(action, value)  [index-wX7YC2th.js] |
| `doc:tools` | docTools(projectId, opts)  [index-wX7YC2th.js] |
| `documentary:ack` | docAck(projectId, id, on2)  [index-wX7YC2th.js] |
| `documentary:services` | docServices(projectId, probe = false)  [index-wX7YC2th.js] |
| `edits:diff` | diff(id)  [index-wX7YC2th.js] |
| `edits:list` | edits(projectId)  [index-wX7YC2th.js] |
| `edits:reapply` | reapply(id)  [index-wX7YC2th.js] |
| `edits:recent` | recentEdits()  [index-wX7YC2th.js] |
| `edits:restore` | restore(id)  [index-wX7YC2th.js] |
| `edits:revert` | revert(id)  [index-wX7YC2th.js] |
| `engines:codexCancelLogin` | codexCancelLogin()  [index-wX7YC2th.js] |
| `engines:codexDeviceLogin` | codexDeviceLogin()  [index-wX7YC2th.js] |
| `engines:codexInstall` | codexInstall()  [index-wX7YC2th.js] |
| `engines:codexLogin` | codexLogin()  [index-wX7YC2th.js] |
| `engines:codexLogout` | codexLogout()  [index-wX7YC2th.js] |
| `engines:codexOpenLogin` | codexOpenLogin()  [index-wX7YC2th.js] |
| `engines:codexPath` | codexPath(p)  [index-wX7YC2th.js] |
| `engines:codexProbe` | codexProbe()  [index-wX7YC2th.js] |
| `engines:refresh` | enginesRefresh()  [index-wX7YC2th.js] |
| `engines:state` | enginesState()  [index-wX7YC2th.js] |
| `experimental:cancelLogin` | experimentalCancelLogin()  [index-wX7YC2th.js] |
| `experimental:disable` | experimentalDisable()  [index-wX7YC2th.js] |
| `experimental:enable` | experimentalEnable(ack)  [index-wX7YC2th.js] |
| `experimental:login` | experimentalLogin()  [index-wX7YC2th.js] |
| `experimental:models` | experimentalModels()  [index-wX7YC2th.js] |
| `experimental:remove` | experimentalRemove()  [index-wX7YC2th.js] |
| `experimental:retry` | experimentalRetry()  [index-wX7YC2th.js] |
| `experimental:state` | experimentalState()  [index-wX7YC2th.js] |
| `experimental:switch` | experimentalSwitch()  [index-wX7YC2th.js] |
| `fix:has` | fixHas(message)  [index-wX7YC2th.js] |
| `fix:launch` | fixLaunch(message)  [index-wX7YC2th.js] |
| `fix:list` | fixList()  [index-wX7YC2th.js] |
| `fix:remove` | fixRemove(rel)  [index-wX7YC2th.js] |
| `gfx:deletePreset` | deleteGfxPreset(name)  [index-wX7YC2th.js] |
| `gfx:presets` | gfxPresets()  [index-wX7YC2th.js] |
| `gfx:save` | saveGraphics(projectId, values)  [index-wX7YC2th.js] |
| `gfx:savePreset` | saveGfxPreset(name, values)  [index-wX7YC2th.js] |
| `graphics:failed` | graphicsFailed(where2)  [index-wX7YC2th.js] |
| `graphics:keep` | setGraphicsKeep(keep)  [index-wX7YC2th.js] |
| `graphics:restart` | graphicsRestart()  [index-wX7YC2th.js] |
| `graphics:set` | setGraphics(mode)  [index-wX7YC2th.js] |
| `graphics:state` | graphicsState()  [index-wX7YC2th.js] |
| `health` | health()  [index-wX7YC2th.js] |
| `help:ask` | helpAsk(history, question, images, place)  [index-wX7YC2th.js] |
| `help:capture` | helpCapture()  [index-wX7YC2th.js] |
| `help:clean` | helpClean(text)  [index-wX7YC2th.js] |
| `help:clipboardImage` | helpClipboardImage()  [index-wX7YC2th.js] |
| `help:context` | helpContext(place)  [index-wX7YC2th.js] |
| `help:create` | helpCreate(draft, includeInfo, images)  [index-wX7YC2th.js] |
| `help:draft` | helpDraft(history, images, place)  [index-wX7YC2th.js] |
| `help:feedback` | helpFeedback(id, solved)  [index-wX7YC2th.js] |
| `help:incident` | helpIncident()  [index-wX7YC2th.js] |
| `help:post` | helpPost(reportId)  [index-wX7YC2th.js] |
| `help:reports` | helpReports()  [index-wX7YC2th.js] |
| `higgsfield:cancel` | hfCancel(genId)  [index-wX7YC2th.js] |
| `higgsfield:generate` | hfGenerate(boardId, nodeId, req)  [index-wX7YC2th.js] |
| `higgsfield:setKey` | hfSetKey(key)  [index-wX7YC2th.js] |
| `higgsfield:status` | hfStatus()  [index-wX7YC2th.js] |
| `images:flowOpen` | flowOpen()  [index-wX7YC2th.js] |
| `images:flowTest` | flowTest()  [index-wX7YC2th.js] |
| `images:setFalKey` | setFalKey(key)  [index-wX7YC2th.js] |
| `images:setModel` | setImageModel(service, model)  [index-wX7YC2th.js] |
| `images:setProvider` | setImageProvider(p)  [index-wX7YC2th.js] |
| `images:status` | imagesStatus()  [index-wX7YC2th.js] |
| `launcher:ack` | launcherAck()  [index-wX7YC2th.js] |
| `launcher:info` | launcherInfo()  [index-wX7YC2th.js] |
| `launcher:open` | launcherOpen()  [index-wX7YC2th.js] |
| `launcher:retry` | launcherRetry()  [index-wX7YC2th.js] |
| `launcher:state` | launcherState()  [index-wX7YC2th.js] |
| `layouts:addBackground` | addBackground(file)  [index-wX7YC2th.js] |
| `layouts:backgroundData` | backgroundData(ref)  [index-wX7YC2th.js] |
| `layouts:backgrounds` | backgrounds()  [index-wX7YC2th.js] |
| `layouts:delete` | deleteLayoutPreset(id)  [index-wX7YC2th.js] |
| `layouts:list` | layouts()  [index-wX7YC2th.js] |
| `layouts:save` | saveLayoutPreset(o)  [index-wX7YC2th.js] |
| `layouts:setDefault` | setDefaultLayout(id)  [index-wX7YC2th.js] |
| `library:browse` | libraryBrowse(o)  [index-wX7YC2th.js] |
| `library:delete` | libraryDelete(id)  [index-wX7YC2th.js] |
| `library:detail` | libraryDetail(id)  [index-wX7YC2th.js] |
| `library:emptyTrash` | libraryEmptyTrash()  [index-wX7YC2th.js] |
| `library:file` | libraryFile(id, rel)  [index-wX7YC2th.js] |
| `library:get` | libraryGet(id)  [index-wX7YC2th.js] |
| `library:harvestFor` | libraryHarvestFor(editId)  [index-wX7YC2th.js] |
| `library:harvestNow` | libraryHarvestNow(projectId)  [index-wX7YC2th.js] |
| `library:harvestState` | libraryHarvestState(projectId)  [index-wX7YC2th.js] |
| `library:lastHarvest` | libraryLastHarvest()  [index-wX7YC2th.js] |
| `library:list` | libraryList(o)  [index-wX7YC2th.js] |
| `library:proposed` | libraryProposed()  [index-wX7YC2th.js] |
| `library:restore` | libraryRestore(name)  [index-wX7YC2th.js] |
| `library:reveal` | libraryReveal(id)  [index-wX7YC2th.js] |
| `library:search` | librarySearch(o)  [index-wX7YC2th.js] |
| `library:ship` | libraryShip(id)  [index-wX7YC2th.js] |
| `library:trash` | libraryTrash()  [index-wX7YC2th.js] |
| `library:update` | libraryUpdate(id, patch)  [index-wX7YC2th.js] |
| `machine:check` | machineCheck(projectId)  [index-wX7YC2th.js] |
| `music:tracks` | musicTracks()  [index-wX7YC2th.js] |
| `personal:addMedia` | pAddMedia(id, files, role)  [index-wX7YC2th.js] |
| `personal:cancelRender` | pCancelRender(id)  [index-wX7YC2th.js] |
| `personal:create` | personalCreate(o)  [index-wX7YC2th.js] |
| `personal:edit` | pEdit(id)  [index-wX7YC2th.js] |
| `personal:encoder` | pEncoder()  [index-wX7YC2th.js] |
| `personal:imagePreview` | imagePreview(file)  [index-wX7YC2th.js] |
| `personal:layout` | pLayout(id)  [index-wX7YC2th.js] |
| `personal:media` | pMedia(id)  [index-wX7YC2th.js] |
| `personal:open` | personalOpen(id)  [index-wX7YC2th.js] |
| `personal:plan` | personalPlan(id)  [index-wX7YC2th.js] |
| `personal:playFailed` | pPlayFailed(id, mediaId, why)  [index-wX7YC2th.js] |
| `personal:removeMedia` | pRemoveMedia(id, mediaId)  [index-wX7YC2th.js] |
| `personal:render` | pRender(id, assets, presetId)  [index-wX7YC2th.js] |
| `personal:renderPresets` | pRenderPresets()  [index-wX7YC2th.js] |
| `personal:retryProxy` | pRetryProxy(id, mediaId)  [index-wX7YC2th.js] |
| `personal:saveEdit` | pSaveEdit(id, edit)  [index-wX7YC2th.js] |
| `personal:saveLayout` | pSaveLayout(id, s)  [index-wX7YC2th.js] |
| `personal:setPlan` | personalSetPlan(id, patch)  [index-wX7YC2th.js] |
| `personal:setRole` | pSetRole(id, mediaId, role)  [index-wX7YC2th.js] |
| `personal:setThumbnail` | personalSetThumbnail(id, file)  [index-wX7YC2th.js] |
| `personal:waveform` | pWaveform(id, mediaId)  [index-wX7YC2th.js] |
| `pipeline:cancel` | cancelStep(projectId)  [index-wX7YC2th.js] |
| `pipeline:run` | runStep(projectId, step2, opts)  [index-wX7YC2th.js] |
| `plan:get` | plan()  [index-wX7YC2th.js] |
| `presets:apply` | applyPreset(projectId, presetId)  [index-wX7YC2th.js] |
| `presets:applySettings` | applySettings(projectId, settings)  [index-wX7YC2th.js] |
| `presets:delete` | deletePreset(id)  [index-wX7YC2th.js] |
| `presets:list` | presets()  [index-wX7YC2th.js] |
| `presets:preview` | previewLook(projectId, settings, t)  [index-wX7YC2th.js] |
| `presets:save` | savePreset(p)  [index-wX7YC2th.js] |
| `preview:kill` | killPreview()  [index-wX7YC2th.js] |
| `projects:choiceDefaults` | choiceDefaults()  [index-wX7YC2th.js] |
| `projects:close` | closeProject()  [index-wX7YC2th.js] |
| `projects:create` | createProject(o)  [index-wX7YC2th.js] |
| `projects:delete` | deleteProject(id, removeFiles)  [index-wX7YC2th.js] |
| `projects:duplicate` | duplicateProject(id)  [index-wX7YC2th.js] |
| `projects:exportZip` | exportZip(id)  [index-wX7YC2th.js] |
| `projects:import` | importProject(dir, channelId)  [index-wX7YC2th.js] |
| `projects:importZip` | importZip(zip, channelId)  [index-wX7YC2th.js] |
| `projects:layerWave` | layerWave(projectId, clipId)  [index-wX7YC2th.js] |
| `projects:layers` | layers(projectId)  [index-wX7YC2th.js] |
| `projects:layersAdd` | addLayer(projectId, o)  [index-wX7YC2th.js] |
| `projects:layersSet` | setLayers(projectId, layers)  [index-wX7YC2th.js] |
| `projects:list` | projects()  [index-wX7YC2th.js] |
| `projects:mainCharacter` | setMainCharacter(projectId, on2)  [index-wX7YC2th.js] |
| `projects:music` | projectMusic(projectId)  [index-wX7YC2th.js] |
| `projects:musicPick` | pickProjectMusic(projectId)  [index-wX7YC2th.js] |
| `projects:musicSet` | setProjectMusic(projectId, patch)  [index-wX7YC2th.js] |
| `projects:open` | openProject(id)  [index-wX7YC2th.js] |
| `projects:overrides` | projectOverrides(projectId)  [index-wX7YC2th.js] |
| `projects:readText` | readText(id, rel)  [index-wX7YC2th.js] |
| `projects:rename` | renameProject(id, name)  [index-wX7YC2th.js] |
| `projects:saveScript` | saveScript(id, text)  [index-wX7YC2th.js] |
| `projects:selection` | setSelection(id, items)  [index-wX7YC2th.js] |
| `projects:setMeta` | setMeta(projectId, meta)  [index-wX7YC2th.js] |
| `projects:setOverrides` | setProjectOverrides(projectId, patch)  [index-wX7YC2th.js] |
| `projects:sfxMode` | setSfxMode(projectId, mode)  [index-wX7YC2th.js] |
| `projects:sfxOn` | setProjectSfx(projectId, on2)  [index-wX7YC2th.js] |
| `projects:shotThumbs` | shotThumbs(id, times, files)  [index-wX7YC2th.js] |
| `projects:shots` | reportShots(id, shots)  [index-wX7YC2th.js] |
| `projects:status` | status(id)  [index-wX7YC2th.js] |
| `projects:thumbnail` | thumbnail(id, t)  [index-wX7YC2th.js] |
| `projects:timeline` | timeline(id)  [index-wX7YC2th.js] |
| `projects:trimApply` | trimApply(projectId, t)  [index-wX7YC2th.js] |
| `projects:trimView` | trimView(projectId)  [index-wX7YC2th.js] |
| `projects:upgradeEngine` | upgradeEngine(id)  [index-wX7YC2th.js] |
| `projects:waveform` | waveform(id, rel)  [index-wX7YC2th.js] |
| `publish:generate` | publishGenerate(projectId, o)  [index-wX7YC2th.js] |
| `publish:get` | publishGet(projectId)  [index-wX7YC2th.js] |
| `publish:save` | publishSave(projectId, data)  [index-wX7YC2th.js] |
| `quality:exportCheck` | exportCheck(projectId)  [index-wX7YC2th.js] |
| `references:add` | refsAdd(projectId, paths, opts)  [index-wX7YC2th.js] |
| `references:cancel` | refsCancel(projectId, refId)  [index-wX7YC2th.js] |
| `references:extract` | refsExtract(projectId, refId, range)  [index-wX7YC2th.js] |
| `references:list` | refsList(projectId)  [index-wX7YC2th.js] |
| `references:media` | refsMedia(projectId, refId)  [index-wX7YC2th.js] |
| `references:pick` | refsPick(projectId)  [index-wX7YC2th.js] |
| `references:probe` | refsProbe(p)  [index-wX7YC2th.js] |
| `references:relink` | refsRelink(projectId, refId, newPath)  [index-wX7YC2th.js] |
| `references:remove` | refsRemove(projectId, refId)  [index-wX7YC2th.js] |
| `references:strip` | refsStrip(projectId, refId, n)  [index-wX7YC2th.js] |
| `references:thumb` | refsThumb(projectId, refId, t, w)  [index-wX7YC2th.js] |
| `references:update` | refsUpdate(projectId, refId, patch)  [index-wX7YC2th.js] |
| `render:cancel` | cancelExport(projectId)  [index-wX7YC2th.js] |
| `render:export` | exportVideo(projectId, opts)  [index-wX7YC2th.js] |
| `render:list` | renders(projectId)  [index-wX7YC2th.js] |
| `render:overlapOff` | renderOverlapOff(projectId)  [index-wX7YC2th.js] |
| `render:running` | exportRunning(projectId)  [index-wX7YC2th.js] |
| `render:still` | saveFrame(projectId, t)  [index-wX7YC2th.js] |
| `routines:allowUpload` | routineAllowUpload()  [index-wX7YC2th.js] |
| `routines:approve` | routineApprove(runId, itemId, ok)  [index-wX7YC2th.js] |
| `routines:cancel` | routineCancel(runId)  [index-wX7YC2th.js] |
| `routines:check` | routineCheck(graph)  [index-wX7YC2th.js] |
| `routines:context` | routineContext()  [index-wX7YC2th.js] |
| `routines:create` | routineCreate(name, template)  [index-wX7YC2th.js] |
| `routines:delete` | routineDelete(id)  [index-wX7YC2th.js] |
| `routines:duplicate` | routineDuplicate(id)  [index-wX7YC2th.js] |
| `routines:effortTest` | routineEffortTest(id, variants, audio)  [index-wX7YC2th.js] |
| `routines:get` | routine(id)  [index-wX7YC2th.js] |
| `routines:import` | routineImport(data)  [index-wX7YC2th.js] |
| `routines:knownVideos` | routineKnownVideos(ytChannel, channelId, refresh = false, format = "both")  [index-wX7YC2th.js] |
| `routines:list` | routines()  [index-wX7YC2th.js] |
| `routines:resume` | routineResume(runId, itemId)  [index-wX7YC2th.js] |
| `routines:run` | routineRun(id, parallel = false)  [index-wX7YC2th.js] |
| `routines:runDelete` | routineRunDelete(runId)  [index-wX7YC2th.js] |
| `routines:runGet` | routineRunGet(runId)  [index-wX7YC2th.js] |
| `routines:runs` | routineRuns(routineId)  [index-wX7YC2th.js] |
| `routines:save` | routineSave(id, patch)  [index-wX7YC2th.js] |
| `routines:thumbAnalyze` | thumbAnalyze(ids, s)  [index-wX7YC2th.js] |
| `routines:thumbRefsGet` | thumbRefsGet(ids)  [index-wX7YC2th.js] |
| `routines:thumbRefsPick` | thumbRefsPick()  [index-wX7YC2th.js] |
| `routines:thumbVariations` | thumbVariations(runId, itemId)  [index-wX7YC2th.js] |
| `rules:add` | addRule(r)  [index-wX7YC2th.js] |
| `rules:delete` | deleteRule(id)  [index-wX7YC2th.js] |
| `rules:learn` | learnRules()  [index-wX7YC2th.js] |
| `rules:list` | rules()  [index-wX7YC2th.js] |
| `rules:update` | updateRule(id, patch)  [index-wX7YC2th.js] |
| `runtime:cancel` | runtimeCancel(tool)  [index-wX7YC2th.js] |
| `runtime:install` | runtimeInstall(tool)  [index-wX7YC2th.js] |
| `runtime:state` | runtimeState(fresh)  [index-wX7YC2th.js] |
| `rx:ensure` | rxEnsure(projectId, ids)  [index-wX7YC2th.js] |
| `rx:tools` | rxTools(projectId, opts)  [index-wX7YC2th.js] |
| `scriptskill:ownGet` | ownSkillGet(id)  [index-wX7YC2th.js] |
| `scriptskill:ownPaste` | ownSkillPaste(text, name)  [index-wX7YC2th.js] |
| `scriptskill:ownPick` | ownSkillPick(what)  [index-wX7YC2th.js] |
| `scriptskill:paste` | scriptSkillPaste(text, name)  [index-wX7YC2th.js] |
| `scriptskill:pick` | scriptSkillPick(what)  [index-wX7YC2th.js] |
| `scriptskill:remove` | scriptSkillRemove()  [index-wX7YC2th.js] |
| `scriptskill:set` | scriptSkillSet(on2)  [index-wX7YC2th.js] |
| `scriptskill:state` | scriptSkillState()  [index-wX7YC2th.js] |
| `setup:contents` | setupContents()  [index-wX7YC2th.js] |
| `setup:export` | setupExport(parts)  [index-wX7YC2th.js] |
| `setup:import` | setupImport(token, choice)  [index-wX7YC2th.js] |
| `setup:inspect` | setupInspect()  [index-wX7YC2th.js] |
| `sfxlib:audio` | sfxAudio(id)  [index-wX7YC2th.js] |
| `sfxlib:importFiles` | sfxImportFiles(dropped, category)  [index-wX7YC2th.js] |
| `sfxlib:importFolder` | sfxImportFolder()  [index-wX7YC2th.js] |
| `sfxlib:list` | sfxList()  [index-wX7YC2th.js] |
| `sfxlib:remove` | sfxRemove(id)  [index-wX7YC2th.js] |
| `sfxlib:rescan` | sfxRescan()  [index-wX7YC2th.js] |
| `sfxlib:update` | sfxUpdate(id, patch)  [index-wX7YC2th.js] |
| `shell:external` | external(u)  [index-wX7YC2th.js] |
| `shell:open` | open(p)  [index-wX7YC2th.js] |
| `shell:reveal` | reveal(p)  [index-wX7YC2th.js] |
| `shell:source` | openSource(projectId, rel, line)  [index-wX7YC2th.js] |
| `sound:proxy` | renderProxy(projectId)  [index-wX7YC2th.js] |
| `sound:setEngine` | setSoundEngine(projectId, engine)  [index-wX7YC2th.js] |
| `sound:setVoice` | setVoiceTrack(projectId, v)  [index-wX7YC2th.js] |
| `sound:updateVideo` | updateVideoSound(projectId)  [index-wX7YC2th.js] |
| `speech:cancel` | speechCancel()  [index-wX7YC2th.js] |
| `speech:language` | setLanguage(p)  [index-wX7YC2th.js] |
| `speech:setup` | speechSetup(mode)  [index-wX7YC2th.js] |
| `speech:stableTs` | speechStableTs(mode, model)  [index-wX7YC2th.js] |
| `speech:state` | speechState()  [index-wX7YC2th.js] |
| `stats` | stats()  [index-wX7YC2th.js] |
| `storyboard:cancel` | storyboardCancel(projectId)  [index-wX7YC2th.js] |
| `storyboard:get` | storyboardGet(projectId)  [index-wX7YC2th.js] |
| `storyboard:start` | storyboardStart(projectId, o)  [index-wX7YC2th.js] |
| `storyboard:styleKey` | storyboardStyleKey(projectId)  [index-wX7YC2th.js] |
| `studio:checks` | studioChecks(projectId)  [index-wX7YC2th.js] |
| `studio:compare` | studioCompare(projectId, a, b)  [index-wX7YC2th.js] |
| `studio:create` | studioCreate(brief2)  [index-wX7YC2th.js] |
| `studio:critic` | studioCritic(projectId)  [index-wX7YC2th.js] |
| `studio:issueAdd` | studioIssueAdd(projectId, x)  [index-wX7YC2th.js] |
| `studio:issueUpdate` | studioIssueUpdate(projectId, id, patch)  [index-wX7YC2th.js] |
| `studio:issues` | studioIssues(projectId)  [index-wX7YC2th.js] |
| `studio:kitMark` | studioKitMark(projectId, key, status, note)  [index-wX7YC2th.js] |
| `studio:loop` | studioLoop(projectId)  [index-wX7YC2th.js] |
| `studio:loopStart` | studioLoopStart(projectId, o)  [index-wX7YC2th.js] |
| `studio:loopStop` | studioLoopStop(projectId)  [index-wX7YC2th.js] |
| `studio:matchNow` | studioMatchNow(projectId)  [index-wX7YC2th.js] |
| `studio:matchSettings` | studioMatchSettings(projectId, patch)  [index-wX7YC2th.js] |
| `studio:newVersion` | studioNewVersion(projectId, label)  [index-wX7YC2th.js] |
| `studio:previewSettings` | studioPreviewSettings(projectId, aspect)  [index-wX7YC2th.js] |
| `studio:publish` | studioPublish(projectId)  [index-wX7YC2th.js] |
| `studio:publishState` | studioPublishState(projectId)  [index-wX7YC2th.js] |
| `studio:rollback` | studioRollback(projectId, v)  [index-wX7YC2th.js] |
| `studio:run` | studioRun(projectId, o)  [index-wX7YC2th.js] |
| `studio:saveLook` | studioSaveLook(projectId, o)  [index-wX7YC2th.js] |
| `studio:setBrief` | studioSetBrief(projectId, b)  [index-wX7YC2th.js] |
| `studio:setStage` | studioSetStage(projectId, stage)  [index-wX7YC2th.js] |
| `studio:setView` | studioSetView(projectId, view)  [index-wX7YC2th.js] |
| `studio:state` | studioState(projectId)  [index-wX7YC2th.js] |
| `studio:stop` | studioStop(taskId)  [index-wX7YC2th.js] |
| `studio:study` | studioStudy(projectId)  [index-wX7YC2th.js] |
| `studio:studyView` | studioStudyView(projectId)  [index-wX7YC2th.js] |
| `studio:targetAdd` | studioTargetAdd(projectId, o)  [index-wX7YC2th.js] |
| `studio:targetRemove` | studioTargetRemove(projectId, id)  [index-wX7YC2th.js] |
| `studio:targetUpdate` | studioTargetUpdate(projectId, id, patch)  [index-wX7YC2th.js] |
| `studio:targets` | studioTargets(projectId)  [index-wX7YC2th.js] |
| `studio:targetsGenerate` | studioTargetsGenerate(projectId, count)  [index-wX7YC2th.js] |
| `studio:targetsQuote` | studioTargetsQuote(projectId, count)  [index-wX7YC2th.js] |
| `studio:versions` | studioVersions(projectId)  [index-wX7YC2th.js] |
| `styles:delete` | deleteStyle(id)  [index-wX7YC2th.js] |
| `styles:exportPackage` | exportPackage(styleId)  [index-wX7YC2th.js] |
| `styles:figureLibrary` | figureLibrary()  [index-wX7YC2th.js] |
| `styles:importCancel` | importCancel(id)  [index-wX7YC2th.js] |
| `styles:importFix` | importFix(id)  [index-wX7YC2th.js] |
| `styles:importFixList` | importFixList(id)  [index-wX7YC2th.js] |
| `styles:importInstall` | importInstall(id)  [index-wX7YC2th.js] |
| `styles:importPickFolder` | importPickFolder()  [index-wX7YC2th.js] |
| `styles:importPickZip` | importPickZip()  [index-wX7YC2th.js] |
| `styles:importStart` | importStart(source)  [index-wX7YC2th.js] |
| `styles:importState` | importState(id)  [index-wX7YC2th.js] (+1 more) |
| `styles:importStop` | importStop(id)  [index-wX7YC2th.js] |
| `styles:kitInfo` | styleKitInfo()  [index-wX7YC2th.js] |
| `styles:kitMake` | makeStyleKit()  [index-wX7YC2th.js] |
| `styles:list` | styles()  [index-wX7YC2th.js] |
| `styles:recheck` | recheckStyle(styleId)  [index-wX7YC2th.js] |
| `styles:restoreVersion` | restoreStyleVersion(styleId, version)  [index-wX7YC2th.js] |
| `styles:useFigureModel` | useFigureModel(projectId, id)  [index-wX7YC2th.js] |
| `styles:versions` | styleVersions(styleId)  [index-wX7YC2th.js] |
| `test:throw` | testThrow(o)  [index-wX7YC2th.js] |
| `tools:installPython` | installPython(pkgs)  [index-wX7YC2th.js] |
| `toonchars:describe` | toonCharDescribe(text)  [index-wX7YC2th.js] |
| `toonchars:list` | toonChars()  [index-wX7YC2th.js] |
| `toonchars:remove` | toonCharRemove(id)  [index-wX7YC2th.js] |
| `toonchars:save` | toonCharSave(c)  [index-wX7YC2th.js] |
| `update:beta` | betaNotice()  [index-wX7YC2th.js] |
| `update:betaDismiss` | dismissBetaNotice()  [index-wX7YC2th.js] |
| `update:check` | checkUpdates()  [index-wX7YC2th.js] |
| `update:install` | installUpdate()  [index-wX7YC2th.js] |
| `update:status` | updateStatus()  [index-wX7YC2th.js] |
| `usage:setPlan` | setUsagePlan(kind, custom)  [index-wX7YC2th.js] |
| `usage:summary` | usageSummary()  [index-wX7YC2th.js] |
| `vertical:card` | endCardPreview(projectId, o)  [index-wX7YC2th.js] |
| `vertical:export` | exportVertical(projectId, o)  [index-wX7YC2th.js] |
| `vertical:frames` | verticalFrames(projectId, source, times, captions = true)  [index-wX7YC2th.js] |
| `vertical:info` | verticalInfo(projectId)  [index-wX7YC2th.js] |
| `vertical:logo` | setEndCardLogo(file)  [index-wX7YC2th.js] |
| `vertical:reframe` | reframe(projectId)  [index-wX7YC2th.js] |
| `vertical:shots` | verticalShots(projectId, source)  [index-wX7YC2th.js] |
| `voice:account` | voiceAccount(force)  [index-wX7YC2th.js] |
| `voice:cancel` | voiceCancel(projectId)  [index-wX7YC2th.js] |
| `voice:customVoices` | customVoices(force)  [index-wX7YC2th.js] |
| `voice:elevenModels` | elevenModels()  [index-wX7YC2th.js] |
| `voice:elevenVoices` | elevenVoices(force)  [index-wX7YC2th.js] |
| `voice:estimate` | voiceEstimate(projectId, req)  [index-wX7YC2th.js] |
| `voice:expand` | voiceExpand(paths)  [index-wX7YC2th.js] |
| `voice:fishCredit` | fishCredit(force)  [index-wX7YC2th.js] |
| `voice:fishForget` | fishForget(id)  [index-wX7YC2th.js] |
| `voice:fishModels` | fishModels()  [index-wX7YC2th.js] |
| `voice:fishSave` | fishSave(text, name)  [index-wX7YC2th.js] |
| `voice:fishSaved` | fishSaved()  [index-wX7YC2th.js] |
| `voice:fishSetKey` | fishSetKey(key)  [index-wX7YC2th.js] |
| `voice:fishVoiceName` | fishVoiceName(id)  [index-wX7YC2th.js] |
| `voice:fishVoices` | fishVoices(language, force)  [index-wX7YC2th.js] |
| `voice:interrupted` | voiceInterrupted()  [index-wX7YC2th.js] |
| `voice:job` | voiceJob(projectId)  [index-wX7YC2th.js] |
| `voice:kokoroCancel` | kokoroCancel()  [index-wX7YC2th.js] |
| `voice:kokoroInstall` | kokoroInstall()  [index-wX7YC2th.js] |
| `voice:kokoroRemove` | kokoroRemove()  [index-wX7YC2th.js] |
| `voice:kokoroVoices` | kokoroVoices()  [index-wX7YC2th.js] |
| `voice:preview` | voicePreview(o)  [index-wX7YC2th.js] |
| `voice:probe` | voiceProbe(files)  [index-wX7YC2th.js] |
| `voice:scriptWords` | voiceScriptWords(projectId)  [index-wX7YC2th.js] |
| `voice:seen` | voiceSeen(projectId)  [index-wX7YC2th.js] |
| `voice:setKey` | voiceSetKey(key)  [index-wX7YC2th.js] |
| `voice:setSpeakers` | voiceSetSpeakers(projectId, provider, voices)  [index-wX7YC2th.js] |
| `voice:speakers` | voiceSpeakers(projectId)  [index-wX7YC2th.js] |
| `voice:start` | voiceStart(projectId, req)  [index-wX7YC2th.js] |
| `voice:status` | voiceStatus()  [index-wX7YC2th.js] |
| `workspace:inspect` | workspaceInspect()  [index-wX7YC2th.js] |
| `workspace:move` | workspaceMove(token)  [index-wX7YC2th.js] |
| `workspace:restart` | workspaceRestart()  [index-wX7YC2th.js] |
| `youtube:add` | ytAdd(input)  [index-wX7YC2th.js] |
| `youtube:approved` | ytApproved(channelId)  [index-wX7YC2th.js] |
| `youtube:cancelSignIn` | ytCancelSignIn()  [index-wX7YC2th.js] |
| `youtube:channelFrom` | ytChannelFrom(ytId)  [index-wX7YC2th.js] |
| `youtube:disconnect` | ytDisconnect(id)  [index-wX7YC2th.js] |
| `youtube:insightAdd` | ytInsightAdd(channelId, text)  [index-wX7YC2th.js] |
| `youtube:insightDismiss` | ytInsightDismiss(id)  [index-wX7YC2th.js] |
| `youtube:insightUpdate` | ytInsightUpdate(id, patch)  [index-wX7YC2th.js] |
| `youtube:insights` | ytInsights(channelId)  [index-wX7YC2th.js] |
| `youtube:insightsCancel` | ytInsightsCancel(channelId)  [index-wX7YC2th.js] |
| `youtube:insightsRun` | ytInsightsRun(channelId)  [index-wX7YC2th.js] |
| `youtube:link` | ytLink(ytId, channelId)  [index-wX7YC2th.js] |
| `youtube:linkSuggestion` | ytLinkSuggestion(ytId)  [index-wX7YC2th.js] |
| `youtube:linkVideo` | ytLinkVideo(videoId, projectId)  [index-wX7YC2th.js] |
| `youtube:overview` | ytOverview(id)  [index-wX7YC2th.js] |
| `youtube:remove` | ytRemove(id)  [index-wX7YC2th.js] |
| `youtube:reopenSignIn` | ytReopenSignIn()  [index-wX7YC2th.js] |
| `youtube:reorder` | ytReorder(ids)  [index-wX7YC2th.js] |
| `youtube:setClient` | ytSetClient(o)  [index-wX7YC2th.js] |
| `youtube:setKey` | ytSetKey(key)  [index-wX7YC2th.js] |
| `youtube:signIn` | ytSignIn()  [index-wX7YC2th.js] |
| `youtube:status` | ytStatus()  [index-wX7YC2th.js] |
| `youtube:sync` | ytSync(id)  [index-wX7YC2th.js] |
| `youtube:undoLink` | ytUndoLink(undo)  [index-wX7YC2th.js] |
| `youtube:video` | ytVideo(videoId, force)  [index-wX7YC2th.js] |
| `youtube:videoChoices` | ytVideoChoices(projectId)  [index-wX7YC2th.js] |

### A.2 Event channels — main → renderer (61)

| Event channel | Subscribed in | # subscriptions |
|---|---|---|
| `anims:changed` | index-wX7YC2th.js | 1 |
| `anims:progress` | index-wX7YC2th.js | 1 |
| `audio:hold` | Editor-DZrg__Oz.js | 1 |
| `berserk:event` | Berserk-C9dvu7o6.js | 1 |
| `berserk:list` | Berserk-C9dvu7o6.js, index-wX7YC2th.js | 2 |
| `cartoon:tools-progress` | Editor-DZrg__Oz.js | 1 |
| `channels:changed` | index-wX7YC2th.js | 3 |
| `characters:changed` | Presets-DvJV_fHd.js | 1 |
| `characters:progress` | Presets-DvJV_fHd.js | 1 |
| `chars:changed` | index-wX7YC2th.js | 2 |
| `chars:progress` | index-wX7YC2th.js | 1 |
| `claude:event` | ClaudePanel-D3_P-Q-D.js, Editor-DZrg__Oz.js, PersonalEditor-Bx92rSWj.js, Studio-ghmU7lZn.js, index-wX7YC2th.js | 6 |
| `claude:frames` | ClaudePanel-D3_P-Q-D.js | 1 |
| `claude:login-log` | index-wX7YC2th.js | 1 |
| `customapi:state` | index-wX7YC2th.js | 2 |
| `doc:tools-progress` | index-wX7YC2th.js | 1 |
| `engines:changed` | index-wX7YC2th.js | 1 |
| `engines:login-log` | index-wX7YC2th.js | 1 |
| `experimental:login-log` | index-wX7YC2th.js | 1 |
| `experimental:state` | index-wX7YC2th.js | 1 |
| `graphics:switched` | index-wX7YC2th.js | 1 |
| `help:report` | index-wX7YC2th.js | 1 |
| `higgsfield:job` | index-wX7YC2th.js | 1 |
| `images:blocked` | index-wX7YC2th.js | 1 |
| `images:flowRest` | index-wX7YC2th.js | 1 |
| `launcher:gone` | index-wX7YC2th.js | 1 |
| `library:changed` | Library-mIRbGqLR.js, index-wX7YC2th.js | 2 |
| `library:harvest` | ClaudePanel-D3_P-Q-D.js, Library-mIRbGqLR.js | 2 |
| `personal:changed` | PersonalEditor-Bx92rSWj.js, index-wX7YC2th.js | 2 |
| `personal:job` | PersonalEditor-Bx92rSWj.js | 1 |
| `personal:media` | PersonalEditor-Bx92rSWj.js | 1 |
| `pipeline:log` | Editor-DZrg__Oz.js, index-wX7YC2th.js | 2 |
| `plan:changed` | index-wX7YC2th.js | 1 |
| `project:changed` | Editor-DZrg__Oz.js, Studio-ghmU7lZn.js, index-wX7YC2th.js | 4 |
| `projects:covers` | index-wX7YC2th.js | 1 |
| `references:changed` | index-wX7YC2th.js | 1 |
| `references:progress` | index-wX7YC2th.js | 1 |
| `render:done` | Editor-DZrg__Oz.js, index-wX7YC2th.js | 4 |
| `render:progress` | index-wX7YC2th.js | 3 |
| `routines:changed` | Routines-D_Yl8puY.js | 1 |
| `routines:finding` | Routines-D_Yl8puY.js | 1 |
| `routines:item` | Routines-D_Yl8puY.js | 1 |
| `routines:notice` | index-wX7YC2th.js | 1 |
| `routines:run` | Routines-D_Yl8puY.js | 1 |
| `rules:suggested` | ClaudePanel-D3_P-Q-D.js, index-wX7YC2th.js | 2 |
| `rx:tools-progress` | Editor-DZrg__Oz.js | 1 |
| `sfxlib:changed` | index-wX7YC2th.js | 1 |
| `sound:state` | Editor-DZrg__Oz.js | 1 |
| `speech:state` | index-wX7YC2th.js | 2 |
| `storyboard:changed` | index-wX7YC2th.js | 1 |
| `studio:changed` | Studio-ghmU7lZn.js | 1 |
| `styles:changed` | Presets-DvJV_fHd.js, index-wX7YC2th.js | 2 |
| `styles:importChanged` | StyleImport-DPAzH3B8.js, index-wX7YC2th.js | 3 |
| `ui:zoom` | index-wX7YC2th.js | 2 |
| `update:beta` | index-wX7YC2th.js | 1 |
| `update:status` | index-wX7YC2th.js | 2 |
| `voice:install` | index-wX7YC2th.js | 1 |
| `voice:progress` | Editor-DZrg__Oz.js, index-wX7YC2th.js | 4 |
| `workspace:progress` | index-wX7YC2th.js | 1 |
| `youtube:changed` | index-wX7YC2th.js | 3 |
| `youtube:sync` | index-wX7YC2th.js | 1 |
