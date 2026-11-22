# Proof slice — how this mini film is defined (2026-11-22)

The product of this test project is a **5.88 s mini film: the first 2 sentences**
of Story 6 (lines 1–2, ending at «…بيصطاد طيارات العدو من بعيد», t = 5.88 s).

Scope note: the slice started at 3 sentences (7.69 s / 231 frames). The fleet
renders this scene at ~14.3 s/frame (measured: 428 s per 30-frame chunk,
run-info of runs 44992357905 + 44993117181), so 231 frames ≈ 55 min — over the
40-minute reasonableness bound set for this proof, so the slice was reduced to
2 sentences (177 frames ≈ 42 min) per the proof's own rule.

Why the project carries the FULL timing set (167 words / 56.20 s voice):
the film engine builds the film by matching scenes/film.js's embedded line list
against audio/clean.json (`words: 'audio/clean.json'` in film.js). Truncating
clean.json to a slice makes MAKE_FILM fail at boot — proven live in GitHub
Actions run 44992079289: "line 4 expects «مفيش» but words.json has no more
words. 26 words matched before it." So the slice is taken where the program
itself takes it: the **render range** (frames 0..176 at 30 fps = 0–5.88 s) and
the **mix** (first 5.88 s of the owner's voice + the program-generated bed).
The sound lanes (audio/events|beds|timeline.json) ARE slice-scoped (0–5.88 s),
translated from the film's own finishing plan cue sheet.

## PROOF RESULT — 2026-11-22 (end-to-end through the program)
- Final RUN run-1795332947076: status done, waitingOn «لا شيء» — script ✓ verified, voice ✓ verified, timing ✓ executed (167 entries), board ✓ verified (30 stills via GitHub run 44993117181), sound ✓ executed (audio/sfx_bed.wav), gates ✓ ALL PASS, export ✓ verified.
- Full-slice render: GitHub run 44994044987 (fleet-render, render:0:177, settings fps 30 + captions recorded in run-info) — success.
- Assembly: GitHub run 44998645890 (fleet-assembly) — success; gates: pts_audit 177 sequential ✓, encode H.264 30fps + AAC ✓, SSIM mean 0.9923 ✓, filmGrade null (honest).
- Mini master: out/master.mp4 — 1080x1920, 30 fps, 5.90 s, H.264 + AAC, 2,230,872 bytes.
- Program defects found by this proof and fixed (Codex-authored, Opus+GLM hunts): (1) dispatch monitor tar unpack died on runner uid ownership (c9d93c7); (2) sound_design.py's sfxlib dependency was never vendored into the repo (78b6e8e, byte-identical copy); (3) dispatch monitor died on a single transient poll network error — retry tolerance added, hunts CLEAN (468b786); (4) assembly obtain-step missed the tar's frames/ prefix — flatten line added, hunts CLEAN (f6602c6).
- Manual/prep steps (named, not hidden): project slicing/data prep; sound-lane translation from Story 6's finishing plan into events/beds/timeline JSON; the mixdown itself (no program mix verb exists — sliced voice + program sfx_bed, sidechain duck, loudnorm -16 LUFS); copying the program-downloaded master into out/master.mp4.
