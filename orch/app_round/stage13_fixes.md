You are the Codex build seat for Heart Studio (repo: ~/workspace/heart-studio, branch ui/unified-interface). Read AGENTS.md first. One defect (F15) in the pass runner's FRESH-critic evidence, ONLY in server/server.js. Verify with `node --check server/server.js`. Do not commit; the driver verifies live and commits.

F15 (found live, twice): the fresh second critic (Opus, a text-only call) systematically declines to verdict — "unparseable verdict" — because its evidence pack (~1 KB) contains only the builder's summary tail and the check results, while referring to changed files by path. The critic answers that it cannot judge files it cannot see, so no pass can ever reach hand-over through the fresh-critic gate. The first critic's pack has the same thinness; enrich both, with the fresh critic's pack (evidence2) as the priority.

Fix: when building a critic evidence pack in the pass runner, include the pass's actual change record from the project's .heart-git:
1. `git diff HEAD --stat` and the full `git diff HEAD` for the pass's allowedPaths, capped (stat first, then diff up to ~10000 chars, truncated with a clear marker).
2. Untracked files under the allowedPaths (from git status --porcelain): list them; for text files up to 4000 chars each, include their contents (cap the total addition).
3. A plain statement in the prompt: the probe stills were rendered and verified programmatically by the program itself (dimensions recorded in the checks); the critic judges the change record and the checks and must answer VERDICT: YES or VERDICT: NO with reasons.
Keep the whole evidence pack bounded (~18000 chars max). Use the existing gitInProject helper. If git fails, include the error text in the pack rather than throwing — the critic flow must not die on evidence gathering.
