// Static staging audit for Fudai Wall, chunk 2. Pure Node; no renderer/deps.
// Geometry uses calibrated head centre y=1.9, r=.5, hip=1.35, top=2.4: phase-6
// engine measurement was ~1.85–1.95; F0 (target 1.55, dist 5.1, fov 34) passes
// and F687 (dist 2.9, fov 30) crops, consistent with this model and not y=1.55.
// Named assumptions: stage-dependent lowCams rests are unavailable, so the
// documented calibrated rest rule below is used. Camera roll is ignored (SH07
// is ≤5°). Face-limit clamping from the renderer is not applied. Box frustum
// corner counts use a world AABB after yaw rotation, per the audit specification.
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
function faceAt(id,t,p) {
  const a=acts[id]||{}, walks=(a.walk||[]).filter(w=>t>=w.t0);
  if(walks.length){const w=walks.at(-1), path=w.path;let rem=Math.max(0,t-w.t0)*(w.speed||1);
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
for(const x of [580,600,620])solids.push({name:`neighbour house @${x}`,min:[x-2.45,0,8-2.05],max:[x+2.45,5.6,8+2.05]});
function occs(t){const out=solids.map(b=>({...b}));out.push({name:'seawall',...box([0,9,-16],[90,18,1.15])});const g=props.find(p=>p.id==='gateleaf');if(g){const st=propState(g,t);if(st.visible)out.push({name:'gateleaf',...box(add(st.at,[0,17.88*(st.lift-.5),0]),[7,17.88,.36])});}return out;}
function propState(p,t){const ks=p.keys||[], before=ks.filter(k=>k.t<=t).sort((a,b)=>a.t-b.t), key=before.at(-1)||{};const lastField=f=>before.filter(k=>k[f]!=null).at(-1)?.[f];const visible=key.drop?true:(lastField('in')??p.in??'world')==='world';const at=[...(lastField('at')??p.at)],rot=[...(lastField('rot')??p.rot??[0,0,0])];
  const val=(field,def)=>{if(p[field]==null)return def;const keyed=before.filter(k=>k[field]!=null);if(!keyed.length)return p[field];const prev=keyed.at(-1),ix=keyed.length-1,ease=prev.ease;if(ease!=null&&ix>0){const prior=keyed[ix-1],u=clamp((t-prev.t)/ease);const sm=u*u*(3-2*u);return lerp(prior[field],prev[field],sm);}return prev[field];};
  return {visible,at,rot,page:val('page',0),h:val('h',.8),lift:val('lift',0),lineY:val('lineY',1),pin:val('pin',0),cx:val('cx',0),cy:val('cy',12)};}
function dropState(p,t){const k=(p.keys||[]).filter(k=>k.t<=t).at(-1);if(!k?.drop)return null;const d=k.drop,dt=t-k.t,g=d.g??9.8,v0=d.v0||[0,0,0],from=d.from||k.at||p.at,ground=d.ground??0,a=g/2,c=from[1]-ground,T=a>0?(v0[1]+Math.sqrt(v0[1]**2+4*a*Math.max(0,c)))/(2*a):Infinity;if(d.hide&&dt>T)return null;const u=Math.min(dt,T),y=from[1]+v0[1]*u-.5*g*u*u;return [from[0]+v0[0]*u,y,from[2]+v0[2]*u];}
function boxCheck(frame,b,minPx=0,skipOcc=false,name='subject'){const n=corners(b).filter(p=>frame.point(p)).length,center=frame.point(b.center),px=frame.height(b.size[1],b.center),pw=frame.width(b.size[0],b.center),by=!skipOcc?occluder(frame.cam.pos,b.center,currentTime,name):null,behind=frame.depth(b.center)<=0;return {pass:center&&!by&&px!=null&&px>=minPx&&(n>=4||px>=1920||pw>=1080),n,px,pw,center,occluded:by,behind};}
let currentTime=0;
function propBox(id,t){const p=props.find(x=>x.id===id);if(!p)return null;const s=propState(p,t);if(!s.visible)return null;const a=s.at,r=s.rot[1]||0,kind=p.kind;let B,points=[];
  if(kind==='sign')B=box(add(a,[0,1.25+(p.h||.8)/2,0]),[p.w||2,p.h||.8,.1],r);
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
const houseBoxes=[580,600,620].map(x=>box([x,2.1,8],[4,4.2,3.5]));
const wallBox=box([600,6,-10],[24,12,.8]);
const moments=[
 [219,7.3,'SH04'],[241,8.0333333333,'SH04'],[288,9.6,'SH05'],[345,11.5,'SH05'],[414,13.8,'SH05'],[474,15.8,'SH06'],[537,17.9,'SH07'],[570,19,'SH07'],[590,19.6666667,'SH07B'],[621,20.7,'SH08'],[639,21.3,'SH08'],[669,22.3,'SH09'],[687,22.9,'SH09'],[711,23.7,'SH10'],[723,24.1,'SH10'],[768,25.6,'SH11'],[798,26.6,'SH11'],[822,27.4,'SH11'],[870,29,'SH12']
];
function pointCheck(frame,p){return frame.point(p)&&!occluder(frame.cam.pos,p,currentTime);}
function screenVerticalSpan(frame, points){const ys=points.map(p=>frame.screen(p)).filter(p=>p!==null).map(p=>p[1]);return ys.length?Math.max(...ys)-Math.min(...ys):0;}
function faceCheck(frame,id,t,minPx=0){const p=posAt(id,t),head=[p[0],1.9,p[2]],f=faceAt(id,t,p),to=[frame.cam.pos[0]-p[0],frame.cam.pos[2]-p[2]],angle=Math.acos(clamp(dot(norm(f),norm(to)),-1,1))*180/Math.PI;const visible=frame.sphere(head,.5),occ=occluder(frame.cam.pos,head,t),px=frame.height(1,head);return {pass:angle<=60&&visible&&!occ&&px!=null&&px>=minPx,angle,visible,occ,px};}
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
 const face=(id,minPx=0)=>{const f=faceCheck(fr,id,t,minPx),behind=fr.depth([posAt(id,t)[0],1.9,posAt(id,t)[2]])<=0;checks.push(`${id} face ${f.pass?'PASS':'FAIL'} angle ${f.angle.toFixed(1)}° head ${behind?'behind camera':f.visible?'in':'out'} ${f.px?.toFixed(0)??'n/a'}px${f.occ?` occluded by ${f.occ}`:''}`);if(f.visible&&f.px>=230)occupancy=true;return f.pass;};
 const body=(id,b)=>{const ck=boxCheck(fr,b,0,true,id);return ck.pass;};
 const bodyIds=ids=>ids.filter(id=>{const p=posAt(id,t),b=box([p[0],1,p[2]],[.9,2,.5]);return body(id,b);});
 const point=(name,p)=>{const pass=pointCheck(fr,p),behind=fr.depth(p)<=0;checks.push(`${name} ${pass?'PASS':'FAIL'} point ${behind?'behind camera':pass?'in':'out'} frustum`);return pass;};
 switch(frameNo){
 case 219: face('mayor');{const n=bodyIds(['villager_1','villager_2','villager_3','villager_4','villager_5','villager_6','mocker_a','mocker_b','mocker_c']).length;checks.push(`BODY ${n>=2?'PASS':'FAIL'} ${n}/2`);}break;
 case 241: face('mayor');prop('popsign',60);{const n=bodyIds(['villager_1','villager_2','villager_3','villager_4','villager_5','villager_6','mocker_a','mocker_b','mocker_c']).length;checks.push(`BODY ${n>=2?'PASS':'FAIL'} ${n}/2`);}break;
 case 288: prop('crane_a',120)||prop('crane_b',120);prop('money',60);prop('moneysign',60);break;
 case 345: prop('calendar',120);checks.push(`calendar effPage ${propState(props.find(p=>p.id==='calendar'),t).page.toFixed(1)}${propState(props.find(p=>p.id==='calendar'),t).page>=5?' PASS':' FAIL'}`);prop('seawall_gate',200);break;
 case 414: prop('measure_plate',40);checks.push(`measure effH ${propState(props.find(p=>p.id==='measure'),t).h.toFixed(1)}${propState(props.find(p=>p.id==='measure'),t).h>=17?' PASS':' FAIL'}`);prop('calendar',120);checks.push(`calendar effPage ${propState(props.find(p=>p.id==='calendar'),t).page.toFixed(1)}${propState(props.find(p=>p.id==='calendar'),t).page>=10?' PASS':' FAIL'}`);checks.push(`gateleaf effLift ${propState(props.find(p=>p.id==='gateleaf'),t).lift.toFixed(2)}${propState(props.find(p=>p.id==='gateleaf'),t).lift>=.9?' PASS':' FAIL'}`);break;
 case 474: {const c=boxCheck(fr,wallBox,150,true,'neighbour wall');checks.push(`neighbour wall ${c.pass?'PASS':'FAIL'} ${c.px?.toFixed(0)??'n/a'}px corners ${c.n}/8`);if(c.center&&c.px>=230)occupancy=true;prop('sticker_a',60);prop('sticker_b',60);const n=houseBoxes.filter(b=>boxCheck(fr,b,0,true).pass).length;checks.push(`neighbour houses ${n>=1?'PASS':'FAIL'} ${n}/1`);break;}
 case 537: face('mocker_a',200);break;
 case 570: {const p=posAt('mocker_a',t),h=[p[0],1.9,p[2]],headIn=fr.point(h)&&fr.sphere(h,.5),headPx=fr.height(1,h);checks.push(`mocker_a head ${headIn?'PASS':'FAIL'} centre ${fr.depth(h)<=0?'behind camera':fr.point(h)?'in':'out'} frustum ${headPx==null?'n/a':headPx.toFixed(0)+'px'}`);if(headIn&&headPx>=230)occupancy=true;point('wall top',[3,18,-15.42]);break;}
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
if(raises.length){console.log('LOWCAMS raises:');for(const r of raises)console.log(`  ${r}`);}
console.log('FRAME | TIME | SHOT | RESULT | CHECKS');
let failed=0;
for(const r of results){const bad=r.checks.filter(x=>/FAIL| absent|do not occupy|out of grammar|camera inside/.test(x));if(bad.length)failed++;const shot=shotById(r.shotId),cam=shot&&camAt(shot,r.t);if(cam)console.log(`CAM F${r.frameNo} pos [${cam.pos.map(v=>v.toFixed(2)).join(', ')}] target [${cam.target.map(v=>v.toFixed(2)).join(', ')}] fov ${cam.fov.toFixed(2)}`);console.log(`F${r.frameNo} | ${r.t.toFixed(2)} | ${r.shotId} | ${bad.length?'FAIL':'PASS'} | ${r.checks.join('; ')}`);}
console.log(`${failed?`FAIL (${failed}/19 moments)`:'PASS (19/19 moments)'}`);
process.exitCode=failed?1:0;
