# SEAT 2 — PROP / CAMERA VERIFICATION SHEET — Fudai rebuild (2026-11-22)

**Purpose:** make the prior run's two failures structurally impossible — D1 (props as object
map → boot crash) and D2 (cameras aimed at stale coordinates → empty probes, prop-truth 16/16
FAIL). Companion: `SEAT2_BUILD_CHECKLIST.md` §§1–2. Verdicts by **Seat 4** (looked-at zoom
crops) and **Seat 3** (critic); Seat 2 fills the build columns, Seat 4 the verdict columns.

## Verification law (no exceptions)
1. **No probe renders** until the D1 schema audit and the D2 zone/frustum audits (checklist §§1–2) pass.
2. Every camera target and every prop `at` names a **PLACES constant** (checklist §2). A bare literal in any cell below = sheet incomplete = build rejected.
3. A prop is **PASS only when Seat 4 has looked at its zoom crop in the actual probe still** and seen the prop inside the crop box. Code declarations are not evidence.
4. Crop boxes below are the recovered prior spec (`recovered/props_after_build_round1.json`), frame-normalised (x, y, w, h on the 1080×1920 frame). Probe times are set from the bible's shot windows and the owner's word timings (`audio/clean.json`).
5. Faces: close-up rows also record head height in px (frame 0 must be ≥ 300 px — run record Build exit) and the ~60°/not-edge-cut rule (RULES §4).
6. PROP GUARD continuity: the carried box gets three crops (pick-up / carry / put-down) — its screen position must move continuously, never jump (RULES §4).

**Columns:** Prop (id) · Place const · Probe t (s) · Zoom crop (x,y,w,h) · Camera target for that shot · Seat-4 look (PASS/FAIL) · Evidence (probe file).

---

## Scene 1 — the giant wall before the calm sea (0.10–6.56) · Place: COAST_WALL / COAST_VILLAGE / SEA
Shots: (a) vertical tilt-up, low angle, mayor's face → wall top (0.10–2.60) · (b) wide crane pull-back, village behind wall (2.60–4.18) · (c) glide across mirror water (4.56–6.56).

| Prop / face | Place | Probe t | Crop (x,y,w,h) | Camera target | Seat-4 | Evidence |
|---|---|---|---|---|---|---|
| Mayor face — FRAME 0, expressive, head ≥300 px | COAST_WALL | 0.10 | face row | PLACES.COAST_WALL + mayor offset | ☐ | |
| Giant concrete seawall + steel gate | COAST_WALL | 1.50 | 0.08,0.15,0.84,0.66 | PLACES.COAST_WALL (tilt-up axis) | ☐ | |
| Five-storey transparent height diagram (1–5) | COAST_WALL | 2.00 | 0.52,0.13,0.40,0.68 | PLACES.COAST_WALL + diagram offset | ☐ | |
| Fishing boat, still on mirror sea | SEA | 5.50 | from probe | PLACES.SEA (glide path) | ☐ | |

## Scene 2 — the bet, the numbers, the comparison (7.06–16.77) · Place: COAST_VILLAGE / construction / NEIGHBOR_COAST
Shots: (a) medium-wide village pan, mayor in square (7.06–8.89) · (b) construction time-lapse glide: cranes, money, calendar, rising gate, measuring arrow (9.04–14.14) · (c) split comparison aerial pan along the coast (14.40–16.77).

| Prop / face | Place | Probe t | Crop (x,y,w,h) | Camera target | Seat-4 | Evidence |
|---|---|---|---|---|---|---|
| 3,000 population sign | COAST_VILLAGE | 8.00 | 0.12,0.28,0.58,0.25 | PLACES.COAST_VILLAGE (square) | ☐ | |
| $30M money sign / piles | COAST_WALL | 11.00 | 0.19,0.52,0.56,0.22 | PLACES.COAST_WALL (build face) | ☐ | |
| 12-years calendar (flipping) | COAST_WALL | 11.50 | 0.25,0.49,0.50,0.28 | PLACES.COAST_WALL (build face) | ☐ | |
| 15.5M gate measuring line / arrow at full height | COAST_WALL | 13.80 | 0.48,0.24,0.43,0.48 | PLACES.COAST_WALL (gate axis) | ☐ | |
| Neighbour 10M seawall (labelled 10M) | NEIGHBOR_COAST | 15.80 | 0.08,0.24,0.84,0.55 | PLACES.NEIGHBOR_COAST | ☐ | |

## Scene 3 — mockery vs silence (17.28–24.52) · Place: COAST_VILLAGE
Shots: (a) signature big close-up, laughing villager, Dutch 5° (17.28–21.62) · (b) deadpan mayor MCU, slow push-in (22.02–23.18) · (c) tight blueprint insert, hand pins the ruler at 15.5M (23.18–24.52).

| Prop / face | Place | Probe t | Crop (x,y,w,h) | Camera target | Seat-4 | Evidence |
|---|---|---|---|---|---|---|
| Laughing villager face — big close-up, not edge-cut | COAST_VILLAGE | 19.00 | face row | PLACES.COAST_VILLAGE + villager offset | ☐ | |
| Mayor face — deadpan MCU, push-in | COAST_VILLAGE | 22.60 | face row | PLACES.COAST_VILLAGE + mayor offset | ☐ | |
| Blueprint + ruler, hand fixed at 15.5M line | COAST_VILLAGE | 24.00 | 0.08,0.42,0.84,0.42 | PLACES.COAST_VILLAGE + table offset | ☐ | |

## Scene 4 — the years, retirement, the departure (25.09–35.27) · Place: COAST_WALL / town hall / HILL_GRAVE
Shots: (a) fixed time-lapse sky cycle over finished wall (25.09–27.72) · (b) comic push-in on mocking sign (28.13–29.68) · (c) lateral tracking: white-haired mayor carries his box out of town hall (30.27–32.55) · (d) gentle crane up to the gravestone (33.04–35.27).

| Prop / face | Place | Probe t | Crop (x,y,w,h) | Camera target | Seat-4 | Evidence |
|---|---|---|---|---|---|---|
| Mocking wooden sign («أغبى مشروع») | COAST_WALL | 29.00 | 0.10,0.20,0.80,0.38 | PLACES.COAST_WALL (sign post) | ☐ | |
| Retirement belongings box — pick-up (fetch:true) | COAST_VILLAGE | 30.60 | 0.20,0.45,0.60,0.35 | PLACES.COAST_VILLAGE (town hall door) | ☐ | |
| Retirement belongings box — mid-carry, no jump | COAST_VILLAGE | 31.40 | continuity row | tracking target = mayor offset | ☐ | |
| Retirement belongings box — put-down | COAST_VILLAGE | 32.40 | continuity row | PLACES.COAST_VILLAGE (street) | ☐ | |
| Mayor gravestone on the hill | HILL_GRAVE | 34.50 | 0.18,0.34,0.64,0.42 | PLACES.HILL_GRAVE | ☐ | |

## Scene 5 — quake, retreat, the giant wave (35.70–44.81) · Place: COAST_VILLAGE / SEA / COAST_WALL
Shots: (a) fast calendar flip, 14 years, sky turns storm-grey (35.70–37.12) · (b) heavy camera shake, village street (37.39–38.71) · (c) high-angle coastline glide: sea retreats, boats on sand (39.28–40.67) · (d) extreme low-angle tilt-up: wall of water, measuring line climbs to exactly 15M (41.06–44.81).

| Prop / face | Place | Probe t | Crop (x,y,w,h) | Camera target | Seat-4 | Evidence |
|---|---|---|---|---|---|---|
| Calendar — 14-year flip (same prop kind as S2, second use) | COAST_VILLAGE | 36.50 | 0.25,0.49,0.50,0.28 | PLACES.COAST_VILLAGE | ☐ | |
| Fallen/stranded boats on exposed sand | SEA | 40.00 | from probe | PLACES.SEA (retreat line) | ☐ | |
| 15M tsunami wave + measuring line at exactly 15M | SEA→COAST_WALL | 43.80 | 0.05,0.10,0.90,0.78 | PLACES.COAST_WALL (sea face, low angle) | ☐ | |

## Scene 6 — flashback and the pencil-mark analogy (45.45–57.57) · Place: FLASHBACK_ROCK / ROOM / COAST_WALL
Shots: (a) sepia flashback glide: young mayor watches the old flood (45.45–47.79) · (b) close-up tracking along the engraved rock, his hand on the carving (48.36–51.61) · (c) clean cutaway: pencil draws a mark over the child's head on the room wall (52.11–54.57) · (d) match-cut dissolve: pencil line → top edge of the concrete wall (54.88–57.57).

| Prop / face | Place | Probe t | Crop (x,y,w,h) | Camera target | Seat-4 | Evidence |
|---|---|---|---|---|---|---|
| Engraved high-water rock mark (+ young mayor's hand) | FLASHBACK_ROCK | 49.36 | 0.12,0.32,0.76,0.46 | PLACES.FLASHBACK_ROCK (mark axis) | ☐ | |
| Childhood pencil height mark (+ pencil, child) | ROOM | 53.50 | 0.22,0.25,0.56,0.48 | PLACES.ROOM (wall face) | ☐ | |
| Wall top edge — match-cut landing (same screen line as pencil mark) | COAST_WALL | 56.50 | continuity row | PLACES.COAST_WALL (top edge) | ☐ | |

## Scene 7 — the payoff: the village survives (58.00–67.55) · Place: NEIGHBOR_COAST / COAST_WALL / HILL_GRAVE
Shots: (a) aerial pan: neighbours under water over their 10M walls (58.00–61.12) · (b) dramatic side profile: wave strikes the 15.5M wall, spray + impact shake, water stops AT the rim (61.56–63.69) · (c) crane reveal over the wall: village dry in warm sun (64.49–65.22) · (d) slow emotional pull-back: the same mockers, silent with flowers at the grave, wall standing far behind (65.75–67.55) — loop cut on the last word.

| Prop / face | Place | Probe t | Crop (x,y,w,h) | Camera target | Seat-4 | Evidence |
|---|---|---|---|---|---|---|
| Neighbour 10M seawall — overtopped, towns flooded | NEIGHBOR_COAST | 59.50 | 0.08,0.24,0.84,0.55 | PLACES.NEIGHBOR_COAST | ☐ | |
| Seawall + wave stopped exactly at the rim | COAST_WALL | 62.80 | 0.08,0.15,0.84,0.66 | PLACES.COAST_WALL (side profile) | ☐ | |
| Flowers at the grave (+ gravestone, bowing villagers) | HILL_GRAVE | 66.80 | 0.22,0.50,0.56,0.30 | PLACES.HILL_GRAVE (pull-back end) | ☐ | |

---

## Sign-off block (filled at build time)
- D1 schema audit: ☐ pass — auditor/date: ______
- D2 zone audit (props vs cameras, same constants): ☐ pass — auditor/date: ______
- D2 frustum audit (targets inside bounds, heroes central): ☐ pass — auditor/date: ______
- Probes released to Seat 4: ☐ — probe set path: ______
- All 15 story props PASS on looked-at crops: ☐ — failures returned to Seat 2 with crop evidence, fixed at the cause, re-probed (never argued away).
