import { THREE, flat, basic, part, finish } from '../../engine/props/_kit.js';
export const free = true;
export function build(o = {}) {
 const g=new THREE.Group(),wood=flat('#a87548','#65452f'),dark=flat('#704a32','#493226'),linen=flat('#d7c9a5','#a79b82'),mast=flat('#795531','#503b28'),gold=new THREE.MeshBasicMaterial({color:'#ffcf6b'});
 const add=(geo,mat,x,y,z,ry=0,rz=0,w=.018)=>{const m=part(geo,mat,w);m.position.set(x,y,z);m.rotation.set(0,ry,rz);g.add(m);return m;};
 add(new THREE.BoxGeometry(3.1,.42,1.05),wood,0,.18,0,0,0,.025);
 add(new THREE.BoxGeometry(2.8,.28,.88),dark,0,.02,0,0,0,.02);
 for(const x of [-1.25,-.62,0,.62,1.25])add(new THREE.BoxGeometry(.07,.48,1.14),wood,x,.2,0,0,0,.01);
 add(new THREE.CylinderGeometry(.055,.07,3.2,8),mast,-.25,1.72,0);
 // furled sail as a narrow rolled canvas bundle
 add(new THREE.CylinderGeometry(.12,.12,2.25,8),linen,-.25,2.2,0,0,0,0,.01);
 for(const y of [.72,2.15,3.25])add(new THREE.BoxGeometry(.09,.07,.11),dark,-.25,y,0);
 const l=new THREE.Mesh(new THREE.BoxGeometry(.18,.23,.18),gold);l.position.set(1.1,.52,0);g.add(l);
 return finish(g,{bow:[1.55,.2,0],mast:[-.25,3.3,0]});
}
