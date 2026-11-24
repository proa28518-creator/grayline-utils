// scenes/film.js — «The Fourth Man on South Georgia» (Build Pass)
// 62.92 s · 30 fps · 1080×1920 (9:16) · 1,888 frames · Pure in t
// Voice & timing law: audio/clean.wav + audio/clean.json (20 narrator lines, who: null, 12–13 s pause held)
// Cast: 21 ready-made specs from cartoon/specs/ copied to scenes/cast/ (no new characters)
// Engine API compliant: exact voice schema, exact FACE_API enums, exact MOTION_API built-in clips, explicit camera.move

import { PLACES } from './set.js';

const P = (place, dx = 0, dy = 0, dz = 0) => [
  PLACES[place][0] + dx,
  PLACES[place][1] + dy,
  PLACES[place][2] + dz,
];

const P2 = (place, dx = 0, dz = 0) => [
  PLACES[place][0] + dx,
  PLACES[place][2] + dz,
];

// Exact 20 segments from audio/clean.json (1:1 verbatim as heard; who: null = narrator, no lip sync)
const voice = {
  file: 'audio/clean.wav',
  words: 'audio/clean.json',
  lines: [
    { who: null, text: 'سنة 1916،' },                                                                        // line:1  (0–1 s)
    { who: null, text: 'إرنست شاكلتون' },                                                                    // line:2  (1–2 s)
    { who: null, text: 'ماشي بقاله 36 ساعة' },                                                               // line:3  (2–4 s)
    { who: null, text: 'وسط جبال محدش في الدنيا رسملها خريطة.' },                                            // line:4  (4–7 s)
    { who: null, text: 'وفجأة، بدأ يحس بحاجة غريبة.' },                                                      // line:5  (7–9 s)
    { who: null, text: 'حاسس إن في راجل رابع ماشي جنبه.' },                                                  // line:6  (9–12 s) + 12–13 s pause held
    { who: null, text: 'بعد 16 يوم في مركب نجاة وسط المحيط الجنوبي،' },                                      // line:7  (13–16 s)
    { who: null, text: 'كان قدامه هو وفرانك ورسلي وتوم كرين' },                                               // line:8  (16–18 s)
    { who: null, text: 'طريق واحد بس عشان ينقذوا 22 راجل عالقين في آخر الدنيا على جزيرة الفيل:' },            // line:9  (18–23 s)
    { who: null, text: 'إنهم يعدوا جبال جورجيا الجنوبية الجليدية على رجليهم،' },                              // line:10 (23–26 s)
    { who: null, text: 'ومعهمش غير حبل وفأس ومسامير قلاووظ مثبتينها في نعل جزمهم.' },                        // line:11 (26–30 s)
    { who: null, text: 'من كتر التعب، ورسلي وكرين مقدروش يكملوا ووقعوا من النوم على التلج.' },                // line:12 (30–34 s)
    { who: null, text: 'شاكلتون سابهم يناموا خمس دقايق بالظبط،' },                                           // line:13 (34–36 s)
    { who: null, text: 'ولما صحاهم، كدب عليهم وقالهم إنهم ناموا نص ساعة كاملة.' },                            // line:14 (36–39 s)
    { who: null, text: 'في الوقت ده، شاكلتون مكنش حكى لحد عن الراجل الرابع اللي كان حاسس بيه،' },             // line:15 (39–44 s)
    { who: null, text: 'لحد ما ورسلي اعترف بعد كده إنه كان حاسس بنفس الإحساس،' },                             // line:16 (44–47 s)
    { who: null, text: 'وكرين كمان أكد نفس الكلام.' },                                                       // line:17 (47–49 s)
    { who: null, text: 'التلاتة، كل واحد لوحده، كانوا حاسين بكيان رابع معاهم.' },                            // line:18 (49–53 s)
    { who: null, text: 'مش بس هما؛ متسلقين وبحارة وناجين من كوارث كتير حكوا عن نفس الرفيق الخفي اللي محدش شافه،' }, // line:19 (53–59 s)
    { who: null, text: 'ظاهرة معروفة في علم النفس بـ "ظاهرة الرجل الثالث".' },                               // line:20 (59–63 s)
  ],
};

// Cast: 21 ready-made specs only (3 leads + 18 stranded-men pool; reused via acts.<id>.place)
const cast = {
  shackleton:    { spec: 'cast/s4_skipper.json',    at: P2('GLACIER_MARCH',  0.00,  1.2), ry: 12 },
  worsley:       { spec: 'cast/s4_lt.json',         at: P2('GLACIER_MARCH', -1.10, -1.6), ry: 14 },
  crean:         { spec: 'cast/s4_big.json',        at: P2('GLACIER_MARCH',  1.05, -3.4), ry: -10 },

  s4_kid:        { spec: 'cast/s4_kid.json',        at: P2('ELEPHANT_ISLAND', -1.05,  1.6), ry: 12 },
  s4_chief:      { spec: 'cast/s4_chief.json',      at: P2('ELEPHANT_ISLAND',  0.00,  1.2), ry: -6 },
  blind_gus:     { spec: 'cast/blind_gus.json',     at: P2('ELEPHANT_ISLAND',  1.05,  1.5), ry: -16 },
  s4_navy:       { spec: 'cast/s4_navy.json',       at: P2('ELEPHANT_ISLAND', -1.85, -0.6), ry: 18 },
  s4_cook:       { spec: 'cast/s4_cook.json',       at: P2('ELEPHANT_ISLAND',  1.85, -0.8), ry: -18 },
  s4_wire:       { spec: 'cast/s4_wire.json',       at: P2('ELEPHANT_ISLAND', -2.35, -2.6), ry: 20 },
  s4_smuggler:   { spec: 'cast/s4_smuggler.json',   at: P2('ELEPHANT_ISLAND',  2.35, -2.8), ry: -20 },
  farmer:        { spec: 'cast/farmer.json',        at: P2('ELEPHANT_ISLAND', -1.15, -3.6), ry: 12 },
  postman:       { spec: 'cast/postman.json',       at: P2('ELEPHANT_ISLAND',  1.15, -3.8), ry: -12 },
  townsperson:   { spec: 'cast/townsperson.json',   at: P2('ELEPHANT_ISLAND', -2.45, -5.2), ry: 18 },
  br_guy:        { spec: 'cast/br_guy.json',        at: P2('ELEPHANT_ISLAND',  2.45, -5.4), ry: -18 },
  proof_ray:     { spec: 'cast/proof_ray.json',     at: P2('ELEPHANT_ISLAND', -1.55, -6.8), ry: 14 },
  blind5_mo:     { spec: 'cast/blind5_mo.json',     at: P2('ELEPHANT_ISLAND',  1.55, -7.0), ry: -14 },
  blind3_okafor: { spec: 'cast/blind3_okafor.json', at: P2('ELEPHANT_ISLAND', -0.95, -8.4), ry: 10 },
  engineer:      { spec: 'cast/engineer.json',      at: P2('ELEPHANT_ISLAND',  0.95, -8.6), ry: -10 },
  bouncer:       { spec: 'cast/bouncer.json',       at: P2('ELEPHANT_ISLAND', -2.20, -9.8), ry: 18 },
  walter:        { spec: 'cast/walter.json',        at: P2('ELEPHANT_ISLAND',  2.20, -10.0), ry: -18 },
  br_w1:         { spec: 'cast/br_w1.json',         at: P2('ELEPHANT_ISLAND',  0.00, -11.2), ry: 4 },
};

// Acting: exact FACE_API enums & MOTION_API built-in clips; zero keys within 3 frames (0.10 s) of any interior cut
const acts = {
  shackleton: {
    place: [
      { t: 'line:1.start',         at: P2('GLACIER_MARCH',      0.0,  1.2), ry: 12 },
      { t: 'line:7.start',         at: P2('LIFEBOAT_SEA',       0.0, -2.5), y: 0.45, ry: 8 },
      { t: 'line:10.start',        at: P2('GLACIER_CROSSING',   0.0,  2.2), ry: 14 },
      { t: 'line:12.start',        at: P2('SNOW_SLEEP',         0.0,  0.4), ry: 10 },
      { t: 'line:15.start',        at: P2('SHELTER_CONFESSION', 0.0,  0.6), ry: 12 },
      { t: 'line:18.start+2.0',    at: P2('GLACIER_MARCH',     -0.2,  4.2), ry: 18 },
      { t: 'line:20.start',        at: P2('GLACIER_MARCH',      0.0,  5.0), ry: 16 },
    ],
    walk: [
      { t0: 'line:1.start',  path: [P2('GLACIER_MARCH', 0.0, 1.2), P2('GLACIER_MARCH', 0.0, 5.2)], speed: 0.56, slow: true },
      { t0: 'line:6.start',  path: [P2('GLACIER_MARCH', 0.0, 5.2), P2('GLACIER_MARCH', 0.0, 7.6)], speed: 0.58, slow: true },
      { t0: 'line:10.start', path: [P2('GLACIER_CROSSING', 0.0, 2.2), P2('GLACIER_CROSSING', 0.4, 4.4)], speed: 0.72, slow: true },
    ],
    look: [
      { t: 'line:1.start',         at: P('GLACIER_MARCH',      0.6, 2.1, 12.0) },
      { t: 'line:4.start+0.15',    at: P('GLACIER_MARCH',     -3.5, 2.5, 11.0) },
      { t: 'line:5.start+0.15',    at: P('GLACIER_MARCH',      4.2, 2.1,  8.5) },
      { t: 'line:6.start+0.15',    at: P('GLACIER_MARCH',      3.8, 2.0,  9.0) },
      { t: 'line:7.start+0.15',    at: P('LIFEBOAT_SEA',       0.5, 2.4,  8.0) },
      { t: 'line:10.start+0.15',   at: P('GLACIER_CROSSING',   0.5, 2.1, 14.0) },
      { t: 'line:12.start+0.15',   at: P('SNOW_SLEEP',        -1.5, 1.4,  3.5) },
      { t: 'line:13.start+0.15',   at: P('SNOW_SLEEP',         0.4, 1.8,  8.0) },
      { t: 'line:14.start+0.15',   at: P('SNOW_SLEEP',        -1.2, 1.6,  5.0) },
      { t: 'line:15.start+0.15',   at: P('SHELTER_CONFESSION', 0.5, 2.1, 10.0) },
      { t: 'line:15.start+2.65',   at: P('SHELTER_CONFESSION', 3.4, 2.1,  9.0) },
      { t: 'line:16.start+0.15',   at: P('SHELTER_CONFESSION',-2.2, 2.2,  3.5) },
      { t: 'line:17.start+0.15',   at: P('SHELTER_CONFESSION', 2.2, 2.2,  3.5) },
      { t: 'line:20.start+0.15',   at: P('GLACIER_MARCH',      1.8, 2.2, 14.0) },
    ],
    face: [
      { t: 0,                      eyes: 'wide',     brow: 'knit',    mouth: 'grid',  react: false },
      { t: 'line:2.start+0.14',    eyes: 'open',     brow: 'knit',    mouth: 'flat'  },
      { t: 'line:3.start+0.14',    eyes: 'half',     brow: 'down',    mouth: 'tight' },
      { t: 'line:4.start+0.14',    eyes: 'look_l',   brow: 'knit',    mouth: 'flat'  },
      { t: 'line:5.start+0.14',    eyes: 'wide',     brow: 'worried', mouth: 'o'     },
      { t: 'line:6.start+0.14',    eyes: 'pinpoint', brow: 'worried', mouth: 'tight' },
      { t: 'line:7.start+0.14',    eyes: 'wince',    brow: 'knit',    mouth: 'grid'  },
      { t: 'line:8.start+0.14',    eyes: 'angry',    brow: 'knit',    mouth: 'tight' },
      { t: 'line:10.start+0.14',   eyes: 'wince',    brow: 'knit',    mouth: 'grid'  },
      { t: 'line:12.start+0.14',   eyes: 'sad',      brow: 'worried', mouth: 'flat'  },
      { t: 'line:13.start+0.14',   eyes: 'open',     brow: 'down',    mouth: 'tight' },
      { t: 'line:14.start+0.14',   eyes: 'open',     brow: 'up',      mouth: 'smile' }, // Plays the kind lie warmly
      { t: 'line:15.start+0.14',   eyes: 'open',     brow: 'down',    mouth: 'tight' },
      { t: 'line:15.start+2.65',   eyes: 'look_r',   brow: 'worried', mouth: 'flat'  },
      { t: 'line:16.start+0.80',   eyes: 'wide',     brow: 'up',      mouth: 'o'     }, // Listener reaction 2f after confession
      { t: 'line:17.start+0.55',   eyes: 'pinpoint', brow: 'worried', mouth: 'gulp'  },
      { t: 'line:18.start+0.14',   eyes: 'wide',     brow: 'worried', mouth: 'flat'  },
      { t: 'line:20.start+0.14',   eyes: 'wide',     brow: 'up',      mouth: 'o'     },
    ],
    clips: [
      { clip: 'carry',      at: 'line:1.start',       params: { prop: 'adze_shackleton', side: 'R' }, hold: 12.6, out: 6, keep: false },
      { clip: 'lean_over',  at: 'line:2.start+0.15',  params: { deg: 14 }, hold: 1.0, out: 6 },
      { clip: 'point',      at: 'line:4.start+0.18',  params: { side: 'L', dir: [-0.45, 0.25, 0.2] }, hold: 1.4, out: 6 },
      { clip: 'shock_pop',  at: 'line:5.start+0.16',  params: { eyes: 'wide', body: true }, hold: 1.0, out: 6 },
      { clip: 'brace',      at: 'line:7.start+0.16',  params: { side: 'L' }, hold: 2.0, out: 6 },
      { clip: 'carry',      at: 'line:10.start+0.16', params: { prop: 'adze_shackleton', side: 'R' }, hold: 2.6, out: 6, keep: false },
      { clip: 'lean_over',  at: 'line:10.start+0.20', params: { deg: 14 }, hold: 1.8, out: 6 },
      { clip: 'carry',      at: 'line:13.start+0.16', params: { prop: 'pocket_watch', side: 'R' }, hold: 1.3, out: 6, keep: false },
      { clip: 'point',      at: 'line:14.start+0.16', params: { side: 'L', dir: [-0.35, -0.1, 0.25] }, hold: 1.4, out: 6 },
      { clip: 'sip',        at: 'line:15.start+0.40', params: { prop: 'tin_mug_shackleton', hold: 18 } },
      { clip: 'head_turn',  at: 'line:18.start+0.16', params: { yaw: -24 }, hold: 1.2, out: 6 },
      { clip: 'head_turn',  at: 'line:20.start+0.16', params: { yaw: 22 }, hold: 1.0, out: 6 },
    ],
  },

  worsley: {
    place: [
      { t: 'line:1.start',         at: P2('GLACIER_MARCH',     -1.10, -1.6), ry: 14 },
      { t: 'line:7.start',         at: P2('LIFEBOAT_SEA',      -0.9,  0.4), y: 0.42, ry: 18 },
      { t: 'line:10.start',        at: P2('GLACIER_CROSSING',  -1.10, -0.4), ry: 16 },
      { t: 'line:12.start',        at: P2('SNOW_SLEEP',        -1.65,  1.2), ry: 22 },
      { t: 'line:15.start',        at: P2('SHELTER_CONFESSION',-2.15,  0.4), ry: 24 },
      { t: 'line:18.start+2.0',    at: P2('GLACIER_MARCH',     -1.10,  1.8), ry: 16 },
    ],
    walk: [
      { t0: 'line:1.start',  path: [P2('GLACIER_MARCH', -1.10, -1.6), P2('GLACIER_MARCH', -1.10, 2.4)], speed: 0.56, slow: true },
      { t0: 'line:6.start',  path: [P2('GLACIER_MARCH', -1.10,  2.4), P2('GLACIER_MARCH', -1.10, 4.8)], speed: 0.58, slow: true },
      { t0: 'line:10.start', path: [P2('GLACIER_CROSSING', -1.10, -0.4), P2('GLACIER_CROSSING', -0.95, 1.8)], speed: 0.72, slow: true },
    ],
    look: [
      { t: 'line:1.start',         at: P('GLACIER_MARCH',     -0.5, 2.2, 12.0) },
      { t: 'line:5.start+0.22',    at: P('GLACIER_MARCH',      2.4, 2.1,  8.0) },
      { t: 'line:7.start+0.15',    at: P('LIFEBOAT_SEA',       0.5, 2.2,  8.0) },
      { t: 'line:12.start+0.15',   at: P('SNOW_SLEEP',        -0.5, 1.4,  6.0) },
      { t: 'line:14.start+0.95',   at: P('SNOW_SLEEP',         0.2, 2.1,  2.5) },
      { t: 'line:15.start+0.15',   at: P('SHELTER_CONFESSION', 0.2, 2.1,  8.0) },
      { t: 'line:16.start+0.15',   at: P('SHELTER_CONFESSION', 0.6, 2.2,  9.5) },
    ],
    face: [
      { t: 'line:1.start',         eyes: 'half',     brow: 'knit',    mouth: 'tight' },
      { t: 'line:5.start+0.22',    eyes: 'wide',     brow: 'worried', mouth: 'flat'  },
      { t: 'line:7.start+0.14',    eyes: 'wince',    brow: 'knit',    mouth: 'grid'  },
      { t: 'line:10.start+0.14',   eyes: 'wince',    brow: 'knit',    mouth: 'tight' },
      { t: 'line:12.start+0.14',   eyes: 'blink',    brow: 'worried', mouth: 'rest',  hold: true, react: false },
      { t: 'line:14.start+0.95',   eyes: 'wide',     brow: 'up',      mouth: 'o'     },
      { t: 'line:15.start+0.14',   eyes: 'open',     brow: 'on',      mouth: 'rest'  },
      { t: 'line:16.start+0.14',   eyes: 'wide',     brow: 'worried', mouth: 'D'     }, // Confessing
      { t: 'line:17.start+0.55',   eyes: 'pinpoint', brow: 'worried', mouth: 'flat'  },
      { t: 'line:18.start+0.14',   eyes: 'wide',     brow: 'up',      mouth: 'flat'  },
    ],
    clips: [
      { clip: 'lean_over',  at: 'line:7.start+0.18',  params: { deg: 20 }, hold: 2.2, out: 6 },
      { clip: 'wince',      at: 'line:8.start+0.18',  params: { mouth: 'grid' }, hold: 1.2, out: 6 },
      { clip: 'sit_down',   at: 'line:12.start+0.18', params: { seat: 0.45 } },
      { clip: 'stand_up',   at: 'line:14.start+0.95', params: { from: 'sit' } },
      { clip: 'lean_over',  at: 'line:16.start+0.18', params: { deg: 14 }, hold: 2.1, out: 6 },
      { clip: 'talk_hands', at: 'line:16.start+0.22', params: { dur: 2.2, side: 'R' } },
      { clip: 'head_turn',  at: 'line:18.start+0.18', params: { yaw: 24 }, hold: 1.2, out: 6 },
    ],
  },

  crean: {
    place: [
      { t: 'line:1.start',         at: P2('GLACIER_MARCH',      1.05, -3.4), ry: -10 },
      { t: 'line:7.start',         at: P2('LIFEBOAT_SEA',       0.9,  1.2), y: 0.42, ry: -16 },
      { t: 'line:10.start',        at: P2('GLACIER_CROSSING',   1.05, -2.2), ry: -14 },
      { t: 'line:12.start',        at: P2('SNOW_SLEEP',         1.65,  1.0), ry: -20 },
      { t: 'line:15.start',        at: P2('SHELTER_CONFESSION', 2.15,  0.4), ry: -22 },
      { t: 'line:18.start+2.0',    at: P2('GLACIER_MARCH',      1.05,  0.2), ry: -12 },
    ],
    walk: [
      { t0: 'line:1.start',  path: [P2('GLACIER_MARCH', 1.05, -3.4), P2('GLACIER_MARCH', 1.05, 0.6)], speed: 0.56, slow: true },
      { t0: 'line:6.start',  path: [P2('GLACIER_MARCH', 1.05,  0.6), P2('GLACIER_MARCH', 1.05, 3.0)], speed: 0.58, slow: true },
      { t0: 'line:10.start', path: [P2('GLACIER_CROSSING', 1.05, -2.2), P2('GLACIER_CROSSING', 1.05, 0.0)], speed: 0.72, slow: true },
    ],
    look: [
      { t: 'line:1.start',         at: P('GLACIER_MARCH',      0.5, 2.2, 12.0) },
      { t: 'line:7.start+0.15',    at: P('LIFEBOAT_SEA',      -0.4, 2.2,  8.0) },
      { t: 'line:12.start+0.15',   at: P('SNOW_SLEEP',         0.5, 1.4,  6.0) },
      { t: 'line:15.start+0.15',   at: P('SHELTER_CONFESSION',-0.2, 2.1,  8.0) },
      { t: 'line:17.start+0.15',   at: P('SHELTER_CONFESSION',-0.6, 2.2,  9.5) },
    ],
    face: [
      { t: 'line:1.start',         eyes: 'wide',     brow: 'knit',    mouth: 'tight', react: false },
      { t: 'line:7.start+0.14',    eyes: 'angry',    brow: 'knit',    mouth: 'grid'  },
      { t: 'line:10.start+0.14',   eyes: 'wince',    brow: 'knit',    mouth: 'tight' },
      { t: 'line:12.start+0.14',   eyes: 'blink',    brow: 'worried', mouth: 'flat',  hold: true, react: false },
      { t: 'line:14.start+1.05',   eyes: 'open',     brow: 'up',      mouth: 'flat'  },
      { t: 'line:15.start+0.14',   eyes: 'open',     brow: 'on',      mouth: 'rest'  },
      { t: 'line:16.start+0.88',   eyes: 'wide',     brow: 'up',      mouth: 'o'     },
      { t: 'line:17.start+0.14',   eyes: 'open',     brow: 'knit',    mouth: 'D'     }, // Confirming
      { t: 'line:18.start+0.14',   eyes: 'wide',     brow: 'worried', mouth: 'flat'  },
    ],
    clips: [
      { clip: 'lean_over',  at: 'line:7.start+0.20',  params: { deg: 22 }, hold: 2.2, out: 6 },
      { clip: 'sit_down',   at: 'line:12.start+0.20', params: { seat: 0.45 } },
      { clip: 'stand_up',   at: 'line:14.start+1.05', params: { from: 'sit' } },
      { clip: 'point',      at: 'line:17.start+0.16', params: { side: 'L', dir: [-0.4, 0.15, 0.25] }, hold: 1.2, out: 6 },
      { clip: 'head_turn',  at: 'line:18.start+0.18', params: { yaw: -24 }, hold: 1.2, out: 6 },
    ],
  },

  // Elephant Island foreground stranded men
  s4_kid: {
    look: [{ t: 'line:9.start+0.15', at: P('ELEPHANT_ISLAND', -0.4, 2.0, 14.0) }],
    face: [
      { t: 'line:9.start+0.14', eyes: 'wide', brow: 'worried', mouth: 'o'     },
      { t: 'line:9.start+2.65', eyes: 'sad',  brow: 'worried', mouth: 'tight' },
    ],
    clips: [{ clip: 'wave', at: 'line:9.start+0.20', params: { side: 'R', hold: 16 }, hold: 1.5, out: 6 }],
  },
  s4_chief: {
    look: [{ t: 'line:9.start+0.15', at: P('ELEPHANT_ISLAND', 0.2, 2.0, 14.0) }],
    face: [{ t: 'line:9.start+0.14', eyes: 'wince', brow: 'knit', mouth: 'flat' }],
    clips: [{ clip: 'hand_to_temple', at: 'line:9.start+0.24', params: { side: 'L', hold: 24 }, hold: 1.5, out: 6 }],
  },
  blind_gus: {
    look: [{ t: 'line:9.start+0.15', at: P('ELEPHANT_ISLAND', 0.8, 2.0, 14.0) }],
    face: [{ t: 'line:9.start+0.14', eyes: 'sad', brow: 'worried', mouth: 'tight' }],
    clips: [{ clip: 'brace', at: 'line:9.start+0.28', params: { side: 'R' }, hold: 1.6, out: 6 }],
  },

  // Beat 6 Vignettes — reused from stranded-men pool via place keys (never cast copies)
  br_guy: {
    place: [
      { t: 'line:9.start',  at: P2('ELEPHANT_ISLAND',    2.45, -5.4), ry: -18 },
      { t: 'line:19.start', at: P2('LANDING_VIGNETTES', -0.4,  0.4), ry: 12 }, // Bay A: Lone Climber
    ],
    walk: [{ t0: 'line:19.start', path: [P2('LANDING_VIGNETTES', -0.4, 0.4), P2('LANDING_VIGNETTES', -0.4, 1.8)], speed: 0.65, slow: true }],
    look: [{ t: 'line:19.start+0.15', at: P('LANDING_VIGNETTES', 2.4, 2.1, 8.5) }],
    face: [{ t: 'line:19.start+0.14', eyes: 'wide', brow: 'worried', mouth: 'flat' }],
    clips: [{ clip: 'shock_pop', at: 'line:19.start+0.18', params: { eyes: 'wide', body: true }, hold: 1.2, out: 6 }],
  },
  s4_navy: {
    place: [
      { t: 'line:9.start',      at: P2('ELEPHANT_ISLAND',   -1.85, -0.6), ry: 18 },
      { t: 'line:19.start+2.0', at: P2('LANDING_VIGNETTES', 45.0,  0.0), ry: 10 }, // Bay B: Lone Sailor
    ],
    look: [{ t: 'line:19.start+2.15', at: P('LANDING_VIGNETTES', 42.2, 2.1, 8.0) }],
    face: [{ t: 'line:19.start+2.14', eyes: 'pinpoint', brow: 'worried', mouth: 'tight' }],
    clips: [{ clip: 'brace', at: 'line:19.start+2.18', params: { side: 'L' }, hold: 1.2, out: 6 }],
  },
  proof_ray: {
    place: [
      { t: 'line:9.start',      at: P2('ELEPHANT_ISLAND',   -1.55, -6.8), ry: 14 },
      { t: 'line:19.start+4.0', at: P2('LANDING_VIGNETTES', 90.0,  0.2), ry: -10 }, // Bay C: Lone Survivor
    ],
    walk: [{ t0: 'line:19.start+4.0', path: [P2('LANDING_VIGNETTES', 90.0, 0.2), P2('LANDING_VIGNETTES', 90.0, 1.4)], speed: 0.55, slow: true }],
    look: [{ t: 'line:19.start+4.15', at: P('LANDING_VIGNETTES', 92.6, 2.1, 8.5) }],
    face: [{ t: 'line:19.start+4.14', eyes: 'wide', brow: 'up', mouth: 'rest' }],
    clips: [{ clip: 'head_turn', at: 'line:19.start+4.18', params: { yaw: 24 }, hold: 1.2, out: 6 }],
  },
};

// Story props tracked by PROP GUARD (cut-aligned visibility, zero jumps; Loader Law 1 top-level opts declared)
const props = [
  {
    id: 'adze_shackleton',
    kind: 'adze',
    owner: 'shackleton',
    in: 'hand:R',
    at: [0, 0, 0],
    rot: [0, 0, 180],
    scale: 0.92,
    keys: [
      { t: 'line:1.start',  in: 'hand:R' },
      { t: 'line:7.start',  in: 'hidden' },
      { t: 'line:10.start', in: 'hand:R' },
      { t: 'line:12.start', in: 'hidden' },
    ],
  },
  {
    id: 'pocket_watch',
    kind: 'pocket_watch',
    owner: 'shackleton',
    in: 'hidden',
    at: [0, 0, 0],
    rot: [0, 0, 0],
    open: 1,
    keys: [
      { t: 'line:1.start',  in: 'hidden', open: 0 },
      { t: 'line:13.start', in: 'hand:R', open: 1, ease: 0.2 },
      { t: 'line:14.start', in: 'hidden', open: 0 },
    ],
  },
  {
    id: 'tin_mug_shackleton',
    kind: 'mug',
    owner: 'shackleton',
    in: 'hidden',
    at: [0, 0, 0],
    rot: [0, 0, 0],
    keys: [
      { t: 'line:1.start',  in: 'hidden' },
      { t: 'line:15.start', in: 'hand:R' },
      { t: 'line:18.start+2.0', in: 'hidden' },
    ],
  },
];

// 28 dynamic shots across 6 beats — explicit camera.move: 'push', roll: [r0, r1], fov in [25, 36]
const shots = [
  // === BEAT 1: THE MARCH + THE STRANGE FEELING (0–13 s, GLACIER_MARCH) — DREAD CUTS ===
  {
    id: 'SH01', // Frame 0: True low close-up on Shackleton (>=430 px whole shot, chest crop), tracking walk
    t0: 'line:1.start',
    t1: 'line:2.end',
    place: 'GLACIER_MARCH',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:1.start',
      t1: 'line:2.end',
      from: { pos: P('GLACIER_MARCH',  2.65, 1.62,  9.20), target: P('GLACIER_MARCH', 0.0, 1.98, 1.2), fov: 26 },
      to:   { pos: P('GLACIER_MARCH',  2.45, 1.68,  9.65), target: P('GLACIER_MARCH', 0.0, 2.00, 2.3), fov: 25 },
      roll: [3.0, 2.2],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH02', // Upper talking band (380-430 px), -29 deg tracking lead walkers, clears Worsley from left edge
    t0: 'line:3.start',
    t1: 'line:3.end',
    place: 'GLACIER_MARCH',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:3.start',
      t1: 'line:3.end',
      from: { pos: P('GLACIER_MARCH', -4.75, 1.56, 11.10), target: P('GLACIER_MARCH', 0.0, 1.96, 2.4), fov: 27 },
      to:   { pos: P('GLACIER_MARCH', -4.45, 1.62, 11.60), target: P('GLACIER_MARCH', 0.0, 1.98, 3.5), fov: 27 },
      roll: [-3.2, -2.2],
      ease: 'linear',
    },
  },
  {
    id: 'SH03', // Beat 1 establishing wide (190->215 px), +24 deg along glacier depth, footprints below
    t0: 'line:4.start',
    t1: 'line:4.end',
    place: 'GLACIER_MARCH',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:4.start',
      t1: 'line:4.end',
      from: { pos: P('GLACIER_MARCH',  6.8, 1.66, 18.6), target: P('GLACIER_MARCH', 0.0, 1.95, 3.6), fov: 33 },
      to:   { pos: P('GLACIER_MARCH',  6.0, 1.72, 18.8), target: P('GLACIER_MARCH', 0.0, 1.95, 5.1), fov: 33 },
      roll: [2.8, 2.0],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH04', // Reaction push-in (380-430 px) from non-adze +19 deg side so carried adze clears face
    t0: 'line:5.start',
    t1: 'line:5.end',
    place: 'GLACIER_MARCH',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:5.start',
      t1: 'line:5.end',
      from: { pos: P('GLACIER_MARCH',  3.45, 1.50, 15.10), target: P('GLACIER_MARCH', 0.0, 1.96, 5.2), fov: 26 },
      to:   { pos: P('GLACIER_MARCH',  3.20, 1.56, 14.45), target: P('GLACIER_MARCH', 0.0, 1.98, 5.2), fov: 26 },
      roll: [-2.2, -4.2],
      ease: 'inOutQuad',
    },
  },
  {
    id: 'SH05', // Footprints crane UP & IN from non-adze +21 deg side (clears adze), ends in 380-430 px band, settles into pause
    t0: 'line:6.start',
    t1: 'line:6.end+1.0',
    place: 'GLACIER_MARCH',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:6.start',
      t1: 'line:6.end+1.0',
      from: { pos: P('GLACIER_MARCH',  4.80, 1.18, 17.60), target: P('GLACIER_MARCH', 0.2, 0.30, 5.0), fov: 30 },
      to:   { pos: P('GLACIER_MARCH',  3.60, 1.66, 16.70), target: P('GLACIER_MARCH', 0.0, 1.96, 7.6), fov: 27 },
      roll: [2.6, 0.0],
      ease: 'outCubic',
    },
  },

  // === BEAT 2: FLASHBACK — LIFEBOAT + ELEPHANT ISLAND (13–23 s) ===
  {
    id: 'SH06', // James Caird: rides near the boat's long axis (~9 deg), chest-to-eye, +12.5% push, sea roll
    t0: 'line:7.start',
    t1: 'line:7.end',
    place: 'LIFEBOAT_SEA',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:7.start',
      t1: 'line:7.end',
      from: { pos: P('LIFEBOAT_SEA',  1.9, 1.78, 10.6), target: P('LIFEBOAT_SEA', 0.0, 1.85, -1.2), fov: 30 },
      to:   { pos: P('LIFEBOAT_SEA',  1.5, 1.84,  9.6), target: P('LIFEBOAT_SEA', 0.0, 1.88, -1.2), fov: 29 },
      roll: [-3.5, 3.0],
      ease: 'inOutSine',
    },
  },
  {
    id: 'SH07', // James Caird: contrasting 3/4 rowing-side angle (-34 deg), closer, +12% push
    t0: 'line:8.start',
    t1: 'line:8.end',
    place: 'LIFEBOAT_SEA',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:8.start',
      t1: 'line:8.end',
      from: { pos: P('LIFEBOAT_SEA', -5.8, 1.72,  7.6), target: P('LIFEBOAT_SEA', 0.2, 1.88, -1.2), fov: 29 },
      to:   { pos: P('LIFEBOAT_SEA', -5.1, 1.78,  6.7), target: P('LIFEBOAT_SEA', 0.2, 1.90, -1.2), fov: 29 },
      roll: [3.2, -2.6],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH08', // Elephant Island establishing wide: foreground heads in 180-250 band (200->226 px, +13%), +22 deg
    t0: 'line:9.start',
    t1: 'line:9.start+2.5',
    place: 'ELEPHANT_ISLAND',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:9.start',
      t1: 'line:9.start+2.5',
      from: { pos: P('ELEPHANT_ISLAND',  6.2, 1.72, 16.4), target: P('ELEPHANT_ISLAND', -0.2, 1.82, 0.4), fov: 32 },
      to:   { pos: P('ELEPHANT_ISLAND',  5.5, 1.78, 14.6), target: P('ELEPHANT_ISLAND', -0.2, 1.84, 0.4), fov: 32 },
      roll: [-1.8, 1.2],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH09', // Elephant Island tighten: opposite 3/4 left (-23 deg) on foreground faces (295->334 px, +13%), depth behind
    t0: 'line:9.start+2.5',
    t1: 'line:9.end',
    place: 'ELEPHANT_ISLAND',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:9.start+2.5',
      t1: 'line:9.end',
      from: { pos: P('ELEPHANT_ISLAND', -4.7, 1.68, 12.1), target: P('ELEPHANT_ISLAND', 0.0, 1.85, 1.2), fov: 30 },
      to:   { pos: P('ELEPHANT_ISLAND', -4.1, 1.74, 10.8), target: P('ELEPHANT_ISLAND', 0.0, 1.88, 1.2), fov: 30 },
      roll: [2.0, -1.4],
      ease: 'outCubic',
    },
  },

  // === BEAT 3: THE CROSSING + MANDATORY §7 BIG CLOSE-UPS (23–30 s, GLACIER_CROSSING) ===
  {
    id: 'SH10', // Crossing opener: low (+31 deg) against the slope from walking side, +13% push
    t0: 'line:10.start',
    t1: 'line:10.end',
    place: 'GLACIER_CROSSING',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:10.start',
      t1: 'line:10.end',
      from: { pos: P('GLACIER_CROSSING',  6.8, 1.38, 13.8), target: P('GLACIER_CROSSING', 0.1, 1.92, 2.4), fov: 30 },
      to:   { pos: P('GLACIER_CROSSING',  6.4, 1.48, 14.6), target: P('GLACIER_CROSSING', 0.4, 1.96, 4.4), fov: 30 },
      roll: [-2.8, 1.8],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH11', // §7 MANDATORY CLOSE-UP (Frame 801 — Build Repair 3): Boot screws biting ice
    t0: 'line:11.start',
    t1: 'line:11.start+1.35',
    place: 'GLACIER_CROSSING',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:11.start',
      t1: 'line:11.start+1.35',
      from: { pos: P('GLACIER_CROSSING', 23.22, 1.86, -0.02), target: P('GLACIER_CROSSING', 22.26, 1.52, -5.78), fov: 28 },
      to:   { pos: P('GLACIER_CROSSING', 23.16, 1.84, -0.36), target: P('GLACIER_CROSSING', 22.26, 1.52, -5.78), fov: 27 },
      roll: [-2.0, 1.5],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH12', // §7 MANDATORY CLOSE-UP (Frame 840 — Build Repair 3): Adze mid-swing biting ice + ice chips + gripping hands/forearms
    t0: 'line:11.start+1.35',
    t1: 'line:11.start+2.65',
    place: 'GLACIER_CROSSING',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:11.start+1.35',
      t1: 'line:11.start+2.65',
      from: { pos: P('GLACIER_CROSSING', 50.17, 2.08, 1.75), target: P('GLACIER_CROSSING', 49.94, 1.65, -5.48), fov: 27 },
      to:   { pos: P('GLACIER_CROSSING', 50.16, 2.06, 1.40), target: P('GLACIER_CROSSING', 49.94, 1.65, -5.48), fov: 26 },
      roll: [1.2, -0.8],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH13', // §7 MANDATORY CLOSE-UP (Frame 882 — RE-STAGED): Two hands gripping taut diagonal rope over hero's shoulder
    t0: 'line:11.start+2.65',
    t1: 'line:11.end',
    place: 'GLACIER_CROSSING',
    camera: {
      move: 'push',
      t0: 'line:11.start+2.65',
      t1: 'line:11.end',
      from: { pos: P('GLACIER_CROSSING', 50.45, 1.90, -1.15), target: P('GLACIER_CROSSING', 50.00, 1.74, -5.50), fov: 28 },
      to:   { pos: P('GLACIER_CROSSING', 49.85, 1.82, -1.65), target: P('GLACIER_CROSSING', 50.00, 1.70, -5.50), fov: 26 },
      roll: [-1.2, 0.8],
      ease: 'outCubic',
    },
  },

  // === BEAT 4: THE SLEEP BEAT (30–39 s, SNOW_SLEEP — cold blue arc) ===
  {
    id: 'SH14', // Low 3/4 left (-29 deg) against slope: Shackleton standing over the collapse (+13%)
    t0: 'line:12.start',
    t1: 'line:12.start+2.0',
    place: 'SNOW_SLEEP',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:12.start',
      t1: 'line:12.start+2.0',
      from: { pos: P('SNOW_SLEEP', -7.6, 1.36, 14.6), target: P('SNOW_SLEEP', 0.0, 1.60, 0.8), fov: 32 },
      to:   { pos: P('SNOW_SLEEP', -6.8, 1.42, 13.0), target: P('SNOW_SLEEP', 0.0, 1.62, 0.8), fov: 32 },
      roll: [2.2, -1.2],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH15', // Upper talking band (380-430 px), opposite low +28 deg side to SH14, separates sleepers & clears lamp
    t0: 'line:12.start+2.0',
    t1: 'line:12.end',
    place: 'SNOW_SLEEP',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:12.start+2.0',
      t1: 'line:12.end',
      from: { pos: P('SNOW_SLEEP',  4.10, 1.38,  9.65), target: P('SNOW_SLEEP', -0.45, 1.72, 0.4), fov: 27 },
      to:   { pos: P('SNOW_SLEEP',  3.80, 1.44,  9.05), target: P('SNOW_SLEEP', -0.45, 1.74, 0.4), fov: 27 },
      roll: [-3.2, -2.2],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH16', // 5-minute pocket-watch solo CU: keeps close-up class, +12% Dread Cuts push (-18 deg)
    t0: 'line:13.start',
    t1: 'line:13.end',
    place: 'SNOW_SLEEP',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:13.start',
      t1: 'line:13.end',
      from: { pos: P('SNOW_SLEEP', -2.7, 1.72,  8.8), target: P('SNOW_SLEEP', 0.0, 1.90, 0.4), fov: 25 },
      to:   { pos: P('SNOW_SLEEP', -2.4, 1.76,  7.9), target: P('SNOW_SLEEP', 0.0, 1.92, 0.4), fov: 25 },
      roll: [1.6, -1.8],
      ease: 'inOutQuad',
    },
  },
  {
    id: 'SH17', // The kind lie: medium-close (325->368 px, +13%) on Shackleton (+22 deg) as he wakes them
    t0: 'line:14.start',
    t1: 'line:14.end',
    place: 'SNOW_SLEEP',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:14.start',
      t1: 'line:14.end',
      from: { pos: P('SNOW_SLEEP',  4.5, 1.68, 11.5), target: P('SNOW_SLEEP', 0.0, 1.88, 0.4), fov: 27 },
      to:   { pos: P('SNOW_SLEEP',  4.0, 1.74, 10.2), target: P('SNOW_SLEEP', 0.0, 1.90, 0.4), fov: 27 },
      roll: [-1.8, 1.2],
      ease: 'outCubic',
    },
  },

  // === BEAT 5: THE CONFESSIONS (39–53 s, SHELTER_CONFESSION — warm amber arc) ===
  {
    id: 'SH18', // Shelter establishing wide (200->228 px, +14%): -20 deg along hall depth toward stove & storm window
    t0: 'line:15.start',
    t1: 'line:15.start+2.5',
    place: 'SHELTER_CONFESSION',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:15.start',
      t1: 'line:15.start+2.5',
      from: { pos: P('SHELTER_CONFESSION', -5.6, 1.66, 16.0), target: P('SHELTER_CONFESSION', 0.0, 1.88, 0.4), fov: 32 },
      to:   { pos: P('SHELTER_CONFESSION', -4.9, 1.72, 14.1), target: P('SHELTER_CONFESSION', 0.0, 1.90, 0.4), fov: 32 },
      roll: [2.8, 2.2],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH19', // Confession 1 (Shackleton): low 3/4 right (+24 deg), talking band (350->396 px, +13%)
    t0: 'line:15.start+2.5',
    t1: 'line:15.end',
    place: 'SHELTER_CONFESSION',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:15.start+2.5',
      t1: 'line:15.end',
      from: { pos: P('SHELTER_CONFESSION',  4.6, 1.54, 11.0), target: P('SHELTER_CONFESSION', 0.0, 1.92, 0.6), fov: 26 },
      to:   { pos: P('SHELTER_CONFESSION',  4.1, 1.60,  9.8), target: P('SHELTER_CONFESSION', 0.0, 1.94, 0.6), fov: 26 },
      roll: [-2.2, 1.4],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH20', // Confession 2 (Worsley): true close-up (>=430 px first->last, chest crop), higher OTS-angled +26 deg
    t0: 'line:16.start',
    t1: 'line:16.end',
    place: 'SHELTER_CONFESSION',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:16.start',
      t1: 'line:16.end',
      from: { pos: P('SHELTER_CONFESSION',  1.45, 1.84,  7.90), target: P('SHELTER_CONFESSION', -2.15, 1.96, 0.4), fov: 25 },
      to:   { pos: P('SHELTER_CONFESSION',  1.15, 1.88,  7.25), target: P('SHELTER_CONFESSION', -2.15, 1.98, 0.4), fov: 25 },
      roll: [3.2, 2.2],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH21', // Confession 3 (Crean): straighter, tighter, lower left-front (-17 deg), talking band (370->418 px, +13%)
    t0: 'line:17.start',
    t1: 'line:17.end',
    place: 'SHELTER_CONFESSION',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:17.start',
      t1: 'line:17.end',
      from: { pos: P('SHELTER_CONFESSION', -1.2, 1.62, 11.2), target: P('SHELTER_CONFESSION',  2.15, 2.02, 0.4), fov: 25 },
      to:   { pos: P('SHELTER_CONFESSION', -0.8, 1.66, 10.0), target: P('SHELTER_CONFESSION',  2.15, 2.04, 0.4), fov: 25 },
      roll: [-1.8, 2.2],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH22A', // Trio realisation: real 18-deg lateral orbit + push (-24 deg -> -6 deg, +13%)
    t0: 'line:18.start',
    t1: 'line:18.start+2.0',
    place: 'SHELTER_CONFESSION',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:18.start',
      t1: 'line:18.start+2.0',
      from: { pos: P('SHELTER_CONFESSION', -6.4, 1.72, 14.8), target: P('SHELTER_CONFESSION', 0.0, 1.92, 0.5), fov: 32 },
      to:   { pos: P('SHELTER_CONFESSION', -1.4, 1.78, 14.4), target: P('SHELTER_CONFESSION', 0.0, 1.94, 0.5), fov: 32 },
      roll: [2.0, -2.0],
      ease: 'inOutSine',
    },
  },
  {
    id: 'SH22B', // March memory: upper talking band (380-430 px), low -26 deg separates heads & clears right-edge slicing
    t0: 'line:18.start+2.0',
    t1: 'line:18.end',
    place: 'GLACIER_MARCH',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:18.start+2.0',
      t1: 'line:18.end',
      from: { pos: P('GLACIER_MARCH', -5.25, 1.44, 12.85), target: P('GLACIER_MARCH', -0.05, 1.94, 4.2), fov: 27 },
      to:   { pos: P('GLACIER_MARCH', -4.95, 1.50, 12.35), target: P('GLACIER_MARCH', -0.05, 1.96, 4.2), fov: 27 },
      roll: [3.4, 2.2],
      ease: 'outCubic',
    },
  },

  // === BEAT 6: THE LANDING — VIGNETTES + REVELATION + FINAL TITLE (53–62.92 s) ===
  {
    id: 'SH23', // Vignette A (Climber): low 3/4 right (+26 deg) against the snow ridge, +14% push
    t0: 'line:19.start',
    t1: 'line:19.start+2.0',
    place: 'LANDING_VIGNETTES',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:19.start',
      t1: 'line:19.start+2.0',
      from: { pos: P('LANDING_VIGNETTES',  4.5, 1.38, 10.8), target: P('LANDING_VIGNETTES', -0.4, 1.92, 0.8), fov: 27 },
      to:   { pos: P('LANDING_VIGNETTES',  4.1, 1.44, 10.8), target: P('LANDING_VIGNETTES', -0.4, 1.94, 1.6), fov: 27 },
      roll: [-2.4, 1.4],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH24', // Vignette B (Sailor): along ship deck's long axis (-14 deg), +13% push, sea roll
    t0: 'line:19.start+2.0',
    t1: 'line:19.start+4.0',
    place: 'LANDING_VIGNETTES',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:19.start+2.0',
      t1: 'line:19.start+4.0',
      from: { pos: P('LANDING_VIGNETTES', 42.3, 1.78, 10.6), target: P('LANDING_VIGNETTES', 45.0, 1.95, 0.0), fov: 28 },
      to:   { pos: P('LANDING_VIGNETTES', 42.6, 1.84,  9.4), target: P('LANDING_VIGNETTES', 45.0, 1.98, 0.0), fov: 28 },
      roll: [2.6, -2.2],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH25', // Vignette C (Survivor): tighter 3/4 left (-24 deg), +13% push
    t0: 'line:19.start+4.0',
    t1: 'line:19.end',
    place: 'LANDING_VIGNETTES',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:19.start+4.0',
      t1: 'line:19.end',
      from: { pos: P('LANDING_VIGNETTES', 86.0, 1.60, 10.2), target: P('LANDING_VIGNETTES', 90.0, 1.95, 0.6), fov: 26 },
      to:   { pos: P('LANDING_VIGNETTES', 86.4, 1.66, 10.0), target: P('LANDING_VIGNETTES', 90.0, 1.98, 1.3), fov: 26 },
      roll: [-1.8, 2.0],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH26A', // Closing face push-in (Dread Cuts): starts ~310 px, ends >=430 px (chest crop) on Shackleton, roll settles to 0
    t0: 'line:20.start',
    t1: 'line:20.start+1.8',
    place: 'GLACIER_MARCH',
    lowCam: true,
    camera: {
      move: 'push',
      t0: 'line:20.start',
      t1: 'line:20.start+1.8',
      from: { pos: P('GLACIER_MARCH',  3.90, 1.62, 16.80), target: P('GLACIER_MARCH', 0.0, 1.95, 5.0), fov: 27 },
      to:   { pos: P('GLACIER_MARCH',  2.55, 1.72, 12.85), target: P('GLACIER_MARCH', 0.0, 1.98, 5.0), fov: 25 },
      roll: [2.8, 0.0],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH26B',
    t0: 'line:20.start+1.8',
    t1: 'line:20.end',
    place: 'LANDING_VIGNETTES',
    camera: {
      move: 'push',
      t0: 'line:20.start+1.8',
      t1: 'line:20.end',
      from: { pos: P('LANDING_VIGNETTES', 135.0, 2.20, 11.5), target: P('LANDING_VIGNETTES', 135.0, 3.20, -10.0), fov: 32 },
      to:   { pos: P('LANDING_VIGNETTES', 135.0, 3.80, 15.5), target: P('LANDING_VIGNETTES', 135.0, 4.10, -12.0), fov: 34 },
      roll: [0.0, 0.0],
      ease: 'outCubic',
    },
  },
];

export default {
  title: 'The Fourth Man on South Georgia',
  fps: 30,
  size: [1080, 1920],
  duration: 62.92,
  world: { set: 'own', setOpts: {} },
  voice,
  cast,
  acts,
  props,
  handovers: [],
  shots,
  captions: 'words',
};