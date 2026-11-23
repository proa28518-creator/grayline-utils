// AUTHORSHIP: Codex seat; brief: P11_MERGE_CHUNKS_BRIEF.md; date: 2026-11-23.
import { THREE, flat, part, finish } from '../../engine/props/_kit.js';
export const free=true;
export function build(o={}){const g=new THREE.Group(),n=Math.max(1,Math.round(18*(o.intensity??0))),foam=flat('#e2eee9','#a9c6c5'),lift=o.lift??0;for(let i=0;i<n;i++){const x=((i%9)-4)*2.7,y=(Math.floor(i/9))*1.1+lift*.45,r=.25+(i%3)*.12,p=part(new THREE.SphereGeometry(r,7,5),foam,.003);p.scale.y=1.2;p.position.set(x,y,0);g.add(p);}return finish(g);}
