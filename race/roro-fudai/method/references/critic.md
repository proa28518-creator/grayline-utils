# The critic loop: you never grade your own work

Your own checks pass things a fresh critic rejects at first look. So every pass ends with critic rounds: a NEW agent that never saw
your reasoning looks at your frames next to the bar, answers in a fixed form, and you fix the one biggest gap it names. Then a
new critic verifies. The checks (`film_check`, `film_probe`, PROP GUARD) are the floor; the critic is how you get from the floor
to the bar.

## When
| stage | critic rounds on |
|---|---|
| Build | 1. the OPENING (0 to the end of the first shot) as soon as it is staged and lit, before the rest of the film is acted: the first face, the depth behind it, the light; 2. the whole film at the end of the pass |
| Camera angles | the whole film at the end (strips of the fast moves go in the picture set) |
| Environment overhaul | each place when its tracks have landed, then the whole film at the end |
| Add post processing | the whole film at the end, one picture per place at least |
| Shading pass | the whole film at the end, faces of every place |
The director (Berserk or the member) reviews between passes as well; that never replaces your critic rounds.

## A round, step by step
1. **The pictures.** Render the moments the critic must see at full size: `render_frames` at `scale: 1` on the opening frame, one
   moment per place, every moment this pass changed most, and any moment the last report named (6 to 10 pictures; the files land
   in `.suite/frames/<batch>/`, the newest folder). Strips of fast moves come from `film_sheet { strip }` (`.suite/review/`).
2. **Blind mix.** Take the same number of bar pictures: the bar tiles of this pass's pages (`references/guide/INDEX.md` lists them,
   in `references/guide/tiles/`) and stills from `references/bar/*.jpg`. Make every picture, yours and the bar's, the same size so
   size and shape give nothing away: `"$CZ_FFMPEG" -y -i <in> -vf "scale=600:800:force_original_aspect_ratio=increase,crop=600:800"
   <out>.jpg` (the guide tiles already are 600x800). Put them into `.suite/critic/r<N>/` under neutral names `p01.jpg`, `p02.jpg`
   ... in a shuffled order. Write which is which into `.suite/critic/r<N>.key.txt`. The critic never reads the key, your lessons, your notes
   or this conversation. A crop hides the frame's edges: put the full frames (`render_frames` at `scale: 1`) next to the crops when
   the round is about framing, and say so in the brief. On a wide (16:9) project the crops hide the shape too; the blind score
   still counts.
3. **Start the critic** (one helper agent, in the foreground, a new one every round) with the brief below, filled in. In the
   Environment overhaul the crew has a named `critic` agent for this; in the other passes start a general helper.
4. **Read its answer.** Save it as `.suite/critic/r<N>.report.md`. Count how many of the bar pictures it took for yours and how
   many of yours it took for the bar: write both numbers in your lessons (the blind score).
5. **Fix only the BIGGEST GAP**, at its cause, radically (one cause, one change, so the next round shows what it did). A BLOCKING
   fault the critic marks as a one-line fix (a cropped face, a jumping prop, a frame inside a head) may ride along.
6. **Next round** with a NEW critic: the same moments again plus anything the fix touched, and the last report, so it can say
   what is fixed.
7. **The pass is done** when its step file's exit list is true AND a critic answers `VERDICT: YES` with no BLOCKING fault.
**The same fault twice:** when a new critic names the same fault after your fix, the fix was the wrong kind: change the method,
not the amount (geometry or a modelled piece instead of a texture, a real light instead of a brighter grade, another camera
position instead of a nudge, a new sprite or Blender piece instead of a decal). Never answer a critic by turning an effect down
until it is gone, by cutting a beat, a character or a set piece, or by loosening a number.
**Faster builds on** (the request says so): one critic round at the end of the pass; fix every BLOCKING fault it names.

## The critic's brief (paste it, filled in, as the helper's whole prompt)
```
You are the CRITIC of one pass of a 3D cartoon short (Creatorize, 3D Cartoon Shorts (New)). You never write or edit a file and
never build anything: you look and judge, and you are hard to please. The bar: a stranger watching on a phone would not guess a
tool made it.
Open EVERY picture in <project>/.suite/critic/r<N>/ with Read. Some are frames from the bar films, some are from the film under
review; you are not told which. Judge every picture on its own against the rules below.
THE PASS: <Build | Camera angles | Environment overhaul | Add post processing | Shading pass>, its job: <one line from SKILL.md>.
RULES FOR THIS PASS: <paste the step file's "Exit" list and the six look questions of references/review.md>.
DO NOT FAULT (outside this pass's job): <for example, in Camera angles: the set's detail, the post, the shading>.
THE LAST REPORT: <paste it, or "none">.
Answer in exactly this form, nothing else:
VERDICT: YES | NO
BIGGEST GAP: <one sentence: what, in which picture, what the bar pictures show instead>
FAULTS (at most 5, ranked by how much fixing each lifts the film):
1. BLOCKING | MINOR  p<NN>  <the fault in one sentence>  <a number against the bar: "head 180 px, bar 300-430 px",
   "far end about 3 D behind the faces, bar 25 D+", "faces flat white, no shadow colour">  FIX: <one concrete change>
LAST REPORT: <each of its faults: fixed | not fixed | worse>
WHICH ARE THE FILM'S: <the picture ids you think come from the film under review>
BLOCKING = a viewer would see a tool made it, or a hard rule breaks: no face in the first frame, a frame inside a head or wall,
a back on a speaker, a face cut by the edge, a flat white or mud face, a wall a metre behind the faces, a prop that jumps, an
empty or flat set, a character that does not move on its line. MINOR = below the bar, the shot still reads.
```

## The helper contract (any agent you start: a part builder, a track of the environment crew, a critic)
Every brief carries, in this order:
1. **The goal** of its part in one or two sentences, and the feel.
2. **The bar:** "read `references/quality-bar.md`, open the stills in `references/bar/` and the guide pages of this pass
   (`references/guide/`, named in the step file), and compare your result with them at full size before you report".
3. **What must hold** (the pass's "What must hold"), **the files it owns** (one writer per file) and the files it must never touch.
4. **Its tools** and `references/tools-sop.md` for failures.
5. **Its exit:** the numbers and checks its part must pass before it reports, and "nothing leaves you below the bar: a target
   you cannot reach is reported with the reason, never skipped".
6. **Its report:** what it made, the files, the numbers it reached, what is still below the bar (worst first), and any change it
   needs in a file that is not its own.
Never in a brief: a clock, "keep it quick", "good enough", "a complete set on time beats a perfect one", "if there is time".
When the member turned on Faster builds, say so in the brief and pass on the FASTER BUILDS block word for word.
