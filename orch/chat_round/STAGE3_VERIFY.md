# Stage 3 verification

Date: 2026-11-22. This sandbox cannot bind the desk server and is not the commit seat. No server bind or commit was attempted. The Stage 2 desk report remains the live evidence for D1, ASR, annotation storage, and the Camera run; this note records the follow-up fixes and static checks only.

## Desk Stage 2 evidence carried forward

- D1 passed when replayed verbatim: the brief retained story and priorities, excluded the setup command from Story / request, and the temporary test project was removed.
- faster-whisper `small` (464 MB) was cached under `~/workspace/tools/whisper-models`. The venv needs `huggingface-hub==0.36.2` and `av==13.1.0`: Hugging Face Hub 2.x broke the downloader path and PyAV 19 removed the `metadata_errors` argument expected by faster-whisper.
- The Story 6 Arabic dialect sample produced 19/20 words, WER `0.40`, word accuracy `0.60`; `/api/asr-status` returned `available:true`. These are the desk's measured results, not a sandbox transcription result.
- Annotation rows persisted as `open`. Camera probe dimensions and the camera source contract passed; prop crops and `prop_gate.json` were produced. The annotation text appeared in the GLM critic's NO verdict and the fix loop iterated. The checkpoint correctly remained blocked by the measured prop-truth gate.

To reproduce the ASR environment in the existing local venv:

```sh
~/workspace/tools/whisper-venv/bin/pip install 'huggingface-hub==0.36.2' 'av==13.1.0'
HEART_WHISPER_PYTHON=~/workspace/tools/whisper-venv/bin/python \
HEART_ASR_MODEL_DIR=~/workspace/tools/whisper-models \
bin/heart transcribe projects/accept-s6slice
```

The desk already installed these pins and cached the model; these commands are for reproducing that environment, not a request to reinstall it.

## Fixes made

### F1 — Pass-editable set-dressing allowance

The gate accepts both the legacy `props.json` array and an object form:

```json
{
  "props": [{"name":"microwave","appearsAt":0.5,"cropBox":{"x":0.2,"y":0.2,"w":0.3,"h":0.3}}],
  "setDressing": ["wall", "floor"]
}
```

It unions `setDressing` with the existing `Set dressing allowance:` brief line. Matching is case-insensitive and canonicalizes common plurals (`walls` → `wall`, `floors` → `floor`, `tables` → `table`, including common `-ies` and `-es` forms). The full-frame vision prompt asks it to return exact names for declared props and allowed dressing. The builder contract and all five pass instruction files ask builders to seed only visible set dressing, including wall, floor, ceiling, counter, or table when actually present. New director-created projects use the object form; existing array files remain readable. `write_brief` preserves existing props and dressing.

### F2 — Current-composition crop boxes

The pass contract and each pass instruction require every declared prop cropBox to match the current probe composition. Camera explicitly says this is mandatory after reframing. When a failed crop description is dominated by caption/text/lettering, the gate names possible stale cropBox placement and tells the builder to re-aim it. This suspicion is additional guidance; the crop verdict still determines the measured prop failure.

### F3 — Runner-owned probes

The central pass prompt and all five pass instruction files state that the runner renders the probe stills under `out/passes/<pass>/probe-*.png`; builders may inspect available prior-round still files. They must not invoke `heart still`, start a local server, or run another server-starting command because the builder seat cannot bind local ports.

## Static checks

```text
node --check server/server.js       exit 0, no output
node --check app/renderer/app.js     exit 0, no output
node --check bin/heart               exit 0, no output
git diff --check                     exit 0, no output
```

These checks cover JavaScript syntax and whitespace only. I did not start the server or exercise a pass. The desk should now retry Camera, then Environment, Post, and Shading in strict order on `projects/accept-s6slice`; inspect each gate's `prop_gate.json`, crops, and checkpoint state. The Stage 2 Camera run was a failed measured checkpoint, so it needs a new successful Camera checkpoint before Environment can start.

## Changed files

- `server/server.js` — legacy-array/object props reader, set-dressing merge and plural matching, stale-caption crop hint, project prop-document writer, and central prop/probe builder contract.
- `skills/cartoon-shorts/steps/build.md`
- `skills/cartoon-shorts/steps/camera.md`
- `skills/cartoon-shorts/steps/environment.md`
- `skills/cartoon-shorts/steps/post.md`
- `skills/cartoon-shorts/steps/shading.md`
- `orch/chat_round/STAGE3_VERIFY.md`

No project contents were edited for Stage 3. No commits were made from this sandbox.
