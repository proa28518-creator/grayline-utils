import { THREE, flat, basic, part, finish, canvasTex } from '../../engine/props/_kit.js';
export const free = true;
export function build(o = {}) {
 const h=o.h??.8,full=o.full??18,label=String(o.label??'15.5M'),g=new THREE.Group(),x=.32;
 const track=part(new THREE.BoxGeometry(.06,full,.05),flat('#d9ddd1'),.008);track.position.set(0,full/2,0);g.add(track);
 const glow=part(new THREE.BoxGeometry(.12,Math.max(.01,Math.min(h,full)),.08),basic('#ffd55c'),0);glow.position.set(0,Math.min(h,full)/2,.05);g.add(glow);
 const arrow=part(new THREE.ConeGeometry(.14,.25,4),basic('#ffe476'),0);arrow.position.set(0,Math.min(h,full),.05);g.add(arrow);
 const tex=canvasTex(320,100,(c,W,H)=>{c.fillStyle='#fff1a4';c.fillRect(0,0,W,H);c.fillStyle='#302d2b';c.font='bold 54px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(label,W/2,H/2);});
 const plate=part(new THREE.BoxGeometry(1.35,.42,.08),flat('#fff1a4'),.01);plate.position.set(x,full,0);g.add(plate);const face=new THREE.Mesh(new THREE.PlaneGeometry(1.25,.34),basic('#fff',{map:tex}));face.position.set(x,full,.046);g.add(face);
 return finish(g);
}
