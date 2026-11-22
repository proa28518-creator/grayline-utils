import { THREE, flat, part, finish } from '../../engine/props/_kit.js';
export const free = true;
export function build(o = {}) {
 const lift=Math.max(0,Math.min(1,o.lift??0)),w=7,h=17.88,drop=(1-lift)*h,g=new THREE.Group(),steel=flat('#7f9294','#4a6268'),brace=flat('#b4bdb7','#687b7d');
 const add=(geo,mat,x,y,z,rot=0)=>{const m=part(geo,mat,.025);m.position.set(x,y-drop,z);m.rotation.z=rot;g.add(m);};
 add(new THREE.BoxGeometry(w,h,.3),steel,0,h/2,0);
 for(const x of [-w/2,w/2])add(new THREE.BoxGeometry(.18,h+.2,.36),brace,x,h/2,0);
 for(let y=1;y<h;y+=2.2){add(new THREE.BoxGeometry(w,.1,.34),brace,0,y,0);const d=Math.hypot(w,h/8),a=part(new THREE.BoxGeometry(d,.12,.36),brace,.02);a.position.set(0,y+1.1-drop,0);a.rotation.z=Math.atan2(h/8,w);g.add(a);const b=part(new THREE.BoxGeometry(d,.12,.36),brace,.02);b.position.set(0,y+1.1-drop,0);b.rotation.z=-Math.atan2(h/8,w);g.add(b);}
 return finish(g);
}
