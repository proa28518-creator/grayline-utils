# When a tool fails: the SOP

Rule one: **never give up on something fixable.** Read the error, find the cause, fix it or fetch what is missing, retry. Stop and tell
the member only when the fix needs them (a sign-in, a purchase, a setting only they can change), and then say exactly what to click,
in plain words. Never switch to a paid image service unless the member already chose one. Never write outside the project.

## What the app gives you (cartoon projects)
- Suite tools: `check_preview`, `render_frames`, `film_sheet`, `film_probe`, `film_check`, `list_shots`, `narration`,
  `blender_run`, `make_picture`, `tex_job`. Prefer them: they keep paths inside the project and work the same on Windows and Mac.
- In Bash, the app's own runtimes: `$CZ_PYTHON` (Python 3.12 with numpy, scipy, pillow), `$CZ_FFMPEG`, `$CZ_FFPROBE`, `$CZ_BLENDER`
  (may be empty), `$CZ_NODE` (and `node` on PATH = the app's own node). Always quote them: `"$CZ_PYTHON" script.py`. Use these,
  never a system Python or ffmpeg the member may not have.
- The scripts behind `tex_job` and the Blender templates are readable in `.claude/skills/cartoon-shorts/tools/`.

## Tool problem codes (the app's own tools)
A cartoon tool that fails answers `TOOL PROBLEM [<code>]: <one sentence>`, then `--- details ---` with the raw output (the last lines,
every Python Traceback). The member sees the sentence in the Claude panel. Do what the row says; this table wins over the rows below it.
| code | what happened | do this |
|---|---|---|
| `path-outside` | a path argument is outside the project, or the wrong kind of file | use project-relative paths: `blender/build_set.py`, `assets/tex/raw/wall.png`, `assets/tex/preview` |
| `blender-missing` | Blender 5.2 is not installed yet; the app is getting it (the sentence says how far). Environment overhaul never starts without Blender, so you see this only in a chat change or if Blender went away mid-run | do the textures first; call `blender_run` again in a few minutes. Never install Blender yourself, and never build the set some other way instead |
| `blender-cant` | Blender can't run on this computer (an Intel Mac, no build) | do not build the set some other way: leave the set as it is and end with one line saying the set needs Blender 5.2 (a Mac with an Intel processor: installed from blender.org, Creatorize finds it) |
| `blender-failed` | the script raised a Python error, ended with a non-zero exit code, or Blender did not start. A check that ends in `CHECK FAIL` is not this: `blender_run` returns it as a normal result, so fix what its FAIL lines say and run it again | read the Traceback in the details, fix the line it names, run again. The same error 3 times: simplify the script |
| `blender-timeout` | the script ran longer than `timeout_s` (default 600 s) | split it per place (`args: ['<place>']`), lower subdivisions, or pass a bigger `timeout_s` (max 3600) |
| `python-missing` | Creatorize is still setting up its own Python | do other work for a few minutes, then run the tool again. Never pip install into another Python |
| `python-failed` | Creatorize's Python could not start | retry once; then go on with the kit textures and say so in your summary |
| `tex-not-installed` | this Creatorize has no such kit script | use the kit textures (or look at strips instead of the check) and say so in your summary |
| `tex-failed` | the texture script or the check ended with an error or ran over its time | read the printout: a missing raw picture, a recipe key, a bad picture. Fix `assets/tex/recipes.json` or `assets/tex/raw/`, rerun |
| `picture-none` | no picture service is set up | go on with free pictures: `web_image` surface photos and `tex_job procedural` (`references/textures-without-flow.md`); say in your summary that Google Flow gives the best result and how the member sets it up (Settings > Media > Image generation > Google Flow > Open Flow) |
| `picture-signin` | Google Flow needs the member to sign in again | replace this picture now, never leave its spot bare: a prop from `prop_library`, a surface from `tex_job procedural` or `web_image` (`references/textures-without-flow.md`). The app counts every picture and tells the member which failed |
| `picture-policy` | the picture service refused the prompt | reword it (no real people, brands, gore or violence words) and try again, at most 2 rewords |
| `picture-later` | 3 tries failed (busy, slow, resting) | replace it now the same way (`prop_library`, `tex_job procedural`, `web_image`); you may try the picture once more later in the run |
| `picture-failed` | any other picture error (the sentence says which) | read it; a reference that is not a picture: fix `refs`. Otherwise replace it now the same way, never a bare spot |
| `host-not-ready` | the film does not load in the preview, there is no film yet, or that check is not in this Creatorize | `check_preview`, fix the film's error, run again. A check that does not exist: look with `film_sheet` strips and `render_frames` |
| `frames-failed` | the preview could not draw the frames | `check_preview` shows why; fix it, run again |
| `ffmpeg-failed` | the frames could not be tiled into a sheet | retry once; then use `render_frames` |

## Failures and what they mean
| you see | it means | do this |
|---|---|---|
| `check_preview`: a film error naming a key (`"line:9.end" at shots[3]...`) | your film data is wrong at that key | fix that key; a `line:N` past the last line means you miscounted lines |
| `check_preview`: a load error in `scenes/set.js` or a prop | a syntax error or a bad import path | the path is relative to the file; engine modules are `../world/...`, `../engine/...` from `scenes/`, `../../engine/...` from `scenes/props/` |
| words do not match a line | a line's `text` differs from the words in `audio/clean.json` | copy the words as heard from `narration`; never edit the audio files |
| PROP GUARD fails (`film_probe`) | a prop jumps on screen inside a shot | put the change on a cut, use `pick_up` / `put_down` / a hand-over, or mark a real impact with `snap` |
| `render_frames` / `film_sheet` time out or come back black | the page did not finish loading (a big texture, a set error) | `check_preview` first; then fewer frames; check that `assets/` has gone quiet |
| `blender_run`: Blender not found | the app has not installed Blender yet | codes `blender-missing` and `blender-cant` above: the app installs it by itself; meanwhile do the textures, then run it again. The set is always built in Blender |
| `blender_run`: a Traceback | your script failed | read the WHOLE traceback in the log (the tool returns it); fix the line it names; rerun. Never pipe it through a filter that hides it |
| `blender_run`: a module is missing (PIL, scipy) | Blender's Python has only bpy, mathutils, numpy and the standard library | do that part in `$CZ_PYTHON` or with `tex_job { kind: 'sheet' }` instead |
| `make_picture`: Flow is not set up / not signed in | the member's Google Flow is not ready | tell the member in plain words: "Open Settings > Media > Image generation > Google Flow > Open Flow and sign in with your Google account in the window that opens. Then press the button again." Meanwhile dress the set from `prop_library` and draw the surfaces with `tex_job procedural` (`references/textures-without-flow.md`): never a bare set |
| `make_picture`: out of credits | Flow's free daily allowance is used up | tell the member; keep going with what is already made and code patterns; never use a paid service they did not choose |
| `make_picture`: policy block | Flow refused the words | retry once; then change the words (drop words like blood, weapon, gore, real names) |
| `make_picture`: timeout | Flow was slow | retry (3 tries). About 1 picture per 2 minutes is normal, with misses |
| `tex_job`: a raw picture is missing | the recipe names a picture not made yet | make it with `make_picture` into `assets/tex/raw/<name>.png`, or remove it from the recipe |
| `tex_job`: a bad recipe field | `recipes.json` is wrong at the key it names | fix that key (fields are explained in the script headers) |
| `tex_job` / `$CZ_PYTHON`: `No module named numpy` (or scipy, PIL) | the app's Python runtime is missing or damaged | the tool check fetches it again; tell the member "the app's Python is missing: let the tool check before the button fetch it again" if it does not. Never pip-install into a system Python |
| ffmpeg missing or fails | the app's ffmpeg is missing | the tool check fetches it; prefer `film_sheet` over your own ffmpeg calls |
| `node` not found in Bash | the app's node shim is not on PATH | use `"$CZ_NODE"`; prefer the suite tools over node scripts |
| disk full / write fails with ENOSPC | the disk is full (raw pictures are 70-90 MB per film, frames hundreds of MB) | delete only what you made and no longer need inside the project (old `.suite/` frames, unused raw pictures), then tell the member how much space is free and that more is needed |
| a tool says it is not available in this project | the project is not a cartoon project or the app is older | say so plainly; do the work with the tools you have |
| a usage limit / the session was cut | Claude's own limit | the step continues where it left off when run again: keep state in files (lessons, the contract, the priority list) |

## Retry rules
- Same error twice with the same input: change something (the words, the script, fewer frames) before the third try.
- A slow tool is not a broken tool: Flow and full sheets take minutes. Do other work of the step meanwhile.
- After any fix, run the check that failed again and look at the result before you move on.
- Write every failure and its fix in `lessons/<step>.md`.
