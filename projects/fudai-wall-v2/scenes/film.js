// Fudai Wall — Build Pass (scenes/film.js — Repair Round 2)
// Every shot verified in 9:16 frustum: Frame 0 big expressive Mayor CU, all faces above caption band (pxY <= 1120),
// zero wall occlusion (S8 on seaside pier), zero head-twist hair clip (look reset), zero character overlap (S28 semicircle).

export default {
  fps: 30,
  size: [1080, 1920],
  captions: 'words',
  endHold: 0.53,

  world: {
    set: 'own',
    setOpts: {
      wallHeightD: 24.8,
      waveHeightD: 24.0,
      neighborWallD: 16.0,
    },
  },

  // Ready-made built-in specs/ characters only (no custom scenes/cast/*.json).
  cast: {
    mayor:     { spec: 'walter',   at: [0.0, 6.0],     ry: 16 },
    villager1: { spec: 'bouncer',  at: [40.0, 40.0],   ry: -28 },
    villager2: { spec: 'mara',     at: [40.0, 42.0],   ry: 28 },
    villager3: { spec: 'postman',  at: [42.0, 40.0],   ry: -30 },
    villager4: { spec: 'dotty',    at: [42.0, 42.0],   ry: 30 },
    worker:    { spec: 'engineer', at: [44.0, 40.0],   ry: 25 },
    child:     { spec: 'pip',      at: [800.4, 2.1],   ry: 15 },
    parent:    { spec: 'ruby',     at: [798.9, 2.5],   ry: 42 },
  },

  // All 186 words in exact order as heard in audio/clean.json (28 lines unchanged)
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

  acts: {
    mayor: {
      place: [
        { t: 'line:1.word:8', at: [1.6, 2.0],     ry: 16 },     // S2 village reveal above caption band
        { t: 'line:3.start',  at: [0.0, 4.5],     ry: 15 },     // S4 village square
        { t: 'line:4.start',  at: [-1.35, -7.2],  ry: 16 },     // S5 construction tableau left (clean face)
        { t: 'line:5.start',  at: [-1.2, -9.0],   ry: 20 },     // S6 watching 15.5M arrow
        { t: 'line:7.start',  at: [40.0, 40.0],   ry: 20 },     // Off-camera during S8-S9
        { t: 'line:10.start', at: [0.0, 6.0],     ry: 18 },     // S10 deadpan MCU
        { t: 'line:11.start', at: [40.0, 40.0],   ry: 20 },     // Clear of S11 macro blueprint insert
        { t: 'line:12.start', at: [-2.2, -2.0],   ry: 28 },     // S12 time-lapse sky cycle
        { t: 'line:13.start', at: [40.0, 40.0],   ry: 20 },     // Clear of S13 dumb_sign shot
        { t: 'line:14.start', at: [-4.6, 5.2],    ry: 70 },     // S14 retiring with box
        { t: 'line:21.start', at: [399.2, 4.2],   ry: 22 },     // S21 flashback hillside
        { t: 'line:22.start', at: [399.6, 3.0],   ry: 40 },     // S22 carved tsunami rock
        { t: 'line:24.start', at: [0.4, -22.2],   ry: 22 },     // S24 Fudai wall top rim
      ],
      height: [
        { t: 0,               y: 0 },
        { t: 'line:24.start', y: 24.8 },
        { t: 'line:25.start', y: 0 },
      ],
      face: [
        // Frame 0: intense, expressive determined face (NOT flat stare)
        { t: 0,                eyes: 'wide',  brow: 'knit',    mouth: 'tight', react: false },
        { t: 'line:1.word:5',  eyes: 'open',  brow: 'up',      mouth: 'flat',  react: false },
        { t: 'line:3.word:2',  eyes: 'open',  brow: 'on',      mouth: 'smile', react: false },
        { t: 'line:4.word:3',  eyes: 'open',  brow: 'down',    mouth: 'flat',  react: false },
        { t: 'line:5.word:2',  eyes: 'open',  brow: 'down',    mouth: 'flat',  react: false },
        { t: 'line:10.word:2', eyes: 'open',  brow: 'on',      mouth: 'tight', react: false },
        { t: 'line:12.word:3', eyes: 'half',  brow: 'on',      mouth: 'rest',  react: false },
        { t: 'line:14.word:2', eyes: 'sad',   brow: 'worried', mouth: 'frown', react: false },
        { t: 'line:21.word:5', eyes: 'wide',  brow: 'worried', mouth: 'o',     react: 'recoil' },
        { t: 'line:22.word:2', eyes: 'open',  brow: 'down',    mouth: 'flat',  react: false },
        { t: 'line:24.word:3', eyes: 'open',  brow: 'down',    mouth: 'smile', react: false },
      ],
      // Keep look targets strictly toward the camera side (+Z) so head never twists past 95 deg (fixes grey hair clip!)
      look: [
        { t: 0,                at: [0.3, 2.3, 14.0] },
        { t: 'line:3.start',   at: [0.0, 2.3, 18.0] },
        { t: 'line:4.start',   at: [0.0, 2.3, 8.0] },
        { t: 'line:10.start',  at: [0.0, 2.3, 16.0] },
        { t: 'line:21.start',  at: [400.0, 2.2, 14.0] },
        { t: 'line:22.word:2', at: [400.9, 2.1, 4.5] },
      ],
      clips: [
        { clip: 'point',  at: 'line:1.word:5+0.04',  side: 'R', dir: [0.25, 0.85, 0.25], hold: 1.1, out: 6 },
        { clip: 'wave',   at: 'line:3.word:2+0.04',  side: 'R', hold: 0.9, out: 6 },
        { clip: 'point',  at: 'line:5.word:2+0.04',  side: 'L', dir: [-0.2, 0.9, 0.2],   hold: 1.0, out: 6 },
        { clip: 'carry',  at: 'line:14.word:2+0.04', prop: 'retire_box', hold: 2.0, out: 6 },
        { clip: 'point',  at: 'line:22.word:2+0.04', side: 'R', dir: [0.65, 0.25, 0.2],  hold: 1.8, out: 6 },
        { clip: 'akimbo', at: 'line:24.word:3+0.04', side: 'both', hold: 1.4, out: 6 },
      ],
      walk: [
        { t0: 'line:14.word:2+0.04', path: [[-4.6, 5.2], [2.0, 5.2]], speed: 2.1, face: 75 },
      ],
    },

    villager1: {
      place: [
        { t: 'line:3.start',  at: [1.8, 3.2],     ry: -28 },
        { t: 'line:4.start',  at: [40.0, 40.0],   ry: -28 },
        { t: 'line:7.start',  at: [-0.55, -37.2], ry: 18 },     // S8 seaside pier (clear of seawall at z=-24!)
        { t: 'line:9.start',  at: [-0.55, -37.2], ry: 14 },     // S9 tighter CU
        { t: 'line:10.start', at: [40.0, 40.0],   ry: -20 },
        { t: 'line:14.start', at: [-2.4, 3.0],    ry: 32 },
        { t: 'line:15.start', at: [40.0, 40.0],   ry: 15 },
        { t: 'line:17.start', at: [-1.1, 4.2],    ry: 15 },
        { t: 'line:19.start', at: [-1.0, 2.2],    ry: 20 },
        { t: 'line:26.start', at: [40.0, 40.0],   ry: 20 },
        { t: 'line:27.start', at: [-1.4, 4.2],    ry: 20 },
        { t: 'line:28.start', at: [1597.8, 2.8],  ry: 36 },     // S28 grave far-left (non-overlapping semicircle)
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
        { t0: 'line:19.word:2+0.04', path: [[-1.0, 2.2], [-2.0, 11.0]], speed: 4.2, gait: 'run', face: 15 },
      ],
    },

    villager2: {
      place: [
        { t: 'line:3.start',  at: [-1.8, 3.0],    ry: 28 },
        { t: 'line:4.start',  at: [40.0, 42.0],   ry: 28 },
        { t: 'line:7.start',  at: [1.15, -37.9],  ry: -20 },    // S8 laughing right beside villager1 on pier
        { t: 'line:9.start',  at: [1.15, -37.9],  ry: -22 },    // S9 laughing beside villager1
        { t: 'line:10.start', at: [40.0, 42.0],   ry: 28 },
        { t: 'line:13.start', at: [-1.2, 2.0],    ry: 26 },
        { t: 'line:14.start', at: [40.0, 42.0],   ry: 28 },
        { t: 'line:17.start', at: [1.2, 4.0],     ry: -18 },
        { t: 'line:19.start', at: [1.2, 1.8],     ry: -20 },
        { t: 'line:26.start', at: [40.0, 42.0],   ry: -20 },
        { t: 'line:27.start', at: [1.4, 4.0],     ry: -20 },
        { t: 'line:28.start', at: [1602.2, 2.8],  ry: -36 },    // S28 grave far-right (non-overlapping semicircle)
      ],
      face: [
        { t: 0,                     eyes: 'open', brow: 'on',      mouth: 'rest', react: false },
        { t: 'line:7.word:3+0.07',  eyes: 'arc',  brow: 'up',      mouth: 'D',    hold: true, react: false },
        { t: 'line:9.word:2+0.07',  eyes: 'arc',  brow: 'up',      mouth: 'D',    hold: true, react: false },
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
        { t0: 'line:19.word:2+0.07', path: [[1.2, 1.8], [2.1, 10.5]], speed: 4.0, gait: 'run', face: -18 },
      ],
    },

    villager3: {
      place: [
        { t: 'line:6.start',  at: [1202.0, -14.0], ry: 18 },
        { t: 'line:7.start',  at: [42.0, 40.0],    ry: -28 },
        { t: 'line:13.start', at: [1.3, 1.9],      ry: -26 },
        { t: 'line:14.start', at: [-0.6, 2.8],     ry: 22 },
        { t: 'line:15.start', at: [42.0, 40.0],    ry: 20 },
        { t: 'line:25.start', at: [1198.5, -10.0], ry: 20 },
        { t: 'line:27.start', at: [2.8, 2.8],      ry: -25 },
        { t: 'line:28.start', at: [1599.0, 4.1],   ry: 20 },    // S28 grave mid-left (clean separation)
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
        { t: 'line:1.word:8', at: [-3.4, 2.0],    ry: 24 },     // S2 village reveal above caption band
        { t: 'line:2.start',  at: [42.0, 42.0],   ry: 25 },
        { t: 'line:3.start',  at: [-2.6, 1.5],    ry: 32 },
        { t: 'line:4.start',  at: [42.0, 42.0],   ry: 25 },
        { t: 'line:17.start', at: [0.0, 2.5],     ry: 12 },
        { t: 'line:18.start', at: [42.0, 42.0],   ry: 25 },
        { t: 'line:27.start', at: [-2.8, 2.6],    ry: 28 },
        { t: 'line:28.start', at: [1601.0, 4.1],  ry: -20 },    // S28 grave mid-right (clean separation)
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
        { t: 'line:4.start',  at: [1.35, -7.4],   ry: -18 },
        { t: 'line:5.start',  at: [1.3, -9.2],    ry: -22 },
        { t: 'line:6.start',  at: [44.0, 40.0],   ry: 25 },
        { t: 'line:24.start', at: [-1.8, -22.2],  ry: 28 },
      ],
      height: [
        { t: 0,               y: 0 },
        { t: 'line:24.start', y: 24.8 },
        { t: 'line:25.start', y: 0 },
      ],
      face: [
        { t: 0,                     eyes: 'open', brow: 'on', mouth: 'rest',  react: false },
        { t: 'line:4.word:7',       eyes: 'open', brow: 'up', mouth: 'smile', react: false },
        { t: 'line:24.word:3+0.07', eyes: 'open', brow: 'up', mouth: 'smile', react: false },
      ],
      clips: [
        { clip: 'point', at: 'line:4.word:7+0.04',  side: 'R', dir: [0.3, 0.8, 0.2], hold: 1.4, out: 6 },
        { clip: 'point', at: 'line:24.word:3+0.07', side: 'R', dir: [0.4, 0.1, 0.2], hold: 1.4, out: 6 },
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

  // Only persistent in:'world' / in:'hand' props here; shot-gated story graphics live in scenes/set.js update(t)
  props: [
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
      id: 'mayor_gravestone', kind: 'gravestone',
      in: 'world', at: [1600.0, 0, 1.2],
    },
  ],

  handovers: [],

  shots: [
    // S1 (0.00-2.73): Frame 0 = BIG EXPRESSIVE FACE on Mayor (d=5.4 D, fov=26), tilts up to full 5-storey wall & 1-5 overlay
    {
      t0: 0, t1: 'line:1.word:8', focus: 'mayor',
      camera: {
        move: 'path',
        keys: [
          { t: 0,               pos: [0.35, 2.22, 11.4], target: [0.0, 2.28, 6.0],   fov: 26, roll: 2 },
          { t: 'line:1.word:3', pos: [1.0, 2.8, 17.5],   target: [0.8, 7.5, -14.0],  fov: 32, roll: 1.5 },
          { t: 'line:1.word:8', pos: [1.8, 5.2, 24.0],   target: [1.2, 13.5, -21.0], fov: 38, roll: 1 },
        ],
      },
    },
    // S2 (2.73-4.56): Wide Crane Pull-Back — full 1-5 floors + Mayor & villager4 strictly ABOVE caption band (pxY < 1100)
    {
      t0: 'line:1.word:8', t1: 'line:2.start',
      camera: {
        move: 'push',
        from: { pos: [0.4, 7.5, 45.0],   target: [0.0, 4.0, -18.0], fov: 38, roll: -1.5 },
        to:   { pos: [-1.6, 10.0, 50.0], target: [0.0, 5.5, -20.0], fov: 38, roll: -0.5 },
      },
    },
    // S3 (4.56-7.06): Smooth Glide Across Wide Calm Mirror Sea — glassy water + reflections + peaceful distant boat
    {
      t0: 'line:2.start', t1: 'line:3.start',
      camera: {
        move: 'push',
        from: { pos: [-14.0, 4.2, -38.0], target: [7.0, 0.8, -66.0],  fov: 32, roll: 1 },
        to:   { pos: [-6.0, 4.0, -40.0],  target: [10.0, 0.8, -70.0], fov: 32, roll: -0.5 },
      },
    },
    // S4 (7.06-9.04): Medium-Wide Village Square Pan (Mayor centre, 3,000 sign above, faces above caption band)
    {
      t0: 'line:3.start', t1: 'line:4.start', focus: 'mayor',
      camera: {
        move: 'push',
        from: { pos: [-1.5, 2.4, 21.5], target: [0.0, 2.1, 3.8], fov: 28, roll: 1.5 },
        to:   { pos: [1.5, 2.5, 20.2],  target: [0.0, 2.2, 3.8], fov: 28, roll: 0.5 },
      },
    },
    // S5 (9.04-12.21): Construction Time-Lapse Glide — cranes, $30M stacks/sign, 12-yr calendar, rising gate, 15.5M arrow, clean faces above captions
    {
      t0: 'line:4.start', t1: 'line:5.start', focus: 'mayor',
      camera: {
        move: 'push',
        from: { pos: [-0.7, 2.6, 8.8], target: [0.0, 2.8, -10.5], fov: 32, roll: -1.5 },
        to:   { pos: [0.7, 2.9, 7.8],  target: [0.0, 3.1, -11.0], fov: 32, roll: -0.5 },
      },
    },
    // S6 (12.21-14.40): Low-angle Tilt-Up along luminous 15.5M measure arrow & rising steel gate
    {
      t0: 'line:5.start', t1: 'line:6.start',
      camera: {
        move: 'push',
        from: { pos: [0.5, 2.4, 8.0],  target: [1.8, 7.5, -18.5],  fov: 32, roll: 2 },
        to:   { pos: [1.2, 4.5, 11.0], target: [2.0, 16.5, -18.5], fov: 34, roll: 1 },
      },
    },
    // S7 (14.40-17.28): Neighbouring 10M Coastal Towns — readable "10M" labels + villager3 strictly ABOVE caption band
    {
      t0: 'line:6.start', t1: 'line:7.start',
      camera: {
        move: 'push',
        from: { pos: [1193.0, 8.8, 25.0], target: [1202.0, 2.5, -20.0], fov: 34, roll: -1.5 },
        to:   { pos: [1204.0, 8.4, 23.0], target: [1202.2, 2.5, -20.0], fov: 34, roll: -0.5 },
      },
    },
    // S8 (17.28-20.34): Mockery CU on Seaside Pier (camera z=-27.5 -> villagers z=-37.2, zero wall occlusion, blue sea & falling gold coins behind)
    {
      t0: 'line:7.start', t1: 'line:9.start', focus: 'villager1',
      camera: {
        move: 'push',
        from: { pos: [0.3, 2.1, -26.8], target: [0.25, 2.25, -37.5], fov: 28, roll: 5 },
        to:   { pos: [0.1, 2.1, -27.8], target: [0.25, 2.25, -37.5], fov: 28, roll: 4 },
      },
    },
    // S9 (20.34-22.02): Tighter angled CU on villager1 pointing high + villager2 laughing on pier
    {
      t0: 'line:9.start', t1: 'line:10.start', focus: 'villager1',
      camera: {
        move: 'push',
        from: { pos: [-0.8, 2.1, -27.2], target: [0.2, 2.25, -37.5], fov: 28, roll: -4 },
        to:   { pos: [-0.4, 2.2, -28.2], target: [0.2, 2.35, -37.5], fov: 28, roll: -3 },
      },
    },
    // S10 (22.02-23.18): Deadpan MCU Slow Push-In on silent Mayor Wamura
    {
      t0: 'line:10.start', t1: 'line:11.start', focus: 'mayor',
      camera: {
        move: 'push',
        from: { pos: [-0.4, 2.1, 14.5], target: [0.0, 2.25, 6.0], fov: 26, roll: 1 },
        to:   { pos: [-0.2, 2.1, 13.2], target: [0.0, 2.25, 6.0], fov: 26, roll: 1.5 },
      },
    },
    // S11 (23.18-25.09): Tight Blueprint Insert — set-mounted plan + unobstructed "15.5M LOCKED" + locking brass ruler
    {
      t0: 'line:11.start', t1: 'line:12.start',
      camera: {
        move: 'push',
        from: { pos: [0.0, 4.9, 7.3], target: [0.0, 1.4, 5.2], fov: 28, roll: -1.5 },
        to:   { pos: [0.0, 4.5, 7.0], target: [0.0, 1.4, 5.2], fov: 27, roll: -0.5 },
      },
    },
    // S12 (25.09-28.13): Time-Lapse Sky Cycle over finished wall & dead-calm sea
    {
      t0: 'line:12.start', t1: 'line:13.start', focus: 'mayor',
      camera: {
        move: 'push',
        from: { pos: [-3.8, 2.3, 10.5], target: [-1.0, 4.5, -14.0], fov: 30, roll: 1 },
        to:   { pos: [-3.0, 2.6, 9.2],  target: [-0.5, 5.2, -16.0], fov: 30, roll: 2 },
      },
    },
    // S13 (28.13-30.27): Quick Comic Push-In on hanging mocking sign ("أغبى مشروع") & laughing villagers
    {
      t0: 'line:13.start', t1: 'line:14.start', focus: 'villager2',
      camera: {
        move: 'push',
        from: { pos: [0.2, 2.3, 15.5], target: [0.0, 2.9, 1.6], fov: 28, roll: -3.5 },
        to:   { pos: [0.0, 2.4, 13.5], target: [0.0, 3.1, 1.5], fov: 27, roll: -2.5 },
      },
    },
    // S14 (30.27-33.04): Slow Lateral Tracking Shot — retiring Mayor leaving city hall carrying box
    {
      t0: 'line:14.start', t1: 'line:15.start', focus: 'mayor',
      camera: {
        move: 'push',
        from: { pos: [-4.2, 2.2, 16.5], target: [-3.8, 2.2, 5.2], fov: 26, roll: 1.5 },
        to:   { pos: [1.6, 2.2, 16.2],  target: [1.4, 2.2, 5.2],  fov: 26, roll: 1 },
      },
    },
    // S15 (33.04-35.70): Gentle Crane Up on hilltop gravestone (X = 1600) overlooking distant wall
    {
      t0: 'line:15.start', t1: 'line:16.start', focus: 'mayor_gravestone',
      camera: {
        move: 'push',
        from: { pos: [1601.2, 2.0, 10.8], target: [1600.0, 1.6, 1.2],   fov: 28, roll: -1 },
        to:   { pos: [1601.8, 4.2, 12.6], target: [1600.0, 0.8, -12.0], fov: 30, roll: -0.5 },
      },
    },
    // S16 (35.70-37.39): Fast Calendar Flip (14 years) as sky shifts to stormy slate
    {
      t0: 'line:16.start', t1: 'line:17.start',
      camera: {
        move: 'push',
        from: { pos: [0.6, 2.9, 9.2],  target: [0.0, 3.2, 2.0], fov: 26, roll: 2.5 },
        to:   { pos: [-0.3, 3.0, 8.0], target: [0.0, 3.2, 2.0], fov: 26, roll: 3.5 },
      },
    },
    // S17 (37.39-39.28): Heavy Camera Shake in village street during violent earthquake
    {
      t0: 'line:17.start', t1: 'line:18.start', focus: 'villager1',
      camera: {
        move: 'path',
        keys: [
          { t: 'line:17.start', pos: [0.4, 2.0, 16.5],  target: [0.0, 2.2, 3.6], fov: 28, roll: -4, shake: 3 },
          { t: 'line:18.start', pos: [-0.6, 2.1, 15.2], target: [0.0, 2.2, 3.6], fov: 29, roll: 4,  shake: 3 },
        ],
      },
    },
    // S18 (39.28-41.06): High-Angle Coastline Glide over retreating ocean & stranded boats
    {
      t0: 'line:18.start', t1: 'line:19.start',
      camera: {
        move: 'push',
        from: { pos: [-8.0, 14.0, -20.0], target: [0.0, 0.0, -44.0], fov: 34, roll: 2 },
        to:   { pos: [4.0, 13.0, -22.0],  target: [2.0, 0.0, -52.0], fov: 34, roll: 1 },
      },
    },
    // S19 (41.06-42.86): Extreme Low-Angle Tilt-Up on fleeing villagers + rising wall of water
    {
      t0: 'line:19.start', t1: 'line:20.start', focus: 'villager1',
      camera: {
        move: 'path',
        keys: [
          { t: 'line:19.start', pos: [0.2, 1.9, 17.0], target: [0.0, 2.3, 3.0],    fov: 28, roll: -3, shake: 1.5 },
          { t: 'line:20.start', pos: [0.6, 2.2, 18.5], target: [0.0, 11.5, -45.0], fov: 34, roll: -4, shake: 2 },
        ],
      },
    },
    // S20 (42.86-45.45): Hero Low-Angle Tilt-Up tracking luminous 15M wave gauge
    {
      t0: 'line:20.start', t1: 'line:21.start',
      camera: {
        move: 'push',
        from: { pos: [-2.0, 2.8, -18.0], target: [2.5, 8.0, -50.0],  fov: 32, roll: 3 },
        to:   { pos: [-1.0, 4.4, -16.0], target: [3.0, 17.5, -50.0], fov: 35, roll: 2 },
      },
    },
    // S21 (45.45-48.36): Vintage Sepia Flashback Glide — young Mayor watching sea swallow old village
    {
      t0: 'line:21.start', t1: 'line:22.start', focus: 'mayor',
      camera: {
        move: 'push',
        from: { pos: [397.4, 2.1, 14.8], target: [399.4, 2.2, 3.5],  fov: 26, roll: -1.5 },
        to:   { pos: [401.0, 2.5, 13.8], target: [399.4, 1.4, -8.0], fov: 28, roll: -0.5 },
      },
    },
    // S22 (48.36-52.11): Close-Up Tracking Along Ancient Carved Tsunami Rock + Mayor's hand
    {
      t0: 'line:22.start', t1: 'line:23.start', focus: 'mayor',
      camera: {
        move: 'push',
        from: { pos: [399.0, 2.05, 13.8], target: [400.2, 2.15, 2.6], fov: 26, roll: 2 },
        to:   { pos: [401.4, 2.10, 12.2], target: [400.6, 2.10, 2.3], fov: 26, roll: 1 },
      },
    },
    // S23 (52.11-54.88): Clean Cutaway Medium Shot — Parent marking pencil height line above child
    {
      t0: 'line:23.start', t1: 'line:24.start', focus: 'parent',
      camera: {
        move: 'push',
        from: { pos: [799.8, 2.05, 13.2], target: [799.6, 2.1, 2.2],  fov: 26, roll: -1.5 },
        to:   { pos: [799.5, 2.05, 11.8], target: [799.8, 2.05, 2.1], fov: 26, roll: -1 },
      },
    },
    // S24 (54.88-58.00): Match-Cut Glide along top concrete rim of 15.5M seawall
    {
      t0: 'line:24.start', t1: 'line:25.start', focus: 'mayor',
      camera: {
        move: 'push',
        from: { pos: [-2.8, 26.8, -8.5], target: [-0.4, 26.9, -22.2], fov: 26, roll: 1.5 },
        to:   { pos: [2.4, 26.9, -9.2],  target: [0.4, 26.9, -22.2],  fov: 26, roll: 1 },
      },
    },
    // S25 (58.00-61.56): Aerial Pan Over Neighbouring 10M Towns Overwhelmed by 15M Wave
    {
      t0: 'line:25.start', t1: 'line:26.start',
      camera: {
        move: 'push',
        from: { pos: [1186.0, 24.0, 14.0], target: [1202.0, 7.0, -22.0], fov: 35, roll: -2.5 },
        to:   { pos: [1214.0, 22.0, 12.0], target: [1202.0, 7.0, -18.0], fov: 35, roll: -1.5 },
      },
    },
    // S26 (61.56-64.49): Dramatic Side Profile + Impact Shake — 15M wave hits 15.5M wall & stops at lip
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
    // S27 (64.49-65.75): Smooth Crane Reveal Over the Wall — Village completely dry & intact under sunbeams
    {
      t0: 'line:27.start', t1: 'line:28.start', focus: 'villager1',
      camera: {
        move: 'push',
        from: { pos: [0.0, 27.5, -20.0], target: [0.0, 3.0, 4.0], fov: 32, roll: -1 },
        to:   { pos: [0.8, 12.0, -6.0],  target: [0.0, 2.4, 4.0], fov: 30, roll: 0 },
      },
    },
    // S28 (65.75-68.08): Hilltop Grave Finale — non-overlapping semicircle + flowers + raised distant seawall
    {
      t0: 'line:28.start', t1: 68.08, focus: 'mayor_gravestone',
      camera: {
        move: 'push',
        from: { pos: [1600.0, 2.4, 23.5], target: [1600.0, 2.1, 0.5],  fov: 29, roll: 1 },
        to:   { pos: [1600.0, 3.4, 26.5], target: [1600.0, 2.0, -4.0], fov: 31, roll: 0.5 },
      },
    },
  ],
};