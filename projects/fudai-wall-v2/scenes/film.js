// Fudai Wall — Build Pass (scenes/film.js)
// Format: 9:16 (1080x1920), 30 fps, voice clock from audio/clean.wav + audio/clean.json (186 words, 0.10-67.55 s).
// Built-in specs/ cast only (per owner instruction). Pure in t. All times tied to words.

export default {
  fps: 30,
  size: [1080, 1920],
  captions: 'words',
  endHold: 0.53,

  world: {
    set: 'own',
    setOpts: {
      wallHeightD: 24.8,     // 15.5 m * 1.6
      waveHeightD: 24.0,     // 15.0 m * 1.6
      neighborWallD: 16.0,   // 10.0 m * 1.6
    },
  },

  // Ready-made built-in specs/ characters only (no custom scenes/cast/*.json)
  cast: {
    mayor:     { spec: 'walter',   at: [0.0, 6.0],     ry: 20 },
    villager1: { spec: 'bouncer',  at: [2.4, 2.2],     ry: -28 },
    villager2: { spec: 'mara',     at: [-2.2, 1.8],    ry: 32 },
    villager3: { spec: 'postman',  at: [3.8, -1.5],    ry: -35 },
    villager4: { spec: 'dotty',    at: [-3.4, -1.2],   ry: 35 },
    worker:    { spec: 'engineer', at: [-1.8, -14.5],  ry: 25 },
    child:     { spec: 'pip',      at: [800.4, 2.1],   ry: 15 },
    parent:    { spec: 'ruby',     at: [798.9, 2.5],   ry: 42 },
  },

  // All 186 words in exact order as heard in audio/clean.json (28 lines; quoted speech on villager1 for L8-L9)
  voice: {
    file: 'audio/clean.wav',
    words: 'audio/clean.json',
    lines: [
      /* 1  */ { who: null,        text: 'بنى سور خرساني بطول عمارة خمس أدوار قدام قرية صيد صغيرة' },
      /* 2  */ { who: null,        text: 'والبحر قدامه هادي زي المراية' },
      /* 3  */ { who: null,        text: 'كان عمدة لقرية فيها 3000 شخص بس' },
      /* 4  */ { who: null,        text: 'وصرف 30 مليون دولار و12 سنة بناء على بوابة' },
      /* 5  */ { who: null,        text: 'ارتفاعها 15 متر ونص' },
      /* 6  */ { who: null,        text: 'مع إن كل القرى اللي حواليه اكتفت بسور 10 متر' },
      /* 7  */ { who: null,        text: 'أهل القرية ضحكوا عليه وقالوا له:' },
      /* 8  */ { who: 'villager1', text: 'إنت بترمي فلوسنا في البحر؟' },
      /* 9  */ { who: 'villager1', text: 'الموج عمره ما هيوصل هناك' },
      /* 10 */ { who: null,        text: 'بس العمدة ما ردش' },
      /* 11 */ { who: null,        text: 'ولا نزل السور سنتي واحد' },
      /* 12 */ { who: null,        text: 'السور خلص والبحر فضل هادي سنين' },
      /* 13 */ { who: null,        text: 'والناس سموه أغبى مشروع في البلد' },
      /* 14 */ { who: null,        text: 'العمدة طلع على المعاش وهو لسه بيتلام على الفلوس اللي ضاعت' },
      /* 15 */ { who: null,        text: 'ومات من غير ما حد واحد يصدقه' },
      /* 16 */ { who: null,        text: 'بعد موته بـ 14 سنة' },
      /* 17 */ { who: null,        text: 'الأرض اتهزت بزلزال عنيف' },
      /* 18 */ { who: null,        text: 'والبحر اتسحب لورا' },
      /* 19 */ { who: null,        text: 'ورجع بموجة عملاقة' },
      /* 20 */ { who: null,        text: 'ارتفاعها 15 متر بالظبط' },
      /* 21 */ { who: null,        text: 'أصل العمدة وهو شاب شاف البحر بيبلع قريته' },
      /* 22 */ { who: null,        text: 'فافتكر علامات قديمة على الصخر بتحدد أعلى نقطة وصلها الموج زمان' },
      /* 23 */ { who: null,        text: 'زي ما تحط شرطة بالقلم على الحيطة عشان ما تنساش المقاس' },
      /* 24 */ { who: null,        text: 'هو بنى السور على مقاس أضخم موجة في الذاكرة' },
      /* 25 */ { who: null,        text: 'القرى اللي حواليهم بأسوارها الـ 10 متر اتمسحت في دقايق' },
      /* 26 */ { who: null,        text: 'والموجة خبطت في سوره ووقفت عند حافته' },
      /* 27 */ { who: null,        text: 'القرية كلها نجت' },
      /* 28 */ { who: null,        text: 'والناس اللي ضحكوا عليه راحوا قبره يشكروه' },
    ],
  },

  // Word-tied acting for every line; all face/clip/walk keys kept >= 4 frames (>0.12 s) clear of cuts;
  // place keys sit strictly ON cuts. Every arm clip has hold + out.
  acts: {
    mayor: {
      place: [
        { t: 'line:4.start',  at: [2.2, -13.5], ry: -25 },
        { t: 'line:7.start',  at: [-1.4, 5.4],  ry: 42 },
        { t: 'line:10.start', at: [0.0, 6.0],   ry: 18 },
        { t: 'line:11.start', at: [-0.8, 5.2],  ry: 48 },
        { t: 'line:12.start', at: [-2.6, -2.0], ry: 28 },
        { t: 'line:14.start', at: [-5.8, 5.2],  ry: 70 },
        { t: 'line:21.start', at: [399.2, 4.2], ry: 22 },     // Flashback hillside (same person via place)
        { t: 'line:22.start', at: [399.6, 3.0], ry: 40 },     // Next to carved tsunami rock
        { t: 'line:24.start', at: [0.4, -22.2], ry: 22 },     // Back to Fudai wall top rim
      ],
      height: [
        { t: 0,               y: 0 },
        { t: 'line:24.start', y: 24.8 },                      // Standing on 15.5M concrete crest
        { t: 'line:25.start', y: 0 },
      ],
      face: [
        { t: 0,                    eyes: 'open',  brow: 'down',    mouth: 'flat',  react: false },
        { t: 'line:1.word:5',      eyes: 'open',  brow: 'up',      mouth: 'flat',  react: false },
        { t: 'line:3.word:2',      eyes: 'open',  brow: 'on',      mouth: 'smile', react: false },
        { t: 'line:5.word:2',      eyes: 'open',  brow: 'down',    mouth: 'flat',  react: false },
        { t: 'line:8.word:3+0.07', eyes: 'half',  brow: 'on',      mouth: 'flat',  react: false },
        { t: 'line:10.word:2',     eyes: 'open',  brow: 'on',      mouth: 'tight', react: false },
        { t: 'line:11.word:2',     eyes: 'open',  brow: 'down',    mouth: 'flat',  react: false },
        { t: 'line:12.word:3',     eyes: 'half',  brow: 'on',      mouth: 'rest',  react: false },
        { t: 'line:14.word:2',     eyes: 'sad',   brow: 'worried', mouth: 'frown', react: false },
        { t: 'line:21.word:5',     eyes: 'wide',  brow: 'worried', mouth: 'o',     react: 'recoil' },
        { t: 'line:22.word:2',     eyes: 'open',  brow: 'down',    mouth: 'flat',  react: false },
        { t: 'line:24.word:3',     eyes: 'open',  brow: 'down',    mouth: 'smile', react: false },
      ],
      look: [
        { t: 0,                at: [0.3, 2.3, 14.0] },
        { t: 'line:1.word:5',  at: [0.0, 14.0, -24.0] },
        { t: 'line:8.word:2',  at: [1.5, 2.3, 7.5] },
        { t: 'line:11.word:2', at: [0.2, 1.4, 5.0] },
        { t: 'line:21.word:5', at: [400.0, 1.6, -24.0] },
        { t: 'line:22.word:2', at: [400.9, 2.0, 2.4] },
      ],
      clips: [
        { clip: 'point',     at: 'line:1.word:5+0.04',  side: 'R', dir: [0.25, 0.85, 0.25], hold: 1.1, out: 6 },
        { clip: 'wave',      at: 'line:3.word:2+0.04',  side: 'R', hold: 0.9, out: 6 },
        { clip: 'point',     at: 'line:5.word:2+0.04',  side: 'L', dir: [-0.2, 0.9, 0.2],   hold: 1.0, out: 6 },
        { clip: 'lean_over', at: 'line:11.word:2+0.04', hold: 1.1, out: 6 },
        { clip: 'carry',     at: 'line:14.word:2+0.04', prop: 'retire_box', hold: 2.0, out: 6 },
        { clip: 'point',     at: 'line:22.word:2+0.04', side: 'R', dir: [0.65, 0.25, 0.2],  hold: 1.8, out: 6 },
        { clip: 'akimbo',    at: 'line:24.word:3+0.04', side: 'both', hold: 1.4, out: 6 },
      ],
      walk: [
        { t0: 'line:14.word:2+0.04', path: [[-5.8, 5.2], [2.4, 5.2]], speed: 2.2, face: 75 },
      ],
    },

    villager1: {
      place: [
        { t: 'line:7.start',  at: [1.5, 5.2],     ry: -32 },
        { t: 'line:14.start', at: [-2.8, 3.2],    ry: 35 },
        { t: 'line:17.start', at: [-1.4, 4.4],    ry: 15 },
        { t: 'line:19.start', at: [-1.2, 2.0],    ry: 20 },
        { t: 'line:26.start', at: [-2.4, -14.0],  ry: 25 },
        { t: 'line:27.start', at: [-1.8, 4.2],    ry: 20 },
        { t: 'line:28.start', at: [1598.4, 2.9],  ry: 32 },   // Same mocker humbled at grave
      ],
      face: [
        { t: 0,                eyes: 'open',     brow: 'on',      mouth: 'rest',  react: false },
        { t: 'line:7.word:3',  eyes: 'arc',      brow: 'up',      mouth: 'D',     hold: true, react: false },
        { t: 'line:8.word:1',  eyes: 'smug',     brow: 'up',      mouth: 'smirk', react: false },
        { t: 'line:9.word:2',  eyes: 'arc',      brow: 'up',      mouth: 'D',     react: false },
        { t: 'line:14.word:7', eyes: 'angry',    brow: 'down',    mouth: 'frown', react: false },
        { t: 'line:17.word:2', eyes: 'wide',     brow: 'worried', mouth: 'wide',  react: 'recoil' },
        { t: 'line:18.word:2', eyes: 'pinpoint', brow: 'up',      mouth: 'o',     react: false },
        { t: 'line:19.word:3', eyes: 'wide',     brow: 'worried', mouth: 'wide',  react: false },
        { t: 'line:26.word:5', eyes: 'wide',     brow: 'up',      mouth: 'o',     react: false },
        { t: 'line:27.word:2', eyes: 'arc',      brow: 'up',      mouth: 'D',     hold: true, react: false },
        { t: 'line:28.word:2', eyes: 'sad',      brow: 'worried', mouth: 'rest',  react: false },
      ],
      clips: [
        { clip: 'point',      at: 'line:8.word:3+0.04',  side: 'R', dir: [-0.6, 0.1, 0.25], hold: 1.0, out: 5 },
        { clip: 'point',      at: 'line:9.word:4+0.04',  side: 'L', dir: [0.3, 0.9, 0.2],   hold: 0.9, out: 5 },
        { clip: 'point',      at: 'line:14.word:7+0.04', side: 'R', dir: [0.7, 0.1, 0.2],   hold: 1.1, out: 6 },
        { clip: 'shock_jump', at: 'line:17.word:2+0.04', hold: 0.15, out: 5 },
        { clip: 'hop_bounce', at: 'line:27.word:2+0.04', hold: 0.4, out: 5 },
        { clip: 'lean_over',  at: 'line:28.word:5+0.04', hold: 1.2, out: 6 },
      ],
      walk: [
        { t0: 'line:19.word:2+0.04', path: [[-1.2, 2.0], [-2.5, 11.5]], speed: 4.2, gait: 'run', face: 15 },
      ],
    },

    villager2: {
      place: [
        { t: 'line:7.start',  at: [3.2, 4.2],     ry: -38 },
        { t: 'line:13.start', at: [-1.4, 2.2],    ry: 28 },
        { t: 'line:17.start', at: [1.5, 4.0],     ry: -18 },
        { t: 'line:19.start', at: [1.4, 1.5],     ry: -20 },
        { t: 'line:27.start', at: [1.6, 4.0],     ry: -20 },
        { t: 'line:28.start', at: [1601.5, 2.8],  ry: -32 },  // Holds flowers at grave
      ],
      face: [
        { t: 0,                     eyes: 'open', brow: 'on',      mouth: 'rest', react: false },
        { t: 'line:7.word:3+0.07',  eyes: 'arc',  brow: 'up',      mouth: 'D',    hold: true, react: false },
        { t: 'line:13.word:3',      eyes: 'arc',  brow: 'up',      mouth: 'D',    hold: true, react: false },
        { t: 'line:17.word:2+0.07', eyes: 'wide', brow: 'worried', mouth: 'wide', react: 'recoil' },
        { t: 'line:19.word:3+0.07', eyes: 'wide', brow: 'worried', mouth: 'o',    react: false },
        { t: 'line:27.word:2+0.07', eyes: 'arc',  brow: 'up',      mouth: 'D',    hold: true, react: false },
        { t: 'line:28.word:2+0.07', eyes: 'sad',  brow: 'worried', mouth: 'rest', react: false },
      ],
      clips: [
        { clip: 'point',     at: 'line:13.word:3+0.04', side: 'R', dir: [0.1, 0.85, 0.2], hold: 1.0, out: 6 },
        { clip: 'shock_pop', at: 'line:17.word:2+0.07', hold: 0.2, out: 5 },
        { clip: 'wave',      at: 'line:27.word:2+0.04', side: 'R', hold: 0.6, out: 5 },
        { clip: 'lean_over', at: 'line:28.word:5+0.07', hold: 1.1, out: 6 },
      ],
      walk: [
        { t0: 'line:19.word:2+0.07', path: [[1.4, 1.5], [2.4, 10.8]], speed: 4.0, gait: 'run', face: -18 },
      ],
    },

    villager3: {
      place: [
        { t: 'line:6.start',  at: [1198.5, -14.0], ry: 22 },
        { t: 'line:13.start', at: [1.5, 2.0],      ry: -28 },
        { t: 'line:14.start', at: [-0.8, 2.8],     ry: 22 },
        { t: 'line:25.start', at: [1198.5, -12.0], ry: 20 },
        { t: 'line:27.start', at: [3.2, 2.8],      ry: -25 },
        { t: 'line:28.start', at: [1596.8, 4.1],   ry: 38 },
      ],
      face: [
        { t: 0,                     eyes: 'open',  brow: 'on',      mouth: 'rest',  react: false },
        { t: 'line:6.word:8',       eyes: 'smug',  brow: 'on',      mouth: 'smirk', react: false },
        { t: 'line:13.word:3+0.07', eyes: 'arc',   brow: 'up',      mouth: 'D',     hold: true, react: false },
        { t: 'line:14.word:7+0.07', eyes: 'angry', brow: 'down',    mouth: 'frown', react: false },
        { t: 'line:25.word:8',      eyes: 'wide',  brow: 'worried', mouth: 'wide',  react: 'recoil' },
        { t: 'line:28.word:3',      eyes: 'sad',   brow: 'worried', mouth: 'rest',  react: false },
      ],
      clips: [
        { clip: 'shrug',     at: 'line:6.word:8+0.04',  hold: 0.9, out: 6 },
        { clip: 'akimbo',    at: 'line:13.word:3+0.07', side: 'both', hold: 1.0, out: 6 },
        { clip: 'point',     at: 'line:14.word:7+0.07', side: 'L', dir: [0.6, 0.1, 0.2], hold: 1.0, out: 6 },
        { clip: 'lean_over', at: 'line:28.word:6+0.04', hold: 1.0, out: 6 },
      ],
    },

    villager4: {
      place: [
        { t: 'line:17.start', at: [0.1, 2.6],     ry: 12 },
        { t: 'line:27.start', at: [-3.2, 2.6],    ry: 28 },
        { t: 'line:28.start', at: [1603.0, 4.0],  ry: -38 },
      ],
      face: [
        { t: 0,                     eyes: 'open', brow: 'on',      mouth: 'smile', react: false },
        { t: 'line:17.word:2+0.04', eyes: 'wide', brow: 'worried', mouth: 'wide',  react: 'recoil' },
        { t: 'line:27.word:3',      eyes: 'arc',  brow: 'up',      mouth: 'D',     hold: true, react: false },
        { t: 'line:28.word:3+0.07', eyes: 'sad',  brow: 'worried', mouth: 'rest',  react: false },
      ],
      clips: [
        { clip: 'hand_to_temple', at: 'line:17.word:3+0.04', hold: 0.7, out: 5 },
        { clip: 'wave',           at: 'line:27.word:2+0.07', side: 'L', hold: 0.6, out: 5 },
        { clip: 'lean_over',      at: 'line:28.word:6+0.07', hold: 1.0, out: 6 },
      ],
    },

    worker: {
      place: [
        { t: 'line:11.start', at: [1.1, 5.2],    ry: -48 },
        { t: 'line:24.start', at: [-1.8, -22.2], ry: 28 },
      ],
      height: [
        { t: 0,               y: 0 },
        { t: 'line:24.start', y: 24.8 },
        { t: 'line:25.start', y: 0 },
      ],
      face: [
        { t: 0,                     eyes: 'open',  brow: 'on',      mouth: 'rest',  react: false },
        { t: 'line:4.word:7',       eyes: 'open',  brow: 'up',      mouth: 'smile', react: false },
        { t: 'line:11.word:2+0.07', eyes: 'wince', brow: 'worried', mouth: 'tight', react: false },
        { t: 'line:24.word:3+0.07', eyes: 'open',  brow: 'up',      mouth: 'smile', react: false },
      ],
      clips: [
        { clip: 'point', at: 'line:4.word:7+0.04',  side: 'R', dir: [0.3, 0.8, 0.2],   hold: 1.4, out: 6 },
        { clip: 'point', at: 'line:11.word:2+0.07', side: 'L', dir: [-0.5, -0.2, 0.2], hold: 0.9, out: 6 },
        { clip: 'point', at: 'line:24.word:3+0.07', side: 'R', dir: [0.4, 0.1, 0.2],   hold: 1.4, out: 6 },
      ],
    },

    child: {
      face: [
        { t: 0,                eyes: 'open', brow: 'on', mouth: 'smile', react: false },
        { t: 'line:23.word:4', eyes: 'arc',  brow: 'up', mouth: 'D',     hold: true, react: false },
      ],
      clips: [],
    },

    parent: {
      face: [
        { t: 0,                eyes: 'open', brow: 'on', mouth: 'smile', react: false },
        { t: 'line:23.word:4', eyes: 'open', brow: 'up', mouth: 'smile', react: false },
      ],
      clips: [
        { clip: 'point', at: 'line:23.word:4+0.04', side: 'R', dir: [0.65, 0.15, 0.2], hold: 1.6, out: 6 },
      ],
    },
  },

  // Props: one owner per frame, visibility/opts swapped cleanly on cuts via inner-group opts.shown
  props: [
    {
      id: 'harbour_rod', kind: 'fishing_rod', owner: 'villager4', in: 'hand:R',
      keys: [
        { t: 'line:17.start', in: 'hidden' },
      ],
    },
    {
      id: 'retire_box', kind: 'box', owner: 'mayor', in: 'hidden',
      keys: [
        { t: 'line:14.start', in: 'hand:R' },
        { t: 'line:15.start', in: 'hidden' },
      ],
    },
    {
      id: 'analogy_pen', kind: 'pen', owner: 'parent', in: 'hand:R',
    },
    {
      id: 'grave_flowers', kind: 'flowers', owner: 'villager2', in: 'hidden',
      keys: [
        { t: 'line:28.start', in: 'hand:R' },
      ],
    },

    {
      id: 'storey5_overlay', kind: 'measure_sign', in: 'world', at: [9.5, 0, -21.0],
      opts: { kind: 'storey5', progress: 1.0, shown: true },
      keys: [
        { t: 'line:2.start', shown: false },
      ],
    },
    {
      id: 'pop3000_sign', kind: 'measure_sign', in: 'world', at: [0.0, 5.4, 2.0],
      opts: { kind: 'pop3000', shown: false },
      keys: [
        { t: 'line:3.start', shown: true },
        { t: 'line:4.start', shown: false },
      ],
    },
    {
      id: 'cost30m_sign', kind: 'measure_sign', in: 'world', at: [-4.2, 6.2, -14.0],
      opts: { kind: 'cost30m', shown: false },
      keys: [
        { t: 'line:4.start', shown: true },
        { t: 'line:5.start', shown: false },
      ],
    },
    {
      id: 'cash_stacks', kind: 'money_stack', in: 'world', at: [-1.4, 0, -11.5],
      opts: { bundles: 6, shown: false },
      keys: [
        { t: 'line:4.start', shown: true },
        { t: 'line:5.start', shown: false },
        { t: 'line:7.start', at: [0.2, 0.2, 4.6], shown: true },
        { t: 'line:9.start', shown: false },
      ],
    },
    {
      id: 'cal_12yr', kind: 'calendar_flip', in: 'world', at: [4.2, 4.2, -13.5],
      opts: { years: '12', flip: 0, shown: false },
      keys: [
        { t: 'line:4.start', shown: true, flip: 0 },
        { t: 'line:4.end',   flip: 1, ease: 2.8 },
        { t: 'line:5.start', shown: false },
      ],
    },
    {
      id: 'height155_gauge', kind: 'measure_sign', in: 'world', at: [9.2, 0, -20.5],
      opts: { kind: 'height155', progress: 0.15, shown: false },
      keys: [
        { t: 'line:5.start',  shown: true, progress: 0.15 },
        { t: 'line:5.word:2', progress: 1.0, ease: 1.1 },
        { t: 'line:6.start',  shown: false },
        { t: 'line:24.start', shown: true, progress: 1.0 },
        { t: 'line:25.start', shown: false },
        { t: 'line:26.start', shown: true, progress: 1.0 },
        { t: 'line:27.start', shown: false },
      ],
    },
    {
      id: 'height10_gauge', kind: 'measure_sign', in: 'world', at: [1208.0, 0, -21.5],
      opts: { kind: 'height10', progress: 1.0, shown: false },
      keys: [
        { t: 'line:6.start',  shown: true },
        { t: 'line:7.start',  shown: false },
        { t: 'line:25.start', shown: true },
        { t: 'line:26.start', shown: false },
      ],
    },
    {
      id: 'blueprint_board', kind: 'blueprint_ruler', in: 'world', at: [0.15, 1.35, 5.2],
      opts: { locked: 0.4, shown: false },
      keys: [
        { t: 'line:11.start',  shown: true, locked: 0.35 },
        { t: 'line:11.word:2', locked: 1.0, ease: 0.35 },
        { t: 'line:12.start',  shown: false },
      ],
    },
    {
      id: 'dumb_project_sign', kind: 'measure_sign', in: 'world', at: [0.0, 5.2, 0.8],
      opts: { kind: 'dumb_sign', shown: false },
      keys: [
        { t: 'line:13.start', shown: true },
        { t: 'line:14.start', shown: false },
      ],
    },
    {
      id: 'mayor_gravestone', kind: 'gravestone', in: 'world', at: [1600.0, 0, 1.2],
      opts: { shown: true },
    },
    {
      id: 'cal_14yr', kind: 'calendar_flip', in: 'world', at: [0.0, 3.2, 2.0],
      opts: { years: '14', flip: 0, shown: false },
      keys: [
        { t: 'line:16.start', shown: true, flip: 0 },
        { t: 'line:16.end',   flip: 1, ease: 1.3 },
        { t: 'line:17.start', shown: false },
      ],
    },
    {
      id: 'wave15_gauge', kind: 'measure_sign', in: 'world', at: [8.5, 0, -52.0],
      opts: { kind: 'wave15', progress: 0.2, shown: false },
      keys: [
        { t: 'line:20.start',  shown: true, progress: 0.2 },
        { t: 'line:20.word:4', progress: 1.0, ease: 1.2 },
        { t: 'line:21.start',  shown: false },
      ],
    },
  ],

  handovers: [],

  // 28 shots following the binding 7-scene visualization bible + Frame 0 expressive face reconciliation
  shots: [
    // S1 (Scene 1a): Frame 0 expressive face on Mayor Wamura (head ~395 px) -> Low-angle vertical tilt-up to 5-storey wall
    {
      t0: 0, t1: 'line:1.word:8', focus: 'mayor',
      camera: {
        move: 'path',
        keys: [
          { t: 0,               pos: [0.6, 2.05, 16.5], target: [0.0, 2.25, 6.0],   fov: 26, roll: 2 },
          { t: 'line:1.word:3', pos: [1.4, 2.4, 18.2],  target: [0.5, 5.2, -6.0],   fov: 29, roll: 1.5 },
          { t: 'line:1.word:8', pos: [3.2, 5.2, 24.0],  target: [2.5, 14.5, -23.0], fov: 34, roll: 1 },
        ],
      },
    },
    // S2 (Scene 1b): Wide Crane Pull-Back revealing small fishing village dwarfed by the wall
    {
      t0: 'line:1.word:8', t1: 'line:2.start',
      camera: {
        move: 'push',
        from: { pos: [-7.5, 7.5, 22.0],   target: [0.0, 6.5, -10.0], fov: 32, roll: -1.5 },
        to:   { pos: [-11.5, 11.5, 31.0], target: [0.0, 8.5, -18.0], fov: 35, roll: -0.5 },
      },
    },
    // S3 (Scene 1c): Smooth Glide Across Mirror-Flat Water past still fishing boat
    {
      t0: 'line:2.start', t1: 'line:3.start',
      camera: {
        move: 'push',
        from: { pos: [-9.0, 2.1, -29.0], target: [-2.0, 1.4, -46.0], fov: 28, roll: 1 },
        to:   { pos: [-1.5, 2.0, -31.0], target: [4.5, 1.4, -50.0],  fov: 28, roll: -1 },
      },
    },
    // S4 (Scene 2a): Medium-Wide Village Square Pan (Mayor centre, 3,000 sign above)
    {
      t0: 'line:3.start', t1: 'line:4.start', focus: 'mayor',
      camera: {
        move: 'push',
        from: { pos: [-2.8, 2.3, 18.5], target: [0.0, 2.6, 4.5], fov: 28, roll: 1.5 },
        to:   { pos: [2.4, 2.4, 17.2],  target: [0.0, 2.8, 4.5], fov: 28, roll: 0.5 },
      },
    },
    // S5 (Scene 2b): Construction Time-Lapse Glide (cranes, $30M stacks, 12-year calendar, rising gate)
    {
      t0: 'line:4.start', t1: 'line:5.start', focus: 'worker',
      camera: {
        move: 'push',
        from: { pos: [-6.5, 2.6, -2.5], target: [0.0, 4.2, -16.0], fov: 30, roll: -2 },
        to:   { pos: [4.8, 3.4, -4.0],  target: [0.0, 6.0, -18.0], fov: 32, roll: -1 },
      },
    },
    // S6 (Scene 2c): Low-angle Tilt-Up along luminous 15.5M measure arrow
    {
      t0: 'line:5.start', t1: 'line:6.start',
      camera: {
        move: 'push',
        from: { pos: [3.2, 2.2, -2.0], target: [6.5, 5.5, -21.0],  fov: 28, roll: 2 },
        to:   { pos: [4.2, 4.5, 1.5],  target: [7.0, 17.5, -21.0], fov: 32, roll: 1 },
      },
    },
    // S7 (Scene 2d): Split Comparison Lateral Pan along neighbouring 10M coastal walls
    {
      t0: 'line:6.start', t1: 'line:7.start',
      camera: {
        move: 'push',
        from: { pos: [1188.0, 9.5, -4.0], target: [1202.0, 7.2, -22.0], fov: 32, roll: -1.5 },
        to:   { pos: [1206.0, 9.0, -5.5], target: [1208.0, 7.2, -22.0], fov: 30, roll: -0.5 },
      },
    },
    // S8 (Scene 3a): Signature RicksClips Big Close-Up (Dutch 5 deg) on mocking villager1 (L7-L8)
    {
      t0: 'line:7.start', t1: 'line:9.start', focus: 'villager1',
      camera: {
        move: 'push',
        from: { pos: [2.8, 2.05, 15.8], target: [1.5, 2.25, 5.2], fov: 26, roll: 5 },
        to:   { pos: [2.4, 2.05, 14.5], target: [1.5, 2.25, 5.2], fov: 26, roll: 4 },
      },
    },
    // S9 (Scene 3b): Tighter angled CU on villager1 pointing high at wall + villager2 laughing (L9)
    {
      t0: 'line:9.start', t1: 'line:10.start', focus: 'villager1',
      camera: {
        move: 'push',
        from: { pos: [0.4, 2.05, 14.8], target: [2.0, 2.25, 4.9], fov: 26, roll: -4 },
        to:   { pos: [0.7, 2.15, 13.8], target: [2.0, 2.35, 4.9], fov: 26, roll: -3 },
      },
    },
    // S10 (Scene 3c): Deadpan Medium Close-Up Slow Push-In on silent Mayor Wamura (L10)
    {
      t0: 'line:10.start', t1: 'line:11.start', focus: 'mayor',
      camera: {
        move: 'push',
        from: { pos: [-0.5, 2.1, 16.4], target: [0.0, 2.25, 6.0], fov: 26, roll: 1 },
        to:   { pos: [-0.3, 2.1, 15.0], target: [0.0, 2.25, 6.0], fov: 26, roll: 1.5 },
      },
    },
    // S11 (Scene 3d): Tight Blueprint Insert — Mayor locks ruler at 15.5M (L11)
    {
      t0: 'line:11.start', t1: 'line:12.start', focus: 'blueprint_board',
      camera: {
        move: 'push',
        from: { pos: [0.2, 4.1, 8.6], target: [0.15, 1.45, 5.2], fov: 26, roll: -2 },
        to:   { pos: [0.1, 3.8, 7.8], target: [0.15, 1.45, 5.2], fov: 26, roll: -1 },
      },
    },
    // S12 (Scene 4a): Time-Lapse Sky Cycle over finished wall & dead-calm sea (L12)
    {
      t0: 'line:12.start', t1: 'line:13.start', focus: 'mayor',
      camera: {
        move: 'push',
        from: { pos: [-4.2, 2.3, 10.5], target: [-1.0, 4.5, -14.0], fov: 30, roll: 1 },
        to:   { pos: [-3.4, 2.6, 9.2],  target: [-0.5, 5.2, -16.0], fov: 30, roll: 2 },
      },
    },
    // S13 (Scene 4b): Quick Comic Push-In on hanging mocking sign ("أغبى مشروع") & laughing villagers (L13)
    {
      t0: 'line:13.start', t1: 'line:14.start', focus: 'villager2',
      camera: {
        move: 'push',
        from: { pos: [0.2, 2.2, 13.8], target: [0.0, 3.3, 1.6], fov: 28, roll: -3.5 },
        to:   { pos: [0.0, 2.4, 11.4], target: [0.0, 3.6, 1.4], fov: 27, roll: -2.5 },
      },
    },
    // S14 (Scene 4c): Slow Lateral Tracking Shot — retiring Mayor leaving city hall carrying box (L14)
    {
      t0: 'line:14.start', t1: 'line:15.start', focus: 'mayor',
      camera: {
        move: 'push',
        from: { pos: [-5.2, 2.2, 16.5], target: [-4.5, 2.2, 5.2], fov: 26, roll: 1.5 },
        to:   { pos: [1.8, 2.2, 16.2],  target: [1.6, 2.2, 5.2],  fov: 26, roll: 1 },
      },
    },
    // S15 (Scene 4d): Gentle Crane Up on hilltop gravestone overlooking distant silent wall (L15)
    {
      t0: 'line:15.start', t1: 'line:16.start', focus: 'mayor_gravestone',
      camera: {
        move: 'push',
        from: { pos: [1601.5, 2.0, 10.5], target: [1600.0, 1.6, 0.5],   fov: 28, roll: -1 },
        to:   { pos: [1602.2, 4.4, 12.2], target: [1600.0, 0.8, -12.0], fov: 30, roll: -0.5 },
      },
    },
    // S16 (Scene 5a): Fast Calendar Flip (14 years) as sky shifts to stormy slate (L16)
    {
      t0: 'line:16.start', t1: 'line:17.start', focus: 'cal_14yr',
      camera: {
        move: 'push',
        from: { pos: [0.6, 2.8, 8.8],  target: [0.0, 3.2, 2.0], fov: 26, roll: 2.5 },
        to:   { pos: [-0.3, 3.0, 7.6], target: [0.0, 3.2, 2.0], fov: 26, roll: 3.5 },
      },
    },
    // S17 (Scene 5b): Heavy Camera Shake in village street during violent earthquake (L17)
    {
      t0: 'line:17.start', t1: 'line:18.start', focus: 'villager1',
      camera: {
        move: 'path',
        keys: [
          { t: 'line:17.start', pos: [0.4, 2.0, 15.2],  target: [0.0, 2.2, 3.6], fov: 28, roll: -4, shake: 3 },
          { t: 'line:18.start', pos: [-0.6, 2.1, 13.8], target: [0.0, 2.2, 3.6], fov: 29, roll: 4,  shake: 3 },
        ],
      },
    },
    // S18 (Scene 5c): High-Angle Coastline Glide over retreating ocean & stranded boats (L18)
    {
      t0: 'line:18.start', t1: 'line:19.start',
      camera: {
        move: 'push',
        from: { pos: [-10.0, 14.0, -18.0], target: [-1.0, 0.0, -48.0], fov: 34, roll: 2 },
        to:   { pos: [4.0, 13.0, -20.0],   target: [2.0, 0.0, -56.0],  fov: 34, roll: 1 },
      },
    },
    // S19 (Scene 5d): Extreme Low-Angle Tilt-Up on fleeing villagers + rising wall of water (L19)
    {
      t0: 'line:19.start', t1: 'line:20.start', focus: 'villager1',
      camera: {
        move: 'path',
        keys: [
          { t: 'line:19.start', pos: [0.2, 1.85, 16.0], target: [0.0, 2.3, 3.0],    fov: 28, roll: -3, shake: 1.5 },
          { t: 'line:20.start', pos: [0.8, 2.2, 17.5],  target: [0.0, 11.5, -45.0], fov: 34, roll: -4, shake: 2 },
        ],
      },
    },
    // S20 (Scene 5e): Hero Low-Angle Tilt-Up tracking luminous 15M wave gauge (L20)
    {
      t0: 'line:20.start', t1: 'line:21.start',
      camera: {
        move: 'push',
        from: { pos: [-4.0, 2.4, -22.0], target: [4.0, 7.0, -52.0],  fov: 32, roll: 3 },
        to:   { pos: [-2.5, 4.2, -20.0], target: [5.0, 18.5, -52.0], fov: 35, roll: 2 },
      },
    },
    // S21 (Scene 6a): Vintage Sepia Flashback Glide — young Mayor watching sea swallow old village (L21)
    {
      t0: 'line:21.start', t1: 'line:22.start', focus: 'mayor',
      camera: {
        move: 'push',
        from: { pos: [397.2, 2.1, 14.8], target: [399.5, 2.2, 3.5],  fov: 26, roll: -1.5 },
        to:   { pos: [401.2, 2.5, 13.8], target: [399.5, 1.4, -8.0], fov: 28, roll: -0.5 },
      },
    },
    // S22 (Scene 6b): Close-Up Tracking Along Ancient Carved Tsunami Rock + Mayor's hand (L22)
    {
      t0: 'line:22.start', t1: 'line:23.start', focus: 'mayor',
      camera: {
        move: 'push',
        from: { pos: [399.0, 2.05, 13.4], target: [400.2, 2.15, 2.6], fov: 26, roll: 2 },
        to:   { pos: [401.6, 2.10, 11.8], target: [400.6, 2.10, 2.3], fov: 26, roll: 1 },
      },
    },
    // S23 (Scene 6c): Clean Cutaway Medium Shot — Parent marking pencil height line above child (L23)
    {
      t0: 'line:23.start', t1: 'line:24.start', focus: 'parent',
      camera: {
        move: 'push',
        from: { pos: [799.8, 2.05, 12.8], target: [799.6, 2.1, 2.2],  fov: 26, roll: -1.5 },
        to:   { pos: [799.5, 2.05, 11.5], target: [799.8, 2.05, 2.1], fov: 26, roll: -1 },
      },
    },
    // S24 (Scene 6d): Match-Cut Glide along top concrete rim of 15.5M seawall (L24)
    {
      t0: 'line:24.start', t1: 'line:25.start', focus: 'mayor',
      camera: {
        move: 'push',
        from: { pos: [-3.2, 26.8, -10.5], target: [-0.4, 26.9, -22.2], fov: 26, roll: 1.5 },
        to:   { pos: [2.8, 26.9, -11.2],  target: [0.4, 26.9, -22.2],  fov: 26, roll: 1 },
      },
    },
    // S25 (Scene 7a): Aerial Pan Over Neighbouring 10M Towns Overwhelmed by 15M Wave (L25)
    {
      t0: 'line:25.start', t1: 'line:26.start',
      camera: {
        move: 'push',
        from: { pos: [1186.0, 24.0, 10.0], target: [1200.0, 6.0, -24.0], fov: 35, roll: -2.5 },
        to:   { pos: [1214.0, 22.0, 8.0],  target: [1200.0, 6.0, -20.0], fov: 35, roll: -1.5 },
      },
    },
    // S26 (Scene 7b): Dramatic Side Profile + Impact Shake — 15M wave hits 15.5M wall & stops at lip (L26)
    {
      t0: 'line:26.start', t1: 'line:27.start',
      camera: {
        move: 'path',
        keys: [
          { t: 'line:26.start',  pos: [24.0, 18.0, -14.0], target: [0.0, 18.0, -25.0], fov: 32, roll: 2,   shake: 1.0 },
          { t: 'line:26.word:3', pos: [22.5, 21.5, -16.0], target: [0.0, 22.0, -24.5], fov: 30, roll: 3.5, shake: 3.0 },
          { t: 'line:27.start',  pos: [21.0, 24.2, -17.5], target: [0.0, 24.4, -24.0], fov: 28, roll: 1.5, shake: 0.5 },
        ],
      },
    },
    // S27 (Scene 7c): Smooth Crane Reveal Over the Wall — Village completely dry & intact under sunbeams (L27)
    {
      t0: 'line:27.start', t1: 'line:28.start', focus: 'villager1',
      camera: {
        move: 'push',
        from: { pos: [0.0, 27.5, -20.0], target: [0.0, 3.0, 4.0], fov: 32, roll: -1 },
        to:   { pos: [0.8, 12.0, -6.0],  target: [0.0, 2.4, 4.0], fov: 30, roll: 0 },
      },
    },
    // S28 (Scene 7d): Slow Emotional Pull-Back at Hilltop Grave — Mockers bowing with flowers, hard loop cut (L28)
    {
      t0: 'line:28.start', t1: 68.08, focus: 'mayor_gravestone',
      camera: {
        move: 'push',
        from: { pos: [1600.2, 2.15, 13.8], target: [1600.0, 2.0, 1.8],  fov: 26, roll: 1 },
        to:   { pos: [1600.6, 3.4, 18.2],  target: [1600.0, 1.8, -6.0], fov: 28, roll: 0.5 },
      },
    },
  ],
};