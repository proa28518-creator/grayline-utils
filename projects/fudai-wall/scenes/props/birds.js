// AUTHORSHIP: Codex seat; brief: P11_MERGE_CHUNKS_BRIEF.md; date: 2026-11-23.
import { THREE, flat, part, finish } from '../../engine/props/_kit.js';
export const free=true;
export function build(o={}){const g=new THREE.Group(),n=o.n??7,m=flat('#30363a');for(let i=0;i<n;i++){const x=(i-(n-1)/2)*.16,b=part(new THREE.SphereGeometry(.055,6,5),m,.004);b.scale.set(1,.55,1);b.position.set(x,0,0);g.add(b);for(const s of [-1,1]){const w=part(new THREE.BufferGeometry(),m,.003);const v=new Float32Array([x,0,0,x+s*.16,.04,0,x+s*.13,.01,.015]);w.geometry.setAttribute('position',new THREE.BufferAttribute(v,3));w.geometry.computeVertexNormals();g.add(w);}}return finish(g);}
