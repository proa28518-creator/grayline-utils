import { THREE, flat, part, finish } from '../../engine/props/_kit.js';
export const free = true;
export function build(o = {}) {
 const h=o.h??15.5,j=o.jib??9,g=new THREE.Group(),steel=flat('#d2a94d','#8c6a32'),dark=flat('#62656a','#3c4147'),wood=flat('#a57b49','#755438');
 const box=(x,y,z,sx,sy,sz,m=steel)=>{const a=part(new THREE.BoxGeometry(sx,sy,sz),m,.014);a.position.set(x,y,z);g.add(a);return a;};
 const mastW=.72; for(const x of [-mastW/2,mastW/2])for(const z of [-mastW/2,mastW/2])box(x,h/2,z,.10,h,.10);
 for(let y=0;y<h;y+=1.25){for(const z of [-mastW/2,mastW/2])box(0,y+.625,z,mastW,.055,.055,dark);for(const x of [-mastW/2,mastW/2])box(x,y+.625,0,.055,.055,mastW,dark);const b1=part(new THREE.BoxGeometry(mastW*1.38,.045,.05),dark,.008);b1.position.set(0,y+.625,0);b1.rotation.z=Math.PI/4;g.add(b1);const b2=part(new THREE.BoxGeometry(mastW*1.38,.045,.05),dark,.008);b2.position.set(0,y+.625,0);b2.rotation.z=-Math.PI/4;g.add(b2);}
 box(j/2,h+.2,0,j,.28,.38);box(-1.35,h+.2,0,2.7,.24,.34);box(-1.6,h-.45,0,1.4,.8,.8,wood);
 const cable=part(new THREE.CylinderGeometry(.025,.025,3.2,6),dark,.008);cable.position.set(j-.2,h-1.55,0);g.add(cable);box(j-.2,h-3.3,0,.34,.42,.3,dark);
 const hook=part(new THREE.TorusGeometry(.16,.035,6,12,Math.PI*1.5),steel,.008);hook.position.set(j-.2,h-3.6,0);hook.rotation.z=Math.PI/2;g.add(hook);
 return finish(g);
}
