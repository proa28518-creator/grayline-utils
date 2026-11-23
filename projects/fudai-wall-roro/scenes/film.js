/* Seat attribution: authored by the builder seat (Roro / Muse, lane 4 of the construction-chair race), 2026-11-23, for the Fudai Wall Build pass. Method source: the cartoon-shorts tree only. The «Production and rules» package was not opened, read, copied or referenced. No local renders. */
// film.js — THE film. Fudai Wall (سور فوداي). 24 lines, 186 words, 68.08 s.
// Every word is as heard (verified 1:1 against audio/clean.json).
// Frame 0: the mayor's face, big, looking up; the tilt-up rises from his face to the wall.
// Cuts follow the member's binding shot plan, segment for segment. Captions: 'words'.

export default {
  fps: 30,
  size: [1080, 1920],
  world: { set: 'own', setOpts: { wave: 0 } },
  captions: 'words',

  // ---- Cast (the tree's ready-made characters ONLY; byte-identical copies of race/roro-fudai/tree-specs/) ----
  // mayor = inspector (navy official coat, white hair, gold buttons — the municipal official).
  // villager_1 = farmer (red check shirt, strawhat, grey goatee — the weathered villager, lead mocker).
  // villager_2 = postman (slim, tall, grey flatcap, navy jacket — the slim villager).
  // villager_3 = ruby (teal jumper, curly red hair — the teal villager).
  // villagers = townsperson (grey bowler, brown jacket — the crowd base).
  // Place A (coast + wall) is the home place. Two people talking: 1.5-1.8 D apart,
  // both cheated 45-70 deg toward the camera side. ry 0 faces +Z (the camera side).
  cast: {
    mayor: { spec: 'cast/inspector.json', at: [0, 0.8], ry: 30 },
    villager_1: { spec: 'cast/farmer.json', at: [-1.6, 1.4], ry: -40 },
    villager_2: { spec: 'cast/postman.json', at: [1.6, 1.4], ry: 40 },
    villager_3: { spec: 'cast/ruby.json', at: [-2.9, 0.6], ry: -30 },
    villagers: { spec: 'cast/townsperson.json', at: [3.0, 0.4], ry: 35 },
  },

  // ---- Voice (the member's voice; lines as heard; who: null = narrator) ----
  voice: {
    file: 'audio/clean.wav',
    words: 'audio/clean.json',
    lines: [
      { who: null, text: 'بنى سور خرساني بطول عمارة خمس أدوار قدام قرية صيد صغيرة' },
      { who: null, text: 'والبحر قدامه هادي زي المراية' },
      { who: null, text: 'كان عمدة لقرية فيها 3000 شخص بس' },
      { who: null, text: 'وصرف 30 مليون دولار و12 سنة بناء على بوابة ارتفاعها 15 متر ونص' },
      { who: null, text: 'مع إن كل القرى اللي حواليه اكتفت بسور 10 متر' },
      { who: 'villager_1', text: 'أهل القرية ضحكوا عليه وقالوا له: إنت بترمي فلوسنا في البحر؟' },
      { who: 'villager_1', text: 'الموج عمره ما هيوصل هناك' },
      { who: null, text: 'بس العمدة ما ردش ولا نزل السور سنتي واحد' },
      { who: null, text: 'السور خلص والبحر فضل هادي سنين' },
      { who: null, text: 'والناس سموه أغبى مشروع في البلد' },
      { who: null, text: 'العمدة طلع على المعاش وهو لسه بيتلام على الفلوس اللي ضاعت' },
      { who: null, text: 'ومات من غير ما حد واحد يصدقه' },
      { who: null, text: 'بعد موته بـ 14 سنة' },
      { who: null, text: 'الأرض اتهزت بزلزال عنيف' },
      { who: null, text: 'والبحر اتسحب لورا' },
      { who: null, text: 'ورجع بموجة عملاقة ارتفاعها 15 متر بالظبط' },
      { who: null, text: 'أصل العمدة وهو شاب شاف البحر بيبلع قريته' },
      { who: null, text: 'فافتكر علامات قديمة على الصخر بتحدد أعلى نقطة وصلها الموج زمان' },
      { who: null, text: 'زي ما تحط شرطة بالقلم على الحيطة عشان ما تنساش المقاس' },
      { who: null, text: 'هو بنى السور على مقاس أضخم موجة في الذاكرة' },
      { who: null, text: 'القرى اللي حواليهم بأسوارها الـ 10 متر اتمسحت في دقايق' },
      { who: null, text: 'والموجة خبطت في سوره ووقفت عند حافته' },
      { who: null, text: 'القرية كلها نجت' },
      { who: null, text: 'والناس اللي ضحكوا عليه راحوا قبره يشكروه' },
    ],
  },

  // ---- Acts (face first, one body action per line tied to a word, listeners react 1-3 frames after the trigger word) ----
  acts: {
    mayor: {
      // Place keys: A (home) -> B (flashback, line 17) -> C (room analogy, line 19) -> A (wall top, line 20). All on cuts.
      place: [
        { t: 'line:17.start', at: [400, 1], ry: 30 },
        { t: 'line:19.start', at: [400, -399], ry: 20 },
        { t: 'line:20.start', at: [0, 1], ry: 30 },
      ],
      face: [
        { t: 'line:1.start-0.1', expr: 'dawning' },
        { t: 'line:2.start-0.1', expr: 'blank' },
        { t: 'line:3.start-0.1', expr: 'rest' },
        { t: 'line:4.start-0.1', expr: 'dawning' },
        { t: 'line:5.start-0.1', expr: 'rest' },
        { t: 'line:6.start-0.1', expr: 'blank', react: false },
        { t: 'line:7.start-0.1', expr: 'blank', react: false },
        { t: 'line:8.start-0.1', expr: 'blank', react: false },
        { t: 'line:9.start-0.1', expr: 'rest' },
        { t: 'line:10.start-0.1', expr: 'blank', react: false },
        { t: 'line:11.start-0.1', expr: 'sad' },
        { t: 'line:17.start-0.1', expr: 'fear' },
        { t: 'line:18.start-0.1', expr: 'dawning' },
        { t: 'line:19.start-0.1', expr: 'rest' },
        { t: 'line:20.start-0.1', expr: 'hope' },
      ],
      look: [
        { t: 'line:2.start', at: [0, 2.0, -20] },
        { t: 'line:5.start', at: [-10, 2.0, -8] },
        { t: 'line:9.start', at: [0, 2.0, -20] },
      ],
      clips: [
        { clip: 'point', at: 'line:1.word:1', side: 'R', dir: [0, 1, 0.2], hold: 0.4, out: 6 },
        { clip: 'point', at: 'line:3.word:5', side: 'R', dir: [0.6, 0, 0.2], hold: 0.3, out: 6 },
        { clip: 'point', at: 'line:4.word:1', side: 'both', dir: [0, 0.4, 0.2], hold: 0.5, out: 6 },
        { clip: 'point', at: 'line:8.word:7', side: 'R', dir: [0, -1, 0.2], hold: 0.4, out: 6 },
        { clip: 'carry', at: 'line:11.start', prop: 'box', side: 'both' },
        { clip: 'shock_pop', at: 'line:17.word:7', hold: 0.1, out: 5 },
        { clip: 'point', at: 'line:18.word:2', side: 'R', dir: [0.4, 0, 0.2], hold: 0.4, out: 6 },
        { clip: 'point', at: 'line:19.word:4', side: 'R', dir: [0, -0.4, 0.2], hold: 0.3, out: 6 },
        { clip: 'point', at: 'line:20.word:2', side: 'R', dir: [0, 1, 0.2], hold: 0.4, out: 6 },
      ],
      walk: [
        { t0: 'line:11.start', path: [[0, 0.8], [2.5, 1.5], [4, 2.2]], speed: 1.3, face: 'sad' },
      ],
    },

    villager_1: {
      place: [
        { t: 'line:24.start', at: [0, -399], ry: -20 },
      ],
      face: [
        { t: 'line:1.start-0.1', expr: 'rest' },
        { t: 'line:6.start-0.1', eyes: 'arc', brow: 'up', mouth: 'D' },
        { t: 'line:7.start-0.1', eyes: 'smug', brow: 'up', mouth: 'smirk' },
        { t: 'line:8.start-0.1', expr: 'confused' },
        { t: 'line:10.start-0.1', eyes: 'arc', brow: 'up', mouth: 'D' },
        { t: 'line:11.start-0.1', expr: 'blank' },
        { t: 'line:14.start-0.1', expr: 'fear' },
        { t: 'line:15.start-0.1', expr: 'fear' },
        { t: 'line:16.start-0.1', expr: 'terror' },
        { t: 'line:24.start-0.1', expr: 'sad' },
      ],
      look: [
        { t: 'line:6.start', at: [0, 2.5, 0.8] },
        { t: 'line:8.start', at: [0, 2.5, 0.8] },
        { t: 'line:24.start', at: [0, 1.0, -402] },
      ],
      clips: [
        { clip: 'point', at: 'line:6.word:9', side: 'R', dir: [0, 1, 0.2], hold: 0.5, out: 6 },
        { clip: 'point', at: 'line:7.word:4', side: 'R', dir: [0.6, 0, 0.2], hold: 0.4, out: 6 },
        { clip: 'point', at: 'line:11.word:7', side: 'R', dir: [-0.5, 0, 0.2], hold: 0.3, out: 6 },
        { clip: 'shock_pop', at: 'line:14.word:3', hold: 0.1, out: 5 },
        { clip: 'lean_back', at: 'line:16.word:2', hold: 0.3, out: 6 },
      ],
      walk: [
        { t0: 'line:15.start', path: [[-1.6, 1.4], [-0.5, 2.5], [1, 3]], speed: 3.5, gait: 'run', face: 'fear' },
      ],
    },

    villager_2: {
      place: [
        { t: 'line:24.start', at: [1.2, -399], ry: -20 },
      ],
      face: [
        { t: 'line:1.start-0.1', expr: 'rest' },
        { t: 'line:6.start-0.1', eyes: 'arc', brow: 'up', mouth: 'D' },
        { t: 'line:7.start-0.1', eyes: 'smug', brow: 'up', mouth: 'smirk' },
        { t: 'line:8.start-0.1', expr: 'confused' },
        { t: 'line:10.start-0.1', eyes: 'arc', brow: 'up', mouth: 'D' },
        { t: 'line:14.start-0.1', expr: 'fear' },
        { t: 'line:16.start-0.1', expr: 'terror' },
        { t: 'line:24.start-0.1', expr: 'sad' },
      ],
      clips: [
        { clip: 'point', at: 'line:6.word:9', side: 'L', dir: [0, 1, 0.2], hold: 0.5, out: 6 },
        { clip: 'point', at: 'line:11.word:7', side: 'R', dir: [-0.5, 0, 0.2], hold: 0.3, out: 6 },
        { clip: 'shock_pop', at: 'line:14.word:3', hold: 0.1, out: 5 },
      ],
      walk: [
        { t0: 'line:15.start', path: [[1.6, 1.4], [2.5, 2.5], [3.5, 3]], speed: 3.5, gait: 'run', face: 'fear' },
      ],
    },

    villager_3: {
      place: [
        { t: 'line:24.start', at: [-1.2, -399], ry: -20 },
      ],
      face: [
        { t: 'line:1.start-0.1', expr: 'rest' },
        { t: 'line:6.start-0.1', eyes: 'wide', brow: 'up', mouth: 'D' },
        { t: 'line:7.start-0.1', eyes: 'smug', brow: 'up', mouth: 'smirk' },
        { t: 'line:10.start-0.1', eyes: 'arc', brow: 'up', mouth: 'D' },
        { t: 'line:14.start-0.1', expr: 'fear' },
        { t: 'line:16.start-0.1', expr: 'terror' },
        { t: 'line:24.start-0.1', expr: 'sad' },
      ],
      clips: [
        { clip: 'point', at: 'line:6.word:9', side: 'R', dir: [0, 1, 0.2], hold: 0.4, out: 6 },
        { clip: 'shock_pop', at: 'line:14.word:3', hold: 0.1, out: 5 },
      ],
    },

    villagers: {
      place: [
        { t: 'line:24.start', at: [2.5, -399], ry: -20 },
      ],
      face: [
        { t: 'line:6.start-0.1', eyes: 'arc', brow: 'up', mouth: 'D' },
        { t: 'line:10.start-0.1', eyes: 'arc', brow: 'up', mouth: 'D' },
        { t: 'line:14.start-0.1', expr: 'fear' },
        { t: 'line:24.start-0.1', expr: 'sad' },
      ],
      clips: [
        { clip: 'point', at: 'line:11.word:7', side: 'R', dir: [-0.5, 0, 0.2], hold: 0.3, out: 6 },
        { clip: 'shock_pop', at: 'line:14.word:3', hold: 0.1, out: 5 },
      ],
    },
  },

  // ---- Props (one owner on every frame; hand-overs on screen; PROP GUARD) ----
  // Measure graphics are separate instances per variant (measure.js: variant + open).
  props: [
    { id: 'gate', kind: 'gate', owner: null, in: 'world', at: [0, 0, -8], keys: [{ t: 0, open: 0 }] },
    { id: 'measure_storeys', kind: 'measure', variant: 'storeys', owner: null, in: 'world', at: [2.5, 0, -8], keys: [{ t: 'line:1.start', open: 1 }, { t: 'line:1.end', open: 0 }] },
    { id: 'measure_sign3000', kind: 'measure', variant: 'sign3000', owner: null, in: 'world', at: [0, 6, -4], keys: [{ t: 'line:3.start', open: 1 }, { t: 'line:3.end', open: 0 }] },
    { id: 'measure_15_5', kind: 'measure', variant: 'mark15_5', owner: null, in: 'world', at: [1, 0, -8], keys: [{ t: 'line:4.start', open: 1 }, { t: 'line:4.end', open: 0 }] },
    { id: 'measure_10a', kind: 'measure', variant: 'mark10', owner: null, in: 'world', at: [-6, 0, -8], keys: [{ t: 'line:5.start', open: 1 }, { t: 'line:5.end', open: 0 }] },
    { id: 'measure_10b', kind: 'measure', variant: 'mark10', owner: null, in: 'world', at: [-400, 0, -8], keys: [{ t: 'line:21.start', open: 1 }, { t: 'line:21.end', open: 0 }] },
    { id: 'measure_15', kind: 'measure', variant: 'mark15', owner: null, in: 'world', at: [2, 0, -28], keys: [{ t: 'line:16.start', open: 1 }, { t: 'line:16.end', open: 0 }] },
    { id: 'wave', kind: 'wave', owner: null, in: 'world', at: [0, 0, -30], keys: [{ t: 'line:15.start', open: 0 }, { t: 'line:16.end', open: 1, ease: 0.3 }, { t: 'line:23.start', open: 0, ease: 0.5 }] },
    { id: 'calendar', kind: 'calendar', owner: null, in: 'world', at: [-3, 1.5, -4], keys: [{ t: 'line:4.start', open: 1 }, { t: 'line:4.end', open: 0 }, { t: 'line:13.start', open: 1 }, { t: 'line:13.end', open: 0 }] },
    { id: 'blueprint', kind: 'blueprint', owner: null, in: 'world', at: [0, 1.2, 0.5], keys: [{ t: 'line:8.word:7', open: 1 }, { t: 'line:8.end', open: 0 }] },
    { id: 'gravestone', kind: 'gravestone', owner: null, in: 'world', at: [0, 0, -402], keys: [{ t: 0, open: 1 }] },
    { id: 'coins', kind: 'coins', owner: null, in: 'world', at: [-1.6, 2.5, 1.4], keys: [{ t: 'line:6.word:9', drop: { from: [-1.6, 2.5, 1.4], v0: [0.5, 0.5, -1], ground: 0, hide: true } }] },
    { id: 'sign', kind: 'sign', owner: null, in: 'world', at: [0, 8, -7], keys: [{ t: 'line:10.start', open: 1 }, { t: 'line:10.end', open: 0 }] },
    { id: 'box', kind: 'box', owner: 'mayor', in: 'hand:R', at: [0, 0, 0], keys: [{ t: 'line:11.start', open: 1 }] },
    { id: 'flowers', kind: 'flowers', owner: 'villager_1', in: 'hand:R', at: [0, 0, 0], keys: [{ t: 'line:24.start', open: 1 }] },
  ],

  // ---- Hand-overs (both hands meet, the prop changes hands on screen) ----
  handovers: [
    { prop: 'flowers', from: 'villager_1', to: null, t: 'line:24.word:2', fromSide: 'R', toSide: 'world' },
  ],

  // ---- Shots (the member's binding shot plan, segment for segment; cuts 1.5-3 s on line starts/actions) ----
  shots: [
    // Scene 1 — the hook. Shot 1: OPENING. Frame 0 = the mayor's face, head >=300 px (13.5 D at fov 26); tilt-up to the wall.
    { t0: 0, t1: 'line:1.word:8', camera: { move: 'path', keys: [
      { t: 0, pos: { who: 'mayor', offset: [0.4, 2.6, 13.5] }, target: { who: 'mayor', offset: [0, 2.6, 0] }, fov: 26 },
      { t: 'line:1.word:4', pos: { who: 'mayor', offset: [0.6, 3.4, 12.5] }, target: { who: 'mayor', offset: [0, 7, 0] }, fov: 26 },
      { t: 'line:1.word:8', pos: { who: 'mayor', offset: [0.8, 5.0, 11.0] }, target: { who: 'mayor', offset: [0, 15, 0] }, fov: 26 } ] } },
    // Shot 2: wide crane pull-back — the village behind the wall.
    { t0: 'line:1.word:8', t1: 'line:1.end', camera: { move: 'path', keys: [
      { t: 'line:1.word:8', pos: { who: 'mayor', offset: [1, 4, 12] }, target: { who: 'mayor', offset: [0, 6, 0] }, fov: 26 },
      { t: 'line:1.end', pos: { who: 'mayor', offset: [2, 8, 18] }, target: { who: 'mayor', offset: [0, 4, -4] }, fov: 28 } ] } },
    // Shot 3: smooth glide across the mirror sea.
    { t0: 'line:2.start', t1: 'line:2.end', camera: { move: 'path', keys: [
      { t: 'line:2.start', pos: { who: 'mayor', offset: [-6, 1.5, -16] }, target: { who: 'mayor', offset: [0, 1, -24] }, fov: 26 },
      { t: 'line:2.end', pos: { who: 'mayor', offset: [4, 1.5, -18] }, target: { who: 'mayor', offset: [0, 1, -24] }, fov: 26 } ] } },
    // Scene 2 — the bet. Shot 4: medium-wide village pan, the "3,000" sign.
    { t0: 'line:3.start', t1: 'line:3.end', camera: { move: 'push', roll: [1, 2],
      from: { pos: { who: 'mayor', offset: [1, 2.4, 14] }, target: { who: 'mayor', offset: [0, 2.5, 0.8] } },
      to: { pos: { who: 'mayor', offset: [0.8, 2.4, 12.5] }, target: { who: 'mayor', offset: [0, 2.5, 0.8] } } } },
    // Shot 5a: construction glide, the $30M money piles.
    { t0: 'line:4.start', t1: 'line:4.word:8', camera: { move: 'path', keys: [
      { t: 'line:4.start', pos: { who: 'mayor', offset: [-5, 2, -2] }, target: { who: 'mayor', offset: [0, 3, -8] }, fov: 26 },
      { t: 'line:4.word:8', pos: { who: 'mayor', offset: [3, 2.5, -2] }, target: { who: 'mayor', offset: [0, 5, -8] }, fov: 26 } ] } },
    // Shot 5b: the calendar flipping, the 15.5M arrow rising.
    { t0: 'line:4.word:9', t1: 'line:4.end', camera: { move: 'push', roll: [1, 2],
      from: { pos: { who: 'mayor', offset: [0.5, 3, 13] }, target: { who: 'mayor', offset: [0, 10, -8] } },
      to: { pos: { who: 'mayor', offset: [0.4, 3.5, 11.5] }, target: { who: 'mayor', offset: [0, 14, -8] } } } },
    // Shot 6: split comparison aerial pan along the coast, the neighbours' 10M walls.
    { t0: 'line:5.start', t1: 'line:5.end', camera: { move: 'path', keys: [
      { t: 'line:5.start', pos: { who: 'mayor', offset: [-8, 10, 6] }, target: { who: 'mayor', offset: [0, 4, -8] }, fov: 28 },
      { t: 'line:5.end', pos: { who: 'mayor', offset: [8, 10, 6] }, target: { who: 'mayor', offset: [0, 4, -8] }, fov: 28 } ] } },
    // Scene 3 — the mockery. Shot 7a: big close-up, Dutch angle, the mocker laughing.
    { t0: 'line:6.start', t1: 'line:6.end', camera: { move: 'push', roll: [5, 5],
      from: { pos: { who: 'villager_1', offset: [0.4, 2.4, 12] }, target: { who: 'villager_1', offset: [0, 2.5, 0] } },
      to: { pos: { who: 'villager_1', offset: [0.3, 2.4, 10.5] }, target: { who: 'villager_1', offset: [0, 2.5, 0] } } } },
    // Shot 7b: the mocker pointing at the calm sea.
    { t0: 'line:7.start', t1: 'line:7.end', camera: { move: 'push', roll: [4, 5],
      from: { pos: { who: 'villager_1', offset: [-0.5, 2.4, 12] }, target: { who: 'villager_1', offset: [0, 2.2, -10] } },
      to: { pos: { who: 'villager_1', offset: [-0.4, 2.4, 10.8] }, target: { who: 'villager_1', offset: [0, 2.2, -12] } } } },
    // Shot 8: deadpan medium close-up, slow push-in on the mayor.
    { t0: 'line:8.start', t1: 'line:8.word:6', camera: { move: 'push', roll: [2, 3],
      from: { pos: { who: 'mayor', offset: [0.5, 2.4, 13.0] }, target: { who: 'mayor', offset: [0, 2.5, 0] } },
      to: { pos: { who: 'mayor', offset: [0.4, 2.4, 11.5] }, target: { who: 'mayor', offset: [0, 2.5, 0] } } } },
    // Shot 9: tight blueprint insert, the ruler fixed at 15.5M.
    { t0: 'line:8.word:7', t1: 'line:8.end', camera: { move: 'park', pos: { prop: 'blueprint', offset: [0.3, 0.6, 2.2] }, target: { prop: 'blueprint', offset: [0, 0, 0] }, fov: 26 } },
    // Scene 4 — the disgrace. Shot 10: timelapse sky cycle, the wall and the calm sea.
    { t0: 'line:9.start', t1: 'line:9.end', camera: { move: 'park', pos: { who: 'mayor', offset: [0.5, 3, 14] }, target: { who: 'mayor', offset: [0, 6, -8] }, fov: 26 } },
    // Shot 11: quick comic push-in on the "أغبى مشروع" sign.
    { t0: 'line:10.start', t1: 'line:10.end', camera: { move: 'push',
      from: { pos: { prop: 'sign', offset: [0.5, 0.5, 12] }, target: { prop: 'sign', offset: [0, 0, 0] } },
      to: { pos: { prop: 'sign', offset: [0.4, 0.5, 10.5] }, target: { prop: 'sign', offset: [0, 0, 0] } } } },
    // Shot 12: slow lateral tracking, the old mayor leaving town hall with the box.
    { t0: 'line:11.start', t1: 'line:11.end', camera: { move: 'follow', who: 'mayor', camOffset: [1.5, 2.4, 12], look: { who: 'mayor', offset: [0, 2.5, 0] }, parkAt: 'line:11.end' } },
    // Shot 13: gentle crane up to the hill, the gravestone, one leaf falling (place E).
    { t0: 'line:12.start', t1: 'line:12.end', camera: { move: 'path', keys: [
      { t: 'line:12.start', pos: { object: 'gravestone', offset: [2, 1.5, 12] }, target: { object: 'gravestone', offset: [0, 1.5, 0] }, fov: 26 },
      { t: 'line:12.end', pos: { object: 'gravestone', offset: [3, 6, 14] }, target: { object: 'gravestone', offset: [0, 1.5, 0] }, fov: 28 } ] } },
    // Scene 5 — the quake. Shot 14: fast calendar flip, 14 years.
    { t0: 'line:13.start', t1: 'line:13.end', camera: { move: 'park', pos: { prop: 'calendar', offset: [0.3, 0.5, 2.5] }, target: { prop: 'calendar', offset: [0, 0, 0] }, fov: 26 } },
    // Shot 15: heavy camera shake, the earthquake in the streets.
    { t0: 'line:14.start', t1: 'line:14.end', camera: { move: 'path', keys: [
      { t: 'line:14.start', pos: { who: 'villager_1', offset: [1, 2.4, 12] }, target: { who: 'villager_1', offset: [0, 2.5, 0] }, fov: 26, shake: 3 },
      { t: 'line:14.end', pos: { who: 'villager_1', offset: [-1, 2.4, 12] }, target: { who: 'villager_1', offset: [0, 2.5, 0] }, fov: 26, shake: 3 } ] } },
    // Shot 16: high-angle coastline glide, the sea pulling back.
    { t0: 'line:15.start', t1: 'line:15.end', camera: { move: 'path', keys: [
      { t: 'line:15.start', pos: { who: 'mayor', offset: [-6, 12, 4] }, target: { who: 'mayor', offset: [0, 0, -24] }, fov: 28 },
      { t: 'line:15.end', pos: { who: 'mayor', offset: [6, 12, 4] }, target: { who: 'mayor', offset: [0, 0, -24] }, fov: 28 } ] } },
    // Shot 17a: extreme low-angle tilt-up, the wall of water rising.
    { t0: 'line:16.start', t1: 'line:16.word:3', camera: { move: 'path', keys: [
      { t: 'line:16.start', pos: { prop: 'wave', offset: [4, 1.5, 14] }, target: { prop: 'wave', offset: [0, 4, 0] }, fov: 26 },
      { t: 'line:16.word:3', pos: { prop: 'wave', offset: [4, 3, 12] }, target: { prop: 'wave', offset: [0, 16, 0] }, fov: 26 } ] } },
    // Shot 17b: the glowing 15M measure line climbing the wave.
    { t0: 'line:16.word:4', t1: 'line:16.end', camera: { move: 'push',
      from: { pos: { prop: 'measure_15', offset: [1, 4, 13] }, target: { prop: 'measure_15', offset: [0, 12, 0] } },
      to: { pos: { prop: 'measure_15', offset: [0.8, 4, 11.5] }, target: { prop: 'measure_15', offset: [0, 16, 0] } } } },
    // Scene 6 — the flashback. Shot 18: vintage sepia glide, the young mayor on the hill (place B).
    { t0: 'line:17.start', t1: 'line:17.end', camera: { move: 'path', keys: [
      { t: 'line:17.start', pos: { who: 'mayor', offset: [-4, 2.4, 13] }, target: { who: 'mayor', offset: [0, 2.5, 0] }, fov: 26 },
      { t: 'line:17.end', pos: { who: 'mayor', offset: [2, 3, 12] }, target: { who: 'mayor', offset: [0, 2.5, -6] }, fov: 26 } ] } },
    // Shot 19a: close-up tracking along the old rock (place B).
    { t0: 'line:18.start', t1: 'line:18.word:5', camera: { move: 'path', keys: [
      { t: 'line:18.start', pos: { object: 'rock', offset: [-3, 1.5, 4] }, target: { object: 'rock', offset: [0, 1.5, 0] }, fov: 26 },
      { t: 'line:18.word:5', pos: { object: 'rock', offset: [3, 1.5, 4] }, target: { object: 'rock', offset: [0, 1.5, 0] }, fov: 26 } ] } },
    // Shot 19b: the young mayor's hand touching the carved mark (place B).
    { t0: 'line:18.word:6', t1: 'line:18.end', camera: { move: 'park', pos: { object: 'rock', offset: [0.5, 1.2, 2.5] }, target: { object: 'rock', offset: [0, 1.2, 0] }, fov: 26 } },
    // Shot 20: clean cutaway, the room wall, the pencil, the child (place C).
    { t0: 'line:19.start', t1: 'line:19.end', camera: { move: 'park', pos: { who: 'mayor', offset: [0.5, 2, 6] }, target: { who: 'mayor', offset: [0, 1.8, 0] }, fov: 26 } },
    // Shot 21: match-cut, the pencil mark becomes the wall's top edge, workers pouring (place A).
    { t0: 'line:20.start', t1: 'line:20.end', camera: { move: 'path', keys: [
      { t: 'line:20.start', pos: { object: 'wall', offset: [2, 26, 8] }, target: { object: 'wall', offset: [0, 24.8, 0] }, fov: 28 },
      { t: 'line:20.end', pos: { object: 'wall', offset: [-2, 25, 10] }, target: { object: 'wall', offset: [0, 24, 0] }, fov: 28 } ] } },
    // Scene 7 — the payoff. Shot 22a: aerial pan over the neighbouring towns (place D).
    { t0: 'line:21.start', t1: 'line:21.word:6', camera: { move: 'path', keys: [
      { t: 'line:21.start', pos: { object: 'wave', offset: [-10, 14, 8] }, target: { object: 'wave', offset: [0, 4, -8] }, fov: 28 },
      { t: 'line:21.word:6', pos: { object: 'wave', offset: [10, 14, 8] }, target: { object: 'wave', offset: [0, 4, -8] }, fov: 28 } ] } },
    // Shot 22b: the 15 m wave erasing the 10 m walls (place D).
    { t0: 'line:21.word:7', t1: 'line:21.end', camera: { move: 'path', keys: [
      { t: 'line:21.word:7', pos: { object: 'wave', offset: [6, 8, 12] }, target: { object: 'wave', offset: [0, 6, -8] }, fov: 28 },
      { t: 'line:21.end', pos: { object: 'wave', offset: [-6, 6, 12] }, target: { object: 'wave', offset: [0, 4, -8] }, fov: 28 } ] } },
    // Shot 23: dramatic side profile, the wave hits the wall and stops at its edge (place A).
    { t0: 'line:22.start', t1: 'line:22.end', camera: { move: 'path', keys: [
      { t: 'line:22.start', pos: { object: 'wall', offset: [-14, 6, 10] }, target: { object: 'wall', offset: [0, 12, 0] }, fov: 26 },
      { t: 'line:22.word:4', pos: { object: 'wall', offset: [-12, 8, 9] }, target: { object: 'wall', offset: [0, 18, 0] }, fov: 26, shake: 2 },
      { t: 'line:22.end', pos: { object: 'wall', offset: [-12, 8, 9] }, target: { object: 'wall', offset: [0, 24, 0] }, fov: 26 } ] } },
    // Shot 24: smooth crane reveal over the wall, the village intact and dry (place A).
    { t0: 'line:22.end', t1: 'line:23.end', camera: { move: 'path', keys: [
      { t: 'line:22.end', pos: { object: 'wall', offset: [-6, 26, 10] }, target: { object: 'wall', offset: [0, 24, 0] }, fov: 30 },
      { t: 'line:23.end', pos: { object: 'wall', offset: [-4, 28, -8] }, target: { who: 'mayor', offset: [0, 2.5, 0] }, fov: 30 } ] } },
    // Shot 25: slow emotional pull-back, the mockers at the grave, the wall standing far behind (place E). Loop cut on the last word.
    { t0: 'line:24.start', t1: 'line:24.end', camera: { move: 'path', keys: [
      { t: 'line:24.start', pos: { object: 'gravestone', offset: [1, 2, 12] }, target: { object: 'gravestone', offset: [0, 1.5, 0] }, fov: 26 },
      { t: 'line:24.end', pos: { object: 'gravestone', offset: [2, 4, 16] }, target: { object: 'gravestone', offset: [0, 1.5, 0] }, fov: 28 } ] } },
  ],
};
