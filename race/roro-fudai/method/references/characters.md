# Characters: specs, faces, wardrobe, acting

The characters are the heart of the style. 2.5D cartoon people: round white heads, bold ink outline, stick limbs, egg torsos,
faces made of curves that snap between drawings. One JSON spec each. Deep reference: `api/BODY_API.md`, `api/WARDROBE_API.md`,
`api/FACE_API.md`, `api/MOTION_API.md`.

## Casting a new voice
1. Read the words (`narration`, or `audio/clean.json`). Decide who says each line. Lines nobody in the scene says are the narrator
   (`who: null`): no lip sync, the captions still show them. A story told in the first person usually has the teller on screen.
2. One character per speaking role, plus only the extras the story needs (each extra is in every shot of that place).
3. Give each a sentence (age, build, clothes, one owned colour, one thing that tells them apart), then turn it into a spec with the
   table below. Lead characters get 3-6 torso details, extras 1-3.
4. Stage them for faces before you write any acting: where each stands, which way they cheat to the camera, who is in which place.

## A character from a sentence
Start from the closest built-in spec in `specs/` (engineer, boss, mara, walter, pip, nurse, chef, dotty, postman, ruby, bouncer and
more: list the folder) and write `scenes/cast/<id>.json`. Read the sentence in this order:
| words | key | value |
|---|---|---|
| slim, lanky / average / stout, chubby / curvy | `torso.body` | `{ build: 'slim', W: .60-.72 }`, `medium` .75-.87, `stout` .90-1.0, `curvy` |
| kid / teen | `torso.body.build: 'kid'` + `limbs.legLen` .72, `armLen` .62 / teen legLen ~1.08 | never scale the head |
| tall / short | `limbs.legLen` 1.42-1.45 / 1.1-1.15 | always write `legLen` and `armLen` (.9-1.0) |
| shirt, blouse, jumper, vest, jacket, coat | `torso.outfit.layers[]` innermost first | `{ t: 'shirt', color: '#hex' }` |
| apron, tie, bowtie, scarf, belt, buttons, pocket, suspenders | after the garment they sit on | colours always `'#hex'` |
| stripes, tartan, tweed, dots | `pattern` on one garment | one pattern per character |
| skirt, dress | `torso.outfit.skirt` | `{ color, length: 'knee' \| 'ankle', shape: 'aline' \| 'bell' }` |
| trousers, jeans | `torso.outfit.trousers` | the band colour (`'#3f5a86'` jeans) |
| hair | `hair` | `{ style: bald, bald_sides, receding, short, side_part, curly, bob, long, bun, ponytail, pigtails, messy, spiky, colour }` |
| beard, moustache | `facialHair` | `{ kind: full, goatee, stubble, moustache, walrus, handlebar, mutton, colour, scale }` (full beard scale .66-.8) |
| glasses | `glasses` | `{ kind: round, square, half, sun, cateye, oval }` |
| hat | `hat` | `{ kind: ballcap, flatcap, beanie, headscarf, strawhat, chef, bowler, tophat, officer, headband, none }`. No hat = `'none'` |
| big eyes, heavy brows | `face` | `eyeSize` .97-1.04, `browThick` 1.3-1.5 on a lead |
Then the unsaid things: no two main characters share hat type AND colour, one strong owned colour each, 3-6 torso details for a lead,
1-3 for crowd. Never noses, ears, fingers, skin tones, a bigger or smaller head, gloves, boots. Under a hat use short hair.
Check a new character with `render_frames` on a frame where it faces the camera and one at 3/4: silhouette tells him apart, face
and glasses on the head, beard inside the outline, no hair above a hat.

## Faces (they snap, never tween)
`face` keys: `{ t, eyes, brow, mouth }` or `{ t, expr }`.
- eyes: `open smug half blink arc wide wince angry sad look_l look_r stare pinpoint`
- brow: `on off up down knit worried quizzical`
- mouth: `rest smile frown smirk D crescent grid o wide flat tight gulp` (+ visemes, automatic while talking)
- `expr` presets: `fear terror dread gulp confused relief hope dawning horror stare blank`. A preset key does not trigger the
  automatic body reaction: add `react: 'recoil'` or write the fields out.
Talking is automatic (lip sync, small mouth, brow on the stressed word). Listeners are automatic too: a blink, a brow or an eye swap
after each other speaker's line, and their pupils follow the speaker. Your face keys carry the story on top of that.
The engine holds each eye or brow state at least 8 frames. `{ eyes: 'arc', hold: true }` keeps a closed-eye smile.

## Acting per line (the heart of it)
For every line, the speaker AND the listeners:
1. **Face first:** the speaker's expression at `line:N.start-0.1`; a listener's reaction 1-3 frames after the trigger word (`+0.07`).
2. **One body action per line, tied to a word**, one frame after the face (`+0.03`), then a dead still hold. Every arm move gets an
   end: `hold` (seconds) + `out` (frames back), the next clip on that arm, or a hand-over.
3. **Strong reactions:** a face key with new `wide` / `wince` / `angry` / `sad` eyes also moves the body 2 frames later (recoil, jolt,
   lean, slump). `react: false` for a deadpan beat.
4. **Look:** `look: [{ t, at: [x, headY, z] }]` at the other person but 2-3 D toward the camera from them, or the face turns to
   profile and vanishes. Look at the thing 1-3 frames before the reaction face. Keep low targets near eye height (y 1.3-1.6).

| the script says | clip (params) |
|---|---|
| hello, bye | `wave` (`side`, `eyes: 'arc'`) |
| angry, impatient | `akimbo` (`side: 'both'`) + an angry face |
| don't know | `shrug` |
| confused, oh no | `hand_to_temple` |
| there, you, offer, reach | `point` (`side`, `dir: [x, y, z]` body space, +X = his left; keep z <= .3) + `hold`, `out: 6` |
| surprise | `shock_pop` or `shock_jump` (`hold: .1, out: 5`) |
| pain, cringe | `wince` |
| excited | `hop_bounce` (camera still) |
| leans in / recoils | `lean_over` / `lean_back` |
| drinks / eats | `sip` / `eat` (the prop already in that hand) |
| picks up / puts down | `pick_up` / `put_down` (`prop`, `side`; stand within ~.75 D) |
| carries, shakes, signs | `carry`, `shake`, `sign` |
| grabs a collar | `grab_collar` (`target`, stand 1-1.2 D apart) |
| hits, knocks | `knock` (a hit frame the PROP GUARD allows) |
| glasses off / on | `glasses_lower`, `glasses_off`, `glasses_on` (spec glasses only) |
| turns, looks fast | `turn` (`by`), `head_turn` (`yaw`) |
| sits / stands | `sit_on` (a key, not a clip: walks to the seat and sits), `sit_down`, `stand_up` |
Talking hands: `talk_hands` (`dur` = the line) on one line in three at most.

## Walking, heights, places
- `walk: [{ t0, path: [[x, z], ...], speed, face, gait: 'run' }]`. speed ~1.3 stroll, 2.6 normal, 3.5+ brisk. Time a walk to END
  before the line that needs him. Exits in 3/4: never more than ~10 frames of a back.
- `height`: `[{ t: 0, y: 6 }, { t: 'line:1.word:3', y: 0, over: 2.2 }]` floats then sinks; `{ t, fall: 0 }` falls and lands;
  `legs: 'tread' | 'float' | 'climb'`. The world does not collide: build the deck at the height you write.
- `place: [{ t: 'line:5.start', at: [400, 1], ry: 70 }]` + a shot starting at the same time = he is elsewhere after the cut, prop in
  hand, no copy in the cast. A place key mid-shot is a teleport on screen.

## His laws (the motion)
On ones, no motion blur. Three speeds: face snaps (0 in-betweens), gestures 2-4 frames then stop, body moves ~10 frames with most
of it done by frame 4-5. Impacts stop dead. Holds are DEAD still: no breathing, no idle sway; life comes from the face and the
camera. Face first, body one frame later, head leading. No nods while talking.

## Staging for faces
The face draws only while the head is within ~95 degrees of the camera; past that only the back of the hair shows. Keep speakers
within 20-60 degrees. Two people talking: 1.5-1.8 D apart, both cheated 45-70 degrees toward the camera side. Never open on a
character from behind, even when the script says "her back turned": start her 3/4 and let it play in her eyes.
