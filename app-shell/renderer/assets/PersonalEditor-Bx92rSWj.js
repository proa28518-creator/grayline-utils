import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, a4 as isMac, aB as fmtTime, u as useApp, q as Plus, aC as MonitorPlay, z as Film, br as Camera, b as Trash, T as TriangleAlert, bZ as RotateCw, d as api, bY as Star, w as Save, av as ImagePlus, H as Toggle, ax as Modal, C as Check, o as on, at as CircleCheck, a8 as FolderOpen, aa as Play, b_ as useGoogleState, b$ as useCodexState, az as Scissors, Y as Clapperboard, c0 as reactDomExports, S as Spinner, D as ago, as as ChevronRight, c1 as modelName, c2 as CODEX_MODELS, c3 as CodexOptgroup, c4 as GoogleOptgroup, c5 as runsWithoutClaude, c6 as usableModel, c7 as LogIn, X, ad as StatusBadge, c8 as secs, ay as Undo2, aD as Redo2, ac as Busy, c9 as workingText, ca as withEngine, a9 as Square, cb as Wrench, ae as Clock, ah as usePlaying, b6 as useClockValue, b7 as useClockText, bb as EditorChannel, cc as Cpu, bg as Keyboard, aq as Pause, bs as VolumeX, bt as Volume2, cd as ALT, ce as MOD, aE as ZoomOut, aF as ZoomIn, aG as Maximize2, R as React } from "./index-wX7YC2th.js";
import { F as FileHeadphone, a as ContextMeter, M as Md, T as ToolGroup, S as SendHorizontal } from "./ClaudePanel-D3_P-Q-D.js";
const __iconData = {
  name: "move",
  size: 24,
  node: [
    ["path", { d: "M12 2v20", key: "t6zp3m" }],
    ["path", { d: "m15 19-3 3-3-3", key: "11eu04" }],
    ["path", { d: "m19 9 3 3-3 3", key: "1mg7y2" }],
    ["path", { d: "M2 12h20", key: "9i4pu4" }],
    ["path", { d: "m5 9-3 3 3 3", key: "j64kie" }],
    ["path", { d: "m9 5 3-3 3 3", key: "l8vdw6" }]
  ]
};
__iconData.node;
const Move = createLucideIcon(__iconData);
const XF_DEFAULT = 0.02;
const MIN_CLIP = 0.1;
const EPS = 1e-4;
function emptyEdit() {
  return { version: 1, clips: [], cams: {}, xfade: XF_DEFAULT, signedOff: null, source: "default" };
}
const continues = (a, b) => !!b && a.src === b.src && Math.abs(b.in - a.out) < EPS;
function layoutTimeline(edit, media) {
  const XF = edit.xfade ?? XF_DEFAULT, byId = new Map(media.map((m) => [m.id, m]));
  const segs = [];
  let o = 0;
  edit.clips.forEach((c, i) => {
    const next = edit.clips[i + 1], cutAfter = !!next && !continues(c, next);
    const vis = Math.max(1e-3, c.out - c.in - (cutAfter ? XF : 0));
    const role = byId.get(c.src)?.role ?? "other";
    segs.push({ clip: c, index: i, start: o, end: o + vis, cutAfter, role, cam: role === "screen" ? pickCam(edit, c) : null });
    o += vis;
  });
  return { segs, duration: o };
}
function pickCam(edit, c) {
  let best = null, bestOv = 0;
  for (const [id, s] of Object.entries(edit.cams || {})) {
    const ov = Math.min(c.out, s.end) - Math.max(c.in, s.start);
    if (ov > bestOv) {
      bestOv = ov;
      best = id;
    }
  }
  return best;
}
const camTime = (s, screenTime) => (screenTime - s.c) / (1 + s.m);
const covers = (s, screenTime) => screenTime >= s.start - EPS && screenTime <= s.end + EPS;
function segIndexAt(segs, t) {
  let lo = 0, hi = segs.length - 1;
  if (hi < 0) return -1;
  if (t >= segs[hi].start) return hi;
  while (lo < hi) {
    const mid = lo + hi + 1 >> 1;
    if (segs[mid].start <= t) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}
const srcTimeAt = (seg, t) => seg.clip.in + (t - seg.start);
let n = 0;
const clipId = () => "c" + Date.now().toString(36) + (n++).toString(36);
const tidy = (clips) => clips.filter((c) => c.out - c.in >= MIN_CLIP);
function split(edit, media, t) {
  const { segs } = layoutTimeline(edit, media), i = segIndexAt(segs, t);
  if (i < 0) return null;
  const sg = segs[i], s = srcTimeAt(sg, t);
  if (s - sg.clip.in < MIN_CLIP || sg.clip.in + (sg.end - sg.start) - s < MIN_CLIP) return null;
  const clips = edit.clips.slice();
  clips.splice(i, 1, { ...sg.clip, out: s }, { ...sg.clip, id: clipId(), in: s });
  return clips;
}
function rippleBefore(edit, media, t) {
  const r = rippleBeforeRaw(edit, media, t);
  if (!r) return null;
  return { clips: r.clips, t: layoutTimeline({ ...edit, clips: r.clips }, media).segs[r.index]?.start ?? 0 };
}
function rippleBeforeRaw(edit, media, t) {
  const { segs } = layoutTimeline(edit, media), i = segIndexAt(segs, t);
  if (i < 0) return null;
  const sg = segs[i], s = srcTimeAt(sg, t);
  if (s - sg.clip.in < 0.01) return null;
  const clips = edit.clips.slice();
  clips[i] = { ...sg.clip, in: s };
  return { clips: tidy(clips), index: i };
}
function rippleAfter(edit, media, t) {
  const r = rippleAfterRaw(edit, media, t);
  if (!r) return null;
  const seg = layoutTimeline({ ...edit, clips: r.clips }, media).segs[r.index];
  return { clips: r.clips, t: seg ? seg.end : t };
}
function rippleAfterRaw(edit, media, t) {
  const { segs } = layoutTimeline(edit, media), i = segIndexAt(segs, t);
  if (i < 0) return null;
  const sg = segs[i], s = srcTimeAt(sg, t);
  if (sg.end - t < 0.01) return null;
  const clips = edit.clips.slice(), last = i === clips.length - 1;
  clips[i] = { ...sg.clip, out: last ? s : Math.min(sg.clip.out, s + (edit.xfade ?? XF_DEFAULT)) };
  if (clips[i].out - clips[i].in < MIN_CLIP) {
    clips.splice(i, 1);
    return { clips, index: Math.max(0, i - 1) };
  }
  return { clips, index: i };
}
function removeClip(edit, index) {
  return edit.clips.filter((_, i) => i !== index);
}
function trimClip(edit, index, side, value, sourceDuration) {
  const clips = edit.clips.slice(), c = { ...clips[index] };
  if (side === "in") c.in = Math.max(0, Math.min(value, c.out - MIN_CLIP));
  else c.out = Math.min(sourceDuration, Math.max(value, c.in + MIN_CLIP));
  clips[index] = c;
  return clips;
}
function camCrop(vw, vh, bw, bh, zoom, fx, fy) {
  const a = bw / bh;
  let cw = vw, ch = vw / a;
  if (ch > vh) {
    ch = vh;
    cw = vh * a;
  }
  cw /= zoom;
  ch /= zoom;
  const cx = Math.min(vw - cw / 2, Math.max(cw / 2, fx * vw)), cy = Math.min(vh - ch / 2, Math.max(ch / 2, fy * vh));
  return { sx: cx - cw / 2, sy: cy - ch / 2, sw: cw, sh: ch };
}
const srcSize = (s) => !s ? [0, 0] : s instanceof HTMLVideoElement ? [s.videoWidth, s.videoHeight] : s instanceof HTMLImageElement ? [s.naturalWidth, s.naturalHeight] : [s.width, s.height];
const boxPx = (b, W, H) => ({ x: b.x * W, y: b.y * H, w: b.w * W, h: b.h * H, r: b.radius * H / 1080 });
function drawBackground(ctx, W, H, L, bg) {
  ctx.fillStyle = L.background.color;
  ctx.fillRect(0, 0, W, H);
  if (bg && bg.naturalWidth) {
    const s = Math.max(W / bg.naturalWidth, H / bg.naturalHeight), w = bg.naturalWidth * s, h = bg.naturalHeight * s;
    ctx.save();
    if (L.background.blur) ctx.filter = `blur(${L.background.blur * H / 1080}px)`;
    const m = L.background.blur ? L.background.blur * H / 1080 * 2 : 0;
    ctx.drawImage(bg, (W - w) / 2 - m, (H - h) / 2 - m, w + 2 * m, h + 2 * m);
    ctx.restore();
  }
  if (L.background.dim) {
    ctx.fillStyle = `rgba(0,0,0,${L.background.dim})`;
    ctx.fillRect(0, 0, W, H);
  }
}
function drawShadow(ctx, b, strength, H) {
  if (strength <= 0) return;
  const s = H / 1080;
  ctx.save();
  ctx.shadowColor = `rgba(0,0,0,${0.62 * strength})`;
  ctx.shadowBlur = 46 * s;
  ctx.shadowOffsetY = 14 * s;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.roundRect(b.x, b.y, b.w, b.h, b.r);
  ctx.fill();
  ctx.restore();
}
function drawInBox(ctx, src, b, fit, crop) {
  const [vw, vh] = srcSize(src);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(b.x, b.y, b.w, b.h, b.r);
  ctx.clip();
  if (!src || !vw || !vh) {
    ctx.fillStyle = "#000";
    ctx.fillRect(b.x, b.y, b.w, b.h);
  }
  if (src && vw && vh) {
    if (crop) {
      const c = camCrop(vw, vh, b.w, b.h, crop.zoom, crop.fx, crop.fy);
      ctx.drawImage(src, c.sx, c.sy, c.sw, c.sh, b.x, b.y, b.w, b.h);
    } else {
      const s = fit === "cover" ? Math.max(b.w / vw, b.h / vh) : Math.min(b.w / vw, b.h / vh), w = vw * s, h = vh * s;
      if (w < b.w - 0.5 || h < b.h - 0.5) {
        ctx.fillStyle = "#000";
        ctx.fillRect(b.x, b.y, b.w, b.h);
      }
      ctx.drawImage(src, b.x + (b.w - w) / 2, b.y + (b.h - h) / 2, w, h);
    }
  }
  ctx.restore();
}
function placeholder(ctx, b, label2, H) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(b.x, b.y, b.w, b.h, b.r);
  ctx.clip();
  const g = ctx.createLinearGradient(b.x, b.y, b.x + b.w, b.y + b.h);
  g.addColorStop(0, "#2a2a2e");
  g.addColorStop(1, "#1b1b1e");
  ctx.fillStyle = g;
  ctx.fillRect(b.x, b.y, b.w, b.h);
  ctx.fillStyle = "#8a8a90";
  ctx.font = `500 ${Math.max(11, 20 * H / 1080)}px Inter, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label2, b.x + b.w / 2, b.y + b.h / 2);
  ctx.restore();
}
function drawFrame(ctx, W, H, L, bg, f) {
  if (f.mode === "full") {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    if (f.full) drawInBox(ctx, f.full, { x: 0, y: 0, w: W, h: H, r: 0 }, "contain");
    return;
  }
  drawBackground(ctx, W, H, L, bg);
  const sb = boxPx(L.screen, W, H), cb = boxPx(L.cam, W, H);
  drawShadow(ctx, sb, L.screen.shadow, H);
  if (f.screen || !f.placeholders) drawInBox(ctx, f.screen, sb, L.screen.fit);
  else placeholder(ctx, sb, "Screen recording", H);
  if (L.cam.visible && (f.cam || f.placeholders)) {
    drawShadow(ctx, cb, L.cam.shadow, H);
    if (f.cam) drawInBox(ctx, f.cam, cb, "cover", { zoom: L.cam.zoom, fx: L.cam.focusX, fy: L.cam.focusY });
    else placeholder(ctx, cb, "Facecam", H);
  }
}
function renderAssets(L, bg, W, H) {
  const even = (v) => Math.max(2, Math.round(v / 2) * 2);
  const px = (b) => {
    const p = boxPx(b, W, H);
    return { x: Math.round(p.x), y: Math.round(p.y), w: even(p.w), h: even(p.h), r: p.r };
  };
  const sb = px(L.screen), cb = px(L.cam);
  const base = document.createElement("canvas");
  base.width = W;
  base.height = H;
  const bx = base.getContext("2d");
  drawBackground(bx, W, H, L, bg);
  drawShadow(bx, sb, L.screen.shadow, H);
  if (L.cam.visible) drawShadow(bx, cb, L.cam.shadow, H);
  const mask = (b) => {
    const c = document.createElement("canvas");
    c.width = b.w;
    c.height = b.h;
    const x = c.getContext("2d");
    x.fillStyle = "#fff";
    x.beginPath();
    x.roundRect(0, 0, b.w, b.h, b.r);
    x.fill();
    return c.toDataURL("image/png");
  };
  return {
    W,
    H,
    base: base.toDataURL("image/png"),
    screenMask: mask(sb),
    camMask: mask(cb),
    screen: sb,
    cam: cb,
    camVisible: L.cam.visible,
    screenFit: L.screen.fit,
    camCrop: { zoom: L.cam.zoom, fx: L.cam.focusX, fy: L.cam.focusY }
  };
}
let onPlayError = () => {
};
const setPlayErrorHandler = (fn) => {
  onPlayError = fn;
};
class PersonalEngine {
  constructor(canvas, clock) {
    this.canvas = canvas;
    this.clock = clock;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.offs.push(clock.onPlaying((p) => p ? this.play() : this.pause()), clock.on((t) => {
      if (!this.internal && !this.playing) this.seek(t);
    }));
    const loop = () => {
      this.raf = requestAnimationFrame(loop);
      this.tick();
    };
    this.raf = requestAnimationFrame(loop);
  }
  canvas;
  clock;
  ctx;
  edit = { version: 1, clips: [], cams: {}, xfade: XF_DEFAULT, signedOff: null };
  media = /* @__PURE__ */ new Map();
  layout = null;
  bg = null;
  segs = [];
  duration = 0;
  slot = [];
  camSlot = [];
  pool = /* @__PURE__ */ new Map();
  cur = -1;
  raf = 0;
  playing = false;
  dirty = true;
  internal = false;
  fades = [];
  offs = [];
  volume = 1;
  muted = false;
  rate = 1;
  /** frames drawn / cuts crossed while playing (tests read these) */
  stats = { frames: 0, cuts: 0, lastCutError: 0, maxCutError: 0, blankScreen: 0, blankCam: 0, camSeeks: 0, maxCamOff: 0, held: 0, blankStill: 0, seeked: 0 };
  destroy() {
    cancelAnimationFrame(this.raf);
    this.offs.forEach((f) => f());
    for (const els of this.pool.values()) for (const el of els) {
      el.pause();
      el.removeAttribute("src");
      el.load();
    }
    this.pool.clear();
  }
  setData(edit, media, layout, bg) {
    const was = this.playing;
    if (was) this.pauseElements();
    this.edit = edit;
    this.layout = layout;
    this.bg = bg;
    const old = this.media;
    this.media = new Map(media.map((m) => [m.id, m]));
    for (const [id, els] of this.pool) {
      const m = this.media.get(id);
      if (!m?.url || old.get(id)?.url !== m.url) {
        els.forEach((e) => {
          e.pause();
          e.removeAttribute("src");
          e.load();
        });
        this.pool.delete(id);
      }
    }
    const { segs, duration } = layoutTimeline(edit, media);
    this.segs = segs;
    this.duration = duration;
    this.clock.end = duration;
    this.slot = segs.map(() => 0);
    this.camSlot = segs.map(() => 0);
    for (let i = 1; i < segs.length; i++) {
      const a = segs[i - 1].clip, b = segs[i].clip;
      this.slot[i] = continues(a, b) ? this.slot[i - 1] : a.src === b.src ? 1 - this.slot[i - 1] : 0;
      this.camSlot[i] = segs[i].cam && segs[i].cam === segs[i - 1].cam ? continues(a, b) ? this.camSlot[i - 1] : 1 - this.camSlot[i - 1] : 0;
    }
    this.cur = -1;
    if (this.clock.t > duration) this.clock.set(duration);
    this.seek(this.clock.t);
    if (was) this.play();
    this.dirty = true;
  }
  /** What is showing right now (tests and the status line). */
  state() {
    const s = this.segs[this.cur], el = this.segEl(this.cur), ce = this.camEl(this.cur), src = s ? s.clip.in + (this.clock.t - s.start) : null;
    return { cur: this.cur, t: this.clock.t, src, el: el?.currentTime ?? null, cam: s?.cam ?? null, camWant: s && src !== null ? this.camTarget(this.cur, src) : null, camEl: ce?.currentTime ?? null, playing: this.playing, stats: this.stats };
  }
  setLayout(layout, bg) {
    this.layout = layout;
    this.bg = bg;
    this.dirty = true;
  }
  setVolume(v, muted) {
    this.volume = v;
    this.muted = muted;
    this.applyVolumes();
  }
  setRate(r) {
    this.rate = r;
    for (const els of this.pool.values()) els.forEach((e) => e.playbackRate = r);
  }
  redraw() {
    this.dirty = true;
  }
  failed = /* @__PURE__ */ new Set();
  el(id, slot) {
    const m = this.media.get(id);
    if (!m?.url) return null;
    let els = this.pool.get(id);
    if (!els) {
      els = [0, 1].map(() => {
        const v = document.createElement("video");
        v.preload = "auto";
        v.playsInline = true;
        v.muted = m.role === "facecam";
        v.src = m.url;
        v.playbackRate = this.rate;
        v.addEventListener("seeked", () => {
          this.dirty = true;
          this.stats.seeked++;
          const p = this.pending.get(v);
          if (p !== void 0) {
            this.pending.delete(v);
            if (Math.abs(v.currentTime - p) > 2e-3) {
              try {
                v.currentTime = p;
              } catch {
              }
            }
          }
        });
        v.addEventListener("loadeddata", () => {
          this.dirty = true;
        });
        v.addEventListener("error", () => {
          if (!this.failed.has(id)) {
            this.failed.add(id);
            onPlayError(id, v.error?.message || `media error ${v.error?.code ?? ""}`);
          }
        });
        return v;
      });
      this.pool.set(id, els);
    }
    return els[slot];
  }
  segEl(i) {
    const s = this.segs[i];
    return s ? this.el(s.clip.src, this.slot[i]) : null;
  }
  camEl(i) {
    const s = this.segs[i];
    return s?.cam ? this.el(s.cam, this.camSlot[i]) : null;
  }
  camTarget(i, screenT) {
    const s = this.segs[i], sync = s?.cam ? this.edit.cams[s.cam] : null;
    return sync && covers(sync, screenT) ? camTime(sync, screenT) : null;
  }
  // one seek at a time per element: while one runs, only the newest target is kept and started when it lands, so a fast
  // scrub shows a stream of real frames instead of queueing seeks the decoder can't finish
  pending = /* @__PURE__ */ new Map();
  setTime(el, t, tol = 2e-3) {
    t = Math.max(0, t);
    if (el.seeking) {
      this.pending.set(el, t);
      return;
    }
    this.pending.delete(el);
    if (Math.abs(el.currentTime - t) > tol) {
      try {
        el.currentTime = t;
      } catch {
      }
    }
  }
  /** Park everything for timeline time t (paused): the clip's frame, the facecam frame, the next clip preloaded. */
  seek(t) {
    const i = segIndexAt(this.segs, t);
    this.cur = i;
    if (i < 0) {
      this.dirty = true;
      return;
    }
    const s = this.segs[i], src = srcTimeAt(s, Math.min(t, s.end)), el = this.segEl(i);
    if (el) this.setTime(el, src);
    const ce = this.camEl(i), ct = this.camTarget(i, src);
    if (ce && ct !== null) this.setTime(ce, ct, 0.01);
    this.preload(i + 1);
    this.dirty = true;
  }
  preload(i) {
    const s = this.segs[i];
    if (!s) return;
    const el = this.segEl(i);
    if (el && el !== this.segEl(i - 1) && el.paused) this.setTime(el, s.clip.in);
    const ce = this.camEl(i), ct = this.camTarget(i, s.clip.in);
    if (ce && ce !== this.camEl(i - 1) && ce.paused && ct !== null) this.setTime(ce, ct, 0.01);
  }
  applyVolumes() {
    const v = this.muted ? 0 : this.volume;
    for (const [id, els] of this.pool) if (this.media.get(id)?.role !== "facecam") els.forEach((e) => {
      if (!this.fades.some((f) => f.el === e)) e.volume = v;
    });
  }
  play() {
    if (this.playing || !this.segs.length) return;
    if (this.clock.t >= this.duration - 0.01) this.clock.set(0);
    this.seek(this.clock.t);
    const el = this.segEl(this.cur);
    if (!el) return;
    this.playing = true;
    this.fades = [];
    el.volume = this.muted ? 0 : this.volume;
    el.play().catch(() => {
    });
    const ce = this.camEl(this.cur);
    if (ce && this.camTarget(this.cur, srcTimeAt(this.segs[this.cur], this.clock.t)) !== null) ce.play().catch(() => {
    });
  }
  pauseElements() {
    for (const els of this.pool.values()) els.forEach((e) => e.pause());
    this.fades = [];
  }
  pause() {
    if (!this.playing) return;
    this.playing = false;
    this.pauseElements();
    this.applyVolumes();
    this.seek(this.clock.t);
  }
  fade(el, from, to, dur, pauseAtEnd = false) {
    this.fades = this.fades.filter((f) => f.el !== el);
    el.volume = Math.max(0, Math.min(1, from));
    this.fades.push({ el, from, to, t0: performance.now(), dur: Math.max(1, dur * 1e3), pauseAtEnd });
  }
  runFades(now) {
    this.fades = this.fades.filter((f) => {
      const k = Math.min(1, (now - f.t0) / f.dur), g = f.to > f.from ? Math.sin(k * Math.PI / 2) : Math.cos(k * Math.PI / 2);
      f.el.volume = Math.max(0, Math.min(1, f.from + (f.to - f.from) * (f.to > f.from ? g : 1 - g)));
      if (k >= 1 && f.pauseAtEnd) f.el.pause();
      return k < 1;
    });
  }
  tick() {
    const now = performance.now();
    if (this.playing) {
      this.runFades(now);
      let s = this.segs[this.cur], el = this.segEl(this.cur);
      if (!s || !el) {
        this.clock.setPlaying(false);
        return;
      }
      let t = s.start + (el.currentTime - s.clip.in);
      while (s && (t >= s.end - 5e-4 || el.ended)) {
        const n2 = this.cur + 1, ns = this.segs[n2];
        if (!ns) {
          this.pauseElements();
          this.internal = true;
          this.clock.set(this.duration);
          this.internal = false;
          this.clock.setPlaying(false);
          return;
        }
        const nel = this.segEl(n2), ce2 = this.camEl(this.cur), nce = this.camEl(n2);
        const err = t - s.end;
        this.stats.lastCutError = err;
        this.stats.maxCutError = Math.max(this.stats.maxCutError, Math.abs(err));
        this.stats.cuts++;
        if (nel !== el) {
          this.setTime(nel, ns.clip.in, 0.03);
          const v = this.muted ? 0 : this.volume, xf = s.cutAfter ? this.edit.xfade ?? XF_DEFAULT : 0;
          if (xf > 0 && this.media.get(s.clip.src)?.audio) {
            this.fade(el, el.volume, 0, xf, true);
            this.fade(nel, 0, v, xf);
          } else {
            el.pause();
            nel.volume = v;
          }
          nel.play().catch(() => {
          });
        }
        if (nce && nce !== ce2) {
          const ct2 = this.camTarget(n2, ns.clip.in);
          if (ct2 !== null) {
            this.setTime(nce, ct2, 0.03);
            nce.play().catch(() => {
            });
          }
        }
        if (ce2 && ce2 !== nce) ce2.pause();
        this.cur = n2;
        s = ns;
        el = nel;
        t = s.start + Math.max(0, el.currentTime - s.clip.in);
        this.preload(n2 + 1);
      }
      this.preload(this.cur + 1);
      const ce = this.camEl(this.cur), ct = this.camTarget(this.cur, s.clip.in + (t - s.start));
      if (ce) {
        if (ct === null) {
          if (!ce.paused) ce.pause();
        } else {
          if (ce.paused) ce.play().catch(() => {
          });
          const off = ce.currentTime - ct;
          if (!ce.seeking) this.stats.maxCamOff = Math.max(this.stats.maxCamOff, Math.abs(off));
          if (Math.abs(off) > 0.5 && !ce.seeking) {
            this.stats.camSeeks++;
            this.setTime(ce, ct, 0.01);
            ce.playbackRate = this.rate;
          } else {
            const r = Math.abs(off) < 0.015 ? this.rate : this.rate * (1 - Math.max(-0.12, Math.min(0.12, off * 1.5)));
            if (Math.abs(ce.playbackRate - r) > 4e-3) ce.playbackRate = r;
          }
        }
      }
      this.internal = true;
      this.clock.set(Math.min(t, this.duration));
      this.internal = false;
      this.dirty = true;
    }
    if (this.dirty) {
      this.dirty = false;
      this.draw(now);
    }
  }
  waitSince = 0;
  // the last good frame of each layer, kept small (the preview never shows more): what a layer shows while it seeks
  hold = {
    screen: { c: document.createElement("canvas"), ok: false },
    cam: { c: document.createElement("canvas"), ok: false },
    full: { c: document.createElement("canvas"), ok: false }
  };
  layer(k, v) {
    const h = this.hold[k];
    if (v && v.videoWidth) {
      const max = k === "cam" ? 1080 : 1920, f = Math.min(1, max / v.videoWidth), w = Math.round(v.videoWidth * f), hh = Math.round(v.videoHeight * f);
      if (h.c.width !== w || h.c.height !== hh) {
        h.c.width = w;
        h.c.height = hh;
      }
      h.c.getContext("2d").drawImage(v, 0, 0, w, hh);
      h.ok = true;
      return v;
    }
    return h.ok ? h.c : null;
  }
  /** tests: set to [] to record every drawn frame's facecam state */
  trace = null;
  draw(now = performance.now()) {
    const c = this.canvas, W = c.width, H = c.height;
    if (!W || !H) return;
    const i = this.cur, s = this.segs[i], L = this.layout;
    if (!L) {
      this.ctx.fillStyle = "#111";
      this.ctx.fillRect(0, 0, W, H);
      return;
    }
    if (!s) {
      drawFrame(this.ctx, W, H, L, this.bg, { mode: "layout", screen: null, cam: null, placeholders: true });
      return;
    }
    const el = this.segEl(i), ok = (v) => !!v && v.readyState >= 2 && !v.seeking, ready = (v) => ok(v) ? v : null;
    const src = s.clip.in + (this.clock.t - s.start), ce = s.role === "screen" ? this.camEl(i) : null, showCam = !!ce && this.camTarget(i, src) !== null;
    const has = !!this.media.get(s.clip.src)?.url;
    if (!this.playing && has) {
      const scr = this.layer(s.role === "screen" ? "screen" : "full", ok(el) ? el : null), cam = showCam ? this.layer("cam", ok(ce) ? ce : null) : null;
      if (scr && (!showCam || cam)) {
        if (!ok(el) || showCam && !ok(ce)) {
          this.dirty = true;
          this.stats.held++;
        }
        if (s.role === "screen") drawFrame(this.ctx, W, H, L, this.bg, { mode: "layout", screen: scr, cam, placeholders: false });
        else drawFrame(this.ctx, W, H, L, this.bg, { mode: "full", screen: null, cam: null, full: scr });
        this.stats.frames++;
        this.waitSince = 0;
        return;
      }
    }
    if (has && (!ok(el) || showCam && !ok(ce))) {
      if (!this.waitSince) this.waitSince = now;
      const working = !!el?.seeking || !!ce?.seeking || el?.networkState === 2 && (el?.readyState ?? 0) < 2;
      if (working || now - this.waitSince < 1500) {
        this.dirty = true;
        this.stats.held++;
        return;
      }
    } else this.waitSince = 0;
    if (has && !ok(el)) this.stats[this.playing ? "blankScreen" : "blankStill"]++;
    if (showCam && !ok(ce)) this.stats[this.playing ? "blankCam" : "blankStill"]++;
    if (s.role === "screen") drawFrame(this.ctx, W, H, L, this.bg, { mode: "layout", screen: ready(el), cam: showCam ? ready(ce) : null, placeholders: !has });
    else drawFrame(this.ctx, W, H, L, this.bg, { mode: "full", screen: null, cam: null, full: ready(el) });
    this.stats.frames++;
    if (this.trace && this.playing && s.role === "screen" && L.cam.visible)
      this.trace.push({ at: now, t: this.clock.t, seg: i, cam: showCam ? s.cam : null, el: ce ? this.pool.get(s.cam)?.indexOf(ce) ?? -1 : -1, ct: ce?.currentTime ?? null, want: showCam ? this.camTarget(i, src) : null, rate: ce?.playbackRate ?? null });
  }
}
const RULER = 24, CLIP_Y = 30, CLIP_H = 58, CAM_Y = 94, CAM_H = 20, WAVE_Y = 120, EDGE = 7;
const COL = {
  bg: "#191919",
  lane: "#1e1e1e",
  screen: "#2f3b49",
  screenHi: "#3f5063",
  intro: "#4a3860",
  introHi: "#5d4778",
  other: "#3a3a3a",
  sel: "#dfe7ef",
  cam: "#3b5646",
  camTxt: "#a9c9b6",
  wave: "#5f7f9b",
  waveIntro: "#8a6fae",
  text: "#c9d2dc",
  dim: "#7a7a7a",
  head: "#f2f2f2"
};
const PTimeline = reactExports.forwardRef(function PTimeline2(p, ref) {
  const wrap = reactExports.useRef(null), cv = reactExports.useRef(null);
  const v = reactExports.useRef({ pps: 40, sx: 0, w: 800, h: 190, dirty: true, fitted: false, drag: null, hover: -1 });
  const P = reactExports.useRef(p);
  P.current = p;
  window.__ptl = v.current;
  const xOf = (t) => (t - v.current.sx) * v.current.pps, tOf = (x) => v.current.sx + x / v.current.pps;
  const clampSx = () => {
    const s = v.current, maxS = Math.max(0, P.current.duration - s.w / s.pps * 0.9);
    s.sx = Math.min(maxS, Math.max(0, s.sx));
  };
  const fit = () => {
    const s = v.current;
    s.pps = Math.max(0.5, (s.w - 24) / Math.max(1, P.current.duration));
    s.sx = 0;
    s.dirty = true;
  };
  reactExports.useImperativeHandle(ref, () => ({
    fit,
    zoom(f) {
      const s = v.current, t = P.current.clock.t, x = xOf(t);
      s.pps = Math.min(2e3, Math.max(0.5, s.pps * f));
      s.sx = t - x / s.pps;
      clampSx();
      s.dirty = true;
    },
    reveal(t) {
      const s = v.current, x = xOf(t);
      if (x < 40 || x > s.w - 40) {
        s.sx = t - s.w * 0.3 / s.pps;
        clampSx();
        s.dirty = true;
      }
    }
  }));
  reactExports.useEffect(() => {
    v.current.dirty = true;
    if (!v.current.fitted && p.duration > 0) {
      v.current.fitted = true;
      fit();
    }
  }, [p.segs, p.duration, p.selected, p.waves, p.edit]);
  reactExports.useEffect(() => {
    const s = v.current;
    const off = p.clock.on((t) => {
      s.dirty = true;
      if (p.clock.playing) {
        const x = xOf(t);
        if (x > s.w * 0.92 || x < 0) {
          s.sx = t - s.w * 0.08 / s.pps;
          clampSx();
        }
      }
    });
    const ro = new ResizeObserver(() => {
      const r = cv.current.getBoundingClientRect();
      s.w = r.width;
      s.h = r.height;
      const d = devicePixelRatio;
      cv.current.width = Math.round(r.width * d);
      cv.current.height = Math.round(r.height * d);
      s.dirty = true;
    });
    ro.observe(cv.current);
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (s.dirty) {
        s.dirty = false;
        draw();
      }
    };
    raf = requestAnimationFrame(loop);
    const wheel = (e) => {
      e.preventDefault();
      const r = cv.current.getBoundingClientRect(), x = e.clientX - r.left;
      if (e.altKey || e.ctrlKey || e.metaKey) {
        const t = tOf(x);
        const dy = e.deltaY || e.deltaX;
        s.pps = Math.min(2e3, Math.max(0.5, s.pps * Math.exp(-dy * 22e-4)));
        s.sx = t - x / s.pps;
      } else s.sx += (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) / s.pps;
      clampSx();
      s.dirty = true;
    };
    cv.current.addEventListener("wheel", wheel, { passive: false });
    const noAuto = (e) => {
      if (e.button === 1) e.preventDefault();
    };
    cv.current.addEventListener("mousedown", noAuto);
    cv.current.addEventListener("auxclick", noAuto);
    return () => {
      off();
      ro.disconnect();
      cancelAnimationFrame(raf);
      cv.current?.removeEventListener("wheel", wheel);
      cv.current?.removeEventListener("mousedown", noAuto);
      cv.current?.removeEventListener("auxclick", noAuto);
    };
  }, [p.clock]);
  const hit = (x, y) => {
    const { segs } = P.current;
    if (y < CLIP_Y || y > CLIP_Y + CLIP_H) return null;
    for (let i = 0; i < segs.length; i++) {
      const a = xOf(segs[i].start), b = xOf(segs[i].end);
      if (x >= a - EDGE && x <= b + EDGE) {
        if (Math.abs(x - a) <= EDGE && (i === 0 || x <= a)) return { i, edge: "in" };
        if (Math.abs(x - b) <= EDGE && (i === segs.length - 1 || x >= b)) return { i, edge: "out" };
        if (x >= a && x <= b) return { i, edge: null };
      }
    }
    return null;
  };
  const down = (e) => {
    const r = cv.current.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, s = v.current, h = hit(x, y);
    e.target.setPointerCapture(e.pointerId);
    if (e.button === 1) {
      e.preventDefault();
      s.drag = { mode: "pan", x0: x, v0: s.sx };
      cv.current.style.cursor = "grabbing";
      return;
    }
    if (e.button !== 0) return;
    if (h?.edge) {
      const c = P.current.segs[h.i].clip;
      s.drag = { mode: "trim", i: h.i, side: h.edge, x0: x, v0: h.edge === "in" ? c.in : c.out };
      P.current.onSelect(h.i);
      return;
    }
    if (h) P.current.onSelect(h.i);
    else if (y >= CLIP_Y) P.current.onSelect(null);
    s.drag = { mode: "scrub" };
    P.current.clock.setPlaying(false);
    P.current.clock.set(Math.max(0, Math.min(P.current.duration, tOf(x))));
  };
  const move = (e) => {
    const r = cv.current.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, s = v.current;
    if (!s.drag) {
      const h = hit(x, y);
      cv.current.style.cursor = h?.edge ? "ew-resize" : "default";
      return;
    }
    if (s.drag.mode === "pan") {
      s.sx = s.drag.v0 - (x - s.drag.x0) / s.pps;
      clampSx();
      s.dirty = true;
      return;
    }
    if (s.drag.mode === "scrub") P.current.clock.set(Math.max(0, Math.min(P.current.duration, tOf(x))));
    else P.current.onTrim(s.drag.i, s.drag.side, s.drag.v0 + (x - s.drag.x0) / s.pps, false);
  };
  const up = (e) => {
    const s = v.current, d = s.drag;
    s.drag = null;
    if (d?.mode === "pan") cv.current.style.cursor = "default";
    if (d?.mode === "trim") {
      const r = cv.current.getBoundingClientRect();
      P.current.onTrim(d.i, d.side, d.v0 + (e.clientX - r.left - d.x0) / s.pps, true);
    }
  };
  function draw() {
    const c = cv.current;
    if (!c) return;
    const g = c.getContext("2d"), d = devicePixelRatio, s = v.current, { segs, duration, waves, selected, edit, names } = P.current;
    g.setTransform(d, 0, 0, d, 0, 0);
    g.fillStyle = COL.bg;
    g.fillRect(0, 0, s.w, s.h);
    g.fillStyle = COL.lane;
    g.fillRect(0, CLIP_Y, s.w, CLIP_H);
    g.fillRect(0, CAM_Y, s.w, CAM_H);
    g.fillRect(0, WAVE_Y, s.w, s.h - WAVE_Y - 4);
    const steps = [0.1, 0.25, 0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300, 600], step = steps.find((x) => x * s.pps >= 70) ?? 1200;
    g.font = "10px Inter, Arial, sans-serif";
    g.textBaseline = "middle";
    g.fillStyle = COL.dim;
    g.strokeStyle = "#333";
    g.lineWidth = 1;
    for (let t = Math.floor(s.sx / step) * step; t < tOf(s.w); t += step) {
      const x = Math.round(xOf(t)) + 0.5;
      if (x < 0) continue;
      g.beginPath();
      g.moveTo(x, 14);
      g.lineTo(x, RULER);
      g.stroke();
      g.fillText(fmtTime(t, step < 1 ? 2 : 0), x + 4, 9);
    }
    const x0 = Math.max(0, xOf(0)), x1 = Math.min(s.w, xOf(duration));
    for (let i = 0; i < segs.length; i++) {
      const sg = segs[i], a = xOf(sg.start), b = xOf(sg.end);
      if (b < 0 || a > s.w) continue;
      const intro = sg.role === "intro", w = Math.max(1, b - a - 1);
      g.fillStyle = selected === i ? intro ? COL.introHi : COL.screenHi : intro ? COL.intro : sg.role === "screen" ? COL.screen : COL.other;
      g.beginPath();
      g.roundRect(a + 0.5, CLIP_Y + 2, w, CLIP_H - 4, 5);
      g.fill();
      if (selected === i) {
        g.strokeStyle = COL.sel;
        g.lineWidth = 1.5;
        g.stroke();
      }
      if (w > 46) {
        g.save();
        g.beginPath();
        g.rect(a + 4, CLIP_Y, w - 8, CLIP_H);
        g.clip();
        g.fillStyle = COL.text;
        g.font = "500 11px Inter, Arial, sans-serif";
        g.fillText(intro ? "Intro" : names[sg.clip.src] || "Clip", a + 8, CLIP_Y + 16);
        g.fillStyle = COL.dim;
        g.font = "10px Inter, Arial, sans-serif";
        g.fillText(`${fmtTime(sg.clip.in, 1)}–${fmtTime(sg.clip.out, 1)}`, a + 8, CLIP_Y + 32);
        g.restore();
      }
      if (sg.role === "screen") {
        if (sg.cam) {
          g.fillStyle = COL.cam;
          g.fillRect(a + 0.5, CAM_Y + 2, w, CAM_H - 4);
          if (w > 60) {
            g.fillStyle = COL.camTxt;
            g.font = "10px Inter, Arial, sans-serif";
            g.fillText(names[sg.cam] || "Facecam", a + 6, CAM_Y + CAM_H / 2);
          }
        } else {
          g.fillStyle = "#2a2020";
          g.fillRect(a + 0.5, CAM_Y + 2, w, CAM_H - 4);
        }
      }
      const wv = waves[sg.clip.src];
      if (wv && wv.peaks.length) {
        const mid = WAVE_Y + (s.h - WAVE_Y - 4) / 2, amp = (s.h - WAVE_Y - 10) / 2;
        g.fillStyle = intro ? COL.waveIntro : COL.wave;
        const pa = Math.max(0, a), pb = Math.min(s.w, b);
        for (let x = Math.floor(pa); x < pb; x++) {
          const t0 = sg.clip.in + (x - a) / s.pps, t1 = t0 + 1 / s.pps;
          let k0 = Math.floor(t0 * wv.perSecond), k1 = Math.max(k0 + 1, Math.floor(t1 * wv.perSecond)), m = 0;
          for (let k = k0; k < k1 && k < wv.peaks.length; k++) if (wv.peaks[k] > m) m = wv.peaks[k];
          const hh = Math.max(0.5, m / 100 * amp);
          g.fillRect(x, mid - hh, 1, hh * 2);
        }
      }
      if (sg.cutAfter && b > 0 && b < s.w) {
        g.fillStyle = "#e4b86a";
        g.fillRect(b - 1, WAVE_Y, 2, 5);
      }
    }
    if (!segs.length) {
      g.fillStyle = COL.dim;
      g.font = "12px Inter, Arial, sans-serif";
      g.fillText("Drop your screen recording and facecam clips on the left to start.", 16, CLIP_Y + CLIP_H / 2);
    }
    if (x1 > x0 && x1 < s.w) {
      g.fillStyle = "#ffffff10";
      g.fillRect(x1, RULER, s.w - x1, s.h - RULER);
    }
    const px = Math.round(xOf(P.current.clock.t)) + 0.5;
    if (px >= 0 && px <= s.w) {
      g.strokeStyle = COL.head;
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(px, 4);
      g.lineTo(px, s.h);
      g.stroke();
      g.fillStyle = COL.head;
      g.beginPath();
      g.moveTo(px - 5, 2);
      g.lineTo(px + 5, 2);
      g.lineTo(px, 9);
      g.closePath();
      g.fill();
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ptl", ref: wrap, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ptl-labels", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { top: CLIP_Y + 20 }, children: "Video" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { top: CAM_Y + 4 }, children: "Facecam" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { top: WAVE_Y + 22 }, children: "Audio" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: cv, className: "ptl-canvas", onPointerDown: down, onPointerMove: move, onPointerUp: up, "aria-label": `Timeline. ${isMac ? "⌥" : "Alt"} + scroll to zoom, middle-drag to move.` })
  ] });
});
const ROLES = [{ id: "screen", label: "Screen recording" }, { id: "facecam", label: "Facecam" }, { id: "intro", label: "Intro" }, { id: "other", label: "Other" }];
const ICON = { screen: MonitorPlay, facecam: Camera, intro: Film, other: FileHeadphone };
const FOOTAGE = ["mp4", "mov", "mkv", "m4v", "webm", "avi", "mts", "m2ts", "mxf", "wav", "mp3", "m4a", "aac", "flac"];
const gb = (b) => b > 1e9 ? `${(b / 1e9).toFixed(1)} GB` : `${Math.max(1, Math.round(b / 1e6))} MB`;
function FootageBin({ projectId, media, setMedia }) {
  const { toast } = useApp();
  const [adding, setAdding] = reactExports.useState(false);
  const add = async (files) => {
    if (!files.length) return;
    setAdding(true);
    try {
      setMedia(await api.pAddMedia(projectId, files));
    } catch (e) {
      toast(e.message, "bad");
    } finally {
      setAdding(false);
    }
  };
  const pick = async () => {
    const f = await api.pickFiles("Add footage", [{ name: "Video and audio", extensions: FOOTAGE }]);
    if (f?.length) add(f);
  };
  const role = async (m, r) => {
    try {
      setMedia(await api.pSetRole(projectId, m.id, r));
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  const remove = async (m) => {
    try {
      setMedia(await api.pRemoveMedia(projectId, m.id));
      toast(`Removed ${m.name} from this video. The file itself is untouched.`);
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  const order = (r) => ["intro", "screen", "facecam", "other"].indexOf(r);
  const list = media.slice().sort((a, b) => order(a.role) - order(b.role) || a.name.localeCompare(b.name));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "footage", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sec-title", children: [
      "Footage ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dim", children: media.length || "" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny", onClick: pick, disabled: adding, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 }),
        "Add"
      ] })
    ] }),
    !media.length && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "footage-drop", onClick: pick, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MonitorPlay, { size: 22, strokeWidth: 1.5 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Drop your footage here" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Screen recording (with your mic), facecam clips, and the intro if it's separate. The files stay where they are." })
    ] }),
    list.map((m) => {
      const Icon = ICON[m.role];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `fm-row ${m.role}`, title: m.file, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fm-ic", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 15, strokeWidth: 1.7 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fm-main", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fm-top", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fm-name ellipsis", children: m.derived ? `${m.name} (made by Claude)` : m.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn sm fm-x", "aria-label": `Remove ${m.name}`, title: "Remove from this video (the file is not deleted)", onClick: () => remove(m), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { size: 13, strokeWidth: 1.7 }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fm-sub", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fm-meta", children: [
              fmtTime(m.duration, 0),
              m.width ? ` · ${m.height}p${m.fps ? Math.round(m.fps) : ""}` : "",
              " · ",
              gb(m.size),
              m.missing && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fm-bad", children: " · file missing" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "fm-role", "aria-label": `What ${m.name} is`, value: m.role, onChange: (e) => role(m, e.target.value), disabled: m.derived, children: ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r.id, children: r.label }, r.id)) })
          ] }),
          (m.proxyState === "working" || m.proxyState === "pending") && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fm-prog", title: "The player can't open this file directly, so a preview copy is being made (the original is used for the final render)", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { width: `${m.progress ?? 0}%` } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: m.proxyState === "pending" ? "Waiting…" : `Preview copy ${m.progress ?? 0}%` })
          ] }),
          m.proxyState === "failed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fm-bad fm-err", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 12 }),
            m.proxyError || "Preview copy failed",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "text-btn", onClick: async () => setMedia(await api.pRetryProxy(projectId, m.id)), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { size: 11 }),
              "Retry"
            ] })
          ] })
        ] })
      ] }, m.id);
    }),
    media.length > 0 && !media.some((m) => m.role === "screen") && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "small fm-hint", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 12 }),
      " Mark one file as the screen recording: its sound is the video's sound."
    ] })
  ] });
}
const FOOTAGE_EXT = new RegExp(`\\.(${FOOTAGE.join("|")})$`, "i");
const bgCache = /* @__PURE__ */ new Map();
async function loadBackground(ref) {
  if (!ref) return null;
  if (!bgCache.has(ref)) bgCache.set(ref, await api.backgroundData(ref).catch(() => null));
  const url = bgCache.get(ref);
  if (!url) return null;
  const img = new Image();
  img.src = url;
  await img.decode().catch(() => {
  });
  return img;
}
function Thumb({ id, on: on2, onClick, name }) {
  const [src, setSrc] = reactExports.useState(bgCache.get(id) ?? null);
  reactExports.useEffect(() => {
    if (!src) {
      (bgCache.has(id) ? Promise.resolve(bgCache.get(id)) : api.backgroundData(id).then((d) => {
        bgCache.set(id, d);
        return d;
      })).then(setSrc).catch(() => {
      });
    }
  }, [id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `bg-thumb ${on2 ? "on" : ""}`, onClick, title: name, "aria-label": `Background ${name}`, "aria-pressed": on2, children: [
    src ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt: "", draggable: false }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
    on2 && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 13 })
  ] });
}
const S = (label2, value, min, max, step, set, fmt = (v) => String(Math.round(v))) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "lp-row", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label2 }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "range", type: "range", min, max, step, value, onChange: (e) => set(+e.target.value), "aria-label": label2 }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: fmt(value) })
] });
function LayoutPanel({ layout, onChange, presetName, hidePresets }) {
  const { toast } = useApp();
  const [bgs, setBgs] = reactExports.useState([]);
  const [presets, setPresets] = reactExports.useState([]);
  const [saveAs, setSaveAs] = reactExports.useState(null);
  const reload = () => {
    api.backgrounds().then(setBgs);
    api.layouts().then(setPresets);
  };
  reactExports.useEffect(reload, []);
  const L = layout, set = (patch) => onChange({ ...L, ...patch });
  const scr = (p) => set({ screen: { ...L.screen, ...p } });
  const cam = (p) => set({ cam: { ...L.cam, ...p } });
  const scrSize = L.screen.w, camPx = Math.round(L.cam.h * 1080);
  const setScrSize = (v) => scr({ w: v, h: v, x: (1 - v) / 2, y: (1 - v) / 2 });
  const setCamPx = (v) => {
    const cx = L.cam.x + L.cam.w / 2, cy = L.cam.y + L.cam.h / 2, w = v / 1920, h = v / 1080;
    const left = L.cam.x < 0.5 - L.cam.w / 2, top = L.cam.y < 0.5 - L.cam.h / 2;
    cam({ w, h, x: left ? L.cam.x : cx + L.cam.w / 2 - w, y: top ? L.cam.y : cy + L.cam.h / 2 - h });
  };
  const corner = (c) => {
    const m = 36;
    cam({ x: c[1] === "l" ? m / 1920 : 1 - L.cam.w - m / 1920, y: c[0] === "t" ? m / 1080 : 1 - L.cam.h - m / 1080 });
  };
  const addBg = async () => {
    const f = await api.pickFile("Choose a background image", [{ name: "Images", extensions: ["jpg", "jpeg", "png", "webp"] }]);
    if (!f) return;
    try {
      const id = await api.addBackground(f);
      set({ background: { ...L.background, image: id } });
      reload();
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  const applyPreset = (p) => {
    onChange(p.settings);
    presetName?.(p.name);
    toast(`Layout "${p.name}" applied.`);
  };
  const save = async (name) => {
    try {
      const id = await api.saveLayoutPreset({ name, settings: L });
      reload();
      setSaveAs(null);
      toast(`Saved layout "${name}".`, "ok", { label: "Make default", run: async () => {
        await api.setDefaultLayout(id);
        reload();
        toast("New videos start with this layout.");
      } });
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "layout-panel", children: [
    !hidePresets && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-title", children: "Layout presets" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lp-presets", children: presets.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "lp-preset", onClick: () => applyPreset(p), title: `Apply "${p.name}"`, children: [
        p.is_default ? /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 11, fill: "currentColor" }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ellipsis", children: p.name })
      ] }, p.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", style: { gap: 6, margin: "8px 6px 4px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny", onClick: () => setSaveAs(""), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 12 }),
        "Save as preset"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-title", style: { marginTop: hidePresets ? 0 : 16 }, children: "Background" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-grid", children: [
      bgs.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { id: b.id, name: b.name, on: L.background.image === b.id, onClick: () => set({ background: { ...L.background, image: b.id } }) }, b.id)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-thumb add", onClick: addBg, title: "Use your own image", "aria-label": "Add a background image", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { size: 16, strokeWidth: 1.6 }) })
    ] }),
    S("Dim", L.background.dim, 0, 0.8, 0.01, (v) => set({ background: { ...L.background, dim: v } }), (v) => `${Math.round(v * 100)}%`),
    S("Blur", L.background.blur, 0, 30, 1, (v) => set({ background: { ...L.background, blur: v } })),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-title", style: { marginTop: 16 }, children: "Screen recording" }),
    S("Size", scrSize, 0.5, 1, 5e-3, setScrSize, (v) => `${Math.round(v * 100)}%`),
    S("Corners", L.screen.radius, 0, 60, 1, (v) => scr({ radius: v })),
    S("Shadow", L.screen.shadow, 0, 1, 0.05, (v) => scr({ shadow: v }), (v) => `${Math.round(v * 100)}%`),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "lp-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Fill the box" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "Fill the screen box (crop instead of fit)", on: L.screen.fit === "cover", onChange: (v) => scr({ fit: v ? "cover" : "contain" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-title", style: { marginTop: 16 }, children: "Facecam" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "lp-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Show" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "Show the facecam", on: L.cam.visible, onChange: (v) => cam({ visible: v }) })
    ] }),
    S("Size", camPx, 120, 640, 2, setCamPx, (v) => `${v}px`),
    S("Corners", L.cam.radius, 0, 160, 1, (v) => cam({ radius: v })),
    S("Shadow", L.cam.shadow, 0, 1, 0.05, (v) => cam({ shadow: v }), (v) => `${Math.round(v * 100)}%`),
    S("Zoom", L.cam.zoom, 1, 2.5, 0.01, (v) => cam({ zoom: v }), (v) => `${v.toFixed(2)}×`),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lp-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Corner" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lp-corners", children: ["tl", "tr", "bl", "br"].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "lp-corner", onClick: () => corner(c), "aria-label": `Facecam ${c[0] === "t" ? "top" : "bottom"} ${c[1] === "l" ? "left" : "right"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: c }) }, c)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "small", style: { margin: "10px 6px" }, children: "Drag the boxes in the preview to move them; drag a corner to resize." }),
    saveAs !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { title: "Save layout preset", onClose: () => setSaveAs(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "lp-name", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "lp-name", className: "input", autoFocus: true, value: saveAs, onChange: (e) => setSaveAs(e.target.value), placeholder: "e.g. Tutorial, big cam", onKeyDown: (e) => e.key === "Enter" && saveAs.trim() && save(saveAs.trim()) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: () => setSaveAs(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn primary", disabled: !saveAs.trim(), onClick: () => save(saveAs.trim()), children: "Save" })
      ] })
    ] }) })
  ] });
}
function RenderPanel({ projectId, duration, clips, layout, bg, onClose }) {
  const [presets, setPresets] = reactExports.useState([]);
  const [preset, setPreset] = reactExports.useState("yt1080");
  const [enc, setEnc] = reactExports.useState(null);
  const [prog, setProg] = reactExports.useState(null);
  const [done, setDone] = reactExports.useState(null);
  const [err, setErr] = reactExports.useState(null);
  reactExports.useEffect(() => {
    api.pRenderPresets().then(setPresets);
    api.pEncoder().then(setEnc).catch(() => {
    });
  }, []);
  reactExports.useEffect(() => on("personal:job", (e) => {
    if (e.projectId === projectId && e.kind === "render") setProg({ phase: e.phase, progress: e.progress, speed: e.speed });
  }), [projectId]);
  const start = async () => {
    const p = presets.find((x) => x.id === preset);
    if (!p) return;
    setErr(null);
    setDone(null);
    setProg({ phase: "Preparing", progress: 0 });
    try {
      const H = p.height, W = Math.round(H * 16 / 9 / 2) * 2;
      setDone(await api.pRender(projectId, renderAssets(layout, bg, W, H), p.id));
    } catch (e) {
      setErr(String(e.message).replace(/^.*Error: /, ""));
    } finally {
      setProg(null);
    }
  };
  const busy = !!prog, mb = (b) => b > 1e9 ? `${(b / 1e9).toFixed(2)} GB` : `${Math.round(b / 1e6)} MB`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { title: done ? "Your video is ready" : "Sign off and render", onClose: () => !busy && onClose(), closeOff: busy ? "The render is running: wait for it to finish" : void 0, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-body render-panel", children: [
    !done && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "muted", style: { marginTop: 0 }, children: [
        "Rendering signs off this cut: ",
        clips,
        " clip",
        clips === 1 ? "" : "s",
        ", ",
        fmtTime(duration, 1),
        ". The original footage is used at full quality; the preview copies are not."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rp-presets", role: "radiogroup", "aria-label": "Render preset", children: presets.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `rp-preset ${preset === p.id ? "on" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: "rp", checked: preset === p.id, onChange: () => setPreset(p.id), disabled: busy }),
        p.label
      ] }, p.id)) }),
      enc && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "small", children: [
        enc.gpu ? `Encodes on the GPU (${enc.name}).` : "No GPU encoder found: encodes on the CPU (slower).",
        " Constant quality with a high cap: small files, no blocky frames."
      ] })
    ] }),
    prog && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rp-progress", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "progress", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { width: `${Math.round(prog.progress * 100)}%` } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "small", children: [
        prog.phase,
        "… ",
        Math.round(prog.progress * 100),
        "%",
        prog.speed ? ` · ${prog.speed.toFixed(1)}× realtime` : ""
      ] })
    ] }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "rp-err", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 14 }),
      err
    ] }),
    done && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rp-done", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 22, strokeWidth: 1.7 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "path", children: done.path.split(/[\\/]/).pop() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "small", children: [
          fmtTime(done.duration, 1),
          " · ",
          mb(done.size),
          " · ",
          done.preset,
          " · rendered in ",
          Math.round(done.seconds),
          " s (",
          done.realtime.toFixed(1),
          "× realtime, ",
          done.encoder,
          ")"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-actions", children: done ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", onClick: () => api.reveal(done.path), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 15 }),
        "Show in folder"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", onClick: () => api.open(done.path), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 15 }),
        "Play"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn primary", onClick: onClose, children: "Done" })
    ] }) : busy ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: () => api.pCancelRender(projectId), children: "Cancel" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: onClose, children: "Not yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn primary", onClick: start, disabled: !presets.length, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { size: 15 }),
        "Sign off & render"
      ] })
    ] }) })
  ] }) });
}
const LABEL = { cut: "Cut the footage", intro: "Edit the intro" };
const label = (kind, text = "") => kind && LABEL[kind] ? `${LABEL[kind]}${text ? ": " + text : ""}` : text;
function PClaudePanel({ projectId, media, onFinished, flowHost, onStarted, onShowWorkflows }) {
  const { claude, signIn, signingIn, toast } = useApp();
  const [items, setItems] = reactExports.useState([]);
  const [threadId, setThreadId] = reactExports.useState(null);
  const [task, setTask] = reactExports.useState(null);
  const [kind, setKind] = reactExports.useState(null);
  const [stream, setStream] = reactExports.useState("");
  const [model, setModel] = reactExports.useState(null), [engine, setEngine] = reactExports.useState("claude");
  const [started, setStarted] = reactExports.useState(0);
  const [open, setOpen] = reactExports.useState(null);
  const [notes, setNotes] = reactExports.useState("");
  const [text, setText] = reactExports.useState("");
  const [mode, setMode] = reactExports.useState("edit");
  const [wfModel, setWfModelState] = reactExports.useState("claude-opus-5-5");
  const google = useGoogleState();
  const codex = useCodexState();
  reactExports.useEffect(() => {
    api.config().then((c) => setWfModelState(c.claude.workflowModel || "claude-opus-5-5")).catch(() => {
    });
  }, []);
  const setWfModel = (m) => {
    setWfModelState(m);
    api.setConfig({ claude: { workflowModel: m } }).catch(() => {
    });
  };
  const [last, setLast] = reactExports.useState({});
  const fresh = reactExports.useRef(false);
  const [freshPending, setFreshPending] = reactExports.useState(false);
  const log = reactExports.useRef(null);
  const [, tick] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (!task) return;
    const iv = setInterval(() => tick((n2) => n2 + 1), 1e3);
    return () => clearInterval(iv);
  }, [task]);
  const pinned = reactExports.useRef(true), scrollRaf = reactExports.useRef(0);
  const scrollDown = () => {
    if (scrollRaf.current) return;
    scrollRaf.current = requestAnimationFrame(() => {
      scrollRaf.current = 0;
      const el = log.current;
      if (!el || !pinned.current) return;
      let reduced = false;
      try {
        reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      } catch {
      }
      el.scrollTo({ top: el.scrollHeight, behavior: streamBuf.current || reduced ? "auto" : "smooth" });
    });
  };
  const streamBuf = reactExports.useRef(""), streamRaf = reactExports.useRef(0);
  const clearStream = () => {
    streamBuf.current = "";
    if (streamRaf.current) {
      cancelAnimationFrame(streamRaf.current);
      streamRaf.current = 0;
    }
    setStream("");
  };
  const addStream = (t) => {
    streamBuf.current += t;
    if (streamRaf.current) return;
    streamRaf.current = requestAnimationFrame(() => {
      streamRaf.current = 0;
      const b = streamBuf.current;
      streamBuf.current = "";
      setStream((x) => x + b);
      scrollDown();
    });
  };
  const loadLast = () => api.edits(projectId).then((list) => {
    const o = {};
    for (const e of list) {
      const k = /^Cut the footage/.test(e.instruction) ? "cut" : /^Edit the intro/.test(e.instruction) ? "intro" : null;
      if (k && !o[k]) o[k] = { status: e.status, at: e.created_at };
    }
    setLast(o);
  }).catch(() => {
  });
  const openThread = async (id, keepLive = false) => {
    const msgs = await api.messages(id), out = [];
    for (const m of msgs) {
      const c = m.content;
      if (m.role === "user") out.push({ k: "user", text: label(c.kind, c.text), kind: c.kind });
      else if (m.role === "assistant" || m.role === "note") out.push({ k: "assistant", text: c.text });
      else if (m.role === "tool") {
        const lastIt = out[out.length - 1], t = { id: String(m.id), summary: c.summary, done: true, error: false };
        if (lastIt?.k === "tools") lastIt.list.push(t);
        else out.push({ k: "tools", list: [t] });
      } else if (m.role === "error") out.push({ k: "error", text: c.text, auth: c.auth });
    }
    setItems((prev) => keepLive ? [...out, ...prev] : out);
    setThreadId(id);
    scrollDown();
  };
  reactExports.useEffect(() => {
    loadLast();
    api.running().then(async (r) => {
      const mine = r.find((x) => x.projectId === projectId);
      if (!mine) {
        const t = await api.projectThread(projectId);
        if (t) await openThread(t);
        return;
      }
      if (mine.threadId) await openThread(mine.threadId, true);
      setTask(mine.taskId);
      setKind(mine.kind ?? null);
      setStarted(mine.startedAt || Date.now());
      if (mine.model) setModel(mine.model);
      setEngine(mine.engine || "claude");
      if (mine.permissions?.length) setItems((x) => [...x, ...mine.permissions.map((p) => ({ k: "perm", taskId: mine.taskId, requestId: p.requestId, summary: p.summary, input: p.input }))]);
    });
  }, [projectId]);
  reactExports.useEffect(() => on("claude:event", (ev) => {
    if (ev.projectId !== projectId) return;
    if (ev.type === "starting") {
      setTask(ev.taskId);
      setKind(ev.kind ?? null);
      setStarted(Date.now());
      setEngine("google");
      setItems((x) => [...x, { k: "assistant", text: ev.text }]);
      scrollDown();
      return;
    }
    if (ev.type === "started" && ev.engine) setEngine(ev.engine);
    if (ev.type === "note" && ev.warn) setEngine("claude");
    if (ev.type === "init") setModel(ev.model);
    else if (ev.type === "delta") addStream(ev.text);
    else if (ev.type === "text" || ev.type === "note") {
      clearStream();
      setItems((x) => [...x, { k: "assistant", text: ev.warn ? `⚠ ${ev.text}` : ev.text }]);
      scrollDown();
    } else if (ev.type === "tool") {
      clearStream();
      setItems((x) => {
        const l = x[x.length - 1], t = { id: ev.id, summary: ev.summary, done: false, error: false };
        return l?.k === "tools" ? [...x.slice(0, -1), { ...l, list: [...l.list, t] }] : [...x, { k: "tools", list: [t] }];
      });
      scrollDown();
    } else if (ev.type === "tool_done") setItems((x) => x.map((it) => it.k === "tools" ? { ...it, list: it.list.map((t) => t.id === ev.id ? { ...t, done: true, error: ev.error } : t) } : it));
    else if (ev.type === "permission") {
      setItems((x) => [...x, { k: "perm", taskId: ev.taskId, requestId: ev.requestId, summary: ev.summary, input: ev.input }]);
      scrollDown();
    } else if (ev.type === "permission-settled") setItems((x) => x.map((it) => it.k === "perm" && it.requestId === ev.requestId && it.answer === void 0 ? { ...it, answer: !!ev.allow } : it));
    else if (ev.type === "done") {
      const k = kindRef.current;
      clearStream();
      setTask(null);
      setKind(null);
      setItems((x) => [
        ...x.map((it) => it.k === "tools" ? { ...it, list: it.list.map((t) => ({ ...t, done: true })) } : it),
        ...ev.error ? [{ k: "error", text: ev.error, auth: ev.auth }] : [],
        { k: "result", status: ev.status, files: ev.files ?? [], ms: ev.ms, editId: ev.editId, error: ev.error, kind: k ?? void 0 }
      ]);
      loadLast();
      scrollDown();
      const ok = ev.status === "done" || ev.status === "no-change";
      if (k === "cut" && ev.status === "done") toast("Claude cut the footage. The timeline is updated: watch it through, then sign off.");
      else if (k === "intro" && ev.status === "done") toast("Claude edited the intro. It is now at the start of the timeline.");
      else if (ev.status === "done") toast(`${ev.engine === "codex" ? "ChatGPT" : "Claude"} changed ${ev.files?.length ?? 0} file${ev.files?.length === 1 ? "" : "s"}.`);
      onFinished?.(k ?? "edit", ok);
    }
  }), [projectId, onFinished]);
  const kindRef = reactExports.useRef(null);
  kindRef.current = kind;
  const run = async (k, instruction) => {
    if (!claude?.loggedIn && !runsWithoutClaude(k, usableModel(wfModel, claude?.loggedIn, codex?.ready), codex?.ready)) {
      toast("Claude is not connected yet.", "bad", { label: "Sign in", run: signIn });
      return;
    }
    if (task) {
      toast("Claude is still working. Wait for it to finish, or stop it first.", "info");
      return;
    }
    if ((k === "edit" || k === "ask") && !instruction.trim()) return;
    const isFresh = fresh.current;
    fresh.current = false;
    setFreshPending(false);
    setItems((x) => [...x, { k: "user", text: label(k, instruction), kind: k }]);
    scrollDown();
    try {
      const r = await api.run({ projectId, threadId: isFresh ? null : threadId, newSession: isFresh, kind: k, instruction });
      setTask(r.taskId);
      setThreadId(r.threadId);
      setKind(k);
      setStarted(Date.now());
      setModel(null);
      if (r.engine) setEngine(r.engine);
      if (k === "cut" || k === "intro") {
        setOpen(null);
        setNotes("");
      } else setText("");
      onStarted?.();
    } catch (e) {
      setTask(null);
      setKind(null);
      setItems((x) => [...x, { k: "error", text: e.message }]);
    }
  };
  const answer = async (it, allow) => {
    await api.permission(it.taskId, it.requestId, allow);
    setItems((x) => x.map((y) => y === it ? { ...it, answer: allow } : y));
  };
  const revert = async (editId) => {
    try {
      await api.revert(editId);
      toast("Reverted. The timeline is back to how it was before.", "ok", { label: "Re-apply", run: () => reapply(editId) });
      setItems((x) => x.map((it) => it.k === "result" && it.editId === editId ? { ...it, status: "reverted" } : it));
      loadLast();
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  const reapply = async (editId) => {
    try {
      await api.reapply(editId);
      toast("Re-applied.");
      setItems((x) => x.map((it) => it.k === "result" && it.editId === editId ? { ...it, status: "done" } : it));
      loadLast();
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  const newChat = () => {
    if (task) return;
    setItems([]);
    setThreadId(null);
    fresh.current = true;
    setFreshPending(true);
    clearStream();
  };
  const screen = media.find((m) => m.role === "screen" && !m.derived), intro = media.find((m) => m.role === "intro" && !m.derived), cams = media.filter((m) => m.role === "facecam" && !m.derived);
  const flows = [
    {
      id: "cut",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { size: 16, strokeWidth: 1.7 }),
      title: "Cut the footage",
      what: `Keeps only the sentences your video needs, each from your last clean take: restarts, stutters, breaths and dead air never make it in${cams.length ? `. Syncs ${cams.length === 1 ? "the facecam" : `${cams.length} facecam clips into one`}` : ""}. Every cut is listened back and checked before it reaches your timeline.`,
      blocked: !screen ? 'Add the screen recording first (mark it "Screen recording" in Footage).' : !screen.audio ? "The screen recording has no audio: the cut is made from its sound." : null,
      time: "usually 20-45 min"
    },
    {
      id: "intro",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clapperboard, { size: 16, strokeWidth: 1.7 }),
      title: "Edit the intro",
      what: "Apple-style animated text and graphics on your intro read, then sound effects on every move.",
      blocked: !intro ? 'Add your intro read and mark it "Intro" in Footage.' : null,
      time: "usually 15-30 min"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pclaude", "aria-label": "Claude", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ContextMeter, { projectId, onFresh: newChat, freshPending, busy: !!task }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "agent-log", ref: log, "aria-live": "polite", onScroll: () => {
      const el = log.current;
      if (el) pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    }, children: [
      items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row pflows-head", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sec-title grow", style: { margin: 0 }, children: "Conversation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn sm", onClick: newChat, disabled: !!task, "aria-label": "New conversation", title: "New conversation (Claude starts fresh; the edits stay)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15, strokeWidth: 1.7 }) })
      ] }),
      !items.length && !task && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pclaude-empty", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Start ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Cut the footage" }),
          " or ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Edit the intro" }),
          " from Workflows, or ask Claude for a change below."
        ] }),
        onShowWorkflows && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn small", onClick: onShowWorkflows, children: "Open Workflows" })
      ] }),
      flowHost && reactDomExports.createPortal(/* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pflows", children: flows.map((f) => {
        const l = last[f.id], busy = task && kind === f.id, isOpen = open === f.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `pflow ${isOpen ? "open" : ""} ${busy ? "busy" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "pflow-head", onClick: () => setOpen(isOpen ? null : f.id), "aria-expanded": isOpen, disabled: !!task && !busy, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pflow-ic", children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }) : f.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "grow", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: f.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                "Working · ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Elapsed, { since: started || Date.now() })
              ] }) : l ? `${l.status === "done" ? "Done" : l.status === "reverted" ? "Reverted" : l.status === "failed" ? "Failed" : l.status === "cancelled" ? "Stopped" : l.status} ${ago(l.at)}` : f.time })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 15, className: "pflow-chev" })
          ] }),
          isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pflow-body", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: f.what }),
            f.blocked ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "note warn", children: f.blocked }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "input", rows: 2, value: notes, onChange: (e) => setNotes(e.target.value), placeholder: f.id === "cut" ? "Notes (optional): e.g. keep the long demo at 12:00, cut the tangent about pricing" : "Notes (optional): e.g. show the three tools as cards, blue accent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "pflow-model", value: wfModel, onChange: (e) => setWfModel(e.target.value), "aria-label": "Model for this workflow", title: "Opus 5.5: the most careful edit. Sonnet 5.5: faster and lighter on your plan.", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "claude-opus-5-5", children: "Opus 5.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "claude-sonnet-5-5", children: "Sonnet 5.5" }),
                  /^google:/.test(wfModel) && !google?.models.some((m) => `google:${m.id}` === wfModel) && /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: wfModel, children: modelName(wfModel, google) }),
                  /^codex:/.test(wfModel) && !(codex?.ready && CODEX_MODELS.some((m) => `codex:${m.id}` === wfModel)) && /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: wfModel, children: modelName(wfModel, google) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CodexOptgroup, { codex }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleOptgroup, { google })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn small primary", onClick: () => run(f.id, notes.trim()), disabled: !!task, children: l?.status === "done" ? "Run again" : "Start" })
              ] })
            ] })
          ] })
        ] }, f.id);
      }) }), flowHost),
      !claude?.loggedIn && !runsWithoutClaude("edit", usableModel(wfModel, claude?.loggedIn, codex?.ready), codex?.ready) && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn primary", onClick: signIn, disabled: signingIn, children: [
        signingIn ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 15 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 15 }),
        "Sign in to Claude"
      ] }),
      items.map((it, i) => {
        if (it.k === "user") return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "msg user", children: it.text }, i);
        if (it.k === "assistant") return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "msg assistant md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Md, { text: it.text }) }, i);
        if (it.k === "tools") return /* @__PURE__ */ jsxRuntimeExports.jsx(ToolGroup, { list: it.list }, i);
        if (it.k === "error") return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "msg err", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow", children: it.text })
          ] }),
          it.auth && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny", style: { marginTop: 8 }, onClick: signIn, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 12 }),
            "Sign in again"
          ] })
        ] }, i);
        if (it.k === "perm") return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "perm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { style: { fontWeight: 500 }, children: [
            "Claude wants to: ",
            it.summary
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: it.input }),
          it.answer === void 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny", onClick: () => answer(it, true), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12 }),
              "Allow"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny", onClick: () => answer(it, false), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }),
              "Deny"
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: it.answer ? "Allowed" : "Denied" })
        ] }, i);
        if (it.k === "result") return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `result-card ${it.status === "failed" ? "fail" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { s: it.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small", children: secs(it.ms) })
          ] }),
          it.files.length > 0 && it.status !== "reverted" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny", onClick: () => revert(it.editId), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { size: 12 }),
            "Revert",
            it.kind === "cut" ? " the cut" : it.kind === "intro" ? " the intro" : ""
          ] }) }),
          it.files.length > 0 && it.status === "reverted" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny", onClick: () => reapply(it.editId), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Redo2, { size: 12 }),
            "Re-apply"
          ] }) })
        ] }, i);
        return null;
      }),
      stream && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "msg assistant", children: stream }),
      task && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "working", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Busy, { text: kind && LABEL[kind] ? LABEL[kind] : workingText(engine), since: started || void 0, kind: "orbit" }),
        model && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "model-chip", children: engine !== "claude" ? modelName(withEngine(model, engine), google) : model.replace(/^claude-/, "") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn tiny", onClick: () => api.stop(task), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { size: 11 }),
          "Stop"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "composer", children: [
      !text && !task && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chips", children: (mode === "edit" ? ["Tighten the pauses a little more", "Put back the part about the setup", "Cut the last minute"] : ["What did you cut, and why?", "Where does the video drag?", "Write chapters for YouTube"]).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn tiny ghost", style: { border: "1px solid #333" }, onClick: () => setText(s), children: s }, s)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          "aria-label": "Instruction for Claude",
          value: text,
          onChange: (e) => setText(e.target.value),
          rows: 2,
          placeholder: task ? "Claude is working…" : mode === "edit" ? "Ask Claude to change the cut…" : "Ask about the video…",
          onKeyDown: (e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey || !e.shiftKey)) {
              e.preventDefault();
              run(mode, text);
            }
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "seg-ctl", role: "radiogroup", "aria-label": "Request type", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { role: "radio", "aria-checked": mode === "edit", className: mode === "edit" ? "on" : "", onClick: () => setMode("edit"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { size: 12 }),
            "Change"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "radio", "aria-checked": mode === "ask", className: mode === "ask" ? "on" : "", onClick: () => setMode("ask"), children: "Question" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
        task ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small", onClick: () => api.stop(task), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { size: 13 }),
          "Stop"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn small primary", onClick: () => run(mode, text), disabled: !text.trim(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SendHorizontal, { size: 14 }),
          mode === "edit" ? "Apply" : "Ask"
        ] })
      ] })
    ] })
  ] });
}
function Elapsed({ since }) {
  const [, tick] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const t = setInterval(() => tick((x) => x + 1), 1e3);
    return () => clearInterval(t);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: secs(Date.now() - since) });
}
const KEYS = () => [
  ["Space", "Play / pause"],
  ["S", "Split the clip at the playhead"],
  ["Q", "Delete from the clip start to the playhead (ripple)"],
  ["W", "Delete from the playhead to the clip end (ripple)"],
  [isMac ? "Delete" : "Delete / Backspace", "Delete the selected clip (ripple)"],
  ["← / →", "One frame back / forward"],
  ["Shift + ← / →", "One second back / forward"],
  ["↑ / ↓", "Previous / next cut"],
  [isMac ? "fn ← / fn →" : "Home / End", "Start / end"],
  ["J / K / L", "Back 2 s / pause / play (L again: 2×)"],
  [`${MOD} + Z`, "Undo"],
  [`${MOD} + Shift + Z`, "Redo"],
  ["+ / -", "Zoom the timeline"],
  [`${ALT} + scroll`, "Zoom the timeline around the mouse"],
  ["Middle-drag", "Move the timeline"],
  ["0", "Fit the timeline"],
  ["M", "Mute"],
  ["?", "This sheet"]
];
function PersonalEditor() {
  const { projectId, toast, refreshProjects, go, setThumbFor } = useApp();
  const clock = reactExports.useMemo(() => new Clock(), [projectId]);
  const playing = usePlaying(clock);
  const [plan, setPlan] = reactExports.useState(null);
  const [thumbUrl, setThumbUrl] = reactExports.useState(null);
  const [media, setMedia] = reactExports.useState([]);
  const [edit, setEditState] = reactExports.useState(emptyEdit());
  const [layout, setLayout] = reactExports.useState(null);
  const [bg, setBg] = reactExports.useState(null);
  const [waves, setWaves] = reactExports.useState({});
  const [selected, setSelected] = reactExports.useState(null);
  const [tab, setTab] = reactExports.useState("footage");
  const [flowHost, setFlowHost] = reactExports.useState(null);
  const [rtab, setRtab] = reactExports.useState("claude");
  const [keysOpen, setKeysOpen] = reactExports.useState(false);
  const [muted, setMuted] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState("");
  const [saved, setSaved] = reactExports.useState(true);
  const [encoder, setEncoder] = reactExports.useState(null);
  const [dropping, setDropping] = reactExports.useState(false);
  const [render, setRender] = reactExports.useState(false);
  const canvas = reactExports.useRef(null), stage = reactExports.useRef(null), engine = reactExports.useRef(null), tl = reactExports.useRef(null);
  const undo = reactExports.useRef([]), redo = reactExports.useRef([]);
  const editRef = reactExports.useRef(edit);
  editRef.current = edit;
  const mediaInfo = reactExports.useMemo(() => media.map((m) => ({ id: m.id, role: m.role, duration: m.duration, fps: m.fps, audio: m.audio, width: m.width, height: m.height })), [media]);
  const { segs, duration } = reactExports.useMemo(() => layoutTimeline(edit, mediaInfo), [edit, mediaInfo]);
  const segI = useClockValue(clock, reactExports.useCallback((v) => segIndexAt(segs, v), [segs]));
  const tcRef = reactExports.useRef(null);
  useClockText(clock, tcRef, reactExports.useCallback((v) => fmtTime(v, 2), []));
  const fps = media.find((m) => m.role === "screen")?.fps || 30;
  const names = reactExports.useMemo(() => Object.fromEntries(media.map((m) => [m.id, (m.role === "screen" && media.filter((x) => x.role === "screen").length < 2 ? "Screen recording" : m.name.replace(/\.[^.]+$/, "")) + (m.proxyState === "pending" || m.proxyState === "working" ? ` (preview copy ${m.proxyState === "working" ? `${m.progress ?? 0}%` : "waiting"})` : "")])), [media]);
  reactExports.useEffect(() => {
    if (!projectId) return;
    let alive = true;
    (async () => {
      try {
        const o = await api.personalOpen(projectId);
        if (!alive) return;
        setPlan(o.plan);
        setTitle(o.plan.title);
        setThumbUrl(o.thumbnailUrl);
        const [m, e, l] = await Promise.all([api.pMedia(projectId), api.pEdit(projectId), api.pLayout(projectId)]);
        if (!alive) return;
        setMedia(m);
        setEditState(e);
        setLayout(l);
        setBg(await loadBackground(l.background.image));
      } catch (err) {
        toast(err.message, "bad");
      }
    })();
    api.pEncoder().then(setEncoder).catch(() => {
    });
    setPlayErrorHandler((mediaId, why) => {
      api.pPlayFailed(projectId, mediaId, why).then(setMedia).catch(() => {
      });
    });
    const off = on("personal:media", (ev) => {
      if (ev.projectId !== projectId) return;
      setMedia((list) => list.map((x) => x.id === ev.media.id ? { ...x, ...ev.media, url: ev.media.proxyState === "ready" ? x.url ?? null : x.url } : x));
      if (ev.media.proxyState === "ready" || ev.media.proxyState === "direct") api.pMedia(projectId).then(setMedia);
    });
    const off2 = on("personal:changed", async (ev) => {
      if (ev.projectId !== projectId) return;
      if (ev.files.includes("media.json")) setMedia(await api.pMedia(projectId));
      if (ev.files.includes("edit.json") || ev.files.includes("media.json")) {
        const e = await api.pEdit(projectId);
        if (JSON.stringify(e.clips) !== JSON.stringify(editRef.current.clips) || JSON.stringify(e.cams) !== JSON.stringify(editRef.current.cams)) {
          if (Date.now() - lastSave.current > 1500) {
            undo.current.push(editRef.current.clips);
            setEditState(e);
          }
        }
      }
      if (ev.files.includes("layout.json") && Date.now() - lastLayoutSave.current > 1500) {
        const l = await api.pLayout(projectId);
        setLayout(l);
        loadBackground(l.background.image).then(setBg);
      }
    });
    return () => {
      alive = false;
      off();
      off2();
    };
  }, [projectId]);
  reactExports.useEffect(() => {
    if (!canvas.current) return;
    const e = new PersonalEngine(canvas.current, clock);
    engine.current = e;
    window.__pengine = e;
    window.__pclock = clock;
    const ro = new ResizeObserver(() => {
      const r = stage.current.getBoundingClientRect(), d = Math.min(2, devicePixelRatio);
      canvas.current.width = Math.min(1920, Math.round(r.width * d));
      canvas.current.height = Math.min(1080, Math.round(r.height * d));
      e.redraw();
    });
    ro.observe(stage.current);
    return () => {
      ro.disconnect();
      e.destroy();
      engine.current = null;
    };
  }, [clock]);
  const engineMedia = reactExports.useMemo(() => media.map((m) => ({ ...mediaInfo.find((x) => x.id === m.id), url: m.url })), [media, mediaInfo]);
  reactExports.useEffect(() => {
    engine.current?.setData(edit, engineMedia, layout, bg);
  }, [edit, engineMedia]);
  reactExports.useEffect(() => {
    engine.current?.setLayout(layout, bg);
  }, [layout, bg]);
  reactExports.useEffect(() => {
    engine.current?.setVolume(1, muted);
  }, [muted]);
  reactExports.useEffect(() => {
    if (!projectId) return;
    for (const m of media) if (m.audio && (m.role === "screen" || m.role === "intro") && (m.proxyState === "ready" || m.proxyState === "direct") && !(m.id in waves)) {
      setWaves((w) => ({ ...w, [m.id]: null }));
      api.pWaveform(projectId, m.id).then((wv) => setWaves((w) => ({ ...w, [m.id]: wv }))).catch(() => {
      });
    }
  }, [media, projectId]);
  const saveTimer = reactExports.useRef(0), lastSave = reactExports.useRef(0), lastLayoutSave = reactExports.useRef(0);
  const persist = reactExports.useCallback((e) => {
    setSaved(false);
    clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      if (!projectId) return;
      lastSave.current = Date.now();
      api.pSaveEdit(projectId, e).then(() => {
        lastSave.current = Date.now();
        setSaved(true);
      }).catch((err) => toast(err.message, "bad"));
    }, 350);
  }, [projectId]);
  const commit = reactExports.useCallback((clips, newT, record = true) => {
    const cur = editRef.current;
    if (record) {
      undo.current.push(cur.clips);
      if (undo.current.length > 200) undo.current.shift();
      redo.current = [];
    }
    const next = { ...cur, clips, signedOff: null, source: "manual" };
    setEditState(next);
    persist(next);
    if (newT !== void 0) {
      clock.setPlaying(false);
      clock.set(newT);
    }
  }, [persist, clock]);
  const doUndo = () => {
    const c = undo.current.pop();
    if (!c) return;
    redo.current.push(editRef.current.clips);
    commit(c, void 0, false);
  };
  const doRedo = () => {
    const c = redo.current.pop();
    if (!c) return;
    undo.current.push(editRef.current.clips);
    commit(c, void 0, false);
  };
  const cutS = () => {
    const r = split(editRef.current, mediaInfo, clock.t);
    if (r) {
      commit(r);
      setSelected(null);
    }
  };
  const cutQ = () => {
    const r = rippleBefore(editRef.current, mediaInfo, clock.t);
    if (r) {
      commit(r.clips, r.t);
      setSelected(null);
      tl.current?.reveal(r.t);
    }
  };
  const cutW = () => {
    const r = rippleAfter(editRef.current, mediaInfo, clock.t);
    if (r) {
      commit(r.clips, r.t);
      setSelected(null);
    }
  };
  const delSel = () => {
    if (selected === null || !segs[selected]) return;
    const start = segs[selected].start;
    commit(removeClip(editRef.current, selected), start);
    setSelected(null);
  };
  const trimLive = reactExports.useRef(null);
  const onTrim = (i, side, value, done) => {
    const src = media.find((m) => m.id === editRef.current.clips[i]?.src);
    if (!src) return;
    if (!trimLive.current) trimLive.current = editRef.current.clips;
    const clips = trimClip({ ...editRef.current, clips: trimLive.current }, i, side, value, src.duration);
    if (done) {
      const before = trimLive.current;
      trimLive.current = null;
      undo.current.push(before);
      redo.current = [];
      commit(clips, void 0, false);
    } else setEditState((e) => ({ ...e, clips }));
  };
  reactExports.useEffect(() => {
    const key = (e) => {
      const el = e.target;
      if (el?.closest('input, textarea, select, [contenteditable="true"]') || document.querySelector('[aria-modal="true"]')) return;
      const mod = e.ctrlKey || e.metaKey, k = e.key.toLowerCase(), step = 1 / fps;
      const go2 = (v) => {
        clock.setPlaying(false);
        clock.set(Math.max(0, Math.min(duration, v)));
        tl.current?.reveal(clock.t);
      };
      if (mod && k === "z") {
        e.preventDefault();
        e.shiftKey ? doRedo() : doUndo();
        return;
      }
      if (mod && k === "y") {
        e.preventDefault();
        doRedo();
        return;
      }
      if (mod || e.altKey) return;
      if (e.key === " ") {
        e.preventDefault();
        clock.setPlaying(!clock.playing);
      } else if (k === "s") {
        e.preventDefault();
        cutS();
      } else if (k === "q") {
        e.preventDefault();
        cutQ();
      } else if (k === "w") {
        e.preventDefault();
        cutW();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        delSel();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go2(clock.t - (e.shiftKey ? 1 : step));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go2(clock.t + (e.shiftKey ? 1 : step));
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const i = segIndexAt(segs, clock.t);
        const s = segs[e.key === "ArrowUp" ? clock.t - (segs[i]?.start ?? 0) > 0.05 ? i : i - 1 : i + 1];
        go2(s ? s.start : e.key === "ArrowUp" ? 0 : duration);
      } else if (e.key === "Home") {
        e.preventDefault();
        go2(0);
      } else if (e.key === "End") {
        e.preventDefault();
        go2(duration);
      } else if (k === "j") go2(clock.t - 2);
      else if (k === "k") clock.setPlaying(false);
      else if (k === "l") {
        if (clock.playing) engine.current?.setRate(engine.current.rate >= 2 ? 1 : 2);
        else {
          engine.current?.setRate(1);
          clock.setPlaying(true);
        }
      } else if (e.key === "+" || e.key === "=") tl.current?.zoom(1.5);
      else if (e.key === "-") tl.current?.zoom(1 / 1.5);
      else if (e.key === "0") tl.current?.fit();
      else if (k === "m") setMuted((m) => !m);
      else if (e.key === "?") setKeysOpen(true);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  reactExports.useEffect(() => () => {
    clock.setPlaying(false);
  }, [clock]);
  const layoutTimer = reactExports.useRef(0);
  const changeLayout = (l) => {
    const bgChanged = l.background.image !== layout?.background.image;
    setLayout(l);
    if (bgChanged) loadBackground(l.background.image).then(setBg);
    clearTimeout(layoutTimer.current);
    layoutTimer.current = window.setTimeout(() => {
      if (!projectId) return;
      lastLayoutSave.current = Date.now();
      api.pSaveLayout(projectId, l).then(() => {
        lastLayoutSave.current = Date.now();
      }).catch((e) => toast(e.message, "bad"));
    }, 300);
  };
  const onDrop = async (e) => {
    e.preventDefault();
    setDropping(false);
    if (!projectId) return;
    const files = [...e.dataTransfer.files].map((f) => window.suite.pathForFile(f)).filter((f) => f && FOOTAGE_EXT.test(f));
    if (!files.length) {
      toast("Drop video or audio files (screen recording, facecam, intro).", "bad");
      return;
    }
    try {
      const m = await api.pAddMedia(projectId, files);
      setMedia(m);
      setTab("footage");
      const e2 = await api.pEdit(projectId);
      setEditState(e2);
      toast(`Added ${files.length} file${files.length > 1 ? "s" : ""}. Making smooth preview copies…`);
    } catch (err) {
      toast(err.message, "bad");
    }
  };
  const mediaChanged = async (m) => {
    setMedia(m);
    if (projectId) setEditState(await api.pEdit(projectId));
  };
  const saveTitle = async () => {
    if (!projectId || !plan || title.trim() === plan.title) return;
    try {
      setPlan(await api.personalSetPlan(projectId, { title }));
      refreshProjects();
    } catch (e) {
      toast(e.message, "bad");
      setTitle(plan.title);
    }
  };
  const pickThumb = async () => {
    if (!projectId) return;
    const f = await api.pickFile("Choose a thumbnail image", [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp"] }]);
    if (!f) return;
    try {
      setThumbUrl(await api.personalSetThumbnail(projectId, f));
      refreshProjects();
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  const savePlanField = async (k, v) => {
    if (!projectId || !plan || plan[k] === v) return;
    try {
      setPlan(await api.personalSetPlan(projectId, { [k]: v }));
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  const claudeFinished = reactExports.useCallback(async (kind, ok) => {
    if (!projectId || !ok) return;
    const [m, e] = await Promise.all([api.pMedia(projectId), api.pEdit(projectId)]);
    setMedia(m);
    if (JSON.stringify(e.clips) !== JSON.stringify(editRef.current.clips)) {
      undo.current.push(editRef.current.clips);
      setEditState(e);
    }
    if (kind === "cut" || kind === "intro") {
      clock.setPlaying(false);
      clock.set(0);
      tl.current?.fit();
    }
  }, [projectId, clock]);
  const seg = segs[segI];
  const proxiesBusy = media.filter((m) => m.proxyState === "working" || m.proxyState === "pending");
  if (!projectId) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `editor personal-editor page-enter ${dropping ? "dropping" : ""}`,
      onDragOver: (e) => {
        if ([...e.dataTransfer.types].includes("Files")) {
          e.preventDefault();
          setDropping(true);
        }
      },
      onDragLeave: (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setDropping(false);
      },
      onDrop,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ed-top", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "ed-title", "aria-label": "Video title", value: title, onChange: (e) => setTitle(e.target.value), onBlur: saveTitle, onKeyDown: (e) => e.key === "Enter" && e.target.blur(), size: Math.max(8, title.length) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "save-state", children: saved ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12 }),
            "Saved"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 12 }),
            "Saving"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(EditorChannel, { projectId }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
          encoder && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `enc-badge ${encoder.gpu ? "gpu" : ""}`, title: `Preview copies and the final render use: ${encoder.name}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { size: 12 }),
            encoder.gpu ? "GPU" : "CPU"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", title: "Keyboard shortcuts (?)", "aria-label": "Keyboard shortcuts", onClick: () => setKeysOpen(true), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Keyboard, { size: 17, strokeWidth: 1.7 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", title: "Open the video's folder", "aria-label": "Open the video's folder", onClick: async () => {
            const o = await api.personalOpen(projectId);
            api.open(o.path);
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 17, strokeWidth: 1.7 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn small primary",
              onClick: () => {
                clock.setPlaying(false);
                setRender(true);
              },
              disabled: !segs.length || !layout,
              title: edit.signedOff ? `Signed off ${new Date(edit.signedOff).toLocaleString()}` : "Watch it through first, then sign off the final render",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { size: 15, strokeWidth: 1.7 }),
                edit.signedOff ? "Render again" : "Sign off & render"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "ed-left", "aria-label": "Footage and layout", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "seg-ctl ptabs", role: "tablist", "aria-label": "Left panel", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "tab", "aria-selected": tab === "footage", className: tab === "footage" ? "on" : "", onClick: () => setTab("footage"), children: "Footage" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "tab", "aria-selected": tab === "layout", className: tab === "layout" ? "on" : "", onClick: () => setTab("layout"), children: "Layout" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "tab", "aria-selected": tab === "workflows", className: tab === "workflows" ? "on" : "", onClick: () => setTab("workflows"), children: "Workflows" })
          ] }),
          tab === "footage" ? /* @__PURE__ */ jsxRuntimeExports.jsx(FootageBin, { projectId, media, setMedia: mediaChanged }) : tab === "workflows" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pflows-host", ref: setFlowHost }) : layout && /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutPanel, { layout, onChange: changeLayout })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "ed-center", "aria-label": "Preview and timeline", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stage-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stage pstage", ref: stage, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvas, className: "pcanvas", "aria-label": "Video preview" }),
            tab === "layout" && layout && /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutHandles, { layout, onChange: changeLayout }),
            !media.length && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stage-msg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { size: 26, strokeWidth: 1.4 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Drop your footage anywhere here" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "The screen recording, your facecam clips and the intro." })
            ] }),
            proxiesBusy.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stage-badge", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 12 }),
              "Preparing preview ",
              Math.round(proxiesBusy.reduce((a, m) => a + (m.progress ?? 0), 0) / proxiesBusy.length),
              "%"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "transport", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", "aria-label": playing ? "Pause" : "Play", title: "Play / pause (Space)", onClick: () => clock.setPlaying(!playing), disabled: !segs.length, children: playing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 19, strokeWidth: 1.7 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 19, strokeWidth: 1.7 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "timecode", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { ref: tcRef, className: "tc-now" }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "/ ",
                fmtTime(duration, 1)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small ellipsis grow", children: seg ? `${seg.role === "intro" ? "Intro" : `Clip ${seg.index + 1} of ${segs.length}`} · source ${fmtTime(seg.clip.in, 1)}–${fmtTime(seg.clip.out, 1)}` : "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `icon-btn sm ${muted ? "active" : ""}`, title: "Mute (M)", "aria-label": muted ? "Unmute" : "Mute", "aria-pressed": muted, onClick: () => setMuted(!muted), children: muted ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { size: 15, strokeWidth: 1.7 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { size: 15, strokeWidth: 1.7 }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "timeline ptimeline", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tl-head", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Timeline" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "dim ellipsis", children: [
                "S split · Q / W delete to the playhead · drag an edge to trim · ",
                ALT,
                "+scroll to zoom · middle-drag to move"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grow" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn sm", title: `Undo (${MOD}+Z)`, "aria-label": "Undo", onClick: doUndo, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { size: 14, strokeWidth: 1.7 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn sm", title: `Redo (${MOD}+Shift+Z)`, "aria-label": "Redo", onClick: doRedo, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Redo2, { size: 14, strokeWidth: 1.7 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn sm", title: "Split at the playhead (S)", "aria-label": "Split", onClick: cutS, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { size: 14, strokeWidth: 1.7 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn sm", title: "Zoom out (-)", "aria-label": "Zoom out", onClick: () => tl.current?.zoom(1 / 1.5), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomOut, { size: 14, strokeWidth: 1.7 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn sm", title: "Zoom in (+)", "aria-label": "Zoom in", onClick: () => tl.current?.zoom(1.5), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { size: 14, strokeWidth: 1.7 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn sm", title: "Fit (0)", "aria-label": "Fit the timeline", onClick: () => tl.current?.fit(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { size: 14, strokeWidth: 1.7 }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PTimeline, { ref: tl, clock, segs, duration, edit, media: mediaInfo, waves, selected, onSelect: setSelected, onTrim, names })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "ed-right", "aria-label": "Claude and the video plan", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "seg-ctl ptabs rtabs", role: "tablist", "aria-label": "Right panel", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "tab", "aria-selected": rtab === "claude", className: rtab === "claude" ? "on" : "", onClick: () => setRtab("claude"), children: "Claude" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "tab", "aria-selected": rtab === "plan", className: rtab === "plan" ? "on" : "", onClick: () => setRtab("plan"), children: "Plan" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pclaude-wrap", hidden: rtab !== "claude", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            PClaudePanel,
            {
              projectId,
              media,
              onFinished: claudeFinished,
              flowHost: tab === "workflows" ? flowHost : null,
              onStarted: () => setRtab("claude"),
              onShowWorkflows: () => setTab("workflows")
            }
          ) }),
          rtab === "plan" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "plan-panel", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-title", children: "Thumbnail" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "plan-thumb", onClick: pickThumb, title: "Choose a thumbnail image (or make one in Thumbnails)", children: thumbUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: thumbUrl, alt: "Thumbnail" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { size: 20, strokeWidth: 1.5 }),
              "Add a thumbnail"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-btn plan-link", onClick: () => {
              setThumbFor(projectId);
              go("thumbnails");
            }, children: "Make one in Thumbnails →" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-title", style: { marginTop: 14 }, children: "Thumbnail idea" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "input plan-field", rows: 2, defaultValue: plan?.thumbnailIdea, onBlur: (e) => savePlanField("thumbnailIdea", e.target.value), placeholder: "What the thumbnail shows" }, "i" + (plan ? 1 : 0)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-title", style: { marginTop: 14 }, children: "Core concept" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "input plan-field", rows: 4, defaultValue: plan?.concept, onBlur: (e) => savePlanField("concept", e.target.value), placeholder: "The one idea the video delivers" }, "c" + (plan ? 1 : 0))
          ] })
        ] }),
        render && layout && /* @__PURE__ */ jsxRuntimeExports.jsx(RenderPanel, { projectId, duration, clips: segs.length, layout, bg, onClose: () => {
          setRender(false);
          api.pEdit(projectId).then((e) => setEditState((x) => ({ ...x, signedOff: e.signedOff })));
        } }),
        keysOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { title: "Keyboard shortcuts", onClose: () => setKeysOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-body", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kv", children: KEYS().map(([k, d]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { style: { fontSize: 11, padding: "3px 6px" }, children: k }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: d })
        ] }, k)) }) }) })
      ]
    }
  );
}
function LayoutHandles({ layout, onChange }) {
  const ref = reactExports.useRef(null);
  const start = (e, which, mode) => {
    e.preventDefault();
    e.stopPropagation();
    const r = ref.current.getBoundingClientRect(), b0 = { ...layout[which] }, x0 = e.clientX, y0 = e.clientY;
    const ratio = which === "cam" ? 1920 / 1080 : b0.h / b0.w;
    const moveFn = (ev) => {
      const dx = (ev.clientX - x0) / r.width, dy = (ev.clientY - y0) / r.height;
      const b = { ...b0 };
      if (mode === "move") {
        b.x = Math.min(1 - b.w * 0.2, Math.max(-b.w * 0.8, b0.x + dx));
        b.y = Math.min(1 - b.h * 0.2, Math.max(-b.h * 0.8, b0.y + dy));
      } else {
        const sx = mode[1] === "r" ? 1 : -1;
        let w = Math.max(0.06, b0.w + sx * dx);
        let h = w * ratio;
        if (which === "cam") h = w * 1920 / 1080;
        b.w = w;
        b.h = h;
        if (mode[1] === "l") b.x = b0.x + b0.w - w;
        if (mode[0] === "t") b.y = b0.y + b0.h - h;
      }
      onChange({ ...layout, [which]: b });
    };
    const upFn = () => {
      window.removeEventListener("pointermove", moveFn);
      window.removeEventListener("pointerup", upFn);
    };
    window.addEventListener("pointermove", moveFn);
    window.addEventListener("pointerup", upFn);
  };
  const box = (which, label2) => {
    const b = layout[which];
    if (which === "cam" && !layout.cam.visible) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `lh-box ${which}`, style: { left: `${b.x * 100}%`, top: `${b.y * 100}%`, width: `${b.w * 100}%`, height: `${b.h * 100}%` }, onPointerDown: (e) => start(e, which, "move"), "aria-label": `Move the ${label2}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "lh-label", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Move, { size: 11 }),
        label2
      ] }),
      ["tl", "tr", "bl", "br"].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: `lh-h ${c}`, onPointerDown: (e) => start(e, which, c) }, c))
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lh", ref, children: [
    box("screen", "Screen recording"),
    box("cam", "Facecam")
  ] });
}
export {
  LayoutHandles as L,
  PersonalEditor as P,
  LayoutPanel as a,
  drawFrame as d,
  loadBackground as l
};
