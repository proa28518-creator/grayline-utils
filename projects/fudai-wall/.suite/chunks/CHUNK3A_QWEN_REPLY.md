# CHUNK 3a — QWEN'S VERBATIM REPLY (SH13–SH19)

Saved verbatim from Layla's browser seat (chat.qwen.ai, Qwen4-Max, signed-in
account as it stands), received 2026-11-23 ~04:39 EET. This file is the
chunk-3a authoring record of record; the merge pipeline works from it.

---
CHUNK 3a · SH13–SH19 · fudai-wall

FILM DATA

// ===================== CHUNK 3a · SH13–SH19 =====================
// Anchors: PLACES only (scenes/set.js). Every position = anchor + offset.
const A_SH13 = PLACES.COAST_VILLAGE;   // [0,0,2]
const A_SH14 = PLACES.HILL_GRAVE;      // [2400,0,0]
const A_SH15 = PLACES.COAST_VILLAGE;
const A_SH16 = PLACES.COAST_VILLAGE;
const A_SH17 = PLACES.SEA;             // [0,0,-44]
const A_SH18 = PLACES.SEA;
const A_SH19 = PLACES.FLASHBACK_ROCK;  // [1200,0,0]

// ---------------- CAMERAS (fov sampled within [24,50]; one continuous
// window per shot — no sub-windows; shake is a closed form, pure in t) ----
const CAM_SH13 = { // slow lateral track, street side, subject leads camera by 0.6
  place:'COAST_VILLAGE', fov:40,
  keys:[
    {t:'line:11.start', pos:[A_SH13[0]-5.4, A_SH13[1]+1.62, A_SH13[2]+8.2], look:[A_SH13[0]-6.0, A_SH13[1]+1.55, A_SH13[2]+1.6]},
    {t:'line:11.end',   pos:[A_SH13[0]-2.0, A_SH13[1]+1.62, A_SH13[2]+8.2], look:[A_SH13[0]-2.6, A_SH13[1]+1.50, A_SH13[2]+2.9], ease:'inout'}
  ]
};
const CAM_SH14 = { // gentle crane up off the stone, revealing the far wall line
  place:'HILL_GRAVE', fov:40,
  keys:[
    {t:'line:12.start', pos:[A_SH14[0]+2.6, A_SH14[1]+0.9, A_SH14[2]+5.2], look:[A_SH14[0], A_SH14[1]+1.0, A_SH14[2]]},
    {t:'line:12.end',   pos:[A_SH14[0]+2.2, A_SH14[1]+3.4, A_SH14[2]+6.4], look:[A_SH14[0], A_SH14[1]+1.2, A_SH14[2]-2.0], ease:'inout'}
  ]
};
const CAM_SH15 = { // tight push-in on the wall calendar
  place:'COAST_VILLAGE', fov:32,
  keys:[
    {t:'line:13.start', pos:[A_SH15[0]-1.5, A_SH15[1]+1.7, A_SH15[2]+3.6], look:[A_SH15[0]-1.5, A_SH15[1]+1.7, A_SH15[2]+0.25]},
    {t:'line:13.end',   pos:[A_SH15[0]-1.5, A_SH15[1]+1.7, A_SH15[2]+3.0], look:[A_SH15[0]-1.5, A_SH15[1]+1.7, A_SH15[2]+0.25], ease:'inout'}
  ]
};
const CAM_SH16 = { // wide street, heavy shake (deterministic sine sum, full-shot envelope)
  place:'COAST_VILLAGE', fov:46,
  keys:[
    {t:'line:14.start', pos:[A_SH16[0]+3.5, A_SH16[1]+2.2, A_SH16[2]+10.5], look:[A_SH16[0], A_SH16[1]+1.4, A_SH16[2]]},
    {t:'line:14.end',   pos:[A_SH16[0]+3.2, A_SH16[1]+2.1, A_SH16[2]+10.2], look:[A_SH16[0], A_SH16[1]+1.3, A_SH16[2]], ease:'inout'}
  ],
  shake:{t0:'line:14.start', t1:'line:14.end', ax:0.26, ay:0.18, fx:6.3, fy:8.7, phx:0.0, phy:1.3, env:'sin_pi'} // off = a*sin(2πfτ+φ)*sin(πτ/dur)
};
const CAM_SH17 = { // high-angle coastline glide over the draining shore
  place:'SEA', fov:44,
  keys:[
    {t:'line:15.start', pos:[A_SH17[0]-6.0, A_SH17[1]+13.5, A_SH17[2]+15.0], look:[A_SH17[0], A_SH17[1], A_SH17[2]-2.0]},
    {t:'line:15.end',   pos:[A_SH17[0]+2.0, A_SH17[1]+12.5, A_SH17[2]+14.0], look:[A_SH17[0], A_SH17[1], A_SH17[2]-6.0], ease:'inout'}
  ]
};
const CAM_SH18 = { // extreme low angle on dry sand, tilt-up the water wall
  place:'SEA', fov:46,
  keys:[
    {t:'line:16.start', pos:[A_SH18[0]-1.5, A_SH18[1]+0.65, A_SH18[2]+2.5], look:[A_SH18[0], A_SH18[1]+2.2, A_SH18[2]-20.0], fov:46},
    {t:'line:16.end',   pos:[A_SH18[0]-1.0, A_SH18[1]+0.90, A_SH18[2]+1.5], look:[A_SH18[0], A_SH18[1]+16.5, A_SH18[2]-20.0], fov:50, ease:'inout'}
  ]
};
const CAM_SH19 = { // sepia glide: low near the old village, up the rock to the boy's face
  place:'FLASHBACK_ROCK', fov:46,
  keys:[
    {t:'line:17.start', pos:[A_SH19[0]-2.5, A_SH19[1]+0.9, A_SH19[2]-21.0], look:[A_SH19[0]-2.0, A_SH19[1]+1.0, A_SH19[2]-4.0]},
    {t:'line:17.end',   pos:[A_SH19[0]-1.0, A_SH19[1]+1.3, A_SH19[2]-16.0], look:[A_SH19[0]-4.0, A_SH19[1]+1.2, A_SH19[2]-4.0], ease:'inout'}
  ]
};

// ---------------- CAST (entries merge by id; specs already exist) --------
// LAW 4 — the parked grey mayor: hidden by THIS key at the SH13 cut:
//   mayor.hidden @ 'line:11.start' (stow:true). mayor_old is the same man.
const CAST_3a = [
  { id:'mayor', spec:'mayor', in:'world',
    hidden:[{t:'line:11.start', v:true, stow:true}] },

  { id:'mayor_old', spec:'mayor_old', in:'world', place:'COAST_VILLAGE',
    at:[A_SH13[0]-6.0, A_SH13[1], A_SH13[2]+1.0],
    hidden:[{t:'line:11.start', v:false, stow:true}],
    walk:{keys:[
      {t:'line:11.start', at:[A_SH13[0]-6.0, A_SH13[1], A_SH13[2]+1.0]},
      {t:30.90,           at:[A_SH13[0]-5.7, A_SH13[1], A_SH13[2]+2.4]},
      {t:'line:11.end',   at:[A_SH13[0]-2.6, A_SH13[1], A_SH13[2]+2.8]},
      {t:'line:13.start', at:[A_SH13[0]+6.5, A_SH13[1], A_SH13[2]+3.2]} // leaves town off-frame; box follows
    ]},
    acts:{
      face:[{t:'line:11.start', v:'weary'}],
      clips:[{t0:'line:11.start', t1:'line:13.start', clip:'carry_walk'}],
      // 3/4 front to the street camera: yaw 30° off +z toward +x (FACE ≤60°)
      look:[{t:'line:11.start', at:[A_SH13[0]-2.0, A_SH13[1]+1.5, A_SH13[2]+9.0]}]
    } },

  { id:'mocker_a', spec:'mocker_a', in:'world', place:'COAST_VILLAGE',
    at:[A_SH13[0]-7.2, A_SH13[1], A_SH13[2]+0.8],
    acts:{ face:[{t:'line:11.start', v:'blaming'}],
           clips:[{t0:30.90, t1:'line:11.end', clip:'point_accuse'}],
           look:[{t:'line:11.start', at:[A_SH13[0]-4.0, A_SH13[1]+1.5, A_SH13[2]+2.8]}] } },
  { id:'mocker_b', spec:'mocker_b', in:'world', place:'COAST_VILLAGE',
    at:[A_SH13[0]-6.2, A_SH13[1], A_SH13[2]+0.5],
    acts:{ face:[{t:'line:11.start', v:'blaming'}],
           clips:[{t0:30.80, t1:'line:11.end', clip:'point_accuse'}],
           look:[{t:'line:11.start', at:[A_SH13[0]-4.0, A_SH13[1]+1.5, A_SH13[2]+2.8]}] } },
  { id:'mocker_c', spec:'mocker_c', in:'world', place:'COAST_VILLAGE',
    at:[A_SH13[0]-5.2, A_SH13[1], A_SH13[2]+0.7],
    acts:{ face:[{t:'line:11.start', v:'blaming'}],
           clips:[{t0:31.00, t1:'line:11.end', clip:'point_accuse'}],
           look:[{t:'line:11.start', at:[A_SH13[0]-4.0, A_SH13[1]+1.5, A_SH13[2]+2.8]}] } },

  { id:'villagers', spec:'villagers', in:'world', place:'COAST_VILLAGE',
    members:5, spread:2.6,
    walk:{keys:[
      {t:'line:14.start', at:[A_SH16[0]-3.0, A_SH16[1], A_SH16[2]+0.8]},
      {t:'line:14.end',   at:[A_SH16[0]-1.0, A_SH16[1], A_SH16[2]+4.2]}
    ]},
    acts:{ face:[{t:'line:14.start', v:'alarmed'}], // wide-eyed
           clips:[{t0:'line:14.start', t1:'line:14.end', clip:'rush_out'}],
           look:[{t:'line:14.start', at:[A_SH16[0]+3.5, A_SH16[1]+1.8, A_SH16[2]+10.5]}] } },

  { id:'villagers_shore', spec:'villagers', in:'world', place:'SEA',
    members:4, spread:2.0,
    hidden:[{t:'line:16.start', v:false, stow:true}],
    at:[A_SH18[0]-5.0, A_SH18[1], A_SH18[2]-5.0],
    walk:{keys:[
      {t:'line:16.start', at:[A_SH18[0]-5.0, A_SH18[1], A_SH18[2]-5.0]},
      {t:44.50,           at:[A_SH18[0]-4.0, A_SH18[1], A_SH18[2]+6.0]} // run to high ground, past camera left
    ]},
    acts:{ face:[{t:'line:16.start', v:'terror'}],
           clips:[{t0:'line:16.start', t1:44.50, clip:'run_panic'}] } },

  { id:'mayor_young', spec:'mayor_young', in:'world', place:'FLASHBACK_ROCK',
    at:[A_SH19[0], A_SH19[1], A_SH19[2]+2.0],
    hidden:[{t:'line:17.start', v:false, stow:true}],
    acts:{ face:[{t:'line:17.start', v:'young_grave'}], // black hair per spec
           clips:[{t0:'line:17.start', t1:'line:17.end', clip:'watch_stand'}],
           // gaze down-left at the drowning village; camera sits inside the gaze cone
           look:[{t:'line:17.start', at:[A_SH19[0]-3.5, A_SH19[1]-1.0, A_SH19[2]-12.0]}] } }
];

// ---------------- PROPS (D1 array form; LAW 1 declarations at top level) --
const PROPS_3a = [
  // SH13 — belongings box. D1 FIX OF RECORD: fetch:true stays.
  { id:'box_sh13', kind:'belongings_box', in:'world', place:'COAST_VILLAGE',
    fetch:true,
    at:[A_SH13[0]-6.0, A_SH13[1]+1.15, A_SH13[2]+1.45],
    keys:{ pos:[
      {t:'line:11.start', v:[A_SH13[0]-6.0, A_SH13[1]+1.15, A_SH13[2]+1.45]},
      {t:30.90,           v:[A_SH13[0]-5.7, A_SH13[1]+1.15, A_SH13[2]+2.85]},
      {t:'line:11.end',   v:[A_SH13[0]-2.6, A_SH13[1]+1.15, A_SH13[2]+3.25]},
      {t:'line:13.start', v:[A_SH13[0]+6.5, A_SH13[1]+1.15, A_SH13[2]+3.65]}
    ]} }, // carried in front of the chest; persists off-frame in SH15/16 (PROP GUARD)

  // SH14 — one simple stone, one leaf, the far silent wall as a silhouette
  { id:'gravestone_sh14', kind:'gravestone', in:'world', place:'HILL_GRAVE',
    at:[A_SH14[0], A_SH14[1], A_SH14[2]] },
  { id:'leaf_sh14', kind:'leaf', in:'world', place:'HILL_GRAVE',
    at:[A_SH14[0]+0.55, A_SH14[1]+3.3, A_SH14[2]+0.25],
    keys:{
      pos:[
        {t:'line:12.start', v:[A_SH14[0]+0.55, A_SH14[1]+3.30, A_SH14[2]+0.25]},
        {t:33.60,           v:[A_SH14[0]+0.42, A_SH14[1]+2.50, A_SH14[2]+0.35], ease:'inout'},
        {t:34.20,           v:[A_SH14[0]+0.30, A_SH14[1]+1.70, A_SH14[2]+0.45], ease:'inout'},
        {t:34.80,           v:[A_SH14[0]+0.22, A_SH14[1]+0.80, A_SH14[2]+0.50], ease:'inout'},
        {t:'line:12.end',   v:[A_SH14[0]+0.18, A_SH14[1]+0.06, A_SH14[2]+0.55], ease:'inout'}
      ],
      rot:[
        {t:'line:12.start', v:[0,0,0]},
        {t:34.20,           v:[20,40,70], ease:'inout'},
        {t:'line:12.end',   v:[10,80,150], ease:'inout'}
      ]
    } },
  { id:'wall_distant_sh14', kind:'seawall', in:'world', place:'HILL_GRAVE',
    at:[A_SH14[0], A_SH14[1], A_SH14[2]-140.0] }, // 18 D silhouette on the horizon; see CONFLICTS 2

  // SH15 — calendar (existing kind). LAW 1: page declared.
  { id:'calendar', kind:'calendar', in:'world', place:'COAST_VILLAGE',
    page:0,
    at:[A_SH15[0]-1.5, A_SH15[1]+1.7, A_SH15[2]+0.25],
    keys:{ page:[
      {t:'line:13.start', v:0},
      {t:35.95,           v:7,  ease:'out'},
      {t:36.10,           v:14, ease:'out'},
      {t:'line:13.w4',    v:14}, // word bind: lands before the word, holds through it
      {t:'line:13.end',   v:14}
    ]} },

  // SH16 — birds (perched in SH13/15 at burst 0 → PROP GUARD; burst on the quake)
  { id:'birds_sh16', kind:'birds', in:'world', place:'COAST_VILLAGE',
    burst:0, n:7,
    at:[A_SH16[0]+1.5, A_SH16[1]+4.6, A_SH16[2]+1.0],
    keys:{ burst:[
      {t:'line:14.start', v:0},
      {t:'line:14.w2',    v:0.15}, // word bind: اتهزت
      {t:37.55,           v:0.35, ease:'out'},
      {t:38.30,           v:1.0,  ease:'out'},
      {t:'line:14.end',   v:1.0}
    ]} },

  // SH17 — draining sea sheet + stranded boats
  { id:'sea_sheet_sh17', kind:'sea_sheet', in:'world', place:'SEA',
    pull:0, // LAW 1: near edge z = 12 - pull (water occupies z < edge)
    at:[A_SH17[0], A_SH17[1]+0.02, A_SH17[2]],
    keys:{ pull:[
      {t:'line:15.start', v:0},
      {t:'line:15.w2',    v:4},  // word bind: اتسحب
      {t:39.90,           v:14, ease:'inout'},
      {t:40.50,           v:36, ease:'inout'},
      {t:'line:15.end',   v:36}
    ]} },
  { id:'boat_sh17_a', kind:'boat', in:'world', place:'SEA',
    rot:[0,0,0],
    at:[A_SH17[0]-3.5, A_SH17[1]+0.15, A_SH17[2]+4.0],
    keys:{
      pos:[{t:'line:15.start', v:[A_SH17[0]-3.5, A_SH17[1]+0.15, A_SH17[2]+4.0]},
           {t:39.90,           v:[A_SH17[0]-3.5, A_SH17[1]+0.02, A_SH17[2]+4.0], ease:'out'}],
      rot:[{t:'line:15.start', v:[0,0,0]},
           {t:40.10,           v:[0,0,14], ease:'out'}] // settles onto sand, lists
    } },
  { id:'boat_sh17_b', kind:'boat', in:'world', place:'SEA',
    rot:[0,0,0],
    at:[A_SH17[0]+2.5, A_SH17[1]+0.15, A_SH17[2]+7.0],
    keys:{
      pos:[{t:'line:15.start', v:[A_SH17[0]+2.5, A_SH17[1]+0.15, A_SH17[2]+7.0]},
           {t:39.70,           v:[A_SH17[0]+2.5, A_SH17[1]+0.02, A_SH17[2]+7.0], ease:'out'}],
      rot:[{t:'line:15.start', v:[0,0,0]},
           {t:39.95,           v:[0,0,-11], ease:'out'}]
    } },

  // SH18 — the wave (17.5 D < seawall 18 D) + the glowing measure to exactly 15.
  // LAW 2: hidden keys sit on shot cuts, stow:true.
  { id:'wave_sh18', kind:'wave', in:'world', place:'SEA',
    h:0, advance:0, w:90,
    at:[A_SH18[0], A_SH18[1], A_SH18[2]-20.0],
    hidden:[{t:'line:15.start', v:true, stow:true}, {t:'line:16.start', v:false, stow:true}],
    keys:{
      h:[{t:'line:16.start', v:2},
         {t:'line:16.w2',    v:6},   // word bind: بموجة
         {t:41.80,           v:9,    ease:'out'},
         {t:43.00,           v:17.5, ease:'out'},
         {t:'line:16.w5',    v:17.5},
         {t:'line:16.end',   v:17.5}], // crest 17.5 — BELOW the wall's 18 D top
      advance:[{t:'line:16.start', v:0}, {t:'line:16.end', v:2.0, ease:'inout'}]
    } },
  { id:'measure_wave', kind:'measure', in:'world', place:'SEA',
    lineY:0, // LAW 1
    at:[A_SH18[0]+5.0, A_SH18[1], A_SH18[2]-16.0],
    hidden:[{t:'line:15.start', v:true, stow:true}, {t:'line:16.start', v:false, stow:true}],
    keys:{ lineY:[
      {t:'line:16.start', v:0},
      {t:41.90,           v:4,  ease:'out'},
      {t:42.80,           v:9,  ease:'out'},
      {t:43.20,           v:15, ease:'out'},
      {t:'line:16.w5',    v:15}, // word bind: 15 — lands just before the word, holds exact
      {t:'line:16.end',   v:15}
    ]} },

  // SH19 — sepia: old village below the rock, old waves rolling over it
  { id:'old_village_sh19', kind:'storeys', in:'world', place:'FLASHBACK_ROCK',
    storeys:3,
    at:[A_SH19[0]-3.5, A_SH19[1]-1.5, A_SH19[2]-12.0] },
  { id:'wave_old_sh19', kind:'wave', in:'world', place:'FLASHBACK_ROCK',
    h:5, advance:0, w:14, // narrow: right edge x=-2 stays clear of the boy at x=0
    at:[A_SH19[0]-9.0, A_SH19[1]-1.5, A_SH19[2]-17.0],
    keys:{
      h:[{t:'line:17.start', v:5}, {t:'line:17.end', v:8, ease:'inout'}],
      advance:[{t:'line:17.start', v:0},
               {t:'line:17.w5',    v:3.5}, // word bind: شاف
               {t:'line:17.end',   v:4.5, ease:'inout'}] // front reaches the village roofs
    } }
];

// ---------------- SHOTS ---------------------------------------------------
const SHOTS_3a = [
  { id:'SH13', t0:'line:11.start', t1:'line:11.end', place:'COAST_VILLAGE', cam:CAM_SH13, sky:'clear' },
  { id:'SH14', t0:'line:12.start', t1:'line:12.end', place:'HILL_GRAVE',    cam:CAM_SH14, sky:'clear', grade:'quiet_haze' },
  { id:'SH15', t0:'line:13.start', t1:'line:13.end', place:'COAST_VILLAGE', cam:CAM_SH15,
    sky:[{t:'line:13.start', v:'clear'}, {t:36.10, v:'storm_bluegrey', ease:'step'}] }, // the snap
  { id:'SH16', t0:'line:14.start', t1:'line:14.end', place:'COAST_VILLAGE', cam:CAM_SH16, sky:'storm_bluegrey',
    sway:{targets:'set:poles', amp:0.06, f:1.9, t0:'line:14.start', t1:'line:14.end', env:'sin_pi'} }, // see CONFLICTS 3
  { id:'SH17', t0:'line:15.start', t1:'line:15.end', place:'SEA',           cam:CAM_SH17, sky:'storm_bluegrey' },
  { id:'SH18', t0:'line:16.start', t1:'line:16.end', place:'SEA',           cam:CAM_SH18, sky:'storm_bluegrey' },
  { id:'SH19', t0:'line:17.start', t1:'line:17.end', place:'FLASHBACK_ROCK', cam:CAM_SH19, grade:'sepia' }
];

MOMENTS
F933  t=31.10 SH13 — POINT: mocker_b hand tip >= 30
F942  t=31.40 SH13 — PROP: box_sh13 >= 60 [state: fetch == true]
F969  t=32.30 SH13 — FACE: mayor_old >= 120
F993  t=33.10 SH14 — PROP: gravestone_sh14 >= 90
F1026 t=34.20 SH14 — PROP: leaf_sh14 >= 25
F1056 t=35.20 SH14 — PROP: wall_distant_sh14 >= 40
F1083 t=36.10 SH15 — STATE: calendar page >= 14
F1101 t=36.70 SH15 — PROP: calendar >= 200 [state: page >= 14]
F1110 t=37.00 SH15 — PROP: calendar >= 220
F1131 t=37.70 SH16 — BODY: villagers >= 230
F1137 t=37.90 SH16 — PROP: birds_sh16 >= 25 [state: burst >= 0.5]
F1155 t=38.50 SH16 — FACE: villagers >= 80
F1188 t=39.60 SH17 — STATE: sea_sheet_sh17 pull >= 6
F1197 t=39.90 SH17 — PROP: boat_sh17_a >= 40 [state: pull >= 12]
F1215 t=40.50 SH17 — PROP: boat_sh17_b >= 40
F1257 t=41.90 SH18 — PROP: wave_sh18 >= 300 [state: h >= 8]
F1302 t=43.40 SH18 — PROP: measure_wave >= 200 [state: lineY >= 15]
F1335 t=44.50 SH18 — PROP: wave_sh18 >= 500 [state: h >= 17.5]
F1367 t=45.57 SH19 — FACE: mayor_young >= 45
F1410 t=47.00 SH19 — FACE: mayor_young >= 55
F1428 t=47.60 SH19 — PROP: wave_old_sh19 >= 120 [state: h >= 7]
Word-moment note: every word-keyed state reaches its threshold before the estimated word window and holds through line end (calendar 14 at 36.10; measure 15 at 43.20; wave 17.5 at 43.00; pull ≥6 by 39.60), and each carries a symbolic line:NN.wK hold-key, so the audit at the loader-resolved word time is identical to the declared numeric moment. SH18 wave h caps at 17.5 — strictly below the seawall's 18 D top.

NEW KINDS NEEDED
belongings_box — origin base centre; open cardboard box 0.75 w × 0.50 h × 0.55 d, rolled cloth + book corner above the rim; static geometry, transform keys only (pos); entry carries fetch:true (D1 fix of record).
gravestone — origin base centre; simple rounded-top slab 0.9 w × 1.5 h × 0.25 d, 4° back lean, no inscription dependence; static, no numeric keys.
leaf — origin centre; single oval leaf 0.28 × 0.16 with stem; keys pos (fall path) and rot (tumble); no build opts.
birds — origin perch point; flock of n=7 glyph birds (0.35 wingspan, two-triangle wings); key burst 0→1 drives per-index deterministic launch offsets (Δx ±4, Δy +3, Δz −2, closed forms of index and burst); flap = sin(2π·5·t + i) — pure in t; declare burst, n.
sea_sheet — origin sheet centre at y≈0.02 over the SEA floor; plane 120 (x) × 80 (z); key pull drives near edge z = 12 − pull (water occupies z < edge), foam line on the edge; declare pull.
wave — origin base centre at waterline; dark blue-grey breaking water wall, width w, depth 6, forward curl lip; keys h (crest height, 0→17.5) and advance (+z push); declare h, advance, w.

RATIONALE
SH13 — slow lateral track at street level, mayor leads camera 0.6 and faces 3/4 to it: the box reads in front of his chest, the three pointing mockers stay behind his shoulder near the hall door.
SH14 — gentle crane from the stone's base to above its top: gravestone holds frame centre while the far wall silhouette and the falling leaf enter on the rise; the leaf lands as the line ends.
SH15 — tight push-in on the calendar: pages fly 0→14 in 0.4 s and settle before the word "14"; the sky step-snaps to storm blue-grey on the same key.
SH16 — wide street with a full-shot sine-envelope shake (6.3/8.7 Hz, 0.26/0.18 D): poles sway, perched birds burst on اتهزت, five wide-eyed villagers rush doorways into the street.
SH17 — high-angle glide along the coast: the water edge drains 36 D seaward, both boats settle and list onto exposed sand exactly as the edge passes them.
SH18 — extreme low angle (0.65 D) on the drained sand, tilt-up to the crest: the 17.5 D water wall spans the horizon and overflows the top; the glowing measure climbs to exactly 15 before the word; four figures run past camera left to high ground.
SH19 — sepia glide from low beside the old village up the rock: young mayor's 3/4 face stays in the gaze cone the whole shot while the narrow old wave rolls over the village roofs to his left, never occluding him.

CONFLICTS
1. Pack gap — word times: audio/clean.json word timestamps are not in the brief pack. Word keys are symbolic (line:NN.wK, loader-resolved); declared numeric moment times are line-boundary-derived with uniform-word estimates, and all word-keyed states hold across the full plausible word window (see MOMENTS note). No staging is gambled on an exact word time.
2. HILL_GRAVE → "the distant silent wall": the literal COAST_WALL is 2400 D from HILL_GRAVE — a real sightline is geometrically impossible (sub-pixel at any legal fov). Staged honestly as an 18 D seawall-kind silhouette at 140 D on the hill's horizon (≈82 px at crane top). If the owner requires the literal wall, the beat cannot be staged inside the PLACES table — ruling requested.
3. Pack gap — set.js piece list: hall door, pole, calendar-wall and SEA-floor offsets are declared staging assumptions (door at village [−6,0,0.5]; calendar at [−1.5,1.7,0.25]; SEA floor reads as sand under sea_sheet). Pole sway is bound via SH16.sway to set:poles; if set poles are not keyable, Codex should bind or drop the descriptor — the اتهزت beat still reads measured via camera shake + bird burst + villager rush (all declared moments pass without it). If chunk 2's calendar entry lives in another place, this entry declares the village instance; the page channel is the law-1 declaration either way.

No other conflicts: the parked grey mayor is stowed by the named key mayor.hidden @ 'line:11.start' (stow:true); all hides sit on cuts; all key-driven build opts are declared; all fov samples lie in [32,50]; no camera enters a solid at any sampled key.
---
