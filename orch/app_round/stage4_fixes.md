You are the Codex build seat for Heart Studio (repo: ~/workspace/heart-studio, branch ui/unified-interface). Read AGENTS.md first. This is the FIX round for the desktop-app build: independent Opus + GLM hunts plus desk verification produced the findings below. Fix ONLY server/server.js and .gitignore. Do NOT modify bin/heart, app/, engine/, fleet/, ui/, or projects/* content. Your sandbox cannot listen or write .git — verify with `node --check` only, do not commit; the driver verifies live and commits.

F1 (HIGH, desk-found): In the RUN's export leg, the git helper is `spawnSync('git', ['-C', activeDir, ...])` but it runs `git add projects/<name>/audio/final_mix.wav projects/<name>/project.json` — repo-root-relative paths from the project dir, so the add fails/misfires. Change that leg's git helper to run with `-C repoDir`.

F3 (HIGH, desk-verified live): GET /app/ (trailing slash) returns 404 while the Electron window loads exactly that URL. In the /app route, treat pn === '/app' OR pn === '/app/' as '/index.html'; other /app/* paths keep slice(4).

F4 (HIGH, desk-proven empirically): /api/projects/new repo-level `git add projects/<name>` records a GITLINK (mode 160000) because heart new created a nested .git inside the project — fleet checkouts then get an EMPTY project folder. Fix with a ".heart-git" convention:
- Add a server helper `projectGitDir(dir)`: returns '.git' if <dir>/.git exists, else '.heart-git' if <dir>/.heart-git exists, else null. Add `gitInProject(dir, args)`: if no git dir → {status:1, stderr:'no project git repo'}; else spawnSync git with ['--git-dir', path.join(dir, gd), '--work-tree', dir, ...args].
- projectGit(), GET /api/history, and POST /api/history/revert must use these helpers (history is available when projectGitDir is non-null; revert uses gitInProject).
- In /api/projects/new: AFTER the project-level snapshot commit (which uses the fresh .git from heart new) and BEFORE the repo-level add, rename <dest>/.git → <dest>/.heart-git (fs.renameSync). The repo-level add/commit/push then tracks real files. Add `historyMode: 'heart-git'` to the response.
- Pass runner (POST /api/passes/run): at job start, if projectGitDir(activeDir) is null, initialize one: `git init` with --git-dir <dir>/.heart-git --work-tree <dir> (spawnSync git ['--git-dir', gd, '--work-tree', dir, 'init']), then add -A + commit `snapshot: pass baseline` via gitInProject; log this in the job feed. The hand-over checkpoint commit must use gitInProject (not `git -C activeDir`). Rollback must use projectGitDir/gitInProject instead of the bare .git existence check and `-C` form.
- .gitignore: add the line `projects/*/.heart-git/`.

F5 (MED, GLM hunt): The pass builder's scope (allowedPaths, project-only) is not enforced. In POST /api/passes/run: before the builder stage, snapshot the repo-level `git -C repoDir status --porcelain` lines into a Set. After the builder stage AND after each fix round, enforce: (a) project scope — `gitInProject status --porcelain` paths (strip the 3-char status prefix and any ` -> ` rename target handling) must each start with one of def.allowedPaths (prefix match); (b) outside scope — repo status --porcelain lines NOT in the before-snapshot whose paths do not start with `projects/<activeName>/` are violations. Any violation fails the stage (state failed, history + job log name the offending paths).

F6 (MED, both hunts): Concurrent run/pass jobs on the same project can interleave git/state writes. POST /api/run → 409 if any non-ended job with kind 'pass' exists for activeDir. POST /api/passes/run → 409 if any non-ended job with kind 'run' exists for activeDir.

F7 (LOW, Opus hunt): In /api/projects/new, after merging settings, force fps: if pj.settings.fps is not 24 or 30, set it to 30. (Stored settings must never carry 60.)

End with a summary mapping each finding to the exact change. Verify `node --check server/server.js`.
