import { THREE, flat, basic, part, finish } from '../../engine/props/_kit.js';
export const free = true;
export function build(o = {}) {
  const w=o.w??90,h=o.h??18,gateW=o.gateW??7,g=new THREE.Group();
  const concrete=flat('#aaa9a2','#777a79'), panel=flat('#b9b6ac','#858681'), steel=flat('#46515a','#28323b'), iron=flat('#879093','#4a555c');
  const add=(geo,mat,x,y,z,iw=.018)=>{const m=part(geo,mat,iw);m.position.set(x,y,z);g.add(m);return m;};
  add(new THREE.BoxGeometry(w,h,1.15),concrete,0,h/2,0,.035);
  const panels=Math.floor(w/5);
  for(let i=0;i<panels;i++){const x=-w/2+2.5+i*5;add(new THREE.BoxGeometry(4.78,h-.25,1.18),panel,x,h/2,.02,.012);}
  add(new THREE.BoxGeometry(gateW,h-.12,.55),steel,0,(h-.12)/2,.62,.025);
  // cross bracing and gate frame
  for(const x of [-gateW/2,gateW/2]) add(new THREE.BoxGeometry(.18,h,.7),iron,x,h/2,.56,.018);
  add(new THREE.BoxGeometry(gateW,.18,.7),iron,0,.12,.56,.018);
  for(let y=1.2;y<h-1;y+=2.3){const beam=add(new THREE.BoxGeometry(gateW-.28,.12,.45),iron,0,y,.72,.012);beam.rotation.z=(Math.floor(y/2.3)%2?-.62:.62);}
  // emissive-like lantern boxes at both gate posts
  const glow=new THREE.MeshBasicMaterial({color:'#ffd27a'});
  for(const x of [-gateW/2-.45,gateW/2+.45]){add(new THREE.BoxGeometry(.48,.62,.45),iron,x,h*.72,.72,.015);const l=new THREE.Mesh(new THREE.BoxGeometry(.28,.36,.3),glow);l.position.set(x,h*.72,.98);g.add(l);}
  return finish(g);
}
