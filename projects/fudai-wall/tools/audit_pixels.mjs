// AUTHORSHIP: Codex seat; brief: P9_PIXEL_GATE_REDERIVE_BRIEF.md; date: 2026-11-23.
// PIXEL GATE — fudai-wall method change #3 (phase 9, on critic round 8's
// demand + RULES S3: the same fault twice changes the METHOD).
// The scene-data staging audit (tools/audit_staging.mjs) stays as a PRE-CHECK.
// This gate judges the fleet-probed STILLS themselves and is the only staging
// verdict that counts: no frame is called staged until it passes HERE.
//   (a) HEAD CROP - the required face's RENDERED head disc is measured in the
//       still by tools/pixel_measure.py (skin segmentation ringed by the dark
//       outline), matched to the audit-projected centre/size, and fails if
//       the disc is cut by a frame edge or cannot be found unambiguously.
//   (b) FOREGROUND OCCLUSION - screen-space: a named prop's legibility rect
//       (projected from scene data) fails if a CLOSER character disc
//       (calibrated radius 1.35x the model sphere) or a closer prop box
//       covers >10% of it. The staging audit's occluder set (buildings +
//       wall + gateleaf) cannot see these; this test can.
//   (c) SET BAR - RULES S5 detail/flat percentages computed on the pixels
//       (32x32 blocks, grayscale std). S5 is a per-SHOT bar: a shot passes
//       when the MEDIAN of its key frames is >=22% detail and <=78% flat;
//       the film needs median shot >=28% detail and <=40% of shots under.
// Calibration (2026-11-23, chunk2d stills, recorded in lessons/build.md):
// rendered head radius = 1.04-1.06x the audit sphere for the mayor, ~1.32x
// hat-inclusive for villagers; rendered centres sit ~340-620 px ABOVE the
// audit projection on close shots - hence discs are measured, not projected.
// Usage: node tools/audit_pixels.mjs [--stills <dir>] [--frames 687,723]
// The geometry preamble mirrors tools/audit_staging.mjs (same pipeline:
// resolver/lowCams/autoMove sampled identically).
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import film from '../scenes/film.js';
import { resolver, resolveTimes, autoMove } from '../lib/film/resolve.js';
import { easeFn } from '../engine/ease.js';
import { lowCams } from '../lib/film/end.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const STILLS = opt('--stills', join(ROOT, 'probes/chunk2d/stills'));
const ONLY = opt('--frames', null)?.split(',').map(Number);
const words = JSON.parse(readFileSync(join(ROOT, 'audio/clean.json'), 'utf8'));
const lines = [...new Set(words.map(w => w.line))].map(line => {
  const ws = words.filter(w => w.line === line);
  return { line, start: ws[0].start, end: ws.at(-1).end };
});
const voice = { words, lines };
const R = resolver(voice);
let shots = resolveTimes(film.shots, R, 'shots');
const acts = Object.fromEntries(Object.entries(film.acts || {}).map(([id, a]) => [id, resolveTimes(a, R, `acts.${id}`)]));
const props = resolveTimes(film.props || [], R, 'props');
const dur = 68.08;
const cast = film.cast;
const characters = Object.entries(cast).map(([name, c]) => {
  const raw = JSON.parse(readFileSync(join(ROOT, 'scenes', c.spec), 'utf8'));
  const spec = { ...raw, id: name };
  const legLen = spec.limbs?.legLen ?? 1.35;
  const hipY = legLen * .93;
  const rest = { hipY, headY: hipY + (spec.body?.neckHeight ?? .35) + (spec.body?.neckToHead ?? .35), neckToHead: spec.body?.neckToHead ?? .35, legLen, armLen: spec.limbs?.armLen ?? .95,
    ankleY: (spec.limbs?.width ?? .058) / 2 + .005, hipR: [-.22, -.2, 0], hipL: [.22, -.2, 0],
    shoulderR: [-.4, .4, 0], shoulderL: [.4, .4, 0], neck: [0, .4, 0] };
  const timeline = resolveTimes(JSON.parse(JSON.stringify(acts[name] || {})), R, `acts.${name}`);
  timeline.root = timeline.root || { x: c.at?.[0] ?? 0, z: c.at?.[1] ?? 0, ry: c.ry ?? 0 };
  timeline.settle ??= true;
  return { name, spec, timeline, rest };
});
const rests = Object.fromEntries(characters.map(ch => [ch.name, ch.rest]));
function posAt(id, t) {
  const c = cast[id], base = c.at, walks = (acts[id]?.walk || []).filter(w => t >= w.t0).sort((a,b)=>a.t0-b.t0);
  if (!walks.length) return [base[0], 0, base[1]];
  const w = walks.at(-1), path = w.path, speed = w.speed || 1;
  let remain = Math.max(0, t - w.t0) * speed;
  for (let i=1;i<path.length;i++) {
    const a=path[i-1], b=path[i], d=Math.hypot(b[0]-a[0],b[1]-a[1]);
    if (remain <= d) { const u=d ? remain/d:1; return [a[0]+(b[0]-a[0])*u,0,a[1]+(b[1]-a[1])*u]; }
    remain -= d;
  }
  const p=path.at(-1); return [p[0],0,p[1]];
}
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,u)=>a+(b-a)*u;
function lerpV(a,b,u){return a.map((v,i)=>lerp(v,b[i],u));}
const lowered = lowCams(shots, characters, rests, { log: () => {} });
shots = lowered.shots;
const moved = await autoMove(shots, dur);
const shotById = id => moved.find(s => s.id === id);
function camAt(shot,t){const c=shot.camera,a=c.t0??shot.t0,b=c.t1??shot.t1;let u=clamp((t-a)/(b-a));u=easeFn(c.ease??'outCubic')(u);return {pos:lerpV(c.from.pos,c.to.pos,u),target:lerpV(c.from.target,c.to.target,u),fov:lerp(c.from.fov??26,c.to.fov??26,u)};}
function add(a,b){return a.map((x,i)=>x+b[i]);}
function ry(v,yaw){const a=yaw*Math.PI/180;return [v[0]*Math.cos(a)+v[2]*Math.sin(a),v[1],-v[0]*Math.sin(a)+v[2]*Math.cos(a)];}
function box(center,size,yaw=0){const [x,y,z]=size,a=Math.abs(yaw*Math.PI/180);const ex=Math.abs(x*Math.cos(a))+Math.abs(z*Math.sin(a)),ez=Math.abs(x*Math.sin(a))+Math.abs(z*Math.cos(a));return {center,min:[center[0]-ex/2,center[1]-y/2,center[2]-ez/2],max:[center[0]+ex/2,center[1]+y/2,center[2]+ez/2],size:[ex,y,ez]};}
function corners(b){const out=[];for(const x of [b.min[0],b.max[0]])for(const y of [b.min[1],b.max[1]])for(const z of [b.min[2],b.max[2]])out.push([x,y,z]);return out;}
function makeFrame(cam){const f=norm(sub(cam.target,cam.pos)), right=norm(cross(f,[0,1,0])), up=norm(cross(right,f));const v=cam.fov*Math.PI/180,h=2*Math.atan(Math.tan(v/2)*1080/1920);
  return {cam,depth(p){return dot(sub(p,cam.pos),f);},height(size,p){const d=this.depth(p);return d>0?2*Math.atan(size/(2*d))/(cam.fov*Math.PI/180)*1920:null;},screen(p){const d=sub(p,cam.pos),z=dot(d,f);if(z<=.1)return null;const x=dot(d,right)/(z*Math.tan(h/2)),y=dot(d,up)/(z*Math.tan(v/2));return [(x+1)*540,(1-y)*960];}};}
const sub=(a,b)=>a.map((v,i)=>v-b[i]), dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0), norm=a=>a.map(v=>v/(Math.hypot(...a)||1)), cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function propState(p,t){const ks=p.keys||[], before=ks.filter(k=>k.t<=t).sort((a,b)=>a.t-b.t), key=before.at(-1)||{};const lastField=f=>before.filter(k=>k[f]!=null).at(-1)?.[f];const visible=key.drop?true:(lastField('in')??p.in??'world')==='world';const at=[...(lastField('at')??p.at)],rot=[...(lastField('rot')??p.rot??[0,0,0])];
  const val=(field,def)=>{if(p[field]==null)return def;const keyed=before.filter(k=>k[field]!=null);if(!keyed.length)return p[field];const prev=keyed.at(-1),ix=keyed.length-1,ease=prev.ease;if(ease!=null&&ix>0){const prior=keyed[ix-1],u=clamp((t-prev.t)/ease);const sm=u*u*(3-2*u);return lerp(prior[field],prev[field],sm);}return prev[field];};
  return {visible,at,rot,page:val('page',0),h:val('h',.8),lift:val('lift',0),lineY:val('lineY',1),pin:val('pin',0),cx:val('cx',0),cy:val('cy',12)};}
function dropState(p,t){const k=(p.keys||[]).filter(k=>k.t<=t).at(-1);if(!k?.drop)return null;const d=k.drop,dt=t-k.t,g=d.g??9.8,v0=d.v0||[0,0,0],from=d.from||k.at||p.at,ground=d.ground??0,a=g/2,c=from[1]-ground,T=a>0?(v0[1]+Math.sqrt(v0[1]**2+4*a*Math.max(0,c)))/(2*a):Infinity;if(d.hide&&dt>T)return null;const u=Math.min(dt,T),y=from[1]+v0[1]*u-.5*g*u*u;return [from[0]+v0[0]*u,y,from[2]+v0[2]*u];}
function propBox(id,t){const p=props.find(x=>x.id===id);if(!p)return null;const s=propState(p,t);if(!s.visible)return null;const a=s.at,r=s.rot[1]||0,kind=p.kind;let B;
  if(kind==='boardsign')B=box(add(a,[0,(p.post?p.leg||1.2:0)+(p.h||.8)/2,0]),[p.w||2,p.h||.8,.12],r);
  if(kind==='calendar')B=box(add(a,[0,1.9,0]),[2.2,3.5,.2],r);
  if(kind==='money')B=box(add(a,[0,.55,0]),[3.7,1.15,2.1],r);
  if(kind==='crane')B=box(add(a,ry([2,8,0],r)),[11.5,16.8,1.2],r);
  if(kind==='gateleaf')B=box(add(a,[0,17.88*(s.lift-.5),0]),[7,17.88,.36],r);
  if(kind==='seawall')B=box(add(a,[0,9,0]),[90,18,1.15],r);
  if(kind==='blueprint')B=box(add(a,[0,1.7,0]),[3.4,3.4,.2],r);
  if(kind==='orb')return null;
  // The falling coins render as a multi-member cluster. Build bounds from
  // the sampled drop position/state and the members, not the origin proxy.
  if(kind==='coins'){const q=dropState(p,t);if(!q)return null;
    const members=p.members||p.coins||[];
    const points=members.map(m=>add(q,m.at||m.offset||[0,0,0]));
    if(!points.length) points.push(q);
    const radius=Math.max(.05,...members.map(m=>(m.r||m.radius||.12)));
    const min=[0,1,2].map(i=>Math.min(...points.map(v=>v[i]))-radius), max=[0,1,2].map(i=>Math.max(...points.map(v=>v[i]))+radius);
    // Reject empty spacing: retain only the tight union around actual members.
    const center=min.map((v,i)=>(v+max[i])/2), size=min.map((v,i)=>max[i]-v);
    return {box:{...box(center,size,r),min,max,size},state:s,cluster:true};}
  return B?{box:B,state:s}:null;
}
const moments=[
 [219,7.3,'SH04'],[241,8.0333333333,'SH04'],[288,9.6,'SH05'],[345,11.5,'SH05'],[414,13.8,'SH05'],[474,15.8,'SH06'],[537,17.9,'SH07'],[570,19,'SH07'],[590,19.6666667,'SH07B'],[621,20.7,'SH08'],[639,21.3,'SH08'],[669,22.3,'SH09'],[687,22.9,'SH09'],[711,23.7,'SH10'],[723,24.1,'SH10'],[768,25.6,'SH11'],[798,26.6,'SH11'],[822,27.4,'SH11'],[870,29,'SH12']
];
const FACE_REQ = { 219:['mayor'], 241:['mayor'], 537:['mocker_a'], 570:['mocker_a'], 669:['mayor'], 687:['mayor'] };
const PAIR_REQ = { 621:['mocker_a','mocker_b'], 639:['mocker_a','mocker_b'] };
const OCC_REQ = {
  345:[{ prop:'calendar', by:['crane_a','crane_b'] }],
  414:[{ prop:'calendar', by:['crane_a','crane_b'] }],
  711:[{ prop:'blueprint', byCast:true }],
  723:[{ prop:'blueprint', byCast:true }],
  870:[{ prop:'mocksign', byCast:true }],
};
function screenRect(fr, b) {
  const pts = corners(b).map(p => fr.screen(p)).filter(Boolean);
  if (pts.length < 4) return null;
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}
function overlapFrac(a, b) {
  const x0 = Math.max(a[0], b[0]), y0 = Math.max(a[1], b[1]), x1 = Math.min(a[2], b[2]), y1 = Math.min(a[3], b[3]);
  if (x1 <= x0 || y1 <= y0) return 0;
  return ((x1 - x0) * (y1 - y0)) / Math.max(1, (a[2] - a[0]) * (a[3] - a[1]));
}
function matchDisc(id,t,fr,m){
  const p=posAt(id,t), head=[p[0],1.9,p[2]], proj=fr.screen(head), diam=fr.height(1,head);
  if(!proj||!diam)return null;
  const candidates=[];
  for(const d of m.discs){const dist=Math.hypot(d.centre[0]-proj[0],d.centre[1]-proj[1]);
    const dh=d.disc[3]-d.disc[1],ratio=dh/diam;
    if(dist<=780&&ratio>=.45&&ratio<=2.4)candidates.push({d,dist,ratio,score:dist+400*Math.abs(Math.log(Math.max(ratio,.05)))});}
  candidates.sort((a,b)=>a.score-b.score);
  if(!candidates.length)return {status:'missing'};
  if(candidates.length>1&&candidates[1].score-candidates[0].score<150)return {status:'ambiguous',candidates:candidates.slice(0,2)};
  return {...candidates[0],depth:fr.depth(head),proj,diam};
}
function measure(frameNo) {
  const file = join(STILLS, `frame_${String(frameNo).padStart(4, '0')}.png`);
  const out = execFileSync('python3', [join(ROOT, 'tools/pixel_measure.py'), file], { encoding: 'utf8', maxBuffer: 1 << 24 });
  return JSON.parse(out);
}
// pass 1: pixel measurements for every judged frame + per-shot S5 medians
const measured = new Map();
for (const [frameNo] of moments) {
  if (ONLY && !ONLY.includes(frameNo)) continue;
  measured.set(frameNo, measure(frameNo));
}
const byShot = {};
for (const [frameNo, , shotId] of moments) {
  if (!measured.has(frameNo)) continue;
  (byShot[shotId] ??= []).push(measured.get(frameNo));
}
const median = xs => { const s = [...xs].sort((a, b) => a - b); const n = s.length; return n % 2 ? s[(n - 1) / 2] : Math.round((s[n / 2 - 1] + s[n / 2]) / 2 * 10) / 10; };
const shotS5 = {};
for (const [shotId, ms] of Object.entries(byShot)) {
  const d = median(ms.map(m => m.detail_pct)), f = median(ms.map(m => m.flat_pct));
  shotS5[shotId] = { d, f, pass: d >= 22 && f <= 78 };
}
let failed = 0;
console.log('PIXEL GATE — fudai-wall chunk 2 (19 key frames)');
for (const [frameNo, t, shotId] of moments) {
  if (ONLY && !ONLY.includes(frameNo)) continue;
  const shot = shotById(shotId); if (!shot) { console.log(`F${frameNo} FAIL missing shot`); failed++; continue; }
  const cam = camAt(shot, t), fr = makeFrame(cam);
  const m = measured.get(frameNo);
  const checks = [];
  // (c) set bar on pixels - per-SHOT verdict (RULES S5), frame numbers printed
  const s5 = shotS5[shotId];
  checks.push(`SET frame detail ${m.detail_pct}% flat ${m.flat_pct}%; shot ${shotId} median detail ${s5.d}% flat ${s5.f}% ${s5.pass ? 'PASS' : 'FAIL'}`);
  // (a) head crop on measured discs
  const reqFace = (id) => {
    const p = posAt(id, t), head = [p[0], 1.9, p[2]];
    const proj = fr.screen(head), diam = fr.height(1, head);
    if (!proj || !diam) { checks.push(`${id} face PIXEL FAIL behind camera`); return false; }
    const matched=matchDisc(id,t,fr,m), best=matched?.status?null:matched;
    if (!best) { checks.push(`${id} face PIXEL FAIL ${matched?.status==='ambiguous'?'ambiguous rendered disc match':'no rendered disc matches projection'} (proj centre [${proj.map(v=>v.toFixed(0))}] diam ${diam.toFixed(0)}px; discs found ${m.discs.length})`); return false; }
    const [x0, y0, x1, y1] = best.d.disc, [sx0, sy0] = best.d.skin;
    const skinCut = sx0 <= 2 || sy0 <= 2 || best.d.skin[2] >= 1077 || best.d.skin[3] >= 1917;
    const cross = Math.max(-x0, -y0, x1 - 1079, y1 - 1919);
    if (skinCut || cross > 24) { checks.push(`${id} face PIXEL FAIL head disc cut by edge (disc [${best.d.disc}] skin [${best.d.skin}] cross ${Math.max(0, cross).toFixed(0)}px)`); return false; }
    checks.push(`${id} face PIXEL PASS disc [${best.d.disc}] dist ${best.dist.toFixed(0)}px size ratio ${best.ratio.toFixed(2)}${cross > 0 ? ` (graze ${cross.toFixed(0)}px — watch)` : ''}`);
    return best;
  };
  for (const id of FACE_REQ[frameNo] || []) reqFace(id);
  if (PAIR_REQ[frameNo]) {
    const pair=PAIR_REQ[frameNo].map(id=>({id,match:matchDisc(id,t,fr,m)}));
    const unique=new Set(pair.filter(x=>x.match&&!x.match.status).map(x=>x.match.d));
    const ok=pair.length===2&&unique.size===2&&pair.every(x=>x.match&&!x.match.status&&x.match.d.skin[0]>2&&x.match.d.skin[1]>2&&x.match.d.skin[2]<1077&&x.match.d.skin[3]<1917&&Math.max(-x.match.d.disc[0],-x.match.d.disc[1],x.match.d.disc[2]-1079,x.match.d.disc[3]-1919)<=24);
    checks.push(`face pair PIXEL ${ok?'PASS':'FAIL'} (${pair.map(x=>`${x.id} ${x.match?.status|| (x.match?'matched':'unmatched')}`).join(', ')}${unique.size!==pair.length?', distinct discs required':''})`);
  }
  // (b) foreground occlusion, screen space
  for (const occ of OCC_REQ[frameNo] || []) {
    const q = propBox(occ.prop, t);
    if (!q) { checks.push(`${occ.prop} occlusion PIXEL FAIL prop absent`); continue; }
    const rect = screenRect(fr, q.box), pDepth = fr.depth(q.box.center);
    if (!rect) { checks.push(`${occ.prop} occlusion PIXEL FAIL prop off-frame`); continue; }
    let worst = 0, worstBy = null;
    const castIds = Object.keys(cast);
    if (occ.byCast) for (const id of castIds) {
      const p = posAt(id, t), head = [p[0], 1.9, p[2]];
      if (fr.depth(head) >= pDepth - 0.05) continue;
      const c = fr.screen(head), diam = fr.height(1, head);
      if (!c || !diam) continue;
      const r = 0.675 * diam;
      const f = overlapFrac(rect, [c[0] - r, c[1] - r, c[0] + r, c[1] + r]);
      if (f > worst) { worst = f; worstBy = `${id} disc`; }
    }
    for (const oid of occ.by || []) {
      const oq = propBox(oid, t); if (!oq) continue;
      if (fr.depth(oq.box.center) >= pDepth - 0.05) continue;
      const orect = screenRect(fr, oq.box); if (!orect) continue;
      const f = overlapFrac(rect, orect);
      if (f > worst) { worst = f; worstBy = oid; }
    }
    // pixel cross-check: measured skin discs vs the prop rect
    // Pixel evidence counts only a disc matched to a cast member that is
    // demonstrably nearer than this prop. Unmatched/background regions remain
    // visible in the measurement JSON but cannot be called occluders.
    let pix = 0, pixBy=null;
    for (const d of m.discs) for(const id of castIds){const hit=matchDisc(id,t,fr,m);
      if(!hit||hit.status||hit.d!==d||hit.depth>=pDepth-.05)continue;
      const f=overlapFrac(rect,d.disc);if(f>pix){pix=f;pixBy=id;}}
    const fail = worst > 0.10 || pix > 0.10;
    checks.push(`${occ.prop} occlusion PIXEL ${fail ? 'FAIL' : 'PASS'} (geometric overlap ${(worst * 100).toFixed(0)}%${worstBy ? ` by ${worstBy}` : ''}; measured-disc overlap ${(pix * 100).toFixed(0)}%${pixBy?` by ${pixBy}`:''})`);
  }
  const bad = checks.filter(c => c.includes('FAIL'));
  if (bad.length) failed++;
  console.log(`F${frameNo} | ${shotId} | ${bad.length ? 'FAIL' : 'PASS'} | ${checks.join('; ')}`);
}
if (!ONLY) {
  const shotMeds = Object.values(shotS5).map(s => s.d);
  const under = Object.values(shotS5).filter(s => !s.pass).length;
  const filmMed = median(shotMeds);
  console.log(`SET BAR (chunk scope): median shot detail ${filmMed}% (film bar >=28%); shots under bar ${under}/${Object.keys(shotS5).length} (bar <=40%)`);
}
console.log(failed ? `PIXEL GATE: FAIL (${failed} frame(s))` : 'PIXEL GATE: PASS (all frames)');
process.exitCode = failed ? 1 : 0;
