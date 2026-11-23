// scenes/film.js — THE FILM: Fudai Wall (Build pass).
// Law: every word of audio/clean.json is in a line, as heard; every time key ties to words
// ('line:N...'), never raw seconds (t: 0 is the film's first frame); a clip's at/t0 is only a
// 'line:' string. Pure in t. Cast is cast from the tree's ready-made specs (owner's instruction):
// no character is designed here. Captions: 'words'. Sound design is the app's automatic system.
export default {
  fps: 30,
  size: [1080, 1920],
  world: { set: 'own', setOpts: {} },
  drift: false,
  endHold: 0.2,

  cast: {
    mayor:    { spec: 'boss',    at: [0.6, 0],        ry: 24 },
    v1:       { spec: 'bouncer', at: [-3.5, -4],      ry: 42 },
    v2:       { spec: 'postman', at: [2.8, -3.2],     ry: 50 },
    v3:       { spec: 'chef',    at: [-1.8, 3.4],     ry: 35 },
    v4:       { spec: 'ruby',    at: [3.2, 2.6],      ry: 55 },
    v5:       { spec: 'dotty',   at: [-4.6, 1.2],     ry: 48 },
    v6:       { spec: 'mara',    at: [1.4, -5.2],     ry: 45 },
    walter:   { spec: 'walter',  at: [1600.2, -3.4],  ry: 125 },
    pip:      { spec: 'pip',     at: [1600.8, -4.6],  ry: 10 },
    engineer: { spec: 'engineer',at: [410, -14],      ry: 60 },
  },

  voice: {
    file: 'audio/clean.wav',
    words: 'audio/clean.json',
    lines: [
      { who: null, text: 'بنى سور خرساني بطول عمارة خمس أدوار قدام قرية صيد صغيرة' },
      { who: null, text: 'والبحر قدامه هادي زي المراية' },
      { who: null, text: 'كان عمدة لقرية فيها 3000 شخص بس' },
      { who: null, text: 'وصرف 30 مليون دولار و12 سنة بناء على بوابة' },
      { who: null, text: 'ارتفاعها 15 متر ونص' },
      { who: null, text: 'مع إن كل القرى اللي حواليه' },
      { who: null, text: 'اكتفت بسور 10 متر' },
      { who: null, text: 'أهل القرية ضحكوا عليه وقالوا له:' },
      { who: 'v1', text: 'إنت بترمي فلوسنا في البحر؟', loud: true },
      { who: 'v1', text: 'الموج عمره ما هيوصل هناك' },
      { who: null, text: 'بس العمدة ما ردش' },
      { who: null, text: 'ولا نزل السور سنتي واحد' },
      { who: null, text: 'السور خلص والبحر فضل هادي سنين' },
      { who: null, text: 'والناس سموه أغبى مشروع في البلد' },
      { who: null, text: 'العمدة طلع على المعاش وهو لسه بيتلام على الفلوس اللي ضاعت' },
      { who: null, text: 'ومات' },
      { who: null, text: 'من غير ما حد واحد يصدقه' },
      { who: null, text: 'بعد موته بـ 14 سنة' },
      { who: null, text: 'الأرض اتهزت بزلزال عنيف' },
      { who: null, text: 'والبحر اتسحب لورا' },
      { who: null, text: 'ورجع' },
      { who: null, text: 'بموجة عملاقة' },
      { who: null, text: 'ارتفاعها 15 متر بالظبط' },
      { who: null, text: 'أصل العمدة وهو شاب' },
      { who: null, text: 'شاف البحر بيبلع قريته' },
      { who: null, text: 'فافتكر علامات قديمة على الصخر' },
      { who: null, text: 'بتحدد أعلى نقطة وصلها الموج زمان' },
      { who: null, text: 'زي ما تحط شرطة بالقلم على الحيطة' },
      { who: null, text: 'عشان ما تنساش المقاس' },
      { who: null, text: 'هو بنى السور على مقاس أضخم موجة في الذاكرة' },
      { who: null, text: 'القرى اللي حواليهم بأسوارها الـ 10 متر' },
      { who: null, text: 'اتمسحت في دقايق' },
      { who: null, text: 'والموجة خبطت في سوره' },
      { who: null, text: 'ووقفت عند حافته' },
      { who: null, text: 'القرية كلها نجت' },
      { who: null, text: 'والناس اللي ضحكوا عليه' },
      { who: null, text: 'راحوا قبره يشكروه' },
    ],
  },

  acts: {
    mayor: {
      face: [
        { t: 0, eyes: 'wide', brow: 'up', mouth: 'flat' },
        { t: 'line:3.start-0.1', eyes: 'stare', brow: 'on', mouth: 'rest' },
        { t: 'line:4.start-0.1', expr: 'hope' },
        { t: 'line:5.start-0.1', eyes: 'wide', brow: 'up', mouth: 'flat' },
        { t: 'line:11.start-0.1', eyes: 'stare', brow: 'off', mouth: 'flat' },
        { t: 'line:12.start-0.1', eyes: 'stare', brow: 'down', mouth: 'tight' },
        { t: 'line:13.start-0.1', eyes: 'open', brow: 'on', mouth: 'rest' },
        { t: 'line:15.start-0.1', eyes: 'sad', brow: 'worried', mouth: 'frown' },
        { t: 'line:24.start-0.1', expr: 'dread' },
        { t: 'line:25.start-0.1', expr: 'horror' },
        { t: 'line:26.start-0.1', expr: 'confused' },
        { t: 'line:27.start-0.1', expr: 'dawning' },
        { t: 'line:27.word:6-0.1', eyes: 'stare', brow: 'down', mouth: 'flat' },
      ],
      clips: [
        { clip: 'head_turn', t0: 'line:1.word:4+0.03', yaw: -14 },
        { clip: 'akimbo', t0: 'line:3.word:2+0.03', side: 'both' },
        { clip: 'point', t0: 'line:4.word:2+0.03', side: 'R', dir: [0.35, 0.1, -0.5], hold: 0.5, out: 6 },
        { clip: 'head_turn', t0: 'line:5.word:1+0.03', yaw: -10 },
        { clip: 'head_turn', t0: 'line:11.word:4+0.03', yaw: -5 },
        { clip: 'point', t0: 'line:12.word:4+0.03', side: 'L', dir: [-0.3, 0.15, -0.5], hold: 0.5, out: 6 },
        { clip: 'carry', t0: 'line:15.start+0.03', side: 'R' },
        { clip: 'turn', t0: 'line:24.word:3+0.03', by: -8 },
        { clip: 'lean_back', t0: 'line:25.word:3+0.03', hold: 0.2, out: 5 },
        { clip: 'point', t0: 'line:26.word:5+0.03', side: 'R', dir: [0.3, 0.1, -0.7], hold: 0.7, out: 8 },
        { clip: 'head_turn', t0: 'line:27.word:6-0.1', yaw: 6 },
      ],
      look: [
        { t: 'line:11.start', at: [-3.2, 2.3, -2.6] },
        { t: 'line:12.start', at: [7, 3.1, -16] },
        { t: 'line:24.start', at: [1199, 2.6, -14] },
        { t: 'line:26.start', at: [1198.8, 2.2, -0.2] },
        { t: 'line:27.word:6', at: [1199, 2.6, -20] },
      ],
      walk: [
        { t0: 'line:15.start+0.2', path: [[-7, 20], [-7, 15.5]], speed: 1.25, face: 40 },
      ],
      place: [
        { t: 'line:4.start', at: [407, -10], ry: 55 },
        { t: 'line:10.end', at: [0.6, 0], ry: 24 },
        { t: 'line:12.start', at: [9.4, -16.2], ry: -38 },
        { t: 'line:13.start', at: [-1.5, -10], ry: 15 },
        { t: 'line:15.start', at: [-7, 20], ry: 200 },
        { t: 'line:24.start', at: [1199.2, 1.4], ry: 145 },
      ],
    },

    v1: {
      face: [
        { t: 'line:8.start-0.1', eyes: 'arc', brow: 'up', mouth: 'crescent', hold: true },
        { t: 'line:9.start-0.1', eyes: 'wide', brow: 'down', mouth: 'grid' },
        { t: 'line:10.start-0.1', eyes: 'smug', brow: 'up', mouth: 'smirk' },
        { t: 'line:36.start-0.1', eyes: 'sad', brow: 'worried', mouth: 'frown' },
        { t: 'line:37.start-0.1', expr: 'hope' },
      ],
      clips: [
        { clip: 'lean_back', t0: 'line:8.word:3+0.03', hold: 0.3, out: 6 },
        { clip: 'point', t0: 'line:9.word:1+0.03', side: 'R', dir: [0.2, 0.75, -0.3], hold: 0.45, out: 6 },
        { clip: 'point', t0: 'line:9.word:5+0.03', side: 'R', dir: [0.05, -0.1, -0.9], hold: 0.4, out: 6 },
        { clip: 'wave', t0: 'line:10.word:4+0.03', side: 'R' },
        { clip: 'put_down', t0: 'line:37.word:1+0.03', prop: 'flowers_v1', side: 'R' },
        { clip: 'lean_over', t0: 'line:37.word:3+0.03', hold: 0.4, out: 8 },
      ],
      look: [
        { t: 'line:9.start', at: [0, 10, -28] },
        { t: 'line:9.word:5', at: [-4, 1.4, -40] },
      ],
      walk: [
        { t0: 'line:36.start+0.15', path: [[2001.8, 1.2], [2000.6, -1.0]], speed: 2.6, face: 185 },
      ],
      place: [
        { t: 'line:36.start', at: [2001.8, 1.2], ry: 185 },
      ],
    },

    v2: {
      face: [
        { t: 'line:8.start-0.1', eyes: 'arc', brow: 'up', mouth: 'crescent' },
        { t: 'line:12.start-0.1', eyes: 'smug', brow: 'up', mouth: 'smirk' },
        { t: 'line:19.start-0.1', expr: 'terror' },
        { t: 'line:23.start-0.1', expr: 'terror' },
      ],
      clips: [
        { clip: 'point', t0: 'line:12.word:2+0.03', side: 'R', dir: [-0.2, 0.2, -0.6], hold: 0.4, out: 5 },
        { clip: 'wince', t0: 'line:12.word:4+0.1' },
      ],
      walk: [
        { t0: 'line:19.word:3+0.03', path: [[-1, -6], [3, 3], [4, 8]], speed: 3.6, gait: 'run', face: 10 },
        { t0: 'line:23.word:3+0.03', path: [[-8, -34], [-2, -36], [5, -37]], speed: 3.8, gait: 'run', face: 85 },
      ],
      place: [
        { t: 'line:12.start', at: [6.2, -19.0], ry: -30 },
        { t: 'line:19.start', at: [-1, -6], ry: 30 },
        { t: 'line:23.start', at: [-8, -34], ry: 80 },
      ],
    },

    v3: {
      face: [
        { t: 'line:8.start-0.1', eyes: 'arc', brow: 'up', mouth: 'crescent' },
        { t: 'line:19.start-0.1', expr: 'terror' },
        { t: 'line:23.start-0.1', expr: 'terror' },
        { t: 'line:36.start-0.1', eyes: 'sad', brow: 'worried', mouth: 'frown' },
        { t: 'line:37.start-0.1', expr: 'hope' },
      ],
      clips: [
        { clip: 'lean_over', t0: 'line:37.word:3+0.03', hold: 0.4, out: 8 },
      ],
      walk: [
        { t0: 'line:19.word:3+0.03', path: [[-2.5, -2], [-4, 6], [-5, 12]], speed: 3.6, gait: 'run', face: 190 },
        { t0: 'line:23.word:3+0.03', path: [[-6.5, -35], [0, -36.5], [6, -37.5]], speed: 3.8, gait: 'run', face: 85 },
        { t0: 'line:36.start+0.2', path: [[1999.2, 0.4], [1999.4, -1.2]], speed: 2.4, face: 175 },
      ],
      place: [
        { t: 'line:19.start', at: [-2.5, -2], ry: 45 },
        { t: 'line:23.start', at: [-6.5, -35], ry: 80 },
        { t: 'line:36.start', at: [1999.2, 0.4], ry: 175 },
      ],
    },

    v4: {
      face: [
        { t: 'line:8.start-0.1', eyes: 'arc', brow: 'up', mouth: 'crescent' },
        { t: 'line:19.start-0.1', expr: 'terror' },
        { t: 'line:23.start-0.1', expr: 'terror' },
        { t: 'line:36.start-0.1', eyes: 'sad', brow: 'worried', mouth: 'frown' },
        { t: 'line:37.start-0.1', expr: 'hope' },
      ],
      clips: [
        { clip: 'lean_over', t0: 'line:37.word:3+0.1', hold: 0.4, out: 8 },
      ],
      walk: [
        { t0: 'line:19.word:3+0.03', path: [[1.5, -1.5], [3, 5], [4, 10]], speed: 3.6, gait: 'run', face: 10 },
        { t0: 'line:23.word:3+0.03', path: [[-4, -34.6], [2, -36], [8, -36.8]], speed: 3.8, gait: 'run', face: 85 },
        { t0: 'line:36.start+0.25', path: [[2000.9, 0.6], [2000.9, -0.9]], speed: 2.2, face: 185 },
      ],
      place: [
        { t: 'line:19.start', at: [1.5, -1.5], ry: 50 },
        { t: 'line:23.start', at: [-4, -34.6], ry: 80 },
        { t: 'line:36.start', at: [2000.9, 0.6], ry: 185 },
      ],
    },

    v5: {
      face: [
        { t: 'line:8.start-0.1', eyes: 'arc', brow: 'up', mouth: 'crescent' },
        { t: 'line:14.start-0.1', eyes: 'arc', brow: 'up', mouth: 'crescent', hold: true },
        { t: 'line:35.start-0.1', expr: 'relief' },
        { t: 'line:36.start-0.1', eyes: 'sad', brow: 'worried', mouth: 'frown' },
        { t: 'line:37.start-0.1', expr: 'hope' },
      ],
      clips: [
        { clip: 'wave', t0: 'line:35.word:3+0.1', side: 'R' },
        { clip: 'lean_over', t0: 'line:37.word:3+0.06', hold: 0.4, out: 8 },
      ],
      walk: [
        { t0: 'line:13.word:6.end+0.15', path: [[-6, -8], [-0.5, -8.3]], speed: 2.6, face: 90 },
        { t0: 'line:36.start+0.3', path: [[2002.4, 1.6], [2001.4, -0.8]], speed: 2.4, face: 180 },
      ],
      place: [
        { t: 'line:13.word:6.end', at: [-6, -8], ry: 88 },
        { t: 'line:34.end+0.5', at: [-9.2, -12.2], ry: 60 },
        { t: 'line:36.start', at: [2002.4, 1.6], ry: 180 },
      ],
    },

    v6: {
      face: [
        { t: 'line:8.start-0.1', eyes: 'arc', brow: 'up', mouth: 'crescent' },
        { t: 'line:14.start-0.1', eyes: 'arc', brow: 'up', mouth: 'crescent', hold: true },
        { t: 'line:30.start-0.1', eyes: 'stare', brow: 'down', mouth: 'flat' },
      ],
      clips: [
        { clip: 'point', t0: 'line:14.word:4+0.07', side: 'R', dir: [0.1, 0.65, -0.4], hold: 0.4, out: 6 },
        { clip: 'akimbo', t0: 'line:30.word:6+0.03', side: 'both' },
      ],
      walk: [
        { t0: 'line:13.word:6.end+0.15', path: [[-7.5, -7.6], [-2, -8.1], [3.5, -8.0]], speed: 2.6, face: 88 },
      ],
      place: [
        { t: 'line:30.start', at: [399, -29.2], ry: -70 },
      ],
      height: [
        { t: 'line:30.start', y: 23.3 },
        { t: 'line:30.word:8', y: 24.0, over: 0.4 },
        { t: 'line:30.word:9', y: 24.6, over: 0.4 },
      ],
    },

    walter: {
      face: [
        { t: 'line:28.start-0.1', eyes: 'open', brow: 'on', mouth: 'smile' },
        { t: 'line:29.start-0.1', eyes: 'arc', brow: 'up', mouth: 'smile', hold: true },
      ],
      clips: [
        { clip: 'point', t0: 'line:28.word:4+0.03', side: 'R', dir: [0.1, 0.8, -0.2], hold: 0.6, out: 7 },
        { clip: 'point', t0: 'line:29.word:4+0.03', side: 'R', dir: [0.15, 0.55, -0.2], hold: 0.5, out: 6 },
      ],
      look: [
        { t: 'line:28.start', at: [1600.8, 2.9, -5.9] },
      ],
    },

    pip: {
      face: [
        { t: 'line:28.start-0.1', eyes: 'wide', brow: 'up', mouth: 'smile' },
        { t: 'line:29.start-0.1', eyes: 'arc', brow: 'up', mouth: 'crescent', hold: true },
      ],
      clips: [
        { clip: 'hop_bounce', t0: 'line:28.word:4+0.1' },
      ],
    },

    engineer: {
      face: [
        { t: 'line:4.start-0.1', eyes: 'open', brow: 'on', mouth: 'rest' },
        { t: 'line:30.start-0.1', eyes: 'stare', brow: 'down', mouth: 'flat' },
      ],
      clips: [
        { clip: 'point', t0: 'line:30.word:6+0.03', side: 'R', dir: [-0.3, -0.4, -0.4], hold: 0.5, out: 6 },
      ],
      place: [
        { t: 'line:30.start', at: [401.5, -29.5], ry: -60 },
      ],
      height: [
        { t: 'line:30.start', y: 23.4 },
        { t: 'line:30.word:8', y: 24.1, over: 0.4 },
        { t: 'line:30.word:9', y: 24.7, over: 0.4 },
      ],
    },
  },

  props: [
    { id: 'gate_coast', kind: 'gate', in: 'world', at: [0, 0, -30], rot: [0, 0, 0] },
    { id: 'gate_build', kind: 'gate', in: 'hidden', at: [400, 0, -30], rot: [0, 0, 0],
      keys: [{ t: 'line:4.start', fetch: true }] },
    { id: 'stores_ov', kind: 'measure', mode: 'stores', in: 'world', at: [-4.5, 0, -27.7],
      keys: [{ t: 'line:1.word:7.end', stow: true }] },
    { id: 'arrow155', kind: 'measure', mode: 'arrow', in: 'hidden', at: [403.5, 0, -29.6],
      keys: [
        { t: 'line:4.start', fetch: true, climb: 0.05 },
        { t: 'line:4.end', climb: 0.35, ease: 1.0 },
        { t: 'line:5.start', climb: 0.7, ease: 0.9 },
        { t: 'line:5.end', climb: 1, ease: 0.9 }] },
    { id: 'sticker10A', kind: 'measure', mode: 'sticker', in: 'hidden', at: [794.5, 0, -24.3],
      keys: [{ t: 'line:6.start', fetch: true }] },
    { id: 'sticker10B', kind: 'measure', mode: 'sticker', in: 'hidden', at: [815.5, 0, -24.3],
      keys: [{ t: 'line:6.start', fetch: true }] },
    { id: 'banner3000', kind: 'sign', style: 'banner', in: 'hidden', at: [0, 8.6, -5],
      keys: [{ t: 'line:3.start', fetch: true, sway: 0.5 }, { t: 'line:8.start', stow: true }] },
    { id: 'sign_mock', kind: 'sign', style: 'plank', in: 'hidden', at: [2, 25.0, -27.6],
      keys: [{ t: 'line:13.word:6.end', fetch: true, sway: 0.3 }, { t: 'line:15.start', stow: true }] },
    { id: 'money30', kind: 'money', in: 'hidden', at: [405.5, 0, -11],
      keys: [{ t: 'line:4.start', fetch: true }] },
    { id: 'cal12', kind: 'calendar', in: 'hidden', at: [397, 0, -8], rot: [0, 0.15, 0],
      keys: [
        { t: 'line:4.start', fetch: true, flip: 0.05, year: '12' },
        { t: 'line:4.word:5', flip: 0.4, ease: 0.8 },
        { t: 'line:5.end', flip: 1, ease: 1.0 },
        { t: 'line:18.start', flip: 1.05, year: '14', ease: 0.3 },
        { t: 'line:18.word:4', flip: 1.45, ease: 0.8 },
        { t: 'line:19.start', flip: 1.7, ease: 0.6 }] },
    { id: 'blueprint_bp', kind: 'blueprint', in: 'world', at: [7, 0, -16],
      keys: [
        { t: 'line:12.word:2', pull: 1, ease: 0.15 },
        { t: 'line:12.word:4', pull: 0, ease: 0.1, snap: true }] },
    { id: 'ruler_r', kind: 'ruler', owner: 'mayor', in: 'hand:L', rot: [0, 90, 0],
      keys: [{ t: 'line:12.start', fetch: true }, { t: 'line:13.start', stow: true }] },
    { id: 'gravestone_g', kind: 'gravestone', in: 'hidden', at: [2000, 0, -2],
      keys: [{ t: 'line:16.start', fetch: true }] },
    { id: 'drybed_d', kind: 'drybed', in: 'hidden', at: [0, 0, -40],
      keys: [{ t: 'line:20.start', fetch: true }, { t: 'line:23.start', stow: true }] },
    { id: 'wave_n', kind: 'wave', in: 'hidden', at: [800, 0, -44],
      keys: [
        { t: 'line:30.word:9.end', fetch: true, rise: 0.55, adv: 0 },
        { t: 'line:31.end', rise: 1, adv: 14, ease: 1.2 }] },
    { id: 'flood_n', kind: 'floodwater', in: 'hidden', at: [800, 0, -12],
      keys: [
        { t: 'line:30.word:9.end', fetch: true, in: 0.2 },
        { t: 'line:32.word:3', in: 1, ease: 1.2 }] },
    { id: 'wave_c', kind: 'wave', in: 'hidden', at: [0, 0, -52],
      keys: [
        { t: 'line:21.start', fetch: true, rise: 0.25, adv: 0 },
        { t: 'line:22.end', rise: 0.75, adv: 8, ease: 1.0 },
        { t: 'line:23.end', rise: 1, adv: 12, ease: 1.0 },
        { t: 'line:33.word:2', adv: 19, ease: 0.5 },
        { t: 'line:33.word:2+0.1', adv: 21.6, ease: 0.12, snap: true },
        { t: 'line:34.end', rise: 1, adv: 21.6 }] },
    { id: 'measure15', kind: 'measure', mode: 'line', in: 'hidden', at: [0, 0, -50.6],
      keys: [
        { t: 'line:23.start', fetch: true, climb: 0.2 },
        { t: 'line:23.word:3', climb: 1, ease: 0.9 },
        { t: 'line:24.start', stow: true }] },
    { id: 'coins_d', kind: 'debris', variant: 'coins', in: 'hidden', at: [-3.9, 0, -3],
      keys: [
        { t: 'line:9.word:3', fetch: true, fall: 0.05 },
        { t: 'line:9.end', fall: 1, ease: 0.7 },
        { t: 'line:10.start', stow: true }] },
    { id: 'leaf_d', kind: 'debris', variant: 'leaf', in: 'hidden', at: [2000.6, 0, -2.4],
      keys: [
        { t: 'line:16.start', fetch: true, fall: 0.04 },
        { t: 'line:17.end-0.3', fall: 0.95, ease: 1.4 },
        { t: 'line:18.start', fall: 1, stow: true }] },
    { id: 'flock_d', kind: 'debris', variant: 'flock', in: 'hidden', at: [-7, 1.2, -2],
      keys: [
        { t: 'line:19.word:3', fetch: true, fly: 0.05 },
        { t: 'line:20.start', fly: 1, ease: 0.9, stow: true }] },
    { id: 'sunmoon_s', kind: 'sunmoon', in: 'hidden', at: [0, 6, -46],
      keys: [
        { t: 'line:13.start', fetch: true, spin: 0 },
        { t: 'line:13.word:6.end-0.2', spin: 2.4, ease: 2.2 },
        { t: 'line:13.word:6.end', stow: true }] },
    { id: 'storm_s', kind: 'stormclouds', in: 'hidden', at: [0, 0, -8],
      keys: [
        { t: 'line:19.start', fetch: true, in: 0.15 },
        { t: 'line:19.end', in: 1, ease: 1.2 },
        { t: 'line:34.end+0.5', part: 1, ease: 1.5 }] },
    { id: 'storm_s2', kind: 'stormclouds', in: 'hidden', at: [400, 0, -10],
      keys: [
        { t: 'line:18.start', fetch: true, in: 0.3 },
        { t: 'line:18.end', in: 0.9, ease: 0.9 },
        { t: 'line:19.start', stow: true }] },
    { id: 'sway_p', kind: 'swaypole', in: 'hidden', at: [-6.5, 0, -1],
      keys: [
        { t: 'line:19.start', fetch: true, sway: 0.05 },
        { t: 'line:19.word:3', sway: 0.5, ease: 0.4 },
        { t: 'line:19.end', sway: 0.85, ease: 0.6 },
        { t: 'line:20.end', sway: 0.35, ease: 1.2 },
        { t: 'line:24.start', stow: true }] },
    { id: 'mark_r', kind: 'wallmark', in: 'hidden', at: [1600.8, 0, -5.88],
      keys: [{ t: 'line:28.start', fetch: true }] },
    { id: 'oldflood_o', kind: 'oldflood', in: 'hidden', at: [1200, 0, -46],
      keys: [
        { t: 'line:24.start', fetch: true, in: 0.6 },
        { t: 'line:24.end', in: 1, ease: 1.0 }] },
    { id: 'box_b', kind: 'box', owner: 'mayor', in: 'hidden',
      keys: [{ t: 'line:15.start', fetch: true }, { t: 'line:24.start', stow: true }] },
    { id: 'pen_p', kind: 'pen', owner: 'walter', in: 'hidden',
      keys: [{ t: 'line:28.start', fetch: true }] },
    { id: 'flowers_v1', kind: 'flowers', owner: 'v1', in: 'hidden',
      keys: [{ t: 'line:36.start', fetch: true }] },
    { id: 'flowers_v4', kind: 'flowers', owner: 'v4', in: 'hidden',
      keys: [{ t: 'line:36.start', fetch: true }] },
  ],

  handovers: [],

  shots: [
    // S1 — hook (plan: tilt-up beside the mayor, reconciled: frame 0 is his face)
    { t0: 0, t1: 'line:1.word:7.end', camera: { move: 'path', keys: [
      { t: 0, pos: [1.9, 2.0, 12.6], target: [0.6, 2.4, 0.2], fov: 26, roll: 1.5 },
      { t: 'line:1.word:4', pos: [1.7, 6.5, 15.5], target: [0.2, 9, -20], fov: 26, roll: 2 },
      { t: 'line:1.word:7.end', pos: [1.2, 19.5, 24], target: [0, 22, -27.5], fov: 26, roll: 2.5 } ] } },
    { t0: 'line:1.word:7.end', t1: 'line:2.start', camera: { move: 'push',
      from: { pos: [0, 12, -8], target: [0, 9, -28] },
      to: { pos: [8, 34, 24], target: [0, 9, -28] }, fov: 30, roll: [1.5, 2] } },
    { t0: 'line:2.start', t1: 'line:3.start', camera: { move: 'path', keys: [
      { t: 'line:2.start', pos: [-6, 1.6, -42], target: [0, 3, -30], fov: 26, roll: 1 },
      { t: 'line:3.start', pos: [8, 1.8, -48], target: [0, 4, -30], fov: 26, roll: 1.6 } ] } },
    // S2 — the bet and the numbers
    { t0: 'line:3.start', t1: 'line:4.start', camera: { move: 'push',
      from: { pos: [-9, 2.2, 9], target: [0.6, 2.4, 0] },
      to: { pos: [-7.4, 2.2, 7.4], target: [0.6, 2.4, 0] }, fov: 26, roll: 1 } },
    { t0: 'line:4.start', t1: 'line:4.word:9', camera: { move: 'path', keys: [
      { t: 'line:4.start', pos: [409, 2.4, -4], target: [405, 2.8, -11], fov: 30, roll: 1 },
      { t: 'line:4.word:5', pos: [410.5, 2.8, -2], target: [404, 3.2, -14], fov: 30, roll: 1.4 },
      { t: 'line:4.word:9', pos: [412, 3.6, 0], target: [402, 7, -30], fov: 30, roll: 1.8 } ] } },
    { t0: 'line:4.word:9', t1: 'line:6.start', camera: { move: 'push',
      from: { pos: [408, 3, -22], target: [400, 13, -29] },
      to: { pos: [403, 11, -25.5], target: [400, 13, -29] }, fov: 28, roll: [1.2, 1.8] } },
    { t0: 'line:6.start', t1: 'line:8.start', camera: { move: 'path', keys: [
      { t: 'line:6.start', pos: [793, 30, 2], target: [795, 8, -26], fov: 32, roll: 1 },
      { t: 'line:7.start', pos: [800, 33, 0], target: [800, 8, -26], fov: 32, roll: 1.4 },
      { t: 'line:8.start', pos: [809, 35, -1], target: [814, 8, -26], fov: 32, roll: 1.8 } ] } },
    // S3 — the mock and the silence
    { t0: 'line:8.start', t1: 'line:9.end', camera: { move: 'push',
      from: { pos: [-3.2, 2.3, 6.6], target: [-3.5, 2.35, -4] },
      to: { pos: [-3.3, 2.28, 5.6], target: [-3.5, 2.35, -4] }, fov: 26, roll: [4, 3.4] } },
    { t0: 'line:9.end', t1: 'line:10.end', camera: { move: 'push',
      from: { pos: [-4.6, 2.24, 5.8], target: [-3.5, 2.3, -4] },
      to: { pos: [-4.45, 2.24, 4.9], target: [-3.5, 2.3, -4] }, fov: 26, roll: [-3, -2.4] } },
    { t0: 'line:10.end', t1: 'line:12.start', camera: { move: 'push',
      from: { pos: [1.4, 2.1, 11.6], target: [0.6, 2.35, 0] },
      to: { pos: [1.15, 2.1, 10.2], target: [0.6, 2.35, 0] }, fov: 26, roll: [1, 1.8] } },
    { t0: 'line:12.start', t1: 'line:13.start', camera: { move: 'push',
      from: { pos: [2.2, 3.0, -7.0], target: [7.4, 3.0, -16] },
      to: { pos: [2.9, 3.0, -8.2], target: [7.4, 3.0, -16] }, fov: 28, roll: [1.2, 1.6] } },
    // S4 — the years, the blame, the death
    { t0: 'line:13.start', t1: 'line:13.word:6.end', camera: { move: 'push',
      from: { pos: [-2, 3.2, -14], target: [0, 14, -30] },
      to: { pos: [-1.6, 3.4, -13], target: [0, 14, -30] }, fov: 30, roll: 1.4 } },
    { t0: 'line:13.word:6.end', t1: 'line:15.start', camera: { move: 'push',
      from: { pos: [-3, 2.6, 3.4], target: [0.5, 4.2, -6] },
      to: { pos: [-2.6, 2.8, 2.2], target: [0.5, 4.2, -6] }, fov: 26, roll: 2 } },
    { t0: 'line:15.start', t1: 'line:16.start', camera: { move: 'path', keys: [
      { t: 'line:15.start', pos: [-17, 2.4, 20], target: { who: 'mayor', offset: [0, 2.3, 0] }, fov: 26, roll: 1.2 },
      { t: 'line:15.end', pos: [-16.8, 2.4, 11], target: { who: 'mayor', offset: [0, 2.3, 0] }, fov: 26, roll: 1.6 } ] } },
    { t0: 'line:16.start', t1: 'line:18.start', camera: { move: 'path', keys: [
      { t: 'line:16.start', pos: [2001.5, 2.4, 7], target: [2000, 1.6, -2], fov: 30, roll: 1 },
      { t: 'line:17.start', pos: [2001, 4.5, 5.5], target: [2000, 1.8, -6], fov: 30, roll: 1.4 },
      { t: 'line:18.start', pos: [2000.5, 8.5, 3], target: [2001, 2, -40], fov: 30, roll: 1.8 } ] } },
    // S5 — the earthquake, the pulled sea, the wave
    { t0: 'line:18.start', t1: 'line:19.start', camera: { move: 'push',
      from: { pos: [398.6, 2.6, -5.2], target: [397, 2.75, -8] },
      to: { pos: [398.0, 2.55, -6.0], target: [397, 2.75, -8] }, fov: 28, roll: 1.5 } },
    { t0: 'line:19.start', t1: 'line:20.start', camera: { move: 'path', keys: [
      { t: 'line:19.start', pos: [-9, 2.4, 6], target: [-6, 2.6, -2], fov: 26, roll: 2.5, shake: 2.5 },
      { t: 'line:19.word:3', pos: [-8.8, 2.45, 5.2], target: [-6.5, 2.6, -3], fov: 26, roll: 2.8, shake: 3 },
      { t: 'line:20.start', pos: [-8.6, 2.4, 4.6], target: [-6, 2.6, -2], fov: 26, roll: 2.2, shake: 2 } ] } },
    { t0: 'line:20.start', t1: 'line:21.start', camera: { move: 'push',
      from: { pos: [-2, 40, -50], target: [0, 0, -34] },
      to: { pos: [6, 44, -58], target: [0, 0, -34] }, fov: 34, roll: 1 } },
    { t0: 'line:21.start', t1: 'line:23.start', camera: { move: 'push',
      from: { pos: [-7, 1.9, -36], target: [0, 6, -48] },
      to: { pos: [-6.4, 2.0, -33], target: [0, 6, -48] }, fov: 30, roll: 1.2 } },
    { t0: 'line:23.start', t1: 'line:24.start', camera: { move: 'path', keys: [
      { t: 'line:23.start', pos: [4, 1.8, -40], target: [0, 10, -52], fov: 30, roll: -2 },
      { t: 'line:23.word:3', pos: [4.2, 7, -40.5], target: [0, 16, -52], fov: 30, roll: -1.6 },
      { t: 'line:24.start', pos: [4.4, 16, -41], target: [0, 20, -52], fov: 30, roll: -1.4 } ] } },
    // S6 — the flashback and the analogy
    { t0: 'line:24.start', t1: 'line:26.start', camera: { move: 'push',
      from: { pos: [1205, 3.4, 10], target: [1199.2, 2.5, 0.6] },
      to: { pos: [1203.5, 3.2, 8], target: [1199.2, 2.5, 0.6] }, fov: 30, roll: 1.2 } },
    { t0: 'line:26.start', t1: 'line:27.start', camera: { move: 'path', keys: [
      { t: 'line:26.start', pos: [1195.0, 2.5, 2.2], target: [1198.8, 2.2, -0.3], fov: 26, roll: 1 },
      { t: 'line:26.word:5', pos: [1195.9, 2.45, 1.7], target: [1199.0, 2.25, -0.2], fov: 26, roll: 1.2 },
      { t: 'line:27.start', pos: [1196.6, 2.4, 1.4], target: [1199.2, 2.3, 0], fov: 26, roll: 1.4 } ] } },
    { t0: 'line:27.start', t1: 'line:28.start', camera: { move: 'push',
      from: { pos: [1205.5, 3.1, 10.5], target: [1199.6, 2.4, 0.6] },
      to: { pos: [1204.85, 3.0, 9.5], target: [1199.6, 2.4, 0.6] }, fov: 26, roll: [1.5, 1] } },
    { t0: 'line:28.start', t1: 'line:30.start', camera: { move: 'push',
      from: { pos: [1606.5, 3.4, 6.5], target: [1600.8, 2.6, -4] },
      to: { pos: [1604.6, 3.0, 3.4], target: [1600.8, 2.6, -4] }, fov: 26, roll: [1.8, 1.2] } },
    { t0: 'line:30.start', t1: 'line:30.word:9.end', camera: { move: 'path', keys: [
      { t: 'line:30.start', pos: [404.8, 24.4, -20.4], target: [400.7, 24.5, -29.5], fov: 28, roll: -2 },
      { t: 'line:30.word:6', pos: [405.5, 25.5, -19], target: [400.5, 24.2, -29.5], fov: 28, roll: -1.6 },
      { t: 'line:30.word:9.end', pos: [407, 27, -16], target: [400, 21, -29], fov: 28, roll: -1.2 } ] } },
    // S7 — the neighbours erased, the wall holds, the thanks
    { t0: 'line:30.word:9.end', t1: 'line:31.end', camera: { move: 'push',
      from: { pos: [796, 30, -6], target: [800, 8, -26] },
      to: { pos: [806, 34, -10], target: [800, 8, -26] }, fov: 32, roll: 1.2 } },
    { t0: 'line:31.end', t1: 'line:33.start', camera: { move: 'push',
      from: { pos: [802, 16, -14], target: [798, 4, -24] },
      to: { pos: [799.5, 12.5, -10.5], target: [798, 4, -24] }, fov: 30, roll: 1.6 } },
    { t0: 'line:33.start', t1: 'line:34.end+0.5', camera: { move: 'path', keys: [
      { t: 'line:33.start', pos: [-16, 10, -38], target: [0, 18, -30], fov: 28, roll: 3, shake: 1 },
      { t: 'line:33.word:2+0.1', pos: [-15.6, 10.5, -37], target: [0, 19, -30], fov: 28, roll: 2.6, shake: 3 },
      { t: 'line:34.start', pos: [-15.2, 11, -36], target: [0, 21, -30], fov: 28, roll: 2.2, shake: 1.5 },
      { t: 'line:34.end+0.5', pos: [-15, 11, -36], target: [0, 22, -30], fov: 28, roll: 1.8, shake: 1 } ] } },
    { t0: 'line:34.end+0.5', t1: 'line:36.start', camera: { move: 'path', keys: [
      { t: 'line:34.end+0.5', pos: [-14, 14, -34], target: [0, 24.5, -30], fov: 30, roll: 1.4 },
      { t: 'line:35.start', pos: [-9, 20, -26], target: [0, 18, -28], fov: 30, roll: 1 },
      { t: 'line:36.start', pos: [-2, 27, -10], target: [0, 6, -4], fov: 30, roll: 0.8 } ] } },
    { t0: 'line:36.start', t1: 'line:37.end+0.5', camera: { move: 'push',
      from: { pos: [2002, 2.9, 9], target: [2000, 2.2, -2] },
      to: { pos: [2003.5, 3.6, 12], target: [2000, 2.2, -2] }, fov: 26, roll: [1.5, 2.2] } },
  ],

  captions: 'words',
};
