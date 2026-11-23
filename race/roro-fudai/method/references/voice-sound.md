# Voice and sound

## The voice is made by the app
- `audio/clean.wav` = the member's voice, already trimmed with no gaps (a 15 ms buffer around each cut).
- `audio/clean.json` = its word times. `audio/timeline.json` = the app's timeline. Never edit, trim, re-time or replace these files.
- Read the words with `narration` (or open `audio/clean.json`). Film time = the voice's clock: t = 0 is the first sample of `clean.wav`.
- In `scenes/film.js`: `voice: { file: 'audio/clean.wav', words: 'audio/clean.json', lines: [...] }`.

## Lines
- Split the words into `lines` in order, one line per speaker turn (or per sentence for a narrator). Each line's `text` must give
  exactly the words in `audio/clean.json`, in order (case and punctuation ignored). Leftover or missing words stop the film and name the line.
- **Write them as heard.** The read can differ from the script ("fights its way" was in the read, not the script). Use the read and
  say so in your notes; never silently "fix" it.
- `!` at the end of a word = a shout (the big open mouth). `loud: true` on a line = every word. Only on real shouts.
- If the words look wrong (a name heard as another word), the member can fix the transcript in the app; say so in plain words.

## Times tied to words
Every time key takes `'line:N.start'`, `'line:N.end'`, `'line:N.word:K'`, `'line:N.word:K.end'`, each with `+0.2` / `-0.3`.
Tie acting, props and cuts to words, never to raw seconds: the times stay right when the member trims the voice again.

## Sound
- The app does the sound design automatically (effects from the film's actions and cuts) and the mix. Music is added by the member
  by hand in the app. This style has no separate sound step: do not write mix scripts or sound files.
- Help the automatic sound: clear actions on words (a knock, a drop, a door) and cuts on hits give it something to land on.
- If the camera pass moves the cuts, the app's sound design follows the new cuts on its next run; mention in your notes any sound
  that was tied to an old cut.
