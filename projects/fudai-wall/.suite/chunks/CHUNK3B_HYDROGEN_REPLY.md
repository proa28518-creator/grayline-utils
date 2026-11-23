# CHUNK 3b — HYDROGEN REPLY (verbatim)
Seat: Hydrogen (Gemini, Task mode, Neon) · Session: gemini.google.com/app/1da612690cd2c730 · Received by Layla 2026-11-23 ~04:39 EET · Complete, no truncation, no continuation prompts.

---

1. FILM DATA
```javascript
// ============================================================================
// CHUNK 3B — SH20–SH26 (lines 18–24) · Hydrogen seat
// All positions derived from PLACES anchors; every const shot-id prefixed.
// ============================================================================

// --- SH20 (FLASHBACK_ROCK · SEPIA · L18 · 48.36–51.61) ---
const POS_SH20_LINE       = [PLACES.FLASHBACK_ROCK[0] - 0.4,  1.65, PLACES.FLASHBACK_ROCK[2] - 1.85];
const POS_SH20_MAYOR      = [PLACES.FLASHBACK_ROCK[0] + 0.9,  0.00, PLACES.FLASHBACK_ROCK[2] - 1.10];
const LOOK_SH20_MAYOR     = [PLACES.FLASHBACK_ROCK[0] - 1.4,  1.68, PLACES.FLASHBACK_ROCK[2] - 0.60];
const CAM_SH20_A          = [PLACES.FLASHBACK_ROCK[0] - 2.8,  1.75, PLACES.FLASHBACK_ROCK[2] + 2.40];
const CAM_SH20_B          = [PLACES.FLASHBACK_ROCK[0] - 1.6,  1.82, PLACES.FLASHBACK_ROCK[2] + 3.00];
const TGT_SH20_A          = [PLACES.FLASHBACK_ROCK[0] - 0.4,  1.68, PLACES.FLASHBACK_ROCK[2] - 1.60];
const TGT_SH20_B          = [PLACES.FLASHBACK_ROCK[0] + 0.65, 1.78, PLACES.FLASHBACK_ROCK[2] - 1.20];

// --- SH21 (ROOM · L19 · 52.11–54.57) ---
// Match-cut reference: pencil line at y=1.62 projects to NDC_y = +0.062 (53.1% from bottom) at t1.
const POS_SH21_CHILD      = [PLACES.ROOM[0] + 0.0,  0.00, PLACES.ROOM[2] - 1.15];
const POS_SH21_MARK       = [PLACES.ROOM[0] + 0.0,  1.62, PLACES.ROOM[2] - 1.55];
const LOOK_SH21_CHILD     = [PLACES.ROOM[0] + 0.0,  1.52, PLACES.ROOM[2] + 2.60];
const CAM_SH21_A          = [PLACES.ROOM[0] + 0.0,  1.52, PLACES.ROOM[2] + 3.00];
const CAM_SH21_B          = [PLACES.ROOM[0] + 0.0,  1.54, PLACES.ROOM[2] + 2.40];
const TGT_SH21_A          = [PLACES.ROOM[0] + 0.0,  1.52, PLACES.ROOM[2] - 1.60];
const TGT_SH21_B          = [PLACES.ROOM[0] + 0.0,  1.54, PLACES.ROOM[2] - 1.60];

// --- SH22 (COAST_WALL · MATCH-CUT · L20 · 54.88–57.57) ---
// Match-cut receiver: at t0 wall top y=17.0 projects to NDC_y = +0.062 (d=12.5, fov=36, dy=+0.25).
const POS_SH22_WORKERS    = [PLACES.COAST_WALL[0] + 0.0, 17.00, PLACES.COAST_WALL[2] + 0.20];
const LOOK_SH22_WORKERS   = [PLACES.COAST_WALL[0] + 0.0, 17.50, PLACES.COAST_WALL[2] + 12.00];
const POS_SH22_POUR       = [PLACES.COAST_WALL[0] + 0.0, 17.00, PLACES.COAST_WALL[2] + 0.00];
const CAM_SH22_A          = [PLACES.COAST_WALL[0] + 0.0, 16.75, PLACES.COAST_WALL[2] + 14.00];
const CAM_SH22_B          = [PLACES.COAST_WALL[0] + 6.0, 19.20, PLACES.COAST_WALL[2] + 20.00];
const TGT_SH22_A          = [PLACES.COAST_WALL[0] + 0.0, 16.75, PLACES.COAST_WALL[2] + 1.50];
const TGT_SH22_B          = [PLACES.COAST_WALL[0] + 0.0, 17.50, PLACES.COAST_WALL[2] + 0.00];

// --- SH23 (NEIGHBOR_COAST · L21 · 58.00–61.12) ---
// Scale law: wave = 17.5 D overtops 12 D neighbour walls by 5.5 D.
const POS_SH23_WAVE_A     = [PLACES.NEIGHBOR_COAST[0] + 0.0,  0.00, PLACES.NEIGHBOR_COAST[2] - 26.00];
const POS_SH23_WAVE_B     = [PLACES.NEIGHBOR_COAST[0] + 0.0,  0.00, PLACES.NEIGHBOR_COAST[2] + 18.00];
const CAM_SH23_A          = [PLACES.NEIGHBOR_COAST[0] - 26.0, 26.00, PLACES.NEIGHBOR_COAST[2] + 24.00];
const CAM_SH23_B          = [PLACES.NEIGHBOR_COAST[0] + 22.0, 24.00, PLACES.NEIGHBOR_COAST[2] + 28.00];
const TGT_SH23_A          = [PLACES.NEIGHBOR_COAST[0] - 4.0,  10.00, PLACES.NEIGHBOR_COAST[2] - 4.00];
const TGT_SH23_B          = [PLACES.NEIGHBOR_COAST[0] + 4.0,  11.00, PLACES.NEIGHBOR_COAST[2] + 6.00];

// --- SH24 (COAST_WALL · THESIS FRAME · L22 · 61.56–63.69) ---
// Scale law: hero wall = 18.0 D, wave = 17.5 D -> 0.5 D dry concrete margin at top edge.
// Camera stays at y >= 18.8 (>17.5 wave) and z <= -22.5 (seaward of z=-17.5 wall face).
const POS_SH24_WAVE_A     = [PLACES.COAST_WALL[0] + 0.0,  0.00, PLACES.COAST_WALL[2] - 18.00];
const POS_SH24_WAVE_HIT   = [PLACES.COAST_WALL[0] + 0.0,  0.00, PLACES.COAST_WALL[2] - 1.50];
const POS_SH24_SPRAY      = [PLACES.COAST_WALL[0] + 0.0, 17.50, PLACES.COAST_WALL[2] - 1.50];
const CAM_SH24_A          = [PLACES.COAST_WALL[0] + 24.0, 19.50, PLACES.COAST_WALL[2] - 10.00];
const CAM_SH24_SHAKE_1    = [PLACES.COAST_WALL[0] + 21.4, 20.05, PLACES.COAST_WALL[2] - 9.20];
const CAM_SH24_SHAKE_2    = [PLACES.COAST_WALL[0] + 20.6, 18.95, PLACES.COAST_WALL[2] - 8.80];
const CAM_SH24_SHAKE_3    = [PLACES.COAST_WALL[0] + 19.8, 19.45, PLACES.COAST_WALL[2] - 8.40];
const CAM_SH24_B          = [PLACES.COAST_WALL[0] + 15.0, 18.80, PLACES.COAST_WALL[2] - 6.50];
const TGT_SH24_A          = [PLACES.COAST_WALL[0] + 0.0,  14.50, PLACES.COAST_WALL[2] - 0.80];
const TGT_SH24_B          = [PLACES.COAST_WALL[0] + 0.0,  17.20, PLACES.COAST_WALL[2] - 0.80];

// --- SH25 (COAST_VILLAGE · L23 · 64.49–65.22) ---
const POS_SH25_VILLAGERS  = [PLACES.COAST_VILLAGE[0] + 0.0,  0.00, PLACES.COAST_VILLAGE[2] + 4.00];
const LOOK_SH25_VILLAGERS = [PLACES.COAST_VILLAGE[0] + 0.0, 14.00, PLACES.COAST_VILLAGE[2] - 16.00];
const POS_SH25_SUNBEAM    = [PLACES.COAST_VILLAGE[0] + 0.0, 16.00, PLACES.COAST_VILLAGE[2] + 6.00];
const CAM_SH25_A          = [PLACES.COAST_WALL[0] + 0.0,    19.60, PLACES.COAST_WALL[2] + 1.00];
const CAM_SH25_B          = [PLACES.COAST_WALL[0] + 0.0,    23.50, PLACES.COAST_WALL[2] + 5.00];
const TGT_SH25_A          = [PLACES.COAST_VILLAGE[0] + 0.0,  3.50, PLACES.COAST_VILLAGE[2] + 6.00];
const TGT_SH25_B          = [PLACES.COAST_VILLAGE[0] + 0.0,  2.50, PLACES.COAST_VILLAGE[2] + 8.00];

// --- SH26 (HILL_GRAVE · L24 · 65.75–67.55 · HARD CUT LOOP) ---
// Gravestone in foreground; mockers_a/b/c stand behind facing +Z (face <= 31 deg to cam); 18 D wall far behind.
const POS_SH26_GRAVE      = [PLACES.HILL_GRAVE[0] + 0.0,   0.00, PLACES.HILL_GRAVE[2] + 1.00];
const POS_SH26_FLOWERS    = [PLACES.HILL_GRAVE[0] + 0.0,   0.05, PLACES.HILL_GRAVE[2] + 1.45];
const POS_SH26_DIST_WALL  = [PLACES.HILL_GRAVE[0] + 0.0,  -6.00, PLACES.HILL_GRAVE[2] - 58.00];
const POS_SH26_MOCKER_A   = [PLACES.HILL_GRAVE[0] - 0.95,  0.00, PLACES.HILL_GRAVE[2] - 0.60];
const POS_SH26_MOCKER_B   = [PLACES.HILL_GRAVE[0] + 0.95,  0.00, PLACES.HILL_GRAVE[2] - 0.60];
const POS_SH26_MOCKER_C   = [PLACES.HILL_GRAVE[0] + 0.00,  0.00, PLACES.HILL_GRAVE[2] - 1.30];
const LOOK_SH26_GRAVE     = [PLACES.HILL_GRAVE[0] + 0.00,  1.00, PLACES.HILL_GRAVE[2] + 1.00];
const CAM_SH26_A          = [PLACES.HILL_GRAVE[0] + 0.00,  2.30, PLACES.HILL_GRAVE[2] + 7.00];
const CAM_SH26_B          = [PLACES.HILL_GRAVE[0] + 0.00,  3.20, PLACES.HILL_GRAVE[2] + 11.20];
const TGT_SH26_A          = [PLACES.HILL_GRAVE[0] + 0.00,  1.65, PLACES.HILL_GRAVE[2] - 1.20];
const TGT_SH26_B          = [PLACES.HILL_GRAVE[0] + 0.00,  2.20, PLACES.HILL_GRAVE[2] - 3.00];

// ============================================================================
// CAST DECLARATIONS (merged by driver with chunks 1–3a)
// ============================================================================
export const CAST_SH20_SH26 = [
  'mayor_young',
  'child',
  'workers',
  'villagers',
  'mocker_a',
  'mocker_b',
  'mocker_c',
];

// ============================================================================
// ACTS (pure in t, keyed to word/line timings)
// ============================================================================
export const ACTS_SH20_SH26 = {
  mayor_young: {
    place: [
      { t: 'line:18.start', at: POS_SH20_MAYOR },
    ],
    look: [
      { t: 'line:18.start', at: LOOK_SH20_MAYOR },
      { t: 50.60,           at: POS_SH20_LINE },
    ],
    face: [
      { t: 'line:18.start', expr: 'solemn' },
      { t: 50.60,           expr: 'determined' },
    ],
    clips: [
      { t: 'line:18.start', clip: 'idle_still' },
      { t: 49.90,           clip: 'reach_touch_wall' },
    ],
  },

  child: {
    place: [
      { t: 'line:19.start', at: POS_SH21_CHILD },
    ],
    look: [
      { t: 'line:19.start', at: LOOK_SH21_CHILD },
    ],
    face: [
      { t: 'line:19.start', expr: 'curious_smile' },
      { t: 53.30,           expr: 'proud_smile' },
    ],
    clips: [
      { t: 'line:19.start', clip: 'stand_straight' },
    ],
  },

  workers: {
    place: [
      { t: 'line:20.start', at: POS_SH22_WORKERS },
      { t: 57.10,           at: [PLACES.COAST_WALL[0] + 0.0, 18.00, PLACES.COAST_WALL[2] + 0.20] },
    ],
    look: [
      { t: 'line:20.start', at: LOOK_SH22_WORKERS },
    ],
    face: [
      { t: 'line:20.start', expr: 'focused' },
    ],
    clips: [
      { t: 'line:20.start', clip: 'pour_trowel' },
    ],
  },

  villagers: {
    place: [
      { t: 'line:23.start', at: POS_SH25_VILLAGERS },
    ],
    look: [
      { t: 'line:23.start', at: LOOK_SH25_VILLAGERS },
    ],
    face: [
      { t: 'line:23.start', expr: 'relief' },
    ],
    clips: [
      { t: 'line:23.start', clip: 'stand_relief' },
    ],
  },

  mocker_a: {
    place: [
      { t: 'line:24.start', at: POS_SH26_MOCKER_A },
    ],
    look: [
      { t: 'line:24.start', at: LOOK_SH26_GRAVE },
    ],
    face: [
      { t: 'line:24.start', expr: 'remorse' },
    ],
    clips: [
      { t: 'line:24.start', clip: 'bow_hold_flowers' },
    ],
  },

  mocker_b: {
    place: [
      { t: 'line:24.start', at: POS_SH26_MOCKER_B },
    ],
    look: [
      { t: 'line:24.start', at: LOOK_SH26_GRAVE },
    ],
    face: [
      { t: 'line:24.start', expr: 'remorse' },
    ],
    clips: [
      { t: 'line:24.start', clip: 'bow_silent' },
    ],
  },

  mocker_c: {
    place: [
      { t: 'line:24.start', at: POS_SH26_MOCKER_C },
    ],
    look: [
      { t: 'line:24.start', at: LOOK_SH26_GRAVE },
    ],
    face: [
      { t: 'line:24.start', expr: 'remorse' },
    ],
    clips: [
      { t: 'line:24.start', clip: 'bow_silent' },
    ],
  },
};

// ============================================================================
// PROPS (D1 array form; Law 1 top-level opt declarations; Law 2 cut-aligned hides)
// ============================================================================
export const PROPS_SH20_SH26 = [
  // SH20 — Carved high-water line on flashback rock
  {
    id: 'carved_line_sh20',
    kind: 'carved_line',
    in: 'world',
    at: POS_SH20_LINE,
    length: 3.6,
    reveal: 0.35,
    keys: [
      { t: 'line:18.start', reveal: 0.35 },
      { t: 49.90,           reveal: 1.00 },
      { t: 'line:18.end',   reveal: 1.00 },
    ],
  },

  // SH21 — Pencil height line + handwritten measure on warm room wall
  {
    id: 'pencil_mark_sh21',
    kind: 'pencil_mark',
    in: 'world',
    at: POS_SH21_MARK,
    lineY: 0.0,
    draw: 0.0,
    keys: [
      { t: 'line:19.start', lineY: 0.0, draw: 0.00 },
      { t: 53.30,           lineY: 0.0, draw: 1.00 },
      { t: 'line:19.end',   lineY: 0.0, draw: 1.00 },
    ],
  },

  // SH22 — Last-metre concrete pour atop hero seawall (hidden outside SH22 on exact cuts)
  {
    id: 'pour_sh22',
    kind: 'concrete_pour',
    in: 'world',
    at: POS_SH22_POUR,
    hidden: true,
    progress: 0.0,
    keys: [
      { t: 0,               hidden: true,  progress: 0.0 },
      { t: 'line:20.start', hidden: false, progress: 0.0 },
      { t: 55.90,           hidden: false, progress: 0.5 },
      { t: 57.10,           hidden: false, progress: 1.0 },
      { t: 'line:21.start', hidden: true,  progress: 1.0 },
    ],
  },

  // SH22–SH25 — Hero seawall height key extension (merge into existing hero seawall entry)
  // Law 7: reaches exact 18.0 D by 57.10 and holds 18.0 D through SH24–SH25.
  {
    id: 'seawall_hero_keys_ext',
    mergeInto: 'seawall_hero',
    h: 17.0,
    keys: [
      { t: 'line:20.start', h: 17.0 },
      { t: 55.90,           h: 17.5 },
      { t: 57.10,           h: 18.0 },
      { t: 'line:23.end',   h: 18.0 },
    ],
  },

  // SH23 — 17.5 D wave overtopping 12 D neighbour walls
  {
    id: 'wave_neighbor_sh23',
    kind: 'wave',
    in: 'world',
    at: POS_SH23_WAVE_A,
    hidden: true,
    h: 17.5,
    width: 70.0,
    crestY: 17.5,
    curl: 0.4,
    keys: [
      { t: 0,               hidden: true,  at: POS_SH23_WAVE_A, h: 17.5, crestY: 17.5, curl: 0.4 },
      { t: 'line:21.start', hidden: false, at: POS_SH23_WAVE_A, h: 17.5, crestY: 17.5, curl: 0.5 },
      { t: 60.20,           hidden: false, at: [PLACES.NEIGHBOR_COAST[0], 0, PLACES.NEIGHBOR_COAST[2] + 6.0], h: 17.5, crestY: 17.5, curl: 0.85 },
      { t: 'line:21.end',   hidden: false, at: POS_SH23_WAVE_B, h: 17.5, crestY: 17.5, curl: 0.95 },
      { t: 'line:22.start', hidden: true,  at: POS_SH23_WAVE_B, h: 17.5, crestY: 17.5, curl: 0.95 },
    ],
  },

  // SH24 — 17.5 D wave slamming 18.0 D hero wall and stopping at 17.5 D (0.5 D below top edge)
  {
    id: 'wave_hero_sh24',
    kind: 'wave',
    in: 'world',
    at: POS_SH24_WAVE_A,
    hidden: true,
    h: 17.5,
    width: 70.0,
    crestY: 15.0,
    curl: 0.6,
    keys: [
      { t: 0,               hidden: true,  at: POS_SH24_WAVE_A,   h: 17.5, crestY: 15.0, curl: 0.6 },
      { t: 'line:22.start', hidden: false, at: POS_SH24_WAVE_A,   h: 17.5, crestY: 15.5, curl: 0.7 },
      { t: 62.10,           hidden: false, at: POS_SH24_WAVE_HIT, h: 17.5, crestY: 16.8, curl: 0.9 },
      { t: 63.20,           hidden: false, at: POS_SH24_WAVE_HIT, h: 17.5, crestY: 17.5, curl: 0.25 },
      { t: 'line:22.end',   hidden: false, at: POS_SH24_WAVE_HIT, h: 17.5, crestY: 17.5, curl: 0.20 },
      { t: 'line:23.start', hidden: false, at: POS_SH24_WAVE_HIT, h: 17.5, crestY: 16.5, curl: 0.15 },
      { t: 'line:24.start', hidden: true,  at: POS_SH24_WAVE_HIT, h: 17.5, crestY: 16.5, curl: 0.15 },
    ],
  },

  // SH24 — White impact spray along the wall face (settles before thesis hold so 0.5 D gap reads clean)
  {
    id: 'spray_hero_sh24',
    kind: 'spray',
    in: 'world',
    at: POS_SH24_SPRAY,
    hidden: true,
    intensity: 0.0,
    lift: 0.0,
    keys: [
      { t: 0,               hidden: true,  intensity: 0.0,  lift: 0.0 },
      { t: 'line:22.start', hidden: false, intensity: 0.0,  lift: 0.0 },
      { t: 62.10,           hidden: false, intensity: 1.0,  lift: 2.2 },
      { t: 63.20,           hidden: false, intensity: 0.35, lift: 0.4 },
      { t: 'line:22.end',   hidden: false, intensity: 0.25, lift: 0.3 },
      { t: 'line:23.start', hidden: true,  intensity: 0.0,  lift: 0.0 },
    ],
  },

  // SH25 — Warm sunbeam breaking the clouds over the dry village
  {
    id: 'sunbeam_sh25',
    kind: 'sunbeam',
    in: 'world',
    at: POS_SH25_SUNBEAM,
    hidden: true,
    opacity: 0.0,
    keys: [
      { t: 0,               hidden: true,  opacity: 0.00 },
      { t: 'line:23.start', hidden: false, opacity: 0.45 },
      { t: 64.80,           hidden: false, opacity: 0.85 },
      { t: 'line:23.end',   hidden: false, opacity: 0.90 },
      { t: 'line:24.start', hidden: true,  opacity: 0.00 },
    ],
  },

  // SH26 — Mayor's gravestone, flowers, and distant 18 D wall (true scale)
  {
    id: 'gravestone_sh26',
    kind: 'gravestone',
    in: 'world',
    at: POS_SH26_GRAVE,
    h: 1.35,
    keys: [],
  },
  {
    id: 'flowers_sh26',
    kind: 'flowers',
    in: 'world',
    at: POS_SH26_FLOWERS,
    keys: [],
  },
  {
    id: 'wall_distant_sh26',
    kind: 'seawall',
    in: 'world',
    at: POS_SH26_DIST_WALL,
    h: 18.0,
    keys: [],
  },
];

// ============================================================================
// SHOTS SH20–SH26
// ============================================================================
export const SHOTS_SH20_SH26 = [
  {
    id: 'SH20',
    t0: 'line:18.start',
    t1: 'line:18.end',
    place: 'FLASHBACK_ROCK',
    grade: 'sepia',
    cam: [
      { t: 'line:18.start', at: CAM_SH20_A, to: TGT_SH20_A, fov: 36 },
      { t: 'line:18.end',   at: CAM_SH20_B, to: TGT_SH20_B, fov: 36 },
    ],
  },
  {
    id: 'SH21',
    t0: 'line:19.start',
    t1: 'line:19.end',
    place: 'ROOM',
    cam: [
      { t: 'line:19.start', at: CAM_SH21_A, to: TGT_SH21_A, fov: 38 },
      { t: 'line:19.end',   at: CAM_SH21_B, to: TGT_SH21_B, fov: 36 },
    ],
  },
  {
    id: 'SH22',
    t0: 'line:20.start',
    t1: 'line:20.end',
    place: 'COAST_WALL',
    cam: [
      { t: 'line:20.start', at: CAM_SH22_A, to: TGT_SH22_A, fov: 36 },
      { t: 55.40,           at: CAM_SH22_A, to: TGT_SH22_A, fov: 36 },
      { t: 'line:20.end',   at: CAM_SH22_B, to: TGT_SH22_B, fov: 42 },
    ],
  },
  {
    id: 'SH23',
    t0: 'line:21.start',
    t1: 'line:21.end',
    place: 'NEIGHBOR_COAST',
    cam: [
      { t: 'line:21.start', at: CAM_SH23_A, to: TGT_SH23_A, fov: 44 },
      { t: 'line:21.end',   at: CAM_SH23_B, to: TGT_SH23_B, fov: 46 },
    ],
  },
  {
    id: 'SH24',
    t0: 'line:22.start',
    t1: 'line:22.end',
    place: 'COAST_WALL',
    cam: [
      { t: 'line:22.start', at: CAM_SH24_A,       to: TGT_SH24_A, fov: 40 },
      { t: 62.10,           at: CAM_SH24_SHAKE_1, to: TGT_SH24_A, fov: 38 },
      { t: 62.25,           at: CAM_SH24_SHAKE_2, to: TGT_SH24_B, fov: 36 },
      { t: 62.45,           at: CAM_SH24_SHAKE_3, to: TGT_SH24_B, fov: 33 },
      { t: 63.20,           at: CAM_SH24_B,       to: TGT_SH24_B, fov: 28 },
      { t: 'line:22.end',   at: CAM_SH24_B,       to: TGT_SH24_B, fov: 28 },
    ],
  },
  {
    id: 'SH25',
    t0: 'line:23.start',
    t1: 'line:23.end',
    place: 'COAST_VILLAGE',
    cam: [
      { t: 'line:23.start', at: CAM_SH25_A, to: TGT_SH25_A, fov: 46 },
      { t: 'line:23.end',   at: CAM_SH25_B, to: TGT_SH25_B, fov: 46 },
    ],
  },
  {
    id: 'SH26',
    t0: 'line:24.start',
    t1: 'line:24.end',
    place: 'HILL_GRAVE',
    cutOut: 'hard',
    cam: [
      { t: 'line:24.start', at: CAM_SH26_A, to: TGT_SH26_A, fov: 42 },
      { t: 'line:24.end',   at: CAM_SH26_B, to: TGT_SH26_B, fov: 44 },
    ],
  },
];
```

2. MOMENTS
```
F1497 t=49.90 SH20 — PROP: carved_line_sh20 >= 120 [state: reveal >= 0.95]
F1518 t=50.60 SH20 — FACE: mayor_young >= 350
F1542 t=51.40 SH20 — BODY: mayor_young >= 600
F1599 t=53.30 SH21 — PROP: pencil_mark_sh21 >= 140 [state: draw >= 0.95]
F1635 t=54.50 SH21 — FACE: child >= 380
F1647 t=54.90 SH22 — PROP: seawall_hero >= 400 [state: h >= 17.0]
F1677 t=55.90 SH22 — PROP: pour_sh22 >= 180 [state: progress >= 0.45]
F1716 t=57.20 SH22 — BODY: workers >= 240 [state: h >= 18.0]
F1764 t=58.80 SH23 — PROP: wave_neighbor_sh23 >= 600 [state: h >= 17.5]
F1806 t=60.20 SH23 — PROP: wave_neighbor_sh23 >= 700 [state: crestY >= 17.5]
F1827 t=60.90 SH23 — OCCUPANCY: wave_neighbor_sh23 >= 230
F1863 t=62.10 SH24 — PROP: spray_hero_sh24 >= 260 [state: intensity >= 0.90]
F1896 t=63.20 SH24 — PROP: wave_hero_sh24 >= 500 [state: crestY >= 17.5]
F1908 t=63.60 SH24 — PROP: seawall_hero >= 600 [state: h >= 18.0]
F1944 t=64.80 SH25 — PROP: sunbeam_sh25 >= 400 [state: opacity >= 0.80]
F1953 t=65.10 SH25 — OCCUPANCY: villagers >= 230
F1980 t=66.00 SH26 — FACE: mocker_a >= 240
F2001 t=66.70 SH26 — PROP: gravestone_sh26 >= 300
F2022 t=67.40 SH26 — PROP: wall_distant_sh26 >= 450 [state: h >= 18.0]
```

3. NEW KINDS NEEDED

carved_line: origin at center of horizontal chisel mark on rock face; size length × 0.24 × 0.08 D (default length: 3.6); reveal (0..1) unmasks the dark weathered groove + subtle chisel lip left-to-right along X.

pencil_mark: origin at center of horizontal pencil stroke on wall; size 1.4 × 0.35 × 0.04 D (graphite line + handwritten measure digits to the right); lineY offsets vertical height if needed, draw (0..1) sweeps the stroke left-to-right with a small pencil-tip/hand proxy at the leading edge while draw < 1.

concrete_pour: origin at center-bottom of the final 1 m formwork band atop the seawall; size 12.0 × 1.0 × 3.2 D (timber/steel shuttering rails + wet grey concrete fill); progress (0..1) raises the concrete fill level from 0 to 1.0 D inside the shuttering.

wave (shared with Qwen's SH18): origin at bottom-center of leading wave face (y = 0, front edge at local z = 0, body extending -Z by 24 D); size width × h × 24.0 D (default width: 70, h: 17.5); crestY drives the live water-surface peak height (0..h, capped at h = 17.5 D so SH24 reads strictly below the 18.0 D wall top), curl (0..1) drives crest-lip curl and foam cap intensity.

spray: origin at impact line center; size 26.0 × 4.5 × 3.0 D (clustered stylized cartoon white-foam puffs + vertical splash plumes); intensity (0..1) scales puff visibility/density, lift (0..3 D) drives upward vertical plume extension.

sunbeam: origin at upper cloud-break center angling down-forward toward the village; size 18.0 × 22.0 × 18.0 D (translucent warm-gold volumetric cone/shafts); opacity (0..1) drives shaft alpha.

gravestone: origin at bottom-center on ground (y = 0); size 0.95 × h × 0.40 D (default h: 1.35, rounded weathered stone stele + low plinth, facing +Z); static geometry (h optional top-level height opt).

flowers: origin at bottom-center on ground (y = 0); size 0.85 × 0.40 × 0.55 D (wrapped white/yellow tribute bouquet resting flat/angled against the gravestone plinth); static geometry.

4. RATIONALE

SH20: Close lateral track along the sepia rock face keeps carved_line_sh20 centered for الصخر while framing mayor_young at a ~34° face angle as his hand reaches the historic high-water groove.

SH21: Level, centered cutaway in ROOM holds child straight-on (0° face angle) and lands pencil_mark_sh21 at exact NDC_y = +0.062 (53.1% from bottom) at the cut to seed SH22's match-cut.

SH22: Opens on a level lock (NDC_y = +0.062) where the seawall's rising top edge (17.0 -> 18.0 D) seamlessly receives SH21's pencil line, then pulls back-and-up to reveal workers pouring the last metre.

SH23: High oblique aerial pan across NEIGHBOR_COAST shows the 17.5 D wave rising 5.5 D above the 12 D neighbour walls and engulfing the village behind on اتمسحت.

SH24: 3/4 side-profile telephoto push with pure-in-t impact shake on خبطت (staying strictly above 17.5 D and seaward of the wall) locks onto the thesis frame at حافته, where the 17.5 D water stops with a crisp 0.5 D (~120 px) dry concrete margin below the 18.0 D wall top.

SH25: Swift 0.73 s upward crane over the 18.0 D wall crest reveals the bone-dry village and villagers bathed in a breaking warm sunbeam on نجت.

SH26: Slow pull-back from the foreground gravestone and flowers reveals mocker_a/b/c bowing silently behind the grave (faces ≤ 31° to camera) with the true-scale 18.0 D wall towering on the distant coast before the hard-cut loop.

5. CONFLICTS

SH21 child rig height vs. audit body model: POS_SH21_MARK sits at y = 1.62 assuming scenes/cast/child is scaled to child height (~1.55 D). The framing covers y ∈ [0.1, 2.9] so FACE passes even if the audit uses the adult 1.9 head-centre model, but if child is unscaled (head top 2.4), raise POS_SH21_MARK.y, CAM_SH21_A/B.y, and TGT_SH21_A/B.y together by +0.88 to preserve the exact NDC_y = +0.062 match-cut with SH22.

SH22 seawall_hero merge: seawall_hero_keys_ext extends the existing hero seawall at COAST_WALL (h: 17.0 -> 18.0 in SH22, holding 18.0 thereafter) rather than spawning a second wall; the driver must merge these keys into the existing seawall entry and ensure h is declared at top level (Law 1).

SH23 NEIGHBOR_COAST wall Z-offset: set.js's exact Z offset for the existing neighbour walls inside NEIGHBOR_COAST is not quoted in the brief; SH23 stages the neighbour wall line at dz = 0 relative to PLACES.NEIGHBOR_COAST. If set.js offsets neighbour walls to dz = -16 (matching COAST_WALL), shift all SH23 Z offsets by -16 uniformly so the overtop geometry stays identical.
