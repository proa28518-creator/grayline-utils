// «الخاتم اللي اتدحرج» — The Ring That Rolled Away. Story 2, Stage 1.
// Day street chase on the kit city_street set + a fountain prop at the plaza
// end. The ring is the hero prop: hand -> drop -> rolling keys (pass glides)
// -> grate hop (drop) -> rim flight (drop, cartoon gravity) -> floats on the
// water -> pick_up -> fist. It never vanishes and never teleports.
// Suit wreckage is props: neat tie retires on the line-7 cut, crooked tie +
// mud appear, the pocket square drops at «وناسي».
// RUN 13 (Stage 2): the set is now the film's own scenes/set.js — the
// city_street kit wrapped with a light rig (lights as data) plus in-engine
// modelled dressing, so the Post pass (scenes/post.js) and the Shading pass
// (scenes/shade.js) can run. A.cuts = the shot starts: shading's hard steps
// sit exactly on the cuts and nowhere else.
import { makePost } from './post.js';
import { makeShade } from './shade.js';

const A = { cuts: [5.06, 8.96, 11.825, 15.505, 18.315, 20.915, 23.565, 26.429, 30.929, 34.249, 36.129, 39.029, 41.539, 44.987] };

export default {
  fps: 30,
  size: [1080, 1920],
  tail: 1.6,
  world: { set: 'own', setOpts: {
    // DAY (unchanged from Stage 1): bright day street chase, kit day sky.
    // RUN 13 (Stage 2): the Post pass (scenes/post.js) + the Shading pass
    // (scenes/shade.js) as its `shade` key, read by scenes/set.js's look.
    post: { ...makePost(A), shade: makeShade(A) },
  } },
  cast: {
    groom: { spec: 'cast/groom.json', at: [-8.2, 1.5], ry: 6 },
    bride: { spec: 'cast/bride.json', at: [15.8, 3.4], ry: -95 },
  },
  voice: {
    file: 'audio/clean.wav',
    words: 'audio/clean.json',
    lines: [
      { who: null, text: 'نزل على ركبة واحدة وطلع الخاتم وفجأة حمامة خبطت كوعه' },
      { who: null, text: 'الخاتم نط من إيده ووقع على الأرض وفضل يتدحرج' },
      { who: null, text: 'والمصيبة إن الشارع كله كان منحدر لتحت' },
      { who: null, text: 'بدأ يجري وراه ببدلته الشيك بيزعق ومحدش سامعه' },
      { who: null, text: 'الخاتم عدى من فوق فتحة الصرف بشعرة' },
      { who: null, text: 'ولف بين حمامتين ومكنسة مرمية' },
      { who: null, text: 'وكل ما يتدحرج سرعته بتزيد وهو بيجري وراه وناسي البدلة وكل حاجة' },
      { who: null, text: 'عند سلالم نافورة الميدان الخاتم خبط في الحافة وطار في الهوا' },
      { who: null, text: 'ولثانية كاملة فضل متعلق فوق المية' },
      { who: null, text: 'فمن غير تفكير نط وراه' },
      { who: null, text: 'طلع مبلول من ساسه لراسه والخاتم متكتف في إيده وهي واقفة قدامه بتضحك' },
      { who: null, text: 'وقبل حتى ما يلحق يوازن ركبته قالت له أيوه' },
      { who: null, text: 'في خواتم بتتدحرج عشان تهرب بس ختمه كان مكتوب له يتدحرج لحد ما يوصله عندها' },
    ],
  },
  acts: {
    groom: {
      face: [
        { t: 0, eyes: 'wide', brow: 'up', mouth: 'small-smile' },
        { t: 'line:1.word:7', eyes: 'wide', brow: 'up', mouth: 'o' },
        { t: 'line:1.word:9', eyes: 'wide', brow: 'up', mouth: 'open' },
        { t: 'line:2.word:2', eyes: 'look_dn', mouth: 'o' },
        { t: 'line:2.word:8', brow: 'knit', mouth: 'tight', eyes: 'open' },
        { t: 'line:3.word:1+0.15', eyes: 'narrow', brow: 'knit', mouth: 'tight' },
        { t: 'line:4.word:6', mouth: 'shout', eyes: 'wide' },
        { t: 'line:5.word:1+0.15', eyes: 'wide', brow: 'up', mouth: 'tight' },
        { t: 'line:5.word:7', mouth: 'small-smile' },
        { t: 'line:6.word:2', eyes: 'look_l', mouth: 'open' },
        { t: 'line:6.word:4', eyes: 'look_r' },
        { t: 'line:7.word:1+0.15', eyes: 'open', brow: 'knit', mouth: 'tight' },
        { t: 'line:7.word:9', eyes: 'happy', mouth: 'D', brow: 'up' },
        { t: 'line:8.word:9', eyes: 'look_up', mouth: 'o', brow: 'up' },
        { t: 'line:9.word:1+0.15', eyes: 'look_up', mouth: 'tight', brow: 'up' },
        { t: 'line:10.word:4', mouth: 'shout', eyes: 'wide', brow: 'knit' },
        { t: 'line:11.start', eyes: 'narrow', mouth: 'open', brow: 'up' },
        { t: 'line:11.word:6', eyes: 'wide' },
        { t: 'line:11.word:10', eyes: 'happy', mouth: 'D' },
        { t: 'line:12.word:1+0.15', eyes: 'open', brow: 'up', mouth: 'small-smile' },
        { t: 'line:12.word:9', eyes: 'happy', mouth: 'smile' },
        { t: 'line:13.word:1+0.15', eyes: 'happy', mouth: 'smile', brow: 'up' },
      ],
      clips: [
        { clip: 'kneel', at: 0.5, params: { bend: 14 } },
        { clip: 'stand_up', at: 'line:2.word:8', params: { frames: 12 } },
        { clip: 'pick_up', at: 'line:11.word:6', params: { prop: 'ring', side: 'R', at: [12.7, 1.05, 3.1], reach: 5, grab: 3, lift: 6, bend: 20, to: 'chest' } },
        { clip: 'kneel', at: 'line:12.word:5', params: { bend: 14 } },
        { clip: 'stand_up', at: 'line:13.word:1', params: { frames: 12 } },
      ],
      walk: [
        { t0: 'line:4.start', path: [[-8.2, 1.5], [-6.6, 2.6], [-5.2, 1.2], [-4.0, 2.2]], speed: 1.75, gait: 'run', face: -55 },
        { t0: 'line:5.start', path: [[-4.0, 2.2], [-2.9, 1.3], [-1.5, 2.5], [-0.2, 1.4], [1.2, 2.4], [2.6, 1.5]], speed: 1.65, gait: 'run', face: -55 },
        { t0: 'line:7.start', path: [[2.6, 1.5], [4.6, 2.1], [6.6, 1.9], [8.3, 2.35]], speed: 1.6, gait: 'run', face: -55 },
      ],
      height: [
        { t: 'line:10.word:4', fall: 0.35, up: 1.5, to: [12.3, 2.7] },
      ],
      look: [
        { t: 0, at: [-8.55, 0.9, 1.98] },
        { t: 'line:1.word:7', at: [-10.2, 2.2, 0.4] },
        { t: 'line:1.word:10', at: [-8.55, 0.9, 1.98] },
        { t: 'line:2.word:2', at: [-7.37, 0.1, 2.1] },
        { t: 'line:4.start', at: [-5.5, 0.2, 1.9] },
        { t: 'line:5.start', at: [-2.2, 0.2, 2.05] },
        { t: 'line:6.start', at: [1.4, 0.2, 2.0] },
        { t: 'line:7.start', at: [5.5, 0.2, 2.0] },
        { t: 'line:8.word:5', at: [9.6, 0.4, 2.45] },
        { t: 'line:9.start', at: [11.2, 2.5, 2.6] },
        { t: 'line:10.start', at: [12.62, 0.8, 2.71] },
        { t: 'line:11.word:10', at: [14.9, 1.75, 3.05] },
        { t: 'line:12.start', at: [14.9, 1.75, 3.05] },
      ],
    },
    bride: {
      face: [
        { t: 0, eyes: 'open', brow: 'up', mouth: 'small-smile' },
        { t: 'line:8.word:5', brow: 'up', mouth: 'o', eyes: 'wide' },
        { t: 'line:11.word:11', eyes: 'happy', mouth: 'D', brow: 'up' },
        { t: 'line:12.word:9', eyes: 'happy', mouth: 'smile' },
      ],
      walk: [
        { t0: 'line:11.word:10', path: [[15.8, 3.4], [14.9, 3.05]], speed: 0.7 },
      ],
      look: [
        { t: 0, at: [6, 1.2, 2.4] },
        { t: 'line:8.start', at: [9.4, 1.0, 2.5] },
        { t: 'line:11.start', at: [12.3, 1.6, 2.7] },
      ],
    },
  },
  props: [
    { id: 'fountain', kind: 'fountain', in: 'world', at: [11.6, 0, 2.6], keys: [
      { t: 0, at: [11.6, 0, 2.6] },
    ] },
    { id: 'grate', kind: 'grate', in: 'world', at: [-2.0, 0, 2.0], keys: [
      { t: 0, at: [-2.0, 0, 2.0] },
    ] },
    { id: 'broom', kind: 'broom', in: 'world', at: [3.1, 0.13, 3.3], keys: [
      { t: 0, at: [3.1, 0.13, 3.3], rot: [0, 0, 90] },
    ] },
    { id: 'pigeon_bump', kind: 'pigeon', in: 'world', at: [-16.5, 5.2, -1.5], keys: [
      { t: 0, at: [-16.5, 5.2, -1.5], rot: [0, 70, 0] },
      { t: 'line:1.word:9-0.1', at: [-9.05, 1.1, 2.0], pass: 0.6, rot: [0, 80, 0] },
      { t: 'line:1.word:10', at: [-7.3, 2.8, 3.8], pass: 0.35, rot: [0, 60, 0] },
      { t: 'line:2.word:4', at: [-4.0, 4.4, 4.8], pass: 0.5, rot: [0, 40, 0] },
      { t: 'line:3.start', in: 'hidden' },
    ] },
    { id: 'pigeon1', kind: 'pigeon', in: 'world', at: [1.0, 0, 1.4], keys: [
      { t: 0, at: [1.0, 0, 1.4], rot: [0, 35, 0] },
    ] },
    { id: 'pigeon2', kind: 'pigeon', in: 'world', at: [1.85, 0, 2.55], keys: [
      { t: 0, at: [1.85, 0, 2.55], rot: [0, -35, 0] },
      { t: 'line:6.word:3', at: [2.35, 0, 3.15], pass: 0.18, rot: [0, -70, 0] },
    ] },
    { id: 'tie', kind: 'tie', in: 'body', owner: 'groom', keys: [
      { t: 0, in: 'body', owner: 'groom' },
      { t: 'line:7.start', in: 'hidden' },
    ] },
    { id: 'tieaskew', kind: 'tieaskew', in: 'hidden', keys: [
      { t: 0, in: 'hidden' },
      { t: 'line:7.start', in: 'body', owner: 'groom' },
    ] },
    { id: 'mudchest', kind: 'mud', in: 'hidden', keys: [
      { t: 0, in: 'hidden', opts: { dx: -0.02, dy: 0.1 } },
      { t: 'line:7.start', in: 'body', owner: 'groom', opts: { dx: -0.02, dy: 0.1 } },
    ] },
    { id: 'mudhip', kind: 'mud', in: 'hidden', keys: [
      { t: 0, in: 'hidden', opts: { dx: 0.16, dy: -0.52 } },
      { t: 'line:7.start', in: 'body', owner: 'groom', opts: { dx: 0.16, dy: -0.52 } },
    ] },
    { id: 'pocketsquare', kind: 'pocketsquare', in: 'body', owner: 'groom', keys: [
      { t: 0, in: 'body', owner: 'groom' },
      { t: 'line:7.word:9', drop: { v0: [-1.4, 1.3, 0.9], g: 3.2, ground: 0.04, hide: false } },
    ] },
    { id: 'splash', kind: 'splash', in: 'hidden', keys: [
      { t: 0, in: 'hidden' },
      { t: 'line:8.word:9+2.56', at: [12.62, 0.8, 2.71] },
      { t: 'line:9.word:4', in: 'hidden', stow: true, sink: 0.15 },
      { t: 'line:10.word:4+0.95', at: [12.3, 0.8, 2.7] },
      { t: 'line:11.word:3', in: 'hidden', stow: true, sink: 0.15 },
    ] },
    { id: 'ring', kind: 'ring', in: 'hand:R', owner: 'groom', keys: [
      { t: 0, in: 'hand:R', owner: 'groom' },
      { t: 'line:2.word:2+0.05', at: [-8.45, 0.9, 1.99], pass: 0.15, rot: [0, 0, -5] },
      { t: 'line:2.word:2+0.3', at: [-7.85, 0.35, 2.05], pass: 0.2, rot: [0, 0, -25] },
      { t: 'line:2.word:2+0.59', at: [-7.37, 0.07, 2.1], rot: [0, 0, -40] },
      { t: 'line:3.word:1', at: [-6.0, 0.07, 1.85], pass: 0.45, rot: [0, 0, -140] },
      { t: 'line:4.word:1', at: [-4.6, 0.07, 2.0], pass: 0.45, rot: [0, 0, -260] },
      { t: 'line:5.word:1', at: [-3.3, 0.07, 2.05], pass: 0.4, rot: [0, 0, -370] },
      { t: 'line:5.word:4', at: [-2.65, 0.07, 2.05], pass: 0.3, rot: [0, 0, -450] },
      { t: 'line:5.word:5+0.18', at: [-2.35, 0.32, 2.05], pass: 0.25, rot: [0, 0, -590] },
      { t: 'line:5.word:5+0.53', at: [-2.0, 0.28, 2.05], pass: 0.25, rot: [0, 0, -625] },
      { t: 'line:5.word:7+0.05', at: [-1.75, 0.07, 2.05], rot: [0, 0, -660] },
      { t: 'line:6.word:1', at: [-0.7, 0.07, 1.8], pass: 0.4, rot: [0, 0, -680] },
      { t: 'line:6.word:3', at: [0.5, 0.07, 2.05], pass: 0.35, rot: [0, 0, -790] },
      { t: 'line:6.word:4', at: [1.35, 0.07, 1.95], pass: 0.3, rot: [0, 0, -880] },
      { t: 'line:6.word:5', at: [2.2, 0.07, 2.2], pass: 0.3, rot: [0, 0, -960] },
      { t: 'line:7.word:1', at: [3.3, 0.07, 1.9], pass: 0.4, rot: [0, 0, -1080] },
      { t: 'line:7.word:5', at: [4.9, 0.07, 2.05], pass: 0.4, rot: [0, 0, -1230] },
      { t: 'line:7.word:9', at: [6.5, 0.07, 1.9], pass: 0.4, rot: [0, 0, -1380] },
      { t: 'line:8.word:1', at: [8.0, 0.07, 2.2], pass: 0.4, rot: [0, 0, -1530] },
      { t: 'line:8.word:5', at: [8.9, 0.18, 2.4], pass: 0.35, rot: [0, 0, -1640] },
      { t: 'line:8.word:7', at: [9.3, 0.34, 2.5], pass: 0.25, rot: [0, 0, -1720] },
      { t: 'line:8.word:9', drop: { from: [9.3, 0.34, 2.5], v0: [1.2, 3.6, 0.1], g: 2.6, ground: 0.8, spin: 200, hide: false } },
      { t: 'line:9.word:3+0.35', at: [12.7, 1.05, 3.1], rot: [-33, 37, 0] },
      { t: 'line:9.end+0.3', at: [12.7, 1.05, 3.1], rot: [-33, 37, 0] },
      { t: 'line:11.word:7', in: 'hand:R', owner: 'groom', pass: 0.2 },
    ] },
  ],
  handovers: [],
  shots: [
    { t0: 0, t1: 'line:1.end', camera: { move: 'push', from: { pos: [-5.9, 2.4, 7.9], target: [-8.55, 1.45, 1.6], fov: 34 }, to: { pos: [-6.3, 2.3, 7.3], target: [-8.55, 1.45, 1.6], fov: 32 } } },
    { t0: 'line:2.start', t1: 'line:2.end', camera: { move: 'push', from: { pos: [-11.0, 1.35, 7.3], target: [-8.1, 0.7, 2.0], fov: 38 }, to: { pos: [-8.8, 1.2, 6.9], target: [-6.6, 0.5, 2.0], fov: 38 } } },
    { t0: 'line:3.start', t1: 'line:3.end', camera: { move: 'park', pos: [-11.0, 5.0, 15.0], target: [-3.5, 0.5, 2.0], fov: 44 } },
    { t0: 'line:4.start', t1: 'line:4.end', camera: { move: 'push', from: { pos: [-11.2, 2.6, 10.5], target: [-7.6, 1.6, 1.8], fov: 38 }, to: { pos: [-6.6, 2.6, 10.5], target: [-3.9, 1.6, 2.0], fov: 38 } } },
    { t0: 'line:5.start', t1: 'line:5.end', camera: { move: 'park', pos: [-4.9, 0.85, 5.4], target: [-2.1, 0.2, 2.02], fov: 35 } },
    { t0: 'line:6.start', t1: 'line:6.end', camera: { move: 'push', from: { pos: [0.6, 1.5, 6.2], target: [0.65, 0.1, 2.0], fov: 42 }, to: { pos: [0.8, 1.5, 6.1], target: [0.8, 0.1, 2.0], fov: 42 } } },
    { t0: 'line:7.start', t1: 'line:7.word:7', camera: { move: 'push', from: { pos: [3.4, 1.5, 6.2], target: [3.45, 0.1, 1.95], fov: 42 }, to: { pos: [3.6, 1.5, 6.1], target: [3.6, 0.1, 1.95], fov: 42 } } },
    { t0: 'line:7.word:7', t1: 'line:7.end', camera: { move: 'push', from: { pos: [6.5, 1.6, 5.4], target: [6.5, 0.1, 1.9], fov: 40 }, to: { pos: [6.7, 1.6, 5.3], target: [6.7, 0.1, 1.9], fov: 40 } } },
    { t0: 'line:8.start', t1: 'line:8.end', camera: { move: 'push', from: { pos: [9.6, 1.96, 5.8], target: [8.3, 0.15, 2.3], fov: 40 }, to: { pos: [9.7, 1.96, 5.7], target: [8.4, 0.15, 2.3], fov: 40 } } },
    { t0: 'line:9.start', t1: 'line:9.end', camera: { move: 'push', from: { pos: [14.2, 2.6, 5.2], target: [12.7, 1.05, 3.1], fov: 38 }, to: { pos: [14.3, 2.6, 5.1], target: [12.8, 1.05, 3.1], fov: 38 } } },
    { t0: 'line:10.start', t1: 'line:10.end', camera: { move: 'push', from: { pos: [12.7, 2.0, 6.2], target: [12.7, 1.05, 3.1], fov: 38 }, to: { pos: [12.8, 2.0, 6.1], target: [12.8, 1.05, 3.1], fov: 38 } } },
    { t0: 'line:11.start', t1: 'line:11.word:9', camera: { move: 'push', from: { pos: [12.7, 2.9, 8.4], target: [12.6, 1.4, 3.0], fov: 44 }, to: { pos: [12.8, 2.9, 8.3], target: [12.7, 1.4, 3.0], fov: 44 } } },
    { t0: 'line:11.word:9', t1: 'line:11.end', camera: { move: 'park', pos: [10.4, 2.7, 11.2], target: [13.7, 1.65, 2.9], fov: 42 } },
    { t0: 'line:12.start', t1: 'line:12.end', camera: { move: 'push', from: { pos: [13.6, 2.8, 14.5], target: [13.6, 1.4, 2.85], fov: 44 }, to: { pos: [13.6, 2.75, 13.8], target: [13.6, 1.4, 2.85], fov: 44 } } },
    { t0: 'line:13.start', t1: 'line:13.end+0.5', camera: { move: 'push', from: { pos: [11.2, 2.5, 10.5], target: [13.6, 1.5, 2.85], fov: 44 }, to: { pos: [13.2, 3.1, 13.2], target: [13.6, 1.5, 2.85], fov: 44 } } },
  ],
  captions: 'words',
};
