# FILM BIBLE — The Fourth Man on South Georgia
*(«الراجل الرابع في جورجيا الجنوبية» / «ظاهرة الرجل الثالث»)*

- **Format:** `fps: 30`, `size: [1080, 1920]` (9:16 vertical), `duration: 62.92 s` (`1,888 frames`)
- **Voice & Timing Law:** `audio/clean.wav` + `audio/clean.json` (20 spoken segments, phrase-level timing, 1 recorded silence pause at `12–13 s` between segments 6 and 7). Narrator voice (`who: null` on all 20 lines — no lip sync on characters, `captions: 'words'` displays the narrator text). All shot, acting, and prop times tie to `'line:N.start'` / `'line:N.end'` / offsets.
- **Scale Law:** `D = real metres × 1.6` (adult head top `2.6–2.8 D`; *James Caird* lifeboat `6.7 m = 10.7 D`; climbing rope `15 m = 24 D`; glacier terrain extends `25–120 D` behind faces). Places sit `400 D` apart along `X`, each in its own depth-writing sky dome (`depthWrite: true, renderOrder: -10`).
- **Standing Design Laws:**
  1. **THE FOURTH MAN RULE:** Felt only through traces — a 4th set of footprints in snow beside 3, an ownerless elongated shadow, an unlit mist-edge silhouette never centred/lit/faced, and a rope pulled taut toward an unseen 4th anchor. Zero visible 4th character anywhere.
  2. **MOVEMENT LAW:** Continuous physical motion in every beat — travelling walk cycles, wind-blown snow, pitching/rowing lifeboat, roped glacier descent, swinging adze, slamming screwed boot, flickering fire/lanterns, moving low camera on every shot. Zero static tableaux.
  3. **§7 CINEMATIC DIRECTION:** Frame 0 opens on Shackleton's expressive face mid-march (`head ≥ 300 px`); mandatory big close-ups on boot-sole screws biting ice, adze cutting glacier steps, taut rope over shoulder, hands gripping rope/ice, and four sets of footprints; light arc storm grey → cold blue → warm amber shelter & golden dawn landing.

---

## 1. Cast (Ready-Made Specs Only — Copied Verbatim from `cartoon/specs/`, 21 Specs)

| Role | Cast ID | Spec File | Owned Colour & Silhouette | Places Used (via `acts.<id>.place`) |
|---|---|---|---|---|
| **Ernest Shackleton** (lead) | `shackleton` | `cast/s4_skipper.json` | Stout, grey handlebar moustache, dark navy officer cap w/ gold, navy coat w/ 4 gold buttons | `GLACIER_MARCH`, `LIFEBOAT_SEA`, `GLACIER_CROSSING`, `SNOW_SLEEP`, `SHELTER_CONFESSION` |
| **Frank Worsley** (lead) | `worsley` | `cast/s4_lt.json` | Tall slim, dark moustache, white-crown officer cap, navy jacket w/ brass buttons | `GLACIER_MARCH`, `LIFEBOAT_SEA`, `GLACIER_CROSSING`, `SNOW_SLEEP`, `SHELTER_CONFESSION` |
| **Tom Crean** (lead) | `crean` | `cast/s4_big.json` | Tall wide, full black beard, navy beanie, dark pea coat | `GLACIER_MARCH`, `LIFEBOAT_SEA`, `GLACIER_CROSSING`, `SNOW_SLEEP`, `SHELTER_CONFESSION` |
| **Stranded Crew Pool (18 ready specs + 4 midground hooded camp figures = 22 men)** | `s4_navy`, `s4_chief`, `s4_cook`, `s4_kid`, `s4_wire`, `s4_smuggler`, `blind_gus`, `farmer`, `postman`, `townsperson`, `br_guy`, `proof_ray`, `blind5_mo`, `blind3_okafor`, `engineer`, `bouncer`, `walter`, `br_w1` | `cast/<id>.json` | Distinct coats, caps, beards, oilskins, scarves from tree specs | `ELEPHANT_ISLAND` (all 18); reused via `place` keys in `LANDING_VIGNETTES` (`br_guy` = climber, `s4_navy` = night-watch sailor, `proof_ray` = wreckage survivor) |

---

## 2. Places (7 Places, 400 D Apart, 25 D+ Depth, 2+ Practicals Each)

| Place ID | Anchor `[x, y, z]` | Real Thing & Scale (D) | Far End Behind Faces | Visible Practicals (2+) | Colour Mood & Air |
|---|---|---|---|---|---|
| `GLACIER_MARCH` | `[0, 0, 0]` | Unmapped South Georgia mountain pass; stepped snow ridge `18 D` wide flanked by jagged peaks `45–95 D` tall | `65–110 D` | 3 glowing brass cairn storm-lanterns along the ridge + bright cloud-break shafts | Storm grey-slate (`#6d7e92`), blowing snow streaks, heavy ridge haze |
| `LIFEBOAT_SEA` | `[400, 0, 0]` | Southern Ocean violent swells; open lifeboat *James Caird* (`10.7 D` long, `3.6 D` beam) pitching on waves | `55–90 D` | Brass bow storm-lantern + glowing helm binnacle lamp | Dark pelagic teal-grey (`#1c3645`), sea spray mist, cold sky sheen |
| `ELEPHANT_ISLAND` | `[800, 0, 0]` | Elephant Island frozen shingle beach; two overturned-boat shelters (`10.7 D` hulls), snowbanks, sea cliffs | `45–85 D` | Roaring driftwood signal campfire + 2 hanging camp storm-lanterns on oar poles | Cold overcast slate-blue (`#4a6074`) contrasted by warm amber campfire bounce |
| `GLACIER_CROSSING` | `[1200, 0, 0]` | High South Georgia glacier wall & gaping crevasse (`38 D` steep ice ramp, serac towers, macro close-up ice shelf) | `40–85 D` | 2 warm expedition ice-lanterns staked along the descent + high pale sun break | Crisp glacier cyan-white (`#89afc9`), fierce whiteout snow particles |
| `SNOW_SLEEP` | `[1600, 0, 0]` | Sheltered twilight snow hollow under an overhanging blue-ice cornice on the high ridge | `45–80 D` | Warm amber storm-lantern resting on a snow boulder + distant glacier beacon + moonlight disc | Deep twilight cold blue (`#233b5c`), drifting spindrift haze |
| `SHELTER_CONFESSION` | `[2000, 0, 0]` | Stromness whaling station timber hall (`16 D` wide × `38 D` deep), beamed ceiling, frosted storm windows | `32–36 D` | Glowing cast-iron pot-belly stove + 3 hanging brass oil lanterns receding down the hall | Warm amber-gold firelight (`#e89a42`) vs. cold blue storm seen through rear windows |
| `LANDING_VIGNETTES` | `[2400, 0, 0]` | Three-bay vignette stage (alpine ridge, night-watch helm deck, storm wreckage) + golden dawn ridge for title landing | `45–95 D` | Climber cairn lanterns; ship binnacle + deck lantern; rescue flare + beacon; dawn lanterns + sun | Cool twilight transitioning to warm amber-gold dawn sky (`#e6a85c` / `#2c4466`) |

---

## 3. Custom Story Props (`scenes/props/`)
- **`scenes/props/adze.js`**: 1916 carpenter's ice-cutting adze (`فأس`) with stained ash wood handle, forged steel socket, curved cutting blade, and hammer poll; origin at the grip. Carried by Shackleton on the march and crossing.
- **`scenes/props/pocket_watch.js`**: Brass expedition pocket watch with hinged lid, white Roman-numeral dial (`open: 0..1` keyable lid), and steel hands showing 5 minutes elapsed; origin at the grip. Used in Beat 4 (`SH16`).

*(Note: The §7 macro close-up rigs — taut braided rope over coat shoulder with gripping hands, swinging adze biting glacier ice with flying ice chips, and upturned heavy leather boot sole studded with 10 gleaming screws biting ice — live in `scenes/set.js` inside `GLACIER_CROSSING`'s macro zone so they are 100% pure-in-`t`, zero-pop, and immune to hand-rig occlusion.)*

---

## 4. Segment-by-Segment Bible (`clean.json` 1:1 — 20 Segments + 1 Pause)

| Seg | Time (s) | Spoken Text (Exact as Heard) | Beat & Place | Shot(s) | Lead Focus | Listeners / Background | Action Word & Tied Motion | Story Prop / Fourth Man Trace |
|---|---|---|---|---|---|---|---|---|
| 1 | `0–1` | سنة 1916، | B1 · `GLACIER_MARCH` | `SH01` | Shackleton (Frame 0 face ≥300 px) | Worsley, Crean roped behind | `1916`: `eyes: 'wide'`, `brow: 'knit'`, `mouth: 'tight'` (Frame 0), lean into wind | Climbing rope (`24 D`), `adze`, snow squall |
| 2 | `1–2` | إرنست شاكلتون | B1 · `GLACIER_MARCH` | `SH01` | Shackleton (tracking CU) | Worsley, Crean trudging | `شاكلتون`: `lean_over` into gale, stride | `adze` in hand:R, cairn lanterns behind |
| 3 | `2–4` | ماشي بقاله 36 ساعة | B1 · `GLACIER_MARCH` | `SH02` | Shackleton, Worsley, Crean | Rope team trudging `+Z` | `ماشي`: full travelling `walk` cycle | Taut hemp rope, `adze` |
| 4 | `4–7` | وسط جبال محدش في الدنيا رسملها خريطة. | B1 · `GLACIER_MARCH` | `SH03` | All 3 (establishing wide) | Unmapped peaks 65 D+ behind | `جبال`: `look` scans ridge ahead, `point` | Unmapped glacier peaks, cairn lights |
| 5 | `7–9` | وفجأة، بدأ يحس بحاجة غريبة. | B1 · `GLACIER_MARCH` | `SH04` | Shackleton (push-in CU) | Worsley, Crean behind | `وفجأة`: `eyes: 'wide'`, `brow: 'worried'`, `shock_pop` | Sudden eerie chill, wind gust |
| 6 | `9–12` | حاسس إن في راجل رابع ماشي جنبه. | B1 · `GLACIER_MARCH` | `SH05` | Footprints → Shackleton | Worsley, Crean marching | `رابع`: crane from 4th tracks to faces | **4th footprints**, ownerless shadow, mist-edge silhouette |
| — | `12–13` | *(recorded silence pause — no cut)* | B1 · `GLACIER_MARCH` | `SH05` (hold) | Rope team marching silently | Blowing snow & 4th trace | Hold march steadily through silence | 4th shadow & mist-edge silhouette persist |
| 7 | `13–16` | بعد 16 يوم في مركب نجاة وسط المحيط الجنوبي، | B2 · `LIFEBOAT_SEA` | `SH06` | Shackleton at helm | Worsley rowing, Crean bailing | `مركب`: boat pitches on swell, `brace` | *James Caird* (`10.7 D`), oars, brass lamps |
| 8 | `16–18` | كان قدامه هو وفرانك ورسلي وتوم كرين | B2 · `LIFEBOAT_SEA` | `SH07` | Shackleton, Worsley, Crean | Violent ocean behind | `ورسلي`/`كرين`: `lean_over` & `wince` in spray | Oars, bow lantern, helm lamp |
| 9 | `18–23` | طريق واحد بس عشان ينقذوا 22 راجل عالقين في آخر الدنيا على جزيرة الفيل: | B2 · `ELEPHANT_ISLAND` | `SH08`, `SH09` | Stranded crew (`s4_kid`, `s4_chief`, `blind_gus` + 19) | Overturned-hull camp, cliffs | `22 راجل`: `wave` & `hand_to_temple` by fire | Campfire, 2 overturned hulls, oar lanterns |
| 10 | `23–26` | إنهم يعدوا جبال جورجيا الجنوبية الجليدية على رجليهم، | B3 · `GLACIER_CROSSING` | `SH10` | All 3 on steep ice slope | Crevasse wall, blowing snow | `يعدوا`: roped `walk` & `lean_over` climb | Taut climbing rope, `adze`, crevasse wall |
| 11 | `26–30` | ومعهمش غير حبل وفأس ومسامير قلاووظ مثبتينها في نعل جزمهم. | B3 · `GLACIER_CROSSING` | `SH11`, `SH12`, `SH13` | **§7 MANDATORY CLOSE-UPS** | Ice & snow depth behind | `حبل` (SH11) / `فأس` (SH12) / `مسامير` (SH13) | **Rope on shoulder + hands**, **adze biting ice**, **boot sole screws biting ice** |
| 12 | `30–34` | من كتر التعب، ورسلي وكرين مقدروش يكملوا ووقعوا من النوم على التلج. | B4 · `SNOW_SLEEP` | `SH14`, `SH15` | Worsley & Crean collapsing | Shackleton watching over | `وقعوا`: `sit_down` / `kneel` + `eyes: 'blink'`/`wince` | Cold blue snow hollow, storm lantern |
| 13 | `34–36` | شاكلتون سابهم يناموا خمس دقايق بالظبط، | B4 · `SNOW_SLEEP` | `SH16` | Shackleton (tight CU) | Sleeping men below | `خمس دقايق`: `carry` open `pocket_watch` | `pocket_watch` (open), amber lantern bounce |
| 14 | `36–39` | ولما صحاهم، كدب عليهم وقالهم إنهم ناموا نص ساعة كاملة. | B4 · `SNOW_SLEEP` | `SH17` | Shackleton waking them | Worsley & Crean `stand_up` | `كدب`: `point` gentle wake + `mouth: 'smile'` kind lie | Lantern, cold blue glacier ridge |
| 15 | `39–44` | في الوقت ده، شاكلتون مكنش حكى لحد عن الراجل الرابع اللي كان حاسس بيه، | B5 · `SHELTER_CONFESSION` | `SH18`, `SH19` | Shackleton silent by stove | Worsley, Crean with mugs | `مكنش حكى`: `eyes: 'look_r'` guarded glance, `sip` | Iron stove, `mug`, lanterns, window mist silhouette |
| 16 | `44–47` | لحد ما ورسلي اعترف بعد كده إنه كان حاسس بنفس الإحساس، | B5 · `SHELTER_CONFESSION` | `SH20` | Worsley confessing (CU) | Shackleton snaps `wide`/`o` +2f | `اعترف`: `lean_over`, `talk_hands` | Warm lantern depth, stove glow |
| 17 | `47–49` | وكرين كمان أكد نفس الكلام. | B5 · `SHELTER_CONFESSION` | `SH21` | Crean confirming (CU) | Shackleton, Worsley reacting | `أكد`: `point` earnest confirmation, `lean_over` | Glowing stove, timber hall depth |
| 18 | `49–53` | التلاتة، كل واحد لوحده، كانوا حاسين بكيان رابع معاهم. | B5 · `SHELTER_CONFESSION` → `GLACIER_MARCH` | `SH22A`, `SH22B` | All 3 trading looks → memory tracks | Snow ridge memory | `كيان رابع`: `head_turn` mutual awe → tracks | **4th footprints** + **ownerless shadow** |
| 19 | `53–59` | مش بس هما؛ متسلقين وبحارة وناجين من كوارث كتير حكوا عن نفس الرفيق الخفي اللي محدش شافه، | B6 · `LANDING_VIGNETTES` | `SH23`, `SH24`, `SH25` | `br_guy` (climber), `s4_navy` (sailor), `proof_ray` (survivor) | Ridge, helm, wreckage | `متسلقين`/`بحارة`/`ناجين`: each halts + `look_r` / `shock_pop` | 2nd footprints, fog-rail trace, ownerless shadow |
| 20 | `59–63` | ظاهرة معروفة في علم النفس بـ "ظاهرة الرجل الثالث". | B6 · `GLACIER_MARCH` → `LANDING_VIGNETTES` | `SH26A`, `SH26B` | Shackleton calm awe → 4 footprints + title | Golden dawn glacier ridge | `ظاهرة الرجل الثالث`: `head_turn` → crane reveal | **4 sets of footprints** + **`ظاهرة الرجل الثالث`** title |