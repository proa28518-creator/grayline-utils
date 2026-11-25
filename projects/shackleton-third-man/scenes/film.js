// Build-stage film draft — «ظاهرة الرجل الثالث»
// Voice as-is: audio/clean.wav (62.92 s). Word times: audio/clean.json (169 words, member timings).
// All lines are narrator (the recorded voice); the characters act and listen, no lip sync needed.
// Build previz: real D, real depth, practicals; hero detail comes in the Environment overhaul.
export default {
  fps: 30,
  size: [1080, 1920],

  world: {
    set: 'own',
    setOpts: {
      places: [
        // lights as data: key + fill per place; practicals named in set.js
        { name: 'A', at: [0, 0], key: { color: '#cfe2f3', int: 1.0 }, fill: { color: '#3c5a78', int: 0.5 }, rim: { color: '#e8f2ff', int: 0.7 } },
        { name: 'B', at: [400, 0], key: { color: '#b8ccd8', int: 0.8 }, fill: { color: '#0e2a36', int: 0.6 } },
        { name: 'C', at: [400, -400], key: { color: '#cabcd8', int: 0.9 }, fill: { color: '#41506b', int: 0.5 } },
        { name: 'D', at: [-400, 0], key: { color: '#ffcf8a', int: 1.1 }, fill: { color: '#26303e', int: 0.5 } }
      ]
    }
  },

  cast: {
    shackleton: { spec: 'cast/shackleton.json', at: [0, 1], ry: 15 },
    worsley: { spec: 'cast/worsley.json', at: [-1.4, 0.2], ry: 30 },
    crean: { spec: 'cast/crean.json', at: [1.4, 0.2], ry: -25 }
  },

  voice: {
    file: 'audio/clean.wav',
    words: 'audio/clean.json',
    lines: [
      { who: null, text: 'سنة 1916 إرنست شاكلتون ماشي بقاله 36 ساعة وسط جبال محدش في الدنيا راسم لها خريطة وفجأة بدأ يحس بحاجة غريبة حاسس إن في راجل رابع ماشي جنبه' },
      { who: null, text: 'بعد 16 يوم في مركب نجاة وسط المحيط الجنوبي كان قدامه هو وفرانك ورسلي وتوم كرين طريق واحد بس عشان ينقذوا 22 راجل عالقين في آخر الدنيا على جزيرة الفيل إنهم يعدوا جبال جورجيا الجنوبية الجليدية على رجليهم ومعهمش غير حبل وفأس ومسامير ألاووظ مثبتينها في نعل جزمهم' },
      { who: null, text: 'من كتر التعب ورسلي وكرين مقدروش يكملوا ووقعوا من النوم على التلج شاكلتون سابهم يناموا خمس دقايق بالظبط ولما صحاهم كدب عليهم وقال لهم إنهم ناموا نص ساعة كاملة' },
      { who: null, text: 'في الوقت ده شاكلتون مكنش حكى لحد عن الراجل الرابع اللي كان حاسس بيه لحد ما ورسلي اعترف بعد كده إنه كان حاسس بنفس الإحساس' },
      { who: null, text: 'وكرين كمان أكد نفس الكلام' },
      { who: null, text: 'التلاتة كل واحد لوحده كانوا حاسين بكيان رابع معاهم' },
      { who: null, text: 'مش بس هم متسلقين وبحارة وناجين من كوارث كتير حكوا عن نفس الرفيق الخفي اللي محدش شافه' },
      { who: null, text: 'ظاهرة معروفة في علم النفس بظاهرة الرجل الثالث' }
    ]
  },

  acts: {
    shackleton: {
      place: [
        { t: 0, place: 'A', at: [-0.5, 0.5] },
        { t: 'line:2.start', place: 'B', at: [1.2, -0.2], y: 1.9 }, // in the boat
        { t: 'line:3.start', place: 'C', at: [0.6, 0.4] },
        { t: 'line:5.start', place: 'D', at: [0.4, 0.6] }
      ],
      face: [
        { t: 0, expr: 'dread' },                        // opening: expressive face, frame 0
        { t: 'line:1.word:17.start+0.07', expr: 'fear', react: 'jolt' },   // وفجأة
        { t: 'line:1.word:26.start+0.07', expr: 'stare' },                  // رابع
        { t: 'line:3.word:21.start-0.1', expr: 'hope' },                    // كدب — softens into the lie
        { t: 'line:4.word:6.start+0.03', expr: 'blank' },                   // حكى — shuts it away
        { t: 'line:8.word:7.start+0.07', expr: 'dawning' }                  // الرجل الثالث
      ],
      look: [
        { t: 'line:1.word:17.start', at: [2.4, 1.5, -1.2] },   // the empty space beside him
        { t: 'line:3.word:20.start', at: [-1.6, 1.4, 0.6] },   // at the sleepers
        { t: 'line:6.word:8.start', at: [1.4, 1.5, 0.4] }
      ],
      walk: [ { t0: 'line:1.word:5.start', path: [[-0.5, 0.5], [0.5, 0.2]], speed: 1.3 } ], // ماشي — the trek along the ridge
      clips: [
        { clip: 'point', t0: 'line:1.word:22.start', side: 'L', dir: [1, 0, 0.1], hold: 1.2, out: 6 }, // حاسس
        { clip: 'lean_back', t0: 'line:4.word:6.start', hold: 2, out: 8 }, // حكى — shuts his mouth, looks away
        // prop hands (fix 3): every prop picked up and put down on real times
        { clip: 'put_down', prop: 'map', side: 'L', t0: 'line:2.start' },        // map away on the cut
        { clip: 'pick_up', prop: 'rope', side: 'R', t0: 'line:2.word:41.start' },// حبل on its word
        { clip: 'pick_up', prop: 'axe', side: 'R', t0: 'line:2.word:42.start' }, // فأس on its word
        { clip: 'put_down', prop: 'rope', side: 'R', t0: 'line:3.start' },       // gear away on the cut into C
        { clip: 'put_down', prop: 'axe', side: 'R', t0: 'line:3.start' },
        { clip: 'pick_up', prop: 'watch', side: 'R', t0: 'line:3.word:16.start' },// خمس دقايق — the watch out
        { clip: 'put_down', prop: 'watch', side: 'R', t0: 'line:4.start' }       // pocketed on the cut into line 4
      ]
    },
    worsley: {
      place: [
        { t: 0, place: 'A', at: [-30, 2] },                  // offstage in A until the boat
        { t: 'line:2.start', place: 'B', at: [-1.2, -0.2], y: 1.9 },
        { t: 'line:3.start', place: 'C', at: [-1.6, 0.8], y: 0.4 },   // asleep on the shelf
        { t: 'line:5.start', place: 'D', at: [-1.4, 0.4] }
      ],
      face: [
        { t: 'line:2.start', expr: 'blank' },
        { t: 'line:3.word:8.start+0.07', expr: 'horror', eyes: 'sad', brow: 'worried' },   // ووقعوا — collapses
        { t: 'line:4.word:18.start-0.1', expr: 'confused', eyes: 'sad', brow: 'worried' }, // اعترف — hard to admit
        { t: 'line:5.start', expr: 'relief' }                                              // settled after telling
      ],
      clips: [
        { clip: 'lean_over', t0: 'line:4.word:18.start', hold: 2, out: 8 }, // اعترف — leans in
        { clip: 'put_down', prop: 'lantern', side: 'L', t0: 'line:3.start' } // the lantern set down on the cut into C
      ],
      sit_on: { t: 'line:5.start', seat: [-1.4, 0.4] }, // walks to the seat and sits (a key, not a clip; seat is [x, z])
    },
    crean: {
      place: [
        { t: 0, place: 'A', at: [-34, 3] },
        { t: 'line:2.start', place: 'B', at: [0, -1.4], y: 1.9 },
        { t: 'line:3.start', place: 'C', at: [2.2, 1.1], y: 0.4 },
        { t: 'line:5.start', place: 'D', at: [1.6, 0.5] }
      ],
      face: [
        { t: 'line:2.start', expr: 'blank' },
        { t: 'line:3.word:8.start+0.07', expr: 'horror', eyes: 'sad', brow: 'worried' }, // ووقعوا — collapses
        { t: 'line:5.word:3.start+0.07', expr: 'relief', react: 'lean' },   // أكد — the firm nod
        { t: 'line:6.word:7.start+0.07', eyes: 'wide', brow: 'up' }         // بكيان رابع
      ],
      clips: [
        { clip: 'put_down', prop: 'mug', side: 'R', t0: 'line:5.word:2.start' }, // the mug down…
        { clip: 'shake', t0: 'line:5.word:3.start', hold: 1.5, out: 6 }          // …then أكد — the firm nod
      ]
    }
  },

  props: [
    // the unmarked map — in his LEFT hand; appears on the cut to shot 3 (no mid-shot pop),
    // put down on the cut into line 2 before the right hand takes the gear
    { id: 'map', kind: 'book', owner: 'shackleton', in: 'hand:L',
      at: 'line:1.word:17.start', print: { title: '— unmapped —', blank: true },
      keys: [ { t: 'line:2.start', stow: true } ] },
    // rope coil — right hand; fetch mid-shot on its word (PROP GUARD allows fetch keys),
    // put down on the cut into line 3
    { id: 'rope', kind: 'rope_coil', owner: 'shackleton', in: 'hand:R',
      at: 'line:2.word:41.start',
      keys: [ { t: 'line:2.word:41.start', fetch: true } ] },
    // ice axe — right hand after the rope is stowed? No: both carried, axe in the LEFT when rope is up? Keep axe in RIGHT,
    // it is the taller grip; fetch on its word
    { id: 'axe', kind: 'ice_axe', owner: 'shackleton', in: 'hand:R',
      at: 'line:2.word:42.start',
      keys: [ { t: 'line:2.word:42.start', fetch: true } ] },
    // nailed boot — WORN: exists from the cut into the glacier shot (word 31), stomps on its
    // real hit word (snap: true — the PROP GUARD allows a snap), then persists in the world
    { id: 'boot', kind: 'boot_nailed', owner: 'shackleton', in: 'world',
      at: 'line:2.word:31.start', pos: [400.6, 0.05, 0.4],
      keys: [ { t: 'line:2.word:45.start', snap: true, at: [400.6, 0.05, 0.4] } ] },
    // pocket watch — right hand; fetch mid-shot on its word (the push shot focuses it),
    // pocketed (stow) on the cut into line 4
    { id: 'watch', kind: 'pocket_watch', owner: 'shackleton', in: 'hand:R',
      at: 'line:3.word:16.start', open: 1,
      keys: [ { t: 'line:3.word:16.start', fetch: true }, { t: 'line:4.start', stow: true } ] },
    // the storm lantern — Worsley holds it in the boat (the warm pool travels with him);
    // set down on the cut into line 3, then it persists as the C fire-side pool
    { id: 'lantern', kind: 'lantern', owner: 'worsley', in: 'hand:L',
      at: 'line:2.start',
      keys: [ { t: 'line:3.start', stow: true } ] },
    // Crean's mug — in his right hand from the cut into D; set down one word before the nod
    { id: 'mug', kind: 'mug', owner: 'crean', in: 'hand:R', at: 'line:5.start',
      keys: [ { t: 'line:5.word:2.start', stow: true } ] }
  ],

  shots: [
    // LINE 1 — A: the trek, then the feeling arrives
    { t0: 0, t1: 'line:1.word:4.end',
      camera: { move: 'park', pos: [0.15, 2.2, 3.1], target: [0.15, 2.35, 0.5], fov: 38 } }, // OPENING: face, head 300px+
    { t0: 'line:1.word:5.start', t1: 'line:1.word:16.end',
      camera: { move: 'follow', who: 'shackleton', camOffset: [2.6, 3.2, 7], look: 'shackleton' } }, // the walk along the ridge
    { t0: 'line:1.word:17.start', t1: 'line:2.start',
      camera: { move: 'push', from: { pos: [1.4, 2.4, 5], target: [0.1, 2.3, 0.5] },
                to: { pos: [0.7, 2.3, 3.2], target: [0.2, 2.35, 0.5] } } }, // وفجأة → he stops, half-turns; hold on the stare

    // LINE 2 — B: the boat, the odds, the gear; A2: the glacier face
    { t0: 'line:2.start', t1: 'line:2.word:17.start',
      camera: { move: 'orbit', who: 'shackleton', az0: -0.5, az1: 0.6, el: 0.12, dist: 9, height: 2.4, fov: 40 } }, // the Caird on the swell
    { t0: 'line:2.word:17.start', t1: 'line:2.word:31.start',
      camera: { move: 'push', from: { pos: [3, 3.4, 8], target: [0.6, 2.4, 0] },
                to: { pos: [1.2, 2.6, 4.2], target: [0.6, 2.4, 0] } } }, // the three, the odds named
    { t0: 'line:2.word:31.start', t1: 'line:2.word:45.start-0.6',
      camera: { move: 'park', pos: [403, 2.6, 6.5], target: [400.4, 2.2, 0], fov: 42 } }, // low wide: roped on the glacier
    { t0: 'line:2.word:45.start-0.6', t1: 'line:3.start',
      camera: { move: 'park', pos: [401.2, 0.7, 2.2], target: [400.6, 0.35, 0.4], fov: 34, hard: true } }, // INSERT: nailed boot slams

    // LINE 3 — C: collapse, the mercy lie
    { t0: 'line:3.start', t1: 'line:3.word:13.start',
      camera: { move: 'park', pos: [403.4, 3.2, 6], target: [400.4, 1.6, 0.6], fov: 40 } }, // they drop mid-step ووقعوا
    { t0: 'line:3.word:13.start', t1: 'line:3.word:19.start',
      camera: { move: 'push', from: { pos: [402.2, 2.2, 3.6], target: [400.6, 1.9, 0.4] },
                to: { pos: [401.4, 2.0, 2.4], target: [400.6, 1.9, 0.4] }, focus: 'watch' } }, // خمس دقايق — the watch
    { t0: 'line:3.word:19.start', t1: 'line:4.start',
      camera: { move: 'push', from: { pos: [401.8, 2.1, 2.6], target: [400.6, 2.0, 0.4] },
                to: { pos: [401.0, 2.1, 1.8], target: [400.6, 2.1, 0.4] } } }, // كدب — the lie lands on his face

    // LINE 4 — C fire: the secret, then Worsley's confession
    { t0: 'line:4.start', t1: 'line:4.word:15.start',
      camera: { move: 'park', pos: [402.6, 2.0, 4.2], target: [400.4, 1.9, 0.6], fov: 38 } }, // apart, the fire between them
    { t0: 'line:4.word:15.start', t1: 'line:5.start',
      camera: { move: 'push', from: { pos: [401.4, 2.0, 3.2], target: [399.2, 1.9, 0.6] },
                to: { pos: [400.4, 2.0, 2.2], target: [399.2, 1.9, 0.6] } } }, // ورسلي اعترف — on Worsley

    // LINE 5 — D: Crean's nod
    { t0: 'line:5.start', t1: 'line:6.start',
      camera: { move: 'park', pos: [-398.2, 2.1, 3.4], target: [-398.4, 1.9, 0.5], fov: 36 } },

    // LINE 6 — D: three solitudes, the empty fourth place
    { t0: 'line:6.start', t1: 'line:6.word:5.start',
      camera: { move: 'park', pos: [-400.2, 2.2, 4.6], target: [-400, 1.8, 0.4], fov: 34 } }, // three separate looks
    { t0: 'line:6.word:5.start', t1: 'line:7.start',
      camera: { move: 'push', from: { pos: [-399, 2.0, 3.8], target: [-400, 1.6, 0.4] },
                to: { pos: [-399.6, 1.8, 2.6], target: [-400.05, 1.5, 0.4] } } }, // the space between them

    // LINE 7 — D: the circle widens; the shadow no one casts
    { t0: 'line:7.start', t1: 'line:7.word:10.start',
      camera: { move: 'path', keys: [
        { t: 'line:7.start', pos: [-398.6, 2.2, 4.2], target: [-400.2, 1.8, 0.4], fov: 38 },
        { t: 'line:7.word:6.start', pos: [-399.4, 2.0, 3.2], target: [-400.1, 1.8, 0.4], fov: 36 }
      ] } },
    { t0: 'line:7.word:10.start', t1: 'line:8.start',
      camera: { move: 'park', pos: [-400.8, 1.9, 2.8], target: [-400.2, 1.7, 0.4], fov: 34 } }, // حكوا — the shadow across the floor

    // LINE 8 — D: the name lands
    { t0: 'line:8.start', t1: 'line:8.word:6.start',
      camera: { move: 'push', from: { pos: [-399.2, 2.2, 3.4], target: [-399.6, 2.2, 0.6] },
                to: { pos: [-398.9, 2.3, 2.4], target: [-399.6, 2.3, 0.6] } } },
    { t0: 'line:8.word:6.start', t1: 'line:8.end+0.43',
      camera: { move: 'park', pos: [-399.35, 2.42, 1.55], target: [-399.6, 2.42, 0.6], fov: 30 } } // final hold: head fills the frame (≥300 px), door ajar behind
  ],

  captions: 'words'
};
