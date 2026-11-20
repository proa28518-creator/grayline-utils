# Story 5 «المصعد المفتوح» — Consult notes: spectacle-design layer

Parallel consults run 2026-11-20 (same brief to all three models: shot list per
line, 3 dazzle key frames at board scale 360×640, expression beats on the rig
vocabularies, door-reveal transitions, static-killers — Three.js primitives
only, no ExtrudeGeometry, no cylinder arc args).

Models: **Opus 5.5** (LLMsRelay, `claude-opus-5-5`) — answered in full.
**Luna** (APInex `free/gpt-6-luna`) — answered in full.
**GLM** (APInex `free/glm-5.3`) — **FAILED**: HTTP 402, "This model is
currently available only with a subscription" (billing_error). No GLM notes.

---

## OPUS 5.5 — spectacle direction

### Shot list (reframe every 1.5–2.5 s; 28 moves total, avg 2.17 s)
- **L1–4 (0:00–7.59):** low-angle push-in on the door, rising floor→eye level
  over 2 s → cut to wide establishing orbit, 120° arc right around Farida +
  lobby over 3 s → push-in to medium on her face + bag arm, settling on the
  pained expression.
- **L5–8 (7.59–14.02):** slow dolly sideways left following her walk to the
  panel, ending on her finger hovering over the button → 1.35 s held beat
  (anticipation, allowed) → push-in THROUGH the opening door; camera enters
  the elevator and rotates 180° to face outward: same lobby.
- **L9–13 (14.02–22.93):** handheld bob (±0.3 units, 0.2 s intervals) on her
  confused face → overhead crane down 8→3 units over her hand frantically
  hitting buttons → pull-back from close-up to full body as the lobby
  "greets her coldly" → aggressive 1 s push-in to the door as it closes.
- **L14–19 (23.90–33.62):** door opens, camera pushes through into the rain
  street (2.5 s), ending in a street medium → slow pan right across wet
  asphalt, reflections, cars in BG, ending on her silhouette in the doorway
  → push-in to close-up of her hand reaching, fingers entering the rain
  curtain → dolly forward WITH her step, camera crosses the threshold.
- **L20–23 (33.62–40.80):** snap cut inside, door slam — shake + quick
  pull-back → camera tilts ±15° alternating every 0.4 s (elevator lurching)
  → spin orbit 270° around Farida clutching the bag, accelerating, floor
  numbers blurred in FG.
- **L24–28 (42.93–50.20):** door opens, slow 2.7 s push into black void →
  explosive pull-back + crane up revealing the star field expanding 360°,
  Farida tiny in center → slow tilt down onto the void where the floor was,
  her feet at frame top.
- **L29–34 (50.20–60.76):** push-in to extreme close-up, her eyes flicking
  bag→stars→bag → pull-back to medium as she shifts weight (pre-jump) →
  1 s static hold on the jump (designed pause) → camera follows her flight:
  spiraling orbit rising 12 units over 3.3 s, stars streaking past → final
  crane up + pull-back, she shrinks to a dot among infinite stars.

### 3 key frames (board scale)
- **A — 0:12.54 (L7, same lobby):** symmetrical split — left half elevator
  interior (her back), right half identical lobby; yellow lamp dead-center
  top as the axis; her silhouette black against yellow-lit marble. The
  doubling reads instantly at thumbnail size.
- **B — 0:29.84 (L17, reaching into the rain):** rule of thirds — Farida in
  the right third in warm elevator amber, left two-thirds rain street in
  cyan; her arm crosses the threshold, hand silhouetted against car-headlight
  streaks. Warm/cool color split + diagonal rain + horizontal reflections.
- **C — 0:56.26 (L32, flying):** Farida small, center-bottom third, arms
  wide, bag RELEASED and falling below frame; stars in 3 scale layers (huge
  soft spheres FG, sharp medium MG, tiny dots BG), deep blue→black gradient;
  she is backlit by one bright star (rim light) so the silhouette pops.

### Expression beats (eyes / brow / mouth / pose)
- L1 (0:00): wide / quizzical / flat / hand_to_temple — confusion at the door
- L3 (4.97): wince / down / tight / akimbo with bag arm low — bag pain
- L5 (10.43): stare / on / flat / finger extending — determination
- L7 (12.54): wide / up / o / shock_pop — same-lobby realization
- L9 (16.25): angry / knit / grid / brace leaning into panel — frustration
- L12 (21.89): sad / worried / frown / lean_back — defeated retreat
- L14 (23.90): wide / up / o / shock_pop — rain reveal
- L17 (29.84): half / on / wide-smile / wave re-purposed as reaching forward
- L19 (33.62): wince / down / tight / wince — slam recoil
- L22 (39.17): pinpoint / knit / gulp / brace clutching bag — terror
- L25 (45.61): wide / up / o / shock_pop — awe at space
- L28 (50.20): stare / quizzical / flat / gaze down-up — weighing the choice
- L30 (53.78): half / on / frown / akimbo resigned shrug — acceptance
- L31 (55.29): wide / up / wide / lean_back pre-jump — decision joy
- L33 (57.82): wide / up / wide / both arms up 45° — flight euphoria

### Door reveals
- **(a) Lobby→same lobby (11.35–12.54, 36 f):** two IDENTICAL lobby sets
  8 units apart; the elevator box slides back 8 units as the door opens,
  carrying the camera; door opens over 30 f; camera's 180° turn runs over
  16 f from frame 20. Set A lamps at 80% brightness, Set B at 100% — the
  slight bump feels "too perfect". At 0:12.54 all Set B lamps flicker
  together (3 f on/off/on) on the first syllable of L7.
- **(b) Lobby→rain street (23.90–26.41, 75 f):** door opens onto black for
  5 f, then the rain layer fades in (vertical semi-transparent white box
  strips falling); street = dark plane + scale-pulsing white-cylinder
  puddles (0.8–1.2), cars = box+cylinder with emissive headlight spheres,
  reflections = inverted translucent duplicates of the light sources. Color
  cross-fade over frames 15–35: lobby amber 0xFFD700 → street cyan-teal
  0x1A4D5E. Camera pushes 6 units through the door over 75 f; blue rim
  SpotLight (0x00BFFF) fades in behind Farida at frame 20. First rain SFX
  hits at frame 10 — sound leads the eye.
- **(c) Street→space (42.93–47.82, 147 f):** 300 emissive spheres
  (r 0.3–0.8, white→0x4169E1) spawn at center and rush outward with
  exponential radial acceleration, scaling 1→4 over 60 f — stars don't
  appear, they streak past. Fog density fades 0.001→0.0001 over frames
  30–90. Floor plane fades to full transparency over the first 15 f. All
  lights snap to cool white 0xCCE0FF at frame 20; single blue rim
  (0x87CEEB) from below as starlight. ALL ambient sound cuts at frame 40
  (0:45.26), 0.35 s before L26 «سكون تام» — the audio dropout IS the reveal.

### Static-killers
- **Dead lobby:** keep 6 things moving — lamps pulsing 0.8–1.0 on a 2 s
  cycle with staggered phases; fake scrolling reflection on the marble;
  3 dust-mote spheres in slow Brownian drift; button-panel emissive
  breathing 0.5–0.7; her idle root sway ±2° on a 3 s cycle; bag pendulum
  swing when she shifts weight.
- **Rain = grey mush:** 80 rain strips (0.1×6 units), fall speeds randomized
  4–7 u/s; 4 headlight pairs at 2 / 3.5 / 5 / 6.5 u/s looping; puddle pulse
  synced to each car pass; 2 fading white splash cylinders per car at the
  wheel position.
- **Button-mashing unclear (L9):** overhead crane shot makes the panel the
  hero: 12 buttons (4×3 cylinder grid), each emissive, lighting sequentially
  at 6 fps (every 5 f), yellow→red flash per press; her hand moves in a
  frantic circle, 9 presses over 2 s.
- **Shake feels cheap (L20):** 5 layers — camera shake ±0.4 units XY + ±8°
  rotation at 8 Hz, random seed, non-looping; elevator box counter-rotates
  ±5°; floor-number cylinder spins 360° in 1.2 s with 12 pre-rendered
  numbers swapped every 3 f (motion blur illusion); her root shakes ±3°
  out of phase; bag swings ±15° at 4 Hz.
- **Flight = boring float:** velocity 2 u/s accelerating to 8 u/s by
  0:57; spiral path (orbit radius 0→4 units while rising 12 units over
  3.3 s); 3 star layers parallaxing at 1× / 0.4× / 0.1× her speed; trail of
  20 fading spheres/s behind her (white→blue); the bag falls away at
  0:56.5, tumbling 90°/s on all axes, out of frame bottom by 0:57.2 —
  freedom made literal.
- **Faces too small to read:** "reaction flash" motif — on an expression
  beat, if her face is <15% of frame height, cut 0.3–0.5 s to a close-up
  (face 40% of frame), hold, cut back. Max 5 flashes (L7, L12, L19, L25,
  L31) so it stays a motif, not a crutch.

---

## LUNA (free/gpt-6-luna) — spectacle direction

### Shot list (frame-exact at 30 fps; hard rule: no shot over 75 f without a reframe)
- L1 (f7–60): push-in, wide lobby — Farida center-left, bag in right hand,
  doors center.
- L2 (f60–150): pull-back + crane-down to low angle; marble reflection,
  ceiling-lamp halo.
- L3 (f150–228): dolly sideways 12 units; medium close-up — right arm down,
  bag low, wrist wince.
- L4 (f228–313): tilt up to ceiling lamps, then tilt down to marble filling
  the bottom of frame.
- L5 (f313–340): fast push-in to close-up on the finger hitting the panel.
- L6 (f340–376): pull-back; door gap widening, Farida centered.
- L7–8 (f376–421): static zoom-out — same lobby inside, composition
  IDENTICAL to the opening wide. Then (f421–457) rapid dolly-in to extreme
  close-up of her eyes staring at the identical lobby.
- L9 (f457–549): pan down over the panel; finger jabs down 12 buttons, each
  0.2 s apart.
- L10 (f549–576): pull-back to wide; doors still open, lobby unchanged.
- L11 (f576–657): slow 90° orbit arc as she turns; doors frame her like a
  portrait.
- L12 (f657–688): dolly backward; Farida retreats 8 units toward camera.
- L13 (f688–717): fast push-in; door panels closing to a center slit.
- L14 (f717–792): pull-back + light shift; rain street fills the frame,
  blue-grey replaces warm yellow.
- L15 (f792–833): tilt down; asphalt fills 2/3 of frame, neon reflections
  sliding.
- L16 (f833–895): pan left→right; water sprays from under primitive cars,
  droplets as spheres.
- L17 (f895–944): push-in to medium; both hands up, palms open to the rain.
- L18 (f944–1009): slight pull-back; smile forms; right foot steps forward
  2 units.
- L19 (f1009–1059): whip pan / slam; the door fills the whole frame, closing
  to a black slit.
- L20 (f1059–1116): shake + dolly sideways; camera rattles ±0.5 units X,
  car shifts on Y.
- L21 (f1116–1175): orbit + tilt up; floor-number disk spinning behind her,
  numbers blurred.
- L22 (f1175–1224): push-in close-up; both hands clutching the bag,
  knuckles white.
- L23 (f1224–1288): quick zoom-in; chest close-up, a heart shape pulses out
  of the torso.
- L24 (f1288–1334): hold wide, then push; door gap a third time, black void
  beyond.
- L25 (f1334–1368): fast pull-back; star field expands, elevator interior
  disappears.
- L26 (f1368–1435): slow 180° orbit arc around Farida in open space; stars
  as distant spheres.
- L27 (f1435–1506): crane down; floor tilts away, Farida floating center,
  bag dangling.
- L28 (f1506–1576): cut to medium; eyes track bag (left), then stars
  (right).
- L29 (f1576–1613): push-in close-up; face center, lips forming silent
  words.
- L30 (f1613–1659): hold close-up; resigned half-smile.
- L31 (f1659–1688): crane up + pull-back; legs bend, then extend upward.
- L32 (f1688–1735): follow camera upward; Farida flies diagonally up-right,
  stars streak past.
- L33 (f1735–1786): slow pull-back; tiny figure center, vast star field.
- L34 (f1786–1823): hold / fade out; final silhouette against the brightest
  star cluster.

### 3 key frames (board scale)
- **A — 0:12.54 (L7):** symmetrical wide, camera dead-center on the open
  doors; Farida just inside, back to camera, facing an identical lobby; two
  marble floors meet at the threshold like a mirror. Reads as one vertical
  door-seam line splitting two identical warm-yellow rectangles with a small
  dark figure centered.
- **B — 0:33.62 (L19):** extreme close-up of door metal filling 90% of the
  frame; Farida's smiling face in the lower-left corner, hand mid-step. A
  dark horizontal band (the door) slams across the top, a small bright smile
  below it — joy vs impact reads without audio.
- **C — 0:57.82 (L33):** tiny silhouette center-bottom, arms loose, bag
  floating BESIDE her; 80% of the frame is star field with one bright
  cluster top-right. Two dots (head, bag) against a speckled black field —
  lightness reads instantly.

### Expression beats (rig vocab only)
- L2: stare / worried / flat / akimbo — weary stance
- L3: wince / down / tight / brace — bag pain
- L5: wide / up / o / akimbo — press surprise
- L7: stare / worried / flat / akimbo — uncanny recognition
- L9: wide / knit / tight / brace — frantic mashing
- L10: half / down / frown / akimbo — defeat
- L14: wide / up / o / shock_pop — rain gasp
- L18: wide / up / wide / akimbo — smile + step
- L19: wince / down / tight / brace — slam impact
- L22: stare / knit / gulp / brace — gripping with both hands
- L24: wide / up / o / shock_pop — third opening
- L28: stare / worried / flat / hand_to_temple — bag-vs-stars dilemma
- L30: half / down / frown / akimbo — resigned confession
- L32: wide / up / wide / akimbo — flight joy
- L34: wide / up / wide / akimbo — final freedom

### Door reveals
- **(a) Same lobby:** duplicate set beyond the doors (same boxes, lamps,
  marble tiles); light IDENTICAL warm yellow #F5C85A both sides — no color
  shift. Trick: the floor-tile grid continues seamlessly across the
  threshold (match-cut), and Farida's world position changes by 0 units;
  the lack of parallax sells "hasn't moved a centimeter". Camera: pull-back
  then rapid zoom-out so both lobbies align in one continuous visual.
- **(b) Rain street (22.93–23.90):** doors close fully, reopen onto the
  street (big asphalt box, cylinder cars, box buildings). Farida keeps the
  exact same world position; only the world beyond the door changes.
  Camera pulls back 10 units as the doors open; light shifts warm yellow →
  cool blue-grey #4A6FA5. Rain = cylinder emitter above the street spawning
  small spheres at 60 Hz; spray under cars = vertically stretched boxes
  scaled down per frame.
- **(c) Open space (42.93–44.48):** the third opening reveals a star box —
  a large box interior with inward-facing star spheres and dark ambient;
  street box and floor plane removed at the cut. Camera pulls back fast
  15 units so the elevator walls fall away, leaving her floating. All
  lobby/street lights drop to zero; stars are the only light sources (weak
  point lights). Ground deletion lands at L27 (47.82): the floor box is
  simply removed from the scene graph while she stays at the same Y — she
  falls into nothing without moving.

### Static-killers
- **Static camera:** hard cut or move every 45–75 frames; no shot exceeds
  75 f without a reframe.
- **Weightless bag:** parent the bag to her right hand with a 0.15 s spring
  lag; at L22 lock it to her chest with a slight downward drag on the rig.
- **Doors feel like slides:** ease-out open reaching full in 12 f (0.4 s),
  then hold; slams close in 8 f (0.27 s) with a camera-shake impulse.
- **Flat rain street:** vary spray-cylinder heights per frame (sinusoidal
  noise ±0.3 units); buildings at varied depths; reflective planes on the
  asphalt scrolling a noise-texture offset per frame.
- **Empty space:** 200 spheres at random depths, distant stars 0.05 units,
  near stars 0.4 units; star intensity breathes on a slow sine (0.8–1.2).
- **Face lags the voice:** switch eyes/brow/mouth on the EXACT frame of
  each line start, hold for the line's duration, then blend over 6 f to
  the next line's expression.

---

## Desk synthesis (points the two answering models converge on)

- **Key frame A is settled:** the same-lobby reveal at 0:12.54 (L7) —
  symmetrical composition split by the door seam, identical warm-yellow
  lobby on both sides, Farida's dark silhouette centered, back to camera.
- **Key frame C is settled:** the flight at ~0:56–58 — a tiny backlit
  silhouette against a layered star field, the bag released/floating free
  beside or below her.
- **Key frame B is contested:** Opus picks L17 (0:29.84, hand reaching into
  the rain, warm/cool color split); Luna picks L19 (0:33.62, door-slam
  close-up over her smile). Desk call needed; both are buildable.
- **Expression spine is agreed** on the load-bearing beats: L3 wince/down/
  tight (bag pain), L14 + L24 wide/up/o + shock_pop (reveals), L19
  wince/down/tight (slam), L22 knit + gulp + brace (terror grip), L30 half
  + frown (resignation), flight wide/up/wide.
- **Reveal mechanics agree in structure:** (a) a duplicate identical lobby
  set with zero position change for Farida; (b) a warm→cool color-temperature
  flip with Farida pinned in place; (c) floor/ground removal + an emissive
  sphere star field as the only light.
- **Camera cadence agrees:** reframe every ~1.5–2.5 s (Opus: 28 moves,
  2.17 s average; Luna: hard 75-frame cap per shot).
- **Shared static-killers:** continuous micro-animation in every set, the
  bag given real weight (pendulum / spring lag / released at the jump),
  layered star parallax, and expression switches landing exactly on line
  starts.

---

## GLM (free/glm-5.3-flashx via APInex — added 2026-11-20 ~03:10 at the owner's pointer; the base free/glm-5.3 id is subscription-gated, flashx answers at zero cost)

Shot list, one move per line, reframing every 1.6–2.2 s:

1 [0.22] Lobby wide, slow truck right past elevator doors  
2 [2.03] Dolly in to Farida center frame  
3 [4.97] Low angle on her heavy arm and leather bag  
4 [7.59] Static close-up on yellow lamp, then quick whip pan to marble  
5 [10.43] Over-the-shoulder as finger hits button  
6 [11.35] Push in on parting elevator doors  
7 [12.54] Static medium shot: identical lobby behind doors  
8 [14.02] Slow zoom out as she stares  
9 [16.25] Handheld jittery pan across all buttons  
10 [18.30] Close-up on finger pressing, nothing happens  
11 [19.21] Medium wide, elevator shakes slightly  
12 [21.89] Dolly back as she steps away  
13 [22.93] Tight on doors sliding shut  
14 [23.90] Doors split open to rain street, static shock reveal  
15 [26.41] Tracking shot along wet asphalt reflections  
16 [27.76] Low angle: water spraying from under cars  
17 [29.84] Over-the-shoulder as hand touches rain  
18 [31.48] Push in on her face as she smiles  
19 [33.62] Fast whip pan as doors slam shut  
20 [35.30] Dutch angle, camera shakes as elevator moves sideways  
21 [37.19] POV of floor numbers spinning like roulette  
22 [39.17] Medium close-up, bag clutched to chest  
23 [40.80] Extreme close-up on her hand against chest  
24 [42.93] Static center shot as doors open third time  
25 [44.48] Sudden pull-back into open space  
26 [45.61] Wide static: stars everywhere, total silence  
27 [47.82] Camera tilts down to show vanishing ground  
28 [50.20] Over-the-shoulder: bag then stars  
29 [52.53] Close-up on her face talking to herself  
30 [53.78] Static medium shot  
31 [55.29] Low angle as she jumps  
32 [56.26] Follow cam as she flies among stars  
33 [57.82] Push in on first light  
34 [59.53] Fade to black on empty elevator

Key frames for 360x640 boards:

1. Frame at [23.90]: elevator doors split to rain-drowned street, light reflecting on asphalt, Farida framed in dark doorway.  
2. Frame at [44.48]: doors open onto open space, stars everywhere, ground vanished beneath her.  
3. Frame at [56.26]: Farida flying among stars, first light hitting her face, leather bag floating.

Expression beats mapped to lines:

- [4.97]: eyes sad, brow worried, mouth frown, pose lean_back  
- [7.59]: eyes wide, brow up, mouth o  
- [12.54]: eyes stare, brow down, mouth flat  
- [19.21]: eyes wince, brow knit, mouth tight, pose brace  
- [23.90]: eyes wide, brow up, mouth wide  
- [29.84]: eyes half, brow on, mouth flat  
- [31.48]: eyes wide, brow up, mouth wide  
- [39.17]: eyes stare, brow worried, mouth flat, pose akimbo  
- [40.80]: eyes wide, brow knit, mouth gulp, pose brace  
- [53.78]: eyes sad, brow worried, mouth flat  
- [55.29]: eyes wide, brow up, mouth wide, pose shock_pop  
- [56.26]: eyes stare, brow up, mouth o

Stage the three door reveals:

Lobby -> same lobby [11.35-12.54]: doors open on a static, identical medium shot of the lobby. No camera move. Match the lighting and marble exactly so the loop feels like a glitch.

Lobby -> rain street [22.93-23.90]: close-up on doors shutting, then a hard cut or fast whip to doors splitting open onto rain. Street is brighter and cooler toned. Water spraying from under cars adds particle movement.

Street -> space [42.93-44.48]: static center shot of doors opening third time. Sudden pull-back camera move reveals open space and stars. Cut all interior lobby audio to total silence.

Biggest static-feel risks and fixes:

- Same lobby repeat [7.59-19.21]: kill it with handheld jitter on buttons, subtle elevator shake, and changing her expression from wide to stare to wince.  
- Dialogue heavy section [29.84-53.78]: kill it with continuous camera moves—push in, tilt down, over-the-shoulder switches—never hold a static medium shot longer than 1.5 s.  
- Zero gravity float [44.48-56.26]: kill static feel with floating bag, drifting particles, and follow camera rather than locking her in center.

You're talking to GLM, created by Zhipu AI.