// Fudai own set: one shared anchor table drives staging, lighting, post and shade.
import { createLightRig } from '../world/look/lights.js';
import { createPost } from '../world/look/post.js';
import { createRigShade } from '../world/look/rigshade.js';
import { THREE, flat, basic, part, rng } from '../engine/props/_kit.js';

export const PLACES = {
  COAST_WALL: { at:[0,0,-16], bounds:{x:[-40,40],z:[-20,-12]}, sky:[.48,.59,.76], ground:[.42,.38,.31], fog:{color:'#c9d8df',density:.0035}, ao:{floor:0,h:1.8,amt:.28}, lights:[
    {id:'sun',kind:'sun',dir:[-.48,.35,.82],color:[1,.78,.52],power:1.05,wrap:.32},
    {id:'gate_l',kind:'point',pos:[-3.8,7.5,-14.6],color:[1,.62,.28],power:.9,fall:.08,range:15,wrap:.25},
    {id:'gate_r',kind:'point',pos:[3.8,7.5,-14.6],color:[1,.62,.28],power:.9,fall:.08,range:15,wrap:.25},
  ]},
  COAST_VILLAGE: { at:[0,0,2], bounds:{x:[-30,30],z:[-10,14]}, sky:[.48,.59,.76],ground:[.52,.43,.32],fog:{color:'#c9d8df',density:.0035},ao:{floor:0,h:1.8,amt:.28},lights:[
    {id:'sun',kind:'sun',dir:[-.48,.35,.82],color:[1,.78,.52],power:1.05,wrap:.32},
    {id:'windows',kind:'point',pos:[-7,2.1,1],color:[1,.67,.34],power:.35,fall:.12,range:12,wrap:.2},
    {id:'harbour',kind:'point',pos:[9,2.8,-5],color:[1,.7,.4],power:.45,fall:.1,range:16,wrap:.2},
  ]},
  SEA:{at:[0,0,-44],bounds:{x:[-60,60],z:[-70,-18]},sky:[.40,.56,.72],ground:[.16,.39,.53],fog:{color:'#aac8d4',density:.0025},ao:{floor:0,h:1,amt:.12},lights:[
    {id:'sun',kind:'sun',dir:[-.48,.35,.82],color:[1,.78,.52],power:1.0,wrap:.3},
    {id:'glitter',kind:'point',pos:[0,5,-42],color:[.55,.82,1],power:.75,fall:.025,range:45,wrap:.2},
  ]},
  NEIGHBOR_COAST:{at:[600,0,0],bounds:{x:[560,660],z:[-30,20]},sky:[.48,.59,.76],ground:[.43,.38,.31],fog:{color:'#c9d8df',density:.004},ao:{floor:0,h:1.8,amt:.25},lights:[{id:'sun',kind:'sun',dir:[-.48,.35,.82],color:[1,.78,.52],power:1,wrap:.3},{id:'windows',kind:'point',pos:[600,2,0],color:[1,.65,.35],power:.4,fall:.1,range:24}]},
  FLASHBACK_ROCK:{at:[1200,0,0],bounds:{x:[1160,1240],z:[-30,20]},sky:[.62,.46,.30],ground:[.36,.27,.19],fog:{color:'#b58a5d',density:.003},ao:{floor:0,h:2,amt:.3},lights:[{id:'sepia_sun',kind:'sun',dir:[-.5,.3,.8],color:[1,.68,.35],power:.9,wrap:.3}]},
  ROOM:{at:[1800,0,0],bounds:{x:[1796,1804],z:[-4,4]},sky:[.32,.25,.18],ground:[.28,.19,.12],fog:{color:'#4b3425',density:.002},ao:{floor:0,h:1.8,amt:.3},lights:[{id:'room_key',kind:'sun',dir:[-.4,.7,.5],color:[1,.68,.36],power:.85,wrap:.3},{id:'lamp',kind:'point',pos:[1800,2.8,1],color:[1,.57,.25],power:.7,fall:.12,range:8}]},
  HILL_GRAVE:{at:[2400,0,0],bounds:{x:[2360,2440],z:[-20,20]},sky:[.48,.55,.65],ground:[.28,.42,.24],fog:{color:'#b8c2be',density:.004},ao:{floor:0,h:1.8,amt:.3},lights:[{id:'low_sun',kind:'sun',dir:[-.7,.22,.45],color:[1,.7,.44],power:.8,wrap:.3}]},
};
const F={shore:flat('#d0b58b','#9c8260'),stone:flat('#89877e','#5f615e'),sand:flat('#d7c39b','#b19b72'),water:flat('#4e91aa','#28647f'),wood:flat('#9a7047','#61452f'),roof:flat('#78533b','#50382c'),plaster:flat('#d4b58b','#a78968'),dark:flat('#403a35','#292b2d'),green:flat('#71905a','#4c6c43'),metal:flat('#59656a','#37434a'),warm:basic('#ffd18a')};
function buildWorld(){
 const g=new THREE.Group(), R=rng(1122);
 const add=(geo,mat,x,y,z,ry=0,iw=.014)=>{const m=part(geo,mat,iw);m.position.set(x,y,z);m.rotation.y=ry;g.add(m);return m;};
 const box=(mat,x,y,z,w,h,d,ry=0)=>add(new THREE.BoxGeometry(w,h,d),mat,x,y,z,ry);
 const cylinder=(mat,x,y,z,r,h)=>add(new THREE.CylinderGeometry(r,r,h,10),mat,x,y,z);
 const wc=PLACES.COAST_WALL.at, vc=PLACES.COAST_VILLAGE.at, sc=PLACES.SEA.at;
 // One continuous land strip, apron at wall base, two gate practical posts.
 box(F.sand,0,-.15,-1,64,.3,40); box(F.shore,0,.02,wc[2]+2,86,.12,8); box(F.stone,0,.13,wc[2]+2,24,.24,4);
 for(const x of [-4.5,4.5]){box(F.dark,x,2.2,wc[2]+3,.38,4.4,.38);box(F.warm,x,4.2,wc[2]+3,.55,.62,.55);}
 // Village square and dense, deterministically varied small wooden houses.
 box(F.sand,vc[0],-.04,vc[2]+1,48,.08,24);
 const houses=[[-16,-5],[-10,-6],[-20,1],[-14,5],[-8,9],[8,-6],[14,-4],[20,1],[14,8],[6,10]];
 for(let i=0;i<houses.length;i++){const [dx,dz]=houses[i],x=vc[0]+dx,z=vc[2]+dz, w=3.5+R()*1.4,h=3.5+R()*1.15,d=3.1+R();
   box(F.plaster,x,h/2,z,w,h,d);add(new THREE.ConeGeometry(w*.78,1.25,4),F.roof,x,h+.62,z,Math.PI/4);box(F.dark,x-.7,1,z+d/2+.03,.7,1.8,.08);for(const wx of [-.9,.9])box(F.warm,x+wx,2.1,z+d/2+.05,.48,.55,.09);
   // yard clutter: crates, barrels, net frames and occasional cart.
   for(let j=0;j<2;j++)box(F.wood,x+(R()-.5)*4,.28,z+(R()-.5)*4,.55,.55,.55,R()*.4);
   cylinder(F.wood,x+1.5,.4,z+.5,.34,.8);
   if(i%2===0){box(F.metal,x-1.4,.55,z+2.2,1.8,.08,.1);for(let n=0;n<5;n++)box(F.dark,x-2+n*.3,.95,z+2.2,.025,.75,.025);}
   if(i%3===0){box(F.wood,x+2,.35,z+1.8,1.2,.12,.65);for(const wx of [x+1.55,x+2.45])cylinder(F.dark,wx,.16,z+1.8,.22,.18);}
 }
 // Town hall on south edge, square-facing facade and harbour edge with posts/lamps.
 const thx=vc[0],thz=vc[2]+12;box(F.plaster,thx,2.4,thz,7.2,4.8,4.8);add(new THREE.ConeGeometry(4.5,1.7,4),F.roof,thx,5.55,thz,Math.PI/4);box(F.dark,thx,1.45,thz+2.45,1.25,2.9,.12);
 for(let i=0;i<11;i++){const x=vc[0]-20+i*4;box(F.wood,x,.5,vc[2]-8,.17,1,.17);if(i%3===0){box(F.dark,x,2.05,vc[2]-8,.3,.5,.3);box(F.warm,x,2.05,vc[2]-7.8,.18,.32,.1);}}
 for(let i=0;i<8;i++){const x=vc[0]-18+i*5,z=vc[2]-9;box(F.wood,x,.2,z,.7,.4,.65);cylinder(F.dark,x+1,.34,z,.28,.68);}
 // Sea and a narrow sun-glitter ribbon; no set overlap with wall prop.
 const sea=box(F.water,sc[0],-.18,sc[2],116,.16,52);sea.userData.shimmer=true;
 box(F.water,0,-.08,-67,118,.08,3); // distant horizon strip
 // Distant place pads and one recognizable silhouette per place.
 const nc=PLACES.NEIGHBOR_COAST.at;box(F.sand,nc[0],-.12,nc[2],100,.24,48);box(F.stone,nc[0],6,nc[2]-10,24,12,.8);for(const x of [nc[0]-20,nc[0],nc[0]+20]){box(F.plaster,x,2.1,nc[2]+8,4,4.2,3.5);add(new THREE.ConeGeometry(2.8,1,4),F.roof,x,4.7,nc[2]+8);}
 const rc=PLACES.FLASHBACK_ROCK.at;box(F.sand,rc[0],-.12,rc[2],78,.24,48);add(new THREE.DodecahedronGeometry(9,0),F.stone,rc[0],5,rc[2]-5,0,.03);
 const ic=PLACES.ROOM.at;box(F.wood,ic[0],1.5,ic[2]-3,8,3, .35);box(F.plaster,ic[0],1.5,ic[2]+3,8,3,.35);
 const hc=PLACES.HILL_GRAVE.at;add(new THREE.SphereGeometry(19,20,10),F.green,hc[0],-5,hc[2],0,0);box(F.stone,hc[0],.8,hc[2],1.1,1.6,.35);
 g.traverse(m=>{m.frustumCulled=false;});return {group:g,sea};
}
export async function buildSet(THREEArg,scene,opts={},kit){
 const rig=createLightRig(THREE,PLACES), look=opts.post?createPost(THREE,rig,opts.post):undefined;
 if(look&&opts.post.shade)look.shading=createRigShade(THREE,rig,opts.post.shade);
 const {group,sea}=buildWorld();scene.add(group);
 const wall=PLACES.COAST_WALL.at,v=PLACES.COAST_VILLAGE.at,s=PLACES.SEA.at;
 const marks={wall_base:[PLACES.COAST_WALL.at[0],PLACES.COAST_WALL.at[2]],gate:[PLACES.COAST_WALL.at[0],PLACES.COAST_WALL.at[2]],square:[v[0],v[2]],townhall:[v[0],v[2]+12],harbour:[v[0],v[2]-8],boat_anchor:[s[0],s[2]+14]};
 return {group,marks,points:marks,rig,look,update(t){rig.update(t);sea.position.y=-.18+Math.sin(t*1.4)*.008;}};
}
