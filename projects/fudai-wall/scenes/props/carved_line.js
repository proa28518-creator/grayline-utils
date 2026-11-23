// AUTHORSHIP: Codex seat; brief: P11_MERGE_CHUNKS_BRIEF.md; date: 2026-11-23.
import { THREE, flat, part, finish } from '../../engine/props/_kit.js';
export const free=true;
export function build(o={}){const len=o.length??3.6,r=Math.max(.01,Math.min(1,o.reveal??1)),g=new THREE.Group(),groove=part(new THREE.BoxGeometry(len*r,.045,.08),flat('#40382d','#292821'),.01);groove.position.z=.01;g.add(groove);const lip=part(new THREE.BoxGeometry(len*r,.08,.035),flat('#a58b68','#6a5945'),.006);lip.position.y=.035;g.add(lip);return finish(g);}
