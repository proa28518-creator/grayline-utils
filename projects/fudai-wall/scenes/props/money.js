import { THREE, flat, part, finish, rng } from '../../engine/props/_kit.js';
export const free = true;
export function build(o = {}) {
 const g=new THREE.Group(),r=rng(o.seed??1),bill=flat('#b9cf91','#758957'),band=flat('#d7bd67','#94783d'),sack=flat('#b98a59','#79583d');
 for(let p=0;p<3;p++){const x=[-1,.15,1][p],z=[-.35,.35,-.2][p],n=3+Math.floor(r()*3);for(let i=0;i<n;i++){const m=part(new THREE.BoxGeometry(.95,.19,.55),bill,.012);m.position.set(x,(i+.5)*.2,z);g.add(m);const q=part(new THREE.BoxGeometry(.18,.195,.57),band,.006);q.position.set(x+.1,(i+.5)*.2,z);g.add(q);}}
 for(const [x,z] of [[-1.35,.65],[1.28,.65]]){const s=part(new THREE.SphereGeometry(.52,10,8),sack,.015);s.scale.set(1.1,.68,.9);s.position.set(x,.38,z);g.add(s);const neck=part(new THREE.CylinderGeometry(.18,.3,.27,8),sack,.012);neck.position.set(x,.78,z);g.add(neck);const tie=part(new THREE.TorusGeometry(.19,.045,6,10),band,.007);tie.position.set(x,.87,z);tie.rotation.x=Math.PI/2;g.add(tie);}
 return finish(g);
}
