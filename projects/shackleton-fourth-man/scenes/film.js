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
  // === BEAT 1: THE MARCH + THE STRANGE FEELING (0–13 s, GLACIER_MARCH) ===
  {
    id: 'SH01',
    t0: 'line:1.start',
    t1: 'line:2.end',
    place: 'GLACIER_MARCH',
    camera: {
      move: 'push',
      t0: 'line:1.start',
      t1: 'line:2.end',
      from: { pos: P('GLACIER_MARCH',  0.20, 1.90, 14.8), target: P('GLACIER_MARCH', 0.0, 1.92, 0.8), fov: 30 },
      to:   { pos: P('GLACIER_MARCH', -0.20, 1.94, 14.5), target: P('GLACIER_MARCH', 0.0, 1.94, 1.8), fov: 29 },
      roll: [0.8, -0.6],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH02',
    t0: 'line:3.start',
    t1: 'line:3.end',
    place: 'GLACIER_MARCH',
    camera: {
      move: 'push',
      t0: 'line:3.start',
      t1: 'line:3.end',
      from: { pos: P('GLACIER_MARCH', 2.4, 1.88, 17.6), target: P('GLACIER_MARCH', 0.0, 1.95, 2.0), fov: 31 },
      to:   { pos: P('GLACIER_MARCH', 1.8, 1.92, 18.2), target: P('GLACIER_MARCH', 0.0, 1.95, 3.0), fov: 30 },
      roll: [-1.0, 0.8],
      ease: 'linear',
    },
  },
  {
    id: 'SH03',
    t0: 'line:4.start',
    t1: 'line:4.end',
    place: 'GLACIER_MARCH',
    camera: {
      move: 'push',
      t0: 'line:4.start',
      t1: 'line:4.end',
      from: { pos: P('GLACIER_MARCH', -3.6, 2.20, 20.4), target: P('GLACIER_MARCH', 0.0, 2.10, 3.5), fov: 36 },
      to:   { pos: P('GLACIER_MARCH', -1.6, 2.05, 19.6), target: P('GLACIER_MARCH', 0.0, 2.05, 4.6), fov: 35 },
      roll: [0.0, 1.0],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH04',
    t0: 'line:5.start',
    t1: 'line:5.end',
    place: 'GLACIER_MARCH',
    camera: {
      move: 'push',
      t0: 'line:5.start',
      t1: 'line:5.end',
      from: { pos: P('GLACIER_MARCH', -0.9, 1.88, 19.4), target: P('GLACIER_MARCH', 0.0, 1.92, 4.6), fov: 30 },
      to:   { pos: P('GLACIER_MARCH', -0.4, 1.92, 18.4), target: P('GLACIER_MARCH', 0.0, 1.95, 4.8), fov: 29 },
      roll: [0.8, 2.2],
      ease: 'inOutQuad',
    },
  },
  {
    id: 'SH05', // §7 MANDATORY CLOSE-UP: Crane up from 4 sets of footprints -> 3 men + 4th trace (holds 12–13 s pause!)
    t0: 'line:6.start',
    t1: 'line:6.end+1.0',
    place: 'GLACIER_MARCH',
    camera: {
      move: 'push',
      t0: 'line:6.start',
      t1: 'line:6.end+1.0',
      from: { pos: P('GLACIER_MARCH', 0.6, 1.45, 18.6), target: P('GLACIER_MARCH', 0.2, 0.35, 5.2), fov: 31 },
      to:   { pos: P('GLACIER_MARCH', 1.2, 2.05, 21.8), target: P('GLACIER_MARCH', 0.0, 1.95, 6.2), fov: 31 },
      roll: [-1.2, 1.0],
      ease: 'inOutCubic',
    },
  },

  // === BEAT 2: FLASHBACK — LIFEBOAT + ELEPHANT ISLAND (13–23 s) ===
  {
    id: 'SH06',
    t0: 'line:7.start',
    t1: 'line:7.end',
    place: 'LIFEBOAT_SEA',
    camera: {
      move: 'push',
      t0: 'line:7.start',
      t1: 'line:7.end',
      from: { pos: P('LIFEBOAT_SEA', 3.0, 2.55, 14.4), target: P('LIFEBOAT_SEA', 0.0, 1.85, -0.4), fov: 33 },
      to:   { pos: P('LIFEBOAT_SEA', 2.0, 2.65, 13.6), target: P('LIFEBOAT_SEA', 0.0, 1.90, -0.8), fov: 32 },
      roll: [-2.2, 1.8],
      ease: 'inOutSine',
    },
  },
  {
    id: 'SH07',
    t0: 'line:8.start',
    t1: 'line:8.end',
    place: 'LIFEBOAT_SEA',
    camera: {
      move: 'push',
      t0: 'line:8.start',
      t1: 'line:8.end',
      from: { pos: P('LIFEBOAT_SEA', -2.0, 2.35, 15.0), target: P('LIFEBOAT_SEA', 0.0, 1.95, -0.4), fov: 33 },
      to:   { pos: P('LIFEBOAT_SEA', -1.0, 2.45, 14.2), target: P('LIFEBOAT_SEA', 0.0, 2.00, -0.6), fov: 32 },
      roll: [1.5, -1.5],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH08',
    t0: 'line:9.start',
    t1: 'line:9.start+2.5',
    place: 'ELEPHANT_ISLAND',
    camera: {
      move: 'push',
      t0: 'line:9.start',
      t1: 'line:9.start+2.5',
      from: { pos: P('ELEPHANT_ISLAND', -1.6, 2.45, 24.8), target: P('ELEPHANT_ISLAND', 0.0, 1.85, -2.5), fov: 36 },
      to:   { pos: P('ELEPHANT_ISLAND', -0.4, 2.30, 23.0), target: P('ELEPHANT_ISLAND', 0.0, 1.85, -2.0), fov: 35 },
      roll: [0.0, 0.8],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH09',
    t0: 'line:9.start+2.5',
    t1: 'line:9.end',
    place: 'ELEPHANT_ISLAND',
    camera: {
      move: 'push',
      t0: 'line:9.start+2.5',
      t1: 'line:9.end',
      from: { pos: P('ELEPHANT_ISLAND', 0.5, 2.05, 19.6), target: P('ELEPHANT_ISLAND', 0.0, 1.85, -1.0), fov: 34 },
      to:   { pos: P('ELEPHANT_ISLAND', 0.0, 2.00, 18.6), target: P('ELEPHANT_ISLAND', 0.0, 1.88, -0.8), fov: 33 },
      roll: [-0.8, 0.8],
      ease: 'outCubic',
    },
  },

  // === BEAT 3: THE CROSSING + MANDATORY §7 BIG CLOSE-UPS (23–30 s, GLACIER_CROSSING) ===
  {
    id: 'SH10',
    t0: 'line:10.start',
    t1: 'line:10.end',
    place: 'GLACIER_CROSSING',
    camera: {
      move: 'push',
      t0: 'line:10.start',
      t1: 'line:10.end',
      from: { pos: P('GLACIER_CROSSING', -2.2, 2.00, 18.6), target: P('GLACIER_CROSSING', 0.0, 1.95, 1.0), fov: 33 },
      to:   { pos: P('GLACIER_CROSSING', -1.2, 2.08, 17.6), target: P('GLACIER_CROSSING', 0.1, 2.00, 2.2), fov: 32 },
      roll: [1.5, -1.0],
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
    id: 'SH14',
    t0: 'line:12.start',
    t1: 'line:12.start+2.0',
    place: 'SNOW_SLEEP',
    camera: {
      move: 'push',
      t0: 'line:12.start',
      t1: 'line:12.start+2.0',
      from: { pos: P('SNOW_SLEEP', -1.8, 1.95, 19.6), target: P('SNOW_SLEEP', 0.0, 1.55, 0.8), fov: 34 },
      to:   { pos: P('SNOW_SLEEP', -0.9, 1.85, 18.6), target: P('SNOW_SLEEP', 0.0, 1.55, 0.8), fov: 33 },
      roll: [0.0, 1.0],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH15',
    t0: 'line:12.start+2.0',
    t1: 'line:12.end',
    place: 'SNOW_SLEEP',
    camera: {
      move: 'push',
      t0: 'line:12.start+2.0',
      t1: 'line:12.end',
      from: { pos: P('SNOW_SLEEP', 0.6, 1.70, 19.2), target: P('SNOW_SLEEP', 0.0, 1.50, 1.0), fov: 33 },
      to:   { pos: P('SNOW_SLEEP', 0.2, 1.62, 18.2), target: P('SNOW_SLEEP', 0.0, 1.48, 1.0), fov: 32 },
      roll: [-1.0, 0.5],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH16', // Shackleton solo pocket-watch close-up (Worsley & Crean cleanly off-screen)
    t0: 'line:13.start',
    t1: 'line:13.end',
    place: 'SNOW_SLEEP',
    camera: {
      move: 'push',
      t0: 'line:13.start',
      t1: 'line:13.end',
      from: { pos: P('SNOW_SLEEP', 0.30, 1.90, 9.2), target: P('SNOW_SLEEP', 0.0, 1.90, 0.4), fov: 25 },
      to:   { pos: P('SNOW_SLEEP', 0.10, 1.94, 8.6), target: P('SNOW_SLEEP', 0.0, 1.92, 0.4), fov: 25 },
      roll: [0.8, -0.8],
      ease: 'inOutQuad',
    },
  },
  {
    id: 'SH17',
    t0: 'line:14.start',
    t1: 'line:14.end',
    place: 'SNOW_SLEEP',
    camera: {
      move: 'push',
      t0: 'line:14.start',
      t1: 'line:14.end',
      from: { pos: P('SNOW_SLEEP', -1.2, 1.85, 19.4), target: P('SNOW_SLEEP', 0.0, 1.75, 0.8), fov: 33 },
      to:   { pos: P('SNOW_SLEEP', -0.4, 1.90, 18.4), target: P('SNOW_SLEEP', 0.0, 1.80, 0.8), fov: 32 },
      roll: [-1.0, 0.8],
      ease: 'outCubic',
    },
  },

  // === BEAT 5: THE CONFESSIONS (39–53 s, SHELTER_CONFESSION — warm amber arc) ===
  {
    id: 'SH18',
    t0: 'line:15.start',
    t1: 'line:15.start+2.5',
    place: 'SHELTER_CONFESSION',
    camera: {
      move: 'push',
      t0: 'line:15.start',
      t1: 'line:15.start+2.5',
      from: { pos: P('SHELTER_CONFESSION', -1.4, 2.00, 21.8), target: P('SHELTER_CONFESSION', 0.0, 1.90, 0.4), fov: 34 },
      to:   { pos: P('SHELTER_CONFESSION', -0.4, 1.95, 20.6), target: P('SHELTER_CONFESSION', 0.0, 1.90, 0.4), fov: 33 },
      roll: [0.0, 0.8],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH19', // Shackleton solo confession close-up (Worsley & Crean cleanly off-screen)
    t0: 'line:15.start+2.5',
    t1: 'line:15.end',
    place: 'SHELTER_CONFESSION',
    camera: {
      move: 'push',
      t0: 'line:15.start+2.5',
      t1: 'line:15.end',
      from: { pos: P('SHELTER_CONFESSION', 0.30, 1.90, 10.4), target: P('SHELTER_CONFESSION', 0.0, 1.92, 0.6), fov: 26 },
      to:   { pos: P('SHELTER_CONFESSION', 0.10, 1.94,  9.8), target: P('SHELTER_CONFESSION', 0.0, 1.95, 0.6), fov: 25 },
      roll: [-0.8, 0.8],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH20', // Worsley solo confession close-up (Shackleton cleanly off-screen)
    t0: 'line:16.start',
    t1: 'line:16.end',
    place: 'SHELTER_CONFESSION',
    camera: {
      move: 'push',
      t0: 'line:16.start',
      t1: 'line:16.end',
      from: { pos: P('SHELTER_CONFESSION', -1.85, 2.00, 10.2), target: P('SHELTER_CONFESSION', -2.15, 2.05, 0.4), fov: 26 },
      to:   { pos: P('SHELTER_CONFESSION', -2.05, 2.04,  9.6), target: P('SHELTER_CONFESSION', -2.15, 2.08, 0.4), fov: 25 },
      roll: [1.0, -0.8],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH21', // Crean solo confirmation close-up (Shackleton cleanly off-screen)
    t0: 'line:17.start',
    t1: 'line:17.end',
    place: 'SHELTER_CONFESSION',
    camera: {
      move: 'push',
      t0: 'line:17.start',
      t1: 'line:17.end',
      from: { pos: P('SHELTER_CONFESSION', 1.85, 2.00, 10.2), target: P('SHELTER_CONFESSION', 2.15, 2.05, 0.4), fov: 26 },
      to:   { pos: P('SHELTER_CONFESSION', 2.05, 2.04,  9.6), target: P('SHELTER_CONFESSION', 2.15, 2.08, 0.4), fov: 25 },
      roll: [-1.0, 0.8],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH22A',
    t0: 'line:18.start',
    t1: 'line:18.start+2.0',
    place: 'SHELTER_CONFESSION',
    camera: {
      move: 'push',
      t0: 'line:18.start',
      t1: 'line:18.start+2.0',
      from: { pos: P('SHELTER_CONFESSION', -1.2, 1.98, 21.4), target: P('SHELTER_CONFESSION', 0.0, 1.92, 0.5), fov: 34 },
      to:   { pos: P('SHELTER_CONFESSION',  1.2, 2.02, 20.6), target: P('SHELTER_CONFESSION', 0.0, 1.95, 0.5), fov: 33 },
      roll: [0.8, -0.8],
      ease: 'inOutSine',
    },
  },
  {
    id: 'SH22B',
    t0: 'line:18.start+2.0',
    t1: 'line:18.end',
    place: 'GLACIER_MARCH',
    camera: {
      move: 'push',
      t0: 'line:18.start+2.0',
      t1: 'line:18.end',
      from: { pos: P('GLACIER_MARCH', 1.2, 1.85, 20.8), target: P('GLACIER_MARCH', 0.0, 1.65, 2.6), fov: 32 },
      to:   { pos: P('GLACIER_MARCH', 0.4, 1.95, 19.6), target: P('GLACIER_MARCH', 0.0, 1.75, 2.8), fov: 31 },
      roll: [-1.2, 1.0],
      ease: 'outCubic',
    },
  },

  // === BEAT 6: THE LANDING — VIGNETTES + FINAL TITLE (53–62.92 s) ===
  {
    id: 'SH23',
    t0: 'line:19.start',
    t1: 'line:19.start+2.0',
    place: 'LANDING_VIGNETTES',
    camera: {
      move: 'push',
      t0: 'line:19.start',
      t1: 'line:19.start+2.0',
      from: { pos: P('LANDING_VIGNETTES', 1.4, 1.90, 11.6), target: P('LANDING_VIGNETTES', -0.2, 1.95, 0.6), fov: 28 },
      to:   { pos: P('LANDING_VIGNETTES', 0.4, 1.98, 11.2), target: P('LANDING_VIGNETTES', -0.2, 1.98, 1.4), fov: 27 },
      roll: [-1.5, 1.0],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH24',
    t0: 'line:19.start+2.0',
    t1: 'line:19.start+4.0',
    place: 'LANDING_VIGNETTES',
    camera: {
      move: 'push',
      t0: 'line:19.start+2.0',
      t1: 'line:19.start+4.0',
      from: { pos: P('LANDING_VIGNETTES', 46.8, 1.95, 11.2), target: P('LANDING_VIGNETTES', 45.0, 1.95, 0.0), fov: 28 },
      to:   { pos: P('LANDING_VIGNETTES', 45.6, 2.02, 10.4), target: P('LANDING_VIGNETTES', 45.0, 1.98, 0.0), fov: 27 },
      roll: [1.5, -1.2],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH25',
    t0: 'line:19.start+4.0',
    t1: 'line:19.end',
    place: 'LANDING_VIGNETTES',
    camera: {
      move: 'push',
      t0: 'line:19.start+4.0',
      t1: 'line:19.end',
      from: { pos: P('LANDING_VIGNETTES', 88.4, 1.90, 11.6), target: P('LANDING_VIGNETTES', 90.0, 1.95, 0.4), fov: 28 },
      to:   { pos: P('LANDING_VIGNETTES', 89.4, 1.98, 11.0), target: P('LANDING_VIGNETTES', 90.0, 1.98, 1.0), fov: 27 },
      roll: [-1.2, 1.0],
      ease: 'outCubic',
    },
  },
  {
    id: 'SH26A',
    t0: 'line:20.start',
    t1: 'line:20.start+1.8',
    place: 'GLACIER_MARCH',
    camera: {
      move: 'push',
      t0: 'line:20.start',
      t1: 'line:20.start+1.8',
      from: { pos: P('GLACIER_MARCH', -0.6, 1.92, 20.6), target: P('GLACIER_MARCH', 0.0, 1.95, 3.2), fov: 32 },
      to:   { pos: P('GLACIER_MARCH', -0.2, 1.96, 19.8), target: P('GLACIER_MARCH', 0.0, 1.98, 3.4), fov: 31 },
      roll: [0.8, -0.6],
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