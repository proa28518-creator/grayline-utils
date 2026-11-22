import { THREE, flat, part, finish, rng } from '../../engine/props/_kit.js';
export const free = true;
export function build(o = {}) {
 const g=new THREE.Group(),r=rng(o.seed??1),gold=flat('#e9bd53','#a77b2d');
 for(let i=0;i<14;i++){const x=(r()-.5)*1.6,z=(r()-.5)*1.6,y=.08+r()*.28,coin=part(new THREE.CylinderGeometry(.22,.22,.075,12),gold,.012);coin.position.set(x,y,z);coin.rotation.x=(r()-.5)*.28;coin.rotation.z=(r()-.5)*.32;g.add(coin);}
 return finish(g);
}
