// AUTHORSHIP: Codex seat; brief: P11_MERGE_CHUNKS_BRIEF.md; date: 2026-11-23.
import { THREE, flat, part, finish } from '../../engine/props/_kit.js';
export const free=true;
export function build(){const g=new THREE.Group(),stem=flat('#526b43'),white=flat('#f2ead6'),yellow=flat('#e3bf55');for(let i=0;i<5;i++){const a=i*Math.PI*2/5,x=Math.cos(a)*.16,z=Math.sin(a)*.14,s=part(new THREE.CylinderGeometry(.012,.018,.32,5),stem,.003);s.position.set(x,.16,z);s.rotation.z=.5*Math.cos(a);g.add(s);const bloom=part(new THREE.SphereGeometry(.1,7,5),i%2?white:yellow,.003);bloom.position.set(x,.36,z);bloom.scale.set(1,.65,1);g.add(bloom);}const wrap=part(new THREE.ConeGeometry(.28,.3,6),flat('#d6c9a8','#9b8e73'),.004);wrap.position.y=.12;wrap.rotation.x=Math.PI;g.add(wrap);return finish(g);}
