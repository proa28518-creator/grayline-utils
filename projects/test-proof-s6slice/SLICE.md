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
