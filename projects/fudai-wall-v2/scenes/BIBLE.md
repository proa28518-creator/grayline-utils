# FILM BIBLE — Fudai Wall (`fudai-rebuild-v2`)

**Format:** 9:16 vertical (`1080×1920`), `30 fps`, total voice duration `68.08 s` (`audio/clean.wav`, 186 words in `audio/clean.json`, 0.10–67.55 s).
**Scale:** `1 D = 0.625 m` (`D = metres × 1.6`). Adult head top ≈ `2.7 D`; door `2.0 m` = `3.2 D`; Fudai seawall & steel gate `15.5 m` = **`24.8 D`**; tsunami wave `15.0 m` = **`24.0 D`**; neighbouring villages' walls `10.0 m` = **`16.0 D`**.
**Captions:** `captions: 'words'` (1–2 big bold words per beat).
**Sound design:** Automatic (app-derived from cuts and word-tied actions; no mix/sound files authored here).

## 1. Frame 0 Reconciliation
The binding shot plan (`Fudai_Wall_Scene_Visualization_22_7j0z.txt`, Scene 1) opens with a low-angle vertical tilt-up starting beside Mayor Wamura. The `cartoon-shorts` hard rule requires Frame 0 to be a readable, expressive face (`head ≥ 300 px`), never an empty scene or a back.
- **Resolution:** Shot 1 (`t0: 0` to `'line:1.word:8'`, `0.00–2.73 s`) is a single `path` shot. At `t = 0`, the camera sits low at `[0.6, 2.05, 16.5]` (`fov: 26`), aimed at Mayor Wamura's face (`[0, 2.25, 6.0]`, cheated `ry: 20°`). Distance = `10.52 D` → head width ≈ **`395 px`** (`300–430 px` bar). Behind him, the `24.8 D` concrete seawall sits `30 D` back (`z = -24`) along a lit harbour lane. From `t = 0.55 s` to `2.73 s`, the same camera pulls back and tilts up to reveal the full 5-storey (`24.8 D`) seawall and transparent `storey5` overlay.

## 2. Cast (Built-in `specs/` Only — Per Owner Instruction)
No custom `scenes/cast/*.json` files are authored. All roles are cast directly from the ready-made `specs/` library named in `references/characters.md`. Mayor Wamura moves across places/eras via `acts.mayor.place` on cuts (no cast copy).

| Cast ID | Built-in `spec` | Role & Function | Owned Staging |
|---|---|---|---|
| `mayor` | `walter` | Mayor Kotoku Wamura (lead; calm, resolute; moves to `flashback` via `acts.mayor.place`) | `coast` (`[0, 6]`), `flashback` (`[400, 4]`), `coast` rim (`[0, -21]`, `y: 24.8`) |
| `villager1` | `bouncer` | Lead mocking fisherman (delivers quoted lines 8 & 9; later panicked in earthquake, bows at grave) | `coast` (`[1.6, 5.4]`), `hill_grave` (`[1598.4, 3.2]`) |
| `villager2` | `mara` | Mocking villager 2 (laughs under "dumb project" sign, flees wave, brings flowers to grave) | `coast` (`[-1.8, 5.2]`), `hill_grave` (`[1601.5, 3.0]`) |
| `villager3` | `postman` | Mocking villager 3 (points blaming at retiring mayor, flees wave, bows at grave) | `coast` (`[3.4, 4.2]`), `hill_grave` (`[1596.8, 4.4]`) |
| `villager4` | `dotty` | Village resident (village square crowd, earthquake shock, cheers survival, bows at grave) | `coast` (`[-3.2, 4.0]`), `hill_grave` (`[1603.0, 4.3]`) |
| `worker` | `engineer` | Construction engineer (builds gate in S2, tries to pull blueprint line down in S3, pours top rim in S6) | `coast` (`[-1.5, -16]`, then `[2.0, 5.6]` at blueprint table, then `[-1.8, -21]` on rim) |
| `child` | `pip` | Child in everyday height-mark analogy (S6 bedroom wall) | `analogy_room` (`[800.4, 2.2]`) |
| `parent` | `ruby` | Parent drawing pencil height mark above child's head (S6 bedroom wall) | `analogy_room` (`[798.8, 2.6]`) |

## 3. Places (400 D Apart — Each With Opaque Depth-Writing Dome, Fog & 2+ Practicals)

| Place ID | World Offset (`X`) | Real Thing & Key Dimensions (in D) | Far End Behind Faces | Visible Practicals (≥2) | Colour Mood | Air / Fog |
|---|---|---|---|---|---|---|
| `coast` | `X = 0` | Fudai fishing village, wooden cottages, harbour pier, city hall facade, `15.5 m` (`24.8 D`) concrete seawall + steel floodgate at `z = -24`, ocean extending to `z = -120` | `30–90 D` (looking along harbour lane to wall, or over wall to horizon) | 4 warm harbour streetlamps along lane (`z = 0, -8, -16, -22`), 2 red/amber floodgate warning beacons on wall top, lit cottage windows | Golden low sun (`#ffcf87`) vs cool blue-violet shadow (`#55689e`); stormy slate (`#5e7691`) at `t = 35.7–64.5 s`; golden sunbeams (`#ffd98e`) at `t ≥ 64.5 s` | Light coastal haze (`0.0055` day, thicker slate mist in storm) |
| `flashback` | `X = 400` | Vintage hillside overlooking old Fudai village & bay; ancient carved tsunami stone monument (`tsunami_rock`, `3.6 D` tall) with horizontal high-water chisel mark | `48 D` down coastal slope to flooded old houses & bay | Glowing shrine path lantern (`toro`), amber sunset disc, warm hearth windows in distant old village | Warm vintage sepia-amber (`#e6b97a`) with muted umber shadows (`#6b5344`) | Warm nostalgic dusk haze (`0.008`) |
| `analogy_room` | `X = 800` | Warm coastal family room (`10 D × 14 D`) with oak wainscoting, height-chart wall, open framed garden window looking `28 D` across sunlit yard & hills | `28 D` (interior corridor depth + open garden vista behind characters) | Brass floor lamp (warm `#ffcf85`), ceiling pendant globe, bright sunlit garden window | Warm cream & honey-oak (`#ffe0b2`) with soft sky-blue window fill (`#9eb8d9`) | Clean warm interior air (`0.004`) |
| `neighbors` | `X = 1200` | Neighbouring coastal fishing towns with `10 m` (`16 D`) seawalls, pier sheds, cottages, ocean bay with `15 m` (`24 D`) wave overtopping in S7 | `70 D` coastline sweep | Coastal lighthouse beacon, pier lamp posts, lit village cottage windows | Crisp coastal daylight (`#d8e8f5`) in S2; stormy dark slate (`#4d6478`) in S7 | Sea-spray mist (`0.006` day / `0.014` storm) |
| `hill_grave` | `X = 1600` | Quiet hilltop overlooking Fudai valley and distant `24.8 D` seawall; Mayor Wamura's carved stone `gravestone`, autumn/cherry tree with drifting leaves | `65 D` valley vista to distant seawall & ocean | 2 glowing stone path lanterns (`toro`) flanking grave path + low sun rays | Blue-gold melancholic twilight (`#9cb3d6` / `#e8b878`) in S4; warm golden sunrise (`#ffd48a`) in S7 | Soft valley haze (`0.0065`) |

## 4. Story Props (Built-in + Custom `scenes/props/<kind>.js`)
- **Built-in:** `box` (Mayor's retirement belongings in S4), `pen` (Parent's pencil in S6 analogy), `flowers` (Villagers' bouquets at grave in S7), `fishing_rod` (Harbour fisherman detail in S1/S2).
- **Custom (`scenes/props/`):**
  - `measure_sign.js` — Crisp canvas-printed story graphics (`storey5`, `pop3000`, `cost30m`, `height155`, `height10`, `wave15`, `dumb_sign`) using inner-group visibility so props never pop.
  - `blueprint_ruler.js` — Technical floodgate blueprint table with printed `15.5M` & `10M` elevation marks and interactive drafting ruler (`opts.locked`).
  - `calendar_flip.js` — Flipping wall/stand calendar (`opts.years`, `opts.flip`) for S2 (`12 سنة`) and S5 (`14 سنة`).
  - `money_stack.js` — Printed `$30M` cartoon cash stacks / gold coin bundle for S2 & S3.
  - `gravestone.js` — Carved stone memorial headstone (`WAMURA`) on plinth for S4 & S7.

## 5. Line-by-Line Acting & Binding Shot Table (All 186 Words, 28 Lines, 28 Shots)

| Line | Time (s) | Words | Speaker | Listeners | Place | Beat & Action Word | Story Prop | Shot & Camera (Binding Plan) |
|---|---|---|---|---|---|---|---|---|
| L1 | 0.10–4.18 | 11 | `null` | `mayor`, `villager4` | `coast` | Mayor resolute (`t=0`), points up on `عمارة` (w5); village revealed on `قدام` (w8) | `storey5`, `fishing_rod` | **S1** (`0–L1.w8`): Frame 0 CU on `mayor` (`395 px`) → low-angle vertical tilt-up to 5-storey wall; **S2** (`L1.w8–L2.start`): Wide crane pull-back over fishing village |
| L2 | 4.56–6.56 | 5 | `null` | `mayor` | `coast` | Mirror-calm sea & still boat; Mayor gazes calmly across water | `fishing_rod` | **S3** (`L2.start–L3.start`): Smooth glide across mirror-flat water past still boat |
| L3 | 7.06–8.89 | 7 | `null` | `mayor`, `villager1..4` | `coast` | Mayor in village square (`3,000` sign); waves gently on `عمدة` (w2) | `pop3000` | **S4** (`L3.start–L4.start`): Medium-wide village square pan (`mayor` centre, crowd around) |
| L4 | 9.04–12.05 | 9 | `null` | `mayor`, `worker` | `coast` | Cranes, `$30M` stacks, 12-year calendar flip; `worker` directs on `بناء` (w7) | `cost30m`, `money_stack`, `calendar_flip` | **S5** (`L4.start–L5.start`): Construction time-lapse glide along rising steel gate |
| L5 | 12.21–14.14 | 4 | `null` | `mayor`, `worker` | `coast` | Luminous `15.5M` measure arrow rises to gate crest; `mayor` points firm on `15` (w2) | `height155` | **S6** (`L5.start–L6.start`): Low tilt-up along rising `15.5M` measure gauge |
| L6 | 14.40–16.77 | 10 | `null` | `villager3` | `neighbors` | Neighbouring towns' `10M` walls look tiny next to Fudai's `15.5M` | `height10` | **S7** (`L6.start–L7.start`): Split comparison lateral pan along neighbouring `10M` coast |
| L7 | 17.28–18.73 | 6 | `null` | `villager1`, `villager2`, `mayor` | `coast` | Villagers burst out laughing on `ضحكوا` (w3) | `money_stack` | **S8** (`L7.start–L9.start`): Signature big CU (Dutch 5°) on `villager1` laughing & speaking L8 |
| L8 | 18.73–19.90 | 5 | `villager1` | `mayor`, `villager2` | `coast` | **Quoted:** `villager1` mocks & points at sea on `فلوسنا` (w3); `villager2` laughs | `money_stack` | *(continues S8 — lip sync on `villager1`)* |
| L9 | 20.34–21.62 | 5 | `villager1` | `mayor`, `villager2` | `coast` | **Quoted:** `villager1` points high at wall top on `هيوصل` (w4) | — | **S9** (`L9.start–L10.start`): Tighter angled CU on `villager1` + laughing `villager2` |
| L10 | 22.02–22.80 | 4 | `null` | `mayor` | `coast` | Mayor silent, deadpan, mouth closed, calm steady gaze | — | **S10** (`L10.start–L11.start`): Deadpan MCU slow push-in on `mayor` |
| L11 | 23.18–24.52 | 5 | `null` | `mayor`, `worker` | `coast` | `worker` reaches to lower blueprint line; `mayor` locks ruler firmly at `15.5M` on `نزل` (w2) | `blueprint_ruler` | **S11** (`L11.start–L12.start`): Tight blueprint insert (`blueprint_ruler` + hands) |
| L12 | 25.09–27.72 | 6 | `null` | `mayor` | `coast` | Wall finished; sun/moon time-lapse cycles rapidly over dead-calm sea | — | **S12** (`L12.start–L13.start`): Time-lapse sky cycle behind finished wall & calm Mayor |
| L13 | 28.13–29.68 | 6 | `null` | `villager2`, `villager3` | `coast` | Mocking wooden sign (`أغبى مشروع`) swings; villagers laugh & point on `أغبى` (w3) | `dumb_sign` | **S13** (`L13.start–L14.start`): Quick comic push-in on `dumb_sign` & laughing villagers |
| L14 | 30.27–32.55 | 11 | `null` | `mayor`, `villager1`, `villager3` | `coast` | Mayor exits city hall carrying `box`; villagers point blaming on `بيتلام` (w7) | `box` | **S14** (`L14.start–L15.start`): Slow lateral tracking shot following retiring Mayor |
| L15 | 33.04–35.27 | 7 | `null` | — | `hill_grave` | Quiet hilltop headstone overlooking distant silent wall; single leaf falls | `gravestone` | **S15** (`L15.start–L16.start`): Gentle crane-up in blue-gold melancholic light |
| L16 | 35.70–37.12 | 5 | `null` | `villager1` | `coast` | Calendar pages whip (`14 سنة`); sky turns stormy blue-grey | `calendar_flip` | **S16** (`L16.start–L17.start`): Fast calendar-flip push as storm darkens sky |
| L17 | 37.39–38.71 | 4 | `null` | `villager1`, `villager2`, `villager4` | `coast` | Violent quake; poles sway, birds scatter; villagers rush out in `terror` on `اتهزت` (w2) | — | **S17** (`L17.start–L18.start`): Heavy camera-shake street shot (`shake: 3`) |
| L18 | 39.28–40.67 | 3 | `null` | `villager1`, `villager2` | `coast` | Sea pulls far back leaving boats stranded on wet sand; villagers recoil | — | **S18** (`L18.start–L19.start`): High-angle coastline glide over retreating sea |
| L19 | 41.06–42.63 | 3 | `null` | `villager1`, `villager2`, `villager4` | `coast` | Giant dark water wall rises on horizon; villagers sprint uphill on `عملاقة` (w3) | — | **S19** (`L19.start–L20.start`): Extreme low-angle tilt-up on fleeing villagers + rising wave |
| L20 | 42.86–44.81 | 4 | `null` | `villager1` | `coast` | Luminous `15M` gauge climbs wave face and locks at `15M` on `بالظبط` (w4) | `wave15` | **S20** (`L20.start–L21.start`): Hero low-angle tilt-up tracking `15M` wave wall |
| L21 | 45.45–47.79 | 8 | `null` | `mayor` | `flashback` | Mayor (`place` → `flashback`) watches historical wave swallow old houses below | — | **S21** (`L21.start–L22.start`): Vintage sepia flashback glide beside Mayor on hill |
| L22 | 48.36–51.61 | 11 | `null` | `mayor` | `flashback` | Mayor leans in and traces ancient carved tsunami line on stone on `علامات` (w2) | — | **S22** (`L22.start–L23.start`): Close-up tracking along carved `tsunami_rock` + Mayor's hand |
| L23 | 52.11–54.57 | 11 | `null` | `parent`, `child` | `analogy_room` | `parent` uses `pen` to mark pencil height line on wall above `child` on `شرطة` (w4) | `pen` | **S23** (`L23.start–L24.start`): Clean cutaway medium shot on warm bedroom wall |
| L24 | 54.88–57.57 | 9 | `null` | `mayor`, `worker` | `coast` | Match-cut from wall pencil line to `15.5M` seawall top rim; `mayor` & `worker` lock top | `height155` | **S24** (`L24.start–L25.start`): Match-cut glide along top rim of `24.8 D` concrete wall |
| L25 | 58.00–61.12 | 10 | `null` | `villager3` | `neighbors` | `15M` wave overtops `10M` walls of neighbouring towns and floods them | `height10` | **S25** (`L25.start–L26.start`): Aerial pan over neighbouring `10M` towns overwhelmed |
| L26 | 61.56–63.69 | 7 | `null` | `villager1`, `villager2` | `coast` | `15M` wave slams `15.5M` steel gate (`shake: 3`), spray bursts, stops dead at lip on `ووقفت` (w5) | `height155` | **S26** (`L26.start–L27.start`): Dramatic side profile + impact shake at seawall crest |
| L27 | 64.49–65.22 | 3 | `null` | `villager1..4` | `coast` | Camera cranes over wall to reveal dry intact village under golden sunbeams; crowd cheers | — | **S27** (`L27.start–L28.start`): Smooth crane reveal over concrete crest into sunlit village |
| L28 | 65.75–67.55 | 7 | `null` | `villager1..4` | `hill_grave` | Same mockers from S3 stand humbled with `flowers`, bowing at `gravestone`; wall gleams in valley | `gravestone`, `flowers` | **S28** (`L28.start–end`): Slow emotional pull-back, hard loop cut at `68.08 s` |

## 6. Colour Script
1. **Act 1 — Calm & Mockery (0.00–30.27 s):** Warm low coastal golden sun (`#ffcf87`), mirror-sky azure (`#88bfe8`), cool blue-violet shadows (`#55689e`).
2. **Act 2 — Retirement & Passing (30.27–35.70 s):** Cooling late-afternoon blue-gold (`#9cb3d6` / `#e8b878`) on the quiet hillside.
3. **Act 3 — Quake & Tsunami (35.70–45.45 s):** Stormy slate blue-grey (`#5e7691`), dark indigo wave wall (`#163752`), stark white spray.
4. **Act 4 — Memory & Analogy (45.45–57.57 s):** Vintage sepia-amber (`#e6b97a`) in flashback → warm cozy bedroom cream/oak (`#ffe0b2`) → crisp concrete grey & sunlight at match-cut.
5. **Act 5 — Impact & Gratitude (58.00–68.08 s):** Stormy slate inundation at neighbours → dramatic sea-foam impact at Fudai → golden sunbeam breakthrough (`#ffd98e`) and warm sunrise (`#ffd48a`) at the hilltop grave.