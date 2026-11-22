You are the Codex build seat for Heart Studio (repo: ~/workspace/heart-studio, branch ui/unified-interface). Read AGENTS.md at the repo root first — its rules bind this session. This is STAGE 1 of the desktop-app round: extend ONLY `bin/heart`. Do not touch server/, ui/, app/, engine/, fleet/, or any projects/* content. Commit only bin/heart on ui/unified-interface when done, and end with a summary of exactly what you changed and how you tested it.

Implement these four things in bin/heart:

1. `heart new <name> [template]` — keep current behavior (copy template project, default `demo-ring`, skip panel_state.json and out/), but: (a) accept an optional template project name as the second argument; (b) after the copy, initialize a git repo INSIDE the new project (`git init`), `git add -A`, and an initial snapshot commit with message `snapshot: project created` (pass `-c user.name="Heart Studio" -c user.email="heart@localhost"` to the commit command so it never depends on global config). If git fails, print a clear warning but do not fail project creation.

2. `heart slice <project> <seconds> <outDir>` — the program's sample-slicing operation. Resolve the project as other verbs do. Voice = first existing of voice_owner.wav, voice_ar.wav, audio/source.wav. Create outDir. Produce:
   - `<outDir>/voice_slice.wav`: ffmpeg `-t <seconds>` copy/re-encode of the voice (pcm_s16le).
   - `<outDir>/words_slice.txt`: if words_owner.txt exists, the entries (lines matching `^\[mm:ss.xx - mm:ss.xx\] text`) whose start < seconds, with end clamped to seconds, re-emitted in the same `[MM:SS.ss - MM:SS.ss] word` format.
   - `<outDir>/clean_slice.json`: if audio/clean.json exists, entries with start < seconds, end clamped to seconds, same JSON shape.
   Print a one-line JSON summary {voice, words, entries, seconds} to stdout. Exit 1 with a named error (e.g. `slice_no_voice`) if the voice or both timing sources are missing.

3. `heart mix <project>` — the mixdown verb (this replaces a step that was done by hand in the proof test). Voice = first existing of voice_owner.wav, voice_ar.wav, audio/source.wav (exit 1 `mix_no_voice` if none). Bed = audio/sfx_bed.wav if it exists. Get the voice duration D via ffprobe. Use ONE ffmpeg invocation:
   - With bed: bed stream → apad → atrim=0:D → sidechaincompress against the voice (threshold=0.02, ratio=8, attack=20, release=300) → amix with the voice (inputs=2, duration=first, normalize=0) → loudnorm I=-16 TP=-1.5 LRA=11.
   - Without bed: voice → loudnorm I=-16 TP=-1.5 LRA=11, and report bedUsed=false.
   Write the result to BOTH `out/mix_stage/audio/final_mix.wav` and `audio/final_mix.wav` (two ffmpeg outputs or one render + file copy). Verify with ffprobe: output duration within ±0.2 s of D. Write `out/mix_report.json` {ok, voiceSec, mixSec, bedUsed, outputs} and print it. Exit 1 with a named error if verification fails.

4. `heart app [project]` — launch the desktop app (built in a later stage at app/): find an Electron binary in this order: $ELECTRON_BIN, app/node_modules/.bin/electron, app-shell/node_modules/.bin/electron, `electron` on PATH. Spawn it detached with the app/ directory as the app path and pass the optional project argument through as an env var HEART_PROJECT. If no binary is found, print a clear named error and exit 1.

Also update the CLI help text to list the new verbs. Test before committing: run `heart slice projects/test-proof-s6slice 5.88 /tmp/slice-test` and verify the three outputs (words entries must be the 26 words under 5.88 s); run `heart mix` on a THROWAWAY COPY of projects/test-proof-s6slice under /tmp (never on the real project) and verify mix_report ok and duration ≈5.88 s is NOT expected there — the copy carries the full 56.2 s voice, so expect ≈56.2 s; run `heart new __tmp_new_test` then confirm projects/__tmp_new_test/.git exists, then delete that folder. Report test results in your summary.
