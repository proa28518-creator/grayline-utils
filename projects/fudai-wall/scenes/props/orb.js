import { THREE, basic, finish } from '../../engine/props/_kit.js';
export const free = true;
export function build(o = {}) {
 const color=o.color??'#ffd27a',r=o.r??1.6,cx=o.cx??0,cy=o.cy??12,g=new THREE.Group();
 const halo=new THREE.Mesh(new THREE.CircleGeometry(r*1.55,48),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.16,side:THREE.DoubleSide,depthWrite:false}));halo.position.set(cx,cy,-.025);g.add(halo);
 const disc=new THREE.Mesh(new THREE.CircleGeometry(r,48),basic(color,{double:true}));disc.position.set(cx,cy,0);g.add(disc);
 return finish(g);
}
