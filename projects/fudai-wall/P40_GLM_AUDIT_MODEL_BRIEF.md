# BRIEF — Phase 40: correct the staging audit's model to the engine's measured model (GLM seat, round 3)

You are the GLM seat (free/glm-5.3-flashx) authoring ONE change to ONE file:
`tools/audit_staging.mjs` in the Fudai Wall project (a static staging audit; pure Node).
The driver operates and verifies; you author. Output: ONE unified diff for that file, nothing else.

This is round 3 of this correction. Round 1 (phase 39) produced a diff whose SUBSTANCE was
largely correct — its `waveBody()` helper and its chunk-3 generic-branch wave case are
ADOPTED below as the starting point; refine them into a clean diff, do not redesign.
Round 1 failed on three PLACEMENT/DUPLICATION defects, and round 2 failed because the
corrective re-brief did not re-embed the file (the seat authored against an invented
source). This brief therefore re-embeds the FULL current file verbatim at the end, names
the three round-1 defects exactly, and forbids each. The diff must apply to the file
embedded below and to nothing else.

## Why (RUN_RECORD phase 38, measured on fleet tracks reading the engine's own pv)

The audit models a state the engine does not hold, in three named seams:

1. **Rests seam.** Both pipelines run the same `lowCams` (lib/film/end.js), but the engine
   feeds it STAGE-MEASURED rests while the audit reconstructs rests from the cast spec JSON
   (hipY = legLen*.93 = 1.256, headY = hipY + neckHeight + neckToHead = 1.956). The engine
   rests are a UNIFORM +0.354 offset: hipY 1.610 / headY 2.310 (hip-to-head span 0.700,
   identical in both models). Two-point exact fit: with engine rests, lowCams reproduces
   the engine's measured camera floors EXACTLY — SH18 floor 1.617 (head-bound on the
   walking villagers_shore), SH19 floor 1.960 (chest-bound on the standing mayor_young).
   The audit currently floors those shots at 1.263 / 1.606.
2. **Wave built geometry.** The wave kind (scenes/props/wave.js) builds its body as a box
   of size (w, h, 24) positioned at (0, h/2, -12+advance) relative to the entry origin, so
   the BUILT body centre = at + (0, h/2, -12+advance), where the build height is
   h = min(17.5, crestY ?? h) and w = w ?? width ?? 70, with h / crestY / advance
   resolved from the entry's keys at the sampled time. The audit instead models each wave
   as a box CENTRED AT THE ENTRY POINT with a fixed declared size (CHUNK3_SIZE), never
   tests whether the camera is inside a prop body, and waves are absent from its
   face-occluder list. Measured consequence (phase 37/38): at SH19 the sampled cameras
   sit INSIDE wave_old_sh19's built body (entry at [1191,-1.5,-17], w 14, h 5->8,
   advance 0->4.5; built centre [1191, 1.0..2.5, -29..-24.5]) — the render shows the
   wave body's inner wall, and the audit passed the staging.
3. Phase 38's engine-pv verdicts that must NOT flip on the baseline tree: SH19 F1367
   mayor head IN (face PASS), F1410 head OUT (FAIL), F1428 OUT (FAIL); SH18 F1302
   measure centre OUT (FAIL stands).

## The three round-1 defects — named exactly, each FORBIDDEN in this round

(i) Round 1 added a SECOND `const hipY = legLen * .93 + .354;` line below the existing
declaration — duplicate const, SyntaxError. FORBIDDEN: do not add any new hipY/headY
declaration. MODIFY the existing line in place (anchor A2 below). headY needs NO edit:
it is computed from hipY in the rest object, so the +0.354 flows through and the span
stays 0.700.

(ii) Round 1 inserted change 3's wave-occluder loop AFTER `return out; }`, at module
level where `t`/`out` do not exist — ReferenceError at import. FORBIDDEN: no code at
module level, and no code after any `return`. The wave-occluder addition goes INSIDE the
body of the existing one-line function `occs(t)` (anchor A4 below), appended to its `out`
array immediately BEFORE that function's own `return out;}` — inside the function, where
`t` and `out` exist.

(iii) Round 1 placed the camera-inside-wave test in the CHUNK-2 moments loop (not
chunk 3) and read `.name` off the object returned by `box()` (which returns
{center, min, max, size} — no name), so it would print `undefined`. FORBIDDEN: the
containment test goes in the CHUNK-3 moments loop ONLY (anchor A5 below), and the body
in its message is identified by the wave entry's own id taken from the prop record
(`p.id`), never by any field of the object `box()` returns.

## The four changes (confined to tools/audit_staging.mjs), each with its exact anchor

### Change 1 — engine rests (anchors A1 + A2)
A1 — header comment. REPLACE these two existing lines (file lines 6–7):
```
// Named assumptions: stage-dependent lowCams rests are unavailable, so the
// documented calibrated rest rule below is used. Camera roll is ignored (SH07
```
with:
```
// Named assumptions: lowCams rests are the engine's stage-measured constants
// (RUN_RECORD phase 38: hipY 1.610 / headY 2.310 = spec reconstruction + 0.354,
// two-point exact fit on the SH18 / SH19 floors). Camera roll is ignored (SH07
```
A2 — rests line. REPLACE this existing line (file line 49), in place, adding the offset
and a citing comment ABOVE it:
```
  const hipY = legLen * .93;
```
with:
```
  // Engine rests (RUN_RECORD phase 38): stage-measured hipY 1.610 / headY 2.310 =
  // this spec reconstruction + 0.354; headY below derives from hipY, span stays 0.700.
  const hipY = legLen * .93 + .354;
```
Do NOT touch the `const rest = { hipY, headY: hipY + ... }` line that follows — headY
derives from hipY there.

### Change 2 — wave built-body helper (anchor A3)
Insert a new function `waveBody(p, t)` IMMEDIATELY AFTER the existing one-line function
that begins `function propState(p,t){` (file line 118) and BEFORE the line that begins
`function dropState(p,t){` (file line 121). Adopt round 1's helper substance verbatim:
it returns null unless p.kind === 'wave'; visibility = the last key at-or-before t
carrying a `hidden` field governs, else the entry-level `hidden ?? false`; hidden =>
null; keyed numeric fields resolve with the SAME step semantics as propState's inner
`val()` (last key at-or-before t carrying the field wins; entry top-level is the
default; an `ease` on the governing key ramps smoothstep from the previous keyed value
over `ease` seconds); fields h, crestY (may be absent => null), advance (default 0);
buildH = Math.min(17.5, crestY ?? h ?? 17.5); w = p.w ?? p.width ?? 70; position `at`
from propState(p, t).at; return box([at[0], at[1] + buildH/2, at[2] - 12 + advance],
[w, buildH, 24]).

### Change 3 — waves as occluders (anchor A4)
The existing function `occs(t)` is ONE line (file line 117), ending in `return out;}`:
```
function occs(t){const out=solids.map(b=>({...b}));out.push({name:'seawall',...box([0,9,-16],[90,18,1.15])});const g=props.find(p=>p.id==='gateleaf');if(g){const st=propState(g,t);if(st.visible)out.push({name:'gateleaf',...box(add(st.at,[0,17.88*(st.lift-.5),0]),[7,17.88,.36])});}return out;}
```
INSIDE that line, immediately BEFORE its final `return out;}`, insert:
```
for(const p of props){const b=waveBody(p,t);if(b)out.push({name:p.id,...b});}
```
Nothing goes after the line; nothing goes at module level. (occluder() and the chunk-2
camera-inside check read occs(), so this one addition makes waves face occluders and
containment solids everywhere occs() is consulted.)

### Change 4 — chunk-3 loop: containment FAIL test + built-body wave checks (anchors A5 + A6)
A5 — containment test. In the CHUNK-3 moments loop (the loop beginning
`for(const [frameNo,t,shotId,type,id,threshold] of chunk3Moments){`, file line 198),
insert a new block IMMEDIATELY AFTER this existing line (file line 200):
```
 if(!shot){checks.push('missing shot');chunk3Results.push({frameNo,t,shotId,checks});continue;}
```
and BEFORE the next line, which begins ` if(type==='occupancy'&&film.cast[id]){`.
The sampled camera position is available as `fr.cam.pos` (makeFrame stores the camera
it was built from). The block: for every prop p with p.kind === 'wave', compute
waveBody(p, t); if non-null and fr.cam.pos lies strictly inside the body on all three
axes (pos[i] > min[i] && pos[i] < max[i], NO margin), push exactly one check line of the
form `camera inside ${p.id} built body FAIL` into this moment's `checks` (the id from
the prop record — see defect (iii)). Pushed here, the line rides EVERY branch of the
loop, including the early-pushing occupancy/cast branch.
A6 — built-body wave case. In the generic prop branch of the same loop, insert a new
`else if (p.kind === 'wave')` case IMMEDIATELY AFTER the existing line that begins
`   else if(type==='crest'){` and IMMEDIATELY BEFORE the existing line that begins
`   else if(frameNo===1647){`. Adopt round 1's case substance verbatim: if waveBody(p, t)
is null, push `${id} FAIL absent`; otherwise compute the check from the BUILT body —
center = body.center, size = body.size — with the same pass rule and message shape as
the generic else branch (`!hidden && inFrame && px != null && px >= threshold`, px from
fr.height(size[1], center), inFrame from fr.point(center)). When waveBody is null the
moment keeps the FAIL absent line only. Do not alter the state/crest/F1647/generic-else
branches themselves.

### Header attribution (required)
Insert this ONE line into the header comment block IMMEDIATELY AFTER the existing line
that begins `// Phase-19 P19_GLM_F1647_BRIEF.md (GLM seat):` (file line 16) and BEFORE
the line that begins `// D2-CLEAR solids are copied` (file line 17):
```
// Phase-40 P40_GLM_AUDIT_MODEL_BRIEF.md (GLM seat): audit model corrected to the engine's measured model per RUN_RECORD phase 38 — engine rests (+0.354), wave built-geometry bodies, camera-inside-wave FAIL test, waves as face occluders.
```

## Acceptance anchors (the driver will verify these on the baseline tree)
- The LOWCAMS log shows the villagers_shore shot raised to y 1.62 and the mayor_young
  shot raised to y 1.96 (engine floors SH18 1.617 / SH19 1.960 reproduced exactly).
- Baseline verdicts unchanged: F1367 face PASS; F1410 FAIL; F1428 FAIL; F1302 FAIL.
- Baseline containment: F1367 gains a `camera inside wave_old_sh19 built body FAIL`
  line; F1410 and F1428 gain NO containment line.
- On the phase-37 candidate tree (a different film.js, applied later by the driver),
  F1367, F1410 and F1428 must EACH gain the containment FAIL line for wave_old_sh19.

## Output format
Reply with ONLY a unified diff (git format, --- a/tools/audit_staging.mjs,
+++ b/tools/audit_staging.mjs) that applies cleanly to the file below. No prose.

## The current file, verbatim:
```js
// Static staging audit for Fudai Wall, chunks 2–3. Pure Node; no renderer/deps.
// Chunk 3 moment declarations and reconciliation rules: P11_MERGE_CHUNKS_BRIEF.md.
// Geometry uses calibrated head centre y=1.9, r=.5, hip=1.35, top=2.4: phase-6
// engine measurement was ~1.85–1.95; F0 (target 1.55, dist 5.1, fov 34) passes
// and F687 (dist 2.9, fov 30) crops, consistent with this model and not y=1.55.
// Named assumptions: stage-dependent lowCams rests are unavailable, so the
// documented calibrated rest rule below is used. Camera roll is ignored (SH07
// is ≤5°). Face-limit clamping from the renderer is not applied. Box frustum
// corner counts use a world AABB after yaw rotation, per the audit specification.
// Phase-11 F570 face-staging amendment (Codex seat): see RUN_RECORD phase 11.
// Phase-12 P12_FIX_CAST_PLACE_BRIEF.md (Codex seat): root place keys are measured
// as snaps, per engine/compose.js place layer and engine/height.js addPlace.
// Phase-14 P14_GLM_CAUSE7_BRIEF.md (GLM seat): F1197 sea_sheet state rider restored per Qwen's declared moment.
// Phase-14 P14_GLM_ITEM16_REBRIEF.md (GLM seat): neighbour village widened — seven houses at the wall's foot (set.js + mirrors).
// Phase-19 P19_GLM_MATCHCUT_BRIEF.md (GLM seat): match-cut block reads the seawall from the resolved prop array (props.find) — h(t0) from the hero keys, restoring the check's documented definition; dispatcher's ruling 2026-11-23 (RUN_RECORD phase 19).
// Phase-19 P19_GLM_F1647_BRIEF.md (GLM seat): F1647 case amended per dispatcher's ruling 2026-11-23 (RUN_RECORD phase 19) — tested point re-pointed to the declared subject (wall top [0, h(t), -16]); threshold 400px unchanged; h >= 17.0 rider explicit.
// D2-CLEAR solids are copied from tools/audit_d1_d2.mjs (town hall, ten village
// houses, three neighbour houses); wall and gateleaf are additional occluders.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import film from '../scenes/film.js';
import { resolver, resolveTimes, autoMove } from '../lib/film/resolve.js';
import { easeFn } from '../engine/ease.js';
import { lowCams } from '../lib/film/end.js';
import { hh } from '../engine/clips.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
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

// Reconstruct the loader's character/rest inputs from each cast spec. These
// specs share the renderer's proportion fields; hip and head heights stay tied
// to the character's leg, neck, and head dimensions.
const characters = Object.entries(cast).map(([name, c]) => {
  const raw = JSON.parse(readFileSync(join(ROOT, 'scenes', c.spec), 'utf8'));
  const spec = { ...raw, id: name };
  const legLen = spec.limbs?.legLen ?? 1.35;
  const hipY = legLen * .93;
  const armLen = spec.limbs?.armLen ?? .95;
  const rest = { hipY, headY: hipY + (spec.body?.neckHeight ?? .35) + (spec.body?.neckToHead ?? .35), neckToHead: spec.body?.neckToHead ?? .35, legLen, armLen,
    ankleY: (spec.limbs?.width ?? .058) / 2 + .005, hipR: [-.22, -.2, 0], hipL: [.22, -.2, 0],
    shoulderR: [-.4, .4, 0], shoulderL: [.4, .4, 0], neck: [0, .4, 0] };
  const timeline = resolveTimes(JSON.parse(JSON.stringify(acts[name] || {})), R, `acts.${name}`);
  timeline.root = timeline.root || { x: c.at?.[0] ?? 0, z: c.at?.[1] ?? 0, ry: c.ry ?? 0 };
  timeline.settle ??= true;
  return { name, spec, timeline, rest };
});
const rests = Object.fromEntries(characters.map(ch => [ch.name, ch.rest]));

function posAt(id, t) {
  const c = cast[id], base = c.at, a = acts[id] || {};
  const events = [
    ...(a.place || []).filter(k => t >= k.t).map(k => ({ ...k, kind: 'place', order: 0 })),
    ...(a.walk || []).filter(w => t >= w.t0).map(w => ({ ...w, t: w.t0, kind: 'walk', order: 1 }))
  ].sort((x,y) => x.t-y.t || x.order-y.order);
  const event = events.at(-1);
  if (!event) return [base[0], 0, base[1]];
  if (event.kind === 'place') return [event.at[0], event.y ?? 0, event.at[1]];
  const w = event, path = w.path, speed = w.speed || 1;
  let remain = Math.max(0, t - w.t0) * speed;
  for (let i=1;i<path.length;i++) {
    const a=path[i-1], b=path[i], d=Math.hypot(b[0]-a[0],b[1]-a[1]);
    if (remain <= d) { const u=d ? remain/d:1; return [a[0]+(b[0]-a[0])*u,0,a[1]+(b[1]-a[1])*u]; }
    remain -= d;
  }
  const p=path.at(-1); return [p[0],0,p[1]];
}
function faceAt(id,t,p) {
  const a=acts[id]||{}, events=[
    ...(a.place||[]).filter(k=>t>=k.t).map(k=>({...k,kind:'place',order:0})),
    ...(a.walk||[]).filter(w=>t>=w.t0).map(w=>({...w,t:w.t0,kind:'walk',order:1}))
  ].sort((x,y)=>x.t-y.t||x.order-y.order), governing=events.at(-1);
  if(governing?.kind==='walk'){const w=governing, path=w.path;let rem=Math.max(0,t-w.t0)*(w.speed||1);
    for(let i=1;i<path.length;i++){const d=Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]);if(rem<=d)return [path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]];rem-=d;}
    const n=path.length;return [path[n-1][0]-path[n-2][0],path[n-1][1]-path[n-2][1]]; }
  const look=(a.look||[]).filter(k=>k.t<=t).sort((x,y)=>x.t-y.t).at(-1);
  if(look)return [look.at[0]-p[0],look.at[2]-p[2]];
  const ry=(cast[id].ry||0)*Math.PI/180;return [Math.sin(ry),Math.cos(ry)];
}
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,u)=>a+(b-a)*u;
function lerpV(a,b,u){return a.map((v,i)=>lerp(v,b[i],u));}
const raises=[];
const lowered = lowCams(shots, characters, rests, { log: msg => raises.push(msg) });
shots = lowered.shots;
const moved=await autoMove(shots,dur);
const shotById=id=>moved.find(s=>s.id===id);

function camAt(shot,t){const c=shot.camera,a=c.t0??shot.t0,b=c.t1??shot.t1;let u=clamp((t-a)/(b-a));u=easeFn(c.ease??'outCubic')(u);return {pos:lerpV(c.from.pos,c.to.pos,u),target:lerpV(c.from.target,c.to.target,u),fov:lerp(c.from.fov??26,c.to.fov??26,u)};}

function add(a,b){return a.map((x,i)=>x+b[i]);}
function ry(v,yaw){const a=yaw*Math.PI/180;return [v[0]*Math.cos(a)+v[2]*Math.sin(a),v[1],-v[0]*Math.sin(a)+v[2]*Math.cos(a)];}
function box(center,size,yaw=0){const [x,y,z]=size,a=Math.abs(yaw*Math.PI/180);const ex=Math.abs(x*Math.cos(a))+Math.abs(z*Math.sin(a)),ez=Math.abs(x*Math.sin(a))+Math.abs(z*Math.cos(a));return {center,min:[center[0]-ex/2,center[1]-y/2,center[2]-ez/2],max:[center[0]+ex/2,center[1]+y/2,center[2]+ez/2],size:[ex,y,ez]};}
function corners(b){const out=[];for(const x of [b.min[0],b.max[0]])for(const y of [b.min[1],b.max[1]])for(const z of [b.min[2],b.max[2]])out.push([x,y,z]);return out;}
function makeFrame(cam){const f=norm(sub(cam.target,cam.pos)), right=norm(cross(f,[0,1,0])), up=norm(cross(right,f));const v=cam.fov*Math.PI/180,h=2*Math.atan(Math.tan(v/2)*1080/1920);const planes=[];
  for(const [axis,ang,other,swap] of [[right,h/2,up,false],[neg(right),h/2,up,true],[up,v/2,right,true],[neg(up),v/2,right,false]]){const edge=norm(add(f,mul(axis,Math.tan(ang))));let n=norm(swap?cross(other,edge):cross(edge,other));if(dot(n,f)<0)n=neg(n);planes.push({n});}
  planes.push({n:f,dot:0,origin:cam.pos,near:true},{n:neg(f),dot:0,origin:cam.pos,far:true});
  return {cam,planes,point(p){const d=sub(p,cam.pos);return dot(d,f)>=.1&&dot(d,f)<=2000&&planes.slice(0,4).every(pl=>dot(d,pl.n)>=-1e-7);},sphere(p,r){const d=sub(p,cam.pos);return dot(d,f)-r>=.1&&dot(d,f)+r<=2000&&planes.slice(0,4).every(pl=>dot(d,pl.n)>=r-1e-7);},depth(p){return dot(sub(p,cam.pos),f);},height(size,p){const d=this.depth(p);return d>0?2*Math.atan(size/(2*d))/(cam.fov*Math.PI/180)*1920:null;},width(size,p){const d=this.depth(p);return d>0?2*Math.atan(size/(2*d))/(h)*1080:null;},screen(p){const d=sub(p,cam.pos),z=dot(d,f);if(z<=.1)return null;const x=dot(d,right)/(z*Math.tan(h/2)),y=dot(d,up)/(z*Math.tan(v/2));return [(x+1)*540,(1-y)*960];}};
}
const sub=(a,b)=>a.map((v,i)=>v-b[i]), mul=(a,k)=>a.map(v=>v*k), dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0), norm=a=>mul(a,1/(Math.hypot(...a)||1)), cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]], neg=a=>mul(a,-1);
function segBox(p0,p1,b){let lo=0,hi=1;for(let i=0;i<3;i++){const d=p1[i]-p0[i];if(Math.abs(d)<1e-9){if(p0[i]<b.min[i]||p0[i]>b.max[i])return null;}else{let a=(b.min[i]-p0[i])/d,z=(b.max[i]-p0[i])/d;if(a>z)[a,z]=[z,a];lo=Math.max(lo,a);hi=Math.min(hi,z);if(lo>hi)return null;}}return lo>1e-6&&lo<1-1e-6?lo:null;}
function occluder(p0,p1,t,exclude){return occs(t).filter(o=>o.name!==exclude).map(o=>({name:o.name,k:segBox(p0,p1,o)})).filter(x=>x.k!=null).sort((a,b)=>a.k-b.k)[0]?.name||null;}
const solids=[{name:'town hall',min:[-4.5,0,9.5],max:[4.5,6.4,18.5]}];
for(const [x,z] of [[-16,-3],[-10,-4],[-20,3],[-14,7],[-8,11],[8,-4],[14,-2],[20,3],[14,10],[6,12]])solids.push({name:`village house @${x},${z}`,min:[x-2.45,0,z-2.05],max:[x+2.45,6,z+2.05]});
for(const x of [585,590,595,600,605,610,615])solids.push({name:`neighbour house @${x}`,min:[x-2.45,0,-2-2.05],max:[x+2.45,5.6,-2+2.05]});
function occs(t){const out=solids.map(b=>({...b}));out.push({name:'seawall',...box([0,9,-16],[90,18,1.15])});const g=props.find(p=>p.id==='gateleaf');if(g){const st=propState(g,t);if(st.visible)out.push({name:'gateleaf',...box(add(st.at,[0,17.88*(st.lift-.5),0]),[7,17.88,.36])});}return out;}
function propState(p,t){const ks=p.keys||[], before=ks.filter(k=>k.t<=t).sort((a,b)=>a.t-b.t), key=before.at(-1)||{};const lastField=f=>before.filter(k=>k[f]!=null).at(-1)?.[f];const visible=key.drop?true:(lastField('in')??p.in??'world')==='world';const at=[...(lastField('at')??p.at)],rot=[...(lastField('rot')??p.rot??[0,0,0])];
  const val=(field,def)=>{if(p[field]==null)return def;const keyed=before.filter(k=>k[field]!=null);if(!keyed.length)return p[field];const prev=keyed.at(-1),ix=keyed.length-1,ease=prev.ease;if(ease!=null&&ix>0){const prior=keyed[ix-1],u=clamp((t-prev.t)/ease);const sm=u*u*(3-2*u);return lerp(prior[field],prev[field],sm);}return prev[field];};
  return {visible,at,rot,page:val('page',0),h:val('h',.8),lift:val('lift',0),lineY:val('lineY',1),pin:val('pin',0),cx:val('cx',0),cy:val('cy',12)};}
function dropState(p,t){const k=(p.keys||[]).filter(k=>k.t<=t).at(-1);if(!k?.drop)return null;const d=k.drop,dt=t-k.t,g=d.g??9.8,v0=d.v0||[0,0,0],from=d.from||k.at||p.at,ground=d.ground??0,a=g/2,c=from[1]-ground,T=a>0?(v0[1]+Math.sqrt(v0[1]**2+4*a*Math.max(0,c)))/(2*a):Infinity;if(d.hide&&dt>T)return null;const u=Math.min(dt,T),y=from[1]+v0[1]*u-.5*g*u*u;return [from[0]+v0[0]*u,y,from[2]+v0[2]*u];}
function boxCheck(frame,b,minPx=0,skipOcc=false,name='subject'){const n=corners(b).filter(p=>frame.point(p)).length,center=frame.point(b.center),px=frame.height(b.size[1],b.center),pw=frame.width(b.size[0],b.center),by=!skipOcc?occluder(frame.cam.pos,b.center,currentTime,name):null,behind=frame.depth(b.center)<=0;return {pass:center&&!by&&px!=null&&px>=minPx&&(n>=4||px>=1920||pw>=1080),n,px,pw,center,occluded:by,behind};}
let currentTime=0;
function propBox(id,t){const p=props.find(x=>x.id===id);if(!p)return null;const s=propState(p,t);if(!s.visible)return null;const a=s.at,r=s.rot[1]||0,kind=p.kind;let B,points=[];
  if(kind==='boardsign')B=box(add(a,[0,(p.post?p.leg||1.2:0)+(p.h||.8)/2,0]),[p.w||2,p.h||.8,.12],r);
  if(kind==='calendar')B=box(add(a,[0,1.9,0]),[2.2,3.5,.2],r);
  if(kind==='measure'){if(id.endsWith('label'))return null;}
  if(kind==='money')B=box(add(a,[0,.55,0]),[3.7,1.15,2.1],r);
  if(kind==='crane')B=box(add(a,ry([2,8,0],r)),[11.5,16.8,1.2],r);
  if(kind==='gateleaf')B=box(add(a,[0,17.88*(s.lift-.5),0]),[7,17.88,.36],r);
  if(kind==='seawall')B=box(add(a,[0,9,0]),[90,18,1.15],r);
  if(kind==='blueprint')B=box(add(a,[0,1.7,0]),[3.4,3.4,.2],r);
  if(kind==='orb')return {sphere:add(a,[s.cx,s.cy,0]),r:p.r||1.5,state:s};
  if(kind==='coins'){const q=dropState(p,t);return q?{box:box(q,[.5,.5,.5]),state:s}:null;}
  return B?{box:B,state:s}:null;
}
const houseBoxes=[585,590,595,600,605,610,615].map(x=>box([x,2.1,-2],[4,4.2,3.5]));
const wallBox=box([600,6,-10],[24,12,.8]);
const moments=[
 [219,7.3,'SH04'],[241,8.0333333333,'SH04'],[288,9.6,'SH05'],[345,11.5,'SH05'],[414,13.8,'SH05'],[474,15.8,'SH06'],[537,17.9,'SH07'],[570,19,'SH07'],[590,19.6666667,'SH07B'],[621,20.7,'SH08'],[639,21.3,'SH08'],[669,22.3,'SH09'],[687,22.9,'SH09'],[711,23.7,'SH10'],[723,24.1,'SH10'],[768,25.6,'SH11'],[798,26.6,'SH11'],[822,27.4,'SH11'],[870,29,'SH12']
];
const chunk3Moments=[
 [933,31.10,'SH13','point','mocker_b'],[942,31.40,'SH13','prop','box_sh13',60],[969,32.30,'SH13','face','mayor_old',120],
 [993,33.10,'SH14','prop','gravestone_sh14',90],[1026,34.20,'SH14','prop','leaf_sh14',25],[1056,35.20,'SH14','prop','wall_distant_sh14',40],
 [1083,36.10,'SH15','state','calendar',14],[1101,36.70,'SH15','prop','calendar',200],[1110,37.00,'SH15','prop','calendar',220],
 [1131,37.70,'SH16','body','villagers',230],[1137,37.90,'SH16','prop','birds_sh16',25],[1155,38.50,'SH16','face','villagers',80],
 [1188,39.60,'SH17','state','sea_sheet_sh17',6],[1197,39.90,'SH17','prop','boat_sh17_a',40],[1215,40.50,'SH17','prop','boat_sh17_b',40],
 [1257,41.90,'SH18','prop','wave_sh18',300],[1302,43.40,'SH18','prop','measure_wave',200],[1335,44.50,'SH18','prop','wave_sh18',500],
 [1367,45.57,'SH19','face','mayor_young',45],[1410,47.00,'SH19','face','mayor_young',55],[1428,47.60,'SH19','prop','wave_old_sh19',120],
 [1497,49.90,'SH20','prop','carved_line_sh20',120],[1518,50.60,'SH20','face','mayor_young',350],[1542,51.40,'SH20','body','mayor_young',600],
 [1599,53.30,'SH21','prop','pencil_mark_sh21',140],[1635,54.50,'SH21','face','child',380],[1647,54.90,'SH22','prop','seawall',400],
 [1677,55.90,'SH22','prop','pour_sh22',180],[1716,57.20,'SH22','body','workers',240],[1764,58.80,'SH23','prop','wave_neighbor_sh23',600],
 [1806,60.20,'SH23','prop','wave_neighbor_sh23',700],[1827,60.90,'SH23','occupancy','wave_neighbor_sh23',230],
 [1863,62.10,'SH24','prop','spray_hero_sh24',260],[1896,63.20,'SH24','prop','wave_hero_sh24',500],[1908,63.60,'SH24','crest','wave_hero_sh24',17.5],
 [1944,64.80,'SH25','prop','sunbeam_sh25',400],[1953,65.10,'SH25','occupancy','villagers',230],[1980,66.00,'SH26','face','mocker_a',240],
 [2001,66.70,'SH26','prop','gravestone_sh26',300],[2022,67.40,'SH26','prop','wall_distant_sh26',450]
];
function pointCheck(frame,p){return frame.point(p)&&!occluder(frame.cam.pos,p,currentTime);}
function screenVerticalSpan(frame, points){const ys=points.map(p=>frame.screen(p)).filter(p=>p!==null).map(p=>p[1]);return ys.length?Math.max(...ys)-Math.min(...ys):0;}
function faceCheck(frame,id,t,minPx=0){const p=posAt(id,t),head=[p[0],p[1]+1.9,p[2]],f=faceAt(id,t,p),to=[frame.cam.pos[0]-p[0],frame.cam.pos[2]-p[2]],angle=Math.acos(clamp(dot(norm(f),norm(to)),-1,1))*180/Math.PI;const visible=frame.sphere(head,.5),occ=occluder(frame.cam.pos,head,t),px=frame.height(1,head);return {pass:angle<=60&&visible&&!occ&&px!=null&&px>=minPx,angle,visible,occ,px};}
const results=[];
for(const [frameNo,t,shotId] of moments){currentTime=t;const shot=shotById(shotId);if(!shot){results.push({frameNo,shotId,checks:['missing shot']});continue;}const cam=camAt(shot,t),fr=makeFrame(cam),checks=[];let occupancy=false;
 if(cam.fov<24||cam.fov>50)checks.push(`fov ${cam.fov.toFixed(2)} out of grammar [24, 50]`);
 const inside=occs(t).find(o=>cam.pos.every((v,i)=>v>=o.min[i]-.3&&v<=o.max[i]+.3));
 if(inside)checks.push(`camera inside ${inside.name}`);
 const prop=(id,minPx,component)=>{let q=propBox(id,t);if(id==='measure_plate'){const p=props.find(x=>x.id==='measure'),s=propState(p,t);q={box:box(add(s.at,[.32,p.full??18,0]),[1.35,.42,.1],s.rot[1]||0),state:s};}
  if(id==='seawall_gate'){const p=props.find(x=>x.id==='seawall'),s=propState(p,t);q={box:box(add(s.at,[0,8.94,.62]),[7,17.88,.55]),state:s};}
  if(!q){checks.push(`${id} absent`);return false;}let ck;if(q.sphere){const inside=fr.sphere(q.sphere,q.r),oc=occluder(cam.pos,q.sphere,t,id),px=fr.height(q.r*2,q.sphere);ck={pass:inside&&!oc&&px!=null&&px>=minPx,px,inside,oc,behind:fr.depth(q.sphere)<=0};}
  else {ck=boxCheck(fr,q.box,minPx,false,id);}
  const by=ck.occluded||ck.oc;checks.push(`${id} ${ck.pass?'PASS':'FAIL'} ${ck.px?.toFixed(0)??'n/a'}px${ck.behind?' behind camera':''} corners ${ck.n??'-'}/8${by?` occluded by ${by}`:''}`);if(ck.center&&ck.px>=230)occupancy=true;return ck.pass;};
 const face=(id,minPx=0)=>{const f=faceCheck(fr,id,t,minPx),p=posAt(id,t),behind=fr.depth([p[0],p[1]+1.9,p[2]])<=0;checks.push(`${id} face ${f.pass?'PASS':'FAIL'} angle ${f.angle.toFixed(1)}° head ${behind?'behind camera':f.visible?'in':'out'} ${f.px?.toFixed(0)??'n/a'}px${f.occ?` occluded by ${f.occ}`:''}`);if(f.visible&&f.px>=230)occupancy=true;return f.pass;};
 const body=(id,b)=>{const ck=boxCheck(fr,b,0,true,id);return ck.pass;};
 const bodyIds=ids=>ids.filter(id=>{const p=posAt(id,t),b=box([p[0],p[1]+1,p[2]],[.9,2,.5]);return body(id,b);});
 const point=(name,p)=>{const pass=pointCheck(fr,p),behind=fr.depth(p)<=0;checks.push(`${name} ${pass?'PASS':'FAIL'} point ${behind?'behind camera':pass?'in':'out'} frustum`);return pass;};
 switch(frameNo){
 case 219: face('mayor');{const n=bodyIds(['villager_1','villager_2','villager_3','villager_4','villager_5','villager_6','mocker_a','mocker_b','mocker_c']).length;checks.push(`BODY ${n>=2?'PASS':'FAIL'} ${n}/2`);}break;
 case 241: face('mayor');prop('popsign',60);{const n=bodyIds(['villager_1','villager_2','villager_3','villager_4','villager_5','villager_6','mocker_a','mocker_b','mocker_c']).length;checks.push(`BODY ${n>=2?'PASS':'FAIL'} ${n}/2`);}break;
 case 288: prop('crane_a',120)||prop('crane_b',120);prop('money',60);prop('moneysign',60);break;
 case 345: prop('calendar',120);checks.push(`calendar effPage ${propState(props.find(p=>p.id==='calendar'),t).page.toFixed(1)}${propState(props.find(p=>p.id==='calendar'),t).page>=5?' PASS':' FAIL'}`);prop('seawall_gate',200);break;
 case 414: prop('measure_plate',40);checks.push(`measure effH ${propState(props.find(p=>p.id==='measure'),t).h.toFixed(1)}${propState(props.find(p=>p.id==='measure'),t).h>=17?' PASS':' FAIL'}`);prop('calendar',120);checks.push(`calendar effPage ${propState(props.find(p=>p.id==='calendar'),t).page.toFixed(1)}${propState(props.find(p=>p.id==='calendar'),t).page>=10?' PASS':' FAIL'}`);checks.push(`gateleaf effLift ${propState(props.find(p=>p.id==='gateleaf'),t).lift.toFixed(2)}${propState(props.find(p=>p.id==='gateleaf'),t).lift>=.9?' PASS':' FAIL'}`);break;
 case 474: {const c=boxCheck(fr,wallBox,150,true,'neighbour wall');checks.push(`neighbour wall ${c.pass?'PASS':'FAIL'} ${c.px?.toFixed(0)??'n/a'}px corners ${c.n}/8`);if(c.center&&c.px>=230)occupancy=true;prop('sticker_a',60);prop('sticker_b',60);const n=houseBoxes.filter(b=>boxCheck(fr,b,0,true).pass).length;checks.push(`neighbour houses ${n>=1?'PASS':'FAIL'} ${n}/1`);break;}
 case 537: face('mocker_a',200);break;
 case 570: { // wall-top requirement dropped per owner's option-(b) decision 2026-11-23 (RUN_RECORD phase 11); the beat is served at F590
  face('mocker_a',230);break;}
 case 590: {const cp=props.find(p=>p.id==='coins'),dropKey=cp.keys.find(k=>k.drop),coinPos=dropState(cp,t);checks.push(`coins drop-start ${dropKey?.t?.toFixed(3)??'n/a'}s position ${coinPos?`[${coinPos.map(v=>v.toFixed(2)).join(', ')}]`:'hidden'}`);prop('coins',24);point('wall top',[2,18,-15.42]);break;}
 case 621: case 639: {const ids=['mocker_a','mocker_b','mocker_c','villager_2','villager_4'],n=ids.filter(id=>faceCheck(fr,id,t).pass).length;checks.push(`faces ${n>=2?'PASS':'FAIL'} ${n}/2 (angle threshold 60°)`);for(const id of ids){const f=faceCheck(fr,id,t);checks.push(`${id} angle ${f.angle.toFixed(1)}° head ${f.visible?'in':'out'} ${f.px?.toFixed(0)??'n/a'}px${f.occ?` occluded by ${f.occ}`:''}`);if(f.pass&&f.px>=230)occupancy=true;}break;}
 case 669: face('mayor',250);break;case 687:face('mayor',200);break;
 case 711: prop('blueprint',150);{const p=props.find(x=>x.id==='blueprint'),s=propState(p,t);point('blueprint line',add(s.at,[.15,.75+s.lineY*1.9,.12]));point('blueprint palm',add(s.at,[1.42,.75+s.lineY*1.9,.13]));}break;
 case 723: prop('blueprint',150);{const p=props.find(x=>x.id==='blueprint'),s=propState(p,t);if(s.pin<1)checks.push(`blueprint ruler FAIL absent effPin ${s.pin}`);else{const b=box(add(s.at,[1.28,1.7,.14]),[.18,2.05,.07]);const q=boxCheck(fr,b,60,false,'blueprint ruler');checks.push(`blueprint ruler ${q.pass?'PASS':'FAIL'} ${q.px?.toFixed(0)??'n/a'}px corners ${q.n}/8`);}const l=boxCheck(fr,box(add(s.at,[1.3,2.82,.14]),[.9,.28,.06]),40,false,'blueprint label');checks.push(`blueprint label ${l.pass?'PASS':'FAIL'} ${l.px?.toFixed(0)??'n/a'}px corners ${l.n}/8`);}break;
 case 768: case 798: case 822: prop('seawall',300);{const seaCorners=[[-15,0,-40],[15,0,-40],[-15,0,-20],[15,0,-20]],span=screenVerticalSpan(fr,seaCorners),centreIn=fr.point([0,0,-30]),pass=centreIn&&span>=40;checks.push(`sea patch ${pass?'PASS':'FAIL'} ${span.toFixed(0)}px centre ${centreIn?'in':'out'}`);const id=frameNo===822?'moonorb':'sunorb';prop(id,0);}break;
 case 870: prop('mocksign',80);{const n=bodyIds(['mocker_b','mocker_c','villager_1','villager_3']).length;checks.push(`passers-by ${n>=2?'PASS':'FAIL'} ${n}/2`);}break;
 }
 if(!occupancy)checks.push('FAIL subjects do not occupy the frame (no required subject ≥230px)');
 results.push({frameNo,t,shotId,checks});
}
const CHUNK3_SIZE={box_sh13:[.75,.5,.55],gravestone_sh14:[.9,1.5,.25],leaf_sh14:[.28,.16,.03],wall_distant_sh14:[18,18,1.15],calendar:[2.2,3.5,.2],birds_sh16:[1.2,.5,.2],sea_sheet_sh17:[120,.04,80],boat_sh17_a:[3.1,3.2,1.2],boat_sh17_b:[3.1,3.2,1.2],wave_sh18:[90,17.5,24],measure_wave:[1.5,15,.2],old_village_sh19:[5.2,17,2.4],wave_old_sh19:[14,8,24],carved_line_sh20:[3.6,.24,.08],pencil_mark_sh21:[1.4,.35,.04],pour_sh22:[12,1,3.2],wave_neighbor_sh23:[70,17.5,24],wave_hero_sh24:[70,17.5,24],spray_hero_sh24:[26,4.5,3],sunbeam_sh25:[18,22,18],gravestone_sh26:[.95,1.5,.4],flowers_sh26:[.85,.4,.55],wall_distant_sh26:[90,18,1.15]};
const chunk3Results=[];
for(const [frameNo,t,shotId,type,id,threshold] of chunk3Moments){
 currentTime=t;const shot=shotById(shotId),fr=shot&&makeFrame(camAt(shot,t)),checks=[];
 if(!shot){checks.push('missing shot');chunk3Results.push({frameNo,t,shotId,checks});continue;}
 if(type==='occupancy'&&film.cast[id]){const pos=posAt(id,t),q=boxCheck(fr,box([pos[0],pos[1]+1,pos[2]],[1,2,.6]),0,true,id);checks.push(`${id} occupancy ${q.pass&&q.px>=threshold?'PASS':'FAIL'} ${q.px?.toFixed(0)??'n/a'}px corners ${q.n}/8`);chunk3Results.push({frameNo,t,shotId,checks});continue;}
 if(type==='prop'||type==='state'||type==='occupancy'||type==='crest'){
  const p=props.find(x=>x.id===id);
  if(!p)checks.push(`${id} FAIL absent`);
  else {const s=propState(p,t),size=CHUNK3_SIZE[id]||[1,1,1],center=s.at,px=fr.height(size[1],center),inFrame=fr.point(center),key=(p.keys||[]).filter(k=>k.t<=t).at(-1)||{},hidden=key.hidden===true||key.in==='hidden';
   if(type==='state') {const field=id==='calendar'?'page':id==='sea_sheet_sh17'?'pull':'h',val=key[field]??s[field]??p[field]??0;checks.push(`${id} state ${val>=threshold?'PASS':'FAIL'} ${field} ${val} >= ${threshold}`);}
   else if(type==='crest'){const w=p,wall=film.props.find(x=>x.id==='seawall'),ws=propState(wall,t),crest=key.crestY??key.h??w.crestY??w.h??0;const top=ws.h??wall.h;const topIn=fr.point([0,top,wall.at[2]]);checks.push(`SH24 crest margin ${crest<=17.5&&top===18&&topIn?'PASS':'FAIL'} wave crest ${crest.toFixed(2)} <= 17.50; wall top ${top.toFixed(2)}; wall-top in frame ${topIn?'yes':'no'}`);}
   else if(frameNo===1647){ // F1647 case amended per dispatcher's ruling 2026-11-23 (RUN_RECORD phase 19): the declared moment (CHUNK3B_HYDROGEN_REPLY.md line 476) is `seawall_hero >= 400 [state: h >= 17.0]` — the hero wall's rising top; the base-anchor point the generic fallback measured was never in the declared moment. Tested point re-pointed to the wall top [at[0], h(t), at[2]], size = h(t), threshold unchanged (400px), h >= 17.0 rider explicit.
    const top=[center[0],s.h,center[2]],topPx=fr.height(s.h,top),topIn=fr.point(top),pass=!hidden&&topIn&&topPx!=null&&topPx>=threshold&&s.h>=17;checks.push(`${id} ${pass?'PASS':'FAIL'} ${topPx?.toFixed(0)??'n/a'}px wall-top [${top.map(v=>v.toFixed(2)).join(', ')}] ${topIn?'in frustum':'out of frustum'}; state rider h ${s.h.toFixed(2)} >= 17.0 ${s.h>=17?'PASS':'FAIL'}`);}
   else {const pass=!hidden&&inFrame&&px!=null&&px>=threshold;checks.push(`${id} ${pass?'PASS':'FAIL'} ${px?.toFixed(0)??'n/a'}px ${inFrame?'in frustum':'out of frustum'}${hidden?' hidden':''}${type==='occupancy'?' occupancy subject':''}`);}
  }
 } else if(type==='face') {const f=faceCheck(fr,id,t,threshold);checks.push(`${id} face ${f.pass?'PASS':'FAIL'} angle ${f.angle.toFixed(1)}° head ${f.visible?'in':'out'} ${f.px?.toFixed(0)??'n/a'}px${f.occ?` occluded by ${f.occ}`:''}`);}
 else if(type==='body'){const pos=posAt(id,t),b=box([pos[0],pos[1]+1,pos[2]],[1,2,.6]),q=boxCheck(fr,b,threshold,false,id);checks.push(`${id} body ${q.pass?'PASS':'FAIL'} ${q.px?.toFixed(0)??'n/a'}px corners ${q.n}/8`);}
 else {const pos=posAt(id,t),tip=[pos[0],2.5,pos[2]],pass=pointCheck(fr,tip);checks.push(`${id} hand tip ${pass?'PASS':'FAIL'} point ${pass?'in':'out'} frustum`);}
 if(frameNo===1635||frameNo===1647){const child=film.props.find(x=>x.id==='pencil_mark_sh21'),wall=props.find(x=>x.id==='seawall'),s21=shotById('SH21'),s22=shotById('SH22'),fr21=makeFrame(camAt(s21,s21.t1)),fr22=makeFrame(camAt(s22,s22.t0)),wallState=propState(wall,s22.t0),y1=fr21.screen([child.at[0],child.at[1],child.at[2]]),y2=fr22.screen([wall.at[0],wallState.h,wall.at[2]]),ndc=y=>y?1-y[1]/960:null,n1=ndc(y1),n2=ndc(y2),pass=Math.abs(n1-.062)<.02&&Math.abs(n2-.062)<.02;checks.push(`SH21→SH22 match-cut NDC_y +0.062 ${pass?'PASS':'FAIL'}: ${n1?.toFixed(3)??'n/a'} / ${n2?.toFixed(3)??'n/a'} (target +0.062 on both)`);}
 if (frameNo === 1197) {
  const p = props.find(x => x.id === 'sea_sheet_sh17');
  const lastKey = p ? [...p.keys].filter(k => k.t <= t).pop() : null;
  const pull = lastKey ? (lastKey.pull ?? p.pull ?? 0) : (p ? p.pull ?? 0 : 0);
  checks.push(`sea_sheet_sh17 state rider ${pull >= 12 ? 'PASS' : 'FAIL'} pull ${pull} >= 12`);
 }
 chunk3Results.push({frameNo,t,shotId,checks});
}
if(raises.length){console.log('LOWCAMS raises:');for(const r of raises)console.log(`  ${r}`);}
console.log('FRAME | TIME | SHOT | RESULT | CHECKS');
let failed=0;
for(const r of results){const bad=r.checks.filter(x=>/FAIL| absent|do not occupy|out of grammar|camera inside/.test(x));if(bad.length)failed++;const shot=shotById(r.shotId),cam=shot&&camAt(shot,r.t);if(cam)console.log(`CAM F${r.frameNo} pos [${cam.pos.map(v=>v.toFixed(2)).join(', ')}] target [${cam.target.map(v=>v.toFixed(2)).join(', ')}] fov ${cam.fov.toFixed(2)}`);console.log(`F${r.frameNo} | ${r.t.toFixed(2)} | ${r.shotId} | ${bad.length?'FAIL':'PASS'} | ${r.checks.join('; ')}`);}
console.log(`${failed?`FAIL (${failed}/19 moments)`:'PASS (19/19 moments)'}`);
console.log('CHUNK 3 | FRAME | TIME | SHOT | RESULT | CHECKS');
let chunk3Failed=0;
for(const r of chunk3Results){const bad=r.checks.filter(x=>/FAIL|absent|out of frustum|out frustum/.test(x));if(bad.length)chunk3Failed++;console.log(`CHUNK3 F${r.frameNo} | ${r.t.toFixed(2)} | ${r.shotId} | ${bad.length?'FAIL':'PASS'} | ${r.checks.join('; ')}`);}
console.log(`CHUNK 3: ${chunk3Failed?`FAIL (${chunk3Failed}/40 moments)`:'PASS (40/40 moments)'}`);
process.exitCode=failed||chunk3Failed?1:0;
```
