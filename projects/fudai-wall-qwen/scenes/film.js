export default {
  fps: 30,
  size: [1080, 1920],
  world: { set: 'own', setOpts: { places: ['coast','square','construction','coastComparison','squareLater','finishedWall','townHallExit','graveHill','villageStreet','coastline','flashbackHill','rock','room','wallTop','neighbouringTowns','wallImpact'] } },
  cast: {
    wamura: { spec: 'tycoon', at: [-1.2, 0.8], ry: 30, y: 0 },
    villager: { spec: 'townsperson', at: [1.2, 1.0], ry: -30, y: 0 },
    child: { spec: 's4_kid', at: [-0.4, 1.4], ry: 0, y: 0 },
    youngWamura: { spec: 'tycoon', at: [-0.8, 0.6], ry: 20, y: 0 }
  },
  voice: {
    file: 'audio/clean.wav',
    words: 'audio/clean.json',
    lines: [
      { who: 'wamura', text: 'بنى سور خرساني بطول عمارة خمس أدوار قدام قرية صيد صغيرة' },
      { who: null, text: 'والبحر قدامه هادي زي المراية' },
      { who: 'wamura', text: 'كان عمدة لقرية فيها 3000 شخص بس' },
      { who: null, text: 'وصرف 30 مليون دولار و12 سنة بناء على بوابة ارتفاعها 15 متر ونص' },
      { who: null, text: 'مع إن كل القرى اللي حواليه اكتفت بسور 10 متر' },
      { who: 'villager', text: 'أهل القرية ضحكوا عليه وقالوا له: إنت بترمي فلوسنا في البحر؟' },
      { who: 'villager', text: 'الموج عمره ما هيوصل هناك' },
      { who: 'wamura', text: 'بس العمدة ما ردش ولا نزل السور سنتي واحد' },
      { who: null, text: 'السور خلص والبحر فضل هادي سنين' },
      { who: null, text: 'والناس سموه أغبى مشروع في البلد' },
      { who: 'wamura', text: 'العمدة طلع على المعاش وهو لسه بيتلام على الفلوس اللي ضاعت' },
      { who: null, text: 'ومات من غير ما حد واحد يصدقه' },
      { who: null, text: 'بعد موته بـ 14 سنة' },
      { who: null, text: 'الأرض اتهزت بزلزال عنيف' },
      { who: null, text: 'والبحر اتسحب لورا' },
      { who: null, text: 'ورجع بموجة عملاقة ارتفاعها 15 متر بالظبط' },
      { who: 'youngWamura', text: 'أصل العمدة وهو شاب شاف البحر بيبلع قريته' },
      { who: 'youngWamura', text: 'فافتكر علامات قديمة على الصخر بتحدد أعلى نقطة وصلها الموج زمان' },
      { who: 'wamura', text: 'زي ما تحط شرطة بالقلم على الحيطة عشان ما تنساش المقاس' },
      { who: null, text: 'هو بنى السور على مقاس أضخم موجة في الذاكرة' },
      { who: null, text: 'القرى اللي حواليهم بأسوارها الـ 10 متر اتمسحت في دقايق' },
      { who: null, text: 'والموجة خبطت في سوره ووقفت عند حافته' },
      { who: null, text: 'القرية كلها نجت' },
      { who: null, text: 'والناس اللي ضحكوا عليه راحوا قبره يشكروه' }
    ]
  },
  acts: {
    wamura: {
      face: [
        { t: 'line:1.start-0.1', expr: 'fear' },
        { t: 'line:4.word:2+0.1', eyes: 'wide', brow: 'up' },
        { t: 'line:6.start-0.1', eyes: 'sad', brow: 'down' },
        { t: 'line:8.start-0.1', expr: 'stare', react: false },
        { t: 'line:11.start-0.1', eyes: 'sad', brow: 'down' },
        { t: 'line:16.start-0.1', eyes: 'wide', brow: 'up' },
        { t: 'line:20.start-0.1', expr: 'stare', react: false },
        { t: 'line:22.start-0.1', eyes: 'relief', brow: 'up' },
        { t: 'line:24.start-0.1', eyes: 'hope', brow: 'up' }
      ],
      clips: [
        { clip: 'wave', side: 'right', t0: 'line:1.word:2', eyes: 'arc', hold: 0.4, out: 6 },
        { clip: 'point', side: 'right', dir: [0.2, 0.6, 0.3], t0: 'line:4.word:7', hold: 0.5, out: 6 },
        { clip: 'akimbo', side: 'both', t0: 'line:8.word:3', eyes: 'angry', hold: 0.6, out: 6 },
        { clip: 'sit_down', t0: 'line:11.start', hold: 0.6, out: 6 },
        { clip: 'stand_up', t0: 'line:16.start', hold: 0.4, out: 6 }
      ],
      look: [
        { t: 'line:1.start+0.03', at: [-0.4, 2.4, 6] },
        { t: 'line:6.word:2+0.03', at: [1.4, 2.4, 1.0] },
        { t: 'line:16.start+0.03', at: [0.1, 2.5, 8] },
        { t: 'line:22.start+0.03', at: [0.1, 2.5, 10] }
      ],
      walk: [
        { t0: 'line:11.word:5', path: [[-1.2, 0.8], [0.6, 0.8]], speed: 1.3, face: 'forward' }
      ],
      place: [
        { t: 'line:17.start', at: [-0.8, 0.6], ry: 20 }
      ]
    },
    villager: {
      face: [
        { t: 'line:6.start-0.1', eyes: 'wide', brow: 'up', mouth: 'smile' },
        { t: 'line:7.start-0.1', eyes: 'wide', brow: 'up' },
        { t: 'line:24.start-0.1', eyes: 'hope', brow: 'up', mouth: 'smile' }
      ],
      clips: [
        { clip: 'point', side: 'right', dir: [0.2, 0.6, 0.3], t0: 'line:7.word:4', hold: 0.4, out: 6 },
        { clip: 'shake', side: 'right', t0: 'line:24.word:1', hold: 0.3, out: 6 },
        { clip: 'kneel', side: 'right', t0: 'line:24.word:2', hold: 0.5, out: 6 }
      ],
      look: [
        { t: 'line:6.start+0.03', at: [-1.0, 2.4, 0.8] },
        { t: 'line:24.start+0.03', at: [-1.0, 2.4, 0.8] }
      ],
      walk: []
    },
    child: {
      face: [
        { t: 'line:19.start-0.1', eyes: 'wide', brow: 'up' }
      ],
      clips: [],
      look: [
        { t: 'line:19.word:4+0.03', at: [-0.4, 2.4, 1.0] }
      ],
      walk: []
    },
    youngWamura: {
      face: [
        { t: 'line:17.start-0.1', eyes: 'wide', brow: 'up' },
        { t: 'line:18.start-0.1', eyes: 'stare', react: false }
      ],
      clips: [
        { clip: 'point', side: 'right', dir: [0.2, 0.6, 0.3], t0: 'line:18.word:7', hold: 0.5, out: 6 }
      ],
      look: [
        { t: 'line:17.start+0.03', at: [-0.4, 2.4, 6] },
        { t: 'line:18.start+0.03', at: [-0.4, 2.4, 6] }
      ],
      walk: [],
      place: []
    }
  },
  props: [
    { id: 'wall', kind: 'wall', owner: 'world', at: [0, 12.4, -14], rot: [0, 0, 0], keys: [] },
    { id: 'gate', kind: 'gate', owner: 'world', at: [0, 12.4, -14], rot: [0, 0, 0], keys: [] },
    { id: 'moneyStacks', kind: 'box', owner: 'world', at: [-2, 1.5, -6], rot: [0, 0, 0], keys: [{ t: 'line:4.word:2', open: 1 }] },
    { id: 'calendar', kind: 'book', owner: 'world', at: [2, 1.5, -6], rot: [0, 0, 0], keys: [{ t: 'line:4.word:9', open: 1 }] },
    { id: 'blueprint', kind: 'paper', owner: 'world', at: [0, 1.6, -10], rot: [0, 0, 0], keys: [{ t: 'line:8.word:6', open: 1 }] },
    { id: 'ruler', kind: 'cane', owner: 'wamura', in: 'hand:R', at: [0, 1.6, -10], rot: [0, 0, 0], keys: [{ t: 'line:8.word:6', open: 1 }] },
    { id: 'gravestone', kind: 'box', owner: 'world', at: [-3, 1.2, -20], rot: [0, 0, 0], keys: [] },
    { id: 'pencil', kind: 'pen', owner: 'wamura', in: 'hand:R', at: [0, 1.6, -8], rot: [0, 0, 0], keys: [{ t: 'line:19.word:4', open: 1 }] },
    { id: 'coins', kind: 'ball', owner: 'world', at: [1, 1.8, -4], rot: [0, 0, 0], keys: [{ t: 'line:6.word:6', open: 1 }] },
    { id: 'wave', kind: 'box', owner: 'world', at: [0, 14, -18], rot: [0, 0, 0], keys: [{ t: 'line:16.word:4', open: 1, drop: { from: [0, 14, -18], v0: [0, -2, 0], ground: 0, hide: true } }] }
  ],
  handovers: [],
  shots: [
    { t0: 0, t1: 'line:2.start', camera: { move: 'push', from: { pos: [-0.6, 2.4, 9], target: [-1.2, 2.5, 0.8] }, to: { pos: [-0.5, 2.4, 7.2], target: [-1.2, 2.5, 0.8] }, roll: 2 } },
    { t0: 'line:2.start', t1: 'line:3.start', camera: { move: 'push', from: { pos: [-0.5, 2.4, 7.2], target: [-1.2, 2.5, 0.8] }, to: { pos: [-0.3, 2.4, 5.8], target: [-1.2, 2.5, 0.8] }, roll: 2 } },
    { t0: 'line:3.start', t1: 'line:4.start', camera: { move: 'orbit', who: 'wamura', az0: 30, az1: 45, el: 1.1, dist: 11, fov: 26 } },
    { t0: 'line:4.start', t1: 'line:5.start', camera: { move: 'path', keys: [ { t: 0, pos: [0, 3, 12], target: [0, 2.5, -6], fov: 28 }, { t: 'line:4.word:11', pos: [0, 3.2, 9], target: [0, 2.5, -8], fov: 28 } ] } },
    { t0: 'line:5.start', t1: 'line:6.start', camera: { move: 'push', from: { pos: [0, 3.2, 9], target: [0, 2.5, -8], fov: 28 }, to: { pos: [0, 3.4, 7], target: [0, 2.5, -10], fov: 28 } } },
    { t0: 'line:6.start', t1: 'line:7.start', camera: { move: 'park', pos: [1.0, 2.5, 3.5], target: [1.2, 2.5, 1.0], fov: 26, roll: 5 } },
    { t0: 'line:7.start', t1: 'line:8.start', camera: { move: 'push', from: { pos: [1.0, 2.5, 3.5], target: [1.2, 2.5, 1.0], fov: 26 }, to: { pos: [1.1, 2.5, 2.8], target: [1.2, 2.5, 1.0], fov: 26 } } },
    { t0: 'line:8.start', t1: 'line:9.start', camera: { move: 'park', pos: [-0.4, 2.4, 5.5], target: [-1.2, 2.5, 0.8], fov: 26 } },
    { t0: 'line:9.start', t1: 'line:10.start', camera: { move: 'push', from: { pos: [-0.4, 2.4, 5.5], target: [-1.2, 2.5, 0.8], fov: 26 }, to: { pos: [-0.3, 2.4, 4.2], target: [-1.2, 2.5, 0.8], fov: 26 } } },
    { t0: 'line:10.start', t1: 'line:11.start', camera: { move: 'park', pos: [0, 4, 10], target: [0, 2.5, -8], fov: 30 } },
    { t0: 'line:11.start', t1: 'line:12.start', camera: { move: 'follow', who: 'wamura', camOffset: [-0.8, 2.6, 4], look: [-0.4, 2.5, 1.0], fov: 26 } },
    { t0: 'line:12.start', t1: 'line:13.start', camera: { move: 'push', from: { pos: [-2.2, 2.6, 10], target: [-3, 2.4, -19], fov: 26 }, to: { pos: [-2.2, 2.8, 8.5], target: [-3, 2.4, -19], fov: 26 } } },
    { t0: 'line:13.start', t1: 'line:14.start', camera: { move: 'park', pos: [0, 3, 11], target: [0, 2.5, -8], fov: 28 } },
    { t0: 'line:14.start', t1: 'line:15.start', camera: { move: 'path', keys: [ { t: 0, pos: [0, 3.5, 9], target: [0, 2.5, -6], fov: 28, shake: 2 }, { t: 'line:14.word:3', pos: [0.2, 3.6, 7], target: [0, 2.5, -7], fov: 28, shake: 2 } ] } },
    { t0: 'line:15.start', t1: 'line:16.start', camera: { move: 'push', from: { pos: [0, 4, 12], target: [0, 2.5, -14], fov: 28 }, to: { pos: [0, 4.2, 9.5], target: [0, 2.5, -16], fov: 28 } } },
    { t0: 'line:16.start', t1: 'line:17.start', camera: { move: 'push', from: { pos: [-0.8, 2.6, 5], target: [0, 14, -18], fov: 30 }, to: { pos: [-0.7, 2.6, 3.8], target: [0, 14, -18], fov: 30 } } },
    { t0: 'line:17.start', t1: 'line:18.start', camera: { move: 'park', pos: [-1.0, 2.5, 6], target: [-0.8, 2.5, 0.6], fov: 26 } },
    { t0: 'line:18.start', t1: 'line:19.start', camera: { move: 'push', from: { pos: [-1.0, 2.5, 6], target: [-0.8, 2.5, 0.6], fov: 26 }, to: { pos: [-0.9, 2.5, 4.8], target: [-0.8, 2.5, 0.6], fov: 26 } } },
    { t0: 'line:19.start', t1: 'line:20.start', camera: { move: 'park', pos: [-0.2, 2.4, 4], target: [-0.4, 2.4, 1.4], fov: 26 } },
    { t0: 'line:20.start', t1: 'line:21.start', camera: { move: 'push', from: { pos: [0, 13, -6], target: [0, 13.5, -14], fov: 28 }, to: { pos: [0, 13.2, -5], target: [0, 13.5, -16], fov: 28 } } },
    { t0: 'line:21.start', t1: 'line:22.start', camera: { move: 'push', from: { pos: [0, 5, 14], target: [0, 2.5, -10], fov: 28 }, to: { pos: [0, 5.2, 11], target: [0, 2.5, -12], fov: 28 } } },
    { t0: 'line:22.start', t1: 'line:23.start', camera: { move: 'path', keys: [ { t: 0, pos: [0, 2.6, 4], target: [0, 14, -18], fov: 30 }, { t: 'line:22.word:3', pos: [0.1, 2.7, 3], target: [0, 14, -18], fov: 30 } ] } },
    { t0: 'line:23.start', t1: 'line:24.start', camera: { move: 'push', from: { pos: [-0.5, 3, 12], target: [0, 2.5, -8], fov: 28 }, to: { pos: [-0.4, 3.2, 9.5], target: [0, 2.5, -10], fov: 28 } } },
    { t0: 'line:24.start', t1: 'line:24.end', camera: { move: 'park', pos: [-2.4, 2.8, 9], target: [-3, 2.4, -19], fov: 26 } }
  ],
  captions: 'words'
};