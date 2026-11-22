# Proof slice — how this mini film is defined (2026-11-22)

The product of this test project is a **7.69 s mini film: the first 3 sentences**
of Story 6 (lines 1–3, ending at «…في أوضة تلج», t = 7.69 s in the owner's recording).

Why the project carries the FULL timing set (117 words / 56.20 s voice):
the film engine builds the film by matching scenes/film.js's embedded line list
against audio/clean.json (`words: 'audio/clean.json'` in film.js). Truncating
clean.json to the slice's 26 words makes MAKE_FILM fail at boot —
proven live in GitHub Actions run 44992079289:
"line 4 expects «مفيش» but words.json has no more words. 26 words matched before it."
So the slice is taken where the program itself takes it: the **render range**
(frames 0..230 at 30 fps = 0–7.69 s) and the **mix** (first 7.69 s of the owner's
voice + the program-generated bed). The sound lanes (audio/events|beds|timeline.json)
ARE slice-scoped (0–7.69 s), translated from the film's own finishing plan cue sheet.
