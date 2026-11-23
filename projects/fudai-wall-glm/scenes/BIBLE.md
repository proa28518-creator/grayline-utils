# BIBLE — Fudai Wall (Build pass, whole-job)

The film: a mayor builds a 15.5 m concrete seawall with a steel gate in front of his 3,000-person
fishing village, spends $30M and 12 years while every neighbouring village settles for 10 m walls.
The villagers mock him; he never answers and never lowers the wall one centimetre; he retires blamed
and dies with not one person believing him. 14 years after his death an earthquake pulls the sea back
and returns it as a wave exactly 15 m high — the measure of the biggest wave in memory, which he saw
swallow his village as a young man and read off old marks cut into a rock. The neighbours are erased
in minutes; the wave hits his wall and stops at its edge; the village survives whole, and the people
who laughed at him go to his grave on the hill to thank him.

- Format: `fps: 30`, `size: [1080, 1920]` (9:16). Film time = the voice's clock (`audio/clean.wav`, 68.08 s).
- Scale: D = real metres × 1.6. Wall/gate 15.5 m ≈ **24.8 D**; wave 15 m ≈ **24 D**; neighbours' walls
  10 m = **16 D**; adult ≈ 2.7 D tall, head ≈ 1 D.
- Law: `audio/clean.wav` + `audio/clean.json` are never touched; all 186 words go into lines **as heard**.
- Binding SHOT PLAN: `inputs/Fudai_Wall_Scene_Visualization_22_7j0z.txt` — followed scene for scene,
  segment for segment (§4 maps every shot to its segment).
- Captions: `captions: 'words'`. Sound design is the app's automatic system: this bible gives it clear
  actions on words and cuts on hits to land on; no mix or sound files are written.

## §1 Cast — cast from the ready set only (owner's instruction)

OWNER'S INSTRUCTION (2026-11-23 ~19:20 EET, verbatim: «مش هتبني بقى شخصيات بقى عندك الشخصيات الجاهزه»):
no new characters are built or designed. Every role below is cast from the tree's own built-in specs
(the ready-made characters with their outfits and rigs), used as they are. Therefore **no
`scenes/cast/<id>.json` files are authored** — the cast registry is this table plus the `cast:` block of
`scenes/film.js`. If the desk later wants a wardrobe delta (grey hair for the old mayor, black hair for
the young mayor), that is a one-file follow-up that needs the owner's ruling first; Build does not
design it.

| id | built-in spec | role | sentence (as cast) | home (place, at, ry) |
|---|---|---|---|---|
| mayor | `boss` | Mayor Wamura — the hero | suited municipal mayor, upright, calm fixed stare, one owned grey-blue suit | coast, [0.6, 0], ry 24 |
| v1 | `bouncer` | the lead mocker (loud fisherman) | big, loud, laughs full-mouth, points at the wall top then the sea | coast, [−3.5, −4], ry 42 |
| v2 | `postman` | villager (second mocker, board scene, quake runner) | lean, quick, smirks | coast, [2.8, −3.2], ry 50 |
| v3 | `chef` | villager (quake runner, grave visitor) | stocky, warm clothes | coast, [−1.8, 3.4], ry 35 |
| v4 | `ruby` | villager (quake runner, grave visitor with flowers) | bright owned colour, expressive | coast, [3.2, 2.6], ry 55 |
| v5 | `dotty` | villager (passer-by mocker, door wave, grave visitor) | older, shawled | coast, [−4.6, 1.2], ry 48 |
| v6 | `mara` | villager (passer-by mocker, pour worker) | wiry, points at the mocking sign | coast, [1.4, −5.2], ry 45 |
| walter | `walter` | the parent in the room analogy | broad, warm, pencil in hand | room, [1600.2, −3.4], ry 125 |
| pip | `pip` | the kid whose height is marked | small, hops, big eyes | room, [1600.8, −4.6], ry 10 |
| engineer | `engineer` | site foreman, leads the last-metre pour | work clothes, directs at the datum line | construction, [410, −14], ry 60 |

**The young mayor of the flashback is the SAME cast id (`mayor`) in another place/time**
(`acts.mayor.place` at `line:24.start` → rock), not a cast copy — exactly what the brief prefers, and
the only path the owner's no-new-characters instruction leaves open. The "young" read is carried by the
sepia place, the low warm sun and the acting; the hair colour is not changed (gap recorded in lessons).

The narrator (most lines) is `who: null` — no lip sync. Only the quoted mock is a spoken turn, and it
belongs to **v1** on screen (lines 9–10), per the shot plan's mocking Big Close-Up segment.

## §2 Places (each in its own dome and fog, 400 D apart, one `scenes/set.js`)

| place | origin (x, z) | the real thing | size in D | far end behind the faces | practicals (2+ visible, along the depth) | colour mood | air |
|---|---|---|---|---|---|---|---|
| coast | [0, 0] | the village square, two streets of wooden houses, the jetty, the 24.8 D grey seawall with the steel gate at the sea edge, mirror sea with a moored boat beyond | wall 24.8 D × 44 long; houses 4.5–5.5 D; gate opening 5 D wide × 8 D tall | street/lane runs to the municipal building 26 D+ behind the square; sea horizon 60 D+ past the wall | 3 hanging lanterns along street A, window glows on both rows, boat lamp, jetty post lamp | warm low golden sun against cool blue-violet shadow (the member's calm-scene light) | light warm haze from 8 D out; glittering mirror water |
| construction | [400, 0] | the site: 5 concrete columns + formwork + scaffold (the skeleton), crane with jib, mixer, pallets, rebar racks, site road and fence; the `wallrise` prop grows the concrete body | skeleton full height 24.8 D; wallbody grows 3 → 24.8 D | site road recedes 30 D+ to a gate fence | 2 tripod work lamps near the base, 2 floodlight masts down the road, crane beacon | dusty amber day, work-lamp orange | dust-heavy haze, denser than coast |
| neighbours | [800, 0] | three coastal village clusters, each behind a low 16 D wall; streets run inland | walls 16 D × 18; houses 4–5 D | each street recedes 28 D+ inland | street lamps per cluster, window glows | storm slate-blue even in daylight (they live under a gloomier sky) | cold haze, heavier than coast |
| rock | [1200, 0] | sepia flashback hilltop: the old rock with the carved tsunami mark, winding path, distant village below being swallowed by old waves | rock ≈ 4 D; path 25 D; mini village at −9 D elevation, 40 D out | path runs off the hill 25 D+; mini village + sea horizon beyond | 5–6 lit distant windows, a torch on a pole by the path, visible low sun disc | vintage sepia amber, low warm sun | warm thick sepia haze (memory air) |
| room | [1600, 0] | warm hall interior: the marks wall with the pencil height column, table and stool, doorway opening into a hall that recedes | wall 8 D tall; marks at 2.7 D (above pip's head) | doorway opens to a hall 26 D deep | window with warm shaft, hanging lamp over the table, lamp at the hall's far end | lamp-yellow warm interior | soft still interior haze |
| grave | [2000, 0] | hilltop graveyard overlooking the surviving village: the mayor's stone, 3 neighbour stones, balustrade, path down; below and beyond, the whole village and the 24.8 D wall with its gate | stone 2.2 D; drop to village −11 D; wall mini 24.8 D at ~72 D out | the view runs 70 D+ down to the village and wall | 2 grave lanterns flanking the path, 6 window lights in the village below, the dawn sun disc | gold-rose dawn (ending), blue-gold melancholy (scene 4 visit) | clear cool-to-warm dawn haze |

Anything in a place is in every shot of it: staged characters keep their positions per §3/§5, and every
prop listed in §5 is present (or legitimately hidden on a cut) in every shot of its place.

## §3 Lines — every word as heard (37 lines, 186 words)

Speaker turns split the lines; the mock quote goes to v1. Times are the word times of
`audio/clean.json` (0.10–67.55 s). "Action word" names the word the body action ties to; the face key
lands 0.1 s before the line start, the action one frame after the face, listener reactions 1–3 frames
after the trigger word (+0.07).

| N | time (s) | text (as heard) | who | on screen / listeners | beat | action (word) | story prop | place |
|---|---|---|---|---|---|---|---|---|
| 1 | 0.10–4.18 | بنى سور خرساني بطول عمارة خمس أدوار قدام قرية صيد صغيرة | null | mayor face (frame 0), wall looming behind | hook: the crazy height | mayor head_turn up (بطول) | stores overlay (1–5) fetches at t0, stows at cut | coast |
| 2 | 4.56–6.56 | والبحر قدامه هادي زي المراية | null | (no face: sea glide — plan's water glide) | the calm sea lies | camera glide only; boat lamp lit | — | coast (sea side) |
| 3 | 7.06–8.89 | كان عمدة لقرية فيها 3000 شخص بس | null | mayor centre of square, v1–v6 around | the small village, the big bet | mayor akimbo (عمدة); v1 smirk +0.07 (بس) | banner `3,000` fetches on the cut | coast |
| 4 | 9.04–11.70 | وصرف 30 مليون دولار و12 سنة بناء على بوابة | null | mayor at site; engineer in bg | the money and the years | mayor point at stacks (30) | money `$30M`, calendar (flip burst on و12), gate_build, wallrise h3, arrow155 climb 0→ | construction |
| 5 | 12.21–14.14 | ارتفاعها 15 متر ونص | null | mayor + skeleton + crane | the datum line | mayor head_turn up (ارتفاعها) | arrow155 completes 15.5M at line end | construction |
| 6 | 14.40–15.81 | مع إن كل القرى اللي حواليه | null | (aerial — no face) | the neighbours settled for less | camera pan only | sticker10 A/B fetch on cut | neighbours |
| 7 | 16.01–16.77 | اكتفت بسور 10 متر | null | (aerial — no face) | 10 metres, no more | camera pan only | stickers glow | neighbours |
| 8 | 17.28–18.73 | أهل القرية ضحكوا عليه وقالوا له: | null | v1 BCU laughing full-mouth | the mock begins | v1 lean_back laugh (ضحكوا) | — | coast |
| 9 | 18.73–19.90 | إنت بترمي فلوسنا في البحر؟ | **v1** (loud) | v1 BCU Dutch | throwing money into the sea | v1 point wall top (إنت) → point sea (البحر) | coins fetch+fall on فلوسنا, splash, stow at cut | coast |
| 10 | 20.34–21.62 | الموج عمره ما هيوصل هناك | **v1** | v1 tighter, reversed Dutch | the wave will never come | v1 wave off (هيوصل) | — | coast |
| 11 | 22.02–22.80 | بس العمدة ما ردش | null | mayor deadpan MCU push | he does not answer | mayor cold head_turn −5° (ردش); mouth shut | — | coast |
| 12 | 23.18–24.52 | ولا نزل السور سنتي واحد | null | mayor + v2 at the blueprint | not one centimetre | v2 point/pull the line (نزل); mayor ruler press (سنتي); v2 wince +0.1 | blueprint `pull` 1→0 snap; ruler in mayor's hand | coast |
| 13 | 25.09–27.72 | السور خلص والبحر فضل هادي سنين | null | wide wall+sea; mayor small | years pass, not one wave | sunmoon spins (time-lapse) | sunmoon fetch/stow on cuts | coast |
| 14 | 28.13–29.68 | والناس سموه أغبى مشروع في البلد | null | v5+v6 pass and laugh under the sign | "the stupidest project in the country" | v6 point at sign (أغبى); v5 laugh +0.07 (سموه) | sign `أغبى مشروع في البلد` fetches on cut, stows on cut | coast |
| 15 | 30.27–32.55 | العمدة طلع على المعاش وهو لسه بيتلام على الفلوس اللي ضاعت | null | mayor + box leaves the municipality; v2/v3 point blame behind | retired, still blamed | mayor carry box out (المعاش); v2+v3 point (بيتلام) | box fetches in hand on cut | coast |
| 16 | 33.04–33.26 | ومات | null | grave crane-up; stone revealed | he died | leaf begins to fall on ومات | gravestone fetches on cut; leaf falls | grave |
| 17 | 33.72–35.27 | من غير ما حد واحد يصدقه | null | grave wide; wall far below | nobody believed him | crane reveals the silent wall (يصدقه) | leaf lands by the stone | grave |
| 18 | 35.70–37.12 | بعد موته بـ 14 سنة | null | calendar close, pages fly | 14 more years | calendar flip burst 2 | calendar year → 14 | construction |
| 19 | 37.39–38.71 | الأرض اتهزت بزلزال عنيف | null | village street, violent shake | the earthquake | v2/v3/v4 terror faces −0.1, run on بزلزال; flock bursts up | stormclouds fetch on cut; swaypole sways; birds | coast |
| 20 | 39.28–40.67 | والبحر اتسحب لورا | null | high coastline glide | the sea pulls back | camera glide only | drybed (sand flat + stranded boat) fetches on cut | coast |
| 21 | 41.06–41.46 | ورجع | null | low beach, far horizon | and it returns | wave far out begins to rise | wave_c fetches on cut, rise 0.25 | coast |
| 22 | 41.87–42.63 | بموجة عملاقة | null | low beach, wave growing | as a giant wave | camera tilt begins | wave_c rise 0.75, advancing | coast |
| 23 | 42.86–44.81 | ارتفاعها 15 متر بالظبط | null | extreme low tilt-up the towering wave; v2/v4 sprint past fg | exactly 15 metres | v2/v4 run on متر; measure15 climbs | measure15 fetch on cut, completes بالظبط | coast |
| 24 | 45.45–47.79 | أصل العمدة وهو شاب | null | sepia flashback: young mayor on the hill | the memory begins | mayor turn −8° (شاب) | oldflood fetches on cut | rock |
| 25 | 46.60–47.79 | شاف البحر بيبلع قريته | null | young mayor 3/4, old waves swallow houses below | he saw the sea swallow his village | mayor lean_back horror (بيبلع) | oldflood slabs glow faint | rock |
| 26 | 48.36–49.70 | فافتكر علامات قديمة على الصخر | null | rock track close; hand reaches | he remembers the old marks | mayor point/reach to carve (الصخر) | carved mark (set) | rock |
| 27 | 49.91–51.61 | بتحدد أعلى نقطة وصلها الموج زمان | null | young mayor BCU, mark→sea→mark | the highest point the wave ever reached | mayor look mark→horizon; resolve face on زمان | — | rock |
| 28 | 52.11–53.60 | زي ما تحط شرطة بالقلم على الحيطة | null | room: walter draws above pip's head | like a pencil mark on a wall | walter point-draw up (شرطة); pip hop +0.1 | wallmark fetches on cut; pen in hand | room |
| 29 | 53.60–54.57 | عشان ما تنساش المقاس | null | room hold on mark + scrawl | so you never forget the measure | walter point writes beside (المقاس) | scrawl part of wallmark | room |
| 30 | 54.88–57.57 | هو بنى السور على مقاس أضخم موجة في الذاكرة | null | wall top edge (match-cut frame), pour, pull-back | he built to the biggest wave in memory | engineer point at datum (أضخم); wallbody rides up | wallrise → 24.8 (last metre 56.5–57.0); arrow155 lit; engineer+mara ride top | construction |
| 31 | 58.00–59.60 | القرى اللي حواليهم بأسوارها الـ 10 متر | null | aerial pan over the neighbours | the neighbours and their 10 m walls | camera pan only | wave_n rises over the 16 D walls; stickers lit | neighbours |
| 32 | 59.60–61.12 | اتمسحت في دقايق | null | closer aerial: streets swallowed | erased in minutes | camera push on دقايق | floodwater in → 1 | neighbours |
| 33 | 61.56–62.62 | والموجة خبطت في سوره | null | side profile: the wave slams HIS wall | the wave hits his wall | camera shake 3 on خبطت; impact snap | wave_c adv snap at impact (61.99+0.1) | coast |
| 34 | 63.04–63.69 | ووقفت عند حافته | null | side profile: crest flush with the edge, freeze | and stopped at its edge | wave crest plateaus; shake settles | wave_c holds at the edge exactly | coast |
| 35 | 64.49–65.22 | القرية كلها نجت | null | crane over the wall: village whole, sun shaft | the whole village survived | v5 waves from a door (نجت) | stormclouds part on the cut at 64.19 | coast |
| 36 | 65.75–66.62 | والناس اللي ضحكوا عليه | null | grave: v1/v3/v4/v5 walk in with flowers | the people who laughed at him | v1 sad face −0.1, walk in | flowers fetch in hands on cut | grave |
| 37 | 66.96–67.55 | راحوا قبره يشكروه | null | grave pull-back: flowers laid, bow, wall far behind | they went to his grave to thank him | v1 put_down (راحوا); all lean_over bow (يشكروه) | flowers laid at the stone base | grave |

Lines with no character on screen (2, 6, 7, 16, 17, 20, 21, 22, 31, 32) are carried by the shot plan's
camera moves and props; every line with a face has face key + action + listener reactions as listed.

## §4 Shot plan — 30 shots, mapped to the member's 7 scenes segment for segment

Cut law: every cut 1.55–2.91 s, on a line start or an action; no face key/clip start/turn within 3
frames of a cut; each shot a clearly different angle or size; camera low on talking shots (chest–eyes,
slight up), always moving; Dutch 1–5° on most; aerials are the member's own plan direction (his plan
asks aerial pans/glides — kept, talking shots stay low).

| # | t0 → t1 (word-tied) | dur s | place | camera (move, distance → head px) | plan segment |
|---|---|---|---|---|---|
| 1 | 0 → line1.word7.end (2.73) | 2.73 | coast | path: frame 0 mayor face low (d 12.5 → **~333 px**, expressive), tilt-up beside him to the wall top; stores overlay alongside | S1 tilt-up 00.00–02.60 (reconciled: frame 0 = face, not ground) |
| 2 | → line2.start (4.56) | 1.83 | coast | pull-back+up from the square: village shrinks to miniatures against the wall (d 22 → 189 px) | S1 wide crane pull-back 02.60–04.18 |
| 3 | → line3.start (7.06) | 2.50 | coast | low glide across the mirror water, boat passes, wall reflection | S1 water glide 04.56–06.56 |
| 4 | → line4.start (9.04) | 1.98 | coast | drift pan on the square: mayor centre, crowd, banner `3,000` (d 13.2 → 316 px) | S2 medium-wide village pan 07.06–08.89 |
| 5 | → line4.word9 (11.70) | 2.66 | construction | glide past money stacks + flipping calendar, site opens (wide end d 11.8 → 352 px) | S2 construction time-lapse glide 09.04–14.14 |
| 6 | → line6.start (14.40) | 2.70 | construction | rise along the skeleton face with arrow155 climbing to 15.5M | S2 time-lapse glide (cont.) |
| 7 | → line8.start (17.28) | 2.88 | neighbours | high lateral pan along the coast: 16 D walls, `10M` stickers | S2 split comparison aerial pan 14.40–16.77 (realised as cut juxtaposition against shot 6's 15.5M — see §7) |
| 8 | → line9.end (19.90) | 2.62 | coast | BCU v1 Dutch +4°, d 10.6 → 392 px; point wall top → sea; coins fall | S3 Big Close-Up 17.28–21.62 |
| 9 | → line10.end (21.62) | 1.72 | coast | BCU v1 tighter, Dutch −3° reversed, d 9.9 → 422 px; wave-off | S3 BCU (cont.) |
| 10 | → line12.start (23.18) | 1.56 | coast | slow push MCU mayor deadpan, d 11.3 → 368 px | S3 deadpan push 22.02–23.18 (starts on the cut, rides L11) |
| 11 | → line13.start (25.09) | 1.91 | coast | blueprint insert: board + two hands, faces 356→403 px; pull→pin | S3 tight blueprint insert 23.18–24.52 |
| 12 | → line13.word6.end (27.72) | 2.63 | coast | wide wall+sea, sunmoon time-lapse wheel, not one wave | S4 time-lapse sky cycle 25.09–27.72 |
| 13 | → line15.start (30.27) | 2.55 | coast | comic push: sign `أغبى مشروع` over the wall, v5/v6 pass laughing (d 11.4 → 363 px) | S4 quick comic push-in 28.13–29.68 |
| 14 | → line16.start (33.04) | 2.77 | coast | lateral track: mayor + box leaves, blame fingers behind (d 10.0 → 416 px) | S4 slow lateral tracking 30.27–32.55 |
| 15 | → line18.start (35.70) | 2.66 | grave | gentle crane up: stone, leaf falls, village+wall far below (wide d 20 → ~208 px) | S4 gentle crane up 33.04–35.27 |
| 16 | → line19.start (37.39) | 1.69 | construction | close on the abandoned site calendar, pages fly to 14, storm clouds arrive (d 2.2 insert) | S5 fast calendar flip 35.70–37.12 |
| 17 | → line20.start (39.28) | 1.89 | coast | street shake (shake 2.5), runners cross, birds burst, pole sways (d 8–9) | S5 heavy camera shake 37.39–38.71 |
| 18 | → line21.start (41.06) | 1.78 | coast | high coastline glide over the pulled-back sea, stranded boat | S5 high-angle coastline glide 39.28–40.67 |
| 19 | → line23.start (42.86) | 1.80 | coast | low beach: the sea returns far out, wave rising (d 12 → faces on later shots) | S5 wall of water 41.06–44.81 (a) |
| 20 | → line24.start (45.45) | 2.59 | coast | extreme low tilt-up the 24 D wave, measure15 climbs to 15M; runners cross fg | S5 wall of water (b) |
| 21 | → line26.start (48.36) | 2.91 | rock | sepia glide: young mayor 3/4 on the hill, old flood below (d 10.4 → 399 px) | S6 vintage sepia glide 45.45–47.79 |
| 22 | → line27.start (49.91) | 1.55 | rock | track along the carved mark; his hand reaches in from frame right (head kept out of frame — insert) | S6 close tracking along rock 48.36–49.61 |
| 23 | → line28.start (52.11) | 2.20 | rock | young mayor BCU d 11.1→9.9 (375→420 px); look mark→sea→mark, dawning→resolve | S6 (cont.) 49.91–51.61 |
| 24 | → line30.start (54.88) | 2.77 | room | push from establishing (d 17 → 245 px) to medium (d 12 → 347 px): pencil line above pip's head | S6 clean cutaway 52.11–54.57 |
| 25 | → line30.word9.end (57.57) | 2.69 | construction | match-cut frame: wall top edge centred where the pencil mark was; pour; pull back+up to skeleton+arrow | S6 match-cut dissolve 54.88–57.57 (hard cut at Build; dissolve is a later-pass refinement) |
| 26 | → line31.end (59.60) | 2.03 | neighbours | aerial pan: wave_n overtops the 16 D walls, stickers lit | S7 aerial pan over neighbours 58.00–59.60 (starts 0.43 s early on the wave action) |
| 27 | → line33.start (61.56) | 1.96 | neighbours | closer aerial push: streets swallowed whole | S7 aerial (cont.) 59.60–61.12 |
| 28 | → line34.end+0.5 (64.19) | 2.63 | coast | dramatic side profile: wave slams (impact snap + shake 3 on خبطت), crest climbs flush with the edge and freezes (hold 0.5 s) | S7 dramatic side profile + impact 61.56–63.69 + stop hold |
| 29 | → line36.start (65.75) | 1.56 | coast | crane over the wall top (y 27, 1 D+ clearance): village whole under the sun shaft | S7 smooth crane reveal over the wall 64.49–65.22 |
| 30 | → line37.end+0.5 (68.05) | 2.30 | grave | slow emotional pull-back: flowers laid, bow, the giant wall far in the background (d 10.1 → 411 px) | S7 slow emotional pull-back 65.75–67.55; instant feel kept via endHold 0.2 |

Head-px law: frame 0 ≈ 333 px; talking/acting heads 300–430 px (BCUs to ~422); one establishing wide
per place 180–250 px (shots 2, 5, 7, 15, 21, 24, 26); inserts (calendar, blueprint) are props-first by
design with faces kept legal.

## §5 Props registry (one owner on every frame; appears/stows on cuts or fetch/stow keys; no drop keys)

| id | kind file | owner | appears → leaves | print & state |
|---|---|---|---|---|
| gate_coast | props/gate.js | world | visible from t0 (set-integrated) | steel leaf + rivets + wheel + plaque `15.5 م`; closed |
| gate_build | props/gate.js | world | fetch 9.04 | same gate seated in the skeleton base |
| stores_ov | props/measure.js (stores) | world | t0 → stow 2.73 | transparent 5-storey overlay, digits 1–5, glow |
| arrow155 | props/measure.js (arrow) | world | fetch 9.04, stays | glowing arrow + `15.5M`; climb 0→1 (9.04→14.14), lit at the pour |
| sticker10A / sticker10B | props/measure.js (sticker) | world | fetch 14.40, stays | white plate `10M`, slight tilt |
| banner3000 | props/sign.js (banner) | world | fetch 7.06 → stow 17.28 | cloth `3,000`, sway |
| sign_mock | props/sign.js (plank) | world | fetch 27.72 → stow 30.27 | burned letters `أغبى مشروع في البلد`, ropes to wall top |
| money30 | props/money.js | world | fetch 9.04, stays (site) | 3 note stacks + coins + floating tag `$30M` |
| cal12 | props/calendar.js | world | fetch 9.04, stays | flip bursts (12y at و12; 14y at 35.70), year print swaps 12→14 |
| blueprint_bp | props/blueprint.js | world | visible from t0 (easel at the square edge) | title strip, gate outline, dimension `15.5م`, red height line; `pull` 1→0 snap at سنتي |
| ruler_r | props/ruler.js | mayor hand:L | fetch 23.18 → stow 27.72 | graduated straightedge |
| gravestone_g | props/gravestone.js | world | fetch 33.04, stays | name plate `العمدة وامورا`, wave+wall relief, flowers cup |
| drybed_d | props/drybed.js | world | fetch 39.28 → stow 42.86 | sand flat + stranded tilted boat + wet rocks |
| wave_n | props/wave.js | world | fetch 57.57 | curved wall of water, foam lip; rise→1, adv→14 |
| flood_n | props/floodwater.js | world | fetch 57.57 | translucent flood slab over streets; in→1 by 60.74 |
| wave_c | props/wave.js | world | fetch 41.06 | rise 0.25→1; adv→21.6 with impact snap at 61.99+0.1; freezes flush at the edge |
| measure15 | props/measure.js (line) | world | fetch 42.86 → stow 45.45 | glow line + `15M بالظبط`; climb completes at بالظبط |
| coins_d | props/debris.js (coins) | world | fetch 19.17 (فلوسنا) → stow 19.90 | 4 gold coins fall in stagger, vanish at the sea |
| leaf_d | props/debris.js (leaf) | world | fetch 33.04 → stow 35.70 | one amber leaf, slow fall, sway |
| flock_d | props/debris.js (flock) | world | fetch 38.05 → stow 39.28 | 5 birds burst up and away |
| sunmoon_s | props/sunmoon.js | world | fetch 25.09 → stow 27.72 | sun/moon wheel, spin 0→2.4 (time-lapse) |
| storm_s | props/stormclouds.js | world | fetch 37.39; `part` 1 on the 64.19 cut | 3 dark cloud layers + rain streaks; part opens the sun shaft |
| storm_s2 | props/stormclouds.js | world | fetch 35.70 → stow 37.39 | same over the site for the calendar flip |
| sway_p | props/swaypole.js | world | fetch 37.39 → stow 45.45 | lamp post with quake sway bursts |
| mark_r | props/wallmark.js | world | fetch 52.11, stays | fresh pencil line + measure scrawl above faint old marks (set) |
| oldflood_o | props/oldflood.js | world | fetch 45.45, stays | grey old-wave slabs over the distant mini village |
| box_b | built-in `box` | mayor hand:R | fetch 30.27 → stow 45.45 (same cut as place→rock) | his personal box |
| pen_p | built-in `pen` | walter hand:R | fetch 52.11 | pencil |
| flowers_v1 | built-in `flowers` | v1 hand:R | fetch 65.75; put_down on screen at راحوا | bouquet laid at the stone base |
| flowers_v4 | built-in `flowers` | v4 hand:L | fetch 65.75, carried through the bow | bouquet held |

Hand-over rule check: no hand-over occurs in this story; `handovers: []`. Every arm move has an end
(`hold`+`out`, a later clip on the same arm, or a put_down). No prop hides itself; no prop appears in a
hand inside a shot except via fetch keys on cuts/words as documented.

## §6 Colour script (the member's light, per scene)

1. S1–S2 (0–16.77): warm low golden sun, cool blue-violet shadows; mirror sea; construction dust amber.
2. S3 (17.28–24.52): same warm village light; BCU contrast up; blueprint insert cooler.
3. S4 (25.09–35.27): time-lapse wheel; sign beat comic-warm; retirement colder; grave blue-gold melancholy.
4. S5 (35.70–44.81): storm grey-blue (stormclouds), heavy air; the wave deep teal-blue with white lip.
5. S6 (45.45–57.57): sepia amber memory; room lamp-yellow; back to site dust with the datum glowing.
6. S7 (58.00–67.55): storm slate over the neighbours; the wall fight in storm light; gold-rose dawn breaks
   over the surviving village and the grave.

## §7 Reconciliations and named deviations (all decided here, nothing silent)

1. **Frame 0 vs tilt-up:** the plan's scene 1 tilt starts beside the mayor; the style's frame-0 law wants a
   readable expressive face ≥300 px. Reconciled: frame 0 is the mayor's face at d 12.5 (~333 px), camera
   low at chest–eye height (the "ground origin" read comes from the low camera), and the tilt-up rises from
   that same shot along the wall. Never ground, never wall alone, never his back.
2. **Split comparison (S2):** places sit 400 D apart in separate domes, so one frame cannot hold both walls.
   The comparison is realised as the cut juxtaposition shot 6 (15.5M datum glowing on the full-height
   skeleton) → shot 7 (16 D walls with `10M` stickers), same lateral pan move. Recorded, not silent.
3. **Wall rise:** a static set cannot grow, so construction carries a `wallrise` concrete body that grows by
   opts keys (3 → 24.8 D, last metre at 56.5–57.0) inside a full-height scaffold skeleton — the member's
   "rises gradually" is honoured truthfully and the 54.88 pour happens at the real top edge.
4. **Mayor ageing / young mayor hair:** cast from ready specs only (owner's instruction); age reads come from
   gait, the box, staging and light. Hair-colour deltas need an owner ruling; recorded as a gap, not done.
5. **Storm sky:** the coast dome is fixed calm-warm in Build; the storm arrives via the stormclouds props on
   cuts (37.39 / 35.70) and parts for the sun shaft (64.19). A true per-place storm dome is Environment's to
   build; recorded in the HANDOVER.
6. **Match-cut dissolve (54.88):** Build uses the hard cut with matched frame centre (pencil mark → wall top
   edge); the dissolve itself belongs to a later camera/post refinement. Recorded.
7. **Loop ending:** the member wants an instant cut on the last word with no outro; the app ends
   automatically 0.5 s after the last word — `endHold: 0.2` shortens the tail toward the loop feel.
8. **Loud on line 9:** the member's text carries `؟` (no `!`), so the shout is set by `loud: true` on the
   line, not by editing the as-heard text. The text is never touched.

## §8 Sound/caption notes for the app's automatic design

Actions land on words for the sound layer to ride: coins fall on فلوسنا (splash at the sea), quake jolt on
بزلزال with the pole sway and bird burst, sea pull on لورا, wave rise on ورجع/بموجة, measure completion on
بالظبط, calendar bursts on و12 and بعد موته, wall slam snap on خبطت (+0.1), freeze on حافته, clouds part on
the 64.19 cut, flowers touch the stone on راحوا. Cuts sit on hits: 2.73 (reveal), 19.90 (splash end),
37.39 (quake), 61.56 (slam approach), 64.19 (freeze→relief). Captions: `captions: 'words'` — one or two
big bold words per beat, the style's designed caption layer.
