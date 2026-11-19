# SEAT.md — كرسي السائق (Codespace writing room)

The Codespace `driver-seat-test` on this repo is the production seat for the
Antigravity driver (Gemini 4 Hydrogen). It exists because the desk VM's
sessions die on runtime restarts; the seat lives on GitHub's infrastructure,
its sign-in and files persist across stops, and work products are committed
to this repo — never held only in a live session.

## Facts (proven 2026-11-19)
- Machine: 2-core (basicLinux32gb), 8 GB RAM, 32 GB disk.
- `agy` 1.5.12 + `tmux` installed by `.devcontainer/devcontainer.json` (postCreate).
- Signed in with the owner's sacrificial account (arabymahmuod10@gmail.com,
  Google AI Pro) — by the owner's decision the seat keeps THIS account.
- Google did not flag the datacenter sign-in; print test answered correctly.
- Free quota: 120 core-hours/month (≈60 machine-hours on 2-core) + 15 GB
  storage accounting. Sessions are ~2 h of real work. STOP the codespace
  after every job (`gh codespace stop`) — never leave it idling.

## How work runs here (writing room protocol)
1. Layla writes the job into `seat/TASK.md` (template: `seat/TASK-template.md`)
   and pushes it.
2. The seat is woken (web editor or `gh codespace code`); the driver runs
   `agy` (Hydrogen, high) interactively in tmux, reads `seat/TASK.md`,
   and works ONLY from it.
3. The driver writes every product (script, BIBLE, shot list, checkpoints)
   into the project folder named in the task and COMMITS + PUSHES from
   inside the seat. Checkpoints go to `seat/checkpoints.md` as it works.
4. Layla pulls, reviews with her own eyes, and reports to the owner by voice.
   Final evaluation is Layla's; the seat never publishes anything.
5. When the job is done the seat is stopped to conserve quota.

## Discipline
- The heart's own skills (`skills/cartoon-shorts/`) are the method; the
  driver reads them before writing. The brain is Hydrogen; the craft is the
  heart's.
- On a 429 the driver checkpoints and stops; it never switches models on
  its own.
- Outputs (frames, renders) never live in the seat — renders run on the
  fleet; masters land in Drive.

## Protocol note (learned on job 1, 2026-11-19)
- agy PRINT mode cannot prompt for command permission: its internal `git push` was auto-denied ("jetski: no output produced"). The writing and commit worked. Rule: the seat agent writes and commits; the PUSH is done by the supervising hand (browser agent or desk) from the seat terminal after the run.
