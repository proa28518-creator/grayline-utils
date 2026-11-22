# Script-to-ASR timing alignment

## Root cause

The timing leg transcribed narration and wrote the raw ASR hypothesis words directly to `audio/clean.json`, while the engine requires the script's exact words before it can build a film. `words_owner.txt` only served as an optional accuracy reference; its edit-distance backtrace was discarded, and the chat-created watchmaker project has no owner timing file to hide the mismatch. Dialect recognition errors therefore made the strict script/word check abort at the first differing token. The transcription path now aligns the ASR hypothesis to `script.txt` and uses ASR for timing while the script remains authoritative for wording.

## Alignment rules implemented

- The existing normalized edit-distance machinery now exposes its ordered match (`M`), substitution (`S`), script deletion (`D`), and ASR insertion (`I`) operations. `words_owner.txt`, when present, continues to provide only the raw-ASR accuracy reference.
- Matched and substituted script words take their aligned ASR word's start/end. Script words with no ASR counterpart receive evenly interpolated, monotonic spans between aligned neighbors (using 0 and probed narration duration at the beginning/end). ASR-only words are omitted.
- `audio/clean.json` preserves the engine entry shape `start`, `end`, `line`, `who`, `word`; `word` is the script token and `line` is its 1-based physical line in `script.txt`.
- The report retains the raw ASR `transcript` and accuracy fields and adds `alignment` counts: `script_words`, `matched`, `substituted`, `inserted_interpolated`, `dropped_asr_words`, and `aligned_fraction`.
- Below 80% matched-plus-substituted script words, transcription fails with `asr_alignment_failed`, writes the diagnostic report/raw transcript, and does not leave an unaligned `clean.json` available to the engine. Above the threshold, aligned `clean.json` is written. `audio/clean.wav` remains an atomic byte copy of the original voice.

## Static checks

```text
$ python3 -m py_compile tools/transcribe.py
(exit 0)
$ git diff --check
(exit 0)
```

No project transcription, still render, server bind, or Build pass was run from this seat.

## Exact desk re-check

The desk has faster-whisper `small` cached under `$HOME/workspace/tools/whisper-models` and the runtime pins `huggingface-hub==0.36.2` and `av==13.1.0` installed in `$HOME/workspace/tools/whisper-venv`. Re-run transcription with the same environment:

```sh
export HEART_WHISPER_PYTHON="$HOME/workspace/tools/whisper-venv/bin/python"
export HEART_ASR_MODEL=small
export HEART_ASR_MODEL_DIR="$HOME/workspace/tools/whisper-models"
export HEART_ASR_LANGUAGE=ar
export HEART_ASR_DEVICE=cpu
export HEART_ASR_COMPUTE_TYPE=int8
node bin/heart transcribe projects/real-test-watchmaker
cat projects/real-test-watchmaker/out/transcribe_report.json
cmp projects/real-test-watchmaker/voice_owner.wav projects/real-test-watchmaker/audio/clean.wav
```

Confirm `alignment.script_words`, match/substitution/interpolation/drop counts, and `aligned_fraction >= 0.8`; inspect `audio/clean.json` to confirm each output `word` comes from `script.txt` and lines follow the script. Confirm `audio/clean.wav` remains byte-identical to `voice_owner.wav`.

Then render and inspect the requested frame:

```sh
node bin/heart still projects/real-test-watchmaker 4.1 projects/real-test-watchmaker/out/align-check-t4.1.png
test -s projects/real-test-watchmaker/out/align-check-t4.1.png
```

Expected: `heart still` saves the frame at `t=4.1` instead of failing on a script/ASR wording mismatch. In the Heart Studio chat for `real-test-watchmaker`, send **“Go, start the Build pass now.”** Expected: the chat reports a Build pass job start and the pass runner restarts through the existing chat tool path.
