// AUTHORSHIP: Codex seat; brief: P11_MERGE_CHUNKS_BRIEF.md; date: 2026-11-23.
import { THREE, flat, part, finish } from '../../engine/props/_kit.js';
export const free=true;
export function build(o={}){const p=Math.max(0,Math.min(1,o.progress??0)),g=new THREE.Group(),wood=flat('#806043','#553c2d'),wet=flat('#999d99','#6b706f');for(const x of [-6,6]){const s=part(new THREE.BoxGeometry(.14,1,.14),wood,.01);s.position.set(x,.5,0);g.add(s);}const fill=part(new THREE.BoxGeometry(11.8,Math.max(.01,p),3.0),wet,.02);fill.position.y=p/2;g.add(fill);return finish(g);}
